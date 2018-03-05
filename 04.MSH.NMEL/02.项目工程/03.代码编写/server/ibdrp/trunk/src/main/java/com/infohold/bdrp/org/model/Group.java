package com.infohold.bdrp.org.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

/**
 * 
 * @author <a href="mailto:yangming@infohold.com.cn">Yang Ming</a>
 * 
 */

@Entity
@Table(name = "IH_GROUP")
public class Group extends BaseIdModel {
	private static final long serialVersionUID = -2348205036765050277L;

	private String name;
	private String code;
	private String description;
	private Person principal;
	private Set<Person> users = new HashSet<Person>();

//	private KeyValueUtil us;

	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "CODE", length = 24)
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "DESCRIPTION")
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * 与Person的关联关系为：单项多对一
	 * 
	 * @return
	 */
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PRINCIPAL")
	public Person getPrincipal() {
		return this.principal;
	}

	public void setPrincipal(Person principal) {
		this.principal = principal;
	}

//	@ManyToMany(mappedBy = "groups", fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@Transient
	public Set<Person> getPersons() {
		return users;
	}

//	@Transient
//	public List<LabelValue> getPersonList() {
//		List<LabelValue> groupPersons = new ArrayList<LabelValue>();
//
//		if (this.users != null) {
//			for (Person user : users) {
//				groupPersons.add(new LabelValue(user.getId(),user.getName()));
//			}
//		}
//
//		return groupPersons;
//	}

	public void addPerson(Person user) {
		getPersons().add(user);
	}

	public void setPersons(Set<Person> users) {
		this.users = users;
	}

	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Group pojo = (Group) o;

		if (name != null ? !name.equals(pojo.name) : pojo.name != null)
			return false;
		if (code != null ? !code.equals(pojo.code) : pojo.code != null)
			return false;
		if (description != null ? !description.equals(pojo.description)
				: pojo.description != null)
			return false;
		if (principal != null ? !principal.equals(pojo.principal)
				: pojo.principal != null)
			return false;
		if (super.getId() != null ? !super.getId().equals(pojo.getId()) : pojo
				.getId() != null)
			return false;
		return true;
	}

	public int hashCode() {
		int result = 0;
		result = (name != null ? name.hashCode() : 0);
		result = 31 * result + (code != null ? code.hashCode() : 0);
		result = 31 * result
				+ (description != null ? description.hashCode() : 0);
		result = 31 * result + (principal != null ? principal.hashCode() : 0);

		return result;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer(getClass().getSimpleName());

		sb.append(" [");
		sb.append("id").append("='").append(getId()).append("', ");
		sb.append("name").append("='").append(getName()).append("', ");
		sb.append("code").append("='").append(getCode()).append("', ");
		sb.append("description").append("='").append(getDescription())
				.append("', ");
		sb.append("principal").append("='").append(getPrincipal())
				.append("', ");
		sb.append("]");

		return sb.toString();
	}

//	@Transient
//	public KeyValueUtil getUs() {
//		boolean l = false;
//		StringBuilder uids = new StringBuilder();
//		StringBuilder xms = new StringBuilder();
//		for (Person user : getPersons()) {
//			l = true;
//			uids.append(user.getId()).append(",");
//			xms.append(user.getName()).append(",");
//		}
//		if (l) {
//			uids.deleteCharAt(uids.length() - 1);
//			xms.deleteCharAt(xms.length() - 1);
//		}
//		this.us = new KeyValueUtil();
//		this.us.setKey(uids.toString());
//		this.us.setValue(xms.toString());
//		return us;
//	}
//
//	public void setUs(KeyValueUtil us) {
//		this.us = us;
//	}

}
