package com.d_project.qrcode.web;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.d_project.qrcode.ErrorCorrectLevel;
import com.d_project.qrcode.QRCode;

/**
 * QRコードサーブレット.
 * <br>QRコードのモノクロGIF画像を応答するサーブレットです。
 * <br>[パラメータ]
 * <br> o : 出力形式 (text/plain, image/gif, image/jpeg, image/png のいずれか, 省略した場合は image/gif)
 * <br> t : 型番 (0:自動, 1～10, 省略した場合は 0)
 * <br>	e : 誤り訂正レベル (L, Q, M, H のいずれか, 省略した場合は H)
 * <br>	d : テキストデータ (文字列)
 * <br>	m : マージン (0～32, 省略した場合は 0)
 * <br>	s : セルサイズ (1～4, 省略した場合は 1)
 * @author Kazuhiko Arase
 * @see com.d_project.qrcode.Mode
 * @see com.d_project.qrcode.ErrorCorrectLevel
 */
@SuppressWarnings("serial")
public class QRCodeServlet extends HttpServlet {

	private String defaultCharacterEncoding;
	
    /**
     * コンストラクタ
     */
    public QRCodeServlet() {
    }

    public void init(ServletConfig config) throws ServletException {

    	super.init(config);

		defaultCharacterEncoding = getServletConfig().getInitParameter("default-character-encoding");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		
		String data = getParameter(request, "d", "qrcode");

		if (defaultCharacterEncoding != null) {
			data = new String(data.getBytes("ISO-8859-1"), defaultCharacterEncoding);
		}

		String output = getParameter(request, "o", "image/gif");

		int typeNumber = getIntParameter(request, "t", 0);
		if (typeNumber < 0 || 10 < typeNumber) {
    		throw new IllegalArgumentException("illegal type number : " + typeNumber);
		}

		int margin = getIntParameter(request, "m", 2);
		if (margin < 0 || 32 < margin) {
    		throw new IllegalArgumentException("illegal margin : " + margin);
		}
		
		int cellSize = getIntParameter(request, "s", 1);
		if (cellSize < 1 || 4 < cellSize) {
    		throw new IllegalArgumentException("illegal cell size : " + cellSize);
		}

		int errorCorrectLevel = parseErrorCorrectLevel(getParameter(request, "e", "H") );

    	QRCode qrcode = getQRCode(data,	typeNumber, errorCorrectLevel);

        if ("text/plain".equals(output) ) {

            response.setContentType("text/plain");

            PrintWriter out = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), "ISO-8859-1") );

            try {
                for (int row = 0; row < qrcode.getModuleCount(); row++) {
                    for (int col = 0; col < qrcode.getModuleCount(); col++) {
                        out.print(qrcode.isDark(row, col)? "1" : "0");
                    }
                    out.print("\r\n");
                }
            } finally {
                out.close();
            }

        } else if ("image/jpeg".equals(output) ) {

            BufferedImage image = qrcode.createImage(cellSize, margin);
    
            response.setContentType("image/jpeg");
    
            OutputStream out = new BufferedOutputStream(response.getOutputStream() );
    
            try {
                ImageIO.write(image, "jpeg", out);
            } finally {
                out.close();
            }

        } else if ("image/png".equals(output) ) {

            BufferedImage image = qrcode.createImage(cellSize, margin);
    
            response.setContentType("image/png");
    
            OutputStream out = new BufferedOutputStream(response.getOutputStream() );
    
            try {
                ImageIO.write(image, "png", out);
            } finally {
                out.close();
            }

        } else if ("image/gif".equals(output) ) {

            GIFImage image = createGIFImage(qrcode, cellSize, margin);
    
            response.setContentType("image/gif");
    
            OutputStream out = new BufferedOutputStream(response.getOutputStream() );
    
            try {
                image.write(out);
            } finally {
                out.close();
            }

        } else {
            throw new IllegalArgumentException("illegal output type : " + output);
        }
	}

	private static String getParameter(HttpServletRequest request, String name, String defaultValue) {
		String value = request.getParameter(name);
		return (value != null)? value : defaultValue;
	}

	private static int getIntParameter(HttpServletRequest request, String name, int defaultValue) {
		String value = request.getParameter(name);
		return (value != null)? Integer.parseInt(value) : defaultValue;
	}
    
	private static QRCode getQRCode(String text, int typeNumber, int errorCorrectLevel) {

		if (typeNumber == 0) {

			return QRCode.getMinimumQRCode(text, errorCorrectLevel);

		} else {

			QRCode qr = new QRCode();
			qr.setTypeNumber(typeNumber);
			qr.setErrorCorrectLevel(errorCorrectLevel);
			qr.addData(text);
			qr.make();
			
			return qr;

		}
	}
	    
    private static int parseErrorCorrectLevel(String ecl) {

		if ("L".equals(ecl) ) {
    		return ErrorCorrectLevel.L;
    	} else if ("Q".equals(ecl) ) {
    		return ErrorCorrectLevel.Q;
    	} else if ("M".equals(ecl) ) {
	    	return ErrorCorrectLevel.M;
    	} else if ("H".equals(ecl) ) {
    		return ErrorCorrectLevel.H;
    	} else {
    		throw new IllegalArgumentException("invalid error correct level : " + ecl);
    	}

    }

    /**
     * GIFイメージを取得する。
     * @param cellSize セルのサイズ(pixel)
     * @param margin 余白(pixel)
     */
    private static GIFImage createGIFImage(QRCode qrcode, int cellSize, int margin) throws IOException {
        
        int imageSize = qrcode.getModuleCount() * cellSize + margin * 2;

        GIFImage image = new GIFImage(imageSize, imageSize);

        for (int y = 0; y < imageSize; y++) {

            for (int x = 0; x < imageSize; x++) {

                if (margin <= x && x < imageSize - margin
                        && margin <= y && y < imageSize - margin) {
                            
                    int col = (x - margin) / cellSize;
                    int row = (y - margin) / cellSize;
    
                    if (qrcode.isDark(row, col) ) {
                        image.setPixel(x, y, 0);
                    } else {
                        image.setPixel(x, y, 1);
                    }

                } else {
                    image.setPixel(x, y, 1);
                }
            }
        }

        return image;
    }
}
