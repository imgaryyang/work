package com.lenovohit.hwe.treat.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hwe.base.model.AuditableModel;
import com.lenovohit.hwe.base.model.Images;

@Entity
@Table(name = "TREAT_CONSULT_RECORD")
public class ConsultRecord extends AuditableModel implements java.io.Serializable {
	private static final long serialVersionUID = 2785667409688656841L;
	
	public static final String STATUS_NO_REPLY ="1";    //未回复
	public static final String STATUS_REPLY ="2";       //已回复
	public static final String STATUS_COMPLETE ="3";    //已完成
	
	
	private String deptId;					
	private String deptName;					
	private String hosId;					
	private String hosName;					
	private Doctor doctor;
	private String doctorId;
	private String consultType;					
	private String consultTopic;					
	private String consultDetail;					
	private String status;		//1，未回复     2，已回复    3，已完成			
	private String comm;				
	private String stopFlag;					
	
	private List<ConsultReply> replyList;
	private List<Images> images;
	
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getHosName() {
		return hosName;
	}
	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	@ManyToOne
	@JoinColumn(name = "doctor", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Doctor getDoctor() {
		return doctor;
	}
	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}
	public String getConsultType() {
		return consultType;
	}
	public void setConsultType(String consultType) {
		this.consultType = consultType;
	}
	public String getConsultTopic() {
		return consultTopic;
	}
	public void setConsultTopic(String consultTopic) {
		this.consultTopic = consultTopic;
	}
	public String getConsultDetail() {
		return consultDetail;
	}
	public void setConsultDetail(String consultDetail) {
		this.consultDetail = consultDetail;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
	public String getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getHosId() {
		return hosId;
	}
	public void setHosId(String hosId) {
		this.hosId = hosId;
	}
	@Transient
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	@Transient
	public List<ConsultReply> getReplyList() {
		return replyList;
	}
	public void setReplyList(List<ConsultReply> replyList) {
		this.replyList = replyList;
	}
	@Transient
	public List<Images> getImages() {
		return images;
	}
	public void setImages(List<Images> images) {
		this.images = images;
	}
	
}
