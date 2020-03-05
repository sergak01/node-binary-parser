import { BinaryParser } from '../src';

describe('BinaryParser', () => {
  describe('parseBits', () => {
    let parser: BinaryParser;

    describe('without options', () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser.parseBits('testFirst', 4).parseBits('testLast', 4);
      });

      it('to equal object { testFirst: 0, testLast: 15 }', async done => {
        const data = Buffer.from('0f', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 0,
          testLast: 15,
        });

        done();
      });

      it('to equal object { testFirst: 15, testLast: 15 }', async done => {
        const data = Buffer.from('ff', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 15,
          testLast: 15,
        });

        done();
      });

      it('to equal object { testFirst: 1, testLast: 1 }', async done => {
        const data = Buffer.from('11', 'hex');

        expect(parser.parse(data)).toMatchObject({ testFirst: 1, testLast: 1 });

        done();
      });
    });

    describe('with reOrder option', () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser
          .parseBits('testFirst', 4, {
            reOrder: [
              { startPos: 2, count: 1, newPos: 0 },
              { startPos: 3, count: 1, newPos: 1 },
              { startPos: 0, count: 2, newPos: 2 },
            ],
          })
          .parseBits('testLast', 4);
      });

      it('to equal object { testFirst: 0, testLast: 15 }', async done => {
        const data = Buffer.from('0f', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 0,
          testLast: 15,
        });

        done();
      });

      it('to equal object { testFirst: 15, testLast: 15 }', async done => {
        const data = Buffer.from('ff', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 15,
          testLast: 15,
        });

        done();
      });

      it('to equal object { testFirst: 4, testLast: 1 }', async done => {
        const data = Buffer.from('11', 'hex');

        expect(parser.parse(data)).toMatchObject({ testFirst: 4, testLast: 1 });

        done();
      });

      it('to equal object { testFirst: 4, testLast: 1 }', async done => {
        const data = Buffer.from('41', 'hex');

        expect(parser.parse(data)).toMatchObject({ testFirst: 1, testLast: 1 });

        done();
      });

      it('to equal object { testFirst: 2, testLast: 1 }', async done => {
        const data = Buffer.from('81', 'hex');

        expect(parser.parse(data)).toMatchObject({ testFirst: 2, testLast: 1 });

        done();
      });

      it('to equal object { testFirst: 10, testLast: 1 }', async done => {
        const data = Buffer.from('a1', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 10,
          testLast: 1,
        });

        done();
      });

      it('to equal object { testFirst: 14, testLast: 1 }', async done => {
        const data = Buffer.from('b1', 'hex');

        expect(parser.parse(data)).toMatchObject({
          testFirst: 14,
          testLast: 1,
        });

        done();
      });
    });
  });

  describe('bitsSkip', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.bitsSkip(4).parseBits('test', 2);
    });

    it('to equal 2', async done => {
      const data = Buffer.from('08', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 2 });

      done();
    });
  });

  describe('parseInt', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseInt('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('00000001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 2147483647', async done => {
      const data = Buffer.from('7fffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 2147483647 });

      done();
    });

    it('to equal -1', async done => {
      const data = Buffer.from('ffffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });

    it('to equal -2147483648', async done => {
      const data = Buffer.from('80000000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -2147483648 });

      done();
    });
  });

  describe('parseInt8', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseInt8('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('01', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 127', async done => {
      const data = Buffer.from('7f', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 127 });

      done();
    });

    it('to equal -1', async done => {
      const data = Buffer.from('ff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });

    it('to equal -128', async done => {
      const data = Buffer.from('80', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -128 });

      done();
    });
  });

  describe('parseInt16', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseInt16('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('0001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 32767', async done => {
      const data = Buffer.from('7fff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 32767 });

      done();
    });

    it('to equal -1', async done => {
      const data = Buffer.from('ffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });

    it('to equal -32768', async done => {
      const data = Buffer.from('8000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -32768 });

      done();
    });
  });

  describe('parseInt32', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseInt32('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('00000001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 2147483647', async done => {
      const data = Buffer.from('7fffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 2147483647 });

      done();
    });

    it('to equal -1', async done => {
      const data = Buffer.from('ffffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });

    it('to equal -2147483648', async done => {
      const data = Buffer.from('80000000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -2147483648 });

      done();
    });
  });

  describe('parseFloat', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseFloat('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('3f800000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 4f000000', async done => {
      const data = Buffer.from('4f000000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 2147483648 });

      done();
    });

    it('to equal 1.401298464324817e-45', async done => {
      const data = Buffer.from('00000001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1.401298464324817e-45 });

      done();
    });

    it('to equal 3.4028234663852886e+38', async done => {
      const data = Buffer.from('7f7fffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 3.4028234663852886e38 });

      done();
    });

    it('to equal -3.4028234663852886e+38', async done => {
      const data = Buffer.from('ff7fffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -3.4028234663852886e38 });

      done();
    });

    it('to equal 1.1754942106924411e-38', async done => {
      const data = Buffer.from('007fffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1.1754942106924411e-38 });

      done();
    });

    it('to equal -1', async done => {
      const data = Buffer.from('bf800000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: -1 });

      done();
    });

    it('to equal 14.5', async done => {
      const data = Buffer.from('41680000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 14.5 });

      done();
    });

    it('to equal 934.0040283203125', async done => {
      const data = Buffer.from('44698042', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 934.0040283203125 });

      done();
    });

    it('to equal Infinity', async done => {
      const data = Buffer.from('7f800000', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: Infinity });

      done();
    });
  });

  describe('parseUInt', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseUInt('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('00000001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 4294967295', async done => {
      const data = Buffer.from('ffffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 4294967295 });

      done();
    });
  });

  describe('parseUInt8', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseUInt8('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('01', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 255', async done => {
      const data = Buffer.from('ff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 255 });

      done();
    });
  });

  describe('parseUInt16', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseUInt16('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('0001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 65535', async done => {
      const data = Buffer.from('ffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 65535 });

      done();
    });
  });

  describe('parseUInt32', () => {
    let parser: BinaryParser;

    beforeEach(async () => {
      parser = new BinaryParser();

      parser.parseUInt32('test');
    });

    it('to equal 1', async done => {
      const data = Buffer.from('00000001', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 1 });

      done();
    });

    it('to equal 4294967295', async done => {
      const data = Buffer.from('ffffffff', 'hex');

      expect(parser.parse(data)).toMatchObject({ test: 4294967295 });

      done();
    });
  });

  describe('parseASCII', () => {
    let parser: BinaryParser;

    describe('two chars', () => {
      beforeEach(async () => {
        parser = new BinaryParser();

        parser.parseASCII('test', 2);
      });

      it('to equal empty string', async done => {
        const data = Buffer.from('0000', 'hex');

        expect(parser.parse(data)).toMatchObject({ test: '' });

        done();
      });

      it("to equal string 'AA'", async done => {
        const data = Buffer.from('4141', 'hex');

        expect(parser.parse(data)).toMatchObject({ test: 'AA' });

        done();
      });

      it("to equal string 'RR'", async done => {
        const data = Buffer.from('5252', 'hex');

        expect(parser.parse(data)).toMatchObject({ test: 'RR' });

        done();
      });

      it("to equal string '~~'", async done => {
        const data = Buffer.from('~~', 'utf-8');

        expect(parser.parse(data)).toMatchObject({ test: '~~' });

        done();
      });

      it("to equal string ' ~'", async done => {
        const data = Buffer.from('207e', 'hex');

        expect(parser.parse(data)).toMatchObject({ test: ' ~' });

        done();
      });
    });

    describe('parse words', () => {
      beforeEach(async () => {
        parser = new BinaryParser();
      });

      it("to equal string 'Test'", async done => {
        parser.parseASCII('test', 4);

        const data = Buffer.from('54657374', 'hex');

        expect(parser.parse(data)).toMatchObject({ test: 'Test' });

        done();
      });

      it("to equal string 'Ping-Pong'", async done => {
        parser.parseASCII('test', 9);

        const data = Buffer.from('Ping-Pong', 'utf-8');

        expect(parser.parse(data)).toMatchObject({ test: 'Ping-Pong' });

        done();
      });
    });
  });
});
