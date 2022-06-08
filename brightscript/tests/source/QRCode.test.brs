function main(args as Object) as Object
	return roca(args).describe("QRCode", sub()
		m.addContext({
			qrcode: createObject("roSGNode", "TestQRCode")
		})

		m.describe("QRCode", sub()
			m.it("should generate correct UTF8 text data", sub()
				m.assert.equal(m.qrcode.moduleCount, 29, "module count is invalid")
			end sub)
		end sub)

		m.describe("QRPrinter", sub()
			m.it("should generate correct UTF8 string from exsiting QRCode", sub()
				qrcode = m.qrcode
				printer = createObject("roSGNode", "QRPrinter")

				printer.cellSize = 1
				printer.padding = 2
				printer.qrcode = qrcode
				m.assert.equal(printer.qrstring, qrcode.correctHalfWidth, "half-size print with margin is invalid")

				printer.cellSize = 1
				printer.padding = 0
				printer.qrcode = qrcode
				m.assert.equal(printer.qrstring, qrcode.correctHalfWidthWithoutBorder, "half-size print without margin is invalid")

				printer.cellSize = 2
				printer.padding = 2
				printer.qrcode = qrcode
				m.assert.equal(printer.qrstring, qrcode.correctFullWidth, "full-size print with margin is invalid")
			end sub)

			m.it("should return correct UTF8 string from exsiting QRCode", sub()
				qrcode = m.qrcode
				printer = createObject("roSGNode", "QRPrinter")

				m.assert.equal(printer.callFunc("toASCII", qrcode, 1, 2), qrcode.correctHalfWidth, "half-size print with margin is invalid")
				m.assert.equal(printer.callFunc("toASCII", qrcode, 1, 0), qrcode.correctHalfWidthWithoutBorder, "half-size print without margin is invalid")
				m.assert.equal(printer.callFunc("toASCII", qrcode, 2, 2), qrcode.correctFullWidth, "full-size print with margin is invalid")
			end sub)
		end sub)
	end sub)
end function