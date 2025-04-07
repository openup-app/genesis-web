function evaluate(code, state) {
  function registerFunction(
    interpreter,
    globalObject,
    functionName,
    hasArgs = true
  ) {
    const wrapper = function (...args) {
      window.parent.postMessage({
        type: "function",
        name: functionName,
        parameters: hasArgs ? args : [],
      });
    };

    interpreter.setProperty(
      globalObject,
      functionName,
      interpreter.createNativeFunction(wrapper)
    );
  }

  let initFunc = function (interpreter, globalObject) {
    registerFunction(interpreter, globalObject, "alert");
    registerFunction(interpreter, globalObject, "setPosition");
    registerFunction(interpreter, globalObject, "setDirection");
    registerFunction(interpreter, globalObject, "setSpeed");
  };

  try {
    const myInterpreter = new Interpreter(code, initFunc);
    myInterpreter.run();
    window.parent.postMessage(
      { type: "result", status: "success", payload: myInterpreter.value },
      "*"
    );
  } catch (error) {
    console.log("error " + error);
    window.parent.postMessage(
      {
        type: "result",
        status: "error",
        payload: "Error: " + error.message,
      },
      "*"
    );
  }
}
