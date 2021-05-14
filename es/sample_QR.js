import { QR } from "./QR.js";

const src = "HI!";
const qr = QR.encode(src, "L");
console.log(qr);
