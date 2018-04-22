package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.lenovohit.core.model.BaseModel;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.base.model.Org;

/**
 * 
 * @author wang
 *
 */
@Entity
@Table(name = "IH_USER")
public class OptUser extends BaseModel  {

	private static final long serialVersionUID = 8878138304068573994L;

	private String id;
	private String personId;// 机构ID
	private String orgId;// 机构ID
	private String username;// 用户名
	private String name;// 姓名
	private String password;// 密码
	private String mobile;// 手机号
	private String otherContactWay;// 其他联系方式
	private String state;// 状态
	private String createAt;// 创建时间
	private String email;// 邮箱地址
	private Org org;

	@Id
	@Column(name = "ID", nullable = false, length = 32)
	@GeneratedValue(generator = "customer-assigned")
	@GenericGenerator(name = "customer-assigned", strategy = "assigned")
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "PERSON_ID", nullable = false, updatable = false)
	public String getPersonId() {
		return personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	@Column(name = "ORG_ID", updatable = false)
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@Column(name = "USER_NAME")
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "NAME")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "PASSWROD" )
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "MOBILE")
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "OTHER_CONTACT_WAY")
	public String getOtherContactWay() {
		return otherContactWay;
	}

	public void setOtherContactWay(String otherContactWay) {
		this.otherContactWay = otherContactWay;
	}

	@Column(name = "STATE")
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "CREATED_AT", updatable = false)
	public String getCreateAt() {
		return createAt;
	}

	public void setCreateAt(String createAt) {
		this.createAt = createAt;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Transient
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	@Override
	public boolean _newObejct() {
		return StringUtils.isEmpty(this.id);
	}

	public int hashCode() {
		return HashCodeBuilder.reflectionHashCode(this);
	}
}
