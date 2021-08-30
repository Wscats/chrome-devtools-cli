import tool from './panel';
// 面板创建开关
let created = false;
// 检查次数
let checkCount = 0;

const createPanelIfHasDocs = () => {
    if (created || checkCount++ > 10) {
        return;
    }
    // 根据全局变量 window.T_SHEET 判断是否是在腾讯文档页面
    chrome.devtools.inspectedWindow.eval('!!(window.T_SHEET)', (hasDocs) => {
        if (!hasDocs || created) {
            return;
        }
        clearInterval(checkDocsInterval);
        created = true;
        createPanels();
    });
};
// 在控制台创建调试面板 Tencent Docs Dev Tools
const createPanels = () => {
    // alert(created);
    // alert(checkCount);
    // 创建自定义面板，同一个插件可以创建多个自定义面板
    // 几个参数依次为：panel 标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
    chrome.devtools.panels.create(
        'Tencent Docs Dev Tools',
        '../public/logo/logo-128.png',
        '../public/page/panel.html',
        (panel) => {
            let _window;
            // 注意这个log一般看不到
            console.log('自定义面板创建成功！');
            // 监听调试面板显示
            panel.onShown.addListener((panelWindow) => {
                // alert(2);
                console.log(panelWindow);
                // 以后可以在这里对面板封装一些公共方法
                _window = panelWindow;
                // 审查窗口
                _window.inspectedWindow = chrome.devtools.inspectedWindow;
            });
            // 监听调试面板隐藏
            panel.onHidden.addListener(() => {
                // 断开 content.ts 文件中 inject.ts 和 content.ts 的通信
                // tool.injectScriptStringToPage(`
                //     window.postMessage(
                //         {
                //             source: 'tencent-docs-devtools-devtool-script',
                //             payload: 'shutdown'
                //         },
                //         '*'
                //     );
                // `);
            });
        }
    );
};
chrome.devtools.network.onNavigated.addListener(createPanelIfHasDocs);
// 使用定时器每秒检查一次
const checkDocsInterval = setInterval(createPanelIfHasDocs, 1000);
createPanelIfHasDocs();
