package com.lenovohit.bdrp.org.model;


import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseModel;
/**
 * Created by IBUP model engine.
 * Model code : Person
 * Edited by : iBSDS
 * Edited on 2012-05-30 11:24:19
 */

@Entity
@Table(name="IH_PERSON_ROLE")
public class PersonRole extends BaseModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4657125985039174599L;
	private Person person;
	private Role role;
	@Id
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PID")
	public Person getPerson() {
		return person;
	}
	public void setPerson(Person person) {
		this.person = person;
	}
	@Id
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "RID")
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	
	@Override
	public boolean _newObejct() {
		// TODO Auto-generated method stub
		return null != this.person && null != this.role;
	}
}