class Tool {
    public port: any;
    public listen: any;
    public send: any;
    constructor() {
        // 初始化，与 background.ts 建立连接
        let { port, listen, send } = this.sendMessageToBackground();
        this.port = port;
        this.listen = listen;
        this.send = send;
    }
    // 1.panel.ts 与 inject.ts 的通信方案，使用链接的方式
    injectScriptLinkToPage = (scriptName: string, cb: Function): void => {
        const src = `
      (function() {
        var script = document.constructor.prototype.createElement.call(document, 'script');
        script.src = "${chrome.runtime.getURL(scriptName)}";
        document.documentElement.appendChild(script);
        // script.parentNode.removeChild(script);
      })()
    `;
        chrome.devtools.inspectedWindow.eval(src, (res, err) => {
            if (err) {
                console.log(err);
            }
            cb();
        });
    };
    // 2.panel.ts 与 inject.ts 的通信方案，使用字符串的方式
    injectScriptStringToPage = (message: string, callback: Function = null) => {
        chrome.devtools.inspectedWindow.eval(message, (value) => {
            callback && callback(value);
        });
    };
    // 3.panel.ts 与 content.ts 的通信方案
    sendMessageToContent = (message: any) => {
        window.postMessage(message, '*');
    };

    // 4.panel.ts 与 background.ts 的通信方案，注意是一个长连接
    // 使用 window.postMessage({name:1}, '*')测试
    sendMessageToBackground = () => {
        // 建立长连接
        const port = chrome.runtime.connect({ name: 'devtools' });
        // 监听断开
        // 主动关闭使用 port.disconnect();
        port.onDisconnect.addListener(() => { });
        // 监听 background.ts 消息
        // port.onMessage.addListener((message) => {
        //     console.log(`后台已传来消息：${JSON.stringify(message)}`);
        //     return true;
        // });
        // 往 background.ts 发送消息
        port.postMessage({
            name: 'original',
            tabId: chrome.devtools.inspectedWindow.tabId
        });

        // 释放 port 用于在外部监听
        return {
            port,
            listen(fn) {
                port.onMessage.addListener(fn);
            },
            send(data) {
                port.postMessage(data);
            }
        };
    };
}
// 提供通讯手段的工具方法
export default new Tool();
