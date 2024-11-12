const fsSync = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const esbuild = require('esbuild');

const LEX = 
`const createElement = (tag, props={}, ...children) =>
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
        children.forEach(ch =>
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
`

const buildHtml = (htmlPath, { mode="dev" }) =>
{
    const dirname = path.dirname(htmlPath);
    const html = fsSync.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

    // Recoger las rutas de los scripts
    const scripts = Array.from(dom.window.document.querySelectorAll("script[src]"));

    if (scripts.length === 0) return dom.serialize(); // No scripts to bundle

    // Obtener todas las rutas relativas de los scripts
    scripts.forEach(script =>
    {
        const entryPoint = path.resolve(dirname, script.src);

        const bundleResult = esbuild.buildSync
        ({
            entryPoints: [entryPoint],
            bundle: true,
            write: false,
            minify: mode === 'production',
            format: 'iife',
            platform: "browser",
            jsxFactory: "Lex.createElement",
            jsxFragment: "Lex.fragment",
            loader : { ".js" : "jsx" }
        });

        let bundledScriptContent = bundleResult.outputFiles[0].text;

        if(bundledScriptContent.includes("Lex.createElement"))
        {
            bundledScriptContent = LEX + bundledScriptContent;
        }

        script.removeAttribute('src');
        script.textContent = bundledScriptContent;
    });

    return dom.serialize();
};

module.exports = buildHtml;