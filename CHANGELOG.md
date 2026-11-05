# Changelog

## 1.3.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.2.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-10-21

### Added
- Initial FastAPI/React skeleton (Round 1)
- Health check endpoint `/healthz`
- Dockerfiles for backend and frontend
- docker-compose.yml with Keycloak and persistent volumes
- Feature plan and project structure

## [1.1.0] - 2026-11-05

### Added
- Agentic Skills Catalog API (catalog-api)
  - SQLite-backed catalog with Skill model (name, display_name, description, category, subcategory, tags, version, author, source_url, license)
  - REST endpoints: list (paginated, filterable), get by ID, get by name, create, update, delete, import (bulk)
  - Category and subcategory listing endpoints
  - 15 comprehensive backend tests covering CRUD, pagination, filtering, search, import, and deduplication
- TypeScript types and API client for catalog (frontend)
- SkillCard and SkillList React components with search, filtering, and pagination
- Navigation between Health and Catalog views in frontend
