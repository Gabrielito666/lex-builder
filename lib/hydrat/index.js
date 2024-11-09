const { replaceToSelect } = require('../id-handlers');
const { JSDOM } = require('jsdom');

const builderLex = require('../builder-lex');
const lexLiteral = require('../production-lex');
const blockAsync = require('../async-block');

const getNewBundle = (output, originalFilePath, htmlTemplate) =>
{
    const code = output.text;

    const codeToBuild = builderLex(code, originalFilePath);

    const dom = new JSDOM(htmlTemplate, { runScripts: "dangerously", resources: "usable" });

    blockAsync(dom);

    dom.window.eval(codeToBuild);

    const bundle = replaceToSelect(code, dom.window.ids);

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