package com.lenovohit.ssm.base.model;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

@Entity
@Table(name = "XTGL_SSXWH")
public class SHXWH implements Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8413689357393145470L;

	private String sbxh; //"   NUMBER(18,0) NOT NULL ENABLE,
	private String jlxh; //"   NUMBER(18,0),
	private String name; //"   VARCHAR2(40 BYTE),
	private String pydm; //"   VARCHAR2(40 BYTE) NOT NULL ENABLE,
	private String type; //"   NUMBER(1,0),
	private String sjjlxh; //" NUMBER(18,0),
	private String sort; //"   NUMBER(6,0),
	private String remark; //" VARCHAR2(40 BYTE),
	private String py; //"     VARCHAR2(10 BYTE),
	private String wb; //"     VARCHAR2(10 BYTE),
	
	private Map<String,SHXWH> nameChildren = new HashMap<String,SHXWH>();
	private Map<String,SHXWH> xhChildren = new HashMap<String,SHXWH>();
	
	@Transient
	public Map<String, SHXWH> getNameChildren() {
		return nameChildren;
	}

	public void setNameChildren(Map<String, SHXWH> nameChildren) {
		this.nameChildren = nameChildren;
	}
	@Transient
	public Map<String, SHXWH> getXhChildren() {
		return xhChildren;
	}

	public void setXhChildren(Map<String, SHXWH> xhChildren) {
		this.xhChildren = xhChildren;
	}

	
	@Id
	public String getSbxh() {
		return sbxh;
	}

	public void setSbxh(String sbxh) {
		this.sbxh = sbxh;
	}

	public String getJlxh() {
		return jlxh;
	}

	public void setJlxh(String jlxh) {
		this.jlxh = jlxh;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPydm() {
		return pydm;
	}

	public void setPydm(String pydm) {
		this.pydm = pydm;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSjjlxh() {
		return sjjlxh;
	}

	public void setSjjlxh(String sjjlxh) {
		this.sjjlxh = sjjlxh;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPy() {
		return py;
	}

	public void setPy(String py) {
		this.py = py;
	}

	public String getWb() {
		return wb;
	}

	public void setWb(String wb) {
		this.wb = wb;
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
		return new HashCodeBuilder().append(this.getSbxh()).append(this.getJlxh	()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
	@Override
	public boolean _newObejct() {
		return null == this.getSbxh() && null == this.getJlxh();
	}
}
