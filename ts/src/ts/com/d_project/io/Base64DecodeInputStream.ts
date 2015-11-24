/// <reference path="InputStream.ts"/>
'use strict';
namespace com.d_project.io {

  /**
   * Base64DecodeInputStream
   * @author Kazuhiko Arase
   */
  export class Base64DecodeInputStream extends InputStream {

    private buffer = 0;
    private buflen = 0;

    constructor(private istream : InputStream) {
      super();
    }

    public readByte() : number {

      while (this.buflen < 8) {

        var c = this.istream.readByte();

        if (c == -1) {

          if (this.buflen == 0) {
            return -1;
          }

          throw 'unexpected end of file./' + this.buflen;

        } else if (c == '='.charCodeAt(0) ) {

          this.buflen = 0;
          return -1;

        } else if (Base64DecodeInputStream.isWhitespace(c) ) {
          // ignore if whitespace.
          continue;
        }

        this.buffer = (this.buffer << 6) |
          Base64DecodeInputStream.decode(c);
        this.buflen += 6;
      }

      var n = (this.buffer >>> (this.buflen - 8) ) & 0xff;
      this.buflen -= 8;
      return n;
    }

    private static isWhitespace(c : number) : boolean {
      return c == '\v'.charCodeAt(0) ||
        c == '\t'.charCodeAt(0) ||
        c == '\r'.charCodeAt(0) ||
        c == '\n'.charCodeAt(0);
    }

    private static decode(c : number) : number {
      if ('A'.charCodeAt(0) <= c && c <= 'Z'.charCodeAt(0) ) {
        return c - 'A'.charCodeAt(0);
      } else if ('a'.charCodeAt(0) <= c && c <= 'z'.charCodeAt(0) ) {
        return c - 'a'.charCodeAt(0) + 26;
      } else if ('0'.charCodeAt(0) <= c && c <= '9'.charCodeAt(0) ) {
        return c - '0'.charCodeAt(0) + 52;
      } else if (c == '+'.charCodeAt(0) ) {
        return 62;
      } else if (c == '/'.charCodeAt(0) ) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    }
  }
}
