package com.lenovohit.ssm.app.elh.treat.model;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 就医项总表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_TREATDETAIL_LOG")
@Inheritance(strategy=InheritanceType.JOINED)
public class TreatDetailLog extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8805319130397359699L;
	
	private String bizId;
	private String biz;
	private String bizName;//业务类别名称
	private String name;//名称
	private String notification;//提醒
	private String description;//描述
	private String treatment;//所属就医记录
	private String createTime;//创建时间
	private String updateTime;//更新时间
	private Object bizObject;
	private boolean needPay;//是否需要交费
	private boolean payed;//是否缴费
	private String operate;
	public String getOperate() {
		return operate;
	}
	public void setOperate(String operate) {
		this.operate = operate;
	}
	@Transient
	public Object getBizObject() {
		return bizObject;
	}
	public void setBizObject(Object bizObject) {
		this.bizObject = bizObject;
	}
	public String getBiz() {
		return biz;
	}
	public void setBiz(String biz) {
		this.biz = biz;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBizId() {
		return bizId;
	}
	public void setBizId(String bizId) {
		this.bizId = bizId;
	}
	public String getBizName() {
		return bizName;
	}
	public void setBizName(String bizName) {
		this.bizName = bizName;
	}
	public String getNotification() {
		return notification;
	}
	public void setNotification(String notification) {
		this.notification = notification;
	}
	public String getTreatment() {
		return treatment;
	}
	public void setTreatment(String treatment) {
		this.treatment = treatment;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public boolean isNeedPay() {
		return needPay;
	}
	public void setNeedPay(boolean needPay) {
		this.needPay = needPay;
	}
	public boolean isPayed() {
		return payed;
	}
	public void setPayed(boolean payed) {
		this.payed = payed;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
