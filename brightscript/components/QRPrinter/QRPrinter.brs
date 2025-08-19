sub init()
	m.top.observeFieldScoped("qrcode", "onQRCodeChanged")
	m.top.observeFieldScoped("text", "onTextChanged")
end sub

' @private
sub onQRCodeChanged(msg as object)
	qrcode = msg.getData()

	if qrcode <> invalid
		if qrcode.status = "ready"
			m.top.qrstring = toASCII(qrcode, m.top.cellSize, m.top.padding)
		end if
	else
		m.top.qrstring = ""
	end if
end sub

' @private
sub onTextChanged(msg as object)
	qrcode = createObject("roSGNode", "QRCode")	
	qrcode.callFunc("addData", msg.getData())
	qrcode.callFunc("make")

	m.top.qrcode = qrcode
end sub

' @public
function toASCII(qrcode as object, cellSize = 1 as integer, padding = 1 as integer) as string
	if cellSize < 1
		cellSize = 1
	end if

	if cellSize < 2
		return toHalfASCII(qrcode, padding)
	end if

	cellSize -= 1

	if padding < 0
		padding = cellSize * 2
	end if

	size = (qrcode.moduleCount * cellSize) + (padding * 2)
	min = padding
	max = size - padding

	white = String(cellSize, "██")
	black = String(cellSize, "  ")

	ascii = ""
	line = ""
	NL = chr(10)

	for y = 0 to size - 1 step 1
		r = fix((y - min) / cellSize)
		line = ""
		for x = 0 to size - 1 step 1
			p = 1

			if min <= x and x < max and min <= y and y < max and qrcode.callFunc("isDark", r, (x - min) \ cellSize)
				p = 0
			end if

			' Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
			if p = 1
				line += white
			else
				line += black
			end if
		end for

		for r = 0 to cellSize - 1 step 1
			ascii += line + NL
		end for
	end for

	return ascii.left(ascii.len() - 1)
end function

' @private
function toHalfASCII(qrcode as object, padding = 1 as integer) as string
	cellSize = 1

	if padding < 0
		padding = 2
	end if

	size = (qrcode.moduleCount * cellSize) + (padding * 2)
	min = padding
	max = size - padding

	blocks = {
		"██": "█"
		"█ ": "▀"
		" █": "▄"
		"  ": " "
	}

	blocksLastLineNoPadding = {
		"██": "▀"
		"█ ": "▀"
		" █": " "
		"  ": " "
	}

	white = "█"
	black = " "

	ascii = ""
	NL = chr(10)

	for y = 0 to size - 1 step 2
		r1 = fix((y - min) / cellSize)
		r2 = fix((y + 1 - min) / cellSize)
		for x = 0 to size - 1 step 1
			p = white

			if min <= x and x < max and min <= y and y < max and qrcode.callFunc("isDark", r1, fix((x - min) / cellSize))
				p = black
			end if

			if min <= x and x < max and min <= y + 1 and y + 1 < max and qrcode.callFunc("isDark", r2, fix((x - min) / cellSize))
				p += black
			else
				p += white
			end if

			' Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
			if padding < 1 and y + 1 >= max
				ascii += blocksLastLineNoPadding[p]
			else
				ascii += blocks[p]
			end if
		end for

		ascii += NL
	end for

	if size mod 2 <> 0 and padding > 0
		return ascii.left(ascii.len() - size - 1) + String(size, "▀")
	end if

	return ascii.left(ascii.len() - 1)
end function