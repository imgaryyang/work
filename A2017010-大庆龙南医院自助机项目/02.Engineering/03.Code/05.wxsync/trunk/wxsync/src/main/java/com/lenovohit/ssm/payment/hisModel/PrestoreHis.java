package com.lenovohit.ssm.payment.hisModel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

/**
 * HIS - 预存金额 cw_ycje
 * 
 * @author fanyang
 *
 */
@Entity
@Table(name = "CW_YCJE")
public class PrestoreHis implements Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = -599136060679517606L;
	
	private String id;			// BRBH 病人编号
	private String ycdm;		// YCDM 预存代码
	private BigDecimal ckje;	// CKJE 存款金额
	private BigDecimal kyje;	// KYJE 可用金额
	private BigDecimal xfje;	// XFJE 消费金额
	private String ztbz;		// ZTBZ 状态标志
	private String qksfzh;		// QKSFZH 
	private Date yxsj;			// YXSJ 有效时间
	private Integer yxj;		// YXJ 
	private Integer czzid;		// CZZID 操作者ID
	private Date xgsj;			// XGSJ 修改时间
	private Date kssj;			// KSSJ 
	private BigDecimal mzdjje;	// MZDJJE 
	
	
	@Id
	@Column(name = "BRBH")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	@Column(name = "YCDM")
	public String getYcdm() {
		return ycdm;
	}

	public void setYcdm(String ycdm) {
		this.ycdm = ycdm;
	}
	
	@Column(name = "CKJE")
	public BigDecimal getCkje() {
		return ckje;
	}

	public void setCkje(BigDecimal ckje) {
		this.ckje = ckje;
	}
	
	@Column(name = "KYJE")
	public BigDecimal getKyje() {
		return kyje;
	}

	public void setKyje(BigDecimal kyje) {
		this.kyje = kyje;
	}
	
	@Column(name = "XFJE")
	public BigDecimal getXfje() {
		return xfje;
	}

	public void setXfje(BigDecimal xfje) {
		this.xfje = xfje;
	}
	
	@Column(name = "ZTBZ")
	public String getZtbz() {
		return ztbz;
	}

	public void setZtbz(String ztbz) {
		this.ztbz = ztbz;
	}
	
	@Column(name = "QKSFZH")
	public String getQksfzh() {
		return qksfzh;
	}

	public void setQksfzh(String qksfzh) {
		this.qksfzh = qksfzh;
	}
	
	@Column(name = "YXSJ")
	public Date getYxsj() {
		return yxsj;
	}

	public void setYxsj(Date yxsj) {
		this.yxsj = yxsj;
	}
	
	@Column(name = "YXJ")
	public Integer getYxj() {
		return yxj;
	}

	public void setYxj(Integer yxj) {
		this.yxj = yxj;
	}
	
	@Column(name = "CZZID")
	public Integer getCzzid() {
		return czzid;
	}

	public void setCzzid(Integer czzid) {
		this.czzid = czzid;
	}
	
	@Column(name = "XGSJ")
	public Date getXgsj() {
		return xgsj;
	}

	public void setXgsj(Date xgsj) {
		this.xgsj = xgsj;
	}
	
	@Column(name = "KSSJ")
	public Date getKssj() {
		return kssj;
	}

	public void setKssj(Date kssj) {
		this.kssj = kssj;
	}
	
	@Column(name = "MZDJJE")
	public BigDecimal getMzdjje() {
		return mzdjje;
	}

	public void setMzdjje(BigDecimal mzdjje) {
		this.mzdjje = mzdjje;
	}

	@Override
	public boolean _newObejct() {
		return "" == this.getId();
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
