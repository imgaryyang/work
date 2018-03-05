/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.mnis.org.model;

import java.util.Set;
import java.util.TreeSet;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.mnis.base.model.AuditableModel;

/**
 * mnis_MENU
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "mnis_MENU")
public class Menu extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -2829128170738844422L;

    /** code */
    private String code;

    /** name */
    private String name;
    
    /** name */
    private String alias;

    /** type */
    private String type;

    /** descp */
    private String descp;

    /** icon */
    private String icon;

    /** uri */
    private String uri;

    /** sorter */
    private Integer sorter;

    /** status */
    private String status;

	private Menu parent;
	private Set<Menu> children;

    /**
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 25)
    public String getCode() {
        return this.code;
    }

    /**
     * 设置code
     * 
     * @param code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 50)
    public String getName() {
        return this.name;
    }

    /**
     * 设置name
     * 
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "Alias", nullable = true, length = 50)
    public String getAlias() {
        return this.alias;
    }

    /**
     * 设置name
     * 
     * @param name
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }

    /**
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置type
     * 
     * @param type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取descp
     * 
     * @return descp
     */
    @Column(name = "DESCP", nullable = true, length = 255)
    public String getDescp() {
        return this.descp;
    }

    /**
     * 设置descp
     * 
     * @param descp
     */
    public void setDescp(String descp) {
        this.descp = descp;
    }

    /**
     * 获取icon
     * 
     * @return icon
     */
    @Column(name = "ICON", nullable = true, length = 255)
    public String getIcon() {
        return this.icon;
    }

    /**
     * 设置icon
     * 
     * @param icon
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }

    /**
     * 获取uri
     * 
     * @return uri
     */
    @Column(name = "URI", nullable = true, length = 255)
    public String getUri() {
        return this.uri;
    }

    /**
     * 设置uri
     * 
     * @param uri
     */
    public void setUri(String uri) {
        this.uri = uri;
    }

    /**
     * 获取sorter
     * 
     * @return sorter
     */
    @Column(name = "SORTER", nullable = true, length = 10)
    public Integer getSorter() {
        return this.sorter;
    }

    /**
     * 设置sorter
     * 
     * @param sorter
     */
    public void setSorter(Integer sorter) {
        this.sorter = sorter;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置status
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
   	@JoinColumn(name = "PARENT_ID", nullable = true)
   	@NotFound(action=NotFoundAction.IGNORE)
	public Menu getParent() {
		return parent;
	}

	public void setParent(Menu parent) {
		this.parent = parent;
	}
	
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
}