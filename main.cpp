#include "main.h"

Persistent<Function> BinaryParser::constructor;

BinaryParser::BinaryParser()
{
}

BinaryParser::~BinaryParser()
{
}

void BinaryParser::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(
                          isolate, "BinaryParser", NewStringType::kNormal)
                          .ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "parse", Parse);
    NODE_SET_PROTOTYPE_METHOD(tpl, "parseBits", ParseBits);
    // NODE_SET_PROTOTYPE_METHOD(tpl, "parseASCII", ParseASCII);
    // NODE_SET_PROTOTYPE_METHOD(tpl, "parseUTF8", ParseUTF8);
    // NODE_SET_PROTOTYPE_METHOD(tpl, "parseInt", ParseInt);
    // NODE_SET_PROTOTYPE_METHOD(tpl, "parseFloat", ParseFloat);
    // NODE_SET_PROTOTYPE_METHOD(tpl, "parseUInt", ParseUInt);

    NODE_SET_PROTOTYPE_METHOD(tpl, "bitsBack", BitsBack);
    NODE_SET_PROTOTYPE_METHOD(tpl, "bitsSkip", BitsSkip);

    Local<Context> context = isolate->GetCurrentContext();
    constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context, String::NewFromUtf8(isolate, "BinaryParser", NewStringType::kNormal).ToLocalChecked(),
                 tpl->GetFunction(context).ToLocalChecked())
        .FromJust();
}

void BinaryParser::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    if (args.IsConstructCall())
    {
        BinaryParser *obj = new BinaryParser();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }
    else
    {
        // Invoked as plain function `MyObject(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = {args[0]};
        Local<Function> cons = Local<Function>::New(isolate, constructor);
        Local<Object> result =
            cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }
}

void BinaryParser::ParseBits(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    BinaryParser *obj = ObjectWrap::Unwrap<BinaryParser>(args.Holder());

    String::Utf8Value name(isolate, args[0]->ToString(context).ToLocalChecked());
    int bitsCount = args[1]->NumberValue(context).ToChecked();
    Local<Object> options = args[2]->IsObject() ? args[2]->ToObject(context).ToLocalChecked() : Object::New(isolate);

    ValueParser parser;
    parser.type = "bit";
    parser.name = *name;
    parser.bitsCount = bitsCount;

    if (options->HasOwnProperty(context, String::NewFromUtf8(isolate, "reOrder", String::kNormalString)).ToChecked())
    {
        Local<Value> reOrderOption = options->Get(context, String::NewFromUtf8(isolate, "reOrder", String::kNormalString)).ToLocalChecked();

        if (!reOrderOption->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate,
                                    "reOrder must be an array",
                                    NewStringType::kNormal)
                    .ToLocalChecked()));

            return;
        }

        Local<Array> reOrder = Handle<Array>::Cast(reOrderOption);

        for (size_t reOrderIndex = 0; reOrderIndex < reOrder->Length(); reOrderIndex++)
        {
            Local<Value> order = reOrder->Get(context, reOrderIndex).ToLocalChecked();

            if (order->IsObject())
            {
                Local<Object> orderObject = Handle<Object>::Cast(order);

                BytesOrder bO;

                Local<Value> startPos = orderObject->Get(context, String::NewFromUtf8(isolate, "startPos", String::kNormalString)).ToLocalChecked();
                Local<Value> count = orderObject->Get(context, String::NewFromUtf8(isolate, "count", String::kNormalString)).ToLocalChecked();
                Local<Value> newPos = orderObject->Get(context, String::NewFromUtf8(isolate, "newPos", String::kNormalString)).ToLocalChecked();

                if (!startPos->IsNumber())
                {
                    isolate->ThrowException(Exception::TypeError(
                        String::NewFromUtf8(isolate,
                                            "startPos must be an number",
                                            NewStringType::kNormal)
                            .ToLocalChecked()));

                    return;
                }
                else if (!count->IsNumber())
                {
                    isolate->ThrowException(Exception::TypeError(
                        String::NewFromUtf8(isolate,
                                            "count must be an number",
                                            NewStringType::kNormal)
                            .ToLocalChecked()));

                    return;
                }
                else if (!newPos->IsNumber())
                {
                    isolate->ThrowException(Exception::TypeError(
                        String::NewFromUtf8(isolate,
                                            "newPos must be an number",
                                            NewStringType::kNormal)
                            .ToLocalChecked()));

                    return;
                }

                bO.startPos = startPos->NumberValue(context).ToChecked();
                bO.count = count->NumberValue(context).ToChecked();
                bO.newPos = newPos->NumberValue(context).ToChecked();

                parser.reOrder.push_back(bO);
            }
            else
            {
                isolate->ThrowException(Exception::TypeError(
                    String::NewFromUtf8(isolate,
                                        "reOrder item must be an object",
                                        NewStringType::kNormal)
                        .ToLocalChecked()));
            }
        }
    }

    obj->parser_.push_back(parser);

    args.GetReturnValue().Set(args.This());
}

void BinaryParser::BitsBack(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    BinaryParser *obj = ObjectWrap::Unwrap<BinaryParser>(args.Holder());

    int bitsCount = args[1]->NumberValue(context).ToChecked();

    ValueParser parser;

    parser.type = "back";
    parser.bitsCount = bitsCount;

    obj->parser_.push_back(parser);

    args.GetReturnValue().Set(args.This());
}

void BinaryParser::BitsSkip(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    BinaryParser *obj = ObjectWrap::Unwrap<BinaryParser>(args.Holder());

    int bitsCount = args[1]->NumberValue(context).ToChecked();

    ValueParser parser;

    parser.type = "skip";
    parser.bitsCount = bitsCount;

    obj->parser_.push_back(parser);

    args.GetReturnValue().Set(args.This());
}

void BinaryParser::Parse(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    BinaryParser *obj = ObjectWrap::Unwrap<BinaryParser>(args.Holder());

    if (!obj->parser_.size())
    {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate,
                                "Parser is empty",
                                NewStringType::kNormal)
                .ToLocalChecked()));

        return;
    }

    // auto start = std::chrono::high_resolution_clock::now();

    int len = node::Buffer::Length(args[0]->ToObject(context).ToLocalChecked());
    char *data = node::Buffer::Data(args[0]->ToObject(context).ToLocalChecked());

    std::vector<char> bytes;
    bytes.insert(bytes.cbegin(), data, data + len);

    // const std::size_t bytesSize = bytes.size();

    // std::cout << bytesSize << std::endl;

    std::vector<bool> bitset;

    for (auto i = bytes.cbegin(); i != bytes.cend(); i++)
    {
        std::bitset<8> b(*i);

        // std::cout << b.to_string() << ' ';

        for (auto j = 0; j < 8; j++)
        {
            bitset.push_back(b[7 - j]);
        }
    }

    // std::cout << std::endl;

    // std::size_t space = 0;
    // for (auto i = bitset.cbegin(); i != bitset.cend(); i++)
    // {
    //     std::cout << std::bitset<1>(*i).to_string();
    //     ++space;

    //     if (space == 8)
    //     {
    //         space = 0;

    //         std::cout << ' ';
    //     }
    // }

    // std::cout << std::endl;

    uint from = 0;

    Handle<Object> toReturn = Object::New(isolate);

    for (auto parser = obj->parser_.cbegin(); parser != obj->parser_.cend(); parser++)
    {
        std::string parserType = (*parser).type;

        if (parserType == "bit")
        {
            if (bitset.size() < from + (*parser).bitsCount)
            {
                isolate->ThrowException(Exception::TypeError(
                    String::NewFromUtf8(isolate,
                                        "Out of range",
                                        NewStringType::kNormal)
                        .ToLocalChecked()));

                return;
            }

            std::vector<bool> b(bitset.cbegin() + from, bitset.cbegin() + from + (*parser).bitsCount);

            if ((*parser).reOrder.size())
            {
                std::vector<bool> bCopy(b);
                b.clear();

                std::vector<BytesOrder> bO((*parser).reOrder);

                std::sort(bO.begin(), bO.end());

                for (auto order = bO.cbegin(); order != bO.cend(); order++)
                {
                    b.insert(b.cbegin() + (*order).newPos, bCopy.cbegin() + (*order).startPos, bCopy.cbegin() + (*order).startPos + (*order).count);
                }
            }

            unsigned long parsed = std::accumulate(b.begin(), b.end(), 0, [](int x, int y) { return (x << 1) + y; });

            toReturn->Set(String::NewFromUtf8(isolate, (*parser).name.c_str()), Number::New(isolate, parsed));

            from += (unsigned long)(*parser).bitsCount;
        }
        else if (parserType == "skip")
        {
            from += (unsigned long)(*parser).bitsCount;
        }
        else if (parserType == "back")
        {
            from -= (unsigned long)(*parser).bitsCount;
        }
    }

    // auto stop = std::chrono::high_resolution_clock::now();
    // auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);

    // std::cout << "Time taken by function: " << duration.count() << std::endl;

    args.GetReturnValue()
        .Set(toReturn);
}

void InitAll(Local<Object> exports)
{
    BinaryParser::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

int main()
{
    return 0;
}