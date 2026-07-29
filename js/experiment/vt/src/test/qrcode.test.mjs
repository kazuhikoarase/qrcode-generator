
import { qrcode } from '../../dist/qrcode.mjs';
import '../../dist/qrcode-gif.mjs';
import '../../dist/qrcode-ascii.mjs';
import '../../dist/qrcode-table.mjs';
import '../../dist/qrcode-svg.mjs';
import { overview as test } from './qrcode-test-impl.js';

test(qrcode);
