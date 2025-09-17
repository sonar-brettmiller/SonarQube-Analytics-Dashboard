// SonarQube Cloud API Types

export interface SonarQubeProject {
  key: string;
  name: string;
  qualifier: string;
  visibility: string;
  lastAnalysisDate?: string;
  revision?: string;
}

export interface SonarQubeMeasure {
  metric: string;
  value?: string;
  periods?: Array<{
    index: number;
    value: string;
  }>;
}

export interface SonarQubeComponent {
  key: string;
  name: string;
  qualifier: string;
  measures: SonarQubeMeasure[];
  path?: string;
  language?: string;
  version?: string;
}

export interface SonarQubeIssue {
  key: string;
  rule: string;
  severity: string;
  component: string;
  project: string;
  line?: number;
  message: string;
  type: string;
  status: string;
  resolution?: string;
  assignee?: string;
  author?: string;
  creationDate: string;
  updateDate: string;
  tags: string[];
  textRange?: {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  };
}

export interface SonarQubeQualityGate {
  key: string;
  name: string;
  status: 'OK' | 'WARN' | 'ERROR';
  conditions: Array<{
    status: 'OK' | 'WARN' | 'ERROR';
    metricKey: string;
    comparator: string;
    errorThreshold?: string;
    actualValue?: string;
  }>;
}

export interface SonarQubeMetric {
  key: string;
  name: string;
  description: string;
  domain: string;
  type: 'INT' | 'FLOAT' | 'PERCENT' | 'BOOL' | 'STRING' | 'MILLISEC' | 'DATA' | 'DISTRIB' | 'RATING';
  direction: number;
  qualitative: boolean;
  hidden: boolean;
}

export interface SonarQubeWebhook {
  key: string;
  name: string;
  url: string;
  secret?: string;
}

export interface SonarQubeRule {
  key: string;
  name: string;
  lang: string;
  status: string;
  langName: string;
  htmlDesc: string;
  severity: string;
  type: string;
  tags: string[];
  // Optional security standards metadata returned by /api/rules/search when requesting fields
  // Example shape: { cwe: ["79","89"], owaspTop10: ["a3"], sonarsourceSecurity: ["xss"] }
  securityStandards?: Record<string, string[] | string>;
}

// CWE-specific interfaces
export interface CweRule extends SonarQubeRule {
  cweTags: string[];
  cweNumbers: string[];
}

export interface CweIssue extends SonarQubeIssue {
  ruleDetails?: CweRule;
  cweNumbers: string[];
  cweTags: string[];
}

export interface CweAnalysisData {
  issues: CweIssue[];
  cweStatistics: CweStatistics;
  totalIssues: number;
  issuesWithCwe: number;
  projectKey?: string;
}

export interface CweStatistics {
  totalCweIssues: number;
  cweCounts: Record<string, number>;
  cweBySeverity: Record<string, Record<string, number>>;
  cweByType: Record<string, Record<string, number>>;
  topCweCategories: Array<{
    cwe: string;
    count: number;
    percentage: number;
  }>;
}

export interface CweFilterOptions {
  cweNumbers?: string[];
  severities?: string[];
  types?: string[];
  projects?: string[];
  searchTerm?: string;
}

export interface SonarQubeLanguage {
  key: string;
  name: string;
}

// API Response Types
export interface SonarQubeProjectsResponse {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  components: SonarQubeProject[];
}

export interface SonarQubeIssuesResponse {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  issues: SonarQubeIssue[];
  facets: Array<{
    property: string;
    values: Array<{
      val: string;
      count: number;
    }>;
  }>;
}

export interface SonarQubeMetricsResponse {
  metrics: SonarQubeMetric[];
}

export interface SonarQubeRulesResponse {
  rules: SonarQubeRule[];
  total: number;
  p: number;
  ps: number;
}

export interface SonarQubeLanguagesResponse {
  languages: SonarQubeLanguage[];
}

// Dashboard specific types
export interface DashboardMetrics {
  // Coverage metrics
  coverage: number;
  lineCoverage: number;
  branchCoverage: number;
  newCoverage: number;
  newLineCoverage: number;
  newBranchCoverage: number;
  
  // Issue metrics
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  securityHotspots: number;
  violations: number;
  newBugs: number;
  newVulnerabilities: number;
  newCodeSmells: number;
  newSecurityHotspots: number;
  newViolations: number;
  
  // Rating metrics
  reliabilityRating: number;
  securityRating: number;
  maintainabilityRating: number;
  sqaleRating: number;
  newReliabilityRating: number;
  newSecurityRating: number;
  newMaintainabilityRating: number;
  
  // Size metrics
  ncloc: number;
  lines: number;
  statements: number;
  functions: number;
  classes: number;
  files: number;
  directories: number;
  newLines: number;
  linesOfCode: number; // Alias for ncloc for backward compatibility
  
  // Duplication metrics
  duplicatedLines: number;
  duplicatedLinesDensity: number;
  duplicatedBlocks: number;
  duplicatedFiles: number;
  newDuplicatedLines: number;
  newDuplicatedLinesDensity: number;
  newDuplicatedBlocks: number;
  duplications: number; // Alias for duplicatedLinesDensity for backward compatibility
  
  // Complexity metrics
  complexity: number;
  cognitiveComplexity: number;
  sqaleIndex: number;
  technicalDebt: number;
  newTechnicalDebt: number;
  effortToReachMaintainabilityRatingA: number;
  
  // Security metrics
  securityHotspotsReviewed: number;
  newSecurityHotspotsReviewed: number;
  securityRemediationEffort: number;
  newSecurityRemediationEffort: number;
  
  // Reliability metrics
  reliabilityRemediationEffort: number;
  newReliabilityRemediationEffort: number;
  
  // Quality gate
  alertStatus: string;
}

export interface ProjectSummary {
  project: SonarQubeProject;
  metrics: DashboardMetrics;
  qualityGate: SonarQubeQualityGate;
  lastAnalysis: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ReportData {
  projects: ProjectSummary[];
  overallMetrics: DashboardMetrics;
  qualityGateStatus: {
    passed: number;
    failed: number;
    total: number;
  };
  topIssues: SonarQubeIssue[];
  trends: {
    coverage: number[];
    bugs: number[];
    vulnerabilities: number[];
    codeSmells: number[];
  };
}
