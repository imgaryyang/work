package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "b_controlparameter")
public class HcpCtrlParam extends HcpBaseModel {
    private static final long serialVersionUID = 1L;

    private String controlClass; //用中文来分类吧
    private String controlId; //控制ID
    private String controlNote; //控制说明
    private String controlParam; //控制参数
    private Boolean stopFlag; //停用标志|0-停1启
    
    public String getControlClass() {
        return controlClass;
    }
    public void setControlClass(String controlClass) {
        this.controlClass = controlClass;
    }
    public String getControlId() {
        return controlId;
    }
    public void setControlId(String controlId) {
        this.controlId = controlId;
    }
    public String getControlNote() {
        return controlNote;
    }
    public void setControlNote(String controlNote) {
        this.controlNote = controlNote;
    }
    public String getControlParam() {
        return controlParam;
    }
    public void setControlParam(String controlParam) {
        this.controlParam = controlParam;
    }
	public Boolean getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}

}