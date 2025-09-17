# SonarQube Cloud API Analysis - Comprehensive Documentation

## Overview
This document provides a comprehensive analysis of the SonarQube Cloud API endpoints, specifically focusing on CWE (Common Weakness Enumeration) and security-related data extraction capabilities.

## Key Findings

### 🎯 **Critical Discovery: CWE Support in Issues API**
The most important finding is that the **`/api/issues/search`** endpoint has **direct CWE support**:

- **Parameter**: `cwe` - Comma-separated list of CWE identifiers
- **Usage**: `cwe=12,125,unknown` (where 'unknown' selects issues not associated to any CWE)
- **Facets**: `cwe` facet can be computed to get CWE distribution data

This means we can directly query SonarQube for issues associated with specific CWE numbers!

---

## API Endpoints Analysis

### 1. **GET /api/issues/search** - Primary CWE Data Source

**Purpose**: Search for issues with comprehensive filtering capabilities including CWE support.

**Key Parameters for CWE Analysis**:
- `cwe` (optional): Comma-separated list of CWE identifiers. Use 'unknown' to select issues not associated to any CWE
- `facets` (optional): Include `cwe` to get CWE distribution data
- `organization` (optional): Organization key
- `componentKeys` (optional): Comma-separated list of component keys
- `types` (optional): Filter by issue types (BUG, VULNERABILITY, CODE_SMELL, SECURITY_HOTSPOT)
- `severities` (optional): Filter by severities (INFO, MINOR, MAJOR, CRITICAL, BLOCKER)
- `tags` (optional): Filter by tags (e.g., 'security,convention')
- `sonarsourceSecurity` (optional): Filter by SonarSource security categories
- `owaspTop10` (optional): Filter by OWASP Top 10 categories
- `owaspTop10-2021` (optional): Filter by OWASP Top 10 2021 categories
- `owaspMobileTop10-2024` (optional): Filter by OWASP Mobile Top 10 2024 categories

**Security-Related Facets Available**:
- `cwe` - CWE distribution
- `owaspTop10` - OWASP Top 10 distribution
- `owaspTop10-2021` - OWASP Top 10 2021 distribution
- `owaspMobileTop10-2024` - OWASP Mobile Top 10 2024 distribution
- `sonarsourceSecurity` - SonarSource security categories
- `impactSoftwareQualities` - Software quality impacts
- `impactSeverities` - Impact severities
- `cleanCodeAttributeCategories` - Clean Code attribute categories

**Response Structure**:
```json
{
  "paging": {
    "pageIndex": 1,
    "pageSize": 100,
    "total": 1
  },
  "issues": [
    {
      "key": "issue-key",
      "component": "component-key",
      "project": "project-key",
      "rule": "rule-key",
      "severity": "CRITICAL",
      "type": "VULNERABILITY",
      "message": "Issue description",
      "tags": ["security", "cwe-79"],
      "cwe": ["CWE-79"], // CWE numbers if available
      "sonarsourceSecurity": ["xss"],
      "owaspTop10": ["a3"],
      "impacts": [
        {
          "softwareQuality": "SECURITY",
          "severity": "HIGH"
        }
      ]
    }
  ],
  "facets": [
    {
      "property": "cwe",
      "values": [
        {
          "val": "CWE-79",
          "count": 5
        }
      ]
    }
  ]
}
```

### 2. **GET /api/issues/tags** - Issue Tags Management

**Purpose**: List tags matching a given query.

**Parameters**:
- `organization` (optional): Organization key
- `project` (optional): Project key
- `ps` (optional): Page size (max 100, default 10)
- `q` (optional): Search query for tags

**Use Case**: Discover available security-related tags that might indicate CWE associations.

### 3. **GET /api/rules/search** - Rule Information with CWE Support

**Purpose**: Search for rules with CWE filtering capabilities.

**Key Parameters for CWE Analysis**:
- `cwe` (optional): Comma-separated list of CWE identifiers. Use 'unknown' to select rules not associated to any CWE
- `facets` (optional): Include `cwe` to get CWE distribution data
- `types` (optional): Filter by rule types (BUG, VULNERABILITY, CODE_SMELL, SECURITY_HOTSPOT)
- `severities` (optional): Filter by rule severities
- `tags` (optional): Filter by rule tags
- `sonarsourceSecurity` (optional): Filter by SonarSource security categories
- `owaspTop10` (optional): Filter by OWASP Top 10 categories
- `languages` (optional): Filter by programming languages

**Security-Related Facets**:
- `cwe` - CWE distribution across rules
- `owaspTop10` - OWASP Top 10 distribution
- `owaspTop10-2021` - OWASP Top 10 2021 distribution
- `owaspMobileTop10-2024` - OWASP Mobile Top 10 2024 distribution
- `sonarsourceSecurity` - SonarSource security categories
- `impactSoftwareQualities` - Software quality impacts
- `impactSeverities` - Impact severities
- `cleanCodeAttributeCategories` - Clean Code attribute categories

**Response Fields**:
- `securityStandards` - Security standards compliance
- `tags` - Rule tags (may include CWE references)
- `cwe` - CWE identifiers associated with the rule
- `impacts` - Software quality impacts
- `cleanCodeAttribute` - Clean Code attributes

---

## Security Standards and Classifications

### OWASP Top 10 Categories
- `a1` - Broken Access Control
- `a2` - Cryptographic Failures
- `a3` - Injection
- `a4` - Insecure Design
- `a5` - Security Misconfiguration
- `a6` - Vulnerable and Outdated Components
- `a7` - Identification and Authentication Failures
- `a8` - Software and Data Integrity Failures
- `a9` - Security Logging and Monitoring Failures
- `a10` - Server-Side Request Forgery (SSRF)

### OWASP Mobile Top 10 2024 Categories
- `m1` - Improper Platform Usage
- `m2` - Insecure Data Storage
- `m3` - Insecure Communication
- `m4` - Insecure Authentication
- `m5` - Insufficient Cryptography
- `m6` - Insecure Authorization
- `m7` - Client Code Quality
- `m8` - Code Tampering
- `m9` - Reverse Engineering
- `m10` - Extraneous Functionality

### SonarSource Security Categories
- `buffer-overflow` - Buffer overflow vulnerabilities
- `permission` - Permission-related issues
- `sql-injection` - SQL injection vulnerabilities
- `command-injection` - Command injection vulnerabilities
- `path-traversal-injection` - Path traversal vulnerabilities
- `ldap-injection` - LDAP injection vulnerabilities
- `xpath-injection` - XPath injection vulnerabilities
- `rce` - Remote Code Execution
- `dos` - Denial of Service
- `ssrf` - Server-Side Request Forgery
- `csrf` - Cross-Site Request Forgery
- `xss` - Cross-Site Scripting
- `log-injection` - Log injection vulnerabilities
- `http-response-splitting` - HTTP response splitting
- `open-redirect` - Open redirect vulnerabilities
- `xxe` - XML External Entity
- `object-injection` - Object injection vulnerabilities
- `weak-cryptography` - Weak cryptography
- `auth` - Authentication issues
- `insecure-conf` - Insecure configuration
- `encrypt-data` - Data encryption issues
- `traceability` - Traceability issues
- `file-manipulation` - File manipulation issues
- `others` - Other security issues

---

## Implementation Strategy

### 1. **Direct CWE Querying**
```javascript
// Query issues by specific CWE
const cweIssues = await api.get('/issues/search', {
  params: {
    cwe: 'CWE-79,CWE-89,CWE-78', // XSS, SQL Injection, OS Command Injection
    facets: 'cwe,owaspTop10,sonarsourceSecurity',
    types: 'VULNERABILITY',
    organization: 'sonar-brettmiller'
  }
});
```

### 2. **CWE Distribution Analysis**
```javascript
// Get CWE distribution across all issues
const cweDistribution = await api.get('/issues/search', {
  params: {
    facets: 'cwe',
    organization: 'sonar-brettmiller',
    ps: 1 // Minimal data, just need facets
  }
});
```

### 3. **Rule-to-CWE Mapping**
```javascript
// Get rules associated with specific CWEs
const cweRules = await api.get('/rules/search', {
  params: {
    cwe: 'CWE-79,CWE-89',
    facets: 'cwe,languages,severities',
    types: 'VULNERABILITY'
  }
});
```

### 4. **Comprehensive Security Analysis**
```javascript
// Get comprehensive security data
const securityAnalysis = await api.get('/issues/search', {
  params: {
    facets: 'cwe,owaspTop10,sonarsourceSecurity,impactSoftwareQualities,impactSeverities',
    types: 'VULNERABILITY,SECURITY_HOTSPOT',
    organization: 'sonar-brettmiller'
  }
});
```

---

## Additional Relevant Endpoints

### 4. **GET /api/hotspots/search** - Security Hotspots
- **Purpose**: Search for security hotspots
- **CWE Relevance**: Security hotspots may be associated with CWEs
- **Parameters**: Similar to issues/search with hotspot-specific filters

### 5. **GET /api/measures/component** - Project Metrics
- **Purpose**: Get component measures including security metrics
- **CWE Relevance**: Provides overall security metrics that complement CWE analysis
- **Key Metrics**: `security_hotspots`, `vulnerabilities`, `security_rating`

### 6. **GET /api/qualitygates/project_status** - Quality Gate Status
- **Purpose**: Get quality gate status for projects
- **CWE Relevance**: Quality gates may include security-related conditions

---

## Data Flow for CWE Analysis

1. **Discovery Phase**:
   - Query `/api/issues/tags` to discover available security tags
   - Query `/api/rules/search` with `facets=cwe` to get CWE distribution

2. **Analysis Phase**:
   - Query `/api/issues/search` with specific CWE filters
   - Use `facets=cwe,owaspTop10,sonarsourceSecurity` for comprehensive analysis

3. **Mapping Phase**:
   - Cross-reference issues with rules using `/api/rules/search`
   - Build CWE-to-rule mappings for pattern recognition

4. **Reporting Phase**:
   - Aggregate CWE data by project, severity, and type
   - Generate security reports with CWE classifications

---

## Recommendations

### 1. **Immediate Implementation**
- Implement direct CWE querying using the `cwe` parameter
- Add CWE facets to existing issue queries
- Create CWE distribution dashboards

### 2. **Enhanced Analysis**
- Build rule-to-CWE mapping database
- Implement OWASP Top 10 and SonarSource security category analysis
- Create comprehensive security reporting with CWE classifications

### 3. **Integration Opportunities**
- Link CWE data with external CVE databases
- Integrate with MITRE CWE database for detailed descriptions
- Create security trend analysis over time

---

## Conclusion

The SonarQube Cloud API provides **comprehensive CWE support** through the `/api/issues/search` endpoint, making it possible to:

1. **Directly query issues by CWE number**
2. **Get CWE distribution data through facets**
3. **Filter by multiple security standards** (OWASP, SonarSource)
4. **Build comprehensive security analysis dashboards**

This discovery significantly enhances our ability to perform detailed CWE analysis and provides a solid foundation for building advanced security reporting capabilities.

---

## References

- [SonarQube Cloud API - Issues](https://sonarcloud.io/web_api/api/issues?deprecated=false)
- [SonarQube Cloud API - Issues Search](https://sonarcloud.io/web_api/api/issues/search?deprecated=false&section=response)
- [SonarQube Cloud API - Issues Tags](https://sonarcloud.io/web_api/api/issues/tags?deprecated=false&section=response)
- [SonarQube Cloud API - Rules Search](https://sonarcloud.io/web_api/api/rules/search?deprecated=false&section=response)
- [MITRE CWE Database](https://cwe.mitre.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
