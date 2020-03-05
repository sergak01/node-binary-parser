/**
 * BinaryParser module
 *
 * @module node-binary-parser
 */

/**
 * ReOrder interface
 *
 * @interface {ReOrder}
 * @property {number} startPos See {@link #startPos startPos}
 * @property {number} count See {@link #count count}
 * @property {number} newPos See {@link #newPos newPos}
 */
interface ReOrder {
  /**
   * Start position
   *
   * @type {number}
   */
  startPos: number;

  /**
   * Count of bits for reordering
   *
   * @type {number}
   */
  count: number;

  /**
   * New position for bits
   *
   * @type {number}
   */
  newPos: number;
}

/**
 * Options interface for {@link BinaryParser#parseBits parseBits} method
 *
 * @interface {BitsOptions}
 * @property {ReOrder[]} reOrder See {@link #reOrder reOrder}
 */
interface BitsOptions {
  /**
   * Array or ReOrder interfaces
   *
   * @type {ReOrder[]}
   */
  reOrder?: ReOrder[];
}

/**
 * BinaryParser interface
 *
 * @interface BinaryParser
 * @exports node-binary-parser/BinaryParser
 * @version 0.0.8
 */
export interface BinaryParser {
  /**
   * Parses {@link #parseBits.count count} bits as unsigned integer
   *
   * @param {string} name Variable name for parsed data
   * @param {number} count Number of bits for parsing
   * @param {BitsOptions} [options] See {@link BitsOptions BitsOptions}
   * @version 0.0.8
   * @returns {this}
   */
  parseBits(name: string, count: number, options?: BitsOptions): this;

  /**
   * Parses 32 bits (4 bytes) as a signed integer.
   *
   * The resulting value ranges from `-2147483648` to `2147483647`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.0.8
   * @returns {this}
   */
  parseInt(name: string): this;

  /**
   * Parses 8 bits (1 byte) as a signed integer.
   *
   * The resulting value ranges from `-128` to `127`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseInt8(name: string): this;

  /**
   * Parses 16 bits (2 bytes) as a signed integer.
   *
   * The resulting value ranges from `-32768` to `32767`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseInt16(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a signed integer.
   *
   * The resulting value ranges from `-2147483648` to `2147483647`
   *
   * Synonym of {@link #parseInt parseInt}
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseInt32(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a signed float.
   *
   * @param {string} name Variable name for parsed data
   * @version 0.0.8
   * @returns this
   */
  parseFloat(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `4294967295`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.0.8
   * @returns this
   */
  parseUInt(name: string): this;

  /**
   * Parses 8 bits (1 byte) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `255`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseUInt8(name: string): this;

  /**
   * Parses 16 bits (2 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `65535`
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseUInt16(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `4294967295`
   *
   * Synonym of {@link #parseUInt parseUInt}
   *
   * @param {string} name Variable name for parsed data
   * @version 0.1.0
   * @returns this
   */
  parseUInt32(name: string): this;

  /**
   * Parses binary data as ASCII characters
   *
   * @param {string} name Variable name for parsed data
   * @param {number} length Number of characters to parse
   * @version 0.0.8
   * @returns this
   */
  parseASCII(name: string, length: number): this;

  /**
   * Parses the passed buffer according to the previously defined rules
   *
   * @param {Buffer} value This value will be parsed
   * @throws {TypeError} Parser is empty
   * @throws {TypeError} Out of range
   * @returns {Object} Parsing result
   */
  parse(value: Buffer): { [key: string]: any };

  /**
   * Shifts the parser pointer a specified number of bits back
   *
   * @param {number} count The number of bits you need to go back
   * @version 0.0.8
   * @returns this
   */
  bitsBack(count: number): this;

  /**
   * Shifts the parser pointer a specified number of bits forward
   *
   * @param {number} count The number of bits you need to skip
   * @version 0.0.8
   * @returns this
   */
  bitsSkip(count: number): this;
}

/**
 * Export node addon
 *
 * @type {{ BinaryParser: new () => BinaryParser }}
 */
// tslint:disable-next-line: no-var-requires
const binaryParser: { BinaryParser: new () => BinaryParser } = require('../build/Release/BinaryParser');

/**
 * Export BinaryParser constructor
 *
 * @constructor BinaryParser
 * @exports node-binary-parser/BinaryParser
 */
export const BinaryParser: new () => BinaryParser = binaryParser.BinaryParser;
