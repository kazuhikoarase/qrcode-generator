<?php

require_once("qrcode.php");

$qr = QRCode::getMinimumQRCode("QRコード", QR_ERROR_CORRECT_LEVEL_L);

header("Content-type: image/svg+xml");
$qr->printSVG(2);

?>
