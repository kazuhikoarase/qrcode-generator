
import { qrcode } from '../../dist/qrcode.mjs';
import '../../dist/qrcode-gif.mjs';
import '../../dist/qrcode-ascii.mjs';
import '../../dist/qrcode-table.mjs';
import '../../dist/qrcode-svg.mjs';
import { stringToBytes } from '../../dist/qrcode_SJIS.mjs';
import { sjis as test } from './qrcode-test-impl.js';
import { misc } from './qrcode-test-impl.js';

qrcode.stringToBytes = stringToBytes;

test(qrcode);
misc(qrcode);
