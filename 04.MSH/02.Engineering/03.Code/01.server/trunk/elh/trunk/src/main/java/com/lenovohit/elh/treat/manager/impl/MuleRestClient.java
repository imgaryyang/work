package com.lenovohit.elh.treat.manager.impl;

import java.io.Serializable;
import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.pay.model.Charge;
import com.lenovohit.elh.treat.model.CheckDetail;
import com.lenovohit.elh.treat.model.DrugDetail;
import com.lenovohit.elh.treat.model.DrugOrder;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.RegistSource;
import com.lenovohit.elh.treat.model.TreatDetail;
import com.lenovohit.elh.treat.model.Treatment;
import com.lenovohit.elh.treat.vom.ChargesTom;
import com.lenovohit.elh.treat.vom.ChecksTom;
import com.lenovohit.elh.treat.vom.DiagnosisVom;
import com.lenovohit.elh.treat.vom.DrugOrderVom;
import com.lenovohit.elh.treat.vom.MedicalCheckVom;
import com.lenovohit.elh.treat.vom.RegisterVom;
import com.lenovohit.elh.treat.vom.TreatmentAndRegister;
import com.lenovohit.elh.treat.web.rest.TreatHisRestController;
/**
 * 这是个测试类，模拟医院
 * 测试url<br>
 * http://127.0.0.1:8080/elh/treat/registSources
 * data={hospital:8a8c7d9b55298217015529a9844e0000,department:8a8180835569c883015569c94ee60000}
 * Object hospId = params.get("hospital");
		Object deptId = params.get("department");
		Object docId = params.get("doctor");
		Object regType = params.get("regType");
 * @author xia
 *
 */
public class MuleRestClient {
	private GenericManager<Treatment, String> treatmentManager;
	private GenericManager<MedicalCheck, String> medicalCheckManager;
	private GenericManager<TreatDetail, String> treatDetailManager;
	private GenericManager<Doctor, String> doctorManager;
	private GenericManager<Department, String> departmentManager;
	private GenericManager<DrugOrder, String> drugOrderManager;
	
	public GenericManager<DrugOrder, String> getDrugOrderManager() {
		return drugOrderManager;
	}
	public void setDrugOrderManager(
			GenericManager<DrugOrder, String> drugOrderManager) {
		this.drugOrderManager = drugOrderManager;
	}
	public GenericManager<Department, String> getDepartmentManager() {
		return departmentManager;
	}
	public void setDepartmentManager(
			GenericManager<Department, String> departmentManager) {
		this.departmentManager = departmentManager;
	}
	public GenericManager<Doctor, String> getDoctorManager() {
		return doctorManager;
	}
	public void setDoctorManager(GenericManager<Doctor, String> doctorManager) {
		this.doctorManager = doctorManager;
	}
	public GenericManager<TreatDetail, String> getTreatDetailManager() {
		return treatDetailManager;
	}
	public void setTreatDetailManager(
			GenericManager<TreatDetail, String> treatDetailManager) {
		this.treatDetailManager = treatDetailManager;
	}
	public GenericManager<MedicalCheck, String> getMedicalCheckManager() {
		return medicalCheckManager;
	}
	public void setMedicalCheckManager(
			GenericManager<MedicalCheck, String> medicalCheckManager) {
		this.medicalCheckManager = medicalCheckManager;
	}
	public GenericManager<Treatment, String> getTreatmentManager() {
		return treatmentManager;
	}
	public void setTreatmentManager(
			GenericManager<Treatment, String> treatmentManager) {
		this.treatmentManager = treatmentManager;
	}

	private TreatHisRestController treatHisRestController;
	public TreatHisRestController getTreatHisRestController() {
		return treatHisRestController;
	}
	public void setTreatHisRestController(
			TreatHisRestController treatHisRestController) {
		this.treatHisRestController = treatHisRestController;
	}

	private static int regAppiontNo = (Integer.parseInt(DateUtils.date2String(new Date(), "MMddHHmm")))*100;
	private static int regNo = (Integer.parseInt(DateUtils.date2String(new Date(), "MMddHHmm")))*100;
	public String post(String url,String json){
		return this.doTest(url, json);
	}
	public String get(String url,String json){
		return this.doTest(url, json);
	}
	public String put(String url,String json){
		return this.doTest(url, json);
	}
	public String del(String url,String json){
		return this.doTest(url, json);
	}
	public abstract class HospitalTread extends Thread{
		public HospitalTread(long delay){
			this.delay = delay;
		}
		private long delay;
		public void run() {
			try {
				sleep(delay);
				doRun();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		public abstract void doRun();
	}
	private String doTest(String url,String json){
		if(HisManagerImpl.URL_REG_SOURCE.equals(url)){//请求号源
			Map<?,?> param = JSONUtils.deserialize(json, Map.class);
			String reqType = param.get("reqType").toString();
			String department = param.get("department").toString();
			String hospital = param.get("hospital").toString();
			String doctor = param.get("doctor").toString();
			String date = param.get("date").toString();
			List<RegistSource> RegistSources = this.getRegistSource(reqType,hospital,department,doctor,date);
			return JSONUtils.serialize(RegistSources);
		}
		if(HisManagerImpl.URL_REG.equals(url)){//预约挂号
			final RegistSource source = JSONUtils.deserialize(json, RegistSource.class);
			source.setAppointNo(""+(regAppiontNo++));
			//开启另外进程取号
			HospitalTread thread = new HospitalTread(1000*60){//20秒后 取号成功 发送收费项目
				public void doRun(){
					//发送就医信息 TODO 修改需要支付的状态
					TreatmentAndRegister tr = new TreatmentAndRegister();
					tr.setRegister(createRegByRegSource(source));
					tr.setTreatment(createTreatByRegSource(source));
					treatHisRestController.forCreateTreat(JSONUtils.serialize(tr));
					//发送收费项
					ChargesTom chargesTom = new ChargesTom();
					List<Charge> charges = new ArrayList<Charge>();
					charges.add(createCharge("register","挂号费",source.getAmt(),tr.getRegister().getIdHlht()));
					chargesTom.setCharges(charges);
					chargesTom.setTotalAmt(source.getAmt());
					chargesTom.setTotal(charges.size());
					treatHisRestController.forCreateCharges(JSONUtils.serialize(chargesTom));
				}
			};
			thread.start();
			return JSONUtils.serialize(source);
		}
		if(HisManagerImpl.URL_PAY_CHARGES.equals(url)){//支付收费项目
			ChargesTom req = JSONUtils.deserialize(json, ChargesTom.class);
			List<Charge> charges = req.getCharges();
			Map<String,List<Charge>> mapcharge = new HashMap<String,List<Charge>>();
			for(Charge charge : charges){
				charge.setStatus("1");//支付成功
				List<Charge> type = mapcharge.get(charge.getBizSource());
				if(null==type){
					type = new ArrayList<Charge>();
					mapcharge.put(charge.getBizSource(), type);
				}
				type.add(charge);
			}
			for(String key : mapcharge.keySet()){
				payCharge(key,mapcharge.get(key));
			}
			
			return JSONUtils.serialize(req);
		}
		return "";
	}
	private Charge createCharge(String bizSource,String name,double receiveAmount,String bizId){
		UUID uu = new UUID();  
		Charge charge = new Charge();
		charge.setBizId(bizId);
		charge.setBizSource(bizSource);//挂号 等
		charge.setIdHlht(uu.generate().toString());
		charge.setName(name);
		charge.setReceiveAmount(receiveAmount);
		//private String patient;
		charge.setCreateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		charge.setOccurTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		charge.setRegTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		return charge;
	}
	private Charge payCharge(String type,List<Charge> charges){
		if(null == charges || charges.size()<1)return null;
		Charge charge = charges.get(0);
		final List<Charge> fcharges = charges;
		final Treatment treatment = treatmentManager.get(charge.getTreatment());
		if("register".equals(type)){//支付挂号费
			//生成看诊记录
			HospitalTread thread = new HospitalTread(1000*60){//20秒后 取号成功 发送收费项目
				public void doRun(){
					DiagnosisVom vom = createDiagnosis(treatment);
					treatHisRestController.forCreateDiagnosis(JSONUtils.serialize(vom));
				}
			};
			thread.start();
			
			HospitalTread thread2 = new HospitalTread(1000*120){//20秒后 生成检查单
				public void doRun(){
					List<MedicalCheckVom> checks = getChecks(treatment);
					//发送收费项
					ChecksTom checksTom = new ChecksTom();
					checksTom.setChecks(checks);
					ChargesTom chargesTom = new ChargesTom();
					List<Charge> charges = new ArrayList<Charge>();
					Double totalAmt=0.0;
					for(MedicalCheckVom check : checks){//TODO 暂时循环，可能需要多条同时发送
						Random rand = new Random();
						Double randNum = rand.nextInt(100)+100.00;
						totalAmt+=randNum;
						charges.add(createCharge("medicalCheck",check.getSubject()+"检查费",randNum,check.getIdHlht()));
					}
					chargesTom.setCharges(charges);
					chargesTom.setTotalAmt(totalAmt);
					chargesTom.setTotal(charges.size());
					treatHisRestController.forCreateCheck(JSONUtils.serialize(checksTom));
					treatHisRestController.forCreateCharges(JSONUtils.serialize(chargesTom));
				}
			};
			thread2.start();
		}
		if("medicalCheck".equals(type)){//支付检查单
			//20秒后检查完毕
			HospitalTread thread0 = new HospitalTread(1000*60){//20秒后 取号成功 发送收费项目
				public void doRun(){
					for(Charge charge : fcharges ){
						MedicalCheck check = medicalCheckManager.get(charge.getTreatdetail());
						TreatDetail d = treatDetailManager.get(check.getId());
						MedicalCheckVom vom = new MedicalCheckVom(check,d);
						treatHisRestController.forDoCheck(JSONUtils.serialize(vom));
					}
				}
			};
			thread0.start();
			//生成检查结果，同步给易健康
			HospitalTread thread = new HospitalTread(1000*120){//20秒后 取号成功 发送收费项目
				public void doRun(){
					
					for(Charge charge : fcharges ){
						MedicalCheck check = medicalCheckManager.get(charge.getTreatdetail());
						if("血细胞分析".equals(check.getSubject()))check.setDetails(getCheckDetails(reports1));
						if("尿常规".equals(check.getSubject()))check.setDetails(getCheckDetails(reports2));
						if("肝功".equals(check.getSubject()))check.setDetails(getCheckDetails(reports3));
						TreatDetail d = treatDetailManager.get(check.getId());
						MedicalCheckVom vom = new MedicalCheckVom(check,d);
						treatHisRestController.forCreateCheckResult(JSONUtils.serialize(vom));
					}
				}
			};
			thread.start();
			HospitalTread thread2 = new HospitalTread(1000*180){//20秒后药单
				public void doRun(){
					DrugOrderVom vom = createDrugOrder(treatment);
					System.out.println("药单药品数量 ： " + (
							(null == vom.getDetails())?0:vom.getDetails().size()
					));
					//发送收费项
					ChargesTom chargesTom = new ChargesTom();
					List<Charge> charges = new ArrayList<Charge>();
					try {
						charges.add(
								createCharge(
										"drugOrder","药费",
										vom.getAmount(),// TODO Double double区别
										vom.getIdHlht()
								)
						);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					chargesTom.setCharges(charges);
					chargesTom.setTotalAmt(vom.getAmount());
					chargesTom.setTotal(charges.size());
					treatHisRestController.forCreateDrug(JSONUtils.serialize(vom));
					treatHisRestController.forCreateCharges(JSONUtils.serialize(chargesTom));
				}
			};
			thread2.start();
		}
		if("drugOrder".equals(type)){
			//更新药单提醒
			//20秒后检查完毕
			HospitalTread thread0 = new HospitalTread(1000*60){//20秒后 出药
				public void doRun(){
					for(Charge charge : fcharges ){
						DrugOrder drug = drugOrderManager.get(charge.getTreatdetail());
						TreatDetail d = treatDetailManager.get(charge.getTreatdetail());
						DrugOrderVom vom = new DrugOrderVom(drug,d);
						treatHisRestController.forOutDrug(JSONUtils.serialize(vom));
					}
				}
			};
			thread0.start();
			
			//60取药完毕通知
			HospitalTread thread1 = new HospitalTread(1000*120){//60秒后 取号成功 发送收费项目
				public void doRun(){
					for(Charge charge : fcharges ){
						DrugOrder drug = drugOrderManager.get(charge.getTreatdetail());
						TreatDetail d = treatDetailManager.get(charge.getTreatdetail());
						DrugOrderVom vom = new DrugOrderVom(drug,d);
						treatHisRestController.forReceiveDrug(JSONUtils.serialize(vom));
					}
				}
			};
			thread1.start();
			
		}
		return charge;
	}
	
	public List<MedicalCheckVom> getChecks(Treatment treatment){//TODO 
		Date now = new Date();
		UUID uu = new UUID();  
		List<MedicalCheckVom> checks = new ArrayList<MedicalCheckVom>();
		MedicalCheck check1 = new MedicalCheck();
		TreatDetail detail1 = new TreatDetail();
		check1.setCaseNo("156196");
		detail1.setBiz("medicalCheck");
		detail1.setBizName("检查");
		detail1.setIdHlht(uu.generate().toString());
		detail1.setTreatment(treatment.getIdHlht());
		check1.setBedNo("18");
		detail1.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail1.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check1.setOptDoctor("8a81a7db4dae02b0014dae02b0960005");
		check1.setSubject("血细胞分析");
		check1.setSpecimen("血清");
		check1.setSpecimenNo("100");
		check1.setOperator("韩奎文");
		check1.setAudit("苏丽娟");
		check1.setMachine("贝克曼AU2700");
		check1.setDiagnosis("无明显异常");
		check1.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check1.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail1.setPatientId(treatment.getPatientId());
		detail1.setPatientName(treatment.getPatientName());
		detail1.setHospitalId(treatment.getHospitalId());
		detail1.setHospitalName(treatment.getHospitalName());
		detail1.setName(check1.getSubject()+"检查");
		checks.add(new MedicalCheckVom(check1,detail1));
		
		
		MedicalCheck check2 = new MedicalCheck();
		TreatDetail detail2 = new TreatDetail();
		check2.setCaseNo("156197");
		detail2.setTreatment(treatment.getIdHlht());
		detail2.setBiz("medicalCheck");
		detail2.setBizName("检查");
		detail2.setIdHlht(uu.generate().toString());
		check2.setBedNo("19");
		detail2.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail2.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check2.setOptDoctor("8a81a7db4dae02b0014dae02b0960002");
		check2.setSubject("尿常规");
		check2.setSpecimen("尿液");
		check2.setSpecimenNo("101");
		check2.setOperator("徐彤");
		check2.setAudit("杨静波");
		check2.setMachine("希森美康UF100，迪瑞H800");
		check2.setDiagnosis("无明显异常");
		check2.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check2.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail2.setPatientId(treatment.getPatientId());
		detail2.setPatientName(treatment.getPatientName());
		detail2.setHospitalId(treatment.getHospitalId());
		detail2.setHospitalName(treatment.getHospitalName());
		detail2.setName(check2.getSubject()+"检查");
		checks.add(new MedicalCheckVom(check2,detail2));
	
		MedicalCheck check3 = new MedicalCheck();
		TreatDetail detail3 = new TreatDetail();
		detail3.setIdHlht(uu.generate().toString());
		detail3.setTreatment(treatment.getIdHlht());
		check3.setCaseNo("156198");
		detail3.setBiz("medicalCheck");
		detail3.setBizName("检查");
		check3.setBedNo("20");
		detail3.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail3.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check3.setOptDoctor("8a81a7db4dae02b0014dae02b0960002");
		check3.setSubject("肝功");
		check3.setSpecimen("血清");
		check3.setSpecimenNo("102");
		check3.setOperator("张松岩");
		check3.setAudit("李萍");
		check3.setMachine("贝克曼AU2700");
		check3.setDiagnosis("无明显异常");
		check3.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		check3.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		detail3.setPatientId(treatment.getPatientId());
		detail3.setPatientName(treatment.getPatientName());
		detail3.setHospitalId(treatment.getHospitalId());
		detail3.setHospitalName(treatment.getHospitalName());
		detail3.setName(check3.getSubject()+"检查");
		checks.add(new MedicalCheckVom(check3,detail3));
		//check1.setReportTime(DateUtil.date2String(now, "yyyy-MM-dd HH:mm:ss"));
	//	MedicalCheck check2 = new MedicalCheck();
		
	//	checks.add(check2);
		List<Department> departments = departmentManager.findAll();
		if(departments.size()>0){
			check1.setDepartment(departments.get(0).getIdHlht());
			detail1.setDeptName(departments.get(0).getName());
			check2.setDepartment(departments.get(0).getIdHlht());
			detail2.setDeptName(departments.get(0).getName());
			check3.setDepartment(departments.get(0).getIdHlht());
			detail3.setDeptName(departments.get(0).getName());
		}
		return checks;
	}
	private RegistSource initRegistSource(String hospital,String department,String doctor,String date,
			String noon,Double amt,String type,int total,int last ){
		RegistSource s = new RegistSource();
		s.setDate(date);
		s.setNoon(noon);
		s.setType(type);
		s.setAmt(amt);
//		s.setDepartment(department);
//		s.setHospital(hospital);
//		s.setDoctor(doctor);
		s.setTotal(total);
		s.setLast(last);		
		return s;
	}
	private List<RegistSource> getRegistSource(String reqType,String hospital,String department, String doctor,String dateString){
		List<RegistSource> list = new ArrayList<RegistSource>();
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		if(!(null==dateString || "".equals(dateString))){//制定日期查询
			RegistSource am1 = initRegistSource(hospital,department,doctor,dateString, "am", 10.0, "普通门诊", 20, 10);
			RegistSource am2 = initRegistSource(hospital,department,doctor,dateString, "am", 20.0, "专家门诊", 10, 4);
			RegistSource am3 = initRegistSource(hospital,department,doctor,dateString, "am", 100.0, "特需门诊", 10, 0);
			RegistSource pm1 = initRegistSource(hospital,department,doctor,dateString, "pm", 10.0, "普通门诊", 20, 20);
			RegistSource pm2 = initRegistSource(hospital,department,doctor,dateString, "pm", 20.0, "专家门诊", 10, 10);
			RegistSource pm3 = initRegistSource(hospital,department,doctor,dateString, "pm", 100.0, "特需门诊", 10, 10);
			list.add(am1);list.add(am2);list.add(am3);
			list.add(pm1);list.add(pm2);list.add(pm3);
			return list;
		}
		if("0".equals(reqType)){//预约挂号
			for (int i = 0; i < 7; i++) {
				date = DateUtils.addDays(date, 1);
				String nextDate = sdf.format(date);
				if (i == 1) {// 第二天的弄成黄的
					RegistSource am1 = initRegistSource(hospital,department,doctor,nextDate, "am", 10.0, "普通门诊", 20, 0);
					RegistSource am2 = initRegistSource(hospital,department,doctor,nextDate, "am", 20.0, "专家门诊", 10, 0);
					RegistSource am3 = initRegistSource(hospital,department,doctor,nextDate, "am", 100.0, "特需门诊", 10, 0);
					RegistSource pm1 = initRegistSource(hospital,department,doctor,nextDate, "pm", 10.0, "普通门诊", 20, 0);
					RegistSource pm2 = initRegistSource(hospital,department,doctor,nextDate, "pm", 20.0, "专家门诊", 10, 0);
					RegistSource pm3 = initRegistSource(hospital,department,doctor,nextDate, "pm", 100.0, "特需门诊", 10, 0);
					list.add(am1);list.add(am2);list.add(am3);
					list.add(pm1);list.add(pm2);list.add(pm3);
				} else {
					RegistSource am1 = initRegistSource(hospital,department,doctor,nextDate, "am", 10.0, "普通门诊", 20, 10);
					RegistSource am2 = initRegistSource(hospital,department,doctor,nextDate, "am", 20.0, "专家门诊", 10, 4);
					RegistSource am3 = initRegistSource(hospital,department,doctor,nextDate, "am", 100.0, "特需门诊", 10, 3);
					RegistSource pm1 = initRegistSource(hospital,department,doctor,nextDate, "pm", 10.0, "普通门诊", 20, 20);
					RegistSource pm2 = initRegistSource(hospital,department,doctor,nextDate, "pm", 20.0, "专家门诊", 10, 10);
					RegistSource pm3 = initRegistSource(hospital,department,doctor,nextDate, "pm", 100.0, "特需门诊", 10, 10);
					list.add(am1);list.add(am2);list.add(am3);
					list.add(pm1);list.add(pm2);list.add(pm3);
				}
			}
		}else if("1".equals(reqType)){//实时挂号
			String currDate = sdf.format(date);
			RegistSource am1 = initRegistSource(hospital,department,doctor,currDate, "am", 10.0, "普通门诊", 20, 10);
			RegistSource am2 = initRegistSource(hospital,department,doctor,currDate, "am", 20.0, "专家门诊", 10, 4);
			RegistSource am3 = initRegistSource(hospital,department,doctor,currDate, "am", 100.0, "特需门诊", 10, 3);
			RegistSource pm1 = initRegistSource(hospital,department,doctor,currDate, "pm", 10.0, "普通门诊", 20, 20);
			RegistSource pm2 = initRegistSource(hospital,department,doctor,currDate, "pm", 20.0, "专家门诊", 10, 10);
			RegistSource pm3 = initRegistSource(hospital,department,doctor,currDate, "pm", 100.0, "特需门诊", 10, 10);
			list.add(am1);list.add(am2);list.add(am3);
			list.add(pm1);list.add(pm2);list.add(pm3);
		}
		return list;
	}
	private Treatment createTreatByRegSource(RegistSource aSource){
		Treatment treatment = new Treatment();
		treatment.setIdHlht(new UUID().generate().toString());
		treatment.setCreateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setStartTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setDepartmentId(aSource.getDepartment());
		treatment.setDepartmentName(aSource.getDepartmentName());
		treatment.setHospitalId(aSource.getHospital());
		treatment.setHospitalName(aSource.getHospitalName());
		treatment.setPatientId(aSource.getPatient());
		treatment.setPatientName(aSource.getPatientName());
		treatment.setPatientHlht(aSource.getPatientHlht());//TODO 其他的标志
		treatment.setStatus("0");//进行中
		treatment.setType("0");//门诊
		treatment.setCardNo(aSource.getCardNo());
		treatment.setCardType(aSource.getCardType());
		//private String doctorId;//主治医生
		//private String doctorName;//主治医生
		treatment.setAppUser(aSource.getOptAccount());
		treatment.setNotification("预约挂号成功");
		return treatment;
	}
	private RegisterVom createRegByRegSource(RegistSource aSource){
		//private String takeNoTime;//取号时间 取号码时获取
		//private String no;//号码取号码时获取
		//private String idHlht;//换号以后获取
		Date now = new Date();
		RegisterVom registerVom = new RegisterVom();
		registerVom.setTakeNoTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setNo(""+(regNo++));
		UUID uu = new UUID();  
		registerVom.setRegdate(aSource.getDate());
		registerVom.setIdHlht(uu.generate().toString());
		registerVom.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setHospitalId(aSource.getHospital());
		registerVom.setHospitalName(aSource.getHospitalName());
		registerVom.setPatientId(aSource.getPatient());
		registerVom.setPatientName(aSource.getPatientName());
		registerVom.setName("预约挂号");
		registerVom.setBiz("register");//业务类别 分组排序时使用
		registerVom.setBizName("挂号");//业务类别名称
		registerVom.setDescription("预约挂号成功");;//描述
		//registerVom.setNotification("预约挂号成功");
		registerVom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setNeedPay(false);
		registerVom.setPayed(false);
		registerVom.setStatus("0");//状态 未完成 已完成
		registerVom.setAppointNo(aSource.getAppointNo());//预约码 预约挂号换号时用
		registerVom.setCardNo(aSource.getCardNo());
		registerVom.setCardType(aSource.getCardType());
		registerVom.setDepartmentId(aSource.getDepartment());
		registerVom.setDepartmentName(aSource.getDepartmentName());
		registerVom.setDoctorId(aSource.getDoctor());
		registerVom.setDoctorName(aSource.getDoctorName());
		registerVom.setDoctorId(aSource.getDoctor());
		registerVom.setRegisterTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//挂号时间 同创建时间 
		registerVom.setType("0");//预约
		registerVom.setAmount(aSource.getAmt());//收费金额
		registerVom.setRepeated(false);;//是否复诊
		registerVom.setOperator("elh");;//操作员
		registerVom.setReserved(true);//预约标志 1 预约 0 实时
		return registerVom;
	}
	private DiagnosisVom createDiagnosis(Treatment  treatment){
		Date now = new Date();
		DiagnosisVom vom = new DiagnosisVom();
		UUID uu = new UUID();  
		vom.setIdHlht(uu.generate().toString());
		vom.setTreatment(treatment.getIdHlht());
		vom.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setHospitalId(treatment.getHospitalId());
		vom.setHospitalName(treatment.getHospitalName());
		vom.setPatientId(treatment.getPatientId());
		vom.setPatientName(treatment.getPatientName());
		vom.setName("看诊");
		vom.setBiz("diagnosis");//业务类别 分组排序时使用
		vom.setBizName("看诊");//业务类别名称
		
		List<Doctor> doctors = doctorManager.findAll();
		if(doctors.size()>0){
			vom.setDoctorName(doctors.get(0).getName());//TODO 医生
			vom.setDoctorId(doctors.get(0).getIdHlht());
		}
		vom.setDescription("在"+vom.getDoctorName()+"医生处看诊");;//描述
		//vom.setNotification("在"+vom.getDoctorName()+"医生处看诊");
		vom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setNeedPay(false);
		vom.setPayed(false);
		vom.setStatus("0");//状态 未完成 已完成
		return vom;
	}
	private DrugOrderVom createDrugOrder(Treatment treatment){
		Date now = new Date();
		DrugOrderVom vom = new DrugOrderVom();
		UUID uu = new UUID();  
		vom.setIdHlht(uu.generate().toString());
		vom.setTreatment(treatment.getIdHlht());
		vom.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setHospitalId(treatment.getHospitalId());
		vom.setHospitalName(treatment.getHospitalName());
		vom.setPatientId(treatment.getPatientId());
		vom.setPatientName(treatment.getPatientName());
		vom.setName("取药单");
		vom.setBiz("drugOrder");//业务类别 分组排序时使用
		vom.setBizName("取药");//业务类别名称
		vom.setDescription("医生开药");//描述
		//vom.setNotification("请到收费处缴纳药费");
		vom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		vom.setNeedPay(false);
		vom.setPayed(false);
		vom.setStatus("0");//状态 未完成 已完成
		this.createDrugDetails(vom);
		return vom;
	}
	private void createDrugDetails(DrugOrderVom drugOrder){
		if(null == defaultDrugs)this.initDrugs();
		List<DrugDetail> details = new ArrayList<DrugDetail>();
		Random rand = new Random();
	    List<Integer> drugIndexs = new ArrayList<Integer>();
		int detailCount = rand.nextInt(7)+3;
		while(drugIndexs.size() < detailCount){
			Integer index = rand.nextInt(defaultDrugs.size());
			boolean has = false;
			for(Integer i : drugIndexs){
				if(i.equals(index)){
					has = true;
				}
			}
			if(!has)drugIndexs.add(index);
	    }
		Double total = 0.0;
		for(Integer i : drugIndexs){
			int drugCount = rand.nextInt(10)+1;
			DrugDetail detail =defaultDrugs.get(i); 
			detail.setIdHlht( new UUID().generate().toString());//医院数据唯一标志
			detail.setNum(drugCount);//数量
			detail.setAmount(drugCount*detail.getPrice());
			detail.setDrugOrder(drugOrder.getIdHlht());//取药单号
			details.add(detail);
			System.out.println("添加药品"+detail.getName());
			total+=detail.getAmount();
		}
		drugOrder.setAmount(total);
		drugOrder.setDetails(details);
	}
	private List<DrugDetail> defaultDrugs;
	@SuppressWarnings("deprecation")
	private void initDrugs(){//待选药品
		Date now = new Date();
		now.setYear(now.getYear()+1);
		defaultDrugs = new ArrayList<DrugDetail>();
		DrugDetail detail = new DrugDetail();
		detail.setName("参苓白术丸");//药品名称
		detail.setPrice(7.48 );//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("6g*10袋 ");//规格
		detail.setDosage("2片");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("袋 ");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("复方板兰根颗粒");//药品名称
		detail.setPrice(3.85);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("15g*20");//规格
		detail.setDosage("1袋");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("袋 ");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("急支糖浆");//药品名称
		detail.setPrice(12.38);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("200ml");//规格
		detail.setDosage("15ml");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("瓶");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("马应龙麝香痔疮膏");//药品名称
		detail.setPrice(15.25);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("2.5g*5支");//规格
		detail.setDosage("1支");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("胃苏颗粒");//药品名称
		detail.setPrice(10.21);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("5g*3袋");//规格
		detail.setDosage("1袋");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("锡类散");//药品名称
		detail.setPrice(5.35);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("1.5g");//规格
		detail.setDosage("1.5g");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("速效救心丸");//药品名称
		detail.setPrice(17.83);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("40mg*100s");//规格
		detail.setDosage("1粒");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("三七片");//药品名称
		detail.setPrice(0.81);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("0.25g*20s");//规格
		detail.setDosage("2片");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("袋");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("龙牡壮骨颗粒");//药品名称
		detail.setPrice(26.70);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("5g*40袋");//规格
		detail.setDosage("1袋");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("双黄连口服液");//药品名称
		detail.setPrice(17.9);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("10ml*10支*50盒");//规格
		detail.setDosage("1支");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("盒");//单位
		defaultDrugs.add(detail);
		
		detail = new DrugDetail();
		detail.setName("含笑半步癫");//药品名称
		detail.setPrice(2.9);//单价
		detail.setType("1");//药品类别
		detail.setPrescribed("1");//是否处方
		detail.setSpec("20g*包");//规格
		detail.setDosage("1包");//剂量
		detail.setExpira_date(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//有效期
		detail.setUnit("包");//单位
		defaultDrugs.add(detail);
		
	}
	private List<CheckDetail> getCheckDetails(String[][] reports){
		List<CheckDetail> list = new ArrayList<CheckDetail>();
		for(String[] report : reports){
			CheckDetail detail = new CheckDetail();
			detail.setSubject(report[1]);
			detail.setSubjectCode(report[0]);
			detail.setResult(report[2]);
			detail.setFlag("+");
			detail.setUnit(report[3]);
			detail.setReference(report[4]);
			list.add(detail);
		}
		return list;
	}
	private String[][] reports1=new String[][]{
			{"WBC","自细胞(wBC)","10.97","10^9/L","4--10"},
			{"GRA%","中性粒细胞百分比(GRA%)","51.01","%","50--70"},
			{"LYM%","淋巴细胞比率(LYM %)","39.21","%","20--40"},
			{"MON%","单个核细胞百分比(MON%)","5.55","%","3--10"},
			{"E0%","嗜酸性细胞","4.02","%","0.5--5"},
			{"BA%","嗜碱性细胞","0.21","%","0--1"},
			{"GRA#","中性粒细胞计数(GRA#)","5.60","10^9/L","2--7"},
			{"LYM#","淋巴细胞计数(LYM)","4.30","10^9/L","0.8--4"},
			{"MON#","单个核细胞计数(MON#)","0.61","10^9/L","0.1--1"},
			{"EO#","嗜酸性细胞计数","0.44","10^9/L","0--0.5"},
			{"BA#","嗜碱性细胞计数","0.02","10^9/L","0--1"},
			{"RBC","红细胞(RBC)","4.82","10^12/L","4.09--5.74"},
			{"HGB","血红蛋白(HGB)","151.60","g/L","131--172"},
			{"HCT","红细胞压积(HCT)","0.46","L/L","0.38--0.508"},
			{"MCV","平均红细胞体积(MCV)","95.55","fL","83.9--99.1"},
			{"MCH","平均血＿红蛋白含量(MCH)","31.45","pg","27.8--33.8"},
			{"MCHC","平均血红蛋白浓度(MClHC)","329.10","g/L","320--355"},
			{"RDW","红细胞平均宽度(RDW)","12.99","%","11--16.5"},
			{"NRBC#","有核红细胞绝对值","0.00","10^9/L",""},
			{"NRBC%","有核红细胞百分比(NRBC%)","0.00","%",""},
			{"PLT","血小板计数(PIT)","269.20","10^9/L","85--303"},
			{"PCT","血小板压积(PCI)","0.23","%","0.16--0.43"},
			{"MPV","平均血小板体积(MPV) 1","8.55","fL","8--10"},
			{"pDW","址小板分布宽度(pDW)","15.9 4","fL","12--16.5"},
	};
	private String[][] reports2=new String[][]{
			{"WBC","白细胞(uL)","10.97","uL ","0--25"},
			{"WBC","红细胞(uL)","10.97","uL ","0--25"},
			{"WBC","上皮细胞 ","10.97","uL ","0--20"},
			{"WBC","管型	1.11","10.97","uL ","0--300"},
			{"WBC","细菌 ","	0.90","uL ","0--5"},
			{"WBC","白细胞(HPF)","3.85","HPF","0--5"},
			{"WBC","红细胞(HPF)","0.540","HPF","0--4.5"},
			{"WBC","上皮细胞(HPF)","O.670","HPF","0--5"},
			{"WBC","管型(LPF)","3.22","LPF",""},
			{"WBC","细菌(HPr)","0.160","HPF",""},
			{"WBC","病理管型 ","0.55","uL ",""},
			{"WBC","结晶数量 ","0","uL ",""},
			{"WBC","小圆上皮细胞","1.61","uL ",""},
			{"WBC","类酵母细胞","0","uL ",""},
			{"WBC","其他数量","23. 70","uL ",""},
			{"WBC","非溶解红细胞计数 ","1. 90","uL ",""},
			{"WBC","非容解红细胞百分比 ","63.60","%  ",""},
			{"WBC","电导率分级","2级","",""},
			{"WBC","尿-电导率","7.80","mS/cm",""},
			{"WBC","沉渣总粒子数","2590","",""},
			{"WBC","细菌总粒子敛 ","1382","",""},
	};
	private String[][] reports3=new String[][]{
			{"TP","总蛋向 ","S2.20","g/L","65--85"},
			{"ALB","自蛋向 ","25.00","g/L","40--55"},
			{"GLB","球蛋白 ","27.20","g/L","20--40"},
			{"A/G","白球比 ","0.92","","1.2--2.4"},
			{"ALT","谷丙转氨酶","34.80","U/L","0--10"},
			{"AST","谷草转氨酶","35.20","U/L","0--40"},
			{"ST/L","谷草/谷丙","1.00","","0--3"},
			{"TBTL","总胆红素","78.40","umoL/L","5--21"},
			{"DBTL","直接胆红素","40.60","umol/L","0--6.8"},
			{"IBIL","间接胆红素","37.80","umol/L","0--17"},
			{"ALP","碱性磷酸酶","466","U/L","45--125"},
			{"GGT","谷氨酰氨转移酶  ","378.60","U/L","10--60"},
			{"CHE","胆碱脂酶","1133.00","U/L","4000--13000"},
			{"TBA","总胆汁酸","18.60","umol/L","0--15"},
			{"GLU","葡萄糖 ","5.9","mmol/L","3.9--6.1"},
			{"UREA","尿素","5.63","mmol/L","2.2--7.2"},
			{"Crc","肌酣	","49.10","umollL","59--104"},
			{"UA","尿酸","208.90","umolll","208--428"},
			{"CHO","胆固醇 ","3.78","mmol/L","0--5.17"},
			{"TG","甘油三酯","1.32","mmol/L","0.18--1.82"},
			{"HDL","高密度脂蛋白","1.06","mmol/L","O.78--2.2"},
			{"LDL","低密皮脂蛋白","3.20","mmol/L","0--3.36"},
			{"APOA","载脂蛋向Al","0.38","g/L","1--2"},
			{"APOB","载脂蛋向B","0.96","g/L","0.44-1.77"},
			{"LOll","乳酸脱氢嘀    ","325.50","U/L","109--215"},
			{"PA","前白蛋白","102.80","mg/L","200--400"},
			{"CysC","胱抑素C","1.15","mg/L","0--1.02"},
			{"MAO","血清单胺氧化酶测定 ","9.90","IU/L","0--12"},
			
	};
	/*****************************一下是初始化就医数据用 test*****************************************************************/
	
	
//	@RequestMapping(value="/initMedical",method = RequestMethod.GET, produces = MediaTypes.JSON)
//	public void initMedical(HttpServletRequest request){
//		System.out.println("initMedical");
//		CrateData1 createData1 = new CrateData1();
//		createData1.create();
//	}
//	@RequestMapping(value="/createInpatient",method = RequestMethod.GET, produces = MediaTypes.JSON)
//	public void createInpatient(){
//		String patient ""402881e54da98545014da99f47330000";
//		String hospital = "8a81a7db4dad2271014dad2271e20001";
//		String department = "8a81a7db4dadd943014dadd943920007";
//		//String card = "8a81a7db4daca58d014dacc4cbe50000";
//		
//		String cardNo = "8a81a7db4daca58d014dacc4cbe50000";
//		String cardType = "8a81a7db4daca58d014dacc4cbe50000";
//		Date now = new Date();
//		System.out.println("createTreatment");
//		Treatment treatment = new Treatment();		
//		treatment.setCardNo(cardNo);
//		treatment.setCardNo(cardType);
//		treatment.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//		treatment.setDepartmentId(department);
//		treatment.setHospitalId(hospital);
//		//treatment.setMedcialResult("");
//		treatment.setDoctorId("8a81a7db4dae02b0014dae02b0960004");
//		treatment.setPatientId(patient);
//		treatment.setStatus("0");//进行中
//		treatment.setType("1");//门诊
//		 this.treatmentManager.save(treatment);
//	}
//	class CrateData1{
//		private Date now = new Date();
//		@SuppressWarnings("deprecation")
//		private void nextHour(){
//			now.setHours(now.getHours()+1);
//		}
//		@SuppressWarnings("deprecation")
//		private void nextHarfHour(){
//			now.setMinutes(now.getMinutes()+30);
//		}
//		/*@SuppressWarnings("deprecation")
//		private void nextMin(){
//			now.setMinutes(now.getMinutes()+1);
//		}*/
//		String patient="";
//		String hospital="";
//		String department="";
//		String cardNo = "6226330877171";
//		String cardType = "1";
//		public void create(){
//			
//			patient = "402881e54da9651a014da9674e1e0000";
//			hospital = "8a81a7db4dad2271014dad2271e20001";
//			department = "8a81a7db4dadd943014dadd943920004";
//			//card = "402881e54da9651a014da97203e20006";
//			cardNo = "6226330877171";
//			cardType = "1";
//			
//			System.out.println("挂号");
//			Treatment treatment = this.createTreatment();
//			Register register= this.createRegister(treatment);
//			Charge charge = chargeManager.findOne("from Charge where bizId = ?0",register.getId());
//			String orderId = orderManager.get(charge.getOrderId()).getId();
//			
//			
//			System.out.println("支付挂号费");//半小时支付挂号费
//			this.nextHarfHour();
//			Order order = this.payOrder(orderId);
//			
//			
//			System.out.println("就医");//就医 加上医生
//			this.nextHarfHour();
//			this.seeDoctor(treatment);
//			
//			
//			//一小时后进行检查申请
//			System.out.println("检查申请");
//			this.nextHour();
//			List<MedicalCheck> checks = this.createChecks(treatment);
//			
//			
//			Charge checkCharge = chargeManager.findOne("from Charge where bizId = ?0",checks.get(0).getId());
////			//半小时后
//			System.out.println("支付检查申请");
//			this.nextHarfHour();
//			String checkOrderId = orderManager.get(checkCharge.getOrderId()).getId();
//			Order checkOorder = this.payOrder(checkOrderId);
//			
//			
////			//两小时后获取检查结果
//			System.out.println("获取检查结果");
//			this.nextHour();
//			this.nextHour();
//			this.getCheckResult1(checks.get(0));
//			this.getCheckResult2(checks.get(1));
//			this.getCheckResult2(checks.get(2));
//		}
//		public Treatment createTreatment(){
//			System.out.println("createTreatment");
//			Treatment treatment = new Treatment();		
//			treatment.setCardNo(cardNo);
//			treatment.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatment.setDepartmentId(department);
//			treatment.setHospitalId(hospital);
//			//treatment.setMedcialResult("");
//			treatment.setPatientId(patient);
//			treatment.setStatus("0");//进行中
//			treatment.setType("0");//门诊
//			return treatmentManager.save(treatment);
//		}
//		public Register createRegister(Treatment treatment ){//暂时不考虑换号动作
//			System.out.println("createRegister");
//			Register register = new Register();
//			TreatDetail detail = new TreatDetail();
//			detail.setPatientId(treatment.getPatientId());//就诊人
//			
//			detail.setName("预约挂号");//名称
//			detail.setBizName("挂号");
//			detail.setDescription("在线预约挂号");//简述
//			//register.setNotification("请于"+(now.getMonth()+1)+"月"+now.getDate()+"日在医院窗口换号");//提醒
//			
//			detail.setBiz("register");//类别
//			detail.setTreatment(treatment.getId());//所属就医记录		
//			
//			detail.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//创建时间
//			detail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			detail.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//开始时间
//			detail.setStatus("0");//状态 未完成 已完成
//			
//			register.setNo("0038");//号码
//			register.setRegisterTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//挂号时间
//			Department dept = departmentManager.get(treatment.getDepartmentId());
//			//register.setDoctor("");//挂号医生
//			register.setType("0");//挂号类别
//			register.setAmount(20.00);//收费金额
//			//register.setStatus("0");//状态 重复
//			//register.setReserved("1");//预约标志
//			detail =  treatDetailManager.save(detail);
//			register.setId(detail.getId());
//			register =  registerManager.save(register);
//			//订单
//			Order order = new Order();
//			order.setTreatmentId(treatment.getId());
//			order.setOrderNo(DateUtils.date2String(now, "yyyyMMddHHmmss"));
//			order.setPatientId(treatment.getPatientId());
//			order.setHospitalId(treatment.getHospitalId());//就诊医院
////			order.setDepartment(treatment.getDepartmentId());//所属科室
//			order.setStatus("0");
//			order.setAmount(20.00);
//			order.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			//order.setPayTime(DateUtil.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order.setDescription("");
//			
//			//order.setType(type);
//			order = orderManager.save(order);
//			//收费项目
//			Charge charge = new Charge();
//			charge.setReceiveAmount(20.00);//应收
//			charge.setRealAmount(20.00);//实收
//			charge.setStatus("0");// 0 未交费
//			charge.setPatient(treatment.getPatientId());
//			charge.setBizId(register.getId());
//			charge.setBizSource("register");
//			charge.setTreatdetail(register.getId());
//			charge.setTreatment(treatment.getId());
//			//charge.setType(bizId);
//			//charge.setPricePer();
//			//charge.setChargePer();
//			//charge.setOrderPer();
//			charge.setComment(dept.getName()+"挂号费");
//			charge.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			charge.setOccurTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			//charge.setRegTime();
//			//charge.setPayTime(DateUtil.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			charge.setOrderNo(order.getOrderNo());
//			charge.setOrderId(order.getId());
//			chargeManager.save(charge);
//			treatment.setNotification("您有订单未支付");
//			treatmentManager.save(treatment);
//			return register;
//			
//		}
//		public Order payOrder(String orderId){
//			Order order  = orderManager.get(orderId);
//			System.out.println("支付订单 ： " + order.getOrderNo());
//			//修改order状态
//			order.setStatus("1");
//			//TODO 用当前时间
//			order.setPayTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order =  orderManager.save(order);
//			chargeManager.executeSql("update ELH_CHARGE SET STATUS='1' WHERE ORDER_ID =?0",order.getId());
//			List<Charge> charges = chargeManager.find("from Charge where  orderId = ?0",order.getId()); 
//			
//			//获取就医明细并分类
//			Map<String,List<TreatDetail>> bizMap =  new HashMap<String,List<TreatDetail>>();
//			for(Charge charge : charges){
//				TreatDetail td = treatDetailManager.get(charge.getBizId());
//				String type = td.getBiz();
//				List<TreatDetail> tds = bizMap.get(type);
//				if(null==tds){
//					tds = new ArrayList<TreatDetail>();
//					bizMap.put(type, tds);
//				}
//				tds.add(td);
//			}
//			//业务操作
//			Set<String> set = bizMap.keySet();
//			for(String key:set){
//				List<TreatDetail> tds = bizMap.get(key);
//				if("register".equals(key)){
//					for(TreatDetail td : tds){
//						this.doRegister(order,td);
//					}
//				}else if("medicalCheck".equals(key)){
//					this.payCheck(order,tds); 
//				}else if("drug".equals(key)){
//					
//				}else if("cure".equals(key)){
//					
//				}
//			}
//			return order;
//		}
//		public TreatDetail doRegister(Order order ,TreatDetail item){
//			//修改挂号状态
//			item.setEndTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			item.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			item.setStatus("1");//状态 未完成 已完成
//			item.setDescription(item.getDescription()+"成功");
//			item = treatDetailManager.save(item);
//			//分诊//分诊表 看诊表
//			Treatment treatment = treatmentManager.get(item.getTreatment());
//			treatment.setNotification("已支付挂号费："+order.getAmount());
//			treatmentManager.save(treatment);
//			return item;
//		}
//		public List<MedicalCheck> payCheck(Order order ,List<TreatDetail> tds){
//			System.out.println("---payCheck");
//			StringBuffer ids = new StringBuffer();
//			for(int i=0;i<tds.size();i++){
//				if(i!=0)ids.append(",");
//				ids.append("'").append(tds.get(i).getId()).append("'");
//			}
//			System.out.println("---findcheck");
//			List<MedicalCheck> checks = medicalCheckManager.find("from MedicalCheck where id in ("+ids+")");
//			List<MedicalCheck> checksSaved = new ArrayList<MedicalCheck>();
//			for(MedicalCheck check : checks){
//				TreatDetail detail = treatDetailManager.get(check.getId());
//				detail.setStatus("1");//已支付
//				detail.setDescription(check.getSubject()+"检查费支付成功");
//				detail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//				treatDetailManager.save(detail);
//				checksSaved.add(check);
//			}
//			System.out.println("---get treatment");
//			Treatment treatment = treatmentManager.get(order.getTreatmentId());
//			System.out.println("---set treatment");
//			treatment.setNotification("已支付检查费："+order.getAmount());
//			treatment = treatmentManager.save(treatment);
//			System.out.println("---save treatment : " + treatment.getNotification());
//			return checksSaved;
//		}
//		public Diagnosis seeDoctor(Treatment treatment){
//			//插入看诊表
//			Doctor doctor = doctorManager.get("8a81a7db4dae02b0014dae02b0960001");
//			System.out.println("create diagnosis");
//			Diagnosis diagnosis = new Diagnosis();
//			TreatDetail detail = new TreatDetail();
//			detail.setPatientId(treatment.getPatientId());//就诊人
//			
//			//diagnosis.setName("看诊");//名称
//			detail.setBizName("看诊");
//			detail.setDescription("在"+doctor.getName()+" ["+doctor.getJobTitle()+"] 处看诊");//简述
//			//register.setNotification("请于"+(now.getMonth()+1)+"月"+now.getDate()+"日在医院窗口换号");//提醒
//			
//			detail.setBiz("diagnosis");//类别
//			detail.setTreatment(treatment.getId());//所属就医记录		
//			
//			detail.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//创建时间
//			detail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			detail.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//开始时间
//			detail.setStatus("1");//状态 未完成 已完成
//			diagnosis.setDoctorId(doctor.getId());
//			detail = treatDetailManager.save(detail);
//			diagnosis.setId(detail.getId());
//			diagnosis = diagnosisManager.save(diagnosis);
//			treatment.setNotification("在"+doctor.getName()+"["+doctor.getJobTitle()+"]处看诊");
//			treatment.setDoctorId("8a81a7db4dae02b0014dae02b0960001");
//			treatmentManager.save(treatment);
//			return diagnosis;
//			
//		}
//		public List<MedicalCheck> getChecks(){//TODO 
//			List<MedicalCheck> checks = new ArrayList<MedicalCheck>();
//			MedicalCheck check1 = new MedicalCheck();
//			TreatDetail detail1 = new TreatDetail();
//			check1.setCaseNo("156196");
//			check1.setBedNo("18");
//			detail1.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			detail1.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check1.setOptDoctor("8a81a7db4dae02b0014dae02b0960005");
//			check1.setSubject("血细胞分析");
//			check1.setSpecimen("血清");
//			check1.setSpecimenNo("100");
//			check1.setOperator("韩奎文");
//			check1.setAudit("苏丽娟");
//			check1.setMachine("贝克曼AU2700");
//			check1.setDiagnosis("无明显异常");
//			check1.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check1.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			checks.add(check1);
//			
//			
//			MedicalCheck check2 = new MedicalCheck();
//			TreatDetail detail2 = new TreatDetail();
//			check2.setCaseNo("156197");
//			check2.setBedNo("19");
//			detail2.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			detail2.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check2.setOptDoctor("8a81a7db4dae02b0014dae02b0960002");
//			check2.setSubject("尿常规");
//			check2.setSpecimen("尿液");
//			check2.setSpecimenNo("101");
//			check2.setOperator("徐彤");
//			check2.setAudit("杨静波");
//			check2.setMachine("希森美康UF100，迪瑞H800");
//			check2.setDiagnosis("无明显异常");
//			check2.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check2.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			checks.add(check2);
//
//			MedicalCheck check3 = new MedicalCheck();
//			TreatDetail detail3 = new TreatDetail();
//			check3.setCaseNo("156198");
//			check3.setBedNo("20");
//			detail3.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			detail3.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check3.setOptDoctor("8a81a7db4dae02b0014dae02b0960002");
//			check3.setSubject("肝功");
//			check3.setSpecimen("血清");
//			check3.setSpecimenNo("102");
//			check3.setOperator("张松岩");
//			check3.setAudit("李萍");
//			check3.setMachine("贝克曼AU2700");
//			check3.setDiagnosis("无明显异常");
//			check3.setCheckTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check3.setSubmitTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			checks.add(check3);
//			//check1.setReportTime(DateUtil.date2String(now, "yyyy-MM-dd HH:mm:ss"));
////			MedicalCheck check2 = new MedicalCheck();
//			
////			checks.add(check2);
//			return checks;
//		}
//		public List<MedicalCheck> createChecks(Treatment treatment ){
//			Random rand = new Random();
//			
//			//获取检查项
//			List<MedicalCheck> checks  = this.getChecks();
//			List<Charge> charges  = new ArrayList<Charge>();
//			Order order = new Order();
//			double totalAmt=0;
//			
//			
//			order.setTreatmentId(treatment.getId());
//			order.setOrderNo(DateUtils.date2String(now, "yyyyMMddHHmmss"));
//			order.setPatientId(this.patient);
//			order.setHospitalId(this.hospital);//就诊医院
////			order.setDepartment(this.department);//所属科室
//			order.setStatus("0");
//			order.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			//order.setPayTime(DateUtil.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			order.setDescription("");
//			
//			for(MedicalCheck check : checks){
//				TreatDetail detail = new TreatDetail();
//				detail.setPatientId(treatment.getPatientId());//就诊人
//				detail.setName("检查");//名称
//				detail.setBizName("检查");
//				detail.setDescription(check.getSubject()+"(检查)");//简述
//				detail.setBiz("medicalCheck");//类别
//				detail.setTreatment(treatment.getId());//所属就医记录		
//				detail.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//创建时间
//				detail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//				detail.setStartTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));//开始时间
//				detail.setStatus("0");//状态 0未支付未完成 1 已支付未完成 2已支付已完成 ；
//				check.setDepartment(treatment.getDepartmentId());
//				detail.setPatientId(treatment.getPatientId());
//				//check.setHospital(treatment.getHospitalId());
//				treatDetailManager.save(detail);
//				check.setId(detail.getId());
//				medicalCheckManager.save(check);
//				//获取收费项目
//				Double randNum = rand.nextInt(100)+100.00;
//				totalAmt+=randNum;
//				Charge charge = new Charge();
//				charge.setReceiveAmount(randNum);//应收
//				charge.setRealAmount(randNum);//实收
//				charge.setStatus("0");// 0 未交费
//				charge.setPatient(this.patient);
//				charge.setBizId(check.getId());
//				charge.setBizSource("medicalCheck");
//				charge.setComment(check.getSubject()+"(检查费)");
//				charge.setTreatdetail(check.getId());
//				charge.setTreatment(treatment.getId());
//				charge.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//				charge.setOccurTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//				charge.setBizId(check.getId());
//				charge.setOrderNo(order.getOrderNo());
//				charges.add(charge);
//			}
//			order.setAmount(totalAmt);
//			orderManager.save(order);
//			for(Charge charge : charges){
//				charge.setOrderId(order.getId());
//				chargeManager.save(charge);
//			}
//			treatment.setNotification("您有订单未支付");
//			treatmentManager.save(treatment);
//			return checks;
//		}
//		public MedicalCheck getCheckResult1(MedicalCheck check ){
//			//修改检查项目状态
//			TreatDetail treatDetail = treatDetailManager.get(check.getId());
//			
//			//血细胞分析模板数据
//			List<CheckDetail> models = checkDetailManager.find("from CheckDetail where checkOrder = ?0", "402880f24dad006e014dad006e970000");
//			//落地检查明细
//			for(CheckDetail model : models){
//				CheckDetail checkDetail = new CheckDetail();
//				checkDetail.setCheckOrder(check.getId());
//				checkDetail.setSubject(model.getSubject());
//				checkDetail.setSubjectCode(model.getSubjectCode());
//				checkDetail.setResult(model.getResult());
//				checkDetail.setFlag(model.getFlag());
//				checkDetail.setUnit(model.getUnit());
//				checkDetail.setReference(model.getReference());
//				checkDetailManager.save(checkDetail);
//			}
//			treatDetail.setStatus("2");
//			treatDetail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check.setReportTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetail.setEndTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetailManager.save(treatDetail);
//			check = medicalCheckManager.save(check);
//			return check;
//		}
//		public MedicalCheck getCheckResult2(MedicalCheck check ){
//			//修改检查项目状态
//			TreatDetail treatDetail = treatDetailManager.get(check.getId());
//			treatDetail.setStatus("2");
//			treatDetail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check.setReportTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetail.setEndTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetail.setMedicalResult("检查无明显异常！");
//			
//			//修改检查项目状态
//			
//			
//			//尿常规检查末班
//			List<CheckDetail> models = checkDetailManager.find("from CheckDetail where checkOrder = ?0", "402880f24dad006e014dad006e970001");
//			//落地检查明细
//			for(CheckDetail model : models){
//				CheckDetail checkDetail = new CheckDetail();
//				checkDetail.setCheckOrder(check.getId());
//				checkDetail.setSubject(model.getSubject());
//				checkDetail.setSubjectCode(model.getSubjectCode());
//				checkDetail.setResult(model.getResult());
//				checkDetail.setFlag(model.getFlag());
//				checkDetail.setUnit(model.getUnit());
//				checkDetail.setReference(model.getReference());
//				checkDetailManager.save(checkDetail);
//			}
//			treatDetailManager.save(treatDetail);
//			check = medicalCheckManager.save(check);
//			//落地检查明细
//			return check;
//		}
//		public MedicalCheck getCheckResult3(MedicalCheck check ){
//			//修改检查项目状态
//			TreatDetail treatDetail = treatDetailManager.get(check.getId());
//			treatDetail.setStatus("2");
//			treatDetail.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			check.setReportTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetail.setEndTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
//			treatDetail.setMedicalResult("检查无明显异常！");
//			
//			//修改检查项目状态
//			
//			
//			//血细胞分析
//			List<CheckDetail> models = checkDetailManager.find("from CheckDetail where checkOrder = ?0", "402880f24dad006e014dad006e970002");
//			//落地检查明细
//			for(CheckDetail model : models){
//				CheckDetail checkDetail = new CheckDetail();
//				checkDetail.setCheckOrder(check.getId());
//				checkDetail.setSubject(model.getSubject());
//				checkDetail.setSubjectCode(model.getSubjectCode());
//				checkDetail.setResult(model.getResult());
//				checkDetail.setFlag(model.getFlag());
//				checkDetail.setUnit(model.getUnit());
//				checkDetail.setReference(model.getReference());
//				checkDetailManager.save(checkDetail);
//			}
//			treatDetailManager.save(treatDetail);
//			check = medicalCheckManager.save(check);
//			//落地检查明细
//			return check;
//		}
//	}
	
	
	public static class UUID {	
		/*public static void main(String[] args) {
			// TODO Auto-generated method stub
			UUID uu = new UUID();  
			  
			for (int i = 0; i < 15; i++) {  
			      
			    System.out.println(uu.generate().toString());  
			      
			}  

		}*/
		public String uuid(){
			return this.generate().toString();
		} 
		 private static final int IP;  
		 public static int IptoInt( byte[] bytes ) {  
		     int result = 0;  
		     for (int i=0; i<4; i++) {  
		         result = ( result << 8 ) - Byte.MIN_VALUE + (int) bytes[i];  
		     }  
		     return result;  
		 }  
		 static {  
		     int ipadd;  
		     try {  
		         ipadd = IptoInt( InetAddress.getLocalHost().getAddress() );  
		     }  
		     catch (Exception e) {  
		         ipadd = 0;  
		     }  
		     IP = ipadd;  
		 }  
		 private static short counter = (short) 0;  
		 private static final int JVM = (int) ( System.currentTimeMillis() >>> 8 );  
		 
		 public UUID() {  
		 }  
		 
		 /** 
		  * Unique across JVMs on this machine (unless they load this class 
		  * in the same quater second - very unlikely) 
		  */  
		 protected int getJVM() {  
		     return JVM;  
		 }  
		 
		 /** 
		  * Unique in a millisecond for this JVM instance (unless there 
		  * are > Short.MAX_VALUE instances created in a millisecond) 
		  */  
		 protected short getCount() {  
		     synchronized(UUID.class) {  
		         if (counter<0) counter=0;  
		         return counter++;  
		     }  
		 }  
		 
		 /** 
		  * Unique in a local network 
		  */  
		 protected int getIP() {  
		     return IP;  
		 }  
		 
		 /** 
		  * Unique down to millisecond 
		  */  
		 protected short getHiTime() {  
		     return (short) ( System.currentTimeMillis() >>> 32 );  
		 }  
		 protected int getLoTime() {  
		     return (int) System.currentTimeMillis();  
		 }  
		 
		 private final static String sep = "";  
		 
		 protected String format(int intval) {  
		     String formatted = Integer.toHexString(intval);  
		     StringBuffer buf = new StringBuffer("00000000");  
		     buf.replace( 8-formatted.length(), 8, formatted );  
		     return buf.toString();  
		 }  
		 
		 protected String format(short shortval) {  
		     String formatted = Integer.toHexString(shortval);  
		     StringBuffer buf = new StringBuffer("0000");  
		     buf.replace( 4-formatted.length(), 4, formatted );  
		     return buf.toString();  
		 }  
		 
		 public Serializable generate() {  
		     return new StringBuffer(36)  
		     .append( format( getIP() ) ).append(sep)  
		     .append( format( getJVM() ) ).append(sep)  
		     .append( format( getHiTime() ) ).append(sep)  
		     .append( format( getLoTime() ) ).append(sep)  
		     .append( format( getCount() ) )  
		     .toString();  
		 }  
	}
}
