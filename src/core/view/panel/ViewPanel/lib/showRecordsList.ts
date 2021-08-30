// @ts-nocheck
export default () => {
    window.__console.log('-----start ajax-----');
    $.ajax({
        url: '/dop-api/get/history',
        data: {
            padId: window.clientVars.globalPadId,
            page: 1,
            _r: 10000 * Math.random()
        },
        success(data) {
            window.__console.log(data.history.items);
            window.postMessage(
                {
                    source: 'tencent-docs-devtools-inject',
                    payload: {
                        history: data
                    }
                },
                '*'
            );
            window.__console.log('-----end ajax-----');
        }
    });
};
