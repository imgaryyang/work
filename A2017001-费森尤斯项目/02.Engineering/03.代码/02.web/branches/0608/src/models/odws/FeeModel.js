
import { loadFeeAggregation } from '../../services/odws/FeeService';

export default {
  namespace: 'odwsFee',
  state: {
    query: {},
    examApplys: [],
    spin: false,
  },
  effects: {


  },
  reducers: {

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
