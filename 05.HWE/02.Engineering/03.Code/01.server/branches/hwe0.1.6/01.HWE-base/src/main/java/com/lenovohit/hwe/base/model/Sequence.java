package com.lenovohit.hwe.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="BASE_SEQUENCE")
public class Sequence extends BaseIdModel{
	private static final long serialVersionUID = -8192924233682727979L;
	
	public static String FILL_POSITION_LEFT = "left";
	public static String FILL_POSITION_RIGHT = "right";
	
	private String seqKey;      //Sequence的Key
    private String seqCode;     //Sequence的Code
    private String seqName;     //Sequence的Name
    private String prefix;		//Sequence前缀
    private String dateformat;	//时间格式
    private long seqValue;		//Sequence的值
    private char filler;		//Seq填充物
    private String fillPosition;//Seq填充位置 left-左边填充，right-右边填充
    private	String postfix;
    
    private int seqLength;			//长度
    private long startWith;		//初始值
    private long step;			//步幅
    private long nextValue;     //下一个Sequence值

    
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

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getDateformat() {
		return dateformat;
	}

	public void setDateformat(String dateformat) {
		this.dateformat = dateformat;
	}

	public long getSeqValue() {
		return seqValue;
	}

	public void setSeqValue(long seqValue) {
		this.seqValue = seqValue;
	}

	public char getFiller() {
		return filler;
	}

	public void setFiller(char filler) {
		this.filler = filler;
	}

	public String getFillPosition() {
		return fillPosition;
	}

	public void setFillPosition(String fillPosition) {
		this.fillPosition = fillPosition;
	}

	public String getPostfix() {
		return postfix;
	}

	public void setPostfix(String postfix) {
		this.postfix = postfix;
	}

	public int getSeqLength() {
		return seqLength;
	}

	public void setSeqLength(int seqLength) {
		this.seqLength = seqLength;
	}

	public long getStartWith() {
		return startWith;
	}

	public void setStartWith(long startWith) {
		this.startWith = startWith;
	}

	public long getStep() {
		return step;
	}

	public void setStep(long step) {
		this.step = step;
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
		return nextValue;
	}
}