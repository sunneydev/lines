import { Volume, createFsFromVolume } from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import dotenv from "dotenv";
import _ from "lodash";
import { updateMe } from "./gh";
import { Languages } from "./consts";

dotenv.config();
const vol = new Volume();
const fs = createFsFromVolume(vol);

const TOKEN = process.env.GITHUB_API_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

if (!TOKEN) {
  console.error("Please provide a GitHub API token");
  process.exit(1);
} else if (!USERNAME) {
  console.error("Please provide a GitHub username");
  process.exit(1);
}

const getRepositoryNames = async () => {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&affiliation=owner",
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  const repos = await res.json();

  return repos.map((repo: any) => repo.name) as string[];
};

const recursiveRead = (
  dir: string,
  include?: string[],
  paths: string[] = []
) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (include?.some((ext) => file.toString().endsWith(`.${ext}`))) {
      paths.push(`${dir}/${file}`);
    }

    const path = `${dir}/${file}`;

    if (fs.statSync(path).isDirectory()) {
      recursiveRead(path, include, paths);
    }
  }

  return paths;
};

const countRepoLines = async (repoName: string) => {
  const dir = `/${repoName}`;

  console.log(`Cloning ${repoName}...`);

  await git.clone({
    fs,
    http,
    dir,
    url: `https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${repoName}`,
    singleBranch: true,
    depth: 1,
  });

  const files = recursiveRead(
    dir,
    Languages.map((l) => l.extension)
  );

  const amountOfLines = files.reduce((acc, file) => {
    if (file.startsWith(".")) return acc;

    if (fs.statSync(file).isDirectory()) return acc;

    const content = fs.readFileSync(file).toString();
    const extension = file.split(".").pop();

    if (!extension || extension === file) return acc;

    acc[extension] = acc[extension]
      ? acc[extension] + content.split("\n").length
      : content.split("\n").length;

    return acc;
  }, {} as { [key: string]: number });

  return { amountOfLines, files };
};

const main = async () => {
  const repoNames = await getRepositoryNames();

  const chunks = repoNames.map(async (repoName) => {
    const { amountOfLines } = await countRepoLines(repoName);

    return { repoName, amountOfLines };
  });

  const results = await Promise.all(chunks);

  const totalLinesByExtension = results.reduce((acc, result) => {
    Object.keys(result.amountOfLines).forEach((extension) => {
      acc[extension] = acc[extension]
        ? acc[extension] + result.amountOfLines[extension]
        : result.amountOfLines[extension];
    });

    return acc;
  }, {} as { [key: string]: number });

  const languages = Object.keys(totalLinesByExtension)
    .map((extension) => {
      const language = Languages.find((l) => l.extension === extension);

      if (!language) {
        console.error(`No language found for extension ${extension}`);
        process.exit(1);
      }

      return {
        ...language,
        count:
          totalLinesByExtension[
            extension as keyof typeof totalLinesByExtension
          ],
      };
    })
    .sort((a, b) => b.count - a.count);

  updateMe(
    `# I've written total of ${Intl.NumberFormat().format(
      _.sum(languages.map((l) => l.count))
    )} lines of code in ${languages.length} languages

${languages
  .map(
    (l) =>
      `### <img align="center" src="${
        l.icon
      }" width="35" height="35" /> **${Intl.NumberFormat().format(
        l.count
      )} lines** of ${l.name} `
  )
  .join("\n")}



#### Checked over ${repoNames.length} private/public repositories

> Generated by [lines](https://github.com/sunneydev/lines)
`,
    USERNAME,
    TOKEN
  );
};

main().then(() => console.log("Done"));
