package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.HospitalManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpAccount;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpPrintTemplate;
import com.lenovohit.hcp.base.model.HcpRole;
import com.lenovohit.hcp.base.model.HcpRoleMenuRela;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HcpUserDept;
import com.lenovohit.hcp.base.model.HcpUserRoleRela;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.Menu;
import com.lenovohit.hcp.base.utils.PinyinUtil;

@Service("hosInfoManager")
@Transactional
public class HosInfoManagerImpl implements HospitalManager {

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<HcpRole, String> hcpRoleManager;
	@Autowired
	private GenericManager<HcpPrintTemplate, String> hcpPrintTemplateManager;
	@Autowired
	private GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
	@Autowired
	private GenericManager<Menu, String> menuManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<HcpUserDept, String> hcpUserDeptManager;
	@Autowired
	private GenericManager<HcpUserRoleRela, String> hcpUserRoleRelaManager;
	@Autowired
	private GenericManager<HcpRoleMenuRela, String> hcpRoleMenuRelaManager;
	@Autowired
	private GenericManager<HcpAccount, String> hcpAccountManager;
	//@Autowired
	//private PhaStoreManager phaStoreManager;

	@Override
	public Hospital createHospital(String superHospitalId,Hospital hospital,HcpUser user) {
		Hospital superHos = hospitalManager.findOne("  from Hospital  where hosId = ?",superHospitalId);
		if(superHos!=null){
			hospital = hospitalManager.save(hospital);
			Date now = new Date();
			String hosId = hospital.getHosId();
			//数据字典
			copyDicToNewHospital(user,hosId,now);
			//科室
			copyDeptToNewHospital(user, hosId,now);
			//打印模板
			copyPrintToNewHospital(user, hosId,now);
			//角色
			//copyRoleToNewHospital(user, hosId, now);
			//控制参数
			copyCtrlParamToNewHospital(user, hosId, now);
			
			
			//菜单
			//copyMenuToNewHospital(user, hosId, now);
			//创建管理员账户
			createManagerForNewHospital(user, hospital, now);
			
			
			
			//压测初始化数据
			//2，人员数据（包括账户、角色、收款员）
			List<HcpUser> clerk =copyUserToNewHospital(user, hosId, now);
			//8，药品库存维护
			//copyDrugToNewHospital(clerk.get(0), user.getHosId(), now);
			//9，物资库存维护（收费项目）
			//copyMaterialToNewHospital(clerk.get(0), user.getHosId(), now);
		}else{
			System.err.println("========上级医院不存在=======");
		}
		return null;
	}

	/**
	 * 复制集团中的字典表到新建医院中
	 * @param user 创建者信息
	 * @param hosId //新建医院id
	 */
	private void copyDicToNewHospital(HcpUser user,String hosId,Date now) {
		StringBuilder jql = new StringBuilder( "from Dictionary where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		List<Dictionary> dicList = dictionaryManager.find(jql.toString(), values.toArray());
		List<Dictionary> dList = new ArrayList<Dictionary>();
		if(dicList!=null && dicList.size()>0){
			for(Dictionary dic:dicList){
				Dictionary d = new Dictionary();
				d.setHosId(hosId);
				d.setCreateOper(user.getName());
				d.setCreateOperId(user.getId());
				d.setCreateTime(now);
				d.setUpdateOper(user.getName());
				d.setUpdateOperId(user.getId());
				d.setUpdateTime(now);
				d.setColumnDis(dic.getColumnDis());
				d.setColumnGroup(dic.getColumnGroup());
				d.setColumnName(dic.getColumnName());
				d.setColumnKey(dic.getColumnKey());
				d.setColumnVal(dic.getColumnVal());
				d.setSortId(dic.getSortId());
				d.setDefaulted(dic.isDefaulted());
				d.setSpellCode(dic.getSpellCode());
				d.setWbCode(dic.getWbCode());
				d.setUserCode(dic.getUserCode());
				d.setStop(dic.isStop());
				d.setCreateOper(user.getName());
				d.setCreateOperId(user.getId());
				d.setCreateTime(now);
				d.setUpdateOper(user.getName());
				d.setUpdateOperId(user.getId());
				d.setUpdateTime(now);
				dList.add(d);
			}
			dictionaryManager.batchSave(dList);
		}
	}
	
	/**
	 *拷贝集团科室信息 
	 *@param user 创建者信息
	 * @param hosId //新建医院id
	 */
	private void copyDeptToNewHospital(HcpUser user,String hosId,Date now) {
		List<Department> Depts = departmentManager.find(" from Department dept where hosId = ? order by deptId ",user.getHosId());
		List<Department> dps = new ArrayList<Department>();
		if(Depts!=null && Depts.size()>0){
			for(Department dp:Depts){
				Department d = new Department();
				d.setDeptId(dp.getDeptId());
				d.setDeptName(dp.getDeptName());
				d.setSpellCode(dp.getSpellCode());
				d.setWbCode(dp.getWbCode());
				d.setCustomCode(dp.getCustomCode());
				d.seteName(dp.geteName());
				d.setOtherName(dp.getOtherName());
				d.setDeptType(dp.getDeptType());
				d.setIsRegdept(dp.getIsRegdept());
				d.setStopFlag(dp.getStopFlag());
				d.setHosId(hosId);
				d.setCreateOper(user.getName());
				d.setCreateOperId(user.getId());
				d.setCreateTime(now);
				d.setUpdateOper(user.getName());
				d.setUpdateOperId(user.getId());
				d.setUpdateTime(now);
				dps.add(d);
			}
			departmentManager.batchSave(dps);
		}
	}
	
	/**
	 *拷贝集团角色信息 
	 *@param user 创建者信息
	 * @param hosId //新建医院id
	 */
	private void copyRoleToNewHospital(HcpUser user,String hosId,Date now) {
		List<HcpRole> roles = hcpRoleManager.find(" from HcpRole role where hosId = ? ",user.getHosId());
		List<HcpRole> list = new ArrayList<HcpRole>();
		if(roles!=null && roles.size()>0){
			for(HcpRole p:roles){
				if(!p.getCode().equals("super")&&!p.getCode().equals("admin")){
					HcpRole d = new HcpRole();
					d.setCode(p.getCode());
					d.setName(p.getName());
					d.setParent(p.getParent());
					d.setDescription(p.getDescription());
					d.setHosId(hosId);
					d.setCreateTime(now);
					d.setUpdateTime(now);
					d = hcpRoleManager.save(d);
					grandMenuToRole(p, d);
				}
			}
		}
	}
	
	/**
	 * 拷贝打印模板
	 * @param user
	 * @param hosId
	 */
	private void copyPrintToNewHospital(HcpUser user,String hosId,Date now) {
		List<HcpPrintTemplate> templateList = hcpPrintTemplateManager.find(" from HcpPrintTemplate role where hosId = ? ",user.getHosId());
		List<HcpPrintTemplate> printList = new ArrayList<HcpPrintTemplate>();
		if(templateList!=null && templateList.size()>0){
			for(HcpPrintTemplate p:templateList){
				HcpPrintTemplate d = new HcpPrintTemplate();
				d.setHosId(hosId);
				d.setBizCode(p.getBizCode());
				d.setBizName(p.getBizName());
				d.setPrintTemplate(p.getPrintTemplate());
				d.setPrintDataManager(p.getPrintDataManager());
				d.setEffectiveFlag(p.getEffectiveFlag());
				d.setVersion(p.getVersion());
				d.setCreateOper(user.getName());
				d.setCreateOperId(user.getId());
				d.setCreateTime(now);
				d.setUpdateOper(user.getName());
				d.setUpdateOperId(user.getId());
				d.setUpdateTime(now);
				printList.add(d);
			}
			hcpPrintTemplateManager.batchSave(printList);
		}
	}

	/**
	 * 复制控制参数
	 * @param user
	 * @param hosId
	 * @param now
	 */
	private void copyCtrlParamToNewHospital(HcpUser user,String hosId,Date now) {
		List<HcpCtrlParam> templateList = phaCtrlParamUtil.find(" from HcpCtrlParam role where hosId = ? ",user.getHosId());
		List<HcpCtrlParam> list = new ArrayList<HcpCtrlParam>();
		if(templateList!=null && templateList.size()>0){
			for(HcpCtrlParam p:templateList){
				HcpCtrlParam d = new HcpCtrlParam();
				d.setControlClass(p.getControlClass());
				d.setControlId(p.getControlId());
				d.setControlNote(p.getControlNote());
				d.setControlParam(p.getControlParam());
				d.setStopFlag(p.getStopFlag());
				
				d.setHosId(hosId);
				d.setCreateOper(user.getName());
				d.setCreateOperId(user.getId());
				d.setCreateTime(now);
				d.setUpdateOper(user.getName());
				d.setUpdateOperId(user.getId());
				d.setUpdateTime(now);
				list.add(d);
			}
			//phaCtrlParamUtil.batchSave(list);
		}
	}
	
	
	
	/**
	 * 为新医院创建菜单
	 * @param user
	 * @param hosId
	 * @param now
	 */
	private void copyMenuToNewHospital(HcpUser user,String hosId,Date now) {
		List<Menu> templateList = menuManager.find(" from Menu role where hosId = ? ",user.getHosId());
		List<Menu> list = new ArrayList<Menu>();
		if(templateList!=null && templateList.size()>0){
			for(Menu p:templateList){
				Menu d = new Menu();
				d.setName(p.getName());
				d.setAlias(p.getAlias());
				d.setCode(p.getCode());
				d.setPathname(p.getPathname());
				d.setUrl(p.getUrl());
				d.setCoordinate(p.getCoordinate());
				d.setColspan(p.getColspan());
				d.setRowspan(p.getRowspan());
				d.setColor(p.getColor());
				d.setIcon(p.getIcon());
				d.setSort(p.getSort());
				d.setParent(p.getParent());
				
//				d.setHosId(hosId);
//				d.setCreateOper(user.getName());
//				d.setCreateOperId(user.getId());
//				d.setCreateTime(now);
//				d.setUpdateOper(user.getName());
//				d.setUpdateOperId(user.getId());
//				d.setUpdateTime(now);
				list.add(d);
			}
			menuManager.batchSave(list);
		}
	}
	
	/**
	 * 创建医院管理员
	 * @param user
	 * @param hosId
	 * @param now
	 */
	private void createManagerForNewHospital(HcpUser user,Hospital hospital,Date now) {
		String hosId = hospital.getHosId();
		HcpUser admin = new HcpUser();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		admin.setCreateDate(time);
		admin.setEffectDate(time);
		admin.setHosId(hosId);
		admin.setName(hospital.getHosName());
		admin.setEnName(hospital.geteName());
		admin.setExpired(false);
		admin.setActive(true);
		admin.setPinyin(PinyinUtil.getFullSpell(admin.getName()));
		
		//所属医院
		List<Object> values = new ArrayList<Object>();
		values.add(hosId);
		values.add("000157");
		List<Department> Depts = departmentManager.find(" from Department dept where hosId = ?  and deptId = ?  order by deptId ",values.toArray());
		if(Depts!=null && Depts.size()>0){
			for(Department d:Depts){
				admin.setDeptId(d.getId());
			}
		}
		
		admin = hcpUserManager.save(admin);
		//创建登录用户
		createLoginUserForUser(hosId, admin);
		//设置登录科室
		grantDeptToUser(hosId, admin);
		//给用户分配角色
		grantRoleToUser(user, admin,hospital,now);
	}

	private void createLoginUserForUser(String hosId, HcpUser admin) {
		HcpAccount model = new HcpAccount();
		model.setUsername(hosId);
		model.setUserId(admin.getId());
		model.setType("user");
		model.setStatus("1");
		if (StringUtils.isEmpty(model.getUsername()))
			System.err.println("请填写登录账户名！");
		
		List<HcpAccount> accounts = (List<HcpAccount>)hcpAccountManager.find("from HcpAccount where username = '" + model.getUsername() + "' ");
		if (accounts.size() > 0)
			System.err.println("您填写的登录账户名已经存在，请重新填写！");
		
		model.setPassword("666666");
		AuthUtils.encryptAccount(model);
		this.hcpAccountManager.save(model);
	}

	/**
	 * 将集团管理中的admin角色授权给新建医院的超级管理员
	 * 将角色授权给管理员用户
	 * @param hosId
	 * @param admin
	 */
	private void grantRoleToUser(HcpUser user, HcpUser admin,Hospital hospital,Date now) {
		List<Object> rValues = new ArrayList<Object>();
		rValues.add(user.getHosId());
		rValues.add("admin");
		//机构中超级管理员角色
		HcpRole role = hcpRoleManager.findOne(" from HcpRole role where hosId = ? and code = ? ",rValues.toArray());
//		HcpRole d = new HcpRole();
//		d.setCode(role.getCode());
//		d.setName(role.getName());
//		d.setDescription(hospital.getHosName());
//						
//		d.setHosId(admin.getHosId());
//		d.setCreateTime(now);
//		d.setUpdateTime(now);
		//保存新角色
		//d = hcpRoleManager.save(d);
		HcpUserRoleRela rela = new HcpUserRoleRela();
		rela.setUser(admin);
		rela.setRole(role);
		this.hcpUserRoleRelaManager.save(rela);
		
		//grandMenuToRole(role, d);
	}

	/**
	 * 给角色分配权限
	 * @param hosId
	 * @param role
	 */
	private void grandMenuToRole(HcpRole r, HcpRole role) {
		List<HcpRoleMenuRela> templateList = hcpRoleMenuRelaManager.find(" from HcpRoleMenuRela where  role = ? ",r);
		if(templateList!=null && templateList.size()>0){
			List<HcpRoleMenuRela> creates = new ArrayList<HcpRoleMenuRela>();
			for(HcpRoleMenuRela d:templateList){
				HcpRoleMenuRela relaMenu = new HcpRoleMenuRela();
				relaMenu.setMenu(d.getMenu());
				relaMenu.setRole(role);
				creates.add(relaMenu);
			}
			this.hcpRoleMenuRelaManager.batchSave(creates);
		}
	}

	/**
	 * 将所有科室设置成管理员可登录科室
	 * @param hosId
	 * @param admin
	 */
	private void grantDeptToUser(String hosId, HcpUser admin) {
		List<Department> Depts = departmentManager.find(" from Department dept where hosId = ? order by deptId ",hosId);
		if(Depts!=null && Depts.size()>0){
			for(Department d:Depts){
				if(d.getDeptId().equals("000157")){
					HcpUserDept model = new HcpUserDept();
					model.setUserId(admin.getId());
					model.setUserName(admin.getName());
					model.setDeptId(d.getId());
					model.setDeptCode(d.getDeptId());
					model.setDeptName(d.getDeptName());
					model.setStopFlag("1");
					hcpUserDeptManager.save(model);
				}
			}
		}
	}
	
	/**
	 * 为新医院创建用户，并返回收费员
	 * @param user
	 * @param hosId
	 * @param now
	 */
	private List<HcpUser> copyUserToNewHospital(HcpUser user,String hosId,Date now) {
		List<HcpUserRoleRela> userList = hcpUserRoleRelaManager.find(" from HcpUserRoleRela  where user.active = 1 and user.hosId = ? ",user.getHosId());
		List<HcpRole> roleList = hcpRoleManager.find(" from HcpRole  where hosId = ? ",hosId);
		List<HcpUser> list = new ArrayList<HcpUser>();
		List<HcpUserRoleRela> relalist = new ArrayList<HcpUserRoleRela>();
		if(userList!=null && userList.size()>0){
			for(HcpUserRoleRela p:userList){
				HcpUser d = new HcpUser();
				BeanUtils.copyProperties(d, p.getUser());
				d.setHosId(hosId);
				d.setId(null);
				hcpUserManager.save(d);
				
				HcpAccount model = new HcpAccount();
				model.setUsername(d.getName()+hosId);
				model.setUserId(d.getId());
				model.setType("user");
				model.setStatus("1");
				model.setPassword("666666");
				AuthUtils.encryptAccount(model);
				this.hcpAccountManager.save(model);
				
				HcpUserRoleRela rela = new HcpUserRoleRela();
				for(HcpRole role:roleList){
					if(p.getRole().getCode().equals(role.getCode())){
						rela.setRole(role);
					}
				}
				rela.setUser(d);
				relalist.add(rela);
				
				if("5".equals(d.getUserType())){
					list.add(d);
				}
			}
			hcpUserRoleRelaManager.batchSave(relalist);
		}
		return list;
	}
	
	/**
	 * 为新医院创建药品库存
	 * @param user
	 * @param hosId
	 * @param now
	 */
	/*private void copyDrugToNewHospital(HcpUser user,String hosId,Date now) {
		List<PhaInputInfo> templateList = phaInputInfoManager.find(" from PhaInputInfo pha where hosId = ? ",hosId);
		
		if(templateList!=null && templateList.size()>0){
			//修改库存信息
			List<PhaInputInfo> returnList = phaStoreManager.phaInput(inputPha(templateList,user), user);
		}
	}*/
	
	
	
	
	/**
	 * 为新医院创建物资库存
	 * @param user
	 * @param hosId
	 * @param now
	 */
	/*private void copyMaterialToNewHospital(HcpUser user,String hosId,Date now) {
        List<MatInputInfo> templateList = phaInputInfoManager.find(" from MatInputInfo pha where hosId = ? ",user.getHosId());
		
		if(templateList!=null && templateList.size()>0){
			//修改库存信息
			List<PhaInputInfo> returnList = phaStoreManager.phaInput(input(templateList,user), user);
		}
		
		
	}*/
	
	

}
