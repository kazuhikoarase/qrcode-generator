
import { qrcode } from '../qrcode.mjs';
import { stringToBytes } from '../qrcode_SJIS.mjs';
import { sjis as test } from './qrcode-test-impl.js';
import { misc } from './qrcode-test-impl.js';

qrcode.stringToBytes = stringToBytes;

test(qrcode);
misc(qrcode);
