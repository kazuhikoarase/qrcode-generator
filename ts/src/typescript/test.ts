'use strict'

window.onload = function() {

  function createCanvas(qr : qrcode.QRCode, cellSize = 2, margin = 8) {
    var canvas = document.createElement('canvas');
    canvas.width = qr.getModuleCount() * cellSize + margin * 2;
    canvas.height = qr.getModuleCount() * cellSize + margin * 2;
    var ctx = canvas.getContext('2d');
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
  //qrcode.QRCode.stringToBytes = qrcode.stringToBytes_UTF8;

  var qr = new qrcode.QRCode();
  qr.setTypeNumber(5);
  qr.setErrorCorrectLevel(qrcode.ErrorCorrectLevel.L);
  qr.addData(new qrcode.QRAlphaNum('0123ABC') );
  qr.addData(new qrcode.QRNumber('4567') );
  qr.addData(new qrcode.QR8BitByte('[8BitByte :-)]') );
  qr.addData(new qrcode.QRKanji('漢字') );
  qr.make();

  // img
  var img = document.createElement('img');
  img.setAttribute('src', qr.toDataUrl() );
  document.body.appendChild(img);

  // canvas
  document.body.appendChild(createCanvas(qr, 2) );
};
