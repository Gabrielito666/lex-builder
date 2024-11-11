const getNewBundle = require('./lib/hydrat');

const esbuild = require('esbuild');
const fs = require("fs");
const htmlTemplate = require('./lib/html-template');
const buildHtml = require('./lib/build-html');
const serialice = require('./lib/html-template');

const lexDevPlugin = (outputPath, entryPoint, htmlBase) => 
({
    name: "lex-dev-plugin",
    setup(build)
    {
        build.onEnd(async(result) =>
        {
            if (result.errors.length > 0) return result.errors;
            for(let output of result.outputFiles)
            {   
                const html = getNewBundle(output, entryPoint, htmlBase);
                fs.writeFileSync(outputPath, html);
            }
        })
    }
})

const buildDev = async(layout, page, output) =>
{
    return esbuild.build
    ({
        stdin:
        {
            contents: serialice(page, layout),
            loader: 'js',
        },
        bundle: true,
        minify: false,
        platform: "browser",
        jsxFactory: "Lex.createElement",
        jsxFragment: "Lex.fragment",
        write: false,
        plugins : [lexDevPlugin(output, entryPoint, htmlBase)]
    })
}


const buildHtmlDev = async(entryPoints, output) => 
[...entryPoints].map(entryPoint =>
{
    const html = buildHtml(entryPoint);
    fs.writeFileSync(output, html, 'utf-8')
    return output;
});

module.exports = { buildDev, buildHtmlDev };