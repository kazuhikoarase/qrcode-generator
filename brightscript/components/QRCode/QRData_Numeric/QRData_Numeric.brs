sub init()
	m.top.mode = m.top.MODE_NUMERIC

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

	while i + 2 < length
		buffer.callFunc("put", strToNum(data.mid(i, i + 3)), 10)
		i += 3
	end while

	leftovers = length - i
	if leftovers <= 0
		return
	end if

	if leftovers = 1
		buffer.callFunc("put", strToNum(data.mid(i, i + 1)), 4)
	else if leftovers = 2
		buffer.callFunc("put", strToNum(data.mid(i, i + 2)), 7)
	end if
end sub

' @private
function strToNum(text as string) as integer
	num = 0
	for i = 0 to text.len() - 1 step 1
		digit = m.CHAR_TABLE[text.mid(i, 1)]
		if digit = invalid
			print "illegal char: ", text.mid(i, 1)
			return 0
		end if
		num = num * 10 + digit
	end for
	return num
end function