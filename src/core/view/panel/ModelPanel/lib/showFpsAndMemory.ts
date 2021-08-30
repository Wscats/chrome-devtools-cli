const showFpsAndMemory = () => {
    (() => {
        let frame = 0;
        let lastTime = Date.now();
        const getMemoryInfo = () => {
            // @ts-ignore
            if (!window.performance || !(window.performance).memory) {
                return 0;
            }
            // @ts-ignore
            return Math.round((window.performance).memory.usedJSHeapSize / (1024 * 1024));
        };
        const loop = () => {
            const now = Date.now();
            // 每运行一次, frame++
            frame += 1;
            // 1s更新一次面板
            if (now > 1000 + lastTime) {
                const fps = Math.round((frame * 1000) / (now - lastTime));
                frame = 0;
                lastTime = now;
                window.postMessage({
                    source: 'tencent-docs-devtools-inject',
                    payload: {
                        memory: getMemoryInfo(),
                        fps
                    }
                }, '*');
            }
            window.animationFrameID = window.requestAnimationFrame(loop);
        };
        window.animationFrameID = window.requestAnimationFrame(loop);
    })();
}

export default showFpsAndMemory;
