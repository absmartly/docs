#!/usr/bin/env bash
set -euo pipefail

DOCS_DIR="$(pwd)"

if [ -z "${ABS_REPO_ACCESS_TOKEN:-}" ]; then
  echo "No ABS_REPO_ACCESS_TOKEN set, skipping Office API spec generation"
  exit 0
fi

REPO_DIR=$(mktemp -d)
trap "rm -rf $REPO_DIR" EXIT

echo "Cloning absmartly/abs..."
git clone --no-checkout \
  "https://x-access-token:${ABS_REPO_ACCESS_TOKEN}@github.com/absmartly/abs.git" \
  "$REPO_DIR"

cd "$REPO_DIR"

# TODO: Once tsoa is in a release branch, switch to auto-detecting latest release:
# LATEST=$(git branch -r \
#   | sed 's|origin/||; s/^[[:space:]]*//' \
#   | grep -E '^release/[0-9]+-[0-9]+$' \
#   | sed 's|release/||' \
#   | sort -t'-' -k1,1rn -k2,2rn \
#   | head -1)
# BRANCH="release/$LATEST"
BRANCH="vk/d96f-migrate-one-set"
echo "Using branch: $BRANCH"

git sparse-checkout set office/backend office/shared
git checkout "$BRANCH"

cd office/shared/lib
npm ci
cd ../../backend
npm ci --ignore-scripts
npx tsoa spec

cp src/generated/openapi.json "${DOCS_DIR}/office-api-spec.json"
echo "Office API spec generated successfully from $BRANCH"
