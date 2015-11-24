/// <reference path="QRData.ts" />
'use strict';
namespace com.d_project.qrcode {

  /**
   * QRKanji(SJIS only)
   * @author Kazuhiko Arase
   */
  export class QRKanji extends QRData {

    constructor(data : string) {
      super(Mode.MODE_KANJI, data);
    }

    public write(buffer : BitBuffer) : void {

      var data = QRCode.stringToBytes(this.getData() );

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    }

    public getLength() : number {
      return QRCode.stringToBytes(this.getData() ).length / 2;
    }
  }
}
