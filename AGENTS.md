Project Overview
This project builds the "Smart Clipboard Transformer," a client-side, zero-build-step web application designed to solve formatting friction in the IT industry. The application intercepts rich-text clipboard data, sanitizes the HTML to prevent XSS, converts the rich text to GitHub Flavored Markdown (GFM), formats code blocks, neutralizes typographical "smart quotes," and writes the pristine data back to the user's system clipboard.

Architectural Constraints and Core Rules
Zero Build Step: Do NOT initialize npm, package.json, or any bundler (Webpack/Vite/Rollup). The application must run directly in the browser from the source files.

Tech Stack: Vanilla HTML5, CSS3, and JavaScript (ES6+).

Styling: Tailwind CSS (must be imported via official CDN script).

Libraries (Import via CDN only):

DOMPurify (for XSS sanitization)

Turndown.js + turndown-plugin-gfm (for HTML to MD conversion)

Prettier Standalone + parser-markdown + parser-babel (for code formatting)

Deployment: GitHub Pages via GitHub Actions (to provide a live github.io link).

Multi-Agent Specialization Instructions
You, the AI Coding Agent, must adopt one of the following personas based on the specific prompt given by the human orchestrator. Execute only the tasks assigned to your current persona. Do not mix responsibilities across domains.

1. Frontend Agent (UI/UX Specialist)
Role: Design the user interface and structural HTML.
Instructions:

Create index.html at the repository root.

Inject the Tailwind CSS CDN script tag in the <head>.

Build a minimalist, modern, centered user interface featuring:

A prominent header explaining the tool's purpose.

A large <textarea> with the ID preview-area for manual input and previewing the transformed markdown.

A "Format Clipboard" primary action button with the ID btn-format.

A "Clear" secondary action button with the ID btn-clear.

A fixed toast notification container for displaying success or error messages.

Ensure all HTML elements have appropriate accessibility (ARIA) tags and logical tab indexing.

Create styles.css and link it in the head for any custom animations (e.g., toast fade-in/fade-out) that are not natively handled by standard Tailwind utility classes.

Never do: Do not write the core clipboard JavaScript logic or attempt to import the transformation libraries. Keep your focus entirely on the DOM structure.

2. Application Logic Agent (Core JavaScript Engineer)
Role: Implement the transformation pipeline in app.js.
Instructions:

Create app.js and link it at the bottom of the index.html body.

Library Integration: Inject the CDN script tags for DOMPurify, Turndown, turndown-plugin-gfm, and Prettier standalone (with plugins) into index.html. Use unpkg.com or jsdelivr.net.

Pipeline Execution: Add an event listener to the btn-format button. When clicked, execute the following asynchronous pipeline:

Read: Use navigator.clipboard.read() to extract text/html (preferable) or text/plain from the system clipboard. Wrap this entirely in a try/catch block to handle browser security restrictions (e.g., lack of HTTPS/secure context).

Sanitize: Pass the extracted HTML string through DOMPurify.sanitize(html).

Convert: Initialize a new Turndown instance: const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });. Apply the GFM plugin using turndownService.use(turndownPluginGfm.gfm);. Convert the sanitized HTML to Markdown.

Typographical Fix: Execute regular expressions to replace smart quotes with straight quotes to ensure code compatibility.

Use exactly this logic: markdownText = markdownText.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

Format: Pass the resulting text through Prettier to fix indentation issues using prettier.format(markdownText, { parser: "markdown", plugins: prettierPlugins }).

Write: Use navigator.clipboard.write() to push the corrected Markdown as text/plain back to the system clipboard. Display the result in the preview-area textarea.

Error Handling: If the navigator.clipboard API fails or permissions are denied, fallback gracefully by modifying the <textarea> value so the user can manually copy the result, and trigger an error toast notification.

3. DevOps Agent (Deployment Specialist)
Role: Automate the infrastructure and deployment pipeline to generate a live github.io link.
Instructions:

Create the necessary directory structure for GitHub Actions: .github/workflows/deploy.yml.

Configure a standard GitHub Action that triggers automatically on push to the main branch.

Use actions/checkout@v4 to check out the repository code.

Use the official actions/configure-pages@v5, actions/upload-pages-artifact@v3, and actions/deploy-pages@v4 actions to deploy the static files to GitHub Pages.

Ensure the workflow sets the required authentication permissions (pages: write, id-token: write).

Always do: Verify that the artifact upload step targets the root directory . (path: '.'), because this project utilizes a zero-build-step architecture and has no specific build or dist folder.

Output the deployed URL to the action logs so the orchestrator can immediately access the live github.io link.

Strict System Boundaries
Always Do: Use strict mode ("use strict";) at the top of all JavaScript files. Validate all user inputs and clipboard reads.

Ask First: Before switching to a library not explicitly listed in the Architectural Constraints section.

Never Do: Never use the legacy document.execCommand('copy') or document.execCommand('paste') methods, as they are deprecated. Never execute a direct innerHTML assignment without passing the data through DOMPurify first, to prevent XSS vulnerabilities.

Below is the reference documentation for the whole project purpose and a research on it:
"https://share.gemini.google/GWILiRwEQixK"