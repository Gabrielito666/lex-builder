const { replaceToSelect } = require('../id-handlers');
const { JSDOM } = require('jsdom');

const builderLex = require('../builder-lex');
const lexLiteral = require('../production-lex');
const { commentAsync, desComment } = require('../async-block');

const getNewBundle = (output, originalFilePath, htmlTemplate) =>
{
    const code = output.text;

    const codeToBuild = commentAsync(builderLex(code, originalFilePath));

    const dom = new JSDOM(htmlTemplate, { runScripts: "dangerously", resources: "usable" });
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
    scriptElement.textContent = lexLiteral(bundle, originalFilePath);
    scriptElement.type = "module";

    dom.window.document.head.appendChild(scriptElement);

    const html = dom.serialize();
    return html;
}

module.exports = getNewBundle;

/**

    transformar las funciones async en () =>{} las promesas en new Promise(() =>{})
    los .then(()=>{})
    los setTimeout y setInterval hay que cambiarlos por (()=>{}, 1000000000000)
*/