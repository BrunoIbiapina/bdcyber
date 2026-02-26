import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dirname, "raw-data.csv");
const outPath = join(__dirname, "..", "lib", "real-data.json");

// ---- CSV Parser that handles quoted multiline fields ----
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;

  // Read header
  let headerEnd = text.indexOf("\n");
  const headers = text.slice(0, headerEnd).trim().split(",");

  i = headerEnd + 1;

  while (i < len) {
    const row = [];
    for (let col = 0; col < headers.length; col++) {
      if (i >= len) { row.push(""); continue; }
      if (text[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        let val = "";
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') {
              val += '"'; i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            val += text[i]; i++;
          }
        }
        row.push(val);
        if (i < len && text[i] === ",") i++; // skip comma
        else if (i < len && (text[i] === "\n" || text[i] === "\r")) {
          if (text[i] === "\r" && i + 1 < len && text[i + 1] === "\n") i += 2;
          else i++;
        }
      } else {
        // Unquoted field
        let val = "";
        while (i < len && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
          val += text[i]; i++;
        }
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
console.log(`CSV size: ${(raw.length / 1024 / 1024).toFixed(1)} MB`);

const { headers, rows } = parseCSV(raw);
console.log(`Parsed ${rows.length} rows, ${headers.length} columns`);
console.log("Headers:", headers);

// Column indices
const COL = {};
headers.forEach((h, i) => (COL[h.trim()] = i));

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

// ---- Aggregations ----
const totalEvents = rows.length;

// Count maps
const protocolCount = {};
const attackTypeCount = {};
const severityCount = {};
const actionCount = {};
const segmentCount = {};
const trafficTypeCount = {};
const packetTypeCount = {};
const logSourceCount = {};
const attackSigCount = {};

// Time series by month
const monthlyEvents = {};
const monthlySeverity = {};

// Anomaly score stats
let anomalySum = 0;
let anomalyCount = 0;
let anomalyMax = 0;
const anomalyBuckets = { "0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0 };

// Alerts
let alertTriggered = 0;
let iocDetected = 0;

// Packet length stats
let pktLenSum = 0;
let pktLenCount = 0;

// Unique IPs
const uniqueSrcIPs = new Set();
const uniqueDstIPs = new Set();

// Top source IPs
const srcIPCount = {};

// Geo locations
const geoCount = {};

// Sample rows for table (grab 500 evenly distributed)
const sampleIndices = new Set();
const step = Math.max(1, Math.floor(rows.length / 500));
for (let s = 0; s < rows.length; s += step) sampleIndices.add(s);

const sampleRows = [];

for (let r = 0; r < rows.length; r++) {
  const row = rows[r];
  const timestamp = row[TS];
  const protocol = row[PROTOCOL] || "Unknown";
  const attackType = row[ATTACK_TYPE] || "None";
  const severity = row[SEVERITY] || "Unknown";
  const action = row[ACTION] || "Unknown";
  const segment = row[SEGMENT] || "Unknown";
  const trafficType = row[TRAFFIC] || "Unknown";
  const packetType = row[PKT_TYPE] || "Unknown";
  const logSource = row[LOG_SRC] || "Unknown";
  const attackSig = row[ATTACK_SIG] || "Unknown";
  const anomalyScore = parseFloat(row[ANOMALY]) || 0;
  const pktLen = parseInt(row[PKT_LEN]) || 0;
  const alert = (row[ALERTS] || "").trim();
  const malware = (row[MALWARE] || "").trim();
  const srcIP = row[SRC_IP] || "";
  const dstIP = row[DST_IP] || "";
  const geo = (row[GEO] || "").trim();

  // Increment counts
  protocolCount[protocol] = (protocolCount[protocol] || 0) + 1;
  attackTypeCount[attackType] = (attackTypeCount[attackType] || 0) + 1;
  severityCount[severity] = (severityCount[severity] || 0) + 1;
  actionCount[action] = (actionCount[action] || 0) + 1;
  segmentCount[segment] = (segmentCount[segment] || 0) + 1;
  trafficTypeCount[trafficType] = (trafficTypeCount[trafficType] || 0) + 1;
  packetTypeCount[packetType] = (packetTypeCount[packetType] || 0) + 1;
  logSourceCount[logSource] = (logSourceCount[logSource] || 0) + 1;
  attackSigCount[attackSig] = (attackSigCount[attackSig] || 0) + 1;

  // Anomaly
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

  // Alerts
  if (alert === "Alert Triggered") alertTriggered++;
  if (malware === "IoC Detected") iocDetected++;

  // Packet length
  if (pktLen > 0) { pktLenSum += pktLen; pktLenCount++; }

  // IPs
  if (srcIP) { uniqueSrcIPs.add(srcIP); srcIPCount[srcIP] = (srcIPCount[srcIP] || 0) + 1; }
  if (dstIP) uniqueDstIPs.add(dstIP);

  // Geo
  if (geo) {
    const state = geo.split(",").pop()?.trim() || geo;
    geoCount[state] = (geoCount[state] || 0) + 1;
  }

  // Monthly
  if (timestamp) {
    const month = timestamp.slice(0, 7); // "2023-05"
    monthlyEvents[month] = (monthlyEvents[month] || 0) + 1;
    if (!monthlySeverity[month]) monthlySeverity[month] = { Low: 0, Medium: 0, High: 0 };
    if (severity === "Low" || severity === "Medium" || severity === "High") {
      monthlySeverity[month][severity]++;
    }
  }

  // Sample
  if (sampleIndices.has(r)) {
    sampleRows.push({
      id: `EVT-${String(r + 1).padStart(5, "0")}`,
      date: timestamp,
      srcIp: srcIP,
      dstIp: dstIP,
      srcPort: parseInt(row[SRC_PORT]) || 0,
      dstPort: parseInt(row[DST_PORT]) || 0,
      protocol,
      packetLength: pktLen,
      packetType,
      trafficType,
      attackType,
      attackSignature: attackSig,
      severity,
      action,
      anomalyScore,
      segment,
      geo,
      logSource,
      malwareIndicator: malware,
      alert,
      user: row[USER_INFO] || "",
      device: (row[DEVICE] || "").slice(0, 60),
    });
  }
}

// Sort monthly
const timeSeries = Object.entries(monthlyEvents)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([month, count]) => ({
    month,
    total: count,
    low: monthlySeverity[month]?.Low || 0,
    medium: monthlySeverity[month]?.Medium || 0,
    high: monthlySeverity[month]?.High || 0,
  }));

// Top source IPs
const topSrcIPs = Object.entries(srcIPCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([ip, count]) => ({ ip, count }));

// Top geos
const topGeos = Object.entries(geoCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([location, count]) => ({ location, count }));

// Build output
const output = {
  summary: {
    totalEvents,
    uniqueSrcIPs: uniqueSrcIPs.size,
    uniqueDstIPs: uniqueDstIPs.size,
    alertsTriggered: alertTriggered,
    iocDetected,
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
    anomalyBuckets,
  },
  timeSeries,
  topSrcIPs,
  topGeos,
  sampleRows,
};

writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
console.log(`Output written to ${outPath}`);
console.log("Summary:", JSON.stringify(output.summary, null, 2));
console.log(`Time series months: ${timeSeries.length}`);
console.log(`Sample rows: ${sampleRows.length}`);
console.log("Done!");
