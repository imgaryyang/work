package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.OperBalance;
import com.lenovohit.hcp.finance.model.PayWay;

//结账单打印
@Service("checkOutPrintDataManager")
public class CheckOutPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<OperBalance, String> operBalanceManager;
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;
	@Autowired
	private GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		OperBalance balance = operBalanceManager.get(bizId);
		if (balance == null)
			throw new RuntimeException("没有对应的结账信息");
		PrintData data = buildPrintData(balance);
		return data;
	}

	private PrintData buildPrintData(OperBalance balance) {
		PrintData data = new PrintData();
		data.setT1(DateUtils.date2String(balance.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT2(DateUtils.date2String(balance.getEndTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT3(balance.getMinInvoiceNo());
		data.setT4(balance.getMaxInvoiceNo());
		data.setT5(balance.getMinusCount());
		data.setT6(formatBigDecimal(balance.getMinusTot()));
		data.setT7(balance.getPlusCount());
		data.setT8("0");// 未打印发票张数
		data.setT9("0.00");// 未打印费用
		data.setT10("0.00");// 未打印收入
		data.setT11("0");// 补打发票张数
		data.setT12("0.00");// 补打发票收入
		data.setT13(formatBigDecimal(balance.getPlusTot()));
		data.setT14(formatBigDecimal(balance.getPlusTot()));
		Hospital hospital = hospitalManager.findOneByProp("hosId", balance.getHosId());
		data.setT15(hospital != null ? hospital.getHosName() : "");
		data.setT16(DateUtils.getCurrentDateStr("yyyy-MM-dd HH:mm:ss"));
		List<InnerData> payWays = getPayWays(balance.getId());
		List<InnerData> feeTypes = getFeeTypes(balance.getId());
		Map<String, List<InnerData>> map = new HashMap<>();
		map.put("0", payWays);
		map.put("1", feeTypes);
		data.setMap(map);
		return data;
	}

	private List<InnerData> getPayWays(String balanceId) {
		List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", balanceId);
		List<InnerData> result = new ArrayList<>();
		Map<String, InnerData> map = new HashMap<>();
		Map<String, Set<String>> payWayCount = new HashMap<>();
		for (InvoiceInfo info : infos) {
			String hql = "from PayWay where invoiceNo = ? and plusMinus = ?";
			List<PayWay> payWays = payWayManager.find(hql, info.getInvoiceNo(), info.getPlusMinus());
			for (PayWay payWay : payWays) {
				if (payWay == null)
					continue;
				InnerData data = map.get(payWay.getPayWay());
				Set<String> set = payWayCount.get(payWay.getPayWay());
				if (set == null) {
					set = new HashSet<>();
					payWayCount.put(payWay.getPayWay(), set);
				}
				if (data == null) {
					data = new InnerData();
					map.put(payWay.getPayWay(), data);
				}
				InnerData innerData = map.get(payWay.getPayWay());
				innerData.setT1(getDictName("PAY_MODE", payWay.getPayWay()));
				BigDecimal bigDecimal = new BigDecimal(
						StringUtils.isBlank(innerData.getT2()) ? "0" : innerData.getT2());
				innerData.setT2(formatBigDecimal(bigDecimal.add(payWay.getPayCost())));
				innerData.setT4("0.00");
				innerData.setT5("0");
				if (PayWay.MINUS.equals(payWay.getPlusMinus())) {
					BigDecimal refundAmt = new BigDecimal(
							StringUtils.isBlank(innerData.getT3()) ? "0" : innerData.getT3());
					String refundCount = innerData.getT4();
					Integer count = Integer.valueOf(StringUtils.isBlank(refundCount) ? "0" : refundCount);
					innerData.setT4(formatBigDecimal(refundAmt.add(payWay.getPayCost())));
					innerData.setT5((++count).toString());
				}
				Set<String> set2 = payWayCount.get(payWay.getPayWay());
				set2.add(payWay.getInvoiceNo());
			}
		}
		for (Map.Entry<String, InnerData> entry : map.entrySet()) {
			InnerData innerData = entry.getValue();
			innerData.setT3(String.valueOf(payWayCount.get(entry.getKey()).size()));
			result.add(innerData);
		}
		return result;
	}

	private BigDecimal zeroOrSourceNum(BigDecimal num) {
		if (num == null || StringUtils.isBlank(num.toString()))
			return new BigDecimal(0);
		return num;
	}

	private List<InnerData> getFeeTypes(String balanceId) {
		List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", balanceId);
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
		List<InnerData> result = new ArrayList<>();
		for (Map.Entry<String, BigDecimal> entry : map.entrySet()) {
			InnerData data = new InnerData();
			data.setT1(getDictName("FEE_CODE", entry.getKey()));
			data.setT2(formatBigDecimal(entry.getValue()));
			data.setT3(formatBigDecimal(entry.getValue()));
			result.add(data);
		}
		return result;
	}
}
