import csv
import io
import json
import os
import tempfile
import zipfile
from sorted_containers import SortedList

import functions_framework
import requests
from google.cloud import bigquery


ABSMARTLY_API_URL = os.environ["ABSMARTLY_API_URL"]  # e.g. https://your-subdomain.absmartly.io
ABSMARTLY_API_KEY = os.environ["ABSMARTLY_API_KEY"]
BIGQUERY_DATASET = os.environ["BIGQUERY_DATASET"]  # e.g. absmartly
BIGQUERY_TABLE = os.environ["BIGQUERY_TABLE"]  # e.g. experiment_exports


@functions_framework.http
def handle_webhook(request):
    """Cloud Function entry point for the ExperimentDataExportReady webhook."""
    if request.method != "POST":
        return ("Method not allowed", 405)

    payload = request.get_json(silent=True)
    if not payload:
        return ("Bad request: missing JSON body", 400)

    if payload.get("event_name") != "ExperimentDataExportReady":
        return ("Ignored: not an ExperimentDataExportReady event", 200)

    metadata = payload.get("metadata")
    if not metadata:
        return ("Bad request: missing metadata", 400)

    download_url = metadata.get("download_url")
    if not download_url:
        return ("Bad request: missing download_url in metadata", 400)

    zip_bytes = download_export(download_url)
    csv_files = extract_and_sort_csvs(zip_bytes)
    rows_loaded = load_csvs_into_bigquery(csv_files)

    return (json.dumps({
        "status": "ok",
        "files_processed": len(csv_files),
        "rows_loaded": rows_loaded,
    }), 200, {"Content-Type": "application/json"})


def download_export(download_url: str) -> bytes:
    """Download the export ZIP file from the ABsmartly API."""
    url = f"{ABSMARTLY_API_URL.rstrip('/')}{download_url}"
    response = requests.get(url, headers={"Authorization": f"Api-Key {ABSMARTLY_API_KEY}"})
    response.raise_for_status()
    return response.content


def extract_and_sort_csvs(zip_bytes: bytes) -> list[tuple[str, bytes]]:
    """Extract CSV files from a ZIP archive and return them sorted by name.

    Exports with more than 5 million rows are split into multiple CSVs.
    Sorting by filename preserves the original row order across files.
    """
    csv_files = []
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for name in zf.namelist():
            if name.lower().endswith(".csv"):
                csv_files.append((name, zf.read(name)))
    csv_files.sort(key=lambda entry: entry[0])
    return csv_files


def load_csvs_into_bigquery(csv_files: list[tuple[str, bytes]]) -> int:
    """Load CSV files into BigQuery in order, return total rows loaded."""
    client = bigquery.Client()
    table_ref = f"{client.project}.{BIGQUERY_DATASET}.{BIGQUERY_TABLE}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        autodetect=True,
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
    )

    total_rows = 0
    for filename, content in csv_files:
        load_job = client.load_table_from_file(
            io.BytesIO(content),
            table_ref,
            job_config=job_config,
        )
        load_job.result()  # wait for completion
        total_rows += load_job.output_rows
        print(f"Loaded {load_job.output_rows} rows from {filename}")

    print(f"Total: {total_rows} rows loaded into {table_ref}")
    return total_rows
