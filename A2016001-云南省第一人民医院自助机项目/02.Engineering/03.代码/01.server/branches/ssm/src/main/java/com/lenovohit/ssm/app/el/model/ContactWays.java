package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_CONTACT_WAYS")
public class ContactWays extends BaseIdModel {
	private static final long serialVersionUID = 7935180038200706853L;
	
	private String fkId;	//外联id
	private String fkType;	//外联类型
	private String type;	//联系方式类型
	/*1 - 手机号
	2 - 电话
	3 - 传真
	4 - 400电话
	5 - 微信
	6 - 微博
	7 - QQ
	8 - EMAIL*/
	private String content;	//联系方式
	private String memo;	//备注

	@Column(name = "FK_ID", nullable = false, length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "FK_TYPE", length = 10)
	public String getFkType() {
		return this.fkType;
	}

	public void setFkType(String fkType) {
		this.fkType = fkType;
	}

	@Column(name = "TYPE", nullable = false, length = 1)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "CONTENT", nullable = false, length = 50)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "MEMO", length = 50)
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}