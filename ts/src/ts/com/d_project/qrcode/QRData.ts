'use strict';
namespace com.d_project.qrcode {

  /**
   * QRData
   * @author Kazuhiko Arase
   */
  export abstract class QRData {

    constructor(private mode : Mode, private data : string) {
    }

    public getMode() : Mode {
      return this.mode;
    }

    public getData() : string {
      return this.data;
    }

    public abstract getLength() : number;

    public abstract write(buffer : BitBuffer) : void;

    public getLengthInBits(typeNumber : number) : number {

      if (1 <= typeNumber && typeNumber < 10) {

        // 1 - 9

        switch(this.mode) {
        case Mode.MODE_NUMBER     : return 10;
        case Mode.MODE_ALPHA_NUM  : return 9;
        case Mode.MODE_8BIT_BYTE  : return 8;
        case Mode.MODE_KANJI      : return 8;
        default :
          throw 'mode:' + this.mode;
        }

      } else if (typeNumber < 27) {

        // 10 - 26

        switch(this.mode) {
        case Mode.MODE_NUMBER     : return 12;
        case Mode.MODE_ALPHA_NUM  : return 11;
        case Mode.MODE_8BIT_BYTE  : return 16;
        case Mode.MODE_KANJI      : return 10;
        default :
          throw 'mode:' + this.mode;
        }

      } else if (typeNumber < 41) {

        // 27 - 40

        switch(this.mode) {
        case Mode.MODE_NUMBER     : return 14;
        case Mode.MODE_ALPHA_NUM  : return 13;
        case Mode.MODE_8BIT_BYTE  : return 16;
        case Mode.MODE_KANJI      : return 12;
        default :
          throw 'mode:' + this.mode;
        }

      } else {
        throw 'typeNumber:' + typeNumber;
      }
    }
  }
}
