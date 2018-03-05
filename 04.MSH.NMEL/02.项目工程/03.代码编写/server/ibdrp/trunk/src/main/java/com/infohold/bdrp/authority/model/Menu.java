package com.infohold.bdrp.authority.model;

import java.util.Set;
import java.util.TreeSet;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "IH_MENU")
//@Cache(usage=CacheConcurrencyStrategy.READ_WRITE)
public class Menu extends BaseIdModel implements Comparable<Object> {
	private static final long serialVersionUID = -9073074699416627529L;
	
	private String code;
	private String name;
	private String iconPath;
	private Menu parent;
	private Set<Menu> children;
	private Function function;
	private AuthzAccess access;
	private String descp;
	private int sort;
	private String accType;
	private String url;
	private String parentId;
	
//	@Transient
	@Column(name = "PARENT")
	public String getParentId() {
//		if(parentId!=null){
//			return parentId;
//		}
//		if(parent!=null){
//			return parent.getId();
//		}
//		return null;
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@Transient
//	@Column(name="URI")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "TYPE_", length = 2)
	public String getAccType() {
		return accType;
	}

	public void setAccType(String accType) {
		this.accType = accType;
	}

	@Column(name = "CODE", nullable = false, length = 50)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	@Column(name = "ICON", length = 255)
	public String getIconPath() {
		return iconPath;
	}
	
	public void setIconPath(String iconPath) {
		this.iconPath = iconPath;
	}
	
//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
//	@JoinColumn(name = "PARENT")
//	@NotFound(action=NotFoundAction.IGNORE)
	@Transient
	public Menu getParent() {
		return parent;
	}

	public void setParent(Menu parent) {
		this.parent = parent;
	}
	
//	@OneToMany(mappedBy = "parent", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
//	@OrderBy(value = "sort ASC")
//	@NotFound(action=NotFoundAction.IGNORE)
	@Transient
	public Set<Menu> getChildren() {
		if(null == children){
			children = new TreeSet<Menu>();
		}
		return children;
	}

	public void setChildren(Set<Menu> children) {
		this.children = children;
	}
	
	@Column(name = "SORTER",updatable=false)
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
//	@JoinColumn(name = "FUNCTION")
	@Transient
	public Function getFunction() {
		return function;
	}

	public void setFunction(Function function) {
		this.function = function;
	}

	@Column(name = "DESCP", length = 255)
	public String getDescp() {
		return descp;
	}

	public void setDescp(String descp) {
		this.descp = descp;
	}
	
	@OneToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "AID")
	@NotFound(action=NotFoundAction.IGNORE)
	public AuthzAccess getAccess() {
		return access;
	}

	public void setAccess(AuthzAccess access) {
		this.access = access;
	}
	
	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj, new String[]{"access", "function"});
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.code).append(this.name).toHashCode();
	}
	
	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	
	public int compareTo(Object o) {
		if (o instanceof Menu) {
			if (this.getSort() > ((Menu) o).getSort()) {
				return 1;
			} else if (this.getSort() < ((Menu) o).getSort()) {
				return -1;
			} else {
				if (this.getId().compareTo(((Menu) o).getId()) > 0) {
					return 1;
				} else if (this.getId().compareTo(((Menu) o).getId()) < 0) {
					return -1;
				}
				return 0;
			}
		} else {
			throw new ClassCastException("Can't compare");
		}
	}
	
}
