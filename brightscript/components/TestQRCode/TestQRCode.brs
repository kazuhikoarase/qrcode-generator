sub init()
	m.top.typeNumber = -1
	m.top.errorCorrectionLevel = "M"

	m.top.sourceText = "http://www.example.com/ążśźęćńół"

	m.top.correctHalfWidth = [
		"█████████████████████████████████",
		"██ ▄▄▄▄▄ █ ▄█▀▄██ ▀▄ ▄██ ▄▄▄▄▄ ██",
		"██ █   █ █▀ █▀▄█▀▀█▄▄ ▄█ █   █ ██",
		"██ █▄▄▄█ ███ ▀ █▄▀▄▄▀ ▀█ █▄▄▄█ ██",
		"██▄▄▄▄▄▄▄█ ▀▄█▄▀▄▀ █▄▀▄█▄▄▄▄▄▄▄██",
		"██▄█  ▀▄▄▄█▄▄█▀█▀▀▄█▀▀▀█ ▀▀▄█▄ ██",
		"██▀▀▄▀▄█▄█  ▄▄█▄ ▄█  ███ ▀█▀▄▄▀██",
		"██ ▄▀█▄▀▄  ▄▀▄ █ ▄▀▀█▀██▀██▄▄▀▀██",
		"██  █▀ ▄▄▀▀ ▀█    █▀▄ ▀█▄▀▄▄▄ ▄██",
		"██▄██ ▄▄▄▄▄█   ▀▄▄ ▀▀▄▄▄█▄▄█▀ ███",
		"██▄█▄██▄▄▄ █ █▄▄▀█▀███▄▀▄▄█▄ ████",
		"███▄▄██▄▄▄ ▀▀▄█ █▀ █ ▄ ▄▄▄   ▀▀██",
		"██ ▄▄▄▄▄ █ █ ▀█▄█ ▀  ▄ █▄█ ▄█ ▀██",
		"██ █   █ █▀▄▄ ▄▀ ▀▄█ █  ▄▄   ▄ ██",
		"██ █▄▄▄█ █▄█▄▀█ ▀ ▀ ██  █ █▀▄▀▄██",
		"██▄▄▄▄▄▄▄█▄▄█▄█▄███▄▄▄▄████▄█▄███",
		"▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",].join(chr(10))

	m.top.correctHalfWidthWithoutBorder = [
		" ▄▄▄▄▄ █ ▄█▀▄██ ▀▄ ▄██ ▄▄▄▄▄ ",
		" █   █ █▀ █▀▄█▀▀█▄▄ ▄█ █   █ ",
		" █▄▄▄█ ███ ▀ █▄▀▄▄▀ ▀█ █▄▄▄█ ",
		"▄▄▄▄▄▄▄█ ▀▄█▄▀▄▀ █▄▀▄█▄▄▄▄▄▄▄",
		"▄█  ▀▄▄▄█▄▄█▀█▀▀▄█▀▀▀█ ▀▀▄█▄ ",
		"▀▀▄▀▄█▄█  ▄▄█▄ ▄█  ███ ▀█▀▄▄▀",
		" ▄▀█▄▀▄  ▄▀▄ █ ▄▀▀█▀██▀██▄▄▀▀",
		"  █▀ ▄▄▀▀ ▀█    █▀▄ ▀█▄▀▄▄▄ ▄",
		"▄██ ▄▄▄▄▄█   ▀▄▄ ▀▀▄▄▄█▄▄█▀ █",
		"▄█▄██▄▄▄ █ █▄▄▀█▀███▄▀▄▄█▄ ██",
		"█▄▄██▄▄▄ ▀▀▄█ █▀ █ ▄ ▄▄▄   ▀▀",
		" ▄▄▄▄▄ █ █ ▀█▄█ ▀  ▄ █▄█ ▄█ ▀",
		" █   █ █▀▄▄ ▄▀ ▀▄█ █  ▄▄   ▄ ",
		" █▄▄▄█ █▄█▄▀█ ▀ ▀ ██  █ █▀▄▀▄",
		"       ▀  ▀ ▀ ▀▀▀    ▀▀▀▀ ▀ ▀",].join(chr(10))

	m.top.correctFullWidth = [
		"██████████████████████████████████████████████████████████████████",
		"██████████████████████████████████████████████████████████████████",
		"████              ██    ████  ████  ██      ████              ████",
		"████  ██████████  ██  ████  ██████    ██  ██████  ██████████  ████",
		"████  ██      ██  ████  ████  ████████        ██  ██      ██  ████",
		"████  ██      ██  ██    ██  ████    ██████  ████  ██      ██  ████",
		"████  ██      ██  ██████  ██  ██  ██    ██  ████  ██      ██  ████",
		"████  ██████████  ██████      ████  ████      ██  ██████████  ████",
		"████              ██  ██  ██  ██  ██  ██  ██  ██              ████",
		"████████████████████    ██████  ██    ████  ██████████████████████",
		"████  ██    ██      ██    ██████████  ██████████  ████  ██    ████",
		"████████      ██████████████  ██    ████      ██      ██████  ████",
		"████████  ██  ██  ██        ██      ██    ██████  ██████    ██████",
		"████    ██  ████████    ████████  ████    ██████    ██  ████  ████",
		"████    ████  ██        ██    ██    ██████████████████    ████████",
		"████  ██  ████  ██    ██  ██  ██  ██    ██  ████  ████████    ████",
		"████    ████      ████  ████        ████    ████  ██          ████",
		"████    ██    ████        ██        ██  ██    ████  ██████  ██████",
		"████  ████            ██      ██      ████      ██    ████  ██████",
		"██████████  ████████████        ████      ██████████████    ██████",
		"████  ██  ████        ██  ██    ████████████  ██    ██    ████████",
		"████████████████████  ██  ██████  ██  ████████  ████████  ████████",
		"██████    ████        ████  ██  ████  ██                  ████████",
		"████████████████████      ████  ██    ██  ██  ██████          ████",
		"████              ██  ██  ████  ██  ██        ██  ██    ██  ██████",
		"████  ██████████  ██  ██    ██████        ██  ██████  ████    ████",
		"████  ██      ██  ████        ██  ██  ██  ██                  ████",
		"████  ██      ██  ██  ████  ██      ████  ██    ████      ██  ████",
		"████  ██      ██  ██  ██  ████  ██  ██  ████    ██  ████  ██  ████",
		"████  ██████████  ████████  ██          ████    ██  ██  ██  ██████",
		"████              ██    ██  ██  ██████        ████████  ██  ██████",
		"██████████████████████████████████████████████████████████████████",
		"██████████████████████████████████████████████████████████████████",].join(chr(10))

	addData(m.top.sourceText)
	make()
end sub