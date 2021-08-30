export default () => {
    window.networkSpeedTimer = setInterval(() => {
        let startTime = Date.now();
        let xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            'https://docs.qq.com/static/dev/sheet_static/img/brandlogo/logo-sprites-new.png'
        );
        xhr.onload = function () {
            let duration = (Date.now() - startTime) / 1000;
            // @ts-ignore
            let size = xhr.getResponseHeader('Content-Length') / 1024;
            let speed = (size / duration).toFixed(2);
            window.postMessage({ networkSpeed: speed }, '*');
            console.log(speed);
        };
        xhr.send();
    }, 1000);
}