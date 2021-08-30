// import recordScreen from '../core/view/panel/ViewPanel/lib/recordScreen';

// 作为 content.ts 与 devtool.ts 通信的桥
const connections = {};
// panel.ts 和 background.ts 的通信
chrome.runtime.onConnect.addListener(function (port) {
    const extensionListener = function (message) {
        if (message.name == 'original') {
            connections[message.tabId] = port;
        }
        return true;
    };
    port.onMessage.addListener(extensionListener);
    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener);
        const tabs = Object.keys(connections);
        for (let i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]];
                break;
            }
        }
    });
});

declare const MediaRecorder: any;

let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

let localStream;

let localVideo = document.getElementById('localVideo') as HTMLVideoElement;
let recordedVideo = document.getElementById('recordedVideo') as HTMLVideoElement;

let recordButton = document.getElementById('record') as HTMLButtonElement;
let playButton = document.getElementById('play') as HTMLButtonElement;
let downloadButton = document.getElementById('download') as HTMLButtonElement;
playButton.disabled = true;
downloadButton.disabled = true;

recordButton.onclick = toggleRecording;
playButton.onclick = call;
downloadButton.onclick = download;

function trace(param) {
    let time = (window.performance.now() / 1000).toFixed(3);
    console.log(time + ':' + param);
}

function handleSuccess(stream) {
    console.log(stream);
    stream.onremovetrack = () => {
        // Click on browser UI stop sharing button
        alert('Recording has ended');
    };
    trace('getUserMedia() got stream!');
    recordButton.disabled = false;
    window.stream = stream; // 录制视频的时候要用到
    localStream = stream;
    localVideo.srcObject = stream;
    // 点击录制视频的按钮
    document.getElementById('record').click();
}

function handleError(error) {
    // 点击暂停按钮
    document.getElementById('record').click();
    // 点击下载按钮
    document.getElementById('download').click();
    // trace(error.message);
}

let constraints = {
    video: true,
    audio: false
};

let mediaSource = new MediaSource();
// 通过注册事件event::sourceopen来触发当前连接之后的的回调处理
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

/*
 * 回调处理就是需要赋值视频数据的地方，
 * 调用MediaSourceBuffer::addSourceBuffer方法来   ==>  构建一个存放视频数据的Buffer；
 */
function handleSourceOpen(event) {
    trace('MediaSource opened！');
    sourceBuffer = mediaSource.addSourceBuffer("video/webm;codecs='vp8'");
    trace(sourceBuffer);
}

/* 这里把每10ms获取的数据放入recordedBlobs */
function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

/*
 * 录制button状态转换
 */
function toggleRecording() {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;

        let test = document.getElementById('test') as HTMLVideoElement;
        let buffer = new Blob(recordedBlobs, {
            type: 'video/webm'
        });
        test.src = window.URL.createObjectURL(buffer);
    }
}

/* 开始录制 */
function startRecording() {
    recordedBlobs = [];
    let options = {
        mimeType: 'video/webm;codecs=vp9'
    };
    // isTypeSupporteed:判断是否支持要解码播放的视频文件编码和类型。
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + 'is not Supported');
        options = {
            mimeType: 'video/webm;codecs=vp8'
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + 'is not Supported');
            options = {
                mimeType: 'video/webm;codecs=vp8'
            };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + 'is not Supported');
                options = {
                    mimeType: ''
                };
            }
        }
    }
    try {
        mediaRecorder = new MediaRecorder(window.stream, options); // 设置音频录入源、格式
    } catch (e) {
        console.log('Exception while creating MediaRecorder: ' + e);
        // alert('Exception while creating MediaRecorder: ' + e + '. mimeType: ' + options.mimeType);
        return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable; // 存放获取的数据
    mediaRecorder.start(10); //  开始录制 collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
}

/* 结束录制 */
function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    recordedVideo.controls = true;
}

/*
 * 录制视频添加监听事件
 */
recordedVideo.addEventListener(
    'error',
    function (ev) {
        // 点击暂停按钮
        document.getElementById('record').click();
        // 点击下载按钮
        document.getElementById('download').click();
        trace('MediaRecording.recordedMedia.error()');
    },
    true
);

/*
 * 播放录制的视频
 */
function call() {
    trace('Starting call');
    if (localStream.getVideoTracks().length > 0) {
        trace('Using video device: ' + localStream.getVideoTracks()[0].label);
    }
    if (localStream.getAudioTracks().length > 0) {
        trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
    }
}

/*
 * 下载视频
 */
function download() {
    let blob = new Blob(recordedBlobs, {
        type: 'video/webm'
    });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// 通信线路：inject->content->background->devtool/panel->inject
// 接收 content.ts 的消息，并发送到 devtool.ts/panel.ts 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 开始录屏
    if (message.payload === 'startRecordScreen') {
        navigator.mediaDevices
            // @ts-ignore
            .getDisplayMedia(constraints)
            .then(handleSuccess)
            .catch(handleError);
    }
    // 暂停录屏
    if (message.payload === 'stopRecordScreen') {
        // 点击暂停按钮
        document.getElementById('record').click();
        // 点击下载按钮
        document.getElementById('download').click();
    }

    // 截图
    if (message.payload === 'startScreenShot') {
        chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
            const a = document.createElement('a');
            a.download = 'screenshot.png';
            a.href = dataUrl;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
        });
        return true;
    }

    // 监听粘贴板内容
    if (message.payload === 'startWatchClipboardContents') {
        clearInterval(window.pasteRecord);
        window.pasteRecord = setInterval(() => {
            let pasteInfoFromStorage = localStorage.getItem('paste-info')
                ? JSON.parse(localStorage.getItem('paste-info'))
                : [];
            // 继承原来Storage的粘贴板数据
            let pasteArr = [...pasteInfoFromStorage];
            console.log(pasteArr);
            let input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();
            document.execCommand('paste');
            let clipboardText = input.value;
            if (pasteArr.length > 0) {
                // 当当前粘贴板的数据和上一次的数据一样，则不存进Storage里面，否则才加入
                !(pasteArr[pasteArr.length - 1] === clipboardText) &&
                    (() => {
                        pasteArr.push(clipboardText);
                        localStorage.setItem('paste-info', JSON.stringify(pasteArr));
                    })();
            }
            // 处理第一个放入数组的数据
            else if (pasteArr.length === 0) {
                pasteArr.push(clipboardText);
                localStorage.setItem('paste-info', JSON.stringify(pasteArr));
            }
            console.log(clipboardText);
            document.body.removeChild(input);
        }, 1000);
    }
    if (message.payload === 'stopWatchClipboardContents') {
        clearInterval(window.pasteRecord);
    }
    // 测试代码
    console.log('收到来自content-script的消息：');
    console.log(message, sender, sendResponse);
    if (sender.tab) {
        const tabId = sender.tab.id;
        if (tabId in connections) {
            console.log('sender.tab is defined.');
            connections[tabId].postMessage(message);
        } else {
            console.log('Tab not found in connection list.');
        }
    } else {
        console.log('sender.tab not defined.');
    }
    return true;
});
