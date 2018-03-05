package com.lenovohit.elh.base.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.model.BaseModel;
import com.lenovohit.el.base.model.ContactWays;
import com.lenovohit.el.base.model.Transportation;

/**
 * 医院表
 * @author Administrator
 * 
 */
@Entity
@Table(name="ELH_HOSPITAL")
public class Hospital extends BaseModel{
	private static final long serialVersionUID = -998454776653335781L;
	private String idHlht;//院方数据ID
	private String name             ;      //名称	
	private String stars            ;      //星指数	
	private String sceneryThumb     ;      //默认实景缩略图	
	private double sceneryNum       ;      //实景图数量	
	private double likes            ;      //点赞数量	
	private double favs             ;      //收藏数量	
	private String comment          ;      //注释	
	private String address          ;      //地址	
	private double longitude        ;      //经度	
	private double latitude         ;      //纬度	
	private String transport        ;      //乘车方式
	private String description      ;      //描述	
	private String homeUrl          ;      //主页	
	private double goodComment      ;      //好评数	
	private double badComment       ;      //差评数	
	private String featureBackground;      //特色科室按钮背景图
	private String expertBackground ;      //专家医生按钮背景图
	private ElhOrg elhOrg;
	private String logo        ;     //医院
	private Org org;
	private String id;//
	private List<ContactWays> contactWays;
	private List<Transportation> transportations;
	@Transient
	public List<Transportation> getTransportations() {
		return transportations;
	}
	public void setTransportations(List<Transportation> transportations) {
		this.transportations = transportations;
	}
	@Transient
	public List<ContactWays> getContactWays() {
		return contactWays;
	}
	public void setContactWays(List<ContactWays> contactWays) {
		this.contactWays = contactWays;
	}
	@Id
	@Column(name="ID",length = 32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	@Transient
	public Org getOrg() {
		return org;
	}
	public void setOrg(Org org) {
		this.org = org;
	}
	@Transient
	public ElhOrg getElhOrg() {
		return elhOrg;
	}
	public void setElhOrg(ElhOrg elhOrg) {
		this.elhOrg = elhOrg;
	}
	public String getName() {
		return name;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getStars() {
		return stars;
	}
	public void setStars(String stars) {
		this.stars = stars;
	}
	public String getSceneryThumb() {
		return sceneryThumb;
	}
	public void setSceneryThumb(String sceneryThumb) {
		this.sceneryThumb = sceneryThumb;
	}
	public double getSceneryNum() {
		return sceneryNum;
	}
	public void setSceneryNum(double sceneryNum) {
		this.sceneryNum = sceneryNum;
	}
	public double getLikes() {
		return likes;
	}
	public void setLikes(double likes) {
		this.likes = likes;
	}
	public double getFavs() {
		return favs;
	}
	public void setFavs(double favs) {
		this.favs = favs;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public String getTransport() {
		return transport;
	}
	public void setTransport(String transport) {
		this.transport = transport;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getHomeUrl() {
		return homeUrl;
	}
	public void setHomeUrl(String homeUrl) {
		this.homeUrl = homeUrl;
	}
	public double getGoodComment() {
		return goodComment;
	}
	public void setGoodComment(double goodComment) {
		this.goodComment = goodComment;
	}
	public double getBadComment() {
		return badComment;
	}
	public void setBadComment(double badComment) {
		this.badComment = badComment;
	}
	public String getFeatureBackground() {
		return featureBackground;
	}
	public void setFeatureBackground(String featureBackground) {
		this.featureBackground = featureBackground;
	}
	public String getExpertBackground() {
		return expertBackground;
	}
	public void setExpertBackground(String expertBackground) {
		this.expertBackground = expertBackground;
	}
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
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
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
}
