//---------------------------------------------------------------------
//
// Extended SVG support for JavaScript QR Code Generator (optional)
//
// Copyright (c) 2025 Yuriy Apostol
// https://github.com/yuriyapostol
//
// Based on createSvgTag method from original QR Code Generator for JavaScript
//   Copyright (c) 2009 Kazuhiko Arase
//   http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// 'QR Code' is a registered trademark of DENSO WAVE INCORPORATED.
//
//---------------------------------------------------------------------

(function (qrcode) {
  
  // Render to SVG code
  qrcode.toString.formats['svg'] = function (cellSize, margin, cellColor, backgroundColor) {
    
    // Handle options object as first parameter
    let opts = {};
    if (typeof cellSize === 'object') {
      opts = cellSize || {};
      cellSize = void 0;
    }

    let id = opts.id || 'qrcode';
    let _class = opts.class || 'qrcode';
    let style = opts.style || '';
    
    let cell = opts.cell || {};
    if (typeof cell === 'string') cell = { fill: cell };
    if (typeof cell !== 'object' || ! cell) cell = {};
    let scalable = typeof opts.scalable !== 'undefined' ? opts.scalable : ! (typeof cellSize === 'number' || typeof opts.cellSize === 'number' || typeof cell.size === 'number');
    if (typeof cellSize === 'number') cell.size = cellSize;
    if (typeof cell.size !== 'number') cell.size = (typeof opts.cellSize === 'number') ? opts.cellSize : 1;
    if (typeof cellColor === 'string') cell.fill = cellColor;
    if (typeof cell.fill !== 'string') cell.fill = (typeof opts.cellColor === 'string') ? opts.cellColor : 'black';
    if (typeof cell.stroke !== 'string') cell.stroke = 'none';
    if (typeof cell.style !== 'string') cell.style = '';
    if (typeof cell.class !== 'string') cell.class = `${_class}-cells`;
    if (typeof cell.id !== 'string') cell.id = `${id}-cells`;

    if (typeof margin === 'undefined') margin = opts.margin;
    if (typeof margin !== 'number') margin = (typeof margin === 'undefined')? cell.size * 4 : 0;

    let background = opts.background || {};
    if (typeof background === 'string') background = { fill: background };
    if (typeof background !== 'object' || ! background) background = {};
    if (typeof backgroundColor === 'string') background.fill = backgroundColor;
    if (typeof background.fill !== 'string') background.fill = (typeof opts.backgroundColor === 'string') ? opts.backgroundColor : 'white';
    if (typeof background.stroke !== 'string') background.stroke = 'none';
    if (typeof background.style !== 'string') background.style = '';
    if (typeof background.class !== 'string') background.class = `${_class}-background`;
    if (typeof background.id !== 'string') background.id = `${id}-background`;
    
    let alt = (typeof opts.alt === 'string') ? { text: opts.alt } : opts.alt || {};
    alt.id = (alt.text) ? alt.id || `${id}-description` : null;

    let title = (typeof opts.title === 'string') ? { text: opts.title } : opts.title || {};
    title.id = (title.text) ? title.id || `${id}-title` : null;

    const escapeXml = s => s.replace(/[<>&"]/g, c =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])
    );
    
    const count = this.getModuleCount(),
      size = count * cell.size + margin * 2;
    let svg = '',
      rect = `l${cell.size},0 0,${cell.size} -${cell.size},0 0,-${cell.size}z `;
    
    svg += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`;
    svg += ! scalable ? ` width="${size}px" height="${size}px"` : '';
    svg += ` viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMinYMin meet" id="${escapeXml(id)}" class="${escapeXml(_class)}" style="${escapeXml(style)}"`;
    svg += (title.text || alt.text)
      ? ` role="img" aria-labelledby="${escapeXml([title.id, alt.id].join(' ').trim())}"`
      : '';
    svg += '>';
    if (title.text)
      svg += `<title id="${escapeXml(title.id)}">${escapeXml(title.text)}</title>`;
    if (alt.text)
      svg += `<description id="${escapeXml(alt.id)}">${escapeXml(alt.text)}</description>`;
    svg += `<rect id="${escapeXml(background.id)}"${background.class ? ` class="${escapeXml(background.class)}"` : ''}${background.style ? ` style="${escapeXml(background.style)}"` : ''} width="100%" height="100%"${background.fill ? ` fill="${background.fill}"` : ''}${background.stroke ? ` stroke="${background.stroke}"` : ''}/>`;
    svg += `<path id="${escapeXml(cell.id)}"${cell.class ? ` class="${escapeXml(cell.class)}"` : ''}${cell.style ? ` style="${escapeXml(cell.style)}"` : ''} d="`;

    for (let r = 0; r < count; r++) {
      let mr = r * cell.size + margin;
      for (let c = 0; c < count; c++) {
        if (this.isDark(r, c)) {
          let mc = c * cell.size + margin;
          svg += `M${mc},${mr}${rect}`;
        }
      }
    }

    svg += `"${cell.fill ? ` fill="${cell.fill}"` : ''}${cell.stroke ? ` stroke="${cell.stroke}"` : ''}/></svg>`;
    return svg;
  };

})(qrcode);
