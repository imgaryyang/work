package com.lenovohit.hcp.finance.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
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

	public static void main(String[] args) {
		String s = "1000";
		Long s1 = Long.parseLong(s);
	}

	@Override
	public CheckOutDto getCheckOutMsg(String hosId, String invoiceSource, String invoiceOperName) {
		// 1发票来源invoicesource、invoice_oper当前操作工号、invoicetime在结账区间。
		// 结账时间取oper_balance的balance——time最大时间，发票人员为invoice_oper
		Date date = new Date();
		Date beginDate = getBeginDate(invoiceOperName, invoiceSource);
		List<InvoiceInfo> totalInvoiceInfos = listInvoiceInfo(hosId, invoiceSource, invoiceOperName, beginDate, date);
		if (totalInvoiceInfos.size() == 0)
			return null;
		CheckOutDto dto = buildBaseCheckOutDto(totalInvoiceInfos, beginDate, date);
		// 2费用分类，发票号关联查询oc_invoiceinfo_detail 费用分类fee_code汇总费用
		List<FeeTypeDto> feeTypeDto = listFeeTypeDto(totalInvoiceInfos);
		dto.setFeeType(feeTypeDto);
		// 3支付方式，发票号关联oc_payway按支付方式汇总支付金额、退费金额
		List<PayWayDto> payWayDto = listPayWayDto(totalInvoiceInfos);
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
		List<FeeTypeDto> feeTypeDto = listFeeTypeDto(totalInvoiceInfos);
		dto.setFeeType(feeTypeDto);
		List<PayWayDto> payWayDto = listPayWayDto(totalInvoiceInfos);
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

	private List<PayWayDto> listPayWayDto(List<InvoiceInfo> infos) {
		Map<String, BigDecimal> map = new HashMap<>();
		for (InvoiceInfo info : infos) {
			String hql = "from PayWay where invoiceNo = ? and plusMinus = ?";
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

	private List<FeeTypeDto> listFeeTypeDto(List<InvoiceInfo> infos) {
		Map<String, BigDecimal> map = new HashMap<>();
		for (InvoiceInfo info : infos) {
			String hql = "from InvoiceInfoDetail where invoiceNo = ? and plusMinus = ?";
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

	private List<InvoiceInfo> listInvoiceInfo(String hosId, String invoiceSource, String invoiceOperName) {
		if (StringUtils.isBlank(invoiceSource) || StringUtils.isBlank(invoiceOperName))
			throw new RuntimeException("发票类型和发票操作人不能为空");
		List<InvoiceInfo> result = listInvoiceInfo(hosId, invoiceSource, invoiceOperName,
				getBeginDate(invoiceOperName, invoiceSource), new Date());
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

	private Date getBeginDate(String invoiceOperName, String invoiceSource) {
		String hql1 = "select ob from OperBalance ob where ob.balanceTime = (select MAX(balanceTime) from OperBalance where invoiceOper like ? and invoiceSource = ? ) ";
		List<OperBalance> balance = operBalanceManager.find(hql1, invoiceOperName, invoiceSource);
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

}
