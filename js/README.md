QR Code Generator
===

##Getting Started

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
var typeNumber = 4;
var errorCorrectionLevel = 'L';
var qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData('Hi!');
qr.make();
document.getElementById('placeHolder').innerHTML = qr.createImgTag();
```
##API Documentation

###QRCodeFactory

####qrcode(typeNumber, errorCorrectionLevel) => <code>QRCode</code>
Create a QRCode Object.

| Param                | Type                | Description                                 |
| ---------------------| ------------------- | ------------------------------------------- |
| typeNumber           | <code>number</code> | Type number (1 ~ 40)                        |
| errorCorrectionLevel | <code>string</code> | Error correction level ('L', 'M', 'Q', 'H') |

####qrcode.stringToBytes(s) : <code>number[]</code>
Encodes a string into an array of number(byte) using any charset.
This function is used by internal.
Overwrite this function to encode using a multibyte charset.

| Param  | Type                | Description      |
| -------| ------------------- | ---------------- |
| s      | <code>string</code> | string to encode |

###QRCode

####addData(data, mode) => <code>void</code>
Add a data to encode.

| Param  | Type                | Description                                                |
| -------| ------------------- | ---------------------------------------------------------- |
| data   | <code>string</code> | string to encode                                           |
| mode   | <code>string</code> | Mode ('Numeric', 'Alphanumeric', 'Byte'(default), 'Kanji') |

####make() => <code>void</code>
Make a QR Code.

####getModuleCount() => <code>number</code>
The number of modules(cells) for each orientation.
_[Note] call make() before this function._

####isDark(row, col) => <code>boolean</code>
The module at row and col is dark or not.
_[Note] call make() before this function._

| Param | Type                | Description         |
| ------| ------------------- | ------------------- |
| row   | <code>number</code> | 0 ~ moduleCount - 1 |
| col   | <code>number</code> | 0 ~ moduleCount - 1 |

####createImgTag(cellSize, margin) => <code>string</code>
####createSvgTag(cellSize, margin) => <code>string</code>
####createTableTag(cellSize, margin) => <code>string</code>
Helper functions for HTML.
 _[Note] call make() before these functions._

| Param    | Type                | Description           |
| ---------| ------------------- | --------------------- |
| cellSize | <code>number</code> | default: 2            |
| margin   | <code>number</code> | default: cellSize * 4 |


--
The word 'QR Code' is registered trademark of DENSO WAVE INCORPORATED
<br/>http://www.denso-wave.com/qrcode/faqpatent-e.html
