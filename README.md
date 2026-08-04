# FCC Ops Platform Core

A Netlify-ready prototype for the unified Floor Care Concepts operating platform.

## Included in this build

- Universal FCC Ops shell
- Role-based navigation and homepage
- Simulated single-login role/permission switching
- Customer, facility and space records (FacilityDNA foundation)
- Global command search
- Shared tasks and notifications
- Shared document vault and activity timeline
- Standard module navigation
- Module launcher for specialty tools
- Shared workflow/status engine
- Responsive desktop/mobile layouts

## Run locally

```bash
npm install
npm start
```

## Production build

```bash
npm run build
```

## Deploy to Netlify

The repository includes `netlify.toml`. Connect the repository in Netlify and use the detected build settings. Netlify will run `npm run build` and publish the generated `dist` folder.

## Current status

This is a functional front-end platform prototype using realistic sample data and client-side state. Production use should add authentication, permanent database storage, file storage, audit logging, API integrations and row-level permissions.
