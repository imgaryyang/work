package com.lenovohit.hcp.finance.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.finance.manager.CheckOutManager;
import com.lenovohit.hcp.finance.model.CheckOutDto;
import com.lenovohit.hcp.finance.model.FeeTypeDto;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.OperBalance;
import com.lenovohit.hcp.finance.model.PayWay;
import com.lenovohit.hcp.finance.model.PayWayDto;

@Service
@Transactional
public class CheckOutManagerImpl implements CheckOutManager {
	private static Log log = LogFactory.getLog(CheckOutManagerImpl.class);
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;
	@Autowired
	private GenericManager<OperBalance, String> operBalanceManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;

	@Override
	public CheckOutDto getCheckOutMsg(String hosId, String invoiceSource, String invoiceOperName) {
		// 1发票来源invoicesource、invoice_oper当前操作工号、invoicetime在结账区间。
		// 结账时间取oper_balance的balance——time最大时间，发票人员为invoice_oper
		Date date = new Date();
		Date beginDate = getBeginDate(invoiceOperName, invoiceSource,hosId);
		List<InvoiceInfo> totalInvoiceInfos = listInvoiceInfo(hosId, invoiceSource, invoiceOperName, beginDate, date);
		if (totalInvoiceInfos.size() == 0)
			return null;
		CheckOutDto dto = buildBaseCheckOutDto(totalInvoiceInfos, beginDate, date);
		// 2费用分类，发票号关联查询oc_invoiceinfo_detail 费用分类fee_code汇总费用
		List<FeeTypeDto> feeTypeDto = listFeeTypeDto(hosId,totalInvoiceInfos);
		dto.setFeeType(feeTypeDto);
		// 3支付方式，发票号关联oc_payway按支付方式汇总支付金额、退费金额
		List<PayWayDto> payWayDto = listPayWayDto(hosId,totalInvoiceInfos);
		dto.setPayWay(payWayDto);
		return dto;
	}

	@Override
	public CheckOutDto getCheckedMsg(String hosId, String invoiceSource, String invoiceOperName) {
		OperBalance balance = getNewestOperBalance(hosId, invoiceSource, invoiceOperName);
		CheckOutDto dto = transBalanceToCheckOutDto(balance);
		List<InvoiceInfo> totalInvoiceInfos = invoiceInfoManager.findByProp("balanceId", balance.getId());
		if (totalInvoiceInfos.size() == 0)
			return null;
		List<FeeTypeDto> feeTypeDto = listFeeTypeDto(hosId,totalInvoiceInfos);
		dto.setFeeType(feeTypeDto);
		List<PayWayDto> payWayDto = listPayWayDto(hosId,totalInvoiceInfos);
		dto.setPayWay(payWayDto);
		return dto;
	}

	@Override
	public OperBalance checkOut(String hosId, CheckOutDto dto) {
		// 界面信息归纳写入收费员结账信息
		// dto记录到oc_oper_balance
		OperBalance balance = buildAndSaveOperBalance(hosId, dto);
		// 记录查询的相同条件更新oc_invoiceinfo的结账id和结账时间（跟结束时间相同）
		List<InvoiceInfo> infos = listInvoiceInfo(hosId, dto.getInvoiceSource(), dto.getInvoiceOperName(),
				dto.getBeginDate(), dto.getEndDate());
		for (InvoiceInfo i : infos) {
			i.setBalanceId(balance.getId());
			i.setBalanceTime(balance.getCreateTime());
			i.setIsbalance(InvoiceInfo.BALANCED);
		}
		invoiceInfoManager.batchSave(infos);
		return balance;
	}

	@Override
	public void cancelCheckOut(String balanceId) {
		OperBalance balance = operBalanceManager.get(balanceId);
		if (balance == null)
			throw new RuntimeException("没有该笔结账单id记录");
		if (true == balance.getIscheck())
			throw new RuntimeException("该笔结账记录已经被审结，不允许取消");
		operBalanceManager.delete(balance);
		List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", balanceId);
		for (InvoiceInfo info : infos) {
			info.setBalanceId("");
			info.setBalanceTime(null);
			info.setIsbalance(InvoiceInfo.UN_BALANCE);
		}
		invoiceInfoManager.batchSave(infos);
	}

	private CheckOutDto transBalanceToCheckOutDto(OperBalance balance) {
		CheckOutDto dto = new CheckOutDto();
		dto.setBeginDate(balance.getStartTime());
		dto.setCheckOutDate(balance.getCheckTime());
		dto.setBalanceId(balance.getId());
		dto.setEndDate(balance.getEndTime());
		dto.setInvoiceOperName(balance.getInvoiceOper());
		dto.setInvoiceSource(balance.getInvoiceSource());
		dto.setMaxinvoiceNo(balance.getMaxInvoiceNo());
		dto.setMinInvoiceNo(balance.getMinInvoiceNo());
		dto.setRefundAmt(balance.getMinusTot());
		dto.setRefundCount(balance.getMinusCount());
		dto.setTotalAmt(balance.getPlusTot());
		dto.setTotalCount(balance.getPlusCount());
		dto.setCheckOutDate(balance.getBalanceTime());
		return dto;
	}

	private OperBalance getNewestOperBalance(String hosId, String invoiceSource, String invoiceOperName) {
		String hql = "select o from OperBalance o where o.balanceId = "
				+ "(select MAX(balanceId) from OperBalance where hosId = ? and invoiceSource = ? and invoiceOper like ? and isCheck = false )";
		List<OperBalance> result = (List<OperBalance>) operBalanceManager.find(hql, hosId, invoiceSource,
				invoiceOperName);
		if (result.size() < 1)
			throw new RuntimeException("已经没有符合条件的结账记录");
		return result.get(0);
	}

	private OperBalance buildAndSaveOperBalance(String hosId, CheckOutDto dto) {
		OperBalance balance = new OperBalance();
		// 获取结账id。
		balance.setHosId(hosId);
		balance.setBalanceTime(dto.getCheckOutDate());
		balance.setInvoiceOper(dto.getInvoiceOperName());
		balance.setInvoiceSource(dto.getInvoiceSource());
		balance.setStartTime(dto.getBeginDate());
		balance.setEndTime(dto.getEndDate());
		balance.setPlusCount(String.valueOf(Integer.valueOf(dto.getTotalCount())));
		balance.setPlusTot(StringUtils.isBlank(dto.getTotalAmt()) ? new BigDecimal("0") : dto.getTotalAmt());
		balance.setMinusCount(dto.getRefundCount());
		balance.setMinusTot(StringUtils.isBlank(dto.getRefundAmt()) ? new BigDecimal("0") : dto.getRefundAmt());
		balance.setIscheck(OperBalance.UN_CHECK);
		balance.setMaxInvoiceNo(dto.getMaxinvoiceNo());
		balance.setMinInvoiceNo(dto.getMinInvoiceNo());
		balance.setCreateTime(dto.getEndDate());

		return operBalanceManager.save(balance);
	}

	private BigDecimal zeroOrSourceNum(BigDecimal num) {
		if (num == null || StringUtils.isBlank(num.toString()))
			return new BigDecimal(0);
		return num;
	}

	private List<PayWayDto> listPayWayDto(String hosId,List<InvoiceInfo> infos) {
		Map<String, BigDecimal> map = new HashMap<>();
		for (InvoiceInfo info : infos) {
			String hql = "from PayWay where invoiceNo = ? and hosId = '"+hosId+"' and plusMinus = ?";
			List<PayWay> payWays = payWayManager.find(hql, info.getInvoiceNo(), info.getPlusMinus());
			for (PayWay payWay : payWays) {
				if (payWay == null)
					continue;
				BigDecimal amt = map.get(payWay.getPayWay());
				if (amt == null) {
					amt = zeroOrSourceNum(payWay.getPayCost());
				} else {
					amt = amt.add(zeroOrSourceNum(payWay.getPayCost()));
				}
				map.put(payWay.getPayWay(), amt);
			}
		}
		List<PayWayDto> result = new ArrayList<>();
		for (Map.Entry<String, BigDecimal> entry : map.entrySet()) {
			PayWayDto dto = new PayWayDto();
			dto.setPayWay(entry.getKey());
			dto.setAmt(entry.getValue());
			dto.setRefundAmt(new BigDecimal(0));
			result.add(dto);
		}
		return result;

	}

	private List<FeeTypeDto> listFeeTypeDto(String hosId,List<InvoiceInfo> infos) {
		Map<String, BigDecimal> map = new HashMap<>();
		for (InvoiceInfo info : infos) {
			String hql = "from InvoiceInfoDetail where invoiceNo = ? and hosId = '"+hosId+"' and plusMinus = ?";
			List<InvoiceInfoDetail> details = invoiceInfoDetailManager.find(hql, info.getInvoiceNo(),
					info.getPlusMinus());
			for (InvoiceInfoDetail detail : details) {
				if (detail == null)
					continue;
				BigDecimal amt = map.get(detail.getFeeCode());// TODO feecode?
				if (amt == null)
					amt = zeroOrSourceNum(detail.getTotCost());
				else
					amt = amt.add(zeroOrSourceNum(detail.getTotCost()));
				map.put(detail.getFeeCode(), amt);
			}
		}
		List<FeeTypeDto> result = new ArrayList<>();
		for (Map.Entry<String, BigDecimal> entry : map.entrySet()) {
			FeeTypeDto dto = new FeeTypeDto();
			dto.setFeeType(entry.getKey());
			dto.setFeeAmt(entry.getValue());
			result.add(dto);
		}
		return result;
	}

	private CheckOutDto buildBaseCheckOutDto(List<InvoiceInfo> info, Date beginDate, Date date) {
		CheckOutDto dto = new CheckOutDto();
		BigDecimal totalAmt = new BigDecimal(0);
		BigDecimal refundAmt = new BigDecimal(0);
		Set<String> distinctInvoiceNo = new HashSet<String>();
		int totalRefundCount = 0;
		String minInvoiceNo = "";
		String maxInvoiceNo = "";
		Date minDate = new Date();
		for (int i = 0; i < info.size(); i++) {
			InvoiceInfo invoiceInfo = info.get(i);
			distinctInvoiceNo.add(invoiceInfo.getInvoiceNo());
			if (i == 0) {
				dto.setInvoiceOper(invoiceInfo.getInvoiceOper());
				dto.setInvoiceOperName(invoiceInfo.getInvoiceOperName());
				dto.setBeginDate(beginDate);
				dto.setEndDate(date);
				dto.setInvoiceSource(invoiceInfo.getInvoiceSource());
				minInvoiceNo = invoiceInfo.getInvoiceNo();
				maxInvoiceNo = invoiceInfo.getInvoiceNo();
			}
			if (InvoiceInfo.PLUSMINUS_MINUS.equals(invoiceInfo.getPlusMinus().toString())) {
				refundAmt = refundAmt.add(invoiceInfo.getTotCost());
				totalRefundCount++;
			}
			totalAmt = totalAmt.add(invoiceInfo.getTotCost());
			if (minInvoiceNo.compareTo(invoiceInfo.getInvoiceNo()) > 0)
				minInvoiceNo = invoiceInfo.getInvoiceNo();
			if (maxInvoiceNo.compareTo(invoiceInfo.getInvoiceNo()) < 0)
				maxInvoiceNo = invoiceInfo.getInvoiceNo();
			if (minDate.compareTo(invoiceInfo.getInvoiceTime()) > 0)
				minDate = invoiceInfo.getInvoiceTime();
		}
		dto.setTotalAmt(totalAmt);
		dto.setTotalCount(String.valueOf(distinctInvoiceNo.size()));
		dto.setRefundAmt(refundAmt);
		dto.setRefundCount(String.valueOf(totalRefundCount));
		dto.setMinInvoiceNo(minInvoiceNo);
		dto.setMaxinvoiceNo(maxInvoiceNo);
		dto.setBeginDate(minDate);
		dto.setCheckOutDate(date);
		return dto;
	}
	
	/**    
	 * 功能描述：计算药品消耗
	 *@param info
	 *@return       
	 *@author GW
	 *@date 2017年7月25日             
	*/
	private Map<String,Object> getSumDrugInfo(List<InvoiceInfo> info) {
		Map<String,Object> map = new HashMap<String,Object>();
		CheckOutDto dto = new CheckOutDto();
		BigDecimal totalAmt = new BigDecimal(0);
		BigDecimal refundAmt = new BigDecimal(0);
		Set<String> distinctInvoiceNo = new HashSet<String>();
		int totalRefundCount = 0;
		String minInvoiceNo = "";
		String maxInvoiceNo = "";
		Date minDate = new Date();
		for (int i = 0; i < info.size(); i++) {
			InvoiceInfo invoiceInfo = info.get(i);
			distinctInvoiceNo.add(invoiceInfo.getInvoiceNo());
			if (i == 0) {
				dto.setInvoiceOper(invoiceInfo.getInvoiceOper());
				dto.setInvoiceOperName(invoiceInfo.getInvoiceOperName());
				dto.setInvoiceSource(invoiceInfo.getInvoiceSource());
				minInvoiceNo = invoiceInfo.getInvoiceNo();
				maxInvoiceNo = invoiceInfo.getInvoiceNo();
			}
			if (InvoiceInfo.PLUSMINUS_MINUS.equals(invoiceInfo.getPlusMinus().toString())) {
				refundAmt = refundAmt.add(invoiceInfo.getTotCost());
				totalRefundCount++;
			}
			totalAmt = totalAmt.add(invoiceInfo.getTotCost());
			if (minInvoiceNo.compareTo(invoiceInfo.getInvoiceNo()) > 0)
				minInvoiceNo = invoiceInfo.getInvoiceNo();
			if (maxInvoiceNo.compareTo(invoiceInfo.getInvoiceNo()) < 0)
				maxInvoiceNo = invoiceInfo.getInvoiceNo();
			if (minDate.compareTo(invoiceInfo.getInvoiceTime()) > 0)
				minDate = invoiceInfo.getInvoiceTime();
		}
		dto.setTotalAmt(totalAmt);
		dto.setTotalCount(String.valueOf(distinctInvoiceNo.size()));
		dto.setRefundAmt(refundAmt);
		dto.setRefundCount(String.valueOf(totalRefundCount));
		dto.setMinInvoiceNo(minInvoiceNo);
		dto.setMaxinvoiceNo(maxInvoiceNo);
		dto.setBeginDate(minDate);
		return map;
	}

	private List<InvoiceInfo> listInvoiceInfo(String hosId, String invoiceSource, String invoiceOperName) {
		if (StringUtils.isBlank(invoiceSource) || StringUtils.isBlank(invoiceOperName))
			throw new RuntimeException("发票类型和发票操作人不能为空");
		List<InvoiceInfo> result = listInvoiceInfo(hosId, invoiceSource, invoiceOperName,
				getBeginDate(invoiceOperName, invoiceSource,hosId), new Date());
		return result;
	}

	private List<InvoiceInfo> listInvoiceInfo(String hosId, String invoiceSource, String invoiceOperName,
			Date beginDate, Date endDate) {
		String hql = "from InvoiceInfo where hosId = ? and invoiceSource = ? and invoiceOperName like ? and invoiceTime between ? and ? and isBalance = ? ";
		List<InvoiceInfo> result = invoiceInfoManager.find(hql, hosId, invoiceSource, invoiceOperName, beginDate,
				endDate, InvoiceInfo.UN_BALANCE);
		System.out.println("取得发票总数为：" + result.size());
		return result;
	}

	private Date getBeginDate(String invoiceOperName, String invoiceSource,String hosId) {
		String hql1 = "select ob from OperBalance ob where ob.hosId = ? and ob.balanceTime = (select MAX(balanceTime) from OperBalance where invoiceOper like ? and invoiceSource = ? and hosId = ? ) ";
		List<OperBalance> balance = operBalanceManager.find(hql1, hosId,invoiceOperName, invoiceSource,hosId);
		if (!hasCheckOutDate(balance)) {
			log.info("当前操作员结账表无记录，取开始区间为默认时间");
			return getDefaultBeginDate();
		}
		return balance.get(0).getBalanceTime();
	}

	private boolean hasCheckOutDate(List<OperBalance> balance) {
		if (balance == null)
			return false;
		return balance.size() != 0 && StringUtils.isNotBlank(balance.get(0).getBalanceTime());
	}

	private Date getDefaultBeginDate() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(2017, 1, 1, 0, 0, 0);
		Date date = calendar.getTime();
		return date;
	}

	@Override
	public List<Map<String,Object>> getChargeByTime(String startTime, String endTime, String hosId, String userName) {
		//收入相关数据封装
		Map<String,Object> map = new HashMap<String,Object>();
		//时间段内收入
		List<Object> totalAmtObject= getRevenue(startTime, endTime, hosId, userName);
		//获取药品消耗相关信息
		List<Object> drugMap = getConsumeDrugInfo(startTime, endTime, hosId, userName);
		//获取物资消耗
		List<Object> matMap = getConsumeMaterial(startTime, endTime, hosId, userName);
		List<Map<String,Object>> objList = transfromData(totalAmtObject,drugMap,matMap);
		return objList;
	}

	//
	/**    
	 * 功能描述：封装收入和支出数据
	 *@param totalAmtObject
	 *@param drugMap
	 *@param matMap
	 *@return       
	 *@author GW
	 *@date 2017年8月13日             
	*/
	private List<Map<String,Object>> transfromData(List<Object> totalAmtObject, List<Object> drugMap, List<Object> matMap) {
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
		Map<String,Map<String,Object>> map = new HashMap<String,Map<String,Object>>();
		if(totalAmtObject!=null && totalAmtObject.size()>0){
			for(Object o:totalAmtObject){//收入处理
				Object [] oList = (Object[]) o;
				if(StringUtils.isNotBlank(oList[2])){//判断医院名称是否存在
					String hosName = oList[2].toString();
					Map<String,Object> tmp = map.get(oList[2]);
					if(tmp!=null){
						tmp.put("totalAmt", oList[0]);
					}else{
						Map<String,Object> t = new HashMap<String,Object>();
						t.put("totalAmt", oList[0]);
						t.put("hosName", hosName);
						map.put(hosName, t);
					}
				}
			}
			for(Object o:drugMap){//药品消耗处理
				Object [] oList = (Object[]) o;
				if(StringUtils.isNotBlank(oList[3])){//判断医院名称是否存在
					String hosName = oList[3].toString();
					Map<String,Object> tmp = map.get(hosName);
					if(tmp!=null){
						tmp.put("totalBuyOfDrug", oList[0]);
						tmp.put("totalSaleOfDrug", oList[1]);
					}else{
						Map<String,Object> t = new HashMap<String,Object>();
						t.put("totalBuyOfDrug", oList[0]);
						t.put("totalSaleOfDrug", oList[1]);
						t.put("hosName", hosName);
						map.put(hosName, t);
					}
				}
			}
			for(Object o:matMap){//物资消耗处理
				Object [] oList = (Object[]) o;
				if(StringUtils.isNotBlank(oList[3])){//判断医院名称是否存在
					String hosName = oList[3].toString();
					Map<String,Object> tmp = map.get(hosName);
					if(tmp!=null){
						tmp.put("totalBuyOfMat", oList[0]);
						tmp.put("totalSaleOfMat", oList[1]);
					}else{
						Map<String,Object> t = new HashMap<String,Object>();
						t.put("totalBuyOfMat", oList[0]);
						t.put("totalSaleOfMat", oList[1]);
						t.put("hosName", hosName);
						map.put(hosName, t);
					}
				}
			}
		}
	  for (Entry<String, Map<String, Object>> entry : map.entrySet()) {//循环将数据放入到list中
		  mapList.add(entry.getValue());
	  }
	  return mapList;
	}

	/**    
	 * 功能描述：求时间段内收入
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName       
	 *@author GW
	 *@date 2017年7月25日             
	*/
	List<Object> getRevenue(String startTime, String endTime, String hosId, String userName) {
		
		//收入总和
		StringBuilder sql = new StringBuilder("select sum (i.Tot_Cost),i.hos_id,h.hos_name from oc_invoiceinfo i left join b_hosinfo h on i.hos_id = h.hos_id "
				+ "where CONVERT(varchar(100), invoice_Time, 23) between ? and ?  ");
		List<Object> values = new ArrayList<Object>();
		values.add(DateUtils.string2Date(startTime, "yyyy-MM-dd"));
		values.add(DateUtils.string2Date(endTime, "yyyy-MM-dd"));
		if(StringUtils.isNotBlank(hosId)){
			values.add(hosId);
			sql.append(" and i.hos_Id = ? ");
		}
		if(StringUtils.isNotBlank(userName)){//有名称说明统计的是收款员本人的，否则统计所有的
			sql.append(" and invoice_Oper_Name like ? ");
			values.add(userName);
		}
		sql.append(" group by i.hos_id,h.Hos_name ");
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(sql.toString(), values.toArray());
		return result;
	}
	
	/**    
	 * 功能描述：获取药品消耗相关信息
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月25日             
	*/
	List<Object> getConsumeDrugInfo(String startTime, String endTime, String hosId, String userName) {
		Map<String,Object> map = new HashMap<String,Object>();
		StringBuilder hql = new StringBuilder("SELECT "
				+ "SUM (d.BUY_PRICE * r.APPLY_NUM) as totalBuy,	SUM (d.SALE_PRICE * r.APPLY_NUM) as totalSale,r.hos_id,h.hos_name "
				+ "FROM	pha_recipe r LEFT JOIN pha_druginfo d ON r.DRUG_CODE = d.ID"
				+ " left join b_hosinfo h on r.hos_id = h.hos_id  "
				+ "WHERE"
				+ "	r.APPLY_STATE != '1' and  CONVERT(varchar(100), sent_time, 23) between '"+startTime
				+"' and '"+endTime+"' ");
		if(StringUtils.isNotBlank(hosId)){
			hql.append("and r.hos_id = '"+hosId+"' ");
		}
			hql.append("AND r.REG_ID IN "
								+ "( SELECT i.reg_id	FROM oc_invoiceinfo i WHERE  CONVERT(varchar(100), invoice_Time, 23) between '"+startTime+"' and '"+endTime+"' ");
			if(StringUtils.isNotBlank(hosId)){
				hql.append(" and i.hos_id = '"+hosId+"'");
			}
		if(StringUtils.isNotBlank(userName)){
			hql.append(" and invoice_Oper_Name = '"+userName+"'");
		}
		
		hql.append(" )");
		hql.append(" group by r.hos_id,h.hos_name ");
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		if(result!=null && result.size()>0){
			Object [] obj = (Object[]) result.get(0);
			map.put("totalBuyOfDrug", obj[0]);
			map.put("totalSaleOfDrug", obj[1]);
		}
		return result;
	}
	
	/**    
	 * 功能描述：获取物资消耗
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	*/
	List<Object> getConsumeMaterial(String startTime, String endTime, String hosId, String userName) {
		Map<String,Object> map = new HashMap<String,Object>();
		StringBuilder hql = new StringBuilder("SELECT SUM(m.BUY_PRICE * p.QTY) as totalBuy ,	SUM(m.SALE_PRICE*p.QTY) as totalSale, p.hos_id,h.hos_name  "
				+ "FROM	PHA_PATSTORE_EXEC p LEFT JOIN MATERIAL_INFO m ON p.ITEM_CODE = m.ITEM_CODE  left join b_hosinfo h on p.hos_id = h.hos_id   where "
				+ "  CONVERT(varchar(100), p.create_time, 23) between '"+startTime+"' and '"+endTime+"' ");
				if(StringUtils.isNotBlank(hosId)){
					hql.append(" and p.hos_id = '"+hosId+"' ");
				}
				hql.append(" AND p.REG_ID IN "
				+ "( SELECT i.reg_id	FROM oc_invoiceinfo i WHERE  CONVERT(varchar(100), invoice_Time, 23) between '"+startTime+"' and '"+endTime+"' ");
				if(StringUtils.isNotBlank(hosId)){
					hql.append(" and i.hos_id = '"+hosId +"'");
				}
		if(StringUtils.isNotBlank(userName)){
			hql.append(" and invoice_Oper_Name ='"+userName+"'");
		}
		
		hql.append(" )");
		hql.append(" group by  p.hos_id,h.hos_name ");
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		if(result!=null && result.size()>0){
			Object [] obj = (Object[]) result.get(0);
			map.put("totalBuyOfMat", obj[0]);
			map.put("totalSaleOfMat", obj[1]);
		}
		return result;
	}

	/**    
	 * 功能描述：获取物资消耗
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	*/
	public List<Object> statisOfMatConsum(String startTime, String endTime, String hosId, String deptId) {
		StringBuilder hql = new StringBuilder("select p.ITEM_CODE,p.ITEM_NAME,p.UNIT,p.APPROVAL_NO,sum(p.QTY) as QTY,p.UNIT_PRICE,sum(p.QTY)*p.UNIT_PRICE as total from  PHA_PATSTORE_EXEC p LEFT JOIN MATERIAL_INFO m ON p.ITEM_CODE = m.ITEM_CODE "
				+ "where CONVERT(varchar(100), p.create_time, 23) between '"+startTime
				+"' and '"+endTime
				+ "' and p.hos_id = '"+hosId
				+ "' GROUP BY p.ITEM_CODE,p.ITEM_NAME,p.UNIT,p.APPROVAL_NO,p.UNIT_PRICE ");
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		return result;
	}
	
	/**    
	 * 功能描述：获取期初期末统计信息
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Map<String,Object>> findMonthCheckData(String startTime, String endTime, String hosId, String deptId) {
		//获取期初统计数据
		List<Object> startData = findMonthCheckDataOfBegin(startTime, hosId, deptId);
		//获取期末统计数据
		List<Object> endData = findMonthCheckDataOfEnd(endTime, hosId, deptId);
		//获取所选期间采购信息
		List<Object> purchaseDate = findMonthCheckDataOfPurchase(startTime, endTime, hosId, deptId);
		//所选期间消耗信息
		List<Object> consumeData = findMonthCheckDataOfConsume(startTime, endTime, hosId, deptId);
		List<Map<String,Object>> mapList = mergeMonthCheckData(startData, endData, purchaseDate, consumeData);
		return mapList;
	}
	
	/**    
	 * 功能描述：获取期初统计信息
	 *@param startTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Object> findMonthCheckDataOfBegin(String startTime, String hosId, String deptId) {
		StringBuilder hql = new StringBuilder("SELECT	c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price,	SUM (c.store_sum) AS qty,	c.sale_price * SUM (c.store_sum) as money ");
			if(StringUtils.isNotBlank(deptId)){
				hql.append(", c.dept_Id ");
			}
				hql.append( " FROM	MATERIAL_MONTHCHECK c "
				+ " WHERE CONVERT(varchar(100), c.monthcheck_time, 20) =  '"+startTime+"'"
				+" and c.hos_id = '"+hosId+"'");
				if(StringUtils.isNotBlank(deptId)){
					hql.append(" and c.dept_Id = '"+deptId+"' ");
				}
				hql.append(" GROUP BY c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price ");
				if(StringUtils.isNotBlank(deptId)){
					hql.append(" , c.dept_Id ");
				}
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		return result;
	}
	
	/**    
	 * 功能描述：获取期末信息
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Object> findMonthCheckDataOfEnd(String endTime, String hosId, String deptId) {
		StringBuilder hql = new StringBuilder("SELECT	c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price,	SUM (c.store_sum) AS qty,	c.sale_price * SUM (c.store_sum) as money ");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(", c.dept_Id ");
		}
		hql.append( " FROM	MATERIAL_MONTHCHECK c "
		+ " WHERE CONVERT(varchar(100), c.monthcheck_time, 20) =  '"+endTime+"'"
		+" and c.hos_id = '"+hosId+"'");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(" and c.dept_Id = '"+deptId+"' ");
		}
		hql.append(" GROUP BY c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price ");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(" , c.dept_Id ");
		}
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		return result;
	}
	
	/**    
	 * 功能描述：获取所选期间采购信息
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Object> findMonthCheckDataOfPurchase(String startTime, String endTime, String hosId, String deptId) {
		StringBuilder hql = new StringBuilder("SELECT	c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price,	SUM (c.in_sum) AS qty,	c.sale_price * SUM (c.in_sum)  as money ");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(", c.dept_Id ");
		}
		hql.append( " FROM	MATERIAL_INPUTINFO c "
		+ " WHERE CONVERT(varchar(100), c.in_time, 120) <=  '"+endTime+"' "
		+ "and CONVERT(varchar(100), c.in_time, 120) >=  '"+startTime+"'"
		
		+" and c.hos_id = '"+hosId+"'");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(" and c.dept_Id = '"+deptId+"' ");
		}
		hql.append(" GROUP BY c.material_id,	c.trade_name,	c.min_unit,	c.batch_no,	c.approval_no,	c.sale_price ");
		if(StringUtils.isNotBlank(deptId)){
			hql.append(" , c.dept_Id ");
		}
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		return result;
	}
	
	/**    
	 * 功能描述：获取所选期间消耗信息
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Object> findMonthCheckDataOfConsume(String startTime, String endTime, String hosId, String deptId) {
		StringBuilder hql = new StringBuilder("select p.ITEM_CODE,p.ITEM_NAME,p.UNIT,p.APPROVAL_NO,sum(p.QTY) as QTY,p.UNIT_PRICE,sum(p.QTY)*p.UNIT_PRICE as total from  PHA_PATSTORE_EXEC p LEFT JOIN MATERIAL_INFO m ON p.ITEM_CODE = m.ITEM_CODE "
				+ "where CONVERT(varchar(100), p.create_time, 120 ) >= '"+startTime
				+"' and CONVERT(varchar(100), p.create_time, 120 ) <='"+endTime
				+ "' and p.hos_id = '"+hosId
				+ "' GROUP BY p.ITEM_CODE,p.ITEM_NAME,p.UNIT,p.APPROVAL_NO,p.UNIT_PRICE ");
		List<Object> result = (List<Object>) invoiceInfoManager.findBySql(hql.toString());
		return result;
	}
	
	/**    
	 * 功能描述：期初期末信息封装
	 *@param startTime
	 *@param endTime
	 *@param hosId
	 *@param userName
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	public List<Map<String,Object>> mergeMonthCheckData(List<Object> startData, List<Object> endData, List<Object> purchaseData, List<Object> consumeData) {
		Map<String,Map<String,Object>> dataMap = new TreeMap<String,Map<String,Object>>();//各个物资对应各项信息
		//期初数据处理
		if(startData!=null && startData.size()>0){//封装期初数据
			for(Object o:startData){
				Object [] obj = (Object[]) o;
				String mapKey = obj[1].toString();
				if(obj[3]!=null){
					mapKey = mapKey+"@"+obj[3];
				}else{
					mapKey=mapKey+"@";
				}
				if(obj[4]!=null){
					mapKey = mapKey+"@"+obj[4];
				}else{
					mapKey=mapKey+"@";
				}
				Map<String,Object> map = dataMap.get(mapKey);
				if(map!=null){
					map.put("tradeName", obj[1]);
					map.put("batchNo", obj[3]);
					map.put("approvalNo",obj[4]);
					map.put("unit", obj[2]);
					map.put("startPrice", obj[5]);
					map.put("startQty", obj[6]);
					map.put("startMoney", obj[7]);
				}else{
					map = new HashMap<String,Object>();
					map.put("tradeName", obj[1]);
					map.put("batchNo", obj[3]);
					map.put("approvalNo",obj[4]);
					map.put("unit", obj[2]);
					map.put("startPrice", obj[5]);
					map.put("startQty", obj[6]);
					map.put("startMoney", obj[7]);
					dataMap.put(mapKey, map);
				}
			}
		}
		//期末数据处理
		if(endData!=null && endData.size()>0){//封装期末数据
			for(Object o:endData){
				Object [] obj = (Object[]) o;
				String mapKey = obj[1].toString();
				if(obj[3]!=null){
					mapKey = mapKey+"@"+obj[3];
				}else{
					mapKey=mapKey+"@";
				}
				if(obj[4]!=null){
					mapKey = mapKey+"@"+obj[4];
				}else{
					mapKey=mapKey+"@";
				}
				Map<String,Object> map = dataMap.get(mapKey);
				if(map!=null){
					map.put("endPrice", obj[5]);
					map.put("endQty", obj[6]);
					map.put("endMoney", obj[7]);
				}else{
					map = new HashMap<String,Object>();
					map.put("tradeName", obj[1]);
					map.put("batchNo", obj[3]);
					map.put("approvalNo",obj[4]);
					map.put("unit", obj[2]);
					map.put("endPrice", obj[5]);
					map.put("endQty", obj[6]);
					map.put("endMoney", obj[7]);
					dataMap.put(mapKey, map);
				}
			}
		}
		//采购数据处理
		if(purchaseData!=null && purchaseData.size()>0){//封装期末数据
			for(Object o:purchaseData){
				Object [] obj = (Object[]) o;
				String mapKey = obj[1].toString();
				if(obj[3]!=null){
					mapKey = mapKey+"@"+obj[3];
				}else{
					mapKey=mapKey+"@";
				}
				if(obj[4]!=null){
					mapKey = mapKey+"@"+obj[4];
				}else{
					mapKey=mapKey+"@";
				}
				Map<String,Object> map = dataMap.get(mapKey);
				if(map!=null){
					map.put("purchasePrice", obj[5]);
					map.put("purchaseQty", obj[6]);
					map.put("purchaseMoney", obj[7]);
				}else{
					map = new HashMap<String,Object>();
					map.put("tradeName", obj[1]);
					map.put("batchNo", obj[3]);
					map.put("approvalNo",obj[4]);
					map.put("unit", obj[2]);
					map.put("purchasePrice", obj[5]);
					map.put("purchaseQty", obj[6]);
					map.put("purchaseMoney", obj[7]);
					dataMap.put(mapKey, map);
				}
			}
		}
		
		//物资消耗
		if(consumeData!=null && consumeData.size()>0){//封装期末数据
			for(Object o:consumeData){
				Object [] obj = (Object[]) o;
				String mapKey = obj[1].toString();
				if(obj[3]!=null){
					mapKey = mapKey+"@"+obj[3];
				}else{
					mapKey=mapKey+"@";
				}
				if(obj[4]!=null){
					mapKey = mapKey+"@"+obj[4];
				}else{
					mapKey=mapKey+"@";
				}
				Map<String,Object> map = dataMap.get(mapKey);
				if(map!=null){
					map.put("consumePrice", obj[5]);
					map.put("consumeQty", obj[6]);
					map.put("consumeMoney", obj[7]);
				}else{
					map = new HashMap<String,Object>();
					map.put("tradeName", obj[1]);
					//map.put("batchNo", obj[3]);
					map.put("approvalNo",obj[3]);
					map.put("unit", obj[2]);
					map.put("consumePrice", obj[4]);
					map.put("consumeQty", obj[5]);
					map.put("consumeMoney", obj[6]);
					dataMap.put(mapKey, map);
				}
			}
		}
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
		for (String key : dataMap.keySet()) {
			mapList.add(dataMap.get(key));
		}
		return mapList;
	}

	/*     
	 * 导出期初期末查询相关信息到Excel中    
	 */
	public void exportMonthCheck(String startTime, String endTime, String hosId, String deptId,
			HttpServletRequest request, HttpServletResponse response, String title) {
		//获取期初统计数据
		List<Object> startData = findMonthCheckDataOfBegin(startTime, hosId, deptId);
		//获取期末统计数据
		List<Object> endData = findMonthCheckDataOfEnd(endTime, hosId, deptId);
		//获取所选期间采购信息
		List<Object> purchaseDate = findMonthCheckDataOfPurchase(startTime, endTime, hosId, deptId);
		//所选期间消耗信息
		List<Object> consumeData = findMonthCheckDataOfConsume(startTime, endTime, hosId, deptId);
		List<Map<String,Object>> mapList = mergeMonthCheckData(startData, endData, purchaseDate, consumeData);
		expoetDataToExcel(request, response, title, mapList);
	
	}

	private void expoetDataToExcel(HttpServletRequest request, HttpServletResponse response, String title,
			List<Map<String,Object>> dataList) {
		String fileName = "期初期末统计";
		OutputStream out = null;
		int titleSize = 5;
		if (titleSize > 0) {
			try {
				String header = request.getHeader("USER-AGENT");
				if (StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")) {// IE浏览器
					fileName = URLEncoder.encode(fileName, "UTF8");
				} else if (StringUtils.contains(header, "Mozilla")) {// google,火狐浏览器
					fileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.reset();
				response.setContentType("application/vnd.ms-word");
				// 定义文件名
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
				// 定义一个输出流
				response.setCharacterEncoding("UTF-8");
				out = response.getOutputStream();
				// 工作区
				XSSFWorkbook wb = new XSSFWorkbook();
				XSSFCellStyle cellStyle = wb.createCellStyle();
				XSSFCellStyle titleStyle = wb.createCellStyle();
				XSSFFont font = wb.createFont();
				font.setFontHeightInPoints((short) 12);
				font.setFontName(" 黑体 ");
				cellStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
				
				
				// 创建第一个sheet
				XSSFSheet sheet = wb.createSheet();
				XSSFCellStyle style = wb.createCellStyle();
				font.setFontName("宋体");// 字体类型
				font.setFontHeightInPoints((short) 24);// 高度
				style.setFont(font);
				style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				titleStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				titleStyle.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
				style.setFillPattern(CellStyle.SOLID_FOREGROUND);
				// 给这一行赋值设置title
				for (int i = 0; i < dataList.size()+3; i++) {// 循环创建单元格
					XSSFRow row = sheet.createRow(i);
					for(int j=0;j<13;j++){
						if(i==0){
							row.createCell(j).setCellStyle(style);
						}else if(i==1){
							row.createCell(j).setCellStyle(titleStyle);
						}else {
							row.createCell(j).setCellStyle(cellStyle);
						}
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 12));//表头
				sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));//物资名称
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, 3));//药品消耗
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 4, 6));//物资消耗
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 7, 9));//物资消耗
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 10, 12));//物资消耗
				//第一行
				sheet.getRow(0).getCell(0).setCellValue(title);
				//第二行
				sheet.getRow(1).getCell(0).setCellValue("物资名称");
				sheet.getRow(1).getCell(1).setCellValue("期初");
				sheet.getRow(1).getCell(4).setCellValue("所选期间采购");
				sheet.getRow(1).getCell(7).setCellValue("所选期间消耗");
				sheet.getRow(1).getCell(10).setCellValue("期末");
				//第三行
				sheet.getRow(2).getCell(1).setCellValue("数量");
				sheet.getRow(2).getCell(2).setCellValue("单价");
				sheet.getRow(2).getCell(3).setCellValue("金额");
				sheet.getRow(2).getCell(4).setCellValue("数量");
				sheet.getRow(2).getCell(5).setCellValue("单价");
				sheet.getRow(2).getCell(6).setCellValue("金额");
				sheet.getRow(2).getCell(7).setCellValue("数量");
				sheet.getRow(2).getCell(8).setCellValue("单价");
				sheet.getRow(2).getCell(9).setCellValue("金额");
				sheet.getRow(2).getCell(10).setCellValue("数量");
				sheet.getRow(2).getCell(11).setCellValue("单价");
				sheet.getRow(2).getCell(12).setCellValue("金额");
				
				
				sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
				sheet.setColumnWidth(1,8 * 512);
				sheet.setColumnWidth(2,8 * 512);
				sheet.setColumnWidth(3,8 * 512);
				sheet.setColumnWidth(4,8 * 512);
				// 循环将dataList插入表中
				if (dataList != null && dataList.size() > 0) {
					for(int i=0;i<dataList.size();i++){
						XSSFRow row = sheet.getRow(i+3);
						Map<String,Object> map = dataList.get(i);
						DecimalFormat myformat=new DecimalFormat("0.0000");
						DecimalFormat myformat2=new DecimalFormat("0.00");
						DecimalFormat myformat0=new DecimalFormat("0");

						if ( map!= null) {
							if(map.get("tradeName")!=null){
								row.getCell(0).setCellValue(map.get("tradeName")+"("+map.get("batchNo")+"/"+map.get("approvalNo")+")");
							}
							//期初
							if(map.get("startQty")!=null){//数量
								if(map.get("unit")!=null){
									row.getCell(1).setCellValue(myformat0.format(map.get("startQty"))+map.get("unit"));
								}else{
									row.getCell(1).setCellValue(myformat0.format(map.get("startQty")));
								}
							}else{
								row.getCell(1).setCellValue("0");
							}
							if(map.get("startPrice")!=null){//单价
								row.getCell(2).setCellValue(myformat.format(map.get("startPrice")));
							}else{
								row.getCell(2).setCellValue("0.00");
							}
							if(map.get("startMoney")!=null){//金额
								row.getCell(3).setCellValue(myformat2.format(map.get("startMoney")));
							}else{
								row.getCell(3).setCellValue("0.00");
							}
							//所选期间采购
							if(map.get("purchaseQty")!=null){//数量
								if(map.get("unit")!=null){
									row.getCell(4).setCellValue(myformat0.format(map.get("purchaseQty"))+map.get("unit"));
								}else{
									row.getCell(4).setCellValue(myformat0.format(map.get("purchaseQty")));
								}
							}else{
								row.getCell(4).setCellValue("0");
							}
							if(map.get("purchasePrice")!=null){//单价
								row.getCell(5).setCellValue(myformat.format(map.get("purchasePrice")));
							}else{
								row.getCell(5).setCellValue("0.00");
							}
							if(map.get("purchaseMoney")!=null){//金额
								row.getCell(6).setCellValue(myformat2.format(map.get("purchaseMoney")));
							}else{
								row.getCell(6).setCellValue("0.00");
							}
							//所选期间消耗
							if(map.get("consumeQty")!=null){//数量
								if(map.get("unit")!=null){
									row.getCell(7).setCellValue(myformat0.format(map.get("consumeQty"))+map.get("unit"));
								}else{
									row.getCell(7).setCellValue(myformat0.format(map.get("consumeQty")));
								}
							}else{
								row.getCell(7).setCellValue("0");
							}
							if(map.get("consumePrice")!=null){//单价
								row.getCell(8).setCellValue(myformat.format(map.get("consumePrice")));
							}else{
								row.getCell(8).setCellValue("0.00");
							}
							if(map.get("consumeMoney")!=null){//金额
								row.getCell(9).setCellValue(myformat2.format(map.get("consumeMoney")));
							}else{
								row.getCell(9).setCellValue("0.00");
							}
							//期末
							if(map.get("endQty")!=null){//数量
								if(map.get("unit")!=null){
									row.getCell(10).setCellValue(myformat0.format(map.get("endQty"))+map.get("unit"));
								}else{
									row.getCell(10).setCellValue(myformat0.format(map.get("endQty")));
								}
							}else{
								row.getCell(10).setCellValue("0");
							}
							if(map.get("endPrice")!=null){//单价
								row.getCell(11).setCellValue(myformat.format(map.get("endPrice")));
							}else{
								row.getCell(11).setCellValue("0.00");
							}
							if(map.get("endMoney")!=null){//金额
								row.getCell(12).setCellValue(myformat2.format(map.get("endMoney")));
							}else{
								row.getCell(12).setCellValue("0.00");
							}
						}
					}
					
				}
				// 写文件
				wb.write(out);
				// 关闭输出流
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
				
			}
		} else {
			System.err.println("数据传递错误");
		}
	}
	
	
}
