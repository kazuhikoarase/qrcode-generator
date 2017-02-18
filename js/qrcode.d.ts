//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript - TypeScript Declaration File
//
// Copyright (c) 2016 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

interface QRCodeFactory {
  (typeNumber: number, errorCorrectionLevel: string) : QRCode;
  stringToBytes(s: string) : number[];
  createStringToBytes(unicodeData: string, numChars: number) :
    (s : string) => number[];
}

interface QRCode {
  addData(data: string, mode?: string) : void;
  make() : void;
  getModuleCount() : number;
  isDark(row: number, col: number) : boolean;
  createImgTag(cellSize?: number, margin?: number) : string;
  createSvgTag(cellSize?: number, margin?: number) : string;
  createTableTag(cellSize?: number, margin?: number) : string;
}

declare var qrcode : QRCodeFactory;

declare module 'qrcode-generator' {
  export = qrcode;
}
