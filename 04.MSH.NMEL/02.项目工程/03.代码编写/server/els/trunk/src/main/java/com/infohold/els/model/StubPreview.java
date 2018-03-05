/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "ELS_STUB_PREVIEW")
public class StubPreview extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;

	private String perId;
	private String batchId;
	private String batchNo;
	private String month;
	private String idNo;
	private String name;
	private String note;
	private String templateId;
	private String template;
	private String item1;
	private String item2;
	private String item3;
	private String item4;
	private String item5;
	private String item6;
	private String item7;
	private String item8;
	private String item9;
	private String item10;
	private String item11;
	private String item12;
	private String item13;
	private String item14;
	private String item15;
	private String item16;
	private String item17;
	private String item18;
	private String item19;
	private String item20;
	private String item21;
	private String item22;
	private String item23;
	private String item24;
	private String item25;
	private String item26;
	private String item27;
	private String item28;
	private String item29;
	private String item30;

	
	@Column(name = "BATCH_NO", length = 20)
	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	@Column(name = "TEMPLATE_ID", length = 32)
	public String getTemplateId() {
		return templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}
	
	@Column(name = "TEMPLATE", length = 48)
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	@Column(name = "MONTH", length = 6)
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column(name = "NOTE", length = 200)
	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	@Column(name = "PER_ID", length = 32)
	public String getPerId() {
		return perId;
	}

	public void setPerId(String perId) {
		this.perId = perId;
	}

	@Column(name = "BATCH_ID", length = 32)
	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	@Column(name = "ID_NO", length = 18)
	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	@Column(name = "NAME", length = 48)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "ITEM1", length = 48)
	public String getItem1() {
		return item1;
	}

	public void setItem1(String item1) {
		this.item1 = item1;
	}

	@Column(name = "ITEM2", length = 48)
	public String getItem2() {
		return item2;
	}

	public void setItem2(String item2) {
		this.item2 = item2;
	}

	@Column(name = "ITEM3", length = 48)
	public String getItem3() {
		return item3;
	}

	public void setItem3(String item3) {
		this.item3 = item3;
	}

	@Column(name = "ITEM4", length = 48)
	public String getItem4() {
		return item4;
	}

	public void setItem4(String item4) {
		this.item4 = item4;
	}

	@Column(name = "ITEM5", length = 48)
	public String getItem5() {
		return item5;
	}

	public void setItem5(String item5) {
		this.item5 = item5;
	}

	@Column(name = "ITEM6", length = 48)
	public String getItem6() {
		return item6;
	}

	public void setItem6(String item6) {
		this.item6 = item6;
	}

	@Column(name = "ITEM7", length = 48)
	public String getItem7() {
		return item7;
	}

	public void setItem7(String item7) {
		this.item7 = item7;
	}

	@Column(name = "ITEM8", length = 48)
	public String getItem8() {
		return item8;
	}

	public void setItem8(String item8) {
		this.item8 = item8;
	}

	@Column(name = "ITEM9", length = 48)
	public String getItem9() {
		return item9;
	}

	public void setItem9(String item9) {
		this.item9 = item9;
	}

	@Column(name = "ITEM10", length = 48)
	public String getItem10() {
		return item10;
	}

	public void setItem10(String item10) {
		this.item10 = item10;
	}

	@Column(name = "ITEM11", length = 48)
	public String getItem11() {
		return item11;
	}

	public void setItem11(String item11) {
		this.item11 = item11;
	}

	@Column(name = "ITEM12", length = 48)
	public String getItem12() {
		return item12;
	}

	public void setItem12(String item12) {
		this.item12 = item12;
	}

	@Column(name = "ITEM13", length = 48)
	public String getItem13() {
		return item13;
	}

	public void setItem13(String item13) {
		this.item13 = item13;
	}

	@Column(name = "ITEM14", length = 48)
	public String getItem14() {
		return item14;
	}

	public void setItem14(String item14) {
		this.item14 = item14;
	}

	@Column(name = "ITEM15", length = 48)
	public String getItem15() {
		return item15;
	}

	public void setItem15(String item15) {
		this.item15 = item15;
	}

	@Column(name = "ITEM16", length = 48)
	public String getItem16() {
		return item16;
	}

	public void setItem16(String item16) {
		this.item16 = item16;
	}

	@Column(name = "ITEM17", length = 48)
	public String getItem17() {
		return item17;
	}

	public void setItem17(String item17) {
		this.item17 = item17;
	}

	@Column(name = "ITEM18", length = 48)
	public String getItem18() {
		return item18;
	}

	public void setItem18(String item18) {
		this.item18 = item18;
	}

	@Column(name = "ITEM19", length = 48)
	public String getItem19() {
		return item19;
	}

	public void setItem19(String item19) {
		this.item19 = item19;
	}

	@Column(name = "ITEM20", length = 48)
	public String getItem20() {
		return item20;
	}

	public void setItem20(String item20) {
		this.item20 = item20;
	}

	@Column(name = "ITEM21", length = 48)
	public String getItem21() {
		return item21;
	}

	public void setItem21(String item21) {
		this.item21 = item21;
	}

	@Column(name = "ITEM22", length = 48)
	public String getItem22() {
		return item22;
	}

	public void setItem22(String item22) {
		this.item22 = item22;
	}

	@Column(name = "ITEM23", length = 48)
	public String getItem23() {
		return item23;
	}

	public void setItem23(String item23) {
		this.item23 = item23;
	}

	@Column(name = "ITEM24", length = 48)
	public String getItem24() {
		return item24;
	}

	public void setItem24(String item24) {
		this.item24 = item24;
	}

	@Column(name = "ITEM25", length = 48)
	public String getItem25() {
		return item25;
	}

	public void setItem25(String item25) {
		this.item25 = item25;
	}

	@Column(name = "ITEM26", length = 48)
	public String getItem26() {
		return item26;
	}

	public void setItem26(String item26) {
		this.item26 = item26;
	}

	@Column(name = "ITEM27", length = 48)
	public String getItem27() {
		return item27;
	}

	public void setItem27(String item27) {
		this.item27 = item27;
	}

	@Column(name = "ITEM28", length = 48)
	public String getItem28() {
		return item28;
	}

	public void setItem28(String item28) {
		this.item28 = item28;
	}

	@Column(name = "ITEM29", length = 48)
	public String getItem29() {
		return item29;
	}

	public void setItem29(String item29) {
		this.item29 = item29;
	}

	@Column(name = "ITEM30", length = 48)
	public String getItem30() {
		return item30;
	}

	public void setItem30(String item30) {
		this.item30 = item30;
	}

	@Transient
	@Override
	public boolean isNew() {
		return StringUtils.isEmpty(this.id);
	}

}