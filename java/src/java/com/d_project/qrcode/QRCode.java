package com.d_project.qrcode;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * QRコード.
 * <br/>■使い方
 * <br/>(1) 誤り訂正レベル、データ等、諸パラメータを設定します。
 * <br/>(2) make() を呼び出してQRコードを作成します。
 * <br/>(3) getModuleCount() と isDark() で、QRコードのデータを取得します。
 * <br/>
 * @author Kazuhiko Arase 
 */
public class QRCode {

	private static final int PAD0 = 0xEC;

	private static final int PAD1 = 0x11;

	private int typeNumber;

	private Boolean[][] modules;

	private int moduleCount;

	private int errorCorrectLevel;

	private List<QRData> qrDataList;

	/**
     * コンストラクタ
     * <br>型番1, 誤り訂正レベルH のQRコードのインスタンスを生成します。
     * @see ErrorCorrectLevel
     */
	public QRCode() {
 		this.typeNumber = 1;
		this.errorCorrectLevel = ErrorCorrectLevel.H;
		this.qrDataList = new ArrayList<QRData>(1);
	}

    /**
     * 型番を取得する。
     * @return 型番
     */
	public int getTypeNumber() {
		return typeNumber;
	}
	
    /**
     * 型番を設定する。
     * @param typeNumber 型番
     */
	public void setTypeNumber(int typeNumber) {
		this.typeNumber = typeNumber;
	}

    /**
     * 誤り訂正レベルを取得する。
     * @return 誤り訂正レベル
     * @see ErrorCorrectLevel
     */
    public int getErrorCorrectLevel() {
        return errorCorrectLevel;
    }

    /**
     * 誤り訂正レベルを設定する。
     * @param errorCorrectLevel 誤り訂正レベル
     * @see ErrorCorrectLevel
     */
    public void setErrorCorrectLevel(int errorCorrectLevel) {
        this.errorCorrectLevel = errorCorrectLevel;
    }
	
    /**
     * データを追加する。
     * @param data データ
     */
	public void addData(String data) {
		addData(data, QRUtil.getMode(data) );
	}
	
    /**
     * モードを指定してデータを追加する。
     * @param data データ
     * @param mode モード
     * @see Mode
     */
	public void addData(String data, int mode) {

		switch(mode) {

		case Mode.MODE_NUMBER :
			addData(new QRNumber(data) );
			break;

		case Mode.MODE_ALPHA_NUM :
			addData(new QRAlphaNum(data) );
			break;

		case Mode.MODE_8BIT_BYTE :
			addData(new QR8BitByte(data) );
			break;

		case Mode.MODE_KANJI :
			addData(new QRKanji(data) );
			break;

		default :
			throw new IllegalArgumentException("mode:" + mode);
		}
	}

    /**
     * データをクリアする。
     * <br/>addData で追加されたデータをクリアします。
     */
	public void clearData() {
		qrDataList.clear();
	}
	
	protected void addData(QRData qrData) {
		qrDataList.add(qrData);
	}

	protected int getDataCount() {
		return qrDataList.size();
	}

	protected QRData getData(int index) {
		return qrDataList.get(index);
	}

	/**
	 * 暗モジュールかどうかを取得する。
     * @param row 行 (0 ～ モジュール数 - 1)
     * @param col 列 (0 ～ モジュール数 - 1)
	 */	
	public boolean isDark(int row, int col) {
		if (modules[row][col] != null) {
			return modules[row][col].booleanValue();
		} else {
			return false;
		}
	}

	/**
	 * モジュール数を取得する。
	 */	
	public int getModuleCount() {
		return moduleCount;
	}

	/**
	 * QRコードを作成する。
	 */
	public void make() {
		make(false, getBestMaskPattern() );
	}

	private int getBestMaskPattern() {

		int minLostPoint = 0;
		int pattern = 0;

		for (int i = 0; i < 8; i++) {

			make(true, i);

			int lostPoint = QRUtil.getLostPoint(this);

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
	private void make(boolean test, int maskPattern) {

		// モジュール初期化
		moduleCount = typeNumber * 4 + 17;
		modules = new Boolean[moduleCount][moduleCount];

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
		
		QRData[] dataArray = qrDataList.toArray(new QRData[qrDataList.size()]);

		byte[] data = createData(typeNumber, errorCorrectLevel, dataArray);
		
		mapData(data, maskPattern);
	}
	
	private void mapData(byte[] data, int maskPattern) {
		
		int inc = -1;
		int row = moduleCount - 1;
		int bitIndex = 7;
		int byteIndex = 0;
		
		for (int col = moduleCount - 1; col > 0; col -= 2) {

			if (col == 6) col--;

			while (true) {
				
				for (int c = 0; c < 2; c++) {
					
					if (modules[row][col - c] == null) {
						
						boolean dark = false;

						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
						}

						boolean mask = QRUtil.getMask(maskPattern, row, col - c);

						if (mask) {
							dark = !dark;
						}
						
						modules[row][col - c] = Boolean.valueOf(dark);
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
	private void setupPositionAdjustPattern() {

		int[] pos = QRUtil.getPatternPosition(typeNumber);

		for (int i = 0; i < pos.length; i++) {

			for (int j = 0; j < pos.length; j++) {

				int row = pos[i];
				int col = pos[j];
				
				if (modules[row][col] != null) {
					continue;
				}
				
				for (int r = -2; r <= 2; r++) {

					for (int c = -2; c <= 2; c++) {

						if (r == -2 || r == 2 || c == -2 || c == 2 
								|| (r == 0 && c == 0) ) {
							modules[row + r][col + c] = Boolean.valueOf(true);
						} else {
							modules[row + r][col + c] = Boolean.valueOf(false);
						}
					}
				}

			}
		}
	}
	
	/**
	 * 位置検出パターンを設定 
	 */
	private void setupPositionProbePattern(int row, int col) {

		for (int r = -1; r <= 7; r++) {

			for (int c = -1; c <= 7; c++) {

				if (row + r <= -1 || moduleCount <= row + r 
						|| col + c <= -1 || moduleCount <= col + c) {
					continue;
				}
					
				if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
						|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
						|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					modules[row + r][col + c] = Boolean.valueOf(true);
				} else {
					modules[row + r][col + c] = Boolean.valueOf(false);
				}
			}		
		}		
	}
	

	/**
	 * タイミングパターンを設定 
	 */
	private void setupTimingPattern() {
		for (int r = 8; r < moduleCount - 8; r++) {
			if (modules[r][6] != null) {
				continue;
			}
			modules[r][6] = Boolean.valueOf(r % 2 == 0);
		}
		for (int c = 8; c < moduleCount - 8; c++) {
			if (modules[6][c] != null) {
				continue;
			}
			modules[6][c] = Boolean.valueOf(c % 2 == 0);
		}
	}
	
	/**
	 * 型番を設定 
	 */
	private void setupTypeNumber(boolean test) {

		int bits = QRUtil.getBCHTypeNumber(typeNumber);

		for (int i = 0; i < 18; i++) {
			Boolean mod = Boolean.valueOf(!test && ( (bits >> i) & 1) == 1);
			modules[i / 3][i % 3 + moduleCount - 8 - 3] = mod;
		}

		for (int i = 0; i < 18; i++) {
			Boolean mod = Boolean.valueOf(!test && ( (bits >> i) & 1) == 1);
			modules[i % 3 + moduleCount - 8 - 3][i / 3] = mod;
		}
	}
	
	/**
	 * 形式情報を設定 
	 */
	private void setupTypeInfo(boolean test, int maskPattern) {

		int data = (errorCorrectLevel << 3) | maskPattern;
		int bits = QRUtil.getBCHTypeInfo(data);

		// 縦方向		
		for (int i = 0; i < 15; i++) {

			Boolean mod = Boolean.valueOf(!test && ( (bits >> i) & 1) == 1);

			if (i < 6) {
				modules[i][8] = mod;
			} else if (i < 8) {
				modules[i + 1][8] = mod;
			} else {
				modules[moduleCount - 15 + i][8] = mod;
			}
		}

		// 横方向
		for (int i = 0; i < 15; i++) {

			Boolean mod = Boolean.valueOf(!test && ( (bits >> i) & 1) == 1);
			
			if (i < 8) {
				modules[8][moduleCount - i - 1] = mod;
			} else if (i < 9) {
				modules[8][15 - i - 1 + 1] = mod;
			} else {
				modules[8][15 - i - 1] = mod;
			}
		}

		// 固定
		modules[moduleCount - 8][8] = Boolean.valueOf(!test);

	}
	
	public static byte[] createData(int typeNumber, int errorCorrectLevel, QRData[] dataArray) {
		
		RSBlock[] rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
		
		BitBuffer buffer = new BitBuffer();
		
		for (int i = 0; i < dataArray.length; i++) {
			QRData data = dataArray[i];
			buffer.put(data.getMode(), 4);
			buffer.put(data.getLength(), data.getLengthInBits(typeNumber) );
			data.write(buffer);
		}
		
		// 最大データ数を計算
		int totalDataCount = 0;
		for (int i = 0; i < rsBlocks.length; i++) {
			totalDataCount += rsBlocks[i].getDataCount();
		}

		if (buffer.getLengthInBits() > totalDataCount * 8) {
			throw new IllegalArgumentException("code length overflow. ("
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
			buffer.put(false);
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
	
	private static byte[] createBytes(BitBuffer buffer, RSBlock[] rsBlocks) {

		int offset = 0;
		
		int maxDcCount = 0;
		int maxEcCount = 0;
		
		int[][] dcdata = new int[rsBlocks.length][];
		int[][] ecdata = new int[rsBlocks.length][];
		
		for (int r = 0; r < rsBlocks.length; r++) {

			int dcCount = rsBlocks[r].getDataCount();
			int ecCount = rsBlocks[r].getTotalCount() - dcCount;

			maxDcCount = Math.max(maxDcCount, dcCount);
			maxEcCount = Math.max(maxEcCount, ecCount);
			
			dcdata[r] = new int[dcCount];
			for (int i = 0; i < dcdata[r].length; i++) {
				dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
			}
			offset += dcCount;
			
		    Polynomial rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
			Polynomial rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);

			Polynomial modPoly = rawPoly.mod(rsPoly);
			ecdata[r] = new int[rsPoly.getLength() - 1];
			for (int i = 0; i < ecdata[r].length; i++) {
				int modIndex = i + modPoly.getLength() - ecdata[r].length;
				ecdata[r][i] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
			}

		}
		
		int totalCodeCount = 0;
		for (int i = 0; i < rsBlocks.length; i++) {
			totalCodeCount += rsBlocks[i].getTotalCount();
		}

		byte[] data = new byte[totalCodeCount];

		int index = 0;

		for (int i = 0; i < maxDcCount; i++) {
			for (int r = 0; r < rsBlocks.length; r++) {
				if (i < dcdata[r].length) {
					data[index++] = (byte)dcdata[r][i];
				}
			}
		}

		for (int i = 0; i < maxEcCount; i++) {
			for (int r = 0; r < rsBlocks.length; r++) {
				if (i < ecdata[r].length) {
					data[index++] = (byte)ecdata[r][i];
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
    public static QRCode getMinimumQRCode(String data, int errorCorrectLevel) {
		
        int mode = QRUtil.getMode(data);

        QRCode qr = new QRCode();
        qr.setErrorCorrectLevel(errorCorrectLevel);
        qr.addData(data, mode);

        int length = qr.getData(0).getLength();

		for (int typeNumber = 1; typeNumber <= 10; typeNumber++) {
            if (length <= QRUtil.getMaxLength(typeNumber, mode, errorCorrectLevel) ) {
                qr.setTypeNumber(typeNumber);
                break;
            }
		}

        qr.make();

        return qr;
    }

    /**
     * イメージを取得する。
     * @param cellSize セルのサイズ(pixel)
     * @param margin 余白(pixel)
     */
    public BufferedImage createImage(int cellSize, int margin) throws IOException {
        
        int imageSize = getModuleCount() * cellSize + margin * 2;

        BufferedImage image = new BufferedImage(imageSize, imageSize, BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < imageSize; y++) {

            for (int x = 0; x < imageSize; x++) {

                if (margin <= x && x < imageSize - margin
                        && margin <= y && y < imageSize - margin) {
                            
                    int col = (x - margin) / cellSize;
                    int row = (y - margin) / cellSize;
    
                    if (isDark(row, col) ) {
                        image.setRGB(x, y, 0x000000);
                    } else {
                        image.setRGB(x, y, 0xffffff);
                    }

                } else {
                    image.setRGB(x, y, 0xffffff);
                }
            }
        }

        return image;
    }   

}
