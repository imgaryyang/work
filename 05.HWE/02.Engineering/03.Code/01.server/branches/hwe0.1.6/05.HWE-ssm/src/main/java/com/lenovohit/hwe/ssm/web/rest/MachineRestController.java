package com.lenovohit.hwe.ssm.web.rest;

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
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.ssm.model.Machine;
import com.lenovohit.hwe.ssm.model.Operator;
@RestController
@RequestMapping("/hwe/ssm/machine")
public class MachineRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Machine,String> machineManager;
	@RequestMapping(value = "/loginMachine", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getloginMachine(){
		Machine machie = this.getCurrentMachine();
		return ResultUtils.renderSuccessResult( machie);
	}
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Machine order by sort");
		machineManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
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
		List<Machine> machines = machineManager.find(" from Machine machine  ");
		return ResultUtils.renderSuccessResult(machines);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList() {
		List<Machine> machines = machineManager.find(" from Machine machine ");
		return ResultUtils.renderSuccessResult(machines);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMachine(@RequestBody String data){
		Machine machine =  JSONUtils.deserialize(data, Machine.class);
		
		Machine saved = this.machineManager.save(machine);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/register",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forRegisterMachine(@RequestBody String data){
		try {
			HttpServletRequest request = this.getRequest();
			String mac = request.getHeader("mac");
			String ip = this.getIpAddr();
			System.out.println("request mac "+mac);
			List<Machine> machines = this.machineManager.find("from Machine where mac = ? ", mac);
			Machine machine=null;
			if(machines.size() == 1 ) {
				Machine param =  JSONUtils.deserialize(data, Machine.class);
				machine = machines.get(0);
				machine.setCode(param.getCode()); 
				machine.setName (param.getName()); 
				machine.setMngCode(param.getMngCode()); 
				machine.setMngName(param.getMngName()); 
			}else if(machines.size() > 1 ){
				return ResultUtils.renderFailureResult("重复注册");
			}else{
				machine =  JSONUtils.deserialize(data, Machine.class);
			}
			System.out.println("request ip "+ip);
			System.out.println("request user "+machine.getHisUser());
			if(StringUtils.isEmpty(machine.getHisUser())){
				machine.setHisUser("0001");
			}
			machine.setHospitalNo("02");
			machine.setHospitalName("龙南医院");
			machine.setMngId("4028a0815a91d9a5015a91da378b0000");
			machine.setMngType("1");
			machine.setIp(ip);
			machine.setMac(mac);
			Operator user = this.getCurrentOperator();
			Date now = new Date();
			machine.setUpdatedAt(now);
			machine.setUpdatedBy(user.getName());
			machine.setCreatedAt(now);
			if(StringUtils.isEmpty(machine.getCreatedBy())){
				machine.setCreatedBy(user.getName());
			}
			Machine saved = this.machineManager.save(machine);
			return ResultUtils.renderSuccessResult(saved);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdateMachine(@RequestBody String data){
		Machine machine =  JSONUtils.deserialize(data, Machine.class);
		Machine saved = this.machineManager.save(machine);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMachine(@PathVariable("id") String id){
		try {
			//TODO 校验
			this.machineManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println(data);
		@SuppressWarnings("rawtypes")
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
			System.out.println(idSql.toString());
			System.out.println(idvalues);
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
