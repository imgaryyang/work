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

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.infohold.core.model.BaseIdModel;
/**
 * Created by IBUP model engine.
 * Model code : Dep
 * Edited by : iBSDS
 * Edited on 2012-05-31 10:01:31
 */
@Entity
@Table(name="IH_POST")
@JsonIgnoreProperties(value={"children","persons"})
public class Post extends BaseIdModel {
	private static final long serialVersionUID = -7805569262946571466L;
	
	private String code;
	private String name;
	private String description;
	private Org org;
	private Post parent;
	private Set<Person> persons;
	private Set<Post> children;
	
	public void setName(String name) {
		this.name = name;
	}
	@Column(name = "NAME",length = 50)
	public String getName() {
		return this.name;
	}

	
	public void setDescription(String description) {
		this.description = description;
	}
	@Column(name = "DESCRIPTION",nullable = true,length = 255)
	public String getDescription() {
		return this.description;
	}

	
	public void setCode(String code) {
		this.code = code;
	}
	@Column(name = "CODE",length = 50)
	public String getCode() {
		return this.code;
	}

	
	@ManyToOne(cascade = CascadeType.REFRESH, optional = true)
	@JoinColumn(name = "ORG")
	@NotFound(action=NotFoundAction.IGNORE)
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_PER_POST", joinColumns = { @JoinColumn(name = "PTID") }, inverseJoinColumns = @JoinColumn(name = "PID"))
	public Set<Person> getPersons() {
		return persons;
	}
	public void setPersons(Set<Person> persons) {
		this.persons = persons;
	}
	
	/*private Set<Dep> deps;
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_DEPT_POST", joinColumns = { @JoinColumn(name = "PID") }, inverseJoinColumns = @JoinColumn(name = "DID"))
	public Set<Dep> getDeps() {
		return deps;
	}
	public void setDeps(Set<Dep> deps) {
		this.deps = deps;
	}*/
	
	
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT")
	@NotFound(action=NotFoundAction.IGNORE)
	public Post getParent() {
		return parent;
	}
	public void setParent(Post parent) {
		this.parent = parent;
	}
	
	@OneToMany(mappedBy = "parent", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
	@OrderBy(value = "id ASC")
	public Set<Post> getChildren() {
		if(null == children)
			children= new HashSet<Post>();
		return children;
	}
	public void setChildren(Set<Post> children) {
		this.children = children;
	}
	

}