' BrightScript does not provide bitwise `not`, so we need own implementation
' "namespaced" to avoid conflicts
function qrNOT(a as integer) as integer
	return &HFFFFFFFF - a
end function

' BrightScript does not provide bitwise `xor`, so we need own implementation
' "namespaced" to avoid conflicts
function qrXOR(a as integer, b as integer) as integer
	return (qrNOT(a and b) and (a or b))
end function

function qrMax(a, b) as dynamic
	if a >= b then return a
	return b
end function

function QRModes() as object
	return {
		MODE_NUMERIC   : 1 << 0
		MODE_ALPHANUMERIC : 1 << 1
		MODE_BYTE     : 1 << 2
		MODE_KANJI    : 1 << 3
	}
end function

function QRErrorCorrectionLevel() as object
	return {
		L: 1
		M: 0
		Q: 3
		H: 2
	}
end function

function QRMath() as object
	if m.QRMath <> invalid
		return m.QRMath
	end if

	m.QRMath = {
		EXP_TABLE: createObject("roArray", 256, false)
		LOG_TABLE: createObject("roArray", 256, false)
	}

	EXP_TABLE = m.QRMath.EXP_TABLE
	LOG_TABLE = m.QRMath.LOG_TABLE

	' initialize tables
	for i = 0 to 7 step 1
		EXP_TABLE[i] = 1 << i
	end for

	for i = 8 to 255 step 1
		EXP_TABLE[i] = qrXOR(qrXOR(qrXOR(EXP_TABLE[i - 4], EXP_TABLE[i - 5]), EXP_TABLE[i - 6]), EXP_TABLE[i - 8])
	end for

	for i = 0 to 254 step 1
		LOG_TABLE[EXP_TABLE[i]] = i
	end for

	m.QRMath.glog = function (n as integer) as dynamic
		if n < 1
			' print "ERROR: invalid n passed to glog", n
			return invalid
		end if

		return m.LOG_TABLE[n]
	end function

	m.QRMath.gexp = function (n as integer) as integer
		while n < 0
			n += 255
		end while

		while n >= 256
			n -= 255
		end while

		return m.EXP_TABLE[n]
	end function

	return m.QRMath
end function

function QRPolynomial(num as object, shift as integer) as object
	if type(num) <> "roArray"
		print "Invalid num", num, "/", shift
		return invalid
	end if

	offset = 0
	while offset < num.count() and num[offset] = 0
		offset += 1
	end while

	_numSize = num.count() - offset + shift
	_num = createObject("roArray", _numSize, false)
	for i = 0 to num.count() - offset - 1 step 1
		_num[i] = num[i + offset]
	end for

	' brs implementation does not seem to support roArray's size param
	if _num.count() < _numSize
		for i = _num.count() to _numSize - 1 step 1
			_num[i] = invalid
		end for
	end if

	result = {
		_num: _num
		QRMath: QRMath()
	}

	result.getAt = function (index as integer) as integer
		if m._num[index] = invalid
			return 0
		else
			return m._num[index]
		end if
	end function

	result.getLength = function () as integer
		return m._num.count()
	end function

	result.multiply = function (e) as object
		num = createObject("roArray", m.getLength() + e.getLength() - 1, false)

		for i = 0 to m.getLength() - 1 step 1
			for j = 0 to e.getLength() - 1 step 1
				if num[i + j] = invalid
					num[i + j] = 0
				end if
	  			num[i + j] = qrXOR(num[i + j], m.QRMath.gexp(m.QRMath.glog(m.getAt(i)) + m.QRMath.glog(e.getAt(j))))
	  		end for
	  	end for

		return QRPolynomial(num, 0)
	end function

	result.modulo = function (e) as object
		if m.getLength() - e.getLength() < 0
			return m
		end if

		ratio = m.QRMath.glog(m.getAt(0)) - m.QRMath.glog(e.getAt(0))

		num = createObject("roArray", m.getLength(), false)
		for i = 0 to m.getLength() - 1 step 1
			num[i] = m.getAt(i)
		end for

		for i = 0 to e.getLength() - 1 step 1
			num[i] = qrXOR(num[i], m.QRMath.gexp(m.QRMath.glog(e.getAt(i)) + ratio))
		end for

		' recursive call
		return QRPolynomial(num, 0).modulo(e)
	end function

	return result
end function

function QRMaskFunctions() as object
	result = {}

	result.PATTERN000 = function (i, j) as boolean
		return (i + j) MOD 2 = 0
	end function
	
	result.PATTERN001 = function (i, j) as boolean
		return i MOD 2 = 0
	end function
	
	result.PATTERN010 = function (i, j) as boolean
		return j MOD 3 = 0
	end function
	
	result.PATTERN011 = function (i, j) as boolean
		return (i + j) MOD 3 = 0
	end function
	
	result.PATTERN100 = function (i, j) as boolean
		return ((i \ 2) + (j \ 3)) MOD 2 = 0
	end function
	
	result.PATTERN101 = function (i, j) as boolean
		return ((i * j) MOD 2) + ((i * j) MOD 3) = 0
	end function
	
	result.PATTERN110 = function (i, j) as boolean
		return (((i * j) MOD 2) + ((i * j) MOD 3)) MOD 2 = 0
	end function
	
	result.PATTERN111 = function (i, j) as boolean
		return (((i * j) MOD 3) + ((i + j) MOD 2)) MOD 2 = 0
	end function

	return result
end function

function QRMaskPatterns() as object
	return QRMaskFunctions().keys()
end function

function QRUtil() as object
	if m.QRUtil <> invalid
		return m.QRUtil
	end if

	PATTERN_POSITION_TABLE = [
		[]
		[6, 18]
		[6, 22]
		[6, 26]
		[6, 30]
		[6, 34]
		[6, 22, 38]
		[6, 24, 42]
		[6, 26, 46]
		[6, 28, 50]
		[6, 30, 54]
		[6, 32, 58]
		[6, 34, 62]
		[6, 26, 46, 66]
		[6, 26, 48, 70]
		[6, 26, 50, 74]
		[6, 30, 54, 78]
		[6, 30, 56, 82]
		[6, 30, 58, 86]
		[6, 34, 62, 90]
		[6, 28, 50, 72, 94]
		[6, 26, 50, 74, 98]
		[6, 30, 54, 78, 102]
		[6, 28, 54, 80, 106]
		[6, 32, 58, 84, 110]
		[6, 30, 58, 86, 114]
		[6, 34, 62, 90, 118]
		[6, 26, 50, 74, 98, 122]
		[6, 30, 54, 78, 102, 126]
		[6, 26, 52, 78, 104, 130]
		[6, 30, 56, 82, 108, 134]
		[6, 34, 60, 86, 112, 138]
		[6, 30, 58, 86, 114, 142]
		[6, 34, 62, 90, 118, 146]
		[6, 30, 54, 78, 102, 126, 150]
		[6, 24, 50, 76, 102, 128, 154]
		[6, 28, 54, 80, 106, 132, 158]
		[6, 32, 58, 84, 110, 136, 162]
		[6, 26, 54, 82, 110, 138, 166]
		[6, 30, 58, 86, 114, 142, 170]
	]

	G15 = (1 << 10) or (1 << 8) or (1 << 5) or (1 << 4) or (1 << 2) or (1 << 1) or (1 << 0)
	G18 = (1 << 12) or (1 << 11) or (1 << 10) or (1 << 9) or (1 << 8) or (1 << 5) or (1 << 2) or (1 << 0)
	G15_MASK = (1 << 14) or (1 << 12) or (1 << 10) or (1 << 4) or (1 << 1)

	util = {
		PATTERN_POSITION_TABLE: PATTERN_POSITION_TABLE
		G15: G15
		G18: G18
		G15_MASK: G15_MASK
		QRMath: QRMath()
	}

	m.QRUtil = util

	util.getBCHDigit = function (data as integer) as integer
		digit = 0
		data = abs(data)
		while data <> 0
			digit += 1
			data >>= 1
		end while
		return digit
	end function

	util.G15_BCHDigit = util.getBCHDigit(util.G15)
	util.G18_BCHDigit = util.getBCHDigit(util.G18)

	util.getBCHTypeInfo = function (data as integer) as integer
	  d = data << 10
	  while m.getBCHDigit(d) - m.G15_BCHDigit >= 0
		d = qrXOR(d, (m.G15 << (m.getBCHDigit(d) - m.G15_BCHDigit)))
	  end while
	  return qrXOR((data << 10) or d, m.G15_MASK)
	end function

	util.getBCHTypeNumber = function (data as integer) as integer
		d = data << 12
		while m.getBCHDigit(d) - m.G18_BCHDigit >= 0
			d = qrXOR(d, (m.G18 << (m.getBCHDigit(d) - m.G18_BCHDigit)))
		end while
		return (data << 12) or d
	end function

	util.getPatternPosition = function (typeNumber as integer) as object
		return m.PATTERN_POSITION_TABLE[typeNumber - 1]
	end function

	util.getMaskFunction = function (maskPattern as integer) as function
		masks = QRMaskFunctions()
		patterns = QRMaskPatterns()

		maskId = patterns[maskPattern]
		if maskId = invalid or masks[maskId] = invalid
			print "Invalid maskPattern", maskPattern
			return function(i, j) as boolean
				print "Invalid maskPattern used"
				return false
			end function
		end if

		return masks[maskId]
	end function

	util.getErrorCorrectPolynomial = function (errorCorrectLength as integer) as object
		a = QRPolynomial([1], 0)
		for i = 0 to errorCorrectLength - 1 step 1
			a = a.multiply(QRPolynomial([1, m.QRMath.gexp(i)], 0))
		end for
		return a
	end function

	util.getLengthInBits = function (mode as integer, type as integer) as integer
		modes = QRModes()

		if 1 <= type and type < 10
			' 1 - 9
			if mode = modes.MODE_NUMERIC then return 10
			if mode = modes.MODE_ALPHANUMERIC then return 9
			if mode = modes.MODE_BYTE then return 8
			if mode = modes.MODE_KANJI then return 8
		else if type < 27
			' 10 - 26
			if mode = modes.MODE_NUMERIC then return 12
			if mode = modes.MODE_ALPHANUMERIC then return 11
			if mode = modes.MODE_BYTE then return 16
			if mode = modes.MODE_KANJI then return 10
		else if type < 41
			' 27 - 40
			if mode = modes.MODE_NUMERIC then return 14
			if mode = modes.MODE_ALPHANUMERIC then return 13
			if mode = modes.MODE_BYTE then return 16
			if mode = modes.MODE_KANJI then return 12
		end if

		print "Invalid mode and/or type", mode, type
		return 0
	end function

	util.getLostPoint = function (qrcode as object) as float
		moduleCount = qrcode.moduleCount
		lostPoint = 0

		' LEVEL1

		for row = 0 to moduleCount - 1 step 1
			for col = 0 to moduleCount - 1 step 1
				sameCount = 0
				dark = qrcode.callFunc("isDark", row, col)

				for r = -1 to 1 step 1
					rowR = row + r

					if rowR >= 0 and moduleCount > rowR

						for c = -1 to 1 step 1
							colC = col + c

							if colC >= 0 and moduleCount > colC and (r <> 0 or c <> 0)
								if dark = qrcode.callFunc("isDark", rowR, colC)
									sameCount += 1
								end if

								if sameCount > 5
									lostPoint += (3 + sameCount - 5)
								end if
							end if
						end for

					end if
				end for
			end for
		end for

		' LEVEL2

		for row = 0 to moduleCount - 2 step 1
			for col = 0 to moduleCount - 2 step 1
				count = 0
				if qrcode.callFunc("isDark", row, col) then count += 1
				if qrcode.callFunc("isDark", row + 1, col) then count += 1
				if qrcode.callFunc("isDark", row, col + 1) then count += 1
				if qrcode.callFunc("isDark", row + 1, col + 1) then count += 1
				if count = 0 or count = 4
					lostPoint += 3
		  		end if
			end for
		end for

		' LEVEL3

		for row = 0 to moduleCount - 1 step 1
			for col = 0 to moduleCount - 7 step 1
				lost =              qrcode.callFunc("isDark", row, col)
				lost = lost and not qrcode.callFunc("isDark", row, col + 1)
				lost = lost and     qrcode.callFunc("isDark", row, col + 2)
				lost = lost and     qrcode.callFunc("isDark", row, col + 3)
				lost = lost and     qrcode.callFunc("isDark", row, col + 4)
				lost = lost and not qrcode.callFunc("isDark", row, col + 5)
				lost = lost and     qrcode.callFunc("isDark", row, col + 6)
				if lost
					lostPoint += 40
		  		end if
			end for
		end for

		for col = 0 to moduleCount - 1 step 1
			for row = 0 to moduleCount - 7 step 1
				lost =              qrcode.callFunc("isDark", row, col)
				lost = lost and not qrcode.callFunc("isDark", row + 1, col)
				lost = lost and     qrcode.callFunc("isDark", row + 2, col)
				lost = lost and     qrcode.callFunc("isDark", row + 3, col)
				lost = lost and     qrcode.callFunc("isDark", row + 4, col)
				lost = lost and not qrcode.callFunc("isDark", row + 5, col)
				lost = lost and     qrcode.callFunc("isDark", row + 6, col)
				if lost
					lostPoint += 40
		  		end if
			end for
		end for

		' LEVEL4

		darkCount = 0

		for col = 0 to moduleCount - 1 step 1
			for row = 0 to moduleCount - 1 step 1
				if qrcode.callFunc("isDark", row, col)
					darkCount += 1
				end if
			end for
		end for

		ratio = abs((100 * darkCount) / moduleCount / (moduleCount - 50)) / 5
		lostPoint += ratio * 10

		return lostPoint
	end function

	return util
end function

function QRRSBlock() as object
	if m.QRRSBlock = invalid
		m.QRRSBlock = {
			qrrsblock: createObject("roSGNode", "QRRSBlock")
			getRSBlocks: function(typeNumber as integer, errorCorrectionLevel as string) as object
				return m.qrrsblock.callFunc("getRSBlocks", typeNumber, errorCorrectionLevel)
			end function
		}
	end if

	return m.QRRSBlock
end function

function QRBitBuffer() as object
	return {
		buffer: createObject("roSGNode", "QRBitBuffer")
		getBuffer: function() as object
			return m.buffer.callFunc("getBuffer")
		end function
		getBit: function(index as integer) as integer
			return m.buffer.callFunc("getBit", index)
		end function
		getLengthInBits: function() as integer
			return m.buffer.callFunc("getLengthInBits")
		end function
		put: sub(num as integer, length as integer)
			m.buffer.callFunc("put", num, length)
		end sub
		pushBit: sub(isSet as boolean)
			m.buffer.callFunc("pushBit", isSet)
		end sub
	}
end function

function QRCode(typeNumber = 0 as integer, errorCorrectionLevel = "Q" as string) as object
	qrcode = createObject("roSGNode", "QRCode")
	qrcode.setFields({
		typeNumber: typeNumber
		errorCorrectionLevel: errorCorrectionLevel
	})
	return {
		qrcode: qrcode
		addData: function(data as string, typeName = "BYTE" as string) as boolean
			return m.qrcode.callFunc("addData", data, type)
		end function
		make: sub()
			m.qrcode.callFunc("make")
		end sub
	}
end function