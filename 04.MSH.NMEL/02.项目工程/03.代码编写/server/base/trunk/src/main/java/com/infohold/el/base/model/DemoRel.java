/**
 * 
 */
package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

/**
 * @author Exorics
 *
 */
@Entity
@Table(name = "EL_BASE_DEMO_REL")
public class DemoRel extends BaseIdModel {

	private static final long serialVersionUID = -4550719128527879354L;
	
	String name;
	String rel;
	
	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	@Column(name="rel")
	public String getRel() {
		return rel;
	}

	public void setRel(String rel) {
		this.rel = rel;
	}
}
