package com.lenovohit.hcp.baseinfo.controller;

import java.math.BigDecimal;
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
import com.lenovohit.hcp.base.model.IDoctor;
import com.lenovohit.hcp.base.model.IHospital;
import com.lenovohit.hcp.base.model.InterfaceConfig;
import com.lenovohit.hcp.base.utils.AgeUtils;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;

/**
 * 医生基本信息
 */
@RestController
@RequestMapping("/hcp/app/base/doctor")
public class IDoctorRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	
	
	// 查找医生基础信息
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		IDoctor query = JSONUtils.deserialize(data, IDoctor.class);
		StringBuilder jql = new StringBuilder("from HcpUser u  ");
		List<Object> values = new ArrayList<Object>();
		
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" hosId = ? ");
			values.add(query.getHosNo());
		}else {
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and u.hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//科室编号
		if (!StringUtils.isEmpty(query.getDepNo())) {
			jql.append("and u.deptId = ? ");
			values.add(query.getDepNo());
		}
		//科室名称
		if (!StringUtils.isEmpty(query.getDepName())) {
			jql.append("and u.deptName like ? ");
			values.add("%" + query.getDepName() + "%");
		}
		//医生编号
		if (!StringUtils.isEmpty(query.getNo())) {
			jql.append("and u.userId = ? ");
			values.add(query.getNo());
		}
		//医生姓名
		if (!StringUtils.isEmpty(query.getName())) {
			jql.append("and u.name like ? ");
			values.add("%" + query.getName() + "%");
		}
		List<HcpUser> doctors=(List<HcpUser>) this.hcpUserManager.findByJql(jql.toString(), values.toArray());
		List<IDoctor> idoctors=TransFormModels(doctors);
		return ResultUtils.renderSuccessResult(idoctors);
		}
		
	

	private List<IDoctor> TransFormModels(List<HcpUser> doctors) {
		List<IDoctor> idoctors=new ArrayList<>();
		for(int i=0;i<doctors.size();i++){
			HcpUser doctor=doctors.get(i);
			IDoctor idoctor=new IDoctor();
			idoctor.setHosNo(doctor.getHosId());
			idoctor.setHosName(doctor.getHosId()!=null ? hospitalManager.findOneByProp("hosId", doctor.getHosId()).getHosName():"");
			idoctor.setDepNo(doctor.getDeptId());
			idoctor.setDepName(doctor.getDeptName());
			idoctor.setNo(doctor.getId());
			idoctor.setName(doctor.getName());
			idoctor.setPinyin(doctor.getPinyin());
			idoctor.setGender(doctor.getGender());
			idoctor.setBirthday(doctor.getBornDate());
			idoctor.setMobile(doctor.getMobile());
			idoctor.setMobile(doctor.getMobile());
			idoctor.setAge(doctor.getBornDate()!=null ? new BigDecimal(AgeUtils.getAgeFromBirthTime(doctor.getBornDate())):null);
			idoctor.setJobNum(doctor.getUserId());
			idoctor.setDegrees(doctor.getEduCode());
			idoctor.setJobTitle(doctor.getLvlCode());
			
			idoctor.setStatus(doctor.isActive()? "1":"0");
			
			idoctors.add(idoctor);
		}
		return idoctors;
	}
	
}
