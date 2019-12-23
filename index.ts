import { BinaryParser as BinaryParserType } from "./src/BinaryParser";

const binaryParser = require("./build/Release/BinaryParser");

export var BinaryParser: {
  new (): BinaryParserType;
} = binaryParser.BinaryParser;
