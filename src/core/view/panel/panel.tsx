import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from '../../store';

import tool from '../../panel';
import 'antd/dist/antd.css';
import './panel.css';

// 数据层面板
import ModelPanel from './ModelPanel';
// 视图层面板
import ViewPanel from './ViewPanel';
// 视图层面板
import PastePanel from './PastePanel';
// debug调试面板
import DebugPanel from './DebugPanel';

// 提醒调试面板刷新的提示窗口
import ReloadTipModel from './ViewPanel/component/ReloadTipModel';

import { Layout, Menu, Icon } from 'antd';

import watchSheetPageReload from './ViewPanel/lib/watchSheetPageReload';

const { Content, Sider } = Layout;

// 侧边栏
const menus = [
    {
        key: '1',
        type: 'user',
        className: 'nav-text',
        text: '基本功能'
    },
    {
        key: '2',
        type: 'video-camera',
        className: 'nav-text',
        text: '性能'
    },
    {
        key: '3',
        type: 'upload',
        className: 'nav-text',
        text: '粘贴板记录'
    },
    {
        key: '4',
        type: 'upload',
        className: 'nav-text',
        text: '断点调试'
    }
    // {
    //     key: '4',
    //     type: 'user',
    //     className: 'nav-text',
    //     text: '其他'
    // }
];
class DevtoolLayout extends React.Component {
    state = {
        visible: false,
        selectedKeys: '1',
        menus
    };
    toggle = (selectedKeys) => {
        this.setState({
            selectedKeys
        });
    };
    render() {
        return (
            <Provider store={store}>
                <Layout>
                    <Sider breakpoint="lg" collapsedWidth="0">
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            {this.state.menus.map((item) => {
                                return (
                                    <Menu.Item
                                        onClick={this.toggle.bind(this, item.key)}
                                        key={item.key}
                                    >
                                        <Icon type={item.type} />
                                        <span className={item.className}>{item.text}</span>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={{ margin: '16px' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 1600 }}>
                                {(() => {
                                    switch (this.state.selectedKeys) {
                                        case '1':
                                            return <ViewPanel />;
                                        case '2':
                                            return <ModelPanel />;
                                        case '3':
                                            return <PastePanel />
                                        case '4':
                                            return <DebugPanel />
                                    }
                                })()}
                            </div>
                        </Content>
                    </Layout>
                    {this.state.visible && <ReloadTipModel />}
                </Layout>
            </Provider>
        );
    }
    // 监听表格页的刷新操作
    watchSheetPageReload() {
        tool.listen((message) => {
            if (message.payload === 'sheet-reload') {
                this.setState({
                    visible: true
                });
            }
        });
        tool.injectScriptStringToPage(`;(${watchSheetPageReload.toString()})();`);
    }
    componentDidMount() {
        this.watchSheetPageReload();
    }
}

ReactDOM.render(
    <div>
        <DevtoolLayout />
    </div>,
    document.querySelector('#panel')
);
