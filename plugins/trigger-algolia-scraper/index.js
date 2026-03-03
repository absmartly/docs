export const onSuccess = async function ({ utils }) {
  if (process.env.CONTEXT !== "production") {
    console.log("Skipping Algolia scraper trigger — not a production deploy.");
    return;
  }

  const token = process.env.GITHUB_PAT;
  if (!token) {
    utils.status.show({
      title: "Algolia scraper trigger skipped",
      summary: "GITHUB_PAT environment variable is not set.",
    });
    return;
  }

  console.log("Triggering Algolia scraper workflow...");

  const response = await fetch(
    "https://api.github.com/repos/absmartly/docs/actions/workflows/algolia.yml/dispatches",
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ ref: "master" }),
    },
  );

  if (response.ok || response.status === 204) {
    console.log("Algolia scraper workflow dispatched successfully.");
    utils.status.show({
      title: "Algolia scraper triggered",
      summary: "The Algolia DocSearch scraper workflow has been dispatched.",
    });
    return;
  }

  const body = await response.text();
  console.error(
    `Failed to trigger Algolia scraper: ${response.status} ${response.statusText}`,
    body,
  );
  utils.status.show({
    title: "Algolia scraper trigger failed",
    summary: `GitHub API responded with ${response.status}: ${body}`,
  });
};
