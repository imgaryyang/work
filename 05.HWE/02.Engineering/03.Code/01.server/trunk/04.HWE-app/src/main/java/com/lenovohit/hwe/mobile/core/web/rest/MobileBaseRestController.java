package com.lenovohit.hwe.mobile.core.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.mobile.core.model.UserPatient;
import com.lenovohit.hwe.mobile.core.model.UserPatientProfile;
import com.lenovohit.hwe.org.model.Habits;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Profile;

public class MobileBaseRestController  extends OrgBaseRestController{
	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<UserPatientProfile, String> userPatientProfileManager;
	@Autowired
	private GenericManager<Habits, String> habitsManager;
	
	protected UserPatient getDefaultPatient(User user){
		String id = user.getId();
		String idNo = user.getIdNo();
		UserPatient userPatient = new UserPatient();
		if(!StringUtils.isEmpty(idNo)){
			userPatient = this.userPatientManager.findOne(" from UserPatient u where u.userId = ? and u.idNo = ? ", id, idNo);
			return userPatient;
		}
		return null;
	}
	protected User getMobileUser(String userId, String hospitalId){
		User user = this.userManager.get(userId);
		if(null == user){
			throw new BaseException("该用户不存在！");
		}
		List<UserPatient>  userPatients = this.userPatientManager.find(" from UserPatient u where u.userId = ? order by u.relation asc ", user.getId());
		for(UserPatient up : userPatients){
			List<Profile> profiles = getProfile(up.getId(),hospitalId);
			up.setProfiles(profiles);
		}
		if(userPatients.isEmpty()){
			userPatients = new ArrayList<UserPatient>();
		}
		List<Habits> habits = this.habitsManager.find("from Habits where userId = ? ", user.getId());
		if(habits.isEmpty()){
			habits = new ArrayList<Habits>();
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userPatients", userPatients);
		map.put("habits", habits);
		user.setMap(map);
		return user;
	}
	protected User getMobileUser(String hospitalId){
		User user = this.getCurrentUser();
		List<UserPatient>  userPatients = this.userPatientManager.find(" from UserPatient u where u.userId = ? order by u.relation asc ", user.getId());
		for(UserPatient up : userPatients){
			List<Profile> profiles = getProfile(up.getId(),hospitalId);
			up.setProfiles(profiles);
		}
		if(userPatients.isEmpty()){
			userPatients = new ArrayList<UserPatient>();
		}
		List<Habits> habits = this.habitsManager.find("from Habits where userId = ? ", user.getId());
		if(habits.isEmpty()){
			habits = new ArrayList<Habits>();
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userPatients", userPatients);
		map.put("habits", habits);
		user.setMap(map);
		return user;
	}
	/**
	 * 获取当前就诊人关联的档案
	 * @param userPatientId
	 * @return
	 */
	public List<Profile> getProfile(String userPatientId, String hospitalId){
		String sql = "select p.ID,p.NAME,p.NO,p.HOS_ID,p.HOS_NO,p.HOS_NAME,p.ID_NO,r.STATUS,r.IDENTIFY,p.GENDER,p.MOBILE,p.TYPE from APP_USER_PATIENT_PROFILE r "
				+ "left join TREAT_PROFILE p ON r.PRO_ID = p.ID JOIN APP_USER_PATIENT a "
				+ "ON a.ID = r.UP_ID where a.id = '"+ userPatientId + "'";
		if(StringUtils.isNotEmpty(hospitalId)){
			sql += " and r.HOSPITAL_Id = '"+hospitalId+"'";
		}
		sql += " order by HOS_ID ";
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
			profile.setType(Object2String(objects[11]));
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
