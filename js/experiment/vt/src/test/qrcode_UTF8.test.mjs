
//import { qrcode } from '../../dist/qrcode.mjs';
import qrcode from '../../dist/qrcode.mjs'; // test import default
import '../../dist/qrcode-gif.mjs';
import '../../dist/qrcode-ascii.mjs';
import '../../dist/qrcode-table.mjs';
import '../../dist/qrcode-svg.mjs';
import { stringToBytes } from '../../dist/qrcode_UTF8.mjs';
import { utf8 as test } from './qrcode-test-impl.js';

qrcode.stringToBytes = stringToBytes;

test(qrcode);
