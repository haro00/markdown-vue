import Markdown from './components/Markdown.vue';

Markdown.install = Vue => {
    // 引入svg
    const requireAll = requireContext => requireContext.keys().map(requireContext);
    const req = require.context('./images/svg', false, /\.svg$/);
    requireAll(req);
    Vue.component(Markdown.name, Markdown);
};

export default Markdown;