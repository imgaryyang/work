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

package com.lenovohit.hwe.pay.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_TYPE
 * 
 * @author zyus
 * @version 1.0.0 2018-01-11
 */
@Entity
@Table(name = "PAY_TYPE")
public class PayType extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5606986474414930962L;

//    /** pcId */
//    private String pcId;
//
//    /** mchId */
//    private String mchId;

    private String type;
    /** code */
    private String code;

    /** name */
    private String name;

    /** alias */
    private String alias;

    /** icon */
    private String icon;

    /** memo */
    private String memo;

    /** 0 - 测试
        1 - 激活
        9 - 停用 */
    private String status;
    
    
    private PayChannel payChannel;
    private PayMerchant payMerchant;

//    /**
//     * 获取pcId
//     * 
//     * @return pcId
//     */
//    @Column(name = "PC_ID", nullable = true, length = 32)
//
//    public String getPcId() {
//        return this.pcId;
//    }
//
//    /**
//     * 设置pcId
//     * 
//     * @param pcId
//     */
//    public void setPcId(String pcId) {
//        this.pcId = pcId;
//    }
//
//    /**
//     * 获取mchId
//     * 
//     * @return mchId
//     */
//    @Column(name = "MCH_ID", nullable = true, length = 32)
//
//    public String getMchId() {
//        return this.mchId;
//    }
//
//    /**
//     * 设置mchId
//     * 
//     * @param mchId
//     */
//    public void setMchId(String mchId) {
//        this.mchId = mchId;
//    }
    /**
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 20)
    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	
    /**
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 20)
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
     * 获取alias
     * 
     * @return alias
     */
    @Column(name = "ALIAS", nullable = true, length = 50)
    public String getAlias() {
        return this.alias;
    }

    /**
     * 设置alias
     * 
     * @param alias
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }

    /**
     * 获取icon
     * 
     * @return icon
     */
    @Column(name = "ICON", nullable = true, length = 50)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 200)
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
     * @return 
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置 status
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
   	@JoinColumn(name = "PC_ID", nullable = true)
   	@NotFound(action=NotFoundAction.IGNORE)
	public PayChannel getPayChannel() {
		return payChannel;
	}

	public void setPayChannel(PayChannel payChannel) {
		this.payChannel = payChannel;
	}

	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "MCH_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public PayMerchant getPayMerchant() {
		return payMerchant;
	}

	public void setPayMerchant(PayMerchant payMerchant) {
		this.payMerchant = payMerchant;
	}
    
    
}