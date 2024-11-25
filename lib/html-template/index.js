const serialice = (page, layout) =>
`import Lex from "@lek-js/lex";
import Page from "${page}";
import Layout from "${layout}";

const main = <Layout><Page/></Layout>;

if(!document.contains(main)) document.documentElement.appendChild(main);`
module.exports = serialice;