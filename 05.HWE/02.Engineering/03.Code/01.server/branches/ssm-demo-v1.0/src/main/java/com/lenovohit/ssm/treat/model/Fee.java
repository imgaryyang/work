package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 缴费明细
 * @author xiaweiyi
 *
 */
@Entity
@Table(name="SSM_FEE")
public class Fee extends BaseIdModel{
	private static final long serialVersionUID = 1098286956401539056L;
	private String orderId;
	private String zh;/*组号*/
	private String mc;/*名称*/
	private BigDecimal dj = new BigDecimal(0);
	private BigDecimal sl = new BigDecimal(0);/*数量*/
	private BigDecimal cs = new BigDecimal(0);/* 次数*/
	private String kzjb;/*控制级别*/
	private String yzsj;/*医嘱 时间*/
	private String ysid;/*医生编号*/
	private String kzjbmc;/*控制级别名称*/
	private String ysxm;/*医生姓名*/
	private String ksmc;/*科室名称*/
	private String ksid;/*科室id*/
	private String flmmc;/*分类码名称*/
	private BigDecimal amt;/*金额*/
	
	
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getZh() {
		return zh;
	}
	public void setZh(String zh) {
		this.zh = zh;
	}
	public String getMc() {
		return mc;
	}
	public void setMc(String mc) {
		this.mc = mc;
	}
	public BigDecimal getDj() {
		return dj;
	}
	public void setDj(BigDecimal dj) {
		this.dj = dj;
	}
	public BigDecimal getSl() {
		return sl;
	}
	public void setSl(BigDecimal sl) {
		this.sl = sl;
	}
	public BigDecimal getCs() {
		return cs;
	}
	public void setCs(BigDecimal cs) {
		this.cs = cs;
	}
	public String getKzjb() {
		return kzjb;
	}
	public void setKzjb(String kzjb) {
		this.kzjb = kzjb;
	}
	public String getYzsj() {
		return yzsj;
	}
	public void setYzsj(String yzsj) {
		this.yzsj = yzsj;
	}
	public String getYsid() {
		return ysid;
	}
	public void setYsid(String ysid) {
		this.ysid = ysid;
	}
	public String getKzjbmc() {
		return kzjbmc;
	}
	public void setKzjbmc(String kzjbmc) {
		this.kzjbmc = kzjbmc;
	}
	public String getYsxm() {
		return ysxm;
	}
	public void setYsxm(String ysxm) {
		this.ysxm = ysxm;
	}
	public String getKsmc() {
		return ksmc;
	}
	public void setKsmc(String ksmc) {
		this.ksmc = ksmc;
	}
	public String getKsid() {
		return ksid;
	}
	public void setKsid(String ksid) {
		this.ksid = ksid;
	}
	public String getFlmmc() {
		return flmmc;
	}
	public void setFlmmc(String flmmc) {
		this.flmmc = flmmc;
	}


}
