import { QRMode } from "./QRMode.js";

const stringToBytes = (s) => {
  const bytes = [];
  if (typeof s == "string") {
    s = new TextEncoder().encode(s);
  }
  for (let i = 0; i < s.length; i++) {
    bytes.push(s[i]);
  }
  return bytes;
};

//---------------------------------------------------------------------
// qrNumber
//---------------------------------------------------------------------

var qrNumber = function(data) {

  var _mode = QRMode.MODE_NUMBER;
  var _data = data;

  var _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    var data = _data;

    var i = 0;

    while (i + 2 < data.length) {
      buffer.put(strToNum(data.substring(i, i + 3) ), 10);
      i += 3;
    }

    if (i < data.length) {
      if (data.length - i == 1) {
        buffer.put(strToNum(data.substring(i, i + 1) ), 4);
      } else if (data.length - i == 2) {
        buffer.put(strToNum(data.substring(i, i + 2) ), 7);
      }
    }
  };

  var strToNum = function(s) {
    var num = 0;
    for (var i = 0; i < s.length; i += 1) {
      num = num * 10 + chatToNum(s.charAt(i) );
    }
    return num;
  };

  var chatToNum = function(c) {
    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    throw 'illegal char :' + c;
  };

  return _this;
};

//---------------------------------------------------------------------
// qrAlphaNum
//---------------------------------------------------------------------

var qrAlphaNum = function(data) {

  var _mode = QRMode.MODE_ALPHA_NUM;
  var _data = data;

  var _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    var s = _data;

    var i = 0;

    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i) ) * 45 +
        getCode(s.charAt(i + 1) ), 11);
      i += 2;
    }

    if (i < s.length) {
      buffer.put(getCode(s.charAt(i) ), 6);
    }
  };

  var getCode = function(c) {

    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    } else if ('A' <= c && c <= 'Z') {
      return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else {
      switch (c) {
      case ' ' : return 36;
      case '$' : return 37;
      case '%' : return 38;
      case '*' : return 39;
      case '+' : return 40;
      case '-' : return 41;
      case '.' : return 42;
      case '/' : return 43;
      case ':' : return 44;
      default :
        throw 'illegal char :' + c;
      }
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qr8BitByte
//---------------------------------------------------------------------

var qr8BitByte = function(data) {

  var _mode = QRMode.MODE_8BIT_BYTE;
  //var _data = data;
  //var _bytes = qrcode.stringToBytes(data);
  const _bytes = stringToBytes(data);

  var _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _bytes.length;
  };

  _this.write = function(buffer) {
    for (var i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qrKanji
//---------------------------------------------------------------------

var qrKanji = function(data) {

  var _mode = QRMode.MODE_KANJI;
  var _data = data;

  var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
  if (!stringToBytes) {
    throw 'sjis not supported.';
  }
  !function(c, code) {
    // self test for sjis support.
    var test = stringToBytes(c);
    if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
      throw 'sjis not supported.';
    }
  }('\u53cb', 0x9746);

  var _bytes = stringToBytes(data);

  var _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };

  _this.write = function(buffer) {

    var data = _bytes;

    var i = 0;

    while (i + 1 < data.length) {

      var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

      if (0x8140 <= c && c <= 0x9FFC) {
        c -= 0x8140;
      } else if (0xE040 <= c && c <= 0xEBBF) {
        c -= 0xC140;
      } else {
        throw 'illegal char at ' + (i + 1) + '/' + c;
      }

      c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

      buffer.put(c, 13);

      i += 2;
    }

    if (i < data.length) {
      throw 'illegal char at ' + (i + 1);
    }
  };

  return _this;
};

const qrCheck = (func, s) => {
  const dummy = { put: (c) => {}};
  try {
    func(s).write(dummy);
    return true;
  } catch (e) {
  }
  return false;
};

const qrDetectMode = (s) => {
  if (qrCheck(qrNumber, s)) {
    return "Numeric";
  }
  if (qrCheck(qrAlphaNum, s)) {
    return "Alphanumeric";
  }
  return "Byte";
};

export { qrNumber, qrAlphaNum, qrKanji, qr8BitByte, qrCheck, qrDetectMode };
