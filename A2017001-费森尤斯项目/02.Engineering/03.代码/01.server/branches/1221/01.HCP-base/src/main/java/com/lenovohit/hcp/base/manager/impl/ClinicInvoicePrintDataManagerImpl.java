package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.utils.ConvertUtils;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.PayWay;

//门诊发票打印
@Service("clinicInvoicePrintDataManager")
public class ClinicInvoicePrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	protected GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	protected GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String invoiceNoStr = null;
		String invoiceNo = null;
		String regId = null;
		PrintData data = new PrintData();
		if(bizId!=null){
			if(bizId.contains("&&&")){
				String [] bizList = bizId.split("&&&");
				regId = bizList[0];
				invoiceNo = bizList[1];
			}else{
				String jql = " from PayWay where payId= ? ";
				PayWay payWay = payWayManager.findOne(jql, bizId);
				regId = payWay.getRegId();
				invoiceNo = payWay.getInvoiceNo();
				
			}
			RegInfo regInfo = regInfoManager.get(regId);
			if (regInfo == null)
				throw new RuntimeException("不存在挂号记录信息");
			String hql = "from InvoiceInfo where invoiceSource = '2' and cancelFlag = '0' and regId = ? and invoiceNo = ? and plusMinus = ? ";// 传的bizid为挂号id（32位）
			// 只取正发票
			InvoiceInfo invoiceInfo = invoiceInfoManager.findOne(hql, regId, invoiceNo, 1);
			if(invoiceInfo!=null){
				invoiceNoStr = invoiceInfo.getInvoiceNo();
			}
			if (invoiceNoStr == null)
				throw new RuntimeException("不存在发票信息");
			String sql = "from InvoiceInfoDetail where invoiceNo = ? and plusMinus = 1 ";// 传的bizid为挂号id（32位）
			List<InvoiceInfoDetail> details = invoiceInfoDetailManager.find(sql, invoiceNoStr);
			buildBaseData(user, regInfo, invoiceInfo, data);
			Map<String, List<InnerData>> map = buildInnerDataMap(details,user);
			data.setMap(map);
		}
		return data;
	}

	private Map<String, List<InnerData>> buildInnerDataMap(List<InvoiceInfoDetail> details,HcpUser user) {
		List<InnerData> innerDatas = new ArrayList<>();
		for (InvoiceInfoDetail i : details) {
			InnerData innerData = new InnerData();
			innerData.setT1(getDictName("FEE_CODE", i.getFeeCode(),user.getHosId()));
			innerData.setT2(formatBigDecimal(i.getTotCost()));
			innerDatas.add(innerData);
		}
		Map<String, List<InnerData>> map = new HashMap<>();
		map.put("0", innerDatas);
		return map;
	}

	private void buildBaseData(HcpUser user, RegInfo regInfo, InvoiceInfo invoiceInfo, PrintData data) {
		data.setT1(regInfo.getRegId());
		data.setT2(invoiceInfo.getInvoiceNo());
		List<String> time = Arrays.asList(invoiceInfo.getInvoiceTime().toLocaleString().split(" "));
		data.setT3(time.get(1));
		List<String> date = Arrays.asList(time.get(0).split("-"));
		data.setT4(date.get(0));
		data.setT5(date.get(1));
		data.setT6(date.get(2));
		data.setT7(regInfo.getPatient().getName());
		data.setT8(formatBigDecimal(invoiceInfo.getTotCost()));
		data.setT9(getDictName("FEE_TYPE", invoiceInfo.getFeeType(),user.getHosId()));
		data.setT10(ConvertUtils.convertMoney(invoiceInfo.getTotCost().doubleValue()));
		data.setT11(formatBigDecimal(invoiceInfo.getTotCost()));

		Hospital hospital = hospitalManager.findOneByProp("hosId", invoiceInfo.getHosId());
		data.setT12(hospital == null ? "" : hospital.getHosName());
		data.setT13(user.getName());
		data.setT14(regInfo.getPatient().getIdAddress()+regInfo.getPatient().getMobile());
	}

}
