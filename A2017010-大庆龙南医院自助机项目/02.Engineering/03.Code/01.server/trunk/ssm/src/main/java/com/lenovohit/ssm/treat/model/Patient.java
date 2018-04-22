package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

import com.lenovohit.core.utils.StringUtils;

public class Patient {
	private String no;//病人编号
	private String inpatientNo;//住院ID
	private String miCardNo;//医保卡编号
    private String medicalCardNo;//就诊卡编号
    private String cardType;
    private String papersType;
    private String idNo;
    private String name;
    private String gender;
    private String actStatus;   //
    private String accountNo;   //
    private String birthday;    // 
    private String age;         //
    private String telephone;   //联系电话
    private String mobile;      //移动电话 
    private String medium;      //
    private String nation;      //
    private String address;
    private String idIssuer;
    private String idEffectiveDate;
    private String black;
    private String status;
    private BigDecimal balance = new BigDecimal(0);
    private String createTime;
    private String unitCode;
    private String spell;
    private String wubi;
    private String relationCard;
    private String relationType;
    
    private String openType          ;            //开通类型1．	身份证开通2．担保身份证开通    3．短信认证开通
    private String guaranteeIdCard   ;            //担保身份证
    private String guaranteeName     ;            //担保人姓名
    private String guaranteeType     ;            //担保关系  开通类型为2 ，则该项不得为空。 1 - 配偶, 2 - 父母,3 - 子女,4 - 祖父母,5 - 孙子女,6 - 兄弟姐妹,7 - 叔叔阿姨,8 - 侄子侄女,9 - 同事同学,0 - 其他,A - 本人, B - 女婿媳妇
    private String verificationCode  ;            //验证码    开通类型为3，则该项不得为空
    private String hisUserid         ;            //自助机对应His用户id
    private String ktfs         	 ;            //预存开通方式 0：未任何身份验证 1：身份证2：短信    

    private String startTime;
    private String endTime;
    private String cardStatus;
    private String occupationnum;
    private String miPatientNo;
    
    private String accStatus;
    private String accStatusName; 
    
    
    private String nationality;//   国籍代码  默认中国：156	非空
    private String marriage;//婚姻代码	 默认未婚：1	非空
    private String nativePlace;//籍贯代码 默认昆明市：530100	非空
    //private String nation;//民族代码 默认汉族：C01	非空
    
    
    private String sheng;//地址代码 大庆新增
    private String shi;//地址代码 大庆新增
    private String xian;//地址代码 大庆新增
    private String location;//地址代码 大庆新增
    private String company;//单位
    private String otherIdNO;//其他证件号
    
    private String lhz;//老会战标志0-不是1-是
    
    public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getOtherIdNO() {
		return otherIdNO;
	}
	public void setOtherIdNO(String otherIdNO) {
		this.otherIdNO = otherIdNO;
	}
	public String getSheng() {
		return sheng;
	}
	public void setSheng(String sheng) {
		this.sheng = sheng;
	}
	public String getShi() {
		return shi;
	}
	public void setShi(String shi) {
		this.shi = shi;
	}
	public String getXian() {
		return xian;
	}
	public void setXian(String xian) {
		this.xian = xian;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getMiPatientNo() {
		return miPatientNo;
	}
	public void setMiPatientNo(String miPatientNo) {
		this.miPatientNo = miPatientNo;
	}
	public String getOccupationnum() {
		return occupationnum;
	}
	public void setOccupationnum(String occupationnum) {
		this.occupationnum = occupationnum;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
    public String getInpatientNo() {
		return inpatientNo;
	}
	public void setInpatientNo(String inpatientNo) {
		this.inpatientNo = inpatientNo;
	}
	public String getMiCardNo() {
        return miCardNo;
    }
    public void setMiCardNo(String miCardNo) {
        this.miCardNo = miCardNo;
    }
    public String getMedicalCardNo() {
        return medicalCardNo;
    }
    public void setMedicalCardNo(String medicalCardNo) {
        this.medicalCardNo = medicalCardNo;
    }
    public String getCardType() {
        return cardType;
    }
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
    public String getPapersType() {
        return papersType;
    }
    public void setPapersType(String papersType) {
        this.papersType = papersType;
    }
    public String getIdNo() {
        return idNo;
    }
    public void setIdNo(String idNo) {
    	if(StringUtils.isEmpty(idNo))this.idNo="";
    	
    	String temp = idNo.toUpperCase();
        this.idNo = temp;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getActStatus() {
        return actStatus;
    }
    public void setActStatus(String actStatus) {
        this.actStatus = actStatus;
    }
    public String getAccountNo() {
        return accountNo;
    }
    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }
    public String getBirthday() {
        return birthday;
    }
    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }
    public String getAge() {
        return age;
    }
    public void setAge(String age) {
        this.age = age;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    public String getMedium() {
        return medium;
    }
    public void setMedium(String medium) {
        this.medium = medium;
    }
    public String getNation() {
        return nation;
    }
    public void setNation(String nation) {
        this.nation = nation;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getIdIssuer() {
        return idIssuer;
    }
    public void setIdIssuer(String idIssuer) {
        this.idIssuer = idIssuer;
    }
    public String getIdEffectiveDate() {
        return idEffectiveDate;
    }
    public void setIdEffectiveDate(String idEffectiveDate) {
        this.idEffectiveDate = idEffectiveDate;
    }
    public String getBlack() {
        return black;
    }
    public void setBlack(String black) {
        this.black = black;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public BigDecimal getBalance() {
        return balance;
    }
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    public String getCreateTime() {
        return createTime;
    }
    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
    public String getUnitCode() {
        return unitCode;
    }
    public void setUnitCode(String unitCode) {
        this.unitCode = unitCode;
    }
    public String getSpell() {
        return spell;
    }
    public void setSpell(String spell) {
        this.spell = spell;
    }
    public String getWubi() {
        return wubi;
    }
    public void setWubi(String wubi) {
        this.wubi = wubi;
    }
	public String getStartTime() {
		return startTime;
	}
	
	public String getOpenType() {
		return openType;
	}
	public void setOpenType(String openType) {
		this.openType = openType;
	}
	public String getGuaranteeIdCard() {
		return guaranteeIdCard;
	}
	public void setGuaranteeIdCard(String guaranteeIdCard) {
		this.guaranteeIdCard = guaranteeIdCard;
	}
	public String getGuaranteeName() {
		return guaranteeName;
	}
	public void setGuaranteeName(String guaranteeName) {
		this.guaranteeName = guaranteeName;
	}
	public String getGuaranteeType() {
		return guaranteeType;
	}
	public void setGuaranteeType(String guaranteeType) {
		this.guaranteeType = guaranteeType;
	}
	public String getVerificationCode() {
		return verificationCode;
	}
	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}
	public String getHisUserid() {
		return hisUserid;
	}
	public void setHisUserid(String hisUserid) {
		this.hisUserid = hisUserid;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getCardStatus() {
		return cardStatus;
	}
	public void setCardStatus(String cardStatus) {
		this.cardStatus = cardStatus;
	}
	public String getRelationCard() {
		return relationCard;
	}
	public void setRelationCard(String relationCard) {
		this.relationCard = relationCard;
	}
	public String getRelationType() {
		return relationType;
	}
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
	public String getKtfs() {
		return ktfs;
	}
	public void setKtfs(String ktfs) {
		this.ktfs = ktfs;
	}
	public String getAccStatus() {
		return accStatus;
	}
	public void setAccStatus(String accStatus) {
		this.accStatus = accStatus;
	}
	public String getAccStatusName() {
		return accStatusName;
	}
	public void setAccStatusName(String accStatusName) {
		this.accStatusName = accStatusName;
	}
	public String getNationality() {
		return nationality;
	}
	public void setNationality(String nationality) {
		this.nationality = nationality;
	}
	public String getMarriage() {
		return marriage;
	}
	public void setMarriage(String marriage) {
		this.marriage = marriage;
	}
	public String getNativePlace() {
		return nativePlace;
	}
	public void setNativePlace(String nativePlace) {
		this.nativePlace = nativePlace;
	}
	public String getLhz() {
		return lhz;
	}
	public void setLhz(String lhz) {
		this.lhz = lhz;
	}
	
}
