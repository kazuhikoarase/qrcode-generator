/// <reference path="com/d_project/qrcode/QRCode" />
/// <reference path="com/d_project/qrcode/ErrorCorrectLevel" />
/// <reference path="com/d_project/qrcode/QRNumber" />
/// <reference path="com/d_project/qrcode/QRAlphaNum" />
/// <reference path="com/d_project/qrcode/QR8BitByte" />
/// <reference path="com/d_project/qrcode/QRKanji" />

'use strict'
namespace test {

  import QRCode = com.d_project.qrcode.QRCode;
  import ErrorCorrectLevel = com.d_project.qrcode.ErrorCorrectLevel;
  import QRNumber = com.d_project.qrcode.QRNumber;
  import QRAlphaNum = com.d_project.qrcode.QRAlphaNum;
  import QR8BitByte = com.d_project.qrcode.QR8BitByte;
  import QRKanji = com.d_project.qrcode.QRKanji;

  export function run() : void {

    // uncomment if UTF-8 support is required.
    //QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8;

    var qr = new QRCode();
    qr.setTypeNumber(5);
    qr.setErrorCorrectLevel(ErrorCorrectLevel.L);
    qr.addData(new QRNumber('0123') ); // Number only
    qr.addData(new QRAlphaNum('AB5678CD') ); // Alphabet and Number
    qr.addData(new QR8BitByte('[8BitByte :)]') ); // most useful for usual purpose.
    qr.addData('[here is 8BitByte too]');
    qr.addData(new QRKanji('漢字') ); // Kanji(SJIS) only
    qr.make();
  
    // img
    var img = document.createElement('img');
    img.setAttribute('src', qr.toDataURL() );
    document.body.appendChild(img);
  
    // canvas
    document.body.appendChild(createCanvas(qr, 2) );
  }

  function createCanvas(qr : QRCode, cellSize = 2, margin = cellSize * 4) {

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
}

window.onload = function() {
  test.run();
};
