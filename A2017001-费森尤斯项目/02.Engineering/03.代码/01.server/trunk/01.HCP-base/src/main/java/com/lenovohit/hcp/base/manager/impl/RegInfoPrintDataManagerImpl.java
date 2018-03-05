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
import com.lenovohit.hcp.base.model.Dictionary;
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
	@Autowired
	protected GenericManager<Dictionary, String> dictionaryManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		RegInfo info;
		PrintData data=null; 
		String regId;
		OutpatientChargeDetail detail;
		List<OutpatientChargeDetail> chargeDetails = new ArrayList<>();
		System.out.println(bizId);
		if(!bizId.contains("@")){
			HisOrder order = hisOrderManager.findOneByProp("orderNo", bizId);
			if (order == null)
				throw new RuntimeException("不存在订单信息，请检查");
			List<String> chargeDetailIds = Arrays.asList(StringUtils.split(order.getChargeIds(), ","));
			
			for (String s : chargeDetailIds) {
				 detail = outpatientChargeDetailManager.get(s);
				if (detail != null)
					chargeDetails.add(detail);
			}
			regId = chargeDetails.get(0).getRegId();
			info = regInfoManager.get(regId);
			if (info == null)
				throw new RuntimeException("不存在该笔id对应的挂号信息");
			 data = buildPrintDataFromRegInfo(info, chargeDetails);
		}
		else{
			regId=bizId.substring(bizId.indexOf("@")+1);
			RegInfo reginfo=regInfoManager.findOneByProp("regId", regId);
			chargeDetails =outpatientChargeDetailManager.findByProp("regId", reginfo.getId());
			if (reginfo == null)
				throw new RuntimeException("不存在该笔id对应的挂号信息");
			 data = buildPrintDataFromRegInfo(reginfo, chargeDetails);
		}
		
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
		data.setT4(StringUtils.isBlank(info.getRegTime()) ? "" : info.getRegTime().toString().substring(0,16));
		data.setT5(info.getCreateOper());
		data.setT6(info.getRegId());
		data.setT7(formatBigDecimal(otherPay));
		data.setT8(info.getInvoiceNo());
		String sql="SELECT dict from Dictionary dict WHERE columnName = ? and columnKey = ?  ";
		List<Object> values=new ArrayList<Object>();
		values.add("REG_LEVEL");
		values.add(info.getRegLevel());
		List<Dictionary> modelList = dictionaryManager.find(sql.toString(), values.toArray());
		System.out.println(modelList.get(0).getColumnVal());
		data.setT9(modelList.get(0).getColumnVal());
		return data;
	}

}
