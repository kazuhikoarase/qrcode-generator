
import { qrcode } from '../qrcode.mjs';
import { stringToBytes } from '../qrcode_UTF8.mjs';
import { utf8 as test } from './qrcode-test-impl.js';

qrcode.stringToBytes = stringToBytes;

test(qrcode);
