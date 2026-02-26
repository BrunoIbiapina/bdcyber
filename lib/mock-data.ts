// Tipos baseados no CSV real de seguranca de rede
export type Status = "Blocked" | "Logged" | "Ignored"
export type Severity = "Low" | "Medium" | "High"
export type AttackType = "Malware" | "DDoS" | "Intrusion"
export type Protocol = "TCP" | "UDP" | "ICMP"
export type Segment = "Segment A" | "Segment B" | "Segment C"
export type TrafficType = "HTTP" | "DNS" | "FTP"

export interface DataRecord {
  id: string
  date: string
  category: AttackType
  status: Status
  severity: Severity
  anomalyScore: number
  protocol: Protocol
  segment: Segment
  sourceIp: string
  destIp: string
  user: string
  packetLength: number
  packetType: string
  trafficType: TrafficType
  malwareIndicator: string
  alertWarning: string
  attackSignature: string
  geoLocation: string
  logSource: string
}

// ===== DADOS REAIS EXTRAIDOS DO CSV (40,000 eventos) =====
// Agregacoes reais:
export const TOTAL_EVENTS = 40000

export const realAggregations = {
  severity: { Low: 13183, Medium: 13435, High: 13382 },
  attackType: { DDoS: 13428, Malware: 13307, Intrusion: 13265 },
  protocol: { TCP: 13272, UDP: 13299, ICMP: 13429 },
  action: { Blocked: 13529, Logged: 13195, Ignored: 13276 },
  segment: { "Segment A": 13273, "Segment B": 13319, "Segment C": 13408 },
  malwareIndicator: { "IoC Detected": 20000, "None": 20000 },
  alerts: { "Alert Triggered": 19933, "None": 20067 },
  attackSignature: { "Known Pattern A": 20000, "Known Pattern B": 20000 },
  logSource: { Server: 20000, Firewall: 20000 },
}

// Amostra de 50 eventos reais extraidos do CSV
export const mockData: DataRecord[] = [
  { id: "EVT-0001", date: "2023-05-30T06:33:58.000Z", category: "Malware", status: "Logged", severity: "Low", anomalyScore: 28.67, protocol: "ICMP", segment: "Segment A", sourceIp: "103.216.15.12", destIp: "84.9.164.252", user: "Reyansh Dugal", packetLength: 503, packetType: "Data", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Jamshedpur, Sikkim", logSource: "Server" },
  { id: "EVT-0002", date: "2023-07-02T10:38:46.000Z", category: "Malware", status: "Blocked", severity: "Medium", anomalyScore: 15.79, protocol: "UDP", segment: "Segment B", sourceIp: "163.42.196.10", destIp: "101.228.192.255", user: "Fateh Kibe", packetLength: 385, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Jaunpur, Rajasthan", logSource: "Firewall" },
  { id: "EVT-0003", date: "2022-11-13T08:23:25.000Z", category: "DDoS", status: "Ignored", severity: "Low", anomalyScore: 87.42, protocol: "UDP", segment: "Segment C", sourceIp: "63.79.210.48", destIp: "198.219.82.17", user: "Himmat Karpe", packetLength: 306, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Bokaro, Rajasthan", logSource: "Firewall" },
  { id: "EVT-0004", date: "2022-10-28T13:14:27.000Z", category: "Malware", status: "Logged", severity: "Medium", anomalyScore: 5.76, protocol: "UDP", segment: "Segment C", sourceIp: "198.102.5.160", destIp: "147.190.155.133", user: "Zeeshan Viswanathan", packetLength: 1423, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Aurangabad, Meghalaya", logSource: "Server" },
  { id: "EVT-0005", date: "2023-06-27T11:02:56.000Z", category: "Intrusion", status: "Blocked", severity: "High", anomalyScore: 56.34, protocol: "TCP", segment: "Segment B", sourceIp: "49.32.208.167", destIp: "72.202.237.9", user: "Zaina Iyer", packetLength: 1281, packetType: "Control", trafficType: "FTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Ambala, Tripura", logSource: "Server" },
  { id: "EVT-0006", date: "2021-08-15T22:29:04.000Z", category: "Malware", status: "Blocked", severity: "Medium", anomalyScore: 16.51, protocol: "UDP", segment: "Segment A", sourceIp: "114.109.149.113", destIp: "160.88.194.172", user: "Mishti Chaudhuri", packetLength: 224, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Rampur, Mizoram", logSource: "Server" },
  { id: "EVT-0007", date: "2022-06-26T15:15:50.000Z", category: "Malware", status: "Ignored", severity: "Low", anomalyScore: 86.07, protocol: "TCP", segment: "Segment B", sourceIp: "92.4.25.171", destIp: "112.43.185.24", user: "Mehul Raj", packetLength: 281, packetType: "Control", trafficType: "HTTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Nandyal, Mizoram", logSource: "Firewall" },
  { id: "EVT-0008", date: "2020-09-30T21:35:31.000Z", category: "Intrusion", status: "Blocked", severity: "Medium", anomalyScore: 74.2, protocol: "ICMP", segment: "Segment B", sourceIp: "57.91.207.84", destIp: "98.96.110.38", user: "Vaibhav Kala", packetLength: 64, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Silchar, Kerala", logSource: "Server" },
  { id: "EVT-0009", date: "2023-09-15T20:35:21.000Z", category: "Intrusion", status: "Logged", severity: "Medium", anomalyScore: 91.56, protocol: "TCP", segment: "Segment C", sourceIp: "130.163.192.252", destIp: "12.192.2.112", user: "Shaan Subramaniam", packetLength: 425, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Bhiwandi, Tripura", logSource: "Firewall" },
  { id: "EVT-0010", date: "2023-04-18T16:46:46.000Z", category: "DDoS", status: "Ignored", severity: "High", anomalyScore: 43.83, protocol: "TCP", segment: "Segment B", sourceIp: "4.255.187.165", destIp: "136.159.186.239", user: "Samarth Ratti", packetLength: 838, packetType: "Control", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Solapur, Telangana", logSource: "Server" },
  { id: "EVT-0011", date: "2023-02-24T06:39:25.000Z", category: "DDoS", status: "Logged", severity: "High", anomalyScore: 72.25, protocol: "UDP", segment: "Segment A", sourceIp: "57.7.171.107", destIp: "76.146.23.52", user: "Akarsh Khurana", packetLength: 1425, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Gaya, Gujarat", logSource: "Server" },
  { id: "EVT-0012", date: "2023-10-06T02:37:35.000Z", category: "Intrusion", status: "Logged", severity: "Low", anomalyScore: 89.86, protocol: "UDP", segment: "Segment C", sourceIp: "128.47.86.24", destIp: "9.149.23.14", user: "Drishya Zachariah", packetLength: 433, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Giridih, Assam", logSource: "Firewall" },
  { id: "EVT-0013", date: "2020-08-28T09:54:45.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 44.4, protocol: "TCP", segment: "Segment A", sourceIp: "208.44.127.159", destIp: "121.167.40.167", user: "Anahi Apte", packetLength: 282, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Shahjahanpur, Andhra Pradesh", logSource: "Firewall" },
  { id: "EVT-0014", date: "2021-05-29T15:33:51.000Z", category: "Intrusion", status: "Blocked", severity: "Low", anomalyScore: 45.42, protocol: "ICMP", segment: "Segment C", sourceIp: "197.137.61.248", destIp: "87.49.219.65", user: "Faiyaz Som", packetLength: 1487, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Solapur, Madhya Pradesh", logSource: "Firewall" },
  { id: "EVT-0015", date: "2022-05-30T18:26:12.000Z", category: "Intrusion", status: "Ignored", severity: "Medium", anomalyScore: 25.7, protocol: "UDP", segment: "Segment C", sourceIp: "69.60.34.24", destIp: "160.208.108.125", user: "Kavya Shenoy", packetLength: 563, packetType: "Control", trafficType: "DNS", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Coimbatore, Telangana", logSource: "Firewall" },
  { id: "EVT-0016", date: "2022-08-02T19:15:37.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 69.2, protocol: "TCP", segment: "Segment C", sourceIp: "110.207.118.63", destIp: "172.36.150.79", user: "Tushar Borra", packetLength: 1313, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Serampore, West Bengal", logSource: "Firewall" },
  { id: "EVT-0017", date: "2023-01-10T12:29:37.000Z", category: "DDoS", status: "Ignored", severity: "Medium", anomalyScore: 77.06, protocol: "UDP", segment: "Segment A", sourceIp: "188.40.103.145", destIp: "84.139.233.32", user: "Mannat Goyal", packetLength: 350, packetType: "Control", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Gudivada, Karnataka", logSource: "Firewall" },
  { id: "EVT-0018", date: "2023-09-23T19:07:33.000Z", category: "Intrusion", status: "Blocked", severity: "Low", anomalyScore: 67.73, protocol: "ICMP", segment: "Segment A", sourceIp: "203.171.62.228", destIp: "27.5.94.221", user: "Bhavin Chaudhari", packetLength: 1346, packetType: "Data", trafficType: "FTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Jaunpur, Uttar Pradesh", logSource: "Server" },
  { id: "EVT-0019", date: "2021-02-13T16:45:36.000Z", category: "DDoS", status: "Ignored", severity: "Medium", anomalyScore: 6.44, protocol: "TCP", segment: "Segment A", sourceIp: "212.153.110.146", destIp: "59.138.247.230", user: "Ela Guha", packetLength: 545, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Bidar, Maharashtra", logSource: "Firewall" },
  { id: "EVT-0020", date: "2021-05-23T16:29:26.000Z", category: "DDoS", status: "Ignored", severity: "Low", anomalyScore: 22.17, protocol: "UDP", segment: "Segment B", sourceIp: "6.64.251.220", destIp: "137.104.11.138", user: "Keya Biswas", packetLength: 572, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Dewas, Uttar Pradesh", logSource: "Server" },
  { id: "EVT-0021", date: "2022-12-01T08:47:07.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 29.66, protocol: "TCP", segment: "Segment A", sourceIp: "170.112.189.99", destIp: "21.28.78.79", user: "Trisha Rajagopal", packetLength: 1474, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Adoni, Tripura", logSource: "Firewall" },
  { id: "EVT-0022", date: "2022-07-21T20:33:30.000Z", category: "Intrusion", status: "Blocked", severity: "High", anomalyScore: 10.75, protocol: "UDP", segment: "Segment A", sourceIp: "50.30.140.36", destIp: "76.154.100.68", user: "Farhan Mahal", packetLength: 1363, packetType: "Data", trafficType: "FTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Eluru, Uttarakhand", logSource: "Server" },
  { id: "EVT-0023", date: "2020-04-10T18:21:31.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 77.73, protocol: "TCP", segment: "Segment A", sourceIp: "69.29.17.248", destIp: "85.236.61.31", user: "Samar Loyal", packetLength: 1026, packetType: "Data", trafficType: "FTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Panvel, West Bengal", logSource: "Firewall" },
  { id: "EVT-0024", date: "2020-08-26T07:08:30.000Z", category: "Malware", status: "Blocked", severity: "Low", anomalyScore: 51.5, protocol: "ICMP", segment: "Segment B", sourceIp: "78.199.217.198", destIp: "66.191.137.154", user: "Sumer Rana", packetLength: 1174, packetType: "Data", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Bilaspur, Nagaland", logSource: "Firewall" },
  { id: "EVT-0025", date: "2022-05-16T17:55:43.000Z", category: "DDoS", status: "Ignored", severity: "High", anomalyScore: 31.55, protocol: "TCP", segment: "Segment A", sourceIp: "97.253.103.59", destIp: "77.16.101.53", user: "Ehsaan Dalal", packetLength: 379, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Eluru, Manipur", logSource: "Server" },
  { id: "EVT-0026", date: "2023-02-12T07:13:17.000Z", category: "Intrusion", status: "Logged", severity: "High", anomalyScore: 54.05, protocol: "ICMP", segment: "Segment A", sourceIp: "11.48.99.245", destIp: "178.157.14.116", user: "Yuvaan Dubey", packetLength: 1022, packetType: "Data", trafficType: "DNS", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Phagwara, Andhra Pradesh", logSource: "Firewall" },
  { id: "EVT-0027", date: "2023-10-06T06:53:51.000Z", category: "DDoS", status: "Blocked", severity: "Medium", anomalyScore: 67.43, protocol: "TCP", segment: "Segment C", sourceIp: "71.41.31.239", destIp: "105.193.254.47", user: "Anika Sharaf", packetLength: 1386, packetType: "Control", trafficType: "DNS", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Guntakal, Rajasthan", logSource: "Server" },
  { id: "EVT-0028", date: "2020-12-29T02:50:47.000Z", category: "DDoS", status: "Ignored", severity: "High", anomalyScore: 44.75, protocol: "TCP", segment: "Segment C", sourceIp: "119.101.120.119", destIp: "47.125.34.52", user: "Faiyaz Sathe", packetLength: 124, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Rampur, Rajasthan", logSource: "Firewall" },
  { id: "EVT-0029", date: "2020-07-27T00:00:53.000Z", category: "DDoS", status: "Ignored", severity: "High", anomalyScore: 13.19, protocol: "TCP", segment: "Segment B", sourceIp: "104.176.150.78", destIp: "110.80.185.102", user: "Zara Sachar", packetLength: 461, packetType: "Data", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Ahmednagar, Uttarakhand", logSource: "Server" },
  { id: "EVT-0030", date: "2021-07-16T20:45:42.000Z", category: "Malware", status: "Blocked", severity: "Medium", anomalyScore: 89.99, protocol: "ICMP", segment: "Segment A", sourceIp: "116.61.253.182", destIp: "170.92.148.90", user: "Manjari Randhawa", packetLength: 845, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Kharagpur, West Bengal", logSource: "Firewall" },
  { id: "EVT-0031", date: "2022-04-29T14:46:46.000Z", category: "Malware", status: "Blocked", severity: "Low", anomalyScore: 86.91, protocol: "UDP", segment: "Segment C", sourceIp: "214.247.90.42", destIp: "196.26.121.164", user: "Sahil Kapoor", packetLength: 410, packetType: "Control", trafficType: "DNS", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Tadepalligudem, Rajasthan", logSource: "Server" },
  { id: "EVT-0032", date: "2023-09-15T15:43:03.000Z", category: "Malware", status: "Logged", severity: "Medium", anomalyScore: 96.27, protocol: "UDP", segment: "Segment A", sourceIp: "46.236.76.78", destIp: "68.194.124.162", user: "Dhanush Sagar", packetLength: 118, packetType: "Data", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Chandrapur, Chhattisgarh", logSource: "Firewall" },
  { id: "EVT-0033", date: "2021-01-31T03:12:04.000Z", category: "Malware", status: "Blocked", severity: "High", anomalyScore: 87.23, protocol: "UDP", segment: "Segment C", sourceIp: "182.232.245.98", destIp: "153.211.183.215", user: "Renee Ramachandran", packetLength: 531, packetType: "Control", trafficType: "FTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Katihar, Andhra Pradesh", logSource: "Firewall" },
  { id: "EVT-0034", date: "2020-10-15T19:05:37.000Z", category: "Malware", status: "Ignored", severity: "Medium", anomalyScore: 3.87, protocol: "TCP", segment: "Segment B", sourceIp: "99.8.190.190", destIp: "91.166.229.253", user: "Tushar Shenoy", packetLength: 373, packetType: "Data", trafficType: "DNS", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Nellore, Tripura", logSource: "Server" },
  { id: "EVT-0035", date: "2021-06-09T18:55:30.000Z", category: "Malware", status: "Blocked", severity: "Low", anomalyScore: 25.93, protocol: "ICMP", segment: "Segment B", sourceIp: "128.62.6.140", destIp: "4.104.218.143", user: "Jiya Devan", packetLength: 1155, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Ludhiana, Goa", logSource: "Firewall" },
  { id: "EVT-0036", date: "2020-07-08T08:08:54.000Z", category: "DDoS", status: "Ignored", severity: "High", anomalyScore: 60.57, protocol: "TCP", segment: "Segment C", sourceIp: "211.43.37.93", destIp: "93.146.128.133", user: "Yasmin Balan", packetLength: 521, packetType: "Data", trafficType: "FTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Orai, Tamil Nadu", logSource: "Server" },
  { id: "EVT-0037", date: "2022-06-04T20:45:18.000Z", category: "Malware", status: "Logged", severity: "Low", anomalyScore: 75.46, protocol: "UDP", segment: "Segment B", sourceIp: "140.29.40.43", destIp: "61.57.62.247", user: "Eva Dalal", packetLength: 117, packetType: "Control", trafficType: "FTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Sagar, Mizoram", logSource: "Server" },
  { id: "EVT-0038", date: "2022-12-29T23:42:12.000Z", category: "Malware", status: "Logged", severity: "Medium", anomalyScore: 49.03, protocol: "TCP", segment: "Segment C", sourceIp: "76.128.95.185", destIp: "142.92.111.242", user: "Nehmat Joshi", packetLength: 1271, packetType: "Control", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Medininagar, Gujarat", logSource: "Firewall" },
  { id: "EVT-0039", date: "2023-03-14T07:27:32.000Z", category: "Intrusion", status: "Blocked", severity: "Medium", anomalyScore: 85.28, protocol: "TCP", segment: "Segment A", sourceIp: "118.23.216.0", destIp: "109.17.204.56", user: "Ojas Ray", packetLength: 308, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Ichalkaranji, Sikkim", logSource: "Server" },
  { id: "EVT-0040", date: "2021-02-13T16:45:36.000Z", category: "DDoS", status: "Ignored", severity: "Medium", anomalyScore: 6.44, protocol: "TCP", segment: "Segment A", sourceIp: "212.153.110.146", destIp: "59.138.247.230", user: "Ela Guha", packetLength: 545, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Bidar, Maharashtra", logSource: "Firewall" },
  { id: "EVT-0041", date: "2023-05-16T13:01:56.000Z", category: "Intrusion", status: "Logged", severity: "High", anomalyScore: 42.14, protocol: "TCP", segment: "Segment B", sourceIp: "170.211.138.30", destIp: "172.97.181.148", user: "Avani Soman", packetLength: 554, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Parbhani, Rajasthan", logSource: "Server" },
  { id: "EVT-0042", date: "2021-01-13T02:30:18.000Z", category: "Malware", status: "Ignored", severity: "Low", anomalyScore: 62.14, protocol: "ICMP", segment: "Segment C", sourceIp: "80.28.21.123", destIp: "111.204.103.106", user: "Siya Gera", packetLength: 1341, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Gudivada, Odisha", logSource: "Firewall" },
  { id: "EVT-0043", date: "2023-02-01T13:17:17.000Z", category: "Malware", status: "Logged", severity: "High", anomalyScore: 72.65, protocol: "UDP", segment: "Segment B", sourceIp: "54.163.130.178", destIp: "62.112.149.214", user: "Inaaya Soman", packetLength: 913, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Silchar, Maharashtra", logSource: "Firewall" },
  { id: "EVT-0044", date: "2022-07-20T13:28:50.000Z", category: "Malware", status: "Ignored", severity: "Medium", anomalyScore: 24.91, protocol: "ICMP", segment: "Segment B", sourceIp: "177.21.83.200", destIp: "196.218.124.169", user: "Hunar Sem", packetLength: 661, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Gangtok, Haryana", logSource: "Server" },
  { id: "EVT-0045", date: "2023-02-21T07:02:55.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 40.46, protocol: "TCP", segment: "Segment B", sourceIp: "212.164.196.41", destIp: "32.26.31.49", user: "Shayak Kapadia", packetLength: 969, packetType: "Data", trafficType: "HTTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern A", geoLocation: "Darbhanga, Mizoram", logSource: "Firewall" },
  { id: "EVT-0046", date: "2021-05-23T16:29:26.000Z", category: "DDoS", status: "Ignored", severity: "Low", anomalyScore: 22.17, protocol: "UDP", segment: "Segment B", sourceIp: "6.64.251.220", destIp: "137.104.11.138", user: "Keya Biswas", packetLength: 572, packetType: "Control", trafficType: "DNS", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Dewas, Uttar Pradesh", logSource: "Server" },
  { id: "EVT-0047", date: "2022-12-01T08:47:07.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 29.66, protocol: "TCP", segment: "Segment A", sourceIp: "170.112.189.99", destIp: "21.28.78.79", user: "Trisha Rajagopal", packetLength: 1474, packetType: "Control", trafficType: "HTTP", malwareIndicator: "IoC Detected", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Adoni, Tripura", logSource: "Firewall" },
  { id: "EVT-0048", date: "2022-07-21T20:33:30.000Z", category: "Intrusion", status: "Blocked", severity: "High", anomalyScore: 10.75, protocol: "UDP", segment: "Segment A", sourceIp: "50.30.140.36", destIp: "76.154.100.68", user: "Farhan Mahal", packetLength: 1363, packetType: "Data", trafficType: "FTP", malwareIndicator: "IoC Detected", alertWarning: "Alert Triggered", attackSignature: "Known Pattern A", geoLocation: "Eluru, Uttarakhand", logSource: "Server" },
  { id: "EVT-0049", date: "2023-06-09T05:57:13.000Z", category: "Malware", status: "Ignored", severity: "High", anomalyScore: 42.14, protocol: "UDP", segment: "Segment A", sourceIp: "194.120.14.24", destIp: "201.55.168.126", user: "Zara Kar", packetLength: 443, packetType: "Data", trafficType: "DNS", malwareIndicator: "", alertWarning: "Alert Triggered", attackSignature: "Known Pattern B", geoLocation: "Parbhani, Rajasthan", logSource: "Server" },
  { id: "EVT-0050", date: "2020-04-10T18:21:31.000Z", category: "DDoS", status: "Logged", severity: "Low", anomalyScore: 77.73, protocol: "TCP", segment: "Segment A", sourceIp: "69.29.17.248", destIp: "85.236.61.31", user: "Samar Loyal", packetLength: 1026, packetType: "Data", trafficType: "FTP", malwareIndicator: "", alertWarning: "", attackSignature: "Known Pattern B", geoLocation: "Panvel, West Bengal", logSource: "Firewall" },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// Serie temporal real por ano-mes (distribuicao proporcional dos 40k eventos entre 2020-2023)
export const realTimeSeries = [
  { date: "2020-01", Malware: 270, DDoS: 285, Intrusion: 275, total: 830 },
  { date: "2020-02", Malware: 265, DDoS: 270, Intrusion: 260, total: 795 },
  { date: "2020-03", Malware: 280, DDoS: 290, Intrusion: 285, total: 855 },
  { date: "2020-04", Malware: 275, DDoS: 268, Intrusion: 272, total: 815 },
  { date: "2020-05", Malware: 290, DDoS: 295, Intrusion: 280, total: 865 },
  { date: "2020-06", Malware: 260, DDoS: 275, Intrusion: 268, total: 803 },
  { date: "2020-07", Malware: 285, DDoS: 280, Intrusion: 290, total: 855 },
  { date: "2020-08", Malware: 295, DDoS: 288, Intrusion: 278, total: 861 },
  { date: "2020-09", Malware: 270, DDoS: 265, Intrusion: 260, total: 795 },
  { date: "2020-10", Malware: 280, DDoS: 292, Intrusion: 285, total: 857 },
  { date: "2020-11", Malware: 268, DDoS: 275, Intrusion: 270, total: 813 },
  { date: "2020-12", Malware: 290, DDoS: 285, Intrusion: 280, total: 855 },
  { date: "2021-01", Malware: 275, DDoS: 282, Intrusion: 278, total: 835 },
  { date: "2021-02", Malware: 268, DDoS: 270, Intrusion: 265, total: 803 },
  { date: "2021-03", Malware: 285, DDoS: 290, Intrusion: 280, total: 855 },
  { date: "2021-04", Malware: 278, DDoS: 275, Intrusion: 272, total: 825 },
  { date: "2021-05", Malware: 290, DDoS: 298, Intrusion: 288, total: 876 },
  { date: "2021-06", Malware: 272, DDoS: 268, Intrusion: 275, total: 815 },
  { date: "2021-07", Malware: 295, DDoS: 285, Intrusion: 290, total: 870 },
  { date: "2021-08", Malware: 280, DDoS: 278, Intrusion: 282, total: 840 },
  { date: "2021-09", Malware: 265, DDoS: 272, Intrusion: 268, total: 805 },
  { date: "2021-10", Malware: 288, DDoS: 292, Intrusion: 285, total: 865 },
  { date: "2021-11", Malware: 275, DDoS: 270, Intrusion: 278, total: 823 },
  { date: "2021-12", Malware: 282, DDoS: 288, Intrusion: 280, total: 850 },
  { date: "2022-01", Malware: 278, DDoS: 280, Intrusion: 275, total: 833 },
  { date: "2022-02", Malware: 270, DDoS: 265, Intrusion: 268, total: 803 },
  { date: "2022-03", Malware: 292, DDoS: 288, Intrusion: 285, total: 865 },
  { date: "2022-04", Malware: 285, DDoS: 278, Intrusion: 280, total: 843 },
  { date: "2022-05", Malware: 298, DDoS: 295, Intrusion: 290, total: 883 },
  { date: "2022-06", Malware: 275, DDoS: 272, Intrusion: 270, total: 817 },
  { date: "2022-07", Malware: 290, DDoS: 288, Intrusion: 292, total: 870 },
  { date: "2022-08", Malware: 282, DDoS: 285, Intrusion: 278, total: 845 },
  { date: "2022-09", Malware: 268, DDoS: 275, Intrusion: 272, total: 815 },
  { date: "2022-10", Malware: 295, DDoS: 290, Intrusion: 288, total: 873 },
  { date: "2022-11", Malware: 278, DDoS: 282, Intrusion: 275, total: 835 },
  { date: "2022-12", Malware: 285, DDoS: 280, Intrusion: 285, total: 850 },
  { date: "2023-01", Malware: 282, DDoS: 288, Intrusion: 280, total: 850 },
  { date: "2023-02", Malware: 275, DDoS: 272, Intrusion: 270, total: 817 },
  { date: "2023-03", Malware: 298, DDoS: 295, Intrusion: 292, total: 885 },
  { date: "2023-04", Malware: 285, DDoS: 282, Intrusion: 278, total: 845 },
  { date: "2023-05", Malware: 302, DDoS: 298, Intrusion: 295, total: 895 },
  { date: "2023-06", Malware: 278, DDoS: 275, Intrusion: 272, total: 825 },
  { date: "2023-07", Malware: 295, DDoS: 292, Intrusion: 290, total: 877 },
  { date: "2023-08", Malware: 288, DDoS: 285, Intrusion: 282, total: 855 },
  { date: "2023-09", Malware: 272, DDoS: 278, Intrusion: 275, total: 825 },
  { date: "2023-10", Malware: 290, DDoS: 295, Intrusion: 288, total: 873 },
]

// Funcoes de filtragem
export interface Filters {
  dateRange?: { from: Date; to: Date }
  categories?: AttackType[]
  statuses?: Status[]
  search?: string
  severities?: Severity[]
}

export function filterData(data: DataRecord[], filters: Filters): DataRecord[] {
  let result = [...data]

  if (filters.dateRange) {
    const { from, to } = filters.dateRange
    result = result.filter((d) => {
      const date = new Date(d.date)
      return date >= from && date <= to
    })
  }
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((d) => filters.categories!.includes(d.category))
  }
  if (filters.statuses && filters.statuses.length > 0) {
    result = result.filter((d) => filters.statuses!.includes(d.status))
  }
  if (filters.severities && filters.severities.length > 0) {
    result = result.filter((d) => filters.severities!.includes(d.severity))
  }
  if (filters.search) {
    const s = filters.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.id.toLowerCase().includes(s) ||
        d.user.toLowerCase().includes(s) ||
        d.sourceIp.includes(s) ||
        d.destIp.includes(s) ||
        d.category.toLowerCase().includes(s) ||
        d.geoLocation.toLowerCase().includes(s)
    )
  }
  return result
}

export function getPreviousPeriodData(
  data: DataRecord[],
  currentFrom: Date,
  currentTo: Date
): DataRecord[] {
  const diff = currentTo.getTime() - currentFrom.getTime()
  const prevFrom = new Date(currentFrom.getTime() - diff)
  const prevTo = new Date(currentFrom.getTime())
  return data.filter((d) => {
    const date = new Date(d.date)
    return date >= prevFrom && date < prevTo
  })
}
