sub init()
	print "init: "; m.top.subtype()

	m.QRCode = createObject("roSGNode", "QRCodeTest")

	m.QRPosterTest = m.top.findNode("QRPosterTest")

	timer = CreateObject("roTimespan")
	timer.mark()

	m.QRPosterTest.qrcode = m.QRCode

	print "Creating PNG took:", timer.TotalMilliseconds().ToStr();"ms"
	print "QRCode image created as:", m.QRPosterTest.uri
end sub