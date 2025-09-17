# CWE Mapping Strategy for SonarQube Analytics

## 🎯 **Objective**
Map SonarQube rules to CWE (Common Weakness Enumeration) numbers to provide comprehensive security analysis with industry-standard vulnerability classifications.

## 📊 **Current Situation Analysis**

### ✅ **What We Know Works**
- `/api/issues/search` - Returns issues with rule keys
- `/api/measures/component` - Returns project metrics
- `/api/qualitygates/project_status` - Returns quality gate status

### ❌ **What's Not Working**
- `/api/rules/show` - Returns 400 errors for all rule keys
- `/api/rules/search` - Limited functionality, doesn't support CWE tag filtering
- `/api/hotspots/search` - Not supported in this SonarQube instance

### 🔍 **Key Insight from Terminal Logs**
```
Received Response from the Target: 400 /api/rules/show?key=javascript:S6551
Received Response from the Target: 400 /api/rules/show?key=jssecurity:S3649
Received Response from the Target: 400 /api/rules/show?key=java:S1481
```

## 🚀 **Multi-Strategy CWE Mapping Plan**

### **Phase 1: Direct API Approach**
1. **Test `/api/rules/search` with CWE tags**
   - Try: `GET /api/rules/search?tags=cwe`
   - Try: `GET /api/rules/search?q=cwe`
   - Try: `GET /api/rules/search?f=tags&tags=cwe`

2. **Test alternative rule endpoints**
   - Try: `/api/rules/list` (if available)
   - Try: `/api/rules/search?f=name,description,tags`

### **Phase 2: Pattern-Based Detection**
1. **Rule Key Pattern Analysis**
   - Analyze rule keys for CWE patterns (e.g., `S3649` might map to CWE-3649)
   - Look for security-related prefixes (`jssecurity:`, `javasecurity:`)

2. **Issue Message Analysis**
   - Parse issue messages for CWE references
   - Look for patterns like "CWE-1234" in descriptions

3. **Rule Name/Description Analysis**
   - Search for CWE numbers in rule names and descriptions
   - Use regex patterns to extract CWE references

### **Phase 3: Static Mapping Database**
1. **Create Known CWE Mappings**
   - Build a database of known SonarQube rule → CWE mappings
   - Include common rules like:
     - `java:S3649` → CWE-3649 (SQL Injection)
     - `javascript:S2083` → CWE-2083 (Time-of-check Time-of-use)
     - `jssecurity:S3649` → CWE-3649 (SQL Injection)

2. **Community Mappings**
   - Research SonarQube community CWE mappings
   - Use OWASP Top 10 mappings
   - Include SANS Top 25 mappings

### **Phase 4: Hybrid Approach**
1. **Combine All Methods**
   - Use API results when available
   - Fall back to pattern detection
   - Use static mappings as final fallback
   - Provide confidence levels for each mapping

2. **Machine Learning Enhancement**
   - Train models on rule descriptions → CWE mappings
   - Use semantic similarity for unknown rules

## 🛠 **Implementation Strategy**

### **Step 1: API Testing**
```typescript
// Test different rule search approaches
async testRuleSearchMethods() {
  const methods = [
    '/api/rules/search?tags=cwe',
    '/api/rules/search?q=cwe',
    '/api/rules/search?f=tags&tags=cwe',
    '/api/rules/search?f=name,description,tags&q=security',
    '/api/rules/list?f=name,description,tags'
  ];
  
  for (const method of methods) {
    try {
      const response = await this.api.get(method);
      console.log(`✅ ${method}:`, response.data);
    } catch (error) {
      console.log(`❌ ${method}:`, error.response?.status);
    }
  }
}
```

### **Step 2: Pattern Detection**
```typescript
// Extract CWE numbers from rule keys and descriptions
extractCweFromRule(ruleKey: string, description: string): string[] {
  const cweNumbers: string[] = [];
  
  // Pattern 1: Rule key contains CWE number
  const ruleKeyMatch = ruleKey.match(/S(\d{4})/);
  if (ruleKeyMatch) {
    cweNumbers.push(`CWE-${ruleKeyMatch[1]}`);
  }
  
  // Pattern 2: Description contains CWE reference
  const cweMatches = description.match(/CWE-(\d{4})/g);
  if (cweMatches) {
    cweNumbers.push(...cweMatches);
  }
  
  return [...new Set(cweNumbers)];
}
```

### **Step 3: Static Mapping**
```typescript
// Known rule to CWE mappings
const KNOWN_CWE_MAPPINGS = {
  'java:S3649': 'CWE-3649', // SQL Injection
  'javascript:S2083': 'CWE-2083', // Time-of-check Time-of-use
  'jssecurity:S3649': 'CWE-3649', // SQL Injection
  'javasecurity:S5131': 'CWE-5131', // Cross-Site Scripting
  // ... more mappings
};
```

### **Step 4: Enhanced CWE Analysis**
```typescript
// Enhanced CWE analysis with multiple detection methods
async getEnhancedCweMapping(projectKey?: string): Promise<CweMappingResult> {
  const results = await Promise.allSettled([
    this.getCweFromRuleSearch(),
    this.getCweFromPatternDetection(),
    this.getCweFromStaticMapping()
  ]);
  
  return this.mergeCweResults(results);
}
```

## 📈 **Expected Outcomes**

### **Immediate Benefits**
- CWE-mapped security issues
- Industry-standard vulnerability classifications
- Better security reporting and compliance

### **Long-term Benefits**
- Integration with security tools
- Compliance reporting (SOC2, PCI-DSS, etc.)
- Enhanced security training and awareness

## 🔄 **Fallback Strategy**

If direct CWE mapping fails:
1. **Security Issue Categorization**: Group issues by security patterns
2. **OWASP Top 10 Mapping**: Map to OWASP categories
3. **Severity-Based Analysis**: Focus on high-severity security issues
4. **Custom Security Tags**: Create internal security classifications

## 📋 **Success Metrics**

- **Coverage**: % of security issues with CWE mappings
- **Accuracy**: % of mappings verified against known CWE database
- **Performance**: API response times for CWE detection
- **User Value**: User engagement with CWE analysis features

## 🚀 **Next Steps**

1. **Implement API testing** for rule search methods
2. **Build pattern detection** for CWE extraction
3. **Create static mapping** database
4. **Integrate hybrid approach** into existing UI
5. **Add CWE-specific filtering** and analysis features
6. **Test with real project data** and validate results

---

*This strategy provides multiple approaches to achieve CWE mapping, ensuring we can provide valuable security analysis even if some API endpoints are unavailable.*
