/***********************************************************************
 * Module:  Function.java
 * Author:  Sixday
 * Purpose: Defines the Class Function
 ***********************************************************************/

package com.infohold.bdrp.authority.model;

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

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "IH_FUNCTION")
public class Function extends BaseIdModel {

	private static final long serialVersionUID = 4864156258029489063L;

	private String name;
	private String desc;
	private Set<AuthResource> resources;
	private String uri;
	private String type;
	private Function parent;
	private Set<Function> children;

	public Function() {

	}

	public Function(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "DESCP", length = 255)
	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	// @OneToMany(mappedBy = "function", cascade = CascadeType.MERGE, fetch =
	// FetchType.LAZY)
	// @OrderBy(value = "id ASC")
	@Transient
	public Set<AuthResource> getResources() {
		if (null == resources) {
			resources = new HashSet<AuthResource>();
		}
		return resources;
	}

	public void setResources(Set<AuthResource> resources) {
		this.resources = resources;
	}

	@Column(name = "URI", length = 200)
	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	@Column(name = "FTYPE", length = 2)
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT")
	@NotFound(action = NotFoundAction.IGNORE)
	public Function getParent() {
		return parent;
	}

	public void setParent(Function parent) {
		this.parent = parent;
	}

	// @OneToMany(mappedBy = "parent", cascade = CascadeType.MERGE, fetch =
	// FetchType.LAZY)
	// @OrderBy(value = "id ASC")
	@Transient
	public Set<Function> getChildren() {
		if (null == children)
			children = new HashSet<Function>();
		return children;
	}

	public void setChildren(Set<Function> children) {
		this.children = children;
	}

	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		Function other = (Function) obj;
		if (!name.equals(other.name))
			return false;
		if (super.getId() != null ? !super.getId().equals(other.getId())
				: other.getId() != null)
			return false;
		return true;
	}

	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}