package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.model.Appoint;
import com.lenovohit.hwe.treat.service.HisAppointService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 预约挂号
@RestController
@RequestMapping("/hwe/treat/appoint")
public class AppointRestController extends OrgBaseRestController {
	@Autowired
	private HisAppointService hisAppointService;
	
	@Autowired
	private GenericManager<Appoint, String> appointManager;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Appoint model = this.appointManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Appoint query =  JSONUtils.deserialize(data, Appoint.class);
  		StringBuilder jql = new StringBuilder( " from Appoint where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getDepId())){
  			jql.append(" and depId = ? ");
  			values.add(query.getDepId());
  		}
  		if(!StringUtils.isEmpty(query.getDepNo())){
  			jql.append(" and depNo = ? ");
  			values.add(query.getDepNo());
  		}
  		if(!StringUtils.isEmpty(query.getDocId())){
  			jql.append(" and docId = ? ");
  			values.add(query.getDocId());
  		}
  		if(!StringUtils.isEmpty(query.getDocNo())){
  			jql.append(" and docNo = ? ");
  			values.add(query.getDocNo());
  		}
  		if(!StringUtils.isEmpty(query.getClinicType())){
  			jql.append(" and clinicType = ? ");
  			values.add(query.getClinicType());
  		}
  		if(!StringUtils.isEmpty(query.getClinicDate())){
  			jql.append(" and clinicDate = ? ");
  			values.add(query.getClinicDate());
  		}
  		if(!StringUtils.isEmpty(query.getShift())){
  			jql.append(" and shift = ? ");
  			values.add(query.getShift());
  		}
  		if(!StringUtils.isEmpty(query.getSchId())){
  			jql.append(" and schId = ? ");
  			values.add(query.getSchId());
  		}
  		if(!StringUtils.isEmpty(query.getSchNo())){
  			jql.append(" and schNo = ? ");
  			values.add(query.getSchNo());
  		}
  		if(!StringUtils.isEmpty(query.getNo())){
  			jql.append(" and no = ? ");
  			values.add(query.getNo());
  		}
  		if(!StringUtils.isEmpty(query.getProId())){
  			jql.append(" and proId = ? ");
  			values.add(query.getProId());
  		}
  		if(!StringUtils.isEmpty(query.getProNo())){
  			jql.append(" and proNo = ? ");
  			values.add(query.getProNo());
  		}
  		if(!StringUtils.isEmpty(query.getMobile())){
  			jql.append(" and mobile = ? ");
  			values.add(query.getMobile());
  		}
  		if(!StringUtils.isEmpty(query.getIdNo())){
  			jql.append(" and idNo = ? ");
  			values.add(query.getIdNo());
  		}
  		if(!StringUtils.isEmpty(query.getType())){
  			jql.append(" and type = ? ");
  			values.add(query.getType());
  		}
  		if(!StringUtils.isEmpty(query.getAppType())){
  			jql.append(" and appType = ? ");
  			values.add(query.getAppType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by createdAt");
  		
  		Page page = new Page();
  		page.setStart(start);
  		page.setPageSize(limit);
  		page.setQuery(jql.toString());
  		page.setValues(values.toArray());
  		
  		this.appointManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Appoint query =  JSONUtils.deserialize(data, Appoint.class);
  		StringBuilder jql = new StringBuilder( " from Appoint where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getDepId())){
  			jql.append(" and depId = ? ");
  			values.add(query.getDepId());
  		}
  		if(!StringUtils.isEmpty(query.getDepNo())){
  			jql.append(" and depNo = ? ");
  			values.add(query.getDepNo());
  		}
  		if(!StringUtils.isEmpty(query.getDocId())){
  			jql.append(" and docId = ? ");
  			values.add(query.getDocId());
  		}
  		if(!StringUtils.isEmpty(query.getDocNo())){
  			jql.append(" and docNo = ? ");
  			values.add(query.getDocNo());
  		}
  		if(!StringUtils.isEmpty(query.getClinicType())){
  			jql.append(" and clinicType = ? ");
  			values.add(query.getClinicType());
  		}
  		if(!StringUtils.isEmpty(query.getClinicDate())){
  			jql.append(" and clinicDate = ? ");
  			values.add(query.getClinicDate());
  		}
  		if(!StringUtils.isEmpty(query.getShift())){
  			jql.append(" and shift = ? ");
  			values.add(query.getShift());
  		}
  		if(!StringUtils.isEmpty(query.getSchId())){
  			jql.append(" and schId = ? ");
  			values.add(query.getSchId());
  		}
  		if(!StringUtils.isEmpty(query.getSchNo())){
  			jql.append(" and schNo = ? ");
  			values.add(query.getSchNo());
  		}
  		if(!StringUtils.isEmpty(query.getNo())){
  			jql.append(" and no = ? ");
  			values.add(query.getNo());
  		}
  		if(!StringUtils.isEmpty(query.getProId())){
  			jql.append(" and proId = ? ");
  			values.add(query.getProId());
  		}
  		if(!StringUtils.isEmpty(query.getProNo())){
  			jql.append(" and proNo = ? ");
  			values.add(query.getProNo());
  		}
  		if(!StringUtils.isEmpty(query.getMobile())){
  			jql.append(" and mobile = ? ");
  			values.add(query.getMobile());
  		}
  		if(!StringUtils.isEmpty(query.getIdNo())){
  			jql.append(" and idNo = ? ");
  			values.add(query.getIdNo());
  		}
  		if(!StringUtils.isEmpty(query.getType())){
  			jql.append(" and type = ? ");
  			values.add(query.getType());
  		}
  		if(!StringUtils.isEmpty(query.getAppType())){
  			jql.append(" and appType = ? ");
  			values.add(query.getAppType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by createdAt");
  		
  		List<Appoint> appoints = this.appointManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(appoints);
  	}
  	
  	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Appoint appoint =  JSONUtils.deserialize(data, Appoint.class);
  		Appoint saved = this.appointManager.save(appoint);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.appointManager.delete(id);
  		} catch (Exception e) {
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
  	
  	@SuppressWarnings("rawtypes")
  	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemoveAll(@RequestBody String data){
  		List ids =  JSONUtils.deserialize(data, List.class);
  		StringBuilder idSql = new StringBuilder();
  		List<String> idvalues = new ArrayList<String>();
  		try {
  			idSql.append("DELETE FROM TREAT_APPOINT WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.appointManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}


	// 3.4.1 可预约科室分类树查询
	@RequestMapping(value = "/deptTree", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptTree(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forDeptTree Start ========\ndata:\n"+data);
			Department query =  JSONUtils.deserialize(data, Department.class);
			
			log.info("\n======== forDeptTree Before hisAppointService.findDeptList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Department> result=this.hisAppointService.findDeptList(query, null);
			
			log.info("\n======== forDeptTree After hisAppointService.findDeptList ========\nresult:\n"+JSONUtils.serialize(result));
			if (!result.isSuccess())		throw new BaseException("HIS返回失败："+result.getMsg());
			
			List<Department> deptList= result.getList();
			Map<String, Department> deptTree = new TreeMap<String,Department>();
			for(Department dept : deptList) {
				String type = dept.getType();
				Department deptType = deptTree.get(type);
				if (null == deptType) {
					deptType = new Department();
					deptType.setName(type);
					deptType.setType(type);
					deptType.setChildren(new ArrayList<Department>());
					deptType.getChildren().add(dept);
					deptTree.put(type, deptType);
				} else {
					deptType.getChildren().add(dept);
				}
			}
			
			log.info("\n======== forDeptTree Success End ========\nlist:\n"+JSONUtils.serialize(deptTree.values()));
			return ResultUtils.renderSuccessResult(deptTree.values());
		} catch (Exception e) {
			log.error("\n======== forDeptTree Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	// 无卡预约记录查询
	@RequestMapping(value = "/reserved/noCard/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forReservedNoCardList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forReservedNoCardList Start ========\ndata:\n"+data);
			Appoint query =  JSONUtils.deserialize(data, Appoint.class);
			List<Appoint> appoints = this.getReservedNoCardList(query);  // 获取本地无卡预约记录
			List<Appoint> result = new ArrayList<Appoint>();	// 新建结果集
			
			// 循环调HIS接口，找到本地无卡预约记录对应的HIS无卡预约记录，并放入结果集
			for(Appoint item : appoints) {
				log.info("\n======== forReservedNoCardList Before hisAppointService.findReservedInfo ========\nquery:\n"+JSONUtils.serialize(item));
				RestEntityResponse<Appoint> res=this.hisAppointService.findReservedInfo(item, null);
				log.info("\n======== forReservedNoCardList After hisAppointService.findReservedInfo ========\nresult:\n"+JSONUtils.serialize(res));
				if (res.isSuccess()){
					if(res.getEntity() != null) result.add(res.getEntity());
				} else {
					throw new BaseException(res.getMsg());
				}
			}
			
			log.info("\n======== forReservedNoCardList Success End ========\nlist:\n"+JSONUtils.serialize(result));
			return ResultUtils.renderSuccessResult(result);
		} catch (Exception e) {
			log.error("\n======== forReservedNoCardList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	private List<Appoint> getReservedNoCardList(Appoint query) {
		if(StringUtils.isEmpty(query)) throw new BaseException("参数错误！参数不能为空！");
		if(StringUtils.isEmpty(query.getHosNo())) throw new BaseException("参数错误！hosNo不能为空！");
		if(StringUtils.isEmpty(query.getTerminalUser())) throw new BaseException("参数错误！terminalUser不能为空！");
		
		List<Object> values = new ArrayList<Object>();
		// mysql
 		// StringBuilder jql = new StringBuilder( " from Appoint where terminalUser = ? and hosNo = ? and status is not null and trim(status) <> '' and (proNo is null or trim(proNo) = '') order by appointTime desc, abs(num)"); 
		// oracle
		StringBuilder jql = new StringBuilder( " from Appoint where terminalUser = ? and hosNo = ? and status is not null and (proNo is null or trim(proNo) = '') order by appointTime desc, abs(num)");
		values.add(query.getTerminalUser());
		values.add(query.getHosNo());
		
		return this.appointManager.find(jql.toString(),values.toArray());
	}
}
