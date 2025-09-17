# SonarQube Cloud API v2 Documentation

Based on comprehensive analysis of the [SonarQube Cloud API documentation](https://api-docs.sonarsource.com/sonarqube-cloud/default/landing), this document provides detailed information about valid endpoints, their parameters, and usage patterns.

## Authentication

**Method**: Bearer Token Authentication  
**Header**: `Authorization: Bearer <myToken>`  
**Token Generation**: Generated in SonarQube Cloud UI  
**Documentation**: [Managing your tokens](https://docs.sonarsource.com/sonarqube-cloud/managing-your-account/managing-tokens/)

**Example cURL**:
```bash
curl --request GET \
  --url 'https://api.sonarcloud.io' \
  --header 'Authorization: Bearer my_token'
```

## Available API Categories

### 1. Projects API (External)
**Version**: 0.0.1  
**Base URL**: `https://api.sonarcloud.io`  
**Purpose**: External API for projects

#### Endpoints

##### GET /projects
**Description**: Get projects using query parameters  
**Method**: GET  
**Path**: `/projects`

**Parameters**:
- `organizationIds` (array<string>, query): A list of organization IDs to query by
- `ids` (array<string>, query): A list of project IDs (main branch UUIDv4) to query by
- `keys` (array<string>, query): A list of project keys to query by
- `legacyIds` (array<string>, query): A list of legacy component UUIDs (UUIDv1) to query by
- `tags` (array<string>, query): A list of tags to query by
- `pageIndex` (integer, query, default: 1): The 1-based page index to fetch
- `pageSize` (integer, query, default: 50, max: 5,000): The number of projects to return per page

**Requirements**: At least one of `organizationIds`, `ids`, `keys`, or `legacyIds` is required.

**Response Example**:
```json
{
  "projects": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "legacyId": "AZSzBs03XmKf27gD8tHt",
      "key": "project-key",
      "name": "Project Name",
      "visibility": "public",
      "organizationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "description": "string",
      "tags": ["My-Tag"],
      "links": [
        {
          "name": "Project Homepage",
          "url": "https://example.com",
          "type": "string"
        }
      ],
      "createdAt": "2025-09-17T16:57:54.250Z",
      "updatedAt": "2025-09-17T16:57:54.250Z"
    }
  ],
  "page": {
    "pageIndex": 0,
    "pageSize": 0,
    "total": 0
  }
}
```

##### GET /projects/{id}
**Description**: Get a project  
**Method**: GET  
**Path**: `/projects/{id}`

##### GET /project-tags
**Description**: Search project tags  
**Method**: GET  
**Path**: `/project-tags`

### 2. Quality Gates API
**Version**: 1.0.0  
**Purpose**: Quality Gates management

#### Endpoints

##### Quality Gates Management
- `GET /quality-gates` - Search for Quality gates
- `POST /quality-gates` - Create a Quality Gate
- `GET /quality-gates/{id}` - Get a Quality gate
- `DELETE /quality-gates/{id}` - Delete a Quality gate
- `PATCH /quality-gates/{id}` - Patch a Quality gate

##### Project Associations
- `GET /project-associations` - Search for project associations
- `POST /project-associations` - Associate a project with a Quality Gate
- `DELETE /project-associations/{id}` - Delete an association from project to quality gate

##### Quality Gate Conditions
- `GET /conditions` - Get the conditions for a quality gate
- `POST /conditions` - Add a condition to a quality gate
- `DELETE /conditions/{id}` - Delete a quality gate condition
- `PATCH /conditions/{id}` - Update a quality gate condition

##### Quality Gate Defaults
- `GET /quality-gates/defaults/{organizationId}` - Get default quality gate for organization
- `PATCH /quality-gates/defaults/{organizationId}` - Update default quality gate for organization

### 3. Software Quality Reports API
**Version**: 1.0.1  
**Purpose**: Access and download project and portfolio security reports

#### Endpoints

##### Security Reports
- `GET /security-reports` - Returns a security overview report
- `GET /download-security-reports` - Download a security overview report

##### Portfolio Security Reports
- `GET /portfolio-security-reports` - Returns a security overview report for a portfolio
- `GET /portfolio-security-reports-breakdown` - Returns a security report breakdown for a portfolio

### 4. Other Available APIs

#### SCA API
- Software Composition Analysis API

#### Audit logs API
- Audit logging functionality

#### Analysis API
- Code analysis operations

#### Enterprises, Reports, Portfolios, Portfolio Permission Templates API
- Enterprise and portfolio management

#### Organizations API
- Organization management

#### Users & Roles API
- User and role management

## Key Findings from Testing

### ✅ Working Endpoints (Verified)
1. **Projects API**: `/projects/search` - Works with organization parameter
2. **Component Metrics API**: `/measures/component` - Works for detailed metrics
3. **Quality Gate Status API**: `/qualitygates/project_status` - Works for project status

### ❌ Non-Working Endpoints (400 Errors)
1. **Rule Details API**: `/rules/show` - All rule keys return 400 errors
2. **Security Hotspots API**: `/hotspots/search` - Not supported
3. **Rules Search API**: `/rules/search` - Not supported
4. **Issues API with large page sizes**: `/issues/search?ps=1000` - Not supported

### 🔧 Working Parameters
- **Issues API**: Requires `organization=sonar-brettmiller` parameter
- **Page Size**: Limited to small page sizes (10-50), large page sizes (1000) not supported
- **Component Metrics**: Works with comprehensive metric keys

## Recommendations for Implementation

### 1. Use Only Verified Endpoints
- Stick to the working endpoints identified in testing
- Use the Projects API v2 for project information
- Use Component Metrics API for detailed project data
- Use Quality Gates API for quality gate information

### 2. Handle API Limitations
- Implement pagination for large datasets
- Use organization parameter for issues API
- Fall back to alternative data sources when direct CWE mapping isn't available

### 3. Security Analysis Approach
- Use Software Quality Reports API for security reports
- Extract security metrics from component metrics API
- Implement client-side filtering for security-related issues

### 4. Error Handling
- Implement proper error handling for 400/401/403 responses
- Provide fallback mechanisms when APIs are not available
- Display meaningful error messages to users

## Legal Terms

Your use of the SonarQube Cloud APIs are governed by [the Terms of Service](https://www.sonarsource.com/legal/sonarcloud/terms-of-service/), including use of the API and Results Data solely for your internal software development purposes.

## References

- [SonarQube Cloud API Documentation](https://api-docs.sonarsource.com/sonarqube-cloud/default/landing)
- [SonarQube Cloud Web API v1](https://sonarcloud.io/web_api/api) (for capabilities not in v2)
- [Managing your tokens](https://docs.sonarsource.com/sonarqube-cloud/managing-your-account/managing-tokens/)
