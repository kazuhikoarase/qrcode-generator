package com.d_project.qrcode.mx {

    import mx.core.UIComponent;
    import flash.display.Graphics;
    
    import com.d_project.qrcode.ErrorCorrectLevel;


    /**
     * QRコード.
     * @author Kazuhiko Arase 
     */    
    public class QRCode extends UIComponent {
        
        private var qr : com.d_project.qrcode.QRCode;
        
        private var _text : String;

    	[Inspectable(enumeration="L,M,Q,H", defaultValue="H")]
        public var errorCorrectLevel : String = "H";
        
        public function QRCode() {
            _text = "QRCode";
            qr = null;
        }
        
        public function get text() : String {
            return _text;
        }

        public function set text(value : String) : void {
            _text = value;
            qr = null;
            invalidateDisplayList();
        }
        
        protected override function updateDisplayList(unscaledWidth : Number, unscaledHeight : Number) : void {

            var padding : Number = 10;
            
            var size : Number = Math.min(unscaledWidth, unscaledHeight) - padding * 2;
            var xOffset : Number = (unscaledWidth - size) / 2;
            var yOffset : Number = (unscaledHeight - size) / 2;

            if (qr == null) {
                qr = com.d_project.qrcode.QRCode.getMinimumQRCode(text, ErrorCorrectLevel[errorCorrectLevel]);
            }
            
            var cs : Number = size / qr.getModuleCount();
            
            var g : Graphics = graphics;

            g.beginFill(0xffffff);
            g.drawRect(0, 0, unscaledWidth, unscaledHeight);
            g.endFill();
            
            for (var row : int = 0; row < qr.getModuleCount(); row++) {
                for (var col : int = 0; col < qr.getModuleCount(); col++) {
                    g.beginFill( (qr.isDark(row, col)? 0 : 0xffffff) );
                    g.drawRect(cs * col + xOffset, cs * row + yOffset,  cs, cs);
                    g.endFill();
                }
            }
        }
    }
}

