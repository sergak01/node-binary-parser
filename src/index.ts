/**
 * BinaryParser module
 *
 * @module node-binary-parser
 */

/**
 * ReOrder interface
 *
 * @interface ReOrder
 * @property {number} startPos See {@link startPos startPos}
 * @property {number} count See {@link count count}
 * @property {number} newPos See {@link newPos newPos}
 * @version 0.0.8
 * @since 0.0.8
 */
interface ReOrder {
  /**
   * Start position
   *
   * @type {number}
   * @version 0.0.8
   * @since 0.0.8
   */
  startPos: number;

  /**
   * Count of bits for reordering
   *
   * @type {number}
   * @version 0.0.8
   * @since 0.0.8
   */
  count: number;

  /**
   * New position for bits
   *
   * @type {number}
   * @version 0.0.8
   * @since 0.0.8
   */
  newPos: number;
}

/**
 * Options interface for {@link BinaryParser.parseBits parseBits} method
 *
 * @interface BitsOptions
 * @property {ReOrder[]} reOrder See {@link reOrder reOrder}
 * @version 0.0.8
 * @since 0.0.8
 */
interface BitsOptions {
  /**
   * Array or ReOrder interfaces
   *
   * @type {ReOrder[]}
   * @version 0.0.8
   * @since 0.0.8
   */
  reOrder?: ReOrder[];
}

/**
 * BinaryParser interface
 *
 * @interface BinaryParser
 * @exports node-binary-parser/BinaryParser
 * @version 0.1.0
 * @since 0.0.8
 */
export interface BinaryParser {
  /**
   * Parses `count` bits as unsigned integer
   *
   * @param {string} name Variable name for parsed data
   * @param {number} count Number of bits for parsing. Must be greater than `0`
   * @param {BitsOptions} [options] See {@link BitsOptions BitsOptions}
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseBits('test', 10);
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns {this}
   */
  parseBits(name: string, count: number, options?: BitsOptions): this;

  /**
   * Parses 32 bits (4 bytes) as a signed integer.
   *
   * The resulting value ranges from `-2147483648` to `2147483647`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseInt('test');
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns {this}
   */
  parseInt(name: string): this;

  /**
   * Parses 8 bits (1 byte) as a signed integer.
   *
   * The resulting value ranges from `-128` to `127`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseInt8('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseInt8(name: string): this;

  /**
   * Parses 16 bits (2 bytes) as a signed integer.
   *
   * The resulting value ranges from `-32768` to `32767`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseInt16('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseInt16(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a signed integer.
   *
   * The resulting value ranges from `-2147483648` to `2147483647`
   *
   * Synonym of {@link parseInt parseInt}
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseInt32('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseInt32(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a signed float.
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseFloat('test');
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns this
   */
  parseFloat(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `4294967295`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseUInt('test');
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns this
   */
  parseUInt(name: string): this;

  /**
   * Parses 8 bits (1 byte) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `255`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseUInt8('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseUInt8(name: string): this;

  /**
   * Parses 16 bits (2 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `65535`
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseUInt16('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseUInt16(name: string): this;

  /**
   * Parses 32 bits (4 bytes) as a unsigned integer.
   *
   * The resulting value ranges from `0` to `4294967295`
   *
   * Synonym of {@link parseUInt parseUInt}
   *
   * @param {string} name Variable name for parsed data
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseUInt32('test');
   *
   * @version 0.1.0
   * @since 0.1.0
   * @returns this
   */
  parseUInt32(name: string): this;

  /**
   * Parses binary data as ASCII characters
   *
   * @param {string} name Variable name for parsed data
   * @param {number} length Number of characters to parse
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseASCII('test', 4);
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns this
   */
  parseASCII(name: string, length: number): this;

  /**
   * Parses the passed buffer according to the previously defined rules
   *
   * @param {Buffer} value This value will be parsed
   * @throws {TypeError} Parser is empty
   * @throws {TypeError} Out of range
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.parseASCII('test', 4);
   * parser.parser(Buffer.from('aabbccdd', 'hex'));
   *
   * @version 0.1.0
   * @since 0.0.8
   * @returns {Object} Parsing result
   */
  parse(value: Buffer): { [key: string]: any };

  /**
   * Shifts the parser pointer a specified number of bits back
   *
   * @param {number} count The number of bits you need to go back
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.bitsBack(4);
   *
   * @version 0.0.8
   * @since 0.0.8
   * @returns this
   */
  bitsBack(count: number): this;

  /**
   * Shifts the parser pointer a specified number of bits forward
   *
   * @param {number} count The number of bits you need to skip
   *
   * @example ```js
   * const parser = new BinaryParser();
   * parser.bitsSkip(4);
   *
   * @version 0.0.8
   * @since 0.0.8
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
