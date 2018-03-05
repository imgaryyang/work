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
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;



/**
 * TREAT_DEPTMENT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */

public class IDeptment  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 8145103793180190615L;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** parentId */
    private String parentId;

    /** parentNo */
    private String parentNo;

    /** no */
    private String no;

    /** name */
    private String name;

    /** pinyin */
    private String pinyin;

    /** wubi */
    private String wubi;

    /** address */
    private String address;

    /** brief */
    private String brief;

    /** isSpecial */
    private String isSpecial;

    /** 描述统一作为公共功能 */
    private String description;

    /** type */
    private String type;

    /** treatFee */
    private BigDecimal treatFee;

    /** regFee */
    private BigDecimal regFee;

    /** sort */
    private Integer sort;

    /** status */
    private String status;
    
    private Hospital hospital;
    
    private IDeptment parent;
    
    private Set<IDeptment> children;
    private List<String>  content;

    public List<String> getContent() {
		return content;
	}

	public void setContent(List<String> content) {
		this.content = content;
	}

	/**
     * 获取hosId
     * 
     * @return hosId
     */
    public String getHosId() {
        return this.hosId;
    }

    /**
     * 设置hosId
     * 
     * @param hosId
     */
    public void setHosId(String hosId) {
        this.hosId = hosId;
    }

    /**
     * 获取hosNo
     * 
     * @return hosNo
     */
    public String getHosNo() {
        return this.hosNo;
    }

    /**
     * 设置hosNo
     * 
     * @param hosNo
     */
    public void setHosNo(String hosNo) {
        this.hosNo = hosNo;
    }

    /**
     * 获取hosName
     * 
     * @return hosName
     */
    public String getHosName() {
        return this.hosName;
    }

    /**
     * 设置hosName
     * 
     * @param hosName
     */
    public void setHosName(String hosName) {
        this.hosName = hosName;
    }

    /**
     * 获取parentId
     * 
     * @return parentId
     */
    public String getParentId() {
        return this.parentId;
    }

    /**
     * 设置parentId
     * 
     * @param parentId
     */
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    /**
     * 获取parentNo
     * 
     * @return parentNo
     */
    public String getParentNo() {
        return this.parentNo;
    }

    /**
     * 设置parentNo
     * 
     * @param parentNo
     */
    public void setParentNo(String parentNo) {
        this.parentNo = parentNo;
    }

    /**
     * 获取no
     * 
     * @return no
     */
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
     * 获取name
     * 
     * @return name
     */
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
     * 获取pinyin
     * 
     * @return pinyin
     */
    public String getPinyin() {
        return this.pinyin;
    }

    /**
     * 设置pinyin
     * 
     * @param pinyin
     */
    public void setPinyin(String pinyin) {
        this.pinyin = pinyin;
    }

    /**
     * 获取wubi
     * 
     * @return wubi
     */
    public String getWubi() {
        return this.wubi;
    }

    /**
     * 设置wubi
     * 
     * @param wubi
     */
    public void setWubi(String wubi) {
        this.wubi = wubi;
    }

    /**
     * 获取address
     * 
     * @return address
     */
    public String getAddress() {
        return this.address;
    }

    /**
     * 设置address
     * 
     * @param address
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * 获取brief
     * 
     * @return brief
     */
    public String getBrief() {
        return this.brief;
    }

    /**
     * 设置brief
     * 
     * @param brief
     */
    public void setBrief(String brief) {
        this.brief = brief;
    }

    /**
     * 获取isSpecial
     * 
     * @return isSpecial
     */
    public String getIsSpecial() {
        return this.isSpecial;
    }

    /**
     * 设置isSpecial
     * 
     * @param isSpecial
     */
    public void setIsSpecial(String isSpecial) {
        this.isSpecial = isSpecial;
    }

    /**
     * 获取描述统一作为公共功能
     * 
     * @return 描述统一作为公共功能
     */
    public String getDescription() {
        return this.description;
    }

    /**
     * 设置描述统一作为公共功能
     * 
     * @param description
     *          描述统一作为公共功能
     */
    public void setDescription(String description) {
        this.description = description;
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
     * 获取treatFee
     * 
     * @return treatFee
     */
    public BigDecimal getTreatFee() {
        return this.treatFee;
    }

    /**
     * 设置treatFee
     * 
     * @param treatFee
     */
    public void setTreatFee(BigDecimal treatFee) {
        this.treatFee = treatFee;
    }

    /**
     * 获取regFee
     * 
     * @return regFee
     */
    public BigDecimal getRegFee() {
        return this.regFee;
    }

    /**
     * 设置regFee
     * 
     * @param regFee
     */
    public void setRegFee(BigDecimal regFee) {
        this.regFee = regFee;
    }

    /**
     * 获取sort
     * 
     * @return sort
     */
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置sort
     * 
     * @param sort
     */
    public void setSort(Integer sort) {
        this.sort = sort;
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
    
    @Transient
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	@Transient
	public IDeptment getParent() {
		return parent;
	}

	public void setParent(IDeptment parent) {
		this.parent = parent;
	}

	@Transient
	public Set<IDeptment> getChildren() {
		return children;
	}

	public void setChildren(Set<IDeptment> children) {
		this.children = children;
	}
    
    
}