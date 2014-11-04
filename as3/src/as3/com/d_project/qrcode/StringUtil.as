package com.d_project.qrcode {

    import flash.utils.ByteArray;
    
    /**
     * StringUtil
     * @author Kazuhiko Arase 
     */
    internal class StringUtil {
        
        public static function getBytes(s : String, encoding : String) : ByteArray {
            var b : ByteArray = new ByteArray();
            b.writeMultiByte(s, encoding);
            return b;
        }
    }
}