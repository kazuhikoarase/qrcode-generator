//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
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

export type TypeNumber =
  | 0 // Automatic type number
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type Mode = 'Numeric' | 'Alphanumeric' | 'Byte' /* Default */ | 'Kanji';

export interface QRCode {
  addData(data: string, mode: Mode) : void;
  isDark(row: number, col: number) : boolean;
  getModuleCount() : number;
  make() : void;
  toString() : string;
  toString(format: string, ...args: any[]) : string;
  toString(opts: { format: string, [key: string]: any }) : string;
  createTableTag(cellSize?: number, margin?: number) : string;
  createTableTag(opts? : QRTableTagOpts) : string;
  createSvgTag(cellSize?: number, margin?: number, alt?: any, title?: any) : string;
  createSvgTag(opts? : QRSvgTagOpts) : string;
  createDataURL(cellSize?: number, margin?: number) : string;
  createImgTag(cellSize?: number, margin?: number, alt?: string, title?: string) : string;
  createImgTag(opts? : QRImgTagOpts) : string;
  createASCII(cellSize?: number, margin?: number) : string;
  renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number) : void;
}

export interface QRCodeFactory {
  (typeNumber: TypeNumber, errorCorrectionLevel: ErrorCorrectionLevel) : QRCode;
  stringToBytes(s: string): number[];
  stringToBytesFuncs : { [encoding : string] : (s: string) => number[] };
  createStringToBytes(unicodeData: string, numChars: number) :
    (s : string) => number[];
  toString: {
    (): string;
    formats: { [format : string] : (...args : any[]) => string };
  };
}

export type QRImgTagOpts = {
  cellSize?: number,
  margin?: number,
  alt?: string,
  title?: string,
  [key : string] : any
};

export type QRTableTagOpts = {
  cellSize?: number,
  margin?: number,
  [key : string] : any
};

export type QRSvgTagOpts = {
  cellSize?: number,
  margin?: number,
  scalable?: boolean,
  crispEdges?: boolean | 'auto',
  alt?: any,
  title?: any,
  [key : string] : any
};

export type QRData = {
  getMode() : number;
  getLength() : number;
  write(buffer : QRBitBuffer) : void;
};

export type QRBitBuffer = {
    getBuffer: () => number[];
    getAt: (index: number) => boolean;
    put: (num: number, length: number) => void;
    getLengthInBits: () => number;
    putBit: (bit: boolean) => void;
};

export type QRRSBlock = {
  totalCount: number;
  dataCount: number;
};

export type QRPolynominal = {
  getAt: (index: number) => number;
  getLength: () => number;
  multiply: (e: QRPolynominal) => QRPolynominal;
  mod: (e: QRPolynominal) => QRPolynominal;
};
