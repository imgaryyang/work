package com.lenovohit.hwe.mobile.app.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.shiro.authc.AuthAccountToken;
import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.SmsMessage;
import com.lenovohit.hwe.mobile.core.model.UserPatient;
import com.lenovohit.hwe.mobile.core.model.UserPatientProfile;
import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;
import com.lenovohit.hwe.org.model.Account;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.treat.model.Patient;
import com.lenovohit.hwe.treat.model.Profile;

@RestController
@RequestMapping("/hwe/app")
public class AppUserRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Account, String> accountManager;
	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<UserPatientProfile, String> userPatientProfileManager;
	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;
	
	/**
	 * 注册/登录 功能
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegister(@RequestBody String data) {
		try {
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			if(null == dataMap && dataMap.isEmpty()){
				throw new BaseException("输入数据为空！");
			}
			String hospitalId = "";
			if(dataMap.containsKey("hospitalId")){
				hospitalId = dataMap.get("hospitalId").toString();
			}
			Object mobile = dataMap.get("mobile");
			// 业务数据校验
			if (StringUtils.isEmpty(mobile)) {
				throw new BaseException("非法请求！");
			}
			User user = null;
			Account model = this.accountManager.findOne("from Account u where u.username=? ", mobile);
			if (null != model && !StringUtils.isEmpty(model.getId())) {
				model.setUsername(mobile.toString());
				model.setPassword("12345678");
				Subject subject = SecurityUtils.getSubject();
				AuthAccountToken authToken = new AuthAccountToken(model);
				subject.login(authToken);
				user = this.getMobileUser(hospitalId);
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			} else {
				String token = "";
				if(dataMap.containsKey("token")){
					token = dataMap.get("token").toString();
				}
				SmsMessage smsMessage = this.smsMessageManager.get(token);
				if(null == smsMessage){
					throw new BaseException("非法请求！");
				}
				model = new Account();
				model.setUsername(mobile.toString());
				model.setPassword("12345678");
				model.setType(Account.TYPE_APP);
				model = (Account) AuthUtils.encryptAccount(model);
				user = this.userManager.findOne(" from User where mobile = ?", mobile.toString());
				if(null != user && StringUtils.isNotEmpty(user.getId())) {
					user.setLoginAccount(model);
				}else {
					user = new User();
					user.setIsActive("1");
					user.setMobile(mobile.toString());
					user.setLoginAccount(model);
					user = this.userManager.save(user);
				}
				model.setUser(user);
				this.accountManager.save(model);
				model.setPassword("12345678");
				Subject subject = SecurityUtils.getSubject();
				AuthAccountToken authToken = new AuthAccountToken(model);
				subject.login(authToken);
				user = this.getMobileUser(hospitalId);
				user.setSessionId(this.getSession().getId());
				return ResultUtils.renderSuccessResult(user);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("请求出错");
		}
	}
	/**
	 * 用户登陆
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/loginOld", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		Account model = JSONUtils.deserialize(data, Account.class);
		try {
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken token = new AuthAccountToken(model);
			subject.login(token);
			User user = this.getMobileUser(null);
			System.out.println("id:" + user.getId());
			return ResultUtils.renderSuccessResult(user);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("用户名或密码错误");
		}		
	}
	/**
	 * 获取user信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/getUser", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forGetUser(@RequestParam(value = "data", defaultValue = "") String data){
		Map dataMap = null;
		String hospitalId = "";
		if(StringUtils.isNotEmpty(data)){
			dataMap = JSONUtils.deserialize(data, Map.class);
			if(dataMap.containsKey("hospitalId")){
				hospitalId = dataMap.get("hospitalId").toString();
			}
		}
		User user = this.getMobileUser(hospitalId);
		return ResultUtils.renderSuccessResult(user);
	}
	@RequestMapping(value = "/updataUser", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result updataUser(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		Account model = JSONUtils.deserialize(data, Account.class);
		try {
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken token = new AuthAccountToken(model);
			subject.login(token);
			User user = this.getCurrentUser();
			user.setSessionId(this.getSession().getId());
			List<UserPatient> userPatients = this.userPatientManager.find(" from UserPatient u where u.userId = ? order by u.relation asc ", user.getId());
			for(UserPatient up : userPatients){
				List<Profile> profiles = getProfile(up.getId(),null);
				up.setProfiles(profiles);
			}
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("userPatients", userPatients);
			
			UserPatient userPatient = this.getPatient(user);
			map.put("currPatient", userPatient);
			user.setMap(map);
			return ResultUtils.renderSuccessResult(user);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("更新出错");
		}		
	}
	/**
	 * 用户注册
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegiser(@RequestBody String data){
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Map dataMap = JSONUtils.deserialize(data, Map.class);
		if (null == dataMap) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		String mobile = dataMap.get("mobile").toString();
		String password = dataMap.get("password").toString();
		if (StringUtils.isEmpty(mobile)) {
			throw new BaseException("手机号为空！");
		}
		if (StringUtils.isEmpty(password)) {
			throw new BaseException("密码为空！");
		}
		// 验证用户存在
		Account account = this.accountManager.findOne("from Account u where u.username=? ", mobile);
		User user = null;
		if (null != account) {
			return ResultUtils.renderFailureResult("该手机号码已经注册，请直接登录！");
		} else {
			account = new Account();
			user = new User();
		}
		account.setUsername(mobile);
		account.setPassword(password);
		account.setType(Account.TYPE_APP);
		account = (Account) AuthUtils.encryptAccount(account);

		user.setIsActive("1");
		user.setMobile(mobile);
		user.setLoginAccount(account);
		user = this.userManager.save(user);

		account.setUser(user);
		this.accountManager.save(account);
		return ResultUtils.renderSuccessResult(user);
	}
	/**
	 * 退出登陆
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLogout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
			return ResultUtils.renderSuccessResult();
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("用户名或密码错误，请从新登陆");
		}
		
	}
	/**
	 * 重置密码
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/resetPwd", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forResetPassword(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		Account model = JSONUtils.deserialize(data, Account.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}

		// 业务数据校验
		String username = model.getUsername();
		String password = model.getPassword();
		//暂时为手机号登陆
		if (StringUtils.isEmpty(username)) {
			return ResultUtils.renderFailureResult("用户名为空！");
		}
		if (StringUtils.isEmpty(password)) {
			return ResultUtils.renderFailureResult("登陆密码为空！");
		}
		// 验证用户存在
		Account account = this.accountManager.findOne("from Account u where u.username = ? ", username);
		if (account == null) {
			return ResultUtils.renderFailureResult("用户未注册！");
		}
		AuthUtils.encryptAccount(model);
		account.setPassword(model.getPassword());
		this.accountManager.save(account);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 重置密码
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/changePwd", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangePassword(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		if (null == dataMap) {
			throw new BaseException("输入数据为空！");
		}
		// 业务数据校验
		String oldPassword = dataMap.get("oldPassword").toString();
		String password = dataMap.get("password").toString();
		User user = this.getCurrentUser();
		Account account = (Account) user.getLoginAccount(); //获取原账户
		account.setPassword(oldPassword);
		try{
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken token = new AuthAccountToken(account);
			subject.login(token);
		}catch (Exception e) {
			return ResultUtils.renderFailureResult("原密码错误");
		}
		account.setPassword(password);
		account = (Account) AuthUtils.encryptAccount(account);//加密
		accountManager.save(account);
		return ResultUtils.renderSuccessResult(user);
	}
	/**
	 * 修改个人资料
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/doSave", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangeUserInfo(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		model = this.userManager.save(model);
		//保存用户信息的同时保存patient
		UserPatient userPatient = copyUserToPatient(model);
		model = this.getMobileUser(null);
		return ResultUtils.renderSuccessResult(model);
	}
	
	public UserPatient copyUserToPatient(User user){
		Patient patient = null;
		String jql = "from Patient p where p.idNo = ?";
		patient = this.patientManager.findOne(jql, user.getIdNo());
		if(patient != null){
			patient.setAddress(user.getAddress());
			patient.setAge(user.getAge());
			patient.setEmail(user.getEmail());
			patient.setIdNo(user.getIdNo());
			patient.setMobile(user.getMobile());
			patient.setGender(user.getGender());
			patient.setName(user.getName());
		}else{
			patient = new Patient();
			patient.setAddress(user.getAddress());
			patient.setAge(user.getAge());
			patient.setEmail(user.getEmail());
			patient.setIdNo(user.getIdNo());
			patient.setMobile(user.getMobile());
			patient.setGender(user.getGender());
			patient.setName(user.getName());
		}
		this.patientManager.save(patient);
		
		UserPatient userPatient = null;
		String usql = "from UserPatient u where u.userId = ? and u.patientId = ? ";
		userPatient = this.userPatientManager.findOne(usql, user.getId(), patient.getId());
		if(userPatient != null){
			userPatient.setAddress(user.getAddress());
			userPatient.setIdNo(user.getIdNo());
			userPatient.setMobile(user.getMobile());
			userPatient.setGender(user.getGender());
			userPatient.setName(user.getName());
		}else{
			userPatient = new UserPatient();
			userPatient.setAddress(user.getAddress());
			userPatient.setIdNo(user.getIdNo());
			userPatient.setMobile(user.getMobile());
			userPatient.setGender(user.getGender());
			userPatient.setName(user.getName());
			userPatient.setPatientId(patient.getId());
			userPatient.setUserId(user.getId());
			userPatient.setRelation("0");
		}
		userPatient = userPatientManager.save(userPatient);
		return userPatient;
	}
	
	public UserPatient getPatient(User user){
		String id = user.getId();
		String idNo = user.getIdNo();
		UserPatient userPatient = new UserPatient();
		if(!StringUtils.isEmpty(idNo)){
			userPatient = this.userPatientManager.findOne(" from UserPatient u where u.userId = ? and u.idNo = ? ", id, idNo);
			List<Profile> profiles = getProfile(userPatient.getId(),null);
			userPatient.setProfiles(profiles);
		}
		return userPatient;
	}
	/**
	 * 获取当前就诊人关联的档案
	 * @param userPatientId
	 * @return
	 */
	public List<Profile> getProfile(String userPatientId, String hospitalId){
		String sql = "select p.ID,p.NAME,p.NO,p.HOS_ID,p.HOS_NO,p.HOS_NAME,p.ID_NO,r.STATUS,r.IDENTIFY,p.GENDER,p.MOBILE from APP_USER_PATIENT_PROFILE r "
				+ "left join TREAT_PROFILE p ON r.PRO_ID = p.ID JOIN APP_USER_PATIENT a "
				+ "ON a.ID = r.UP_ID where a.id = '"+ userPatientId + "'";
		if(!StringUtils.isEmpty(hospitalId)){
			sql += " and r.HOSPITAL_Id = '"+hospitalId+"'";
		}
		List<?> list = this.userPatientProfileManager.findBySql(sql);
		List<Profile> profiles = new ArrayList<Profile>();
		for(Object obj : list){
			Object[] objects = (Object[]) obj;
			Profile profile = new Profile();
			profile.setId(Object2String(objects[0]));   
			profile.setName(Object2String(objects[1]));
			profile.setNo(Object2String(objects[2]));
			profile.setHosId(Object2String(objects[3]));
			profile.setHosNo(Object2String(objects[4]));
			profile.setHosName(Object2String(objects[5]));
			profile.setIdNo(Object2String(objects[6]));
			profile.setStatus(Object2String(objects[7]));
			profile.setIdentify(Object2String(objects[8]));
			profile.setGender(Object2String(objects[9]));
			profile.setMobile(Object2String(objects[10]));
			profiles.add(profile);
		}
		return profiles;
	}
	public String Object2String(Object object){
		if(object == null){
			return "";
		}
		return object.toString();
	}
}
