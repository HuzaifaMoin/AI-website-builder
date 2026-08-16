// Fix double-escaped newlines/quotes from AI JSON string output
export function normalizeContent(content) {
    if (!content) return "";

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
    }

    // Normalize \r\n to \n
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    const realNewlines = (content.match(/\n/g) || []).length;
    const literalBackslashN = (content.match(/\\n/g) || []).length;

    if (literalBackslashN > realNewlines) {
        // Triple-escaped first: \\n → \n (leave as literal), then \n → newline
        content = content
            .replace(/\\\\n/g, "%%PRESERVED_ESCAPED_N%%")
            .replace(/\\n/g, "\n")
            .replace(/%%PRESERVED_ESCAPED_N%%/g, "\\n")
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "")
            .replace(/\\\\/g, "\\");
    }

    // Fix escaped line breaks that AI models sometimes inject between JSX attributes.
    // Example: onClick={() => setIsOpen(false)}\n className="..." must become a real newline.
    content = content.replace(/\\n\s+(?=[A-Za-z0-9_<])/g, "\n");

    // Always clean up backslash-escaped quotes in JS/JSX code.
    // AI JSON output often escapes apostrophes and double quotes inside string literals,
    // which breaks valid JavaScript such as: quote: 'Alex\'s...'
    content = content
        .replace(/\\(['"])/g, "$1")
        .replace(/(\w+)=\\"([^\"]*?)\\"/g, '$1="$2"');

    return content;
}
