package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

/**
 * 
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年5月9日
 */
// 挂号单打印数据
@Service("regInfoPrintDataManager")
public class RegInfoPrintDataManagerImpl extends AbstractPrintDataManagerImpl {

	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<HisOrder, String> hisOrderManager;
	@Autowired
	protected GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		HisOrder order = hisOrderManager.findOneByProp("orderNo", bizId);
		if (order == null)
			throw new RuntimeException("不存在订单信息，请检查");
		List<String> chargeDetailIds = Arrays.asList(StringUtils.split(order.getChargeIds(), ","));
		List<OutpatientChargeDetail> chargeDetails = new ArrayList<>();
		for (String s : chargeDetailIds) {
			OutpatientChargeDetail detail = outpatientChargeDetailManager.get(s);
			if (detail != null)
				chargeDetails.add(detail);
		}
		String regId = chargeDetails.get(0).getRegId();
		RegInfo info = regInfoManager.get(regId);
		if (info == null)
			throw new RuntimeException("不存在该笔id对应的挂号信息");
		PrintData data = buildPrintDataFromRegInfo(info, chargeDetails);
		return data;
	}

	private PrintData buildPrintDataFromRegInfo(RegInfo info, List<OutpatientChargeDetail> details) {
		BigDecimal regist = new BigDecimal(0);
		BigDecimal otherPay = new BigDecimal(0);
		for (OutpatientChargeDetail d : details) {
			if (OutpatientChargeDetail.FEE_TYPE_REGIST.equals(d.getFeeType()))
				regist = regist.add(d.getTotCost());
			else if (OutpatientChargeDetail.FEE_TYPE_CLINIC.equals(d.getFeeType()))
				otherPay = otherPay.add(d.getTotCost());
		}
		PrintData data = new PrintData();
		data.setT1(info.getPatient().getName());
		data.setT2(info.getRegDept().getDeptName());
		data.setT3(formatBigDecimal(regist));
		data.setT4(StringUtils.isBlank(info.getRegTime()) ? "" : info.getRegTime().toString().substring(0, 10));
		data.setT5(info.getCreateOper());
		data.setT6(info.getRegId());
		data.setT7(formatBigDecimal(otherPay));
		data.setT8(info.getInvoiceNo());
		return data;
	}

}
