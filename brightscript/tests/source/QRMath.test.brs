function main(args as Object) as Object
	return roca(args).describe("QRMath", sub()
		m.it("glog is working", sub()
			qrmath = createObject("roSGNode", "TestQRMath")

			testCases = [invalid, 0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75]
			for i = 0 to testCases.count() - 1 step 1
				m.assert.equal(qrmath.callFunc("glog", i), testCases[i], i.toStr() + " should result in " + testCases[i].toStr())
			end for
		end sub)

		m.it("gexp is working", sub()
			qrmath = createObject("roSGNode", "TestQRMath")

			testCases = [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38]
			for i = 0 to testCases.count() - 1 step 1
				m.assert.equal(qrmath.callFunc("gexp", i), testCases[i], i.toStr() + " should result in " + testCases[i].toStr())
			end for
		end sub)
	end sub)
end function