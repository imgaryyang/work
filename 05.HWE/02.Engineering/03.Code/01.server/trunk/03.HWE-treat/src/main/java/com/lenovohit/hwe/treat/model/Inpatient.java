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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_INPATIENT
 * 
 * @author zyus
 * @version 1.0.0 2018-01-30
 */
@Entity
@Table(name = "TREAT_INPATIENT")
public class Inpatient extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -9115842127718330523L;

    /** proId */
    private String proId;

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;

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

    /** areaId */
    private String areaId;

    /** areaNo */
    private String areaNo;

    /** areaName */
    private String areaName;

    /** bedId */
    private String bedId;

    /** bedNo */
    private String bedNo;

    /** bedName */
    private String bedName;

    /** docId */
    private String docId;

    /** docNo */
    private String docNo;

    /** docName */
    private String docName;

    /** nurId */
    private String nurId;

    /** nurNo */
    private String nurNo;

    /** nurName */
    private String nurName;

    /** no */
    private String no;

    /** num */
    private String num;

    /** name */
    private String name;

    /** mobile */
    private String mobile;

    /** idNo */
    private String idNo;

    /** type */
    private String type;

    /** inTime */
    private String inTime;

    /** inDiagnose */
    private String inDiagnose;

    /** nurLevel */
    private String nurLevel;

    /** outTime */
    private String outTime;

    /** cardNo */
    private String cardNo;

    /** cardType */
    private String cardType;

    /** cardStatus */
    private String cardStatus;

    /** total */
    private BigDecimal total;

    /** balance */
    private BigDecimal balance;

    /** acctNo */
    private String acctNo;

    /** acctStatus */
    private String acctStatus;

    /** openType */
    private String openType;

    /** status */
    private String status;

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
    @Column(name = "DEP_NAME", nullable = true, length = 70)
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
     * 获取areaId
     * 
     * @return areaId
     */
    @Column(name = "AREA_ID", nullable = true, length = 32)
    public String getAreaId() {
        return this.areaId;
    }

    /**
     * 设置areaId
     * 
     * @param areaId
     */
    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    /**
     * 获取areaNo
     * 
     * @return areaNo
     */
    @Column(name = "AREA_NO", nullable = true, length = 50)
    public String getAreaNo() {
        return this.areaNo;
    }

    /**
     * 设置areaNo
     * 
     * @param areaNo
     */
    public void setAreaNo(String areaNo) {
        this.areaNo = areaNo;
    }

    /**
     * 获取areaName
     * 
     * @return areaName
     */
    @Column(name = "AREA_NAME", nullable = true, length = 70)
    public String getAreaName() {
        return this.areaName;
    }

    /**
     * 设置areaName
     * 
     * @param areaName
     */
    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    /**
     * 获取bedId
     * 
     * @return bedId
     */
    @Column(name = "BED_ID", nullable = true, length = 32)
    public String getBedId() {
        return this.bedId;
    }

    /**
     * 设置bedId
     * 
     * @param bedId
     */
    public void setBedId(String bedId) {
        this.bedId = bedId;
    }

    /**
     * 获取bedNo
     * 
     * @return bedNo
     */
    @Column(name = "BED_NO", nullable = true, length = 50)
    public String getBedNo() {
        return this.bedNo;
    }

    /**
     * 设置bedNo
     * 
     * @param bedNo
     */
    public void setBedNo(String bedNo) {
        this.bedNo = bedNo;
    }

    /**
     * 获取bedName
     * 
     * @return bedName
     */
    @Column(name = "BED_NAME", nullable = true, length = 70)
    public String getBedName() {
        return this.bedName;
    }

    /**
     * 设置bedName
     * 
     * @param bedName
     */
    public void setBedName(String bedName) {
        this.bedName = bedName;
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
    @Column(name = "DOC_NAME", nullable = true, length = 70)
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
     * 获取nurId
     * 
     * @return nurId
     */
    @Column(name = "NUR_ID", nullable = true, length = 32)
    public String getNurId() {
        return this.nurId;
    }

    /**
     * 设置nurId
     * 
     * @param nurId
     */
    public void setNurId(String nurId) {
        this.nurId = nurId;
    }

    /**
     * 获取nurNo
     * 
     * @return nurNo
     */
    @Column(name = "NUR_NO", nullable = true, length = 50)
    public String getNurNo() {
        return this.nurNo;
    }

    /**
     * 设置nurNo
     * 
     * @param nurNo
     */
    public void setNurNo(String nurNo) {
        this.nurNo = nurNo;
    }

    /**
     * 获取nurName
     * 
     * @return nurName
     */
    @Column(name = "NUR_NAME", nullable = true, length = 70)
    public String getNurName() {
        return this.nurName;
    }

    /**
     * 设置nurName
     * 
     * @param nurName
     */
    public void setNurName(String nurName) {
        this.nurName = nurName;
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
     * 获取num
     * 
     * @return num
     */
    @Column(name = "NUM", nullable = true, length = 50)
    public String getNum() {
        return this.num;
    }

    /**
     * 设置num
     * 
     * @param num
     */
    public void setNum(String num) {
        this.num = num;
    }

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 70)
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
     * 获取idNo
     * 
     * @return idNo
     */
    @Column(name = "ID_NO", nullable = true, length = 18)
    public String getIdNo() {
        return this.idNo;
    }

    /**
     * 设置idNo
     * 
     * @param idNo
     */
    public void setIdNo(String idNo) {
        this.idNo = idNo;
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
     * 获取inTime
     * 
     * @return inTime
     */
    @Column(name = "IN_TIME", nullable = true, length = 20)
    public String getInTime() {
        return this.inTime;
    }

    /**
     * 设置inTime
     * 
     * @param inTime
     */
    public void setInTime(String inTime) {
        this.inTime = inTime;
    }

    /**
     * 获取inDiagnose
     * 
     * @return inDiagnose
     */
    @Column(name = "IN_DIAGNOSE", nullable = true, length = 1000)
    public String getInDiagnose() {
        return this.inDiagnose;
    }

    /**
     * 设置inDiagnose
     * 
     * @param inDiagnose
     */
    public void setInDiagnose(String inDiagnose) {
        this.inDiagnose = inDiagnose;
    }

    /**
     * 获取nurLevel
     * 
     * @return nurLevel
     */
    @Column(name = "NUR_LEVEL", nullable = true, length = 1)
    public String getNurLevel() {
        return this.nurLevel;
    }

    /**
     * 设置nurLevel
     * 
     * @param nurLevel
     */
    public void setNurLevel(String nurLevel) {
        this.nurLevel = nurLevel;
    }

    /**
     * 获取outTime
     * 
     * @return outTime
     */
    @Column(name = "OUT_TIME", nullable = true, length = 20)
    public String getOutTime() {
        return this.outTime;
    }

    /**
     * 设置outTime
     * 
     * @param outTime
     */
    public void setOutTime(String outTime) {
        this.outTime = outTime;
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
     * 获取cardStatus
     * 
     * @return cardStatus
     */
    @Column(name = "CARD_STATUS", nullable = true, length = 1)
    public String getCardStatus() {
        return this.cardStatus;
    }

    /**
     * 设置cardStatus
     * 
     * @param cardStatus
     */
    public void setCardStatus(String cardStatus) {
        this.cardStatus = cardStatus;
    }

    /**
     * 获取total
     * 
     * @return total
     */
    @Column(name = "TOTAL", nullable = true)
    public BigDecimal getTotal() {
        return this.total;
    }

    /**
     * 设置total
     * 
     * @param total
     */
    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    /**
     * 获取balance
     * 
     * @return balance
     */
    @Column(name = "BALANCE", nullable = true)
    public BigDecimal getBalance() {
        return this.balance;
    }

    /**
     * 设置balance
     * 
     * @param balance
     */
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    /**
     * 获取acctNo
     * 
     * @return acctNo
     */
    @Column(name = "ACCT_NO", nullable = true, length = 50)
    public String getAcctNo() {
        return this.acctNo;
    }

    /**
     * 设置acctNo
     * 
     * @param acctNo
     */
    public void setAcctNo(String acctNo) {
        this.acctNo = acctNo;
    }

    /**
     * 获取acctStatus
     * 
     * @return acctStatus
     */
    @Column(name = "ACCT_STATUS", nullable = true, length = 1)
    public String getAcctStatus() {
        return this.acctStatus;
    }

    /**
     * 设置acctStatus
     * 
     * @param acctStatus
     */
    public void setAcctStatus(String acctStatus) {
        this.acctStatus = acctStatus;
    }

    /**
     * 获取openType
     * 
     * @return openType
     */
    @Column(name = "OPEN_TYPE", nullable = true, length = 1)
    public String getOpenType() {
        return this.openType;
    }

    /**
     * 设置openType
     * 
     * @param openType
     */
    public void setOpenType(String openType) {
        this.openType = openType;
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