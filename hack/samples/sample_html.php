<?hh // strict

use namespace Kazuhikoarase\QrcodeGenerator;

<<__EntryPoint>>
function sample_html(): noreturn {
    require_once __DIR__.'/../vendor/autoload.hack';
    \Facebook\AutoloadMap\initialize();
    //---------------------------------------------------------

    print('<meta charset="UTF-8">');

    // QR in Japanese 1234:! Kanji
    print("<h4>日本語のQR 1234:! 漢字</h4>");

    $qr = new QrcodeGenerator\QRCode();
    // QR_ERROR_CORRECT_LEVEL_L : 7%
    // QR_ERROR_CORRECT_LEVEL_M : 15%
    // QR_ERROR_CORRECT_LEVEL_Q : 25%
    // QR_ERROR_CORRECT_LEVEL_H : 30%
    $qr->setErrorCorrectLevel(QrcodeGenerator\ErrorCorrectionPercentage::SEVEN);
    $qr->setTypeNumber(4);
    $qr->addData("日本語のQR 1234:! 漢字");
    $qr->make();
    $qr->printHTML();

    //---------------------------------------------------------

    // QR quick 1234:!
    print("<h4>QRクイック 1234:!</h4>");

    $qr = QrcodeGenerator\QRCode::getMinimumQRCode(
        "QRクイック",
        QrcodeGenerator\ErrorCorrectionPercentage::SEVEN,
    );
    $qr->printHTML();

    exit(0);
}
