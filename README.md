# FCC Ops

Production operating system for Floor Care Concepts / The Sports Floor Pros.

## Connected lifecycle

Customer and FacilityDNA → Sales Request → Quote Playbook → Proposal approval → Project and OrderDNA → Purchasing → Receiving → Warehouse and staging → FinishLine delivery / field proof → ContractOps and accounting readiness.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Release gate

`npm run check && npm run build`

The application is deployed by Netlify from `main`. Database functions, row-level security and storage are maintained in the dedicated FCC Ops Supabase project.
