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

(function (qrcode) {

  var escapeXml = function(s) {
    var escaped = '';
    for (var i = 0; i < s.length; i += 1) {
      var c = s.charAt(i);
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

  var byteArrayOutputStream = function() {
    var _bytes = [];
    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    return _this;
  };

  var base64EncodeOutputStream = function() {
    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';
    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {
      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {
      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  var gifImage = function(width, height) {
    var _width = width;
    var _height = height;
    var _data = new Array(width * height);
    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {
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

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);
      out.writeByte(lzwMinCodeSize);

      var offset = 0;
      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);
      out.writeString(';');
    };

    var bitOutputStream = function(out) {
      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;
      var _this = {};

      _this.write = function(data, length) {
        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {
      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;
      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {
        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {
          s = s + c;
        } else {
          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {
            if (table.size() == (1 << bitLength) ) {
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

    var lzwTable = function() {
      var _map = {};
      var _size = 0;
      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  qrcode.toString.formats['gif'] = function (cellSize, margin, alt, title) {
    var opts = {};
    if (typeof cellSize === 'object') {
      opts = cellSize || {};
      cellSize = void 0;
    }

    var tag = (opts.tag === false) ? false : (opts.tag === true || typeof opts.tag === 'undefined' ? 'img' : opts.tag);
    if (typeof cellSize !== 'number') cellSize = (typeof opts.cellSize === 'number') ? opts.cellSize : 2;
    if (typeof margin === 'undefined') margin = opts.margin;
    if (typeof margin !== 'number') margin = (typeof margin === 'undefined')? cellSize * 4 : 0;
    if (typeof alt !== 'string') alt = opts.alt;
    if (typeof title !== 'string') title = opts.title;

    var size = this.getModuleCount() * cellSize + margin * 2;
    var min = margin;
    var max = size - margin;

    var dataURL = createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        var c = Math.floor( (x - min) / cellSize);
        var r = Math.floor( (y - min) / cellSize);
        return this.isDark(r, c)? 0 : 1;
      }
      return 1;
    }.bind(this) );

    if (tag === false) {
      return dataURL;
    }

    tag = (typeof tag === 'string') ? tag : 'img';

    var html = '';
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

})(qrcode);
