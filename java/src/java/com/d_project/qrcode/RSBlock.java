package com.d_project.qrcode;

import java.util.ArrayList;
import java.util.List;

/**
 * RSBlock
 * @author Kazuhiko Arase 
 */
class RSBlock {

	private static final int[][] RS_BLOCK_TABLE = {

		// L
		// M
		// Q
		// H

		// 1
		{1, 26, 19},
		{1, 26, 16},
		{1, 26, 13},
		{1, 26, 9},
		
		// 2
		{1, 44, 34},
		{1, 44, 28},
		{1, 44, 22},
		{1, 44, 16},

		// 3
		{1, 70, 55},
		{1, 70, 44},
		{2, 35, 17},
		{2, 35, 13},

		// 4		
		{1, 100, 80},
		{2, 50, 32},
		{2, 50, 24},
		{4, 25, 9},
		
		// 5
		{1, 134, 108},
		{2, 67, 43},
		{2, 33, 15, 2, 34, 16},
		{2, 33, 11, 2, 34, 12},
		
		// 6
		{2, 86, 68},
		{4, 43, 27},
		{4, 43, 19},
		{4, 43, 15},
		
		// 7		
		{2, 98, 78},
		{4, 49, 31},
		{2, 32, 14, 4, 33, 15},
		{4, 39, 13, 1, 40, 14},
		
		// 8
		{2, 121, 97},
		{2, 60, 38, 2, 61, 39},
		{4, 40, 18, 2, 41, 19},
		{4, 40, 14, 2, 41, 15},
		
		// 9
		{2, 146, 116},
		{3, 58, 36, 2, 59, 37},
		{4, 36, 16, 4, 37, 17},
		{4, 36, 12, 4, 37, 13},
		
		// 10		
		{2, 86, 68, 2, 87, 69},
		{4, 69, 43, 1, 70, 44},
		{6, 43, 19, 2, 44, 20},
		{6, 43, 15, 2, 44, 16}

	};

	private int totalCount;
	private int dataCount;
	
	private RSBlock(int totalCount, int dataCount) {
		this.totalCount = totalCount;
		this.dataCount  = dataCount;
	}
	
	public int getDataCount() {
		return dataCount;
	}
	
	public int getTotalCount() {
		return totalCount;
	}

	public static RSBlock[] getRSBlocks(int typeNumber, int errorCorrectLevel) {
		
		int[] rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);
		int length = rsBlock.length / 3;
		

		List<RSBlock> list = new ArrayList<RSBlock>();
						
		for (int i = 0; i < length; i++) {

			int count = rsBlock[i * 3 + 0];
			int totalCount = rsBlock[i * 3 + 1];
			int dataCount  = rsBlock[i * 3 + 2];

			for (int j = 0; j < count; j++) {
				list.add(new RSBlock(totalCount, dataCount) );	
			}
		}
		
		return list.toArray(new RSBlock[list.size() ]);
	}
	
	private static int[] getRsBlockTable(int typeNumber, int errorCorrectLevel) {

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
			
		} catch(Exception e) {
		}

		throw new IllegalArgumentException("tn:" + typeNumber + "/ecl:" + errorCorrectLevel);
	}
	
}