() => {
  const out = {};
  for (const el of document.querySelectorAll('a, article, div, li, section')) {
    const cs = getComputedStyle(el);
    const r = cs.borderRadius, s = cs.boxShadow;
    if (r === '0px' && s === 'none') continue;
    if (!el.textContent || el.textContent.trim().length < 3) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 20) continue;
    const key = r + ' | ' + (s === 'none' ? 'none' : s);
    if (!out[key]) out[key] = { count: 0, sample: el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.'), w: Math.round(rect.width), h: Math.round(rect.height) };
    out[key].count++;
  }
  return Object.entries(out).sort((a, b) => b[1].count - a[1].count).slice(0, 12).map(([k, v]) => v.count + 'x ' + v.sample + ' [' + v.w + 'x' + v.h + '] :: ' + k).join('\n');
}
