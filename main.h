#ifndef BINARY_PARSER_MAIN_H
#define BINARY_PARSER_MAIN_H

#include <algorithm>
#include <bitset>
#include <chrono>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

#include "napi.h"

namespace binaryParser {

struct BytesOrder {
  int startPos;
  int count;
  int newPos;

  bool operator<(const BytesOrder& i) {
    return newPos < i.newPos;
  }
};

enum class ParserType { BACK = 0, SKIP = 1, BIT = 10, ASCII, UTF8, INT, FLOAT, UINT };

struct ValueParser {
  ParserType type;
  std::string name;
  int bitsCount;
  std::vector<BytesOrder> reOrder;
};

struct parseResult {
  std::string name;
  unsigned long value;
};

typedef enum UIntLength { _8 = 8, _16 = 16, _32 = 32 } IntLength;

class BinaryParser : public Napi::ObjectWrap<BinaryParser> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  explicit BinaryParser(const Napi::CallbackInfo& info);
  static Napi::Value CreateNewItem(const Napi::CallbackInfo& info);

  ~BinaryParser() override;

 private:
  Napi::Value ParseBits(const Napi::CallbackInfo& info);
  Napi::Value ParseASCII(const Napi::CallbackInfo& info);
  Napi::Value ParseUTF8(const Napi::CallbackInfo& info);

  Napi::Value ParseInt(const Napi::CallbackInfo& info);
  Napi::Value ParseInt8(const Napi::CallbackInfo& info);
  Napi::Value ParseInt16(const Napi::CallbackInfo& info);

  Napi::Value ParseInt(const Napi::CallbackInfo& info, IntLength length);

  Napi::Value ParseFloat(const Napi::CallbackInfo& info);

  Napi::Value ParseUInt(const Napi::CallbackInfo& info);
  Napi::Value ParseUInt8(const Napi::CallbackInfo& info);
  Napi::Value ParseUInt16(const Napi::CallbackInfo& info);

  Napi::Value ParseUInt(const Napi::CallbackInfo& info, UIntLength length);

  Napi::Value BitsBack(const Napi::CallbackInfo& info);
  Napi::Value BitsSkip(const Napi::CallbackInfo& info);

  Napi::Value Parse(const Napi::CallbackInfo& info);

  std::vector<ValueParser> parser_;
};

// Initialize native add-on
Napi::Object Init(Napi::Env env, Napi::Object exports);

// Register and initialize native add-on
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace binaryParser

#endif  // BINARY_PARSER_MAIN_H
