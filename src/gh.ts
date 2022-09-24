export const updateMe = async (
  content: string,
  username: string,
  token: string,
) =>
  fetch(
    `https://api.github.com/repos/${username}/${username}/contents/README.md`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: "Update README.md",
        content: Buffer.from(content).toString("base64"),
        sha: await getFileSha(username, token),
      }),
    }
  ).then((res) =>
    res.ok
      ? console.log("Updated README.md")
      : res
          .json()
          .then((json) =>
            console.error(`Failed to update README.md. ${JSON.stringify(json)}`)
          )
  );

export const getFileSha = async (username: string, token: string) =>
  fetch(
    `https://api.github.com/repos/${username}/${username}/contents/README.md`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((res) => res.json().then((json) => json.sha));
