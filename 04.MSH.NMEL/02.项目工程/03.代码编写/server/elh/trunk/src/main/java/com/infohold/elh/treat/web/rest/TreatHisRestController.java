package com.infohold.elh.treat.web.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.Notice;
import com.infohold.el.base.service.NoticeService;
import com.infohold.elh.base.model.Department;
import com.infohold.elh.base.model.Doctor;
import com.infohold.elh.pay.model.Charge;
import com.infohold.elh.pay.model.Order;
import com.infohold.elh.treat.model.CheckDetail;
import com.infohold.elh.treat.model.Cure;
import com.infohold.elh.treat.model.Diagnosis;
import com.infohold.elh.treat.model.DrugDetail;
import com.infohold.elh.treat.model.DrugOrder;
import com.infohold.elh.treat.model.MedicalCheck;
import com.infohold.elh.treat.model.Register;
import com.infohold.elh.treat.model.TreatDetail;
import com.infohold.elh.treat.model.TreatDetailLog;
import com.infohold.elh.treat.model.Treatment;
import com.infohold.elh.treat.vom.ChargesTom;
import com.infohold.elh.treat.vom.ChecksTom;
import com.infohold.elh.treat.vom.CureVom;
import com.infohold.elh.treat.vom.DiagnosisVom;
import com.infohold.elh.treat.vom.DrugOrderVom;
import com.infohold.elh.treat.vom.MedicalCheckVom;
import com.infohold.elh.treat.vom.RegisterVom;
import com.infohold.elh.treat.vom.TreatmentAndRegister;


/**
 * 就医接口<br>
 * 负责就医过程中被医院调用
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/his")
public class TreatHisRestController extends BaseRestController  {
	@Autowired
	private NoticeService noticeService;
	@Autowired
	private GenericManager<Notice, String> noticeManager;
	
	@Autowired
	private GenericManager<TreatDetail, String> treatDetailManager;

	@Autowired
	private GenericManager<CheckDetail, String> checkDetailManager;
	
	@Autowired
	private GenericManager<Charge, String> chargeManager;
	
	@Autowired
	private GenericManager<Order, String> orderManager;

	@Autowired
	private GenericManager<DrugDetail, String> drugDetailManager;

	@Autowired
	private GenericManager<Register, String> registerManager;
	
	@Autowired
	private GenericManager<Diagnosis, String> diagnosisManager;
	
	@Autowired
	private GenericManager<Cure, String> cureManager;
	
	@Autowired
	private GenericManager<MedicalCheck, String> medicalCheckManager;

	@Autowired
	private GenericManager<DrugOrder, String> drugOrderManager;
	
	@Autowired
	private GenericManager<Treatment, String> treatmentManager;
	
	@Autowired
	private GenericManager<TreatDetailLog, String> treatDetailLogManager;
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	
	/**
	 * 创建就医记录，用于在患者现场挂号或者预约挂号后取号的场景 ?有问题 
	 * 可以在就医记录中冗余挂号信息，在创建时同事创建挂号记录信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/treatment/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateTreat(@RequestBody String data){
		TreatmentAndRegister hisTR =  JSONUtils.deserialize(data, TreatmentAndRegister.class);
		RegisterVom hisRegisterVom = hisTR.getRegister();
		Treatment hisTreatment = hisTR.getTreatment();
		String hospital = hisTreatment.getHospitalId();
		
		if(hisRegisterVom.isReserved()){//预约挂号
			List<Register> resisters = this.registerManager.find(
					"select reg from Register reg,TreatDetail td where reg.id=td.id and  reg.appointNo = ? and td.hospitalId =  ? AND reg.regDate = ? ",
					hisRegisterVom.getAppointNo(),hospital,hisRegisterVom.getRegDate());
			createTreatment(resisters, hisTreatment, hisRegisterVom);
		}else{ //实时挂号 逻辑同上
			List<Register> resisters = this.registerManager.find(
					"select reg from Register reg,TreatDetail td where reg.id=td.id and reg.no = ? and td.hospitalId =  ? AND reg.regDate = ? ",
					hisRegisterVom.getNo(),hospital,hospital,hisRegisterVom.getRegDate());
			createTreatment(resisters, hisTreatment, hisRegisterVom);
		}
		//如果
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 创建挂号数据 
	 * //该方法应该不会被使用 挂号信息在创建就医记录同时创建 
	 * @param data
	 * @return
	 */
	@Deprecated 
	@RequestMapping(value="/register/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateRegister(@RequestBody String data){
		//对data数据进行两次序列化，取出所有可用的值
		TreatDetail detail =  JSONUtils.deserialize(data, TreatDetail.class);
		Register register =  JSONUtils.deserialize(data, Register.class);
		//TODO 完整性校验与异常捕获
		String treatmentHisId = detail.getTreatment();
		List<Treatment> treatments = this.treatmentManager.find("from Treatment where idHlht = ? ", treatmentHisId);
		if(null == treatments || treatments.size() < 1){
			//异常 找不到相关就医记录
		}else if(treatments.size()>1){
			//异常 找到多条
		}
		detail.setTreatment(treatments.get(0).getId());
		detail = this.treatDetailManager.save(detail);
		register.setId(detail.getId());
		this.registerManager.save(register);
		
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		//完善数据
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 创建看诊记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/diagnosis/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateDiagnosis(@RequestBody String data){
		DiagnosisVom diagnosisVom =  JSONUtils.deserialize(data, DiagnosisVom.class);
		//TODO 完整性校验与异常捕获
		
		String treatmentHisId = diagnosisVom.getTreatment();
		List<Treatment> treatments = this.treatmentManager.find("from Treatment where idHlht = ? ", treatmentHisId);
		if(null == treatments || treatments.size() < 1){
			//异常 找不到相关就医记录
			throw new RuntimeException("创建看诊时找不到匹配的就诊记录");
		}else if(treatments.size()>1){
			//异常 找到多条
			throw new RuntimeException("创建看诊时找到多条匹配的就诊记录");
		}
		TreatDetail detail = diagnosisVom.getTreatDetail();
		detail.setTreatment(treatments.get(0).getId());
		detail.setNotification("正在"+diagnosisVom.getDoctorName()+"医生处看诊");
		detail = this.treatDetailManager.save(detail);
		Diagnosis diagnosis = diagnosisVom.getDiagnosis();
		diagnosis.setId(detail.getId());
		this.diagnosisManager.save(diagnosis);
		this.saveTreatDetailLog(detail,"创建看诊记录",treatments.get(0).getAppUser());
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		//完善数据
		List<Doctor> doctors = this.doctorManager.find("from Doctor where idHlht = ? ", diagnosisVom.getDoctorId());
		if(null != doctors && doctors.size()== 1){
			treatment.setDoctorId(doctors.get(0).getId());
		}
		treatment.setDoctorName(diagnosisVom.getDoctorName());
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 创建治疗记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/cure/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateCure(@RequestBody String data){
		CureVom cureVom =  JSONUtils.deserialize(data, CureVom.class);
		//TODO 完整性校验与异常捕获
		
		String treatmentHisId = cureVom.getTreatment();
		List<Treatment> treatments = this.treatmentManager.find("from Treatment where idHlht = ? ", treatmentHisId);
		if(null == treatments || treatments.size() < 1){
			//异常 找不到相关就医记录
			throw new RuntimeException("创建治疗记录时找不到匹配的就诊记录");
		}else if(treatments.size()>1){
			//异常 找到多条
			throw new RuntimeException("创建治疗记录时找到多条匹配的就诊记录");
		}
		TreatDetail detail = cureVom.getTreatDetail();
		detail.setTreatment(treatments.get(0).getId());
		detail.setNotification("进行"+cureVom.getSubject()+"治疗");
		detail = this.treatDetailManager.save(detail);
		Cure cure = cureVom.getCure();
		cure.setId(detail.getId());
		this.cureManager.save(cure);
		this.saveTreatDetailLog(detail,"创建治疗记录",treatments.get(0).getAppUser());
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		//完善数据
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 创建检查申请，多条
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/check/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateCheck(@RequestBody String data){
		ChecksTom tom =  JSONUtils.deserialize(data, ChecksTom.class);
		List<MedicalCheckVom> checks = tom.getChecks();
		Map<String,String> treatmentsMap = new HashMap<String,String>();
		for(MedicalCheckVom checkVom : checks){
			//TODO 完整性校验与异常捕获
			String treatmentHisId = checkVom.getTreatment();
			List<Treatment> treatments = this.treatmentManager.find("from Treatment where idHlht = ? ", treatmentHisId);
			if(null == treatments || treatments.size() < 1){
				//异常 找不到相关就医记录
				throw new RuntimeException("创建检查申请时找不到匹配的就诊记录");
			}else if(treatments.size()>1){
				//异常 找到多条
				throw new RuntimeException("创建检查申请时找到多条匹配的就诊记录");
			}
			treatmentsMap.put(treatments.get(0).getId(), "");
			TreatDetail detail = checkVom.getTreatDetail();
			MedicalCheck check  = checkVom.getMedicalCheck();
			detail.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			detail.setTreatment(treatments.get(0).getId());
			detail.setNotification("申请"+check.getSubject()+"检查");
			detail.setDescription("申请"+check.getSubject()+"检查");
			//完善数据
			List<Department> depts = this.departmentManager.find("from Department where idHlht = ? ", checkVom.getDepartment());
			if(null != depts && depts.size() > 0){
				detail.setDeptId(depts.get(0).getId());
				check.setDepartment(depts.get(0).getId());
				detail.setDeptName(depts.get(0).getName());
				System.out.println(check.getSubject()+"获取检查科室["+detail.getDeptName()+"]");
			}
			detail.setStatus("0");
			detail = this.treatDetailManager.save(detail);
			check.setId(detail.getId());
			this.medicalCheckManager.save(check);
			this.saveTreatDetailLog(detail,"创建检查申请",treatments.get(0).getAppUser());
		}
		for(String treatmentID : treatmentsMap.keySet()){
			Treatment treatment = this.treatmentManager.get(treatmentID);
			//完善数据
			treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			treatment.setNotification("正在申请医疗检查");
			this.treatmentManager.save(treatment);
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 做检查
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/check/do",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forDoCheck(@RequestBody String data){
		MedicalCheckVom checkVom =  JSONUtils.deserialize(data, MedicalCheckVom.class);
		List<MedicalCheck> checks = this.medicalCheckManager.find("select check from MedicalCheck check,TreatDetail detail where detail.id =check.id and detail.idHlht = ? ", checkVom.getIdHlht() );
		if(null == checks){//可通过唯一约束解决
			//异常 找不到相关检查单
		}else if(checks.size()>1){
			//异常 找到多条检查单
		}
		MedicalCheck check = checks.get(0);
		TreatDetail treatDetail = this.treatDetailManager.get(check.getId());
		
		this.medicalCheckManager.save(check);//TODO  补充数据
		treatDetail.setNotification(check.getSubject()+"检查完毕");
		treatDetail.setDescription(check.getSubject()+"检查完毕");
		treatDetail.setStartTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatDetail.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatDetail.setStatus("1");
		this.treatDetailManager.save(treatDetail);//TODO  补充数据
		Treatment treatment = this.treatmentManager.get(treatDetail.getTreatment());
		this.saveAndUpateDetailLog(treatDetail,"检查完毕",treatment.getAppUser());
		
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(treatDetail.getNotification());
		this.treatmentManager.save(treatment);//TODO  补充数据
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 创建检查结果
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/checkResult/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateCheckResult(@RequestBody String data){
		MedicalCheckVom checkVom =  JSONUtils.deserialize(data, MedicalCheckVom.class);
		List<MedicalCheck> checks = this.medicalCheckManager.find("select check from MedicalCheck check,TreatDetail detail where detail.id =check.id and detail.idHlht = ? ", checkVom.getIdHlht() );
		if(null == checks){//可通过唯一约束解决
			//异常 找不到相关检查单
		}else if(checks.size()>1){
			//异常 找到多条检查单
		}
		MedicalCheck check = checks.get(0);
		TreatDetail treatDetail = this.treatDetailManager.get(check.getId());
		List<CheckDetail> checkDetails = checkVom.getDetails();
		for(CheckDetail checkDetail : checkDetails){
			checkDetail.setCheckOrder(check.getId());
			this.checkDetailManager.save(checkDetail);
		}
		this.medicalCheckManager.save(check);//TODO  补充数据
		treatDetail.setNotification("获取"+check.getSubject()+"检查结果");
		treatDetail.setDescription("获取"+check.getSubject()+"检查结果");
		treatDetail.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatDetail.setStatus("2");
		this.treatDetailManager.save(treatDetail);//TODO  补充数据
		Treatment treatment = this.treatmentManager.get(treatDetail.getTreatment());
		this.saveAndUpateDetailLog(treatDetail,"获取检查结果",treatment.getAppUser());
		
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(treatDetail.getNotification());
		this.treatmentManager.save(treatment);//TODO  补充数据
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 创建药单（包含明细）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/drugOrder/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateDrug(@RequestBody String data){

		DrugOrderVom drugOrderVom =  JSONUtils.deserialize(data, DrugOrderVom.class);
		//TODO 完整性校验与异常捕获
		
		String treatmentHisId = drugOrderVom.getTreatment();
		List<Treatment> treatments = this.treatmentManager.find("from Treatment where idHlht = ? ", treatmentHisId);
		if(null == treatments || treatments.size() < 1){
			//异常 找不到相关就医记录
		}else if(treatments.size()>1){
			//异常 找到多条
		}
		TreatDetail detail = drugOrderVom.getTreatDetail();
		detail.setTreatment(treatments.get(0).getId());
		detail.setNotification("医生已开药,请支付后到药房取药");
		detail = this.treatDetailManager.save(detail);
		this.saveTreatDetailLog(detail,"创建取药单",treatments.get(0).getAppUser());
		DrugOrder drugOrder = drugOrderVom.getDrugOrder(); 
		drugOrder.setId(detail.getId());
		this.drugOrderManager.save(drugOrder);
		
		for(DrugDetail drugDetail : drugOrder.getDetails()){
			drugDetail.setDrugOrder(drugOrder.getId()); 
			this.drugDetailManager.save(drugDetail);
		}
		
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		//完善数据
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 出药
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/drugOrder/out",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forOutDrug(@RequestBody String data){

		DrugOrderVom drugOrderVom =  JSONUtils.deserialize(data, DrugOrderVom.class);
		//TODO 完整性校验与异常捕获
		
		List<TreatDetail> details = this.treatDetailManager.find("from TreatDetail where idHlht = ? ", drugOrderVom.getIdHlht());
		if(null == details || details.size() < 1){
			throw new RuntimeException("找不到对应的药单记录");
		}else if(details.size()>1){
			throw new RuntimeException("找到多条对应的药单记录");
		}
		
		TreatDetail detail = details.get(0);
		detail.setNotification("药房已出药，请尽快到药房取药");
		
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		this.saveTreatDetailLog(detail,"出药",treatment.getAppUser());
		//完善数据
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 取药
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/drugOrder/receive",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forReceiveDrug(@RequestBody String data){

		DrugOrderVom drugOrderVom =  JSONUtils.deserialize(data, DrugOrderVom.class);
		//TODO 完整性校验与异常捕获
		
		List<TreatDetail> details = this.treatDetailManager.find("from TreatDetail where idHlht = ? ", drugOrderVom.getIdHlht());
		if(null == details || details.size() < 1){
			throw new RuntimeException("找不到对应的药单记录");
		}else if(details.size()>1){
			throw new RuntimeException("找到多条对应的药单记录");
		}
		TreatDetail detail = details.get(0);
		Treatment treatment = this.treatmentManager.get(detail.getTreatment());
		detail.setNotification("已经领取药单,请按时用药");
		this.saveTreatDetailLog(detail,"领药",treatment.getAppUser());
		//完善数据
		treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		treatment.setNotification(detail.getNotification());
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 创建收费项（多条）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/charges/create",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forCreateCharges(@RequestBody String data){
		ChargesTom tom = JSONUtils.deserialize(data, ChargesTom.class);
		List<Charge> charges = tom.getCharges();
		Map<String,String> treatments = new HashMap<String,String>();
		for(Charge charge :charges){
			//分类生成订单
			String bizId = charge.getBizId();
			TreatDetail treatdetail = this.treatDetailManager.findOne("from TreatDetail where idHlht= ? ", bizId);
			String treatmentId = treatdetail.getTreatment();
			charge.setTreatdetail(treatdetail.getId());
			charge.setTreatment(treatmentId);
			charge.setStatus("0");//未支付
			//private String type;//不知道干啥用的
			if(null == treatments.get(treatmentId))treatments.put(treatmentId, treatmentId);
			this.chargeManager.save(charge);
			treatdetail.setNeedPay(true);
			treatdetail.setPayed(false);
			treatdetail.setDescription(treatdetail.getBizName()+"等待支付");
			treatdetail.setNotification("您有收费项未支付");
			this.treatDetailManager.save(treatdetail);
			Treatment treatment = this.treatmentManager.get(treatmentId);
			this.saveAndUpateDetailLog(treatdetail,"获取收费项",treatment.getAppUser());//该步骤不增加日志
		}
		createOrders(treatments.keySet());
		return ResultUtils.renderSuccessResult();
	}
	private void createOrders(Collection<String> treatmentIds){
		for(String treatmentId : treatmentIds){//同一条就诊记录下
			Map<String,List<Charge>> orderCharges = new HashMap<String,List<Charge>>();
			Treatment treatment = this.treatmentManager.get(treatmentId);
			List<Charge> charges = this.chargeManager.find("from Charge where treatment = ? and status = ? ", treatmentId,"0");//未支付
			if(null==charges || charges.size() == 0 )continue;
			for(Charge charge : charges){//分组
				List<Charge> group = orderCharges.get(charge.getBizSource());
				if(null == group){
					group = new ArrayList<Charge>();
					orderCharges.put(charge.getBizSource(), group);
				}
				group.add(charge);
			}
			for(String key : orderCharges.keySet()){//每一组
				List<Charge> group = orderCharges.get(key);
				List<String> orders = new ArrayList<String>();//已经存在的order
				if(group.size()<=0)continue;
				Double amt = 0.0;
				StringBuilder hqlBuilder = new StringBuilder(" UPDATE ELH_CHARGE SET ORDER_ID = ? WHERE ID IN (");
				for(int i=0;i<group.size();i++){//所有已经存在的订单
					Charge charge = group.get(i);
					String orderId = charge.getOrderId();
					amt+=charge.getReceiveAmount();
					if(i!=0)hqlBuilder.append(",");
					hqlBuilder.append("'").append(charge.getId()).append("'");
					if(null!=orderId)orders.add(orderId);
				}
				hqlBuilder.append(")");
				Order order= null; 
				if(orders.size()==0){//如果全部是order为空的收费项，说明收费项还没有生成order
					order = new Order();
					order.setTreatmentId(treatmentId);//所属就医记录
					order.setPatientId(treatment.getPatientId());//就诊人
					order.setHospitalId(treatment.getHospitalId());//就诊医院
					order.setCreateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));//创建时间
					order.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));//更新时间
					String bizSource = group.get(0).getBizSource();
					String type="缴";
					if("register".equals(bizSource)){
						type="挂号";
					}
					if("medicalCheck".equals(bizSource)){
						type="检查";
					}
					if("drugOrder".equals(bizSource)){
						type="药";
					}
					if("cure".equals(bizSource)){
						type="治疗";
					}
					order.setDescription(treatment.getHospitalName()+type+"费");
					//private String payTime ;//支付时间
				}else if(orders.size()==1){//只有一条
					order = this.orderManager.get(orders.get(0));
				}else{//两条以上，作废其他订单
					order = this.orderManager.get(orders.get(0));
					for(int i=1;i<orders.size();i++){
						String other = orders.get(i);
						Order oth = this.orderManager.get(other);
						oth.setStatus("9");
						this.orderManager.save(oth);
					}
					//作废其他订单
				}
				order.setStatus("0");//0状态1 已支付0 未支付2 支付失败 9作废 
				//order.setOrderNo(orderNo);//TODO 生成订单号
				order.setAmount(amt);//金额
				this.orderManager.save(order);
				this.orderManager.executeSql(hqlBuilder.toString(), order.getId());
			}
			treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			treatment.setNotification("您有订单未支付");
			this.treatmentManager.save(treatment);
		}
		/*private Double realAmount;
		private String comment;
		private String payTime;*/
	}
	/**
	 * 支付收费项（多条），该接口由医院调用，易健康自己的支付不在此
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/charges/pay",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forPayCharges(@RequestBody String data){
		// TODO 如果部分支付则重新生成订单,修改收费项状态和订单状态，等待医院推送就医过程的更新
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 更新就医记录,暂定post，为了降低对方接口编写难度
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/treatment/{id}",method = RequestMethod.POST, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forUpdateTreat(@RequestBody String data){
		Treatment  treatment  =  JSONUtils.deserialize(data, Treatment.class);
		this.treatmentManager.save(treatment);
		return ResultUtils.renderSuccessResult();
	}
	
	private TreatDetailLog saveTreatDetailLog(TreatDetail savedDetail, String operate, String appUserId){
		TreatDetailLog log = new TreatDetailLog();
		Date now = new Date();
		log.setBizId(savedDetail.getId());
		log.setBiz(savedDetail.getBiz());
		log.setBizName(savedDetail.getBizName());
		log.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		log.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		log.setNotification(savedDetail.getNotification());
		log.setDescription(savedDetail.getDescription());
		log.setTreatment(savedDetail.getTreatment());
		log.setOperate(operate);
		sendNotice(savedDetail, appUserId);
		
		return this.treatDetailLogManager.save(log);
	}
	private void sendNotice(TreatDetail detail, String appUserId){
		try {
			Notice notice = new Notice();
			notice.setMode(Notice.NOT_MODE_APP);
			notice.setType(Notice.NOT_TYPE_APP_GUI);
			notice.setTitle("导诊提醒");
			notice.setContent(detail.getNotification());
			notice.setApps("8a8c7db154ebe90c0154ebfdd1270004,40281882554de9e101554df07eed0003");
			notice.setReceiverType("1");//0 - 所有 | 1 - 用户 | 2 - 组别 
			notice.setReceiverValue(appUserId);// 接收者detail.getPatientId()
			notice.setTarget(detail.getId());
			notice.setState(Notice.NOT_STATUE_SENT);
			notice.setCreatedAt(DateUtils.getCurrentDateTimeStr());
			notice = this.noticeManager.save(notice);
			
			noticeService.send(notice);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private void saveAndUpateDetailLog(TreatDetail savedDetail,String operate,String appUserId){//更新该就医下的所有日志的更新时间
		TreatDetailLog log = saveTreatDetailLog(savedDetail,operate,appUserId);
		this.treatDetailLogManager.executeSql(
				"UPDATE ELH_TREATDETAIL_LOG SET UPDATE_TIME = ? WHERE BIZ_ID = ? ", 
				log.getUpdateTime(),savedDetail.getId());
	}
	/**
	 * called by forCreateTreat <br>
	 * 预约与实时挂号逻辑一致，单独方法处理
	 * @param resisters
	 * @param hisTreatment
	 * @param hisRegisterVom
	 */
	private void createTreatment(List<Register> resisters,Treatment hisTreatment,RegisterVom hisRegisterVom){
		hisTreatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		
		if( null == resisters  ){//不存在挂号记录，其他途径进行的挂号
			//TODO 完善就医记录信息
			TreatDetail detail = hisRegisterVom.getTreatDetail();
			//TODO 完善挂号信息
			detail.setIdHlht(hisRegisterVom.getIdHlht());
			detail.setStartTime(hisRegisterVom.getStartTime());
			detail.setNotification("请到"+hisRegisterVom.getDepartmentName()+"就诊");
			detail.setDescription("线下挂号成功");
			//生成就医记录
			hisTreatment.setNotification(detail.getNotification());
			Treatment treatment = this.treatmentManager.save(hisTreatment);
			detail.setTreatment(treatment.getId());
			detail = this.treatDetailManager.save(detail);
			this.saveTreatDetailLog(detail,"创建线下挂号记录",treatment.getAppUser());
			Register register = hisRegisterVom.getRegister();//生成挂号记录
			register.setId(detail.getId());
			register.setTakeNoTime(hisRegisterVom.getTakeNoTime());
			register.setNo(hisRegisterVom.getNo());
			this.registerManager.save(register);
			
		}else if(resisters.size() == 1) {
			Register register = resisters.get(0);
			TreatDetail detail = this.treatDetailManager.get(register.getId());
			Treatment treatment = this.treatmentManager.get(detail.getTreatment());
			//TODO 完善就医记录信息
			treatment.setStartTime(hisTreatment.getStartTime());
			treatment.setIdHlht(hisTreatment.getIdHlht());
			treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			//TODO 完善挂号信息
			register.setTakeNoTime(hisRegisterVom.getTakeNoTime());
			register.setNo(hisRegisterVom.getNo());
			detail.setIdHlht(hisRegisterVom.getIdHlht());
			detail.setStartTime(hisRegisterVom.getStartTime());
			detail.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			detail.setNotification("正在取号,当前号码: " + register.getNo());
			detail.setDescription("正在取号,当前号码: " + register.getNo());
			treatment.setNotification(detail.getNotification());
			this.treatmentManager.save(treatment);
			this.treatDetailManager.save(detail);
			this.saveAndUpateDetailLog(detail,"更新挂号记录",treatment.getAppUser());
			this.registerManager.save(register);
		}else{
			//异常 挂号记录有多条
		}
	}
}