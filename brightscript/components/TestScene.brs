sub init()
	print "Init: "; m.top.subtype()

	timer = CreateObject("roTimespan")
	timer.mark()

	m.QRCode = createObject("roSGNode", "QRCodeTest")

	print "Creating QRCode took:", timer.TotalMilliseconds().ToStr();"ms"

	timer.mark()

	m.QRPosterTest = m.top.findNode("QRPosterTest")
	m.QRPosterTest.qrcode = m.QRCode

	print "Creating PNG took:", timer.TotalMilliseconds().ToStr();"ms"
	print "QRCode image created as:", m.QRPosterTest.uri

	timer.mark()

	m.QRPrinter = createObject("roSGNode", "QRPrinter")
	m.QRPrinter.callFunc("toLog", m.QRCode)

	print "Printing to console took:", timer.TotalMilliseconds().ToStr();"ms"
end sub