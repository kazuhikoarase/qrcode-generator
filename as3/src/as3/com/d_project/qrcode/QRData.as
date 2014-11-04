package com.d_project.qrcode {

    /**
     * QRData
     * @author Kazuhiko Arase 
     */
    internal class QRData {
    	
    	private var mode : int;
    	
    	private var data : String;
    
    	public function QRData(mode : int, data : String) {
    		this.mode = mode;
    		this.data = data;
    	}
    	
    	public function getMode() : int {
    		return mode;
    	}
    	
    	public function getData() : String {
    		return data;
    	}
    	
    	public function getLength() : int {
    	    throw new Error("not implemented.");
    	}
    	
    	public function write(buffer : BitBuffer) : void {
    	    throw new Error("not implemented.");
    	}

    	/**
    	 * 型番及びモードに対するビット長を取得する。
    	 */	
    	public function getLengthInBits(type : int) : int {
    
    		if (1 <= type && type < 10) {
    
    			// 1 - 9
    
    			switch(mode) {
    			case Mode.MODE_NUMBER 		: return 10;
    			case Mode.MODE_ALPHA_NUM 	: return 9;
    			case Mode.MODE_8BIT_BYTE	: return 8;
    			case Mode.MODE_KANJI  		: return 8;
    			default :
    				throw new Error("mode:" + mode);
    			}
    
    		} else if (type < 27) {
    
    			// 10 - 26
    
    			switch(mode) {
    			case Mode.MODE_NUMBER 		: return 12;
    			case Mode.MODE_ALPHA_NUM 	: return 11;
    			case Mode.MODE_8BIT_BYTE	: return 16;
    			case Mode.MODE_KANJI  		: return 10;
    			default :
    				throw new Error("mode:" + mode);
    			}
    
    		} else if (type < 41) {
    
    			// 27 - 40
    
    			switch(mode) {
    			case Mode.MODE_NUMBER 		: return 14;
    			case Mode.MODE_ALPHA_NUM	: return 13;
    			case Mode.MODE_8BIT_BYTE	: return 16;
    			case Mode.MODE_KANJI  		: return 12;
    			default :
    				throw new Error("mode:" + mode);
    			}
    
    		} else {
    			throw new Error("type:" + type);
    		}
    	}
    
    }

}