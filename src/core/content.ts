const handshake = (e) => {
    // 断开 inject.ts 和 content.ts 的通信
    if (e.data.payload === 'shutdown') {
        window.removeEventListener('message', handshake);
    }
    try {
        chrome.runtime.sendMessage(e.data, function(response) {
            console.log('收到来自后台的回复：' + response);
        });
    } catch (error) {
        console.log(error);
    }
};

// inject.ts 和 content.ts 的通信
window.addEventListener('message', handshake);

const sendListening = () => {
    window.postMessage(
        {
            source: 'tencent-docs-devtools-content-script',
            payload: 'listening'
        },
        '*'
    );
};
sendListening();
