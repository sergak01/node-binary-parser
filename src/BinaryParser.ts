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
  parse(value: Buffer): { [key: string]: any };

  bitsBack(count: number): BinaryParser;
  bitsSkip(count: number): BinaryParser;
}
