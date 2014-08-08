package com.d_project.qrcode {
    
    /**
     * QRMath
     * @author Kazuhiko Arase 
     */
    internal class QRMath {
    
    	function QRMath() {
    	    throw new Error("");
    	}
    
    	private static var EXP_TABLE : Array;
    	private static var LOG_TABLE : Array;
    	
        private static var classInitialized : Boolean = initializeClass();
    
    	private static function initializeClass() : Boolean {
            
            var i : int;
            
    		EXP_TABLE = new Array(256);
    		
    		for (i = 0; i < 8; i++) {
    			EXP_TABLE[i] = 1 << i;
    		}
    
    		for (i = 8; i < 256; i++) {
    			EXP_TABLE[i] = EXP_TABLE[i - 4]
    				^ EXP_TABLE[i - 5]
    				^ EXP_TABLE[i - 6]
    				^ EXP_TABLE[i - 8];
    		}
    		
    		LOG_TABLE = new Array(256);
    		for (i = 0; i < 255; i++) {
    			LOG_TABLE[EXP_TABLE[i] ] = i;
    		}
    		
    		return true;
    	}
    
    	public static function glog(n : int) : int {
    
    		if (n < 1) {
    			throw new Error("log(" + n + ")");
    		}
    		
    		return LOG_TABLE[n];
    	}
    	
    	public static function gexp(n : int) : int {
    
    		while (n < 0) {
    			n += 255;
    		}
    
    		while (n >= 256) {
    			n -= 255;
    		}
    
    		return EXP_TABLE[n];
    	}
    	
    	
    }
    
}