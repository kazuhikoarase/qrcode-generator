//---------------------------------------------------------------------
//
// GIF/DataURL Render for JavaScript QR Code Generator (optional)
//
// Based on createImgTag/createDataURL helpers from original QR Code Generator for JavaScript
//   Copyright (c) 2009 Kazuhiko Arase
//   http://www.d-project.com/
//
// Moved to extension, refactored
//   Copyright (c) 2026 Yuriy Apostol
//   https://github.com/yuriyapostol
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// 'QR Code' is a registered trademark of DENSO WAVE INCORPORATED.
//
//---------------------------------------------------------------------

import { qrcode } from './qrcode';

type ByteArrayOutputStream = {
  writeByte: (b: number) => void;
  writeShort: (i: number) => void;
  writeBytes: (b: number[], off?: number, len?: number) => void;
  writeString: (s: string) => void;
  toByteArray: () => number[];
};

const escapeXml = function(s : string) {
  let escaped = '';
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charAt(i);
    switch(c) {
    case '<': escaped += '&lt;'; break;
    case '>': escaped += '&gt;'; break;
    case '&': escaped += '&amp;'; break;
    case '"': escaped += '&quot;'; break;
    default : escaped += c; break;
    }
  }
  return escaped;
};

const byteArrayOutputStream = function() : ByteArrayOutputStream {
  const _bytes : number[] = [];

  const _this = {
    writeByte(b : number) {
      _bytes.push(b & 0xff);
    },
    writeShort(i : number) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    },
    writeBytes(b : number[], off? : number, len? : number) {
      off = off || 0;
      len = len || b.length;
      for (let i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    },
    writeString(s : string) {
      for (let i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i));
      }
    },
    toByteArray() {
      return _bytes;
    }
  };

  return _this;
};

const base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = '';

  const encode = function(n : number) {
    if (n < 26) return 0x41 + n;
    if (n < 52) return 0x61 + (n - 26);
    if (n < 62) return 0x30 + (n - 52);
    if (n == 62) return 0x2b;
    if (n == 63) return 0x2f;
    throw 'n:' + n;
  };

  const writeEncoded = function(b : number) {
    _base64 += String.fromCharCode(encode(b & 0x3f));
  };

  return {
    writeByte(n : number) {
      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6));
        _buflen -= 6;
      }
    },
    flush() {
      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen));
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        const padlen = 3 - _length % 3;
        for (let i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    },
    toString() {
      return _base64;
    }
  };
};

const gifImage = function(width : number, height : number) {
  const _width = width;
  const _height = height;
  const _data = new Array<number>(width * height);

  const _this = {
    setPixel(x : number, y : number, pixel : number) {
      _data[y * _width + x] = pixel;
    },
    write(out : ByteArrayOutputStream) {
      out.writeString('GIF87a');
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0x80);
      out.writeByte(0);
      out.writeByte(0);

      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      const lzwMinCodeSize = 2;
      const raster = getLZWRaster(lzwMinCodeSize);
      out.writeByte(lzwMinCodeSize);

      let offset = 0;
      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);
      out.writeString(';');
    }
  };

  const bitOutputStream = function(out : ByteArrayOutputStream) {
    let _bitLength = 0;
    let _bitBuffer = 0;

    return {
      write(data : number, length : number) {
        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          out.writeByte(0xff & ((data << _bitLength) | _bitBuffer));
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      },
      flush() {
        if (_bitLength > 0) {
          out.writeByte(_bitBuffer);
        }
      }
    };
  };

  const lzwTable = function() {
    const _map : { [key : string] : number } = {};
    let _size = 0;

    return {
      add(key : string) {
        if (typeof _map[key] != 'undefined') {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      },
      size() {
        return _size;
      },
      indexOf(key : string) {
        return _map[key];
      },
      contains(key : string) {
        return typeof _map[key] != 'undefined';
      }
    };
  };

  const getLZWRaster = function(lzwMinCodeSize : number) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();

    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));

    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);

    let dataIndex = 0;
    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;

    while (dataIndex < _data.length) {
      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);

        if (table.size() < 0xfff) {
          if (table.size() == (1 << bitLength)) {
            bitLength += 1;
          }
          table.add(s + c);
        }

        s = c;
      }
    }

    bitOut.write(table.indexOf(s), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();

    return byteOut.toByteArray();
  };

  return _this;
};

const createDataURL = function(width : number, height : number,
    getPixel : (x : number, y : number) => number) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y));
    }
  }

  const b = byteArrayOutputStream();
  gif.write(b);

  const base64 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();

  return 'data:image/gif;base64,' + base64;
};

qrcode.toString.formats['gif'] = function(cellSize? : number | { [key : string] : any },
    margin? : number, alt? : string, title? : string) {

  let opts : { [key : string] : any } = {};
  if (typeof cellSize === 'object') {
    opts = cellSize || {};
    cellSize = void 0;
  }

  let tag = (opts.tag === false) ? false : (opts.tag === true || typeof opts.tag === 'undefined' ? 'img' : opts.tag);
  if (typeof cellSize !== 'number') cellSize = (typeof opts.cellSize === 'number') ? opts.cellSize : 2;
  if (typeof margin === 'undefined') margin = opts.margin;
  if (typeof margin !== 'number') margin = (typeof margin === 'undefined') ? cellSize * 4 : 0;
  if (typeof alt !== 'string') alt = opts.alt;
  if (typeof title !== 'string') title = opts.title;
  const cellSizeValue = Number(cellSize);
  const marginSize = Number(margin);
  const moduleCount = Number((this as any).getModuleCount());

  const size = moduleCount * cellSizeValue + marginSize * 2;
  const min = marginSize;
  const max = size - marginSize;

  const dataURL = createDataURL(size, size, (x, y) => {
    if (min <= x && x < max && min <= y && y < max) {
      const c = Math.floor((x - min) / cellSizeValue);
      const r = Math.floor((y - min) / cellSizeValue);
      return this.isDark(r, c) ? 0 : 1;
    }
    return 1;
  });

  if (tag === false) {
    return dataURL;
  }

  tag = (typeof tag === 'string') ? tag : 'img';

  let html = '';
  html += '<' + tag;
  html += '\u0020src="';
  html += dataURL;
  html += '"';
  html += '\u0020width="';
  html += size;
  html += '"';
  html += '\u0020height="';
  html += size;
  html += '"';
  if (alt) {
    html += '\u0020alt="';
    html += escapeXml(alt);
    html += '"';
  }
  if (title) {
    html += '\u0020title="';
    html += escapeXml(title);
    html += '"';
  }
  html += '/>';

  return html;
};
