function main(args as Object) as Object
	return roca(args).describe("QRBitBuffer", sub()
		m.it("can be created", sub()
			item = createObject("roSGNode", "QRBitBuffer")
			m.assert.equal(type(item), "Node", "it should be created as a Node")
			m.assert.equal(item.isSubtype("QRBitBuffer"), true, "it should be created as a QRBitBuffer")
		end sub)

		m.it("has `getBuffer` method", sub()
			item = createObject("roSGNode", "QRBitBuffer")
			arr = item.callFunc("getBuffer")
			m.assert.equal(arr.count(), 0, "it should return empty array by default")
		end sub)

		m.it("has `getLengthInBits` method", sub()
			item = createObject("roSGNode", "QRBitBuffer")
			length = item.callFunc("getLengthInBits")
			m.assert.equal(length, 0, "it should return 0 by default")
		end sub)

		m.it("has `pushBit` method", sub()
			item = createObject("roSGNode", "QRBitBuffer")
			item.callFunc("pushBit", true)
			m.assert.equal(item.callFunc("getLengthInBits"), 1, "it should return 1 bit")

			item.callFunc("pushBit", false)
			item.callFunc("pushBit", true)
			m.assert.equal(item.callFunc("getLengthInBits"), 3, "it should return 3 bits")

			buf = item.callFunc("getBuffer")
			m.assert.equal(buf[0], 160, "first byte should equal 5 now")

			item.callFunc("pushBit", true)
			item.callFunc("pushBit", true)
			item.callFunc("pushBit", true)
			item.callFunc("pushBit", true)
			item.callFunc("pushBit", true)
			item.callFunc("pushBit", true)
			buf = item.callFunc("getBuffer")
			m.assert.equal(buf[0], 191, "first byte should equal 191 now")
			m.assert.equal(buf[1], 128, "second byte should equal 128 now")
		end sub)

		m.it("has `put` method", sub()
			item = createObject("roSGNode", "QRBitBuffer")
			item.callFunc("put", 42, 16)
			m.assert.equal(item.callFunc("getLengthInBits"), 16, "it should return 16 bits")

			buf = item.callFunc("getBuffer")
			m.assert.equal(buf[0], 0, "first byte should equal 0 now")
			m.assert.equal(buf[1], 42, "second byte should equal 42 now")
		end sub)
	end sub)
end function