import React, { Component } from 'react';
import { Button, Input, Statistic, Card, Row, Col } from 'antd';
// 通讯库
import tool from '../../../panel';
// 弹窗测试
import showTips from './lib/showTips';
import showFdAndId from './lib/showFdAndId';
// 列表树组件
import SheetSearchTree from './component/SheetSearchTree';
import handleSheetSearchTree from './lib/handleSheetSearchTree';

// 启用 console.log 方法
import useConsole from './lib/useConsole';

// 断开调试面板和页面的连接
import shutdown from './lib/shutdown';
// 查找空节点
import emptyDom from './lib/emptyDom';
import { connect } from 'react-redux';

const { TextArea } = Input;
interface State {
    textAreaScript: string;
    rangeSelections: [
        {
            isSheet: boolean;
            sheetId: string;
            startRowIndex: number;
            endRowIndex: number;
            startColIndex: number;
            endColIndex: number;
            children?: any[];
            title: string;
        }
    ];
    SheetSearchTree: any;
    isRecordScreen: boolean;
}

interface Props {
    setRangeSelections: (author: string) => void;
    setFdAndRouteId: (any) => void;
    rangeSelections: [
        {
            isSheet: boolean;
            sheetId: string;
            startRowIndex: number;
            endRowIndex: number;
            startColIndex: number;
            endColIndex: number;
            children?: any[];
            title: string;
        }
    ];
    fd: string;
    routeId: string;
}

class ModelPanel extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }
    state: State = {
        textAreaScript: '',
        rangeSelections: [
            {
                isSheet: false,
                sheetId: 'BB08J2',
                startRowIndex: 20,
                endRowIndex: 20,
                startColIndex: 2,
                endColIndex: 2,
                children: [
                    [
                        {
                            e: {
                                setSlots: 5,
                                effectiveValue: { type: 0, value: 13123123, originValue: null },
                                formattedValue: {
                                    type: 'normal',
                                    value: '13123123',
                                    textColor: null
                                },
                                editValue: '13123123',
                                userEnteredFormat: {
                                    setSlots: 1,
                                    numberFormat: { __type: null, __id: 0, __pattern: 'General' },
                                    dataValidation: null,
                                    backgroundColor: null,
                                    borders: null,
                                    horizontalAlign: null,
                                    verticalAlign: null,
                                    wrapStrategy: null,
                                    textFormat: null
                                },
                                effectiveFormat: null,
                                conditionalFormatResult: null,
                                mergeReference: null,
                                hyperlink: null,
                                formula: null,
                                textFormatRuns: null,
                                isDataValid: null,
                                sheetRangeReferences: null,
                                author: null,
                                mentionDetails: null
                            },
                            position: [20, 2]
                        }
                    ]
                ],
                title: '21行3列'
            }
        ],
        // 存放树组件
        SheetSearchTree: null,
        // 用于判断当前状态是否录屏状态
        isRecordScreen: false
    };
    componentDidMount() {
        this.showFdAndId();
        // 获取页面上用户在表格中选取范围的数据信息
        this.sheetSearchTree();
        // console.log(kscreenshot);
    }
    componentWillUnmount() {
        // 清空获取页面上用户在表格中选取范围的数据信息的定时器
        // window.clearInterval(window.getrangeSelections);
    }
    render() {
        return (
            <div>
                {/* 显示 fd 和 id 信息 */}
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="FD"
                                    value={this.props.fd ? this.props.fd : '正常环境'}
                                    valueStyle={{ color: '#3f8600' }}
                                    suffix=""
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Route ID"
                                    value={this.props.routeId ? this.props.routeId : '正常环境'}
                                    valueStyle={{ color: '#cf1322' }}
                                    suffix=""
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
                {/* 如果表格页面刷新了，那么请把调试工具面板重新刷新一次，不然无法监听最新的表格数据 */}
                <br />
                <Button style={{ margin: '10px' }} onClick={this.reset.bind(this)} type="danger">
                    刷新
                </Button>
                <Button
                    style={{ margin: '10px' }}
                    onClick={this.emptyDom.bind(this)}
                    type="primary"
                >
                    查找空节点
                </Button>

                <Button
                    style={{ margin: '10px' }}
                    onClick={this.debug.bind(this)}
                    type="primary"
                >
                    debug
                </Button>

                <Button
                    style={{ margin: '10px' }}
                    onClick={this.unDebug.bind(this)}
                    type="primary"
                >
                    unDebug
                </Button>

                <Button
                    style={{ margin: '10px' }}
                    onClick={this.useConsole.bind(this)}
                    type="primary"
                >
                    启用console.log函数
                </Button>

                {/* <Button
                    style={{ margin: '10px' }}
                    onClick={this.showTips.bind(this)}
                    type="primary"
                >
                    弹窗Tips测试
                </Button> */}
                {this.state.isRecordScreen ? (
                    <Button
                        style={{ margin: '10px' }}
                        onClick={this.stopRecordScreen.bind(this)}
                        type="danger"
                    >
                        暂停
                    </Button>
                ) : (
                        <Button
                            style={{ margin: '10px' }}
                            onClick={this.startRecordScreen.bind(this)}
                            type="primary"
                        >
                            录屏
                        </Button>
                    )}
                <Button onClick={this.screenshot.bind(this)} type="primary">
                    截图
                </Button>

                <br />
                {/* <br />

                <br />
                <br />
                <TextArea
                    placeholder="输入要执行的JS代码"
                    value={this.state.textAreaScript}
                    onChange={this.getTextAreaScript.bind(this)}
                    rows={6}
                />
                <br />
                <br />
                <Button onClick={this.execScript.bind(this)} type="primary">
                    运行上面输入框的代码
                </Button>
                <br />
                <br /> */}
                {/* 将表格数据渲染再此树组件上，要保证每一次都是新的树 */}
                {this.state.SheetSearchTree}
            </div>
        );
    }
    // 获取 cookie 的方法
    getCookie(cookie, key) {
        let r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)');
        let m;
        if (cookie) {
            m = cookie.match(r);
        }
        return (!m ? '' : m[1]) || null;
    }

    debug() {
        tool.injectScriptStringToPage(`
            debug(SpreadsheetApp.messageCenter.sendMessageCenter.addUserChange);
        `);
    }

    unDebug() {
        tool.injectScriptStringToPage(`
            undebug(SpreadsheetApp.messageCenter.sendMessageCenter.addUserChange);
        `);
    }

    // 通知 background.ts 录屏幕
    startRecordScreen() {
        tool.injectScriptStringToPage(`
            window.postMessage({payload:'startRecordScreen'},'*')
        `);
        this.setState({
            isRecordScreen: true
        });
    }
    stopRecordScreen() {
        tool.injectScriptStringToPage(`
            window.postMessage({payload:'stopRecordScreen'},'*')
        `);
        this.setState({
            isRecordScreen: false
        });
    }
    // 显示 fd 和 id
    showFdAndId() {
        // 监听页面的 cookie 信息
        tool.listen((message) => {
            try {
                let cookie = message.payload.cookie;
                if (!cookie) {
                    return true;
                }
                this.props.setFdAndRouteId({
                    fd: this.getCookie(cookie, 'fd'),
                    routeId: this.getCookie(cookie, 'dev_route_id')
                });
                return true;
            } catch (error) { }
        });
        tool.injectScriptStringToPage(`;(${showFdAndId.toString()})();`);
    }
    // 截图
    screenshot() {
        tool.injectScriptStringToPage(`
            window.postMessage({payload: 'startScreenShot'},'*')
        `);
    }
    reset() {
        window.location.reload();
        // 浏览器页面刷新
        // tool.injectScriptStringToPage(`;window.location.reload();`, () => {
        //     // 断开 panel.ts 与 background.ts 的长通信
        //     tool.port.disconnect();
        //     // 断开 content.ts 文件中 inject.ts 和 content.ts 的通信
        //     tool.injectScriptStringToPage(`;(${shutdown.toString()})();`);
        //     setTimeout(() => {
        //         // 面板页面刷新
        //         window.location.reload();
        //     }, 1000);
        // });
    }
    // 显示所有的提醒框
    showTips() {
        tool.injectScriptStringToPage(`;(${showTips.toString()})();`);
    }
    // 获取需要注入页面的脚本字符串
    getTextAreaScript(e) {
        this.setState({
            textAreaScript: e.target.value
        });
    }
    // 在页面注入输入的脚本
    execScript() {
        tool.injectScriptStringToPage(`;(()=>{${this.state.textAreaScript}})();`);
    }
    // 在页面注入输入的脚本
    sheetSearchTree() {
        tool.injectScriptStringToPage(`;(${handleSheetSearchTree.toString()})();`);
        tool.listen(async (message) => {
            try {
                this.props.setRangeSelections(message.payload.rangeSelections);
                let rangeSelections = message.payload.rangeSelections;
                if (!rangeSelections) {
                    return true;
                }
                // 需要等待表格数据拿到之后，再渲染SheetSearchTree组件
                await new Promise((resolve) => {
                    this.setState(
                        {
                            // 清空树组件
                            SheetSearchTree: null
                        },
                        () => {
                            resolve();
                        }
                    );
                });
                this.setState({
                    // 重新构造新的树组件
                    SheetSearchTree: (
                        <SheetSearchTree rangeSelections={this.props.rangeSelections} />
                    )
                });
                return true;
            } catch (error) { }
        });
    }
    // 查找空节点
    emptyDom() {
        tool.injectScriptStringToPage(`;(${emptyDom.toString()})();`);
    }
    // 启用console.log函数
    useConsole() {
        tool.injectScriptStringToPage(`;(${useConsole.toString()})();`);
    }
}
const mapStateToProps = (state) => {
    return { ...state };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setRangeSelections(rangeSelections) {
            dispatch({
                type: 'SET_RANGE_SELECTIONS',
                rangeSelections
            });
        },
        setFdAndRouteId({ fd, routeId }) {
            dispatch({
                type: 'SET_FD_AND_ROUTE_ID',
                fd,
                routeId
            });
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ModelPanel);
