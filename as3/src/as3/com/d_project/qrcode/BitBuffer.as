package com.d_project.qrcode {
    
    /**
     * BitBuffer
     * @author Kazuhiko Arase 
     */
    internal class BitBuffer {
    	
    	private var buffer : Array;

    	private var length : int;
    	
    	public function BitBuffer() {
    		buffer = new Array();
    		length = 0;
    	}
    	
    	public function getBuffer() : Array {
    		return buffer;
    	}
    		
    	public function getLengthInBits() : int {
    		return length;
    	}
    
    	private function getBitAt(index : int) : Boolean {
    		return ( (buffer[Math.floor(index / 8)] >>> (7 - index % 8) ) & 1) == 1;
    	}
    
    	public function put(num : int, length : int) : void {
    		for (var i : int = 0; i < length; i++) {
    			putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
    		}
    	}
    	
    	public function putBit(bit : Boolean) : void {
    
    		if (length == buffer.length * 8) {
    		    buffer.push(0);
    		}

    		if (bit) {
    			buffer[Math.floor(length / 8)] |= (0x80 >>> (length % 8) );
    		}
    
    		length++;
    	}
    	
    	public function toString() : String {
    		var buffer : String = "";
    		for (var i : int = 0; i < getLengthInBits(); i++) {
    			buffer += (getBitAt(i)? '1' : '0');
    		}
    		return buffer;
    	}
    	
    }

}