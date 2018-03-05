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

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * mnis_USER_ORG
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "mnis_USER_ORG")
public class UserInOrg extends BaseIdModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -8518795372598265820L;
    public static final String IS_REG_TRUE = "0";
    public static final String IS_REG_FLASE = "1";
    
    /** isReg */
    private String isReg;

    /** effon */
    private Date effon;

    /** offon */
    private Date offon;

    /** status */
    private String status;
    
    private User user;
    
	private Org org;
	

    @Column(name = "IS_REG", nullable = true, length = 1)
    public String getIsReg() {
		return isReg;
	}

	public void setIsReg(String isReg) {
		this.isReg = isReg;
	}

	/**
     * 获取effon
     * 
     * @return effon
     */
    @Column(name = "EFFON", nullable = false)
    public Date getEffon() {
        return this.effon;
    }

    /**
     * 设置effon
     * 
     * @param effon
     */
    public void setEffon(Date effon) {
        this.effon = effon;
    }

    /**
     * 获取offon
     * 
     * @return offon
     */
    @Column(name = "OFFON", nullable = true)
    public Date getOffon() {
        return this.offon;
    }

    /**
     * 设置offon
     * 
     * @param offon
     */
    public void setOffon(Date offon) {
        this.offon = offon;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = false, length = 1)
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
    
    @ManyToOne(cascade = {CascadeType.REMOVE},fetch=FetchType.LAZY)
	@JoinColumn(name="USER_ID",updatable=false)
    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	@ManyToOne(cascade = {CascadeType.REMOVE},fetch=FetchType.LAZY)
	@JoinColumn(name="ORG_ID",updatable=false)
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
	
}