package com.lenovohit.ssm.payment.hisModel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

/**
 * HIS - 住院预缴款 cw_zyyjk
 * 
 * @author fanyang
 *
 */
@Entity
@Table(name = "CW_ZYYJK")
public class ZYYJKHis implements Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5884173267505198107L;
	
	private Integer id;//JYID 交易ID
	private Integer zyid;//ZYID 住院ID
	private String  zyh;//ZYH 住院号
	private String  sjh;//SJH 收据号
	private BigDecimal yjje;//YJJE 预缴金额
	private String  fkfs;//FKFS 
	private Integer khyh;//KHYH 
	private Integer yhzh;//YHZH 
	private String  dwmc;//DWMC 
	private Date    yjsj;//YJSJ 预缴时间
	private String  yqdm;//YQDM 
	private String  ztbz;//ZTBZ 状态标志
	private Integer czzid;//CZZID
	private String  bzdm;//BZDM
	private String  ly;//LY 来源
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getZyid() {
		return zyid;
	}

	public void setZyid(Integer zyid) {
		this.zyid = zyid;
	}

	public String getZyh() {
		return zyh;
	}

	public void setZyh(String zyh) {
		this.zyh = zyh;
	}

	public String getSjh() {
		return sjh;
	}

	public void setSjh(String sjh) {
		this.sjh = sjh;
	}

	public BigDecimal getYjje() {
		return yjje;
	}

	public void setYjje(BigDecimal yjje) {
		this.yjje = yjje;
	}

	public String getFkfs() {
		return fkfs;
	}

	public void setFkfs(String fkfs) {
		this.fkfs = fkfs;
	}

	public Integer getKhyh() {
		return khyh;
	}

	public void setKhyh(Integer khyh) {
		this.khyh = khyh;
	}

	public Integer getYhzh() {
		return yhzh;
	}

	public void setYhzh(Integer yhzh) {
		this.yhzh = yhzh;
	}

	public String getDwmc() {
		return dwmc;
	}

	public void setDwmc(String dwmc) {
		this.dwmc = dwmc;
	}

	public Date getYjsj() {
		return yjsj;
	}

	public void setYjsj(Date yjsj) {
		this.yjsj = yjsj;
	}

	public String getYqdm() {
		return yqdm;
	}

	public void setYqdm(String yqdm) {
		this.yqdm = yqdm;
	}

	public String getZtbz() {
		return ztbz;
	}

	public void setZtbz(String ztbz) {
		this.ztbz = ztbz;
	}

	public Integer getCzzid() {
		return czzid;
	}

	public void setCzzid(Integer czzid) {
		this.czzid = czzid;
	}

	public String getBzdm() {
		return bzdm;
	}

	public void setBzdm(String bzdm) {
		this.bzdm = bzdm;
	}

	public String getLy() {
		return ly;
	}

	public void setLy(String ly) {
		this.ly = ly;
	}

	@Override
	public boolean _newObejct() {
		return 0 == this.getId();
	}
	
	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}

}
