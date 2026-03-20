# Heuristic Evaluation — Accessibility Fixer UI

> Generated using Nielsen's 10 Usability Heuristics framework via ux-research-mcp

**UI Analyzed:** Accessibility Fixer is a web application with a dark-themed split-view interface. Left panel contains an HTML source input with a Run Audit button. Right panel shows a violation list with severity badges, an expandable AI explanation panel, and a before/after code diff viewer. Top navigation has icon-only buttons for settings, export, and help. The violation heatmap overlay highlights issue locations on a page preview. Error states show red banners with technical error messages. There is no undo for applied fixes. No breadcrumbs or indication of audit history. Filter and sort controls use dropdown menus without default selections.

**Context:** Developer tool for web accessibility auditing and remediation, used by frontend developers, designers, and QA engineers

**Overall Score:** 66/100

Moderate usability concerns detected. 4 heuristic violations and 4 warnings identified. Prioritize critical and major issues for the biggest UX improvements.

---

## Severity Distribution

| Critical | Major | Minor | Cosmetic |
|----------|-------|-------|----------|
| 1 | 4 | 5 | 1 |

## Top Recommendations

1. **[CRITICAL]** User Control and Freedom: Provide undo for destructive actions or allow recovery through a grace period
2. **[MAJOR]** Visibility of System Status: Display real-time status updates during scan (e.g., "Parsing...", "Scanning...", "Analyzing...")
3. **[MAJOR]** Match Between System and Real World: Replace technical WCAG jargon with plain language users understand
4. **[MAJOR]** Help Users Recognize, Diagnose, and Recover from Errors: Write error messages that explain the problem in plain language and suggest next steps
5. **[MAJOR]** Help Users Recognize, Diagnose, and Recover from Errors: Translate technical errors into user-friendly messages with clear recovery steps

---

## Heuristic Results

### 1. Visibility of System Status [FAIL] (6/10)

*The system should keep users informed about what is going on through timely feedback.*

- **[MAJOR]** System state changes may not be communicated to the user
  - *Recommendation:* Display real-time status updates during the audit scan. Show a progress indicator with stages: "Parsing HTML" -> "Running axe-core" -> "Generating fixes" -> "Complete." After copying a fix, show a "Copied!" confirmation. When re-auditing, show which violations were resolved.

### 2. Match Between System and Real World [FAIL] (4/10)

*The system should use language and concepts familiar to the user, not system-oriented terms.*

- **[MAJOR]** Technical jargon used instead of user-friendly language
  - *Recommendation:* Replace WCAG criterion codes (e.g., "SC 1.3.1") with plain-language descriptions in the primary UI. Show the technical reference in an expandable detail section for users who want it. Use labels like "Missing form label" instead of "3.3.2 Labels or Instructions."
- **[MINOR]** Icons or symbols may not match user mental models
  - *Recommendation:* The icon-only buttons in the top navigation (settings, export, help) should be paired with text labels. Use familiar, standard icons — a gear for settings, a download arrow for export, a question mark for help.

### 3. User Control and Freedom [FAIL] (1/10)

*Users need a clearly marked "emergency exit" to leave unwanted states without extended dialog.*

- **[CRITICAL]** No undo functionality for applied fixes
  - *Recommendation:* Provide an undo option for every applied fix. Implement a "Fix History" panel that shows all changes made during the session. Allow users to revert individual fixes or restore the original HTML. Use a grace period pattern: "Fix applied. Undo (5s)" before the change is finalized.
- **[MINOR]** Collapsible panels and overlays may lack clear dismiss options
  - *Recommendation:* Ensure the explanation panel and heatmap overlay can be closed via an X button, the Escape key, and (for modals) clicking outside. Add a "Clear all" button that resets the workspace to its initial state with a confirmation dialog.

### 4. Consistency and Standards [WARN] (8/10)

*Users should not have to wonder whether different words, situations, or actions mean the same thing.*

- **[MINOR]** Interface may deviate from platform conventions users expect
  - *Recommendation:* Follow established developer tool conventions: put the input on the left or top, results below or on the right. Use consistent terminology — if "violation" is used in one place, don't call it an "issue" or "error" elsewhere. Standardize button styles, spacing, and interaction patterns across all panels.

### 5. Error Prevention [PASS] (10/10)

*Design to prevent problems from occurring in the first place.*

No violations detected. The input field accepts both URL and HTML, reducing the chance of input format errors.

### 6. Recognition Rather Than Recall [WARN] (8/10)

*Minimize user memory load by making objects, actions, and options visible.*

- **[MINOR]** Important actions may be hidden behind overflow menus
  - *Recommendation:* Surface the most common actions directly in the violation list: "Copy Fix", "View Diff", "Mark as Resolved." Do not hide these behind a "..." overflow menu. Add audit history so users can re-visit previous scans without re-entering URLs.

### 7. Flexibility and Efficiency of Use [WARN] (9/10)

*Accelerators — unseen by novices — may speed up interaction for expert users.*

- **[COSMETIC]** Limited ability to customize or personalize the interface
  - *Recommendation:* Add keyboard shortcuts for common actions (e.g., `Cmd+Enter` to run audit, `Cmd+C` to copy fix, `J/K` to navigate violations). Allow users to save filter presets. Support URL parameters for pre-configured audit settings.

### 8. Aesthetic and Minimalist Design [WARN] (8/10)

*Interfaces should not contain information that is irrelevant or rarely needed.*

- **[MINOR]** Unnecessary elements compete for user attention
  - *Recommendation:* Use progressive disclosure: show the violation summary first, expand to full details on click. Hide advanced options (export format, filter by conformance level) behind an "Advanced" toggle for the developer persona. Keep the designer persona's view focused on high-impact issues with plain-language explanations.

### 9. Help Users Recognize, Diagnose, and Recover from Errors [FAIL] (2/10)

*Error messages should be expressed in plain language, indicate the problem, and suggest a solution.*

- **[MAJOR]** Error messages do not clearly explain what went wrong
  - *Recommendation:* Replace "Error occurred" with specific, actionable messages: "Could not reach the URL — check that the page is publicly accessible" or "The HTML could not be parsed — ensure you pasted the complete source code." Include a "Try Again" button.
- **[MAJOR]** Technical or cryptic error codes shown without explanation
  - *Recommendation:* Translate all technical errors into user-friendly messages. Instead of HTTP status codes or stack traces, show: "The page returned an error (404 — page not found). Check the URL and try again." Log technical details to the browser console for debugging, not the UI.

### 10. Help and Documentation [PASS] (10/10)

*Even though it is better if the system can be used without documentation, help should be available.*

No violations detected. The help button in the top navigation provides access to documentation.

---

## Summary

The most critical usability issue is the lack of undo for applied fixes (Heuristic 3, score: 1/10). In a tool where users modify their HTML based on AI suggestions, the inability to revert changes creates anxiety and reduces trust. The second priority is error messaging (Heuristic 9, score: 2/10) — technical error banners provide no guidance on recovery. The third priority is reducing jargon (Heuristic 2, score: 4/10) to make the tool accessible to the designer and QA personas, not just developers. Addressing these three heuristics would raise the overall score from 66 to an estimated 80+/100.
