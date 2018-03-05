package com.lenovohit.ebpp.bill.Dict;



public class Dict {
	
	//---------  对账记录类型 begin  ----------
	/** 对账待分类 */
	public static final String SYNC_TYPE_INIT = "0";  			//最终变成下面6种类型
	/** 账单表没有日终表有 */
	public static final String SYNC_TYPE_LESS = "1";
	/** 账单表有日终表没有 */
	public static final String SYNC_TYPE_MORE = "2";
	/** 日终新（账单记录的交易时间小于日终记录的交易时间） */
	public static final String SYNC_TYPE_OLD = "3";
	/** 账单记录的交易时间大于日终记录的交易时间 */
	public static final String SYNC_TYPE_NEW = "4";
	/** 账单记录和日终记录交易时间一致，但部分字段不一致 */
	public static final String SYNC_TYPE_DIFF = "5";
	/** 账单记录和日终记录“所有”字段均一致 */
	public static final String SYNC_TYPE_SAME = "6";//除了6,1-5都记录到错误记录表
	//---------  对账记录类型 end  ------------
	
	
	
	//---------  对账完成状态 begin  ----------
	/** 对账待处理 */
	public static final String SYNC_FLAG_PENDING = "0";
	/** 对账按成 */
	public static final String SYNC_FLAG_COMPLETE = "1";
	//---------  对账完成状态 end  ------------
}
