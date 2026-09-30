# Neon Operations (rsvp)
**Recorded:** 2026-10-01 · **Access:** `neonctl` v7.0.1, OAuth-authenticated (org `CPM` / `org-bold-night-79330959`) via the Neon skills installed 2026-10-01 (`npx neon@latest skills -s neon -s neon-postgres -y`) ·
**Project:** `CP-RSVP` (`lucky-shadow-38593155`), region `aws-ap-southeast-1` (Singapore — matches Vercel `sin1`)
**Branch:** `[default] production` (`br-long-dream-azdu52ah`) — our `DATABASE_URL` targets the pooling endpoint of this branch.

## What this unlocks for M11 (ship)
1. **Refuse-list safety before any destructive test** — capture a restore point / note the PITR window before wiping test RSVP rows.
2. **Branch-first workflow** — schema experiments (e.g. the deferred `pgEnum`/`text` alignment) happen on a throwaway branch: `neonctl branches create --project-id lucky-shadow-38593155 --name experiment/x`, then `b: delete`.
3. **Ops checks from the skill docs** — pooled vs direct endpoints, compute sizing/scale-to-zero behavior, IP allow (defaults fine), instant-restore on the free tier (7-day window).

## Conventions
- All neonctl calls are pinned `--project-id lucky-shadow-38593155 --org-id org-bold-night-79330959` (scriptable, no prompts).
- Any destructive action (branch delete, role reset) gets an explicit line in the commit/deploy notes.
