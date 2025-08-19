/**
   * Mode
   * @author Kazuhiko Arase
   */
enum Mode {

    /**
     * number
     */
    MODE_NUMBER = 1 << 0,

    /**
     * alphabet and number
     */
    MODE_ALPHA_NUM = 1 << 1,

    /**
     * 8bit byte
     */
    MODE_8BIT_BYTE = 1 << 2,

    /**
     * KANJI
     */
    MODE_KANJI = 1 << 3
}

export default Mode;