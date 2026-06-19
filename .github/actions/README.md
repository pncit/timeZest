# Local composite actions

These are **local mirrors** of composite actions from the private
[`pncit/shared-actions`](https://github.com/pncit/shared-actions) repo.

## Why they're copied here

`timezest` is a **public** repository. GitHub does not allow a public repo to
reference actions that live in a **private** repo, so it cannot `uses:`
`pncit/shared-actions/...` directly (the workflow fails with
`Unable to resolve action pncit/shared-actions, not found`). Copying the
actions into this repo under `.github/actions/` sidesteps that — a repo-local
action (`uses: ./.github/actions/<name>`) has no visibility restriction.

## Keeping them in sync (manual)

When the upstream action changes in `pncit/shared-actions`, re-copy it here and
re-apply the small public-repo tweaks noted in each file's header comment.

| local action | upstream | public-repo tweaks |
|---|---|---|
| `validate-codebase/action.yml` | `pncit/shared-actions/.github/actions/validate-codebase` | `npm-token` made optional (deps are public) |

## Intentionally NOT mirrored

- **`verify-node-toolchain`** — it reads org-level Actions variables
  (`NODE_MAJOR_VERSION` / `NPM_MAJOR_VERSION`) that may not be visible to a
  public repo, and `actions/setup-node` with `.nvmrc` already pins the Node
  version in every job, making the check redundant here.
