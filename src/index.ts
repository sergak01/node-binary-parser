export interface ReOrder {
  startPos: number;
  count: number;
  newPos: number;
}

export interface BitsOptions {
  reOrder?: ReOrder[];
}

export interface BinaryParser {
  parseBits(name: string, count: number, options?: BitsOptions): BinaryParser;
  parseInt(name: string): BinaryParser;
  parseUInt(name: string): BinaryParser;
  parseASCII(name: string, length: number): BinaryParser;
  parse(value: Buffer): { [key: string]: any };

  bitsBack(count: number): BinaryParser;
  bitsSkip(count: number): BinaryParser;
}

const binaryParser = require("../build/Release/BinaryParser");

export var BinaryParser: {
  new (): BinaryParser;
} = binaryParser.BinaryParser;
