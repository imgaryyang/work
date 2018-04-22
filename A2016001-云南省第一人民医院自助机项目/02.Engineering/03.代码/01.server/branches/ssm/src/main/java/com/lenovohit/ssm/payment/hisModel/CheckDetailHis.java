package com.lenovohit.ssm.payment.hisModel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

/**
 * HIS交易明细
 * @author zyus
 *
 */
@Entity
@Table(name="ZZXT_YHJYMX")
public class CheckDetailHis implements Model{
	private static final long serialVersionUID = -6142260232622377265L;
	
	private Integer jlid  ;             //医院流水号
	private Integer ycid  ;             //预存id/住院预缴ID
	private String brbh   ;             //病人编号
	private String jylx   ;             //交易类型 充值HB01 退款HB02
	private String yhdm   ;             //自助机所属银行代码
	private String zdh    ;             //pos终端号
	private String yhkh   ;             //银行卡号/外部帐号
	private String kyxq   ;             //卡有效期
	private String klx    ;             //卡类型 0 信用卡 1非信用卡
	private String fkhdm  ;             //发卡行代码
	private String jypc   ;             //交易批次
	private String lsh    ;             //pos流水号
	private String jsckh  ;             //检索参考号/第三方交易流水号
	private String jzrq   ;             //银行记账日期
	private String yhrq   ;             //银行日期
	private String yhsj   ;             //银行时间
	private String sqh    ;             //授权号
	private BigDecimal je ;             //金额
	private BigDecimal ytje;            //已退金额
	private String bz     ;             //备注
	private String zzjbh  ;             //自助机编号
	private String yqdm   ;             //院区代码
	private Integer sfid  ;             //自助机用户id
	private Date jysj     ;             //交易时间
	private String ztbz   ;             //状态标志 1 成功交易  9 冻结/解冻交易以及未确认交易
	private Integer yjlid ;             //原缴费医院流水号
	private Integer fjlid ;             //反交易医院流水号
	private String lb     ;             //类别  1:门诊 2：住院
	private String bl     ;             //补录标志
	private String shh    ;             //商户号
	private String pzh    ;             //凭证号
	private String ly     ;             //来源
	private String outSeq ;             //自助机本地流水

	@Id
	public int getJlid() {
		return jlid;
	}
	public void setJlid(Integer jlid) {
		this.jlid = jlid;
	}
	public Integer getYcid() {
		return ycid;
	}
	public void setYcid(Integer ycid) {
		this.ycid = ycid;
	}
	public String getBrbh() {
		return brbh;
	}
	public void setBrbh(String brbh) {
		this.brbh = brbh;
	}
	public String getJylx() {
		return jylx;
	}
	public void setJylx(String jylx) {
		this.jylx = jylx;
	}
	public String getYhdm() {
		return yhdm;
	}
	public void setYhdm(String yhdm) {
		this.yhdm = yhdm;
	}
	public String getZdh() {
		return zdh;
	}
	public void setZdh(String zdh) {
		this.zdh = zdh;
	}
	public String getYhkh() {
		return yhkh;
	}
	public void setYhkh(String yhkh) {
		this.yhkh = yhkh;
	}
	public String getKyxq() {
		return kyxq;
	}
	public void setKyxq(String kyxq) {
		this.kyxq = kyxq;
	}
	public String getKlx() {
		return klx;
	}
	public void setKlx(String klx) {
		this.klx = klx;
	}
	public String getFkhdm() {
		return fkhdm;
	}
	public void setFkhdm(String fkhdm) {
		this.fkhdm = fkhdm;
	}
	public String getJypc() {
		return jypc;
	}
	public void setJypc(String jypc) {
		this.jypc = jypc;
	}
	public String getLsh() {
		return lsh;
	}
	public void setLsh(String lsh) {
		this.lsh = lsh;
	}
	public String getJsckh() {
		return jsckh;
	}
	public void setJsckh(String jsckh) {
		this.jsckh = jsckh;
	}
	public String getJzrq() {
		return jzrq;
	}
	public void setJzrq(String jzrq) {
		this.jzrq = jzrq;
	}
	public String getYhrq() {
		return yhrq;
	}
	public void setYhrq(String yhrq) {
		this.yhrq = yhrq;
	}
	public String getYhsj() {
		return yhsj;
	}
	public void setYhsj(String yhsj) {
		this.yhsj = yhsj;
	}
	public String getSqh() {
		return sqh;
	}
	public void setSqh(String sqh) {
		this.sqh = sqh;
	}
	public BigDecimal getJe() {
		return je;
	}
	public void setJe(BigDecimal je) {
		this.je = je;
	}
	public BigDecimal getYtje() {
		return ytje;
	}
	public void setYtje(BigDecimal ytje) {
		this.ytje = ytje;
	}
	public String getBz() {
		return bz;
	}
	public void setBz(String bz) {
		this.bz = bz;
	}
	public String getZzjbh() {
		return zzjbh;
	}
	public void setZzjbh(String zzjbh) {
		this.zzjbh = zzjbh;
	}
	public String getYqdm() {
		return yqdm;
	}
	public void setYqdm(String yqdm) {
		this.yqdm = yqdm;
	}
	public Integer getSfid() {
		return sfid;
	}
	public void setSfid(Integer sfid) {
		this.sfid = sfid;
	}
	public Date getJysj() {
		return jysj;
	}
	public void setJysj(Date jysj) {
		this.jysj = jysj;
	}
	public String getZtbz() {
		return ztbz;
	}
	public void setZtbz(String ztbz) {
		this.ztbz = ztbz;
	}
	public Integer getYjlid() {
		return yjlid;
	}
	public void setYjlid(Integer yjlid) {
		this.yjlid = yjlid;
	}
	public Integer getFjlid() {
		return fjlid;
	}
	public void setFjlid(Integer fjlid) {
		this.fjlid = fjlid;
	}
	public String getLb() {
		return lb;
	}
	public void setLb(String lb) {
		this.lb = lb;
	}
	public String getBl() {
		return bl;
	}
	public void setBl(String bl) {
		this.bl = bl;
	}
	public String getShh() {
		return shh;
	}
	public void setShh(String shh) {
		this.shh = shh;
	}
	public String getPzh() {
		return pzh;
	}
	public void setPzh(String pzh) {
		this.pzh = pzh;
	}
	public String getLy() {
		return ly;
	}
	public void setLy(String ly) {
		this.ly = ly;
	}
	public String getOutSeq() {
		return outSeq;
	}
	public void setOutSeq(String outSeq) {
		this.outSeq = outSeq;
	}


	@Override
	public boolean _newObejct() {
		return 0 == this.getJlid();
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
		return new HashCodeBuilder().append(this.getJlid()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
}
