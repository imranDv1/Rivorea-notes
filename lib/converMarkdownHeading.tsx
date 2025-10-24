export function convertMarkdownHeadingsToHtml(input: string): string {
  // Helper to escape HTML in heading text to avoid accidental HTML injection
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const lines = input.split("\n");
  let inCodeBlock = false;

  const out = lines.map((line) => {
    const trimmed = line.trimStart();

    // Toggle fenced code block state
    if (/^```/.test(trimmed)) {
      inCodeBlock = !inCodeBlock;
      return line; // leave code fence line unchanged
    }

    if (inCodeBlock) {
      // Don't convert headings inside fenced code blocks
      return line;
    }

    // Match leading whitespace + 1-6 hashes + at least one space then the text
    const match = line.match(/^(\s*)(#{1,6})\s+(.*)$/);
    if (match) {
      const indent = match[1] || "";
      const hashes = match[2];
      const text = match[3] || "";
      const level = Math.min(hashes.length, 6);
      return `${indent}<h${level}>${escapeHtml(text)}</h${level}>`;
    }

    return line;
  });

  return out.join("\n");
}