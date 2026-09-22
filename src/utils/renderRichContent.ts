/**
 * Utility for rendering Rich Text and Markdown into clean, responsive HTML.
 * Handles headings, bold, italic, underline, strikethrough, alignments,
 * colors, custom font-families, blockquotes, lists, tables, links and images.
 */

export interface RenderOptions {
  theme?: 'light' | 'dark';
}

export function renderRichContent(rawContent: string, options: RenderOptions = {}): string {
  if (!rawContent || !rawContent.trim()) {
    return options.theme === 'dark'
      ? '<p class="text-slate-400 italic">Henüz bir içerik girilmedi.</p>'
      : '<p class="text-slate-400 italic">Henüz bir içerik bulunmuyor.</p>';
  }

  const isDark = options.theme === 'dark';

  let text = rawContent;

  // 1. Normalize Underline & Strikethrough tags with inline styles so CSS resets don't strip them
  text = text
    .replace(/<u(\s+[^>]*)?>(.*?)<\/u>/gi, '<u style="text-decoration: underline; text-underline-offset: 3px;" class="underline" $1>$2</u>')
    .replace(/<ins(\s+[^>]*)?>(.*?)<\/ins>/gi, '<u style="text-decoration: underline; text-underline-offset: 3px;" class="underline" $1>$2</u>')
    .replace(/<del(\s+[^>]*)?>(.*?)<\/del>/gi, '<del style="text-decoration: line-through;" class="line-through opacity-75" $1>$2</del>')
    .replace(/<s(\s+[^>]*)?>(.*?)<\/s>/gi, '<del style="text-decoration: line-through;" class="line-through opacity-75" $1>$2</del>')
    .replace(/<strike(\s+[^>]*)?>(.*?)<\/strike>/gi, '<del style="text-decoration: line-through;" class="line-through opacity-75" $1>$2</del>');

  // 2. Markdown Headings
  if (isDark) {
    text = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-5 mb-2 font-serif-heading tracking-tight">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#C5A880] mt-7 mb-3 font-serif-heading tracking-tight border-b border-white/10 pb-1.5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-7 mb-3 font-serif-heading tracking-tight border-b border-white/10 pb-2">$1</h1>');
  } else {
    text = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3 font-serif-heading tracking-tight">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#9A7B4F] mt-8 mb-4 font-serif-heading tracking-tight border-b border-slate-200 pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-900 mt-8 mb-4 font-serif-heading tracking-tight border-b border-slate-200 pb-2.5">$1</h1>');
  }

  // 3. Markdown Bold, Italic, Strikethrough
  text = text
    .replace(/\*\*(.*?)\*\*/gim, `<strong style="font-weight: 700;" class="${isDark ? 'text-white' : 'text-slate-900'} font-bold">$1</strong>`)
    .replace(/__(.*?)__/gim, `<strong style="font-weight: 700;" class="${isDark ? 'text-white' : 'text-slate-900'} font-bold">$1</strong>`)
    .replace(/\*(.*?)\*/gim, '<em style="font-style: italic;" class="italic">$1</em>')
    .replace(/_(.*?)_/gim, '<em style="font-style: italic;" class="italic">$1</em>')
    .replace(/~~(.*?)~~/gim, '<del style="text-decoration: line-through;" class="line-through opacity-75">$1</del>');

  // 4. Blockquotes
  if (isDark) {
    text = text.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#C5A880] pl-4 py-2 italic my-4 text-slate-200 bg-white/5 rounded-r">$1</blockquote>');
  } else {
    text = text.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#C5A880] pl-4 py-2 italic my-4 text-slate-700 bg-slate-50 rounded-r shadow-xs">$1</blockquote>');
  }

  // 5. Unordered & Ordered Lists
  text = text
    .replace(/^\- (.*$)/gim, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-5 list-decimal mb-1">$1</li>');

  // 6. Horizontal Rules
  text = text.replace(/^---$/gim, isDark ? '<hr class="my-6 border-white/10" />' : '<hr class="my-6 border-slate-200" />');

  // 7. Images & Links
  text = text
    .replace(/!\[(.*?)\]\((.*?)\)/gim, `<div class="my-4"><img alt="$1" src="$2" class="rounded-xl max-h-96 w-full object-cover border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-md" /><p class="text-xs text-center text-slate-400 mt-1.5 italic">$1</p></div>`)
    .replace(/\[(.*?)\]\((.*?)\)/gim, `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#C5A880] hover:underline font-medium inline-flex items-center gap-1">$1</a>`);

  // 8. Markdown Tables
  text = text.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return match;

    const parseRow = (line: string) =>
      line.split('|').slice(1, -1).map(c => c.trim());

    const headers = parseRow(lines[0]);
    const isDivider = lines[1].includes('---') || lines[1].includes(':--');
    const dataRows = isDivider ? lines.slice(2) : lines.slice(1);

    const thClass = isDark
      ? 'px-4 py-2.5 bg-white/10 text-white font-semibold text-xs border border-white/15'
      : 'px-4 py-2.5 bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200';

    const tdClass = isDark
      ? 'px-4 py-2 text-slate-200 text-xs border border-white/10'
      : 'px-4 py-2 text-slate-700 text-xs border border-slate-200';

    const headerHtml = `<tr>${headers.map(h => `<th class="${thClass}">${h}</th>`).join('')}</tr>`;
    const rowsHtml = dataRows.map(rowLine => {
      const cells = parseRow(rowLine);
      return `<tr>${cells.map(c => `<td class="${tdClass}">${c}</td>`).join('')}</tr>`;
    }).join('');

    return `<div class="overflow-x-auto my-4 rounded-lg border ${isDark ? 'border-white/10' : 'border-slate-200'}"><table class="w-full text-left border-collapse">${headerHtml}${rowsHtml}</table></div>`;
  });

  // 9. Process Paragraphs & Line Breaks cleanly without breaking block tags
  // Split content into blocks separated by 2 or more newlines
  const blocks = text.split(/\n{2,}/);
  const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    // If block starts with a block-level element, keep it as-is (just convert internal single newlines to <br /> if appropriate)
    const isBlockTag = /^(<(?:h[1-6]|div|blockquote|table|ul|ol|li|hr|p|section)\b)/i.test(trimmed);
    if (isBlockTag) {
      return trimmed;
    }

    // Otherwise wrap as a standard readable paragraph with line-height
    const withBreaks = trimmed.replace(/\n/g, '<br />');
    return `<p class="mb-4 leading-relaxed">${withBreaks}</p>`;
  });

  return processedBlocks.filter(Boolean).join('\n');
}

/**
 * Strips HTML and Markdown tags from content for clean card summaries.
 */
export function stripToPlainText(content: string, maxLength: number = 150): string {
  if (!content) return '';
  const plain = content
    .replace(/<[^>]+>/g, ' ') // Strip HTML tags
    .replace(/#{1,6}\s+/g, '') // Headings
    .replace(/[*_`~]/g, '') // Markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Link text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/\|[^\n]+\|/g, '') // Remove table rows
    .replace(/\s+/g, ' ')
    .trim();

  return plain.length > maxLength ? plain.substring(0, maxLength) + '...' : plain;
}
