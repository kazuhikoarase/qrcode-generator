import { expect } from "@open-wc/testing";
import { capture } from './capture.js';

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
      //capture('s', qr.createDataURL() );
      expect(qr.createDataURL() ).to.equal(s);
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
      //capture('s', qr.createDataURL() );
      expect(qr.createDataURL() ).to.equal(s);
    });
  });
};
