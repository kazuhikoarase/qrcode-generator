package com.d_project.qrcode;

/**
 * BitBuffer
 * @author Kazuhiko Arase 
 */
class BitBuffer {
	
	private byte[] buffer;
	private int length;
	private int inclements;
	
	public BitBuffer() {
		inclements = 32;
		buffer = new byte[inclements];
		length = 0;
	}
	
	public byte[] getBuffer() {
		return buffer;
	}
		
	public int getLengthInBits() {
		return length;
	}
	
	public String toString() {
		StringBuilder buffer = new StringBuilder();
		for (int i = 0; i < getLengthInBits(); i++) {
			buffer.append(get(i)? '1' : '0');
		}
		return buffer.toString();
	}

	private boolean get(int index) {
		return ( (buffer[index / 8] >>> (7 - index % 8) ) & 1) == 1;
	}

	public void put(int num, int length) {
		for (int i = 0; i < length; i++) {
			put( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	}
	
	public void put(boolean bit) {

		if (length == buffer.length * 8) {
			byte[] newBuffer = new byte[buffer.length + inclements];
			System.arraycopy(buffer, 0, newBuffer, 0, buffer.length);
			buffer = newBuffer;			
		}

		if (bit) {
			buffer[length / 8] |= (0x80 >>> (length % 8) );
		}

		length++;
	}
	
}
