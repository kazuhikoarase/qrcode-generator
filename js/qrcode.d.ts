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
//  https://www.qrcode.com/en/faq.html
//
//---------------------------------------------------------------------

type TypeNumber =
  | 0 // Automatic type number
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  ;

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

type Mode = 'Numeric' | 'Alphanumeric' | 'Byte' /* Default */ | 'Kanji';

interface QRCodeFactory {
  (typeNumber: TypeNumber, errorCorrectionLevel: ErrorCorrectionLevel) : QRCode;
  stringToBytes(s: string) : number[];
  stringToBytesFuncs : { [encoding : string] : (s: string) => number[] };
  createStringToBytes(unicodeData: string, numChars: number) : (s : string) => number[];
}

interface QRCode {
  addData(data: string, mode?: Mode) : void;
  make() : void;
  getModuleCount() : number;
  isDark(row: number, col: number) : boolean;
  setColors(foreground: string, background: string) : void;
  createImgTag(cellSize?: number, margin?: number, alt?: string) : string;
  createSvgTag(cellSize?: number, margin?: number, alt?: string, title?: string) : string;
  createSvgTag(opts? : { cellSize?: number, margin?: number, scalable?: boolean }) : string;
  createDataURL(cellSize?: number, margin?: number) : string;
  createTableTag(cellSize?: number, margin?: number) : string;
  createASCII(cellSize?: number, margin?: number, inverted?: boolean) : string;
  renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number, margin?: number): void;
}

declare var qrcode : QRCodeFactory;

declare module 'qrcode-generator' {
  export = qrcode;
}
