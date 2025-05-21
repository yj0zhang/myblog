let activeEffect = null;
let targetMap = new WeakMap();

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (value !== oldValue) {
        trigger(target, key);
      }
      return result;
    },
  });
}

function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  if (deps) {
    deps.forEach((effect) => {
      effect();
    });
  }
}

function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

function ref(value) {
  return reactive({
    get() {
      track(this, "value");
      return value;
    },
    set(nVal) {
      if (value !== nVal) {
        value = nVal;
        trigger(this, "value");
      }
    },
  });
}
