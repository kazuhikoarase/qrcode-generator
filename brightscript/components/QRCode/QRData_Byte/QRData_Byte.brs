sub init()
	m.top.mode = m.top.MODE_BYTE
end sub

' @public
' @param textual representation of value
sub setData(data as string)
	m.bytes = stringToBytes(data)
	m.top.length = m.bytes.count()
end sub

' @public
' @param buffer QRBitBuffer
sub writeToBuffer(buffer as object)
	for each byte in m.bytes
		buffer.callFunc("put", byte, 8)
	end for
end sub

' @private
function stringToBytes(text as string) as object
	result = createObject("roByteArray")
	if result = invalid
		return stringToBytesCustom(text)
	end if

	result.fromAsciiString(text)

	return result
end function

' @private
function stringToBytesCustom(text as string) as object
	' http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
	result = []
	chars = text.split("")

	for i = 0 to chars.count() - 1 step 1
		charcode = asc(chars[i])
		if charcode < &H80
			result.push(charcode)
		else if charcode < &H800
			result.push(&Hc0 or (charcode >> 6))
			result.push(&H80 or (charcode and &H3f))
		else if charcode < &Hd800 or charcode >= &He000
			result.push(&He0 or (charcode >> 12))
			result.push(&H80 or ((charcode >> 6) and &H3f))
			result.push(&H80 or (charcode and &H3f))
		else
			i += 1
			' surrogate pair
			' UTF-16 encodes 0x10000-0x10FFFF by
			' subtracting 0x10000 and splitting the
			' 20 bits of 0x0-0xFFFFF into two halves
			charcode = &H10000 + (((charcode and &H3ff) << 10) or (asc(chars[i]) and &H3ff))
			result.push(&Hf0 or (charcode >> 18))
			result.push(&H80 or ((charcode >> 12) and &H3f))
			result.push(&H80 or ((charcode >> 6) and &H3f))
			result.push(&H80 or (charcode and &H3f))
		end if
	end for

	return result
end function
