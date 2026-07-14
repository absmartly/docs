export const onSuccess = async ({ utils }) => {
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

  let response;
  try {
    response = await fetch(
      "https://api.github.com/repos/absmartly/docs/actions/workflows/algolia.yml/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ ref: "master" }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch (error) {
    console.error("Failed to reach the GitHub API:", error.message);
    utils.status.show({
      title: "Algolia scraper trigger failed",
      summary: `Could not reach the GitHub API: ${error.message}`,
    });
    return;
  }

  if (response.ok) {
    console.log("Algolia scraper workflow dispatched successfully.");
    utils.status.show({
      title: "Algolia scraper triggered",
      summary: "The Algolia DocSearch scraper workflow has been dispatched.",
    });
    return;
  }

  const body = (await response.text()).slice(0, 200).replace(/\s+/g, " ");
  console.error(
    `Failed to trigger Algolia scraper: ${response.status} ${response.statusText}`,
    body,
  );
  utils.status.show({
    title: "Algolia scraper trigger failed",
    summary: `GitHub API responded with ${response.status} ${response.statusText}.`,
  });
};
