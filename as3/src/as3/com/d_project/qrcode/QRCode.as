package com.d_project.qrcode {
    
    /**
     * QRコード.
     * <br/>
     * ■使い方
     * <ul>
     * <li>誤り訂正レベル、データ等、諸パラメータを設定します。</li>
     * <li>make() を呼び出してQRコードを作成します。</li>
     * <li>getModuleCount() と isDark() で、QRコードのデータを取得します。</li>
     * </ul>
     * @author Kazuhiko Arase 
     */
    public class QRCode {
    
    	private static const PAD0 : int = 0xEC;
    
    	private static const PAD1 : int = 0x11;
    
    	private var typeNumber : int;
    
    	private var modules : Array;
    
    	private var moduleCount : int;
    
    	private var errorCorrectLevel : int;
    
    	private var qrDataList : Array;
    
    	/**
         * コンストラクタ
         * <br>型番1, 誤り訂正レベルH のQRコードのインスタンスを生成します。
         * @see ErrorCorrectLevel
         */
    	public function QRCode() {
     		this.typeNumber = 1;
    		this.errorCorrectLevel = ErrorCorrectLevel.H;
    		this.qrDataList = new Array();
    	}
    
        /**
         * 型番を取得する。
         * @return 型番
         */
    	public function getTypeNumber() : int {
    		return typeNumber;
    	}
    	
        /**
         * 型番を設定する。
         * @param typeNumber 型番
         */
    	public function setTypeNumber(typeNumber : int) : void {
    		this.typeNumber = typeNumber;
    	}
    
        /**
         * 誤り訂正レベルを取得する。
         * @return 誤り訂正レベル
         * @see ErrorCorrectLevel
         */
        public function getErrorCorrectLevel() : int {
            return errorCorrectLevel;
        }
    
        /**
         * 誤り訂正レベルを設定する。
         * @param errorCorrectLevel 誤り訂正レベル
         * @see ErrorCorrectLevel
         */
        public function setErrorCorrectLevel(errorCorrectLevel : int) : void {
            this.errorCorrectLevel = errorCorrectLevel;
        }

        /**
         * モードを指定してデータを追加する。
         * @param data データ
         * @param mode モード
         * @see Mode
         */
    	public function addData(data : String, mode : int = 0) : void {

            if (mode == Mode.MODE_AUTO) {
                mode = QRUtil.getMode(data);
            }

    		switch(mode) {
    
    		case Mode.MODE_NUMBER :
    			addQRData(new QRNumber(data) );
    			break;
    
    		case Mode.MODE_ALPHA_NUM :
    			addQRData(new QRAlphaNum(data) );
    			break;
    
    		case Mode.MODE_8BIT_BYTE :
    			addQRData(new QR8BitByte(data) );
    			break;
    
    		case Mode.MODE_KANJI :
    			addQRData(new QRKanji(data) );
    			break;
    
    		default :
    			throw new Error("mode:" + mode);
    		}
    	}
    
        /**
         * データをクリアする。
         * <br/>addData で追加されたデータをクリアします。
         */
    	public function clearData() : void {
    		qrDataList = new Array();
    	}
    	
    	private function addQRData(qrData : QRData) : void {
    		qrDataList.push(qrData);
    	}
    
    	private function getQRDataCount() : int {
    		return qrDataList.length;
    	}
    	
    	private function getQRData(index : int) : QRData {
    		return qrDataList[index];
    	}
    
    	/**
    	 * 暗モジュールかどうかを取得する。
         * @param row 行 (0 ～ モジュール数 - 1)
         * @param col 列 (0 ～ モジュール数 - 1)
    	 */	
    	public function isDark(row : int, col : int) : Boolean {
    		if (modules[row][col] != null) {
    			return modules[row][col];
    		} else {
    			return false;
    		}
    	}
    
    	/**
    	 * モジュール数を取得する。
    	 */	
    	public function getModuleCount() : int {
    		return moduleCount;
    	}
    
    	/**
    	 * QRコードを作成する。
    	 */
    	public function make() : void {
    		makeImpl(false, getBestMaskPattern() );
    	}
    
    	private function getBestMaskPattern() : int {
    
    		var minLostPoint : int = 0;
    		var pattern : int = 0;
    
    		for (var i : int = 0; i < 8; i++) {
    
    			makeImpl(true, i);
    
    			var lostPoint : int = QRUtil.getLostPoint(this);
    
    			if (i == 0 || minLostPoint >  lostPoint) {
    				minLostPoint = lostPoint;
    				pattern = i;
    			}
    		}
    
    		return pattern;
    	}
    	
    	/**
    	 * 
    	 */
    	private function makeImpl(test : Boolean, maskPattern : int) : void {
    
    		// モジュール初期化
    		moduleCount = typeNumber * 4 + 17;
    		modules = new Array(moduleCount);
    		for (var i : int = 0; i < moduleCount; i++) {
    		    modules[i] = new Array(moduleCount);
    		}
    
    		// 位置検出パターン及び分離パターンを設定 
    		setupPositionProbePattern(0, 0);
    		setupPositionProbePattern(moduleCount - 7, 0);
    		setupPositionProbePattern(0, moduleCount - 7);
    		
    		setupPositionAdjustPattern();
    		setupTimingPattern();
    
    		setupTypeInfo(test, maskPattern);
    
    		if (typeNumber >= 7) {
    			setupTypeNumber(test);
    		}
    		
    		var dataArray : Array = qrDataList;
    		var data : Array = createData(typeNumber, errorCorrectLevel, dataArray);
    		
    		mapData(data, maskPattern);
    	}
    	
    	private function mapData(data : Array, maskPattern : int) : void {
    		
    		var inc : int = -1;
    		var row : int = moduleCount - 1;
    		var bitIndex : int = 7;
    		var byteIndex : int = 0;
    		
    		for (var col : int = moduleCount - 1; col > 0; col -= 2) {
    
    			if (col == 6) col--;
    
    			while (true) {
    				
    				for (var c : int = 0; c < 2; c++) {
    					
    					if (modules[row][col - c] == null) {
    						
    						var dark : Boolean = false;
    
    						if (byteIndex < data.length) {
    							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
    						}
    
    						var mask  : Boolean = QRUtil.getMask(maskPattern, row, col - c);
    
    						if (mask) {
    							dark = !dark;
    						}
    						
    						modules[row][col - c] = (dark);
    						bitIndex--;
    
    						if (bitIndex == -1) {
    							byteIndex++;
    							bitIndex = 7;
    						}
    					}
    				}
    								
    				row += inc;
    
    				if (row < 0 || moduleCount <= row) {
    					row -= inc;
    					inc = -inc;
    					break;
    				}
    			}
    		}
    		
    	}
    	
    	/**
    	 * 位置合わせパターンを設定 
    	 */
    	private function setupPositionAdjustPattern() : void {
    
    		var pos : Array = QRUtil.getPatternPosition(typeNumber);
    
    		for (var i : int = 0; i < pos.length; i++) {
    
    			for (var j : int = 0; j < pos.length; j++) {
    
    				var row : int = pos[i];
    				var col : int = pos[j];
    				
    				if (modules[row][col] != null) {
    					continue;
    				}
    				
    				for (var r : int = -2; r <= 2; r++) {
    
    					for (var c : int = -2; c <= 2; c++) {
    
    						if (r == -2 || r == 2 || c == -2 || c == 2 
    								|| (r == 0 && c == 0) ) {
    							modules[row + r][col + c] = (true);
    						} else {
    							modules[row + r][col + c] = (false);
    						}
    					}
    				}
    
    			}
    		}
    	}
    	
    	/**
    	 * 位置検出パターンを設定 
    	 */
    	private function setupPositionProbePattern(row : int, col : int) : void {
    
    		for (var r : int = -1; r <= 7; r++) {
    
    			for (var c : int = -1; c <= 7; c++) {
    
    				if (row + r <= -1 || moduleCount <= row + r 
    						|| col + c <= -1 || moduleCount <= col + c) {
    					continue;
    				}
    					
    				if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
    						|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
    						|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
    					modules[row + r][col + c] = (true);
    				} else {
    					modules[row + r][col + c] = (false);
    				}
    			}		
    		}		
    	}

    	/**
    	 * タイミングパターンを設定 
    	 */
    	private function setupTimingPattern() : void {
    		for (var r : int = 8; r < moduleCount - 8; r++) {
    			if (modules[r][6] != null) {
    				continue;
    			}
    			modules[r][6] = (r % 2 == 0);
    		}
    		for (var c : int = 8; c < moduleCount - 8; c++) {
    			if (modules[6][c] != null) {
    				continue;
    			}
    			modules[6][c] = (c % 2 == 0);
    		}
    	}
    	
    	/**
    	 * 型番を設定 
    	 */
    	private function setupTypeNumber(test : Boolean) : void {
    
    		var bits : int = QRUtil.getBCHTypeNumber(typeNumber);
            var i : int;
            var mod : Boolean;
            
    		for (i = 0; i < 18; i++) {
    			mod = (!test && ( (bits >> i) & 1) == 1);
    			modules[Math.floor(i / 3)][i % 3 + moduleCount - 8 - 3] = mod;
    		}
    
    		for (i = 0; i < 18; i++) {
    			mod = (!test && ( (bits >> i) & 1) == 1);
    			modules[i % 3 + moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    		}
    	}
    	
    	/**
    	 * 形式情報を設定 
    	 */
    	private function setupTypeInfo(test : Boolean, maskPattern : int) : void {
    
    		var data : int = (errorCorrectLevel << 3) | maskPattern;
    		var bits : int = QRUtil.getBCHTypeInfo(data);
            var i : int;
            var mod : Boolean;
            
    		// 縦方向		
    		for (i = 0; i < 15; i++) {
    
    			mod = (!test && ( (bits >> i) & 1) == 1);
    
    			if (i < 6) {
    				modules[i][8] = mod;
    			} else if (i < 8) {
    				modules[i + 1][8] = mod;
    			} else {
    				modules[moduleCount - 15 + i][8] = mod;
    			}
    		}
    
    		// 横方向
    		for (i = 0; i < 15; i++) {
    
    			mod = (!test && ( (bits >> i) & 1) == 1);
    			
    			if (i < 8) {
    				modules[8][moduleCount - i - 1] = mod;
    			} else if (i < 9) {
    				modules[8][15 - i - 1 + 1] = mod;
    			} else {
    				modules[8][15 - i - 1] = mod;
    			}
    		}
    
    		// 固定
    		modules[moduleCount - 8][8] = (!test);
    
    	}
    	
    	private static function createData(typeNumber : int, errorCorrectLevel : int, dataArray : Array) : Array {
    		
    		var rsBlocks : Array = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    		var buffer : BitBuffer = new BitBuffer();
    		var i : int;
    		
    		for (i = 0; i < dataArray.length; i++) {
    			var data : QRData = dataArray[i];
    			buffer.put(data.getMode(), 4);
    			buffer.put(data.getLength(), data.getLengthInBits(typeNumber) );
    			data.write(buffer);
    		}
    		
    		// 最大データ数を計算
    		var totalDataCount : int = 0;
    		for (i = 0; i < rsBlocks.length; i++) {
    			totalDataCount += rsBlocks[i].getDataCount();
    		}
    
    		if (buffer.getLengthInBits() > totalDataCount * 8) {
    			throw new Error("code length overflow. ("
    				+ buffer.getLengthInBits()
    				+ ">"
    				+  totalDataCount * 8
    				+ ")");
    		}
    
    		// 終端コード
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
    			buffer.put(PAD0, 8);
    			
    			if (buffer.getLengthInBits() >= totalDataCount * 8) {
    				break;
    			}
    			buffer.put(PAD1, 8);
    		}
    
    		return createBytes(buffer, rsBlocks);
    	}
    	
    	private static function createBytes(buffer : BitBuffer, rsBlocks : Array) : Array {
    
    		var offset : int = 0;
    		
    		var maxDcCount : int = 0;
    		var maxEcCount : int = 0;
    		
    		var dcdata : Array = new Array(rsBlocks.length);
    		var ecdata : Array = new Array(rsBlocks.length);
    		
    		var i : int;
    		var r : int;
    		
    		for (r = 0; r < rsBlocks.length; r++) {
    
    			var dcCount : int = rsBlocks[r].getDataCount();
    			var ecCount : int = rsBlocks[r].getTotalCount() - dcCount;
    
    			maxDcCount = Math.max(maxDcCount, dcCount);
    			maxEcCount = Math.max(maxEcCount, ecCount);
    			
    			dcdata[r] = new Array(dcCount);
    			for (i = 0; i < dcdata[r].length; i++) {
    				dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
    			}
    			offset += dcCount;
    			
    		    var rsPoly : Polynomial = QRUtil.getErrorCorrectPolynomial(ecCount);
    			var rawPoly : Polynomial = new Polynomial(dcdata[r], rsPoly.getLength() - 1);
    
    			var modPoly : Polynomial = rawPoly.mod(rsPoly);
    			ecdata[r] = new Array(rsPoly.getLength() - 1);
    			for (i = 0; i < ecdata[r].length; i++) {
    				var modIndex : int = i + modPoly.getLength() - ecdata[r].length;
    				ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
    			}
    
    		}
    		
    		var totalCodeCount : int = 0;
    		for (i = 0; i < rsBlocks.length; i++) {
    			totalCodeCount += rsBlocks[i].getTotalCount();
    		}
    
    		var data : Array = new Array(totalCodeCount);
    
    		var index : int = 0;
    
    		for (i = 0; i < maxDcCount; i++) {
    			for (r = 0; r < rsBlocks.length; r++) {
    				if (i < dcdata[r].length) {
    					data[index++] = dcdata[r][i];
    				}
    			}
    		}
    
    		for (i = 0; i < maxEcCount; i++) {
    			for (r = 0; r < rsBlocks.length; r++) {
    				if (i < ecdata[r].length) {
    					data[index++] = ecdata[r][i];
    				}
    			}
    		}
    
    		return data;
    
    	}
    
        /**
         * 最小の型番となる QRCode を作成する。
         * @param data データ
         * @param errorCorrectLevel 誤り訂正レベル
         */
        public static function getMinimumQRCode(data : String, errorCorrectLevel : int) : QRCode {
    		
            var mode : int = QRUtil.getMode(data);
    
            var qr  : QRCode = new QRCode();
            qr.setErrorCorrectLevel(errorCorrectLevel);
            qr.addData(data, mode);
    
            var length : int = qr.getQRData(0).getLength();
    
    		for (var typeNumber : int = 1; typeNumber <= 10; typeNumber++) {
                if (length <= QRUtil.getMaxLength(typeNumber, mode, errorCorrectLevel) ) {
                    qr.setTypeNumber(typeNumber);
                    break;
                }
    		}
    
            qr.make();
    
            return qr;
        }
    }
}