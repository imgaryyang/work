package com.lenovohit.ssm.treat.model;

/**
 * 就医指南
 * 
 * @author xiaweiyi
 *
 */
public class Guide {
	private String yzlb; // 医嘱类别Varchar2(28)
	private String mc;// 项目名称Varchar2(28)
	private String uniqueflag;// 处方号 Varchar2(28)
	private String addr;// 地址 Varchar2(28)
	private String sf;// 收费方式 Varchar2(28)
	private String yy;// 是否需预约 Varchar2(28) 0无需预约 1需要预约
	private String note;// 说明 Varchar2(28) 备注说明
	private String jyid;// 交易ID Varchar2(28)
	public String getYzlb() {
		return yzlb;
	}
	public void setYzlb(String yzlb) {
		this.yzlb = yzlb;
	}
	public String getMc() {
		return mc;
	}
	public void setMc(String mc) {
		this.mc = mc;
	}
	public String getUniqueflag() {
		return uniqueflag;
	}
	public void setUniqueflag(String uniqueflag) {
		this.uniqueflag = uniqueflag;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getSf() {
		return sf;
	}
	public void setSf(String sf) {
		this.sf = sf;
	}
	public String getYy() {
		return yy;
	}
	public void setYy(String yy) {
		this.yy = yy;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getJyid() {
		return jyid;
	}
	public void setJyid(String jyid) {
		this.jyid = jyid;
	}
}
