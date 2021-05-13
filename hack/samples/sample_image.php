<?hh // strict

use namespace Kazuhikoarase\QrcodeGenerator;


<<__EntryPoint>>
function sample_image(): noreturn {
    require_once __DIR__.'/../vendor/autoload.hack';
    \Facebook\AutoloadMap\initialize();
    $qr = QrcodeGenerator\QRCode::getMinimumQRCode(
        "日本語のQR 1234:! 漢字",
        QrcodeGenerator\ErrorCorrectionPercentage::SEVEN,
    );

    $im = $qr->createImage(2, 4);

    header("Content-type: image/gif");
    imagegif($im);

    imagedestroy($im);

    exit(0);
}
