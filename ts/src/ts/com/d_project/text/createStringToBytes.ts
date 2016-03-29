/// <reference path="../io/ByteArrayInputStream.ts" />
/// <reference path="../io/Base64DecodeInputStream.ts" />
'use strict';
namespace com.d_project.text {

  import ByteArrayInputStream = com.d_project.io.ByteArrayInputStream;
  import Base64DecodeInputStream = com.d_project.io.Base64DecodeInputStream;

  /**
   * createStringToBytes
   * @author Kazuhiko Arase
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  export function createStringToBytes(
    unicodeData : string,
    numChars : number
  ) : (s : string) => number[] {
    function toBytes(s : string) : number[] {
      var bytes : number[] = [];
      for (var i = 0; i < s.length; i += 1) {
        bytes.push(s.charCodeAt(i) );
      }
      return bytes;
    }
    // create conversion map.
    var unicodeMap = function() {
      var bin = new Base64DecodeInputStream(
        new ByteArrayInputStream(toBytes(unicodeData) ) );
      var read = function() {
        var b = bin.readByte();
        if (b == -1) throw 'eof';
        return b;
      };
      var count = 0;
      var unicodeMap : { [ch : string] : number; } = {};
      while (true) {
        var b0 = bin.readByte();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + '!=' + numChars;
      }
      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s : string) : number[] {
      var bytes : number[] = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };
}
