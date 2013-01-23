package com.d_project.qrcode;

/**
 * 誤り訂正レベル.
 * @author Kazuhiko Arase 
 */
public interface ErrorCorrectLevel {

	/**
	 * 復元能力 7%.
	 * <br>vodafoneで使用不可?
	 */
	public static final int L = 1;
	
	/**
	 * 復元能力 15%.
	 */
	public static final int M = 0;

	/**
	 * 復元能力 25%.
	 */
	public static final int Q = 3;

	/**
	 * 復元能力 30%.
	 */
	public static final int H = 2;
	
}

