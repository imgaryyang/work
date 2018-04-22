package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 评论
 * @author wang
 *
 */
@Entity
@Table(name = "EL_COMMENT")
public class Comment extends BaseIdModel {
	private static final long serialVersionUID = 3786190816380281122L;
	
	private String fkId;	//外联id
	private String fkType;	//外联类型
	private String userId;	//用户id
	private String userName;//用户名称
	private String userNickname;//用户昵称
	private String comment;	//评论内容
	private String postAt;	//发布时间
	private String state;	//状态

	@Column(name = "FK_ID", length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "FK_TYPE", length = 20)
	public String getFkType() {
		return this.fkType;
	}

	public void setFkType(String fkType) {
		this.fkType = fkType;
	}

	@Column(name = "USER_ID", length = 32)
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "USER_NAME", length = 50)
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "USER_NICKNAME", length = 50)
	public String getUserNickname() {
		return this.userNickname;
	}

	public void setUserNickname(String userNickname) {
		this.userNickname = userNickname;
	}

	@Column(name = "COMMENT", length = 500)
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "POST_AT", length = 19)
	public String getPostAt() {
		return this.postAt;
	}

	public void setPostAt(String postAt) {
		this.postAt = postAt;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

}