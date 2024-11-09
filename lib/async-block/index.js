class MockPromise {
constructor(executor) {
    // El executor se ignora
}

// Métodos dinámicos
then(onFulfilled, onRejected) {
    return this; // Retorna la misma instancia
}

catch(onRejected) {
    return this; // Retorna la misma instancia
}

finally(onFinally) {
    return this; // Retorna la misma instancia
}

// Métodos estáticos
static resolve(value) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}

static reject(reason) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}

static all(iterable) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}

static race(iterable) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}

static allSettled(iterable) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}

static any(iterable) {
    return new MockPromise(() => {}); // Devuelve una nueva instancia vacía
}
}

const blockAsync = (dom) =>
{
    dom.window.eval(`
    (async () => {
        const originalAsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
        globalThis.AsyncFunction = function () {
        return function () {};
        };
        Object.setPrototypeOf(globalThis.AsyncFunction.prototype, originalAsyncFunction.prototype);
    })();
    `);
    
    dom.window.Promise = MockPromise;
    dom.window.setTimeout = () => {};
    dom.window.setInterval = () => {};
    dom.window.setImmediate = () => {};
    dom.window.requestAnimationFrame = () => {};
    dom.window.queueMicrotask = () => {};
}
module.exports = blockAsync;