package com.d_project.qrcode;

import junit.framework.TestCase;

public class BitBufferTest extends TestCase {

	public void test1() {
		BitBuffer bb = new BitBuffer();
		QRData qd = new QR8BitByte("534TEST!!!あ");
		qd.write(bb);

		assertEquals(96, bb.getLengthInBits() );
	}

	public void test2() {
		BitBuffer bb = new BitBuffer();
		QRData qd = new QRAlphaNum("534TEST $%*+-./:");
		qd.write(bb);

		assertEquals(88, bb.getLengthInBits() );
	}

	public void test3() {
		BitBuffer bb = new BitBuffer();
		QRData qd = new QRKanji("あいうえお");
		qd.write(bb);

		assertEquals(65, bb.getLengthInBits() );
	}

	public void test4() {
		BitBuffer bb = new BitBuffer();
		QRData qd = new QRNumber("0123456789");
		qd.write(bb);

		assertEquals(34, bb.getLengthInBits() );
	}
}