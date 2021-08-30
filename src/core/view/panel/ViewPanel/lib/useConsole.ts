export default () => {
    // 设置 cookie 的方法
    const setCookie = (name, value) => {
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        // @ts-ignore
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        debugger;
    }

    setCookie('useConsole', true);
    // @ts-ignore
    console = __console;
};
