import moment from 'moment';
import { notification } from 'antd';
import {loadCompany} from '../../services/pharmacy/DirectInService';
import * as buyBillService from '../../services/pharmacy/BuyBillService';
import * as buyDetailService from '../../services/pharmacy/BuyDetailService';

export default {
  namespace: 'procureInstock',

  state: {
    buyList: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],
    },
    buyDetail: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],

    },
    buyHis: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],
    },
    company:'',
	companyInfo:[],
    isSpin: false,
    
    bizPrintAlertParams: {
    	visible: false,
        tmplateCode: '',
        bizCode: '',
        bizCodeLabel: '',
        bizTip: ''
    }
  },

  effects: {
    // 1、加载采购单列表
    *loadBuyList({ payload }, { select, call, put }) {
      yield put({type: 'setState',payload:{isSpin:true}});
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.procureInstock.buyList.page);
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // 获取采购单列表信息，翻页
      const { data } = yield call(buyBillService.loadBuyBillPage, start, pageSize, query);
      if (data) {
      // 更新state，刷新页面
        yield put({ type: 'updateBuyList', data: data.result, page: newPage });
      }
      //获取供货商下拉列表
      const {data:dataCompany} = yield call(loadCompany);
	  let companyInfo = [];
	  if (dataCompany&&dataCompany.success){
		  const {result:resultCompany} = dataCompany;
		  for( let j = 0 ; j < resultCompany.length; j ++){
			  companyInfo.push({id: resultCompany[j].id,
				  				name:resultCompany[j].companyName,
				  });
		  }
	  }
	  else{
		  //todo
	  }
	  yield put({ type: 'setState', payload: {companyInfo: companyInfo}});
	  
	  yield put({type: 'setState',payload:{isSpin:false}});
    },

    // 2、查询采购单明细
    *loadBuyDetail({ payload }, { select, call, put }) {
      yield put({type: 'setState',payload:{isSpin:true}});
      const { page, query, record } = (payload || {});
      const { buyDetail } = yield select(state => state.procureInstock);
      const newPage = {
        ...buyDetail.page,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const { data } = yield call(buyDetailService.loadBuyDetail, start, pageSize, query);
      if (data && data.result) {
    	 /* for( let o of data.result ){
    		  o.inNum = o.auitdNum;
    	  }*/
        const newDetail = {
          ...buyDetail,
          data: data.result,
          ...record,
        };

        yield put({ type: 'setState', payload: { buyDetail: newDetail } });
      }
   
      yield put({type: 'setState',payload:{isSpin:false}});
    },

    // 4、入库保存
    *saveBuy({ payload }, { select, call, put }) {
      const { buyState, id } = payload || {};

      const { user } = yield select(state => state.base);
      const { buyDetail, company } = yield select(state => state.procureInstock);

      const buyData = buyDetail.data;
      const buyDateInput = [];
      const userName = user.name;
      const deptId = user.loginDepartment.id;

      const newBuy = { id, buyState, updateOper: user.name,company };

      yield put({type: 'setState',payload:{isSpin:true}});
       
      //const { data: ret } = yield call(buyBillService.UpdInstock, newBuy);//保存主表
      //if (ret && ret.success) {
      // 调用汐鸣入库处理接口buyData为明细

        if (buyData && buyData.length > 0) {
          for (const o of buyData) {
        	 
  
            o.buyBill = buyDetail.buyBill;
            o.inputState = '4';
            o.inType = 'I1';
            o.plusMinus = '1';
            o.batchNo = '';// 批次默认
            o.deptId = buyDetail.deptId;
            o.inSum = o.inNum;
            //o.inNum = o.auitdNum;
            o.inBill = null;
            o.procuceDate = o.produceDate
            o.companyInfo = {id : company};//入库供货商

//            o.approvalNo = '1';//批号得界面手输
//            o.produceDate = moment().format('YYYY-MM-DD');//生产日期得界面手输
//            o.validDate = moment().format('YYYY-MM-DD');//有效日期得界面手输
//            o.inSum = 1.0;//入库数量
            o.inTime = moment().format('YYYY-MM-DD');
            o.inOper = userName;
//            o.saleCost = o.inSum * o.salePrice;//入库金额
            let tmp ={...o};
        	 buyDateInput.push(tmp);
          	}
          for (const o of buyDateInput) {
              o.id = null;

            }
          
          newBuy.inputInfos = buyDateInput;
          newBuy.buyDetail = buyData;          
          	 /*
        	  const { data: ret } = yield call(buyDetailService.saveBuy, buyDateInput);// todo
              
              if (ret && ret.success) {
            	//将入库的批次号拿回来循环去比对
            	  const{result} = ret
            	  for (const obj of buyData){
            		  for(const rlt of result){
            			  if (rlt.drugInfo.id == obj.drugInfo.id){
            				  obj.batchNo = rlt.batchNo;
            			  }
            		  }
            	  }
            	  //--------
            	const{data: retDetail} = yield call(buyDetailService.saveBatch,buyData );//更新明细
            	
            	yield put({ type: 'loadBuyList', payload: { query: { buyState: '2',deptId:deptId } } });
                yield put({ type: 'setState', payload: { buyDetail: {} } });
                
                notification.success({
		            message: '提示',
		            description: '入库成功',
	    		});
              } else {
                notification.error({
                  message: '错误',
                  description: `${ret.msg}!`,
                });
              }*/
          
          const { data } = yield call(buyBillService.updInstock2, newBuy);
          if (data && data.success) {
        	  yield put({ type: 'loadBuyList', payload: { query: { buyState: '2',deptId:deptId } } });
              yield put({ type: 'setState', payload: { buyDetail: {} } });
          
              /*
              notification.success({
	            message: '提示',
	            description: '入库成功',
    		});*/
              
           var bubBillData = data.result;   
           console.log('bubBillData', bubBillData);    
           // 弹出业务单据打印提示
      	   yield put({ 
      			type: 'setState', 
      			payload: { 
      				bizPrintAlertParams: { 
      					visible: true, 
      					tmplateCode: '015', // 模版编号 
      					bizCode: bubBillData.buyBill, // 业务单据编号
      					bizCodeLabel: '采购计划单号', // 业务单据编号名称
      					bizTip: '采购计划入库成功' // 业务操作成功提示
      				}
      			}
      		});
              
          } else {
              notification.error({
                message: '错误',
                description: `${data.msg}!`,
              });
            }
      }
      
    /*}else{ 
    	 notification.error({
             message: '错误',
             description: '保存采购主表失败',
           });
    }*/
      
      yield put({type: 'setState',payload:{isSpin:false}});
  },
 },

  reducers: {
    updateBuyList(state, { data, page }) {
      const { buyList } = state;

      const { total } = page;

      const newPage = { ...buyList.page, total };
      const newBuyList = { ...buyList, data, page: newPage };
      return {
        ...state,
        buyList: newBuyList,
      };
    },

    delete(state, { id }) {
      const { buy } = state;
      const index = buy.data.findIndex(value => value.id === id);
      buy.data.splice(index, 1);
      return {
        ...state,
        buy,
      };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    togglebuyDetailSpin(state) {
      const { buyDetail } = state;
      const newBuy = { ...buyDetail, isSpin: !buyDetail.isSpin };
      return { ...state, buyDetail: newBuy };
    },

    toggleDrugSpin(state) {
      const { drug } = state;
      const newDrug = { ...drug, isSpin: !drug.isSpin };
      return { ...state, drug: newDrug };
    },
  },
};
