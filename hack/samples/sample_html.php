<?hh // partial

require_once("qrcode.php");

<<__EntryPoint>>
function sample_html(): noreturn {
    //---------------------------------------------------------

    print("<h4>�����I�Ɍ^�Ԃ��w��</h4>");

    $qr = new QRCode();
    // �G���[�������x����ݒ�
    // QR_ERROR_CORRECT_LEVEL_L : 7%
    // QR_ERROR_CORRECT_LEVEL_M : 15%
    // QR_ERROR_CORRECT_LEVEL_Q : 25%
    // QR_ERROR_CORRECT_LEVEL_H : 30%
    $qr->setErrorCorrectLevel(QR_ERROR_CORRECT_LEVEL_L);
    // �^��(�傫��)��ݒ�
    // 1�`40
    $qr->setTypeNumber(4);
    // �f�[�^(������)��ݒ�
    // �����{���SJIS
    $qr->addData("QR�R�[�h");
    // QR�R�[�h���쐬
    $qr->make();
    // HTML�o��
    $qr->printHTML();

    //---------------------------------------------------------

    print("<h4>�^�Ԏ���</h4>");

    // �^�Ԃ��ŏ��ƂȂ�QR�R�[�h���쐬
    $qr = QRCode::getMinimumQRCode("QR�R�[�h", QR_ERROR_CORRECT_LEVEL_L);
    // HTML�o��
    $qr->printHTML();

    exit(0);
}
