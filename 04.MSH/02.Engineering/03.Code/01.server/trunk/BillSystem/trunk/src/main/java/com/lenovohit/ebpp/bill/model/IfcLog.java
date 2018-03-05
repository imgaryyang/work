package com.lenovohit.ebpp.bill.model;

import java.math.BigInteger;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "IH_EBPP_IFC_LOG")
public class IfcLog extends BaseIdModel {

	private static final long serialVersionUID = -288171692664014228L;
	
	private String beginTime;
	private String reqClass;
	private String reqMethod;
	private String reqContent;
	private String flag;
	private String errInfo;
	private String returnInfo;
	private String returnTime;
	private BigInteger costTime;
	
	
	public String getBeginTime() {
		return beginTime;
	}
	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}
	public String getReqClass() {
		return reqClass;
	}
	public void setReqClass(String reqClass) {
		this.reqClass = reqClass;
	}
	public String getReqMethod() {
		return reqMethod;
	}
	public void setReqMethod(String reqMethod) {
		this.reqMethod = reqMethod;
	}
	public String getReqContent() {
		return reqContent;
	}
	public void setReqContent(String reqContent) {
		this.reqContent = reqContent;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getErrInfo() {
		return errInfo;
	}
	public void setErrInfo(String errInfo) {
		this.errInfo = errInfo;
	}
	public String getReturnInfo() {
		return returnInfo;
	}
	public void setReturnInfo(String returnInfo) {
		this.returnInfo = returnInfo;
	}
	public String getReturnTime() {
		return returnTime;
	}
	public void setReturnTime(String returnTime) {
		this.returnTime = returnTime;
	}
	public BigInteger getCostTime() {
		return costTime;
	}
	public void setCostTime(BigInteger costTime) {
		this.costTime = costTime;
	}
	
	
}