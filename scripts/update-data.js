const fs = require("fs");

const ACTIVITY_CSV_URL = process.env.ACTIVITY_CSV_URL;
const SALES_CSV_URL = process.env.SALES_CSV_URL;
const OFFICIAL_SITE_URL = process.env.OFFICIAL_SITE_URL;

async function fetchText(url, label) {
  if (!url) {
    throw new Error(`${label} URL is missing`);
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${label} fetch failed: ${res.status}`);
  }

  return await res.text();
}

function csvToRows(csv) {
  const lines = csv.trim().split(/\r?\n/);

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

async function main() {
  const activityCsv = await fetchText(ACTIVITY_CSV_URL, "Activity sheet");
  const salesCsv = await fetchText(SALES_CSV_URL, "Sales sheet");

  let officialSiteHtml = "";

  if (OFFICIAL_SITE_URL) {
    officialSiteHtml = await fetchText(OFFICIAL_SITE_URL, "Official site");
  }

  const data = {
    updatedAt: new Date().toISOString(),
    sources: {
      activitySheet: "ACTIVITY_CSV_URL",
      salesSheet: "SALES_CSV_URL",
      officialSite: OFFICIAL_SITE_URL ? "OFFICIAL_SITE_URL" : null
    },
    activityRows: csvToRows(activityCsv),
    salesRows: csvToRows(salesCsv),
    officialSiteSnapshot: officialSiteHtml.slice(0, 5000)
  };

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf8");

  console.log("data.json updated successfully");
  console.log(`Activity rows: ${data.activityRows.length}`);
  console.log(`Sales rows: ${data.salesRows.length}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
