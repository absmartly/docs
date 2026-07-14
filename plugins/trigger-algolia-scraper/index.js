const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const onSuccess = async ({ utils }) => {
  if (process.env.CONTEXT !== "production") {
    console.log("Skipping Algolia scraper trigger — not a production deploy.");
    return;
  }

  const token = process.env.GITHUB_PAT;
  if (!token) {
    utils.build.failPlugin("GITHUB_PAT environment variable is not set.");
    return;
  }

  console.log("Triggering Algolia scraper workflow...");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `GitHub API unreachable (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}. Retrying...`,
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      utils.build.failPlugin(
        `Could not reach the GitHub API after ${MAX_ATTEMPTS} attempts.`,
        { error },
      );
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
    const transient = response.status === 429 || response.status >= 500;
    if (transient && attempt < MAX_ATTEMPTS) {
      console.warn(
        `GitHub API returned ${response.status} (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying...`,
        body,
      );
      await sleep(RETRY_DELAY_MS);
      continue;
    }

    console.error(
      `Failed to trigger Algolia scraper: ${response.status} ${response.statusText}`,
      body,
    );
    utils.build.failPlugin(
      `GitHub API responded with status ${response.status}. See build log for details.`,
    );
    return;
  }
};
