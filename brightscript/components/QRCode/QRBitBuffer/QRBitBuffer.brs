sub init()
	m.buffer = []
	m.numberOfBits = 0
end sub

' @private
function getBufferIndex(bitIndex as integer) as integer
	return int(bitIndex / 8)
end function

' @public
function getBuffer() as object
	return m.buffer
end function

' @public
function getBit(index as integer) as integer
	if ((m.buffer[getBufferIndex(index)] >> (7 - index MOD 8)) and 1) = 1
		return 1
	else
		return 0
	end if
end function

' @public
function getLengthInBits() as integer
	return m.numberOfBits
end function

' @public
sub put(num as integer, length as integer)
	for i = 0 to length - 1 step 1
		pushBit(((num >> (length - i - 1)) and 1) = 1)
	end for
end sub

' @public
sub pushBit(isSet as boolean)
	bufIndex = getBufferIndex(m.numberOfBits)

	if m.buffer.count() <= bufIndex
		m.buffer.push(0)
	end if

	if isSet = true
		m.buffer[bufIndex] = m.buffer[bufIndex] or (&H80 >> (m.numberOfBits MOD 8))
	end if

	m.numberOfBits += 1
end sub
