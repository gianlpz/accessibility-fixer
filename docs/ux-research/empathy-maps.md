# Empathy Maps — Accessibility Fixer

> Generated using Dave Gray's 4-quadrant model (Says, Thinks, Does, Feels) via ux-research-mcp

**Context for all maps:** Using Accessibility Fixer to audit a web page

---

## Empathy Map 1: Frontend Developer

### Says
*Direct quotes and statements from the user*

- "Where is the copy button for this fix?"
- "I do not understand what ARIA landmark region means"
- "Can I just auto-fix all of these at once?"

### Thinks
*What the user is thinking but may not say aloud*

- This is going to take forever to fix all these violations
- I wonder if this fix will break my existing layout
- My PM is going to ask why this sprint took so long

### Does
*Observable actions and behaviors*

- Clicks between the tool output and MDN docs repeatedly
- Copies code snippets and pastes into VS Code
- Scrolls past informational violations to find critical ones first

### Feels
*Emotional state and reactions*

- Frustrated when violation descriptions use WCAG codes instead of plain English
- Anxious about missing critical violations before deployment
- Relieved when the before/after diff shows exactly what changed

### Key Insights

- The developer's primary anxiety is about time — fixing violations feels like unplanned work that threatens sprint commitments
- There is a gap between what the developer says ("can I auto-fix?") and what they need (confidence that fixes are correct)
- The before/after diff is the moment of highest positive emotion — it provides proof and closure

### User Needs

- Immediate, copy-pasteable code fixes that eliminate context-switching
- Plain-language explanations that translate WCAG codes into actionable understanding
- A way to batch-process violations without sacrificing fix quality

---

## Empathy Map 2: Designer & Content Creator

### Says
*Direct quotes and statements from the user*

- "What does contrast ratio 3.2:1 even mean?"
- "I just want to know if my heading structure is correct"
- "Is there a checklist I can follow before I hand off designs?"

### Thinks
*What the user is thinking but may not say aloud*

- Accessibility feels like a developer problem, not a design problem
- I wish I could see what a screen reader user actually experiences
- If I learn this now it will save time in every future project

### Does
*Observable actions and behaviors*

- Takes screenshots of violations to share with the dev team
- Searches Google for WCAG terms she does not understand
- Bookmarks pages about color contrast and alt text

### Feels
*Emotional state and reactions*

- Overwhelmed by the number of violations listed
- Motivated when she sees plain-language explanations she can act on
- Embarrassed that her designs have so many accessibility issues

### Key Insights

- The designer's overwhelm comes from volume — she needs progressive disclosure, not fewer results
- Her behavior of screenshotting violations reveals a handoff pain point — she needs a shareable report format
- The gap between "this is a developer problem" and "I want to learn" shows she is ready for education, just not in WCAG language

### User Needs

- Progressive disclosure that starts with the most impactful issues
- Visual previews showing how designs appear to users with disabilities
- A pre-handoff checklist tailored to design decisions (color, hierarchy, alt text)

---

## Empathy Map 3: QA Engineer & Compliance Officer

### Says
*Direct quotes and statements from the user*

- "I need to export this as a PDF for the legal team"
- "How do I prove we fixed these violations since last audit?"
- "Can I filter violations by WCAG conformance level?"

### Thinks
*What the user is thinking but may not say aloud*

- If we miss a critical violation we could face a lawsuit
- These severity ratings do not match our internal risk framework
- I need a single source of truth for our accessibility status

### Does
*Observable actions and behaviors*

- Manually copies violation data into spreadsheets for tracking
- Cross-references tool output against the VPAT template
- Flags violations by business priority rather than WCAG level

### Feels
*Emotional state and reactions*

- Stressed about audit deadlines and incomplete remediation
- Confident when the tool provides before/after evidence
- Frustrated when different tools report different violation counts

### Key Insights

- The QA engineer's core frustration is data fragmentation — multiple tools with conflicting outputs create distrust
- Her manual spreadsheet workflow is a clear automation opportunity
- Severity mapping to business risk is a differentiator — existing tools map to WCAG levels, not business impact

### User Needs

- One-click export to PDF/JSON with VPAT-compatible formatting
- Before/after evidence trails that prove remediation
- Customizable severity mapping that aligns tool ratings with internal risk frameworks
