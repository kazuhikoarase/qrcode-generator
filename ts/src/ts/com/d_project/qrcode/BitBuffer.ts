'use strict';
namespace com.d_project.qrcode {

  /**
   * BitBuffer
   * @author Kazuhiko Arase
   */
  export class BitBuffer {

    private buffer : number[];
    private length : number;

    public constructor() {
      this.buffer = [];
      this.length = 0;
    }

    public getBuffer() : number[] {
      return this.buffer;
    }

    public getLengthInBits() : number {
      return this.length;
    }

    public toString() : string {
      var buffer = '';
      for (var i = 0; i < this.getLengthInBits(); i += 1) {
        buffer += this.getBit(i)? '1' : '0';
      }
      return buffer;
    }

    private getBit(index : number) : boolean {
      return ( (this.buffer[~~(index / 8)] >>> (7 - index % 8) ) & 1) == 1;
    }

    public put(num : number, length : number) : void {
      for (var i = 0; i < length; i += 1) {
        this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    }

    public putBit(bit : boolean) : void {
      if (this.length == this.buffer.length * 8) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[~~(this.length / 8)] |= (0x80 >>> (this.length % 8) );
      }
      this.length += 1;
    }
  }
}
