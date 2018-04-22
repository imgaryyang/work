package com.lenovohit.ssm.base.web.rest;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.MachineRoleRela;
import com.lenovohit.ssm.base.model.Menu;
import com.lenovohit.ssm.base.model.Operator;
import com.lenovohit.ssm.base.model.OperatorRoleRela;
import com.lenovohit.ssm.base.model.Role;
import com.lenovohit.ssm.base.model.RoleMenuRela;
import com.lenovohit.ssm.base.model.User;
import com.lenovohit.ssm.base.model.UserRoleRela;

/**
 * 授权管理
 * 
 */
@RestController
@RequestMapping("/ssm/base/auth")
public class AuthRestController extends SSMBaseRestController {

	/*****************************权限-user*******************************************/
	@Autowired
	private GenericManager<UserRoleRela, String> userRoleRelaManager;
	@Autowired
	private GenericManager<MachineRoleRela, String> machineRoleRelaManager;
	@Autowired
	private GenericManager<OperatorRoleRela, String> operatorRoleRelaManager;
	@Autowired
	private GenericManager<RoleMenuRela, String> roleMenuRelaManager;
	
	@RequestMapping(value = "/user/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserPage(@PathVariable("roleId") String roleId){
		// User current = this.getCurrentUser();
		List<?> users = userRoleRelaManager.find("select rela.user.id from UserRoleRela rela "
				+ " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}
	@RequestMapping(value = "/user/assign/{roleId}/{userId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignUser(@PathVariable("roleId") String roleId,@PathVariable("userId") String userId){
		List<UserRoleRela> relas = userRoleRelaManager.find("from UserRoleRela rela where rela.role.id = ? and rela.user.id = ? ", roleId,userId);
		if(relas.size() == 1){
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}else{
			User user = new User();
			Role role = new Role();
			user.setId(userId);
			role.setId(roleId);
			UserRoleRela rela = new UserRoleRela();
			rela.setUser(user);
			rela.setRole(role);
			this.userRoleRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/user/unassign/{roleId}/{userId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignUser(@PathVariable("roleId") String roleId,@PathVariable("userId") String userId){
		List<UserRoleRela> relas = userRoleRelaManager.find("from UserRoleRela rela where rela.role.id = ? and rela.user.id = ? ", roleId,userId);
		if(relas.size() == 1){
			userRoleRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	/*****************************权限-machine*******************************************/
	@RequestMapping(value = "/machine/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMachinePage(@PathVariable("roleId") String roleId){
		// User current = this.getCurrentUser();
		List<?> machines = machineRoleRelaManager.find("select rela.machine.id from MachineRoleRela rela "
				+ " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(machines);
	}
	@RequestMapping(value = "/machine/assign/{roleId}/{machineId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMachineUser(@PathVariable("roleId") String roleId,@PathVariable("machineId") String machineId){
		List<MachineRoleRela> relas = machineRoleRelaManager.find("from MachineRoleRela rela where rela.role.id = ? and rela.machine.id = ? ", roleId,machineId);
		if(relas.size() == 1){
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}else{
			Machine machine = new Machine();
			Role role = new Role();
			machine.setId(machineId);
			role.setId(roleId);
			MachineRoleRela rela = new MachineRoleRela();
			rela.setMachine(machine);
			rela.setRole(role);
			this.machineRoleRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/machine/unassign/{roleId}/{machineId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignMachine(@PathVariable("roleId") String roleId,@PathVariable("machineId") String machineId){
		List<MachineRoleRela> relas = machineRoleRelaManager.find("from MachineRoleRela rela where rela.role.id = ? and rela.machine.id = ? ", roleId,machineId);
		if(relas.size() == 1){
			machineRoleRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/*****************************权限-operator*******************************************/
	@RequestMapping(value = "/operator/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOperatorPage(@PathVariable("roleId") String roleId){
		// User current = this.getCurrentUser();
		List<?> operators = operatorRoleRelaManager.find("select rela.operator.id from OperatorRoleRela rela "
				+ " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(operators);
	}
	@RequestMapping(value = "/operator/assign/{roleId}/{operatorId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOperatorUser(@PathVariable("roleId") String roleId,@PathVariable("operatorId") String operatorId){
		List<OperatorRoleRela> relas = operatorRoleRelaManager.find("from OperatorRoleRela rela where rela.role.id = ? and rela.operator.id = ? ", roleId,operatorId);
		if(relas.size() == 1){
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}else{
			Operator operator = new Operator();
			Role role = new Role();
			operator.setId(operatorId);
			role.setId(roleId);
			OperatorRoleRela rela = new OperatorRoleRela();
			rela.setOperator(operator);
			rela.setRole(role);
			this.operatorRoleRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/operator/unassign/{roleId}/{operatorId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignOperator(@PathVariable("roleId") String roleId,@PathVariable("operatorId") String operatorId){
		List<OperatorRoleRela> relas = operatorRoleRelaManager.find("from OperatorRoleRela rela where rela.role.id = ? and rela.operator.id = ? ", roleId,operatorId);
		if(relas.size() == 1){
			operatorRoleRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	/*****************************权限-menu*******************************************/
	@RequestMapping(value = "/menu/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMenuList(@PathVariable("roleId") String roleId){
		List<?> users = roleMenuRelaManager.find("select rela.menu.id from RoleMenuRela rela "
				+ " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}
	@RequestMapping(value = "/menu/assign/{roleId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignMenu(@PathVariable("roleId") String roleId,@RequestBody String data){
		List<?> ids =  JSONUtils.deserialize(data, List.class);
		List<?> relas = roleMenuRelaManager.findBySql("SELECT ROLE_ID,MENU_ID FROM SSM_ROLE_MENU_RELA  WHERE ROLE_ID = ? ", roleId);
		System.out.println("新ids "+ids);
		List<String> deleteIds = new ArrayList<String>();
		StringBuilder deleteSql = new StringBuilder();
		deleteSql.append("DELETE FROM SSM_ROLE_MENU_RELA  WHERE MENU_ID IN (");
		
		Map<String,Object> addMap = new HashMap<String,Object>();
		Map<String,Object> existMap = new HashMap<String,Object>();
		
		for(Object id : ids ){
			addMap.put(id.toString(), new byte[0]);
		}
		
		for(Object obj : relas){
			Object[] rela = (Object[])obj;
			Object value = addMap.get(rela[1]);
			if(value == null ){
				if(deleteIds.size()>0)deleteSql.append(",");
				deleteSql.append("'").append(rela[1]).append("'");
				deleteIds.add(rela[1].toString());
			}
			existMap.put(rela[1].toString(), new byte[0]);
		}
		deleteSql.append(")");
		if(deleteIds.size() > 0){
			deleteSql.append(" AND ROLE_ID = ? ");
			System.out.println(deleteSql);
			this.roleMenuRelaManager.executeSql(deleteSql.toString(), roleId);
		}
		List<RoleMenuRela> creates = new ArrayList<RoleMenuRela> ();
		for(Object id : ids ){
			Object value = existMap.get(id.toString());
			if(value == null ){// 新id数据库不存在
				Menu menu = new Menu();
				Role role = new Role();
				menu.setId(id.toString());
				role.setId(roleId);
				RoleMenuRela rela = new RoleMenuRela();
				rela.setMenu(menu);
				rela.setRole(role);
				creates.add(rela);
				System.out.println("add "+ id);
			}
		}
		this.roleMenuRelaManager.batchSave(creates);
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/menu/unassign/{roleId}/{menuId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignMngMenu(@PathVariable("roleId") String roleId,@PathVariable("menuId") String menuId){
		List<RoleMenuRela> relas = roleMenuRelaManager.find("from RoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId,menuId);
		if(relas.size() == 1){
			roleMenuRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	/*****************************权限-reource*******************************************/
	@RequestMapping(value = "/resource/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forResourceList(@PathVariable("roleId") String roleId){
		List<?> users = roleMenuRelaManager.find("select rela.menu.id from RoleMenuRela rela "
				+ " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}
	@RequestMapping(value = "/resource/assign/{roleId}/{resourceId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignResource(@PathVariable("roleId") String roleId,@PathVariable("resourceId") String resourceId){
		List<RoleMenuRela> relas = roleMenuRelaManager.find("from RoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId,resourceId);
		if(relas.size() == 1){
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}else{
			Menu menu = new Menu();
			Role role = new Role();
			menu.setId(resourceId);
			role.setId(roleId);
			RoleMenuRela rela = new RoleMenuRela();
			rela.setMenu(menu);
			rela.setRole(role);
			this.roleMenuRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/reource/unassign/{roleId}/{reourceId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignResource(@PathVariable("roleId") String roleId,@PathVariable("reourceId") String reourceId){
		List<RoleMenuRela> relas = roleMenuRelaManager.find("from RoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId,reourceId);
		if(relas.size() == 1){
			roleMenuRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		}else if(relas.size() > 1){
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
