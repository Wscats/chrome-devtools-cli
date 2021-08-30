import React from 'react';
import { List, Typography, Button, PageHeader, Tag } from 'antd';

interface State {
    pasteRecord: string[]
}
interface Props {
    isWatchClipboardContents: boolean
}
export default class SheetSearchTree extends React.Component<Props> {
    constructor(props) {
        super(props);
    }
    state: State = {
        pasteRecord: []
    }
    clearPasteRecord() {
        localStorage.removeItem('paste-info');
    }
    render() {
        return (
            <List
                header={<PageHeader
                    title="粘贴板"
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    subTitle="历史记录"
                    tags={<Tag color="blue">{this.props.isWatchClipboardContents ? 'Stop' : 'Running'}</Tag>}
                />}
                footer={<Button onClick={this.clearPasteRecord} type="danger">清空粘贴板历史记录</Button>}
                bordered
                dataSource={this.state.pasteRecord}
                renderItem={item => (
                    item ?
                        <List.Item>
                            <Typography.Text mark></Typography.Text> {item}
                        </List.Item>
                        :
                        <List.Item>
                            <Typography.Text mark></Typography.Text> <Tag color="purple">空数据</Tag>
                        </List.Item>
                )}
            />
        );
    }
    componentDidMount() {
        // 设置粘贴板信息到列表数据里面
        this.setState({
            pasteRecord: localStorage.getItem('paste-info') ? JSON.parse(localStorage.getItem('paste-info')) : []
        })
        // 监听Storage的改变，更新面板内容
        window.addEventListener("storage", (e) => {
            this.setState({
                pasteRecord: JSON.parse(e.newValue)
            })
        });
    }
}