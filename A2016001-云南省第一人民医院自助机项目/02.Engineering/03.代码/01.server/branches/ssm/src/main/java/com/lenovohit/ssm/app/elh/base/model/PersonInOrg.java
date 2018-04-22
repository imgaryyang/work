package com.lenovohit.ssm.app.elh.base.model;



import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseModel;
import com.lenovohit.ssm.base.model.Org;

@Entity
@Table(name="IH_ORG_PER")
public class PersonInOrg extends BaseModel {
	private static final long serialVersionUID = -3159416018443317753L;
	public static final String STATE_ON = "1";
	public static final String STATE_OFF = "2";
	
	private PersonInOrgId id;
	private String state;
	private String effon;
	private String offon;
	
	@Id
	public PersonInOrgId getId() {
		return id;
	}
	public void setId(PersonInOrgId id) {
		this.id = id;
	}

	public PersonInOrg(){
	}
	public PersonInOrg(Person person , Org org){
		super();
		id = new PersonInOrgId(person,org);
	}
	
	@Column(name="STATE",length=1)
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	@Column(name="EFFON",length=19)
	public String getEffon() {
		return effon;
	}

	public void setEffon(String effon) {
		this.effon = effon;
	}
	
	@Column(name="OFFON",length=19)
	public String getOffon() {
		return offon;
	}
	public void setOffon(String offon) {
		this.offon = offon;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((effon == null) ? 0 : effon.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((offon == null) ? 0 : offon.hashCode());
		result = prime * result + ((state == null) ? 0 : state.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PersonInOrg other = (PersonInOrg) obj;
		if (effon == null) {
			if (other.effon != null)
				return false;
		} else if (!effon.equals(other.effon))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (offon == null) {
			if (other.offon != null)
				return false;
		} else if (!offon.equals(other.offon))
			return false;
		if (state == null) {
			if (other.state != null)
				return false;
		} else if (!state.equals(other.state))
			return false;
		return true;
	}
	
	@Override
	public boolean _newObejct() {
		return null != this.getId();
	}
	
	
}


@Embeddable
class PersonInOrgId  extends BaseModel{
	private static final long serialVersionUID = 5961907519971760153L;
	
	public PersonInOrgId() {
	}
	public PersonInOrgId(Person person, Org org) {
		super();
		this.person = person;
		this.org = org;
	}
	private Person person;
	private Org org;
	
	@ManyToOne(cascade = {CascadeType.REMOVE},fetch=FetchType.LAZY)
	@JoinColumn(name="PER_ID",updatable=false)
	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}
	
	@ManyToOne(cascade = {CascadeType.REMOVE},fetch=FetchType.LAZY)
	@JoinColumn(name="ORG_ID",updatable=false)
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
	
	
	@Override
	public boolean _newObejct() {
		return null != this.person && null != this.org;
	}

	
}

