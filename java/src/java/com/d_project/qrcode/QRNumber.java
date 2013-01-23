package com.d_project.qrcode;

/**
 * QRNumber
 * @author Kazuhiko Arase 
 */
class QRNumber extends QRData {

	public QRNumber(String data) {
		super(Mode.MODE_NUMBER, data);
	}
	
	public void write(BitBuffer buffer) {

		String data = getData();
		
		int i = 0;

		while (i + 2 < data.length() ) {
			int num = parseInt(data.substring(i, i + 3) );
			buffer.put(num, 10);
			i += 3;
		}
		
		if (i < data.length() ) {
			
			if (data.length() - i == 1) {
				int num = parseInt(data.substring(i, i + 1) );
				buffer.put(num, 4);
			} else if (data.length() - i == 2) {
				int num = parseInt(data.substring(i, i + 2) );
				buffer.put(num, 7);
			}

		}
	}
	
	public int getLength() {
		return getData().length();
	}

	private static int parseInt(String s) {
		int num = 0;
		for (int i = 0; i < s.length(); i++) {
			num = num * 10 + parseInt(s.charAt(i) );
		}
		return num;
	}

	private static int parseInt(char c) {

		if ('0' <= c && c <= '9') {
			return c - '0';
		}
		
		throw new IllegalArgumentException("illegal char :" + c);
	}	

	
}