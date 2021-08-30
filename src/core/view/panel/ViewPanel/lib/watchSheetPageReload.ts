export default () => {
    window.onbeforeunload = function(event) {
        window.postMessage(
            {
                source: 'tencent-docs-devtools-inject',
                payload: 'sheet-reload'
            },
            '*'
        );
        event = event || window.event;
        if (event) {
            event.returnValue = '确定要关闭窗口吗？';
        }
        return '确定要关闭窗口吗?';
    };
};
