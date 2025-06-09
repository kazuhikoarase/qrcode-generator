import { qrcode, qrDetectMode } from "./qrcode.js";

const MAX_TYPE_NUMBER = 40;

// data: data or array of data
// errorCorrectionLevel 0: L, 1: M, 2: Q, 3: H
// typeNumber 1 to 40
// mode: null (auto detect) "Byte" 'Numeric' 'Alphanumeric' 'Kanji' or array of mode
const encode = (data, errorCorrectionLevel, typeNumber, mode) => {
  if (typeof errorCorrectionLevel == "number") {
    errorCorrectionLevel = "LMQH".charAt(errorCorrectionLevel);
  }
  errorCorrectionLevel = errorCorrectionLevel || "L";
  if (Array.isArray(data)) {
    if (mode == null) {
      mode = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        mode[i] = qrDetectMode(data[i]);
      }
    } else if (Array.isArray(mode)) {
      for (let i = 0; i < data.length; i++) {
        mode[i] = mode[i] || qrDetectMode(data[i]);
      }
    } else {
      const orgmode = mode;
      mode = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        mode[i] = orgmode;
      }
    }
  } else {
    mode = mode || qrDetectMode(data);
  }
  const makeQR = (typenum, errorCorrectionLevel) => {
    const qr = qrcode(typenum, errorCorrectionLevel);
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        qr.addData(data[i], mode[i]);
      }
    } else {
      qr.addData(data, mode);
    }
    qr.make();
    return qr;
  };
  const getQR = () => {
    if (!typeNumber) {
      for (let i = 1; i <= MAX_TYPE_NUMBER; i++) {
        try {
          return makeQR(i, errorCorrectionLevel);
        } catch (e) {
          if (!e.toString().startsWith("code length overflow.")) {
            throw e;
          }
        }
      }
      throw Error("overflow");
    } else {
      return makeQR(typeNumber, errorCorrectionLevel);
    }
  };
  const qr = getQR();
  const w = qr.getModuleCount();
  const res = [];
  for (let i = 0; i < w; i++) {
    const line = [];
    for (let j = 0; j < w; j++) {
      line.push(qr.isDark(i, j) ? 1 : 0);
    }
    res.push(line);
  }
  return res;
};

const QR = { encode };
export { QR };
