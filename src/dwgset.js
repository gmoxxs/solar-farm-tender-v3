/* =====================================================================
   PRELIMINARY DRAWING SET — A3 landscape sheets with border, zone grid,
   title block, general notes, revision table and PRELIMINARY stamp.
   Exports: per sheet PDF (print) / SVG / DXF (R12), full set PDF / ZIP.
   ===================================================================== */
const DWG_SET = [
  {no:'C-000', cover:true, scale:'NTS', disc:'General'},
  {no:'C-002', mod:'m13', fn:figLayout, scale:'AS SHOWN (SCALE BAR)', disc:'General', calcs:['LAND','CF','DET','RDQ']},
  {no:'C-100', mod:'m8', fn:figDEM, scale:'AS SHOWN (SCALE BAR)', disc:'Earthworks', calcs:['TOPO','CF']},
  {no:'C-101', mod:'m12', fn:figGrading, scale:'AS SHOWN (SCALE BAR)', disc:'Earthworks', calcs:['GRD','EWB']},
  {no:'C-103', mod:'m14', fn:figSlopeSec, scale:'NTS', disc:'Earthworks', calcs:['SLP']},
  {no:'C-104', mod:'m10', fn:figSoil, scale:'NTS', disc:'Geotechnical', calcs:['GEO']},
  {no:'C-200', mod:'m15', fn:figCatch, scale:'NTS', disc:'Drainage', calcs:['IDF','CAT','TC','RAT']},
  {no:'C-202', mod:'m16', fn:figDrain, scale:'NTS', disc:'Drainage', calcs:['MAN','DSZ']},
  {no:'C-203', mod:'m17', fn:figCulvert, scale:'NTS', disc:'Drainage', calcs:['CUL']},
  {no:'C-204', mod:'m18', fn:figPond, scale:'NTS (VERT. EXAG.)', disc:'Drainage', calcs:['DET','OSD','OUT']},
  {no:'C-301', mod:'m21', fn:figRoad, scale:'NTS (VERT. EXAG.)', disc:'Roads', calcs:['PAV','RDQ']},
  {no:'S-401', mod:'m26', fn:figPile, scale:'NTS', disc:'Foundations', calcs:['PVP','PVS','DRV']},
  {no:'S-402', mod:'m29', fn:() => figFdn('FDN_INV'), scale:'NTS', disc:'Foundations', calcs:['FDN_INV']},
  {no:'S-403', mod:'m30', fn:() => figFdn('FDN_TX'), scale:'NTS', disc:'Foundations', calcs:['FDN_TX']},
  {no:'C-500', mod:'m34', fn:figTrench, scale:'NTS', disc:'Cable', calcs:['CTR']},
  {no:'C-601', mod:'m36', fn:figRetain, scale:'NTS', disc:'Ancillary', calcs:['RTW']},
  {no:'S-700', mod:'m43', fn:figBESS, scale:'AS SHOWN (SCALE BAR)', disc:'BESS', type:'B', calcs:['BPL','BDR']},
  {no:'S-701', mod:'m31', fn:() => figFdn('BFDN'), scale:'NTS', disc:'BESS', type:'B', calcs:['BFDN']},
];
const DWG_NOTES = {
  General:'Site boundary, setbacks and platform positions are indicative and to be confirmed against the certified lot plan, PV layout and electrical single-line design.',
  Earthworks:'Earthworks and slopes to JKR Standard Specification and PBT earthworks guidelines. Cut/fill slopes subject to stability analysis and ESCP at detailed design.',
  Geotechnical:'Soil profiles interpreted from available borehole logs; strata between boreholes are inferred. Supplementary GI recommended where noted in the report.',
  Drainage:'Stormwater design to MSMA 2nd Edition (JPS) — CLAUSE VERIFICATION REQUIRED. Design storm ARI as stated. Discharge to be approved by JPS.',
  Roads:'Pavement to JKR Arahan Teknik (Jalan) — CLAUSE VERIFICATION REQUIRED. Subgrade CBR to be confirmed by in-situ testing before construction.',
  Foundations:'Foundation sizes based on screening loads and borehole data noted. Equipment loads and footprints to be confirmed by vendor. Pile capacities to be verified by preliminary load tests.',
  Cable:'Cable quantities, bedding and protection subject to TNB / electrical designer requirements and the cable schedule.',
  Ancillary:'Retaining structures subject to detailed design with confirmed soil parameters and surcharge.',
  BESS:'BESS layout, spacing and fire access subject to vendor, BOMBA and insurer requirements.',
};
function dwgList(){ return DWG_SET.filter(d => !d.type || d.type === P.type).filter(d => d.cover || (() => { try { return !!d.fn(); } catch(e){ return false; } })()); }
function dwgReg(no){ const r = (P.reg.drawings || []).find(d => d.no === no); const def = DRAWING_ROWS.find(x => x[0] === no); return {title: (r && r.title) || (def && def[1]) || (no === 'C-104' ? 'Geotechnical borehole log summary' : no), rev: r && r.rev && r.rev !== '-' ? r.rev : 'P0'}; }
const _sw = (t, fs) => String(t).length * fs * 0.6;
function wrapTxt(t, maxW, fs){ const out = []; String(t).split(/\s+/).forEach(w => { const l = out.length ? out[out.length - 1] : null; if (l != null && _sw(l + ' ' + w, fs) <= maxW) out[out.length - 1] = l + ' ' + w; else out.push(w); }); return out; }
const sT = (x, y, s, fs, o) => { o = o || {}; return `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.b ? ' font-weight="700"' : ''} fill="${o.c || '#111'}"${o.rot != null ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(s)}</text>`; };
const sL = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${w || 0.25}"/>`;
const sR = (x, y, w, h, sw, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f || 'none'}" stroke="#111" stroke-width="${sw || 0.25}"/>`;
function embedFig(svg, x, y, w, h){ return String(svg).replace(/^<svg[^>]*?viewBox="([^"]+)"[^>]*>/, (m, vb) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" font-family="Arial Narrow, Arial, Helvetica, sans-serif">`); }

function dwgCoverBody(list, X0, Y0, W){
  let b = sT(X0, Y0 + 6, 'DRAWING LIST', 4.2, {b:1}) + sL(X0, Y0 + 8, X0 + 60, Y0 + 8, 0.35);
  const cols = [[0, 'DRG NO.'], [24, 'TITLE'], [168, 'DISCIPLINE'], [205, 'SCALE (A3)'], [248, 'REV']]; let y = Y0 + 16;
  b += sR(X0, y - 4.5, W, 6.5, 0.35, '#eee') + cols.map(([dx, t]) => sT(X0 + 2 + dx, y, t, 2.6, {b:1})).join('');
  list.forEach((d, k) => { y += 6.5; const r = dwgReg(d.no); b += sR(X0, y - 4.5, W, 6.5, 0.18) + sT(X0 + 2, y, d.no, 2.6, {b:1}) + sT(X0 + 26, y, r.title, 2.6) + sT(X0 + 170, y, d.disc, 2.6) + sT(X0 + 207, y, d.scale, 2.4) + sT(X0 + 250, y, r.rev, 2.6); });
  cols.slice(1).forEach(([dx]) => { b += sL(X0 + dx, Y0 + 11.5, X0 + dx, y + 2, 0.18); });
  y += 14; b += sT(X0, y, 'PROJECT PARTICULARS', 4.2, {b:1}) + sL(X0, y + 2, X0 + 70, y + 2, 0.35); y += 8;
  const I = P.info; [['Project', I.name], ['Project no.', I.number], ['Location', [I.location, I.mukim, I.district, I.state].filter(Boolean).join(', ')], ['Lot', I.lot], ['Land area', I.landArea ? `${fmt(+I.landArea, 1)} ha` : '—'],
    ['Capacity', `${I.mwp || '—'} MWp / ${I.mwac || '—'} MWac` + (P.type === 'B' ? ` + BESS ${I.bessMW} MW / ${I.bessMWh} MWh` : '')], ['Grid connection', [I.gridV, I.substation].filter(Boolean).join(' — ')], ['Client', I.client], ['Stage', I.stage]].forEach(([k, v]) => { b += sT(X0 + 2, y, k, 2.8, {c:'#555'}) + sT(X0 + 40, y, v || '—', 2.8); y += 5; });
  y += 6; b += sT(X0, y, 'ABBREVIATIONS', 4.2, {b:1}) + sL(X0, y + 2, X0 + 55, y + 2, 0.35); y += 8;
  const ab = ['RL — reduced level (m)', 'EGL — existing ground level', 'FGL — finished ground level', 'ARI — average recurrence interval', 'HW / TW — headwater / tailwater', 'GWL — groundwater level', 'SPT N — standard penetration test blow count', 'NTS — not to scale', 'TBC — to be confirmed', 'FS — factor of safety'];
  ab.forEach((t, k) => { b += sT(X0 + 2 + (k % 2) * 130, y + Math.floor(k / 2) * 5, t, 2.7); });
  return b;
}

function dwgSheet(d, idx, total){
  const I = P.info, r = dwgReg(d.no), list = dwgList();
  const SW = 420, SH = 297, L = 20, T = 12, Rr = 408, B = 285, TBX = Rr - 92;
  let b = `<rect x="0" y="0" width="${SW}" height="${SH}" fill="#fff"/>`;
  // frame + zones
  let fr = sR(L - 6, T - 6 + 0, Rr - L + 12 - 6, B - T + 12, 0.25) + sR(L, T, Rr - L, B - T, 0.7);
  const ox1 = L - 6, oy1 = T - 6, ox2 = Rr + 0, oy2 = B + 6;
  fr = sR(ox1, oy1, Rr - ox1 + 6, oy2 - oy1, 0.25) + sR(L, T, Rr - L, B - T, 0.7);
  for (let k = 0; k < 8; k++){ const x1 = L + k * (Rr - L) / 8, x2 = L + (k + 1) * (Rr - L) / 8, xm = (x1 + x2) / 2; if (k) fr += sL(x1, oy1, x1, T, 0.2) + sL(x1, B, x1, oy2, 0.2); fr += sT(xm, T - 1.6, String(k + 1), 2.6, {a:'middle'}) + sT(xm, B + 4.4, String(k + 1), 2.6, {a:'middle'}); }
  'ABCDEF'.split('').forEach((c, k) => { const y1 = T + k * (B - T) / 6, y2 = T + (k + 1) * (B - T) / 6, ym = (y1 + y2) / 2; if (k) fr += sL(ox1, y1, L, y1, 0.2) + sL(Rr, y1, Rr + 6, y1, 0.2); fr += sT(L - 3, ym + 1, c, 2.6, {a:'middle'}) + sT(Rr + 3, ym + 1, c, 2.6, {a:'middle'}); });
  b += `<g data-layer="SHEET">${fr}</g>`;
  // drawing area
  const DX = L + 4, DY = T + 4, DW = TBX - L - 8, DH = B - T - 8;
  let body = '';
  if (d.cover) body = dwgCoverBody(list, DX + 2, DY + 2, DW - 6);
  else { let svg = ''; try { svg = d.fn(); } catch(e){ svg = ''; } body = svg ? embedFig(svg, DX, DY, DW, DH) : sT(DX + DW / 2, DY + DH / 2, 'NO DATA — RUN THE RELATED CALCULATION', 5, {a:'middle'}); }
  if (P.sample) body += sT(DX + DW / 2, DY + DH / 2, DEMO_FLAG, 11, {a:'middle', b:1, c:'#999', rot:-28, op:0.18});
  b += `<g data-layer="DRAWING">${body}</g>`;
  // title block
  const tw = Rr - TBX, x = TBX, tx0 = x + 2.5, mw = tw - 5; let tb = sL(x, T, x, B, 0.7); let y = T;
  const cellHead = (yy, t) => sT(tx0, yy + 3.2, t, 1.9, {c:'#555'});
  // general notes
  tb += sT(tx0, y + 5, 'GENERAL NOTES', 3, {b:1}); y += 9;
  const calcRef = (d.calcs || []).filter(c => CALCS[c]).map(c => CALCS[c].no).join(', ');
  const notes = ['All dimensions are in metres and levels in metres RL unless noted otherwise. Coordinates WGS84; datum and survey control to be confirmed against JUPEM-certified topographic survey.',
    'This drawing is a PRELIMINARY tender-stage drawing generated from screening calculations' + (calcRef ? ` (ref. ${calcRef})` : '') + '. Do not scale; figures are diagrammatic except where a scale bar is shown.',
    'Subject to detailed design, site investigation, topographic survey and authority approvals (PBT, JPS, JKR, BOMBA, TNB as applicable).',
    DWG_NOTES[d.disc] || DWG_NOTES.General,
    'Standards and clauses referred to are subject to verification against the current editions adopted by the authority.'];
  if (P.sample) notes.push('Drawing based on DEMONSTRATION DATA — NOT FOR DESIGN.');
  notes.forEach((n, k) => { const ls = wrapTxt(n, mw - 5, 2.4); tb += sT(tx0, y, `${k + 1}.`, 2.4); ls.forEach((l, j) => { tb += sT(tx0 + 4, y + j * 3.3, l, 2.4); }); y += ls.length * 3.3 + 2; });
  // revision table (anchored from bottom up)
  let yb = B; const blk = [];
  const row = (h) => { yb -= h; return yb; };
  // drawing no + rev
  const yDn = row(17); tb += sL(x, yDn, Rr, yDn, 0.5) + sL(x + tw * 0.72, yDn, x + tw * 0.72, B, 0.25) + cellHead(yDn, 'DRAWING NO.') + sT(x + 2.5, yDn + 12.5, d.no, 7, {b:1}) + sT(x + tw * 0.72 + 2, yDn + 3.2, 'REV', 1.9, {c:'#555'}) + sT(x + tw * 0.86, yDn + 12.5, r.rev, 7, {b:1, a:'middle'});
  // scale/size/date/sheet
  const yS = row(9); tb += sL(x, yS, Rr, yS, 0.25); const q = tw / 4; [['SCALE', d.scale.replace(' (SCALE BAR)', '')], ['SIZE', 'A3'], ['DATE', today()], ['SHEET', `${idx} OF ${total}`]].forEach(([h, v], k) => { if (k) tb += sL(x + k * q, yS, x + k * q, yS + 9, 0.25); tb += sT(x + k * q + 1.5, yS + 3, h, 1.8, {c:'#555'}) + sT(x + k * q + 1.5, yS + 7.3, v, k ? 2.4 : 2.0, {b:1}); });
  const yP = row(9); tb += sL(x, yP, Rr, yP, 0.25); const q3 = tw / 3; [['DRAWN', I.prepared || '—'], ['CHECKED', I.checked || '—'], ['APPROVED', I.approved || '—']].forEach(([h, v], k) => { if (k) tb += sL(x + k * q3, yP, x + k * q3, yP + 9, 0.25); tb += sT(x + k * q3 + 1.5, yP + 3, h, 1.8, {c:'#555'}) + sT(x + k * q3 + 1.5, yP + 7.3, v, 2.4); });
  // drawing title
  const tl = wrapTxt(r.title.toUpperCase(), mw, 3.3).slice(0, 3); const yT = row(7 + tl.length * 4.3); tb += sL(x, yT, Rr, yT, 0.25) + cellHead(yT, 'DRAWING TITLE') + tl.map((l, j) => sT(tx0, yT + 8 + j * 4.3, l, 3.3, {b:1})).join('');
  // project
  const pl2 = wrapTxt(String(I.name || '').toUpperCase(), mw, 2.6).slice(0, 3); const yPr = row(6 + pl2.length * 3.4 + 4); tb += sL(x, yPr, Rr, yPr, 0.25) + cellHead(yPr, 'PROJECT') + pl2.map((l, j) => sT(tx0, yPr + 7 + j * 3.4, l, 2.6, {b:1})).join('') + sT(tx0, yPr + 7 + pl2.length * 3.4 + 0.6, `Project no. ${I.number || '—'}`, 2.2);
  // client
  const yC = row(10); tb += sL(x, yC, Rr, yC, 0.25) + cellHead(yC, 'CLIENT') + sT(tx0, yC + 7.5, String(I.client || '—').toUpperCase(), 2.6, {b:1});
  // consultant
  const yCo = row(12); tb += sL(x, yCo, Rr, yCo, 0.25) + cellHead(yCo, 'CIVIL & STRUCTURAL CONSULTANT') + sT(tx0, yCo + 8, String(I.consultant || '—').toUpperCase(), 3, {b:1});
  // stamp
  const ySt = row(19); tb += sL(x, ySt, Rr, ySt, 0.25) + sR(x + 4, ySt + 2.5, tw - 8, 14, 0.6) + sR(x + 5, ySt + 3.5, tw - 10, 12, 0.25) + sT(x + tw / 2, ySt + 10, 'PRELIMINARY', 5, {a:'middle', b:1}) + sT(x + tw / 2, ySt + 14, 'NOT FOR CONSTRUCTION', 2.6, {a:'middle', b:1});
  // revision table
  const yR = row(21); tb += sL(x, yR, Rr, yR, 0.5) + sT(tx0, yR + 3.6, 'REVISIONS', 2.2, {b:1});
  const rc5 = [0, 9, 27, 74, 83]; const rh = yR + 5; tb += sL(x, rh, Rr, rh, 0.2) + [['REV', 0], ['DATE', 9], ['DESCRIPTION', 27], ['BY', 74], ['CHK', 83]].map(([t, dx]) => sT(x + dx + 1.2, rh + 3, t, 1.8, {c:'#555'})).join('');
  for (let k = 0; k < 3; k++){ const yy = rh + 4 + k * 4; tb += sL(x, yy, Rr, yy, 0.15); }
  rc5.slice(1).forEach(dx => { tb += sL(x + dx, rh, x + dx, yR + 21, 0.15); });
  const ini = s => String(s || '').split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3) || '—';
  tb += sT(x + 1.2, rh + 7, r.rev, 2.2, {b:1}) + sT(x + 10.2, rh + 7, today(), 2.0) + sT(x + 28.2, rh + 7, 'PRELIMINARY — FOR TENDER', 2.0) + sT(x + 75.2, rh + 7, ini(I.prepared), 2.0) + sT(x + 84.2, rh + 7, ini(I.checked), 2.0);
  // key plan stub / disclaimer filler between notes and revisions
  if (yR - y > 14){ const ky = yR - 12; tb += sL(x, ky - 2, Rr, ky - 2, 0.25) + sT(tx0, ky + 2, 'DISCIPLINE', 1.9, {c:'#555'}) + sT(tx0, ky + 7, d.disc.toUpperCase(), 3, {b:1}) + sT(Rr - 2.5, ky + 2, 'STAGE', 1.9, {c:'#555', a:'end'}) + sT(Rr - 2.5, ky + 7, String(I.stage || 'TENDER').toUpperCase(), 3, {b:1, a:'end'}); }
  b += `<g data-layer="TITLEBLOCK">${tb}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="dwgsheet" viewBox="0 0 ${SW} ${SH}" width="${SW}mm" height="${SH}mm" font-family="Arial Narrow, Arial, Helvetica, sans-serif">${b}</svg>`;
}
function dwgSheetByNo(no){ const L = dwgList(), i = L.findIndex(d => d.no === no); return i < 0 ? '' : dwgSheet(L[i], i + 1, L.length); }
function dwgFileBase(no){ return `${(P.info.number || 'PRJ').replace(/[^\w-]+/g, '_')}_${no}_${dwgReg(no).rev}`; }

/* ---------- printing (A3 landscape) ---------- */
function dwgPrintHTML(nos){ return `<style class="pagecss">@page{size:A3 landscape;margin:0}</style>` + nos.map(no => `<div class="dwgpage">${dwgSheetByNo(no)}</div>`).join(''); }
function dwgPrint(nos){
  const html = dwgPrintHTML(nos), css = '.dwgpage{width:420mm;height:297mm;overflow:hidden;page-break-after:always;break-after:page}.dwgpage:last-child{page-break-after:auto;break-after:auto}.dwgpage>svg{display:block;width:420mm;height:297mm}';
  if (!FRAMED){
    let pa = document.getElementById('printArea'); if (!pa){ pa = document.createElement('div'); pa.id = 'printArea'; document.body.appendChild(pa); }
    pa.innerHTML = `<style>${css}</style>` + html; document.body.classList.add('print-area');
    const done = () => { document.body.classList.remove('print-area'); pa.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done); setTimeout(() => { try { window.print(); } catch(e){} }, 80); return;
  }
  const w = window.open('', '_blank'); if (!w){ modal('Print', '<p>The browser blocked the print window (embedded page). Download the SVG or DXF instead, or open the platform in its own tab.</p>'); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(P.info.number || '')} Preliminary drawings</title><style>body{margin:0}${css}</style></head><body>${html}</body></html>`); w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch(e){} }, 400);
}


/* ---------- true PDF export (vector, jsPDF + svg2pdf, embedded DejaVu Sans Condensed) ---------- */
async function dwgPdfLib(){
  const load = id => new Promise((res, rej) => { const el = document.getElementById(id); if (!el || el.textContent.length < 1000) return rej(new Error('PDF library not bundled')); const u = URL.createObjectURL(new Blob([el.textContent], {type:'text/javascript'})); const sc = document.createElement('script'); sc.src = u; sc.onload = () => res(); sc.onerror = () => { try { (0, eval)(el.textContent); res(); } catch(e){ rej(e); } }; document.head.appendChild(sc); });
  if (!(window.jspdf && window.jspdf.jsPDF)) await load('lib-jspdf');
  if (!window.svg2pdf) await load('lib-svg2pdf');
  if (!(window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.svg)) throw new Error('PDF library failed to initialise');
  return window.jspdf.jsPDF;
}
function pdfPrepSVG(str){
  return String(str).replace(/ stroke="#fff" stroke-width="3" paint-order="stroke"/g, '')
    .replace(/font-family="[^"]*"/g, 'font-family="DVC"').replace(/ class="[^"]*"/g, '');
}
const MK = {dA:{w:5, hw:3, c:'#111'}, fA:{w:6, hw:4, c:'#1f4e79'}, lA:{w:6, hw:4, c:'#111'}};
function inlineMarkers(root){ // replace SVG markers by explicit arrowhead paths (PDF engines handle markers inconsistently)
  root.querySelectorAll('[marker-end],[marker-start]').forEach(el => {
    let pts = []; if (el.tagName === 'line') pts = [[+el.getAttribute('x1'), +el.getAttribute('y1')], [+el.getAttribute('x2'), +el.getAttribute('y2')]];
    else { const n = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number); for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]); }
    const sw = +(el.getAttribute('stroke-width') || 1);
    const head = (a, b, id) => { const m = MK[id]; if (!m) return; const k = m.w * sw / 10, L = 10 * k, H = m.hw * k, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < 1e-6) return; const ux = dx / l, uy = dy / l;
      const bx = b[0] - ux * L, by = b[1] - uy * L; const pth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pth.setAttribute('d', `M${b[0]} ${b[1]} L${bx - uy * H} ${by + ux * H} L${bx + uy * H} ${by - ux * H} Z`); pth.setAttribute('fill', m.c); pth.setAttribute('stroke', 'none'); el.parentNode.insertBefore(pth, el.nextSibling); };
    const id = a => ((el.getAttribute(a) || '').match(/#(\w+)/) || [])[1];
    if (pts.length > 1){ if (el.getAttribute('marker-end')) head(pts[pts.length - 2], pts[pts.length - 1], id('marker-end')); if (el.getAttribute('marker-start')) head(pts[1], pts[0], id('marker-start')); }
    el.removeAttribute('marker-end'); el.removeAttribute('marker-start'); });
}
async function dwgPdfBlob(nos){
  const jsPDF = await dwgPdfLib();
  const doc = new jsPDF({orientation:'landscape', unit:'mm', format:'a3', compress:true});
  const f1 = (document.getElementById('font-dvc') || {}).textContent, f2 = (document.getElementById('font-dvcb') || {}).textContent;
  if (f1 && f1.length > 1000){ doc.addFileToVFS('DVC.ttf', f1.trim()); doc.addFont('DVC.ttf', 'DVC', 'normal'); }
  if (f2 && f2.length > 1000){ doc.addFileToVFS('DVCB.ttf', f2.trim()); doc.addFont('DVCB.ttf', 'DVC', 'bold'); }
  const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-99999px;top:0;width:1588px;height:1123px;overflow:hidden'; document.body.appendChild(host);
  try {
    for (let k = 0; k < nos.length; k++){
      if (k) doc.addPage('a3', 'landscape');
      host.innerHTML = pdfPrepSVG(dwgSheetByNo(nos[k])); const el = host.firstElementChild; inlineMarkers(el);
      await doc.svg(el, {x:0, y:0, width:420, height:297});
      if (typeof toast === 'function' && nos.length > 2) toast(`Building PDF… sheet ${k + 1} of ${nos.length}`);
    }
  } finally { host.remove(); }
  doc.setProperties({title: `${P.info.name || ''} — Preliminary drawings ${nos.length === 1 ? nos[0] : '(full set)'}`, subject:'Preliminary C&S drawings — not for construction', author: P.info.consultant || '', creator:'C&S Tender Engineering Platform'});
  return doc.output('blob');
}
function dwgPdfDownload(nos, name){
  toast('Building PDF…');
  dwgPdfBlob(nos).then(b => { download(name, b, 'application/pdf'); toast('PDF ready'); })
    .catch(err => { console.error(err); toast('PDF build failed — opening print view instead'); dwgPrint(nos); });
}

/* ---------- SVG → DXF (R12, ASCII) ---------- */
const DXF_MAP = {'→':'->', '←':'<-', '↑':'^', '↓':'v', '≤':'<=', '≥':'>=', '—':'-', '–':'-', '·':'.', '×':'x', '²':'2', '³':'3', '°':'%%d', '±':'%%p', 'Ø':'%%c', '⌀':'%%c', '✓':'OK ', '✗':'X ', '▽':'', 'φ':'phi', 'γ':'gamma', 'β':'beta', 'θ':'theta', 'δ':'delta', '₀':'0', '₁':'1', '₂':'2', '₅':'5', '₅₀':'50', 'ₓ':'x', '’':"'", '‘':"'", '“':'"', '”':'"', '…':'...', '≈':'~', '∑':'Sum', '√':'sqrt', '½':'1/2'};
const dxfStr = s => String(s).replace(/[^\x20-\x7e]/g, c => DXF_MAP[c] != null ? DXF_MAP[c] : '?');
function mMul(A, B){ return [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]]; }
function mParse(t){ let M = [1, 0, 0, 1, 0, 0]; if (!t) return M; const re = /(matrix|translate|scale|rotate)\s*\(([^)]*)\)/g; let m;
  while ((m = re.exec(t))){ const a = m[2].split(/[\s,]+/).filter(Boolean).map(Number); let N;
    if (m[1] === 'matrix') N = a; else if (m[1] === 'translate') N = [1, 0, 0, 1, a[0] || 0, a[1] || 0]; else if (m[1] === 'scale') N = [a[0], 0, 0, a[1] != null ? a[1] : a[0], 0, 0];
    else { const r = (a[0] || 0) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), cx = a[1] || 0, cy = a[2] || 0; N = mMul(mMul([1, 0, 0, 1, cx, cy], [c, s, -s, c, 0, 0]), [1, 0, 0, 1, -cx, -cy]); }
    M = mMul(M, N); } return M; }
function svgToDXF(svgStr, sheetH){
  const doc = new DOMParser().parseFromString(svgStr, 'image/svg+xml'); const root = doc.documentElement; sheetH = sheetH || 297;
  const E = [], layers = new Set(['0']); const f = v => (+v).toFixed(3);
  const P_ = (M, x, y) => [M[0] * x + M[2] * y + M[4], sheetH - (M[1] * x + M[3] * y + M[5])];
  const scl = M => Math.sqrt(Math.abs(M[0] * M[3] - M[1] * M[2]));
  const lay = (el, base) => { const st = el.getAttribute('stroke') || '', da = el.getAttribute('stroke-dasharray'); let L = base; if (el.tagName === 'text') L += '-TEXT'; else if (/^#1f4e79$/i.test(st)) L += '-WATER'; else if (da) L += '-HIDDEN'; layers.add(L); return L; };
  const line = (L, a, b2) => E.push(`0\nLINE\n8\n${L}\n10\n${f(a[0])}\n20\n${f(a[1])}\n30\n0\n11\n${f(b2[0])}\n21\n${f(b2[1])}\n31\n0`);
  const poly = (L, pts, closed) => { if (pts.length < 2) return; E.push(`0\nPOLYLINE\n8\n${L}\n66\n1\n70\n${closed ? 1 : 0}\n10\n0\n20\n0\n30\n0\n` + pts.map(p => `0\nVERTEX\n8\n${L}\n10\n${f(p[0])}\n20\n${f(p[1])}\n30\n0`).join('\n') + `\n0\nSEQEND\n8\n${L}`); };
  const arrow = (L, a, b2, sz) => { const dx = b2[0] - a[0], dy = b2[1] - a[1], l = Math.hypot(dx, dy); if (l < sz * 1.2) return; const ux = dx / l, uy = dy / l; poly(L, [b2, [b2[0] - ux * sz - uy * sz * 0.3, b2[1] - uy * sz + ux * sz * 0.3], [b2[0] - ux * sz + uy * sz * 0.3, b2[1] - uy * sz - ux * sz * 0.3]], true); };
  const stroked = el => { const s = el.getAttribute('stroke'); return s && s !== 'none' && +(el.getAttribute('stroke-width') || 1) > 0; };
  const filledSolid = el => { const fl = el.getAttribute('fill'); return fl && fl !== 'none' && !/^url/.test(fl) && !/^#fff(fff)?$/i.test(fl); };
  const walk = (el, M, base) => {
    const tag = el.tagName; if (/^(defs|pattern|marker|style|title)$/.test(tag)) return;
    if (el.getAttribute('opacity') != null && +el.getAttribute('opacity') < 0.3) return;
    let N = mMul(M, mParse(el.getAttribute('transform'))); const lb = el.getAttribute('data-layer'); if (lb) base = lb;
    if (tag === 'svg' && el !== root){ const vb = (el.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number), x = +el.getAttribute('x') || 0, y = +el.getAttribute('y') || 0, w = +el.getAttribute('width'), h = +el.getAttribute('height');
      if (vb.length === 4 && w && h){ const s = Math.min(w / vb[2], h / vb[3]); N = mMul(N, [s, 0, 0, s, x + (w - vb[2] * s) / 2 - vb[0] * s, y + (h - vb[3] * s) / 2 - vb[1] * s]); } }
    const A = n => +(el.getAttribute(n) || 0);
    if (tag === 'line'){ if (stroked(el)){ const L = lay(el, base), a1 = P_(N, A('x1'), A('y1')), a2 = P_(N, A('x2'), A('y2')); line(L, a1, a2); const sz = 5 * scl(N); if (el.getAttribute('marker-end')) arrow(L, a1, a2, sz); if (el.getAttribute('marker-start')) arrow(L, a2, a1, sz); } }
    else if (tag === 'rect'){ if (stroked(el) || filledSolid(el)){ const x = A('x'), y = A('y'), w = A('width'), h = A('height'); if (w > 0 && h > 0) poly(lay(el, base), [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(p => P_(N, p[0], p[1])), true); } }
    else if (tag === 'polygon' || tag === 'polyline'){ if (stroked(el) || filledSolid(el) || tag === 'polyline'){ const n = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number); const pts = []; for (let k = 0; k + 1 < n.length; k += 2) pts.push(P_(N, n[k], n[k + 1])); const L = lay(el, base); poly(L, pts, tag === 'polygon'); if (el.getAttribute('marker-end') && pts.length > 1) arrow(L, pts[pts.length - 2], pts[pts.length - 1], 5 * scl(N)); } }
    else if (tag === 'circle'){ if (stroked(el) || filledSolid(el)){ const c = P_(N, A('cx'), A('cy')); const L = lay(el, base); E.push(`0\nCIRCLE\n8\n${L}\n10\n${f(c[0])}\n20\n${f(c[1])}\n30\n0\n40\n${f(A('r') * scl(N))}`); } }
    else if (tag === 'path'){ if (stroked(el) || filledSolid(el)){ const L = lay(el, base), d = el.getAttribute('d') || ''; const tk = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = '', cur = [];
        const flush = (cl) => { if (cur.length > 1) poly(L, cur.map(p => P_(N, p[0], p[1])), cl); cur = []; }; const num = () => +tk[i++];
        while (i < tk.length){ if (/[a-zA-Z]/.test(tk[i])) cmd = tk[i++]; const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
          if (C === 'Z'){ cx = sx; cy = sy; flush(true); continue; }
          if (C === 'M'){ flush(false); const x = num(), y = num(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; sx = cx; sy = cy; cur.push([cx, cy]); cmd = rel ? 'l' : 'L'; continue; }
          if (C === 'L' || C === 'T'){ const x = num(), y = num(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; }
          else if (C === 'H'){ const x = num(); cx = rel ? cx + x : x; } else if (C === 'V'){ const y = num(); cy = rel ? cy + y : y; }
          else if (C === 'C'){ i += 4; const x = num(), y = num(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; } else if (C === 'S' || C === 'Q'){ i += 2; const x = num(), y = num(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; }
          else if (C === 'A'){ i += 5; const x = num(), y = num(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; } else { i++; continue; }
          if (!cur.length) cur.push([sx, sy]); cur.push([cx, cy]); }
        flush(false); } }
    else if (tag === 'text'){ const s = dxfStr(el.textContent.trim()); if (s){ const L = lay(el, base), p = P_(N, A('x'), A('y')), h = (+el.getAttribute('font-size') || 10) * scl(N) * 0.72; const rot = -Math.atan2(N[1], N[0]) * 180 / Math.PI; const an = el.getAttribute('text-anchor'), j = an === 'middle' ? 1 : an === 'end' ? 2 : 0;
        E.push(`0\nTEXT\n8\n${L}\n10\n${f(p[0])}\n20\n${f(p[1])}\n30\n0\n40\n${f(h)}\n1\n${s}\n50\n${f(rot)}\n41\n0.82` + (j ? `\n72\n${j}\n11\n${f(p[0])}\n21\n${f(p[1])}\n31\n0` : '')); } return; }
    [...el.children].forEach(c => walk(c, N, base));
  };
  walk(root, [1, 0, 0, 1, 0, 0], 'DWG');
  const col = L => /WATER/.test(L) ? 5 : /HIDDEN/.test(L) ? 8 : /TEXT/.test(L) ? 7 : /SHEET|TITLEBLOCK/.test(L) ? 7 : 7;
  const lt = L => /HIDDEN/.test(L) ? 'DASHED' : 'CONTINUOUS';
  const hdr = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n4\n9\n$EXTMIN\n10\n0\n20\n0\n30\n0\n9\n$EXTMAX\n10\n420\n20\n297\n30\n0\n9\n$LIMMIN\n10\n0\n20\n0\n9\n$LIMMAX\n10\n420\n20\n297\n0\nENDSEC`;
  const tables = `0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLTYPE\n70\n2\n0\nLTYPE\n2\nCONTINUOUS\n70\n0\n3\nSolid line\n72\n65\n73\n0\n40\n0.0\n0\nLTYPE\n2\nDASHED\n70\n0\n3\n__ __ __\n72\n65\n73\n2\n40\n3.0\n49\n2.0\n49\n-1.0\n0\nENDTAB\n0\nTABLE\n2\nLAYER\n70\n${layers.size}\n` +
    [...layers].map(L => `0\nLAYER\n2\n${L}\n70\n0\n62\n${col(L)}\n6\n${lt(L)}`).join('\n') + `\n0\nENDTAB\n0\nTABLE\n2\nSTYLE\n70\n1\n0\nSTYLE\n2\nSTANDARD\n70\n0\n40\n0\n41\n1\n50\n0\n71\n0\n42\n2.5\n3\ntxt\n4\n\n0\nENDTAB\n0\nENDSEC`;
  return [hdr, tables, `0\nSECTION\n2\nENTITIES`, ...E, `0\nENDSEC\n0\nEOF`].join('\n') + '\n';
}
function dwgDXF(no){ return svgToDXF(dwgSheetByNo(no)); }

/* ---------- UI ---------- */
function dwgButtons(no){ return `<button class="sm" data-dwg="view" data-no="${no}">View</button> <button class="sm" data-dwg="pdf" data-no="${no}">PDF</button> <button class="sm" data-dwg="print" data-no="${no}">Print</button> <button class="sm" data-dwg="svg" data-no="${no}">SVG</button> <button class="sm" data-dwg="dxf" data-no="${no}">DXF</button>`; }
function dwgPanel(){
  const L = dwgList();
  return `<div class="card"><h3>Preliminary drawing set (auto-generated)</h3><p class="small">A3 landscape sheets built from the live calculations: border with zone grid, title block (consultant, client, project, drawing no., scale, revision, drawn/checked/approved), general notes, revision table and a <b>PRELIMINARY — NOT FOR CONSTRUCTION</b> stamp. Each sheet downloads separately (vector PDF, SVG, DXF for AutoCAD/BricsCAD) or prints directly, or the whole set downloads as one multi-page A3 PDF.</p>
  <div class="row" style="margin:8px 0"><button class="pri" data-dwg="setpdf">Full set — PDF (A3, one file)</button><button data-dwg="setprint">Full set — print</button><button data-dwg="setdxf">Full set — DXF (.zip)</button><button data-dwg="setsvg">Full set — SVG (.zip)</button></div>
  <div style="overflow-x:auto"><table class="t"><thead><tr><th>Drawing no.</th><th>Title</th><th>Discipline</th><th>Scale</th><th>Rev</th><th>Download</th></tr></thead><tbody>${L.map(d => { const r = dwgReg(d.no); return `<tr><td><b>${d.no}</b></td><td>${esc(r.title)}</td><td>${esc(d.disc)}</td><td class="small">${esc(d.scale)}</td><td>${esc(r.rev)}</td><td style="white-space:nowrap">${dwgButtons(d.no)}</td></tr>`; }).join('')}</tbody></table></div>
  <p class="small muted">DXF: R12 ASCII, millimetres at 1:1 sheet size, layers SHEET / TITLEBLOCK / DRAWING (+ -TEXT, -WATER, -HIDDEN). Hatching and arrowheads are carried in PDF/SVG only. Revision codes and titles follow the drawing register below.</p></div>`;
}
function dwgModuleStrip(mid){ const L = dwgList().filter(d => d.mod === mid); return L.map(d => `<div class="row small" style="align-items:center;gap:6px;margin:4px 0"><span class="muted">Preliminary drawing <b>${d.no}</b> — ${esc(dwgReg(d.no).title)}:</span>${dwgButtons(d.no)}</div>`).join(''); }
document.addEventListener('click', e => {
  const a = e.target.closest('[data-dwg]'); if (!a) return; e.preventDefault(); const k = a.dataset.dwg, no = a.dataset.no;
  try {
    if (k === 'view') modal(`${no} — ${dwgReg(no).title}`, `<div style="border:1px solid #ccc;background:#fff">${dwgSheetByNo(no).replace('width="420mm" height="297mm"', 'width="100%"')}</div><div class="row" style="margin-top:8px">${dwgButtons(no).replace(/<button class="sm" data-dwg="view"[^>]*>View<\/button>/, '')}</div>`);
    else if (k === 'pdf') dwgPdfDownload([no], dwgFileBase(no) + '.pdf');
    else if (k === 'print') dwgPrint([no]);
    else if (k === 'setprint') dwgPrint(dwgList().map(d => d.no));
    else if (k === 'svg') download(dwgFileBase(no) + '.svg', '<?xml version="1.0" encoding="UTF-8"?>\n' + dwgSheetByNo(no), 'image/svg+xml');
    else if (k === 'dxf') download(dwgFileBase(no) + '.dxf', dwgDXF(no), 'application/dxf');
    else if (k === 'setpdf') dwgPdfDownload(dwgList().map(d => d.no), `${(P.info.number || 'PRJ').replace(/[^\w-]+/g, '_')}_Preliminary_Drawing_Set.pdf`);
    else if (k === 'setdxf' || k === 'setsvg'){ const L = dwgList(); const files = L.map(d => ({name: dwgFileBase(d.no) + (k === 'setdxf' ? '.dxf' : '.svg'), data: k === 'setdxf' ? dwgDXF(d.no) : '<?xml version="1.0" encoding="UTF-8"?>\n' + dwgSheetByNo(d.no)}));
      download(`${(P.info.number || 'PRJ').replace(/[^\w-]+/g, '_')}_Preliminary_Drawings_${k === 'setdxf' ? 'DXF' : 'SVG'}.zip`, new Blob([makeZip(files)], {type:'application/zip'})); }
    if (typeof audit === 'function' && k !== 'view') audit('Drawing exported', `${no || 'full set'} ${k}`);
  } catch(err){ console.error(err); toast('Drawing export failed: ' + err.message); }
});
