#include <node.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

#include <algorithm>
#include <bitset>
#include <chrono>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>


using v8::Array;
using v8::ArrayBuffer;
using v8::Context;
using v8::Exception;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::MaybeLocal;
using v8::Name;
using v8::NewStringType;
using v8::Number;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;

struct BytesOrder {
  int startPos;
  int count;
  int newPos;

  bool operator<(const BytesOrder& i) {
    return newPos < i.newPos;
  }
};

struct ValueParser {
  std::string type;
  std::string name;
  int bitsCount;
  std::vector<BytesOrder> reOrder;
};

struct parseResult {
  std::string name;
  unsigned long value;
};

typedef enum UIntLength { _8 = 8, _16 = 16, _32 = 32 } IntLength;

#ifndef MAIN_H
#define MAIN_H

class BinaryParser : public node::ObjectWrap {
 private:
  explicit BinaryParser();
  ~BinaryParser();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseBits(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseASCII(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseUTF8(const v8::FunctionCallbackInfo<v8::Value>& args);

  static void ParseInt(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseInt8(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseInt16(const v8::FunctionCallbackInfo<v8::Value>& args);

  static void ParseInt(const v8::FunctionCallbackInfo<v8::Value>& args, IntLength length);

  static void ParseFloat(const v8::FunctionCallbackInfo<v8::Value>& args);

  static void ParseUInt(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseUInt8(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ParseUInt16(const v8::FunctionCallbackInfo<v8::Value>& args);

  static void ParseUInt(const v8::FunctionCallbackInfo<v8::Value>& args, UIntLength length);

  static void BitsBack(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void BitsSkip(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void Parse(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Persistent<v8::Function> constructor;

  std::vector<ValueParser> parser_;

 public:
  static void Init(v8::Local<v8::Object> exports);
};

#endif