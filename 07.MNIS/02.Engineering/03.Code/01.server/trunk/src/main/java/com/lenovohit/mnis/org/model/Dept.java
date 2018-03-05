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

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lenovohit.mnis.base.model.AuditableModel;

/**
 * mnis_DEPT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "mnis_DEPT")
public class Dept extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7822834764786404969L;

    /** name */
    private String name;

    /** 便于程序编码实现的代码 */
    private String code;

    /** description */
    private String description;

    /** status */
    private String status;
    
    /** org */
    private Org org;

    /** parent */
    private Dept parent;
    
	private Set<Dept> children;
	private Set<Post> posts;
	private Set<User> users;

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 32)
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
     * 获取便于程序编码实现的代码
     * 
     * @return 便于程序编码实现的代码
     */
    @Column(name = "CODE", nullable = false, length = 50)
    public String getCode() {
        return this.code;
    }

    /**
     * 设置便于程序编码实现的代码
     * 
     * @param code
     *          便于程序编码实现的代码
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 获取description
     * 
     * @return description
     */
    @Column(name = "DESCRIPTION", nullable = true, length = 255)
    public String getDescription() {
        return this.description;
    }

    /**
     * 设置description
     * 
     * @param description
     */
    public void setDescription(String description) {
        this.description = description;
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
    
    @ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "ORG_ID")
	@NotFound(action=NotFoundAction.IGNORE)
    public Org getOrg() {
		return org;
	}
    public void setOrg(Org org) {
		this.org = org;
	}
    
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT_ID",  nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Dept getParent() {
		return parent;
	}
	
	public void setParent(Dept parent) {
		this.parent = parent;
	}

    @Transient
	public Set<User> getUsers() {
		return users;
	}
	public void setUsers(Set<User> users) {
		this.users = users;
	}
	
	@Transient
    public Set<Post> getPosts() {
		return posts;
	}

	public void setPosts(Set<Post> posts) {
		this.posts = posts;
	}

	@Transient
    @JsonIgnoreProperties({"parent","children","org","posts","users"})
	public Set<Dept> getChildren() {
		if(null == children)
			children= new HashSet<Dept>();
		return children;
	}
	public void setChildren(Set<Dept> children) {
		this.children = children;
	}
}