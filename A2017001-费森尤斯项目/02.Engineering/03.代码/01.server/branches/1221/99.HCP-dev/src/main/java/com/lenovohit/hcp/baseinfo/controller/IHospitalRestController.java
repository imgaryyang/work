package com.lenovohit.hcp.baseinfo.controller;

import java.util.ArrayList;
import java.util.Date;
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
import com.lenovohit.hcp.base.manager.HospitalManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IHospital;
import com.lenovohit.hcp.base.model.InterfaceConfig;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;

/**
 * 医院基本信息管理
 */
@RestController
@RequestMapping("/hcp/app/base/hospital")
public class IHospitalRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	
	// 查找医院基础信息
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		IHospital query = JSONUtils.deserialize(data, IHospital.class);
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			//医院编号
			if (!StringUtils.isEmpty(query.getNo())) {
				jql.append("and hosId = ? ");
				values.add(query.getNo());
			}
			//医院名称
			if (!StringUtils.isEmpty(query.getName())) {
				jql.append("and hosName like ? ");
				values.add("%" + query.getName() + "%");
			}
			//医院类型
			if (!StringUtils.isEmpty(query.getType())) {
				jql.append("and hosType like ? ");
				values.add("%" + query.getType() + "%");
			}
		}
		List<Hospital> hospitals=(List<Hospital>) this.hospitalManager.findByJql(jql.toString(), values.toArray());
		List<IHospital> ihospitals=TransFormModels(hospitals);
		return ResultUtils.renderSuccessResult(ihospitals);
	}

	private List<IHospital> TransFormModels(List<Hospital> hospitals) {
		List<IHospital> ihospitals=new ArrayList<>();
		for(int i=0;i<hospitals.size();i++){
			Hospital hospital=hospitals.get(i);
			IHospital Ihospital=new IHospital();
			Ihospital.setNo(hospital.getHosId());
			Ihospital.setName(hospital.getHosName());
			Ihospital.setType(hospital.getHosType());
			Ihospital.setLevel(hospital.getHosGrade());
			Ihospital.setStatus(hospital.getStopFlag()? "1":"0");
			Ihospital.setContent(hospital.getLinkTel()!=null ? convent(hospital.getLinkTel()): null);
			Ihospital.setAreaCode(hospital.getGroupId());
			ihospitals.add(Ihospital);
		}
		return ihospitals;
	}

	private List<String> convent(String linkTel) {
		List<String> tels=new ArrayList<>();
     	for(String tel  :  linkTel.split(","))
     	{
     		tels.add(tel);
     	}
		return tels;
	}

	
}
