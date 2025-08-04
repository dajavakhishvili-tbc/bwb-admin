# GitHub Pages Deployment Guide

This guide will help you deploy your Angular application to GitHub Pages for free.

## Prerequisites

1. Make sure your code is pushed to a GitHub repository
2. Ensure you have Node.js and npm installed

## Steps to Deploy

### 1. Install Dependencies
```bash
npm install
```

### 2. Build and Deploy
```bash
npm run deploy
```

This command will:
- Build your Angular application for production
- Deploy it to GitHub Pages
- Create a `gh-pages` branch with your built application

### 3. Configure GitHub Pages

After running the deploy command:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch
6. Click "Save"

### 4. Access Your Application

Your application will be available at:
`https://[your-username].github.io/bwb-admin/`

## Notes

- The deployment uses the repository name `bwb-admin` as the base path
- If you change your repository name, update the `baseHref` in `angular.json`
- The first deployment may take a few minutes to become available
- Subsequent deployments will update the live site automatically

## Troubleshooting

If you encounter issues:

1. Make sure you have write access to the repository
2. Check that the `gh-pages` branch was created
3. Verify GitHub Pages is enabled in repository settings
4. Wait a few minutes for the first deployment to complete 