package com.d_project.qrcode {

    import flash.utils.ByteArray;
    
    /**
     * QRUtil
     * @author Kazuhiko Arase 
     */
    internal class QRUtil {
    
    	public static function getJISEncoding() : String {
            return "shift_jis";
    	}
    	
    	public static function getPatternPosition(typeNumber : int) : Array {
    		return PATTERN_POSITION_TABLE[typeNumber - 1];
    	}

    	private static var PATTERN_POSITION_TABLE : Array =[
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
    	];
        
        private static var MAX_LENGTH : Array = [
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
        ];    	
    
        public static function getMaxLength(typeNumber : int, mode : int, errorCorrectLevel : int) : int {
    
            var t : int = typeNumber - 1;
            var e : int = 0;
            var m : int = 0;
    
            switch(errorCorrectLevel) {
            case ErrorCorrectLevel.L : e = 0; break;
            case ErrorCorrectLevel.M : e = 1; break;
            case ErrorCorrectLevel.Q : e = 2; break;
            case ErrorCorrectLevel.H : e = 3; break;
            default :
                throw new Error("e:" + errorCorrectLevel);
            }
    
            switch(mode) {
            case Mode.MODE_NUMBER    : m = 0; break;
            case Mode.MODE_ALPHA_NUM : m = 1; break;
            case Mode.MODE_8BIT_BYTE : m = 2; break;
            case Mode.MODE_KANJI     : m = 3; break;
            default :
                throw new Error("m:" + mode);
            }
    
            return MAX_LENGTH[t][e][m];
        }
    
    
    	/**
    	 * エラー訂正多項式を取得する。
    	 */
    	public static function getErrorCorrectPolynomial(errorCorrectLength : int) : Polynomial{
    			
    		var a : Polynomial = new Polynomial([1]);
    
    		for (var i : int = 0; i < errorCorrectLength; i++) {
    			a = a.multiply(new Polynomial([1, QRMath.gexp(i)]) );
    		}
    
    		return a;
    	}
    		
    	/**
    	 * 指定されたパターンのマスクを取得する。
    	 */
    	public static function getMask(maskPattern : int, i : int, j : int) : Boolean {
    		
    		switch (maskPattern) {
    			
    		case MaskPattern.PATTERN000 : return (i + j) % 2 == 0;
    		case MaskPattern.PATTERN001 : return i % 2 == 0;
    		case MaskPattern.PATTERN010 : return j % 3 == 0;
    		case MaskPattern.PATTERN011 : return (i + j) % 3 == 0;
    		case MaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
    		case MaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
    		case MaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
    		case MaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;
    
    		default :
    			throw new Error("mask:" + maskPattern);
    		}
    	}	
    
    	/**
    	 * 失点を取得する
    	 */
    	public static function getLostPoint(qrCode : QRCode) : int {
    		
    		var moduleCount : int = qrCode.getModuleCount();
    		
    		var lostPoint : int = 0;
    		
            var row : int;
            var col : int;
            
    		// LEVEL1
    		
    		for (row = 0; row < moduleCount; row++) {
    
    			for (col = 0; col < moduleCount; col++) {
    
    				var sameCount : int = 0;
    				var dark : Boolean = qrCode.isDark(row, col);
    				
    				for (var r : int = -1; r <= 1; r++) {
    
    					if (row + r < 0 || moduleCount <= row + r) {
    						continue;
    					}
    
    					for (var c : int = -1; c <= 1; c++) {
    
    						if (col + c < 0 || moduleCount <= col + c) {
    							continue;
    						}
    
    						if (r == 0 && c == 0) {
    							continue;
    						}
    
    						if (dark == qrCode.isDark(row + r, col + c) ) {
    							sameCount++;
    						}
    					}
    				}
    
    				if (sameCount > 5) {
    					lostPoint += (3 + sameCount - 5);
    				}
    			}
    		}
    
    		// LEVEL2
    
    		for (row = 0; row < moduleCount - 1; row++) {
    			for (col = 0; col < moduleCount - 1; col++) {
    				var count : int = 0;
    				if (qrCode.isDark(row,     col    ) ) count++;
    				if (qrCode.isDark(row + 1, col    ) ) count++;
    				if (qrCode.isDark(row,     col + 1) ) count++;
    				if (qrCode.isDark(row + 1, col + 1) ) count++;
    				if (count == 0 || count == 4) {
    					lostPoint += 3;
    				}
    			}
    		}
    
    		// LEVEL3
    
    		for (row = 0; row < moduleCount; row++) {
    			for (col = 0; col < moduleCount - 6; col++) {
    				if (qrCode.isDark(row, col)
    						&& !qrCode.isDark(row, col + 1)
    						&&  qrCode.isDark(row, col + 2)
    						&&  qrCode.isDark(row, col + 3)
    						&&  qrCode.isDark(row, col + 4)
    						&& !qrCode.isDark(row, col + 5)
    						&&  qrCode.isDark(row, col + 6) ) {
    					lostPoint += 40;
    				}
    			}
    		}
    
    		for (col = 0; col < moduleCount; col++) {
    			for (row = 0; row < moduleCount - 6; row++) {
    				if (qrCode.isDark(row, col)
    						&& !qrCode.isDark(row + 1, col)
    						&&  qrCode.isDark(row + 2, col)
    						&&  qrCode.isDark(row + 3, col)
    						&&  qrCode.isDark(row + 4, col)
    						&& !qrCode.isDark(row + 5, col)
    						&&  qrCode.isDark(row + 6, col) ) {
    					lostPoint += 40;
    				}
    			}
    		}
    
    		// LEVEL4
    		
    		var darkCount : int = 0;
    
    		for (col = 0; col < moduleCount; col++) {
    			for (row = 0; row < moduleCount; row++) {
    				if (qrCode.isDark(row, col) ) {
    					darkCount++;
    				}
    			}
    		}
    		
    		var ratio : int = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    		lostPoint += ratio * 10;
    		
    		return lostPoint;		
    	}
    
    	public static function getMode(s : String) : int {
    		if (isAlphaNum(s) ) {
    			if (isNumber(s) ) {
    				return Mode.MODE_NUMBER;
    			}
    			return Mode.MODE_ALPHA_NUM;
    		} else if (isKanji(s) ) {
    			return Mode.MODE_KANJI;
    		} else {
    			return Mode.MODE_8BIT_BYTE;
    		}
    	}
            		
    	private static function isNumber(s : String) : Boolean {
    		for (var i : int = 0; i < s.length; i++) {
    			var c : String = s.charAt(i);
    			if (!('0' <= c && c <= '9') ) {
    				return false;
    			}
    		}
    		return true;
    	}
    
    	private static function isAlphaNum(s : String) : Boolean {
    		for (var i : int = 0; i < s.length; i++) {
    			var c : String = s.charAt(i);
    			if (!('0' <= c && c <= '9') && !('A' <= c && c <= 'Z') && " $%*+-./:".indexOf(c) == -1) {
    				return false;
    			}
    		}
    		return true;
    	}
    
    	private static function isKanji(s : String) : Boolean {

			var data : ByteArray = StringUtil.getBytes(s, QRUtil.getJISEncoding() );

			var i : int = 0;

			while (i + 1 < data.length) {
				
				var c : int = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

				if (!(0x8140 <= c && c <= 0x9FFC) && !(0xE040 <= c && c <= 0xEBBF) ) {
					return false;
				}
				
				i += 2;
			}

			if (i < data.length) {
				return false;
			}
			
			return true;
       	}
    	
    	private static const G15 : int = (1 << 10) | (1 << 8) | (1 << 5)
    		| (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    
    	private static const G18 : int = (1 << 12) | (1 << 11) | (1 << 10)
    		| (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    
    	private static const G15_MASK : int = (1 << 14) | (1 << 12) | (1 << 10)
    		| (1 << 4) | (1 << 1);
    
    	public static function getBCHTypeInfo(data : int) : int {
    		var d  : int = data << 10;
    		while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
    			d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) ); 	
    		}
    		return ( (data << 10) | d) ^ G15_MASK;
    	}
    
    	public static function getBCHTypeNumber(data : int) : int {
    		var d  : int = data << 12;
    		while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
    			d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) ); 	
    		}
    		return (data << 12) | d;
    	}
    	
    	private static function getBCHDigit(data : int) : int {
    
    		var digit : int = 0;
    
    		while (data != 0) {
    			digit++;
    			data >>>= 1;
    		}
    
    		return digit;
    
    	}
    }
}