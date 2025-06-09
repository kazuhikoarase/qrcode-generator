import InputStream from './InputStream';

/**
 * ByteArrayInputStream
 * @author Kazuhiko Arase
 */
export default class extends InputStream {

    private pos = 0;

    constructor(private bytes: number[]) {
        super();
    }

    public readByte(): number {
        if (this.pos < this.bytes.length) {
            var b = this.bytes[this.pos];
            this.pos += 1;
            return b;
        }
        return -1;
    }
}
