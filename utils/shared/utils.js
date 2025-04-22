/**
 * Shared Helper Utilities
 */

/**
 * Sanitizes the output from OpenAI to remove embedded citation markers
 * @param {string} text - The text to sanitize
 * @returns {string} - The sanitized text
 */
export function sanitizeOutput(text) {
  if (!text) return "";

  let sanitized = String(text);

  // Remove [[n](#source)] style citations
  sanitized = sanitized.replace(/\[\[(\d+)\]\(#.*?\)\]/g, "");

  // Remove 【n:Q#†source】style citations (newer format)
  sanitized = sanitized.replace(/【[^】]*?source】/g, "");

  // Remove any other common citation patterns with daggers
  sanitized = sanitized.replace(/\[(\d+:)?[^[\]]*?†[^[\]]*?\]/g, "");

  return sanitized;
}

/**
 * Determines if the message content is likely a valid JSON string
 * @param {string} content - The content to check
 * @returns {boolean} - True if content is valid JSON string, else false
 */
export function isJsonContent(content) {
  if (typeof content !== "string") return false;
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === "object";
  } catch {
    return false;
  }
}
