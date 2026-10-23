"use strict";

const btnFormat = document.getElementById("btn-format");
const btnClear = document.getElementById("btn-clear");
const previewArea = document.getElementById("preview-area");
const toastContainer = document.getElementById("toast-container");

function showToast(message, type = "success") {
const toast = document.createElement("div");
toast.className = `toast ${type}`;
toast.setAttribute("role", "alert");
toast.textContent = message;
toastContainer.appendChild(toast);
setTimeout(() => {
toast.classList.add("hide");
setTimeout(() => toast.remove(), 300);
}, 3000);
}

function escapeText(text) {
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}

async function readClipboard() {
const permissions = await navigator.permissions.query({ name: "clipboard-read" });
if (permissions.state === "denied") {
throw new Error("Clipboard read permission denied.");
}

const items = await navigator.clipboard.read();
for (const item of items) {
for (const type of item.types) {
if (type === "text/html") {
const blob = await item.getType(type);
return await blob.text();
}
if (type === "text/plain") {
const blob = await item.getType(type);
return await blob.text();
}
}
}
throw new Error("No readable text or HTML found in clipboard.");
}

function convertToMarkdown(html) {
const cleanHtml = DOMPurify.sanitize(html);
const turndownService = new TurndownService({ codeBlockStyle: "fenced" });
turndownService.use(turndownPluginGfm.gfm);
return turndownService.turndown(cleanHtml);
}

function fixSmartQuotes(markdownText) {
return markdownText.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
}

async function formatMarkdown(markdownText) {
return prettier.format(markdownText, {
parser: "markdown",
plugins: prettierPlugins,
});
}

async function writeClipboard(markdownText) {
await navigator.clipboard.write([
new ClipboardItem({ "text/plain": new Blob([markdownText], { type: "text/plain" }) }),
]);
}

async function runPipeline() {
btnFormat.disabled = true;
try {
const raw = await readClipboard();
let markdownText = convertToMarkdown(raw);
markdownText = fixSmartQuotes(markdownText);
markdownText = await formatMarkdown(markdownText);

await writeClipboard(markdownText);
previewArea.value = markdownText;
showToast("Clipboard formatted successfully.", "success");
} catch (err) {
console.error(err);
previewArea.value = err.message || "Failed to read clipboard. Paste content manually.";
showToast("Clipboard access failed. See preview area for fallback.", "error");
} finally {
btnFormat.disabled = false;
}
}

btnFormat.addEventListener("click", runPipeline);

btnClear.addEventListener("click", () => {
previewArea.value = "";
previewArea.focus();
});
