
package com.infohold.elh.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.ContactWays;
import com.infohold.el.base.model.Transportation;
import com.infohold.elh.base.model.Department;
import com.infohold.elh.base.model.Doctor;
import com.infohold.elh.base.model.ElhOrg;
import com.infohold.elh.base.model.Hospital;

/**
 * 医院管理 TODO 支持的卡类型
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/hospital")
public class HospitalRestController extends BaseRestController {
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Org, String> orgManager;
	@Autowired
	private GenericManager<ElhOrg, String> elhOrgManager;
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<ContactWays, String> contactWaysManager;
	@Autowired
	private GenericManager<Transportation, String> transportationManager;
	
	
	/******************************************************机构端方法*************************************************************************/
	/**
	 * ELH_HOSP_002	查询医院基础信息（机构端）	HMP1.1		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo() {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Hospital hospital = this.hospitalManager.get(orgId);
		if(null == hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}
		
		ElhOrg org = this.elhOrgManager.get(orgId);
		hospital.setElhOrg(org);
		//联系方式
		List<ContactWays> cws = this.contactWaysManager.find("from ContactWays where fkId = ? ", orgId);
		hospital.setContactWays(cws);
		//交通方式
		List<Transportation> ts = this.transportationManager.find("from Transportation where fkId = ? ", orgId);
		hospital.setTransportations(ts);
		return ResultUtils.renderSuccessResult(hospital);
	}
	/**
	 * ELH_HOSP_003	维护医院基础信息	（机构端） HMP1.1		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		ElhOrg elhOrg = this.elhOrgManager.get(orgId);
		Hospital hospital = this.hospitalManager.get(orgId);
		if(null == hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}
		
		Hospital param = JSONUtils.deserialize(data, Hospital.class);
		
		if(!StringUtils.isEmpty(param.getAddress())){
			hospital.setAddress(param.getAddress());
			elhOrg.setAddress(param.getAddress());
		}
		if(!StringUtils.isEmpty(param.getDescription())){
			hospital.setDescription(param.getDescription());
			elhOrg.setAddress(param.getAddress());
		}
		if(!StringUtils.isEmpty(param.getLogo())){
			hospital.setLogo(param.getLogo());
			elhOrg.setLogo(param.getLogo());
		}
		if(!StringUtils.isEmpty(param.getFeatureBackground())){
			hospital.setFeatureBackground(param.getFeatureBackground());
		}
		if(!StringUtils.isEmpty(param.getExpertBackground())){
			hospital.setExpertBackground(param.getExpertBackground());
		}
		this.elhOrgManager.save(elhOrg);
		//联系方式
		List<ContactWays> contactWays= param.getContactWays();
		if(!(null == contactWays || contactWays.isEmpty())){
			for(ContactWays contactWay : contactWays){
				contactWay.setFkId(hospital.getId());
				contactWay.setFkType("hospital");
				contactWaysManager.save(contactWay);
			}
		}
		//交通方式
		List<Transportation> ts = param.getTransportations();
		if(!(null == ts || ts.isEmpty())){
			for(Transportation transportation : ts){
				transportation.setFkId(hospital.getId());
				transportation.setFkType("hospital");
				transportationManager.save(transportation);
			}
		}
		Hospital savedHospital = this.hospitalManager.save(hospital);
		return ResultUtils.renderSuccessResult(savedHospital);
	}
	/**
	 * 	删除医院联系方式
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/contactWay/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelContactWay(@PathVariable("id") String id) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		ContactWays contactWay = this.contactWaysManager.get(id);
		if(!orgId.equals(contactWay.getFkId())){
			return ResultUtils.renderFailureResult("该联系方式不属于当前医院");
		}
		this.contactWaysManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 1	删除医院交通方式
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/transportation/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelTransportation(@PathVariable("id") String id) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Transportation transportation = this.transportationManager.get(id);
		if(!orgId.equals(transportation.getFkId())){
			return ResultUtils.renderFailureResult("该联系方式不属于当前医院");
		}
		this.transportationManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 医院上线下线	（运营端）		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/upLine", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpLine() {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		ElhOrg org = this.elhOrgManager.get(orgId);
		if(null == org )return ResultUtils.renderFailureResult("医院不存在");
		org.setState("1");
		this.elhOrgManager.save(org);
		return ResultUtils.renderSuccessResult("操作成功"); 
	}
	/**
	 * 医院上线下线	（运营端）		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/offLine", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOffLine() {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		ElhOrg org = this.elhOrgManager.get(orgId);
		
		if(null == org )return ResultUtils.renderFailureResult("医院不存在");
		org.setState("0");
		this.elhOrgManager.save(org);
		return ResultUtils.renderSuccessResult("操作成功"); 
	}
	
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/**
	 * ELH_HOSP_003	维护医院基础信息	HMP1.1		
	 * 运营端使用 创建医院时候，同时生成org表和医院维护的医院信息表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/mng/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMngCreate(@RequestBody String data) {
		ElhOrg elhOrg = JSONUtils.deserialize(data, ElhOrg.class);
		
		Org org = new Org();//先保存org
		org.setName(elhOrg.getName());
		org.setBrcCode(elhOrg.getCode());
		/*第一位：1-代发 0-非代发
		第二位：1-易健康接入医院 0-非易健康接入医院
		第三位：1-易健康接入药店 0-非易健康接入药店
		第四位：1-收费机构 0-非收费机构
		第五位：1/0 是否社保
		第六位：1/0 是否卫计委
		第七位：1/0 是否合作银行
		第八位：1/0 是否平台运营机构*/
		org.setType2("01000000");
		org.setUpDate(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		org = this.orgManager.save(org);
		
		elhOrg.setId(org.getId());
		this.elhOrgManager.save(elhOrg);
		
		Hospital hospital = JSONUtils.deserialize(data, Hospital.class);
		hospital.setName(elhOrg.getName());
		hospital.setId(elhOrg.getId());
		hospital.setLogo(elhOrg.getLogo());
		this.hospitalManager.save(hospital);
		
		return ResultUtils.renderSuccessResult(elhOrg);
	}
	/**
	 * ELH_HOSP_002	查询医院基础信息（运营端）	HMP1.1		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/mng/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMngInfo(@PathVariable("id") String id) {
		ElhOrg elhOrg = this.elhOrgManager.get(id);
		return ResultUtils.renderSuccessResult(elhOrg);
	}
	/**
	 * ELH_HOSP_003	维护医院基础信息	（运营端） HMP1.1		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/mng/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMngUpdate(@PathVariable("id") String id, @RequestBody String data) {
		ElhOrg elhOrg = this.elhOrgManager.get(id);
		Hospital hospital = this.hospitalManager.get(id);
		Map<?,?> param = JSONUtils.deserialize(data, Map.class);
		if(null!=param.get("code")){
			elhOrg.setCode(param.get("code").toString());
		}
		if(null!=param.get("name")){
			elhOrg.setName(param.get("name").toString());
			hospital.setName(param.get("name").toString());
		}
		if(null!=param.get("hosType")){
			elhOrg.setHosType(param.get("hosType").toString());
		}
		if(null!=param.get("hosLevel")){
			elhOrg.setHosLevel(param.get("hosLevel").toString());
		}
		if(null!=param.get("linkman")){
			elhOrg.setLinkman(param.get("linkman").toString());
		}
		if(null!=param.get("lmContactWay")){
			elhOrg.setLmContactWay(param.get("lmContactWay").toString());
		}
		if(null!=param.get("zipcode")){
			elhOrg.setZipcode(param.get("zipcode").toString());
		}
		if(null!=param.get("address")){
			elhOrg.setAddress(param.get("address").toString());
			hospital.setAddress(param.get("address").toString());
		}
		if(null!=param.get("salesman")){
			elhOrg.setSalesman(param.get("salesman").toString());
		}
		if(null!=param.get("smContactWay")){
			elhOrg.setSmContactWay(param.get("smContactWay").toString());
			elhOrg.setSmContactWay(param.get("smContactWay").toString());
		}
		if(null!=param.get("state")){
			elhOrg.setState(param.get("state").toString());
			elhOrg.setState(param.get("state").toString());
		}
		if(null!=param.get("logo")){
			elhOrg.setLogo(param.get("logo").toString());
			elhOrg.setLogo(param.get("logo").toString());
		}
		if(null!=param.get("memo")){
			elhOrg.setMemo(param.get("memo").toString());
			elhOrg.setMemo(param.get("memo").toString());
		}
		if(null!=param.get("logo")){
			elhOrg.setLogo(param.get("logo").toString());
			elhOrg.setLogo(param.get("logo").toString());
		}
		if(null!=param.get("hosHomeBg")){
			elhOrg.setHosHomeBg(param.get("hosHomeBg").toString());
			elhOrg.setHosHomeBg(param.get("hosHomeBg").toString());
		}
		if(null!=param.get("createdAt")){
			elhOrg.setCreatedAt(param.get("createdAt").toString());
			elhOrg.setCreatedAt(param.get("createdAt").toString());
		}
		this.hospitalManager.save(hospital);
		ElhOrg savedHospital = this.elhOrgManager.save(elhOrg);
		return ResultUtils.renderSuccessResult(savedHospital);
	}
	/**
	 * ELH_HOSP_004	删除医院信息	（运营端）		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/mng/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forMngDelete(@PathVariable("id") String id) {
		String sql = "from Doctor where hospitalId = ?"; 
		List<Doctor> listdDoctors = this.doctorManager.find(sql, id);
		String hql = "from Department where hospitalId = ?";
		List<Department> listDepartment = this.departmentManager.find(hql, id);
		if (listdDoctors.size()>0 || listDepartment.size()>0) {
		return ResultUtils.renderFailureResult("该医院下有部门或人员，无法删除！");
		}else{
			this.hospitalManager.delete(id);
			ElhOrg elhOrg = this.elhOrgManager.delete(id);
			return ResultUtils.renderSuccessResult(elhOrg);
		}
		//this.hospitalManager.delete(id);
		//ElhOrg elhOrg = this.elhOrgManager.delete(id);
		//return ResultUtils.renderSuccessResult(elhOrg);
	}
	/**
	 * 医院上线下线	（运营端）		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/mng/upLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMngUpLine(@PathVariable("id") String id) {
		ElhOrg org = this.elhOrgManager.get(id);
		if(null == org )return ResultUtils.renderFailureResult("医院不存在");
		org.setState("1");
		this.elhOrgManager.save(org);
		return ResultUtils.renderSuccessResult("操作成功"); 
	}
	/**
	 * 医院上线下线	（运营端）		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/mng/offLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMngOffLine(@PathVariable("id") String id) {
		ElhOrg org = this.elhOrgManager.get(id);
		if(null == org )return ResultUtils.renderFailureResult("医院不存在");
		org.setState("0");
		this.elhOrgManager.save(org);
		return ResultUtils.renderSuccessResult("操作成功"); 
	}
	/**
	 * ELH_HOSP_001	查询医院列表	p1.3\p1.4.2		1
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/mng/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMngList(
			@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		ElhOrg elhOrg = JSONUtils.deserialize(data, ElhOrg.class);
		
		StringBuilder sb = new StringBuilder();
		sb.append(" from ElhOrg where 1=1");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		List<String> cdList = new ArrayList<String>();
		if(elhOrg != null){
			if (elhOrg.getName() != null) {
				sb.append(" and name like ?");
				cdList.add("%" + elhOrg.getName() + "%");
			}
			if (elhOrg.getCode() != null) {
				sb.append(" and code like ?");
				cdList.add("%" + elhOrg.getCode() + "%");
			}
			if (elhOrg.getHosType() != null) {
				sb.append(" and hos_type like ?");
				cdList.add("%" + elhOrg.getHosType() + "%");
			}
			if (elhOrg.getHosLevel() != null) {
				sb.append(" and hos_level = ?");
				cdList.add(elhOrg.getHosLevel());
			}
			if (elhOrg.getState()!= null) {
				sb.append(" and state = ?");
				cdList.add(elhOrg.getState());
			}
		}
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.elhOrgManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/**
	 * ELH_HOSP_002	查询医院基础信息（公用方法）	HMP1.1		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Hospital hospital = this.hospitalManager.get(id);
		if(null == hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}
		
		ElhOrg org = this.elhOrgManager.get(id);
		hospital.setElhOrg(org);
		//联系方式
		List<ContactWays> cws = this.contactWaysManager.find("from ContactWays where fkId = ? ", id);
		hospital.setContactWays(cws);
		//交通方式
		List<Transportation> ts = this.transportationManager.find("from Transportation where fkId = ? ", id);
		hospital.setTransportations(ts);
		return ResultUtils.renderSuccessResult(hospital);
	}
	/**
	 * ELH_HOSP_001	查询医院列表	p1.3\p1.4.2		1
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/app/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(
			@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		ElhOrg model = JSONUtils.deserialize(data, ElhOrg.class);
		
		StringBuilder sb = new StringBuilder(" from Hospital hos, ElhOrg org where org.id=hos.id ");
		List<String> values = new ArrayList<String>();
		if(model != null){
			if (model.getName() != null) {
				sb.append(" and org.name like ?");
				values.add("%" + model.getName() + "%");
			}
			if (model.getHosType() != null) {
				sb.append(" and org.hosType = ?");
				values.add(model.getHosType());
			}
			if (model.getHosLevel() != null) {
				sb.append(" and org.hosLevel = ?");
				values.add(model.getHosLevel());
			}
			if (model.getHosLevel() != null) {
				sb.append(" and org.state = ?");
				values.add(model.getState());
			}
		}
		sb.append(" order by org.createdAt desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(values.toArray());
		this.elhOrgManager.findPage(page);
		
		
		Hospital hos = null;
		ElhOrg org = null;
		List<Object[]> list = (List<Object[]>) page.getResult();
		List<Hospital> hoss = new ArrayList<Hospital>();
		for (int i=0; list!=null && i<list.size(); i++) {
			hos = (Hospital) list.get(i)[0];
			org = (ElhOrg) list.get(i)[1];
			if (hos != null) {
				hos.setElhOrg(org);
				hoss.add(hos);
			}
		}
		page.setResult(hoss);
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	/**
	 * 此方法未用到
	@RequestMapping(value = "/listAll", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListAll( @RequestParam(value = "data", defaultValue = "") String data) {
		
		ElhOrg elhOrg = JSONUtils.deserialize(data, ElhOrg.class);
		
		StringBuilder sb = new StringBuilder(" from ElhOrg where 1=1");
		List<String> cdList = new ArrayList<String>();
		if(null!=elhOrg){
			if (elhOrg.getName() != null) {
				sb.append(" and name like ?");
				cdList.add("%" + elhOrg.getName() + "%");
			}
			if (elhOrg.getHosType() != null) {
				sb.append(" and hos_type like ?");
				cdList.add("%" + elhOrg.getHosType() + "%");
			}
			if (elhOrg.getHosLevel() != null) {
				sb.append(" and hos_level like ?");
				cdList.add("%" + elhOrg.getHosLevel() + "%");
			}
		}
		List<ElhOrg> result = this.elhOrgManager.find(sb.toString(),cdList.toArray());
		
		Page page = new Page();
		page.setResult(result);
		page.setTotal((null==result)?0:result.size());
		return ResultUtils.renderSuccessResult(page);
	}*/
	/******************************************************app端方法end*************************************************************************/
	
}




