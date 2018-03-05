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

package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;


// import com.lenovohit.hwe.org.model.Org;

/**
 * TREAT_HOSPITAL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */

public class IHospital  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7057610207938825879L;

    /** orgId */
    private String orgId;

    /** name */
    private String name;

    /** no */
    private String no;

    /** type */
    private String type;

    /** level */
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
    /** address */
    private String address;
    /** 区域代码 */
    private String areaCode;
    /** 联系电话 */
    private List<String> content;
    
    
    
    //private Org org;
    

    public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public List<String> getContent() {
		return content;
	}

	public void setContent(List<String> content) {
		this.content = content;
	}

	/**
     * 获取orgId
     * 
     * @return orgId
     */
   
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

    
	/*public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}*/
    
}