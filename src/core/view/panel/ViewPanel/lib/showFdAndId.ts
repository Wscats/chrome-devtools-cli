export default () => {
    window.postMessage(
        {
            source: 'tencent-docs-devtools-inject',
            payload: {
                cookie: window.document.cookie
            }
        },
        '*'
    );
};
