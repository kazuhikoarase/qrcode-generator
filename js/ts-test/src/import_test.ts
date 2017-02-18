declare var require: any;
declare var exports : any;

import * as imported from 'qrcode-generator';

exports.requireAndImport = function(test : any) {

  var testQR = function(qrcode : any) {
    test.equal(typeof qrcode, 'function');
    test.equal(typeof qrcode.stringToBytes, 'function');
  };

  var required =  require('qrcode-generator');
  testQR(required);
  testQR(imported);
  test.done();
};
