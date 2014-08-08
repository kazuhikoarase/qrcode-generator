package com.d_project.qrcode {

    /**
     * 誤り訂正レベル.
     * @author Kazuhiko Arase 
     */
    public class ErrorCorrectLevel {
    
    	/**
    	 * 復元能力 7%.
    	 * <br>vodafoneで使用不可?
    	 */
    	public static const L : int = 1;
    	
    	/**
    	 * 復元能力 15%.
    	 */
    	public static const M : int = 0;
    
    	/**
    	 * 復元能力 25%.
    	 */
    	public static const Q : int = 3;
    
    	/**
    	 * 復元能力 30%.
    	 */
    	public static const H : int = 2;
    	
    }
}