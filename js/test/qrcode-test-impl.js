import { expect } from "@open-wc/testing";


const limit = 80;
const debug = false;

export const capture = function(varName, s) {
  let code = '';
  const println = function(s) { code += s + '\n'; };
  let line = s;
  println('let ' + varName + ' = \'\';');
  while (line.length > limit) {
    println(varName + ' += \'' + line.substring(0, limit) + '\';');
    line = line.substring(limit);
  }
  if (line.length > 0) {
    println(varName + ' += \'' + line + '\';');
  }
  if (debug) {
    console.log(code);
  }
  return s;
};

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

export const sjis = function(qrcode) {
  describe('QRCode', function(){
    it('correct qr', function(){

      let s = '';
      s += 'data:image/gif;base64,R0lGODdhUgBSAIAAAAAAAP///ywAAAAAUgBSAAAC/4yPqcvtD6OctNqLs9';
      s += '68+w+G4kiW5mkC6sqyhsq4ATyvUIvbU56/QKyjyRw8HIUG9CGKv4Ow6XsSoRHkQuosLptWmVXxfTy9XJ';
      s += '2ytuVtz0b0rkyOUrHyNhsepN7w2Hb47ldWJ/g2CJiXVBN4SFfFRyh3BvbY9yjpaOgWqZkw1nKX+dcgyq';
      s += 'jXiahoSsq5N5UJVBm2ujrJVAnqdptrS3vKi6sbTNlzEpc61YtSSzh0ZTbSbJe1Ccs8N3z0LH2IbL2W2m';
      s += 'wh+5xmPYtKfTEuahzuC3lcwZ53Hmt6iV/o7NnN7TyJwZMuXIOiWTol7mCjhVqmgVN1D9PDSwLRIeREJt';
      s += 'm/if8YsbFy2IVexGr8Hjb6piZeQXJiPsVLOW9lOibZqm2iCfKaMYD6lt1sSJBjTH0nN5a0+Y7DwFHmRq';
      s += 'rMorHVu5DpfO5yl0/COm14+l1lmbUl1ZxWjzpKqZUrSoj2sqE9yxInUrM4o0KNC3Rf03KL1DVsB0+uSZ';
      s += 'ca6qJi+PZXBsBDYUYsWdHtXqPEGh8mDBdy4Mce+1YVKzKo5UA7nyYkzesaxb9g/aJWLJq13UQZK3dlGt';
      s += 'Jg4duGP5fjq1qe2qdmyw4bK3ntWKx3S+kuMa/tRuWtlXKWzpO63dQ6nTJ2WfS0rd+4mwK27or45sQQ0T';
      s += 'OduZ5YvtmUz7+0TVK+w7ShJjtXzr/NR+l5RlZ9mHWznULtCfgVc8sk2B9w7M0XnIMtRXiXYEUtV92F73';
      s += 'XkTyIpeLdZiNNBl1p/9XjDIH3cqUiiMCIqQ2ONNt6IY4467shjjz7+CGSQBxQAADs=';

      const qr = qrcode(4, 'L');
      qr.addData('あいう澤', 'Kanji');
      qr.addData('abcあいう①', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });
  });
};

export const utf8 = function(qrcode) {
  describe('QRCode', function(){
    it('correct qr', function(){

      let s = '';
      s += 'data:image/gif;base64,R0lGODdhcgByAIAAAAAAAP///ywAAAAAcgByAAAC/4yPqcvtD6OctNqLs9';
      s += '68+w+G4kiW5omm6sq2bgXE8jwrsVEHty7bAEKjAX+8oZEXDFKSSR+uV0QSj0/mcfe8MoUT7GK35Waj4G';
      s += 'mirIxWoV5n1+wO58blcbypltYb7Qeabfa35uCVRheIl/O3J7FIVPgI2Eelh2hXKUjGNckXqRh5OKfpNt';
      s += 'iZCbnGGOF4GArVeobIWfqpVfuWCnpwewkZpjUkese76gkYrNsruwW8K/ZlrAoxq7knav3qjOrcTElaTG';
      s += 'js2iwsRbndR03tI6eLDfs+Kh/vaPXWDu+un88/r49f4lQ2dnDy0BIX6wW0g+oGGjRXreC6DL8qKSOGzF';
      s += '45ZP/9pBXTuGmZx1xpNmrb5w9DJpLPXJV7eQwix5OlliBkCZMlwZ0ReTIsOM2SzIQ05V0aZwphyWS4uA';
      s += '09F3ObLaBFP92amNHhyjwArwlVRtBXSz94pkKt6BWqN4snTTJIN1aVVGhiDRmNZRer06x31CbNmvahzr';
      s += '3gFnIti0lStqsO18KywEkuYrTPGDd8y9TmxX+Lo4asWzlz1bFBN7tcdrpmYnRUrTYmyxMmaNesMQ9W7b';
      s += 'ZTbK2dQQaOHK036gsCNRALjPPr0LmNlFJtLnluRdOE9foNig2u198ihzMvfPRvT7zCa7f1rhx7+dahkX';
      s += 'JfGg445NAm83LGHXxk0W/Qbxr/3mobW4+t1tlM8wFIFILDFHjYdA0+9xEzENnT0XCYZScURvdISBuD8a';
      s += 'i2G34HmZCbdBJ52J1rA5L4GliEifjgUh9+4OBWGNao3Gz0QdiffTDWM1mOKe5o03f1tfjiQ5ad6BNxDB';
      s += 'pIXmlEzYSgdjxG2A9goi0JYpROeWTdaCsmFh6XT3mZZZLzhbVlfryFeKaVXa5JHphuwgVnTl7mxmZydo';
      s += '1IoIwQdkhZkYoBROWdiSBJKIdXJqrXdu0wWZ2QR/K5J5JQTvpmpWe99ueGgoZzHVs4lnmifuqNqpun5y';
      s += 'XXTZIaxofYpkNSaKp/AQJ6YK37xSgHX+ORKuYGoPE3oa7J/+Jqp5Zhfopnpl02ah60pMF2l1nnqZgge7';
      s += 'flimlfgg1L4LSinXasgOCRG2qToeqYromafbmeesJaK6lkjpHVbrdIXRhcrIzBaCim9DB6aIbo/Tvurv';
      s += 'SG96ObC8764JzYksOeebiie27FZ64KKoph6gmvYlAWHDJrI3daso2atgpkowK3Jx4ryUKMbcwJV6tuQz';
      s += 'c6h7O9DxvmIsDi+unfs3Qp7PB3J9/V1ZMUpXorit/K66q5Ssu5Lc1Aloq11o/WmbHCl/2aaMROw3Dte4';
      s += 'NaKO1ySY8NMNcyKzmpxfht3PDSdu/cZtQ+V42sBxTrjKyZa3ErwuGKJu5ZtJDSHajJNaijJNDggEoeIW';
      s += 'WapzReiZY325TDMyP6a9hxStgcsUdXznXRHjtLuc22C0k74kNzum+A8OUKdrDl7p63mjCHNFjJbCr+n9';
      s += 'kvT/VzdL4W+vHQqTX1e79mqhwkdSDNm33bkTOl+4B3r0zswF0D5zisx8/ru2e0191x+c2j7JuyaY+rPL';
      s += '3hryw4/RVLPutzHvMUgsAEKnCBDGygAx8IwQhKcIIUrKAFL0iCAgAAOw==';

      const qr = qrcode(8, 'L');
      qr.addData('abcあいうĀ👏', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });
  });
};

export const misc = function(qrcode) {
  describe('QRCode', function(){
    it('mixed qr', function(){

      let s = '';
      s += 'data:image/gif;base64,R0lGODdhWgBaAIAAAAAAAP///ywAAAAAWgBaAAAC/4yPqcvtD6OctNqLs9';
      s += '68+w+G4kiW5ommHcC2rmu8QDwvLC3TjszXUp8LBG+2Wk/XAL4oRAYx6GwhYUmjr8i8Kp7LKhenTXyrWf';
      s += 'CYe5Z6reBptxlBq9P0MIIqd+PtZOHbOmbW5Xb3J4j0AziniOh3dBDouHjoVyYZGVW3M1l5yTYhh1mkuU';
      s += 'bo2QgBt/UpSGXaqoYqxhe12ahUeAuU25eolGYK3Cn8GxtX/EmcvByMbAIXiQvJqnLMC707LSvieorlKa';
      s += 'o3OMyThd19Xd65CpsOBaqoqr0+206/OkT7EMoXTp6/CeCFYm3AGYuWbU9BCwQlwcKm65FChxXk7ZHIqN';
      s += 'Q/Z//39oW5qC6PRn7S5KWKd/AKulmkMqk0lsheRH0TVxY6p8+STYoiXYoraHJgRnzLggLNONEXNWk+Nw';
      s += 'ZkNk/pzHdEf45cmvPbyXQ31b3iyYlhVl1TxyEUabSPwJoh+6Hkxw4eJbRvqbn7szJtXErNahncNg2hJb';
      s += '7kAJO0yxIrB4EPX5YFiVPvsaQGIdIraXacTsfeeo4q6jWqULKdh34WR7VjzL/1KDb1TBS2NdZ3n1p1Kf';
      s += 'sk3aBs0/bmjAHkwsS3TzsVrQGj1OO4F0lWStk288/CM3hm+zhl2eFih2O/nO1rvufUw7dW/g2jRZgeG8';
      s += 'ZF/77tevKoP9r3C7/83tmp1+Pbb/uUfx90415hgckHnGrWpcSUgY15l2ByKDXjGyePELbYhAbudJRM3p';
      s += 'jzUoMcggVhQ/S5VhmDNFmoImYk5MVihaIIww17v0knoD/NXahgV8X5uKFm7f3CC46mAVnHiRXKclZoNC';
      s += 'I3mlr3gcfjk4Bt9htkYZ2HDGP8GcJafnd1qWN6YPoVn5dMQrWamq2leSaUVno0l30iYpUakmNxGV2Klk';
      s += 'XGnp7dSamMjKDhJKEtJE5X1UaILmgiaEZyN4+A0CUk6VWUfnVlNZ5+Cmqooo5KaqmmnopqqqquGkIBAD';
      s += 's=';

      const qr = qrcode(5, 'L');
      qr.addData('012345', 'Numeric');
      qr.addData('ABC123', 'Alphanumeric');
      qr.addData('漢字', 'Kanji');
      qr.addData('abcあいう', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });

    it('img tag (for coverage)', function(){

      let s = '';
      s += '<img src="data:image/gif;base64,R0lGODdhQQBBAIAAAAAAAP///ywAAAAAQQBBAAAC/4yPqcvt';
      s += 'D6KctLYqD9428B9dmwZyRmkyqYdiZ/iQgNyx83vHNq7zeJ3x6YLBIcwGPBZjROVIqFgVpbDpc6e6Wl2+';
      s += 'bTIX1Tq5WC9FRjuihdSbebJGqtnjL538Dufe27s9sXSXBtdVdwaFiKXY5neoGBfHN5Yosjf3SJnldlkJ';
      s += 'mRjo0AQGMQl4Cdop11K6aLi6+don+BNL+xrJGkvYYzTK+wucGjxM7FlcWTIIKttqObqqfJo7/dwS7cuc';
      s += 'zYnwt6ArjKpqfL2iNy6eqZqsuVZzjes8KGyr1629a87t+D7bHI65zp+0D/X2qXOUxxRBhe4O7kqob2HE';
      s += 'hvbEPBwIrCIehJkYf2n8wuzcMVIbsXXEVIyRwnwoiamMyFLUN1vd5CHSJemiSZ0Ma9HkuDNkS3Yre4A8';
      s += '9I+lyILOOiQtCtMoUKeu7t2LuS0nvKtQw2ltFO8Tq64WbTpctm0rULMBlwrkSe8nvnRgra6Ny+vrW7u+';
      s += 'SPLbS+2pUr91r7gVDI+cwaFuowImcxhn05PGKEo2W3lgIMmTdw5GNzI0sQIAOw==" width="65" hei';
      s += 'ght="65" alt="a&lt;&gt;&quot;&amp;\'\\z"/>';

      const qr = qrcode(1, 'L');
      qr.addData('abc');
      qr.make();
      expect(capture('s', qr.createImgTag(3, 1, 'a<>"&\'\\z') ) ).to.equal(s);
    });

    it('table tag (for coverage)', function(){
      const qr = qrcode(1, 'L');
      qr.addData('{TABLE}');
      qr.make();
      expect(!!qr.createTableTag() ).to.be.true;
    });

    it('svg tag (for coverage)', function(){
      const qr = qrcode(1, 'Q');
      qr.addData('{SVG}');
      qr.make();
      expect(!!qr.createSvgTag() ).to.be.true;
    });

    it('svg tag by object (for coverage)', function(){
      const qr = qrcode(1, 'H');
      qr.addData('{SVG}');
      qr.make();
      expect(!!qr.createSvgTag({}) ).to.be.true;
    });

    it('svg tag by object (for coverage)', function(){

      let count = 0;
      const context = {
        fillStyle : '',
        fillRect : function() {
          count += 1;
        },
      };

      const qr = qrcode(1, 'H');
      qr.addData('{2d}');
      qr.make();
      qr.renderTo2dContext(context);
      expect(count).to.equal(21 * 21);
    });

    it('- (for coverage)', function(){
      const qr = qrcode(3, 'H');
      qr.addData('A\u0020$%*+-./:Z', 'Alphanumeric');
      qr.addData('1234', 'Numeric');
      qr.addData('12345', 'Numeric');
      qr.addData('123456', 'Numeric');
      qr.make();
      expect(!!qr.createDataURL() ).to.be.true;
    });

    const dataURLHandler = function(dataURL) {
      expect(!!dataURL).to.be.true;
    };

    [1, 20, 27].forEach( (t) => {
      ['L', 'M', 'Q', 'H'].forEach( (e) => {
        it('addData - Numeric (for coverage)', function(){
          const qr = qrcode(t, e);
          qr.addData('1', 'Numeric');
          qr.make();
          dataURLHandler(qr.createDataURL() );
        });
        it('addData - Alphanumeric (for coverage)', function(){
          const qr = qrcode(t, e);
          qr.addData('A1', 'Alphanumeric');
          qr.make();
          dataURLHandler(qr.createDataURL() );
        });
        it('addData - Kanji (for coverage)', function(){
          const qr = qrcode(t, e);
          qr.addData('漢', 'Kanji');
          qr.make();
          dataURLHandler(qr.createDataURL() );
        });
        it('addData - Byte (for coverage)', function(){
          const qr = qrcode(t, e);
          qr.addData('A1漢', 'Byte');
          qr.make();
          dataURLHandler(qr.createDataURL() );
        });
      });
    });

  });
};
