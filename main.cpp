#include "main.h"

namespace binaryParser {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  BinaryParser::Init(env, exports);

  return exports;
}

BinaryParser::BinaryParser(const Napi::CallbackInfo& info) : Napi::ObjectWrap<BinaryParser>(info) {}

BinaryParser::~BinaryParser() {
  this->parser_.clear();
}

// Initialize code in node.js
Napi::Object BinaryParser::Init(Napi::Env env, Napi::Object exports) {
  auto attributes = static_cast<napi_property_attributes>(napi_writable | napi_configurable);
  // This method is used to hook the accessor and method callbacks
  Napi::Function func = DefineClass(env, "BinaryParser",
                                    {
                                        StaticMethod<&BinaryParser::CreateNewItem>("CreateNewItem", attributes),

                                        InstanceMethod<&BinaryParser::ParseBits>("parseBits", attributes),
                                        InstanceMethod<&BinaryParser::ParseASCII>("parseASCII", attributes),

                                        InstanceMethod<&BinaryParser::ParseInt>("parseInt", attributes),
                                        InstanceMethod<&BinaryParser::ParseInt8>("parseInt8", attributes),
                                        InstanceMethod<&BinaryParser::ParseInt16>("parseInt16", attributes),
                                        InstanceMethod<&BinaryParser::ParseInt>("parseInt32", attributes),

                                        InstanceMethod<&BinaryParser::ParseFloat>("parseFloat", attributes),

                                        InstanceMethod<&BinaryParser::ParseUInt>("parseUInt", attributes),
                                        InstanceMethod<&BinaryParser::ParseUInt8>("parseUInt8", attributes),
                                        InstanceMethod<&BinaryParser::ParseUInt16>("parseUInt16", attributes),
                                        InstanceMethod<&BinaryParser::ParseUInt>("parseUInt32", attributes),

                                        InstanceMethod<&BinaryParser::BitsBack>("bitsBack", attributes),
                                        InstanceMethod<&BinaryParser::BitsSkip>("bitsSkip", attributes),

                                        InstanceMethod<&BinaryParser::Parse>("parse", attributes),
                                    });

  auto* constructor = new Napi::FunctionReference();

  // Create a persistent reference to the class constructor. This will allow
  // a function called on a class prototype and a function
  // called on instance of a class to be distinguished from each other.
  *constructor = Napi::Persistent(func);
  exports.Set("BinaryParser", func);

  // Store the constructor as the add-on instance data. This will allow this
  // add-on to support multiple instances of itself running on multiple worker
  // threads, as well as multiple instances of itself running in different
  // contexts on the same thread.
  //
  // By default, the value set on the environment here will be destroyed when
  // the add-on is unloaded using the `delete` operator, but it is also
  // possible to supply a custom deleter.
  env.SetInstanceData<Napi::FunctionReference>(constructor);

  return exports;
}

// Create a new item using the constructor stored during Init.
Napi::Value BinaryParser::CreateNewItem(const Napi::CallbackInfo& info) {
  // Retrieve the instance data we stored during `Init()`. We only stored the
  // constructor there, so we retrieve it here to create a new instance of the
  // JS class the constructor represents.
  auto* constructor = info.Env().GetInstanceData<Napi::FunctionReference>();
  return constructor->New({});
}

Napi::Value BinaryParser::ParseBits(const Napi::CallbackInfo& info) {
  auto env = info.Env();

  auto name = info[0].As<Napi::String>().Utf8Value();

  int bitsCount = info[1].As<Napi::Number>().Int32Value();
  auto options = info[2].IsObject() ? info[2].As<Napi::Object>() : Napi::Object::New(env);

  ValueParser parser;
  parser.type = ParserType::BIT;
  parser.name = name;
  parser.bitsCount = bitsCount;

  if (options.HasOwnProperty("reOrder")) {
    auto reOrderOption = options.Get("reOrder");

    if (!reOrderOption.IsArray()) {
      Napi::TypeError::New(env, "reOrder must be an array").ThrowAsJavaScriptException();

      return env.Undefined();
    }

    auto reOrder = reOrderOption.As<Napi::Array>();

    for (size_t reOrderIndex = 0; reOrderIndex < reOrder.Length(); reOrderIndex++) {
      auto order = reOrder.Get(reOrderIndex);

      if (order.IsObject()) {
        auto orderObject = order.As<Napi::Object>();

        BytesOrder bO;

        auto startPos = orderObject.Get("startPos");
        auto count = orderObject.Get("count");
        auto newPos = orderObject.Get("newPos");

        if (!startPos.IsNumber()) {
          Napi::TypeError::New(env, "startPos must be an number").ThrowAsJavaScriptException();

          return env.Undefined();
        } else if (!count.IsNumber()) {
          Napi::TypeError::New(env, "count must be an number").ThrowAsJavaScriptException();

          return env.Undefined();
        } else if (!newPos.IsNumber()) {
          Napi::TypeError::New(env, "newPos must be an number").ThrowAsJavaScriptException();

          return env.Undefined();
        }

        bO.startPos = startPos.As<Napi::Number>().Int32Value();
        bO.count = count.As<Napi::Number>().Int32Value();
        bO.newPos = newPos.As<Napi::Number>().Int32Value();

        parser.reOrder.push_back(bO);
      } else {
        Napi::TypeError::New(env, "reOrder item must be an object").ThrowAsJavaScriptException();

        return env.Undefined();
      }
    }
  }

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::ParseInt(const Napi::CallbackInfo& info, IntLength length) {
  auto name = info[0].As<Napi::String>().Utf8Value();

  ValueParser parser;
  parser.type = ParserType::INT;
  parser.name = name;
  parser.bitsCount = length;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::ParseInt(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseInt(info, IntLength::_32);
}

Napi::Value BinaryParser::ParseInt8(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseInt(info, IntLength::_8);
}

Napi::Value BinaryParser::ParseInt16(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseInt(info, IntLength::_16);
}

Napi::Value BinaryParser::ParseFloat(const Napi::CallbackInfo& info) {
  auto name = info[0].As<Napi::String>().Utf8Value();

  ValueParser parser;
  parser.type = ParserType::FLOAT;
  parser.name = name;
  parser.bitsCount = sizeof(float) * 8;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::ParseUInt(const Napi::CallbackInfo& info, UIntLength length) {
  auto name = info[0].As<Napi::String>().Utf8Value();

  ValueParser parser;
  parser.type = ParserType::UINT;
  parser.name = name;
  parser.bitsCount = length;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::ParseUInt(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseUInt(info, UIntLength::_32);
}

Napi::Value BinaryParser::ParseUInt8(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseUInt(info, UIntLength::_8);
}

Napi::Value BinaryParser::ParseUInt16(const Napi::CallbackInfo& info) {
  return BinaryParser::ParseUInt(info, UIntLength::_16);
}

Napi::Value BinaryParser::ParseASCII(const Napi::CallbackInfo& info) {
  auto name = info[0].As<Napi::String>().Utf8Value();
  int charCount = info[1].As<Napi::Number>().Int32Value();

  ValueParser parser;
  parser.type = ParserType::ASCII;
  parser.name = name;
  parser.bitsCount = sizeof(uint8_t) * 8 * charCount;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::BitsBack(const Napi::CallbackInfo& info) {
  int bitsCount = info[0].As<Napi::Number>().Int32Value();

  ValueParser parser;

  parser.type = ParserType::BACK;
  parser.bitsCount = bitsCount;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::BitsSkip(const Napi::CallbackInfo& info) {
  int bitsCount = info[0].As<Napi::Number>().Int32Value();

  ValueParser parser;

  parser.type = ParserType::SKIP;
  parser.bitsCount = bitsCount;

  this->parser_.push_back(parser);

  return info.This();
}

Napi::Value BinaryParser::Parse(const Napi::CallbackInfo& info) {
  auto env = info.Env();

  if (!this->parser_.size()) {
    Napi::TypeError::New(env, "Parser is empty").ThrowAsJavaScriptException();

    return env.Undefined();
  }

  // auto start = std::chrono::high_resolution_clock::now();
  if (!info[0].IsBuffer()) {
    Napi::TypeError::New(env, "buffer must be Buffer").ThrowAsJavaScriptException();

    return env.Undefined();
  }

  auto buffer = info[0].As<Napi::Buffer<uint8_t>>();

  int len = buffer.Length();
  auto data = buffer.Data();

  std::vector<char> bytes;
  bytes.insert(bytes.cbegin(), data, data + len);

  std::vector<bool> bitset;

  for (auto i = bytes.cbegin(); i != bytes.cend(); i++) {
    std::bitset<8> b(*i);

    for (auto j = 0; j < 8; j++) {
      bitset.push_back(b[7 - j]);
    }
  }

  unsigned int from = 0;

  auto toReturn = Napi::Object::New(env);

  for (auto parser = this->parser_.cbegin(); parser != this->parser_.cend(); parser++) {
    auto parserType = (*parser).type;

    if (bitset.size() < from + (*parser).bitsCount) {
      Napi::TypeError::New(env, "Out of range").ThrowAsJavaScriptException();

      return env.Undefined();
    }

    switch (parserType) {
      case ParserType::BIT: {
        std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

        if ((*parser).reOrder.size()) {
          std::vector<bool> bCopy(b);
          b.clear();

          std::vector<BytesOrder> bO((*parser).reOrder);

          std::sort(bO.begin(), bO.end());

          for (auto order = bO.cbegin(); order != bO.cend(); order++) {
            b.insert(b.cbegin() + (*order).newPos, bCopy.cbegin() + (*order).startPos,
                     bCopy.cbegin() + (*order).startPos + (*order).count);
          }
        }

        unsigned long parsed = std::accumulate(b.begin(), b.end(), 0, [](int x, int y) { return (x << 1) + y; });

        toReturn.Set((*parser).name.c_str(), parsed);

        break ;
      }

      case ParserType::INT: {
        std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

        Napi::Number number;

        int parsed = std::accumulate(b.begin(), b.end(), 0, [](int x, int y) { return (x << 1) + y; });

        switch ((*parser).bitsCount) {
          case 8:
            number = Napi::Number::New(env, (int8_t)parsed);

            break;

          case 16:
            number = Napi::Number::New(env, (int16_t)parsed);

            break;

          default:
            number = Napi::Number::New(env, (int32_t)parsed);

            break;
        }

        toReturn.Set((*parser).name.c_str(), number);

        break ;
      }

      case ParserType::FLOAT: {
        std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

        int parsedInt = std::accumulate(b.begin(), b.end(), 0, [](int x, int y) { return (x << 1) + y; });
        float parsed = *((float*)&parsedInt);

        toReturn.Set((*parser).name.c_str(), parsed);

        break ;
      }

      case ParserType::UINT: {
        std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

        unsigned int parsed = std::accumulate(b.begin(), b.end(), 0, [](int x, int y) { return (x << 1) + y; });

        toReturn.Set((*parser).name.c_str(), parsed);

        break ;
      }

      case ParserType::ASCII: {
        std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

        std::string ascii = "";

        for (auto bIter = b.cbegin(); bIter != b.cend(); bIter += 8) {
          std::vector<bool> charBitset(bIter, bIter + 8);

          ascii.push_back((unsigned char)std::accumulate(charBitset.cbegin(), charBitset.cend(), 0,
                                                         [](int x, int y) { return (x << 1) + y; }));
        }

        toReturn.Set((*parser).name.c_str(), ascii.c_str());

        break ;
      }

      case ParserType::BACK: {
        from -= (unsigned long)(*parser).bitsCount;

        break ;
      }

      default:
        break ;
    }

    if (parserType != ParserType::BACK) {
      from += (unsigned long)(*parser).bitsCount;
    }
  }

  // auto stop = std::chrono::high_resolution_clock::now();
  // auto duration =
  // std::chrono::duration_cast<std::chrono::microseconds>(stop
  // - start);

  // std::cout << "Time taken by function: " << duration.count() << std::endl;

  return toReturn;
}

}  // namespace binaryParser
