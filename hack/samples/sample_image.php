<?hh // partial

require_once("qrcode.php");

<<__EntryPoint>>
function sample_custom(): noreturn {
    $qr = QRCode::getMinimumQRCode("QR�R�[�h", QR_ERROR_CORRECT_LEVEL_L);

    // �C���[�W�쐬(����:�T�C�Y,�}�[�W��)
    $im = $qr->createImage(2, 4);

    header("Content-type: image/gif");
    imagegif($im);

    imagedestroy($im);

    exit(0);
}
