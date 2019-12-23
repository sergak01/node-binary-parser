import { BinaryParser } from "../src/index";

describe("BinaryParser", () => {
  describe("parseBits", () => {
    let parser: BinaryParser;

    describe("without options", () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser.parseBits("testFirst", 4).parseBits("testLast", 4);
      });

      it("to equal object { testFirst: 0, testLast: 15 }", async done => {
        const data = Buffer.from("0f", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 0,
          testLast: 15
        });

        done();
      });

      it("to equal object { testFirst: 15, testLast: 15 }", async done => {
        const data = Buffer.from("ff", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 15,
          testLast: 15
        });

        done();
      });

      it("to equal object { testFirst: 1, testLast: 1 }", async done => {
        const data = Buffer.from("11", "hex");

        expect(parser.parse(data)).toMatchObject({ testFirst: 1, testLast: 1 });

        done();
      });
    });

    describe("with reOrder option", () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser
          .parseBits("testFirst", 4, {
            reOrder: [
              { startPos: 2, count: 1, newPos: 0 },
              { startPos: 3, count: 1, newPos: 1 },
              { startPos: 0, count: 2, newPos: 2 }
            ]
          })
          .parseBits("testLast", 4);
      });

      it("to equal object { testFirst: 0, testLast: 15 }", async done => {
        const data = Buffer.from("0f", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 0,
          testLast: 15
        });

        done();
      });

      it("to equal object { testFirst: 15, testLast: 15 }", async done => {
        const data = Buffer.from("ff", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 15,
          testLast: 15
        });

        done();
      });

      it("to equal object { testFirst: 4, testLast: 1 }", async done => {
        const data = Buffer.from("11", "hex");

        expect(parser.parse(data)).toMatchObject({ testFirst: 4, testLast: 1 });

        done();
      });

      it("to equal object { testFirst: 4, testLast: 1 }", async done => {
        const data = Buffer.from("41", "hex");

        expect(parser.parse(data)).toMatchObject({ testFirst: 1, testLast: 1 });

        done();
      });

      it("to equal object { testFirst: 2, testLast: 1 }", async done => {
        const data = Buffer.from("81", "hex");

        expect(parser.parse(data)).toMatchObject({ testFirst: 2, testLast: 1 });

        done();
      });

      it("to equal object { testFirst: 10, testLast: 1 }", async done => {
        const data = Buffer.from("a1", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 10,
          testLast: 1
        });

        done();
      });

      it("to equal object { testFirst: 14, testLast: 1 }", async done => {
        const data = Buffer.from("b1", "hex");

        expect(parser.parse(data)).toMatchObject({
          testFirst: 14,
          testLast: 1
        });

        done();
      });
    });
  });

  describe("bitsSkip", () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.bitsSkip(4).parseBits("test", 2);
    });

    it("to equal 2", async done => {
      const data = Buffer.from("08", "hex");

      expect(parser.parse(data)).toMatchObject({ test: 2 });

      done();
    });
  });

  describe("parseInt", () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseInt("test");
    });

    it("to equal 1", async done => {
      const data = Buffer.from("00000001", "hex");

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it("to equal -1", async done => {
      const data = Buffer.from("ffffffff", "hex");

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });
  });

  describe("parseUInt", () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseUInt("test");
    });

    it("to equal 1", async done => {
      const data = Buffer.from("00000001", "hex");

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it("to equal 4294967295", async done => {
      const data = Buffer.from("ffffffff", "hex");

      expect(parser.parse(data)).toMatchObject({ test: 4294967295 });

      done();
    });
  });

  describe("parseASCII", () => {
    let parser: BinaryParser;

    describe("two chars", () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser.parseASCII("test", 2);
      });

      it("to equal empty string", async done => {
        const data = Buffer.from("0000", "hex");

        expect(parser.parse(data)).toMatchObject({ test: "" });

        done();
      });

      it("to equal string 'AA'", async done => {
        const data = Buffer.from("4141", "hex");

        expect(parser.parse(data)).toMatchObject({ test: "AA" });

        done();
      });

      it("to equal string 'RR'", async done => {
        const data = Buffer.from("5252", "hex");

        expect(parser.parse(data)).toMatchObject({ test: "RR" });

        done();
      });

      it("to equal string '~~'", async done => {
        const data = Buffer.from("~~", "utf-8");

        expect(parser.parse(data)).toMatchObject({ test: "~~" });

        done();
      });

      it("to equal string ' ~'", async done => {
        const data = Buffer.from("207e", "hex");

        expect(parser.parse(data)).toMatchObject({ test: " ~" });

        done();
      });
    });

    describe("parse words", () => {
      beforeEach(async () => {
        parser = new BinaryParser();
      });

      it("to equal string 'Test'", async done => {
        parser.parseASCII("test", 4);

        const data = Buffer.from("54657374", "hex");

        expect(parser.parse(data)).toMatchObject({ test: "Test" });

        done();
      });

      it("to equal string 'Ping-Pong'", async done => {
        parser.parseASCII("test", 9);

        const data = Buffer.from("Ping-Pong", "utf-8");

        expect(parser.parse(data)).toMatchObject({ test: "Ping-Pong" });

        done();
      });
    });
  });
});
