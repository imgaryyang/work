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

import com.lenovohit.hwe.base.model.AuditableModel;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * TREAT_INPATIENT_CHARGE_DETAIL
 * 
 * @author zyus
 * @version 1.0.0 2018-02-28
 */
@Entity
@Table(name = "TREAT_INPATIENT_CHARGE_DETAIL")
public class InpatientChargeDetail extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7476247925060799204L;

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

    /** docJobTitle */
    private String docJobTitle;

    /** proId */
    private String proId;

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;

    /** cardId */
    private String cardId;

    /** cardNo */
    private String cardNo;

    /** cardType */
    private String cardType;

    /** inpatientNo */
    private String inpatientNo;

    /** groupNo */
    private String groupNo;

    /** groupSort */
    private Integer groupSort;

    /** code */
    private String code;

    /** name */
    private String name;

    /** spec */
    private String spec;

    /** unit */
    private String unit;

    /** num */
    private BigDecimal num;

    /** price */
    private BigDecimal price;

    /** 治疗费、X光费、化验费 */
    private String type;

    /** cost */
    private BigDecimal cost;

    /** miType */
    private String miType;

    /** myselfScale */
    private BigDecimal myselfScale;

    /** amount */
    private BigDecimal amount;

    /** realAmount */
    private BigDecimal realAmount;

    /** chargeUser */
    private String chargeUser;

    /** chargeTime */
    private Date chargeTime;

    /** comment */
    private String comment;

    /** appChannel */
    private String appChannel;

    /** appUser */
    private String appUser;

    /** status */
    private String status;

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
     * 获取docJobTitle
     * 
     * @return docJobTitle
     */
    @Column(name = "DOC_JOB_TITLE", nullable = true, length = 50)
    public String getDocJobTitle() {
        return this.docJobTitle;
    }

    /**
     * 设置docJobTitle
     * 
     * @param docJobTitle
     */
    public void setDocJobTitle(String docJobTitle) {
        this.docJobTitle = docJobTitle;
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
     * 获取cardId
     * 
     * @return cardId
     */
    @Column(name = "CARD_ID", nullable = true, length = 32)
    public String getCardId() {
        return this.cardId;
    }

    /**
     * 设置cardId
     * 
     * @param cardId
     */
    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    /**
     * 获取cardNo
     * 
     * @return cardNo
     */
    @Column(name = "CARD_NO", nullable = true, length = 50)
    public String getCardNo() {
        return this.cardNo;
    }

    /**
     * 设置cardNo
     * 
     * @param cardNo
     */
    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    /**
     * 获取cardType
     * 
     * @return cardType
     */
    @Column(name = "CARD_TYPE", nullable = true, length = 1)
    public String getCardType() {
        return this.cardType;
    }

    /**
     * 设置cardType
     * 
     * @param cardType
     */
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    /**
     * 获取inpatientNo
     * 
     * @return inpatientNo
     */
    @Column(name = "INPATIENT_NO", nullable = true, length = 50)
    public String getInpatientNo() {
        return this.inpatientNo;
    }

    /**
     * 设置inpatientNo
     * 
     * @param inpatientNo
     */
    public void setInpatientNo(String inpatientNo) {
        this.inpatientNo = inpatientNo;
    }

    /**
     * 获取groupNo
     * 
     * @return groupNo
     */
    @Column(name = "GROUP_NO", nullable = true, length = 50)
    public String getGroupNo() {
        return this.groupNo;
    }

    /**
     * 设置groupNo
     * 
     * @param groupNo
     */
    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    /**
     * 获取groupSort
     * 
     * @return groupSort
     */
    @Column(name = "GROUP_SORT", nullable = true, length = 11)
    public Integer getGroupSort() {
        return this.groupSort;
    }

    /**
     * 设置groupSort
     * 
     * @param groupSort
     */
    public void setGroupSort(Integer groupSort) {
        this.groupSort = groupSort;
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
     * 获取spec
     * 
     * @return spec
     */
    @Column(name = "SPEC", nullable = true, length = 50)
    public String getSpec() {
        return this.spec;
    }

    /**
     * 设置spec
     * 
     * @param spec
     */
    public void setSpec(String spec) {
        this.spec = spec;
    }

    /**
     * 获取unit
     * 
     * @return unit
     */
    @Column(name = "UNIT", nullable = true, length = 20)
    public String getUnit() {
        return this.unit;
    }

    /**
     * 设置unit
     * 
     * @param unit
     */
    public void setUnit(String unit) {
        this.unit = unit;
    }

    /**
     * 获取num
     * 
     * @return num
     */
    @Column(name = "NUM", nullable = true, length = 10)
    public BigDecimal getNum() {
        return this.num;
    }

    /**
     * 设置num
     * 
     * @param num
     */
    public void setNum(BigDecimal num) {
        this.num = num;
    }

    /**
     * 获取price
     * 
     * @return price
     */
    @Column(name = "PRICE", nullable = true, length = 17)
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
     * 获取治疗费、X光费、化验费
     * 
     * @return 治疗费、X光费、化验费
     */
    @Column(name = "TYPE", nullable = true, length = 2)
    public String getType() {
        return this.type;
    }

    /**
     * 设置治疗费、X光费、化验费
     * 
     * @param type
     *          治疗费、X光费、化验费
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取cost
     * 
     * @return cost
     */
    @Column(name = "COST", nullable = true, length = 17)
    public BigDecimal getCost() {
        return this.cost;
    }

    /**
     * 设置cost
     * 
     * @param cost
     */
    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    /**
     * 获取miType
     * 
     * @return miType
     */
    @Column(name = "MI_TYPE", nullable = true, length = 1)
    public String getMiType() {
        return this.miType;
    }

    /**
     * 设置miType
     * 
     * @param miType
     */
    public void setMiType(String miType) {
        this.miType = miType;
    }

    /**
     * 获取myselfScale
     * 
     * @return myselfScale
     */
    @Column(name = "MYSELF_SCALE", nullable = true, length = 5)
    public BigDecimal getMyselfScale() {
        return this.myselfScale;
    }

    /**
     * 设置myselfScale
     * 
     * @param myselfScale
     */
    public void setMyselfScale(BigDecimal myselfScale) {
        this.myselfScale = myselfScale;
    }

    /**
     * 获取amount
     * 
     * @return amount
     */
    @Column(name = "AMOUNT", nullable = true, length = 17)
    public BigDecimal getAmount() {
        return this.amount;
    }

    /**
     * 设置amount
     * 
     * @param amount
     */
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    /**
     * 获取realAmount
     * 
     * @return realAmount
     */
    @Column(name = "REAL_AMOUNT", nullable = true, length = 17)
    public BigDecimal getRealAmount() {
        return this.realAmount;
    }

    /**
     * 设置realAmount
     * 
     * @param realAmount
     */
    public void setRealAmount(BigDecimal realAmount) {
        this.realAmount = realAmount;
    }

    /**
     * 获取chargeUser
     * 
     * @return chargeUser
     */
    @Column(name = "CHARGE_USER", nullable = true, length = 50)
    public String getChargeUser() {
        return this.chargeUser;
    }

    /**
     * 设置chargeUser
     * 
     * @param chargeUser
     */
    public void setChargeUser(String chargeUser) {
        this.chargeUser = chargeUser;
    }

    /**
     * 获取chargeTime
     * 
     * @return chargeTime
     */
    @Column(name = "CHARGE_TIME", nullable = true, length = 20)
    public Date getChargeTime() {
        return this.chargeTime;
    }

    /**
     * 设置chargeTime
     * 
     * @param chargeTime
     */
    public void setChargeTime(Date chargeTime) {
        this.chargeTime = chargeTime;
    }

    /**
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT", nullable = true, length = 50)
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
     * 获取appChannel
     * 
     * @return appChannel
     */
    @Column(name = "APP_CHANNEL", nullable = true, length = 3)
    public String getAppChannel() {
        return this.appChannel;
    }

    /**
     * 设置appChannel
     * 
     * @param appChannel
     */
    public void setAppChannel(String appChannel) {
        this.appChannel = appChannel;
    }

    /**
     * 获取appUser
     * 
     * @return appUser
     */
    @Column(name = "APP_USER", nullable = true, length = 50)
    public String getAppUser() {
        return this.appUser;
    }

    /**
     * 设置appUser
     * 
     * @param appUser
     */
    public void setAppUser(String appUser) {
        this.appUser = appUser;
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
}