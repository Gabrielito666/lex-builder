const serialice = (page, layout) =>
`import Page from "${page}";
import Layout from "${layout}";

document.documentElement.appendChild(<Layout><Page/></Layout>)`;
module.exports = serialice;