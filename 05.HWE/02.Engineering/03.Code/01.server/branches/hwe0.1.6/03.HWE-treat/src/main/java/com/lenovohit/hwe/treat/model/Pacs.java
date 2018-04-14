package com.lenovohit.hwe.treat.model;

public class Pacs {
	 /** 病人编号 */
    private String inpatientNo;

    /** pacs系统编号 */
    private String orderNO;
    
    /** 名称 */
    private String name;

    /** 部位 */
    private String part;
    
    /** 类型 */
    private String type;

    /** memo */
    private String memo;

    /** 编号 */
    private String barcode;

    /** 是否急诊 */
    private String isEmergency;
    
    /** 预定时间 */
    private String orderTime;

    /** 检查时间 */
    private String checkTime;
    
    /** 状态 */
    private String state;

    /** 结果 */
    private String see;

    /** 详细描述 */
    private String result;


    public String getInpatientNo() {
		return inpatientNo;
	}

	public void setInpatientNo(String inpatientNo) {
		this.inpatientNo = inpatientNo;
	}

	public String getOrderNO() {
		return orderNO;
	}

	public void setOrderNO(String orderNO) {
		this.orderNO = orderNO;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPart() {
		return part;
	}

	public void setPart(String part) {
		this.part = part;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getIsEmergency() {
		return isEmergency;
	}

	public void setIsEmergency(String isEmergency) {
		this.isEmergency = isEmergency;
	}

	public String getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(String orderTime) {
		this.orderTime = orderTime;
	}

	public String getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(String checkTime) {
		this.checkTime = checkTime;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getSee() {
		return see;
	}

	public void setSee(String see) {
		this.see = see;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

}



