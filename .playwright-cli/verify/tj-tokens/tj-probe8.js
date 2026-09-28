() => {
  const res = [];
  const rail = document.querySelector('[class*="sidebar"], [class*="rail"], nav');
  const scope = rail || document;
  for (const el of scope.querySelectorAll('li, a, div, span')) {
    const r = el.getBoundingClientRect();
    if (r.width < 28 || r.width > 60 || r.height < 28 || r.height > 60) continue;
    const cs = getComputedStyle(el);
    if (cs.borderRadius === '0px') continue;
    res.push(el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') + ' [' + Math.round(r.width) + 'x' + Math.round(r.height) + '] r=' + cs.borderRadius + ' bg=' + cs.backgroundColor);
    if (res.length > 10) break;
  }
  return res.join('\n') || 'no tiles';
}
