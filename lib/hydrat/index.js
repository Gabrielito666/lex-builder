const { replaceToSelect } = require('../id-handlers');
const { JSDOM } = require('jsdom');

const builderLex = require('../builder-lex');
const lexLiteral = require('../production-lex');
const { commentAsync, desComment } = require('../async-block');

const getNewBundle = (output) =>
{
    const code = output.text;

    const codeToBuild = commentAsync(builderLex(code));

    const dom = new JSDOM("", { runScripts: "dangerously", resources: "usable" });
    dom.window.setInterval = () =>{};
    dom.window.setTimeout = () =>{};
    dom.window.setInterval = () =>{};
    dom.window.Promise = class PromiseFalse extends Promise {
      constructor(executor) { super((resolve, reject) => {})}
      static resolve() { return new OriginalPromise(() => {})}
      static reject() {return new OriginalPromise(() => {});}
      then() { return this }
      catch() { return this}
      finally() { return this }
    };

    dom.window.eval(codeToBuild);

    const bundle = replaceToSelect(desComment(code), dom.window.ids);

    const scriptElement = dom.window.document.createElement("script");
    scriptElement.textContent = lexLiteral(bundle);
    scriptElement.type = "module";
    dom.window.document.querySelector("head[lexid]").appendChild(scriptElement);

    return "<!DOCTYPE html>" + dom.window.document.querySelector("html[lexid]").outerHTML
    .replace("document.documentElement.appendChild", "(function(){})");
}

module.exports = getNewBundle;
