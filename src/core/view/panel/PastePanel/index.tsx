import React, { Component } from 'react';
import { Button, Input, Statistic, Card, Row, Col } from 'antd';
// 通讯库
import tool from '../../../panel';
// 粘贴板列表
import PasteList from './component/PasteList';
interface State {
    isWatchClipboardContents: boolean;
}

interface Props {}

export default class ModelPanel extends React.Component<Props, State> {
    state: State = {
        // 用于判断当前是否监听粘贴板状态状态
        isWatchClipboardContents: true
    };
    componentDidMount() {
        // 首次加载启动监听粘贴板的功能
        this.startWatchClipboardContents();
    }
    // 开始监听粘贴板
    startWatchClipboardContents() {
        this.setState({
            isWatchClipboardContents: false
        });
        tool.injectScriptStringToPage(
            `window.postMessage({payload:'startWatchClipboardContents'},'*')`
        );
    }
    // 停止监听粘贴板
    stopWatchClipboardContents() {
        this.setState({
            isWatchClipboardContents: true
        });
        tool.injectScriptStringToPage(
            `window.postMessage({payload:'stopWatchClipboardContents'},'*')`
        );
    }
    render() {
        return (
            <div>
                {this.state.isWatchClipboardContents ? (
                    <Button
                        style={{ margin: '10px' }}
                        onClick={this.startWatchClipboardContents.bind(this)}
                        type="primary"
                    >
                        监听粘贴板内容
                    </Button>
                ) : (
                    <Button
                        style={{ margin: '10px' }}
                        onClick={this.stopWatchClipboardContents.bind(this)}
                        type="danger"
                    >
                        停止监听粘贴板内容
                    </Button>
                )}
                <PasteList isWatchClipboardContents={this.state.isWatchClipboardContents} />
            </div>
        );
    }
}
