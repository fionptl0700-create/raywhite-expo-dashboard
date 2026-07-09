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

// Quote-aware CSV parser (handles commas/newlines inside quoted fields, e.g. "NT$280,000",
// and doubled-quote escaping ""). Replaces the old naive line.split(",") which mis-aligned
// every column after the first quoted, comma-containing money value in a row.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cur);
        cur = "";
      } else if (ch === "\n") {
        row.push(cur);
        cur = "";
        rows.push(row);
        row = [];
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  return rows.filter(r => !(r.length === 1 && r[0].trim() === ""));
}

function csvToRows(csv) {
  const table = parseCsv(csv.trim());

  if (table.length === 0) {
    return [];
  }

  const headers = table[0].map(h => h.trim());

  return table.slice(1).map(values => {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] !== undefined ? values[index] : "").trim();
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
