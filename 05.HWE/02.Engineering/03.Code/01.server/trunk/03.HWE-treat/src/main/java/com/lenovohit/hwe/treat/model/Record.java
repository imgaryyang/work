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

package com.lenovohit.hwe.treat.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_RECORD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_RECORD")
public class Record extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 4236286958848019046L;

    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** depId */
    private String depId;

    /** depNo */
    private String depNo;

    /** depName */
    private String depName;

    /** docId */
    private String docId;

    /** docNo */
    private String docNo;

    /** docName */
    private String docName;

    /** proId */
    private String proId;

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;

    /** cataId */
    private String cataId;

    /** cataNo */
    private String cataNo;

    /** cataName */
    private String cataName;

    /** feeItemId */
    private String feeItemId;

    /** feeGroupId */
    private String feeGroupId;

    /** no */
    private String no;

    /** applyNo */
    private String applyNo;

    /** name */
    private String name;

    /** count */
    private BigDecimal count;

    /** price */
    private BigDecimal price;

    /** amt */
    private BigDecimal amt;

    /** bizType */
    private String bizType;

    /** bizName */
    private String bizName;

    /** needPay */
    private String needPay;

    /** comment */
    private String comment;

    /** startTime */
    private Date startTime;

    /** endTime */
    private Date endTime;

    /** status */
    private String status;
    
    //所关联的RecordDrug药物明细表的数据
    private List<RecordDrug> recordDrug;
    
    //所关联的RecordTest检查项目表的数据
    private List<RecordTest> recordTest;
    
    /**
     * 获取actId
     * 
     * @return actId
     */
    @Column(name = "ACT_ID", nullable = true, length = 32)
    public String getActId() {
		return actId;
	}
    
    /**
     * 设置actId
     * 
     * @param actId
     */
	public void setActId(String actId) {
		this.actId = actId;
	}
	
	/**
     * 获取actNo
     * 
     * @return actNo
     */
	@Column(name = "ACT_NO", nullable = true, length = 50)
	public String getActNo() {
		return actNo;
	}
	/**
     * 设置actNo
     * 
     * @param actNo
     */
	public void setActNo(String actNo) {
		this.actNo = actNo;
	}

    
    
    /**
     * 获取hosId
     * 
     * @return hosId
     */
    @Column(name = "HOS_ID", nullable = true, length = 32)
    public String getHosId() {
        return this.hosId;
    }

    /**
     * 设置hosId
     * 
     * @param hosId
     */
    public void setHosId(String hosId) {
        this.hosId = hosId;
    }

    /**
     * 获取hosNo
     * 
     * @return hosNo
     */
    @Column(name = "HOS_NO", nullable = true, length = 50)
    public String getHosNo() {
        return this.hosNo;
    }

    /**
     * 设置hosNo
     * 
     * @param hosNo
     */
    public void setHosNo(String hosNo) {
        this.hosNo = hosNo;
    }

    /**
     * 获取hosName
     * 
     * @return hosName
     */
    @Column(name = "HOS_NAME", nullable = true, length = 50)
    public String getHosName() {
        return this.hosName;
    }

    /**
     * 设置hosName
     * 
     * @param hosName
     */
    public void setHosName(String hosName) {
        this.hosName = hosName;
    }

    /**
     * 获取depId
     * 
     * @return depId
     */
    @Column(name = "DEP_ID", nullable = true, length = 32)
    public String getDepId() {
        return this.depId;
    }

    /**
     * 设置depId
     * 
     * @param depId
     */
    public void setDepId(String depId) {
        this.depId = depId;
    }

    /**
     * 获取depNo
     * 
     * @return depNo
     */
    @Column(name = "DEP_NO", nullable = true, length = 50)
    public String getDepNo() {
        return this.depNo;
    }

    /**
     * 设置depNo
     * 
     * @param depNo
     */
    public void setDepNo(String depNo) {
        this.depNo = depNo;
    }

    /**
     * 获取depName
     * 
     * @return depName
     */
    @Column(name = "DEP_NAME", nullable = true, length = 50)
    public String getDepName() {
        return this.depName;
    }

    /**
     * 设置depName
     * 
     * @param depName
     */
    public void setDepName(String depName) {
        this.depName = depName;
    }

    /**
     * 获取docId
     * 
     * @return docId
     */
    @Column(name = "DOC_ID", nullable = true, length = 32)
    public String getDocId() {
        return this.docId;
    }

    /**
     * 设置docId
     * 
     * @param docId
     */
    public void setDocId(String docId) {
        this.docId = docId;
    }

    /**
     * 获取docNo
     * 
     * @return docNo
     */
    @Column(name = "DOC_NO", nullable = true, length = 50)
    public String getDocNo() {
        return this.docNo;
    }

    /**
     * 设置docNo
     * 
     * @param docNo
     */
    public void setDocNo(String docNo) {
        this.docNo = docNo;
    }

    /**
     * 获取docName
     * 
     * @return docName
     */
    @Column(name = "DOC_NAME", nullable = true, length = 50)
    public String getDocName() {
        return this.docName;
    }

    /**
     * 设置docName
     * 
     * @param docName
     */
    public void setDocName(String docName) {
        this.docName = docName;
    }

    /**
     * 获取proId
     * 
     * @return proId
     */
    @Column(name = "PRO_ID", nullable = true, length = 32)
    public String getProId() {
        return this.proId;
    }

    /**
     * 设置proId
     * 
     * @param proId
     */
    public void setProId(String proId) {
        this.proId = proId;
    }

    /**
     * 获取proNo
     * 
     * @return proNo
     */
    @Column(name = "PRO_NO", nullable = true, length = 50)
    public String getProNo() {
        return this.proNo;
    }

    /**
     * 设置proNo
     * 
     * @param proNo
     */
    public void setProNo(String proNo) {
        this.proNo = proNo;
    }

    /**
     * 获取proName
     * 
     * @return proName
     */
    @Column(name = "PRO_NAME", nullable = true, length = 70)
    public String getProName() {
        return this.proName;
    }

    /**
     * 设置proName
     * 
     * @param proName
     */
    public void setProName(String proName) {
        this.proName = proName;
    }

    /**
     * 获取cataId
     * 
     * @return cataId
     */
    @Column(name = "CATA_ID", nullable = true, length = 32)
    public String getCataId() {
        return this.cataId;
    }

    /**
     * 设置cataId
     * 
     * @param cataId
     */
    public void setCataId(String cataId) {
        this.cataId = cataId;
    }

    /**
     * 获取cataNo
     * 
     * @return cataNo
     */
    @Column(name = "CATA_NO", nullable = true, length = 50)
    public String getCataNo() {
        return this.cataNo;
    }

    /**
     * 设置cataNo
     * 
     * @param cataNo
     */
    public void setCataNo(String cataNo) {
        this.cataNo = cataNo;
    }

    /**
     * 获取cataName
     * 
     * @return cataName
     */
    @Column(name = "CATA_NAME", nullable = true, length = 70)
    public String getCataName() {
        return this.cataName;
    }

    /**
     * 设置cataName
     * 
     * @param cataName
     */
    public void setCataName(String cataName) {
        this.cataName = cataName;
    }

    /**
     * 获取feeItemId
     * 
     * @return feeItemId
     */
    @Column(name = "FEE_ITEM_ID", nullable = true, length = 32)
    public String getFeeItemId() {
        return this.feeItemId;
    }

    /**
     * 设置feeItemId
     * 
     * @param feeItemId
     */
    public void setFeeItemId(String feeItemId) {
        this.feeItemId = feeItemId;
    }

    /**
     * 获取feeGroupId
     * 
     * @return feeGroupId
     */
    @Column(name = "FEE_GROUP_ID", nullable = true, length = 32)
    public String getFeeGroupId() {
        return this.feeGroupId;
    }

    /**
     * 设置feeGroupId
     * 
     * @param feeGroupId
     */
    public void setFeeGroupId(String feeGroupId) {
        this.feeGroupId = feeGroupId;
    }

    /**
     * 获取no
     * 
     * @return no
     */
    @Column(name = "NO", nullable = true, length = 50)
    public String getNo() {
        return this.no;
    }

    /**
     * 设置no
     * 
     * @param no
     */
    public void setNo(String no) {
        this.no = no;
    }

    /**
     * 获取applyNo
     * 
     * @return applyNo
     */
    @Column(name = "APPLY_NO", nullable = true, length = 50)
    public String getApplyNo() {
        return this.applyNo;
    }

    /**
     * 设置applyNo
     * 
     * @param applyNo
     */
    public void setApplyNo(String applyNo) {
        this.applyNo = applyNo;
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
     * 获取count
     * 
     * @return count
     */
    @Column(name = "COUNT", nullable = true)
    public BigDecimal getCount() {
        return this.count;
    }

    /**
     * 设置count
     * 
     * @param count
     */
    public void setCount(BigDecimal count) {
        this.count = count;
    }

    /**
     * 获取price
     * 
     * @return price
     */
    @Column(name = "PRICE", nullable = true)
    public BigDecimal getPrice() {
        return this.price;
    }

    /**
     * 设置price
     * 
     * @param price
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * 获取amt
     * 
     * @return amt
     */
    @Column(name = "AMT", nullable = true)
    public BigDecimal getAmt() {
        return this.amt;
    }

    /**
     * 设置amt
     * 
     * @param amt
     */
    public void setAmt(BigDecimal amt) {
        this.amt = amt;
    }

    /**
     * 获取bizType
     * 
     * @return bizType
     */
    @Column(name = "BIZ_TYPE", nullable = true, length = 1)
    public String getBizType() {
        return this.bizType;
    }

    /**
     * 设置bizType
     * 
     * @param bizType
     */
    public void setBizType(String bizType) {
        this.bizType = bizType;
    }

    /**
     * 获取bizName
     * 
     * @return bizName
     */
    @Column(name = "BIZ_NAME", nullable = true, length = 50)
    public String getBizName() {
        return this.bizName;
    }

    /**
     * 设置bizName
     * 
     * @param bizName
     */
    public void setBizName(String bizName) {
        this.bizName = bizName;
    }

    /**
     * 获取needPay
     * 
     * @return needPay
     */
    @Column(name = "NEED_PAY", nullable = true, length = 1)
    public String getNeedPay() {
        return this.needPay;
    }

    /**
     * 设置needPay
     * 
     * @param needPay
     */
    public void setNeedPay(String needPay) {
        this.needPay = needPay;
    }

    /**
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT", nullable = true, length = 200)
    public String getComment() {
        return this.comment;
    }

    /**
     * 设置comment
     * 
     * @param comment
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

    /**
     * 获取startTime
     * 
     * @return startTime
     */
    @Column(name = "START_TIME", nullable = true)
    public Date getStartTime() {
        return this.startTime;
    }

    /**
     * 设置startTime
     * 
     * @param startTime
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * 获取endTime
     * 
     * @return endTime
     */
    @Column(name = "END_TIME", nullable = true)
    public Date getEndTime() {
        return this.endTime;
    }

    /**
     * 设置endTime
     * 
     * @param endTime
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
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

    @Transient
	public List<RecordDrug> getRecordDrug() {
		return recordDrug;
	}

	public void setRecordDrug(List<RecordDrug> recordDrug) {
		this.recordDrug = recordDrug;
	}

	@Transient
	public List<RecordTest> getRecordTest() {
		return recordTest;
	}

	public void setRecordTest(List<RecordTest> recordTest) {
		this.recordTest = recordTest;
	}
    
}