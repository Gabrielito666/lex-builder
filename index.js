const getNewBundle = require('./lib/hydrat');
const { minify } = require('html-minifier')

const esbuild = require('esbuild');
const fs = require("fs");
const serialice = require('./lib/serialice');
const path = require('path');

const lexPlugin = (outputPath, { mode="dev" }) => 
({
    name: "lex-plugin",
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
        plugins : [lexPlugin(output, {})],
        external: [],
    })
}

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
        plugins : [lexPlugin(output, { mode: 'production' })]
    })
}

module.exports = { buildDev, build };