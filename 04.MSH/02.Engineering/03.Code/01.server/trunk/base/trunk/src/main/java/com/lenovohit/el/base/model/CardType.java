package com.lenovohit.el.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_CARD_TYPE")
public class CardType extends BaseIdModel {
	private static final long serialVersionUID = -8870014780431187434L;
	
	private String orgId;
	private String orgName;
	private String type;
	private String name;
	private Set<CardMenu> cardMenus = new HashSet<CardMenu>(0);
	private Set<BankCards> bankCardses = new HashSet<BankCards>(0);

	@Column(name = "ORG_ID", nullable = false, length = 32)
	public String getOrgId() {
		return this.orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@Column(name = "ORG_NAME", length = 100)
	public String getOrgName() {
		return this.orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	@Column(name = "TYPE", nullable = false, length = 32)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Transient
	public Set<CardMenu> getCardMenus() {
		return this.cardMenus;
	}

	public void setCardMenus(Set<CardMenu> cardMenus) {
		this.cardMenus = cardMenus;
	}

	@Transient
	public Set<BankCards> getBankCardses() {
		return this.bankCardses;
	}

	public void setBankCardses(Set<BankCards> bankCardses) {
		this.bankCardses = bankCardses;
	}

}