import VirtualList from "./virtual";
// {
//   width: "500px",
//   data: Array.from({ length: 100000 }).map((_, i) => {
//     return {
//       id: i + 1,
//       name: "姓名" + i,
//       introduce: introduceList[Math.floor(Math.random() * 2)],
//       // todo
//       //   img
//     };
//   }),
//   columns: [
//     { type: "check" },
//     { label: "编号", key: "id", width: 50 },
//     { label: "姓名", key: "name", minWidth: 80 },
//     { label: "自我介绍", key: "introduce" },
//   ],
// }
const virtualTable = (function () {
  //表格体的最小高度
  const MIN_BODY_HEIGHT = 100;
  const TABLE_BORDER_SIZE = 1; //表格border尺寸
  let virtualListInstance = null;
  let tableBodyDom = null;
  let tableWrap = null;
  let tablePlaceholderDom = null;
  function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
  //获取滚动条的宽度
  function getScrollBarWidth(container) {
    const div = document.createElement("div");
    div.style.height = "1px";
    div.style.overflowY = "scroll";
    const divChild = document.createElement("div");
    divChild.style.height = "5px";
    div.appendChild(divChild);
    container.appendChild(div);
    const scrollBar = div.offsetWidth - div.clientWidth;
    div.remove();
    return scrollBar;
    // return scrollBar + 2 * TABLE_BORDER_SIZE;
  }
  function initOptions(options) {
    const typeWidthMap = {
      check: 50,
    };
    options.columns = options.columns || [];
    options.columns.forEach((col) => {
      col.width = col.width || typeWidthMap[col.type];
    });
    return options;
  }
  function getDefaultLabel(column) {
    const labelMap = {
      check: "选择",
    };
    return labelMap[column.type] ?? "";
  }
  function isNormalCol(column) {
    return !column.type;
  }
  function getDefaultColWidth(columns, width) {
    const minColWidth = 80;
    let autoCount = 0,
      totalWidth = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width > 0) {
        totalWidth += columns[i].width;
      } else {
        autoCount++;
      }
    }
    if (autoCount > 0) {
      const ret = (width - totalWidth) / autoCount;
      return Math.max(ret, minColWidth);
    } else {
      return minColWidth;
    }
  }
  //设置没列的样式
  function createColGroup(columns, width) {
    const colgroup = document.createElement("colgroup");
    const defaultColWidth = getDefaultColWidth(columns, width);
    for (let i = 0; i < columns.length; i++) {
      const col = document.createElement("col");
      col.style.width = (columns[i].width || defaultColWidth) + "px";
      colgroup.appendChild(col);
    }
    return colgroup;
  }
  function createTheader(columns, width) {
    const tableDom = document.createElement("table");
    //设置列属性
    tableDom.appendChild(createColGroup(columns, width));
    //添加head
    const tHeader = document.createElement("thead");
    const tr = document.createElement("tr");
    for (let i = 0; i < columns.length; i++) {
      const th = document.createElement("th");
      th.innerHTML = columns[i].label || getDefaultLabel(columns[i]);
      tr.appendChild(th);
    }
    tHeader.appendChild(tr);
    tableDom.appendChild(tHeader);
    return tableDom;
  }
  // 添加表格体的div，设置样式
  function createTableWrap(width, bodyHeight, container) {
    const wrap = document.createElement("div");
    wrap.className = "virtual-table-wrap";
    wrap.style.width = `${
      width + getScrollBarWidth(container) + 2 * TABLE_BORDER_SIZE
    }px`;
    wrap.style.height = bodyHeight + "px";
    return wrap;
  }
  function createPlaceholder(height) {
    tablePlaceholderDom = document.createElement("div");
    tablePlaceholderDom.style.height = height + "px";
    return tablePlaceholderDom;
  }
  function createTbody({
    container,
    columns,
    data,
    estimateTdHeight,
    bodyHeight,
    width,
  }) {
    tableWrap = createTableWrap(width, bodyHeight, container);
    container.appendChild(tableWrap);
    // 计算每行的尺寸，获取可见数据
    virtualListInstance = new VirtualList({
      data,
      estimateTdHeight,
      tableWrap,
    });
    // 设置占位div的高度，显示滚动条，高度为virtualListInstance.contentHeight
    tableWrap.appendChild(createPlaceholder(virtualListInstance.contentHeight));
    //设置表格体
    tableBodyDom = document.createElement("table");
    //设置列属性
    tableBodyDom.className = "virtual-table-body";
    tableBodyDom.appendChild(createColGroup(columns, width));
    //用计算新的startIdx和endIdx，计算结束后渲染新的dom
    VirtualList.onDomScroll(virtualListInstance, (scrollDown) => {
      renderNewDom(columns, data);
      if (scrollDown) {
        virtualListInstance.reComputePosition(tableBodyDom, tableWrap);
        tablePlaceholderDom.style.height =
          virtualListInstance.contentHeight + "px";
      }
    });
    //初始化时，渲染第一页
    renderNewDom(columns, data);
    tableWrap.appendChild(tableBodyDom);
    //根据实际高度，重新计算位置表
    virtualListInstance.reComputePosition(tableBodyDom, tableWrap);
    tablePlaceholderDom.style.height = virtualListInstance.contentHeight + "px";
    return tableWrap;
  }
  function getReusedNodes() {
    let trNodes = [...tableBodyDom.childNodes].filter(
      (node) => node.tagName === "TR"
    );
    //删除多余的tr
    if (
      trNodes.length >
      virtualListInstance.endIdx - virtualListInstance.startIdx + 1
    ) {
      //删除多余的tr
      for (
        let i = virtualListInstance.endIdx - virtualListInstance.startIdx + 1;
        i < trNodes.length;
        i++
      ) {
        trNodes[i].remove();
      }
    }

    trNodes = trNodes.slice(0, trNodes.length);
    return trNodes;
  }
  function renderUseExistNodes(nodes, columns, data) {
    for (
      let i = virtualListInstance.startIdx;
      i <= virtualListInstance.endIdx;
      i++
    ) {
      const nodesIndex = i - virtualListInstance.startIdx;
      const isNew = nodesIndex >= nodes.length;
      let tr = isNew ? document.createElement("tr") : nodes[nodesIndex];
      VirtualList.setAttribute(tr, virtualListInstance.dataPositionInfo[i]);
      if (isNew) {
        tableBodyDom.appendChild(tr);
      }
      for (let j = 0; j < columns.length; j++) {
        const td = isNew ? document.createElement("td") : tr.childNodes[j];
        if (isNormalCol(columns[j])) {
          td.innerHTML = data[i][columns[j].key];
        } else {
          //todo 特殊类型的列
        }
        isNew && tr.appendChild(td);
      }
    }
  }

  function renderNewDom(columns, data) {
    // 根据实例上的startIdx和endIdx渲染
    // 设置tableBodyDom的translate属性
    const offsetTop =
      virtualListInstance.dataPositionInfo[virtualListInstance.startIdx].top;
    const reusedNodes = getReusedNodes();
    renderUseExistNodes(reusedNodes, columns, data);
    tableBodyDom.style.transform = `translate3d(0, ${offsetTop}px, 0)`;
  }
  return function (container, options) {
    if (!(container instanceof Element) || container.nodeType !== 1) {
      throw new Error("容器必须为普通DOM元素");
    }
    if (!options || !isObject(options)) {
      throw new Error("配置项是必传项且需要是对象");
    }
    options = initOptions(options);
    const {
      width = 800,
      data,
      columns,
      estimateTdHeight = 48,
      height,
    } = options;
    //添加表头table
    const thead = createTheader(columns, width);
    container.appendChild(thead);
    //表头渲染后，渲染表格体
    const headHeight = thead.getBoundingClientRect().height;
    const bodyHeight = height - headHeight;
    createTbody({
      container,
      columns,
      data,
      estimateTdHeight,
      bodyHeight: bodyHeight > MIN_BODY_HEIGHT ? bodyHeight : MIN_BODY_HEIGHT,
      width,
    });
  };
})();

export default virtualTable;
