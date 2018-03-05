package com.lenovohit.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_NEWS")
public class News extends BaseIdModel {
	private static final long serialVersionUID = -8201343555442183251L;
	public static String NEWS_STATUE_ON = "1";
	public static String NEWS_STATUE_OFF = "2";
	
	private String fkId;
	private String fkType;
	private String caption;
	private String digest;
	private String body;
	private String image;
	private String feededBy;
	private String state;
	private String createdBy;
	private String createdAt;
	private String updatedBy;
	private String updatedAt;

	@Column(name = "FK_ID", length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "FK_TYPE", nullable = false, length = 2)
	public String getFkType() {
		return this.fkType;
	}

	public void setFkType(String fkType) {
		this.fkType = fkType;
	}

	@Column(name = "CAPTION", nullable = false, length = 100)
	public String getCaption() {
		return this.caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	@Column(name = "DIGEST", length = 300)
	public String getDigest() {
		return this.digest;
	}

	public void setDigest(String digest) {
		this.digest = digest;
	}

	@Column(name = "BODY", nullable = false, length = 2046)
	public String getBody() {
		return this.body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	@Column(name = "IMAGE", nullable = false, length = 100)
	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Column(name = "FEEDED_BY", length = 50)
	public String getFeededBy() {
		return this.feededBy;
	}

	public void setFeededBy(String feededBy) {
		this.feededBy = feededBy;
	}

	@Column(name = "STATE", nullable = false, length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "CREATED_BY", length = 50)
	public String getCreatedBy() {
		return this.createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	@Column(name = "CREATED_AT", length = 19)
	public String getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	@Column(name = "UPDATED_BY", length = 50)
	public String getUpdatedBy() {
		return this.updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	@Column(name = "UPDATED_AT", length = 19)
	public String getUpdatedAt() {
		return this.updatedAt;
	}

	public void setUpdatedAt(String updatedAt) {
		this.updatedAt = updatedAt;
	}

}