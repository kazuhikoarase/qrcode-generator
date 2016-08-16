QR Code Generator
===

1. Include qrcode.js in your html.
2. Prepare a place holder.
3. Generate QR and render it.

```html
<script type="text/javascript" src="qrcode.js"></script>
```
```html
<div id="placeHolder"></div>
```
```javascript
var typeNumber = 4; // 1~40
var errorCorrectionLevel = 'L'; // 'L','M','Q','H'
var qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData('Hi!');
qr.make();
document.getElementById('placeHolder').innerHTML = qr.createImgTag();
```
