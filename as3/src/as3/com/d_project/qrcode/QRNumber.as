package com.d_project.qrcode {

    /**
     * QRNumber
     * @author Kazuhiko Arase 
     */
    internal class QRNumber extends QRData {
    
    	public function QRNumber(data : String) {
    		super(Mode.MODE_NUMBER, data);
    	}
    	
    	public override function write(buffer : BitBuffer) : void {
    
    		var data : String = getData();
    		
    		var i : int = 0;
            var num : int;
    
    		while (i + 2 < data.length) {
    			num = parseInt(data.substring(i, i + 3) );
    			buffer.put(num, 10);
    			i += 3;
    		}
    		
    		if (i < data.length) {
    			
    			if (data.length - i == 1) {
    				num = parseInt(data.substring(i, i + 1) );
    				buffer.put(num, 4);
    			} else if (data.length - i == 2) {
    				num = parseInt(data.substring(i, i + 2) );
    				buffer.put(num, 7);
    			}
    
    		}
    	}
    	
    	public override function getLength() : int {
    		return getData().length;
    	}
    
    	private static function parseInt(s : String) : int {
    		var num : int = 0;
    		for (var i : int = 0; i < s.length; i++) {
    			num = num * 10 + parseCharCode(s.charCodeAt(i) );
    		}
    		return num;
    	}
    
    	private static function parseCharCode(c : int) : int {
    
    		if (getCharCode('0') <= c && c <= getCharCode('9') ) {
    			return c - getCharCode('0') ;
    		}
    		
    		throw new Error("illegal char :" + c);
    	}	
    
        private static function getCharCode(c : String) : int {
            return c.charCodeAt(0);
        }    
    	
    }
}