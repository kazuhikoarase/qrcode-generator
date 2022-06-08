sub init()
	print "Init: "; m.top.subtype()

	timer = CreateObject("roTimespan")
	timer.mark()

	m.QRCode = createObject("roSGNode", "TestQRCode")

	print "Creating QRCode took:", timer.TotalMilliseconds().ToStr();"ms"

	timer.mark()

	m.QRPoster = m.top.findNode("TestQRPoster")
	m.QRPoster.qrcode = m.QRCode

	print "Creating PNG took:", timer.TotalMilliseconds().ToStr();"ms"
	print "QRCode image created as:", m.QRPoster.uri

	timer.mark()

	m.QRPrinter = createObject("roSGNode", "QRPrinter")
	m.QRPrinter.qrcode = m.QRCode
	print m.QRPrinter.qrstring

	print "Printing to console took:", timer.TotalMilliseconds().ToStr();"ms"
end sub