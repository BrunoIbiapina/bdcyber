import csv
import json
import sys
from collections import Counter, defaultdict
from io import StringIO

csv_path = "/vercel/share/v0-project/scripts/raw-data.csv"
out_path = "/vercel/share/v0-project/lib/real-data.json"

print(f"Reading CSV from {csv_path}...")
with open(csv_path, "r", encoding="utf-8") as f:
    raw = f.read()

print(f"CSV size: {len(raw) / 1024 / 1024:.1f} MB")
reader = csv.DictReader(StringIO(raw))
rows_list = list(reader)
total = len(rows_list)
print(f"Parsed {total} rows")

protocol_c = Counter()
attack_c = Counter()
severity_c = Counter()
action_c = Counter()
segment_c = Counter()
traffic_c = Counter()
pkt_type_c = Counter()
log_src_c = Counter()
atk_sig_c = Counter()
monthly = defaultdict(int)
monthly_sev = defaultdict(lambda: {"Low": 0, "Medium": 0, "High": 0})
anomaly_sum = 0.0
anomaly_count = 0
anomaly_max = 0.0
anomaly_buckets = {"0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0}
alerts_triggered = 0
ioc_detected = 0
pkt_sum = 0
pkt_count = 0
unique_src = set()
unique_dst = set()
src_ip_c = Counter()
geo_c = Counter()

step = max(1, total // 500)
sample = []

for i, row in enumerate(rows_list):
    ts = row.get("Timestamp", "").strip()
    protocol = row.get("Protocol", "Unknown").strip() or "Unknown"
    attack = row.get("Attack Type", "None").strip() or "None"
    sev = row.get("Severity Level", "Unknown").strip() or "Unknown"
    act = row.get("Action Taken", "Unknown").strip() or "Unknown"
    seg = row.get("Network Segment", "Unknown").strip() or "Unknown"
    traffic = row.get("Traffic Type", "Unknown").strip() or "Unknown"
    pkt_type = row.get("Packet Type", "Unknown").strip() or "Unknown"
    log_src = row.get("Log Source", "Unknown").strip() or "Unknown"
    atk_sig = row.get("Attack Signature", "Unknown").strip() or "Unknown"
    anom_raw = row.get("Anomaly Scores", "0").strip()
    pkt_raw = row.get("Packet Length", "0").strip()
    alert = row.get("Alerts/Warnings", "").strip()
    malware = row.get("Malware Indicators", "").strip()
    src_ip = row.get("Source IP Address", "").strip()
    dst_ip = row.get("Destination IP Address", "").strip()
    geo = row.get("Geo-location Data", "").strip()

    try:
        anomaly = float(anom_raw)
    except:
        anomaly = 0.0
    try:
        pkt_len = int(pkt_raw)
    except:
        pkt_len = 0

    protocol_c[protocol] += 1
    attack_c[attack] += 1
    severity_c[sev] += 1
    action_c[act] += 1
    segment_c[seg] += 1
    traffic_c[traffic] += 1
    pkt_type_c[pkt_type] += 1
    log_src_c[log_src] += 1
    atk_sig_c[atk_sig] += 1

    if anomaly > 0:
        anomaly_sum += anomaly
        anomaly_count += 1
        anomaly_max = max(anomaly_max, anomaly)
        if anomaly < 20: anomaly_buckets["0-20"] += 1
        elif anomaly < 40: anomaly_buckets["20-40"] += 1
        elif anomaly < 60: anomaly_buckets["40-60"] += 1
        elif anomaly < 80: anomaly_buckets["60-80"] += 1
        else: anomaly_buckets["80-100"] += 1

    if alert == "Alert Triggered": alerts_triggered += 1
    if malware == "IoC Detected": ioc_detected += 1
    if pkt_len > 0: pkt_sum += pkt_len; pkt_count += 1
    if src_ip: unique_src.add(src_ip); src_ip_c[src_ip] += 1
    if dst_ip: unique_dst.add(dst_ip)

    if geo:
        parts = geo.split(",")
        state = parts[-1].strip() if len(parts) > 1 else geo
        geo_c[state] += 1

    if ts:
        month = ts[:7]
        monthly[month] += 1
        if sev in ("Low", "Medium", "High"):
            monthly_sev[month][sev] += 1

    if i % step == 0 and len(sample) < 500:
        sample.append({
            "id": f"EVT-{i+1:05d}",
            "date": ts,
            "srcIp": src_ip,
            "dstIp": dst_ip,
            "srcPort": int(row.get("Source Port", "0").strip() or "0"),
            "dstPort": int(row.get("Destination Port", "0").strip() or "0"),
            "protocol": protocol,
            "packetLength": pkt_len,
            "packetType": pkt_type,
            "trafficType": traffic,
            "attackType": attack,
            "attackSignature": atk_sig,
            "severity": sev,
            "action": act,
            "anomalyScore": round(anomaly, 2),
            "segment": seg,
            "geo": geo,
            "logSource": log_src,
            "malwareIndicator": malware,
            "alert": alert,
            "user": row.get("User Information", "").strip(),
            "device": row.get("Device Information", "").strip()[:60],
        })

time_series = sorted(
    [{"month": m, "total": c, "low": monthly_sev[m]["Low"], "medium": monthly_sev[m]["Medium"], "high": monthly_sev[m]["High"]}
     for m, c in monthly.items()],
    key=lambda x: x["month"]
)

top_src = [{"ip": ip, "count": c} for ip, c in src_ip_c.most_common(10)]
top_geos = [{"location": g, "count": c} for g, c in geo_c.most_common(10)]

output = {
    "summary": {
        "totalEvents": total,
        "uniqueSrcIPs": len(unique_src),
        "uniqueDstIPs": len(unique_dst),
        "alertsTriggered": alerts_triggered,
        "iocDetected": ioc_detected,
        "avgAnomalyScore": round(anomaly_sum / anomaly_count, 2) if anomaly_count > 0 else 0,
        "maxAnomalyScore": round(anomaly_max, 2),
        "avgPacketLength": round(pkt_sum / pkt_count) if pkt_count > 0 else 0,
    },
    "distributions": {
        "protocol": dict(protocol_c),
        "attackType": dict(attack_c),
        "severity": dict(severity_c),
        "action": dict(action_c),
        "segment": dict(segment_c),
        "trafficType": dict(traffic_c),
        "packetType": dict(pkt_type_c),
        "logSource": dict(log_src_c),
        "attackSignature": dict(atk_sig_c),
        "anomalyBuckets": anomaly_buckets,
    },
    "timeSeries": time_series,
    "topSrcIPs": top_src,
    "topGeos": top_geos,
    "sampleRows": sample,
}

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Output written to {out_path}")
print(f"Summary: {json.dumps(output['summary'], indent=2)}")
print(f"Time series months: {len(time_series)}")
print(f"Sample rows: {len(sample)}")
print("Done!")
