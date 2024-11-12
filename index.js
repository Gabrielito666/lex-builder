const getNewBundle = require('./lib/hydrat');
const { minify } = require('html-minifier')

const esbuild = require('esbuild');
const fs = require("fs");
const buildHtml_ = require('./lib/build-html');
const serialice = require('./lib/html-template');
const path = require('path');

const lexDevPlugin = (outputPath, { mode="dev" }) => 
({
    name: "lex-dev-plugin",
    setup(build)
    {
        build.onEnd(async(result) =>
        {
            if (result.errors.length > 0) return result.errors;
            for(let output of result.outputFiles)
            {   
                const html = mode == "production" ?
                minify(getNewBundle(output),
                {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                }) :
                getNewBundle(output);

                fs.writeFileSync(outputPath, html);
            }
        })
    }
})

const buildDev = async(page, layout, output) =>
{
    const resolveDir = path.dirname(page);
    return esbuild.build
    ({
        stdin:
        {
            contents: serialice(page, layout),
            loader: 'js',
            resolveDir,
            loader: "jsx"
        },
        bundle: true,
        minify: false,
        platform: "browser",
        jsxFactory: "Lex.createElement",
        jsxFragment: "Lex.fragment",
        write: false,
        plugins : [lexDevPlugin(output)]
    })
}


const buildHtmlDev = async(entryPoint, output) => 
{
    const html = buildHtml_(entryPoint);
    fs.writeFileSync(output, html, 'utf-8')
    return output;
};

const build = (page, layout, output) =>
{
    const resolveDir = path.dirname(page);
    return esbuild.build
    ({
        stdin:
        {
            contents: serialice(page, layout),
            loader: 'js',
            resolveDir,
            loader: "jsx"
        },
        bundle: true,
        minify: true,
        platform: "browser",
        jsxFactory: "Lex.createElement",
        jsxFragment: "Lex.fragment",
        write: false,
        plugins : [lexDevPlugin(output, { mode: 'production' })]
    })
}
const buildHtml = (entryPoint, output) =>
{
    const html = buildHtml_(entryPoint, { mode: "production" });
    fs.writeFileSync(output, html, 'utf-8');
    return output;
}

module.exports = { buildDev, buildHtmlDev, build, buildHtml };