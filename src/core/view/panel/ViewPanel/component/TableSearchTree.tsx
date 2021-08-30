import React from 'react';
import { Table, Descriptions } from 'antd';

const columns = [
    {
        title: 'setSlots',
        dataIndex: 'setSlots',
        key: 'setSlots'
    },
    {
        title: 'effectiveValue',
        dataIndex: 'effectiveValue',
        key: 'effectiveValue'
    },
    {
        title: 'formattedValue',
        dataIndex: 'formattedValue',
        key: 'formattedValue'
    },
    {
        title: 'editValue',
        key: 'editValue',
        dataIndex: 'editValue'
    },
    {
        title: 'userEnteredFormat',
        dataIndex: 'userEnteredFormat',
        key: 'userEnteredFormat',
        render(userEnteredFormat) {
            console.log(userEnteredFormat);
            return (
                <Descriptions title="" bordered>
                    <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
                </Descriptions>
            );
        }
    },
    {
        title: 'effectiveFormat',
        dataIndex: 'effectiveFormat',
        key: 'effectiveFormat'
    },
    {
        title: 'conditionalFormatResult',
        dataIndex: 'conditionalFormatResult',
        key: 'conditionalFormatResult'
    },
    {
        title: 'mergeReference',
        dataIndex: 'mergeReference',
        key: 'mergeReference'
    },
    {
        title: 'hyperlink',
        dataIndex: 'hyperlink',
        key: 'hyperlink'
    },
    {
        title: 'formula',
        dataIndex: 'formula',
        key: 'formula'
    },
    {
        title: 'textFormatRuns',
        dataIndex: 'textFormatRuns',
        key: 'textFormatRuns'
    },
    {
        title: 'isDataValid',
        dataIndex: 'isDataValid',
        key: 'isDataValid'
    },
    {
        title: 'sheetRangeReferences',
        dataIndex: 'sheetRangeReferences',
        key: 'sheetRangeReferences'
    },
    {
        title: 'author',
        dataIndex: 'author',
        key: 'author'
    },
    {
        title: 'mentionDetails',
        dataIndex: 'mentionDetails',
        key: 'mentionDetails'
    }
];

const data = [
    {
        setSlots: 5,
        effectiveValue: { type: 0, value: 33333333, originValue: null },
        formattedValue: {
            type: 'normal',
            value: '33333333',
            textColor: null
        },
        editValue: '33333333',
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
    }
];

interface Props {
    tableData: any[];
}
export default class SheetSearchTree extends React.Component<Props> {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.tableData);
        return (
            JSON.stringify(this.props.tableData)
            // !this.props.tableData || <Table columns={columns} dataSource={[this.props.tableData]} />
        );
        // return <div>{JSON.stringify(this.props.tableData)}</div>;
    }
}
