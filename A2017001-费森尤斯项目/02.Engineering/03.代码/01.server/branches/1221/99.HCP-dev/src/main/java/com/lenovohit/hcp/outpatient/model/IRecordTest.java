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

package com.lenovohit.hcp.outpatient.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * TREAT_RECORD_TEST
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class IRecordTest  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1876622471411203385L;

    /** recordId */
    private String recordId;

    /** recordNo */
    private String recordNo;

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
    private String status;
    

   

	/** comment */
    private String comment;
    private String hosNo;
    private String hosName;
    private String proNo;
    private String proName;
    private String cardNo;
    private String cardType;
    private String applyNo;
    private Date startDate;
    private Date endDate;
    
    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getHosNo() {
		return hosNo;
	}

	public void setHosNo(String hosNo) {
		this.hosNo = hosNo;
	}

	public String getHosName() {
		return hosName;
	}

	public void setHosName(String hosName) {
		this.hosName = hosName;
	}

	public String getProNo() {
		return proNo;
	}

	public void setProNo(String proNo) {
		this.proNo = proNo;
	}

	public String getProName() {
		return proName;
	}

	public void setProName(String proName) {
		this.proName = proName;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}


	/**
     * 获取recordId
     * 
     * @return recordId
     */
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
     * 获取pkgId
     * 
     * @return pkgId
     */
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

    /**
     * 获取optDoc
     * 
     * @return optDoc
     */
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
}