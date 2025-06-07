import { expect } from "@open-wc/testing";

export const overview = function(qrcode) {

describe('QRCode', function(){
	it('should exist', function(){
		expect(!!qrcode).to.be.true;
	});

	it('should be a callable function', function(){
		expect(qrcode instanceof Function).to.be.true;
	});

	it('should generate correct GIF image tag', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctImgTag = '<img src="data:image/gif;base64,R0lGODdhSgBKAIAAAAAAAP///ywAAAAASgBKAAAC/4yPqcvtD6OctNqLs968+w+G4kiWZgKk6roa7ZEiccACco1TeE6r9997uXYsna0xmw0VLyXsyHBCpKijk9qEPh1UrrXYAy4Xu3FtLEmCr9pucP3NGofyN9peBZ7DE3W9Tqd15+fDlxZXiPVlltiGqDb3BpnHRzj4uNgnSHkjZCiZGbXpRVrlyQZINopE9Jc5CdtaeCj7asvIWEvimet4oqkYKDZiCSrMWtobmcW8esfki2exN4XY2cj7aZQtehxIGHwR+41dDg3tdogLCm7N+ZTOOom+irqZGk//DF/vqDiv7cEpTMW4CZxVYSC5gghpOTt46dg4PGxE5aNUkeItje3Drm3zh9DewIytPl7LuBCkHiImpbEjaAvlloTm+DVzJXNftZM89lAz5vLiOZs94YysqZNmtZ8/vQiFeJApmKUPu30qU6mhKola1V0t6g2ZxqcaAK4biraE2axW004LyeNs1loGHfIkGY3uVLV7Ge4rSayvu7WAHQIGGMvn4KqqdLGd2S5xKE2lit2dfIlswJVhU/5VSRmoyEbr9NbdKhqkq156l8GJCFQZ0aRWFcOWGtZ2aN2IN3LlvPv149Kg8UZqi5ElP+JvkyXH+ns4MFnR/+0F/vEw6YDQk//6Dj68+PHky5s/jz69+vULCgAAOw==" width="74" height="74"/>';

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();

		expect(qr.createImgTag() ).to.equal(correctImgTag);
	});

	it('should generate correct GIF image data', function(){
		var sourceText = 'http://www.example.com/ążśźęćńół';
		var correctImgData = 'R0lGODdhSgBKAIAAAAAAAP///ywAAAAASgBKAAAC/4yPqcvtD6OctNqLs968+w+G4kiWZgKk6roa7ZEiccACco1TeE6r9997uXYsna0xmw0VLyXsyHBCpKijk9qEPh1UrrXYAy4Xu3FtLEmCr9pucP3NGofyN9peBZ7DE3W9Tqd15+fDlxZXiPVlltiGqDb3BpnHRzj4uNgnSHkjZCiZGbXpRVrlyQZINopE9Jc5CdtaeCj7asvIWEvimet4oqkYKDZiCSrMWtobmcW8esfki2exN4XY2cj7aZQtehxIGHwR+41dDg3tdogLCm7N+ZTOOom+irqZGk//DF/vqDiv7cEpTMW4CZxVYSC5gghpOTt46dg4PGxE5aNUkeItje3Drm3zh9DewIytPl7LuBCkHiImpbEjaAvlloTm+DVzJXNftZM89lAz5vLiOZs94YysqZNmtZ8/vQiFeJApmKUPu30qU6mhKola1V0t6g2ZxqcaAK4biraE2axW004LyeNs1loGHfIkGY3uVLV7Ge4rSayvu7WAHQIGGMvn4KqqdLGd2S5xKE2lit2dfIlswJVhU/5VSRmoyEbr9NbdKhqkq156l8GJCFQZ0aRWFcOWGtZ2aN2IN3LlvPv149Kg8UZqi5ElP+JvkyXH+ns4MFnR/+0F/vEw6YDQk//6Dj68+PHky5s/jz69+vULCgAAOw==';

		var qr = qrcode(-1, 'M');
		qr.addData(unescape(encodeURI(sourceText)));
		qr.make();

		var data = qr.createDataURL().replace('data:image/gif;base64,', '');

		expect(btoa(atob(data) ) ).to.equal(correctImgData);
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

		expect(qr.createASCII() ).to.equal(correctTextData1, 'ASCII QRCode of size 1 is incorrect');
		expect(qr.createASCII(1, 0) ).to.equal(correctTextData2, 'ASCII QRCode of size 1 without margin is incorrect');
		expect(qr.createASCII(2) ).to.equal(correctTextData3, 'ASCII QRCode of size 2 is incorrect');
	});
});

};
