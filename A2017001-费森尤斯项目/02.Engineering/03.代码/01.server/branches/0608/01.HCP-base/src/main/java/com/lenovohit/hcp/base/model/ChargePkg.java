package com.lenovohit.hcp.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;

/**
 * 收费组套
 * 
 * @author victor
 *
 */

@Entity
@Table(name = "ITEM_GROUP_INFO")
public class ChargePkg extends HcpBaseModel {

	/**
	 * 业务类型：收费记账
	 */
	public static final String BIZ_CLASS_FINANCE = "1";
	/**
	 * 业务类型：医生站
	 */
	public static final String BIZ_CLASS_DOC = "2";

	/**
	 * 共享等级：个人
	 */
	public static final String SHARE_LEVEL_PERSONAL = "1";
	/**
	 * 共享等级：部门
	 */
	public static final String SHARE_LEVEL_DEPARTMENT = "2";
	/**
	 * 共享等级：全院
	 */
	public static final String SHARE_LEVEL_HOSPITAL = "3";

	private static final long serialVersionUID = 4613177437589474502L;
	private String comboId;// 套餐ID,
	private String comboName;// 套餐名称,
	private String busiClass;// 业务分类1-收费记账，2-医生站
	private String drugFlag; // 药品标志
	private Department useDept;// 科室,
	private String comm;// 备注
	private String spellCode;// 拼音|超过10位无检索意义,
	private String wbCode;// 五笔,
	private String userCode;// 自定义码,
	private boolean stop;// 停用标志|1停0-启,
	private String shareLevel; // 共享等级(1:个人 2:科室 3:全院)

	@RedisSequence
	public String getComboId() {
		return comboId;
	}

	public void setComboId(String comboId) {
		this.comboId = comboId;
	}

	public String getComboName() {
		return comboName;
	}

	public void setComboName(String comboName) {
		this.comboName = comboName;
	}

	@ManyToOne
	@JoinColumn(name = "USE_DEPT", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getUseDept() {
		return useDept;
	}

	public void setUseDept(Department useDept) {
		this.useDept = useDept;
	}

	public String getBusiClass() {
		return busiClass;
	}

	public void setBusiClass(String busiClass) {
		this.busiClass = busiClass;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public String getSpellCode() {
		return spellCode;
	}

	public void setSpellCode(String spellCode) {
		this.spellCode = spellCode;
	}

	public String getWbCode() {
		return wbCode;
	}

	public void setWbCode(String wbCode) {
		this.wbCode = wbCode;
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	@Column(name = "STOP_FLAG")
	public boolean isStop() {
		return stop;
	}

	public void setStop(boolean stop) {
		this.stop = stop;
	}

	public String getShareLevel() {
		return shareLevel;
	}

	public void setShareLevel(String shareLevel) {
		this.shareLevel = shareLevel;
	}

	public String getDrugFlag() {
		return drugFlag;
	}

	public void setDrugFlag(String drugFlag) {
		this.drugFlag = drugFlag;
	}

}
