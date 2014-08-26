package com.d_project.qrcode;

/**
 * モード.
 * @author Kazuhiko Arase 
 */
public interface Mode {

	/**
	 * 数値モード
	 */
	int MODE_NUMBER = 1 << 0;

	/**
	 * 英数字モード
	 */
	int MODE_ALPHA_NUM = 1 << 1;

	/**
	 * 8ビットバイトモード
	 */
	int MODE_8BIT_BYTE = 1 << 2;

	/**
	 * 漢字モード
	 */
	int MODE_KANJI = 1 << 3;

}
