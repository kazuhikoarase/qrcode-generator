<?php

require_once("qrcode.php");

$qr = QRCode::getMinimumQRCode("QRコード", QR_ERROR_CORRECT_LEVEL_L);

// イメージ作成(引数:サイズ,マージン)
$im = $qr->createImage(2, 4);

header("Content-type: image/gif");
imagegif($im);

imagedestroy($im);

?>
