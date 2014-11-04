package com.d_project.qrcode {

    import flash.utils.ByteArray;
    
    /**
     * QR8BitByte
     * @author Kazuhiko Arase 
     */
    internal class QR8BitByte extends QRData {
    	
    	public function QR8BitByte(data : String) {
    		super(Mode.MODE_8BIT_BYTE, data);
    	}
    	
    	public override function write(buffer : BitBuffer) : void {
			var data : ByteArray = StringUtil.getBytes(getData(), QRUtil.getJISEncoding() );
			for (var i : int = 0; i < data.length; i++) {
				buffer.put(data[i], 8);
			}
    	}
    	
    	public override function getLength() : int {
			return StringUtil.getBytes(getData(), QRUtil.getJISEncoding() ).length;
    	}
    }
}