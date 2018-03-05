package com.infohold.bdrp.org.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
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
@Table(name="IH_DEPT")
@JsonIgnoreProperties(value={"children","persons"})
public class Dep extends BaseIdModel {
	private static final long serialVersionUID = 3781421074160617774L;
	private String name;
	private String description;
	private String code;
	private Org org;
	private Dep parent;
	private Set<Dep> children;
//	private Set<Post> posts;
//	private Set<Station> stations;
//	private Set<Person> persons;
	
	
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
	
	
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT",  nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Dep getParent() {
		return parent;
	}
	
	public void setParent(Dep parent) {
		this.parent = parent;
	}
	
	
	@OneToMany(mappedBy = "parent", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
	@OrderBy(value = "id ASC")
	public Set<Dep> getChildren() {
		if(null == children)
			children= new HashSet<Dep>();
		return children;
	}
	public void setChildren(Set<Dep> children) {
		this.children = children;
	}
	/*
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_DEPT_POST", joinColumns = { @JoinColumn(name = "DID") }, inverseJoinColumns = @JoinColumn(name = "PID"))
	public Set<Post> getPosts() {
		return posts;
	}
	public void setPosts(Set<Post> posts) {
		this.posts = posts;
	}
	public void addPosts(Post post) {
		getPosts().add(post);
	}
	
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_DEPT_STATION", joinColumns = { @JoinColumn(name = "DID") }, inverseJoinColumns = @JoinColumn(name = "SID"))
	public Set<Station> getStations() {
		return stations;
	}
	public void setStations(Set<Station> stations) {
		this.stations = stations;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_DEPT_PER", joinColumns = { @JoinColumn(name = "DEP_ID") }, inverseJoinColumns = @JoinColumn(name = "PER_ID"))
	public Set<Person> getPersons() {
		return persons;
	}
	public void setPersons(Set<Person> persons) {
		this.persons = persons;
	}
	
	*/
}