'use strict';
namespace qrcode {

  /**
   * Mode
   * @author Kazuhiko Arase
   */
  export class Mode {

    /**
     * number
     */
    public static MODE_NUMBER = 1 << 0;

    /**
     * alphabet and number
     */
    public static MODE_ALPHA_NUM = 1 << 1;

    /**
     * 8bit byte
     */
    public static MODE_8BIT_BYTE = 1 << 2;

    /**
     * KANJI
     */
    public static MODE_KANJI = 1 << 3;
  }
}
