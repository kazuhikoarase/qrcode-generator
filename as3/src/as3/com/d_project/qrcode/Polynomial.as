package com.d_project.qrcode {
    
    /**
     * Polynomial
     * @author Kazuhiko Arase 
     */
    internal class Polynomial {
    	
    	private var num : Array;
    
    	public function Polynomial(num : Array, shift : int = 0) {
    
    		var offset : int = 0;
    
    		while (offset < num.length && num[offset] == 0) {
    			offset++;
    		}
    
    		this.num = new Array(num.length - offset + shift);
    		for (var i : int = 0; i < num.length - offset; i++) {
    		    this.num[i] = num[offset + i];
    		}
    	}
    
    	public function getAt(index : int) : int {
    		return num[index];
    	}
    
    	public function getLength() : int {
    		return num.length;
    	}
    
    	public function toString() : String {
    
    		var buffer : String = "";
    		
    		for (var i : int = 0; i < getLength(); i++) {
    			if (i > 0) {
    				buffer += ",";
    			}
    			buffer += getAt(i);
    		}
    
    		return buffer;
    	}
    	
    	public function toLogString() : String {
    
    		var buffer : String = "";
    		
    		for (var i : int = 0; i < getLength(); i++) {
    			if (i > 0) {
    				buffer += ",";
    			}
    			buffer += QRMath.glog(getAt(i) );
    
    		}
    
    		return buffer.toString();
    	}
    	
    	public function multiply(e : Polynomial) : Polynomial {
    
    		var num  : Array = new Array(getLength() + e.getLength() - 1);
    
    		for (var i : int = 0; i < getLength(); i++) {
    			for (var j : int = 0; j < e.getLength(); j++) {
    				num[i + j] ^= QRMath.gexp(QRMath.glog(getAt(i) ) + QRMath.glog(e.getAt(j) ) );
    			}
    		}
    
    		return new Polynomial(num);
    	}
    	
    	public function mod(e : Polynomial) : Polynomial {
    
    		if (getLength() - e.getLength() < 0) {
    			return this;
    		}
    
    		// 最上位桁の比率
    		var ratio : int = QRMath.glog(getAt(0) ) - QRMath.glog(e.getAt(0) );
            
            var i : int;
            
    		// コピー作成
    		var num  : Array = new Array(getLength() );
    		for (i = 0; i < getLength(); i++) {
    			num[i] = getAt(i);
    		}
    		
    		// 引き算して余りを計算
    		for (i = 0; i < e.getLength(); i++) {
    			num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
    		}
    
    		// 再帰計算
    		return new Polynomial(num).mod(e);
    	}
    	
    }

}