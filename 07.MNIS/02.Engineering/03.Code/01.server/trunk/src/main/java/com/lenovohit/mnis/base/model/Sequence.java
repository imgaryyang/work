package com.lenovohit.mnis.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="BASE_SEQUENCE")
public class Sequence extends BaseIdModel{
	private static final long serialVersionUID = -8192924233682727979L;
    private String seqKey;     	//Sequence的Key
    private String seqCode;     //Sequence的Code
    private String seqName;     //Sequence的Name
    private long seqValue;		//Sequence的值
    
    private long nextValue;       //下一个Sequence值

    
    public Sequence() {
		super();
	}

	public Sequence(String seqKey, int poolSize) {
		super();
		this.seqKey = seqKey;
		this.seqValue = poolSize;
		this.nextValue = 0;
	}

	public String getSeqKey() {
		return seqKey;
	}

	public void setSeqKey(String seqKey) {
		this.seqKey = seqKey;
	}

	public long getSeqValue() {
		return seqValue;
	}

	public void setSeqValue(long seqValue) {
		this.seqValue = seqValue;
	}

	public String getSeqCode() {
		return seqCode;
	}

	public void setSeqCode(String seqCode) {
		this.seqCode = seqCode;
	}

	public String getSeqName() {
		return seqName;
	}

	public void setSeqName(String seqName) {
		this.seqName = seqName;
	}

	@Transient
	public long getNextValue() {
		return nextValue;
	}
	
	public void setNextValue(long nextValue) {
		this.nextValue = nextValue;
	}
	
	@Transient
	public synchronized long getNextSeqValue() {
		return ++nextValue;
	}
}