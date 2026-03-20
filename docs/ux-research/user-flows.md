# User Flows — Access4U

> Generated using user journey mapping with emotional states, pain points, and opportunities via ux-research-mcp

---

## Flow 1: Developer Fixing Violations

**User Goal:** Fix accessibility violations in a web page
**Starting Point:** Access4U audit page

### Happy Path

`Paste HTML source or enter URL -> Run axe-core scan -> Review violation list by severity -> Select violation for AI explanation -> View before/after code diff -> Copy fix to clipboard -> Apply fix and re-audit`

### Step-by-Step Breakdown

#### Step 1: Paste HTML source or enter URL into the audit input field

- **Touchpoint:** Application interface — input field
- **Emotion:** [~] Neutral
- **Pain Points:** User may be unsure whether to paste full HTML or a URL; no guidance on which input method gives better results
- **Opportunities:** Auto-detect input type (URL vs. HTML); show example placeholder text; support drag-and-drop of .html files

#### Step 2: Run axe-core scan and wait for violation results

- **Touchpoint:** Application interface — scan engine
- **Emotion:** [!] Anxious
- **Pain Points:** No progress indicator during scan causes uncertainty; user does not know if the scan is running, stuck, or complete
- **Opportunities:** Add a progress bar or step indicator (parsing -> scanning -> analyzing); show estimated time for large pages

#### Step 3: Review violation list sorted by severity with summary counts

- **Touchpoint:** Results panel — sort controls
- **Emotion:** [~] Neutral to [-] Frustrated (if count is high)
- **Pain Points:** High violation counts feel overwhelming; severity labels may not match the user's mental model of priority
- **Opportunities:** Show summary statistics (e.g., "3 critical, 5 major, 4 minor") upfront; group by component or page region

#### Step 4: Select a specific violation to view AI-generated explanation

- **Touchpoint:** Violation detail panel
- **Emotion:** [+] Positive (if explanation is clear)
- **Pain Points:** If the explanation uses WCAG jargon, the developer is back to square one
- **Opportunities:** Use layered explanations: one-sentence summary first, expandable detail with WCAG reference and impact description

#### Step 5: View before/after code diff showing the proposed fix

- **Touchpoint:** Diff viewer panel
- **Emotion:** [+] Positive — this is the highest-value moment
- **Pain Points:** Large diffs may be hard to parse; user may worry about unintended side effects
- **Opportunities:** Highlight only the changed lines; show a confidence score for the fix; add a "Why this fix?" tooltip

#### Step 6: Copy the fixed code snippet to clipboard

- **Touchpoint:** Copy button
- **Emotion:** [+] Positive
- **Pain Points:** No visual confirmation that the copy succeeded; unclear whether to copy the full element or just the changed attribute
- **Opportunities:** Show a "Copied!" toast notification; offer "Copy fix only" vs. "Copy full element" options

#### Step 7: Apply fix in code editor and re-audit to verify resolution

- **Touchpoint:** External code editor + re-audit
- **Emotion:** [+] Positive (if violation disappears) / [-] Frustrated (if it persists)
- **Pain Points:** Context switch to code editor breaks flow; re-auditing the full page takes time just to check one fix
- **Opportunities:** Offer a "Verify fix" mode that re-scans only the affected element; provide IDE extension for in-editor application

### Drop-Off Risks

- Step 2: Long scan times with no feedback cause users to close the tab
- Step 3: High violation counts cause users to feel overwhelmed and abandon the audit
- Step 7: Context switch to external editor disrupts flow — users may not return to re-audit

### Recommendations

- Add a progress indicator during scan (Step 2) — this is the highest drop-off risk
- Provide a "Quick Fix" mode that applies fixes in-tool without requiring an external editor
- Show a "fix verified" badge inline after re-audit to give closure without re-scanning the full page
- Consider a VS Code extension that pulls fixes directly into the editor

---

## Flow 2: QA Engineer Exporting Compliance Report

**User Goal:** Export accessibility audit report for compliance documentation
**Starting Point:** Access4U audit page

### Happy Path

`Paste HTML/URL -> Run scan -> Review violation heatmap -> Filter by conformance level -> Review detailed findings -> Select export format -> Download and share report`

### Step-by-Step Breakdown

#### Step 1: Paste HTML source or enter URL into the audit input field

- **Touchpoint:** Application interface — input field
- **Emotion:** [~] Neutral
- **Pain Points:** QA may need to audit multiple pages — no batch URL input
- **Opportunities:** Support batch URL input or sitemap import; save audit history for repeat scans

#### Step 2: Run axe-core scan and wait for violation results

- **Touchpoint:** Application interface — scan engine
- **Emotion:** [~] Neutral
- **Pain Points:** No progress indicator during scan causes uncertainty about completion
- **Opportunities:** Add progress indicator; for batch scans, show per-page progress

#### Step 3: Review violation heatmap showing issue density across page regions

- **Touchpoint:** Heatmap overlay on page preview
- **Emotion:** [~] Neutral
- **Pain Points:** Heatmap may be hard to interpret for dense pages; no way to click a hotspot and jump to violations in that region
- **Opportunities:** Make heatmap interactive — click a region to filter the violation list; add a legend for color intensity

#### Step 4: Filter violations by WCAG conformance level and severity

- **Touchpoint:** Filter controls — dropdowns
- **Emotion:** [~] Neutral
- **Pain Points:** Dropdown filters without defaults require the user to make a selection before seeing any filtered view
- **Opportunities:** Pre-select "Level A + AA" as default (most common compliance target); remember filter preferences across sessions

#### Step 5: Review detailed findings with WCAG criterion references

- **Touchpoint:** Findings panel
- **Emotion:** [~] Neutral to [!] Anxious (if critical violations found)
- **Pain Points:** Findings may not include enough context for the legal team; no way to annotate violations with internal notes
- **Opportunities:** Allow inline annotations for each violation; cross-reference with VPAT template sections automatically

#### Step 6: Select export format (PDF or JSON) for compliance documentation

- **Touchpoint:** Export dialog
- **Emotion:** [~] Neutral
- **Pain Points:** Export options may not match the report format stakeholders expect (e.g., VPAT, WCAG-EM)
- **Opportunities:** Offer template-based export: VPAT, WCAG-EM, custom; let users choose which sections to include

#### Step 7: Download report and share with legal team and stakeholders

- **Touchpoint:** Download + share interface
- **Emotion:** [+] Positive (if report is comprehensive) / [-] Frustrated (if manual editing needed)
- **Pain Points:** Downloaded report may require manual formatting before sharing; no direct sharing option
- **Opportunities:** Generate a shareable link with view-only access; include executive summary section in the PDF

### Drop-Off Risks

- Step 1: No batch input means QA must repeat the entire flow for each page — high friction for multi-page audits
- Step 4: Unclear default filters slow down the workflow
- Step 7: If the export requires manual editing, the tool has failed its core value proposition for this persona

### Recommendations

- Support batch URL scanning with per-page results and a combined summary report
- Pre-select the most common compliance target (WCAG 2.1 AA) as the default filter
- Offer VPAT-compatible export templates out of the box
- Add a "Share report" feature with a unique link for stakeholder review
- Include before/after evidence for resolved violations in the export to prove remediation
