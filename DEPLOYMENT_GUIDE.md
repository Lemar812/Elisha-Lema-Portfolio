# Deployment Guide (Frontend Only)

This project is now frontend-only. There is no backend, admin dashboard, or database.

## Build
1. Install dependencies:
   - `npm install`
2. Build the site:
   - `npm run build`

## Netlify Deployment
1. New site from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

## Local Preview
- `npm run preview`

## Contact Form
The contact form uses EmailJS in the browser. Make sure the EmailJS public key and service/template IDs in the code are valid.
