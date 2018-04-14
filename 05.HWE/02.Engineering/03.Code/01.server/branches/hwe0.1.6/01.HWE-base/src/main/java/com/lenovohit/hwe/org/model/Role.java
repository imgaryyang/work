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

package com.lenovohit.hwe.org.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * HWE_ROLE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "HWE_ROLE")
public class Role extends AuditableModel implements AuthRole,AuthModel {
    /** 版本号 */
    private static final long serialVersionUID = 67285865561595690L;

    /** name */
    private String name;

    /** code */
    private String code;

    /** memo */
    private String memo;

    /** status */
    private String status;

    /** org */
    private Org org;
    
	private Set<Menu> menus;
	
	private Set<User> users;
    
    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 100)
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
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 50)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 255)
    public String getMemo() {
        return this.memo;
    }

    /**
     * 设置memo
     * 
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
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
    
    @ManyToOne(cascade = CascadeType.REFRESH, optional = true)
   	@JoinColumn(name = "ORG_ID")
   	@NotFound(action=NotFoundAction.IGNORE)
    public Org getOrg() {
   		return org;
   	}
	public void setOrg(Org org) {
   		this.org = org;
   	}
       
	@Transient
	public Set<Menu> getMenus() {
		return menus;
	}

	public void setMenus(Set<Menu> menus) {
		this.menus = menus;
	}
	
	@Transient
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	@Override
	public AuthRole clone() {
		try {
			Object clone = super.clone();
			return (Role) clone;
		} catch (CloneNotSupportedException e) {
			Role target = new Role();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}
}