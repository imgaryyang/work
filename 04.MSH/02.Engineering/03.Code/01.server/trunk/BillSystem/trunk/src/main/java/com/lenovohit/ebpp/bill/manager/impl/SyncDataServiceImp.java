package com.lenovohit.ebpp.bill.manager.impl;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.MathUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ebpp.bill.Dict.Dict;
import com.lenovohit.ebpp.bill.manager.BillInstanceManager;
import com.lenovohit.ebpp.bill.model.BillInstanceEnd;
import com.lenovohit.ebpp.bill.model.BillType;
import com.lenovohit.ebpp.bill.model.BizChannel;
import com.lenovohit.ebpp.bill.model.EndDayComSta;
import com.lenovohit.ebpp.bill.model.EndDayLog;
import com.lenovohit.ebpp.bill.model.EndDaySchPlan;
import com.lenovohit.ebpp.bill.model.PayInfo;
import com.lenovohit.ebpp.bill.model.PayInfoEnd;

public class SyncDataServiceImp  {
	
	private transient final Log log = LogFactory.getLog(getClass());
	
	@Autowired
	private BillInstanceManager billInstanceManager;//账单表
	@Autowired
	private GenericManager<BillInstanceEnd, String> billInstanceEndManager;//账单日终表
	@Autowired
	private GenericManager<PayInfo, String> payInfoManager;//支付表
	@Autowired
	private GenericManager<PayInfoEnd, String> payInfoEndManager;//支付日终表
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;//渠道表
	@Autowired
	private GenericManager<BillType, String> billTypeManager;//账单类型表
	
	@Autowired
	private GenericManager<EndDaySchPlan, String> endDaySchPlanManager;//日终定时器计划表
	@Autowired
	private GenericManager<EndDayComSta, String> endDayComStaManager;//日终对账状态表
	@Autowired
	private GenericManager<EndDayLog, String> endDayLogManager;//日终日志表
	
	@Value("${syncData.path}")
	private String dataFilePath;

	/** 账单日终文件名前缀 */
	private static final String billPrefix = "BILL-INS-";
	/** 付款日终文件名前缀 */
	private static final String payPrefix = "PAY-INFO-";
	/** 日终文件名后缀 */
	private static final String suffix = ".txt";
	/** 日终单词查询数量 */
	private static final int END_QUERY_NUM = 1000;
	
	/** 对账时间 */
	private String syncDate = "";
	/** 对账时间(不带杠) */
	private String syncDate2 = "";
	/** 对账类型 */
	private String syncType = "";
	
	/** 账单日终首行条数 */
	private long billEndHeadNum = 0;
	/** 账单日终解析总数 */
	private long billEndParsedNum = 0;
	/** 账单日终有效条数 */
	private long billEndValidNum = 0;
	/** 账单日终无效条数 */
	private long billEndInvalidNum = 0;
	
	/** 账单缺少条数 */
	private long billLessNum = 0;
	/** 账单多出条数 */
	private long billMoreNum = 0;
	/** 账单老数据条数 */
	private long billOldNum = 0;
	/** 账单新数据条数 */
	private long billNewNum = 0;
	/** 账单不一致条数 */
	private long billDiffNum = 0;
	/** 账单一致条数 */
	private long billSameNum = 0;
	
	/** 账单同步异常标识 */
	private String billSyncFlag = "0";
	/** 账单同步异常信息 */
	private String billSyncInfo;
	
	
	
	
	/** 支付日终首行条数 */
	private long payEndHeadNum = 0;
	/** 支付日终解析总数 */
	private long payEndParsedNum = 0;
	/** 支付日终有效条数 */
	private long payEndValidNum = 0;
	/** 支付日终无效条数 */
	private long payEndInvalidNum = 0;
	
	/** 支付缺少条数 */
	private long payLessNum = 0;
	/** 支付多出条数 */
	private long payMoreNum = 0;
	/** 支付老数据条数 */
	private long payOldNum = 0;
	/** 支付新数据条数 */
	private long payNewNum = 0;
	/** 支付不一致条数 */
	private long payDiffNum = 0;
	/** 支付一致条数 */
	private long paySameNum = 0;
	
	
	/** 支付同步异常标识 */
	private String paySyncFlag = "0";
	/** 支付同步异常信息 */
	private String paySyncInfo;
	
	
	
	/** 日终表移到历史表标识 */
	private String endTableMovFlag = "0";
	/** 日终表移到历史表错误信息 */
	private String endTableMovInfo;
	/** 日终文件移到历史表标识 */
	private String endFilesMovFlag = "0";
	/** 日终文件移到历史表信息 */
	private String endFilesMovInfo;
	/** 日志信息 */
	private StringBuilder logInfo = new StringBuilder();
	
	private void logInfoAppend(String s){
		String curr = DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss");
		logInfo.append(curr+" "+s+"\r\n");
	}
	private void log_info(String s){
		log.info(s);logInfoAppend(s);
	}
	private void log_error(String s){
		log.error(s);logInfoAppend(s);
	}
	private void log_warn(String s){
		log.error(s);logInfoAppend(s);
	}
	
	private Map<String, BizChannel> bizChannelMap;
	private Map<String, BillType> billTypeMap;
	
	
	/** 日终对账入口 */
	public void daliyCompare() {
		//1、检查计划时间
		if(!checkPlan())
			return;
		
		//2、插入日终日志表
		log_info("step2、插入日终日志表 begin");
		Date begin = new Date();
		String beginTime = DateUtils.date2String(begin, "yyyy-MM-dd HH:mm:ss");
		String flag = EndDayLog.FLAG_FAILED;
		EndDayLog endDayLog = new EndDayLog();
		endDayLog.setBeginTime(beginTime);
		endDayLog.setFlag(flag);
		endDayLog = endDayLogManager.save(endDayLog);
		log_info("step2、插入日终日志表 end");
		
		boolean failed = false;
		String failedCause = "";
		String failedDetailInfo = "";
		initDict();
		initFields();
		
		//3、获得对账时间和对账类型
		try {
			initSyncDate();
			endDayLog.setSyncDate(syncDate);
			endDayLog.setSyncType(syncType);
			endDayLogManager.save(endDayLog);
		} catch (Exception e) {
			failed = true;
			failedCause = "获得对账时间和对账类型出错";
			failedDetailInfo = BaseException.getStackTraceAsString(e);
			e.printStackTrace();
			log.info(failedCause + ":" + failedDetailInfo);
		}
		
		//4、检查日终文件
		if(!failed) {
			Object[] arr = checkEndDayFiles();
			boolean errFlag = (Boolean)arr[0];
			if(errFlag){
				failed = true;
				failedCause = (String)arr[1];
				failedDetailInfo = (String)arr[2];
			}
		}
		
		//5、处理特殊情况下的遗留数据
		if(!failed) {
			try {
				moveEndDayDb("init");
			} catch (Exception e) {
				failed = true;
				failedCause = "处理特殊情况下的遗留数据出错";
				failedDetailInfo = BaseException.getStackTraceAsString(e);
				e.printStackTrace();
				log_info(failedCause + ":" + failedDetailInfo);
			}
		}
		
		if(failed) {
			endDayLog.setFlag(EndDayLog.FLAG_FAILED);
			endDayLog.setFailedCause(failedCause);
			endDayLog.setFailedDetailInfo(failedDetailInfo);
			endDayLog.setLogInfo(logInfo.toString());
			endDayLogManager.save(endDayLog);
			return;
		}
		
		
		log_info("-----开始日终对账-----");
		//只要存在日终文件就算对账成功，如果下面出错会记录
		//flag为2，这样即使出错下次也能正常执行下一天的日终
		flag = EndDayLog.FLAG_SUCCESS;
		
		//6、同步账单日终
		try {
			saveBillsFile();
			compareBills();
			billSyncFlag = "1";
		} catch (Exception e) {
			String errInfo = BaseException.getStackTraceAsString(e);
			billSyncFlag = "0";
			billSyncInfo = errInfo;
			log.info("同步账单日终出现异常："+errInfo);
			e.printStackTrace();
		} finally {
			log_info("账单表 缺少"+billLessNum+"条；多出"+billMoreNum+"条；老数据"+billOldNum+"条；新数据"+billNewNum+"条；不一致"+billDiffNum+"条；一致"+billSameNum+"条 ");
		}
		
		//7、同步支付日终
		try {
			savePaysFile();
			comparePays();
			paySyncFlag = "1";
		} catch (Exception e) {
			String errInfo = BaseException.getStackTraceAsString(e);
			paySyncFlag = "0";
			paySyncInfo = errInfo;
			log.info("同步支付日终出现异常："+errInfo);
			e.printStackTrace();
		} finally {
			log_info("支付表 缺少"+payLessNum+"条；多出"+payMoreNum+"条；老数据"+payOldNum+"条；新数据"+payNewNum+"条；不一致"+payDiffNum+"条；一致"+paySameNum+"条 ");
		}
		
		//8、移动日终表到日终历史表
		try {
			moveEndDayDb("");
			endTableMovFlag = "1";
		} catch (Exception e) {
			endTableMovFlag = "0";
			endTableMovInfo = BaseException.getStackTraceAsString(e);
			log.info("移动日终表到日终历史表出现异常："+endTableMovInfo);
			e.printStackTrace();
		}
		
		//9、移动日终文件到历史目录
		try {
			moveEndDayFiles();
			endFilesMovFlag = "1";
		} catch (Exception e) {
			endFilesMovFlag = "0";
			endFilesMovInfo = BaseException.getStackTraceAsString(e);
			log.info("移动日终文件到历史目录出现异常："+endFilesMovInfo);
			e.printStackTrace();
		}
		
		Date end = new Date();
		String endTime = DateUtils.date2String(end, "yyyy-MM-dd HH:mm:ss");
		long l = end.getTime()-begin.getTime();
		
		Object[] arr = checkWarn();
		String warnInfo = "";
		if((Boolean)arr[0]) {
			flag = EndDayLog.FLAG_SUCCESS_WARN;
			warnInfo = (String)arr[1];
		}
		
		endDayLog.setBillEndHeadNum(billEndHeadNum);
		endDayLog.setBillEndParsedNum(billEndParsedNum);
		endDayLog.setBillEndValidNum(billEndValidNum);
		endDayLog.setBillEndInvalidNum(billEndInvalidNum);
		
		endDayLog.setBillLessNum(billLessNum);
		endDayLog.setBillMoreNum(billMoreNum);
		endDayLog.setBillOldNum(billOldNum);
		endDayLog.setBillNewNum(billNewNum);
		endDayLog.setBillDiffNum(billDiffNum);
		endDayLog.setBillSameNum(billSameNum);
		
		endDayLog.setBillSyncFlag(billSyncFlag);
		endDayLog.setBillSyncInfo(billSyncInfo);
		
		
		endDayLog.setPayEndHeadNum(payEndHeadNum);
		endDayLog.setPayEndParsedNum(payEndParsedNum);
		endDayLog.setPayEndValidNum(payEndValidNum);
		endDayLog.setPayEndInvalidNum(payEndInvalidNum);
		
		endDayLog.setPayLessNum(payLessNum);
		endDayLog.setPayMoreNum(payMoreNum);
		endDayLog.setPayOldNum(payOldNum);
		endDayLog.setPayNewNum(payNewNum);
		endDayLog.setPayDiffNum(payDiffNum);
		endDayLog.setPaySameNum(paySameNum);
		
		endDayLog.setPaySyncFlag(paySyncFlag);
		endDayLog.setPaySyncInfo(paySyncInfo);
		
		
		endDayLog.setEndTableMovFlag(endTableMovFlag);
		endDayLog.setEndTableMovInfo(endTableMovInfo);
		endDayLog.setEndFilesMovFlag(endFilesMovFlag);
		endDayLog.setEndFilesMovInfo(endFilesMovInfo);
		
		endDayLog.setEndTime(endTime);
		endDayLog.setCostTime(l);
		endDayLog.setFlag(flag);
		endDayLog.setWarnInfo(warnInfo);
		logInfoAppend("对账结果："+EndDayLog.FLAG_MAP.get(flag));
		logInfoAppend("警告信息："+warnInfo);
		logInfoAppend("-----日终对账结束-----");
		endDayLog.setLogInfo(logInfo.toString());
		endDayLogManager.save(endDayLog);
		
		String jql = " from EndDayComSta ";
		EndDayComSta state = endDayComStaManager.findOne(jql);
		state.setFlag(flag);
		endDayComStaManager.save(state);
		
		log.info("对账结果："+EndDayLog.FLAG_MAP.get(flag));
		log.info("警告信息："+warnInfo);
		log.info("-----日终对账结束-----");
	}
	
	/** 1 检查计划时间 */
	private boolean checkPlan() {
		log.info("step1、检查计划时间 begin");
		boolean flag = false;
		List<EndDaySchPlan> list = endDaySchPlanManager.findByProp("delFlag", "0");
		String curr = DateUtils.date2String(new Date(), "HHmm");
		
		StringBuilder sb = new StringBuilder();
		if(list!= null && list.size()>0) {
			for(EndDaySchPlan endDaySchPlan: list) {
				sb.append(endDaySchPlan.getPlanTime()).append(",");
				if(curr.equals(endDaySchPlan.getPlanTime())){
					flag = true;
//					break;
				}
			}
		}
		log.info("执行计划为 ["+sb.toString()+"]. 当前时间为"+curr);
		log.info("step1、检查计划时间 end");
		return flag;
	}
	
	/** 3 获取对账日期 */
	private void initSyncDate() {
		log_info("step3、获取对账日期 begin");
		String jql = " from EndDayComSta ";
		EndDayComSta state = endDayComStaManager.findOne(jql);
		if(state==null) {
			state = new EndDayComSta();
			state.setCompareDate(DateUtils.date2String(new Date(), "yyyy-MM-dd"));
			state.setFlag("0");
			state = endDayComStaManager.save(state);
		}
		// 判断上次对账是否成功执行
		if ( EndDayLog.FLAG_SUCCESS.equals(state.getFlag())  ||  EndDayLog.FLAG_SUCCESS_WARN.equals(state.getFlag()) ) {
			syncDate = DateUtils.date2String(
					DateUtils.addDays(
							DateUtils.string2Date(state.getCompareDate(), "yyyy-MM-dd"), 1),
							"yyyy-MM-dd");
			syncDate2 = syncDate.replaceAll("-", "");
			syncType = EndDayLog.SYNC_TYPE_NORMAL;
			
			state.setCompareDate(syncDate);
			state.setFlag(EndDayLog.FLAG_FAILED);
			endDayComStaManager.save(state);
			
		} else {
			syncDate = state.getCompareDate();
			syncDate2 = syncDate.replaceAll("-", "");
			syncType = EndDayLog.SYNC_TYPE_AGAIN;
		}
		log_info("对账日期为"+syncDate+" 对账类型为"+EndDayLog.SYNC_TYPE_MAP.get(syncType));
		log_info("step3、获取对账日期 end");
	}
	
	/** 4 检查日终文件 */
	private Object[] checkEndDayFiles() {
		log_info("step4、检查日终文件 begin");
		
		Object[] arr = new Object[3];
		boolean errflag = false;
		String str = "";
		String str2 = "";
		
		InputStream in = null;
		BufferedReader reader = null;
		String fileName = dataFilePath + billPrefix + syncDate.replaceAll("-", "")+suffix;
		try {
			in = new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(in, "utf8"));
			reader.readLine();
		} catch (FileNotFoundException e) {
			errflag = true;
			str = "日终文件"+fileName+"不存在";
			log_error(str);
//			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			errflag = true;
			str = "不支持日终文件"+fileName+"的编码格式";
			log_error(str);
			e.printStackTrace();
		} catch (IOException e) {
			errflag = true;
			str = "日终文件"+fileName+"io错误";
			str2 = BaseException.getStackTraceAsString(e);
			log_error(str+":" + str2);
			e.printStackTrace();
		} finally {
			closeStream(in);
			closeStream(reader);
		}
		
		if(!errflag) {
			fileName = dataFilePath + payPrefix + syncDate.replaceAll("-", "")+suffix;
			try {
				in = new FileInputStream(fileName);
				reader = new BufferedReader(new InputStreamReader(in, "utf8"));
				reader.readLine();
			} catch (FileNotFoundException e) {
				errflag = true;
				str = "日终文件"+fileName+"不存在";
				log_error(str);
//				e.printStackTrace();
			} catch (UnsupportedEncodingException e) {
				errflag = true;
				str = "不支持日终文件"+fileName+"的编码格式";
				log_error(str);
				e.printStackTrace();
			} catch (IOException e) {
				errflag = true;
				str = "日终文件"+fileName+"io错误";
				str2 = BaseException.getStackTraceAsString(e);
				log_error(str+":" + str2);
				e.printStackTrace();
			} finally {
				closeStream(in);
				closeStream(reader);
			}
		}
		
		log_info("step4、检查日终文件 end");
		
		arr[0] = errflag;
		arr[1] = str;
		arr[2] = str2;
		return arr;
	}
	
	/** 
	 * 6_1 保存账单日终文件到数据库 
	 */
	private void saveBillsFile() {
		log_info("step6_1、保存账单日终文件到数据库 begin");
		InputStream in = null;
		String line = null;
		String prefix = "INSERT INTO IH_EBPP_END_BILLINS (ID, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_ON, INSERT_TIME, VALID_FLAG, INVALID_TYPE, INVALID_INFO, SYNC_DATE, SYNC_TYPE, SYNC_FLAG) VALUES ";
		BufferedReader reader = null;
		long descTotal = 0;//日终首行定义的数量
		long parsedTotal = 0;//解析出的数量
		// 1、读取文件
		String fileName = dataFilePath + billPrefix + syncDate.replaceAll("-", "")+suffix;
		try {
			in = new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(in, "utf8"));
			// 读取第一行概况信息
			line = reader.readLine();
			String[] temps = line.split("\\|",-1);
			descTotal = Long.parseLong(temps[1]);
			int i = 0;
			StringBuilder sb = new StringBuilder();
			while ((line = reader.readLine()) != null) {
				i++;
				// 2、解析数据
				try {
					parseStrToBillEnd(line, sb, i);
					if(i%1000==0) {
						String sql = prefix + sb.deleteCharAt(sb.length()-1).toString();
						// 3、保存数据
						billInstanceEndManager.executeSql(sql);
						sb.delete(0, sb.length());
					}
					parsedTotal++;
				} catch (Exception e) {
					log.error("循环保存账单日终记录时出现异常:" + BaseException.getStackTraceAsString(e));
					e.printStackTrace();
				}
			}
			if (sb.length() > 0) {
				String sql = prefix + sb.deleteCharAt(sb.length()-1).toString();
				billInstanceEndManager.executeSql(sql);
			}
			billEndHeadNum = descTotal;
			billEndParsedNum = parsedTotal;
			if (descTotal != parsedTotal) {
				log_warn("解析账单信息条数与内容首行总数不符，解析条数为" + parsedTotal+"首行条数为"+descTotal);
			}
			
		} catch (FileNotFoundException e) {
			//不会走到这！
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			//不会走到这！
			e.printStackTrace();
		} catch (IOException e) {
			//不会走到这！
			e.printStackTrace();
		} finally {
			closeStream(in);
			closeStream(reader);
			log_info("保存账单日终条数"+billEndParsedNum+"条，有效条数"+billEndValidNum+"条，无效条数"+billEndInvalidNum+"条");
			log_info("step6_1、保存账单日终文件到数据库 end");
		}
	}
	
	
	
	/** 
	 * 6_2 账单日终对账<br/>
	 * 判断点<br/>
	 * ①判断是否缺数据通过查找业务单号<br/>
	 * ②判断是否是老数据通过比较交易时间<br/>
	 * ③判断是否是异常数据通过比较交易时间相等情况下比较账单状态,金额<br/>
	 */
	@SuppressWarnings("unchecked")
	private void compareBills() {
		log_info("step6_2、比较账单表 begin");
		
		//一、对数据进行分类
		String sql0 = " update ih_ebpp_billinstance set sync_type='"+Dict.SYNC_TYPE_INIT+"', sync_flag='"+Dict.SYNC_FLAG_PENDING+"' where trans_date=? ";
		String sql1 = " update ih_ebpp_end_billins a set a.sync_type='"+Dict.SYNC_TYPE_LESS+"' where not exists (select 1 from ih_ebpp_billinstance b where a.oribizno=b.oribizno) and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql2 = " update ih_ebpp_billinstance a set a.sync_type='"+Dict.SYNC_TYPE_MORE+"' where a.trans_date=? and not exists (select 1 from ih_ebpp_end_billins b where a.oribizno=b.oribizno and b.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"'  )  ";
		String sql3 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b set a.sync_type='"+Dict.SYNC_TYPE_OLD+"', b.sync_type='"+Dict.SYNC_TYPE_OLD+"'   where a.oribizno=b.oribizno and a.trans_on>b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql4 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b set a.sync_type='"+Dict.SYNC_TYPE_NEW+"', b.sync_type='"+Dict.SYNC_TYPE_NEW+"'   where a.oribizno=b.oribizno and a.trans_on<b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql5 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b set a.sync_type='"+Dict.SYNC_TYPE_DIFF+"', b.sync_type='"+Dict.SYNC_TYPE_DIFF+"' where a.oribizno=b.oribizno and a.trans_on=b.trans_on and (a.status<>b.status || a.amt<>b.amt) and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql6 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b set a.sync_type='"+Dict.SYNC_TYPE_SAME+"', b.sync_type='"+Dict.SYNC_TYPE_SAME+"' where a.oribizno=b.oribizno and a.trans_on=b.trans_on and a.status=b.status and a.amt=b.amt and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		
		billInstanceEndManager.executeSql(sql0, syncDate);	log_info("对数据进行分类，sql0当前时间");
		billInstanceEndManager.executeSql(sql1);			log_info("对数据进行分类，sql1当前时间");
		billInstanceEndManager.executeSql(sql2, syncDate);	log_info("对数据进行分类，sql2当前时间");
		billInstanceEndManager.executeSql(sql3);			log_info("对数据进行分类，sql3当前时间");
		billInstanceEndManager.executeSql(sql4);			log_info("对数据进行分类，sql4当前时间");
		billInstanceEndManager.executeSql(sql5);			log_info("对数据进行分类，sql5当前时间");
		billInstanceEndManager.executeSql(sql6);			log_info("对数据进行分类，sql6当前时间");
		
		//二、开始处理四种数据
		//1 处理账单表缺少的数据
		long count = billInstanceEndManager.getCount(" from BillInstanceEnd where syncType=? and validFlag=? order by oriBizNo ", Dict.SYNC_TYPE_LESS, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			billLessNum = count;
			String prefix1 = "insert into ih_ebpp_billinstance (ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, CREATED_DATE, CREATED_ON, UPDATED_ON, SYNC_TYPE, SYNC_FLAG, END_DAY_ID) values ";
			String prefix2 = "insert into ih_ebpp_billinstance_err (ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, END_DAY_ID, SYNC_DATE) values ";
			
			String[] seqArr = billInstanceManager.getSeqNo(BillInstanceManagerImpl.BILL_SEQ_NAME, syncDate2, (int)count, BillInstanceManagerImpl.BILL_SEQ_LENGTH);
			long pageSize = (count+(END_QUERY_NUM-1))/END_QUERY_NUM;
			int k=0;
			
			for(int i=0; i<pageSize; i++) {
				List<BillInstanceEnd> list = (List<BillInstanceEnd>) billInstanceEndManager.findPageList(
						i*END_QUERY_NUM, END_QUERY_NUM, 
						" from BillInstanceEnd where syncType=? and validFlag=? order by oriBizNo ", Dict.SYNC_TYPE_LESS, BillInstanceEnd.VALID_FLAG_TRUE);
				
				StringBuilder sb1 = new StringBuilder();
				StringBuilder sb2 = new StringBuilder();
				StringBuilder endIds = new StringBuilder();
				for(int j=0; j<list.size(); j++) {
					BillInstanceEnd biEnd = list.get(j);
					concateBillSql(sb1, biEnd, seqArr[k]);
					concateBillErrSql(sb2, biEnd, seqArr[k]);
					endIds.append("'").append(biEnd.getId()).append("'").append(C);
					k++;
				}
				String addSql1 = prefix1 + sb1.deleteCharAt(sb1.length()-1).toString();
				billInstanceEndManager.executeSql(addSql1);log_info("处理账单表缺少的数据，第"+i+"次addSql1当前时间");
				String addSql2 = prefix2 + sb2.deleteCharAt(sb2.length()-1).toString();
				billInstanceEndManager.executeSql(addSql2);log_info("处理账单表缺少的数据，第"+i+"次addSql2当前时间");
				String addSql3 = " update ih_ebpp_end_billins set sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' where id in("+endIds.deleteCharAt(endIds.length()-1).toString()+") ";
				billInstanceEndManager.executeSql(addSql3);log_info("处理账单表缺少的数据，第"+i+"次addSql3当前时间");
			}
		}
		
		//2 处理账单表多余数据
		count = billInstanceEndManager.getCount(" from BillInstance where syncType=? and transDate=? ", Dict.SYNC_TYPE_MORE, syncDate);
		if(count!=0) {
			billMoreNum = count;
			String moreSql1 = "insert into ih_ebpp_billinstance_err ("+
						"ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+
						"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, BILL_ID, SYNC_DATE)  "+
					" select "+
						"ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+
						"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_MORE+",'', id, '"+syncDate+"'  "+
					" from ih_ebpp_billinstance where sync_type='"+Dict.SYNC_TYPE_MORE+"' and trans_date='"+syncDate+"' ";
			
			String moreSql2 = " update ih_ebpp_billinstance set sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where sync_type='"+Dict.SYNC_TYPE_MORE+"' and trans_date='"+syncDate+"' ";
			
			billInstanceEndManager.executeSql(moreSql1);log_info("处理账单表多余数据，moreSql1当前时间");
			billInstanceEndManager.executeSql(moreSql2);log_info("处理账单表多余数据，moreSql2当前时间");
		}
		
		//3 处理账单表老数据
		count = billInstanceEndManager.getCount(" from BillInstanceEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_OLD, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			billOldNum = count;
			String oldSql1 = "insert into ih_ebpp_billinstance_err ("+
						"ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+
						"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, BILL_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.OLDORIBIZNO, b._TYPE, b.FLAG, b.STATUS, b.MEMO, b.CCY, b.AMT, b.BIZCH_CODE, "+
						"b.PAYER_CODE, b.PAYER_NAME, b.PAYER_ACCT, b.PAYEE_CODE, b.PAYEE_NAME, b.PAYEE_ACCT, b.TRANS_DATE, b.TRANS_ON, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_OLD+",CONCAT('原交易时间为', b.trans_on, '日终交易时间为', a.trans_on), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" where a.oriBizNo=b.oriBizNo and a.trans_on>b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String oldSql2 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" set b.status=a.status, b.amt=a.amt, b.trans_on=a.trans_on, "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where a.oribizno=b.oribizno and a.trans_on>b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			billInstanceEndManager.executeSql(oldSql1);log_info("处理账单表老数据，oldSql1当前时间");
			billInstanceEndManager.executeSql(oldSql2);log_info("处理账单表老数据，oldSql2当前时间");
		}
		
		//4 处理账单表新数据
		count = billInstanceEndManager.getCount(" from BillInstanceEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_NEW, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			billNewNum = count;
			String newSql1 = "insert into ih_ebpp_billinstance_err ("+
						"ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+
						"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, BILL_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.OLDORIBIZNO, b._TYPE, b.FLAG, b.STATUS, b.MEMO, b.CCY, b.AMT, b.BIZCH_CODE, "+
						"b.PAYER_CODE, b.PAYER_NAME, b.PAYER_ACCT, b.PAYEE_CODE, b.PAYEE_NAME, b.PAYEE_ACCT, b.TRANS_DATE, b.TRANS_ON, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_NEW+",CONCAT('原交易时间为', b.trans_on, '日终交易时间为', a.trans_on), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" where a.oriBizNo=b.oriBizNo and a.trans_on<b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String newSql2 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" set "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where a.oribizno=b.oribizno and a.trans_on<b.trans_on and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			billInstanceEndManager.executeSql(newSql1);log_info("处理账单表新数据，newSql1当前时间");
			billInstanceEndManager.executeSql(newSql2);log_info("处理账单表新数据，newSql2当前时间");
		}
		
		//5 处理账单表不一致数据
		count = billInstanceEndManager.getCount(" from BillInstanceEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_DIFF, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			billDiffNum = count;
			String diffSql1 = "insert into ih_ebpp_billinstance_err ("+
						"ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+
						"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_DATE, TRANS_ON, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, BILL_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.OLDORIBIZNO, b._TYPE, b.FLAG, b.STATUS, b.MEMO, b.CCY, b.AMT, b.BIZCH_CODE, "+
						"b.PAYER_CODE, b.PAYER_NAME, b.PAYER_ACCT, b.PAYEE_CODE, b.PAYEE_NAME, b.PAYEE_ACCT, b.TRANS_DATE, b.TRANS_ON, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_DIFF+",getDiffForBill(b.STATUS, b.AMT, a.STATUS, a.AMT), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_billins a, ih_ebpp_billinstance b where a.oriBizNo=b.oriBizNo and a.sync_type='"+Dict.SYNC_TYPE_DIFF+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String diffSql2 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" set b.status=a.status, b.amt=a.amt,  "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where a.oribizno=b.oribizno and a.sync_type='"+Dict.SYNC_TYPE_DIFF+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			billInstanceEndManager.executeSql(diffSql1);log_info("处理账单表不一致数据，diffSql1当前时间");
			billInstanceEndManager.executeSql(diffSql2);log_info("处理账单表不一致数据，diffSql2当前时间");
		}
		
		//6 处理账单表一致数据
		count = billInstanceEndManager.getCount(" from BillInstanceEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_SAME, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			billSameNum = count;
			String sameSql1 = " update ih_ebpp_end_billins a, ih_ebpp_billinstance b "+
					" set b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where a.oribizno=b.oribizno and a.sync_type='"+Dict.SYNC_TYPE_SAME+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			billInstanceEndManager.executeSql(sameSql1);log_info("处理账单表一致数据，sameSql1当前时间");
		}
		
		
		
		log_info("step6_2、比较账单表 end");
	}
	
	/**
	 * 7_1 保存支付日终文件到数据库
	 * @throws IOException
	 */
	private void savePaysFile() {
		log_info("step7_1、保存支付日终文件到数据库 begin");
		InputStream in = null;
		String line = null;
		String prefix = "INSERT INTO IH_EBPP_END_PAYINFO (ID, NO, ORIBIZNO, SEQUENCENO, AMT, TRAN_CHANEL, TRAN_WAY, TRAN_QUANTITY, TRAN_TIME, STATUS, INSERT_TIME, VALID_FLAG, INVALID_TYPE, INVALID_INFO, SYNC_DATE, SYNC_TYPE, SYNC_FLAG) VALUES ";
		BufferedReader reader = null;
		long descTotal = 0;//日终首行定义的数量
		long parsedTotal = 0;//解析出的数量
		// 1、读取文件
		String fileName = dataFilePath + payPrefix + syncDate.replaceAll("-", "")+suffix;
		try {
			in = new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(in, "utf8"));
			// 读取第一行概况信息
			line = reader.readLine();
			String[] temps = line.split("\\|", -1);
			descTotal = Long.parseLong(temps[1]);
			int i = 0;
			StringBuilder sb = new StringBuilder();
			while ((line = reader.readLine()) != null) {
				i++;
				// 2、解析数据
				try {
					parseStrToPayEnd(line, sb, i);
					if(i%1000==0) {
						String sql = prefix + sb.deleteCharAt(sb.length()-1).toString();
						// 3、保存数据
						payInfoEndManager.executeSql(sql);
						sb.delete(0, sb.length());
					}
					parsedTotal++;
				} catch (Exception e) {
					String s = BaseException.getStackTraceAsString(e);
					log.error("循环保存支付日终记录时出现异常 :" + s);
					e.printStackTrace();
				}
			}
			if (sb.length() > 0) {
				String sql = prefix + sb.deleteCharAt(sb.length()-1).toString();
				payInfoEndManager.executeSql(sql);
			}
			{
				//批量判断是否有对应的账单记录
				String sql = " update ih_ebpp_end_payinfo a set a.VALID_FLAG='"+BillInstanceEnd.VALID_FLAG_FALSE+"' , "+
						" a.invalid_type='"+PayInfoEnd.INVALID_TYPE_NOT_FOUND_BILL+"', "+
						" a.invalid_info=concat('日终支付文件业务单号',a.oriBizNo,'找不到对应账单记录！') where a.VALID_FLAG='"+BillInstanceEnd.VALID_FLAG_TRUE+"'  "+
						" and not exists (select 1 from ih_ebpp_billinstance b where a.oriBizNo=b.oriBizNo) ";
				payInfoEndManager.executeSql(sql);log_info("批量判断是否有对应的账单记录，当前时间");
				long notFoundBillNum = payInfoEndManager.getCount(" from PayInfoEnd where validFlag=? and invalidType=? ", BillInstanceEnd.VALID_FLAG_FALSE, PayInfoEnd.INVALID_TYPE_NOT_FOUND_BILL);
				payEndValidNum = payEndValidNum - notFoundBillNum;
				payEndInvalidNum = payEndInvalidNum + notFoundBillNum;
			}
			
			payEndHeadNum = descTotal;
			payEndParsedNum = parsedTotal;
			if (descTotal != parsedTotal) {
				log_warn("解析支付信息条数与内容首行总数不符，解析条数为" + parsedTotal+"首行条数为"+descTotal);
			}
			
		} catch (FileNotFoundException e) {
			//不会走到这！
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			//不会走到这！
			e.printStackTrace();
		} catch (IOException e) {
			//不会走到这！
			e.printStackTrace();
		} finally {
			closeStream(in);
			closeStream(reader);
			log_info("保存支付日终条数"+payEndParsedNum+"条，有效条数"+payEndValidNum+"条，无效条数"+payEndInvalidNum+"条");
			log_info("step7_1、保存支付日终文件到数据库 end");
		}
	}
	
	/** 
	 * 7_2 支付日终对账<br/>
	 * 判断点<br/>
	 * ①判断是否缺数据通过查找 支付流水+支付方式<br/>
	 * ②判断是否是老数据通过比较支付时间<br/>
	 * ③判断是否是异常数据通过支付时间相等情况下比较金额<br/>
	 */
	@SuppressWarnings("unchecked")
	private void comparePays() {
		log_info("step7_2、比较支付表 begin");
		
		//一、对数据进行分类
		String sql0 = " update ih_ebpp_payinfo set sync_type='"+Dict.SYNC_TYPE_INIT+"', sync_flag='"+Dict.SYNC_FLAG_PENDING+"' where tran_date=? ";
		String sql1 = " update ih_ebpp_end_payinfo a set a.sync_type='"+Dict.SYNC_TYPE_LESS+"' where not exists (select 1 from ih_ebpp_payinfo b where a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql2 = " update ih_ebpp_payinfo a set a.sync_type='"+Dict.SYNC_TYPE_MORE+"' where a.tran_date=? and not exists (select 1 from ih_ebpp_end_payinfo b where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and b.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"'  )  ";
		String sql3 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b set a.sync_type='"+Dict.SYNC_TYPE_OLD+"', b.sync_type='"+Dict.SYNC_TYPE_OLD+"'   where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time>b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql4 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b set a.sync_type='"+Dict.SYNC_TYPE_NEW+"', b.sync_type='"+Dict.SYNC_TYPE_NEW+"'   where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time<b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql5 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b set a.sync_type='"+Dict.SYNC_TYPE_DIFF+"', b.sync_type='"+Dict.SYNC_TYPE_DIFF+"' where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time=b.tran_time and (a.amt<>b.amt) and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		String sql6 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b set a.sync_type='"+Dict.SYNC_TYPE_SAME+"', b.sync_type='"+Dict.SYNC_TYPE_SAME+"' where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time=b.tran_time and a.amt=b.amt and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
		
		billInstanceEndManager.executeSql(sql0, syncDate);	log_info("对数据进行分类，sql0当前时间");
		billInstanceEndManager.executeSql(sql1);			log_info("对数据进行分类，sql1当前时间");
		billInstanceEndManager.executeSql(sql2, syncDate);	log_info("对数据进行分类，sql2当前时间");
		billInstanceEndManager.executeSql(sql3);			log_info("对数据进行分类，sql3当前时间");
		billInstanceEndManager.executeSql(sql4);			log_info("对数据进行分类，sql4当前时间");
		billInstanceEndManager.executeSql(sql5);			log_info("对数据进行分类，sql5当前时间");
		billInstanceEndManager.executeSql(sql6);			log_info("对数据进行分类，sql6当前时间");
		
		//二、开始处理四种数据
		//1 处理支付表缺少的数据
		long count = billInstanceEndManager.getCount(" from PayInfoEnd where syncType=? and validFlag=? order by oriBizNo ", Dict.SYNC_TYPE_LESS, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			payLessNum = count;
			String prefix1 = "insert into ih_ebpp_payinfo ("+
					"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
					"CREATED_DATE, CREATED_ON, UPDATED_ON, SYNC_TYPE, SYNC_FLAG, END_DAY_ID) values ";
			String prefix2 = "insert into ih_ebpp_payinfo_err ("+
					"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
					"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, END_DAY_ID, SYNC_DATE) values ";
			
			long pageSize = (count+(END_QUERY_NUM-1))/END_QUERY_NUM;
			for(int i=0; i<pageSize; i++) {
				List<PayInfoEnd> list = (List<PayInfoEnd>) payInfoEndManager.findPageList(
						i*END_QUERY_NUM, END_QUERY_NUM, 
						" from PayInfoEnd where syncType=? and validFlag=? order by oriBizNo ", Dict.SYNC_TYPE_LESS, BillInstanceEnd.VALID_FLAG_TRUE);
				
				StringBuilder sb1 = new StringBuilder();
				StringBuilder sb2 = new StringBuilder();
				StringBuilder endIds = new StringBuilder();
				for(int j=0; j<list.size(); j++) {
					PayInfoEnd payEnd = list.get(j);
					concatePaySql(sb1, payEnd);
					concatePayErrSql(sb2, payEnd);
					endIds.append("'").append(payEnd.getId()).append("'").append(C);
				}
				String addSql1 = prefix1 + sb1.deleteCharAt(sb1.length()-1).toString();
				payInfoEndManager.executeSql(addSql1);log_info("处理支付表缺少的数据，第"+i+"次addSql1当前时间");
				String addSql2 = prefix2 + sb2.deleteCharAt(sb2.length()-1).toString();
				payInfoEndManager.executeSql(addSql2);log_info("处理支付表缺少的数据，第"+i+"次addSql2当前时间");
				String addSql3 = " update ih_ebpp_end_payinfo set sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' where id in("+endIds.deleteCharAt(endIds.length()-1).toString()+") ";
				payInfoEndManager.executeSql(addSql3);log_info("处理支付表缺少的数据，第"+i+"次addSql3当前时间");
			}
		}
		
		//2 处理支付表多余数据
		count = payInfoEndManager.getCount(" from PayInfo where syncType=? and tranDate=? ", Dict.SYNC_TYPE_MORE, syncDate);
		if(count!=0) {
			payMoreNum = count;
			String moreSql1 = "insert into ih_ebpp_payinfo_err ("+
					"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
					"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, PAY_ID, SYNC_DATE)  "+
					" select "+
						"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_MORE+",'', id, '"+syncDate+"'  "+
					" from ih_ebpp_payinfo where sync_type='"+Dict.SYNC_TYPE_MORE+"' and tran_date='"+syncDate+"' ";
			
			String moreSql2 = " update ih_ebpp_payinfo set sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where sync_type='"+Dict.SYNC_TYPE_MORE+"' and tran_date='"+syncDate+"' ";
			
			payInfoEndManager.executeSql(moreSql1);log_info("处理支付表多余数据，moreSql1当前时间");
			payInfoEndManager.executeSql(moreSql2);log_info("处理支付表多余数据，moreSql2当前时间");
		}
		
		//3 处理支付表老数据
		count = payInfoEndManager.getCount(" from PayInfoEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_OLD, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			payOldNum = count;
			String oldSql1 = "insert into ih_ebpp_payinfo_err ("+
						"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, PAY_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.SEQUENCENO, b.STATUS, b.AMT, b.TRAN_DATE, b.TRAN_TIME, b.TRAN_WAY, b.TRAN_QUANTITY, b.TRAN_CHANEL, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_OLD+",CONCAT('原交易时间为', b.tran_time, '日终交易时间为', a.tran_time), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time>b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String oldSql2 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" set b.amt=a.amt, b.tran_time=a.tran_time, "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time>b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			payInfoEndManager.executeSql(oldSql1);log_info("处理支付表老数据，oldSql1当前时间");
			payInfoEndManager.executeSql(oldSql2);log_info("处理支付表老数据，oldSql2当前时间");
		}
		
		//4 处理支付表新数据
		count = payInfoEndManager.getCount(" from PayInfoEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_NEW, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			payNewNum = count;
			String newSql1 = "insert into ih_ebpp_payinfo_err ("+
						"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, PAY_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.SEQUENCENO, b.STATUS, b.AMT, b.TRAN_DATE, b.TRAN_TIME, b.TRAN_WAY, b.TRAN_QUANTITY, b.TRAN_CHANEL, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_NEW+",CONCAT('原交易时间为', b.tran_time, '日终交易时间为', a.tran_time), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time<b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String newSql2 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" set "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.tran_time<b.tran_time and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			payInfoEndManager.executeSql(newSql1);log_info("处理支付表新数据，newSql1当前时间");
			payInfoEndManager.executeSql(newSql2);log_info("处理支付表新数据，newSql2当前时间");
		}
		
		
		//5 处理支付表不一致数据
		count = payInfoEndManager.getCount(" from PayInfoEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_DIFF, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			payDiffNum = count;
			String diffSql1 = "insert into ih_ebpp_payinfo_err ("+
						"ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_DATE, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, "+
						"CREATED_DATE, CREATED_ON, UPDATED_ON, INSERT_TIME, ERR_TYPE, ERR_INFO, PAY_ID, SYNC_DATE)  "+
					" select "+
						"b.ID, b.NO, b.ORIBIZNO, b.SEQUENCENO, b.STATUS, b.AMT, b.TRAN_DATE, b.TRAN_TIME, b.TRAN_WAY, b.TRAN_QUANTITY, b.TRAN_CHANEL, "+
						"b.CREATED_DATE, b.CREATED_ON, b.UPDATED_ON, sysdate(), "+Dict.SYNC_TYPE_DIFF+",getDiffForPay(b.AMT, a.AMT), b.id, '"+syncDate+"'  "+
					" from ih_ebpp_end_payinfo a, ih_ebpp_payinfo b where (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.sync_type='"+Dict.SYNC_TYPE_DIFF+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			String diffSql2 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" set b.amt=a.amt, "+
					" b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where  (a.sequenceno=b.sequenceno and a.tran_way=b.tran_way) and a.sync_type='"+Dict.SYNC_TYPE_DIFF+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			payInfoEndManager.executeSql(diffSql1);log_info("处理支付表不一致数据，diffSql1当前时间");
			payInfoEndManager.executeSql(diffSql2);log_info("处理支付表不一致数据，diffSql2当前时间");
		}
		
		//6 处理支付表一致数据
		count = payInfoEndManager.getCount(" from PayInfoEnd where syncType=? and validFlag=? ", Dict.SYNC_TYPE_SAME, BillInstanceEnd.VALID_FLAG_TRUE);
		if(count!=0) {
			paySameNum = count;
			String sameSql1 = " update ih_ebpp_end_payinfo a, ih_ebpp_payinfo b "+
					" set b.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"', a.sync_flag='"+Dict.SYNC_FLAG_COMPLETE+"' "+
					" where a.oribizno=b.oribizno and a.sync_type='"+Dict.SYNC_TYPE_SAME+"' and a.valid_flag='"+BillInstanceEnd.VALID_FLAG_TRUE+"' ";
			
			payInfoEndManager.executeSql(sameSql1);log_info("处理支付表一致数据，sameSql1当前时间");
		}
		
		log_info("step7_2、比较支付表 end");
	}
	

	
	/** 8 转移日志表至日志历史表 */
	private void moveEndDayDb(String type) {
		String msg = "step8、转移日志表至日志历史表";
		
		String legacyFlag = "0";
		if("init".equals(type)){
			msg = "step5、转移日志表特殊情况遗留数据至日志历史表";
			legacyFlag = "1";
		}
		log_info(msg + " begin");
		
		String s1 = "ID, NO, ORIBIZNO, OLDORIBIZNO, _TYPE, FLAG, STATUS, MEMO, CCY, AMT, BIZCH_CODE, "+             
				"PAYER_CODE, PAYER_NAME, PAYER_ACCT, PAYEE_CODE, PAYEE_NAME, PAYEE_ACCT, TRANS_ON, INSERT_TIME, VALID_FLAG, INVALID_TYPE, INVALID_INFO, "+
				"SYNC_DATE, SYNC_TYPE, SYNC_FLAG, LEGACY_FLAG ";
		String moveSql1 = "insert into IH_EBPP_END_BILLINS_HIS("+s1+") select "+s1.replace("LEGACY_FLAG", legacyFlag)+" from IH_EBPP_END_BILLINS ";
		String delSql1 = "TRUNCATE table IH_EBPP_END_BILLINS";
		billInstanceEndManager.executeSql(moveSql1);
		billInstanceEndManager.executeSql(delSql1);
		
		
		String s2 = "ID, NO, ORIBIZNO, SEQUENCENO, STATUS, AMT, TRAN_TIME, TRAN_WAY, TRAN_QUANTITY, TRAN_CHANEL, CREATED_ON, UPDATED_ON, INSERT_TIME,"+
				" VALID_FLAG, INVALID_TYPE, INVALID_INFO, SYNC_DATE, SYNC_TYPE, SYNC_FLAG, LEGACY_FLAG ";
		String moveSql2 = "insert into IH_EBPP_END_PAYINFO_HIS("+s2+") select "+s2.replace("LEGACY_FLAG", legacyFlag)+" from IH_EBPP_END_PAYINFO ";
		String delSql2 = "TRUNCATE table IH_EBPP_END_PAYINFO";
		billInstanceEndManager.executeSql(moveSql2);
		billInstanceEndManager.executeSql(delSql2);
		
		log_info(msg + " end");
	}
	
	/** 9 转移对账文件至历史文件夹 */
	private void moveEndDayFiles() {
		log_info("step9、转移对账文件至历史文件夹 begin");
		String fileDirs = syncDate.replaceAll("-", "/");
		//转移目标路径
		String filePath = dataFilePath.replace("tmp", "histmp");
		File path = new File(filePath+fileDirs);
		String biFileName = billPrefix + syncDate.replaceAll("-", "")+suffix;
		File fromBillFile = new File(dataFilePath + biFileName);
		String payFileName = payPrefix + syncDate.replaceAll("-", "")+suffix;
		File fromPFile = new File(dataFilePath + payFileName);
		if(!path.exists())
			path.mkdirs();
		File billFile = new File(path+File.separator+biFileName);
		File payFile = new File(path+File.separator+payFileName);
		fromBillFile.renameTo(billFile);
		fromPFile.renameTo(payFile);
		log_info("step9、转移对账文件至历史文件夹 end");
	}
	
	/** 检查警告 */
	private Object[] checkWarn() {
		Object[] arr = new Object[2];
		StringBuilder sb = new StringBuilder();
		String warnInfo = "";
			
		boolean warn = false;
		if(billEndHeadNum!=billEndParsedNum){warn = true; sb.append("账单日终首行条数"+billEndHeadNum+"不等于账单日终解析条数"+billEndParsedNum+"；");}
		if(billEndInvalidNum>0){warn = true; sb.append("账单日终无效条数"+billEndInvalidNum+"大于0"+"；");}
		if("0".equals(billSyncFlag)){warn = true; sb.append("账单同步发生异常；");}

		if(payEndHeadNum!=payEndParsedNum){warn = true; sb.append("支付日终首行条数"+payEndHeadNum+"不等于支付日终解析条数"+payEndParsedNum+"；");}
		if(payEndInvalidNum>0){warn = true; sb.append("支付日终无效条数"+payEndInvalidNum+"大于0"+"；");}
		if("0".equals(paySyncFlag)){warn = true; sb.append("支付同步发生异常；");}
		
		if("0".equals(endTableMovFlag)){warn = true; sb.append("日终表移到历史表失败；");}
		if("0".equals(endFilesMovFlag)){warn = true; sb.append("日终文件移到历史表失败；");}
		warnInfo = sb.toString();
		
		arr[0] = warn;
		arr[1] = warnInfo;
		return arr;
	}
	
	private static String C = ",";
	
	private void parseStrToBillEnd(String bi, StringBuilder sb, int i) {
		BillInstanceEnd bin = new BillInstanceEnd();
		String[] bis = bi.split("\\|", -1);
		
		{
			bin.setOriBizNo(bis[0]);
			bin.setOldOriBizNo(bis[1]);
			bin.setType(bis[2]);
			bin.setFlag(bis[3]);
			bin.setStatus(bis[4]);
			bin.setMemo(bis[5]);
			bin.setCcy(bis[6]);
			bin.setAmt(Float.parseFloat(bis[7]));
			bin.setBizChannel(bis[8]);
			bin.setPayeeCode(bis[9]);
			bin.setPayeeName(bis[10]);
			bin.setPayeeAcctNo(bis[11]);
			bin.setPayerCode(bis[12]);
			bin.setPayerName(bis[13]);
			bin.setPayerAcctNo(bis[14]);
			bin.setTransTime(bis[15]);
			String curr = DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss");
			bin.setInsertTime(curr);
		}
		
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(bis[0])).append(C);//OriBizNo
		sb.append(s(bis[1])).append(C);//OldOriBizNo
		sb.append(s(bis[2])).append(C);//Type
		sb.append(s(bis[3])).append(C);//Flag
		sb.append(s(bis[4])).append(C);//Status
		sb.append(s(bis[5])).append(C);//Memo
		sb.append(s(bis[6])).append(C);//Ccy
		sb.append(f(bis[7])).append(C);//Amt
		sb.append(s(bis[8])).append(C);//BizChannel
		sb.append(s(bis[9])).append(C);//PayerCode
		sb.append(s(bis[10])).append(C);//PayerName
		sb.append(s(bis[11])).append(C);//PayerAcctNo
		sb.append(s(bis[12])).append(C);//PayeeCode
		sb.append(s(bis[13])).append(C);//PayeeName
		sb.append(s(bis[14])).append(C);//PayeeAcctNo
		sb.append(s(bis[15])).append(C);//TransTime
		
		validBillEnd(bin, i);
		sb.append("sysdate()").append(C);//INSERT_TIME
		sb.append(s(bin.getValidFlag())).append(C);//VALID_FLAG
		sb.append(s(bin.getInvalidType())).append(C);//INVALID_TYPE
		sb.append(s(bin.getInvalidInfo())).append(C);//INVALID_INFO
		sb.append(s(syncDate)).append(C);//SYNC_DATE
		sb.append(s(Dict.SYNC_TYPE_INIT)).append(C);//SYNC_TYPE
		sb.append(s(Dict.SYNC_FLAG_PENDING));//SYNC_FLAG
		
		sb.append(")").append(C);
	}
	
	/** 验证日终账单表业务单号、业务渠道、账单类型是否有效 */
	private void validBillEnd(BillInstanceEnd biEnd, int i){
		boolean flag = true;
		String invalidType = "";
		String invalidInfo = "";
		
		if(StringUtils.isBlank(biEnd.getOriBizNo())){
			invalidType = BillInstanceEnd.INVALID_TYPE_EMPTY_ORIBIZNO;
			invalidInfo = "日终账单文件第"+i+"条业务单号为空！";
			flag = false;
		}
		if(flag){
			if(StringUtils.isBlank(biEnd.getBizChannel())){
				invalidType = BillInstanceEnd.INVALID_TYPE_EMPTY_BIZCHANNEL;
				invalidInfo = "日终账单文件第"+i+"条（业务单号"+biEnd.getOriBizNo()+"）业务渠道为空！";
				flag = false;
			} else {
				BizChannel biz = bizChannelMap.get(biEnd.getBizChannel());
				if (biz==null) {
					invalidType = BillInstanceEnd.INVALID_TYPE_ERR_BIZCHANNEL;
					invalidInfo = "日终账单文件第"+i+"条（业务单号"+biEnd.getOriBizNo()+"）存在无效的业务渠道["+biEnd.getBizChannel()+"]！";
					flag = false;
				}
			}
		}
		
		if(flag){
			if(StringUtils.isBlank(biEnd.getType())){
				invalidType = BillInstanceEnd.INVALID_TYPE_EMPTY_TYPE;
				invalidInfo = "日终账单文件第"+i+"条（业务单号"+biEnd.getOriBizNo()+"）账单类型为空！";
				flag = false;
			} else {
				BillType bt = billTypeMap.get(biEnd.getType());
				if (bt == null) {
					invalidType = BillInstanceEnd.INVALID_TYPE_ERR_TYPE;
					invalidInfo = "日终账单文件第"+i+"条（业务单号"+biEnd.getOriBizNo()+"）存在无效的账单类型["+biEnd.getType()+"]！";
					flag = false;
				}
			}
		}
		
		if(flag){
			biEnd.setValidFlag(BillInstanceEnd.VALID_FLAG_TRUE);
			billEndValidNum++;
		} else {
			log.error(invalidInfo);
			biEnd.setValidFlag(BillInstanceEnd.VALID_FLAG_FALSE);
			biEnd.setInvalidType(invalidType);
			biEnd.setInvalidInfo(invalidInfo);
			billEndInvalidNum++;
		}
	}
	
	private void concateBillSql(StringBuilder sb, BillInstanceEnd billEnd, String seq){
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(seq)).append(C);//no
		sb.append(s(billEnd.getOriBizNo())).append(C);//OriBizNo
		sb.append(s(billEnd.getOldOriBizNo())).append(C);//OldOriBizNo
		sb.append(s(billEnd.getType())).append(C);//Type
		sb.append(s(billEnd.getFlag())).append(C);//Flag
		sb.append(s(billEnd.getStatus())).append(C);//Status
		sb.append(s(billEnd.getMemo())).append(C);//Memo
		sb.append(s(billEnd.getCcy())).append(C);//Ccy
		sb.append(billEnd.getAmt()).append(C);//Amt
		sb.append(s(billEnd.getBizChannel())).append(C);//BizChannel
		sb.append(s(billEnd.getPayerCode())).append(C);//PayerCode
		sb.append(s(billEnd.getPayerName())).append(C);//PayerName
		sb.append(s(billEnd.getPayerAcctNo())).append(C);//PayerAcctNo
		sb.append(s(billEnd.getPayeeCode())).append(C);//PayeeCode
		sb.append(s(billEnd.getPayeeName())).append(C);//PayeeName
		sb.append(s(billEnd.getPayeeAcctNo())).append(C);//PayeeAcctNo
		sb.append(s(getTransDate(billEnd.getTransTime()))).append(C);//TRANS_DATE
		sb.append(s(billEnd.getTransTime())).append(C);//TransTime
		
		sb.append("date(sysdate())").append(C);//CREATED_DATE
		sb.append("sysdate()").append(C);//CREATED_ON
		sb.append("sysdate()").append(C);//UPDATED_ON
		sb.append(s(Dict.SYNC_TYPE_LESS)).append(C);//SYNC_TYPE
		sb.append(s(Dict.SYNC_FLAG_COMPLETE)).append(C);//SYNC_FLAG
		sb.append(s(billEnd.getId()));//END_DAY_ID
		
		sb.append(")").append(C);
	}
	
	private void concateBillErrSql(StringBuilder sb, BillInstanceEnd billEnd, String seq){
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(seq)).append(C);//no
		sb.append(s(billEnd.getOriBizNo())).append(C);//OriBizNo
		sb.append(s(billEnd.getOldOriBizNo())).append(C);//OldOriBizNo
		sb.append(s(billEnd.getType())).append(C);//Type
		sb.append(s(billEnd.getFlag())).append(C);//Flag
		sb.append(s(billEnd.getStatus())).append(C);//Status
		sb.append(s(billEnd.getMemo())).append(C);//Memo
		sb.append(s(billEnd.getCcy())).append(C);//Ccy
		sb.append(billEnd.getAmt()).append(C);//Amt
		sb.append(s(billEnd.getBizChannel())).append(C);//BizChannel
		sb.append(s(billEnd.getPayerCode())).append(C);//PayerCode
		sb.append(s(billEnd.getPayerName())).append(C);//PayerName
		sb.append(s(billEnd.getPayerAcctNo())).append(C);//PayerAcctNo
		sb.append(s(billEnd.getPayeeCode())).append(C);//PayeeCode
		sb.append(s(billEnd.getPayeeName())).append(C);//PayeeName
		sb.append(s(billEnd.getPayeeAcctNo())).append(C);//PayeeAcctNo
		sb.append(s(getTransDate(billEnd.getTransTime()))).append(C);//TRANS_DATE
		sb.append(s(billEnd.getTransTime())).append(C);//TransTime
		
		sb.append("date(sysdate())").append(C);//CREATED_DATE
		sb.append("sysdate()").append(C);//CREATED_ON
		sb.append("sysdate()").append(C);//UPDATED_ON
		sb.append("sysdate()").append(C);//INSERT_TIME
		sb.append(s(Dict.SYNC_TYPE_LESS)).append(C);//ERR_TYPE
		sb.append(s("")).append(C);//ERR_INFO
		sb.append(s(billEnd.getId())).append(C);//END_DAY_ID
		sb.append(s(syncDate));//SYNC_DATE
		
		sb.append(")").append(C);
	}
	
	private void parseStrToPayEnd(String line, StringBuilder sb, int i) {
		PayInfoEnd infoEnd = new PayInfoEnd();
		String[] pays = line.split("\\|", -1);
		
		{
			infoEnd.setNo(pays[0]);
			infoEnd.setOriBizNo(pays[1]);
			infoEnd.setPayNo(pays[2]);
			infoEnd.setAmt(Float.parseFloat(pays[3]));
			infoEnd.setPayChannel(pays[4]);
			infoEnd.setWay(pays[5]);
			infoEnd.setQuantity(Integer.parseInt(pays[6]));
			infoEnd.setPayedTime(pays[7]);
			infoEnd.setStatus(pays[8]);
		}
		
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(pays[0])).append(C);//no
		sb.append(s(pays[1])).append(C);//OriBizNo
		sb.append(s(pays[2])).append(C);//payNo  SEQUENCENO
		sb.append(f(pays[3])).append(C);//amt
		sb.append(s(pays[4])).append(C);//payChannel TRAN_CHANEL
		sb.append(s(pays[5])).append(C);//way        TRAN_WAY
		sb.append(f(pays[6])).append(C);//quantity   TRAN_QUANTITY
		sb.append(s(pays[7])).append(C);//payedTime  TRAN_TIME
		sb.append(s(pays[8])).append(C);//status
		
		validPayEnd(infoEnd, i);
		sb.append("sysdate()").append(C);//INSERT_TIME
		sb.append(s(infoEnd.getValidFlag())).append(C);//VALID_FLAG
		sb.append(s(infoEnd.getInvalidType())).append(C);//INVALID_TYPE
		sb.append(s(infoEnd.getInvalidInfo())).append(C);//INVALID_INFO
		sb.append(s(syncDate)).append(C);//SYNC_DATE
		sb.append(s(Dict.SYNC_TYPE_LESS)).append(C);//SYNC_TYPE
		sb.append(s(Dict.SYNC_FLAG_PENDING));//SYNC_FLAG
		
		sb.append(")").append(C);
	}
	
	/** 验证日终支付表业务单号、支付流水、支付方式是否有效 */
	private void validPayEnd(PayInfoEnd payEnd, int i){
		boolean validFlag = true;
		String invalidType = "";
		String invalidInfo = "";
		
		if(StringUtils.isBlank(payEnd.getOriBizNo())){
			invalidType = PayInfoEnd.INVALID_TYPE_EMPTY_ORIBIZNO;
			invalidInfo = "日终支付文件第"+i+"条业务单号为空！";
			validFlag = false;
		}
		
		if(validFlag && StringUtils.isBlank(payEnd.getPayNo())){
			invalidType = PayInfoEnd.INVALID_TYPE_EMPTY_PAYNO;
			invalidInfo = "日终支付文件第"+i+"条（业务单号"+payEnd.getOriBizNo()+"）支付流水为空！";
			validFlag = false;
		}
		
		if(validFlag && StringUtils.isBlank(payEnd.getWay())){
			invalidType = PayInfoEnd.INVALID_TYPE_EMPTY_WAY;
			invalidInfo = "日终支付文件第"+i+"条（业务单号"+payEnd.getOriBizNo()+"）支付方式为空！";
			validFlag = false;
		}
		
//		if(validFlag){
//			int count = (int)billInstanceManager.getCount(" from BillInstance where oriBizNo=? ", payEnd.getOriBizNo());
//			if (count==0) {
//				invalidType = PayInfoEnd.INVALID_TYPE_NOT_FOUND_BILL;
//				invalidInfo = "日终支付文件第"+i+"条（业务单号"+payEnd.getOriBizNo()+"）找不到对应账单记录！";
//				validFlag = false;
//			}
//		}
		
		if(validFlag) {
			payEnd.setValidFlag(PayInfoEnd.VALID_FLAG_TRUE);
			payEndValidNum++;
		} else {
			log.error(invalidInfo);
			payEnd.setValidFlag(PayInfoEnd.VALID_FLAG_FALSE);
			payEnd.setInvalidType(invalidType);
			payEnd.setInvalidInfo(invalidInfo);
			payEndInvalidNum++;
		}
	}

	private void concatePaySql(StringBuilder sb, PayInfoEnd payEnd){
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(payEnd.getNo())).append(C);//no
		sb.append(s(payEnd.getOriBizNo())).append(C);//OriBizNo
		sb.append(s(payEnd.getPayNo())).append(C);//PayNo  SEQUENCENO
		sb.append(s(payEnd.getStatus())).append(C);//status
		sb.append(payEnd.getAmt()).append(C);//amt
		sb.append(s(getTransDate(payEnd.getPayedTime()))).append(C);//TRAN_DATE
		sb.append(s(payEnd.getPayedTime())).append(C);//payedTime  TRAN_TIME
		sb.append(s(payEnd.getWay())).append(C);//way  TRAN_WAY
		sb.append(payEnd.getQuantity()).append(C);//Quantity  TRAN_QUANTITY
		sb.append(s(payEnd.getPayChannel())).append(C);//PayChannel  TRAN_CHANEL
		
		sb.append("date(sysdate())").append(C);//CREATED_DATE
		sb.append("sysdate()").append(C);//CREATED_ON
		sb.append("sysdate()").append(C);//UPDATED_ON
		sb.append(s(Dict.SYNC_TYPE_INIT)).append(C);//SYNC_TYPE
		sb.append(s(Dict.SYNC_FLAG_COMPLETE)).append(C);//SYNC_FLAG
		sb.append(s(payEnd.getId()));//END_DAY_ID
		
		sb.append(")").append(C);
	}
	
	private void concatePayErrSql(StringBuilder sb, PayInfoEnd payEnd){
		sb.append("(");
		sb.append(s(MathUtils.uuid())).append(C);//id
		sb.append(s(payEnd.getNo())).append(C);//no
		sb.append(s(payEnd.getOriBizNo())).append(C);//OriBizNo
		sb.append(s(payEnd.getPayNo())).append(C);//PayNo  SEQUENCENO
		sb.append(s(payEnd.getStatus())).append(C);//status
		sb.append(payEnd.getAmt()).append(C);//amt
		sb.append(s(getTransDate(payEnd.getPayedTime()))).append(C);//TRAN_DATE
		sb.append(s(payEnd.getPayedTime())).append(C);//payedTime  TRAN_TIME
		sb.append(s(payEnd.getWay())).append(C);//way  TRAN_WAY
		sb.append(payEnd.getQuantity()).append(C);//Quantity  TRAN_QUANTITY
		sb.append(s(payEnd.getPayChannel())).append(C);//PayChannel  TRAN_CHANEL
		
		sb.append("date(sysdate())").append(C);//CREATED_DATE
		sb.append("sysdate()").append(C);//CREATED_ON
		sb.append("sysdate()").append(C);//UPDATED_ON
		sb.append("sysdate()").append(C);//INSERT_TIME
		sb.append(s(Dict.SYNC_TYPE_LESS)).append(C);//ERR_TYPE
		sb.append(s("")).append(C);//ERR_INFO
		sb.append(s(payEnd.getId())).append(C);//END_DAY_ID
		sb.append(s(syncDate));//SYNC_DATE
		
		sb.append(")").append(C);
	}
	
	private String getTransDate(String transTime) {
		if(transTime!=null && transTime.length()>=10){
			return transTime.substring(0, 10);
		}
		return transTime;
	}
	
	private String s(String s){
		if(StringUtils.isEmpty(s)){
			return "''";
		}else{
			return "'"+s.trim()+"'";
		}
	}
	
	private String f(String s){
		if(StringUtils.isEmpty(s)){
			return "0";
		}else{
			return s.trim();
		}
	}
	
	private void initDict(){
		bizChannelMap = new HashMap<String, BizChannel>();
		List<BizChannel> bizChannelList = bizChannelManager.findAll();
		for (BizChannel bizChannel : bizChannelList) {
			bizChannelMap.put(bizChannel.getCode(), bizChannel);
		}
		
		billTypeMap = new HashMap<String, BillType>();
		List<BillType> billTypeList = billTypeManager.findAll();
		for (BillType billType : billTypeList) {
			billTypeMap.put(billType.getCode(), billType);
		}
	}
	
	private void initFields(){
		/** 对账时间 */
		syncDate = "";
		/** 对账类型 */
		syncType = "";
		
		/** 账单日终首行条数 */
		billEndHeadNum = 0;
		/** 账单日终解析总数 */
		billEndParsedNum = 0;
		/** 账单日终有效条数 */
		billEndValidNum = 0;
		/** 账单日终无效条数 */
		billEndInvalidNum = 0;
		
		/** 账单缺少条数 */
		billLessNum = 0;
		/** 账单多出条数 */
		billMoreNum = 0;
		/** 账单老数据条数 */
		billOldNum = 0;
		/** 账单新数据条数 */
		billNewNum = 0;
		/** 账单不一致条数 */
		billDiffNum = 0;
		/** 账单一致条数 */
		billSameNum = 0;
		
		/** 账单同步异常标识 */
		billSyncFlag = "0";
		/** 账单同步异常信息 */
		billSyncInfo = "";
		
		
		/** 支付日终首行条数 */
		payEndHeadNum = 0;
		/** 支付日终解析总数 */
		payEndParsedNum = 0;
		/** 支付日终有效条数 */
		payEndValidNum = 0;
		/** 支付日终无效条数 */
		payEndInvalidNum = 0;
		
		/** 支付缺少条数 */
		payLessNum = 0;
		/** 支付多出条数 */
		payMoreNum = 0;
		/** 支付老数据条数 */
		payOldNum = 0;
		/** 支付新数据条数 */
		payNewNum = 0;
		/** 支付不一致条数 */
		payDiffNum = 0;
		/** 支付一致条数 */
		paySameNum = 0;
		
		/** 支付同步异常标识 */
		paySyncFlag = "0";
		/** 支付同步异常信息 */
		paySyncInfo = "";
		
		
		/** 日终表移到历史表标识 */
		endTableMovFlag = "0";
		/** 日终表移到历史表错误信息 */
		endTableMovInfo = "";
		/** 日终文件移到历史表标识 */
		endFilesMovFlag = "0";
		/** 日终文件移到历史表信息 */
		endFilesMovInfo = "";
		/** 日志信息 */
		logInfo = new StringBuilder();
	}

	/** 关闭流 */
	private void closeStream(Closeable ca) {
		if (ca != null) {
			try {
				ca.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static Date getBusinessDate(String source) {
		if (source == null || source.equals(""))
			return null;

		if (source.length() == 19) {
			SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				return sdf1.parse(source);
			} catch (ParseException pe) {
				throw new RuntimeException("Error converting string \'" + source + "\' to date with pattern \'yyyy-MM-dd HH:mm:ss\' ", pe);
			}
		} else if (source.length() == 10) {
			SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
			try {
				return sdf2.parse(source);
			} catch (ParseException pe) {
				throw new RuntimeException("Error converting string \'" + source + "\' to date with pattern \'yyyy-MM-dd\' ", pe);
			}
		} else {
			return null;
		}
	}

}
