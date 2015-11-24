//---------------------------------------------------------------------
//
// QR Code Generator for TypeScript
//
// Copyright (c) 2015 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

/// <reference path="../text/stringToBytes_SJIS.ts" />
'use strict';
namespace com.d_project.qrcode {

  import stringToBytes_SJIS = com.d_project.text.stringToBytes_SJIS;

  /**
   * QRCode
   * @author Kazuhiko Arase
   */
  export class QRCode {

    private static PAD0 = 0xEC;

    private static PAD1 = 0x11;

    private typeNumber : number;

    private errorCorrectLevel : ErrorCorrectLevel;

    private qrDataList : QRData[];

    private modules : boolean[][];

    private moduleCount : number;

    public constructor() {
      this.typeNumber = 1;
      this.errorCorrectLevel = ErrorCorrectLevel.L;
      this.qrDataList = [];
    }

    public getTypeNumber() : number {
      return this.typeNumber;
    }

    public setTypeNumber(typeNumber : number) : void {
      this.typeNumber = typeNumber;
    }

    public getErrorCorrectLevel() : ErrorCorrectLevel {
      return this.errorCorrectLevel;
    }

    public setErrorCorrectLevel(errorCorrectLevel : ErrorCorrectLevel) {
      this.errorCorrectLevel = errorCorrectLevel;
    }

    public clearData() : void {
      this.qrDataList = [];
    }

    public addData(qrData : QRData | string) : void {
      if (qrData instanceof QRData) {
        this.qrDataList.push(qrData);
      } else if (typeof qrData === 'string') {
        this.qrDataList.push(new QR8BitByte(qrData) );
      } else {
        throw typeof qrData;
      }
    }

    private getDataCount() : number {
      return this.qrDataList.length;
    }

    private getData(index : number) : QRData {
      return this.qrDataList[index];
    }

    public isDark(row : number, col : number) : boolean {
      if (this.modules[row][col] != null) {
        return this.modules[row][col];
      } else {
        return false;
      }
    }

    public getModuleCount() : number {
      return this.moduleCount;
    }

    public make() : void {
      this.makeImpl(false, this.getBestMaskPattern() );
    }

    private getBestMaskPattern() : number {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        this.makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(this);

        if (i == 0 || minLostPoint >  lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    }

    private makeImpl(test : boolean, maskPattern : number) : void {

      // initialize modules
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = [];
      for (var i = 0; i < this.moduleCount; i += 1) {
        this.modules.push([]);
        for (var j = 0; j < this.moduleCount; j += 1) {
          this.modules[i].push(null);
        }
      }

      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);

      this.setupPositionAdjustPattern();
      this.setupTimingPattern();

      this.setupTypeInfo(test, maskPattern);

      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }

      var data = QRCode.createData(
        this.typeNumber, this.errorCorrectLevel, this.qrDataList);
      this.mapData(data, maskPattern);
    }

    private mapData(data : number[], maskPattern : number) : void {

      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunc(maskPattern);

      for (var col = this.moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) {
          col -= 1;
        }

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (this.modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              this.modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }

    private setupPositionAdjustPattern() : void {

      var pos = QRUtil.getPatternPosition(this.typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (this.modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    }

    private setupPositionProbePattern(row : number, col : number) : void {

      for (var r = -1; r <= 7; r += 1) {

        for (var c = -1; c <= 7; c += 1) {

          if (row + r <= -1 || this.moduleCount <= row + r
              || col + c <= -1 || this.moduleCount <= col + c) {
            continue;
          }

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    }

    private setupTimingPattern() : void {
      for (var r = 8; r < this.moduleCount - 8; r += 1) {
        if (this.modules[r][6] != null) {
          continue;
        }
        this.modules[r][6] = r % 2 == 0;
      }
      for (var c = 8; c < this.moduleCount - 8; c += 1) {
        if (this.modules[6][c] != null) {
          continue;
        }
        this.modules[6][c] = c % 2 == 0;
      }
    }

    private setupTypeNumber(test : boolean) : void {

      var bits = QRUtil.getBCHTypeNumber(this.typeNumber);

      for (var i = 0; i < 18; i += 1) {
        this.modules[~~(i / 3)][i % 3 + this.moduleCount - 8 - 3] =
          !test && ( (bits >> i) & 1) == 1;
      }

      for (var i = 0; i < 18; i += 1) {
        this.modules[i % 3 + this.moduleCount - 8 - 3][~~(i / 3)] =
          !test && ( (bits >> i) & 1) == 1;
      }
    }

    private setupTypeInfo(test : boolean, maskPattern : number) : void {

      var data = (this.errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = !test && ( (bits >> i) & 1) == 1;

        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = !test && ( (bits >> i) & 1) == 1;

        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }

      // fixed
      this.modules[this.moduleCount - 8][8] = !test;
    }

    public static createData(
      typeNumber : number,
      errorCorrectLevel : ErrorCorrectLevel,
      dataArray : QRData[]
    ) : number[] {

      var rsBlocks : RSBlock[] = RSBlock.getRSBlocks(
        typeNumber, errorCorrectLevel);

      var buffer = new BitBuffer();

      for (var i = 0; i < dataArray.length; i += 1) {
        var data = dataArray[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), data.getLengthInBits(typeNumber) );
        data.write(buffer);
      }

      // calc max data count
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].getDataCount();
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          +  totalDataCount * 8
          + ')';
      }

      // end
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD1, 8);
      }

      return QRCode.createBytes(buffer, rsBlocks);
    }

    private static createBytes(
      buffer : BitBuffer,
      rsBlocks : RSBlock[]
    ) : number[] {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata : number[][] = [];
      var ecdata : number[][] = [];

      for (var r = 0; r < rsBlocks.length; r += 1) {
        dcdata.push([]);
        ecdata.push([]);
      }

      function createNumArray(len : number) : number[] {
        var a : number[] = [];
        for (var i = 0; i < len; i += 1) {
          a.push(0);
        }
        return a;
      }

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].getDataCount();
        var ecCount = rsBlocks[r].getTotalCount() - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = createNumArray(dcCount);
        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = createNumArray(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].getTotalCount();
      }

      var data = createNumArray(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r  = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }
      return data;
    }

    public toDataURL(cellSize = 2, margin = cellSize * 4) : string {
      var mods = this.getModuleCount();
      var size = cellSize * mods + margin * 2;
      var gif = new com.d_project.image.GIFImage(size, size);
      for (var y = 0; y < size; y += 1) {
        for (var x = 0; x < size; x += 1) {
          if (margin <= x && x < size - margin &&
              margin <= y && y < size - margin &&
              this.isDark(
                ~~( (y - margin) / cellSize),
                ~~( (x - margin) / cellSize) ) ) {
            gif.setPixel(x, y, 0);
          } else {
            gif.setPixel(x, y, 1);
          }
        }
      }
      return gif.toDataURL();
    }

    // by default, SJIS encoding is applied.
    public static stringToBytes = stringToBytes_SJIS;
  }
}
