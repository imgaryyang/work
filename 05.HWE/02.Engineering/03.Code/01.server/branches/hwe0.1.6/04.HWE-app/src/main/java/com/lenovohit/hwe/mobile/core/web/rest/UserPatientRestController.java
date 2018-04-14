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
 *
 */
@RestController
@RequestMapping("/hwe/app/userPatient") 
public class UserPatientRestController extends MobileBaseRestController {
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
		//后期讨论
		Patient model = JSONUtils.deserialize(data, Patient.class);
		UserPatient userPatient = this.userPatientManager.findOne(" from UserPatient where idNo = ? and userId = ? ", model.getIdNo(), user.getId());
		if(userPatient != null){
			return ResultUtils.renderFailureResult("同身份证号就诊人已创建，请重新输入");
		}
		Patient patient = this.patientManager.findOne("from Patient p where p.idNo = ? ", model.getIdNo());
		if(patient == null ){
			patient = this.patientManager.save(model);
		}
		userPatient = JSONUtils.deserialize(data, UserPatient.class);
		userPatient.setPatientId(patient.getId());	
		userPatient.setUserId(user.getId());
		this.userPatientManager.save(userPatient);

		return ResultUtils.renderSuccessResult(userPatient);
	}

	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/updateUserPatients", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result updateUserPatients(@RequestBody(required=false) String data){
		User user = this.getCurrentUser();
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		String jql = "from UserPatient u where u.userId = ? ";
		String name = null;
		if(null != dataMap && !dataMap.isEmpty()){
			if(!StringUtils.isEmpty(dataMap.get("name"))){
				name = dataMap.get("name").toString();
				jql += " and name like ? " ;
				name = "%" + name + "%";
			}
		}
		jql += " order by u.relation asc ";
		List<UserPatient> userPatients = null;
		if(StringUtils.isEmpty(name)){
			userPatients = this.userPatientManager.find(jql, user.getId());
		}else{
			userPatients = this.userPatientManager.find(jql, user.getId(), name);
		}
		for(UserPatient up : userPatients){
			List<Profile> profiles = getProfile(up.getId(),null);
			up.setProfiles(profiles);
		}
		return ResultUtils.renderSuccessResult(userPatients);
	}

	/**
	 * ELH_BASE_002 维护常用就诊人信息
	 * 
	 * @param id
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
		this.userPatientManager.save(model);

		return ResultUtils.renderSuccessResult(model);
	} 
	/**
	 * 查询档案
	 * 绑定档案
	 * @param data
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/queryProfile", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result queryProfile(@RequestBody String data) {
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
			if(list.size() == 1){
				Profile p = list.get(0);
				if(!isexist(userPatientId, p.getId())){
					UserPatientProfile userPatientProfile = new UserPatientProfile();
					userPatientProfile.setStatus(UserPatientProfile.DEFAULT_OK);
					userPatientProfile.setProfile(p);
					userPatientProfile.setUserPatient(userPatient);
					userPatientProfile.setHospitalId(hospitalId);
					this.userPatientProfileManager.save(userPatientProfile);
				}
			}else{
				for(Profile profile : list){
					//绑定档案  后期需要根据是否是医保档设置默认档案
					if(!isexist(userPatientId, profile.getId())){
						UserPatientProfile userPatientProfile = new UserPatientProfile();
						if("1".equals(profile.getType())){
							userPatientProfile.setStatus(UserPatientProfile.DEFAULT_OK);
						}else{
							userPatientProfile.setStatus(UserPatientProfile.DEFAULT_NO);
						}
						userPatientProfile.setProfile(profile);
						userPatientProfile.setUserPatient(userPatient);
						userPatientProfile.setHospitalId(hospitalId);
						this.userPatientProfileManager.save(userPatientProfile);
					}				    
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
	@RequestMapping(value = "/identify/{mobile}/{smscode}/{hospitalId}/{patientId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result identify(@PathVariable(value = "mobile") String mobile,
			@PathVariable(value = "smscode") String smscode,
			@PathVariable(value = "hospitalId") String hospitalId,
			@PathVariable(value = "patientId") String patientId) {
		System.out.println(mobile+" : "+smscode+" : "+hospitalId+": "+patientId);
		//先验证手机验证码是否正确
		if(!StringUtils.isEmpty(mobile) && !StringUtils.isEmpty(smscode)){
			//手机验证通过后，修改关联表中认证字段
			if(identify(hospitalId, patientId)){
				return this.getMyProfiles(patientId);
			}
		}
		return ResultUtils.renderFailureResult("认证失败");
	}
	/**
	 * 判断就诊人和档案关联关系是否存在
	 * @param userPatientId
	 * @param profileId
	 * @return
	 */
	public Boolean isexist(String userPatientId, String profileId){
		String sql = "from UserPatientProfile p where p.userPatient.id = ? and p.profile.id = ?";
		List<UserPatientProfile> list = this.userPatientProfileManager.find(sql, userPatientId, profileId);
		if(list.isEmpty()){
			return false;
		}
		return true;
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
	 *  删除常用就诊人 
	 * 
	 * @param id
	 * @return
	 */
	@SuppressWarnings(value="rawtypes")
	@RequestMapping(value = "/removeSelected", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result removeSelected(@RequestBody String data) {
		User user = this.getCurrentUser();
		UserPatient userPatient = this.getDefaultPatient(user);
		String id = userPatient.getId();
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("delete from APP_USER_PATIENT where id in (");
			for (int i = 0; i < ids.size(); i++) {
				if(!id.equals(ids.get(i).toString())){
					idSql.append("?");
					idvalues.add(ids.get(i).toString());
					if (i != ids.size() - 1)
						idSql.append(",");
				}
			}
			idSql.append(")");
			
			this.userPatientManager.executeSql(idSql.toString(), idvalues.toArray());
			deleteUserPatientProfile(ids, id);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 删除就诊人后删除对应绑定的档案
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
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		this.userPatientManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 查询常用就诊人列表 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		User user = this.getCurrentUser();
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
	 * 获取所有就诊人
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getUserPatients(@RequestParam(value = "data", defaultValue = "") String data){
		User user = this.getCurrentUser();
		Hospital hospital = JSONUtils.deserialize(data, Hospital.class);
		String jql = "from UserPatient t where 1=1 and t.userId = ? order by t.relation asc";
		List<UserPatient> list = this.userPatientManager.find(jql, user.getId());
		for(UserPatient userPatient : list){
			if(hospital == null){
				List<Profile> profiles = getProfile(userPatient.getId(), null);
				userPatient.setProfiles(profiles);
			}else{
				List<Profile> profiles = getProfile(userPatient.getId(), hospital.getId());
				userPatient.setProfiles(profiles);
			}
		}
		return ResultUtils.renderSuccessResult(list);
	}
	/**
	 * 
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

	public String Object2String(Object object){
		if(object == null){
			return "";
		}
		return object.toString();
	}
	/**
	 * 复制数据从patient到userpatient
	 * @param patient
	 * @param userPatient
	 */
	public void copyPatient(Patient patient, UserPatient userPatient){
		patient.setAddress(userPatient.getAddress());
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
