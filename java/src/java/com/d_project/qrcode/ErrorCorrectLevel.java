package com.d_project.qrcode;

/**
 * 誤り訂正レベル.
 * @author Kazuhiko Arase 
 */
public interface ErrorCorrectLevel {

	/**
	 * 復元能力 7%.
	 */
	int L = 1;
	
	/**
	 * 復元能力 15%.
	 */
	int M = 0;

	/**
	 * 復元能力 25%.
	 */
	int Q = 3;

	/**
	 * 復元能力 30%.
	 */
	int H = 2;
	
}

