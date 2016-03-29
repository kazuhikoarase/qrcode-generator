'use strict';
namespace com.d_project.qrcode {

  /**
   * Polynomial
   * @author Kazuhiko Arase
   */
  export class Polynomial {

    private num : number[];

    public constructor(num : number[], shift = 0) {

      var offset = 0;

      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }

      this.num = [];
      var len = num.length - offset;
      for (var i = 0; i < len; i += 1) {
        this.num.push(num[offset + i]);
      }
      for (var i = 0; i < shift; i += 1) {
        this.num.push(0);
      }
    }

    public getAt(index : number) : number{
      return this.num[index];
    }

    public getLength() : number {
      return this.num.length;
    }

    public toString() : string {
      var buffer = '';
      for (var i = 0; i < this.getLength(); i += 1) {
        if (i > 0) {
          buffer += ',';
        }
        buffer += this.getAt(i);
      }
      return buffer.toString();
    }

    public toLogString() : string {
      var buffer = '';
      for (var i = 0; i < this.getLength(); i += 1) {
        if (i > 0) {
          buffer += ',';
        }
        buffer += QRMath.glog(this.getAt(i) );
      }
      return buffer.toString();
    }

    public multiply(e : Polynomial) : Polynomial {
      var num : number[] = [];
      var len = this.getLength() + e.getLength() - 1;
      for (var i = 0; i < len; i += 1) {
        num.push(0);
      }
      for (var i = 0; i < this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.getAt(i) ) +
            QRMath.glog(e.getAt(j) ) );
        }
      }
      return new Polynomial(num);
    }

    public mod(e : Polynomial) : Polynomial {

      if (this.getLength() - e.getLength() < 0) {
        return this;
      }

      var ratio = QRMath.glog(this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      // create copy
      var num : number[] = [];
      for (var i = 0; i < this.getLength(); i += 1) {
        num.push(this.getAt(i) );
      }

      // subtract and calc rest.
      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // call recursively
      return new Polynomial(num).mod(e);
    }
  }
}
