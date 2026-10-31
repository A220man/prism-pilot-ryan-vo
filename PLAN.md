# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

catalog-api

## Roadmap

### skeleton — FastAPI/React Skeleton with Health Check

Status: done

Acceptance:
- FastAPI backend serves /healthz endpoint
- React+TypeScript+Vite frontend builds successfully
- Dockerfiles for backend and frontend
- docker-compose.yml with Keycloak and volumes
- Backend tests: health check passes
- Frontend typecheck and build pass

Implementation: `backend/app/main.py`, `backend/app/api/health.py`, `backend/app/core/config.py`, `backend/Dockerfile`, `frontend/src/App.tsx`, `frontend/src/main.tsx`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/Dockerfile`, `frontend/nginx.conf`, `docker-compose.yml`

Tests: `backend/tests/test_health.py`, `frontend/src/App.test.tsx`

### catalog-api — Agentic Skills Catalog API

Status: done

Acceptance:
- SQLite-backed catalog with 2600+ skills schema
- REST endpoints: list, search, detail, import
- Pagination, filtering, validation
- Backend tests for catalog CRUD

Implementation: `backend/app/models/skill.py`, `backend/app/models/__init__.py`, `backend/app/core/database.py`, `backend/app/schemas/skill.py`, `backend/app/schemas/__init__.py`, `backend/app/services/catalog.py`, `backend/app/api/catalog.py`, `backend/app/main.py`

Tests: `backend/tests/test_catalog.py`

### catalog-ui — Catalog Discovery Dashboard

Status: planned

Acceptance:
- React dashboard with skill list/search/detail
- Typed API client from backend routes
- Loading/error/empty states
- Frontend tests for user-visible behavior

### stack-validation — Stack Validation & Planning Engine

Status: planned

Acceptance:
- Deterministic offline validation algorithm
- Agent-owned selection workflow
- Plan export/import
- API + UI integration

### auth-oidc — OIDC/Keycloak Authentication

Status: planned

Acceptance:
- Backend session auth with HttpOnly cookies + CSRF
- Keycloak realm import + SAML broker config
- Frontend login/callback flow
- Auth tests: unauthenticated rejection, role denial

