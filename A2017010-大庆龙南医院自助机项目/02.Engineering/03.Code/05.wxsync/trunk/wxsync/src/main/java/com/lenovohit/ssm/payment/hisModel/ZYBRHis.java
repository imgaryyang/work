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
 * HIS - 住院病人 cw_zybr
 * 
 * @author fanyang
 *
 */
@Entity
@Table(name = "CW_ZYBR")
public class ZYBRHis implements Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8468250182524262090L;
	
	private Integer id;//ZYID 住院ID
	private Integer blid;//BLID
	private String  zyh;//ZYH 住院号
	private String  brbh;//BRBH 病人姓名
	private String  jslx;//JSLX 接收类型
	private String  jsdm;//JSDM 接收代码
	private Integer bqid;//BQID 病区ID
	private Integer zkid;//ZKID 专科ID
	private String  cwh;//CWH 财务号
	private String  brxm;//BRXM 病人姓名
	private String  brxb;//BRXB 病人性别
	private Date    csrq;//CSRQ 出生日期
	private String  hyzk;//HYZK 
	private String  zydm;//ZYDM 住院代码
	private String  gjdm;//GJDM
	private String  jgdm;//JGDM
	private String  mzdm;//MZDM 门诊代码
	private String  sfzh;//SFZH 身份证号
	private String  lxdz;//LXDZ 联系地址
	private String  lxdh;//LXDH 联系电话
	private String  jsxm;//JSXM
	private String  jsgx;//JSGX
	private String  jsdh;//JSDH
	private String  dwdm;//DWDM 单位代码
	private String  dwmc;//DWMC 单位名称
	private String  jsx;//JSX
	private String  ryqk;//RYQK 入院情况
	private String  hljb;//HLJB 护理级别
	private BigDecimal jzxe;//JZXE
	private BigDecimal jzxezj;//JZXEZJ
	private BigDecimal zfyjk;//ZFYJK
	private BigDecimal zftzzf;//ZFTZZE
	private BigDecimal zzfje;//ZZFJE
	private BigDecimal zjzje;//ZJZJE
	private BigDecimal zzlje;//ZZLJE
	private BigDecimal zjmje;//ZJMJE
	private Date    cysj;//CYSJ
	private Date    jssj;//JSSJ
	private Date    scrysj;//SCRYSJ
	private Date    cwrysj;//CWRYSJ
	private Date    bqrysj;//BQRYSJ
	private String  zddm;//ZDDM 诊断代码
	private String  ryzd;//RYZD 入院诊断
	private String  ryyq;//RYYQ 入院院区
	private String  ztbz;//ZTBZ 状态标志 0:普通 1:挂账 2:呆账   5:特殊回归 7.普通回归 9:病区出院 
	private Integer czzid;//CZZID
	private String  ztjs;//ZTJS
	private String  yzy;//YZY
	private Integer zlzid;//ZLZID
	private Integer zgysid;//ZGYSID
	private Integer zghsid;//ZGHSID
	private Integer tz;//TZ
	private String  bzdm;//BZDM
	private Date    cshsj;//CSHSJ	
	private BigDecimal zfye;//ZFYE
	private Date    bqcysj;//BQCYSJ
	private String  dylb;//DYLB
	private String  passport;//PASSPORT
	private Integer zyidMonther;//ZYID_MOTHER
	private Integer jbid;//JBID
	private Integer lxdzSheng;//LXDZ_SHEN 省编码
	private Integer lxdzShi;//LXDZ_SHI 市编码
	private Integer lxdzXian;//LXDZ_XIAN 县编码
	private String  lxdzQt;//LXDZ_QT 联系地址-其他
	private String  gzdw;//GZDW 工作单位
	
	@Id
	@Column(name = "ZYID")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "BLID")
	public Integer getBlid() {
		return blid;
	}

	public void setBlid(Integer blid) {
		this.blid = blid;
	}

	@Column(name = "ZYH")
	public String getZyh() {
		return zyh;
	}

	public void setZyh(String zyh) {
		this.zyh = zyh;
	}

	@Column(name = "BRBH")
	public String getBrbh() {
		return brbh;
	}

	public void setBrbh(String brbh) {
		this.brbh = brbh;
	}

	@Column(name = "JSLX")
	public String getJslx() {
		return jslx;
	}

	public void setJslx(String jslx) {
		this.jslx = jslx;
	}

	@Column(name = "JSDM")
	public String getJsdm() {
		return jsdm;
	}

	public void setJsdm(String jsdm) {
		this.jsdm = jsdm;
	}

	@Column(name = "BQID")
	public Integer getBqid() {
		return bqid;
	}

	public void setBqid(Integer bqid) {
		this.bqid = bqid;
	}

	@Column(name = "ZKID")
	public Integer getZkid() {
		return zkid;
	}

	public void setZkid(Integer zkid) {
		this.zkid = zkid;
	}

	@Column(name = "CWH")
	public String getCwh() {
		return cwh;
	}

	public void setCwh(String cwh) {
		this.cwh = cwh;
	}

	@Column(name = "BRXM")
	public String getBrxm() {
		return brxm;
	}

	public void setBrxm(String brxm) {
		this.brxm = brxm;
	}

	@Column(name = "BRXB")
	public String getBrxb() {
		return brxb;
	}

	public void setBrxb(String brxb) {
		this.brxb = brxb;
	}

	@Column(name = "CSRQ")
	public Date getCsrq() {
		return csrq;
	}

	public void setCsrq(Date csrq) {
		this.csrq = csrq;
	}

	@Column(name = "HYZK")
	public String getHyzk() {
		return hyzk;
	}

	public void setHyzk(String hyzk) {
		this.hyzk = hyzk;
	}

	@Column(name = "ZYDM")
	public String getZydm() {
		return zydm;
	}

	public void setZydm(String zydm) {
		this.zydm = zydm;
	}

	@Column(name = "GJDM")
	public String getGjdm() {
		return gjdm;
	}

	public void setGjdm(String gjdm) {
		this.gjdm = gjdm;
	}

	@Column(name = "JGDM")
	public String getJgdm() {
		return jgdm;
	}

	public void setJgdm(String jgdm) {
		this.jgdm = jgdm;
	}

	@Column(name = "MZDM")
	public String getMzdm() {
		return mzdm;
	}

	public void setMzdm(String mzdm) {
		this.mzdm = mzdm;
	}

	@Column(name = "SFZH")
	public String getSfzh() {
		return sfzh;
	}

	public void setSfzh(String sfzh) {
		this.sfzh = sfzh;
	}

	@Column(name = "LXDZ")
	public String getLxdz() {
		return lxdz;
	}

	public void setLxdz(String lxdz) {
		this.lxdz = lxdz;
	}

	@Column(name = "LXDH")
	public String getLxdh() {
		return lxdh;
	}

	public void setLxdh(String lxdh) {
		this.lxdh = lxdh;
	}

	@Column(name = "JSXM")
	public String getJsxm() {
		return jsxm;
	}

	public void setJsxm(String jsxm) {
		this.jsxm = jsxm;
	}

	@Column(name = "JSGX")
	public String getJsgx() {
		return jsgx;
	}

	public void setJsgx(String jsgx) {
		this.jsgx = jsgx;
	}

	@Column(name = "JSDH")
	public String getJsdh() {
		return jsdh;
	}

	public void setJsdh(String jsdh) {
		this.jsdh = jsdh;
	}

	@Column(name = "DWDM")
	public String getDwdm() {
		return dwdm;
	}

	public void setDwdm(String dwdm) {
		this.dwdm = dwdm;
	}

	@Column(name = "DWMC")
	public String getDwmc() {
		return dwmc;
	}

	public void setDwmc(String dwmc) {
		this.dwmc = dwmc;
	}

	@Column(name = "JSX")
	public String getJsx() {
		return jsx;
	}

	public void setJsx(String jsx) {
		this.jsx = jsx;
	}

	@Column(name = "RYQK")
	public String getRyqk() {
		return ryqk;
	}

	public void setRyqk(String ryqk) {
		this.ryqk = ryqk;
	}

	@Column(name = "HLJB")
	public String getHljb() {
		return hljb;
	}

	public void setHljb(String hljb) {
		this.hljb = hljb;
	}

	@Column(name = "JZXE")
	public BigDecimal getJzxe() {
		return jzxe;
	}

	public void setJzxe(BigDecimal jzxe) {
		this.jzxe = jzxe;
	}

	@Column(name = "JZXEZJ")
	public BigDecimal getJzxezj() {
		return jzxezj;
	}

	public void setJzxezj(BigDecimal jzxezj) {
		this.jzxezj = jzxezj;
	}

	@Column(name = "ZFYJK")
	public BigDecimal getZfyjk() {
		return zfyjk;
	}

	public void setZfyjk(BigDecimal zfyjk) {
		this.zfyjk = zfyjk;
	}

	@Column(name = "ZFTZZE")
	public BigDecimal getZftzzf() {
		return zftzzf;
	}

	public void setZftzzf(BigDecimal zftzzf) {
		this.zftzzf = zftzzf;
	}

	@Column(name = "ZZFJE")
	public BigDecimal getZzfje() {
		return zzfje;
	}

	public void setZzfje(BigDecimal zzfje) {
		this.zzfje = zzfje;
	}

	@Column(name = "ZJZJE")
	public BigDecimal getZjzje() {
		return zjzje;
	}

	public void setZjzje(BigDecimal zjzje) {
		this.zjzje = zjzje;
	}

	@Column(name = "ZZLJE")
	public BigDecimal getZzlje() {
		return zzlje;
	}

	public void setZzlje(BigDecimal zzlje) {
		this.zzlje = zzlje;
	}

	@Column(name = "ZJMJE")
	public BigDecimal getZjmje() {
		return zjmje;
	}

	public void setZjmje(BigDecimal zjmje) {
		this.zjmje = zjmje;
	}

	@Column(name = "CYSJ")
	public Date getCysj() {
		return cysj;
	}

	public void setCysj(Date cysj) {
		this.cysj = cysj;
	}

	@Column(name = "JSSJ")
	public Date getJssj() {
		return jssj;
	}

	public void setJssj(Date jssj) {
		this.jssj = jssj;
	}

	@Column(name = "SCRYSJ")
	public Date getScrysj() {
		return scrysj;
	}

	public void setScrysj(Date scrysj) {
		this.scrysj = scrysj;
	}

	@Column(name = "CWRYSJ")
	public Date getCwrysj() {
		return cwrysj;
	}

	public void setCwrysj(Date cwrysj) {
		this.cwrysj = cwrysj;
	}

	@Column(name = "BQRYSJ")
	public Date getBqrysj() {
		return bqrysj;
	}

	public void setBqrysj(Date bqrysj) {
		this.bqrysj = bqrysj;
	}

	@Column(name = "ZDDM")
	public String getZddm() {
		return zddm;
	}

	public void setZddm(String zddm) {
		this.zddm = zddm;
	}

	@Column(name = "RYZD")
	public String getRyzd() {
		return ryzd;
	}

	public void setRyzd(String ryzd) {
		this.ryzd = ryzd;
	}

	@Column(name = "RYYQ")
	public String getRyyq() {
		return ryyq;
	}

	public void setRyyq(String ryyq) {
		this.ryyq = ryyq;
	}

	@Column(name = "ZTBZ")
	public String getZtbz() {
		return ztbz;
	}

	public void setZtbz(String ztbz) {
		this.ztbz = ztbz;
	}

	@Column(name = "CZZID")
	public Integer getCzzid() {
		return czzid;
	}

	public void setCzzid(Integer czzid) {
		this.czzid = czzid;
	}

	@Column(name = "ZTJS")
	public String getZtjs() {
		return ztjs;
	}

	public void setZtjs(String ztjs) {
		this.ztjs = ztjs;
	}

	@Column(name = "YZY")
	public String getYzy() {
		return yzy;
	}

	public void setYzy(String yzy) {
		this.yzy = yzy;
	}

	@Column(name = "ZLZID")
	public Integer getZlzid() {
		return zlzid;
	}

	public void setZlzid(Integer zlzid) {
		this.zlzid = zlzid;
	}

	@Column(name = "ZGYSID")
	public Integer getZgysid() {
		return zgysid;
	}

	public void setZgysid(Integer zgysid) {
		this.zgysid = zgysid;
	}

	@Column(name = "ZGHSID")
	public Integer getZghsid() {
		return zghsid;
	}

	public void setZghsid(Integer zghsid) {
		this.zghsid = zghsid;
	}

	@Column(name = "TZ")
	public Integer getTz() {
		return tz;
	}

	public void setTz(Integer tz) {
		this.tz = tz;
	}

	@Column(name = "BZDM")
	public String getBzdm() {
		return bzdm;
	}

	public void setBzdm(String bzdm) {
		this.bzdm = bzdm;
	}

	@Column(name = "CSHSJ")
	public Date getCshsj() {
		return cshsj;
	}

	public void setCshsj(Date cshsj) {
		this.cshsj = cshsj;
	}

	@Column(name = "ZFYE")
	public BigDecimal getZfye() {
		return zfye;
	}

	public void setZfye(BigDecimal zfye) {
		this.zfye = zfye;
	}

	@Column(name = "BQCYSJ")
	public Date getBqcysj() {
		return bqcysj;
	}

	public void setBqcysj(Date bqcysj) {
		this.bqcysj = bqcysj;
	}

	@Column(name = "DYLB")
	public String getDylb() {
		return dylb;
	}

	public void setDylb(String dylb) {
		this.dylb = dylb;
	}

	@Column(name = "PASSPORT")
	public String getPassport() {
		return passport;
	}

	public void setPassport(String passport) {
		this.passport = passport;
	}

	@Column(name = "ZYID_MOTHER")
	public Integer getZyidMonther() {
		return zyidMonther;
	}

	public void setZyidMonther(Integer zyidMonther) {
		this.zyidMonther = zyidMonther;
	}

	@Column(name = "JBID")
	public Integer getJbid() {
		return jbid;
	}

	public void setJbid(Integer jbid) {
		this.jbid = jbid;
	}

	@Column(name = "LXDZ_SHEN")
	public Integer getLxdzSheng() {
		return lxdzSheng;
	}

	public void setLxdzSheng(Integer lxdzSheng) {
		this.lxdzSheng = lxdzSheng;
	}

	@Column(name = "LXDZ_SHI")
	public Integer getLxdzShi() {
		return lxdzShi;
	}

	public void setLxdzShi(Integer lxdzShi) {
		this.lxdzShi = lxdzShi;
	}

	@Column(name = "LXDZ_XIAN")
	public Integer getLxdzXian() {
		return lxdzXian;
	}

	public void setLxdzXian(Integer lxdzXian) {
		this.lxdzXian = lxdzXian;
	}

	@Column(name = "LXDZ_QT")
	public String getLxdzQt() {
		return lxdzQt;
	}

	public void setLxdzQt(String lxdzQt) {
		this.lxdzQt = lxdzQt;
	}

	@Column(name = "GZDW")
	public String getGzdw() {
		return gzdw;
	}

	public void setGzdw(String gzdw) {
		this.gzdw = gzdw;
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
