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

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_RECORD_TEST
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_RECORD_TEST")
public class RecordTest extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1876622471411203385L;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** proId */
    private String proId;

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;
    
    /** recordId */
    private String recordId;

    /** recordNo */
    private String recordNo;
    
    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

    /** pkgId */
    private String pkgId;

    /** pkgName */
    private String pkgName;

    /** itemId */
    private String itemId;

    /** itemName */
    private String itemName;

    /** itemType */
    private String itemType;

    /** feeitemId */
    private String feeitemId;
    
    /** feeitemNo */
    private String feeitemNo;
    
    /** feegroupId */
    private String feegroupId;
    
    /** feegroupNo */
    private String feegroupNo;
    
    /** optDoc */
    private String optDoc;

    /** optDocName */
    private String optDocName;

    /** applyDoc */
    private String applyDoc;

    /** applyDocName */
    private String applyDocName;

    /** auditDoc */
    private String auditDoc;

    /** auditDocName */
    private String auditDocName;

    /** barcode */
    private String barcode;

    /** sampleNo */
    private String sampleNo;

    /** sample */
    private String sample;

    /** collectTime */
    private Date collectTime;

    /** receiveTime */
    private Date receiveTime;

    /** auditTime */
    private Date auditTime;

    /** reportTime */
    private Date reportTime;

    /** machineNo */
    private String machineNo;

    /** machineName */
    private String machineName;

    /** comment */
    private String comment;
    
    //检查项目所关联TestDetail检查项目明细表的数据
    private List<TestDetail> testDetail;
	

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
     * 获取recordId
     * 
     * @return recordId
     */
    @Column(name = "RECORD_ID", nullable = true, length = 32)
    public String getRecordId() {
        return this.recordId;
    }

    /**
     * 设置recordId
     * 
     * @param recordId
     */
    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    /**
     * 获取recordNo
     * 
     * @return recordNo
     */
    @Column(name = "RECORD_NO", nullable = true, length = 50)
    public String getRecordNo() {
        return this.recordNo;
    }

    /**
     * 设置recordNo
     * 
     * @param recordNo
     */
    public void setRecordNo(String recordNo) {
        this.recordNo = recordNo;
    }

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
     * 获取pkgId
     * 
     * @return pkgId
     */
    @Column(name = "PKG_ID", nullable = true, length = 32)
    public String getPkgId() {
        return this.pkgId;
    }

    /**
     * 设置pkgId
     * 
     * @param pkgId
     */
    public void setPkgId(String pkgId) {
        this.pkgId = pkgId;
    }

    /**
     * 获取pkgName
     * 
     * @return pkgName
     */
    @Column(name = "PKG_NAME", nullable = true, length = 200)
    public String getPkgName() {
        return this.pkgName;
    }

    /**
     * 设置pkgName
     * 
     * @param pkgName
     */
    public void setPkgName(String pkgName) {
        this.pkgName = pkgName;
    }

    /**
     * 获取itemId
     * 
     * @return itemId
     */
    @Column(name = "ITEM_ID", nullable = true, length = 32)
    public String getItemId() {
        return this.itemId;
    }

    /**
     * 设置itemId
     * 
     * @param itemId
     */
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    /**
     * 获取itemName
     * 
     * @return itemName
     */
    @Column(name = "ITEM_NAME", nullable = true, length = 200)
    public String getItemName() {
        return this.itemName;
    }

    /**
     * 设置itemName
     * 
     * @param itemName
     */
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    /**
     * 获取itemType
     * 
     * @return itemType
     */
    @Column(name = "ITEM_TYPE", nullable = true, length = 20)
    public String getItemType() {
        return this.itemType;
    }

    /**
     * 设置itemType
     * 
     * @param itemType
     */
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getFeeitemId() {
		return feeitemId;
	}

	public void setFeeitemId(String feeitemId) {
		this.feeitemId = feeitemId;
	}

	public String getFeeitemNo() {
		return feeitemNo;
	}

	public void setFeeitemNo(String feeitemNo) {
		this.feeitemNo = feeitemNo;
	}

	public String getFeegroupId() {
		return feegroupId;
	}

	public void setFeegroupId(String feegroupId) {
		this.feegroupId = feegroupId;
	}

	public String getFeegroupNo() {
		return feegroupNo;
	}

	public void setFeegroupNo(String feegroupNo) {
		this.feegroupNo = feegroupNo;
	}

	/**
     * 获取optDoc
     * 
     * @return optDoc
     */
    @Column(name = "OPT_DOC", nullable = true, length = 32)
    public String getOptDoc() {
        return this.optDoc;
    }

    /**
     * 设置optDoc
     * 
     * @param optDoc
     */
    public void setOptDoc(String optDoc) {
        this.optDoc = optDoc;
    }

    /**
     * 获取optDocName
     * 
     * @return optDocName
     */
    @Column(name = "OPT_DOC_NAME", nullable = true, length = 50)
    public String getOptDocName() {
        return this.optDocName;
    }

    /**
     * 设置optDocName
     * 
     * @param optDocName
     */
    public void setOptDocName(String optDocName) {
        this.optDocName = optDocName;
    }

    /**
     * 获取applyDoc
     * 
     * @return applyDoc
     */
    @Column(name = "APPLY_DOC", nullable = true, length = 32)
    public String getApplyDoc() {
        return this.applyDoc;
    }

    /**
     * 设置applyDoc
     * 
     * @param applyDoc
     */
    public void setApplyDoc(String applyDoc) {
        this.applyDoc = applyDoc;
    }

    /**
     * 获取applyDocName
     * 
     * @return applyDocName
     */
    @Column(name = "APPLY_DOC_NAME", nullable = true, length = 50)
    public String getApplyDocName() {
        return this.applyDocName;
    }

    /**
     * 设置applyDocName
     * 
     * @param applyDocName
     */
    public void setApplyDocName(String applyDocName) {
        this.applyDocName = applyDocName;
    }

    /**
     * 获取auditDoc
     * 
     * @return auditDoc
     */
    @Column(name = "AUDIT_DOC", nullable = true, length = 32)
    public String getAuditDoc() {
        return this.auditDoc;
    }

    /**
     * 设置auditDoc
     * 
     * @param auditDoc
     */
    public void setAuditDoc(String auditDoc) {
        this.auditDoc = auditDoc;
    }

    /**
     * 获取auditDocName
     * 
     * @return auditDocName
     */
    @Column(name = "AUDIT_DOC_NAME", nullable = true, length = 50)
    public String getAuditDocName() {
        return this.auditDocName;
    }

    /**
     * 设置auditDocName
     * 
     * @param auditDocName
     */
    public void setAuditDocName(String auditDocName) {
        this.auditDocName = auditDocName;
    }

    /**
     * 获取barcode
     * 
     * @return barcode
     */
    @Column(name = "BARCODE", nullable = true, length = 50)
    public String getBarcode() {
        return this.barcode;
    }

    /**
     * 设置barcode
     * 
     * @param barcode
     */
    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    /**
     * 获取sampleNo
     * 
     * @return sampleNo
     */
    @Column(name = "SAMPLE_NO", nullable = true, length = 50)
    public String getSampleNo() {
        return this.sampleNo;
    }

    /**
     * 设置sampleNo
     * 
     * @param sampleNo
     */
    public void setSampleNo(String sampleNo) {
        this.sampleNo = sampleNo;
    }

    /**
     * 获取sample
     * 
     * @return sample
     */
    @Column(name = "SAMPLE", nullable = true, length = 100)
    public String getSample() {
        return this.sample;
    }

    /**
     * 设置sample
     * 
     * @param sample
     */
    public void setSample(String sample) {
        this.sample = sample;
    }

    /**
     * 获取collectTime
     * 
     * @return collectTime
     */
    @Column(name = "COLLECT_TIME", nullable = true)
    public Date getCollectTime() {
        return this.collectTime;
    }

    /**
     * 设置collectTime
     * 
     * @param collectTime
     */
    public void setCollectTime(Date collectTime) {
        this.collectTime = collectTime;
    }

    /**
     * 获取receiveTime
     * 
     * @return receiveTime
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "RECEIVE_TIME", nullable = true)
    public Date getReceiveTime() {
        return this.receiveTime;
    }

    /**
     * 设置receiveTime
     * 
     * @param receiveTime
     */
    public void setReceiveTime(Date receiveTime) {
        this.receiveTime = receiveTime;
    }

    /**
     * 获取auditTime
     * 
     * @return auditTime
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "AUDIT_TIME", nullable = true)
    public Date getAuditTime() {
        return this.auditTime;
    }

    /**
     * 设置auditTime
     * 
     * @param auditTime
     */
    public void setAuditTime(Date auditTime) {
        this.auditTime = auditTime;
    }

    /**
     * 获取reportTime
     * 
     * @return reportTime
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "REPORT_TIME", nullable = true)
    public Date getReportTime() {
        return this.reportTime;
    }

    /**
     * 设置reportTime
     * 
     * @param reportTime
     */
    public void setReportTime(Date reportTime) {
        this.reportTime = reportTime;
    }

    /**
     * 获取machineNo
     * 
     * @return machineNo
     */
    @Column(name = "MACHINE_NO", nullable = true, length = 50)
    public String getMachineNo() {
        return this.machineNo;
    }

    /**
     * 设置machineNo
     * 
     * @param machineNo
     */
    public void setMachineNo(String machineNo) {
        this.machineNo = machineNo;
    }

    /**
     * 获取machineName
     * 
     * @return machineName
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "MACHINE_NAME", nullable = true, length = 100)
    public String getMachineName() {
        return this.machineName;
    }

    /**
     * 设置machineName
     * 
     * @param machineName
     */
    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    /**
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT_", nullable = true, length = 200)
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

    @Transient
	public List<TestDetail> getTestDetail() {
		return testDetail;
	}

	public void setTestDetail(List<TestDetail> testDetail) {
		this.testDetail = testDetail;
	}
    
}