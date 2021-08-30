export default () => {
    window.postMessage(
        {
            source: 'tencent-docs-devtools-devtool-script',
            payload: 'shutdown'
        },
        '*'
    );
};
