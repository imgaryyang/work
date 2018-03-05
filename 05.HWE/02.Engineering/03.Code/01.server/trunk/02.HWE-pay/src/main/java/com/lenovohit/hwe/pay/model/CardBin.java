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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CARD_BIN
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */	
@Entity
@Table(name = "PAY_CARD_BIN")
public class CardBin extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -8648042306852089682L;

    /** cardBin */
    private String cardBin;

    /** cardBinNum */
    private Integer cardBinNum;

    /** cardName */
    private String cardName;

    /** cardNum */
    private Integer cardNum;

    /** 1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA */
    private String cardType;

    /** bankCode */
    private String bankCode;

    /** bankName */
    private String bankName;

    /** cleanBankCode */
    private String cleanBankCode;

    /** cleanBankName */
    private String cleanBankName;

    /** privince */
    private String privince;

    /** city */
    private String city;

    /** cityCode */
    private String cityCode;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取cardBin
     * 
     * @return cardBin
     */
    @Column(name = "CARD_BIN", nullable = true, length = 10)
    public String getCardBin() {
        return this.cardBin;
    }

    /**
     * 设置cardBin
     * 
     * @param cardBin
     */
    public void setCardBin(String cardBin) {
        this.cardBin = cardBin;
    }

    /**
     * 获取cardBinNum
     * 
     * @return cardBinNum
     */
    @Column(name = "CARD_BIN_NUM", nullable = true, length = 10)
    public Integer getCardBinNum() {
        return this.cardBinNum;
    }

    /**
     * 设置cardBinNum
     * 
     * @param cardBinNum
     */
    public void setCardBinNum(Integer cardBinNum) {
        this.cardBinNum = cardBinNum;
    }

    /**
     * 获取cardName
     * 
     * @return cardName
     */
    @Column(name = "CARD_NAME", nullable = true, length = 100)
    public String getCardName() {
        return this.cardName;
    }

    /**
     * 设置cardName
     * 
     * @param cardName
     */
    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    /**
     * 获取cardNum
     * 
     * @return cardNum
     */
    @Column(name = "CARD_NUM", nullable = true, length = 10)
    public Integer getCardNum() {
        return this.cardNum;
    }

    /**
     * 设置cardNum
     * 
     * @param cardNum
     */
    public void setCardNum(Integer cardNum) {
        this.cardNum = cardNum;
    }

    /**
     * 获取1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA
     * 
     * @return 1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA
     */
    @Column(name = "CARD_TYPE", nullable = true, length = 10)
    public String getCardType() {
        return this.cardType;
    }

    /**
     * 设置1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA
     * 
     * @param cardType
     *          1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA
     */
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    /**
     * 获取bankCode
     * 
     * @return bankCode
     */
    @Column(name = "BANK_CODE", nullable = true, length = 20)
    public String getBankCode() {
        return this.bankCode;
    }

    /**
     * 设置bankCode
     * 
     * @param bankCode
     */
    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    /**
     * 获取bankName
     * 
     * @return bankName
     */
    @Column(name = "BANK_NAME", nullable = true, length = 100)
    public String getBankName() {
        return this.bankName;
    }

    /**
     * 设置bankName
     * 
     * @param bankName
     */
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    /**
     * 获取cleanBankCode
     * 
     * @return cleanBankCode
     */
    @Column(name = "CLEAN_BANK_CODE", nullable = true, length = 12)
    public String getCleanBankCode() {
        return this.cleanBankCode;
    }

    /**
     * 设置cleanBankCode
     * 
     * @param cleanBankCode
     */
    public void setCleanBankCode(String cleanBankCode) {
        this.cleanBankCode = cleanBankCode;
    }

    /**
     * 获取cleanBankName
     * 
     * @return cleanBankName
     */
    @Column(name = "CLEAN_BANK_NAME", nullable = true, length = 100)
    public String getCleanBankName() {
        return this.cleanBankName;
    }

    /**
     * 设置cleanBankName
     * 
     * @param cleanBankName
     */
    public void setCleanBankName(String cleanBankName) {
        this.cleanBankName = cleanBankName;
    }

    /**
     * 获取privince
     * 
     * @return privince
     */
    @Column(name = "PRIVINCE", nullable = true, length = 50)
    public String getPrivince() {
        return this.privince;
    }

    /**
     * 设置privince
     * 
     * @param privince
     */
    public void setPrivince(String privince) {
        this.privince = privince;
    }

    /**
     * 获取city
     * 
     * @return city
     */
    @Column(name = "CITY", nullable = true, length = 50)
    public String getCity() {
        return this.city;
    }

    /**
     * 设置city
     * 
     * @param city
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * 获取cityCode
     * 
     * @return cityCode
     */
    @Column(name = "CITY_CODE", nullable = true, length = 4)
    public String getCityCode() {
        return this.cityCode;
    }

    /**
     * 设置cityCode
     * 
     * @param cityCode
     */
    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @return A - 初始
            0 - 正常
            1 - 废弃
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 废弃
     */
    public void setStatus(String status) {
        this.status = status;
    }
}