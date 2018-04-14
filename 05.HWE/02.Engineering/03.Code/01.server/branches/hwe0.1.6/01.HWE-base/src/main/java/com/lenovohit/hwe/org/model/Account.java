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

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.impl.DefaultAuthAccount;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * HWE_ACCOUNT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "HWE_ACCOUNT")
@DiscriminatorColumn(name = "DTYPE", discriminatorType = DiscriminatorType.STRING, length = 50)  
@DiscriminatorValue("base")  
public class Account extends AuditableModel implements  AuthModel,AuthAccount {

	/** 版本号 */
    private static final long serialVersionUID = 7491212560223673047L;

    private String namespace = "hwe";
    
    /** username */
    private String username;

    /** passwrod */
    private String password;

    /** name */
    private String name;

    /** mobile */
    private String mobile;

    /** email */
    private String email;

    /** otherContactWay */
    private String otherContactWay;

    /** type */
    private String type;

    /** 1 - 正常
            2 - 冻结 */
    private String status;
    
    private String newPassword; //新密码
    
    private User user;
    
    @Transient
    public String getNamespace() {
		return namespace;
	}

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}

    /**
     * 获取username
     * 
     * @return username
     */
    @Column(name = "USERNAME", nullable = true, length = 100)
    public String getUsername() {
        return this.username;
    }

    /**
     * 设置username
     * 
     * @param username
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * 获取password
     * 
     * @return password
     */
    @Column(name = "PASSWORD", nullable = true, length = 100)
    public String getPassword() {
        return this.password;
    }

    /**
     * 设置password
     * 
     * @param password
     */
    public void setPassword(String password) {
        this.password = password;
    }

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
     * 获取mobile
     * 
     * @return mobile
     */
    @Column(name = "MOBILE", nullable = true, length = 20)
    public String getMobile() {
        return this.mobile;
    }

    /**
     * 设置mobile
     * 
     * @param mobile
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * 获取email
     * 
     * @return email
     */
    @Column(name = "EMAIL", nullable = true, length = 50)
    public String getEmail() {
        return this.email;
    }

    /**
     * 设置email
     * 
     * @param email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * 获取otherContactWay
     * 
     * @return otherContactWay
     */
    @Column(name = "OTHER_CONTACT_WAY", nullable = true, length = 100)
    public String getOtherContactWay() {
        return this.otherContactWay;
    }

    /**
     * 设置otherContactWay
     * 
     * @param otherContactWay
     */
    public void setOtherContactWay(String otherContactWay) {
        this.otherContactWay = otherContactWay;
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
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    @ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "USER_ID")
	@NotFound(action=NotFoundAction.IGNORE)
    @JsonIgnore
    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Transient
	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	
	@Override
	public AuthAccount clone() {
		try {
			Object clone = super.clone();
			AuthAccount cloned = (AuthAccount)clone;
			return cloned;
		} catch (CloneNotSupportedException e) {
			DefaultAuthAccount target = new DefaultAuthAccount();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}
}