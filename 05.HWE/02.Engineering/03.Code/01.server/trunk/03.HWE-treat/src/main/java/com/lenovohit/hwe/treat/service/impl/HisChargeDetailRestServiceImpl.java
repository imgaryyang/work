package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.service.HisChargeDetailService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**    
 *         
 * 类描述：    收费项目相关操作
 *@author GW
 *@date 2018年2月1日          
 *     
 */
public class HisChargeDetailRestServiceImpl implements HisChargeDetailService {
	
	GenericRestDto<ChargeDetail> dto;

	public HisChargeDetailRestServiceImpl(final GenericRestDto<ChargeDetail> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<ChargeDetail> getInfo(ChargeDetail request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<ChargeDetail> findList(ChargeDetail request) {
		return dto.getForList("hcp/app/payment/outpatientCharge/findChargeDetail", request);
	}

	@Override
	public RestListResponse<ChargeDetail> unpaids(ChargeDetail request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
