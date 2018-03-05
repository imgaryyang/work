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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IDeptment;
import com.lenovohit.hcp.base.model.IHospital;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 科室基本信息管理
 */
@RestController
@RequestMapping("/hcp/app/base/dept")
public class IDepartmentRestController  {

	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<ItemInfo, String> iteminfoManager;
	//获取科室菜单
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		IDeptment query = JSONUtils.deserialize(data, IDeptment.class);
		StringBuilder jql = new StringBuilder("from Department  ");
		List<Object> values = new ArrayList<Object>();
		List<Object> deptvalue = new ArrayList<Object>();
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" hosId = ? ");
			values.add(query.getHosNo());
		}else {
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
		
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//上级科室名称
		if (!StringUtils.isEmpty(query.getParentNo())) {
			jql.append("and parentId = ? ");
			values.add(query.getParentNo());
		}
		//科室编号
		if (!StringUtils.isEmpty(query.getNo())) {
			jql.append("and deptId = ? ");
			values.add(query.getNo());
		}
		//科室名称
		if (!StringUtils.isEmpty(query.getName())) {
			jql.append("and deptName like ? ");
			values.add("%" + query.getName() + "%");
		}
		//科室类型
		if (!StringUtils.isEmpty(query.getType())) {
			jql.append("and deptType like ? ");
			values.add("%" + query.getType() + "%");
		}
		List<Department> depts=(List<Department>) this.departmentManager.findByJql(jql.toString(), values.toArray());
		//查找科室挂号费和诊查费
		StringBuilder regsql = new StringBuilder(" from ItemInfo where   feeCode = '004' and hosId = ? ");
		StringBuilder examsql = new StringBuilder(" from ItemInfo where  feeCode = '007' and hosId = ? ");
		deptvalue.add(query.getHosNo());
		List<ItemInfo> regFee=(List<ItemInfo>) this.iteminfoManager.findByJql(regsql.toString(),deptvalue.toArray());
		List<ItemInfo> examinationFee=(List<ItemInfo>) this.iteminfoManager.findByJql(examsql.toString(),deptvalue.toArray());
		
		 List<IDeptment> idepts=TransFormModels(depts,regFee,examinationFee);
		return ResultUtils.renderSuccessResult(idepts);
		}
	
	

	/**
	 * @param depts
	 * @return
	 */
	private List<IDeptment> TransFormModels(List<Department> depts) {
		List<IDeptment> idepts=new ArrayList<IDeptment>();
		for(int i=0;i<depts.size();i++){
			Department dept=depts.get(i);
			IDeptment idept=new IDeptment();
			idept.setParentNo(dept.getParentId());
			idept.setNo(dept.getDeptId());
			idept.setName(dept.getDeptName());
			idept.setPinyin(dept.getSpellCode());
			idept.setWubi(dept.getWbCode());
			idept.setAddress(dept.getpAddress());
			idept.setDescription(dept.getIntroduce());
			idept.setType(dept.getDeptType());
			idept.setStatus(dept.getStopFlag());
			idept.setContent(convent(dept.getLinkTel()== null ? "" : dept.getLinkTel()));
			idepts.add(idept);
		}
		return idepts;
	}

	private List<IDeptment> TransFormModels(List<Department> depts, List<ItemInfo> regFee, List<ItemInfo> examinationFee) {
		List<IDeptment> idepts=new ArrayList<IDeptment>();
		for(int i=0;i<depts.size();i++){
			Department dept=depts.get(i);
			IDeptment idept=new IDeptment();
			idept.setParentNo(dept.getParentId());
			idept.setNo(dept.getDeptId());
			idept.setName(dept.getDeptName());
			idept.setPinyin(dept.getSpellCode());
			idept.setWubi(dept.getWbCode());
			idept.setAddress(dept.getpAddress());
			idept.setDescription(dept.getIntroduce());
			idept.setType(dept.getDeptType());
			idept.setStatus(dept.getStopFlag());
			idept.setRegFee(regFee.size()!=0 ? regFee.get(0).getUnitPrice():null);//挂号费
			idept.setTreatFee(examinationFee.size()!=0 ? examinationFee.get(0).getUnitPrice():null);//诊查费
			idept.setContent(convent(dept.getLinkTel()== null ? "" : dept.getLinkTel()));
			idepts.add(idept);
		}
		return idepts;
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
