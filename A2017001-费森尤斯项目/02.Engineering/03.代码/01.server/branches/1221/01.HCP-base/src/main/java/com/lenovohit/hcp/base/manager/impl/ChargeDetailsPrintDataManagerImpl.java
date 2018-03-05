package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.PrintDataManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.MedicalOrder;

//患者收费明细打印数据
@Service("chargeDetailsPrintDataManager")
public class ChargeDetailsPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	protected GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String regId=bizId;
		RegInfo regInfo = regInfoManager.findOneByProp("regId", regId);
		if (regInfo == null)
			throw new RuntimeException("不存在挂号记录信息");
		
			String sql = "from MedicalOrder where regId = ? and orderState = '2' ";
			List<MedicalOrder> details = medicalOrderManager.find(sql, regInfo.getId());
			if(details.size()==0){
				// throw new RuntimeException("该挂号记录信息下没有收费明细");
				return null;
			}
			else{
				List<InnerData> innerDatas = new ArrayList<>();
				BigDecimal total=new BigDecimal(0);
				for (MedicalOrder m : details) {
					InnerData innerData = new InnerData();
					innerData.setT1(m.getItemName()); //药品名称
					if(m.getSpecs()==null){
						innerData.setT2(" ");
					}
					else{
						innerData.setT2(m.getSpecs());   //规格
					}
					//innerData.setT3(m.getFreqDesc());   //频率
					innerData.setT4(m.getSalePrice().toString());   //单价
					innerData.setT5(m.getQty().toString());   //数量
					BigDecimal subtotal=m.getSalePrice().multiply(m.getQty());  
					innerData.setT6(subtotal.setScale(2,BigDecimal.ROUND_DOWN).toString());   //小计
					total=total.add(subtotal);
					innerDatas.add(innerData);
				}
				
			Map<String, List<InnerData>> map = new HashMap<>();
			map.put("0", innerDatas);
			
			PrintData data = new PrintData();
			data.setT1(regInfo.getPatient().getName()); //姓名
			data.setT2(regInfo.getRegId());  //就诊号
			data.setT3(hcpUserManager.get(details.get(0).getRecipeDoc()).getName());  //看诊医生
			data.setT4(total.setScale(2,BigDecimal.ROUND_DOWN).toString()); //总计
			data.setMap(map);
			return data;
			
	}}

}
