package com.infohold.bdrp.org.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;
/**
 * Created by IBUP model engine.
 * Model code : Dep
 * Edited by : iBSDS
 * Edited on 2012-05-31 10:01:31
 */

@Entity
@Table(name="IH_STATION")
public class Station extends BaseIdModel {

	private static final long serialVersionUID = 3781421074160617776L;
	private String name;
	public void setName(String name) {
		this.name = name;
	}
	@Column(name = "NAME",length = 50)
	public String getName() {
		return this.name;
	}

	private String description;
	public void setDescription(String description) {
		this.description = description;
	}
	@Column(name = "DESCRIPTION",nullable = true,length = 255)
	public String getDescription() {
		return this.description;
	}

	private String code;
	public void setCode(String code) {
		this.code = code;
	}
	@Column(name = "CODE",length = 50)
	public String getCode() {
		return this.code;
	}

	private Org org;
	@ManyToOne(cascade = CascadeType.REFRESH, optional = true)
	@JoinColumn(name = "ORG")
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
	
	private Set<Person> persons;
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_PER_STATION", joinColumns = { @JoinColumn(name = "SID") }, inverseJoinColumns = @JoinColumn(name = "PID"))
	public Set<Person> getPersons() {
		if(null == persons )
			persons =new HashSet<Person>();
		return persons;
	}
	public void setPersons(Set<Person> persons) {
		this.persons = persons;
	}
	
	private Station parent;
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT")
	public Station getParent() {
		return parent;
	}
	public void setParent(Station parent) {
		this.parent = parent;
	}
	
	private Set<Station> children;
	
	@OneToMany(mappedBy = "parent", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
	@OrderBy(value = "id ASC")
	public Set<Station> getChildren() {
		if(null == children)
			children= new HashSet<Station>();
		return children;
	}
	public void setChildren(Set<Station> children) {
		this.children = children;
	}
	
	
}