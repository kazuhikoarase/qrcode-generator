sub init()
	m.top.mode = m.top.MODE_ALPHANUMERIC

	m.CHAR_TABLE = {
		"0": 0
		"1": 1
		"2": 2
		"3": 3
		"4": 4
		"5": 5
		"6": 6
		"7": 7
		"8": 8
		"9": 9
		"A": 10
		"B": 11
		"C": 12
		"D": 13
		"E": 14
		"F": 15
		"G": 16
		"H": 17
		"I": 18
		"J": 19
		"K": 20
		"L": 21
		"M": 22
		"N": 23
		"O": 24
		"P": 25
		"Q": 26
		"R": 27
		"S": 28
		"T": 29
		"U": 30
		"V": 31
		"W": 32
		"X": 33
		"Y": 34
		"Z": 35
		" ": 36
		"$": 37
		"%": 38
		"*": 39
		"+": 40
		"-": 41
		".": 42
		"/": 43
		":": 44
	}
end sub

' @public
' @param textual representation of value
sub setData(data as string)
	m.data = data
	m.top.length = data.len()
end sub

' @public
' @param buffer QRBitBuffer
sub writeToBuffer(buffer as object)
	i = 0
	data = m.data
	length = data.len()

	while i + 1 < length
		code1 = getCode(data.mid(i, 1))
		code2 = getCode(data.mid(i + 1, 1))

		buffer.callFunc("put", code1 * 45 + code2, 11)
		i += 2
	end while

	if i < length
		buffer.callFunc("put", getCode(data.mid(i, 1)), 6)
	end if
end sub

' @private
function getCode(char as string) as integer
	result = m.CHAR_TABLE[char]
	if result = invalid
		print "illegal char: ", char
		return 0
	end if

	return result
end function