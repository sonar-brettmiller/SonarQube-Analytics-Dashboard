// CWE/CVE Service for comprehensive vulnerability data
import axios from 'axios';

export interface CweData {
  id: string;
  name: string;
  description: string;
  url: string;
  category?: string;
  severity?: string;
}

export interface CveData {
  id: string;
  description: string;
  severity: string;
  publishedDate: string;
  lastModifiedDate: string;
  cweIds: string[];
  url: string;
}

export interface CweCveMapping {
  cweId: string;
  cweData: CweData;
  cveData: CveData[];
  sonarQubeIssues: string[];
}

class CweCveService {
  private cweCache: Map<string, CweData> = new Map();
  private cveCache: Map<string, CveData[]> = new Map();
  private readonly CWE_BASE_URL = 'https://cwe.mitre.org/data/definitions';
  private readonly CVE_BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
  private readonly SONARQUBE_BASE_URL = 'https://sonarcloud.io';

  constructor() {
    this.initializeCweData();
  }

  // Initialize with common CWE data
  private initializeCweData() {
    const commonCwes: CweData[] = [
      {
        id: 'CWE-79',
        name: 'Cross-site Scripting (XSS)',
        description: 'The software does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page that is served to other users.',
        url: 'https://cwe.mitre.org/data/definitions/79.html',
        category: 'Injection',
        severity: 'High'
      },
      {
        id: 'CWE-89',
        name: 'SQL Injection',
        description: 'The software constructs all or part of an SQL command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended SQL command when it is sent to a downstream component.',
        url: 'https://cwe.mitre.org/data/definitions/89.html',
        category: 'Injection',
        severity: 'Critical'
      },
      {
        id: 'CWE-78',
        name: 'OS Command Injection',
        description: 'The software constructs all or part of an OS command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended OS command when it is sent to a downstream component.',
        url: 'https://cwe.mitre.org/data/definitions/78.html',
        category: 'Injection',
        severity: 'Critical'
      },
      {
        id: 'CWE-367',
        name: 'Time-of-check Time-of-use (TOCTOU) Race Condition',
        description: 'The software checks the state of a resource before using that resource, but the resource\'s state can change between the check and the use in a way that invalidates the results of the check.',
        url: 'https://cwe.mitre.org/data/definitions/367.html',
        category: 'Race Condition',
        severity: 'Medium'
      },
      {
        id: 'CWE-693',
        name: 'Protection Mechanism Failure',
        description: 'The product does not use or incorrectly uses a protection mechanism that provides sufficient defense against directed attacks against the product.',
        url: 'https://cwe.mitre.org/data/definitions/693.html',
        category: 'Protection Mechanism',
        severity: 'Medium'
      },
      {
        id: 'CWE-22',
        name: 'Path Traversal',
        description: 'The software uses external input to construct a pathname that is intended to identify a file or directory that is located underneath a restricted parent directory, but the software does not properly neutralize special elements within the pathname that can cause the pathname to resolve to a location that is outside of the restricted directory.',
        url: 'https://cwe.mitre.org/data/definitions/22.html',
        category: 'Path Traversal',
        severity: 'High'
      },
      {
        id: 'CWE-352',
        name: 'Cross-Site Request Forgery (CSRF)',
        description: 'The web application does not, or can not, sufficiently verify that a well-formed, valid, consistent request was intentionally provided by the user who submitted the request.',
        url: 'https://cwe.mitre.org/data/definitions/352.html',
        category: 'CSRF',
        severity: 'Medium'
      },
      {
        id: 'CWE-434',
        name: 'Unrestricted Upload of File with Dangerous Type',
        description: 'The software allows the attacker to upload or transfer files of dangerous types that can be automatically processed within the product\'s environment.',
        url: 'https://cwe.mitre.org/data/definitions/434.html',
        category: 'File Upload',
        severity: 'High'
      },
      {
        id: 'CWE-798',
        name: 'Use of Hard-coded Credentials',
        description: 'The software contains hard-coded credentials, such as a password or cryptographic key, which it uses for its own inbound authentication, outbound communication to external components, or encryption of internal data.',
        url: 'https://cwe.mitre.org/data/definitions/798.html',
        category: 'Authentication',
        severity: 'Critical'
      },
      {
        id: 'CWE-311',
        name: 'Missing Encryption of Sensitive Data',
        description: 'The software does not encrypt sensitive or critical information before storage or transmission.',
        url: 'https://cwe.mitre.org/data/definitions/311.html',
        category: 'Cryptography',
        severity: 'High'
      }
    ];

    commonCwes.forEach(cwe => {
      this.cweCache.set(cwe.id, cwe);
    });
  }

  // Get CWE data by ID
  async getCweData(cweId: string): Promise<CweData | null> {
    // Check cache first
    if (this.cweCache.has(cweId)) {
      return this.cweCache.get(cweId)!;
    }

    try {
      // For now, return null if not in cache
      // In a real implementation, you would fetch from MITRE's data
      console.warn(`CWE ${cweId} not found in cache. Consider implementing MITRE data fetching.`);
      return null;
    } catch (error) {
      console.error(`Error fetching CWE data for ${cweId}:`, error);
      return null;
    }
  }

  // Get CVE data by CWE ID
  async getCveDataByCwe(cweId: string): Promise<CveData[]> {
    const cacheKey = `cwe-${cweId}`;
    
    if (this.cveCache.has(cacheKey)) {
      return this.cveCache.get(cacheKey)!;
    }

    try {
      // NVD API call with CWE filter
      const response = await axios.get(this.CVE_BASE_URL, {
        params: {
          cweId: cweId.replace('CWE-', 'CWE-'),
          resultsPerPage: 20,
          startIndex: 0
        },
        headers: {
          'User-Agent': 'SonarQube-Analytics/1.0'
        }
      });

      const cveData: CveData[] = response.data.vulnerabilities?.map((vuln: any) => ({
        id: vuln.cve.id,
        description: vuln.cve.descriptions?.find((desc: any) => desc.lang === 'en')?.value || 'No description available',
        severity: this.extractSeverity(vuln.cve.metrics),
        publishedDate: vuln.cve.published,
        lastModifiedDate: vuln.cve.lastModified,
        cweIds: vuln.cve.weaknesses?.map((weak: any) => `CWE-${weak.value}`) || [],
        url: `https://nvd.nist.gov/vuln/detail/${vuln.cve.id}`
      })) || [];

      this.cveCache.set(cacheKey, cveData);
      return cveData;
    } catch (error) {
      console.error(`Error fetching CVE data for CWE ${cweId}:`, error);
      return [];
    }
  }

  // Extract severity from CVE metrics
  private extractSeverity(metrics: any): string {
    if (metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity) {
      return metrics.cvssMetricV31[0].cvssData.baseSeverity;
    }
    if (metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity) {
      return metrics.cvssMetricV30[0].cvssData.baseSeverity;
    }
    if (metrics?.cvssMetricV2?.[0]?.baseSeverity) {
      return metrics.cvssMetricV2[0].baseSeverity;
    }
    return 'UNKNOWN';
  }

  // Get comprehensive CWE/CVE mapping
  async getCweCveMapping(cweId: string, sonarQubeIssues: string[] = []): Promise<CweCveMapping | null> {
    const cweData = await this.getCweData(cweId);
    if (!cweData) return null;

    const cveData = await this.getCveDataByCwe(cweId);

    return {
      cweId,
      cweData,
      cveData,
      sonarQubeIssues
    };
  }

  // Generate SonarQube issue link
  generateSonarQubeIssueLink(projectKey: string, issueKey: string): string {
    return `${this.SONARQUBE_BASE_URL}/project/issues?id=${projectKey}&open=${issueKey}`;
  }

  // Get all cached CWE data
  getAllCweData(): CweData[] {
    return Array.from(this.cweCache.values());
  }

  // Search CWE data by name or description
  searchCweData(query: string): CweData[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.cweCache.values()).filter(cwe => 
      cwe.name.toLowerCase().includes(lowerQuery) ||
      cwe.description.toLowerCase().includes(lowerQuery) ||
      cwe.id.toLowerCase().includes(lowerQuery)
    );
  }

  // Get CWE statistics
  getCweStatistics(): { total: number; byCategory: Record<string, number>; bySeverity: Record<string, number> } {
    const allCwes = this.getAllCweData();
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    allCwes.forEach(cwe => {
      if (cwe.category) {
        byCategory[cwe.category] = (byCategory[cwe.category] || 0) + 1;
      }
      if (cwe.severity) {
        bySeverity[cwe.severity] = (bySeverity[cwe.severity] || 0) + 1;
      }
    });

    return {
      total: allCwes.length,
      byCategory,
      bySeverity
    };
  }
}

export default new CweCveService();
