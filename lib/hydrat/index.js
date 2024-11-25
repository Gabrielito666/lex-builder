const { JSDOM } = require('jsdom');

const { commentAsync, desComment } = require('../async-block');

const getNewBundle = (output) =>
{
  const code = output.text;

  const codeToBuild = commentAsync(code);

  const dom = new JSDOM("", { runScripts: "dangerously", resources: "usable" });
  dom.window.setInterval = () =>{};
  dom.window.setTimeout = () =>{};
  dom.window.setInterval = () =>{};
  dom.window.Promise = class PromiseFalse extends Promise { constructor() { super((resolve, reject) => {})} static resolve() { return new OriginalPromise(() => {})} static reject() {return new OriginalPromise(() => {});} then() { return this } catch() { return this} finally() { return this } };

  dom.window.eval(codeToBuild);

  const scriptElement = dom.window.document.createElement("script");
  scriptElement.innerHTML = codeToBuild;
  scriptElement.type = "module";

  dom.window.document.querySelector("head[lexid]").appendChild(scriptElement);
  
  return dom.window.document.querySelector("html[lexid]").outerHTML;
}

module.exports = getNewBundle;
