/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hwe.treat.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hwe.base.model.Address;
import com.lenovohit.hwe.base.model.AuditableModel;
import com.lenovohit.hwe.base.model.Transportation;
import com.lenovohit.hwe.org.model.Org;

/**
 * TREAT_HOSPITAL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_HOSPITAL")
public class Hospital extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7057610207938825879L;

    /** orgId */
    private String orgId;

    /** name */
    private String name;

    /** no */
    private String no;

    /** type
     * 	第一位0-公立 1-私立
		第二位 0-综合 1-专科
     */
    private String type;//

    /** level 
     * 	第一位 等级1,2,3
		第二位 级别 甲乙丙
     * */
    private String level;

    /** stars */
    private BigDecimal stars;

    /** likes */
    private Integer likes;

    /** favs */
    private Integer favs;

    /** goodComment */
    private Integer goodComment;

    /** badComment */
    private Integer badComment;

    /** comment */
    private String comment;

    /** status */
    private String status;
    
    private String logo;
    
    private String scenery;
    
    private Integer sceneryNum;
    
    private BigDecimal longitude;//经度
    
    private BigDecimal latitude;//纬度
    
    private Org org;
    
    private Address address;
    
    private Transportation transportation;
    
    private List<Profile> profiles;
    
	/**
     * 获取orgId
     * 
     * @return orgId
     */
    @Column(name = "ORG_ID", nullable = true, length = 32)
    public String getOrgId() {
        return this.orgId;
    }

    /**
     * 设置orgId
     * 
     * @param orgId
     */
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 50)
    public String getName() {
        return this.name;
    }

    /**
     * 设置name
     * 
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取no
     * 
     * @return no
     */
    @Column(name = "NO", nullable = true, length = 50)
    public String getNo() {
        return this.no;
    }

    /**
     * 设置no
     * 
     * @param no
     */
    public void setNo(String no) {
        this.no = no;
    }

    /**
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 2)
    public String getType() {
        return this.type;
    }

    /**
     * 设置type
     * 
     * @param type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取level
     * 
     * @return level
     */
    @Column(name = "LEVEL", nullable = true, length = 2)
    public String getLevel() {
        return this.level;
    }

    /**
     * 设置level
     * 
     * @param level
     */
    public void setLevel(String level) {
        this.level = level;
    }

    /**
     * 获取stars
     * 
     * @return stars
     */
    @Column(name = "STARS", nullable = true)
    public BigDecimal getStars() {
        return this.stars;
    }

    /**
     * 设置stars
     * 
     * @param stars
     */
    public void setStars(BigDecimal stars) {
        this.stars = stars;
    }

    /**
     * 获取likes
     * 
     * @return likes
     */
    @Column(name = "LIKES", nullable = true, length = 10)
    public Integer getLikes() {
        return this.likes;
    }

    /**
     * 设置likes
     * 
     * @param likes
     */
    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    /**
     * 获取favs
     * 
     * @return favs
     */
    @Column(name = "FAVS", nullable = true, length = 10)
    public Integer getFavs() {
        return this.favs;
    }

    /**
     * 设置favs
     * 
     * @param favs
     */
    public void setFavs(Integer favs) {
        this.favs = favs;
    }

    /**
     * 获取goodComment
     * 
     * @return goodComment
     */
    @Column(name = "GOOD_COMMENT", nullable = true, length = 10)
    public Integer getGoodComment() {
        return this.goodComment;
    }

    /**
     * 设置goodComment
     * 
     * @param goodComment
     */
    public void setGoodComment(Integer goodComment) {
        this.goodComment = goodComment;
    }

    /**
     * 获取badComment
     * 
     * @return badComment
     */
    @Column(name = "BAD_COMMENT", nullable = true, length = 10)
    public Integer getBadComment() {
        return this.badComment;
    }

    /**
     * 设置badComment
     * 
     * @param badComment
     */
    public void setBadComment(Integer badComment) {
        this.badComment = badComment;
    }

    /**
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT", nullable = true, length = 1000)
    public String getComment() {
        return this.comment;
    }

    /**
     * 设置comment
     * 
     * @param comment
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置status
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    
    @Column(name = "LONGITUDE", nullable = true, length = 1)
	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	@Transient
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}
	
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "ADDRESS_ID",  nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Address getAddress() {
		return address;
	}
	
	public void setAddress(Address address) {
		this.address = address;
	}
	
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "TRANSPORTATION_ID",  nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Transportation getTransportation() {
		return transportation;
	}
	
	public void setTransportation(Transportation transportation) {
		this.transportation = transportation;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getScenery() {
		return scenery;
	}

	public void setScenery(String scenery) {
		this.scenery = scenery;
	}

	public Integer getSceneryNum() {
		return sceneryNum;
	}

	public void setSceneryNum(Integer sceneryNum) {
		this.sceneryNum = sceneryNum;
	}
	@Transient
	public List<Profile> getProfiles() {
		return profiles;
	}

	public void setProfiles(List<Profile> profiles) {
		this.profiles = profiles;
	}
	
    
}