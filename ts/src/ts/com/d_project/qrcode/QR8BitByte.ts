/// <reference path="QRData.ts" />
'use strict';
namespace com.d_project.qrcode {

  /**
   * QR8BitByte
   * @author Kazuhiko Arase
   */
  export class QR8BitByte extends QRData {

    constructor(data : string) {
      super(Mode.MODE_8BIT_BYTE, data);
    }

    public write(buffer : BitBuffer) : void {
      var data = QRCode.stringToBytes(this.getData() );
      for (var i = 0; i < data.length; i += 1) {
        buffer.put(data[i], 8);
      }
    }

    public getLength() : number {
      return QRCode.stringToBytes(this.getData() ).length;
    }
  }
}
