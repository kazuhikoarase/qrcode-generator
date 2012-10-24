#
# =QR Code Generator for Ruby
#
# Copyright (c) 2012 Kazuhiko Arase
#
# URL: http://www.d-project.com/
#
# Licensed under the MIT license:
# * http://www.opensource.org/licenses/mit-license.php
#
# The word 'QR Code' is registered trademark of
# DENSO WAVE INCORPORATED
# * http://www.denso-wave.com/qrcode/faqpatent-e.html
#
# ==Usage
#  require 'qrcode.rb'
#
#  # generate with explicit type number
#  qr = QRCode::QRCode.new()
#  qr.setTypeNumber(4)
#  qr.setErrorCorrectLevel(QRCode::ErrorCorrectLevel::M)
#  qr.addData('here comes qr!')
#  qr.make()
#
#  # generate with auto type number
#  #qr = QRCode::QRCode.getMinimumQRCode('here comes qr!',
#  #     QRCode::ErrorCorrectLevel::M)
#
#  # create an image
#  qr.getModuleCount().times { |r|
#    qr.getModuleCount().times { |c|
#      color = qr.isDark(r, c) ? black : white
#      # set pixel ...
#    }
#  }

module QRCode

  class QRCode

    PAD0 = 0xEC
    PAD1 = 0x11

    def initialize
      @typeNumber = 1
      @errorCorrectLevel = ErrorCorrectLevel::H
      @qrDataList = []
      @modules = []
      @moduleCount = 0
    end

    def getTypeNumber
      @typeNumber
    end
    def setTypeNumber(typeNumber)
      @typeNumber = typeNumber
    end

    def getErrorCorrectLevel
      @errorCorrectLevel
    end
    def setErrorCorrectLevel(errorCorrectLevel)
      @errorCorrectLevel = errorCorrectLevel
    end

    def clearData
      @qrDataList = []
    end

    def addData(data)
      @qrDataList.push(QR8BitByte.new(data) )
    end

    def getDataCount
      @qrDataList.length
    end

    def getData(index)
      @qrDataList[index]
    end

    def isDark(row, col)
      (@modules[row][col] != nil) ? @modules[row][col] : false
    end

    def getModuleCount
      @moduleCount
    end

    def make
      makeImpl(false, getBestMaskPattern() )
    end

    private

    def getBestMaskPattern
      minLostPoint = 0
      pattern = 0
      8.times { |i|
        makeImpl(true, i)
        lostPoint = QRUtil.getLostPoint(self)
        if i == 0 || minLostPoint > lostPoint
          minLostPoint = lostPoint
          pattern = i
        end
      }
      pattern
    end

    def makeImpl(test, maskPattern)

      @moduleCount = @typeNumber * 4 + 17
      @modules = @moduleCount.times.map { |_| [nil] * @moduleCount }

      setupPositionProbePattern(0, 0)
      setupPositionProbePattern(@moduleCount - 7, 0)
      setupPositionProbePattern(0, @moduleCount - 7)

      setupPositionAdjustPattern()
      setupTimingPattern()

      setupTypeInfo(test, maskPattern)

      if @typeNumber >= 7
        setupTypeNumber(test)
      end

      data = QRCode.createData(@typeNumber, @errorCorrectLevel, @qrDataList)

      mapData(data, maskPattern)
    end

    def mapData(data, maskPattern)

      rows = @moduleCount.times.to_a
      cols = (@moduleCount - 1).step(1, -2).map { |i| i <= 6 ? i - 1 : i }

      maskFunc = QRUtil.getMaskFunction(maskPattern)

      byteIndex = 0
      bitIndex = 7

      cols.each { |col|
        rows.reverse!
        rows.each { |row|
          (0 .. 1).each { |c|
            if @modules[row][col - c] == nil

              dark = false
              if byteIndex < data.length
                dark = ( (data[byteIndex] >> bitIndex) & 1) == 1
              end
              if maskFunc.call(row, col - c)
                dark = !dark
              end
              @modules[row][col - c] = dark

              bitIndex -= 1
              if bitIndex == -1
                byteIndex += 1
                bitIndex = 7
              end
            end
          }
        }
      }
    end

    def setupPositionAdjustPattern
      pos = QRUtil.getPatternPosition(@typeNumber)
      pos.each { |row|
        pos.each { |col|
          if @modules[row][col] != nil
            next
          end
          (-2 .. 2).each { |r|
            (-2 .. 2).each { |c|
              @modules[row + r][col + c] =
                  r == -2 || r == 2 || c == -2 || c == 2 ||
                  (r == 0 && c == 0)
            }
          }
        }
      }
    end

    def setupPositionProbePattern(row, col)
      (-1 .. 7).each { |r|
        (-1 .. 7).each { |c|
          if (row + r <= -1 || @moduleCount <= row + r ||
              col + c <= -1 || @moduleCount <= col + c)
            next
          end
          @modules[row + r][col + c] = (
            (0 <= r && r <= 6 && (c == 0 || c == 6) ) ||
            (0 <= c && c <= 6 && (r == 0 || r == 6) ) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4) )
        }
      }
    end

    def setupTimingPattern
      (8 .. @moduleCount - 8 - 1).each { |r|
        if @modules[r][6] != nil
          next
        end
        @modules[r][6] = r % 2 == 0
      }
      (8 .. @moduleCount - 8 - 1).each { |c|
        if @modules[6][c] != nil
          next
        end
        @modules[6][c] = c % 2 == 0
      }
    end

    def setupTypeNumber(test)
      bits = QRUtil.getBCHTypeNumber(@typeNumber)
      18.times { |i|
        @modules[i / 3][i % 3 + @moduleCount - 8 - 3] =
            !test && ( (bits >> i) & 1) == 1
      }
      18.times { |i|
        @modules[i % 3 + @moduleCount - 8 - 3][i / 3] =
            !test && ( (bits >> i) & 1) == 1
      }
    end

    def setupTypeInfo(test, maskPattern)

      data = (@errorCorrectLevel << 3) | maskPattern
      bits = QRUtil.getBCHTypeInfo(data)

      # vertical
      15.times { |i|
        mod = !test && ( (bits >> i) & 1) == 1
        if i < 6
          @modules[i][8] = mod
        elsif i < 8
          @modules[i + 1][8] = mod
        else
          @modules[@moduleCount - 15 + i][8] = mod
        end
      }

      # horizontal
      15.times { |i|
        mod = !test && ( (bits >> i) & 1) == 1
        if i < 8
          @modules[8][@moduleCount - i - 1] = mod
        elsif i < 9
          @modules[8][15 - i - 1 + 1] = mod
        else
          @modules[8][15 - i - 1] = mod
        end
      }

      # fixed
      @modules[@moduleCount - 8][8] = !test
    end

    def self.createData(typeNumber, errorCorrectLevel, dataArray)

      rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel)

      buffer = BitBuffer.new

      dataArray.each { |data|
        buffer.put(data.getMode(), 4)
        buffer.put(data.getLength(), data.getLengthInBits(typeNumber) )
        data.write(buffer)
      }

      totalDataCount = rsBlocks.map { |rsBlock|
            rsBlock.getDataCount() }.inject(:+)

      if buffer.getLengthInBits() > totalDataCount * 8
        raise 'code length overflow. ' +
          "(#{buffer.getLengthInBits()} > #{totalDataCount * 8})"
      end

      # end code
      if buffer.getLengthInBits() + 4 <= totalDataCount * 8
        buffer.put(0, 4)
      end

      # padding
      while buffer.getLengthInBits() % 8 != 0
        buffer.put(false)
      end

      # padding
      while true
        if buffer.getLengthInBits() >= totalDataCount * 8
          break
        end
        buffer.put(QRCode::PAD0, 8)
        if buffer.getLengthInBits() >= totalDataCount * 8
          break
        end
        buffer.put(QRCode::PAD1, 8)
      end

      QRCode.createBytes(buffer, rsBlocks)
    end

    def self.createBytes(buffer, rsBlocks)

      offset = 0

      maxDcCount = 0
      maxEcCount = 0

      dcdata = [nil] * rsBlocks.length
      ecdata = [nil] * rsBlocks.length

      rsBlocks.length.times { |r|

        dcCount = rsBlocks[r].getDataCount()
        ecCount = rsBlocks[r].getTotalCount() - dcCount

        maxDcCount = [maxDcCount, dcCount].max
        maxEcCount = [maxEcCount, ecCount].max

        dcdata[r] = [0] * dcCount
        dcdata[r].length.times { |i|
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset]
        }
        offset += dcCount

        rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
        rawPoly = Polynomial.new(dcdata[r], rsPoly.getLength() - 1)

        modPoly = rawPoly.mod(rsPoly)
        ecdata[r] = [0] * (rsPoly.getLength() - 1)
        ecdata[r].length.times { |i|
          modIndex = i + modPoly.getLength() - ecdata[r].length
          ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
        }
      }

      totalCodeCount = rsBlocks.map { |rsBlock|
            rsBlock.getTotalCount() }.inject(:+)

      data = [0] * totalCodeCount

      index = 0

      maxDcCount.times { |i|
        rsBlocks.length.times { |r|
          if i < dcdata[r].length
            data[index] = dcdata[r][i]
            index += 1
          end
        }
      }

      maxEcCount.times { |i|
        rsBlocks.length.times { |r|
          if i < ecdata[r].length
            data[index] = ecdata[r][i]
            index += 1
          end
        }
      }

      data
    end

    public

    def self.getMinimumQRCode(data, errorCorrectLevel)
      mode = Mode::MODE_8BIT_BYTE # fixed to 8bit byte
      qr = QRCode.new()
      qr.setErrorCorrectLevel(errorCorrectLevel)
      qr.addData(data)
      length = qr.getData(0).getLength()
      (1 .. 10).each { |typeNumber|
        if length <= QRUtil.getMaxLength(
            typeNumber, mode, errorCorrectLevel)
          qr.setTypeNumber(typeNumber)
          break
        end
      }
      qr.make()
      qr
    end

  end

  class Mode
    MODE_NUMBER    = 1 << 0
    MODE_ALPHA_NUM = 1 << 1
    MODE_8BIT_BYTE = 1 << 2
    MODE_KANJI     = 1 << 3
  end

  class ErrorCorrectLevel
    # 7%
    L = 1
    # 15%
    M = 0
    # 25%
    Q = 3
    # 30%
    H = 2
  end

  class MaskPattern
    PATTERN000 = 0
    PATTERN001 = 1
    PATTERN010 = 2
    PATTERN011 = 3
    PATTERN100 = 4
    PATTERN101 = 5
    PATTERN110 = 6
    PATTERN111 = 7
  end

  class QRUtil

    def self.getPatternPosition(typeNumber)
      QRUtil::PATTERN_POSITION_TABLE[typeNumber - 1]
    end

    PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ]

    MAX_LENGTH = [
      [ [41,  25,  17,  10],  [34,  20,  14,  8],   [27,  16,  11,  7],  [17,  10,  7,   4] ],
      [ [77,  47,  32,  20],  [63,  38,  26,  16],  [48,  29,  20,  12], [34,  20,  14,  8] ],
      [ [127, 77,  53,  32],  [101, 61,  42,  26],  [77,  47,  32,  20], [58,  35,  24,  15] ],
      [ [187, 114, 78,  48],  [149, 90,  62,  38],  [111, 67,  46,  28], [82,  50,  34,  21] ],
      [ [255, 154, 106, 65],  [202, 122, 84,  52],  [144, 87,  60,  37], [106, 64,  44,  27] ],
      [ [322, 195, 134, 82],  [255, 154, 106, 65],  [178, 108, 74,  45], [139, 84,  58,  36] ],
      [ [370, 224, 154, 95],  [293, 178, 122, 75],  [207, 125, 86,  53], [154, 93,  64,  39] ],
      [ [461, 279, 192, 118], [365, 221, 152, 93],  [259, 157, 108, 66], [202, 122, 84,  52] ],
      [ [552, 335, 230, 141], [432, 262, 180, 111], [312, 189, 130, 80], [235, 143, 98,  60] ],
      [ [652, 395, 271, 167], [513, 311, 213, 131], [364, 221, 151, 93], [288, 174, 119, 74] ]
    ]

    def self.getMaxLength(typeNumber, mode, errorCorrectLevel)

      t = typeNumber - 1

      e = case errorCorrectLevel
      when ErrorCorrectLevel::L; 0
      when ErrorCorrectLevel::M; 1
      when ErrorCorrectLevel::Q; 2
      when ErrorCorrectLevel::H; 3
      else raise "errorCorrectLevel:#{errorCorrectLevel}"
      end

      m = case mode
      when Mode::MODE_NUMBER;    0
      when Mode::MODE_ALPHA_NUM; 1
      when Mode::MODE_8BIT_BYTE; 2
      when Mode::MODE_KANJI;     3
      else raise "mode:#{mode}"
      end

      QRUtil::MAX_LENGTH[t][e][m]
    end

    def self.getErrorCorrectPolynomial(errorCorrectLength)
      a = Polynomial.new([1])
      errorCorrectLength.times { |i|
        a = a.multiply(Polynomial.new([1, QRMath.gexp(i)]) )
      }
      a
    end

    def self.getMaskFunction(maskPattern)
      case maskPattern
      when MaskPattern::PATTERN000
        lambda { |i, j| (i + j) % 2 == 0 }
      when MaskPattern::PATTERN001
        lambda { |i, j| i % 2 == 0 }
      when MaskPattern::PATTERN010
        lambda { |i, j| j % 3 == 0 }
      when MaskPattern::PATTERN011
        lambda { |i, j| (i + j) % 3 == 0 }
      when MaskPattern::PATTERN100
        lambda { |i, j| (i / 2 + j / 3) % 2 == 0 }
      when MaskPattern::PATTERN101
        lambda { |i, j| (i * j) % 2 + (i * j) % 3 == 0 }
      when MaskPattern::PATTERN110
        lambda { |i, j| ( (i * j) % 2 + (i * j) % 3) % 2 == 0 }
      when MaskPattern::PATTERN111
        lambda { |i, j| ( (i * j) % 3 + (i + j) % 2) % 2 == 0 }
      else raise "maskPattern:#{maskPattern}"
      end
    end

    def self.getLostPoint(qrcode)

      moduleCount = qrcode.getModuleCount()
      lostPoint = 0

      # LEVEL1
      moduleCount.times { |row|
        moduleCount.times { |col|
          sameCount = 0
          dark = qrcode.isDark(row, col)
          (-1 .. 1).each { |r|
            if row + r < 0 || moduleCount <= row + r
              next
            end
            (-1 .. 1).each { |c|
              if col + c < 0 || moduleCount <= col + c
                next
              end
              if r == 0 && c == 0
                next
              end
              if dark == qrcode.isDark(row + r, col + c)
                sameCount += 1
              end
            }
          }
          if sameCount > 5
            lostPoint += (3 + sameCount - 5)
          end
        }
      }

      # LEVEL2
      (moduleCount - 1).times { |row|
        (moduleCount - 1).times { |col|
          count = 0
          count += 1 if qrcode.isDark(row, col)
          count += 1 if qrcode.isDark(row + 1, col)
          count += 1 if qrcode.isDark(row, col + 1)
          count += 1 if qrcode.isDark(row + 1, col + 1)
          if count == 0 || count == 4
            lostPoint += 3
          end
        }
      }

      # LEVEL3
      moduleCount.times { |row|
        (moduleCount - 6).times { |col|
          if (qrcode.isDark(row, col) &&
              !qrcode.isDark(row, col + 1) &&
               qrcode.isDark(row, col + 2) &&
               qrcode.isDark(row, col + 3) &&
               qrcode.isDark(row, col + 4) &&
              !qrcode.isDark(row, col + 5) &&
               qrcode.isDark(row, col + 6) )
            lostPoint += 40
          end
        }
      }
      moduleCount.times { |col|
        (moduleCount - 6).times { |row|
          if (qrcode.isDark(row, col) &&
              !qrcode.isDark(row + 1, col) &&
               qrcode.isDark(row + 2, col) &&
               qrcode.isDark(row + 3, col) &&
               qrcode.isDark(row + 4, col) &&
              !qrcode.isDark(row + 5, col) &&
               qrcode.isDark(row + 6, col) )
            lostPoint += 40
          end
        }
      }

      # LEVEL4
      darkCount = 0
      moduleCount.times { |col|
        moduleCount.times { |row|
          if qrcode.isDark(row, col)
            darkCount += 1
          end
        }
      }

      ratio = (100 * darkCount / moduleCount / moduleCount - 50).abs / 5
      lostPoint += ratio * 10

      lostPoint
    end

    G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) |
          (1 << 2) | (1 << 1) | (1 << 0)
    G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) |
          (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
    G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)

    def self.getBCHTypeInfo(data)
      d = data << 10
      while QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil::G15) >= 0
        d ^= QRUtil::G15 << (QRUtil.getBCHDigit(d) -
             QRUtil.getBCHDigit(QRUtil::G15) )
      end
      ( (data << 10) | d) ^ QRUtil::G15_MASK
    end

    def self.getBCHTypeNumber(data)
      d = data << 12
      while QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil::G18) >= 0
        d ^= QRUtil::G18 << (QRUtil.getBCHDigit(d) -
             QRUtil.getBCHDigit(QRUtil::G18) )
      end
      (data << 12) | d
    end

    def self.getBCHDigit(data)
      digit = 0
      while data != 0
        digit += 1
        data >>= 1
      end
      digit
    end

    def self.stringToBytes(s)
      s.chars.map { |c| c.ord }
    end

  end

  class QR8BitByte

    def initialize(data)
      @mode = Mode::MODE_8BIT_BYTE
      @data = data
    end

    def getMode
      @mode
    end
    def getData
      @data
    end

=begin
    def write(buffer)
      raise 'not implemented.'
    end
    def getLength
      raise 'not implemented.'
    end
=end

    def write(buffer)
      QRUtil.stringToBytes(self.getData() ).each { |d|
        buffer.put(d, 8)
      }
    end

    def getLength
      QRUtil.stringToBytes(self.getData() ).length
    end

    def getLengthInBits(type)
      if 1 <= type && type < 10 # 1 - 9
        case @mode
        when Mode::MODE_NUMBER;    10
        when Mode::MODE_ALPHA_NUM; 9
        when Mode::MODE_8BIT_BYTE; 8
        when Mode::MODE_KANJI;     8
        else raise "mode:#{@mode}"
        end
      elsif type < 27 # 10 - 26
        case @mode
        when Mode::MODE_NUMBER;    12
        when Mode::MODE_ALPHA_NUM; 11
        when Mode::MODE_8BIT_BYTE; 16
        when Mode::MODE_KANJI;     10
        else raise "mode:#{@mode}"
        end
      elsif type < 41 # 27 - 40
        case @mode
        when Mode::MODE_NUMBER;    14
        when Mode::MODE_ALPHA_NUM; 13
        when Mode::MODE_8BIT_BYTE; 16
        when Mode::MODE_KANJI;     12
        else raise "mode:#{@mode}"
        end
      else
        raise "type:#{type}"
      end
    end

  end

  class QRMath

    def initialize
      raise "can't instantiate"
    end

    def self.glog(n)
      if n < 1
        raise "log(#{n})"
      end
      @LOG_TABLE[n]
    end

    def self.gexp(n)
      n += 255 while n < 0
      n -= 255 while n >= 256
      @EXP_TABLE[n]
    end

    private
    def self.initTables

      @EXP_TABLE = [0] * 256
      256.times { |i|
        @EXP_TABLE[i] = i < 8 ? 1 << i :
          @EXP_TABLE[i - 4] ^ @EXP_TABLE[i - 5] ^
          @EXP_TABLE[i - 6] ^ @EXP_TABLE[i - 8]
      }

      @LOG_TABLE = [0] * 256
      255.times { |i|
        @LOG_TABLE[@EXP_TABLE[i] ] = i
      }

    end

    initTables
  end

  class Polynomial

    def initialize(num, shift = 0)
      length = num.length
      offset = 0
      offset += 1 while offset < length && num[offset] == 0
      @num = num[offset .. num.length - 1] + [0] * shift
    end

    def get(index)
      @num[index]
    end

    def getLength
      @num.length
    end

    def to_s
      getLength().times.map { |i| get(i) }.join(',')
    end

    def to_log_s
      getLength().times.map { |i| QRMath.glog(get(i) ) }.join(',')
    end

    def multiply(e)
      num = [0] * (getLength() + e.getLength() - 1)
      getLength().times { |i|
        e.getLength().times { |j|
          num[i + j] ^= QRMath.gexp(QRMath.glog(get(i) ) +
                        QRMath.glog(e.get(j) ) )
        }
      }
      Polynomial.new(num)
    end

    def mod(e)
      if getLength() - e.getLength() < 0
        self
      else
        ratio = QRMath.glog(get(0) ) - QRMath.glog(e.get(0) )
        num = @num.clone
        e.getLength().times { |i|
          num[i] ^= QRMath.gexp(QRMath.glog(e.get(i) ) + ratio)
        }
        Polynomial.new(num).mod(e)
      end
    end

  end

  class RSBlock

    RS_BLOCK_TABLE = [

      # L
      # M
      # Q
      # H

      # 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      # 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      # 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      # 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      # 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      # 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      # 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      # 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      # 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      # 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16]
    ]

    def initialize(totalCount, dataCount)
      @totalCount = totalCount
      @dataCount = dataCount
    end

    def getDataCount
      @dataCount
    end

    def getTotalCount
      @totalCount
    end

    def to_s
      "(total=#{@totalCount},data=#{@dataCount})"
    end

    def self.getRSBlocks(typeNumber, errorCorrectLevel)
      rsBlock = RSBlock.getRsBlockTable(typeNumber, errorCorrectLevel)
      length = rsBlock.length / 3
      list = []
      length.times { |i|
        count      = rsBlock[i * 3 + 0]
        totalCount = rsBlock[i * 3 + 1]
        dataCount  = rsBlock[i * 3 + 2]
        list += [RSBlock.new(totalCount, dataCount)] * count
      }
      list
    end

    def self.getRsBlockTable(typeNumber, errorCorrectLevel)
      case errorCorrectLevel
      when ErrorCorrectLevel::L
        RSBlock::RS_BLOCK_TABLE[ (typeNumber - 1) * 4 + 0]
      when ErrorCorrectLevel::M
        RSBlock::RS_BLOCK_TABLE[ (typeNumber - 1) * 4 + 1]
      when ErrorCorrectLevel::Q
        RSBlock::RS_BLOCK_TABLE[ (typeNumber - 1) * 4 + 2]
      when ErrorCorrectLevel::H
        RSBlock::RS_BLOCK_TABLE[ (typeNumber - 1) * 4 + 3]
      else
        raise "errorCorrectLevel:#{errorCorrectLevel}"
      end
    end
  end

  class BitBuffer

    def initialize(inclements = 32)
      @inclements = inclements
      @buffer = [0] * @inclements
      @length = 0
    end

    def getBuffer
      @buffer
    end

    def getLengthInBits
      @length
    end

    def get(index)
      ( (@buffer[index / 8] >> (7 - index % 8) ) & 1) == 1
    end

    def putBit(bit)
      if @length == @buffer.length * 8
        @buffer += [0] * @inclements
      end
      if bit
        @buffer[@length / 8] |= (0x80 >> (@length % 8) )
      end
      @length += 1
    end

    def put(num, length)
      length.times { |i|
        putBit( ( (num >> (length - i - 1) ) & 1) == 1) }
    end

    def to_s
      getLengthInBits().times.map { |i| get(i) ? '1' : '0' }.join('')
    end

  end

end
