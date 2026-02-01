
export enum ScanType {
  FILE = 'FILE',
  LINK = 'LINK'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  type: ScanType;
  target: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  analysis: string;
  findings: string[];
  recommendations: string[];
  sources?: GroundingLink[];
}

export interface ScanHistoryItem {
  id: string;
  target: string;
  timestamp: number;
  riskLevel: RiskLevel;
}
