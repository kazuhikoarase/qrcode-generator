import Base64EncodeOutputStream from './Base64EncodeOutputStream';
import Base64DecodeInputStream from './Base64DecodeInputStream';
import ByteArrayOutputStream from './ByteArrayOutputStream';
import ByteArrayInputStream from './ByteArrayInputStream';

/**
 * Base64
 * @author Kazuhiko Arase
 */
export default class {

    constructor() {
        throw 'error';
    }

    public static encode(data: number[]): number[] {
        var bout = new ByteArrayOutputStream();
        try {
            var ostream = new Base64EncodeOutputStream(bout);
            try {
                ostream.writeBytes(data);
            } finally {
                ostream.close();
            }
        } finally {
            bout.close();
        }
        return bout.toByteArray();
    }

    public static decode(data: number[]): number[] {
        var bout = new ByteArrayOutputStream();
        try {
            var istream = new Base64DecodeInputStream(
                new ByteArrayInputStream(data));
            try {
                var b: number;
                while ((b = istream.readByte()) != -1) {
                    bout.writeByte(b);
                }
            } finally {
                istream.close();
            }
        } finally {
            bout.close();
        }
        return bout.toByteArray();
    }
}
