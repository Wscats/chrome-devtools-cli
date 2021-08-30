import React from 'react';
import { Tree, Input, Drawer, Tag } from 'antd';
import TableSearchTree from './TableSearchTree';
import tool from '../../../../panel';
import showRecordsList from '../lib/showRecordsList';

const { TreeNode } = Tree;
const { Search } = Input;
interface Props {
    rangeSelections: [
        {
            isSheet: boolean;
            sheetId: string;
            startRowIndex: number;
            endRowIndex: number;
            startColIndex: number;
            endColIndex: number;
            title: string;
            children?: any[];
        }
    ];
}

interface State {
    searchValue: string;
    autoExpandParent: boolean;
    tableData: any;
    history: any;
    visible: boolean;
    selectedKeys: string;
}

export default class SheetSearchTree extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }
    state: State = {
        searchValue: '',
        autoExpandParent: true,
        tableData: null,
        history: null,
        visible: false,
        selectedKeys: ''
    };
    num2letter(index: number) {
        let letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (index <= 25) {
            return letter[index];
        } else {
            let result = index / 26;
            let l1 = parseInt(`${result}`) - 1;
            let l2 = index % 26;
            return letter[l1] + letter[l2];
        }
    }
    getSheetDetail(selectedKeys, e) {
        try {
            const tableData = e.selectedNodes[0].props.tableData;
            // console.log(selectedKeys, e);
            // 获取单行
            if (tableData instanceof Array) {
                this.showDrawer(selectedKeys, { e: tableData });
            }
            // 整列和行的所有信息
            else if (tableData.children instanceof Array) {
                this.showDrawer(selectedKeys, { e: tableData.children });
            }
            // 获取一个单元格的信息
            else {
                // 展开抽屉
                this.showDrawer(selectedKeys, tableData);
                // 获取修订记录
                // this.getRecordsList();
                let postion = tableData.position;
                tool.injectScriptStringToPage(`
                    window.__console.log('-----第${postion[0] + 1}行，第${this.num2letter(
                    postion[1]
                )}列-----')
                    window.__console.log(window.SpreadsheetApp.spreadsheet.activeSheet.data.rowData[${
                        postion[0]
                    }].values[${postion[1]}])
                `);
            }
        } catch (error) {
            console.log(error);
        }
    }
    onChange() {
        this.setState({
            autoExpandParent: true
        });
    }
    treeNode(item) {
        // 渲染列
        let colTreeNode = (col) => {
            return (
                <TreeNode
                    key={`第${this.num2letter(col.position[1])}列`}
                    title={`第${this.num2letter(col.position[1])}列`}
                    tableData={col}
                ></TreeNode>
            );
        };
        // 渲染行
        let rowTreeNode = (row) => {
            return (
                <TreeNode
                    key={`第${row[0].position[0] + 1}行`}
                    title={`第${row[0].position[0] + 1}行`}
                    tableData={row}
                >
                    {row
                        ? row.map((col) => {
                              return colTreeNode(col);
                          })
                        : '加载树结构...'}
                </TreeNode>
            );
        };
        return (
            // 渲染行和列总体的数据
            <TreeNode key={item.title} title={item.title} tableData={item}>
                {item.children.length
                    ? item.children.map((row) => {
                          return rowTreeNode(row);
                      })
                    : '加载树结构...'}
            </TreeNode>
        );
    }

    getRecordsList(page?: number, callBack?: Function) {
        tool.listen((message) => {
            try {
                const history = message.payload.history;
                if (history) {
                    this.setState({
                        history
                    });
                }
            } catch (error) {}
        });
        tool.injectScriptStringToPage(`;(${showRecordsList.toString()})();`);
    }
    showDrawer = (selectedKeys, tableData) => {
        this.setState({
            selectedKeys,
            visible: true,
            tableData: tableData ? tableData : null
        });
    };
    onClose() {
        this.setState({
            visible: false
        });
    }
    // 把键值对渲染树状图上
    showKeyAndValue(data) {
        let arr = [];
        Object.keys(data).forEach((key, index) => {
            switch (typeof data[key]) {
                case 'object':
                    // null类型
                    if (data[key] === null) {
                        arr.push(
                            <TreeNode
                                title={`${key}: null`}
                                key={`${index}:${key}-${data[key]}`}
                            ></TreeNode>
                        );
                    }
                    // 数组类型
                    else if (data[key] instanceof Array) {
                        arr.push(
                            <TreeNode title={`${key}: Array`} key={`${index}:${key}-${data[key]}`}>
                                {/* 渲染子元素 */}
                                {this.showKeyAndValue(data[key])}
                            </TreeNode>
                        );
                    }
                    // 对象类型
                    else {
                        arr.push(
                            <TreeNode title={`${key}: Object`} key={`${index}:${key}-${data[key]}`}>
                                {/* 渲染子元素 */}
                                {this.showKeyAndValue(data[key])}
                            </TreeNode>
                        );
                    }
                    break;
                case 'string':
                    arr.push(
                        <TreeNode
                            title={`${key}: "${data[key]}"`}
                            key={`${index}:${key}-${data[key]}`}
                        ></TreeNode>
                    );
                    break;
                case 'number':
                    arr.push(
                        <TreeNode
                            title={`${key}: ${data[key]}`}
                            key={`${index}:${key}-${data[key]}`}
                        ></TreeNode>
                    );
                    break;
                case 'undefined':
                    arr.push(
                        <TreeNode
                            title={`${key}: undefined`}
                            key={`${index}:${key}-${data[key]}`}
                        ></TreeNode>
                    );
                    break;
            }
        });
        return arr;
    }
    componentDidMount() {}
    render() {
        return (
            <>
                <div>
                    {this.props.rangeSelections.length > 0 && (
                        <Tree
                            onSelect={this.getSheetDetail.bind(this)}
                            autoExpandParent={true}
                            defaultExpandAll={true}
                        >
                            {this.props.rangeSelections.length
                                ? this.props.rangeSelections.map((item) => {
                                      return this.treeNode(item);
                                  })
                                : '加载树结构...'}
                        </Tree>
                    )}
                    {/* <TableSearchTree tableData={this.state.tableData} /> */}
                </div>
                {/* 弹窗 */}
                <Drawer
                    width="500px"
                    title={this.state.selectedKeys}
                    placement="right"
                    closable={true}
                    onClose={this.onClose.bind(this)}
                    visible={this.state.visible}
                >
                    {/* <Search
                        style={{ marginBottom: 8 }}
                        placeholder="Search"
                        onChange={this.onChange.bind(this)}
                    /> */}
                    <Tree autoExpandParent={true}>
                        {this.state.tableData
                            ? this.showKeyAndValue(this.state.tableData.e)
                            : '加载树结构...'}
                    </Tree>
                </Drawer>
            </>
        );
    }
}
