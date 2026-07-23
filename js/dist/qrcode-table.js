//---------------------------------------------------------------------
//
// Extended HTML Table Render for JavaScript QR Code Generator (optional)
//
// Copyright (c) 2025 Yuriy Apostol
// https://github.com/yuriyapostol
//
// Based on createTableTag method from original QR Code Generator for JavaScript
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
  
  // Render to table HTML code
  qrcode.toString.formats['table'] = function (cellSize, margin, cellColor, backgroundColor) {
    
    // Handle options object as first parameter
    let opts = {};
    if (typeof cellSize === 'object') {
      opts = cellSize || {};
      cellSize = void 0;
    }

    let cell = opts.cell || {};
    if (typeof cell === 'string') cell = { color: cell };
    if (typeof cell !== 'object' || ! cell) cell = {};
    if (typeof cellSize === 'number') cell.size = cellSize;
    if (typeof cell.size !== 'number') cell.size = (typeof opts.cellSize === 'number') ? opts.cellSize : 1;
    if (typeof cellColor === 'string') cell.color = cellColor;
    if (typeof cell.color !== 'string') cell.color = (typeof opts.cellColor === 'string') ? opts.cellColor : 'black';

    if (typeof margin === 'undefined') margin = opts.margin;
    if (typeof margin !== 'number') margin = (typeof margin === 'undefined')? cell.size * 4 : 0;

    let background = opts.background || {};
    if (typeof background === 'string') background = { color: background };
    if (typeof background !== 'object' || ! background) background = {};
    if (typeof backgroundColor === 'string') background.color = backgroundColor;
    if (typeof background.color !== 'string') background.color = (typeof opts.backgroundColor === 'string') ? opts.backgroundColor : 'white';
    
    const count = this.getModuleCount();

    let table = `<table style="border: ${margin}px solid ${background.color}; border-collapse: collapse; padding: 0px; margin: 0px; background-color: ${background.color};"><tbody>`;

    for (let r = 0; r < count; r += 1) {
      table += `<tr>`;

      for (let c = 0; c < count; c += 1) {
        table += `<td style="border: none; border-collapse: collapse; padding: 0px; margin: 0px; ` +
          `width: ${cell.size}px; height: ${cell.size}px; background-color: ${this.isDark(r, c)? cell.color : 'transparent'};"/>`;
      }

      table += '</tr>';
    }

    table += `</tbody></table>`;

    return table;
  };

})(qrcode);
