' BrightScript does not provide bitwise `not`, so we need own implementation
' "namespaced" to avoid potential conflicts
function qrNOT(a as integer) as integer
	return &HFFFFFFFF - a
end function

' BrightScript does not provide bitwise `xor`, so we need own implementation
' "namespaced" to avoid potential conflicts
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
	
	result.PATTERN001 = function (i, _j) as boolean
		return i MOD 2 = 0
	end function
	
	result.PATTERN010 = function (_i, j) as boolean
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
			return function(_i, _j) as boolean
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

	util.getLengthInBits = function (mode as integer, typeNumber as integer) as integer
		modes = QRModes()

		if 1 <= typeNumber and typeNumber < 10
			' 1 - 9
			if mode = modes.MODE_NUMERIC then return 10
			if mode = modes.MODE_ALPHANUMERIC then return 9
			if mode = modes.MODE_BYTE then return 8
			if mode = modes.MODE_KANJI then return 8
		else if typeNumber < 27
			' 10 - 26
			if mode = modes.MODE_NUMERIC then return 12
			if mode = modes.MODE_ALPHANUMERIC then return 11
			if mode = modes.MODE_BYTE then return 16
			if mode = modes.MODE_KANJI then return 10
		else if typeNumber < 41
			' 27 - 40
			if mode = modes.MODE_NUMERIC then return 14
			if mode = modes.MODE_ALPHANUMERIC then return 13
			if mode = modes.MODE_BYTE then return 16
			if mode = modes.MODE_KANJI then return 12
		end if

		print "Invalid mode and/or type", mode, typeNumber
		return 0
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
	qr = createObject("roSGNode", "QRCode")
	qr.setFields({
		typeNumber: typeNumber
		errorCorrectionLevel: errorCorrectionLevel
	})
	return {
		qrcode: qr
		addData: function(data as string, typeName = "BYTE" as string) as boolean
			return m.qrcode.callFunc("addData", data, typeName)
		end function
		make: sub()
			m.qrcode.callFunc("make")
		end sub
	}
end function