const Lex = code => `const createElement = (tag, props={}, ...children) =>
{
    if(!props) props = {};
    let element;
    if(typeof tag === 'string')
    {
        element = document.createElement(tag);
        if(props.ref && props.ref instanceof Object)
        {
            props.ref.current = element;
        }
        for(let [key, value] of Object.entries(props))
        {
            if (key.startsWith("on") && typeof value === "function") element.addEventListener(key.slice(2).toLowerCase(), value);
            else element.setAttribute(key, value);
        }
        children.reduce((acc, ch) => [...acc, ...Array.isArray(ch) ? ch : [ch]],[])
        .forEach(ch =>
        {
            if(ch instanceof window.Node)   element.appendChild(ch);
            else                            element.appendChild(document.createTextNode(String(ch)))
            
        })
    }
    else if(typeof tag === 'function')
    {
        element = tag({ ...props, children })
    }
    return element
}
 
let counter = 0;

const selectElement = (tag, props={}, ...children) =>
{
    if(!props) props = {};
    props.lexid = counter;

    counter++;
    if(typeof tag === "string")
    {
        const el = document.querySelector(\`[lexid="\${props.lexid}"]\`);
        if(el)
        {
            if(props.ref && props.ref instanceof Object)
            {
                props.ref.current = el;
            }
            for(let [key, value] of Object.entries(props))
            {
                if(key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
                else if(typeof value !== "string"){ el[key] = value }
            }
        }
        return el;
    }
    else if(typeof tag === "function")
    {
        return tag({ ...props, children })
    }
}

const Lex = { createElement, selectElement };
${code};`

module.exports = Lex;