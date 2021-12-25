import { QR } from "./QR.js";

export const encodeImageData = (code, r = 3) => {
  const data = QR.encode(code);
  const iw = data.length;
  const w = 4;
  //const cw = Math.min(document.body.clientWidth, 600);
  //const r = 3; // Math.floor(cw / (iw + w * 2)) || 1;
  const qw = (iw + w * 2) * r;
  
  const idata = new Uint8ClampedArray(qw * qw * 4);
  for (let i = 0; i < idata.length / 4; i++) {
    idata[i * 4 + 0] = 255;
    idata[i * 4 + 1] = 255;
    idata[i * 4 + 2] = 255;
    idata[i * 4 + 3] = 255;
  }
  for (let i = 0; i < iw; i++) {
    for (let j = 0; j < iw; j++) {
      const c = data[i][j] ? 0 : 255;
      for (let k = 0; k < r * r; k++) {
        const x = (i + w) * r + Math.floor(k / r);
        const y = (j + w) * r + (k % r);
        idata[(x + y * qw) * 4] = c;
        idata[(x + y * qw) * 4 + 1] = c;
        idata[(x + y * qw) * 4 + 2] = c;
        idata[(x + y * qw) * 4 + 3] = 255;
      }
    }
  }
  const imgdata = new ImageData(idata, qw, qw);
  return imgdata;
};

class QRCode extends HTMLElement {
  constructor(value) {
    super();
    this.canvas = document.createElement("canvas");
    this.g = this.canvas.getContext("2d");
    this.appendChild(this.canvas);

    if (value) {
      this.value = value;
    } else {
      this.value = document.location.toString();
      window.addEventListener("hashchange", () => this.value = document.location.toString(), false);
    }
  }
  set value(value) {
    const imgdata = encodeImageData(value);
    this.canvas.width = this.canvas.height = imgdata.width;
    this.g.putImageData(imgdata, 0, 0);
  }
}

customElements.define('qr-code', QRCode);

export { QRCode };
