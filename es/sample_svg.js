import { QR } from "https://taisukef.github.io/qrcode-generator/es/QR.js";
import { qrdata2svg } from "./qrdata2svg.js";

const data = QR.encode("Hello!");
const svg = qrdata2svg(data, 10);
await Deno.writeTextFile("qr.svg", svg);
