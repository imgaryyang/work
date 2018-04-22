package com.lenovohit.ssm.app.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.elh.base.model.AppPatient;
import com.lenovohit.ssm.app.elh.base.model.MedicalCard;
import com.lenovohit.ssm.app.elh.base.model.Person;
import com.lenovohit.ssm.app.elh.base.model.UserPatient;


/******************************************************常用就诊人app方法*************************************************************************/
/**
 * 就诊人管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/userPatient") 
public class UserPatientRestController extends BaseRestController implements ApplicationContextAware {
	@Autowired
	private GenericManager<AppPatient, String> appPatientManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<MedicalCard, String> medicalCardManager;
	@Autowired
	private GenericManager<Person, String> personManager;

	/**
	 * ELH_BASE_002 保存常用就诊人信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/my/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		List<String> values = new ArrayList<String>();
		UserPatient userPatient = JSONUtils.deserialize(data, UserPatient.class);
		// 判断该常用就诊人是否存在
		String hql = "from UserPatient t where t.name=? and t.idno=? and status='1' and userId=?";
		values.add(userPatient.getName());
		values.add(userPatient.getIdno());
		values.add(userPatient.getUserId());
		UserPatient oldUserPatient = this.userPatientManager.findOne(hql,
				values.toArray());
		if (oldUserPatient != null){
			return ResultUtils.renderFailureResult("常用就诊人已存在");
		}else{
			//判断该就诊人是否存在
			String phql = "from Patient where status='1' and idno= ? ";
			AppPatient oldPatient = this.appPatientManager.findOne(phql, userPatient.getIdno());
			//添加就诊人
			AppPatient patient = new AppPatient();
			if(oldPatient!=null){
				if(oldPatient.getName().equals(userPatient.getName())){
					userPatient.setPatientId(oldPatient.getId());
					userPatient = this.userPatientManager.save(userPatient);
					return ResultUtils.renderSuccessResult(userPatient);
				}else{
					patient.setUserType(userPatient.getUserType());
					patient.setName(userPatient.getName());
					patient.setPhoto(userPatient.getPhoto());
					patient.setIdno(userPatient.getIdno());
					patient.setMobile(userPatient.getMobile());
					patient.setEmail(userPatient.getEmail());
					patient.setGender(userPatient.getGender());
					patient.setAddress(userPatient.getAddress());
					patient.setStatus(userPatient.getStatus());
					patient.setBirthday(userPatient.getBirthday());
					patient.setHeight(userPatient.getHeight());
					patient.setWeight(userPatient.getWeight());
				}
			}else{
				patient.setUserType(userPatient.getUserType());
				patient.setName(userPatient.getName());
				patient.setPhoto(userPatient.getPhoto());
				patient.setIdno(userPatient.getIdno());
				patient.setMobile(userPatient.getMobile());
				patient.setEmail(userPatient.getEmail());
				patient.setGender(userPatient.getGender());
				patient.setAddress(userPatient.getAddress());
				patient.setStatus(userPatient.getStatus());
				patient.setBirthday(userPatient.getBirthday());
				patient.setHeight(userPatient.getHeight());
				patient.setWeight(userPatient.getWeight());
			}
			patient = this.appPatientManager.save(patient);
			userPatient.setPatientId(patient.getId());
		}
		userPatient = this.userPatientManager.save(userPatient);
		return ResultUtils.renderSuccessResult(userPatient);
	}

	/**
	 * ELH_BASE_003 查询常用就诊人信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		UserPatient userPatient = this.userPatientManager.get(id);
		StringBuilder sb = new StringBuilder();
		List<String> cdList = new ArrayList<String>();
		cdList = new ArrayList<String>();
		sb.append("from MedicalCard t where t.state=1 and t.patientId=?");
		cdList.add(userPatient.getId());
		userPatient.setCardCount(this.userPatientManager.findByJql(sb.toString(), cdList).size());
		return ResultUtils.renderSuccessResult(userPatient);
	}

	/**
	 * ELH_BASE_002 维护常用就诊人信息
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/my/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		UserPatient userPatient = this.userPatientManager.get(id);
		/*这里有可能需要判断修改后的就诊人是不是和某个重复 然后统一为一个就诊人，暂时不做*/
//		UserPatient userPatientOld = this.userPatientManager.findOne("from UserPatient where idno = ? ", userPatient.getIdno());
//		if(userPatientOld!=null){
//			if(!userPatientOld.getName().equals(userPatient.getName())){
//				return ResultUtils.renderFailureResult("身份证号已存在并且姓名不符");
//			}
//		}
		AppPatient patient = this.appPatientManager.findOne("from Patient where id = ? and status='1'", userPatient.getPatientId());
		
		patient.setUserType(userPatient.getUserType());
		patient.setName(userPatient.getName());
		patient.setPhoto(userPatient.getPhoto());
		patient.setIdno(userPatient.getIdno());
		patient.setMobile(userPatient.getMobile());
		patient.setEmail(userPatient.getEmail());
		patient.setGender(userPatient.getGender());
		patient.setAddress(userPatient.getAddress());
		patient.setStatus(userPatient.getStatus());
		patient.setBirthday(userPatient.getBirthday());
		patient.setHeight(userPatient.getHeight());
		patient.setWeight(userPatient.getWeight());
		
		Map userPatientData = JSONUtils.deserialize(data, Map.class);
		if (null != userPatientData.get("userId")) {
			userPatient.setUserId(userPatientData.get("userId").toString()); // 用户
		}
		if (null != userPatientData.get("patientt")) {
			userPatient.setPatientId(userPatientData.get("Patientt").toString()); // 就诊人
		}
		if (null != userPatientData.get("usertype")) {
			userPatient.setUserType(userPatientData.get("usertype").toString()); // 用户类型
		}
		if (null != userPatientData.get("name")) {
			userPatient.setName(userPatientData.get("name").toString()); // 姓名
		}
		if (null != userPatientData.get("gender")) {
			userPatient.setGender(userPatientData.get("gender").toString()); // 性别
		}
		if (null != userPatientData.get("relationshi")) {
			userPatient.setRelationshi(userPatientData.get("relationshi").toString()); // 关系
		}
		if (null != userPatientData.get("alias")) {
			userPatient.setAlias(userPatientData.get("alias").toString()); // 别名
		}
		if (null != userPatientData.get("idno")) {
			userPatient.setIdno(userPatientData.get("idno").toString()); // 身份证号码
		}
		if (null != userPatientData.get("photo")) {
			userPatient.setPhoto(userPatientData.get("photo").toString()); // 头像
		}
		if (null != userPatientData.get("mobile")) {
			userPatient.setMobile(userPatientData.get("mobile").toString()); // 手机
		}
		if (null != userPatientData.get("email")) {
			userPatient.setEmail(userPatientData.get("email").toString()); // 邮箱
		}
		if (null != userPatientData.get("address")) {
			userPatient.setAddress(userPatientData.get("address").toString()); // 地址
		}
		if (null != userPatientData.get("status")) {
			userPatient.setStatus(userPatientData.get("status").toString()); // 状态
		}
		if (null != userPatientData.get("birthday")) {
			userPatient.setBirthday(userPatientData.get("birthday").toString()); // 出生日期
		}
		if (null != userPatientData.get("height")) {
			userPatient.setHeight(Double.parseDouble(userPatientData.get("height").toString())); // 身高
		}
		if (null != userPatientData.get("weight")) {
			userPatient.setWeight(Double.parseDouble(userPatientData.get("weight").toString())); // 体重
		}
		patient = this.appPatientManager.save(patient);
		UserPatient savedUserPatient = this.userPatientManager.save(userPatient);
		return ResultUtils.renderSuccessResult(savedUserPatient);
	}

	/**
	 * ELH_BASE_004 删除常用就诊人 
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		UserPatient userPatient = this.userPatientManager.get(id);
		//userPatient.setUnbindedAt(DateUtils.getCurrentDateTimeStr());
		if(!userPatient.getStatus().equals("0")){
			userPatient.setStatus("0");
		}
	    UserPatient saveUser = this.userPatientManager.save(userPatient);
		return ResultUtils.renderSuccessResult(saveUser);
	}

	/**
	 * ELH_BASE_001 查询常用就诊人列表 
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@SuppressWarnings({ "unchecked" })
	@RequestMapping(value = "/my/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");

		UserPatient userPatient = JSONUtils
				.deserialize(data, UserPatient.class);
		StringBuilder sb = new StringBuilder("from UserPatient t where 1=1 ");
		List<String> cdList = new ArrayList<String>();
		if (null != userPatient) {
			if (userPatient.getUserId() != null
					&& !"".equals(userPatient.getUserId().trim())) {
				sb.append(" and t.userId=? ");
				cdList.add(userPatient.getUserId());
			}
			if (userPatient.getStatus() != null
					&& !"".equals(userPatient.getStatus().trim())) {
				sb.append(" and t.status=? ");
				cdList.add(userPatient.getStatus());
			}
			if (userPatient.getName() != null
					&& !"".equals(userPatient.getName().trim())) {
				sb.append(" and t.name like ? ");
				cdList.add("%" + userPatient.getName() + "%");
			}
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(cdList.toArray());
		page.setQuery(sb.toString());
		this.userPatientManager.findPage(page);

		List<UserPatient> list = (List<UserPatient>) page.getResult();
		List<UserPatient> sortlist = new ArrayList<UserPatient>();
		UserPatient _userPatient = null;
		String jql = "from MedicalCard t where t.state=1 and t.patientId=?";
		for (int i = 0; null != list && i < list.size(); i++) {
			_userPatient = list.get(i);
			_userPatient.setCardCount(this.userPatientManager.getCount(jql,
					_userPatient.getPatientId()));
		}
		if (list != null) {
			int j = 0;
			for (int i = 0; i < list.size(); i++) {
				if (list.get(i).getCardCount() > 0) {
					sortlist.add(j, list.get(i));
					++j;
				} else {
					sortlist.add(i, list.get(i));
				}
			}
			page.setResult(sortlist);
		}
		return ResultUtils.renderSuccessResult(page);
	}
	
	/**
	 * ELH_BASE_006.5 判断人有没有实名认证
	 * 
	 * @return
	 */
	@RequestMapping(value = "/my/realperson/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forRealPerson(@PathVariable("id") String id) {
		Boolean flag = false;
		String patientstr = "from Patient where id = ? and status='1'";
		AppPatient patient = this.appPatientManager.findOne(patientstr, id);
		if (patient != null && patient.getPersonId() != null) {
			flag = true;
		}
		return ResultUtils.renderSuccessResult(flag);
	}

	/**
	 * ELH_BASE_006 绑定健康卡 流程未定，demo 3 TODO 注意事务完整性
	 * 
	 * @return
	 */
	@RequestMapping(value = "/bindcard/health", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBindHealthCard() {
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * ELH_BASE_005 绑定就诊卡 流程未定，demo 3 TODO 注意事务完整性
	 * 
	 * @return
	 */
	@RequestMapping(value = "/bindcard/medical", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBindMedicalCard() {
		return ResultUtils.renderSuccessResult();
	}
	/******************************************************常用就诊人app方法end*************************************************************************/

}
