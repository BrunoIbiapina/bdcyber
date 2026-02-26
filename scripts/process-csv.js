const { readFileSync, writeFileSync, mkdirSync } = require("fs");

// Try multiple possible paths
const paths = [
  "scripts/raw-data.csv",
  "./scripts/raw-data.csv",
  "/vercel/share/v0-project/scripts/raw-data.csv",
  "raw-data.csv",
];
let csvPath = null;
for (const p of paths) {
  try {
    readFileSync(p, { encoding: "utf8", flag: "r" }).slice(0, 10);
    csvPath = p;
    console.log("Found CSV at:", p);
    break;
  } catch { /* try next */ }
}
if (!csvPath) {
  console.log("CWD:", process.cwd());
  const { readdirSync } = require("fs");
  try { console.log("CWD files:", readdirSync(process.cwd()).join(", ")); } catch(e) { console.log("Cannot read CWD:", e.message); }
  try { console.log("Scripts files:", readdirSync("/vercel/share/v0-project/scripts").join(", ")); } catch(e) { console.log("Cannot read scripts:", e.message); }
  throw new Error("CSV file not found in any known path");
}
const outPath = "/vercel/share/v0-project/lib/real-data.json";

// CSV Parser that handles quoted multiline fields
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;
  let headerEnd = text.indexOf("\n");
  const headers = text.slice(0, headerEnd).trim().split(",");
  i = headerEnd + 1;

  while (i < len) {
    const row = [];
    for (let col = 0; col < headers.length; col++) {
      if (i >= len) { row.push(""); continue; }
      if (text[i] === '"') {
        i++;
        let val = "";
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') { val += '"'; i += 2; }
            else { i++; break; }
          } else { val += text[i]; i++; }
        }
        row.push(val);
        if (i < len && text[i] === ",") i++;
        else if (i < len && (text[i] === "\n" || text[i] === "\r")) {
          if (text[i] === "\r" && i + 1 < len && text[i + 1] === "\n") i += 2;
          else i++;
        }
      } else {
        let val = "";
        while (i < len && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") { val += text[i]; i++; }
        row.push(val);
        if (i < len && text[i] === ",") i++;
        else if (i < len && (text[i] === "\n" || text[i] === "\r")) {
          if (text[i] === "\r" && i + 1 < len && text[i + 1] === "\n") i += 2;
          else i++;
        }
      }
    }
    if (row.length >= 5 && row[0]) rows.push(row);
  }
  return { headers, rows };
}

console.log("Reading CSV...");
const raw = readFileSync(csvPath, "utf-8");
console.log("CSV size: " + (raw.length / 1024 / 1024).toFixed(1) + " MB");

const { headers, rows } = parseCSV(raw);
console.log("Parsed " + rows.length + " rows, " + headers.length + " columns");
console.log("Headers:", headers.join(", "));

// Column indices
const COL = {};
headers.forEach((h, i) => { COL[h.trim()] = i; });

const TS = COL["Timestamp"];
const SRC_IP = COL["Source IP Address"];
const DST_IP = COL["Destination IP Address"];
const SRC_PORT = COL["Source Port"];
const DST_PORT = COL["Destination Port"];
const PROTOCOL = COL["Protocol"];
const PKT_LEN = COL["Packet Length"];
const PKT_TYPE = COL["Packet Type"];
const TRAFFIC = COL["Traffic Type"];
const MALWARE = COL["Malware Indicators"];
const ANOMALY = COL["Anomaly Scores"];
const ALERTS = COL["Alerts/Warnings"];
const ATTACK_TYPE = COL["Attack Type"];
const ATTACK_SIG = COL["Attack Signature"];
const ACTION = COL["Action Taken"];
const SEVERITY = COL["Severity Level"];
const USER_INFO = COL["User Information"];
const DEVICE = COL["Device Information"];
const SEGMENT = COL["Network Segment"];
const GEO = COL["Geo-location Data"];
const LOG_SRC = COL["Log Source"];

const totalEvents = rows.length;
const protocolCount = {};
const attackTypeCount = {};
const severityCount = {};
const actionCount = {};
const segmentCount = {};
const trafficTypeCount = {};
const packetTypeCount = {};
const logSourceCount = {};
const attackSigCount = {};
const monthlyEvents = {};
const monthlySeverity = {};
let anomalySum = 0, anomalyCount = 0, anomalyMax = 0;
const anomalyBuckets = { "0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0 };
let alertTriggered = 0, iocDetected = 0;
let pktLenSum = 0, pktLenCount = 0;
const uniqueSrcIPs = new Set();
const uniqueDstIPs = new Set();
const srcIPCount = {};
const geoCount = {};

const sampleIndices = new Set();
const step = Math.max(1, Math.floor(rows.length / 500));
for (let s = 0; s < rows.length; s += step) sampleIndices.add(s);
const sampleRows = [];

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  const timestamp = (row[TS] || "").trim();
  const protocol = (row[PROTOCOL] || "Unknown").trim();
  const attackType = (row[ATTACK_TYPE] || "None").trim();
  const severity = (row[SEVERITY] || "Unknown").trim();
  const action = (row[ACTION] || "Unknown").trim();
  const segment = (row[SEGMENT] || "Unknown").trim();
  const trafficType = (row[TRAFFIC] || "Unknown").trim();
  const packetType = (row[PKT_TYPE] || "Unknown").trim();
  const logSource = (row[LOG_SRC] || "Unknown").trim();
  const attackSig = (row[ATTACK_SIG] || "Unknown").trim();
  const anomalyScore = parseFloat(row[ANOMALY]) || 0;
  const pktLen = parseInt(row[PKT_LEN]) || 0;
  const alert = (row[ALERTS] || "").trim();
  const malware = (row[MALWARE] || "").trim();
  const srcIP = (row[SRC_IP] || "").trim();
  const dstIP = (row[DST_IP] || "").trim();
  const geo = (row[GEO] || "").trim();

  protocolCount[protocol] = (protocolCount[protocol] || 0) + 1;
  attackTypeCount[attackType] = (attackTypeCount[attackType] || 0) + 1;
  severityCount[severity] = (severityCount[severity] || 0) + 1;
  actionCount[action] = (actionCount[action] || 0) + 1;
  segmentCount[segment] = (segmentCount[segment] || 0) + 1;
  trafficTypeCount[trafficType] = (trafficTypeCount[trafficType] || 0) + 1;
  packetTypeCount[packetType] = (packetTypeCount[packetType] || 0) + 1;
  logSourceCount[logSource] = (logSourceCount[logSource] || 0) + 1;
  attackSigCount[attackSig] = (attackSigCount[attackSig] || 0) + 1;

  if (anomalyScore > 0) {
    anomalySum += anomalyScore;
    anomalyCount++;
    if (anomalyScore > anomalyMax) anomalyMax = anomalyScore;
    if (anomalyScore < 20) anomalyBuckets["0-20"]++;
    else if (anomalyScore < 40) anomalyBuckets["20-40"]++;
    else if (anomalyScore < 60) anomalyBuckets["40-60"]++;
    else if (anomalyScore < 80) anomalyBuckets["60-80"]++;
    else anomalyBuckets["80-100"]++;
  }

  if (alert === "Alert Triggered") alertTriggered++;
  if (malware === "IoC Detected") iocDetected++;
  if (pktLen > 0) { pktLenSum += pktLen; pktLenCount++; }
  if (srcIP) { uniqueSrcIPs.add(srcIP); srcIPCount[srcIP] = (srcIPCount[srcIP] || 0) + 1; }
  if (dstIP) uniqueDstIPs.add(dstIP);

  if (geo) {
    const state = geo.split(",").pop().trim() || geo;
    geoCount[state] = (geoCount[state] || 0) + 1;
  }

  if (timestamp) {
    const month = timestamp.slice(0, 7);
    monthlyEvents[month] = (monthlyEvents[month] || 0) + 1;
    if (!monthlySeverity[month]) monthlySeverity[month] = { Low: 0, Medium: 0, High: 0 };
    if (severity === "Low" || severity === "Medium" || severity === "High") {
      monthlySeverity[month][severity]++;
    }
  }

  if (sampleIndices.has(r)) {
    sampleRows.push({
      id: "EVT-" + String(r + 1).padStart(5, "0"),
      date: timestamp,
      srcIp: srcIP,
      dstIp: dstIP,
      srcPort: parseInt(row[SRC_PORT]) || 0,
      dstPort: parseInt(row[DST_PORT]) || 0,
      protocol: protocol,
      packetLength: pktLen,
      packetType: packetType,
      trafficType: trafficType,
      attackType: attackType,
      attackSignature: attackSig,
      severity: severity,
      action: action,
      anomalyScore: anomalyScore,
      segment: segment,
      geo: geo,
      logSource: logSource,
      malwareIndicator: malware,
      alert: alert,
      user: (row[USER_INFO] || "").trim(),
      device: (row[DEVICE] || "").trim().slice(0, 60),
    });
  }
}

const timeSeries = Object.entries(monthlyEvents)
  .sort(function(a, b) { return a[0].localeCompare(b[0]); })
  .map(function(entry) {
    const month = entry[0], count = entry[1];
    return {
      month: month,
      total: count,
      low: (monthlySeverity[month] && monthlySeverity[month].Low) || 0,
      medium: (monthlySeverity[month] && monthlySeverity[month].Medium) || 0,
      high: (monthlySeverity[month] && monthlySeverity[month].High) || 0,
    };
  });

const topSrcIPs = Object.entries(srcIPCount)
  .sort(function(a, b) { return b[1] - a[1]; })
  .slice(0, 10)
  .map(function(e) { return { ip: e[0], count: e[1] }; });

const topGeos = Object.entries(geoCount)
  .sort(function(a, b) { return b[1] - a[1]; })
  .slice(0, 10)
  .map(function(e) { return { location: e[0], count: e[1] }; });

const output = {
  summary: {
    totalEvents: totalEvents,
    uniqueSrcIPs: uniqueSrcIPs.size,
    uniqueDstIPs: uniqueDstIPs.size,
    alertsTriggered: alertTriggered,
    iocDetected: iocDetected,
    avgAnomalyScore: anomalyCount > 0 ? Math.round((anomalySum / anomalyCount) * 100) / 100 : 0,
    maxAnomalyScore: Math.round(anomalyMax * 100) / 100,
    avgPacketLength: pktLenCount > 0 ? Math.round(pktLenSum / pktLenCount) : 0,
  },
  distributions: {
    protocol: protocolCount,
    attackType: attackTypeCount,
    severity: severityCount,
    action: actionCount,
    segment: segmentCount,
    trafficType: trafficTypeCount,
    packetType: packetTypeCount,
    logSource: logSourceCount,
    attackSignature: attackSigCount,
    anomalyBuckets: anomalyBuckets,
  },
  timeSeries: timeSeries,
  topSrcIPs: topSrcIPs,
  topGeos: topGeos,
  sampleRows: sampleRows,
};

writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
console.log("Output written to " + outPath);
console.log("Summary:", JSON.stringify(output.summary, null, 2));
console.log("Time series months: " + timeSeries.length);
console.log("Sample rows: " + sampleRows.length);
console.log("Done!");
