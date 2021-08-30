import React from 'react';
import { Row, Col, Progress } from 'antd';
// 通讯库
import tool from '../../../panel';
import showFpsAndMemory from './lib/showFpsAndMemory';
import showNetworkSpeed from './lib/showNetworkSpeed';
// 引入 echarts 绘图
import echarts from 'echarts';
// 类型接口
interface State {
    memory: number;
    fps: number;
    networkSpeed: number;
    memoryCharts: any;
    fpsCharts: any;
    networkSpeedCharts: any;
}
const memoryChartsData = {
    title: {
        text: ''
    },
    tooltip: {},
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [
        {
            name: 'memory',
            type: 'line',
            smooth: true,
            data: []
        }
    ]
};

const fpsChartsData = {
    title: {
        text: ''
    },
    tooltip: {},
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [
        {
            name: 'fps',
            type: 'line',
            smooth: true,
            data: []
        }
    ]
};

const networkSpeedChartsData = {
    title: {
        text: ''
    },
    tooltip: {},
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [
        {
            name: 'speed',
            type: 'line',
            smooth: true,
            data: []
        }
    ]
};

export default class ModelPanel extends React.Component {
    state: State = {
        memory: 60,
        fps: 60,
        networkSpeed: 0,
        memoryCharts: null,
        fpsCharts: null,
        networkSpeedCharts: null
    };

    componentDidMount() {
        // 显示 fps 和 memory 的功能
        this.showFpsAndMemory();
        // 网速测速
        // this.showNetworkSpeed();
    }

    showNetworkSpeed() {
        tool.listen((message) => {
            if (!message.networkSpeed) {
                return true;
            }
            console.log(message.networkSpeed);
            this.setState(
                {
                    networkSpeed: message.networkSpeed,
                    networkSpeedCharts: echarts.init(this.refs.renderNetworkSpeedCharts)
                },
                () => {
                    // 设置网络速度变化的图标数据
                    networkSpeedChartsData.series[0].data.push(message.networkSpeed);
                    this.state.networkSpeedCharts.setOption(networkSpeedChartsData);
                }
            );
            return true;
        });
        tool.injectScriptStringToPage(`;(${showNetworkSpeed.toString()})();`);
    }

    showFpsAndMemory() {
        tool.listen((message) => {
            let memory = message.payload.memory;
            let fps = message.payload.fps;
            if (!memory || !fps) {
                return true;
            }
            if (!this.refs.renderMemoryCharts || !this.refs.renderFpsCharts) {
                return true;
            }
            this.setState(
                {
                    memory: memory,
                    fps: fps,
                    memoryCharts: echarts.init(this.refs.renderMemoryCharts),
                    fpsCharts: echarts.init(this.refs.renderFpsCharts)
                },
                () => {
                    // 设置内存变化的图标数据
                    memoryChartsData.series[0].data.push(memory);
                    // 设置 fps 变化的图标数据
                    fpsChartsData.series[0].data.push(fps);
                    // 绘制图表
                    this.state.memoryCharts.setOption(memoryChartsData);
                    this.state.fpsCharts.setOption(fpsChartsData);
                }
            );
            return true;
        });
        tool.injectScriptStringToPage(`;(${showFpsAndMemory.toString()})();`);
    }

    componentWillUnmount() {
        tool.injectScriptStringToPage(`window.cancelAnimationFrame(window.animationFrameID);`);
        // 销毁监听网速的定时器
        tool.injectScriptStringToPage(`clearInterval(window.networkSpeedTimer);`);
        // 清空 echarts 数据队列
        memoryChartsData.series[0].data = [];
        fpsChartsData.series[0].data = [];
        networkSpeedChartsData.series[0].data = [];
    }

    render() {
        return (
            <div>
                <Row type="flex" justify="center" align="middle" gutter={[0, 0]}>
                    <Col span={1}>
                        <Progress
                            type="circle"
                            percent={this.state.memory / 10}
                            format={(percent) => `${percent * 10} M`}
                        />
                    </Col>
                    <Col span={23}>
                        <div
                            ref="renderMemoryCharts"
                            style={{ minWidth: '600px', height: '400px' }}
                        ></div>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle" gutter={[0, 0]}>
                    <Col span={1}>
                        <Progress
                            type="circle"
                            percent={this.state.fps}
                            format={(percent) => `${percent} FPS`}
                        />
                    </Col>
                    <Col span={23}>
                        <div
                            ref="renderFpsCharts"
                            style={{ minWidth: '600px', height: '400px' }}
                        ></div>
                    </Col>
                </Row>
                {/* <Row type="flex" justify="center" align="middle" gutter={[0, 0]}>
                    <Col span={1}>
                        <Progress
                            type="circle"
                            percent={this.state.networkSpeed / 10}
                            format={(percent) => `${percent * 10} K`}
                        />
                    </Col>
                    <Col span={23}>
                        <div
                            ref="renderNetworkSpeedCharts"
                            style={{ minWidth: '600px', height: '400px' }}
                        ></div>
                    </Col>
                </Row> */}
            </div>
        );
    }
}
