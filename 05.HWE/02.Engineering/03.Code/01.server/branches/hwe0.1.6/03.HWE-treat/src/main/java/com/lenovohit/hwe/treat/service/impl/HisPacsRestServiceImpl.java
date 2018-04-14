
package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Pacs;
import com.lenovohit.hwe.treat.service.HisPacsService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author dpp
 */
public class HisPacsRestServiceImpl implements HisPacsService {

	GenericRestDto<Pacs> dto;

	public HisPacsRestServiceImpl(final GenericRestDto<Pacs> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Pacs> getInfo(Pacs model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Pacs> findList(Pacs model, Map<String, ?> variables) {
		System.out.println("\n======== model =========");
		return dto.getForList("hcp/app/onws/pacs/list", model, variables);
//		return dto.getForList("mnis/api/sickbed/execute/list", model, variables);
	}

}
