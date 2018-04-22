
export const order = {
  type: {
    BP: '补录',
    OP: '支付',
    OR: '订单退款',
    OC: '撤销',
  },
  bizType: {
    '00': '门诊预存',
    '01': '预约',
    '02': '挂号',
    '03': '缴费（诊间结算）',
    '04': '住院预缴',
    '05': '办理就诊卡',
    '06': '办理就诊卡建档收费',
  },
  status: {
    A: '初始化', // ORDER_STAT_INITIAL = "A";
    0: '交易成功', // ORDER_STAT_TRAN_SUCCESS = "0";
    1: '支付成功', // ORDER_STAT_PAY_SUCCESS = "1";
    2: '支付失败', // ORDER_STAT_PAY_FAILURE = "2";
    3: '交易失败', // ORDER_STAT_TRAN_FAILURE = "3";
    4: '交易完成', // ORDER_STAT_TRAN_FINISH = "4";
    5: '退款中', // ORDER_STAT_REFUNDING = "5";
    6: '退款失败', // ORDER_STAT_REFUND_FAILURE = "6";
    7: '退款成功', // ORDER_STAT_REFUND_SUCCESS = "7";
    8: '被撤销的', // ORDER_STAT_REFUND_CANCELED = "8";
    9: '关闭', // ORDER_STAT_CLOSED = "9";
    C: '撤销', // ORDER_STAT_CANCEL = "C";
    E: '异常', // ORDER_STAT_EXCEPTIONAL = "E";
  },
};

export const settlement = {
  type: {
    SP: '支付',
    SR: '退款',
    SC: '撤销',
  },
  status: {
    A: '初始化',
    0: '支付成功',
    1: '支付失败',
    2: '支付完成 ',
    5: '正在退款',
    6: '退款失败',
    7: '退款成功',
    8: '退款撤销',
    9: '关闭', // 超时关闭  手工关闭  废单
    C: '撤销',
    E: '异常',
  },
  tradeStatus: {
    A: '交易成功',
    0: '交易成功',
    1: '交易失败',
    9: '交易关闭',
    E: '交易异常',
  },
};

export const prestore = {
  ycfs: {
    1: '现金',
    2: '银行卡',
    3: '支票',
    5: '医院授权',
    6: '转住院预缴',
    8: '住院床旁结算转门诊',
    9: '住院转门诊消费',
    B: '信用卡',
    H: '汇票支票',
    W: '微信',
    Y: '滇医通',
    Z: '支付宝',
  },
  ztbz : {
	  1: '预存',
	  2: '已退',
	  9: '退费',
  },
  ly : {
	  1: '收费窗口',
	  W: '微信',
	  Z: '支付宝',
	  '0306': '广发',
	  '0308': '招行',
  },
};
