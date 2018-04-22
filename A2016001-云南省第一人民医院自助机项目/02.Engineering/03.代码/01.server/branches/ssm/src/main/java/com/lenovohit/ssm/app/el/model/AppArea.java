package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.lenovohit.core.model.BaseModel;

@Entity
@Table(name = "EL_AREA")
public class AppArea extends BaseModel{
	private static final long serialVersionUID = -6604578070498935299L;

	private int id;			
	private int parentId;
	private String name;
	private String shortName;
	private float longitude;
	private float latitude;
	private int level;
	private int sort;
	private int status;

	
	@Id
	@Column(name = "ID", nullable = false)
	@GeneratedValue(generator="customer-assigned")
	@GenericGenerator(name="customer-assigned",strategy="assigned")
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	@Column(name = "PARENT_ID")
	public int getParentId() {
		return parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	@Column(name = "NAME", length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "SHORTNAME", length = 50)
	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	@Column(name = "LONGITUDE")
	public float getLongitude() {
		return longitude;
	}

	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}

	@Column(name = "LATITUDE")
	public float getLatitude() {
		return latitude;
	}

	public void setLatitude(float latitude) {
		this.latitude = latitude;
	}

	@Column(name = "LEVEL")
	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	@Column(name = "SORT")
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@Column(name = "STATUS")
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public boolean _newObejct() {
		return  this.id > 0;
	}

}