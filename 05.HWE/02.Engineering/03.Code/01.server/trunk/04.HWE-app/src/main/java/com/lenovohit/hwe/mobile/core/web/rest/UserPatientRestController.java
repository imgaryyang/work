package com.lenovohit.hwe.mobile.core.web.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.lenovohit.hwe.base.model.SmsMessage;
import com.lenovohit.hwe.mobile.core.model.UserPatient;
import com.lenovohit.hwe.mobile.core.model.UserPatientProfile;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.treat.model.Hospital;
import com.lenovohit.hwe.treat.model.Patient;
import com.lenovohit.hwe.treat.model.Profile;
import com.lenovohit.hwe.treat.service.HisProfileService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;


/**
 * 常用就诊人
 * @author wang
 */
@RestController
@RequestMapping("/hwe/app/userPatient") 
public class UserPatientRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<Profile, String> profileManager;
	@Autowired
	private GenericManager<UserPatientProfile, String> userPatientProfileManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private HisProfileService hisProfileService;
	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;
	
	/**
	 * 新建常用就诊人信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		User user = this.getCurrentUser();
		if(user == null){
			return ResultUtils.renderFailureResult("请先登陆");
		}
		//自然人创建
		Patient model = JSONUtils.deserialize(data, Patient.class);
		Patient patient = this.patientManager.findOne("from Patient p where p.idNo = ? ", model.getIdNo());
		if(patient == null ){
			patient = this.patientManager.save(model);
		}
		//就诊人创建
		UserPatient userPatient = this.userPatientManager.findOne(" from UserPatient where idNo = ? and userId = ? ", model.getIdNo(), user.getId());
		if(userPatient != null){
			return ResultUtils.renderFailureResult("同身份证号就诊人已创建，请重新输入");
		}
		userPatient = JSONUtils.deserialize(data, UserPatient.class);
		userPatient.setPatientId(patient.getId());	
		userPatient.setUserId(user.getId());
		this.userPatientManager.save(userPatient);
		copyToUser(userPatient, user);
		return ResultUtils.renderSuccessResult(userPatient);
	}
	/**
	 * 更新常用就诊人信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		User user = this.getCurrentUser();
		if(user == null){
			return ResultUtils.renderFailureResult("请先登陆");
		}
		//后期讨论
		UserPatient model = JSONUtils.deserialize(data, UserPatient.class);
		if(StringUtils.isEmpty(model.getId())){
			throw new BaseException("请求出错！");
		}
		UserPatient userPatient = this.userPatientManager.get(model.getId());
		userPatient.setIdNo(model.getIdNo());
		userPatient.setName(model.getName());
		userPatient.setMobile(model.getMobile());
		userPatient.setAddress(model.getAddress());
		userPatient.setRelation(model.getRelation());
		this.userPatientManager.save(userPatient);
		copyToPatient(userPatient);
		copyToUser(userPatient, user);
		return ResultUtils.renderSuccessResult(userPatient);
	}
	/**
	 * 常用就诊人分页查询
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		User user = this.getCurrentUser();
		if(null == user) {
			throw new BaseException("请重新登录！");
		}
		StringBuilder sb = new StringBuilder("from UserPatient t where 1=1 ");
		List<String> cdList = new ArrayList<String>();
		sb.append("and t.userId = ?");
		cdList.add(user.getId());
		// 返回就诊人在该医院的档案

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(cdList.toArray());
		page.setQuery(sb.toString());
		this.patientManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 获取所有就诊人以及就诊人下的档案信息
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestBody String data){
		System.out.println("forList："+data);
		User user = this.getCurrentUser();
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String hospitalId = "";
		String name = "";
		if(dataMap.containsKey("hospitalId")){
			hospitalId = dataMap.get("hospitalId").toString();
		}
		if(dataMap.containsKey("name")){
			name = dataMap.get("name").toString();
		}
		String jql = "from UserPatient t where 1=1 and t.userId = ? ";
		if(StringUtils.isNotEmpty(name)){
			jql += " and name like ? " ;
			name = "%" + name + "%";
		}
		jql += " order by t.relation asc ";
		List<UserPatient> list = null;
		if(StringUtils.isNotEmpty(name)){
			list = this.userPatientManager.find(jql, user.getId(), name);
		}else{
			list = this.userPatientManager.find(jql, user.getId());
		}
		for(UserPatient userPatient : list){
			List<Profile> profiles = getProfile(userPatient.getId(), hospitalId);
			userPatient.setProfiles(profiles);
		}
		return ResultUtils.renderSuccessResult(list);
	}
	/**
	 * 档案绑定
	 * @param hospitalId
	 * @param patientId
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/bindProfile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBindProfile(@RequestBody String data){
		if(null == data){
			throw new BaseException("卡号信息为空！请从新操作");
		}
		System.out.println(data);
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String token = "";
		if(dataMap.containsKey("token")){
			token = dataMap.get("token").toString();
		}
		SmsMessage smsMessage = this.smsMessageManager.get(token);
		if(null == smsMessage){
			throw new BaseException("非法请求！");
		}
		if(!dataMap.containsKey("hospitalId")){
			throw new BaseException("医院信息错误！");
		}
		if(!dataMap.containsKey("patientId")){
			throw new BaseException("就诊人信息错误！");
		}
		if(!dataMap.containsKey("profiles")){
			throw new BaseException("卡号信息错误！");
		}
		String hospitalId = dataMap.get("hospitalId").toString();
		String patientId = dataMap.get("patientId").toString();
		String profiles = dataMap.get("profiles").toString();
		UserPatient userPatient = this.userPatientManager.get(patientId);
		if(null == userPatient){
			throw new BaseException("数据错误！");
		}
		Hospital hospital = this.hospitalManager.get(hospitalId);
		List<Profile> list = new ArrayList<Profile>();
		list = JSONUtils.parseArray(profiles, Profile.class);
		if(list.isEmpty()){
			throw new BaseException("档案信息错误！");
		}
		for(Profile profile : list){
			// 判断是否已绑定
			if(!isBind(profile, patientId)){
				// 落地档案数据
				profile.setHosId(hospitalId);
				profile.setHosName(hospital.getName());
				profile.setHosNo(hospital.getNo());
				this.profileManager.save(profile);
				UserPatientProfile userPatientProfile = new UserPatientProfile();
				userPatientProfile.setProfile(profile);
				userPatientProfile.setUserPatient(userPatient);
				userPatientProfile.setHospitalId(hospitalId);
				userPatientProfile.setIdentify(UserPatientProfile.IDENFITY_OK);
				this.userPatientProfileManager.save(userPatientProfile);
			}
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 就诊人信息查询
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id, @RequestParam(value = "data", defaultValue = "") String data){
		if(StringUtils.isEmpty(id)){
			throw new BaseException("请求出错！");
		}
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String hospitalId = "";
		if(dataMap.containsKey("hospitalId")){
			hospitalId = dataMap.get("hospitalId").toString();
		}
		UserPatient userPatient = this.userPatientManager.get(id);
		List<Profile> profiles = this.getProfile(id, hospitalId);
		userPatient.setProfiles(profiles);
		return ResultUtils.renderSuccessResult(userPatient);
	}
	/**
	 * 删除常用就诊人 
	 * @param id
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/removeSelected", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result removeSelected(@RequestBody String data) {
		User user = this.getCurrentUser();
		if(user == null){
			return ResultUtils.renderFailureResult("请先登陆");
		}
		List ids = JSONUtils.deserialize(data, List.class);
		List<String> list = this.getIds(user);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("delete from APP_USER_PATIENT where id in (");
			for (int i = 0; i < ids.size(); i++) {
				if(!list.contains(ids.get(i).toString())){
					idSql.append("?");
					idvalues.add(ids.get(i).toString());
					if (i != ids.size() - 1)
						idSql.append(",");
				}
			}
			idSql.append(")");
			this.userPatientManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 获取已绑定档案的就诊人的id数组
	 * @param user
	 * @return
	 */
	public List<String> getIds(User user){
		List<String> ids = new ArrayList<String>();
		List<UserPatient> userPatients = this.userPatientManager.find("from UserPatient where userId = ? ", user.getId());
		for(UserPatient userPatient : userPatients){
			List<UserPatientProfile> list = this.userPatientProfileManager.find("select count(*) from UserPatientProfile u where u.userPatient.id = ? ", userPatient.getId());
			if(list.size() > 0){
				ids.add(userPatient.getId());
			}
		}
		return ids;
	}
	/**
	 * 获取当前就诊人关联的档案
	 * @param userPatientId
	 * @return
	 */
	public List<Profile> getProfile(String userPatientId, String hospitalId){
		String sql = "select p.ID,p.NAME,p.NO,p.HOS_ID,p.HOS_NO,p.HOS_NAME,p.ID_NO,r.STATUS,r.IDENTIFY,p.GENDER,p.MOBILE "
				+ "from APP_USER_PATIENT_PROFILE r "
				+ "left join TREAT_PROFILE p ON r.PRO_ID = p.ID JOIN APP_USER_PATIENT a "
				+ "ON a.ID = r.UP_ID where a.id = '"+ userPatientId + "'";
		if(StringUtils.isNotEmpty(hospitalId)){
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
	public void copyToPatient(UserPatient userPatient){
		String id = userPatient.getPatientId();
		System.out.println(id);
		Patient patient = this.patientManager.get(id);
		if(StringUtils.isNotEmpty(userPatient.getAddress())) {
			patient.setAddress(userPatient.getAddress());
		}
		if(StringUtils.isNotEmpty(userPatient.getIdNo())){
			patient.setIdNo(userPatient.getIdNo());
		}
		if(StringUtils.isNotEmpty(userPatient.getName())){
			patient.setName(userPatient.getName());
		}
		if(StringUtils.isNotEmpty(userPatient.getMobile())){
			patient.setMobile(userPatient.getMobile());
		}
		if(StringUtils.isNotEmpty(userPatient.getGender())){
			patient.setGender(userPatient.getGender());
		}
		this.patientManager.save(patient);
	}
	public void copyToUser(UserPatient userPatient, User user){
		if(userPatient.getRelation().equals(UserPatient.REL_ME)) {
			if(StringUtils.isNotEmpty(userPatient.getAddress())) {
				user.setAddress(userPatient.getAddress());
			}
			if(StringUtils.isNotEmpty(userPatient.getIdNo())){
				user.setIdNo(userPatient.getIdNo());
			}
			if(StringUtils.isNotEmpty(userPatient.getName())){
				user.setName(userPatient.getName());
			}
			if(StringUtils.isNotEmpty(userPatient.getMobile())){
				user.setMobile(userPatient.getMobile());
			}
			if(StringUtils.isNotEmpty(userPatient.getGender())){
				user.setGender(userPatient.getGender());
			}
			this.userManager.save(user);
		}
	}
	public boolean isBind(Profile profile, String patientId) {
		Profile pro = this.profileManager.findOne("from Profile where no = ?", profile.getNo());
		if(null != pro && StringUtils.isNotEmpty(pro.getId())){
			UserPatientProfile userPatientProfile = userPatientProfileManager.findOne("from UserPatientProfile u where u.userPatient.id = ? "
					+ "and u.profile.id = ? ", patientId, pro.getId() );
			if(null != userPatientProfile){
				return true;
			}
		}
		return false;
	}
	/************************************************************  以下方法已弃用    ***********************************************************/
	/**
	 * 查询档案（并绑定档案）
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/queryProfile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forQueryProfile(@RequestBody String data) {
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String userPatientId = dataMap.get("patientId").toString();
		String hospitalId = dataMap.get("hospitalId").toString();

		UserPatient userPatient = this.userPatientManager.get(userPatientId);
		String idNo = userPatient.getIdNo();
		String name = userPatient.getName();
		System.out.println("身份证："+idNo+" >>医院id："+hospitalId);
//		Hospital hospital = this.hospitalManager.get(hospitalId);
//		Map<String, Object> request = new HashMap<String, Object>();
//		request.put("hosId", hospital.getNo());
//		request.put("idNo", idNo);
//		request.put("name", name);
//		List<Profile> list = this.hisProfileService.getProfiles(request);
		List<Profile> list = this.profileManager.find(" from Profile p where p.idNo = ? and p.hosId = ? and p.name = ? ", idNo, hospitalId, name );
		List<Profile> profiles = null;
		if(!list.isEmpty()){  
			for(Profile profile : list){
				if(!isExist(userPatientId, profile.getId())){
					UserPatientProfile userPatientProfile = new UserPatientProfile();
					userPatientProfile.setProfile(profile);
					userPatientProfile.setUserPatient(userPatient);
					userPatientProfile.setHospitalId(hospitalId);
					this.userPatientProfileManager.save(userPatientProfile);
				}				    
			}	
			profiles = getProfile(userPatientId,hospitalId);
			return ResultUtils.renderSuccessResult(profiles);
		}else{
			return ResultUtils.renderFailureResult("暂无相关档案");
		}
	}
	/**
	 * 认证档案
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/identify", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result identify(@RequestBody String data) {
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String mobile = dataMap.get("mobile").toString();
		String smscode = dataMap.get("smscode").toString();
		String hospitalId = dataMap.get("hospitalId").toString();
		String patientId = dataMap.get("patientId").toString();
		System.out.println(mobile+" : "+smscode+" : "+hospitalId+": "+patientId);
		//先验证手机验证码是否正确
		if(StringUtils.isNotEmpty(mobile) && StringUtils.isNotEmpty(smscode)){
			//手机验证通过后，修改关联表中认证字段
			
			if(identify(hospitalId, patientId)){
				return ResultUtils.renderSuccessResult("认证成功");
			}
		}
		return ResultUtils.renderFailureResult("认证失败");
	}
	
	/**
	 * 新建档案
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/addArchives/{hospitalId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result addArchives(@PathVariable(value="hospitalId") String hospitalId, @RequestBody String data){
		Profile model = JSONUtils.deserialize(data, Profile.class);
		// 传给his建档
		RestEntityResponse<Profile> response = this.hisProfileService.create(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	

	/**
	 * 设置默认档案
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/setDefaultProfile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result setDefaultProfile(@RequestBody String data) {
		try {
			System.out.println(data);
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			String userPatientId = dataMap.get("patientId").toString();
			String profileId = dataMap.get("profileId").toString();
			String hospitalId = dataMap.get("hospitalId").toString();
			//改变就诊人和档案关联表的状态
			List<UserPatientProfile> list = this.userPatientProfileManager.find(" from UserPatientProfile p where p.userPatient.id = ? and p.hospitalId = ?", userPatientId, hospitalId );
			for(UserPatientProfile p : list){
				if(p.getProfile().getId().equals(profileId)){
					p.setStatus("1");
				}else{
					p.setStatus("0");
				}
				this.userPatientProfileManager.save(p);
			}
			List<Profile> profiles = getProfile(userPatientId, hospitalId);
			return ResultUtils.renderSuccessResult(profiles);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}

	}
	/**
	 * 设置默认档案
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/setMyDefaultProfile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result setMyDefaultProfile(@RequestBody String data) {
		try {
			System.out.println(data);
			Map dataMap = JSONUtils.deserialize(data, Map.class);
			String userPatientId = dataMap.get("patientId").toString();
			String profileId = dataMap.get("profileId").toString();
			String hospitalId = dataMap.get("hospitalId").toString();
			//改变就诊人和档案关联表的状态
			List<UserPatientProfile> list = this.userPatientProfileManager.find(" from UserPatientProfile p where p.userPatient.id = ? and p.hospitalId = ?", userPatientId, hospitalId );
			for(UserPatientProfile p : list){
				if(p.getProfile().getId().equals(profileId)){
					p.setStatus("1");
				}else{
					p.setStatus("0");
				}
				this.userPatientProfileManager.save(p);
			}
			Result result = getMyProfiles(userPatientId);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}

	}

	/**
	 * 删除就诊人后删除对应绑定的档案（需修改：改为标记成已删除状态）
	 * @param ids
	 */
	@SuppressWarnings(value="rawtypes")
	public void deleteUserPatientProfile(List ids, String id) {
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		idSql.append("delete from APP_USER_PATIENT_PROFILE where UP_ID in (");
		for (int i = 0; i < ids.size(); i++) {
			if(!id.equals(ids.get(i).toString())){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
		}
		idSql.append(")");
		
		this.userPatientProfileManager.executeSql(idSql.toString(), idvalues.toArray());
	}
	/**
	 * 删除常用就诊人 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		User user = this.getCurrentUser();
		UserPatient userPatient = this.getDefaultPatient(user);
		String uid = userPatient.getId();
		if (id.equals(uid)) {
			return ResultUtils.renderFailureResult("本人不能删除");
		}
		this.userPatientManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * @param mobile
	 * @return
	 */
	@RequestMapping(value = "/getPatient/{mobile}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserPatient(@PathVariable("mobile") String mobile) {
		String jql = " from UserPatient u where 1=1 ";
		List<UserPatient> list = userPatientManager.find(jql);
		return ResultUtils.renderSuccessResult(list);
	}
	/**
	 * 绑定病人
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/addPatient", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forAddPatient(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		UserPatient userPatient = JSONUtils.deserialize(data, UserPatient.class);
		if(null == userPatient){
			throw new BaseException("无信息");
		}
		User user = this.getCurrentUser();
		userPatient.setUserId(user.getId());
		return ResultUtils.renderSuccessResult();
	}

	

	/**
	 * 获取就诊人所有就诊医院和相关档案
	 * @param patientId
	 * @return
	 */
	@RequestMapping(value = "/getMyProfiles/{patientId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyProfiles(@PathVariable String patientId){
		String jql = " from UserPatientProfile p where p.userPatient.id = ? ";
		List<UserPatientProfile> list = this.userPatientProfileManager.find(jql, patientId);
		Set<Hospital> hospitals = getMyHospitals(list);  
		if(hospitals.isEmpty()){
			return ResultUtils.renderFailureResult("暂无档案信息，请先绑定档案");
		}
		for(Hospital h : hospitals){
			List<Profile> data = new ArrayList<Profile>();
			String sql = " from UserPatientProfile p where p.userPatient.id = ? and p.hospitalId = ? ";
			List<UserPatientProfile> list2 = this.userPatientProfileManager.find(sql, patientId, h.getId());
			if(!list2.isEmpty()){
				for(UserPatientProfile p : list2){
					Profile profile = p.getProfile();
					profile.setStatus(p.getStatus());
					profile.setIdentify(p.getIdentify());
					data.add(profile);
				}
			}
			h.setProfiles(data);
		}
		return ResultUtils.renderSuccessResult(hospitals);
	}
	/**
	 * 获取与常用就诊人有关的医院
	 * @param list
	 * @return
	 */
	public Set<Hospital> getMyHospitals(List<UserPatientProfile> list){
		Set<Hospital> hospitals = new HashSet<Hospital>();
		String jql = "from Hospital where id = ? ";
		for(UserPatientProfile p : list){
			if(!StringUtils.isEmpty(p.getHospitalId())){
				Hospital hospital = this.hospitalManager.findOne(jql, p.getHospitalId());
				if(hospital != null && !StringUtils.isEmpty(hospital.getId())){
					hospitals.add(hospital);
				}
			}	
		}  
		return hospitals;	
	}
	/**
	 * 判断就诊人和档案关联关系是否存在
	 * @param userPatientId
	 * @param profileId
	 * @return
	 */
	public Boolean isExist(String userPatientId, String profileId){
		String sql = "from UserPatientProfile p where p.userPatient.id = ? and p.profile.id = ?";
		List<UserPatientProfile> list = this.userPatientProfileManager.find(sql, userPatientId, profileId);
		if(list.isEmpty()){
			return false;
		}
		return true;
	}
	
	public boolean identify(String hospitalId, String patientId){
		String jql = " from UserPatientProfile u where u.userPatient.id = ? and u.hospitalId = ?";
		List<UserPatientProfile> list = this.userPatientProfileManager.find(jql, patientId, hospitalId);
		if(!list.isEmpty()){
			for(UserPatientProfile u : list){
				u.setIdentify(UserPatientProfile.IDENFITY_OK);
				this.userPatientProfileManager.save(u);
			}
			return true;
		}
		return false;
	}
}
