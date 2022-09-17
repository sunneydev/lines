import { Volume, createFsFromVolume } from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import _ from "lodash";

const vol = new Volume();
const fs = createFsFromVolume(vol);

const getRepositoryNames = async () => {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&affiliation=owner",
    {
      headers: {
        Authorization: "Bearer <token>",
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
    url: `https://<username>:<token>@github.com/<username>/${repoName}`,
    singleBranch: true,
    depth: 1,
  });

  const files = recursiveRead(dir, [
    "js",
    "ts",
    "tsx",
    "jsx",
    "html",
    "css",
    "py",
    "go",
    "dart",
    "cs",
  ]);

  const amountOfLines = files.reduce(
    (acc, file) => {
      if (file.startsWith(".")) return acc;

      if (fs.statSync(file).isDirectory()) return acc;

      const content = fs.readFileSync(file).toString();
      const extension = file.split(".").pop();

      if (!extension || extension === file) return acc;

      acc[extension] = acc[extension]
        ? acc[extension] + content.split("\n").length
        : content.split("\n").length;

      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

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

  const totalLines = _.sum(Object.values(totalLinesByExtension));

  console.log("Total lines by extension:", totalLinesByExtension);
  console.log("Total lines:", totalLines);
};

main().then(() => console.log("Done"));
