# Node Binary Parser

Library for parsing binary data by rules.

[![Build Status](https://travis-ci.com/sergak01/node-binary-parser.svg?branch=master)](https://travis-ci.com/sergak01/node-binary-parser)
[![codecov](https://codecov.io/gh/sergak01/node-binary-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/sergak01/node-binary-parser)
![NPM](https://img.shields.io/npm/l/node-binary-parser)
![npm](https://img.shields.io/npm/v/node-binary-parser)
![npm](https://img.shields.io/npm/dm/node-binary-parser)

## Install

### npm

```bash
npm i node-binary-parser
```

### yarn

```bash
yarn add node-binary-parser
```

## Usage

```js
import { BinaryParser } from 'node-binary-parser';

const parser = new BinaryParser();

parser.parseBits('first', 1);
parser.parseBits('second', 1);

const result = parser.parse(Buffer.from('70')); // result => { first: 0, second: 1 }
```
