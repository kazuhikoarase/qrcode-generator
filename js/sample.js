var downloadFileName, downloadType, downloadData;

var body_loadHander = function () {
	let form = document.forms['qrForm'];
	form.elements['trim'].addEventListener("click", update_qrcode);
	form.elements['msg'].addEventListener("input", update_qrcode);
	form.elements['t'].addEventListener("change", update_qrcode);
	form.elements['cellsize'].addEventListener("input", update_qrcode);
	form.elements['padding'].addEventListener("input", update_qrcode);
	form.elements['e'].addEventListener("change", update_qrcode);
	form.elements['m'].addEventListener("change", update_qrcode);
	form.elements['mb'].addEventListener("change", update_qrcode);
	form.elements['format'].addEventListener("change", update_qrcode);
	form.elements['foreground'].addEventListener("change", update_qrcode);
	form.elements['background'].addEventListener("change", update_qrcode);
	form.elements['mask'].addEventListener("change", update_qrcode);
	update_qrcode();

	document.getElementById("download").addEventListener("click", function () {
		if (downloadData)
			download(downloadFileName, downloadType, downloadData);
	});
};

var draw_qrcode = function (text, typeNumber, errorCorrectionLevel) {
	document.write(create_qrcode(text, typeNumber, errorCorrectionLevel));
};

var create_qrcode = function (text, typeNumber, cellsize, padding, errorCorrectionLevel, mode, mb, format, fg, bg, mask) {
	if (!mode) {
		if (text.match(/^[0-9]+$/))
			mode = "Numeric";
		else if (text.match(/^[0-9A-Z $%*+/.:-]+$/))
			mode = "Alphanumeric";
		else
			mode = "Byte";
	}

	let info = document.getElementById("qr-info");
	downloadData = undefined;

	var showLength = function (len) {
		if (len < 1024)
			len += " B";
		else if (len < 10240)
			len = Math.round(len * 100 / 1024) / 100 + " KiB";
		else
			len = Math.round(len * 10 / 1024) / 10 + " KiB";
		info.innerHTML += ", file size: <b>" + len + "</b>";
	};

	try {
		qrcode.stringToBytes = qrcode.stringToBytesFuncs[mb];

		let qr = qrcode(typeNumber || 0, errorCorrectionLevel || 'M');
		if (mask > 0)
			qr.setMaskPattern(mask - 1);
		qr.addData(text, mode);
		qr.make();
		qr.setColors(fg, bg);

		let maskPattern = qr.getMaskPattern();
		let bestMaskPattern = qr.getBestMaskPattern();
		let scores = qr.getMaskPatternPenaltyScores();
		let minScore = Math.min.apply(null, scores);
		let maskField = document.forms['qrForm'].elements['mask'];
		for (let i = 0; i <= 8; i++) {
			if (i === 0) {
				maskField.children[i].textContent = "Best (" + (bestMaskPattern + 1) + ")";
			}
			else if (scores[i - 1] === minScore) {
				maskField.children[i].textContent = i + " (best)";
			}
			else {
				let worse = scores[i - 1] / minScore - 1;
				maskField.children[i].textContent = i + " (" + (Math.round(worse * 1000) / 10) + "% worse)";
			}
		}

		let size = qr.getModuleCount() * cellsize + padding * 2;
		info.innerHTML = "Size type: <b>" + qr.getTypeNumber() + "</b>, " +
			"code columns: <b>" + qr.getModuleCount() + "</b>, " +
			"filled blocks: <b>" + qr.getDarkCount() + "</b> (" + Math.round(qr.getDarkCount() / (qr.getModuleCount() * qr.getModuleCount()) * 100) + "%)<br>" +
			"Image size: <b>" + size + "x" + size + " px</b>";

		switch (format) {
			case "svg":
				downloadFileName = "qr.svg";
				downloadType = "image/svg";
				downloadData = qr.createSvgTag(cellsize, padding);
				showLength(downloadData.length);
				return downloadData;
			case "gif":
			case "png":
			case "webp":
			case "jpeg":
				var canvas = document.createElement("canvas");
				canvas.width = canvas.height = qr.getModuleCount() * cellsize + padding * 2;
				var context = canvas.getContext("2d");
				qr.renderTo2dContext(context, cellsize, padding);
				downloadFileName = "qr." + format;
				downloadType = "";   // raw download data URL
				downloadData = canvas.toDataURL("image/" + format);
				showLength(downloadData.replace(/^data:image\/[a-z]+;base64,/, "").length * 3 / 4);
				var warning = "";
				var m = downloadData.match(/^data:image\/([a-z0-9]+)/);
				if (m && m[1] !== format)
					warning = "<br><br><strong>Attention:</strong> This browser cannot generate " +
						format.toUpperCase() + " images and made a " + m[1].toUpperCase() + " instead.";
				return '<img src="' + downloadData + '" width="' + canvas.width + '" height="' + canvas.height + '">' + warning;
			case "gif-direct":
				downloadFileName = "qr.gif";
				downloadType = "";   // raw download data URL
				downloadData = qr.createDataURL(cellsize, padding);
				showLength(downloadData.replace(/^data:image\/[a-z]+;base64,/, "").length * 3 / 4);
				return qr.createImgTag(cellsize, padding);
			case "ascii":
				downloadFileName = "qr.txt";
				downloadType = "text/plain";
				downloadData = qr.createASCII(cellsize, padding);
				showLength(downloadData.length);
				return "<pre style='color: " + fg + "; background: " + bg + "; font-family: monospace;'>" + downloadData + "</pre>";
			case "ascii-inv":
				downloadFileName = "qr.txt";
				downloadType = "text/plain";
				downloadData = qr.createASCII(cellsize, padding, true);
				showLength(downloadData.length);
				return "<pre style='color: " + fg + "; background: " + bg + "; font-family: monospace;'>" + downloadData + "</pre>";
			case "table":
				downloadFileName = "qr.html";
				downloadType = "text/html";
				downloadData = qr.createTableTag(cellsize, padding);
				showLength(downloadData.length);
				return downloadData;
		}
	}
	catch (error) {
		console.error(error);
		info.innerHTML = "Error: " + error;
		return "";
	}
};

var update_qrcode = function () {
	let form = document.forms['qrForm'];
	let trim = form.elements['trim'].checked;
	let text = form.elements['msg'].value;
	if (trim)
		text = text.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');   // U+3000 Ideographic Space
	let t = form.elements['t'].value;
	let cellsize = +form.elements['cellsize'].value;
	let padding = +form.elements['padding'].value * cellsize;
	let e = form.elements['e'].value;
	let m = form.elements['m'].value;
	let mb = form.elements['mb'].value;
	let format = form.elements['format'].value;
	let fg = form.elements['foreground'].value;
	let bg = form.elements['background'].value;
	let mask = form.elements['mask'].value;
	document.getElementById("length").innerHTML = "(" + text.length + " characters)";
	document.getElementById('qr').innerHTML = create_qrcode(text, t, cellsize, padding, e, m, mb, format, fg, bg, mask);
};

// Source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, mimeType, text) {
	let element = document.createElement("a");
	if (downloadType)
		element.setAttribute("href", "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(text));
	else
		element.setAttribute("href", text);
	element.setAttribute("download", filename);
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
