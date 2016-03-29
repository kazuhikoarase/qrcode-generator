'use strict';
namespace com.d_project.qrcode {

  /**
   * ErrorCorrectLevel
   * @author Kazuhiko Arase
   */
  export enum ErrorCorrectLevel {

    /**
     * 7%
     */
    L = 1,

    /**
     * 15%
     */
    M = 0,

    /**
     * 25%
     */
    Q = 3,

    /**
     * 30%
     */
    H = 2
  }
}
