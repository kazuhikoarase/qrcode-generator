package {

    import com.d_project.qrcode.ErrorCorrectLevel;
    import com.d_project.qrcode.QRCode;
    
    import flash.display.Graphics;
    import flash.display.Sprite;

    public class QRCodeSample1 extends Sprite {

        public function QRCodeSample1() {

            var width : Number = 200;
            var height : Number = 200;
            var padding : Number = 10;
            
            var size : Number = Math.min(width, height) - padding * 2;
            var xOffset : Number = (width - size) / 2;
            var yOffset : Number = (height - size) / 2;
            
            var qr : QRCode = QRCode.getMinimumQRCode("AS3ならば、文字コードの扱いも簡単！", ErrorCorrectLevel.H);
            
            var cs : Number = size / qr.getModuleCount();
            
            var g : Graphics = graphics;
            
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

