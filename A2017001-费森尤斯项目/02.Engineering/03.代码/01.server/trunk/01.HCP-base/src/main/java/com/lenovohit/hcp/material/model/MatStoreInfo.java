package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity 
@Table(name = "MATERIAL_STOREINFO")	// 物资 - 库存信息表

public class MatStoreInfo extends HcpBaseModel {

	private static final long serialVersionUID = -6539577899938860312L;
	
	private String storeId;
    private String deptId;
    private String materialType; //药品分类|Material_TYPE
    private String materialCode;
//    private String materialId;	该字段为关联字段，为避免column specified twice错误而注释掉
	private String tradeName;
    private String materialSpecs;
    private String batchNo;
    private String approvalNo;
    private Date produceDate;
//    private String producer;	该字段为关联字段，为避免column specified twice错误而注释掉
    private Date validDate;
    private BigDecimal buyPrice;
    private BigDecimal salePrice;
    private BigDecimal storeSum;
    private String minUnit;
    private BigDecimal buyCost;
    private BigDecimal saleCost;
    private String location;
    private boolean stop; //停用标志|0-停1启
    private String comm;
	private MatInfo materialInfo;
	private Company companySupply;	//供货商
	private Company companyInfo;//生产厂商
	private BigDecimal alartNum=new BigDecimal(0);//警戒库存

	
	@RedisSequence
	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getMaterialType() {
		return materialType;
	}
	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}
	public String getMaterialCode() {
		return materialCode;
	}
	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}
//    public String getMaterialId() {
//		return materialId;
//	}
//	public void setMaterialId(String materialId) {
//		this.materialId = materialId;
//	}
	public String getTradeName() {
		return tradeName;
	}
	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}
	public String getMaterialSpecs() {
		return materialSpecs;
	}
	public void setMaterialSpecs(String specs) {
		this.materialSpecs = specs;
	}
	public String getBatchNo() {
		return batchNo;
	}
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	public String getApprovalNo() {
		return approvalNo;
	}
	public void setApprovalNo(String approvalNo) {
		this.approvalNo = approvalNo;
	}
	@Column(name="PRODUCE_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getProduceDate() {
		return produceDate;
	}
	public void setProduceDate(Date produceDate) {
		this.produceDate = produceDate;
	}
//	public String getProducer() {
//		return producer;
//	}
//	public void setProducer(String producer) {
//		this.producer = producer;
//	}
	@Column(name="VALID_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
	}
	public BigDecimal getBuyPrice() {
		return buyPrice;
	}
	public void setBuyPrice(BigDecimal buyPrice) {
		this.buyPrice = buyPrice;
	}
	public BigDecimal getSalePrice() {
		return salePrice;
	}
	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}
	public BigDecimal getStoreSum() {
		return storeSum;
	}
	public void setStoreSum(BigDecimal storeSum) {
		this.storeSum = storeSum;
	}
	public String getMinUnit() {
		return minUnit;
	}
	public void setMinUnit(String minUnit) {
		this.minUnit = minUnit;
	}
	public BigDecimal getBuyCost() {
		return buyCost;
	}
	public void setBuyCost(BigDecimal buyCost) {
		this.buyCost = buyCost;
	}
	public BigDecimal getSaleCost() {
		return saleCost;
	}
	public void setSaleCost(BigDecimal saleCost) {
		this.saleCost = saleCost;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	@Column(name = "STOP_FLAG")
	public boolean isStop() {
		return stop;
	}
	public void setStop(boolean stop) {
		this.stop = stop;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
	@ManyToOne//(cascade=(CascadeType.REFRESH)) 要把matStoreInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "MATERIAL_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public MatInfo getMaterialInfo() {
		return materialInfo;
	}
	public void setMaterialInfo(MatInfo matInfo) {
		this.materialInfo = matInfo;
	}
	
	@ManyToOne //要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}
	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}
	@ManyToOne //要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "COMPANY", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getCompanySupply() {
		return companySupply;
	}
	public void setCompanySupply(Company companySupply) {
		this.companySupply = companySupply;
	}
	public BigDecimal getAlartNum() {
		return alartNum;
	}
	public void setAlartNum(BigDecimal alartNum) {
		this.alartNum = alartNum;
	}
	
}