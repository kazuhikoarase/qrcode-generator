/**
 * InputStream
 * @author Kazuhiko Arase
 */
abstract class InputStream {
    constructor() { }
    public abstract readByte(): number;
    public close(): void {
    }
}

export default InputStream;
