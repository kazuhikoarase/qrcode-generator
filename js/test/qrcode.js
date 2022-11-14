var assert = require('assert');
var qrcode = require('../qrcode.js');

describe('QRCode', function(){
	it('should exist', function(){
		assert.ok(qrcode);
	});

	it('should be a callable function', function(){
		assert.ok(qrcode instanceof Function);
	});

	it('should generate correct GIF image tag', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctImgTag = '<img src="data:image/gif;base64,R0lGODdhSgBKAIAAAAAAAP///ywAAAAASgBKAAAC/4yPqcvtD6OctNqLs968+w+G4kiWZgKk6roa7ZEiccACco1TeE6r9997uXYsna0xmw0VLyXsyHBCpKijk9qEPh1UrrXYAy4Xu3FtLEmCr9pucP3NGofyN9peBZ7DE3W9Tqd15+fDlxZXiPVlltiGqDb3BpnHRzj4uNgnSHkjZCiZGbXpRVrlyQZINopE9Jc5CdtaeCj7asvIWEvimet4oqkYKDZiCSrMWtobmcW8esfki2exN4XY2cj7aZQtehxIGHwR+41dDg3tdogLCm7N+ZTOOom+irqZGk//DF/vqDiv7cEpTMW4CZxVYSC5gghpOTt46dg4PGxE5aNUkeItje3Drm3zh9DewIytPl7LuBCkHiImpbEjaAvlloTm+DVzJXNftZM89lAz5vLiOZs94YysqZNmtZ8/vQiFeJApmKUPu30qU6mhKola1V0t6g2ZxqcaAK4biraE2axW004LyeNs1loGHfIkGY3uVLV7Ge4rSayvu7WAHQIGGMvn4KqqdLGd2S5xKE2lit2dfIlswJVhU/5VSRmoyEbr9NbdKhqkq156l8GJCFQZ0aRWFcOWGtZ2aN2IN3LlvPv149Kg8UZqi5ElP+JvkyXH+ns4MFnR/+0F/vEw6YDQk//6Dj68+PHky5s/jz69+vULCgAAOw==" width="74" height="74"/>';

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();

		assert.strictEqual(qr.createImgTag(), correctImgTag);
	});

	it('should generate correct GIF image data', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctImgData = 'R0lGODdhSgBKAIAAAAAAAP///ywAAAAASgBKAAAC/4yPqcvtD6OctNqLs968+w+G4kiWZgKk6roa7ZEiccACco1TeE6r9997uXYsna0xmw0VLyXsyHBCpKijk9qEPh1UrrXYAy4Xu3FtLEmCr9pucP3NGofyN9peBZ7DE3W9Tqd15+fDlxZXiPVlltiGqDb3BpnHRzj4uNgnSHkjZCiZGbXpRVrlyQZINopE9Jc5CdtaeCj7asvIWEvimet4oqkYKDZiCSrMWtobmcW8esfki2exN4XY2cj7aZQtehxIGHwR+41dDg3tdogLCm7N+ZTOOom+irqZGk//DF/vqDiv7cEpTMW4CZxVYSC5gghpOTt46dg4PGxE5aNUkeItje3Drm3zh9DewIytPl7LuBCkHiImpbEjaAvlloTm+DVzJXNftZM89lAz5vLiOZs94YysqZNmtZ8/vQiFeJApmKUPu30qU6mhKola1V0t6g2ZxqcaAK4biraE2axW004LyeNs1loGHfIkGY3uVLV7Ge4rSayvu7WAHQIGGMvn4KqqdLGd2S5xKE2lit2dfIlswJVhU/5VSRmoyEbr9NbdKhqkq156l8GJCFQZ0aRWFcOWGtZ2aN2IN3LlvPv149Kg8UZqi5ElP+JvkyXH+ns4MFnR/+0F/vEw6YDQk//6Dj68+PHky5s/jz69+vULCgAAOw==';

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();

		var data = Buffer.from(qr.createDataURL().replace('data:image/gif;base64,', ''), 'base64');

		assert.strictEqual(data.toString('base64'), correctImgData);
	});

	it('should generate correct UTF8 text data', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctTextData1 = [
			'█████████████████████████████████',
			'██ ▄▄▄▄▄ █ ▄█▀▄██ ▀▄ ▄██ ▄▄▄▄▄ ██',
			'██ █   █ █▀ █▀▄█▀▀█▄▄ ▄█ █   █ ██',
			'██ █▄▄▄█ ███ ▀ █▄▀▄▄▀ ▀█ █▄▄▄█ ██',
			'██▄▄▄▄▄▄▄█ ▀▄█▄▀▄▀ █▄▀▄█▄▄▄▄▄▄▄██',
			'██▄█  ▀▄▄▄█▄▄█▀█▀▀▄█▀▀▀█ ▀▀▄█▄ ██',
			'██▀▀▄▀▄█▄█  ▄▄█▄ ▄█  ███ ▀█▀▄▄▀██',
			'██ ▄▀█▄▀▄  ▄▀▄ █ ▄▀▀█▀██▀██▄▄▀▀██',
			'██  █▀ ▄▄▀▀ ▀█    █▀▄ ▀█▄▀▄▄▄ ▄██',
			'██▄██ ▄▄▄▄▄█   ▀▄▄ ▀▀▄▄▄█▄▄█▀ ███',
			'██▄█▄██▄▄▄ █ █▄▄▀█▀███▄▀▄▄█▄ ████',
			'███▄▄██▄▄▄ ▀▀▄█ █▀ █ ▄ ▄▄▄   ▀▀██',
			'██ ▄▄▄▄▄ █ █ ▀█▄█ ▀  ▄ █▄█ ▄█ ▀██',
			'██ █   █ █▀▄▄ ▄▀ ▀▄█ █  ▄▄   ▄ ██',
			'██ █▄▄▄█ █▄█▄▀█ ▀ ▀ ██  █ █▀▄▀▄██',
			'██▄▄▄▄▄▄▄█▄▄█▄█▄███▄▄▄▄████▄█▄███',
			'▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀'].join('\n');

		var correctTextData2 = [
			' ▄▄▄▄▄ █ ▄█▀▄██ ▀▄ ▄██ ▄▄▄▄▄ ',
			' █   █ █▀ █▀▄█▀▀█▄▄ ▄█ █   █ ',
			' █▄▄▄█ ███ ▀ █▄▀▄▄▀ ▀█ █▄▄▄█ ',
			'▄▄▄▄▄▄▄█ ▀▄█▄▀▄▀ █▄▀▄█▄▄▄▄▄▄▄',
			'▄█  ▀▄▄▄█▄▄█▀█▀▀▄█▀▀▀█ ▀▀▄█▄ ',
			'▀▀▄▀▄█▄█  ▄▄█▄ ▄█  ███ ▀█▀▄▄▀',
			' ▄▀█▄▀▄  ▄▀▄ █ ▄▀▀█▀██▀██▄▄▀▀',
			'  █▀ ▄▄▀▀ ▀█    █▀▄ ▀█▄▀▄▄▄ ▄',
			'▄██ ▄▄▄▄▄█   ▀▄▄ ▀▀▄▄▄█▄▄█▀ █',
			'▄█▄██▄▄▄ █ █▄▄▀█▀███▄▀▄▄█▄ ██',
			'█▄▄██▄▄▄ ▀▀▄█ █▀ █ ▄ ▄▄▄   ▀▀',
			' ▄▄▄▄▄ █ █ ▀█▄█ ▀  ▄ █▄█ ▄█ ▀',
			' █   █ █▀▄▄ ▄▀ ▀▄█ █  ▄▄   ▄ ',
			' █▄▄▄█ █▄█▄▀█ ▀ ▀ ██  █ █▀▄▀▄',
			'       ▀  ▀ ▀ ▀▀▀    ▀▀▀▀ ▀ ▀'].join('\n');

		var correctTextData3 = [
			'██████████████████████████████████████████████████████████████████',
			'██████████████████████████████████████████████████████████████████',
			'████              ██    ████  ████  ██      ████              ████',
			'████  ██████████  ██  ████  ██████    ██  ██████  ██████████  ████',
			'████  ██      ██  ████  ████  ████████        ██  ██      ██  ████',
			'████  ██      ██  ██    ██  ████    ██████  ████  ██      ██  ████',
			'████  ██      ██  ██████  ██  ██  ██    ██  ████  ██      ██  ████',
			'████  ██████████  ██████      ████  ████      ██  ██████████  ████',
			'████              ██  ██  ██  ██  ██  ██  ██  ██              ████',
			'████████████████████    ██████  ██    ████  ██████████████████████',
			'████  ██    ██      ██    ██████████  ██████████  ████  ██    ████',
			'████████      ██████████████  ██    ████      ██      ██████  ████',
			'████████  ██  ██  ██        ██      ██    ██████  ██████    ██████',
			'████    ██  ████████    ████████  ████    ██████    ██  ████  ████',
			'████    ████  ██        ██    ██    ██████████████████    ████████',
			'████  ██  ████  ██    ██  ██  ██  ██    ██  ████  ████████    ████',
			'████    ████      ████  ████        ████    ████  ██          ████',
			'████    ██    ████        ██        ██  ██    ████  ██████  ██████',
			'████  ████            ██      ██      ████      ██    ████  ██████',
			'██████████  ████████████        ████      ██████████████    ██████',
			'████  ██  ████        ██  ██    ████████████  ██    ██    ████████',
			'████████████████████  ██  ██████  ██  ████████  ████████  ████████',
			'██████    ████        ████  ██  ████  ██                  ████████',
			'████████████████████      ████  ██    ██  ██  ██████          ████',
			'████              ██  ██  ████  ██  ██        ██  ██    ██  ██████',
			'████  ██████████  ██  ██    ██████        ██  ██████  ████    ████',
			'████  ██      ██  ████        ██  ██  ██  ██                  ████',
			'████  ██      ██  ██  ████  ██      ████  ██    ████      ██  ████',
			'████  ██      ██  ██  ██  ████  ██  ██  ████    ██  ████  ██  ████',
			'████  ██████████  ████████  ██          ████    ██  ██  ██  ██████',
			'████              ██    ██  ██  ██████        ████████  ██  ██████',
			'██████████████████████████████████████████████████████████████████',
			'██████████████████████████████████████████████████████████████████',].join('\n');

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();

		assert.strictEqual(qr.createASCII(), correctTextData1, 'ASCII QRCode of size 1 is incorrect');
		assert.strictEqual(qr.createASCII(1, 0), correctTextData2, 'ASCII QRCode of size 1 without margin is incorrect');
		assert.strictEqual(qr.createASCII(2), correctTextData3, 'ASCII QRCode of size 2 is incorrect');
	});

  
	it('should generate correct min HTML <table> data', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctTableTagMinData = [
			'7159: <style> table#qrTbl {border: 0px none; border-collapse: collapse; padding: 0px; background-color: #000000;} table#qrTbl {table-layout: fixed; margin: 8px;} table#qrTbl td {padding: 0px; width:2px; height:2px;}[w] {background-color: #ffffff !important;}</style>',
			'<table id="qrTbl"><tbody>',
			'<tr><td/><td/><td/><td/><td/><td/><td/><td w/>',
			'...',
			'<td w/><td w/><td w/><td/><td/><td/></tr></tbody></table>'].join('\n');

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();
		var tableTagMin=qr.createTableTagMin();
		var out = tableTagMin.length + ': ' + tableTagMin.substring(0,333) + '\n...\n' + tableTagMin.substring(7102);
    
		assert.strictEqual(out, correctTableTagMinData, 'TableTag QRCode is incorrect');
	});
  

  
	it('should generate correct HTML <table> data', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctTableTagData = [
			'173580: <table style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 8px;"><tbody><tr><td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #000000;"/><td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #000000;"/><td style=" border-width: 0px; border-style: none; border-collapse:',
			'...',
			'<td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #ffffff;"/><td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #000000;"/><td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #000000;"/><td style=" border-width: 0px; border-style: none; border-collapse: collapse; padding: 0px; margin: 0px; width: 2px; height: 2px; background-color: #000000;"/></tr></tbody></table>'].join('\n');

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();
		var tableTag=qr.createTableTag();
		var out2 = tableTag.length + ': ' + tableTag.substring(0,505) + '\n...\n' + tableTag.substring(172923);
    
		assert.strictEqual(out2, correctTableTagData, 'TableTag QRCode is incorrect');
	});
  


});