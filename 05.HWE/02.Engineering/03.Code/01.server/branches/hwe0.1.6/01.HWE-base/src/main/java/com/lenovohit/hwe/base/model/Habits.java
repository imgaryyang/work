package com.lenovohit.hwe.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_USER_HABITS
 * 用户习惯
 * @author wang
 */
@Entity
@Table(name = "BASE_USER_HABITS")
public class Habits extends AuditableModel implements java.io.Serializable {
	public static String TYPE_CURR_PATIENT = "CURR_PATIENT";
	public static String TYPE_CURR_HOSPITAL = "CURR_HOSPITAL";
	public static String TYPE_CURR_PROFILE = "CURR_PROFILE";
	private static final long serialVersionUID = 7143472483366091207L;

	private String userId;
	private String name;
	private String habitType;
	private String habitContent;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHabitType() {
		return habitType;
	}
	public void setHabitType(String habitType) {
		this.habitType = habitType;
	}
	public String getHabitContent() {
		return habitContent;
	}
	public void setHabitContent(String habitContent) {
		this.habitContent = habitContent;
	}
	
}
