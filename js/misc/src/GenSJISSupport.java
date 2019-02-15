import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * GenSJISSupport
 * @author Kazuhiko Arase
 */
public class GenSJISSupport {

  private static final String US_ASCII = "ISO-8859-1";

  public static void main(String[] args) throws Exception {
    new GenSJISSupport().start();
  }

  public void start() throws Exception {

    String templateFile = "qrcode_SJIS.js.tmpl";
    String dstFile = "qrcode_SJIS.js";

    List<int[]> codeTable = new ArrayList<int[]>();
    BufferedReader in = new BufferedReader(new InputStreamReader(
        getClass().getResourceAsStream("SJIS.txt"), US_ASCII) );
    try {
      String line;
      while ( (line = in.readLine() ) != null) {
        line = line.trim();
        if (line.length() == 0 || line.startsWith("#") ) {
          continue;
        }
        String[] code = line.split("\\s+");
        if (code.length != 2) {
          throw new RuntimeException(line);
        }
        codeTable.add(new int[]{
            Integer.parseInt(code[0], 16),
            Integer.parseInt(code[1], 16) });
      }
    } finally {
      in.close();
    }

    // JIS X 0201 (191 chars) + JIS X 0208 (6879 chars)
    if (codeTable.size() != 7070) {
      throw new Exception("!");
    }

    // sort by UTF-16
    Collections.sort(codeTable, new Comparator<int[]>() {
      @Override
      public int compare(int[] c1, int[] c2) {
        return c1[1] < c2[1]? -1 : 1;
      }
    });

    ByteArrayOutputStream bout = new ByteArrayOutputStream();
    OutputStream out = new Base64EncodeOutputStream(bout);
    try {
      for (int[] code : codeTable) {
        out.write( (code[1] >>> 8) & 0xff);
        out.write(code[1] & 0xff);
        out.write( (code[0] >>> 8) & 0xff);
        out.write(code[0] & 0xff);
      }
    } finally {
      out.close();
    }

    String sjisEncoded = new String(bout.toByteArray(), US_ASCII).
        replace("/", "\\/"); // escape slash

    PrintWriter srcOut = new PrintWriter(dstFile, US_ASCII);
    try {
      BufferedReader tmplIn = new BufferedReader(new InputStreamReader(
          getClass().getResourceAsStream(templateFile), US_ASCII) );
      try {
        String line;
        while ( (line = tmplIn.readLine() ) != null) {
          srcOut.write(line.replace("@DATA@", sjisEncoded).
              replace("@NUM_CHARS@", String.valueOf(codeTable.size() ) ) );
          srcOut.write('\n');
        }
      } finally {
        tmplIn.close();
      }
    } finally {
      srcOut.close();
    }
  }

  protected static class Base64EncodeOutputStream
  extends FilterOutputStream {

    private int buffer;
    private int buflen;
    private int length;

    public Base64EncodeOutputStream(OutputStream out) {
      super(out);
      this.buffer = 0;
      this.buflen = 0;
      this.length = 0;
    }

    public void write(int n) throws IOException {

      buffer = (buffer << 8) | (n & 0xff);
      buflen += 8;
      length++;

      while (buflen >= 6) {
        writeEncoded(buffer >>> (buflen - 6) );
        buflen -= 6;
      }
    }

    public void flush() throws IOException {

      if (buflen > 0) {
        writeEncoded(buffer << (6 - buflen) );
        buffer = 0;
        buflen = 0;
      }

      if (length % 3 != 0) {
        // padding
        int padlen = 3 - length % 3;
        for (int i = 0; i < padlen; i++) {
          super.write('=');
        }
      }

      super.flush();
    }

    private void writeEncoded(int b) throws IOException {
      super.write(encode(b & 0x3f) );
    }

    private static int encode(int n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 'A' + n; 
      } else if (n < 52) {
        return 'a' + (n - 26); 
      } else if (n < 62) {
        return '0' + (n - 52); 
      } else if (n == 62) {
        return '+';
      } else if (n == 63) {
        return '/';
      }
      throw new IllegalArgumentException("n:" + n);
    }
  }
}
