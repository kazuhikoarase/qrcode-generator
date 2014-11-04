package com.d_project.qrcode {

    /**
     * QRAlphaNum
     * @author Kazuhiko Arase 
     */
    internal class QRAlphaNum extends QRData {
    
    	public function QRAlphaNum(data : String) {
    		super(Mode.MODE_ALPHA_NUM, data);
    	}
    	
    	public override function write(buffer : BitBuffer) : void {
    
    		var i : int = 0;
            var s : String = getData();
            
    		while (i + 1 < s.length) {
    			buffer.put(getCode(s.charAt(i) ) * 45 + getCode(s.charAt(i + 1) ), 11);
    			i += 2;
    		}
    		
    		if (i < s.length) {
    			buffer.put(getCode(s.charAt(i) ), 6);
    		}
    	}
    	
    	public override function getLength() : int {
    		return getData().length;
    	}
    
    	private static function getCode(c : String) : int {
            var code : int = c.charCodeAt(0);
    		if (getCharCode('0') <= code && code <= getCharCode('9') ) {
    			return code - getCharCode('0');
    		} else if (getCharCode('A') <= code && code <= getCharCode('Z') ) {
    			return code - getCharCode('A') + 10;
    		} else {
    			switch (c) {
    			case ' ' : return 36;
    			case '$' : return 37;
    			case '%' : return 38;
    			case '*' : return 39;
    			case '+' : return 40;
    			case '-' : return 41;
    			case '.' : return 42;
    			case '/' : return 43;
    			case ':' : return 44;
    			default :
    				throw new Error("illegal char :" + c);
    			}
    		}
    		throw new Error();
    	}	
    
        private static function getCharCode(c : String) : int {
            return c.charCodeAt(0);
        }
    }
}