import React from 'react';
import { Modal } from 'antd';
export default class ReloadTipModel extends React.Component {
    state = {
        visible: true
    };

    handleOk = (e) => {
        this.setState({
            visible: false
        });
        window.location.reload();
    };

    handleCancel = (e) => {
        this.setState({
            visible: false
        });
    };

    render() {
        return (
            <Modal
                cancelText="取消"
                okText="刷新"
                title="温馨提醒"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>如果刷新了表格页面，请重新刷新当前调试面板更新数据。</p>
            </Modal>
        );
    }
}
