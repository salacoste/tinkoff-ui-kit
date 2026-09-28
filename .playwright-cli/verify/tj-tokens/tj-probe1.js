() => {
  const res = [];
  const probe = (el, label) => {
    if (!el) return;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    res.push(label + ': ' + el.tagName.toLowerCase() + ' r=' + cs.borderRadius + ' h=' + Math.round(r.height) + ' w=' + Math.round(r.width) + ' bg=' + cs.backgroundColor + ' color=' + cs.color + ' shadow=' + (cs.boxShadow === 'none' ? 'none' : cs.boxShadow) + ' fs=' + cs.fontSize + '/' + cs.fontWeight);
  };
  document.querySelectorAll('a, button').forEach((el) => {
    const t = (el.textContent || '').trim();
    if (t === 'Написать' || t === 'Написать статью') probe(el, 'CTA<' + t + '>');
  });
  const purple = document.querySelector('a[href*="/pro/"], [class*="pro"]');
  if (purple) probe(purple, 'pro-link');
  document.querySelectorAll('[class*="badge"]').forEach((el, i) => { if (i < 3) probe(el, 'badge-' + i); });
  return res.join('\n') || 'no CTA found';
}
