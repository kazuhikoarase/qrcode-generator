<?hh // partial

require_once("qrcode.php");

<<__EntryPoint>>
function sample_custom(): noreturn {
    $qr = QRCode::getMinimumQRCode("QR�R�[�h", QR_ERROR_CORRECT_LEVEL_L);

    header("Content-type: text/xml");

    print("<qrcode>");

    for ($r = 0; $r < $qr->getModuleCount(); $r++) {
        print("<line>");
        for ($c = 0; $c < $qr->getModuleCount(); $c++) {
            print($qr->isDark($r, $c) ? "1" : "0");
        }
        print("</line>");
    }

    print("</qrcode>");

    exit(0);
}
