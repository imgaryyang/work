package com.infohold.el.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.BeanUtils;

@Entity
@Table(name = "EL_USER")
public class User extends BaseIdModel implements AuthUser {

	private static final long serialVersionUID = 2674008211844809760L;
	
	private String name;
	private String idCardNo;
	private String gender;
	private String nickname;
	private String mobile;
	private String password;
	private String payPassword;
	private String email;
	private String wechat;
	private String weibo;
	private String qq;
	private String portrait;
	private String perHomeBg;
	private String siId;
	private String personId;
	
	private String sessionId;
	
	private String appId;
	private Set<UserApp> userApps = new HashSet<UserApp>(0);
	private Set<AppUser> appUsers = new HashSet<AppUser>(0);
	private Set<AppFeedBack> appFeedBacks = new HashSet<AppFeedBack>(0);

	@Column(name = "NAME", length = 100)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "ID_CARD_NO", length = 18)
	public String getIdCardNo() {
		return this.idCardNo;
	}

	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}

	@Column(name = "GENDER", length = 1)
	public String getGender() {
		return this.gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name = "NICKNAME", length = 100)
	public String getNickname() {
		return this.nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	@Column(name = "MOBILE", length = 11)
	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "PASSWORD", length = 50, updatable=false, insertable =false)
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "PAY_PASSWORD", length = 50,updatable=false, insertable =false)
	public String getPayPassword() {
		return this.payPassword;
	}

	public void setPayPassword(String payPassword) {
		this.payPassword = payPassword;
	}

	@Column(name = "EMAIL", length = 100)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "WECHAT", length = 50)
	public String getWechat() {
		return this.wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name = "WEIBO", length = 50)
	public String getWeibo() {
		return this.weibo;
	}

	public void setWeibo(String weibo) {
		this.weibo = weibo;
	}

	@Column(name = "QQ", length = 50)
	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	@Column(name = "PORTRAIT", length = 200)
	public String getPortrait() {
		return this.portrait;
	}

	public void setPortrait(String portrait) {
		this.portrait = portrait;
	}

	@Column(name = "PER_HOME_BG", length = 200)
	public String getPerHomeBg() {
		return this.perHomeBg;
	}

	public void setPerHomeBg(String perHomeBg) {
		this.perHomeBg = perHomeBg;
	}

	@Column(name = "SI_ID", length = 20)
	public String getSiId() {
		return this.siId;
	}

	public void setSiId(String siId) {
		this.siId = siId;
	}
	

	@Column(name = "PERSON_ID", length = 32)
	public String getPersonId() {
		return personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	@Transient
	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	
	
	@Transient
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	@Transient
	public Set<UserApp> getUserApps() {
		if(null == userApps){
			return new HashSet<UserApp>();
		}
		return this.userApps;
	}

	public void setUserApps(Set<UserApp> userApps) {
		this.userApps = userApps;
	}

	@Transient
	public Set<AppUser> getAppUsers() {
		if(null == appUsers){
			return new HashSet<AppUser>();
		}
		return this.appUsers;
	}

	public void setAppUsers(Set<AppUser> appUsers) {
		this.appUsers = appUsers;
	}

	@Transient
	public Set<AppFeedBack> getAppFeedBacks() {
		if(null == appFeedBacks){
			return new HashSet<AppFeedBack>();
		}
		return this.appFeedBacks;
	}

	public void setAppFeedBacks(Set<AppFeedBack> appFeedBacks) {
		this.appFeedBacks = appFeedBacks;
	}

	@Transient
	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.getMobile();
	}

	@Override
	public void setUsername(String username) {
		this.setMobile(username);		
	}

	@Override
	public AuthUser clone() {
		try {
			Object clone = super.clone();
			return (AuthUser)clone;
		} catch (CloneNotSupportedException e) {
			User target = new User();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}

}