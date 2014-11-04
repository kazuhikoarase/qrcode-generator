package com.d_project.qrcode;

import org.junit.Assert;
import org.junit.Test;

public class QRCodeTest {

	@Test
	public void test1() {
		QRNumber data = new QRNumber("0123");
		byte[] act = QRCode.createData(1, ErrorCorrectLevel.H, new QRData[]{data} );
		byte[] exp = new byte[]{16,16,12,48,-20,17,-20,17,-20,-50,-20,-24,66,-27,44,-31,-124,-111,13,-69,-37,15,-16,36,-69,104};
		assertEquals(exp, act);
	}
	
	@Test
	public void test2() {
		QRAlphaNum data = new QRAlphaNum("AB01");
		byte[] act = QRCode.createData(1, ErrorCorrectLevel.H, new QRData[]{data} );
		byte[] exp = new byte[]{32,33,-51,0,32,-20,17,-20,17,105,-125,-85,106,65,-91,54,-123,-112,-11,-73,21,-13,-106,-89,114,-25};
		assertEquals(exp, act);
	}

	@Test
	public void test3() {
		QRKanji data = new QRKanji("漢字");
		byte[] act = QRCode.createData(1, ErrorCorrectLevel.H, new QRData[]{data} );
		byte[] exp = new byte[]{-128,35,-97,-88,104,0,-20,17,-20,-11,-82,108,-126,119,-6,118,-128,99,-41,-105,117,-68,-107,-120,47,-5};
		assertEquals(exp, act);
	}

	@Test
	public void test4() {
		QR8BitByte data = new QR8BitByte("ab01");
		byte[] act = QRCode.createData(1, ErrorCorrectLevel.H, new QRData[]{data} );
		byte[] exp = new byte[]{64,70,22,35,3,16,-20,17,-20,91,-25,80,48,-87,54,40,-83,84,-117,33,87,54,-57,50,-84,49};
		assertEquals(exp, act);
	}

	protected void assertEquals(byte[] expected, byte[] actual) {
		Assert.assertEquals(expected.length, actual.length);
		for (int i = 0; i < expected.length; i++) {
			Assert.assertEquals(expected[i], actual[i]);
		}
	}
}