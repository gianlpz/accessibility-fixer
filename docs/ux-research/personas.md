# Personas — Access4U

> Generated using Cooper's goal-directed design framework via ux-research-mcp

---

## Persona 1: Jordan Ahmed — Frontend Developer

### Demographics

| | |
|---|---|
| **Age** | 28 |
| **Occupation** | Software Developer |
| **Location** | Austin, TX |
| **Tech Comfort** | High |

> "I just want to paste my HTML, see what's broken, get the fixed code, and move on. I shouldn't need a WCAG certification to ship accessible markup."

### Bio

Jordan is a 28-year-old frontend developer based in Austin, TX. He works on a mid-size SaaS product and ships features weekly. He cares about accessibility but finds existing audit tools like Lighthouse and axe DevTools frustrating — they report violations but leave him to figure out the fix. He wants a tool that closes the loop: scan, explain, fix, verify.

### Goals

- Fix accessibility violations fast without deep WCAG knowledge
- Get copy-pasteable code fixes that can be applied immediately
- Understand why each fix matters for real users with disabilities

### Frustrations

- Current tools dump cryptic error codes with no actionable guidance
- Constant context-switching between the audit tool, WCAG docs, and the code editor
- No way to preview what the fix actually changes in the markup

### Behaviors

- Uses keyboard shortcuts whenever possible
- Gets impatient with multi-step processes
- Watches tutorial videos before trying new features
- Skips informational/minor violations and jumps to critical ones first
- Copies code snippets and pastes directly into VS Code
- Checks reviews and community recommendations before adopting tools

### Motivations

- Wants to ship accessible code without slowing down sprint velocity
- Values tools that are opinionated and give direct answers
- Feels professional pride in producing clean, standards-compliant markup

### Usage Scenario

Jordan is mid-sprint and a QA engineer flags three accessibility violations on the checkout page. He opens Access4U, pastes the page HTML, and runs an audit. The tool finds 12 violations. He sorts by severity, clicks the first critical issue (missing form labels), reads the plain-language explanation, reviews the before/after diff, and copies the fix. He applies it in VS Code, re-audits, and the violation is gone. Total time: 4 minutes per violation instead of 20.

---

## Persona 2: Sarah Nguyen — Designer & Content Creator

### Demographics

| | |
|---|---|
| **Age** | 27 |
| **Occupation** | UX Designer / Content Creator |
| **Location** | Seattle, WA |
| **Tech Comfort** | Medium |

> "I want to know if my designs are accessible before I hand them off — in language I actually understand."

### Bio

Sarah is a 27-year-old UX designer based in Seattle. She creates wireframes, visual designs, and content for a B2C web app. She knows accessibility matters but finds audit tools intimidating — they speak in WCAG codes and HTML attributes she doesn't fully understand. She wants plain-language guidance that helps her catch issues early, before the design reaches development.

### Goals

- Get plain-language guidance on accessibility issues without technical jargon
- Verify content meets accessibility standards before handing off to developers
- Learn accessibility best practices to improve her design process over time

### Frustrations

- Accessibility tools assume she knows HTML and ARIA attributes
- Cannot visualize how designs fail for users with disabilities
- No feedback loop — she hands off and never knows if accessibility was actually fixed

### Behaviors

- Takes screenshots of violations to share with the dev team
- Searches Google for WCAG terms she does not understand
- Bookmarks pages about color contrast and alt text
- Feels motivated when she sees plain-language explanations she can act on
- Prefers checklists and visual guides over dense documentation

### Motivations

- Driven by empathy — wants everyone to be able to use the products she designs
- Believes learning accessibility now will make her a better designer long-term
- Values tools that teach, not just report

### Usage Scenario

Sarah finishes a redesign of the product's landing page. Before handing off the Figma file, she exports the HTML prototype and drops it into Access4U. The tool flags 5 issues: two color contrast failures, a missing heading hierarchy, and two images without alt text. Each issue has a plain-language explanation and a suggested fix. She adjusts the contrast in Figma, adds alt text notes to her handoff doc, and shares the audit report with the dev team so nothing falls through the cracks.

---

## Persona 3: Elena Rodriguez — QA Engineer & Compliance Officer

### Demographics

| | |
|---|---|
| **Age** | 25 |
| **Occupation** | QA Engineer / Accessibility Compliance Lead |
| **Location** | San Francisco, CA |
| **Tech Comfort** | High |

> "I need one tool that gives me an audit report, tracks what we fixed, and proves it to legal — not three tools and a spreadsheet."

### Bio

Elena is a 25-year-old QA engineer based in San Francisco. She owns accessibility compliance for her company's product suite. Every quarter she produces VPAT-style reports for the legal team and tracks remediation progress across sprints. She currently uses axe, WAVE, and Lighthouse, then manually compiles results into spreadsheets. She wants a single tool that audits, tracks, and exports.

### Goals

- Generate comprehensive audit reports for stakeholders and legal compliance
- Track violation severity to prioritize remediation by business impact
- Export evidence of accessibility testing for regulatory documentation

### Frustrations

- Manual report compilation from multiple tools wastes hours every sprint
- Severity ratings from tools do not map to actual business or legal risk
- No before/after proof that violations were actually resolved

### Behaviors

- Manually copies violation data into spreadsheets for tracking
- Cross-references tool output against the VPAT template
- Flags violations by business priority rather than WCAG level alone
- Researches options thoroughly before recommending new tools to the team
- Prefers structured, exportable data over visual dashboards

### Motivations

- Wants to reduce the time and error rate in compliance reporting
- Values accuracy and audit trails over speed
- Feels professional responsibility to protect the company from legal risk

### Usage Scenario

Elena runs a quarterly accessibility audit on the company's customer portal. She pastes the URL into Access4U and runs a full scan. The tool returns 23 violations across 4 WCAG conformance levels. She filters by Level A critical issues, reviews the heatmap to see where violations cluster, then exports a PDF report with violation details, WCAG references, and severity ratings mapped to her team's risk framework. She shares the report with legal and creates Jira tickets for the dev team, ordered by priority score.
