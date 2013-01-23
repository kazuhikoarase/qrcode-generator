package com.d_project.qrcode {

    import flash.utils.ByteArray;

    /**
     * QRKanji
     * @author Kazuhiko Arase 
     */
    internal class QRKanji extends QRData {
    
    	public function QRKanji(data : String) {
    		super(Mode.MODE_KANJI, data);
    	}
    	
    	public override function write(buffer : BitBuffer) : void {

			var data : ByteArray = StringUtil.getBytes(getData(), QRUtil.getJISEncoding() );

			var i : int = 0;

			while (i + 1 < data.length) {
				
				var c : int = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

				if (0x8140 <= c && c <= 0x9FFC) {
					c -= 0x8140;
				} else if (0xE040 <= c && c <= 0xEBBF) {
					c -= 0xC140;
				} else {
					throw new Error("illegal char at " + (i + 1) + "/" + c);
				}
				
				c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

				buffer.put(c, 13);
				
				i += 2;
			}

			if (i < data.length) {
				throw new Error("illegal char at " + (i + 1) );
			}
    	}
    	
    	public override function getLength() : int {
			return Math.floor(StringUtil.getBytes(getData(), QRUtil.getJISEncoding() ).length / 2);
    	}	
    }
}