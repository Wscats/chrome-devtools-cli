export default () => {
    // 查找空节点
    function traverseNodes(node) {
        // 判断是否是元素节点
        if (node.nodeType === 1) {
            // 判断该元素节点是否有子节点
            if (node.childNodes.length) {
                // 得到所有的子节点
                let sonnodes = node.childNodes;
                // 遍历所有的子节点
                for (let i = 0; i < sonnodes.length; i++) {
                    // 找出有空格字符的节点 <p> </p>
                    if (!node.innerText && !node.childNodes.length) {
                        window.__console.log(node);
                    }
                    // 得到具体的某个子节点
                    let sonnode = sonnodes.item(i);
                    // 递归遍历
                    traverseNodes(sonnode);
                }
            } else {
                window.__console.log(node);
            }
        }
    }
    traverseNodes(document.body);
};
