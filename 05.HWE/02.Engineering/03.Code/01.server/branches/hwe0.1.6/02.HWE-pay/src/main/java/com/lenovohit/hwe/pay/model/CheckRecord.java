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

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.configuration.Configuration;

import com.lenovohit.hwe.base.model.AuditableModel;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

/**
 * PAY_CHECK_RECORD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CHECK_RECORD")
public class CheckRecord extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 672288853533380030L;
    public static String CHK_TYPE_ALL = "0";	
	public static String CHK_TYPE_PAY = "1";	
	public static String CHK_TYPE_REFUND = "2";	
	public static String CHK_TYPE_RETURN = "3";	
	public static String CHK_OPTTYPE_AUTO = "0";	
	public static String CHK_OPTTYPE_HAND= "1";	
	
	public static String CHK_STAT_INITIAL = "A";	
	public static String CHK_STAT_FINISH = "0";	
	public static String CHK_STAT_FAILURE = "9";	
	public static String CHK_STAT_FILE_SUCCESS = "1";	
	public static String CHK_STAT_FILE_FAILURE = "2";	
	public static String CHK_STAT_IMP_SUCCESS = "3";	
	public static String CHK_STAT_IMP_FAILURE = "4";	
	public static String CHK_STAT_CHK_SUCCESS = "5";	

    /** pcId */
    private String pcId;
    
    /** mchId */
    private String mchId;

    /** chkDate */
    private String chkDate;

    /** 0 - all
        1 - 支付
        2 - 退款 */
    private String chkType;

    /** chkFile */
    private String chkFile;

    /** 0 - 系统自动
        1 - 手工 */
    private String optType;

    /** opterator */
    private String opterator;

    /** 总记录数 */
    private Integer total;

    /** amt */
    private BigDecimal amt;

    /** successTotal */
    private Integer successTotal;

    /** successAmt */
    private BigDecimal successAmt;

    /** syncNum */
    private Integer syncNum;

    /** socket
        ftp
        http
        https
        query 
        import */
    private String syncType;

    /** syncTime */
    private Date syncTime;

    /** impTime */
    private Date impTime;

    /** chkTime */
    private Date chkTime;

    private String status;

    private PayMerchant payMerchant;

    /**
     * 获取pcId
     * 
     * @return pcId
     */
    @Column(name = "PC_ID", nullable = true, length = 32)
    public String getPcId() {
        return this.pcId;
    }

    /**
     * 设置pcId
     * 
     * @param pcId
     */
    public void setPcId(String pcId) {
        this.pcId = pcId;
    }
    /**
     * 获取mchId
     * 
     * @return mchId
     */
    @Column(name = "MCH_ID", nullable = true, length = 32)

    public String getMchId() {
        return this.mchId;
    }

    /**
     * 设置mchId
     * 
     * @param mchId
     */
    public void setMchId(String mchId) {
        this.mchId = mchId;
    }

    /**
     * 获取chkDate
     * 
     * @return chkDate
     */
    @Column(name = "CHK_DATE", nullable = true, length = 10)
    public String getChkDate() {
        return this.chkDate;
    }

    /**
     * 设置chkDate
     * 
     * @param chkDate
     */
    public void setChkDate(String chkDate) {
        this.chkDate = chkDate;
    }

    /**
     * 获取
     * @return
     */
    @Column(name = "CHK_TYPE", nullable = true, length = 1)
    public String getChkType() {
        return this.chkType;
    }

    /**
     * 设置
     * @param chkType
     */
    public void setChkType(String chkType) {
        this.chkType = chkType;
    }

    /**
     * 获取chkFile
     * 
     * @return chkFile
     */
    @Column(name = "CHK_FILE", nullable = true, length = 200)
    public String getChkFile() {
        return this.chkFile;
    }

    /**
     * 设置chkFile
     * 
     * @param chkFile
     */
    public void setChkFile(String chkFile) {
        this.chkFile = chkFile;
    }

    /**
     * 获取
     * 
     * @return 
     */
    @Column(name = "OPT_TYPE", nullable = true, length = 1)
    public String getOptType() {
        return this.optType;
    }

    /**
     * 设置
     * @param optType
     */
    public void setOptType(String optType) {
        this.optType = optType;
    }

    /**
     * 获取opterator
     * 
     * @return opterator
     */
    @Column(name = "OPTERATOR", nullable = true, length = 50)
    public String getOpterator() {
        return this.opterator;
    }

    /**
     * 设置opterator
     * 
     * @param opterator
     */
    public void setOpterator(String opterator) {
        this.opterator = opterator;
    }

    /**
     * 获取总记录数
     * 
     * @return 总记录数
     */
    @Column(name = "TOTAL", nullable = true, length = 10)
    public Integer getTotal() {
        return this.total;
    }

    /**
     * 设置总记录数
     * 
     * @param total
     *          总记录数
     */
    public void setTotal(Integer total) {
        this.total = total;
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
     * 获取successTotal
     * 
     * @return successTotal
     */
    @Column(name = "SUCCESS_TOTAL", nullable = true, length = 10)
    public Integer getSuccessTotal() {
        return this.successTotal;
    }

    /**
     * 设置successTotal
     * 
     * @param successTotal
     */
    public void setSuccessTotal(Integer successTotal) {
        this.successTotal = successTotal;
    }

    /**
     * 获取successAmt
     * 
     * @return successAmt
     */
    @Column(name = "SUCCESS_AMT", nullable = true)
    public BigDecimal getSuccessAmt() {
        return this.successAmt;
    }

    /**
     * 设置successAmt
     * 
     * @param successAmt
     */
    public void setSuccessAmt(BigDecimal successAmt) {
        this.successAmt = successAmt;
    }

    /**
     * 获取syncNum
     * 
     * @return syncNum
     */
    @Column(name = "SYNC_NUM", nullable = true, length = 10)
    public Integer getSyncNum() {
        return this.syncNum;
    }

    /**
     * 设置syncNum
     * 
     * @param syncNum
     */
    public void setSyncNum(Integer syncNum) {
        this.syncNum = syncNum;
    }

    /**
     * 获取
     * @return
     */
    @Column(name = "SYNC_TYPE", nullable = true, length = 10)
    public String getSyncType() {
        return this.syncType;
    }

    /**
     * 设置
     * @param syncType
     */
    public void setSyncType(String syncType) {
        this.syncType = syncType;
    }

    /**
     * 获取syncTime
     * 
     * @return syncTime
     */
    @Column(name = "SYNC_TIME", nullable = true)
    public Date getSyncTime() {
        return this.syncTime;
    }

    /**
     * 设置syncTime
     * 
     * @param syncTime
     */
    public void setSyncTime(Date syncTime) {
        this.syncTime = syncTime;
    }

    /**
     * 获取impTime
     * 
     * @return impTime
     */
    @Column(name = "IMP_TIME", nullable = true)
    public Date getImpTime() {
        return this.impTime;
    }

    /**
     * 设置impTime
     * 
     * @param impTime
     */
    public void setImpTime(Date impTime) {
        this.impTime = impTime;
    }

    /**
     * 获取chkTime
     * 
     * @return chkTime
     */
    @Column(name = "CHK_TIME", nullable = true)
    public Date getChkTime() {
        return this.chkTime;
    }

    /**
     * 设置chkTime
     * 
     * @param chkTime
     */
    public void setChkTime(Date chkTime) {
        this.chkTime = chkTime;
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
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    @Transient
	public PayMerchant getPayMerchant() {
		return payMerchant;
	}

	public void setPayMerchant(PayMerchant payMerchant) {
		this.payMerchant = payMerchant;
	}
	
	@Transient
	public String getFilePath() {
		if(null == this.getPayMerchant()){
			return "";
		}
		Configuration config= PayMerchantConfigCache.getConfig(getPayMerchant());
		
		return config.getString("check_dir");
	}
    
}