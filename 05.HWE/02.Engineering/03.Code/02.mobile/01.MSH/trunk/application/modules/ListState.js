// 用于列表数据展现控制的状态
export default {
  refreshing: false,
  infiniteLoading: false,
  noMoreData: false,
  requestErr: false,
  requestErrMsg: null,
};
// 初始page
export const initPage = { start: 0, limit: 20, total: 0 };
