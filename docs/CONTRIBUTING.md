# Contributing Guide – Commit Message Standards

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification to keep the Git history clear and predictable. Every commit message should be concise, descriptive, and follow the structure `type(scope): summary`.

## Commit Types
| Type | Description | Example |
| --- | --- | --- |
| `feat` | Adds a new feature or piece of functionality | `feat(auth): implement JWT refresh token` |
| `fix` | Resolves a bug or regression | `fix(api): correct opportunity filter query` |
| `docs` | Documentation-only changes | `docs(readme): update setup instructions` |
| `style` | Code style or formatting updates without logic changes | `style(ui): format Chakra components with Prettier` |
| `refactor` | Structural code changes that preserve behavior | `refactor(routes): simplify Flask blueprint imports` |
| `test` | Adds or updates automated tests | `test(models): add unit tests for user schema` |
| `chore` | Maintenance, tooling, dependency, or configuration updates | `chore(env): update .env.example and config paths` |
| `perf` | Performance improvements | `perf(db): optimize SQLAlchemy join queries` |

## Scopes
The optional `(scope)` segment identifies where the change occurred.

| Scope | Example |
| --- | --- |
| `client` | `feat(client): add volunteer dashboard` |
| `server` | `fix(server): resolve CORS config issue` |
| `timeline` | `docs(timeline): update project milestones` |
| `readme` | `docs(readme): add deployment instructions` |
| `auth` | `feat(auth): add password reset route` |

## Extended Format (Optional)
Use additional bullet points in the commit body when more context helps reviewers:
- Bullet 1: what changed
- Bullet 2: why it changed
- Bullet 3: impact or follow-up

**Example**

```
docs(timeline): add project schedule with team roles

- aligned task ownership with 8-week development plan
- added color-coded Gantt chart and plain-text version
- formatted for PDF submission (Canvas)
```

## Quick Reference
| Task | Commit Example |
| --- | --- |
| Adding a new frontend component | `feat(client): create opportunity list grid` |
| Fixing a server-side bug | `fix(server): correct JWT expiration logic` |
| Updating documentation | `docs(readme): refine setup instructions` |
| Adjusting styles or layout | `style(ui): adjust responsive breakpoints` |
| Updating dependencies | `chore(deps): upgrade Flask and Axios` |

## Commit Philosophy
1. Be consistent: follow this format for every commit.
2. Be concise: keep the summary line to roughly 72 characters.
3. Be informative: explain why the change exists, not just what it does.
4. Group related changes: avoid large commits with unrelated work.
5. Review before pushing: ensure your history tells a coherent story.

## Example Session
```bash
git add .
git commit -m "docs(timeline): finalize VolunteerHub project schedule"
git push origin main
```

Following this convention keeps the history clean, makes changelog generation easier, and improves collaboration across the team.

---

Last updated: October 2025
