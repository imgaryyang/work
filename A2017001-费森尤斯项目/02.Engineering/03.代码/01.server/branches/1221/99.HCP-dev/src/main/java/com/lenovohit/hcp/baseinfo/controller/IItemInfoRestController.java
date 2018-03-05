package com.lenovohit.hcp.baseinfo.controller;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IDrug;
import com.lenovohit.hcp.base.model.IFeeitem;
import com.lenovohit.hcp.base.model.IHospital;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;

/**
 * 收费项查询
 */
@RestController
@RequestMapping("/hcp/app/base/itemInfo")
public class IItemInfoRestController  {

	@Autowired
	private GenericManager<ItemInfo, String> iteminfoManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		IFeeitem query =  JSONUtils.deserialize(data, IFeeitem.class);
		StringBuilder jql = new StringBuilder( "from ItemInfo  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			jql.append("where 1=1");
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//拼音
		if (!StringUtils.isEmpty(query.getPinyin())) {
			jql.append("and spellCode like ?   ");
			values.add("%" + query.getPinyin() + "%");
		}
		//五笔
		if (!StringUtils.isEmpty(query.getWubi())) {
			jql.append("and wbCode like ?  ) ");
			values.add("%" + query.getWubi() + "%");
		}
		//编号
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append("and itemCode = ? ");
			values.add(query.getCode());
		}
		//名称
		if(StringUtils.isNotBlank(query.getName())){
			jql.append("and itemName like ? ");
			values.add("%" +query.getName() + "%");
		}
		}
		List<ItemInfo> items=(List<ItemInfo>) this.iteminfoManager.findByJql(jql.toString(), values.toArray());
		List<IFeeitem> ifeeItems=TransFormModels(items);
		return ResultUtils.renderSuccessResult(ifeeItems);
		
	
	}
	

	private List<IFeeitem> TransFormModels(List<ItemInfo> items) {
		List<IFeeitem> ifeeItems=new ArrayList<IFeeitem>();
		for(int i=0;i<items.size();i++){
			ItemInfo itemInfo=items.get(i);
			IFeeitem ifeeItem=new IFeeitem();
			ifeeItem.setHosNo(itemInfo.getHosId());
			ifeeItem.setHosName(hospitalManager.findOneByProp("hosId", itemInfo.getHosId()).getHosName());
			ifeeItem.setCode(itemInfo.getItemCode());
			ifeeItem.setName(itemInfo.getItemName());
			ifeeItem.setPinyin(itemInfo.getSpellCode());
			ifeeItem.setWubi(itemInfo.getWbCode());
			ifeeItem.setPrice(itemInfo.getUnitPrice());
			ifeeItem.setUnit(itemInfo.getUnit());
			ifeeItem.setSpec(itemInfo.getSpecs());
			ifeeItem.setStatus(itemInfo.isStop()? "1":"0");
			ifeeItems.add(ifeeItem);
		}
		return ifeeItems;
	}


	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
