export function extractDescription(content: string | undefined): string {
  if (!content) return "入間市議会の議論を、市民の手に。3分要約 × 議論の変遷 × 生の議事録";
  
  // Try to find the "▶ あなたへの影響" block
  const impactMatch = content.match(/### ▶ あなたへの影響\n> 「([^」]+)」/);
  if (impactMatch && impactMatch[1]) {
    const text = impactMatch[1].trim();
    return text.length > 120 ? text.substring(0, 117) + '...' : text;
  }
  
  // Try to find the "3行要約" block
  const summaryMatch = content.match(/### 📌 すぐに理解できる3行要約\n1\. \*\*.*?\*\*：([^\n]+)/);
  if (summaryMatch && summaryMatch[1]) {
    const text = summaryMatch[1].trim();
    return text.length > 120 ? text.substring(0, 117) + '...' : text;
  }
  
  // Fallback to the first paragraph without markdown formatting
  const plainText = content
    .replace(/[#*>_\-`\[\]|]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  return plainText.length > 120 ? plainText.substring(0, 117) + '...' : (plainText || "入間市議会の議論を、市民の手に。");
}

export function getCategoryFromTags(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '市政課題';
  
  const issueTag = tags.find(t => t.startsWith('issue/'));
  if (issueTag) {
    return issueTag.replace('issue/', '');
  }
  
  return tags[0];
}
