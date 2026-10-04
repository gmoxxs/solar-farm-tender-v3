'use strict';
/* ==========================================================================
   ENGINEERING FIGURES — drawn from calculation results, with dimensions,
   levels, loads, legends, north arrow and scale bars. Replaces the earlier
   schematic figures (function declarations below supersede report.js ones).
   ========================================================================== */
const FC = {ink:'#111', mute:'#555', soil:'#fff', water:'#eef3f8', wline:'#1f4e79', conc:'#fff', road:'#8c8c8c', pv:'#777', ac:'#111', red:'#111', fail:'#a31f1f', ok:'#1f5f2f'};
const DEFS = `<defs>
<marker id="dA" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 2 L10 5 L0 8 z" fill="#111"/></marker>
<marker id="fA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#1f4e79"/></marker>
<marker id="lA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="#111"/></marker>
<pattern id="pSoil" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><path d="M0 7 L7 0" stroke="#9a9a9a" stroke-width="0.45"/></pattern>
<pattern id="pFill" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><path d="M0 10 L10 0 M0 0 L10 10" stroke="#c4c4c4" stroke-width="0.35"/></pattern>
<pattern id="pConc" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff"/><circle cx="3" cy="4" r="0.55" fill="#777"/><circle cx="10" cy="10" r="0.5" fill="#777"/><circle cx="11" cy="3" r="0.4" fill="#777"/><path d="M6 6 l2.6 1.6 l-2.9 0.8z" fill="none" stroke="#777" stroke-width="0.4"/><path d="M2 10 l2.2 1.9 l-2.8 0.3z" fill="none" stroke="#777" stroke-width="0.4"/></pattern>
<pattern id="pGrav" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff"/><circle cx="2.5" cy="2.5" r="1.2" fill="none" stroke="#888" stroke-width="0.45"/><circle cx="6.8" cy="6.5" r="1.4" fill="none" stroke="#888" stroke-width="0.45"/></pattern>
<pattern id="pBase" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff"/><circle cx="1.3" cy="1.4" r="0.55" fill="#666"/><circle cx="3.8" cy="3.7" r="0.45" fill="#666"/></pattern>
<pattern id="pSand" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff"/><circle cx="1.2" cy="1.2" r="0.35" fill="#777"/><circle cx="3.7" cy="3.4" r="0.35" fill="#777"/><circle cx="3.6" cy="1.0" r="0.25" fill="#999"/></pattern>
<pattern id="pPV" width="12" height="6" patternUnits="userSpaceOnUse"><rect width="12" height="6" fill="#fff"/><path d="M0 1.5 H12 M0 4 H12" stroke="#b5b5b5" stroke-width="0.5"/></pattern>
<pattern id="pWater" width="16" height="6" patternUnits="userSpaceOnUse"><rect width="16" height="6" fill="#eef3f8"/><path d="M2 3 H8" stroke="#9fb6cc" stroke-width="0.5"/></pattern>
<pattern id="pClay" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 2 H8 M0 6 H8" stroke="#888" stroke-width="0.45"/></pattern>
<pattern id="pSilt" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 4 H8" stroke="#888" stroke-width="0.45"/><circle cx="2" cy="1.5" r="0.4" fill="#777"/><circle cx="6" cy="6.5" r="0.4" fill="#777"/></pattern>
<pattern id="pRock" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#fff"/><path d="M0 0 H12 M0 4 H12 M3 0 V4 M9 4 V8" stroke="#777" stroke-width="0.45"/></pattern>
<pattern id="pMod" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#fff"/><path d="M0 6 L6 0" stroke="#666" stroke-width="0.6"/></pattern>
<pattern id="pMaj" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff"/><path d="M0 5 L5 0 M0 0 L5 5" stroke="#222" stroke-width="0.7"/></pattern>
</defs>`;
const fsvg = (w, h, body) => `<svg class="chart dwg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial Narrow, Arial, Helvetica, sans-serif" style="background:#fff">${DEFS}${body}</svg>`;
const tx = (x, y, s, o) => { o = o || {}; return `<text x="${x}" y="${y}" font-size="${o.fs || 10}" fill="${o.c || FC.ink}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.b ? ' font-weight="700"' : ''}${o.i ? ' font-style="italic"' : ''}${o.rot != null ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}${o.halo ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : ''}>${esc(s)}</text>`; };
const ln = (x1, y1, x2, y2, o) => { o = o || {}; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c || FC.ink}" stroke-width="${o.w || 1}"${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.m ? ` marker-end="url(#${o.m})"` : ''}${o.ms ? ` marker-start="url(#${o.ms})"` : ''}/>`; };
const rc = (x, y, w, h, o) => { o = o || {}; return `<rect x="${x}" y="${y}" width="${Math.max(w, 0)}" height="${Math.max(h, 0)}" fill="${o.f || 'none'}" stroke="${o.s || 'none'}" stroke-width="${o.w || 1}"${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.rx ? ` rx="${o.rx}"` : ''}/>`; };
const pg = (pts, o) => { o = o || {}; return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${o.f || 'none'}" stroke="${o.s || 'none'}" stroke-width="${o.w || 1}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`; };
const pl = (pts, o) => { o = o || {}; return `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${o.c || FC.ink}" stroke-width="${o.w || 1}"${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.m ? ` marker-end="url(#${o.m})"` : ''}/>`; };
function dimH(x1, x2, y, t, o){ o = o || {}; const e = o.ext || 0; return (e ? ln(x1, y - e, x1, y + 4, {w:0.6}) + ln(x2, y - e, x2, y + 4, {w:0.6}) : '') + ln(x1, y, x2, y, {w:0.8, m:'dA', ms:'dA'}) + tx((x1 + x2) / 2, y - 4, t, {a:'middle', fs:o.fs || 9.5, halo:1}); }
function dimV(x, y1, y2, t, o){ o = o || {}; const side = o.left ? -5 : 5; return ln(x, y1, x, y2, {w:0.8, m:'dA', ms:'dA'}) + tx(x + side, (y1 + y2) / 2 + 3, t, {a: o.left ? 'end' : 'start', fs:o.fs || 9.5, halo:1}); }
function leader(x, y, x2, y2, t, o){ o = o || {}; return `<circle cx="${x}" cy="${y}" r="1.8" fill="${FC.ink}"/>` + pl([[x, y], [x2, y2], [x2 + (o.left ? -8 : 8), y2]], {w:0.7}) + tx(x2 + (o.left ? -11 : 11), y2 + 3, t, {fs:o.fs || 9, a: o.left ? 'end' : 'start'}); }
function groundLine(x1, x2, y){ let h = ln(x1, y, x2, y, {w:1.1}); for (let x = x1 + 4; x < x2; x += 9) h += ln(x, y, x - 5, y + 5, {w:0.45, c:'#555'}); return h; }
function wlMark(x, y, t){ return `<path d="M${x - 5} ${y - 8} L${x + 5} ${y - 8} L${x} ${y} z" fill="none" stroke="${FC.wline}" stroke-width="1"/>` + ln(x - 7, y + 3, x + 7, y + 3, {c:FC.wline, w:0.8}) + ln(x - 4, y + 6, x + 4, y + 6, {c:FC.wline, w:0.8}) + (t ? tx(x + 9, y - 1, t, {fs:9, c:FC.wline, halo:1}) : ''); }
function loadArrow(x1, y1, x2, y2, t, o){ o = o || {}; return ln(x1, y1, x2, y2, {c:FC.red, w:1.6, m:'lA'}) + (t ? tx(o.tx != null ? o.tx : x1 + 4, o.ty != null ? o.ty : y1 - 3, t, {fs:9, c:FC.red, b:1, a:o.a, halo:1}) : ''); }
function northArrow2(x, y){ return `<circle cx="${x}" cy="${y + 10}" r="13" fill="#fff" stroke="#999" stroke-width="0.6"/><path d="M${x} ${y - 1} l-6 18 l6 -5 l6 5z" fill="${FC.ink}"/>` + tx(x, y - 5, 'N', {a:'middle', b:1, fs:10}); }
function scaleBar(x, y, mPerPx){ const cand = [10, 20, 25, 50, 100, 200, 250, 500, 1000]; let L = cand.find(c => c / mPerPx >= 70) || 1000; const px = L / mPerPx;
  return rc(x, y, px / 2, 4, {f:FC.ink}) + rc(x + px / 2, y, px / 2, 4, {f:'#fff', s:FC.ink, w:0.8}) + tx(x, y + 14, '0', {fs:8.5, a:'middle'}) + tx(x + px / 2, y + 14, String(L / 2), {fs:8.5, a:'middle'}) + tx(x + px, y + 14, `${L} m`, {fs:8.5, a:'middle'}); }
function legendRow(x, y, items, colW){ return items.map(([sw, t], k) => { const xx = x + (k % 4) * (colW || 150), yy = y + Math.floor(k / 4) * 16; return sw(xx, yy) + tx(xx + 24, yy + 9, t, {fs:9}); }).join(''); }
const swBox = (f, s, d) => (x, y) => rc(x, y, 18, 10, {f, s: s || '#888', w:0.8, d});
const swLine = (c, w, d) => (x, y) => ln(x, y + 5, x + 18, y + 5, {c, w, d});
const title = (t, sub) => tx(12, 18, t.toUpperCase(), {fs:11, b:1}) + ln(12, 22, 12 + Math.min(640, t.length * 6.6), 22, {w:0.6}) + (sub ? tx(12, 34, sub, {fs:9, c:FC.mute}) : '');
const nts = (x, y) => tx(x, y, 'NOT TO SCALE', {fs:8.5, c:FC.mute, a:'end'});

/* ---------- contours (marching squares) ---------- */
function contourSegs(z, level){ const segs = [], ny = z.length, nx = z[0].length;
  for (let i = 0; i < ny - 1; i++) for (let j = 0; j < nx - 1; j++){
    const a = z[i][j], b = z[i][j + 1], c = z[i + 1][j + 1], d = z[i + 1][j]; const pts = [];
    const ed = (z1, z2, p1, p2) => { if ((z1 - level) * (z2 - level) < 0){ const t = (level - z1) / (z2 - z1); pts.push([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]); } };
    ed(a, b, [j, i], [j + 1, i]); ed(b, c, [j + 1, i], [j + 1, i + 1]); ed(c, d, [j + 1, i + 1], [j, i + 1]); ed(d, a, [j, i + 1], [j, i]);
    if (pts.length === 2) segs.push(pts); else if (pts.length === 4){ segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); } }
  return segs; }
function contourSVG(D, X, Y, o){ o = o || {}; const zs = D.z.flat(), z0 = Math.ceil(Math.min(...zs)), z1 = Math.floor(Math.max(...zs)); let h = '';
  for (let L = z0; L <= z1; L++){ const major = L % 5 === 0; const segs = contourSegs(D.z, L); if (!segs.length) continue;
    h += `<path d="${segs.map(s => `M${X(s[0][0]).toFixed(1)} ${Y(s[0][1]).toFixed(1)}L${X(s[1][0]).toFixed(1)} ${Y(s[1][1]).toFixed(1)}`).join('')}" stroke="${major ? '#6e6e6e' : '#b9b9b9'}" stroke-width="${major ? 0.7 : 0.35}" fill="none"/>`;
    if (major && o.labels !== false){ const s = segs[Math.floor(segs.length / 2)]; h += tx(X(s[0][0]), Y(s[0][1]), String(L), {fs:7.5, c:'#555', halo:1, a:'middle'}); } }
  return h; }

/* ---------- site plan geometry (shared) ---------- */
function siteGeom(){
  const D = getDEM(), Wm = D.nx * D.dx, Hm = D.ny * D.dx; const la = (+P.info.landArea || Wm * Hm / 1e4) * 1e4;
  const k = Math.min(0.97, Math.sqrt(la / (Wm * Hm))); const bw = Wm * k, bh = Hm * k; let bx = (Wm - bw) / 2, by = (Hm - bh) / 2;
  const sb = R.LAND ? R.LAND.I.s : 10;
  const ps0 = platforms().filter(p => p.id !== 'PF-BESS' || P.type === 'B'); if (ps0.length){ const x1 = Math.min(...ps0.map(p => p.x0 * D.dx)), x2 = Math.max(...ps0.map(p => (p.x0 + p.w) * D.dx)), y1 = Math.min(...ps0.map(p => p.y0 * D.dx)), y2 = Math.max(...ps0.map(p => (p.y0 + p.h) * D.dx)); const g = sb + 30;
    if (x2 + g > bx + bw) bx = Math.min(Wm - bw, x2 + g - bw); if (x1 - g < bx) bx = Math.max(0, x1 - g); if (y2 + g > by + bh) by = Math.min(Hm - bh, y2 + g - bh); if (y1 - g < by) by = Math.max(0, y1 - g); }
  const inB = (x, y) => x > bx + sb + 20 && x < bx + bw - sb - 20 && y > by + sb + 20 && y < by + bh - sb - 20;
  let low = null; for (let i = 0; i < D.ny; i++) for (let j = 0; j < D.nx; j++){ const x = (j + 0.5) * D.dx, y = (i + 0.5) * D.dx; if (inB(x, y) && !inPlatform(i, j) && (!low || D.z[i][j] < low.z)) low = {x, y, z: D.z[i][j]}; }
  const pa = R.DET ? R.DET.res.pondArea : 20000, r = R.DET ? R.DET.I.r : 2; const pw = Math.sqrt(pa / r), pL = pw * r;
  let px = clamp(low.x - pL / 2, bx + sb + 10, bx + bw - sb - 10 - pL), py = clamp(low.y - pw / 2, by + sb + 10, by + bh - sb - 10 - pw);
  const pond = {x: px, y: py, w: pL, h: pw};
  const edges = [['N', pond.y - by], ['S', by + bh - (pond.y + pond.h)], ['W', pond.x - bx], ['E', bx + bw - (pond.x + pond.w)]].sort((a, b) => a[1] - b[1]);
  const e = edges[0][0], pc = [pond.x + pond.w / 2, pond.y + pond.h / 2];
  const outfall = e === 'N' ? [pc[0], by] : e === 'S' ? [pc[0], by + bh] : e === 'W' ? [bx, pc[1]] : [bx + bw, pc[1]];
  const pls = platforms().filter(p => p.id !== 'PF-BESS' || P.type === 'B').map(p => ({p, x: p.x0 * D.dx, y: p.y0 * D.dx, w: p.w * D.dx, h: p.h * D.dx}));
  const ss = pls.find(q => q.p.id === 'PF-SS') || pls[0];
  const entry = [ss ? ss.x + ss.w / 2 : bx + bw / 2, by + bh];
  return {D, Wm, Hm, bx, by, bw, bh, sb, pond, outfall, oe: e, pls, ss, entry};
}

/* ======================= 1. SITE LAYOUT / KEY PLAN ======================= */
function figLayout(){
  const G = siteGeom(), W = 660, m = 26, top = 44, s = (W - 2 * m) / G.Wm, Hp = G.Hm * s;
  const X = x => m + x * s, Y = y => top + y * s, XD = j => X(j * G.D.dx), YD = i => Y(i * G.D.dx);
  let b = title('Site layout plan', 'Derived from DTM, platform, pond and road calculations — schematic arrangement, dimensions to scale');
  b += rc(X(0), Y(0), G.Wm * s, Hp, {f:'#fff', s:'#bbb', w:0.5});
  b += contourSVG(G.D, XD, YD, {labels:true});
  // public road & watercourse outside boundary
  b += ln(X(0), Y(G.by + G.bh + 18), X(G.Wm), Y(G.by + G.bh + 18), {c:'#9a9187', w:5}) + tx(X(G.Wm) - 8, Y(G.by + G.bh + 18) + 12, 'Public road', {fs:8.5, c:FC.mute, halo:1, a:'end'});
  const o = G.outfall, oo = G.oe === 'N' ? [o[0], o[1] - 22] : G.oe === 'S' ? [o[0], o[1] + 30] : G.oe === 'W' ? [o[0] - 22, o[1]] : [o[0] + 22, o[1]];
  // boundary + PV
  const sb = G.sb;
  b += rc(X(G.bx + sb), Y(G.by + sb), (G.bw - 2 * sb) * s, (G.bh - 2 * sb) * s, {f:'url(#pPV)', op:0.85});
  b += rc(X(G.bx), Y(G.by), G.bw * s, G.bh * s, {s:FC.ink, w:1.6, d:'10 3 2 3'}) + rc(X(G.bx + sb), Y(G.by + sb), (G.bw - 2 * sb) * s, (G.bh - 2 * sb) * s, {s:'#999', w:0.7, d:'3 3'});
  // ring road & spines
  const rr = sb + 14, rw = Math.max(2, 5 * s);
  b += rc(X(G.bx + rr), Y(G.by + rr), (G.bw - 2 * rr) * s, (G.bh - 2 * rr) * s, {s:FC.road, w:rw});
  const nsp = Math.max(1, Math.round(G.bw / 380)); for (let k = 1; k <= nsp; k++){ const xx = G.bx + rr + k * (G.bw - 2 * rr) / (nsp + 1); b += ln(X(xx), Y(G.by + rr), X(xx), Y(G.by + G.bh - rr), {c:FC.road, w:rw}); }
  // drains (perimeter, inside boundary) toward pond
  const di = sb + 6; b += rc(X(G.bx + di), Y(G.by + di), (G.bw - 2 * di) * s, (G.bh - 2 * di) * s, {s:FC.wline, w:1.1, d:'6 3'});
  // main access
  b += ln(X(G.entry[0]), Y(G.by + G.bh + 18), X(G.entry[0]), Y(G.ss ? G.ss.y + G.ss.h : G.by + G.bh / 2), {c:'#8f877c', w:Math.max(3, 7 * s)});
  // platforms
  const nm = {'PF-SS':'Substation', 'PF-BESS':'BESS', 'PF-OM':'O&M', 'PF-LD':'Laydown'};
  G.pls.forEach(q => { const rl = R.CF ? R.CF.res['rl_' + q.p.id] : null; b += rc(X(q.x), Y(q.y), q.w * s, q.h * s, {f: q.p.id === 'PF-LD' ? '#fff' : 'url(#pGrav)', s:FC.ink, w:0.9}) + tx(X(q.x + q.w / 2), Y(q.y + q.h / 2) - 1, nm[q.p.id] || q.p.name, {fs:8.5, a:'middle', b:1, halo:1}) + (rl ? tx(X(q.x + q.w / 2), Y(q.y + q.h / 2) + 9, `RL ${f2(rl)}`, {fs:7.5, a:'middle', halo:1}) : ''); });
  // pond + outfall
  const P2 = G.pond; b += rc(X(P2.x), Y(P2.y), P2.w * s, P2.h * s, {f:'url(#pWater)', s:FC.wline, w:1.2}) + tx(X(P2.x + P2.w / 2), Y(P2.y + P2.h / 2) + 3, 'Detention pond', {fs:8.5, a:'middle', b:1, c:FC.wline, halo:1});
  const pc = [P2.x + P2.w / 2, P2.y + P2.h / 2];
  b += pl([[X(pc[0]), Y(pc[1])], [X(o[0]), Y(o[1])], [X(oo[0]), Y(oo[1])]], {c:FC.wline, w:1.6, m:'fA'}) + tx(X(oo[0]) + (G.oe === 'W' ? -4 : G.oe === 'E' ? 4 : -6), Y(oo[1]) + (G.oe === 'S' ? 12 : G.oe === 'N' ? 4 : -4), 'Outfall → receiving watercourse', {fs:8.5, c:FC.wline, halo:1, a: G.oe === 'E' ? 'start' : 'end'});
  // key points
  const pts = [];
  const mark = (lab, x, y) => { pts.push(lab); const n = pts.length; b += `<circle cx="${X(x)}" cy="${Y(y)}" r="6.5" fill="#fff" stroke="#111" stroke-width="0.9"/>` + tx(X(x), Y(y) + 3.2, String(n), {fs:8, a:'middle', b:1}); };
  const findP = id => G.pls.find(q => q.p.id === id);
  (P.coords || []).forEach(c => { const L = c.label.toLowerCase(); let xy = null;
    if (/centroid/.test(L)) xy = [G.bx + G.bw / 2, G.by + G.bh / 2]; else if (/entrance/.test(L)) xy = [G.entry[0], G.by + G.bh]; else if (/substation/.test(L) && findP('PF-SS')){ const q = findP('PF-SS'); xy = [q.x, q.y]; }
    else if (/bess/.test(L) && findP('PF-BESS')){ const q = findP('PF-BESS'); xy = [q.x, q.y]; } else if (/poi/.test(L) && findP('PF-SS')){ const q = findP('PF-SS'); xy = [q.x + q.w, q.y + q.h]; }
    else if (/pond/.test(L)) xy = [P2.x + P2.w * 0.15, P2.y + P2.h * 0.25]; else if (/outfall/.test(L)) xy = o; else if (/crossing|culvert/.test(L)) xy = [(pc[0] + o[0]) / 2, (pc[1] + o[1]) / 2];
    if (xy) mark(c, xy[0], xy[1]); });
  b += northArrow2(W - 24, 14) + `<g>${rc(X(G.Wm) - 112, top + Hp - 26, 104, 22, {f:'#fff', op:0.9})}${scaleBar(X(G.Wm) - 104, top + Hp - 22, 1 / s)}</g>`;
  let y = top + Hp + 34;
  b += legendRow(m, y, [[swBox('url(#pPV)', '#888'), 'PV array (developable)'], [swBox('url(#pGrav)', FC.ink), 'Platform (design RL)'], [swBox('url(#pWater)', FC.wline), 'Detention pond'], [swLine(FC.road, 4), 'Internal road'], [swLine(FC.ink, 1.6, '10 3 2 3'), 'Site boundary / fence'], [swLine('#999', 0.8, '3 3'), `Setback (${sb} m)`], [swLine(FC.wline, 1.2, '6 3'), 'Perimeter drain'], [swLine('#6e6e6e', 0.7), 'Contour (1 m; 5 m bold)']], 152);
  y += 40;
  if (pts.length){ b += tx(m, y, 'Key points (WGS84)', {fs:9.5, b:1}); pts.forEach((c, k) => { const yy = y + 14 + Math.floor(k / 2) * 13, xx = m + (k % 2) * 310; b += tx(xx, yy, `${k + 1}  ${c.label} — ${(+c.lat).toFixed(5)}° N, ${(+c.lon).toFixed(5)}° E`, {fs:8.8}); }); y += 14 + Math.ceil(pts.length / 2) * 13; }
  b += tx(m, y + 8, `Land ${fmt(+P.info.landArea, 1)} ha · pond ${R.DET ? f2(R.DET.res.pondArea / 1e4) : '—'} ha · roads ${R.RDQ ? fmt(R.RDQ.res.Lroad, 0) : '—'} m (layout indicative; positions of PV blocks and roads to be confirmed by layout drawing)`, {fs:8.5, c:FC.mute});
  return fsvg(W, y + 18, b);
}
function figSitePlan(){ return figLayout(); }

/* ======================= 2. CONTOUR PLAN (DTM) ======================= */
function figDEM(){
  const D = getDEM(), W = 640, m = 40, top = 44, s = (W - m - 20) / (D.nx * D.dx), Hp = D.ny * D.dx * s;
  const X = j => m + j * D.dx * s, Y = i => top + i * D.dx * s; const zs = D.z.flat(), zn = Math.min(...zs), zx = Math.max(...zs);
  let b = title('Existing ground — contour plan', `DTM ${D.nx}×${D.ny} grid at ${D.dx} m${D.src === 'demo' ? ' (demonstration grid)' : ''}; ground ${f1(zn)}–${f1(zx)} m RL`);
  const c = (X(1) - X(0)); 
  b += contourSVG(D, X, Y);
  b += rc(X(0), Y(0), (D.nx - 1) * c, (D.ny - 1) * c, {s:'#999', w:0.8});
  for (let mtr = 0; mtr <= (D.nx - 1) * D.dx; mtr += 400){ b += ln(X(mtr / D.dx), Y(D.ny - 1), X(mtr / D.dx), Y(D.ny - 1) + 4, {w:0.6}) + tx(X(mtr / D.dx), Y(D.ny - 1) + 14, `${mtr}`, {fs:8, a:'middle', c:FC.mute}); }
  for (let mtr = 0; mtr <= (D.ny - 1) * D.dx; mtr += 400){ b += ln(X(0) - 4, Y(mtr / D.dx), X(0), Y(mtr / D.dx), {w:0.6}) + tx(X(0) - 6, Y(mtr / D.dx) + 3, `${mtr}`, {fs:8, a:'end', c:FC.mute}); }
  b += tx((X(0) + X(D.nx - 1)) / 2, Y(D.ny - 1) + 26, 'Easting from grid origin (m)', {fs:8.5, a:'middle', c:FC.mute}) + tx(12, top + Hp / 2, 'Southing (m)', {fs:8.5, a:'middle', c:FC.mute, rot:-90});
  const nm = {'PF-SS':'Substation', 'PF-BESS':'BESS', 'PF-OM':'O&M', 'PF-LD':'Laydown'};
  platforms().filter(p => p.id !== 'PF-BESS' || P.type === 'B').sort((a, b2) => a.x0 - b2.x0).forEach((p, k) => { const egl = platEGL(p), rl = R.CF ? R.CF.res['rl_' + p.id] : null;
    b += rc(X(p.x0) - c / 2, Y(p.y0) - c / 2, p.w * c, p.h * c, {f:'#fff', s:FC.ink, w:1.2, op:0.85}) + rc(X(p.x0) - c / 2, Y(p.y0) - c / 2, p.w * c, p.h * c, {s:FC.ink, w:1.2}) +
      tx(X(p.x0) - c / 2 + p.w * c / 2, Y(p.y0) - c / 2 + p.h * c / 2 + 3, nm[p.id] || p.name, {fs:8.5, a:'middle', b:1}) + tx(X(p.x0) - c / 2 + p.w * c / 2, k % 2 ? Y(p.y0) - c / 2 + p.h * c + 11 : Y(p.y0) - c / 2 - 4, `EGL ${f1(egl)} → RL ${rl ? f2(rl) : '—'}`, {fs:7.5, a:'middle', halo:1}); });
  let hi = {z: -1e9}, lo = {z: 1e9}; D.z.forEach((r, i) => r.forEach((z, j) => { if (z > hi.z) hi = {z, i, j}; if (z < lo.z) lo = {z, i, j}; }));
  [[hi, 'High point'], [lo, 'Low point']].forEach(([p, t]) => { const rt = X(p.j) > W - 140; b += `<path d="M${X(p.j)} ${Y(p.i) - 5} l4 8 h-8z" fill="${FC.ink}"/>` + tx(X(p.j) + (rt ? -7 : 7), Y(p.i) + 3, `${t} ${f2(p.z)}`, {fs:8.5, halo:1, a: rt ? 'end' : 'start'}); });
  b += northArrow2(W - 24, 14) + scaleBar(X(D.nx - 1) - 110, top + Hp - 26, 1 / s);
  const y = top + Hp + 40; b += legendRow(m, y, [[swLine('#6e6e6e', 0.7), 'Major contour (5 m)'], [swLine('#b9b9b9', 0.4), 'Minor contour (1 m)'], [swBox('#fff', FC.ink), 'Platform: EGL → design RL'], [(x, yy) => `<path d="M${x + 9} ${yy} l4 8 h-8z" fill="${FC.ink}"/>`, 'Spot level']], 150);
  return fsvg(W, y + 20, b);
}

/* ======================= 3. GRADING ZONES ======================= */
function figGrading(){
  const r = R.GRD; if (!r || !r.zone) return ''; const D = getDEM(), W = 640, m = 40, top = 44, s = (W - m - 20) / (D.nx * D.dx), Hp = D.ny * D.dx * s, c = D.dx * s;
  const X = j => m + j * c, Y = i => top + i * c;
  let b = title('Grading zones — PV array vs mounting slope tolerance', `${r.I.sys}: N–S ≤ ${r.I.sNS}%, E–W ≤ ${r.I.sEW}% · ${f1(r.res.nogradePct)}% of array needs no grading · grading ${f2(r.res.gradeArea)} ha, ${fmt(r.res.gradeV, 0)} m³ cut = fill`);
  const col = {'-1':'#e6e6e6', 0:'#fff', 1:'url(#pMod)', 2:'url(#pMaj)'};
  r.zone.forEach((row, i) => row.forEach((z, j) => { b += `<rect x="${X(j)}" y="${Y(i)}" width="${c + 0.3}" height="${c + 0.3}" fill="${col[z]}"/>`; }));
  b += contourSVG(D, j => X(j) + c / 2, i => Y(i) + c / 2, {labels:false});
  r.zone.forEach((row, i) => row.forEach((z, j) => { if (z > 0) b += `<rect x="${X(j)}" y="${Y(i)}" width="${c}" height="${c}" fill="none" stroke="#111" stroke-width="0.5"/>`; }));
  b += rc(X(0), Y(0), D.nx * c, D.ny * c, {s:'#999', w:0.8});
  const zc = []; r.zone.forEach((row, i) => row.forEach((z, j) => { if (z > 0) zc.push([i, j]); }));
  if (zc.length){ const ci = sum(zc.map(p => p[0])) / zc.length, cj = sum(zc.map(p => p[1])) / zc.length; b += leader(X(cj) + c / 2, Y(ci) + c / 2, X(cj) - 70, Y(ci) - 40, `Local grading required (${zc.length} cells)`, {left:true}); }
  platforms().filter(p => p.id !== 'PF-BESS' || P.type === 'B').forEach(p => b += tx(X(p.x0 + p.w / 2), Y(p.y0 + p.h / 2) + 3, p.id.replace('PF-', ''), {fs:8, a:'middle', b:1}));
  b += northArrow2(W - 24, 14) + scaleBar(X(D.nx) - 110, top + Hp - 26, 1 / s);
  const y = top + Hp + 18; b += legendRow(m, y, [[swBox('#fff', '#888'), 'No grading (within tolerance)'], [swBox('url(#pMod)', '#111'), 'Moderate (≤ 1.5 × tolerance)'], [swBox('url(#pMaj)', '#111'), 'Major (> 1.5 × tolerance)'], [swBox('#e6e6e6', '#888'), 'Platform (graded separately)']], 150);
  return fsvg(W, y + 22, b);
}

/* ======================= 4. CATCHMENT & DRAINAGE NETWORK ======================= */
function figCatch(){
  const sc = subcatch(); if (!sc.length || !R.RAT) return ''; const W = 680, rowH = 40, top = 56, H = top + sc.length * rowH + 150;
  const tc = (R.TC && R.TC.sc) || {}; let b = title('Catchment & drainage network — flow diagram', `Design storms: minor ${R.IDF ? R.IDF.res.Tmin : 10}-yr (drains), ${R.RAT.I.Tdet}-yr (detention); flows from Rational Method`);
  const nodeX = 330, nodeW = 150; const box = (x, y, w, h, head, lines, st) => rc(x, y, w, h, {f:'#fff', s:FC.ink, w: st === 'w' ? 1.4 : 0.9}) + tx(x + 8, y + 15, head, {fs:9.5, b:1}) + lines.map((l, k) => tx(x + 8, y + 29 + k * 12, l, {fs:8.5, c: /FAIL/.test(l) ? FC.fail : FC.ink})).join('');
  b += tx(20, top - 8, 'Sub-catchment', {fs:8.5, b:1, c:FC.mute}) + tx(170, top - 8, 'A (ha) · C pre→post · tc · Q', {fs:8.5, b:1, c:FC.mute});
  sc.forEach((c, k) => { const y = top + k * rowH; const q = c._q || {};
    b += rc(20, y, 54, rowH - 8, {f:'#fff', s:'#111', w:0.9}) + tx(47, y + 20, c.id, {fs:9.5, a:'middle', b:1});
    b += tx(84, y + 13, `${f1(+c.area)} ha · C ${f2(+c.cPre)}→${f2(+c.cPost)}`, {fs:8.8}) + tx(84, y + 26, `tc ${tc[c.id] ? f0(tc[c.id].post) : '—'} min · Q${R.IDF ? R.IDF.res.Tmin : 10} ${f2(q.qmin || 0)} m³/s`, {fs:8.8, c:FC.mute});
    b += pl([[250, y + 16], [nodeX - 4, y + 16 < top + 60 ? top + 30 : top + 30 + Math.min(k, 3) * 8]], {c:FC.wline, w:1.1, m:'fA'}); });
  const dz = R.DSZ ? R.DSZ.res : {}, man = R.MAN, cul = R.CUL, det = R.DET, out = R.OUT;
  b += box(nodeX, top, nodeW, 70, 'Collector drains', [`Design Q ${f2(man ? man.I.Q : 0)} m³/s (largest SC)`, `Tender: ${man ? `${man.I.b}×${man.I.D} m ${man.I.lin.split(' ')[0].toLowerCase()}` : '—'} ${man && man.status === 'fail' ? 'FAIL' : ''}`, `Adopted: ${dz.b ? `${f2(dz.b)}×${f2(dz.D)} m concrete` : '—'}`]);
  b += ln(nodeX + nodeW / 2, top + 70, nodeX + nodeW / 2, top + 100, {c:FC.wline, w:1.4, m:'fA'}) + tx(nodeX + nodeW / 2 + 6, top + 90, `Q${R.RAT.I.Tdet} post ${f1(R.RAT.res.Qpost)} m³/s`, {fs:8.5, c:FC.wline});
  b += box(nodeX, top + 102, nodeW, 58, 'Road crossings', [`${cul ? cul.I.nx : '—'} × culvert ${cul ? `${cul.I.nb}×Ø${cul.I.D} m` : ''}`, `HW ${cul ? f2(cul.res.HW) : '—'} m ≤ ${cul ? cul.I.HWa : '—'} m ${cul && cul.status === 'fail' ? 'FAIL' : ''}`]);
  b += ln(nodeX + nodeW / 2, top + 160, nodeX + nodeW / 2, top + 186, {c:FC.wline, w:1.4, m:'fA'});
  b += box(nodeX, top + 188, nodeW, 72, 'Detention pond', [`Storage ${det ? fmt(det.res.Vreq, 0) : '—'} m³`, `Footprint ${det ? f2(det.res.pondArea / 1e4) : '—'} ha, ${det ? det.I.H : '—'} m live`, `Orifice Ø${det ? f0(det.res.Do * 1000) : '—'} mm; spillway ${det ? f1(det.res.Ls) : '—'} m`], 'w');
  b += ln(nodeX + nodeW, top + 224, nodeX + nodeW + 40, top + 224, {c:FC.wline, w:1.4, m:'fA'}) + tx(nodeX + nodeW + 2, top + 212, `Qout ${det ? f1(det.res.Qo) : '—'}`, {fs:8, c:FC.wline});
  b += box(nodeX + nodeW + 42, top + 188, 150, 72, 'Outfall / receiving', [`Capacity ${out ? f1(out.res.Qcap) : '—'} m³/s`, `V ${out ? f2(out.res.V) : '—'} m/s ${out && out.status === 'fail' ? 'FAIL' : ''}`, 'JPS approval required'], 'w');
  // pre/post bars
  const by = top + Math.max(sc.length * rowH, 270) + 10, mx = Math.max(R.RAT.res.Qpost, R.RAT.res.Qpre, det ? det.res.Qo : 0), bw = 300 / mx;
  b += tx(20, by, `Peak discharge — whole site (${R.RAT.I.Tdet}-yr)`, {fs:9.5, b:1});
  [['Pre-development', R.RAT.res.Qpre, '#bdbdbd'], ['Post-development (no detention)', R.RAT.res.Qpost, '#555'], ['Post-development with pond', det ? det.res.Qo : 0, 'url(#pMod)']].forEach(([t, v, col], k) => { const y = by + 10 + k * 18; b += tx(20, y + 10, t, {fs:8.8}) + rc(200, y, v * bw, 12, {f:col, s:'#111', w:0.6}) + tx(204 + v * bw, y + 10, `${f2(v)} m³/s`, {fs:8.8}); });
  return fsvg(W, Math.max(H, by + 72), b);
}

/* ======================= 5. DRAIN SECTIONS ======================= */
function drainSec(x0, y0, sc, o){
  const {b, D, z, fb, yn, lin, head, st, Q, V} = o; const tw = b + 2 * z * D, cx = x0 + (tw * sc) / 2 + 50, P = (x, y) => [cx + x * sc, y0 + D * sc - y * sc];
  let g = tx(cx, y0 - 28, head, {fs:10, b:1, a:'middle'}) + tx(cx, y0 - 15, st === 'fail' ? 'FAIL — capacity / velocity' : 'PASS', {fs:9, b:1, a:'middle', c: st === 'fail' ? FC.fail : FC.ok});
  const gl = y0; g += groundLine(cx - tw / 2 * sc - 40, cx - tw / 2 * sc, gl) + groundLine(cx + tw / 2 * sc, cx + tw / 2 * sc + 40, gl);
  const t = /Concrete/.test(lin) ? 0.12 : 0; const out = [P(-tw / 2 - 0.25, D), P(-tw / 2, D), P(-b / 2, 0), P(b / 2, 0), P(tw / 2, D), P(tw / 2 + 0.25, D), P(tw / 2 + 0.25, -0.35 - t), P(-tw / 2 - 0.25, -0.35 - t)];
  g += pg(out, {f:'url(#pSoil)'});
  if (t) g += pg([P(-tw / 2, D), P(-b / 2, 0), P(b / 2, 0), P(tw / 2, D), P(tw / 2 + t * 1.4, D), P(b / 2 + t * 0.6, -t), P(-b / 2 - t * 0.6, -t), P(-tw / 2 - t * 1.4, D)], {f:'url(#pConc)', s:'#777', w:0.6});
  else g += pl([P(-tw / 2, D), P(-b / 2, 0), P(b / 2, 0), P(tw / 2, D)], {c:'#111', w:1.4});
  const yy = Math.min(yn, D + 0.15), ww = b + 2 * z * Math.min(yy, D);
  g += pg([P(-ww / 2, Math.min(yy, D)), P(-b / 2, 0), P(b / 2, 0), P(ww / 2, Math.min(yy, D))], {f:'url(#pWater)'});
  if (yn > D - fb) g += rc(P(-ww / 2, 0)[0], P(0, D)[1], ww * sc, (Math.min(yn, D) - (D - fb)) * sc, {f:'url(#pMaj)', op:0.6});
  g += wlMark(P(ww / 4, Math.min(yy, D))[0], P(0, Math.min(yy, D))[1], `y = ${f2(yn)} m`);
  g += dimH(P(-b / 2, 0)[0], P(b / 2, 0)[0], P(0, 0)[1] + 22, `b = ${f2(b)} m`);
  g += dimV(P(tw / 2 + 0.25, 0)[0] + 40, P(0, D)[1], P(0, 0)[1], `D = ${f2(D)} m`);
  g += dimV(P(tw / 2 + 0.25, 0)[0] + 4, P(0, D)[1], P(0, D - fb)[1], `fb ${fb}`) + ln(P(tw / 2, D - fb)[0] - (z * fb) * sc, P(0, D - fb)[1], P(tw / 2 + 0.25, 0)[0] + 6, P(0, D - fb)[1], {w:0.5, d:'2 2'});
  if (z){ const a = P(tw / 2 - z * 0.5, D - 0.5), c2 = P(tw / 2, D); g += pl([[a[0] - 8, a[1]], [c2[0] - 8, a[1]], [c2[0] - 8, c2[1]]], {w:0.6}) + tx(c2[0] - 4, a[1] - 2, `1:${z}`, {fs:8.5}); }
  g += tx(cx, P(0, 0)[1] + 46, `${lin} · Q = ${f2(Q)} m³/s · V = ${f2(V)} m/s`, {fs:8.8, a:'middle', c:FC.mute});
  return g;
}
function figDrain(){
  const m = R.MAN, d = R.DSZ; if (!m || !d || !d.res.b) return '';
  const W = 680, H = 250, sc = 70;
  let b = title('Typical drain sections — tender proposal vs adopted (auto-sized)', `Design flow ${f2(m.I.Q)} m³/s at S = ${m.I.S}; ▽ = normal depth at design flow; red band = encroachment into freeboard`);
  b += drainSec(10, 90, Math.min(sc, 210 / (m.I.b + 2 * m.I.z * m.I.D + 0.5)), {b: m.I.b, D: m.I.D, z: m.I.shape === 'Rectangular' ? 0 : m.I.z, fb: m.I.fb, yn: m.res.yn, lin: m.I.lin, head: 'Proposed (tender)', st: m.status, Q: m.I.Q, V: m.res.V});
  const yn2 = normalDepth(d.I.Q, y => trapG(d.res.b, d.I.z, y), LINING[d.I.lin].n, d.I.S, d.res.D) || d.res.D - d.I.fb;
  b += drainSec(350, 90, Math.min(sc, 210 / (d.res.b + 2 * d.I.z * d.res.D + 0.5)), {b: d.res.b, D: d.res.D, z: d.I.z, fb: d.I.fb, yn: yn2, lin: d.I.lin, head: 'Adopted (auto-sized)', st: 'pass', Q: d.I.Q, V: d.res.V});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 6. ROAD CROSS-SECTION ======================= */
function figRoad(){
  const r = R.PAV, q = R.RDQ; if (!r) return ''; const w = q ? q.I.wi : 4, sh = q ? q.I.sh : 0.5, tb = r.I.tb / 1000, ts = r.I.ts / 1000, ex = 4;
  const W = 680, H = 260, sx = 420 / (w + 2 * sh + 3.2), sy = sx * ex, cx = W / 2 - 10, y0 = 100; const X = x => cx + x * sx, Yv = y => y0 - y * sy;
  let b = title(`Typical internal road cross-section (carriageway ${w} m)`, `Vertical scale exaggerated ×${ex}; required granular thickness ${f0(r.res.treq)} mm over subgrade CBR ${r.I.cbr}% (CBR method)`);
  const half = w / 2, cf = 0.03, e = half + sh;
  const top = x => -cf * Math.abs(x); // crown at 0
  const surf = [[-e, top(-e)], [-half, top(-half)], [0, 0], [half, top(half)], [e, top(e)]];
  const bot = d => surf.map(([x, y]) => [x * (1 + 0.04 * d), y - d]);
  const layer = (d1, d2, fill) => pg([...bot(d1).map(([x, y]) => [X(x), Yv(y)]), ...bot(d2).reverse().map(([x, y]) => [X(x), Yv(y)])], {f:fill, s:'#777', w:0.6});
  b += pg([[X(-e - 1.6), Yv(-cf * e - 0.02)], [X(-e), Yv(top(-e))], [X(e), Yv(top(e))], [X(e + 1.6), Yv(-cf * e - 0.02)], [X(e + 1.6), Yv(-tb - ts - 0.45)], [X(-e - 1.6), Yv(-tb - ts - 0.45)]], {f:'url(#pSoil)'});
  b += layer(0, tb, 'url(#pBase)') + layer(tb, tb + ts, 'url(#pGrav)');
  b += pl(bot(tb + ts).map(([x, y]) => [X(x), Yv(y)]), {c:'#111', w:0.9, d:'6 2 1 2'});
  [-1, 1].forEach(sg => { const x1 = sg * (e + 0.2), x2 = sg * (e + 1.4); b += pl([[X(x1), Yv(-cf * e)], [X(sg * (e + 0.8)), Yv(-cf * e - 0.35)], [X(x2), Yv(-cf * e)]], {c:'#111', w:1.1}) + wlMark(X(sg * (e + 0.8)), Yv(-cf * e - 0.22)); });
  b += dimH(X(-half), X(half), Yv(0) - 30, `Carriageway ${w} m`, {ext:24}) + dimH(X(half), X(e), Yv(0) - 30, `${sh}`, {ext:24}) + dimH(X(-e), X(-half), Yv(0) - 30, `${sh}`, {ext:24});
  b += tx(X(half / 2), Yv(top(half / 2)) - 5, '3% →', {fs:8.5, a:'middle', halo:1}) + tx(X(-half / 2), Yv(top(-half / 2)) - 5, '← 3%', {fs:8.5, a:'middle', halo:1});
  const lx = X(e + 1.8);
  b += leader(X(half * 0.7), Yv(top(half * 0.7) - tb / 2), lx, Yv(-tb / 2) - 10, `Crusher-run base ${r.I.tb} mm`);
  b += leader(X(half * 0.85), Yv(top(half * 0.85) - tb - ts / 2), lx, Yv(-tb - ts / 2), `Granular sub-base ${r.I.ts} mm`);
  b += leader(X(half * 0.5), Yv(-tb - ts - cf * half * 0.5), lx, Yv(-tb - ts) + 18, 'Geotextile separator');
  b += leader(X(-half * 0.5), Yv(-tb - ts - 0.3), X(-e - 1.4), Yv(-tb - ts - 0.3) + 8, `Subgrade CBR ${r.I.cbr}% (proof-rolled)`, {left:true});
  b += leader(X(-e - 0.8), Yv(-cf * e - 0.3), X(-e - 1.4), Yv(-cf * e) - 22, 'Grass swale', {left:true});
  b += dimV(X(-half) - 14, Yv(top(-half)), Yv(top(-half) - tb - ts), `${f0((tb + ts) * 1000)} mm`, {left:true});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 7. EQUIPMENT FOUNDATION ======================= */
function figFdn(cid){
  cid = cid || 'FDN_TX'; const r = R[cid]; if (!r) return ''; const I = r.I, c = CALCS[cid];
  const W = 680, H = 400, cx = 250, gl = 175, s = Math.min(260 / I.B, 150 / (I.D + I.hp + 1.2));
  const X = x => cx + x * s, Y = y => gl - y * s; // y up from FGL
  const yb = -I.D, yt = -I.D + I.h, ped = I.hp - (I.D - I.h);
  let b = title(c.title + ' — section', `Pad ${I.B} × ${I.L} × ${I.h} m at ${I.D} m depth; pedestal ${I.c1} × ${I.c2} m; ${I.nos} no.`);
  b += rc(X(-I.B / 2 - 0.9), Y(0), (I.B + 1.8) * s, (I.D + 0.4) * s, {f:'url(#pFill)'});
  b += groundLine(X(-I.B / 2 - 1.2), X(I.B / 2 + 1.2), Y(0)) + tx(X(I.B / 2 + 1.25), Y(0) + 3, 'FGL ±0.00', {fs:8.5});
  b += rc(X(-I.B / 2 - 0.05), Y(yb), (I.B + 0.1) * s, 0.075 * s + 2, {f:'url(#pSand)', s:'#555', w:0.4});
  b += rc(X(-I.B / 2), Y(yt), I.B * s, I.h * s, {f:'url(#pConc)', s:FC.ink, w:1.2});
  b += rc(X(-I.c1 / 2), Y(yt + I.hp), I.c1 * s, I.hp * s, {f:'url(#pConc)', s:FC.ink, w:1.2});
  const eqH = Math.min(1.2, 34 / s); { const ex1 = X(-I.c1 / 2 + 0.15), ey1 = Y(ped + eqH), ew = (I.c1 - 0.3) * s, eh = eqH * s; b += rc(ex1, ey1, ew, eh, {f:'#fff', s:'#111', w:0.7, d:'6 2'}) + ln(ex1, ey1, ex1 + ew, ey1 + eh, {w:0.35, c:'#888'}) + ln(ex1 + ew, ey1, ex1, ey1 + eh, {w:0.35, c:'#888'}) + tx(X(0), Y(ped + eqH / 2) + 3, 'EQUIPMENT (BY VENDOR)', {fs:8, a:'middle', halo:1}); }
  const cv = I.cov / 1000; b += ln(X(-I.B / 2 + cv), Y(yb + cv + 0.02), X(I.B / 2 - cv), Y(yb + cv + 0.02), {w:1.1, c:'#111'}); for (let x = -I.B / 2 + cv + 0.1; x < I.B / 2 - cv; x += Math.max(0.25, I.B / 14)) b += `<circle cx="${X(x)}" cy="${Y(yb + cv + 0.02) - 2.5}" r="1.6" fill="#111"/>`;
  b += ln(X(-I.B / 2 + cv), Y(yt - cv), X(I.B / 2 - cv), Y(yt - cv), {w:0.8, c:'#111', d:'4 2'});
  const sstep = r.steps.find(x => x.sym === 's'); b += leader(X(I.B / 4), Y(yb + cv + 0.02), X(I.B / 2 + 0.6), Y(yb) + 26, `B1/B2: T${I.bar}@${sstep ? sstep.val : '—'} each way`);
  b += leader(X(-I.B / 2 + 0.3), Y(yb), X(-I.B / 2 - 0.4), Y(yb) + 24, '75 mm blinding', {left:true});
  b += dimH(X(-I.B / 2), X(I.B / 2), Y(yb) + 46, `B = ${I.B} m`, {ext:40}) + dimV(X(I.B / 2) + 14, Y(yt), Y(yb), `h = ${I.h} m`) + dimV(X(-I.B / 2) - 40, Y(0), Y(yb), `D = ${I.D} m`, {left:true}) + dimH(X(-I.c1 / 2), X(I.c1 / 2), Y(ped) + 12, `pedestal ${I.c1} m`);
  if (ped > 0.05) b += dimV(X(-I.c1 / 2) - 12, Y(ped), Y(0), `${f2(ped)} m`, {left:true});
  const hy = ped + I.hH; b += loadArrow(X(0), Y(ped + eqH) - 40, X(0), Y(ped + eqH) - 2, `G = ${fmt(I.G * I.dyn, 0)} kN`, {tx: X(0) + 6, ty: Y(ped + eqH) - 28});
  if (I.H > 0) b += loadArrow(X(-I.c1 / 2) - 60, Y(Math.min(hy, ped + eqH * 0.8)), X(-I.c1 / 2) + 2, Y(Math.min(hy, ped + eqH * 0.8)), `H = ${f1(I.H)} kN`, {tx: X(-I.c1 / 2) - 60, ty: Y(Math.min(hy, ped + eqH * 0.8)) - 5});
  // pressure diagram
  const Nst = r.steps.find(x => x.sym === 'N'), N = Nst ? Nst.val : 0, qav = N / (I.B * I.L), qmax = r.res.qmax, qmin = Math.max(0, 2 * qav - qmax), ps = 60 / Math.max(qmax, I.qa), py = Y(yb) + 70;
  b += tx(X(-I.B / 2), py - 6, 'Bearing pressure (SLS)', {fs:8.8, b:1});
  b += pg([[X(-I.B / 2), py], [X(I.B / 2), py], [X(I.B / 2), py + qmin * ps], [X(-I.B / 2), py + qmax * ps]], {f:'url(#pMod)', s:'#111', w:0.8});
  b += ln(X(-I.B / 2), py + I.qa * ps, X(I.B / 2), py + I.qa * ps, {c:'#111', d:'8 2 2 2', w:0.8}) + tx(X(I.B / 2) + 4, py + I.qa * ps + 3, `q_all ${f0(I.qa)} kPa`, {fs:8.5});
  b += tx(X(-I.B / 2) - 4, py + qmax * ps + 3, `${f0(qmax)}`, {fs:8.5, a:'end'}) + tx(X(I.B / 2) + 4, py + qmin * ps + 3, `${f0(qmin)} kPa`, {fs:8.5});
  // results box
  const ch = r.checks; const bx = 485, by = 48; b += rc(bx, by, 190, 18 + ch.length * 13, {f:'#fff', s:'#111', w:0.6}) + tx(bx + 8, by + 13, 'Design checks', {fs:9, b:1});
  ch.forEach((k, i) => b += tx(bx + 8, by + 27 + i * 13, `${k.pass ? '✓' : '✗'} ${k.label.replace(/ \(.*\)/, '').slice(0, 30)}`, {fs:8.3, c: k.pass ? FC.ink : FC.fail}));
  return fsvg(W, Math.max(H, py + Math.max(qmax, I.qa) * ps + 20), b + nts(W - 10, H - 6));
}

/* ======================= 8. PV PILE ======================= */
function figPile(){
  const r = R.PVP, G = R.GEO, L = R.LCB; if (!r || !G || !G.profile) return ''; const I = r.I, W = 680, H = 400, gl = 175, s = 200 / (I.L + 0.8), cx = 250;
  const X = x => cx + x * s, Y = y => gl + y * s;
  let b = title('PV pile — elevation, loads and design profile', `${I.sec}; embedment L = ${I.L} m in ${G.profileBH}; working loads from load combinations (SLS)`);
  const col = {CLAY:'url(#pClay)', SILT:'url(#pSilt)', SAND:'url(#pSand)', ROCK:'url(#pRock)'};
  G.profile.forEach(p => { if (p.from > I.L + 0.8) return; const y1 = Y(p.from), y2 = Y(Math.min(p.to, I.L + 0.8)); b += rc(X(-1.8), y1, 3.6 * s, y2 - y1, {f: col[p.type]}) + ln(X(-1.8), y1, X(1.8), y1, {c:'#111', w:0.5}) + tx(X(1.85), y1 + 12, `${p.type} N=${p.N}${p.cu ? `, Cu≈${f0(p.cu)} kPa` : p.phi ? `, φ′≈${f0(p.phi)}°` : ''}`, {fs:8.5}) + tx(X(-1.85), y1 + 12, `${f1(p.from)} m`, {fs:8, a:'end', c:FC.mute}); });
  b += groundLine(X(-2.2), X(2.2), Y(0)) + tx(X(-2.25), Y(0) + 3, 'GL', {fs:8.5, a:'end'});
  if (G.profileGWL < I.L + 0.8) b += wlMark(X(-1.2), Y(G.profileGWL), `GWL ${f1(G.profileGWL)} m`);
  const pw = Math.max(5, I.D * s); b += rc(X(0) - pw / 2, Y(-I.e), pw, (I.e + I.L) * s, {f:'#d0d0d0', s:'#111', w:0.9});
  const ty = Y(-I.e); b += `<g transform="rotate(${-(L ? L.I.th : 15)} ${X(0)} ${ty})">${rc(X(-1.2), ty - 6, 2.4 * s, 5, {f:'#fff', s:'#111', w:0.8})}</g>` + `<circle cx="${X(0)}" cy="${ty}" r="4" fill="#fff" stroke="#333"/>` + tx(X(-1.6), ty + 22, 'PV modules on torque tube', {fs:8.5, a:'end'});
  b += dimV(X(-0.55), Y(-I.e), Y(0), `e = ${I.e} m`, {left:true}) + dimV(X(0.45), Y(0), Y(I.L), `L = ${I.L} m`);
  if (G.res.hardDepth != null && G.res.hardDepth < I.L + 0.8) b += ln(X(-1.8), Y(G.res.hardDepth), X(1.8), Y(G.res.hardDepth), {c:'#111', d:'10 3 2 3', w:0.9}) + tx(X(-1.75), Y(G.res.hardDepth) - 3, `HARD LAYER N≥50 (${G.res.hardDepth} m)`, {fs:8.5});
  if (L){ const xL = X(-1.9); b += loadArrow(X(0) + 4, ty - 6, X(0) + 4, ty - 48, `T_w = ${f1(L.res.Tw)} kN (uplift)`, {tx: X(0) + 10, ty: ty - 40});
    b += loadArrow(X(0) - 4, ty - 52, X(0) - 4, ty - 10, `P_w = ${f1(L.res.Pw)} kN`, {tx: X(0) - 10, ty: ty - 46, a:'end'});
    b += loadArrow(xL - 30, ty + 10, X(0) - 4, ty + 10, `H_w = ${f1(L.res.Hw)} kN`, {tx: xL - 30, ty: ty + 4}); }
  const bx = 470, by = 250, rows = [['Compression', r.res.Qall, L ? L.res.Pw : 0], ['Uplift', r.res.Tall, L ? L.res.Tw : 0], ['Lateral', r.res.Hall, L ? L.res.Hw : 0]];
  b += rc(bx, by, 200, 74, {f:'#fff', s:'#111', w:0.6}) + tx(bx + 8, by + 14, 'Allowable vs working (kN)', {fs:9, b:1});
  rows.forEach(([t, a, d], i) => { const ok = a >= d; b += tx(bx + 8, by + 30 + i * 14, `${ok ? '✓' : '✗'} ${t}: ${f1(a)} ≥ ${f1(d)}  (${f2(d / a)})`, {fs:8.6, c: ok ? FC.ink : FC.fail}); });
  if (R.PVS) b += tx(bx + 8, by + 72, `Structural utilisation ${f2(R.PVS.res.util)}`, {fs:8.6, c: R.PVS.res.util <= 1 ? FC.ink : FC.fail});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 9. CABLE TRENCH ======================= */
function trenchSec(x0, top, sc, w, d, n, Dc, sp, bed, sur, ec, labelR, head, slab){
  const X = x => x0 + x * sc, Y = y => top + y * sc; let g = tx(X(w / 2), top - 24, head, {fs:10, b:1, a:'middle'});
  g += rc(X(-0.4), Y(0), (w + 0.8) * sc, (d + 0.25) * sc, {f:'url(#pSoil)'}) + rc(X(0), Y(0), w * sc, d * sc, {f:'url(#pFill)', s:'#777', w:0.8});
  const zs = d - bed - Dc / 1000 - sur; g += rc(X(0), Y(zs), w * sc, (d - zs) * sc, {f:'url(#pSand)'});
  for (let k = 0; k < n; k++){ const cxx = ec / 1000 + Dc / 2000 + k * (Dc + sp) / 1000; g += `<circle cx="${X(cxx)}" cy="${Y(d - bed - Dc / 2000)}" r="${Dc / 2000 * sc}" fill="#303030"/>`; }
  if (slab) g += rc(X(0.02), Y(zs - 0.05), (w - 0.04) * sc, 0.05 * sc, {f:'url(#pConc)', s:'#777', w:0.6});
  g += ln(X(0.05), Y(0.3), X(w - 0.05), Y(0.3), {c:'#111', w:0.8, d:'2 2'});
  g += groundLine(X(-0.4), X(0), Y(0)) + groundLine(X(w), X(w + 0.4), Y(0)) + ln(X(0), Y(0), X(w), Y(0), {w:1.4});
  g += dimH(X(0), X(w), Y(d) + 18, `${w} m`) + dimV(X(-0.4) - 6, Y(0), Y(d), `${d} m`, {left:true}) + dimV(X(w + 0.4) + 4, Y(0), Y(d - bed - Dc / 1000), `cover ${f2(d - bed - Dc / 1000)} m`);
  if (labelR){ const lx = X(w + 0.4) + 70; g += leader(X(w * 0.7), Y(0.15), lx, Y(0.12), 'Selected backfill') + leader(X(w * 0.8), Y(0.3), lx, Y(0.3) + 8, 'Warning tape (300 mm)') + (slab ? leader(X(w * 0.6), Y(zs - 0.025), lx, Y(zs) + 2, 'Protection slab') : '') + leader(X(w * 0.85), Y(zs + 0.08), lx, Y(zs) + 18, `Sand ${bed * 1000}/${sur * 1000} mm`) + leader(X(ec / 1000 + Dc / 2000), Y(d - bed - Dc / 2000), lx, Y(d) - 4, `${n} × Ø${Dc} mm cables`); }
  return g;
}
function figTrench(){
  const r = R.CTR; if (!r) return ''; const I = r.I, W = 680, H = 280, sc = 150 / Math.max(I.dm, I.dl);
  let b = title('Cable trench typical sections', 'Cover, bedding and protection per cable schedule — TNB / client requirements to be verified');
  b += trenchSec(40, 76, sc, I.wm, I.dm, I.nm, I.Dm, I.sm, I.bed, I.sur, I.ec, false, `MV (33 kV) — ${fmt(I.Lm, 0)} m`, true);
  b += trenchSec(330, 76, sc, I.wl, I.dl, I.nl, I.Dl, I.sl, I.bed, I.sur, I.ec, true, `LV / DC — ${fmt(I.Ll, 0)} m`, false);
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 10. BESS PLATFORM PLAN ======================= */
function figBESS(){
  const r = R.BPL; if (!r) return ''; const I = r.I, W = 680, top = 56, s = Math.min(420 / r.res.W, 350 / r.res.L), x0 = 90, Hp = r.res.L * s;
  const X = x => x0 + x * s, Y = y => top + y * s; const cols = Math.ceil(Math.sqrt(I.n / 2)) * 2, rows = Math.ceil(I.n / cols);
  let b = title(`BESS compound — plan (${I.n} enclosures, ${f0(r.res.W)} × ${f0(r.res.L)} m)`, `Platform RL ${f2(r.res.rl)} m · crossfall ${I.cf}% · spacing subject to BOMBA / vendor / insurer`);
  b += rc(X(-3), Y(-3), (r.res.W + 6) * s, (r.res.L + 6) * s, {s:FC.ink, w:1.3, d:'10 3 2 3'});
  b += rc(X(0), Y(0), r.res.W * s, r.res.L * s, {f:'url(#pGrav)', s:'#888'});
  b += rc(X(I.pw / 2), Y(I.pw / 2), (r.res.W - I.pw) * s, (r.res.L - I.pw) * s, {s:FC.road, w:I.pw * s});
  let k = 0;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols && k < I.n; j++, k++) b += rc(X(I.pw + j * (I.Wc + I.sx) + I.sx / 2), Y(I.pw + i * (I.Lc + I.sy) + 2), I.Wc * s, I.Lc * s, {f:'#e9e9e9', s:'#111', w:0.6});
  const pcsY = I.pw + rows * (I.Lc + I.sy) + 1; const np = I.npcs || 1; for (let j = 0; j < np; j++){ const xx = I.pw + 2 + j * ((r.res.W - 2 * I.pw - 6) / np); b += rc(X(xx), Y(pcsY), Math.min(4, (r.res.W - 2 * I.pw) / np - 1) * s, 2.5 * s, {f:'#fff', s:'#111', w:0.6}); }
  b += tx(X(r.res.W / 2), Y(pcsY) + 2.5 * s + 11, `${np} PCS / MV skids`, {fs:8.5, a:'middle'});
  b += dimH(X(I.pw + I.sx / 2), X(I.pw + I.sx / 2 + I.Wc + I.sx), Y(I.pw) - 6, `${f1(I.Wc + I.sx)} m`) + dimV(X(r.res.W) + 10, Y(I.pw + 2), Y(I.pw + 2 + I.Lc + I.sy), `${f1(I.Lc + I.sy)} m`);
  b += rc(X(r.res.W - 12), Y(r.res.L - 6.5), 9 * s, 4 * s, {f:'url(#pWater)', s:FC.wline}) + tx(X(r.res.W - 12) - 4, Y(r.res.L - 4.5), 'Containment sump / OWS', {fs:8.5, a:'end', halo:1});
  b += rc(X(r.res.W / 2 - 4), Y(r.res.L + 3) - 2, 8 * s, 4, {f:'#fff', s:FC.ink}) + tx(X(r.res.W / 2), Y(r.res.L + 3) + 14, 'Gate / fire appliance access', {fs:8.5, a:'middle', halo:1});
  b += dimH(X(0), X(r.res.W), Y(r.res.L) + 40, `${f1(r.res.W)} m`, {ext:34}) + dimV(X(0) - 22, Y(0), Y(r.res.L), `${f1(r.res.L)} m`, {left:true});
  b += northArrow2(X(r.res.W) + 60, top + 6) + scaleBar(X(r.res.W) + 30, top + Hp - 10, 1 / s);
  const y = top + Hp + 56; b += legendRow(40, y, [[swBox('#e9e9e9', '#111'), 'BESS enclosure'], [swBox('#fff', '#111'), 'PCS / MV skid'], [swLine(FC.road, 4), `Perimeter road ${I.pw} m`], [swLine(FC.ink, 1.3, '10 3 2 3'), 'Compound fence']], 150);
  return fsvg(W, y + 20, b);
}

/* ======================= 11. RETAINING WALL ======================= */
function figRetain(){
  const r = R.RTW; if (!r) return ''; const I = r.I, W = 680, H = 340, s = 190 / I.H, x0 = 130, yb = 290; const X = x => x0 + x * s, Y = y => yb - y * s;
  let b = title('RC cantilever retaining wall — section and earth pressure', `Retained height ${I.H} m · φ′ ${I.phi}° · surcharge ${I.q} kPa · water ${I.hw} m · K_a = ${f3(Ka(I.phi))}`);
  const heel = I.B - I.tt - I.ts, Hs = I.H - I.tb;
  b += rc(X(I.tt + I.ts), Y(I.H), (heel + 1.6) * s, Hs * s, {f:'url(#pFill)'});
  b += rc(X(-0.8), Y(0.6), (I.tt + 0.8) * s, 0.6 * s - I.tb * s + I.tb * s, {f:'url(#pSoil)'});
  b += rc(X(0), Y(I.tb), I.B * s, I.tb * s, {f:'url(#pConc)', s:FC.ink, w:1.2}) + rc(X(I.tt), Y(I.H), I.ts * s, Hs * s, {f:'url(#pConc)', s:FC.ink, w:1.2});
  b += groundLine(X(I.tt + I.ts), X(I.B + 1.6), Y(I.H)) + groundLine(X(-0.8), X(I.tt), Y(0.6));
  for (let x = I.tt + I.ts + 0.3; x < I.B + 1.5; x += (I.B + 1.2) / 6) b += loadArrow(X(x), Y(I.H) - 22, X(x), Y(I.H) - 2, '');
  b += tx(X(I.B + 0.2), Y(I.H) - 26, `q = ${I.q} kPa`, {fs:9, c:FC.red, b:1});
  if (I.hw > 0) b += ln(X(I.tt + I.ts), Y(I.hw), X(I.B + 1.6), Y(I.hw), {c:FC.wline, d:'5 3'}) + wlMark(X(I.B + 1.2), Y(I.hw), 'water');
  const pa = Ka(I.phi) * I.g * I.H + Ka(I.phi) * I.q, ps = 90 / pa, px = X(I.B + 2.2);
  b += pg([[px, Y(I.H)], [px + Ka(I.phi) * I.q * ps, Y(I.H)], [px + pa * ps, Y(0)], [px, Y(0)]], {f:'url(#pMod)', s:'#111', w:0.8}) + ln(px, Y(I.H), px, Y(0), {w:1});
  b += tx(px + 4, Y(I.H) - 4, `${f1(Ka(I.phi) * I.q)} kPa`, {fs:8.5}) + tx(px + pa * ps + 4, Y(0) - 2, `${f1(pa)} kPa`, {fs:8.5}) + tx(px, Y(I.H) - 18, 'Active pressure', {fs:8.8, b:1});
  b += loadArrow(px + pa * ps * 0.8, Y(I.H / 3), X(I.B) + 30, Y(I.H / 3), 'P_a', {tx: px + pa * ps * 0.8 + 4, ty: Y(I.H / 3) - 4});
  b += dimH(X(0), X(I.B), Y(0) + 22, `B = ${I.B} m`, {ext:18}) + dimH(X(0), X(I.tt), Y(0) + 38, `toe ${I.tt}`) + dimH(X(I.tt), X(I.tt + I.ts), Y(I.H) - 10, `${I.ts * 1000}`);
  b += dimV(X(-0.8) - 14, Y(I.H), Y(0), `H = ${I.H} m`, {left:true}) + dimV(X(I.tt) - 8, Y(I.tb), Y(0), `${I.tb}`, {left:true});
  b += rc(470, 44, 200, 60, {f:'#fff', s:'#111', w:0.6}) + tx(478, 60, 'Stability', {fs:9, b:1}) + tx(478, 75, `Sliding FS ${f2(r.res.FSs)} (≥ 1.5)`, {fs:8.6, c: r.res.FSs >= 1.5 ? FC.ink : FC.fail}) + tx(478, 88, `Overturning FS ${f2(r.res.FSo)} (≥ 2.0)`, {fs:8.6, c: r.res.FSo >= 2 ? FC.ink : FC.fail}) + tx(478, 101, `q_max ${f0(r.res.qmax)} ≤ ${f0(I.qa)} kPa`, {fs:8.6, c: r.res.qmax <= I.qa ? FC.ink : FC.fail});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 12. SOIL PROFILES ======================= */
function figSoil(){
  const bhs = P.tables.bh || []; if (!bhs.length) return ''; const W = 680, H = 400, top = 80, dmax = Math.max(...bhs.map(b => b.depth)), sc = (H - top - 50) / dmax, cw = Math.min(64, (W - 160) / bhs.length - 18);
  const col = {CLAY:'url(#pClay)', SILT:'url(#pSilt)', SAND:'url(#pSand)', ROCK:'url(#pRock)'}, hard = R.GEO ? R.GEO.I.Nhard : 50, dbh = R.GEO ? R.GEO.profileBH : '', L = R.PVP ? R.PVP.I.L : null;
  let b = title('Borehole logs — soil profiles (depth below ground)', 'SPT N per layer; ▼ groundwater; chain line = hard stratum (N ≥ ' + hard + '); dashed line = PV pile toe');
  for (let d = 0; d <= dmax; d += 2) b += ln(54, top + d * sc, W - 20, top + d * sc, {c:'#eee', w:0.6}) + tx(48, top + d * sc + 3, `${d} m`, {fs:8, a:'end', c:FC.mute});
  bhs.forEach((bh, i) => { const x = 70 + i * (cw + 22), isD = bh.id === dbh;
    b += tx(x + cw / 2, top - 22, bh.id, {a:'middle', b:1, fs:10}) + tx(x + cw / 2, top - 10, `RL ${f1(bh.rl)}`, {a:'middle', fs:8, c:FC.mute});
    bh.layers.forEach(Lr => { const y = top + Lr[0] * sc, h = (Lr[1] - Lr[0]) * sc; b += rc(x, y, cw, h, {f: col[Lr[3]] || '#fff', s:'#111', w:0.6}); if (h > 12) b += tx(x + cw / 2, y + h / 2 + 3, `N=${Lr[4]}`, {a:'middle', fs:8.5, b: Lr[4] >= hard, halo:1}); });
    const hd = bh.layers.find(Lr => Lr[4] >= hard); if (hd) b += ln(x - 4, top + hd[0] * sc, x + cw + 4, top + hd[0] * sc, {c:'#111', w:1.2, d:'10 3 2 3'});
    b += `<path d="M${x + cw + 2} ${top + bh.gwl * sc - 6} l5 6 l5 -6z" fill="${FC.wline}"/>` + tx(x + cw + 3, top + bh.gwl * sc + 9, f1(bh.gwl), {fs:7.5, c:FC.wline});
    if (isD) b += rc(x - 3, top - 2, cw + 6, bh.depth * sc + 4, {s:'#111', w:1.4, d:'6 2'}) + tx(x + cw / 2, top + bh.depth * sc + 14, 'DESIGN BH', {fs:8, a:'middle', b:1});
    b += tx(x + cw / 2, top + bh.depth * sc + (isD ? 26 : 14), `EOB ${bh.depth} m`, {fs:7.5, a:'middle', c:FC.mute}); });
  if (L) b += ln(60, top + L * sc, W - 20, top + L * sc, {c:FC.wline, d:'8 3', w:1}) + tx(W - 22, top + L * sc - 3, `PV pile toe ${L} m`, {fs:8.5, a:'end', c:FC.wline, halo:1});
  b += legendRow(70, H - 16, Object.entries(col).map(([k, c]) => [swBox(c, '#111'), k]).concat([[swLine('#111', 1.2, '10 3 2 3'), 'Hard stratum'], ]), 110);
  return fsvg(W, H, b);
}

/* ======================= 13. DETENTION POND SECTION ======================= */
function figPond(){
  const r = R.DET; if (!r) return ''; const I = r.I, W = 720, H = 270, Wb = r.res.W, Ht = I.H + I.Hs + I.fb, top = Wb + 2 * I.z * Ht;
  const sx = 400 / (top + 20), sy = 130 / Ht, cx = 250, yb = 200; const X = x => cx + x * sx, Y = y => yb - y * sy;
  let b = title('Detention pond — typical section', `Live storage ${fmt(r.res.Vreq, 0)} m³ · bottom ${f0(Wb)} × ${f0(Wb * I.r)} m · side slopes 1:${I.z} · vertical scale exaggerated`);
  const pts = [[-top / 2 - 10, Ht], [-top / 2, Ht], [-Wb / 2, 0], [Wb / 2, 0], [top / 2, Ht], [top / 2 + 10, Ht], [top / 2 + 10, -0.8], [-top / 2 - 10, -0.8]];
  b += pg(pts.map(([x, y]) => [X(x), Y(y)]), {f:'url(#pSoil)'}) + pl([[-top / 2 - 10, Ht], [-top / 2, Ht], [-Wb / 2, 0], [Wb / 2, 0], [top / 2, Ht], [top / 2 + 10, Ht]].map(([x, y]) => [X(x), Y(y)]), {c:'#111', w:1.1});
  const wl = I.H, ww = Wb + 2 * I.z * wl; b += pg([[X(-ww / 2), Y(wl)], [X(-Wb / 2), Y(0)], [X(Wb / 2), Y(0)], [X(ww / 2), Y(wl)]], {f:'#cfe3f1', op:0.9});
  const lev = [[0, 'Pond invert ±0.00'], [I.H, `Design storage level +${f2(I.H)} (${I.T}-yr)`], [I.H + I.Hs, `Major flood level +${f2(I.H + I.Hs)} (spillway head ${I.Hs} m)`], [Ht, `Top of bank +${f2(Ht)} (freeboard ${I.fb} m)`]];
  lev.forEach(([y, t], k) => { b += ln(X(top / 2 + 10), Y(y), X(top / 2 + 10) + 12, Y(y), {w:0.6}) + tx(X(top / 2 + 10) + 14, Y(y) + 3, t, {fs:8.5}); if (k === 1 || k === 2) b += ln(X(-(Wb + 2 * I.z * y) / 2), Y(y), X((Wb + 2 * I.z * y) / 2), Y(y), {c:FC.wline, d:'4 3', w:0.8}); });
  b += wlMark(X(-ww / 4), Y(wl));
  b += rc(X(-Wb / 2) - 30, Y(0) - 6, 34, 6, {f:'#fff', s:'#111', w:0.8}) + tx(X(-Wb / 2) + 10, Y(0) - 10, `Outlet: orifice Ø${f0(r.res.Do * 1000)} mm → outfall`, {fs:8.5, halo:1});
  b += dimH(X(-Wb / 2), X(Wb / 2), Y(0) + 20, `Bottom width ${f0(Wb)} m`) + dimV(X(-top / 2) - 8, Y(Ht), Y(0), `${f2(Ht)} m`, {left:true});
  b += tx(cx, H - 22, `Spillway crest length ${f1(r.res.Ls)} m at design storage level; outflow ${f2(r.res.Qo)} m³/s ≤ pre-development ${f2(I.Qpre)} m³/s`, {fs:8.8, a:'middle', c:FC.mute});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ======================= 14. CULVERT LONG SECTION ======================= */
function figCulvert(){
  const r = R.CUL; if (!r) return ''; const I = r.I, W = 680, H = 280, sx = 380 / (I.L + 16), sy = 55, x0 = 170, yb = 215; const X = x => x0 + x * sx, Y = y => yb - y * sy;
  const drop = I.S0 * I.L, rd = Math.max(I.HWa + 0.6, I.D + 1.2);
  let b = title('Road crossing culvert — longitudinal section', `${I.nb} × ${I.type === 'Box' ? `${I.Bw}×${I.D} m box` : `Ø${I.D} m pipe`} · L = ${I.L} m · S₀ = ${I.S0} · ${I.nx} similar crossings`);
  b += pg([[X(-8), Y(0.2)], [X(0), Y(rd)], [X(I.L), Y(rd - drop)], [X(I.L + 8), Y(0.2 - drop)], [X(I.L + 8), Y(-0.8 - drop)], [X(-8), Y(-0.8)]].map(p => p), {f:'url(#pFill)'});
  b += rc(X(0), Y(rd) - 4, I.L * sx, 6, {f:'url(#pBase)', s:'#111', w:0.6}) + tx(X(I.L / 2), Y(rd) - 8, 'Road', {fs:8.5, a:'middle'});
  b += pg([[X(0), Y(I.D)], [X(I.L), Y(I.D - drop)], [X(I.L), Y(-drop)], [X(0), Y(0)]], {f:'#fff', s:FC.ink, w:1.2});
  b += rc(X(0) - 6, Y(rd), 6, (rd + 0.3) * sy, {f:'url(#pConc)', s:'#777'}) + rc(X(I.L), Y(rd - drop), 6, (rd + 0.3) * sy, {f:'url(#pConc)', s:'#777'});
  b += ln(X(-8), Y(r.res.HW), X(0), Y(r.res.HW), {c:FC.wline, w:1.4}) + wlMark(X(-5), Y(r.res.HW), `HW ${f2(r.res.HW)} m`);
  b += ln(X(-8), Y(I.HWa), X(0), Y(I.HWa), {c:'#111', d:'8 2 2 2', w:0.7}) + tx(X(-8), Y(I.HWa) - 4, `HW allow ${I.HWa} m`, {fs:8.5, a:'end'});
  b += ln(X(I.L), Y(I.TW - drop), X(I.L + 8), Y(I.TW - drop), {c:FC.wline, w:1.4}) + wlMark(X(I.L + 6), Y(I.TW - drop), `TW ${I.TW} m`);
  b += rc(X(I.L + 0.5), Y(-drop) - 2, (R.SCR ? Math.min(R.SCR.res.La, 7.5) : 4) * sx, 5, {f:'url(#pGrav)', s:'#111', w:0.5}) + tx(X(I.L + 1), Y(-drop) + 14, `Riprap apron ${R.SCR ? f1(R.SCR.res.La) : '—'} m, d₅₀ ${R.SCR ? f0(Math.max(R.SCR.res.d50, 0.15) * 1000) : '—'} mm`, {fs:8.5});
  b += dimH(X(0), X(I.L), Y(-drop) + 34, `L = ${I.L} m`, {ext:28}) + dimV(X(0) + 10, Y(I.D), Y(0), `D = ${I.D} m`);
  b += tx(X(I.L / 2) + 30, Y(I.D / 2) + 3, `Q = ${f2(I.Q)} m³/s · V = ${f2(r.res.V)} m/s →`, {fs:8.5, a:'middle'});
  b += tx(W / 2, H - 10, `${r.res.HW / I.D <= 1.2 ? '✓' : '✗'} HW/D = ${f2(r.res.HW / I.D)} (≤ 1.2) · ${r.res.HW <= I.HWa ? '✓' : '✗'} HW ≤ allowable`, {fs:9, a:'middle', c: r.status === 'fail' ? FC.fail : FC.ink, b:1});
  return fsvg(W, H, b);
}

/* ======================= 15. SLOPE SECTION ======================= */
function figSlopeSec(){
  const r = R.SLP; if (!r) return ''; const I = r.I, W = 680, H = 290, s = 140 / I.H, x0 = 90, yb = 240; const X = x => x0 + x * s, Y = y => yb - y * s;
  const run = I.H / Math.tan(rad(I.b)), th = r.res.thc || (I.b + I.phi) / 2, crestX = run, planeX = I.H / Math.tan(rad(th));
  let b = title('Slope stability screening — section', `H = ${I.H} m at ${I.b}° (1V:${f1(1 / Math.tan(rad(I.b)))}H) · c′ ${I.c} kPa, φ′ ${I.phi}°, γ ${I.g} kN/m³, r_u ${I.ru}`);
  b += pg([[X(-3), Y(0)], [X(0), Y(0)], [X(run), Y(I.H)], [X(run + 6), Y(I.H)], [X(run + 6), Y(-1)], [X(-3), Y(-1)]], {f:'url(#pSoil)'});
  b += pg([[X(0), Y(0)], [X(run), Y(I.H)], [X(planeX), Y(I.H)]], {f:'url(#pMod)'}) + ln(X(0), Y(0), X(planeX), Y(I.H), {c:'#111', w:1.1, d:'10 3 2 3'}) + tx(X(planeX * 0.55) + 8, Y(I.H * 0.55) + 8, `CRITICAL PLANE θ = ${f0(th)}°`, {fs:8.5, b:1, halo:1});
  b += pl([[X(-3), Y(0)], [X(0), Y(0)], [X(run), Y(I.H)], [X(run + 6), Y(I.H)]], {c:'#111', w:1.2});
  for (let x = run + 0.5; x < run + 5.8; x += 1.1) b += loadArrow(X(x), Y(I.H) - 20, X(x), Y(I.H) - 2, '');
  b += tx(X(run + 3), Y(I.H) - 24, `q = ${I.q} kPa`, {fs:9, c:FC.red, b:1, a:'middle'});
  b += dimV(X(-1.5), Y(I.H), Y(0), `H = ${I.H} m`, {left:true}) + ln(X(-3), Y(I.H), X(run), Y(I.H), {w:0.5, d:'2 2'});
  b += `<path d="M${X(1.6)} ${Y(0)} A ${1.6 * s} ${1.6 * s} 0 0 0 ${X(1.6 * Math.cos(rad(I.b)))} ${Y(1.6 * Math.sin(rad(I.b)))}" fill="none" stroke="${FC.ink}" stroke-width="0.7"/>` + tx(X(1.9), Y(0.35), `β = ${I.b}°`, {fs:8.5});
  b += rc(480, 150, 190, 62, {f:'#fff', s:'#111', w:0.6}) + tx(488, 166, 'Factor of safety', {fs:9, b:1}) + tx(488, 181, `Planar wedge FS = ${f2(r.res.fsP)}`, {fs:8.6}) + tx(488, 194, `Infinite slope (z = ${I.z} m) FS = ${f2(r.res.fsI)}`, {fs:8.6}) + tx(488, 207, `Governing ${f2(r.res.fs)} ${r.res.fs >= I.FSreq ? '≥' : '<'} ${I.FSreq} required`, {fs:8.6, b:1, c: r.res.fs >= I.FSreq ? FC.ink : FC.fail});
  return fsvg(W, H, b + nts(W - 10, H - 6));
}

/* ---------- figure map (module → figures in report & module pages) ---------- */
Object.assign(FIGS, {
  m8:[['Existing ground — contour plan & platforms', figDEM], ['Slope distribution', figSlopeBands]], m12:[['Grading zones', figGrading]], m10:[['Borehole logs', figSoil]],
  m13:[['Site layout plan', figLayout]], m14:[['Slope stability section', figSlopeSec]],
  m15:[['IDF curves', figIDF], ['Catchment & drainage network', figCatch], ['ARI vs discharge', figARI]], m16:[['Drain sections — proposed vs adopted', figDrain]],
  m17:[['Culvert longitudinal section', figCulvert]], m18:[['Detention pond section', figPond], ['Stage–storage', figStageStorage]],
  m21:[['Road cross-section', figRoad], ['CBR vs thickness', figCBR]], m26:[['PV pile elevation & loads', figPile]],
  m29:[['Inverter / MV skid foundation', () => figFdn('FDN_INV')]], m30:[['Transformer foundation', () => figFdn('FDN_TX')]], m31:[['BESS enclosure foundation', () => figFdn('BFDN')]],
  m34:[['Cable trench sections', figTrench]], m36:[['Retaining wall section', figRetain]], m43:[['BESS compound plan', figBESS]],
});
