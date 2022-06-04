function main(args as Object) as Object
	return roca(args).describe("QRCode", sub()
		m.it("should generate correct UTF8 text data", sub()
			qrcode = createObject("roSGNode", "QRCodeTest")

			m.assert.equal(qrcode.moduleCount, 29, "module count is invalid")

			printer = createObject("roSGNode", "QRPrinter")

			m.assert.equal(printer.callFunc("toString", qrcode, 1, 2), qrcode.correctHalfWidth, "half-size print with margin is invalid")
			m.assert.equal(printer.callFunc("toString", qrcode, 1, 0), qrcode.correctHalfWidthWithoutBorder, "half-size print without margin is invalid")
			m.assert.equal(printer.callFunc("toString", qrcode, 2, 2), qrcode.correctFullWidth, "full-size print with margin is invalid")
		end sub)
	end sub)
end function