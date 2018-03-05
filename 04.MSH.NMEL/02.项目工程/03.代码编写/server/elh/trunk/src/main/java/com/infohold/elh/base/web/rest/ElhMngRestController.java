package com.infohold.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.elh.base.model.DesignatedHos;
import com.infohold.elh.base.model.ElhOrg;

/**
 * 管理
 * TODO 该类需要重新梳理
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/manage")
public class ElhMngRestController extends BaseRestController {
	@Autowired
	private GenericManager<ElhOrg, String> elhOrgManager;
	@Autowired
	private GenericManager<DesignatedHos, String> designatedHosManager;

	/**
	 * ELH_MNG_001 查询接入医院列表 HOP1 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/org/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {

		ElhOrg elhOrg = JSONUtils.deserialize(data, ElhOrg.class);
		StringBuilder jql = new StringBuilder("from ElhOrg where 1=1");
		List<String> values = new ArrayList<String>();
		if (elhOrg.getName() != null) {
			jql.append(" and name like ?");
			values.add("%" + elhOrg.getName() + "%");
		}
		if (elhOrg.getCode() != null) {
			jql.append(" and code like ?");
			values.add("%" + elhOrg.getCode() + "%");
		}
		if (elhOrg.getHosType() != null) {
			jql.append(" and hos_type like ?");
			values.add("%" + elhOrg.getHosType() + "%");
		}
		if (elhOrg.getHosLevel() != null) {
			jql.append(" and hos_level like ?");
			values.add("%" + elhOrg.getHosLevel() + "%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.elhOrgManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

	/**
	 * ELH_MNG_016 维护定点医院信息 HOP6.1 如果东软开放此接口，则从东软接口同步，同时支持运营人员手工维护 2
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/designated/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDesignatedCreate(@RequestBody String data) {
		DesignatedHos hospital = JSONUtils.deserialize(data, DesignatedHos.class);
		hospital = this.designatedHosManager.save(hospital);
		return ResultUtils.renderSuccessResult(hospital);
	}

	/**
	 * ELH_MNG_017 定点医院查询 1
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/Designated/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		DesignatedHos hospital = this.designatedHosManager.get(id);
		return ResultUtils.renderSuccessResult(hospital);
	}

	/**
	 * ELH_MNG_016 维护定点医院信息 HOP6.1 如果东软开放此接口，则从东软接口同步，同时支持运营人员手工维护 2
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/Designated/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		DesignatedHos hospital = this.designatedHosManager.get(id);
		DesignatedHos savedHospital = this.designatedHosManager.save(hospital);
		return ResultUtils.renderSuccessResult(savedHospital);
	}

	/**
	 * 删除定点医院
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/Designated/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		DesignatedHos hospital = this.designatedHosManager.delete(id);
		return ResultUtils.renderSuccessResult(hospital);
	}

	/**
	 * ELH_MNG_015 查询定点医院列表 HOP6.1 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/Designated/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		DesignatedHos designatedHos = JSONUtils.deserialize(data,DesignatedHos.class);
		
		StringBuilder jql = new StringBuilder("from DesignatedHos where 1=1");
		List<String> values = new ArrayList<String>();
		if(designatedHos.getMiId()!=null){
			jql.append(" and miId like ?");
			values.add("%"+designatedHos.getMiId()+"%");
		}
		if(designatedHos.getName()!=null){
			jql.append(" and name like ?");
			values.add("%"+designatedHos.getName()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(values.toArray());
		page.setQuery(jql.toString());
		this.designatedHosManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

	/******************************************************机构端方法*************************************************************************/
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}
// ELH_MNG_002 查询接入医院基础信息 HOP1.2 3
// ELH_MNG_003 维护接入医院基础信息 HOP1.2 新增/修改，新增医院时，同时新增专属APP开通表 3
// ELH_MNG_004 查询接入医院就诊卡类型列表 3
// ELH_MNG_005 维护接入医院就诊卡类型 3
// ELH_MNG_006 删除接入医院就诊卡类型 3
// ELH_MNG_007 接入医院上线/下线 HOP1.1 3
// ELH_MNG_008 查询操作员列表 HOP1.1 新建医院时自动生成的管理员账户 3
// ELH_MNG_009 维护操作员信息 HOP1.1 3
// ELH_MNG_010 维护医院结算渠道 HOP1.1 需要渠道？ 3
