import { qrcode } from "./qrcode.js";

const typeNumber = 4; // 1 to 40 (MAX_TYPE_NUMBER)
const errorCorrectionLevel = "L"; // 'L','M','Q','H'
const mode = "Byte"; // 'Numeric' 'Alphanumeric' 'Byte'(base64?) 'Kanji'
const src = "Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!Hi!";

const qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData(src, mode);
qr.make();

const data = qr.createASCII(2);
console.log(data);
console.log(qr._modules);
const w = qr.getModuleCount();
for (let i = 0; i < w; i++) {
  const line = [];
  for (let j = 0; j < w; j++) {
    line.push(qr.isDark(i, j) ? "1" : "0");
  }
  console.log(line.join(""));
}
