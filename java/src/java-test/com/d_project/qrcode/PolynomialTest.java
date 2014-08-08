package com.d_project.qrcode;

import org.junit.Assert;
import org.junit.Test;

public class PolynomialTest {

	@Test
	public void test1() {

 		int[] rs = new int[] {0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136};
 		for (int i = 0; i < rs.length; i++) {
 			rs[i] = QRMath.gexp(rs[i]);
 		}
 		int[] data = new int[]{32,65,205,69,41,220,46,128,236};

	    Polynomial e = new Polynomial(rs);
		Polynomial e2 = new Polynomial(data, e.getLength() - 1);

		assertEquals(new int[]{32,65,205,69,41,220,46,128,236,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}, e2);
		assertEquals(new int[]{1,119,66,83,120,119,22,197,83,249,41,143,134,85,53,125,99,79}, e);
		assertEquals(new int[]{42,159,74,221,244,169,239,150,138,70,237,85,224,96,74,219,61}, e2.mod(e) );
	}

	@Test
	public void test2() {
		
		Polynomial a = new Polynomial(new int[]{1}, 0);
		for (int i = 0; i < 7; i++) {
			a = a.multiply(new Polynomial(new int[]{1, QRMath.gexp(i) }, 0) );
		}

		int[] log = {0,87,229,146,149,238,102,21};
		Assert.assertEquals(log.length, a.getLength() );
		for (int i = 0; i < a.getLength(); i++) {
			Assert.assertEquals(log[i], QRMath.glog(a.get(i) ) );
		}
	}
	
	protected void assertEquals(int[] num, Polynomial p) {
		Assert.assertEquals(num.length, p.getLength() );
		for (int i = 0; i < num.length; i++) {
			Assert.assertEquals(num[i], p.get(i) );
		}
	}
}