package com.infohold.bdrp.authority.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "IH_ACCESS")
@JsonIgnoreProperties("resource")
public class AuthzAccess extends BaseIdModel {
	private static final long serialVersionUID = -273037121425779613L;
	
	private String name;
	private Function function;
//	private Set<AuthResource> resource;
	private List<AuthResource> resource;
	private String descp;
	public AuthzAccess(){
		
	}
	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "FUNCTION")
	public Function getFunction() {
		return function;
	}

	public AuthzAccess(String id ,String name, Function function, String descp) {
		super();
		this.id = id;
		this.name = name;
		this.function = function;
		this.descp = descp;
	}
	
	public AuthzAccess(String id ,String name, String descp,String fid,String fname) {
		super();
		this.id = id;
		this.name = name;
		this.function = new Function(fid,fname);
		this.descp = descp;
	}

	public void setFunction(Function function) {
		this.function = function;
	}

	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "IH_ACCESS_RES", joinColumns = { @JoinColumn(name = "AID") }, inverseJoinColumns = @JoinColumn(name = "RID"))
	@NotFound(action=NotFoundAction.IGNORE)
	public List<AuthResource> getResource() {
		return resource;
	}

	public void setResource(List<AuthResource> resource) {
		this.resource = resource;
	}
	
	
	@Column(name = "DESCP", length = 255)
	public String getDescp() {
		return descp;
	}

	public void setDescp(String descp) {
		this.descp = descp;
	}
	
	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载equals;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.name).toHashCode();
	}

	/**
	 * 重载equals
	 */
	@Override
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj,new String[]{"name"});
	}

}