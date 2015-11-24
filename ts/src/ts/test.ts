'use strict'

window.onload = function() {

  function createCanvas(qr : qrcode.QRCode, cellSize = 2, margin = 8) {

    var canvas = document.createElement('canvas');
    var size = qr.getModuleCount() * cellSize + margin * 2;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // draw cells
    ctx.fillStyle = '#000000';
    for (var row = 0; row < qr.getModuleCount(); row += 1) {
      for (var col = 0; col < qr.getModuleCount(); col += 1) {
        if (qr.isDark(row, col) ) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize, cellSize);
        }
      }
    }
    return canvas;
  }

  // uncomment if UTF-8 support is required.
  //qrcode.QRCode.stringToBytes = qrcode.text.stringToBytes_UTF8;

  var qr = new qrcode.QRCode();
  qr.setTypeNumber(5);
  qr.setErrorCorrectLevel(qrcode.ErrorCorrectLevel.L);
  qr.addData(new qrcode.QRNumber('4567') ); // Number only
  qr.addData(new qrcode.QRAlphaNum('0123ABC') ); // Alphabet and Number
  qr.addData(new qrcode.QR8BitByte('[8BitByte :-)]') ); // most useful for all users.
  qr.addData(new qrcode.QRKanji('漢字') ); // Kanji only
  qr.make();

  // img
  var img = document.createElement('img');
  img.setAttribute('src', qr.toDataURL() );
  document.body.appendChild(img);

  // canvas
  document.body.appendChild(createCanvas(qr, 2) );
};
