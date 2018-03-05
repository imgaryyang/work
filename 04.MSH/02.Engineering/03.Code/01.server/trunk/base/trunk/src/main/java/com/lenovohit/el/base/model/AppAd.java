package com.lenovohit.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APP_AD")
public class AppAd extends BaseIdModel {

	private static final long serialVersionUID = 5849925241056814892L;
	
	private String adPosId;
	private AppAdPos appAdPos;
	private String image;
	private String memo;
	private Integer sortNum;
	private String linkArticle;
	private String article;
	private String state;

	@Column(name = "AD_POS_ID")
	public String getAdPosId() {
		return adPosId;
	}

	public void setAdPosId(String adPosId) {
		this.adPosId = adPosId;
	}

	@Transient
	public AppAdPos getAppAdPos() {
		return this.appAdPos;
	}

	public void setAppAdPos(AppAdPos appAdPos) {
		this.appAdPos = appAdPos;
	}

	@Column(name = "IMAGE", length = 100)
	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Column(name = "MEMO", length = 100)
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Column(name = "SORT_NUM")
	public Integer getSortNum() {
		return this.sortNum;
	}

	public void setSortNum(Integer sortNum) {
		this.sortNum = sortNum;
	}

	@Column(name = "LINK_ARTICLE", length = 1)
	public String getLinkArticle() {
		return this.linkArticle;
	}

	public void setLinkArticle(String linkArticle) {
		this.linkArticle = linkArticle;
	}

	@Column(name = "ARTICLE", length = 32)
	public String getArticle() {
		return article;
	}

	public void setArticle(String article) {
		this.article = article;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

}