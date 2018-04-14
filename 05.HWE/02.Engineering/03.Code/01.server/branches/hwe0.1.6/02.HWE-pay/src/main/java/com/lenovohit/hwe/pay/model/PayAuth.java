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
 * PAY_TYPE_AUTH
 * 
 * @author zyus
 * @version 1.0.0 2018-03-23
 */
@Entity
@Table(name = "PAY_TYPE_AUTH")
public class PayAuth extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7371416537718960750L;

//    /** ptId */
//    private String ptId;

	/**
	 * APP - 应用 TME - 终端设备 USR - 用户 BIZ - 业务种类 OTH - 其他
	 */
    private String type;

    /** value */
    private String value;

    /** memo */
    private String memo;

	/**
	 * A-初始0 - 激活 1 - 暂停 9 - 停用
	 */
	private String status;
	
	private PayType payType;//支付方式
   
	
//	/**
//     * 获取ptId
//     * 
//     * @return ptId
//     */
//    @Column(name = "PT_ID", nullable = true, length = 32)
//    public String getPtId() {
//        return this.ptId;
//    }
//
//    /**
//     * 设置ptId
//     * 
//     * @param ptId
//     */
//    public void setPtId(String ptId) {
//        this.ptId = ptId;
//    }

    /**
     * 获取
     * @return
     */
    @Column(name = "TYPE", nullable = true, length = 3)
    public String getType() {
        return this.type;
    }

    /**
     * 设置
     * 
     * @param 
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取value
     * 
     * @return value
     */
    @Column(name = "VALUE", nullable = true, length = 50)
    public String getValue() {
        return this.value;
    }

    /**
     * 设置value
     * 
     * @param value
     */
    public void setValue(String value) {
        this.value = value;
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
     * 获取
     * @return 
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
   	@JoinColumn(name = "PT_ID", nullable = true)
   	@NotFound(action=NotFoundAction.IGNORE)
	public PayType getPayType() {
		return payType;
	}

	public void setPayType(PayType payType) {
		this.payType = payType;
	}
}