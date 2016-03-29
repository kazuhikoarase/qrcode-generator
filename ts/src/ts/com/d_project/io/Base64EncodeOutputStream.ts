/// <reference path="OutputStream.ts" />
'use strict';
namespace com.d_project.io {

  /**
   * Base64EncodeOutputStream
   * @author Kazuhiko Arase
   */
  export class Base64EncodeOutputStream extends OutputStream {

    private buffer = 0;
    private buflen = 0;
    private length = 0;

    constructor(private ostream : OutputStream) {
      super();
    }

    public writeByte(n : number) : void {

      this.buffer = (this.buffer << 8) | (n & 0xff);
      this.buflen += 8;
      this.length += 1;

      while (this.buflen >= 6) {
        this.writeEncoded(this.buffer >>> (this.buflen - 6) );
        this.buflen -= 6;
      }
    }

    public flush() : void {
      if (this.buflen > 0) {
          this.writeEncoded(this.buffer << (6 - this.buflen) );
          this.buffer = 0;
          this.buflen = 0;
      }

      if (this.length % 3 != 0) {
          // padding
          var padlen = 3 - this.length % 3;
          for (var i = 0; i < padlen; i += 1) {
              this.ostream.writeByte('='.charCodeAt(0) );
          }
      }
    }

    private writeEncoded(b : number) : void {
      this.ostream.writeByte(Base64EncodeOutputStream.encode(b & 0x3f) );
    }

    private static encode(n : number) : number {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 'A'.charCodeAt(0) + n;
      } else if (n < 52) {
        return 'a'.charCodeAt(0) + (n - 26);
      } else if (n < 62) {
        return '0'.charCodeAt(0) + (n - 52);
      } else if (n == 62) {
        return '+'.charCodeAt(0);
      } else if (n == 63) {
        return '/'.charCodeAt(0);
      }
      throw 'n:' + n;
    }
  }
}
