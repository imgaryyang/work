package com.lenovohit.ssm.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Area;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.Model;
import com.lenovohit.ssm.base.model.Operator;
import com.lenovohit.ssm.base.model.Org;
import com.lenovohit.ssm.base.model.User;


@RestController
@RequestMapping("/ssm/base/machine")
public class MachineRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Machine,String> machineManager;
	@Autowired
	private GenericManagerImpl<Area, String> areaManager;
	@Autowired
	private GenericManagerImpl<Model, String> modelManager;
	@Autowired
	private GenericManagerImpl<Org, String> orgManager;
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		Machine query =  JSONUtils.deserialize(data, Machine.class);
		StringBuilder jql = new StringBuilder( " from Machine where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code like ? ");
			values.add("%"+query.getCode()+"%");
		}
		if(!StringUtils.isEmpty(query.getMngName())){
			jql.append(" and mngName like ? ");
			values.add("%"+query.getMngName()+"%");
		}
		if(!StringUtils.isEmpty(query.getMac())){
			jql.append(" and mac like ? ");
			values.add("%"+query.getMac()+"%");
		}
		jql.append(" order by code ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		machineManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Machine> machines = machineManager.find(" from Machine machine order by code");
		return ResultUtils.renderSuccessResult(machines);
	}
	@RequestMapping(value = "/list/getCashboxOptions", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCashboxList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Machine> machines = machineManager.find(" from Machine machine where cashbox = '1' order by hisUser");
		return ResultUtils.renderSuccessResult(machines);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Machine machine =  JSONUtils.deserialize(data, Machine.class);
		User user = this.getCurrentUser();
		Date now = new Date();
		machine.setUpdateTime(now);
		machine.setUpdateUser(user.getName());
		machine.setRegTime(now);
		machine.setRegUser(user.getName());
		Model model = this.modelManager.get(machine.getModelId());
		Org org = this.orgManager.get(machine.getMngId());
		machine.setModelCode(model.getCode());
		machine.setSupplier(model.getSupplier());
		machine.setMngId(org.getId());
		machine.setMngCode(org.getCode());
		machine.setMngName(org.getName());
		machine.setMngType(org.getType());
		Machine saved = this.machineManager.save(machine);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/login",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forLogin(){
		HttpServletRequest request = this.getRequest();
		String mac = request.getHeader("mac");
		List<Machine> machines = this.machineManager.find("from Machine where mac = ? ", mac);
		if(machines.size() == 1 ){
			Machine machine = machines.get(0);
			return ResultUtils.renderSuccessResult(machine);
		}
		return null;
	}
	@RequestMapping(value="/register/{area}/{floor}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegiste(@PathVariable("floor") String floor, @PathVariable("area") String area, @RequestBody String data){
		try {
			Area building = areaManager.findOne(" from Area where code = ? ", area);
			Area hospital = areaManager.get(building.getParent());
			String address = hospital.getCode()+"-"+building.getCode()+"-"+floor;
			String mac = this.getMacAddr();
			String ip = this.getIpAddr();
			List<Machine> machines = this.machineManager.find("from Machine where mac = ? ", mac);
			Machine machine = null;
			if(machines.size() > 1 ){
				return ResultUtils.renderFailureResult("重复注册");
			}else if(machines.size() == 1 ) {
				Machine param =  JSONUtils.deserialize(data, Machine.class);
				machine = machines.get(0);
				machine.setCode(param.getCode()); 
				machine.setName (param.getName()); 
				machine.setMngCode(param.getMngCode()); 
				machine.setMngName(param.getMngName()); 
				machine.setCashbox(param.getCashbox());
				machine.setHisUser(param.getHisUser());
				machine.setAddress(address);
			} else {
				machine =  JSONUtils.deserialize(data, Machine.class);
			}
			
			if(StringUtils.isEmpty(machine.getHisUser())){
				machine.setHisUser("0001");
			}
			machine.setHospitalNo(hospital.getCode());
			machine.setHospitalName(hospital.getName());
			machine.setIp(ip);
			machine.setMac(mac);
			
			Operator user = this.getCurrentOperator();
			machine.setUpdateTime(DateUtils.getCurrentDate());
			machine.setUpdateUser(user.getName());
			machine.setRegTime(DateUtils.getCurrentDate());
			if(StringUtils.isEmpty(machine.getRegUser())){
				machine.setRegUser(user.getName());
			}
			
			Machine saved = this.machineManager.save(machine);
			return ResultUtils.renderSuccessResult(saved);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdate(@RequestBody String data){
		Machine machine =  JSONUtils.deserialize(data, Machine.class);
		Machine model = this.machineManager.get(machine.getId());
		Model model2 = this.modelManager.get(machine.getModelId());
		Org org = this.orgManager.get(machine.getMngId());
		machine.setDetails(model.getDetails());
		machine.setUpdateTime(DateUtils.getCurrentDate());
		machine.setUpdateUser(this.getCurrentUser().getName());
		machine.setModelCode(model2.getCode());
		machine.setSupplier(model2.getSupplier());
		machine.setMngId(org.getId());
		machine.setMngCode(org.getCode());
		machine.setMngName(org.getName());
		machine.setMngType(org.getType());
		Machine saved = this.machineManager.save(machine);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		try {
			this.machineManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM HCP_ROLE  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.machineManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
}
