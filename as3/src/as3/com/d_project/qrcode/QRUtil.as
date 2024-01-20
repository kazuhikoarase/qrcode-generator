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
            [[41, 25, 17, 10], [34, 20, 14, 8], [27, 16, 11, 7], [17, 10, 7, 4]],//1
                    [[77, 47, 32, 20], [63, 38, 26, 16], [48, 29, 20, 12], [34, 20, 14, 8]],//2
                    [[127, 77, 53, 32], [101, 61, 42, 26], [77, 47, 32, 20], [58, 35, 24, 15]],//3
                    [[187, 114, 78, 48], [149, 90, 62, 38], [111, 67, 46, 28], [82, 50, 34, 21]],//4
                    [[255, 154, 106, 65], [202, 122, 84, 52], [144, 87, 60, 37], [106, 64, 44, 27]],//5
                    [[322, 195, 134, 82], [255, 154, 106, 65], [178, 108, 74, 45], [139, 84, 58, 36]],//6
                    [[370, 224, 154, 95], [293, 178, 122, 75], [207, 125, 86, 53], [154, 93, 64, 39]],//7
                    [[461, 279, 192, 118], [365, 221, 152, 93], [259, 157, 108, 66], [202, 122, 84, 52]],//8
                    [[552, 335, 230, 141], [432, 262, 180, 111], [312, 189, 130, 80], [235, 143, 98, 60]],//9
                    [[652, 395, 271, 167], [513, 311, 213, 131], [364, 221, 151, 93], [288, 174, 119, 74]],//10
                    [[772, 468, 321, 198], [604, 366, 251, 155], [427, 259, 177, 109], [331, 200, 137, 85]],//11
                    [[883, 535, 367, 226], [691, 419, 287, 177], [489, 296, 203, 125], [374, 227, 155, 96]],//12
                    [[1022, 619, 425, 262], [796, 483, 331, 204], [580, 352, 241, 149], [427, 259, 177, 109]],//13
                    [[1101, 667, 458, 282], [871, 528, 362, 223], [621, 376, 258, 159], [468, 283, 194, 120]],//14
                    [[1250, 758, 520, 320], [991, 600, 412, 254], [703, 426, 292, 180], [530, 321, 220, 136]],//15
                    [[1408, 854, 586, 361], [1082, 656, 450, 277], [775, 470, 322, 198], [602, 365, 250, 154]],//16
                    [[1548, 938, 644, 397], [1212, 734, 504, 310], [876, 531, 364, 224], [674, 408, 280, 173]],//17
                    [[1725, 1046, 718, 442], [1346, 816, 560, 345], [948, 574, 394, 243], [746, 452, 310, 191]],//18
                    [[1903, 1153, 792, 488], [1500, 909, 624, 384], [1063, 644, 442, 272], [813, 493, 338, 208]],//19
                    [[2061, 1249, 858, 528], [1600, 970, 666, 410], [1159, 702, 482, 297], [919, 557, 382, 235]],//20
                    [[2232, 1352, 929, 572], [1708, 1035, 711, 438], [1224, 742, 509, 314], [969, 587, 403, 248]],//21
                    [[2409, 1460, 1003, 618], [1872, 1134, 779, 480], [1358, 823, 565, 348], [1056, 640, 439, 270]],//22
                    [[2620, 1588, 1091, 672], [2059, 1248, 857, 528], [1468, 890, 611, 376], [1108, 672, 461, 284]],//23
                    [[2812, 1704, 1171, 721], [2188, 1326, 911, 561], [1588, 963, 661, 407], [1228, 744, 511, 315]],//24
                    [[3057, 1853, 1273, 784], [2395, 1451, 997, 614], [1718, 1041, 715, 440], [1286, 779, 535, 330]],//25
                    [[3283, 1990, 1367, 842], [2544, 1542, 1059, 652], [1804, 1094, 751, 462], [1425, 864, 593, 365]],//26
                    [[3517, 2132, 1465, 902], [2701, 1637, 1125, 692], [1933, 1172, 805, 496], [1501, 910, 625, 385]],//27
                    [[3669, 2223, 1528, 940], [2857, 1732, 1190, 732], [2085, 1263, 868, 534], [1581, 958, 658, 405]],//28
                    [[3909, 2369, 1628, 1002], [3035, 1839, 1264, 778], [2181, 1322, 908, 559], [1677, 1016, 698, 430]],//29
                    [[4158, 2520, 1732, 1066], [3289, 1994, 1370, 843], [2358, 1429, 982, 604], [1782, 1080, 742, 457]],//30
                    [[4417, 2677, 1840, 1132], [3486, 2113, 1452, 894], [2473, 1499, 1030, 634], [1897, 1150, 790, 486]],//31
                    [[4686, 2840, 1952, 1201], [3693, 2238, 1538, 947], [2670, 1618, 1112, 684], [2022, 1226, 842, 518]],//32
                    [[4965, 3009, 2068, 1273], [3909, 2369, 1628, 1002], [2805, 1700, 1168, 719], [2157, 1307, 898, 553]],//33
                    [[5253, 3183, 2188, 1347], [4134, 2506, 1722, 1060], [2949, 1787, 1228, 756], [2301, 1394, 958, 590]],//34
                    [[5529, 3351, 2303, 1417], [4343, 2632, 1809, 1113], [3081, 1867, 1283, 790], [2361, 1431, 983, 605]],//35
                    [[5836, 3537, 2431, 1496], [4588, 2780, 1911, 1176], [3244, 1966, 1351, 832], [2524, 1530, 1051, 647]],//36
                    [[6153, 3729, 2563, 1577], [4775, 2894, 1989, 1224], [3417, 2071, 1423, 876], [2625, 1591, 1093, 673]],//37
                    [[6479, 3927, 2699, 1661], [5039, 3054, 2099, 1292], [3599, 2181, 1499, 923], [2735, 1658, 1139, 701]],//38
                    [[6743, 4087, 2809, 1729], [5313, 3220, 2213, 1362], [3791, 2298, 1579, 972], [2927, 1774, 1219, 750]],//39
                    [[7089, 4296, 2953, 1817], [5596, 3391, 2331, 1435], [3993, 2420, 1663, 1024], [3057, 1852, 1273, 784]],//40
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