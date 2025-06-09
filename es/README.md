# QR Code Generator ES Module

## Getting Started

```js
import { QR } from "https://taisukef.github.io/qrcode-generator/es/QR.js";

const data = QR.encode("Hi!");
console.log(data);
```

for browsers
```js
import { QRCode } from "https://taisukef.github.io/qrcode-generator/es/qr-code.js";

document.body.appendChild(new QRCode("abc"));
```

## API Documentation

#### encode(data, errorCorrectionLevel?, typeNumber?) => <code>QRCode</code>

Create a QRCode array data

| Param                | Type                              | Description                                    |
| -------------------- | --------------------------------- | ---------------------------------------------- |
| data                 | <code>string or Uint8Array</code> | Data                                           |
| errorCorrectionLevel | <code>number</code>               | Error correction level (0:L, 1:M, 2:Q, 3:H)    |
| typeNumber           | <code>number</code>               | Type number (1 ~ 40), or 0 for auto detection. |

--

This implementation is based on JIS X 0510:1999.

The word 'QR Code' is registered trademark of DENSO WAVE INCORPORATED
<br/>http://www.denso-wave.com/qrcode/faqpatent-e.html
