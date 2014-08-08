package com.d_project.qrcode {
    
    /**
     * RSBlock
     * @author Kazuhiko Arase 
     */
    internal class RSBlock {

    	private static var RS_BLOCK_TABLE : Array = [
    
    		// L
    		// M
    		// Q
    		// H
    
    		// 1
    		[1, 26, 19],
    		[1, 26, 16],
    		[1, 26, 13],
    		[1, 26, 9],
    		
    		// 2
    		[1, 44, 34],
    		[1, 44, 28],
    		[1, 44, 22],
    		[1, 44, 16],
    
    		// 3
    		[1, 70, 55],
    		[1, 70, 44],
    		[2, 35, 17],
    		[2, 35, 13],
    
    		// 4		
    		[1, 100, 80],
    		[2, 50, 32],
    		[2, 50, 24],
    		[4, 25, 9],
    		
    		// 5
    		[1, 134, 108],
    		[2, 67, 43],
    		[2, 33, 15, 2, 34, 16],
    		[2, 33, 11, 2, 34, 12],
    		
    		// 6
    		[2, 86, 68],
    		[4, 43, 27],
    		[4, 43, 19],
    		[4, 43, 15],
    		
    		// 7		
    		[2, 98, 78],
    		[4, 49, 31],
    		[2, 32, 14, 4, 33, 15],
    		[4, 39, 13, 1, 40, 14],
    		
    		// 8
    		[2, 121, 97],
    		[2, 60, 38, 2, 61, 39],
    		[4, 40, 18, 2, 41, 19],
    		[4, 40, 14, 2, 41, 15],
    		
    		// 9
    		[2, 146, 116],
    		[3, 58, 36, 2, 59, 37],
    		[4, 36, 16, 4, 37, 17],
    		[4, 36, 12, 4, 37, 13],
    		
    		// 10		
    		[2, 86, 68, 2, 87, 69],
    		[4, 69, 43, 1, 70, 44],
    		[6, 43, 19, 2, 44, 20],
    		[6, 43, 15, 2, 44, 16]
    
    	];
    
    	private var totalCount : int;
    	private var dataCount : int;
    	
    	public function RSBlock(totalCount : int, dataCount : int) {
    		this.totalCount = totalCount;
    		this.dataCount  = dataCount;
    	}
    	
    	public function getDataCount() : int {
    		return dataCount;
    	}
    	
    	public function getTotalCount() : int {
    		return totalCount;
    	}
    
    	public static function getRSBlocks(typeNumber : int, errorCorrectLevel : int) : Array {
    		
    		var rsBlock : Array = getRsBlockTable(typeNumber, errorCorrectLevel);
    		var length : int = Math.floor(rsBlock.length / 3);
    		var list : Array = new Array();
    						
    		for (var i : int = 0; i < length; i++) {
    
    			var count : int = rsBlock[i * 3 + 0];
    			var totalCount : int = rsBlock[i * 3 + 1];
    			var dataCount : int = rsBlock[i * 3 + 2];
    
    			for (var j : int = 0; j < count; j++) {
    				list.push(new RSBlock(totalCount, dataCount) );	
    			}
    		}
    		
    		return list;
    	}
    	
    	private static function getRsBlockTable(typeNumber : int, errorCorrectLevel : int) : Array {
    
    		try {
    
    			switch(errorCorrectLevel) {
    			case ErrorCorrectLevel.L :
    				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    			case ErrorCorrectLevel.M :
    				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    			case ErrorCorrectLevel.Q :
    				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    			case ErrorCorrectLevel.H :
    				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    			default :
    				break;
    			}
    			
    		} catch(e : Error) {
    		}
    
    		throw new Error("tn:" + typeNumber + "/ecl:" + errorCorrectLevel);
    	}
    	
    }

}