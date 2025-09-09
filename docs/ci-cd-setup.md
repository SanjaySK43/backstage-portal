# CI/CD and GitHub Integration Setup

This document outlines the complete CI/CD pipeline and GitHub integration for the Backstage portal.

## GitHub Actions Workflows

### 1. Continuous Integration (`ci.yml`)
- **Trigger**: Push to any branch, Pull requests
- **Purpose**: Build, test, and validate code changes
- **Steps**:
  - Install dependencies
  - Generate TypeScript declarations
  - Build plugins
  - Run linting and tests
  - Build all packages

### 2. Backend Image Build (`cd-backend-image.yml`)
- **Trigger**: Push to main branch, tags
- **Purpose**: Build and publish Docker images to GitHub Container Registry
- **Steps**:
  - Build backend application
  - Create Docker image
  - Push to GHCR with proper tags

### 3. Frontend Deployment (`deploy-frontend.yml`)
- **Trigger**: Push to main branch, Pull requests
- **Purpose**: Deploy frontend to Netlify
- **Requirements**:
  - `NETLIFY_AUTH_TOKEN` secret
  - `NETLIFY_SITE_ID` secret

### 4. PR Preview (`pr-preview.yml`)
- **Trigger**: Pull request events
- **Purpose**: Create preview deployments for PRs
- **Features**:
  - Unique URL per PR
  - Automatic comments on PRs with preview links

### 5. Security Scanning (`security-scan.yml`)
- **Trigger**: Push to main/develop, PRs, weekly schedule
- **Purpose**: Security vulnerability scanning
- **Tools**:
  - npm audit
  - CodeQL analysis
  - Trivy vulnerability scanner

### 6. Release Management (`release.yml`)
- **Trigger**: Git tags (v*.*.*), manual dispatch
- **Purpose**: Automated releases with Docker images
- **Features**:
  - Automatic changelog generation
  - GitHub releases
  - Docker image publishing

## Plugin Integration

### DeploymentStatusComponent
- Displays GitHub Actions workflow runs
- Shows build status with visual indicators
- Provides links to view detailed logs
- Supports triggering new builds (when connected to GitHub API)

### GitHubActionsComponent
- Lists all GitHub Actions workflows
- Shows workflow status and metadata
- Allows triggering workflows
- Provides direct links to GitHub Actions

### MyGitHubRepoList
- Displays user's GitHub repositories
- Integrates with GitHub authentication
- Shows repository visibility status

## Setup Instructions

### 1. GitHub Secrets Configuration
Add these secrets to your GitHub repository:

```bash
# For Netlify deployment
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id

# GitHub token is automatically provided
GITHUB_TOKEN=automatically_provided
```

### 2. Backstage Configuration
Update `app-config.yaml` with your GitHub integration:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

auth:
  providers:
    github:
      development:
        clientId: ${GITHUB_CLIENT_ID}
        clientSecret: ${GITHUB_CLIENT_SECRET}
```

### 3. Environment Variables
Set these environment variables for local development:

```bash
GITHUB_TOKEN=your_personal_access_token
GITHUB_CLIENT_ID=your_github_app_client_id
GITHUB_CLIENT_SECRET=your_github_app_client_secret
```

## Workflow Triggers

### Automatic Triggers
- **Push to main**: Triggers CI, backend build, frontend deployment
- **Pull requests**: Triggers CI, PR preview, security scan
- **Tags (v*.*.*-)**: Triggers release workflow
- **Weekly schedule**: Triggers security scan

### Manual Triggers
- All workflows support `workflow_dispatch` for manual execution
- Release workflow accepts version input parameter

## Monitoring and Notifications

### GitHub Actions Integration
- Real-time status updates in Backstage plugins
- Direct links to workflow runs
- Visual status indicators (success, failure, in-progress)

### Deployment Status
- Build history with timestamps
- Branch and commit information
- Quick access to logs and rollback options

## Security Features

### Automated Security Scanning
- Dependency vulnerability scanning with npm audit
- Code security analysis with CodeQL
- Container vulnerability scanning with Trivy
- Results uploaded to GitHub Security tab

### Access Control
- Workflows use minimal required permissions
- Secrets are properly scoped
- Container registry authentication via GitHub tokens

## Best Practices

### Branch Protection
Recommended branch protection rules for main branch:
- Require status checks (CI workflow)
- Require up-to-date branches
- Require review from code owners
- Restrict pushes to main branch

### Deployment Strategy
- Feature branches → PR previews
- Main branch → Staging deployment
- Tags → Production releases
- Rollback capability via workflow dispatch

### Monitoring
- Monitor workflow success rates
- Set up notifications for failed deployments
- Regular security scan reviews
- Performance monitoring of deployed applications
