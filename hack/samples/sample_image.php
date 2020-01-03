<?hh // partial

require_once(__DIR__.'/../vendor/hh_autoload.php');

<<__EntryPoint>>
function sample_image(): noreturn {
    $qr = QRCode::getMinimumQRCode(
        "日本語のQR 1234:! 漢字",
        QR_ERROR_CORRECT_LEVEL_L,
    );

    $im = $qr->createImage(2, 4);

    header("Content-type: image/gif");
    imagegif($im);

    imagedestroy($im);

    exit(0);
}
