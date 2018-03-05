import { loadDoctors } from '../services/CacheService';

export default {
  namespace: 'cache',
  state: {
    doctors: {},
  },
  effects: {

    /**
     * 根据 docIds，缓存医生信息
     * docIds - Array docIds 数组，一次可传入多个
     */
    *loadDoctors({ docIds }, { select, call, put }) {
      const { doctors } = yield select(state => state.cache);
      if (docIds.length > 0) {
        const { data } = yield call(loadDoctors, docIds);
        if (data && data.success) {
          const loadedDocs = [];
          // 将后台取回的数据放入前端缓存
          const items = data.result;
          for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            doctors[item.id] = {
              id: item.id,
              name: item.name,
              gender: item.gender,
              bornDate: item.bornDate,
              idNo: item.idNo,
              mobile: item.mobile,
              deptId: item.deptId,
              deptCode: item.deptCode,
              deptName: item.deptName,
            };
          }
          yield put({
            type: 'setState',
            payload: { ...doctors, ...loadedDocs },
          });
        }
      }
    },

  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
