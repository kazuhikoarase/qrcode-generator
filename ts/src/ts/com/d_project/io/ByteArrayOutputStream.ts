import OutputStream from './OutputStream';

/**
   * ByteArrayOutputStream
   * @author Kazuhiko Arase
   */
export default class extends OutputStream {

    private bytes: number[] = [];

    constructor() {
        super();
    }

    public writeByte(b: number): void {
        this.bytes.push(b);
    }

    public toByteArray(): number[] {
        return this.bytes;
    }
}
