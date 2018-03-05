package com.lenovohit.hcp.baseinfo.controller;

import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IDoctor;
import com.lenovohit.hcp.base.model.IDrug;
import com.lenovohit.hcp.base.utils.AgeUtils;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugInfoManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPrice;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;


@RestController
@RequestMapping("/hcp/app/base/druginfo")
public class IPhaDrugInfoRestController extends HcpBaseRestController {

	
	@Autowired
	private GenericManager<PhaDrugPriceView, String> phaDrugPriceViewManager;

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	
	/**
	 * 查找药品基本信息
	 * @param data
	 * @return
	 */
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		IDrug query = JSONUtils.deserialize(data, IDrug.class);
		StringBuilder jql = new StringBuilder("from PhaDrugPriceView  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			
			jql.append("where 1=1");
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append("and pHosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and pHosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//药品编码
		if (!StringUtils.isEmpty(query.getCode())) {
			jql.append("and drugCode = ? ");
			values.add(query.getCode());
		}
		//药品名称
		if (!StringUtils.isEmpty(query.getName())) {
			jql.append("and ( commonName like ? || tradeName like ?  ) ");
			values.add("%" + query.getName() + "%");
			values.add("%" + query.getName() + "%");
		}
		//拼音
		if (!StringUtils.isEmpty(query.getPinyin())) {
			jql.append("and ( commonSpell like ? || tradeSpell like ?  ) ");
			values.add("%" + query.getPinyin() + "%");
			values.add("%" + query.getPinyin() + "%");
		}
		//五笔
		if (!StringUtils.isEmpty(query.getWubi())) {
			jql.append("and ( commonWb like ? || tradeWb like ?  ) ");
			values.add("%" + query.getWubi() + "%");
			values.add("%" + query.getWubi() + "%");
		}
		}
		List<PhaDrugPriceView> durgs=(List<PhaDrugPriceView>) this.phaDrugPriceViewManager.findByJql(jql.toString(), values.toArray());
		List<IDrug> idoctors=TransFormModels(durgs);
		return ResultUtils.renderSuccessResult(idoctors);
	
	}
		
	private List<IDrug> TransFormModels(List<PhaDrugPriceView> durgs) {
		
		List<IDrug> idrugs=new ArrayList<IDrug>();
		for(int i=0;i<durgs.size();i++){
			PhaDrugPriceView drug=durgs.get(i);
			IDrug idurg=new IDrug();
			idurg.setHosNo(drug.getpHosId());
			idurg.setHosName(hospitalManager.findOneByProp("hosId", drug.getpHosId()).getHosName());
			idurg.setCode(drug.getDrugCode());
			idurg.setName(drug.getCommonName());
			idurg.setPinyin(drug.getCommonSpell());
			idurg.setWubi(drug.getCommonWb());
			idurg.setPrice(drug.getSalePrice());
			idurg.setUnit(drug.getPackUnit());
			idurg.setSpec(drug.getDrugSpecs());
			idurg.setPackages(drug.getPackQty().toString());
			idurg.setProducer(drug.getProducer());
			idurg.setInPrice(drug.getBuyPrice());
			idurg.setStatus(drug.getStopFlag()? "1":"0");
			idrugs.add(idurg);
		}
		return idrugs;
	}
	
	}
	


