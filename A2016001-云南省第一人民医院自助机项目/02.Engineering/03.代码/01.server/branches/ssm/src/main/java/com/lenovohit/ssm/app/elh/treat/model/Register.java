package com.lenovohit.ssm.app.elh.treat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.lenovohit.core.model.BaseModel;
import com.lenovohit.ssm.app.elh.base.model.AppDepartment;
import com.lenovohit.ssm.app.elh.base.model.Doctor;
/**
 * 挂号表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_REGISTER")
public class Register  extends BaseModel{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7945426769069393099L;
	
	private String id;
	private String no;//号码
	private String appointNo;//预约码 预约挂号换号时用
	private String regDate;//挂号日期
	
	private String cardNo;//所持卡卡号
	private String cardType;//所持卡类型
	private String cardTypeName;//所持卡类型
	
	

	//private Hospital hospital;//挂号医院
	private AppDepartment department;//挂号科室
	private Doctor doctor;//挂号医生
	
	//private String hospitalId;//就诊医院->hospital
	private String departmentId;//就诊科室->department
	private String doctorId;//主治医生
	
	//private String hospitalName;//就诊医院->hospital
	private String departmentName;//就诊科室->department
	private String doctorName;//主治医生
	
	private String registerTime;//挂号时间 同创建时间 
	private String takeNoTime;//取号时间 同开始时间
	
	private String type;//挂号类别 
	private Double amount;//收费金额
	private boolean repeated;//是否复诊
	private String operator;//操作员
	
	private boolean reserved;//预约标志 1 预约 0 实时
	
	@Id
	@Column(name="ID",length = 32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public String getRegisterTime() {
		return registerTime;
	}
	public void setRegisterTime(String registerTime) {
		this.registerTime = registerTime;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	public boolean getRepeated() {
		return repeated;
	}
	public void setRepeated(boolean repeated) {
		this.repeated = repeated;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public boolean isReserved() {
		return reserved;
	}
	public void setReserved(boolean reserved) {
		this.reserved = reserved;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	/*public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}*/
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getCardTypeName() {
		return cardTypeName;
	}
	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}
	public String getAppointNo() {
		return appointNo;
	}
	public void setAppointNo(String appointNo) {
		this.appointNo = appointNo;
	}
	/*public Hospital getHospital() {
		return hospital;
	}
	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}*/
	
	@Transient
	public AppDepartment getDepartment() {
		return department;
	}
	public void setDepartment(AppDepartment department) {
		this.department = department;
	}
	@Transient
	public Doctor getDoctor() {
		return doctor;
	}
	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}
	/*public String getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}*/
	
	@Column(name="DEPARTMENT")
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	@Column(name="DOCTOR")
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	public String getTakeNoTime() {
		return takeNoTime;
	}
	public void setTakeNoTime(String takeNoTime) {
		this.takeNoTime = takeNoTime;
	}
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
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
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
}
