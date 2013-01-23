package com.d_project.qrcode {

    /**
     * モード.
     * @author Kazuhiko Arase 
     */
    public class Mode {

    	/**
    	 * 自動モード
    	 */
    	public static const MODE_AUTO : int		= 0;
    
    	/**
    	 * 数値モード
    	 */
    	public static const MODE_NUMBER : int		= 1 << 0;
    
    	/**
    	 * 英数字モード
    	 */
    	public static const MODE_ALPHA_NUM : int	= 1 << 1;
    
    	/**
    	 * 8ビットバイトモード
    	 */
    	public static const MODE_8BIT_BYTE : int = 1 << 2;
    
    	/**
    	 * 漢字モード
    	 */
    	public static const MODE_KANJI : int		= 1 << 3;
    
    }
}