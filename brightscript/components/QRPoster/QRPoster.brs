sub init()
	m.top.observeFieldScoped("qrcode", "onQRCodeChanged", ["width", "height", "loadWidth", "loadHeight", "loadPadding"])
	m.top.observeFieldScoped("text", "onTextChanged")
end sub

' @private
sub onQRCodeChanged(msg as object)
	qrcode = msg.getData()

	if qrcode <> invalid
		if qrcode.status = "ready"
			toPNG(qrcode, msg.getInfo())
		end if
	else
		m.top.uri = ""
	end if
end sub

' @private
sub onTextChanged(msg as object)
	qrcode = createObject("roSGNode", "QRCode")	
	qrcode.callFunc("addData", msg.getData())
	qrcode.callFunc("make")

	m.top.qrcode = qrcode
end sub

' @private
function toPNG(qrcode as object, params as object) as string
	if params = invalid or params.loadWidth = invalid or params.loadHeight = invalid
		m.top.loadStatus = "failed"
		return ""
	end if

	padding = params.loadPadding
	if padding = invalid
		padding = 0
	end if

	' Calculate sizes and coords
	moduleCount = qrcode.moduleCount
	maxSize = fix(params.loadWidth - padding - padding)

	if params.loadWidth > params.loadHeight
		maxSize = fix(params.loadHeight - padding - padding)
	end if

	if maxSize < moduleCount
		m.top.loadStatus = "failed"
		return ""
	end if

	cellSize = maxSize \ moduleCount
	size = cellSize * moduleCount
	center = size \ 2
	left = (fix(params.loadWidth - padding - padding) \ 2) - center + padding
	top = (fix(params.loadHeight - padding - padding) \ 2) - center + padding

	' Prepare colors
	white = &Hffffffff
	black = &H000000ff

	' Prepare bitmap
	if params.AlphaEnable = invalid
		params.AlphaEnable = false
	end if

	if params.name = invalid
		params.name = "QRCode"
	end if

	bitmap = createObject("roBitmap", {
		name: params.name
		width: params.loadWidth
		height: params.loadHeight
		AlphaEnable: params.AlphaEnable
	})
	bitmap.clear(white)

	' Gather bytes to use for unique file name
	ba = CreateObject("roByteArray")
	ba.setResize(moduleCount * moduleCount / 8, false)

	' Render QRCode to bitmap
	y = top

	bits = 0
	byte = 0
	byteIndex = 0

	for row = 0 to moduleCount - 1 step 1
		x = left
		for col = 0 to moduleCount - 1 step 1
			if qrcode.callFunc("isDark", row, col)
				bitmap.drawRect(x, y, cellSize, cellSize, black)
			else
				byte = byte or 1
			end if

			byte = byte << 1
			bits += 1
			if bits >= 8
				ba[byteIndex] = byte
				byteIndex += 1
				' bslint gets confused by these two
				' bs:disable-next-line
				bits = 0
				' bs:disable-next-line
				byte = 0
			end if

			x += cellSize
		end for

		y += cellSize
	end for
	bitmap.finish()

	' Prepare hash sum use as a file name
	digest = CreateObject("roEVPDigest")
	digest.setup("md5")

	' Prepare file name
	fileName = "tmp:/" + digest.process(ba) + ".png"

	' Save bitmap to file
	pngData = bitmap.getPNG(0, 0, params.loadWidth, params.loadHeight)
	pngData.writeFile(fileName)

	m.top.uri = fileName

	' Update width and height if they were not set
	if params.width = 0
		m.top.width = params.loadWidth
	end if

	if params.height = 0
		m.top.height = params.loadHeight
	end if

	return fileName
end function