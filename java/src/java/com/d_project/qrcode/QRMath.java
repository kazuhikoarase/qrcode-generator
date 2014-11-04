package com.d_project.qrcode;

/**
 * QRMath
 * @author Kazuhiko Arase 
 */
class QRMath {

	private QRMath() {
	}

	private static final int[] EXP_TABLE;
	private static final int[] LOG_TABLE;

	static {		

		EXP_TABLE = new int[256];
		
		for (int i = 0; i < 8; i++) {
			EXP_TABLE[i] = 1 << i;
		}

		for (int i = 8; i < 256; i++) {
			EXP_TABLE[i] = EXP_TABLE[i - 4]
				^ EXP_TABLE[i - 5]
				^ EXP_TABLE[i - 6]
				^ EXP_TABLE[i - 8];
		}
		
		LOG_TABLE = new int[256];
		for (int i = 0; i < 255; i++) {
			LOG_TABLE[EXP_TABLE[i] ] = i;
		}
	}

	public static int glog(int n) {

		if (n < 1) {
			throw new ArithmeticException("log(" + n + ")");
		}
		
		return LOG_TABLE[n];
	}
	
	public static int gexp(int n) {

		while (n < 0) {
			n += 255;
		}

		while (n >= 256) {
			n -= 255;
		}

		return EXP_TABLE[n];
	}
	
	
}
