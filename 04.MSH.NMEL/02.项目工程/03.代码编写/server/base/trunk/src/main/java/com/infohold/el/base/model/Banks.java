package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.infohold.core.model.BaseModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "EL_BANKS")
public class Banks extends BaseModel {
	private static final long serialVersionUID = 3426938966896712530L;
	
	private String bankNo;
	private String bankType;
	private String bankName;
	private String iconMini;
	private String iconMiddle;
	private String iconBig;
	private String fullImg;
	private String firstLetter;

	@Id
	@Column(name = "BANKNO", length = 30, nullable = false)
	@GeneratedValue(generator = "customer-assigned")
	@GenericGenerator(name = "customer-assigned", strategy = "assigned")
	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "BANKTYPE", length = 1)
	public String getBankType() {
		return bankType;
	}

	public void setBankType(String bankType) {
		this.bankType = bankType;
	}

	@Column(name = "BANKNAME", length = 70, nullable = false)
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "ICONMINI", length = 50)
	public String getIconMini() {
		return iconMini;
	}

	public void setIconMini(String iconMini) {
		this.iconMini = iconMini;
	}

	@Column(name = "ICONMIDDLE", length = 50)
	public String getIconMiddle() {
		return iconMiddle;
	}

	public void setIconMiddle(String iconMiddle) {
		this.iconMiddle = iconMiddle;
	}

	@Column(name = "ICONBIG", length = 50)
	public String getIconBig() {
		return iconBig;
	}

	public void setIconBig(String iconBig) {
		this.iconBig = iconBig;
	}

	@Column(name = "FULLIMG", length = 50)
	public String getFullImg() {
		return fullImg;
	}

	public void setFullImg(String fullImg) {
		this.fullImg = fullImg;
	}

	@Column(name = "FIRSTLETTER", length = 1)
	public String getFirstLetter() {
		return firstLetter;
	}

	public void setFirstLetter(String firstLetter) {
		this.firstLetter = firstLetter;
	}

	public boolean _newObejct() {
		// TODO Auto-generated method stub
		return StringUtils.isNotBlank(this.getBankNo());
	}

}
