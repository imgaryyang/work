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

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * TREAT_RECORD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */

public class IRecord  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 4236286958848019046L;

    private String id;
    /** treatId */
    private String treatId;

    /** treatNo */
    private String treatNo;

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
    
    private String form;
    
    private String oneSize;
    
    private String way;

    /** status */
    private String status;
    private String actNo;
    private String recipeNo;
    private Date startDate;
    private Date endDate;
    private String feeItemNo;
    private String cardNo;
    private String cardType;
    
 

	//缴费字段
    private String groupNo;
    private String groupSort;
    private String code;
    private String spec;
    private String unit;
    private BigDecimal num;
    private String type;
    private String miType;
    private  BigDecimal myselfscale;
    
    
    //收费字段
    private BigDecimal miAmt;
    private BigDecimal paAmt;
    private BigDecimal myselfAmt;
    private BigDecimal reduceAmt;
    private String chargeUser;
    private Date chargeTime;

    
    public String getCardType() {
 		return cardType;
 	}

 	public void setCardType(String cardType) {
 		this.cardType = cardType;
 	}
    public BigDecimal getMiAmt() {
		return miAmt;
	}

	public void setMiAmt(BigDecimal miAmt) {
		this.miAmt = miAmt;
	}

	public BigDecimal getPaAmt() {
		return paAmt;
	}

	public void setPaAmt(BigDecimal paAmt) {
		this.paAmt = paAmt;
	}

	public BigDecimal getMyselfAmt() {
		return myselfAmt;
	}

	public void setMyselfAmt(BigDecimal myselfAmt) {
		this.myselfAmt = myselfAmt;
	}

	public BigDecimal getReduceAmt() {
		return reduceAmt;
	}

	public void setReduceAmt(BigDecimal reduceAmt) {
		this.reduceAmt = reduceAmt;
	}

	public String getChargeUser() {
		return chargeUser;
	}

	public void setChargeUser(String chargeUser) {
		this.chargeUser = chargeUser;
	}

	public Date getChargeTime() {
		return chargeTime;
	}

	public void setChargeTime(Date chargeTime) {
		this.chargeTime = chargeTime;
	}

	public String getSpec() {
		return spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getNum() {
		return num;
	}

	public void setNum(BigDecimal num) {
		this.num = num;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMiType() {
		return miType;
	}

	public void setMiType(String miType) {
		this.miType = miType;
	}

	public BigDecimal getMyselfscale() {
		return myselfscale;
	}

	public void setMyselfscale(BigDecimal myselfscale) {
		this.myselfscale = myselfscale;
	}

	public BigDecimal getCost() {
		return cost;
	}

	public void setCost(BigDecimal cost) {
		this.cost = cost;
	}

	public BigDecimal getRealAmt() {
		return realAmt;
	}

	public void setRealAmt(BigDecimal realAmt) {
		this.realAmt = realAmt;
	}

	public Date getRecipeTime() {
		return recipeTime;
	}

	public void setRecipeTime(Date recipeTime) {
		this.recipeTime = recipeTime;
	}

	private BigDecimal cost;
    private BigDecimal realAmt;
    private Date recipeTime;

    
    
    
    
    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getGroupNo() {
		return groupNo;
	}

	public void setGroupNo(String groupNo) {
		this.groupNo = groupNo;
	}

	public String getGroupSort() {
		return groupSort;
	}

	public void setGroupSort(String groupSort) {
		this.groupSort = groupSort;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getFeeItemNo() {
		return feeItemNo;
	}

	public void setFeeItemNo(String feeItemNo) {
		this.feeItemNo = feeItemNo;
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

	public String getRecipeNo() {
		return recipeNo;
	}

	public void setRecipeNo(String recipeNo) {
		this.recipeNo = recipeNo;
	}

	public String getActNo() {
		return actNo;
	}

	public void setActNo(String actNo) {
		this.actNo = actNo;
	}

	/**
     * 获取treatId
     * 
     * @return treatId
     */
    public String getTreatId() {
        return this.treatId;
    }

    /**
     * 设置treatId
     * 
     * @param treatId
     */
    public void setTreatId(String treatId) {
        this.treatId = treatId;
    }

    /**
     * 获取treatNo
     * 
     * @return treatNo
     */
    public String getTreatNo() {
        return this.treatNo;
    }

    /**
     * 设置treatNo
     * 
     * @param treatNo
     */
    public void setTreatNo(String treatNo) {
        this.treatNo = treatNo;
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

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	public String getOneSize() {
		return oneSize;
	}

	public void setOneSize(String oneSize) {
		this.oneSize = oneSize;
	}

	public String getWay() {
		return way;
	}

	public void setWay(String way) {
		this.way = way;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
    
}