package com.lenovohit.hcp.base.web.rest;

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
import com.lenovohit.hcp.base.model.HcpRole;
import com.lenovohit.hcp.base.model.HcpRoleMenuRela;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HcpUserRoleRela;
import com.lenovohit.hcp.base.model.Menu;

/**
 * 授权管理
 * 
 */
@RestController
@RequestMapping("/hcp/base/auth")
public class HcpAuthRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpUserRoleRela, String> hcpUserRoleRelaManager;
	@Autowired
	private GenericManager<HcpRoleMenuRela, String> hcpRoleMenuRelaManager;

	/***************************** 权限-user *******************************************/
	/**
	 * 根据角色id取关联用户
	 * 
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value = "/user/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserPage(@PathVariable("roleId") String roleId) {
		// HcpUser current = this.getCurrentUser();
		List<?> users = hcpUserRoleRelaManager
				.find("select rela.user.id from HcpUserRoleRela rela " + " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}

	/**
	 * 为用户授权角色
	 * 
	 * @param roleId
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = "/user/assign/{roleId}/{userId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignUser(@PathVariable("roleId") String roleId, @PathVariable("userId") String userId) {
		List<HcpUserRoleRela> relas = hcpUserRoleRelaManager
				.find("from HcpUserRoleRela rela where rela.role.id = ? and rela.user.id = ? ", roleId, userId);
		if (relas.size() == 1) {
			return ResultUtils.renderSuccessResult();
		} else if (relas.size() > 1) {
			return ResultUtils.renderFailureResult();
		} else {
			HcpUser user = new HcpUser();
			HcpRole role = new HcpRole();
			user.setId(userId);
			role.setId(roleId);
			HcpUserRoleRela rela = new HcpUserRoleRela();
			rela.setUser(user);
			rela.setRole(role);
			this.hcpUserRoleRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 为用户解除角色授权
	 * 
	 * @param roleId
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = "/user/unassign/{roleId}/{userId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignUser(@PathVariable("roleId") String roleId, @PathVariable("userId") String userId) {
		List<HcpUserRoleRela> relas = hcpUserRoleRelaManager
				.find("from HcpUserRoleRela rela where rela.role.id = ? and rela.user.id = ? ", roleId, userId);
		if (relas.size() == 1) {
			hcpUserRoleRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		} else if (relas.size() > 1) {
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}

	/***************************** 权限-menu *******************************************/
	/**
	 * 根据角色id取对应菜单
	 * 
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value = "/menu/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMenuList(@PathVariable("roleId") String roleId) {
		List<?> users = hcpRoleMenuRelaManager
				.find("select rela.menu.id from HcpRoleMenuRela rela " + " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}

	/**
	 * 为角色分配菜单权限
	 * 
	 * @param roleId
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/menu/assign/{roleId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignMenu(@PathVariable("roleId") String roleId, @RequestBody String data) {
		List<?> ids = JSONUtils.deserialize(data, List.class);
		List<?> relas = hcpRoleMenuRelaManager
				.findBySql("SELECT ROLE_ID,MENU_ID FROM HCP_ROLE_MENU_RELA  WHERE ROLE_ID = ? ", roleId);
		System.out.println("新ids " + ids);
		List<String> deleteIds = new ArrayList<String>();
		StringBuilder deleteSql = new StringBuilder();
		deleteSql.append("DELETE FROM HCP_ROLE_MENU_RELA  WHERE MENU_ID IN (");

		Map<String, Object> addMap = new HashMap<String, Object>();
		Map<String, Object> existMap = new HashMap<String, Object>();

		for (Object id : ids) {
			addMap.put(id.toString(), new byte[0]);
		}

		for (Object obj : relas) {
			Object[] rela = (Object[]) obj;
			Object value = addMap.get(rela[1]);
			if (value == null) {
				if (deleteIds.size() > 0)
					deleteSql.append(",");
				deleteSql.append("'").append(rela[1]).append("'");
				deleteIds.add(rela[1].toString());
			}
			existMap.put(rela[1].toString(), new byte[0]);
		}
		deleteSql.append(")");
		if (deleteIds.size() > 0) {
			deleteSql.append(" AND ROLE_ID = ? ");
			System.out.println(deleteSql);
			this.hcpRoleMenuRelaManager.executeSql(deleteSql.toString(), roleId);
		}
		List<HcpRoleMenuRela> creates = new ArrayList<HcpRoleMenuRela>();
		for (Object id : ids) {
			Object value = existMap.get(id.toString());
			if (value == null) {// 新id数据库不存在
				Menu menu = new Menu();
				HcpRole role = new HcpRole();
				menu.setId(id.toString());
				role.setId(roleId);
				HcpRoleMenuRela rela = new HcpRoleMenuRela();
				rela.setMenu(menu);
				rela.setRole(role);
				creates.add(rela);
				System.out.println("add " + id);
			}
		}
		this.hcpRoleMenuRelaManager.batchSave(creates);
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 为角色解除菜单授权
	 * 
	 * @param roleId
	 * @param menuId
	 * @return
	 */
	@RequestMapping(value = "/menu/unassign/{roleId}/{menuId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignMenu(@PathVariable("roleId") String roleId, @PathVariable("menuId") String menuId) {
		List<HcpRoleMenuRela> relas = hcpRoleMenuRelaManager
				.find("from HcpRoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId, menuId);
		if (relas.size() == 1) {
			hcpRoleMenuRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		} else if (relas.size() > 1) {
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}

	/***************************** 权限-reource *******************************************/
	/**
	 * 根据角色id取已授权的资源
	 * 
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value = "/resource/list/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forResourceList(@PathVariable("roleId") String roleId) {
		List<?> users = hcpRoleMenuRelaManager
				.find("select rela.menu.id from HcpRoleMenuRela rela " + " where rela.role.id = ? ", roleId);
		return ResultUtils.renderPageResult(users);
	}

	/**
	 * 为角色授权资源
	 * 
	 * @param roleId
	 * @param resourceId
	 * @return
	 */
	@RequestMapping(value = "/resource/assign/{roleId}/{resourceId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forAssignResource(@PathVariable("roleId") String roleId,
			@PathVariable("resourceId") String resourceId) {
		List<HcpRoleMenuRela> relas = hcpRoleMenuRelaManager
				.find("from HcpRoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId, resourceId);
		if (relas.size() == 1) {
			return ResultUtils.renderSuccessResult();
		} else if (relas.size() > 1) {
			return ResultUtils.renderFailureResult();
		} else {
			Menu menu = new Menu();
			HcpRole role = new HcpRole();
			menu.setId(resourceId);
			role.setId(roleId);
			HcpRoleMenuRela rela = new HcpRoleMenuRela();
			rela.setMenu(menu);
			rela.setRole(role);
			this.hcpRoleMenuRelaManager.save(rela);
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 解除角色资源授权
	 * 
	 * @param roleId
	 * @param reourceId
	 * @return
	 */
	@RequestMapping(value = "/reource/unassign/{roleId}/{reourceId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUnAssignResource(@PathVariable("roleId") String roleId,
			@PathVariable("reourceId") String reourceId) {
		List<HcpRoleMenuRela> relas = hcpRoleMenuRelaManager
				.find("from HcpRoleMenuRela rela where rela.role.id = ? and rela.menu.id = ? ", roleId, reourceId);
		if (relas.size() == 1) {
			hcpRoleMenuRelaManager.delete(relas.get(0));
			return ResultUtils.renderSuccessResult();
		} else if (relas.size() > 1) {
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
