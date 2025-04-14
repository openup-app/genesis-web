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

  let stateObject = JSON.parse(state);

  let initFunc = function (interpreter, globalObject) {
    registerFunction(interpreter, globalObject, "alert");
    registerFunction(interpreter, globalObject, "setPosition");
    registerFunction(interpreter, globalObject, "setDirection");
    registerFunction(interpreter, globalObject, "setSpeed");
    registerFunction(interpreter, globalObject, "applyImpulse");
    registerFunction(interpreter, globalObject, "applyForce");

    for (const [name, value] of Object.entries(stateObject)) {
      interpreter.setProperty(
        globalObject,
        name,
        interpreter.nativeToPseudo(value)
      );
    }
  };

  const myInterpreter = new Interpreter(code, initFunc);
  myInterpreter.run();

  const globalScope = myInterpreter.getGlobalScope();
  const globalObject = myInterpreter.pseudoToNative(globalScope.object);

  const outState = {};
  for (const key of Object.keys(stateObject)) {
    try {
      const value = globalObject[key];
      outState[key] = value;
    } catch (e) {
      console.warn(`Error getting property ${key}:`, e);
      outState[key] = null;
    }
  }

  return outState;
}
