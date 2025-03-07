import { throttle } from "./utils";

function initComputedDataPosition({ data, estimateTdHeight, tableWrap }) {
  const containerHeight = tableWrap.clientHeight;
  let contentHeight = 0,
    startIdx = 0,
    endIdx = 0;
  //每行数据的位置信息array<{top: number,bottom: number,height: number}>
  //与外部传入的data顺序是一一对应的
  const dataPositionInfo = Array.from(data).map((item, index) => {
    const temp = {
      rawData: item,
      idx: index,
      top: contentHeight,
      bottom: contentHeight + estimateTdHeight,
      height: estimateTdHeight,
    };
    contentHeight += estimateTdHeight;
    if (contentHeight > containerHeight && endIdx === 0) {
      endIdx = index;
    }
    return temp;
  });
  console.log(`init startIdx: ${startIdx}, endIdx: ${endIdx}`);
  return {
    startIdx,
    endIdx,
    dataPositionInfo,
    contentHeight,
  };
}
class VirtualList {
  constructor({ data, estimateTdHeight, tableWrap, gap = 200 }) {
    const { startIdx, endIdx, dataPositionInfo, contentHeight } =
      initComputedDataPosition({
        data,
        estimateTdHeight,
        tableWrap,
      });
    this.tableWrap = tableWrap;
    this.gap = gap;
    this.dataPositionInfo = dataPositionInfo;
    this.contentHeight = contentHeight;
    this.startIdx = startIdx;
    this.endIdx = endIdx;
    this.lastScrollTop = 0;
  }
  reComputePosition(tableDom) {
    //重新计算相对于容器的位置
    let dHeight = 0;
    tableDom.childNodes.forEach((child) => {
      const idx = Number(child.dataset["idx"]);
      if (idx >= 0) {
        const rect = child.getBoundingClientRect();
        const oldHeight = this.dataPositionInfo[idx].height;
        this.dataPositionInfo[idx].height = rect.bottom - rect.y;
        this.dataPositionInfo[idx].top =
          idx === 0 ? 0 : this.dataPositionInfo[idx - 1].bottom;
        this.dataPositionInfo[idx].bottom =
          this.dataPositionInfo[idx].top + this.dataPositionInfo[idx].height;
        dHeight += this.dataPositionInfo[idx].height - oldHeight;
      }
    });
    this.contentHeight += dHeight;
  }
  static onDomScroll(instance, scrollCb) {
    const scrollHandler = throttle(() => {
      const scrollTop = instance.tableWrap.scrollTop - instance.gap;
      const wrapBottom =
        instance.tableWrap.scrollTop +
        instance.tableWrap.offsetHeight +
        instance.gap;
      //todo 滚动到底部时，请求下一页数据
      //根据scrollTop重新渲染
      let start = -1,
        end = -1;
      if (scrollTop > instance.lastScrollTop) {
        //向下滚动，从滚动前的第一个元素开始遍历，找到第一个在当前容器视窗下部的元素
        for (
          let i = instance.startIdx;
          i < instance.dataPositionInfo.length;
          i++
        ) {
          if (
            start === -1 &&
            instance.dataPositionInfo[i].bottom >= scrollTop
          ) {
            //从上到下，第一个底部在视窗的元素，作为第一个元素渲染
            start = instance.startIdx = i;
          }
          if (
            instance.dataPositionInfo[i].top > wrapBottom ||
            i === instance.dataPositionInfo.length - 1
          ) {
            //第一个在当前容器视窗下部的元素，它作为最后一个元素渲染
            end = instance.endIdx = i;
            break;
          }
        }
      } else if (scrollTop < instance.lastScrollTop) {
        //向上滚动，从滚动前的最后一个元素开始遍历，找到第一个在当前容器视窗上部的元素
        for (let i = instance.endIdx; i >= 0; i--) {
          if (instance.dataPositionInfo[i].bottom <= scrollTop || i === 0) {
            //第一个在视窗上部的元素，作为第一个元素渲染
            start = instance.startIdx = i;
            break;
          }
          if (end === -1 && instance.dataPositionInfo[i].top <= wrapBottom) {
            //从下到上，第一个top在视窗中的元素，作为最后一个元素渲染
            end = instance.endIdx = i;
          }
        }
      }
      console.log(`startIdx: ${instance.startIdx}, endIdx: ${instance.endIdx}`);
      scrollCb && scrollCb(scrollTop > instance.lastScrollTop);
      instance.lastScrollTop = scrollTop;
    }, 200);
    instance.tableWrap.addEventListener("scroll", scrollHandler, false);
  }
  static setAttribute(domNode, info) {
    domNode.setAttribute("data-idx", info.idx);
  }
}
export default VirtualList;
