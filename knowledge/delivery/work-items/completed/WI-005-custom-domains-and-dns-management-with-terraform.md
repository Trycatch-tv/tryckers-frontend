---
type: chore
id: WI-005
title: Custom Domains and DNS Management with Terraform
status: completed
work_type: chore
created_at: '2026-11-18'
ready_at: '2026-11-18'
completed_at: '2026-11-18'
source:
  type: manual
  inferred: false
generated_by: work-item-agent
refined_by: work-item-agent
project_state: ai-assisted
affected_modules:
  - core
domains:
  - infrastructure
  - frontend
  - backend
  - delivery
code:
  - infra/provider.tf
  - infra/variables.tf
  - infra/main.tf
  - infra/outputs.tf
  - infra/netlify-dns.tf
  - infra/amplify-domains.tf
  - infra/certificates.tf
  - infra/README.md
  - infra/terraform.tfvars.example
summary: Configurar dominios personalizados (tryckers.trycatch.tv y api.tryckers.trycatch.tv) mediante Terraform reutilizando la zona DNS existente en Netlify, AWS Amplify, ACM (us-east-1) y CloudFront, actualizando API_BASE_URL y CORS sin migrar DNS a Route 53 ni destruir recursos existentes.
---

# WI-005 — Custom Domains and DNS Management with Terraform

## Verified Evidence
- Frontend custom domain live at `https://tryckers.trycatch.tv` (`HTTP 200`), Amplify Job 9 `SUCCEED`, bundle `chunk-BVXUVWND.js` configured with `https://api.tryckers.trycatch.tv/api/v1` and `0` references to `localhost:8080`.
- Backend custom domain live at `https://api.tryckers.trycatch.tv` with ACM `us-east-1` (`ISSUED`), CloudFront `EFOD1XGZJFR40` (`Deployed`), and CORS allowing `https://tryckers.trycatch.tv`.

## Acceptance Criteria
- [x] AC-01 through AC-26 verified and completed.
