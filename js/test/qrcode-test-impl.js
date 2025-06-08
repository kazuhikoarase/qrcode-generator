import { expect } from "@open-wc/testing";


const limit = 76;

const debug = false;

export const capture = function(name, s) {
  let code = '';
  const println = function(s) { code += s + '\n'; };
  let line = s;
  println('let ' + name + ' = \'\';');
  while (line.length > limit) {
    println(name + ' += \'' + line.substring(0, limit) + '\';');
    line = line.substring(limit);
  }
  if (line.length > 0) {
    println(name + ' += \'' + line + '\';');
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
      s += 'data:image/gif;base64,R0lGODdhUgBSAIAAAAAAAP///ywAAAAAUgBSAAAC/4yPqcvtD6OctN';
      s += 'qLs968+w+G4kiW5mkC6sqyhsq4ATyvUIvbU56/QKyjyRw8HIUG9CGKv4Ow6XsSoRHkQuosLptWmV';
      s += 'XxfTy9XJ2ytuVtz0b0rkyOUrHyNhsepN7w2Hb47ldWJ/g2CJiXVBN4SFfFRyh3BvbY9yjpaOgWqZ';
      s += 'kw1nKX+dcgyqjXiahoSsq5N5UJVBm2ujrJVAnqdptrS3vKi6sbTNlzEpc61YtSSzh0ZTbSbJe1Cc';
      s += 's8N3z0LH2IbL2W2rzH9L3MPYpK7Tg+7RxrmgZ5/NbF+57lXt0oEV3fbb6sL4MsbfHWXQplL1s5dv';
      s += 'TUsIMX0JU8Y6Ui7uIXTgyeTf/0Bln01PDZvmvwcE3yiO2eSEwPJ8b75tDhK5a6UEpr9OuUwl2X6p';
      s += 'HklJNchY5AUWUsqfLoBaIh/7W7tm0DGVFKORZUlXDexqf+eLY8qO7TuaYXsy6SNzIqUqvpAFpL1j';
      s += 'Km2GpOIb5kiXLmQk/57o40Cc5b0rloC2OoGRiwwcJVwwZ1efZkYl9Z3S6eKpaqJco72zK2B9KoaL';
      s += 'g9V/JLJJet4UKBB8r0apOwhtCuiSnuB20rsJVrJ4OdrdtrY4wELdw0HXzvML5DCWdkTrdsINJLr+';
      s += 'Jzppz6TrLQdXJe3W3xb5UV31bW+Hi86tTgWaPGWvr1wN6tzoHFqeVrUeqhzdFl9tsaMY1JdpYx7F';
      s += 'kmIG/2TcYdaClJppdGCCGlWV7YDbZdZlhddldI2nkX2WDH3QeVgn8taGBy3i0EnEQpeiYUfdXlVF';
      s += 'tX16mFni0kziKaVQMqA2SQQg5JZJFGHolkkkouySSSBQAAOw==';

      const qr = qrcode(4, 'L');
      qr.addData('あいう', 'Kanji');
      qr.addData('abcあいう', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });
  });
};

export const utf8 = function(qrcode) {
  describe('QRCode', function(){
    it('correct qr', function(){

      let s = '';
      s += 'data:image/gif;base64,R0lGODdhcgByAIAAAAAAAP///ywAAAAAcgByAAAC/4yPqcvtD6OctN';
      s += 'qLs968+w+G4kiW5omm6sq2bgXE8jwjsUEDuB7UyX3I+XbEIK8oFFKSORuv2XvKFMBd0lnMRq3Mas';
      s += 'RLlQ6jXqBZyjhDyzRteHlcqKdGNhItF7e3dTr4Fwcxd4ZFpufANkbY59OotygxiHc3hxgHdee05v';
      s += 'c4+dWZyYcpGsjHZVlpSuoIx7X4uhdaeNrgCLnK2Wp4y2o0u6vkqzr6Buz2IKnVq3zZ1cw8Vrypm+';
      s += 'aZGhpt+GunevwrWFrIrYiXTb7t6S0c6QyLXQ7/Lk/qygTXPu9Ov6/f33mVwla4PsU0wfvz5wWga3';
      s += 'kQluplbiCHLvXILVtoT1utXP/80n0CSJGRx4p7shnMNxJZs0ScHJIM4xBWzJWHJrA0yJBSLIIYdc';
      s += 'KkSevewYdE9R3L2VPjtG4fhxbkyYto0IY1lybcmCwptIzn1g2TCgwgu6wnveLTyAydtHYS81Sz+s';
      s += 'zrT5w7b9Hlxu5tSWtx9d6lIwtj17xulQYjSdbw1Kfi2lqqRkts2JaAFaMtvBYDsY4WhzIMGbieaB';
      s += 'g733XW+TljaGOsLdy8PDXkKLvCJJ++8Doiy01dr0p6vZh04Kt+v+KdfHwwU8JRhW5FZxuoWceYly';
      s += 'N3KpjmOO3SjxNWJ7sm3fG1uZf1rlJm5ZflI1f+nTK4OlSei9bF3jsYcdhym0L/5IjUWvn9dZF8/g';
      s += 'GIoIGNDSjSUmVpdt+CEXb0IFU+GRdfeu/FFd08Clp2UYEZ/PfYdHO11yBHq02U4EZqabUPYnzNN6';
      s += 'IzF5pmo4nTgcafazmmhppqX0EnpElY9dVfhZABciJSM2mgHI1GfsPUfy7BCKF7QToIVVXrwWhUki';
      s += 'ppiQtI9l045WVh0phZldRt+eWTuDBm2H5tXgmOjHRaCdZ5X9JH4GFdyshbWwKdZSeYbMkJn5n7Hf';
      s += 'rjmyneyGSKkqWlI3vkjbWXgbvl+CKmmooEoaOGIvmpnihSKSKnhZYoKms80saopKqeuNVZowVYKZ';
      s += 'k+XspTrqDKKp6Lg+LGF6RN/xbrXocYBqpLqq0dq9s/Gz5nqa0o+lZseFdyO2qhid45UGqmtingfc';
      s += 'rapG6c1HWG53XkJaftbKVZV+Fmn8I7o5h5WgfXh+sOtxeQyILX6ZxHjkawQLHVi6pH9sKZroi3pb';
      s += 'kkpjNtNyrFbub2p4b0poIxljFeN7K2mz5bJ8TfcjdxsMKVqZ+gUUWZVFYkztwoZQwyjC+IBceDLM';
      s += 'fVoafkyYheu8HPvQ65cKX7Dk2lj7iizKG1oUKNbdL/5jusesrRS+TVrpZLdJrA5dytzUievaR6sP';
      s += 'Yo9NRbgxORn1wSShmg2dJJX7yQ0sqWwBsCO27RKfW8J4JrN6syu7TBGS+Zt7Dp7XKkj7YoN90Pr5';
      s += 'Y437xannbfUXvob3WAK124ond/LOjXqq+KtZyxVi4vu7uCwjWGpsY8Nc4lwhVixN66LWzMzCVsJr';
      s += 'TZ8Tl81iVLKLaKuTs/OutA/xswwI73O2uyWgddcenFkSw98iw3r7uxO9+aHcKqvkxNYe9fH7/384';
      s += 'MVeu3i+z05300IfR/6SXi8Ri20OQ9HlFKIAx8IwQhKcIIUrKAFL4jBDGpwgxzsIAkKAAA7';

      const qr = qrcode(8, 'L');
      qr.addData('abcあいう👏', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });
  });
};

export const misc = function(qrcode) {
  describe('QRCode', function(){
    it('mixed qr', function(){

      let s = '';
      s += 'data:image/gif;base64,R0lGODdhWgBaAIAAAAAAAP///ywAAAAAWgBaAAAC/4yPqcvtD6OctN';
      s += 'qLs968+w+G4kiW5ommHcC2rmu8QDwvLC3TjszXUp8LBG+2Wk/XAL4oRAYx6GwhYUmjr8i8Kp7LKh';
      s += 'enTXyrWfCYe5Z6reBptxlBq9P0MIIqd+PtZOHbOmbW5Xb3J4j0AziniOh3dBDouHjoVyYZGVW3M1';
      s += 'l5yTYhh1mkuUbo2QgBt/UpSGXaqoYqxhe12ahUeAuU25eolGYK3Cn8GxtX/EmcvByMbAIXiQvJqn';
      s += 'LMC707LSvieorlKao3OMyThd19Xd65CpsOBaqoqr0+206/OkT7EMoXTp6/CeCFYm3AGYuWbU9BCw';
      s += 'QlwcKm65FChxXk7ZHIqNQ/Z//39oW5qC6PRn7S5KWKd/AKulmkMqk0lsheRH0TVxY6p8+STYoiXY';
      s += 'oraHJgRnzLggLNONEXNWk+NwZkNk/pzHdEf45cmvPbyXQ31b3iyYlhVl1TxyEUabSPwJoh+6Hkxw';
      s += '4eJbRvqbn7szJtXErNahncNg2hJb7kAJO0yxIrB4EPX5YFiVPvsaQGIdIraXacTsfeeo4q6jWqUL';
      s += 'Kdh34WR7VjzL/1KDb1TBS2NdZ3n1p1Kfsk3aBs0/bmjAHkwsS3TzsVrQGj1OO4F0lWStk288/CM3';
      s += 'hm+zhl2eFih2O/nO1rvufUw7dW/g2jRZgeG8ZF/77tevKoP9r3C7/83tmp1+Pbb/uUfx90415hgc';
      s += 'kHnGrWpcSUgY15l2ByKDXjGyePELbYhAbudJRM3pjzUoMcggVhQ/S5VhmDNFmoImYk5MVihaIIww';
      s += '17v0knoD/NXahgV8X5uKFm7f3CC46mAVnHiRXKclZoNCI3mlr3gcfjk4Bt9htkYZ2HDGP8GcJafn';
      s += 'd1qWN6YPoVn5dMQrWamq2leSaUVno0l30iYpUakmNxGV2KlkXGnp7dSamMjKDhJKEtJE5X1UaILm';
      s += 'giaEZyN4+A0CUk6VWUfnVlNZ5+Cmqooo5KaqmmnopqqqquGkIBADs=';

      const qr = qrcode(5, 'L');
      qr.addData('012345', 'Numeric');
      qr.addData('ABC123', 'Alphanumeric');
      qr.addData('漢字', 'Kanji');
      qr.addData('abcあいう', 'Byte');
      qr.make();
      expect(capture('s', qr.createDataURL() ) ).to.equal(s);
    });

    it('mixed qr', function(){

      let s = '';
      s += '<img src="data:image/gif;base64,R0lGODdhQQBBAIAAAAAAAP///ywAAAAAQQBBAAAC/4yP';
      s += 'qcvtD6KctLYqD9428B9dmwZyRmkyqYdiZ/iQgNyx83vHNq7zeJ3x6YLBIcwGPBZjROVIqFgVpbDp';
      s += 'c6e6Wl2+bTIX1Tq5WC9FRjuihdSbebJGqtnjL538Dufe27s9sXSXBtdVdwaFiKXY5neoGBfHN5Yo';
      s += 'sjf3SJnldlkJmRjo0AQGMQl4Cdop11K6aLi6+don+BNL+xrJGkvYYzTK+wucGjxM7FlcWTIIKttq';
      s += 'ObqqfJo7/dwS7cuczYnwt6ArjKpqfL2iNy6eqZqsuVZzjes8KGyr1629a87t+D7bHI65zp+0D/X2';
      s += 'qXOUxxRBhe4O7kqob2HEhvbEPBwIrCIehJkYf2n8wuzcMVIbsXXEVIyRwnwoiamMyFLUN1vd5CHS';
      s += 'JemiSZ0Ma9HkuDNkS3Yre4A89I+lyILOOiQtCtMoUKeu7t2LuS0nvKtQw2ltFO8Tq64WbTpctm0r';
      s += 'ULMBlwrkSe8nvnRgra6Ny+vrW7u+SPLbS+2pUr91r7gVDI+cwaFuowImcxhn05PGKEo2W3lgIMmT';
      s += 'dw5GNzI0sQIAOw==" width="65" height="65" alt="a&lt;&gt;&quot;&amp;\'\\z"/>';

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
      qr.addData('A\u0020$%*+-./:Z', 'Alphanumeric')
      qr.addData('1234', 'Numeric')
      qr.addData('12345', 'Numeric')
      qr.addData('123456', 'Numeric')
      qr.make();
      expect(!!qr.createDataURL() ).to.be.true;
    });

  });
};
