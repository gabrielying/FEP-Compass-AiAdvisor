---
description: Runs the full planner -> coder -> tester -> citation-auditor -> reviewer -> planner inner loop on any change to FEP-Compass-AiAdvisor (bug fix, feature add/remove, UI/UX revamp, refactor, anything), then hands off to the human for a push/commit decision.
argument-hint: <describe the change you want — anything goes>
---

Run the FEP-Compass-AiAdvisor dev-workflow loop for this task: $ARGUMENTS

You (the orchestrator) drive this loop yourself using the Agent/Task tool to
invoke each subagent by name (`planner`, `coder`, `tester`,
`citation-auditor`, `reviewer`). Subagents return a single summary back to
you — don't re-read files they already covered; treat their summaries as
the handoff artifact. This keeps the loop token efficient: pass condensed
summaries between steps, not full transcripts, and skip any subagent whose
gate the plan marks as not required.

## Control flow

Initialize `i = 0`, `MAX_ITER = 3`.

1. **Invoke `planner`** with the task description (on re-entry, also pass
   the consolidated failure report from step 6). Get back: classification
   tags, target files, implementation steps, and the gates-required table
   (`tester-mode`, `citation-audit`, `cache-bump-needed`,
   `exports-sync-needed`, `new-cdn-dep`).

2. **Invoke `coder`** with the plan.

3. **Invoke `tester`**, passing it the plan's `tester-mode` value. Read its
   verdict line (`TESTER: PASS|FAIL|UNCERTAIN`).

4. **If `citation-audit: required`, invoke `citation-auditor`**; otherwise
   skip this step entirely (don't invoke it just to have it say "not
   applicable" — that wastes tokens for no benefit) and note "citation-audit
   skipped — not flagged by planner" in your running log.

5. **Invoke `reviewer`** (always — it's a cheap, read-only pass). Read its
   verdict line (`REVIEWER: PASS|FAIL`) and its blocking-vs-nit findings.

6. **Evaluate**:
   - If `tester` reported `FAIL`/`UNCERTAIN` on a mandatory gate, or
     `citation-auditor` reported `FAIL`, or `reviewer` reported a
     **blocking** `FAIL`: build a consolidated failure report (which
     agent(s) failed, why, relevant file/line detail) and go to step 1
     with `i += 1`.
   - If `i` has reached `MAX_ITER` and a blocking failure remains: stop
     looping. Report to the user exactly which gate(s) are still failing
     and the last failure detail from each — hand off rather than looping
     further.
   - Otherwise (all mandatory gates pass; reviewer nits are non-blocking):
     proceed to the final handoff.

## Final handoff (always reached, whether by full pass or iteration-cap stop)

1. Run `git status` and `git diff --stat` (read-only) to summarize what
   changed.
2. Present to the user: a short change summary, the gate-results table
   (tester/citation-auditor/reviewer verdicts, noting any skipped), and any
   reviewer nits.
3. **Never run `git add`/`git commit`/`git push` yourself.** Explicitly ask
   the user what they want next — for example: commit/push as-is, send it
   back to `planner` for revisions even though gates passed (the user may
   want a different approach despite a technically-passing diff), or stop
   here and handle it manually. Wait for their answer before taking any
   further action.
