() => {
  const res = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (!cs.backgroundColor.includes('128, 84, 255') && !cs.color.includes('128, 84, 255')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 5) continue;
    res.push(el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') + ' [' + Math.round(r.width) + 'x' + Math.round(r.height) + '] r=' + cs.borderRadius + ' bg=' + cs.backgroundColor + ' as-bg=' + (cs.backgroundColor.includes('128, 84, 255')));
    if (res.length > 8) break;
  }
  return res.join('\n') || 'no purple';
}
