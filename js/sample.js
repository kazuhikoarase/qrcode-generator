var downloadFileName, downloadType, downloadData;

var body_loadHander = function() {

  var crtOpt = function(value, label) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(label) );
    opt.value = value;
    return opt;
  };

  var t = document.forms['qrForm'].elements['t'];
  t.appendChild(crtOpt('' + 0, 'Auto') );
  for (var i = 1; i <= 40; i += 1) {
    t.appendChild(crtOpt('' + i, '' + i) );
  }
  t.value = '0';

  var form = document.forms['qrForm'];
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
  update_qrcode();

  document.getElementById("download").addEventListener("click", function () {
    if (downloadData)
      download(downloadFileName, downloadType, downloadData);
  });
};

var draw_qrcode = function(text, typeNumber, errorCorrectionLevel) {
  document.write(create_qrcode(text, typeNumber, errorCorrectionLevel) );
};

var create_qrcode = function(text, typeNumber, cellsize, padding, errorCorrectionLevel, mode, mb, format, fg, bg) {

  if (!mode) {
    if (text.match(/^[0-9]+$/))
      mode = "Numeric";
    else if (text.match(/^[0-9A-Z $%*+/.:-]+$/))
      mode = "Alphanumeric";
    else
      mode = "Byte";
  }

  var info = document.getElementById("qr-info");
  downloadData = undefined;

  var showLength = function (len) {
    if (len < 1024)
      len += " B";
    else if (len < 10240)
      len = Math.round(len * 100 / 1024) / 100 + " KiB";
    else
      len = Math.round(len * 10 / 1024) / 10 + " KiB";
    info.innerHTML +=  ", file size: <b>" + len + "</b>";
  };

  try {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs[mb];

    var qr = qrcode(typeNumber || 0, errorCorrectionLevel || 'M');
    qr.addData(text, mode);
    qr.make();
    qr.setColors(fg, bg);

    var size = qr.getModuleCount() * cellsize + padding * 2;
    info.innerHTML = "Size type: <b>" + qr.getTypeNumber() + "</b>, " +
      "code columns: <b>" + qr.getModuleCount() + "</b>, " +
      "image size: <b>" + size + "x" + size + " px</b>";

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
        return "<pre style='color: " + fg + "; background: " + bg + ";'>" + downloadData + "</pre>";
      case "ascii-inv":
        downloadFileName = "qr.txt";
        downloadType = "text/plain";
        downloadData = qr.createASCII(cellsize, padding, true);
        showLength(downloadData.length);
        return "<pre style='color: " + fg + "; background: " + bg + ";'>" + downloadData + "</pre>";
      case "table":
        downloadFileName = "qr.html";
        downloadType = "text/html";
        downloadData = qr.createTableTag(cellsize, padding);
        showLength(downloadData.length);
        return downloadData;
    }
  }
  catch (error) {
    info.innerHTML = "Error: " + error;
    return "";
  }
};

var update_qrcode = function() {
  var form = document.forms['qrForm'];
  var text = form.elements['msg'].value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  var t = form.elements['t'].value;
  var cellsize = +form.elements['cellsize'].value;
  var padding = +form.elements['padding'].value * cellsize;
  var e = form.elements['e'].value;
  var m = form.elements['m'].value;
  var mb = form.elements['mb'].value;
  var format = form.elements['format'].value;
  var fg = form.elements['foreground'].value;
  var bg = form.elements['background'].value;
  document.getElementById("length").innerHTML = "(" + text.length + " characters)";
  document.getElementById('qr').innerHTML = create_qrcode(text, t, cellsize, padding, e, m, mb, format, fg, bg);
};

// Source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, mimeType, text) {
  var element = document.createElement("a");
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
