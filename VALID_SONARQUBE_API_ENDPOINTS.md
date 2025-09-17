# Valid SonarQube API Endpoints

## ✅ WORKING Endpoints (200 responses)

### 1. Projects API
- **Endpoint**: `/api/projects/search`
- **Status**: ✅ Working
- **Purpose**: Get list of projects
- **Parameters**: None required

### 2. Component Metrics API
- **Endpoint**: `/api/measures/component`
- **Status**: ✅ Working
- **Purpose**: Get detailed metrics for a component
- **Parameters**: 
  - `component` (required): Project key
  - `metricKeys` (required): Comma-separated list of metrics
- **Available Metrics**: coverage, line_coverage, branch_coverage, bugs, vulnerabilities, code_smells, security_hotspots, violations, etc.

### 3. Quality Gate Status API
- **Endpoint**: `/api/qualitygates/project_status`
- **Status**: ✅ Working
- **Purpose**: Get quality gate status for a project
- **Parameters**: 
  - `projectKey` (required): Project key

### 4. Issues Search API (Limited)
- **Endpoint**: `/api/issues/search`
- **Status**: ✅ Working (with restrictions)
- **Purpose**: Get issues
- **Parameters**: 
  - `organization=sonar-brettmiller` (required)
  - `ps=10` (small page size only)
- **Restrictions**: 
  - Must include organization parameter
  - Large page sizes (1000) not supported
  - Medium page sizes (100) not supported

## ❌ FAILING Endpoints (400 responses)

### 1. Rule Details API
- **Endpoint**: `/api/rules/show`
- **Status**: ❌ Failing
- **Issue**: All rule keys return 400 errors
- **Impact**: Cannot get CWE information from rules

### 2. Security Hotspots API
- **Endpoint**: `/api/hotspots/search`
- **Status**: ❌ Failing
- **Issue**: Not supported by this SonarQube instance
- **Impact**: Cannot get security hotspots data

### 3. Rules Search API
- **Endpoint**: `/api/rules/search`
- **Status**: ❌ Failing
- **Issue**: Not supported by this SonarQube instance
- **Impact**: Cannot search for security-related rules

### 4. Issues Search API (Large Page Sizes)
- **Endpoint**: `/api/issues/search?ps=1000`
- **Status**: ❌ Failing
- **Issue**: Large page sizes not supported
- **Impact**: Limited to small page sizes only

## 🎯 Available Data Sources for CWE Analysis

### What We CAN Get:
1. **Basic Issue Data**: 89 total issues, 13 vulnerabilities, 7 blocker issues
2. **Component Metrics**: Including `security_hotspots` metric from measures API
3. **Project Information**: 4 projects with analysis data
4. **Quality Gate Status**: For each project

### What We CANNOT Get:
1. **CWE Mappings**: Rule details API completely fails
2. **Security Hotspots**: Dedicated API not supported
3. **Rule Information**: Cannot get rule details or search rules
4. **Large Issue Sets**: Limited to small page sizes

## 🔧 Recommended Approach

Use only the working endpoints and focus on:
1. **Component Metrics**: Extract security_hotspots from measures API
2. **Basic Issue Analysis**: Use the limited issues API with organization parameter
3. **Project-Level Data**: Use quality gate and measures data
4. **Fallback Strategy**: When CWE data isn't available, show meaningful alternatives
