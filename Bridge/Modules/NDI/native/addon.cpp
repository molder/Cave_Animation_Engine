#include <napi.h>


Napi::Value CreateSender(
    const Napi::CallbackInfo& info
)
{
    Napi::Env env = info.Env();

    return Napi::Boolean::New(
        env,
        true
    );
}



Napi::Value SendFrame(
    const Napi::CallbackInfo& info
)
{
    Napi::Env env = info.Env();

    return Napi::Boolean::New(
        env,
        true
    );
}



Napi::Value DestroySender(
    const Napi::CallbackInfo& info
)
{
    Napi::Env env = info.Env();

    return Napi::Boolean::New(
        env,
        true
    );
}



Napi::Object Init(
    Napi::Env env,
    Napi::Object exports
)
{

    exports.Set(
        "createSender",
        Napi::Function::New(
            env,
            CreateSender
        )
    );


    exports.Set(
        "sendFrame",
        Napi::Function::New(
            env,
            SendFrame
        )
    );


    exports.Set(
        "destroySender",
        Napi::Function::New(
            env,
            DestroySender
        )
    );


    return exports;

}


NODE_API_MODULE(
    CaveNDI,
    Init
)