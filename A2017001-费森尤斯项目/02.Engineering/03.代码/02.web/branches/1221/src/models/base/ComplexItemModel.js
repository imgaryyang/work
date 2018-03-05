import { notification } from 'antd';
import { isEmpty, omit } from 'lodash';
import * as ItemService from '../../services/base/ComplexItemService';

export default {
  namespace: 'complexItem',
  state: {
    data: [],
    itemData: [],
    complexItemData: [],
    isLeftSpin: false,
    isRightSpin: false,
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedItemGroup: '',
    searchObj: {},
  },
  effects: {
    // 左侧列表查询
    *load({ payload = {} }, { select, call, put }) {
      const { query, page } = payload;
      const defaultPage = yield select(state => state.complexItem.defaultPage);
      const newPage = { ...defaultPage, ...page };
      const searchObj = yield select(state => state.complexItem.searchObj);
      const newQuery = { ...searchObj, ...query };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleLeftSpin' });
      const { data } = yield call(ItemService.loadItemInfoList, start, pageSize, newQuery);
      yield put({ type: 'toggleLeftSpin' });

      if (!isEmpty(newQuery)) {
        yield put({ type: 'setState', payload: { searchObj: newQuery } });
      }

      if (data && data.success) {
        yield put({ type: 'init', data, newPage });
      }
    },

    // 下拉选择询
    *loadComplexItemData({ payload = {} }, { call, put }) {
      const { query } = payload;
      const { data } = yield call(ItemService.loadItemList, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { complexItemData: data.result },
        });
      }
    },

    // 右侧查询列表
    *loadItemDetail({ payload = {} }, { call, put }) {
      const { query } = payload;

      yield put({ type: 'toggleRightSpin' });
      const { data } = yield call(ItemService.loadItemDetail, query);
      yield put({ type: 'toggleRightSpin' });

      const itemData = [];
      if (data && data.success) {
        if (data.result && data.result.length > 0) {
          const { result } = data;

          result.forEach((record) => {
            const { itemInfo } = record;
            const itemRecord = Object.assign(record, itemInfo);
            itemData.push(omit(itemRecord, ['itemInfo']));
          });
        }
      }

      // 设置当前选择的复合收费项目
      yield put({
        type: 'setState',
        payload: { itemData, selectedItemGroup: query.id },
      });
    },

    // 添加操作
    *addItem({ record = {} }, { select, put }) {
      const { itemData } = yield select(state => state.complexItem);

      const customColumn = {
        defaultNum: 0,
      };

      const newRecord = Object.assign(record, customColumn);

      itemData.push(newRecord);

      yield put({ type: 'setState', payload: { itemData } });
    },

    // 保存操作
    *saveItem({ payload }, { select, call, put }) {
      yield put({ type: 'toggleRightSpin' });
      const { itemData, selectedItemGroup } = yield select(state => state.complexItem);

      const savedArr = [];
      itemData.forEach((v) => {
        const savedRecord = {
          itemCode: v.id,
          defaultNum: parseInt(v.defaultNum, 10),
        };
        savedArr.push(savedRecord);
      });

      const savedData = {
        complexItem: {
          id: selectedItemGroup,
        },
        detailListItem: savedArr,
      };

      const { data } = yield call(ItemService.saveItem, { ...savedData });
      if (data && data.success) {
        yield put({ type: 'loadItemDetail', payload: { query: { id: selectedItemGroup } } });
        notification.success({ message: '提示', description: '提交成功！' });
      } else {
        notification.error({ message: '提示', description: '保存失败！' });
      }
      yield put({ type: 'toggleRightSpin' });
    },
  },
  reducers: {
    init(state, { data, newPage }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...newPage, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleLeftSpin(state) {
      return { ...state, isLeftSpin: !state.isLeftSpin };
    },

    toggleRightSpin(state) {
      return { ...state, isRightSpin: !state.isRightSpin };
    },

    deleteRow(state, { index }) {
      const { itemData } = state;
      itemData.splice(index, 1);
      return { ...state, itemData };
    },
  },
};
