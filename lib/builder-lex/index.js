const { putIds } = require('../id-handlers');
const path = require('path');
const getName = (p) =>
{
    const namefile = path.basename(p, path.extname(p));
    return `var ${namefile.replace(".", "_")}_default =`
}
const setIds = (code, original_path) =>
`window.ids = [];
const Lex = {};
let idCounter = 0;
Lex.createElement = (tag, props={}, ...children) => num =>
{
    window.ids.push(num);
    let element;
    if(!props) props = {};
    props.lexid = idCounter+"";

    idCounter++

    if(typeof tag === 'string')
    {
        element = document.createElement(tag);
        if(props && props.ref && props.ref instanceof Object)
        {
            props.ref.current = element;
        }
        if(props) for(let [key, value] of Object.entries(props))
        {
            if (key.startsWith("on") && typeof value === "function") element.addEventListener(key.slice(2).toLowerCase(), value);
            else if(typeof value === "string") element.setAttribute(key, value);
            else element[key] = value;

        }
        children.forEach(ch =>
        {
            if(ch instanceof window.Node)   element.appendChild(ch);
            else                            element.appendChild(document.createTextNode(String(ch)));
            
        })
    }
    else if(typeof tag === 'function')
    {
        element = tag({ ...props, children })
    }
    return element
}
setInterval = () => {};
setTimeout = () => {};
const ThisLexPage =
${putIds(code).replace(getName(original_path), "return" )};
document.querySelector("body").appendChild(ThisLexPage());`
module.exports = setIds;