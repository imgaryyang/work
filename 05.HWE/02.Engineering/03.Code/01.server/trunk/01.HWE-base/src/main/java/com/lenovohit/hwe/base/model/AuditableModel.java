package com.lenovohit.hwe.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

/**
 * 审计信息实现类
 * @author zyus
 * @version 1.0.0 2017-12-14
 */

@MappedSuperclass
public class AuditableModel extends BaseIdModel{
	private static final long serialVersionUID = 5226356611900728929L;
	
	private String createdBy;
	private String updatedBy;
	private Date createdAt;
	private Date updatedAt;
	
	private String startDate;
	private String endDate;
	 /**
     * 获取createdBy
     * 
     * @return createdBy
     */
    @Column(name = "CREATED_BY", nullable = true, length = 50)
    public String getCreatedBy() {
        return this.createdBy;
    }

    /**
     * 设置createdBy
     * 
     * @param createdBy
     */
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * 获取createdAt
     * 
     * @return createdAt
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "CREATED_AT", nullable = true)
    public Date getCreatedAt() {
        return this.createdAt;
    }

    /**
     * 设置createdAt
     * 
     * @param createdAt
     */
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * 获取updatedBy
     * 
     * @return updatedBy
     */
    @Column(name = "UPDATED_BY", nullable = true, length = 50)
    public String getUpdatedBy() {
        return this.updatedBy;
    }

    /**
     * 设置updatedBy
     * 
     * @param updatedBy
     */
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    /**
     * 获取updatedAt
     * 
     * @return updatedAt
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "UPDATED_AT", nullable = true)
    public Date getUpdatedAt() {
        return this.updatedAt;
    }

    /**
     * 设置updatedAt
     * 
     * @param updatedAt
     */
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Transient
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	@Transient
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
}
