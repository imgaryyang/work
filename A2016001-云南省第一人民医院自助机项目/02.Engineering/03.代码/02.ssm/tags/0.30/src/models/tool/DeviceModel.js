import dva from 'dva';
import moment from 'moment';
import baseUtil from '../../utils/baseUtil';
import cardPrinter from '../../utils/cardPrinterUtil';
import lightUtil from '../../utils/lightUtil';
import { saveOperator } from '../../services/OperatorService';

export default {

	namespace: 'device',

	state: {
		cardCount:0,
	},
	//msg:null,
	subscriptions: {},
	effects: {
		*writeCard({ payload,callback }, { select, call, put }) {
			const cardCount = yield select(state => state.device.cardCount);
			const { cardNo } = payload;
			
			try {
				lightUtil.cardPrinter.blink();
				yield call(baseUtil.sleep,100);
				console.info(cardPrinter);
				yield call(cardPrinter.moveToReader);
			} catch (e) {
				console.info(e);
				baseUtil.error("移动至读卡区失败");
				return;
			}
			
			try {
				yield call(cardPrinter.writeCard,1,4,'5301');
				yield call(cardPrinter.writeCard,1,5,'01');
				yield call(cardPrinter.writeCard,1,6,'101');
				yield call(cardPrinter.writeCard,2,8,cardNo);
				yield call(cardPrinter.writeCard,2,9,'1');
				yield call(cardPrinter.writeCard,2,10,'0');
			} catch (e) {
				console.info(e);
				baseUtil.error("写卡失败");
				return;
			}
			
			try {
				//卡编号:53011210100000000110(5301 12 101 010000001 1 0)
//				yield call(baseUtil.sleep,3000);
				yield call(cardPrinter.moveToOut);
				lightUtil.cardPrinter.turnOff();
			} catch (e) {
				console.info(e);
				baseUtil.error("移动至出口失败");
				return;
			}
			yield put({
	  			type: 'changeState',
	  			payload: {
	  				cardCount : (cardCount+1),
	  			},
	  		});
			if(callback)callback();
		},
		*moveCardToReader({ payload,callback }, { select, call, put }) {//移动至读卡区
			yield baseUtil.notice('测试开始');
			yield call(baseUtil.sleep,500);
			try{
				yield call(cardPrinter.moveToReader);
				yield baseUtil.notice('移动至读卡区成功');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至读卡区异常');
			} 
				
	    },
	    *moveCardToOut({ payload,callback }, { select, call, put }) {//移动至出口
	    	yield baseUtil.notice('测试开始');
	    	yield call(baseUtil.sleep,500);
			try{
				yield call(cardPrinter.moveToOut);
				yield baseUtil.notice('移动至出口');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至出口异常');
			} 
	    },
		*readAndOut({ payload,callback }, { select, call, put }) {//读卡吐卡
	    	yield baseUtil.notice('测试开始');
	    	yield call(baseUtil.sleep,500);
	    	try{
	    		const state  = yield call(cardPrinter.checkPrinterStatus);
	    		if(state == 0){
	    			yield baseUtil.notice('当前状态'+state);
	    			yield call(baseUtil.sleep,500);
		    	}else{
		    		baseUtil.warning('当前状态'+state);
		    		return;
		    	}
			}catch(e){
				baseUtil.warning('读取卡状态出错');
				return;
			} 
	    	try{
	    		yield call(cardPrinter.moveToReader);
	    		yield baseUtil.notice('移动至非接读卡区成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至非接读卡区异常');
				return;
			} 
			try{
	    		var medicalCardNo  = yield call(cardPrinter.readCardNo);
	    		yield baseUtil.notice('读取卡号成功：'+medicalCardNo);
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('读取卡号异常');
				return;
			}
			try{
				yield call(cardPrinter.moveToOut);
	    		yield baseUtil.notice('移动至出口：成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至出口异常');
				return;
			}
		},
		*moveToBasket({ payload,callback }, { select, call, put }) {//排卡
			yield baseUtil.notice('测试开始');
			yield call(baseUtil.sleep,500);
			try{
				yield call(cardPrinter.moveToBasket);
				yield baseUtil.notice('排卡完毕');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('排卡异常');
			}
		},
		*reStart({ payload,callback }, { select, call, put }) {//重启
			yield baseUtil.notice('测试开始');
			yield call(baseUtil.sleep,500);
			try{
				yield call(cardPrinter.reset);
				 yield baseUtil.notice('重启完毕');
				 yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('重启打印机异常');
			} 
		},
		*cleanPrinter({ payload,callback }, { select, call, put }) {//重启
			yield baseUtil.notice('清洁开始');
			yield call(baseUtil.sleep,500);
			try{
				yield call(cardPrinter.clean);
				 yield baseUtil.notice('清洁完毕');
				 yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('清洁打印机异常');
			} 
		},
		*makeOperator({ payload,callback }, { select, call, put }) {//打印测试
			yield baseUtil.notice('开始制作');
			yield call(baseUtil.sleep,500);			
			var { index } = payload ||{};
			//index = index || 0;
	    	try{
	    		const state  = yield call(cardPrinter.checkPrinterStatus);
	    		if(state == 0){
	    			yield baseUtil.notice('当前状态'+state);
	    			yield call(baseUtil.sleep,500);
		    	}else{
		    		baseUtil.warning('当前状态'+state);
		    		return;
		    	}
			}catch(e){
				baseUtil.warning('读取状态出错');
				return;
			} 
	    	try{
	    		yield call(cardPrinter.moveToReader);
	    		yield baseUtil.notice('移动至非接读卡区成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至非接读卡区异常');
				return;
			} 
			try{
	    		var medicalCardNo  = yield call(cardPrinter.readCardNo);
	    		yield baseUtil.notice('读取卡号成功：'+medicalCardNo);
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('读取卡号异常');
				return;
			}
			var users = [
//				'张兆彪',
//				'晏邵荣',
//				'毕仙俊',
//				'孙正楷',
//				'何杨标',
//				'陈建伟',
//				'徐金  ',
//				'朱红云',
//				'邹爱  ',
//				'郝洪波',
//				'赵田田',
//				'严圆  ',
//				'曹力丹',
//				'王婷  ',
//				'余丽芳',
//				
//				'刘玉娇',
//				'谭崇晨',
//				'汪红梅',
//				'李欣妍',
				
//				'刘瑞云',
//				'宁冬梅',
//				'章炳雪',
//				'普留飞',
//				'段发奉',
//				'徐星宇',
//				'徐琛',
//				'夏纬一',
//				'樊扬',
//				'宋林伟',
//				'熊盛军',
//				'艾俊贤',
//				'陈木华'
			];
			var name = users[index];
			var cardNo = medicalCardNo.substr(9,9);
			var operator ={
					medicalCardNo,
					no:cardNo,
					name:name,
					mobile:'',
					orgName:'联想智慧医疗'
			};
			try{
	    		yield call(saveOperator,operator);
	    		yield baseUtil.notice('创建卡成功运维人员成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('创建卡成功运维人员异常');
				return;
			}
			
			try{
				yield call(cardPrinter.setStandbyParameter);
				yield baseUtil.notice('设置基本参数成功');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('设置基本参数异常');
				return;
			}
			try{//
				var ret = yield call(cardPrinter.printOperatorCard,name,cardNo);
				yield baseUtil.notice('发送打印指令成功，沉睡3.5s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠1s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠2s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠3s');
				yield call(baseUtil.sleep,3000);
				yield baseUtil.notice('睡眠完毕');
			}catch(e){
				console.info(e);
				baseUtil.warning('发送打印指令异常');
				return;
			}
			if(index == users.length-1)return;
			var ret = yield put({
				type:'makeOperator',
				payload:{index:(index+1)}
			});
		},
		*printCard({ payload,callback }, { select, call, put }) {//打印测试
			yield baseUtil.notice('测试开始');
			yield call(baseUtil.sleep,500);
	    	try{
	    		const state  = yield call(cardPrinter.checkPrinterStatus);
	    		if(state == 0){
	    			yield baseUtil.notice('当前状态'+state);
	    			yield call(baseUtil.sleep,500);
		    	}else{
		    		baseUtil.warning('当前状态'+state);
		    		return;
		    	}
			}catch(e){
				baseUtil.warning('读取状态出错');
				return;
			} 
	    	try{
	    		yield call(cardPrinter.moveToReader);
	    		yield baseUtil.notice('移动至非接读卡区成功');
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('移动至非接读卡区异常');
				return;
			} 
			try{
	    		var medicalCardNo  = yield call(cardPrinter.readCardNo);
	    		yield baseUtil.notice('读取卡号成功：'+medicalCardNo);
	    		yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('读取卡号异常');
				return;
			}
			try{
				yield call(cardPrinter.setStandbyParameter);
				yield baseUtil.notice('设置基本参数成功');
				yield call(baseUtil.sleep,500);
			}catch(e){
				baseUtil.warning('设置基本参数异常');
				return;
			}
			try{//
				var ret = yield call(cardPrinter.testPrintCard,'姓名','1234567890');
				yield baseUtil.notice('发送打印指令成功，沉睡3.5s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠1s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠2s');
				yield call(baseUtil.sleep,1000);
				yield baseUtil.notice('睡眠3s');
				yield call(baseUtil.sleep,500);
				yield baseUtil.notice('睡眠完毕');
			}catch(e){
				baseUtil.warning('发送打印指令异常');
				return;
			}
		},
	},
	reducers: {
		"clear"(state,{ payload}) {
			return {
			};
		},
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};

//readCardNo:ReadCardNo,
//init:init,
//checkPrinterStatus:CheckPrinterStatus,//检查打印机状态
//moveToReader:moveToReader,//移动卡片至非接位置
//reset:reset,//发送指定命令：重启打印机
//clean:clean,//发送指定命令：清洁打印机
//writeCard:WriteCard,//
//readCard:ReadCard,//读卡
//moveToFlip:moveToFlip,//移动卡片到翻转模块
//moveToPrint:moveToPrint,	//从翻转模块移动卡片到打印位置
//printCard:PrintCard,//打印就诊卡
//moveToEntrance:moveToEntrance,//移动卡片至待取卡位置
//moveToOut:moveToOut,
//moveToBasket,
//setStandbyParameter:SetStandbyParameter, //设置停滞位置和时间
