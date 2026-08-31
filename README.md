# Best Buy Metals - Company Infraction Form

A web application designed to replicate the official **Best Buy Metals Documentation of Company Infraction** (Rev 07/2026).

- **Live GitHub Pages URL**: **[https://bestbuymetalsdev01.github.io/infractions-form/](https://bestbuymetalsdev01.github.io/infractions-form/)**
- **GitHub Repository**: **[https://github.com/BestBuyMetalsDev01/infractions-form](https://github.com/BestBuyMetalsDev01/infractions-form)**

---

## Key Problem & Solution

### The Problem
In standard static PDF forms, the **Details** box on Page 2 is confined to a fixed bounding box. When managers document thorough HR incidents (incident timelines, safety regulations, witness statements, and corrective action plans), the text either runs out of space, gets truncated, or shrinks to an illegible size.

### The Solution: Dynamic Multi-Page Engine
1. **Unrestricted Input**: Managers have an unrestricted, auto-resizing text area with live character/word counters.
2. **Infinite Multi-Page Dynamic Flow**:
   - Short incident reports cleanly output a standard **2-page document** ("Page 1 of 2", "Page 2 of 2").
   - Detailed incident reports automatically flow onto **infinite continuation pages** ("Page 1 of 3", "Page 2 of 3", "Page 3 of 3", ..., "Page N of N") with the official Best Buy Metals header and revision footer on every page.
   - The signature block is intelligently anchored at the bottom of the **final page**, ensuring no overlap or clipped layouts regardless of text length.
3. **Dual Signature Mode**:
   - Managers and employees can draw digital signatures directly on touchscreen/mouse canvas or type their name.
   - Signature lines can also be left blank for physical wet-ink printing.

---

## Features

- **Two-Screen Workflow**:
  - **Screen 1 (Form Entry)**: Full-width, focused form interface without distracting side previews while typing.
  - **Screen 2 (Confirmation & Review)**: A dedicated confirmation screen displaying document metadata chips (Employee name, Warning level, Date, Generated page count) alongside the live Letter-sized document preview.
  - Quick navigation: Easily switch between "Edit Form" and "Confirmation Review" with one click.
- **Infinite Multi-Page Dynamic Pagination**:
  - Infinite continuation pages (`Page 1 of N`, `Page 2 of N`, ..., `Page N of N`) generated dynamically based on Details length with zero page limits.
  - Intelligent word-breaking across page boundaries.
  - **Text Density Modes** (`Compact [10pt]`, `Standard [11pt]`, `Expanded [12pt]`): Adjust document text density directly from the toolbar to match Word-style spacing (e.g. expanding 19 pages into 26 pages).
  - **Manual Page Breaks**: Type `---` or `[pagebreak]` on any line to force an immediate page break.
  - **Content Verification**: Dynamic confirmation chip verifies that 100% of all pasted words are rendered with zero truncation.
  - Signature block automatically pinned to the bottom of the final page.
- **Pixel-Perfect PDF Generation**: Client-side vector-accurate PDF export via `html2pdf.js` and browser native `@media print` formatted for standard US Letter (8.5" x 11").
- **Exact Form Fields**:
  - Employee Name & Date
  - Warning Level Selection (Verbal Warning, First Written Warning, Second Written Warning, Final Written Warning, Suspension without pay notice)
  - Conditional Suspension Fields (Suspension Dates, Expected Return to Work Date)
  - Nature of Infraction multi-select checkboxes
  - Write-in fields for Policy Name, Absenteeism Dates, Tardiness times, and Other
- **Authentic Physical Signature Lines**:
  - Digital online signatures have been completely removed from the form editor per HR policy.
  - The document renders standard official blank lines for Employee Signature, Manager/Direct Report Printed Name, Manager Signature, and Dates for physical pen signing after printing or downloading.
- **LocalStorage Auto-Save**: Never lose progress; draft automatically saves and restores across sessions.
- **Sample Incident Data**: One-click demo button that populates a realistic, detailed incident report.

---

## How to Deploy to GitHub Pages

This project requires **zero build tools** (no Node.js or backend required).

1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Infractions Form"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```
2. Go to your repository settings on GitHub:
   - **Settings** -> **Pages**
   - Under **Build and deployment** -> **Branch**, select `main` (or `gh-pages`) and `/ (root)` folder.
   - Click **Save**.
3. Your form will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.
