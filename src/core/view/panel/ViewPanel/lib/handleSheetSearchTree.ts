export default () => {
    window.SpreadsheetApp.view.canvas.normalSelectData.emitter.on(window.SpreadsheetApp.view.canvas.normalSelectData.EVENT.MODIFY_SELECTION, (e) => {
        // window.__console.log(e);
        // try {
        // window.clearInterval(window.getrangeSelections);
        // window.getrangeSelections = setInterval(() => {
        let rangeSelections = [...window.SpreadsheetApp.view.getSelection().rangeSelections];
        // 这个方法主要就是把选中表格范围的数据的每一条详情遍历取出来
        rangeSelections.map((item) => {
            // 行起始位置
            let startRowIndex = item.startRowIndex;
            // 列起始位置
            let startColIndex = item.startColIndex;
            // 初始化
            item.children = [];
            item.title = '';
            // 行的长度
            let rowLength =
                item.endRowIndex - startRowIndex > 0 ? item.endRowIndex - startRowIndex : 0;
            // 列的长度
            let colLength =
                item.endColIndex - startColIndex > 0 ? item.endColIndex - startColIndex : 0;
            // 显示 xxx 行 xxx 列
            if (item.startRowIndex - item.endRowIndex === 0) {
                item.title = `${item.startRowIndex + 1}行`;
            } else {
                item.title = `${item.startRowIndex + 1}-${item.endRowIndex + 1}行`;
            }
            if (item.startColIndex - item.endColIndex === 0) {
                item.title += `${item.startColIndex + 1}列`;
            } else {
                item.title += `${item.startColIndex + 1}-${item.endColIndex + 1}列`;
            }
            for (let i = 0; i <= rowLength; i++) {
                let rowData = window.SpreadsheetApp.spreadsheet.activeSheet.data.rowData;
                // SpreadsheetApp.spreadsheet.activeSheet.data.rowData[0].values[0]
                // @ts-ignore
                // window.__console.log(rowData, startRowIndex + i, startColIndex + i);
                // console.log(rowData[startRowIndex + i].values[startColIndex]);
                // 如果没有所有行数据，将中断循环
                if (!rowData) {
                    break;
                }
                // 如果遍历的当前行没数据将不处理该行
                if (!rowData[startRowIndex + i]) {
                    continue;
                }
                // e 为该单元格详细的数据信息
                let e = rowData[startRowIndex + i].values[startColIndex];
                // 设置第n行的第一个
                item.children.push([{ e, position: [startRowIndex + i, startColIndex] }]);
                for (let j = 0; j < colLength; j++) {
                    // e 为该单元格详细的数据信息
                    let e = rowData[startRowIndex + i].values[startColIndex + j + 1];
                    // 设置第 n 行第二个之后的元素
                    item.children[i].push({
                        e,
                        position: [startRowIndex + i, startColIndex + j + 1]
                    });
                }
            }
        });
        // 传给面板
        window.postMessage(
            {
                source: 'tencent-docs-devtools-inject',
                payload: { rangeSelections }
            },
            '*'
        );
        // }, 1000);
        // } catch (error) {}
    });
};
