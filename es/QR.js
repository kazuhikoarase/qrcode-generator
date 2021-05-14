import { qrcode } from "./qrcode.js";

const MAX_TYPE_NUMBER = 40;

/*
const typeNumber = 4; // 1 to 40 (MAX_TYPE_NUMBER)
const errorCorrectionLevel = 'L'; // 'L','M','Q','H'
const mode = "Byte"; // 'Numeric' 'Alphanumeric' 'Byte'(base64?) 'Kanji'
*/

// 0: L, 1: M, 2: Q, 3: H
const encode = (data, errorCorrectionLevel, typeNumber) => {
  if (typeof errorCorrectionLevel == "number") {
    errorCorrectionLevel = "LMQH".charAt(errorCorrectionLevel);
  }
  errorCorrectionLevel = errorCorrectionLevel || "L";
  const mode = "Byte"; // todo auto detect!
  const getQR = () => {
    if (!typeNumber) {
      for (let i = 1; i <= MAX_TYPE_NUMBER; i++) {
        try {
          const qr = qrcode(i, errorCorrectionLevel);
          qr.addData(data, mode);
          qr.make();
          return qr;
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      const qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(data, mode);
      qr.make();
      return qr;
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
