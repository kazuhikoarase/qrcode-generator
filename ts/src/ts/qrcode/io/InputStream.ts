'use strict';
namespace qrcode.io {

  /**
   * InputStream
   * @author Kazuhiko Arase
   */
  export abstract class InputStream {
    constructor() {}
    public abstract readByte() : number;
    public close() : void {
    }
  }
}
