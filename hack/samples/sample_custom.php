<?hh // strict

use namespace Kazuhikoarase\QrcodeGenerator;

require_once(__DIR__.'/../vendor/hh_autoload.php');

<<__EntryPoint>>
function sample_custom(): noreturn {
    $qr = QrcodeGenerator\QRCode::getMinimumQRCode(
        "日本語のQR 1234:! 漢字",
        QrcodeGenerator\ErrorCorrectionPercentage::SEVEN,
    );

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
