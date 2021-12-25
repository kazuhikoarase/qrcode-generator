import * as t from "https://deno.land/std/testing/asserts.ts";
import { QR } from "../QR.js";
import { qrNumber, qrAlphaNum, qrKanji, qr8BitByte, qrCheck, qrDetectMode } from "../qrcodec.js";

Deno.test("qrNumber", () => {
  t.assert(qrCheck(qrNumber, "1234"));
  t.assert(!qrCheck(qrNumber, "33a"));
});
Deno.test("qrAlphaNum", () => {
  t.assert(qrCheck(qrAlphaNum, "A23")); // only Uppercase
  t.assert(!qrCheck(qrAlphaNum, "a23"));
  t.assert(qrCheck(qrAlphaNum, "A:"));
  t.assert(qrCheck(qrAlphaNum, "HTTPS://JIG.JP/")); // ok
  t.assert(!qrCheck(qrAlphaNum, "https://jig.jp/")); // NG
});
Deno.test("qrDetectMode", () => {
  t.assertEquals(qrDetectMode("A23"), "Alphanumeric");
  t.assertEquals(qrDetectMode("123"), "Numeric");
  t.assertEquals(qrDetectMode("jig.jp"), "Byte");
});

Deno.test("should exist", () => {
  t.assert(QR);
});
Deno.test("should be a callable function", () => {
  t.assert(QR.encode instanceof Function);
});
Deno.test("encode Hi!", () => {
  const data = QR.encode("Hi!");
  //console.log(JSON.stringify(data))
  const chk = [[1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],[1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0,1,0,0],[0,0,1,1,0,1,0,1,0,0,0,0,0,0,1,0,0,1,1,1,1],[0,0,0,1,0,1,1,0,1,0,1,0,1,0,0,0,1,1,1,1,1],[0,1,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,1,0,1,0],[1,1,1,1,0,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0],[1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,1,1],[1,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,1,0,0,1,0,1],[1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,1,0],[1,0,1,1,1,0,1,0,1,1,0,0,1,0,0,0,1,0,0,0,1],[1,0,0,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,1,1,0],[1,1,1,1,1,1,1,0,1,1,0,0,1,0,1,0,1,0,1,1,1]];
  t.assertEquals(data, chk);
  t.assertEquals(data.length, 21);
});
Deno.test("encode HI!", () => {
  const data = QR.encode("HI!");
  // console.log(JSON.stringify(data))
  const chk = [[1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],[1,1,0,1,0,0,1,1,0,1,1,0,0,0,1,1,1,0,1,1,0],[0,1,1,1,1,0,0,0,0,1,1,0,0,0,1,0,0,1,1,1,0],[0,1,0,0,1,0,1,0,0,0,1,0,1,1,0,0,0,1,1,0,1],[0,0,1,0,0,1,0,0,1,1,0,1,0,0,0,0,0,0,0,1,1],[0,0,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0],[1,1,1,1,1,1,1,0,1,0,0,0,0,1,0,1,0,0,1,1,0],[1,0,0,0,0,0,1,0,0,0,1,1,1,1,0,1,1,1,0,0,1],[1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1],[1,0,1,1,1,0,1,0,1,1,1,1,0,0,0,0,0,1,1,1,1],[1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,0,0,0,0,0,1,0,1,1,0,0,0,1,1,0,1,0,1,0,0],[1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,0]];
  t.assertEquals(data, chk);
  t.assertEquals(data.length, 21);
});
Deno.test("encode Numeric", () => {
  const s = "12345678901234567890123456789012345678901";
  const data = QR.encode(s);
  t.assertEquals(qrDetectMode(s), "Numeric");
  t.assertEquals(data.length, 21);
});
Deno.test("encode Alphanumeric", () => {
  const s = "HIHIHIHIHIHIHIHIHIHIHIHIH";
  const data = QR.encode(s);
  t.assertEquals(qrDetectMode(s), "Alphanumeric");
  t.assertEquals(data.length, 21);
});
Deno.test("encode Byte", () => {
  const s = "hIHIHIHIHIHIHIHIHIHIHIHIH";
  const data = QR.encode(s);
  t.assertEquals(qrDetectMode(s), "Byte");
  t.assertEquals(data.length, 25);
});
Deno.test("encode bin", () => {
  const bin = new Uint8Array(1, 2, 3);
  const data = QR.encode(bin);
  t.assertEquals(qrDetectMode(bin), "Byte");
  t.assertEquals(data.length, 21);
});
