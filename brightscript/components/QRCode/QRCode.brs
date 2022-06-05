sub init()
	m.PAD0 = &HEC
	m.PAD1 = &H11

	m.dataNodes = []
	m.dataBytes = invalid

	m.modules = invalid
	m.moduleCount = 0

	m.typeNumber = m.top.typeNumber
	m.errorCorrectionLevel = m.top.errorCorrectionLevel
end sub

' -------- exports: QRCode ---------------------------------------------------

sub initModuleCount(typeNumber as integer)
	m.moduleCount = typeNumber * 4 + 17
	m.top.moduleCount = m.moduleCount
end sub

sub initData(isTest as boolean, maskPattern)
	initModuleCount(m.typeNumber)
	initModules(m.moduleCount)
	setupPositionProbePattern(0, 0)
	setupPositionProbePattern(m.moduleCount - 7, 0)
	setupPositionProbePattern(0, m.moduleCount - 7)
	setupPositionAdjustPattern()
	setupTimingPattern()
	setupTypeInfo(isTest, maskPattern)

	if m.typeNumber >= 7
		setupTypeNumber(isTest)
	end if

	if m.dataBytes = invalid
		m.dataBytes = createData(m.typeNumber, m.errorCorrectionLevel, m.dataNodes)
	end if

	mapData(m.dataBytes, maskPattern)
	m.top.modules = m.modules
end sub

sub initModules(moduleCount as integer)
	m.modules = createObject("roArray", moduleCount, false)
	for rowIndex = 0 to moduleCount - 1 step 1
		columns = createObject("roArray", moduleCount, false)
		m.modules[rowIndex] = columns
		for colIndex = 0 to moduleCount - 1 step 1
			columns[colIndex] = invalid
		end for
	end for
end sub

sub setupPositionProbePattern(startRow as integer, startCol as integer)
	moduleCount = m.moduleCount
	modules = m.modules

	for r = -1 to 7 step 1
		y = startRow + r

		if y > -1 and moduleCount > y
			columns = modules[y]

			for c = -1 to 7 step 1
				x = startCol + c

				if x > -1 and moduleCount > x
					isSet = (0 <= r and r <= 6 and(c = 0 or c = 6))
					isSet = isSet or (0 <= c and c <= 6 and (r = 0 or r = 6))
					isSet = isSet or (2 <= r and r <= 4 and 2 <= c and c <= 4)

					columns[x] = isSet
				end if
			end for
		end if
	end for
end sub

sub setupPositionAdjustPattern()
	positions = QRUtil().getPatternPosition(m.typeNumber)
	modules = m.modules

	for i = 0 to positions.count() - 1 step 1
		for j = 0 to positions.count() - 1 step 1
			rowIndex = positions[i]
			colIndex = positions[j]

			if modules[rowIndex][colIndex] = invalid
				for r = -2 to 2 step 1
					columns = modules[rowIndex + r]
					for c = -2 to 2 step 1
						isSet = r = -2 or r = 2 or c = -2 or c = 2
						isSet = isSet or (r = 0 and c = 0)
						columns[colIndex + c] = isSet
					end for
				end for
			end if
		end for
	end for
end sub

sub setupTimingPattern()
	moduleCount = m.moduleCount
	modules = m.modules

	for r = 8 to moduleCount - 9 step 1
		columns = modules[r]
		if columns[6] = invalid
			columns[6] = ((r MOD 2) = 0)
		end if
	end for

	for c = 8 to moduleCount - 9 step 1
		columns = modules[6]
		if columns[c] = invalid
			columns[c] = ((c MOD 2) = 0)
		end if
	end for
end sub

sub setupTypeInfo(isTest as boolean, maskPattern)
	moduleCount = m.moduleCount
	modules = m.modules
	data = ((QRErrorCorrectionLevel()[m.errorCorrectionLevel] << 3) or maskPattern)
	bits = QRUtil().getBCHTypeInfo(data)

	' vertical
	for i = 0 to 14 step 1
		isSet = (isTest = false and ((bits >> i) and 1) = 1)
		columns = invalid
		if i < 6
			columns = modules[i]
		else if i < 8
			columns = modules[i + 1]
		else
			columns = modules[moduleCount - 15 + i]
		end if

		columns[8] = isSet
	end for

	' horizontal
	for i = 0 to 14 step 1
		isSet = (isTest = false and ((bits >> i) and 1) = 1)
		columns = modules[8]
		if i < 8
			columns[moduleCount - i - 1] = isSet
		else if i < 9
			columns[15 - i - 1 + 1] = isSet
		else
			columns[15 - i - 1] = isSet
		end if
	end for

	' fixed module
	columns = modules[moduleCount - 8]
	columns[8] = (isTest = false)
end sub

sub setupTypeNumber(isTest as boolean)
	bits = QRUtil().getBCHTypeNumber(m.typeNumber)
	moduleCount = m.moduleCount
	modules = m.modules

	for i = 0 to 17 step 1
		isSet = (isTest = false and ((bits >> i) and 1) = 1)
		columns = modules[i \ 3]
		columns[(i MOD 3) + moduleCount - 8 - 3] = isSet
	end for

	for i = 0 to 17 step 1
		isSet = (isTest = false and ((bits >> i) and 1) = 1)
		columns = modules[(i MOD 3) + moduleCount - 8 - 3]
		columns[i \ 3] = isSet
	end for
end sub

function createBytes(bitBuffer as object, rsBlocks as object) as object
	offset = 0

	maxDcCount = 0
	maxEcCount = 0

	rsBlockCount = rsBlocks.count()

	dcdata = createObject("roArray", rsBlockCount, false)
	ecdata = createObject("roArray", rsBlockCount, false)

	for r = 0 to rsBlockCount - 1 step 1
		dcCount = rsBlocks[r].dataCount
		ecCount = rsBlocks[r].totalCount - dcCount
		maxDcCount = qrMax(maxDcCount, dcCount)
		maxEcCount = qrMax(maxEcCount, ecCount)

		dcdataR = createObject("roArray", dcCount, false)
		dcdata[r] = dcdataR

		for i = 0 to dcCount - 1 step 1
			dcdataR[i] = &Hff and bitBuffer.getBuffer()[i + offset]
		end for

		offset += dcCount
		rsPoly = QRUtil().getErrorCorrectPolynomial(ecCount)
		rsPolyLength = rsPoly.getLength()
		rawPoly = QRPolynomial(dcdata[r], rsPolyLength - 1)

		modPoly = rawPoly.modulo(rsPoly)
		modPolyLength = modPoly.getLength()

		ecdataCount = rsPolyLength - 1
		ecdataR = createObject("roArray", ecdataCount, false)
		ecdata[r] = ecdataR

		for i = 0 to ecdataCount - 1 step 1
			modIndex = i + modPolyLength - ecdataCount
			if modIndex >= 0
				ecdataR[i] = modPoly.getAt(modIndex)
			else
				ecdataR[i] = 0
			end if
		end for
	end for

	totalCodeCount = 0
	for i = 0 to rsBlockCount - 1 step 1
		totalCodeCount += rsBlocks[i].totalCount
	end for

	result = createObject("roArray", totalCodeCount, false)
	index = 0

	for i = 0 to maxDcCount - 1 step 1
		for r = 0 to rsBlockCount - 1 step 1
			if i < dcdata[r].count()
				result[index] = dcdata[r][i]
				index += 1
			end if
		end for
	end for

	for i = 0 to maxEcCount - 1 step 1
		for r = 0 to rsBlockCount - 1 step 1
			if i < ecdata[r].count()
				result[index] = ecdata[r][i]
				index += 1
			end if
		end for
	end for

	return result
end function

function createBitBufferFromDataNodes(typeNumber as integer, dataNodes as object) as object
	bitBuffer = QRBitBuffer()

	for i = 0 to dataNodes.count() - 1 step 1
		data = dataNodes[i]
		bitBuffer.put(data.mode, 4)
		bitBuffer.put(data.length, QRUtil().getLengthInBits(data.mode, typeNumber))
		data.callFunc("writeToBuffer", bitBuffer.buffer)
	end for

	return bitBuffer
end function

function createData(typeNumber as integer, errorCorrectionLevel as string, dataNodes as object) as object
	rsBlocks = QRRSBlock().getRSBlocks(typeNumber, errorCorrectionLevel)
	if rsBlocks = invalid
		return invalid
	end if

	bitBuffer = createBitBufferFromDataNodes(typeNumber, dataNodes)

	' alc num max data.
	totalDataCount = 0
	for i = 0 to rsBlocks.count() - 1 step 1
		totalDataCount += rsBlocks[i].dataCount
	end for

	if bitBuffer.getLengthInBits() > totalDataCount * 8
		print "ERROR: code ength overflow", bitBuffer.getLengthInBits(), ">", totalDataCount * 8
		return invalid
	end if

	' end code
	if bitBuffer.getLengthInBits() + 4 <= totalDataCount * 8
		bitBuffer.put(0, 4)
	end if

	' padding
	while bitBuffer.getLengthInBits() MOD 8 <> 0
		bitBuffer.pushBit(false)
	end while

	' padding
	while true
		if bitBuffer.getLengthInBits() >= totalDataCount * 8
			exit while
		end if

		bitBuffer.put(m.PAD0, 8)

		if bitBuffer.getLengthInBits() >= totalDataCount * 8
			exit while
		end if

		bitBuffer.put(m.PAD1, 8)
	end while

	return createBytes(bitBuffer, rsBlocks)
end function

sub mapData(dataBytes as object, maskPattern)
	moduleCount = m.moduleCount
	modules = m.modules

	inc = -1
	row = moduleCount - 1
	bitIndex = 7
	byteIndex = 0
	maskFunc = QRUtil().getMaskFunction(maskPattern)

	for col = moduleCount - 1 to 1 step -2
		if col = 6 then col -= 1

		while true
			for c = 0 to 1 step 1
				columns = modules[row]
				if columns[col - c] = invalid
					dark = false

					if byteIndex < dataBytes.count()
						dark = (((dataBytes[byteIndex] >> bitIndex) and 1) = 1)
					end if

					mask = maskFunc(row, col - c)

					if mask
						dark = (not dark)
					end if

					columns[col - c] = dark
					bitIndex -= 1

					if bitIndex = -1
						byteIndex += 1
						bitIndex = 7
					end if
				end if
			end for

			row += inc
			if row < 0 or moduleCount <= row
				row -= inc
				inc = -inc
				exit while
			end if
		end while
	end for
end sub

function addData(data as string, typeName = "BYTE" as string) as boolean
	if typeName = invalid or typeName = ""
		typeName = "BYTE"
	end if

	qrmode = QRModes()["MODE_" + typeName]

	if qrmode = invalid
		return false
	end if

	qrdata = createObject("roSGNode", "QRData_" + typeName)
	if qrdata = invalid or not qrdata.isSubtype("QRData")
		print "ERROR: Invalid data typeName: " + typeName
		return false
	end if
	qrdata.callFunc("setData", data)

	m.dataNodes.push(qrdata)
	m.dataBytes = invalid

	return true
end function

function getLostPoint() as float
	moduleCount = m.moduleCount
	modules = m.modules
	lostPoint = 0

	' LEVEL1

	for row = 0 to moduleCount - 1 step 1
		for col = 0 to moduleCount - 1 step 1
			sameCount = 0
			dark = modules[row][col]

			for r = -1 to 1 step 1
				rowR = row + r

				if rowR >= 0 and moduleCount > rowR

					for c = -1 to 1 step 1
						colC = col + c

						if colC >= 0 and moduleCount > colC and (r <> 0 or c <> 0)
							if dark = modules[rowR][colC]
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
			if modules[row][col] then count += 1
			if modules[row + 1][col] then count += 1
			if modules[row][col + 1] then count += 1
			if modules[row + 1][col + 1] then count += 1
			if count = 0 or count = 4
				lostPoint += 3
	  		end if
		end for
	end for

	' LEVEL3

	for row = 0 to moduleCount - 1 step 1
		for col = 0 to moduleCount - 7 step 1
			lost =              modules[row][col]
			lost = lost and not modules[row][col + 1]
			lost = lost and     modules[row][col + 2]
			lost = lost and     modules[row][col + 3]
			lost = lost and     modules[row][col + 4]
			lost = lost and not modules[row][col + 5]
			lost = lost and     modules[row][col + 6]
			if lost
				lostPoint += 40
	  		end if
		end for
	end for

	for col = 0 to moduleCount - 1 step 1
		for row = 0 to moduleCount - 7 step 1
			lost =              modules[row][col]
			lost = lost and not modules[row + 1][col]
			lost = lost and     modules[row + 2][col]
			lost = lost and     modules[row + 3][col]
			lost = lost and     modules[row + 4][col]
			lost = lost and not modules[row + 5][col]
			lost = lost and     modules[row + 6][col]
			if lost
				lostPoint += 40
	  		end if
		end for
	end for

	' LEVEL4

	darkCount = 0

	for col = 0 to moduleCount - 1 step 1
		for row = 0 to moduleCount - 1 step 1
			if modules[row][col]
				darkCount += 1
			end if
		end for
	end for

	ratio = abs((100 * darkCount) / moduleCount / (moduleCount - 50)) / 5
	lostPoint += ratio * 10

	return lostPoint
end function

function getBestMaskPattern() as integer
	minLostPoint = 0
	bestPattern = 0

	patterns = QRMaskPatterns()

	for pattern = 0 to patterns.count() - 1 step 1
		initData(true, pattern)
		lostPoint = getLostPoint()
		if pattern = 0 or minLostPoint > lostPoint
			minLostPoint = lostPoint
			bestPattern = pattern
		end if
	end for

	return bestPattern
end function

sub setBestTypeNumber()
	for typeNumber = 1 to 40 step 1
		rsBlocks = QRRSBlock().getRSBlocks(typeNumber, m.errorCorrectionLevel)
		if rsBlocks <> invalid
			bitBuffer = createBitBufferFromDataNodes(typeNumber, m.dataNodes)
			' alc num max data.
			totalDataCount = 0
			for i = 0 to rsBlocks.count() - 1 step 1
				totalDataCount += rsBlocks[i].dataCount
			end for

			if bitBuffer.getLengthInBits() <= totalDataCount * 8
				m.typeNumber = typeNumber
				return
			end if
		end if
	end for

	if m.typeNumber < 1
		print "ERROR: could not find suitable typeNumber"
	end if
end sub

sub make()
	m.top.status = "loading"
	m.typeNumber = m.top.typeNumber
	m.errorCorrectionLevel = m.top.errorCorrectionLevel

	if m.typeNumber < 1
		setBestTypeNumber()
	end if

	initData(false, getBestMaskPattern())
	m.top.status = "ready"
end sub

function isDark(row as integer, col as integer) as boolean
	if row < 0 or m.moduleCount <= row or col < 0 or m.moduleCount <= col
		print "ERROR: invalid coords passed to isDark", row, col
		return false
	end if

	return m.modules[row][col] = true
end function

' -------- exports: QRMath ---------------------------------------------------

' @private
function qrmath_glog(n as integer) as dynamic
	return QRMath().glog(n)
end function

' @private
function qrmath_gexp(n as integer) as integer
	return QRMath().gexp(n)
end function