
var draw_qrcode = function(text, typeNumber, errorCorrectionLevel) {
  document.write(create_qrcode(text, typeNumber, errorCorrectionLevel) );
};

var create_qrcode = function(text, typeNumber, errorCorrectionLevel, mode) {

  var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
  qr.addData(text, mode);
  qr.make();

//  return qr.createTableTag();
//  return qr.createSvgTag();
  return qr.createImgTag();
};

var update_qrcode = function() {
  var form = document.forms['qrForm'];
  var text = form.elements['msg'].value.
    replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  var t = form.elements['t'].value;
  var e = form.elements['e'].value;
  var m = form.elements['m'].value;
  document.getElementById('qr').innerHTML = create_qrcode(text, t, e, m);
};
