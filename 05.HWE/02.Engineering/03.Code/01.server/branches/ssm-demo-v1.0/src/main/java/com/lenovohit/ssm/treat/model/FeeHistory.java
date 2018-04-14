package com.lenovohit.ssm.treat.model;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 门诊收费清单
 * @author zouai
 *
 */
public class FeeHistory extends BaseIdModel   {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4023509895401104938L;
	private String brbh;/*病人编号*/
	private String brxm;/*病人姓名*/
	private String mc;/*项目名称*/
	private String sl;/*数量*/
	private String je;/*总金额*/
	private String yhxm;/*医师*/
	private String zkmc;/*科室*/
	private String sjh;/*收据号*/
	private String sfryxm;/*收费员*/
	private String sfsj;/*收费时间*/
	private String startTime;		//开始时间Yyyy-mm-dd
	private String endTime;			//结束时间Yyyy-mm-dd
	/**
	 * @return the brxm
	 */
	public String getBrxm() {
		return brxm;
	}
	/**
	 * @param brxm the brxm to set
	 */
	public void setBrxm(String brxm) {
		this.brxm = brxm;
	}
	/**
	 * @return the brbh
	 */
	public String getBrbh() {
		return brbh;
	}
	/**
	 * @param brbh the brbh to set
	 */
	public void setBrbh(String brbh) {
		this.brbh = brbh;
	}
	/**
	 * @return the mc
	 */
	public String getMc() {
		return mc;
	}
	/**
	 * @param mc the mc to set
	 */
	public void setMc(String mc) {
		this.mc = mc;
	}
	/**
	 * @return the sl
	 */
	public String getSl() {
		return sl;
	}
	/**
	 * @param sl the sl to set
	 */
	public void setSl(String sl) {
		this.sl = sl;
	}
	/**
	 * @return the je
	 */
	public String getJe() {
		return je;
	}
	/**
	 * @param je the je to set
	 */
	public void setJe(String je) {
		this.je = je;
	}
	/**
	 * @return the yhxm
	 */
	public String getYhxm() {
		return yhxm;
	}
	/**
	 * @param yhxm the yhxm to set
	 */
	public void setYhxm(String yhxm) {
		this.yhxm = yhxm;
	}
	/**
	 * @return the zkmc
	 */
	public String getZkmc() {
		return zkmc;
	}
	/**
	 * @param zkmc the zkmc to set
	 */
	public void setZkmc(String zkmc) {
		this.zkmc = zkmc;
	}
	/**
	 * @return the sjh
	 */
	public String getSjh() {
		return sjh;
	}
	/**
	 * @param sjh the sjh to set
	 */
	public void setSjh(String sjh) {
		this.sjh = sjh;
	}
	/**
	 * @return the sfryxm
	 */
	public String getSfryxm() {
		return sfryxm;
	}
	/**
	 * @param sfryxm the sfryxm to set
	 */
	public void setSfryxm(String sfryxm) {
		this.sfryxm = sfryxm;
	}
	/**
	 * @return the sfsj
	 */
	public String getSfsj() {
		return sfsj;
	}
	/**
	 * @param sfsj the sfsj to set
	 */
	public void setSfsj(String sfsj) {
		this.sfsj = sfsj;
	}
	/**
	 * @return the startTime
	 */
	public String getStartTime() {
		return startTime;
	}
	/**
	 * @param startTime the startTime to set
	 */
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	/**
	 * @return the endTime
	 */
	public String getEndTime() {
		return endTime;
	}
	/**
	 * @param endTime the endTime to set
	 */
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
}