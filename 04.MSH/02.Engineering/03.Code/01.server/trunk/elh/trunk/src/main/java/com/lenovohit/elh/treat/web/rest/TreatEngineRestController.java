package com.lenovohit.elh.treat.web.rest;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.User;
import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.MedicalCard;
import com.lenovohit.elh.base.model.Patient;
import com.lenovohit.elh.pay.model.Charge;
import com.lenovohit.elh.pay.model.Order;
import com.lenovohit.elh.treat.manager.HisManager;
import com.lenovohit.elh.treat.model.CheckDetail;
import com.lenovohit.elh.treat.model.Diagnosis;
import com.lenovohit.elh.treat.model.DrugDetail;
import com.lenovohit.elh.treat.model.DrugOrder;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.RegistSource;
import com.lenovohit.elh.treat.model.Register;
import com.lenovohit.elh.treat.model.TreatDetail;
import com.lenovohit.elh.treat.model.TreatDetailLog;
import com.lenovohit.elh.treat.model.TreatGroup;
import com.lenovohit.elh.treat.model.TreatStep;
import com.lenovohit.elh.treat.model.Treatment;
import com.lenovohit.elh.treat.vom.DrugOrderVom;
import com.lenovohit.elh.treat.vom.RegisterVom;


/**
 * 就医业务<br>
 * 主要负责app端就医过程的业务处理
 * @author Administrator
 * TODO 停诊  爽约  取消预约 
 *
 */
@RestController
@RequestMapping("/elh/treat")
public class TreatEngineRestController extends BaseRestController  {
	@Autowired
	private HisManager hisManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<Treatment, String> treatmentManager;
	@Autowired
	private GenericManager<Register, String> registerManager;
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<MedicalCheck, String> medicalCheckManager;
	@Autowired
	private GenericManager<MedicalCard, String> medicalCardManager;
	@Autowired
	private GenericManager<CheckDetail, String> checkDetailManager;
	@Autowired
	private GenericManager<Charge, String> chargeManager;
	@Autowired
	private GenericManager<Order, String> orderManager;
	@Autowired
	private GenericManager<TreatDetail, String> treatDetailManager;
	@Autowired
	private GenericManager<Diagnosis, String> diagnosisManager;
	
	@Autowired
	private GenericManager<TreatDetailLog, String> treatDetailLogManager;
	@Autowired
	private GenericManager<DrugDetail, String> drugDetailManager;
	@Autowired
	private GenericManager<DrugOrder, String> drugOrderManager;
	
	
	//到诊引擎，查询所有的就以项目，分组展示
	/**
	 * 向医院查询查询就诊卡信息
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/his/medicalCard/{hospitalId}/{cardNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMedicalCardFromHis(@PathVariable  String hospitalId,@PathVariable  String cardNo) {
		MedicalCard card = this.hisManager.getMedicalCard(hospitalId,cardNo);
		return ResultUtils.renderSuccessResult(card);
	}
	/**
	 * 办理就诊卡
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/his/medicalCard/create", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result makeMedicalCardFromHis(@RequestBody String data) {
		MedicalCard card = JSONUtils.deserialize(data, MedicalCard.class) ;
		//TODO 数据校验
		MedicalCard makedCard = this.hisManager.makeMedicalCard(card);
		/*card.setTypeId(makedCard.getTypeId());
		card.setTypeName(typeName);//卡类型名称	
		card.setCardholder(cardholder);//持卡人姓名	
		card.setIdCardNo(idCardNo);//持卡人身份证号	
		card.setOrgId(orgId);//发卡机构ID	
		card.setOrgName(orgName); //发卡机构名称
		card.setPatient(patient);*/
		//以上信息需要请求时传入
		card.setCardNo(makedCard.getCardNo());//卡类型ID	
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		card.setBindedAt(sdf.format(date));//绑卡时间	
		card.setState("0"); //状态
		
		this.medicalCardManager.save(card);
		return ResultUtils.renderSuccessResult(card);
	}
	/**
	 * 获取预约挂号号源
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/reg/sources/appiont", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result regAppiontSources(@RequestParam(value = "data", defaultValue = "") String data) {
		Map<?,?> params = JSONUtils.deserialize(data, Map.class);
		Object hospId = params.get("hospital");
		Object deptId = params.get("department");
		Object docId = params.get("doctor");
		Object regType = params.get("regType");
		Object date = params.get("date");
		if(null==hospId){
			return ResultUtils.renderFailureResult("请选择医院");
		}
		if(null==deptId){
			return ResultUtils.renderFailureResult("请选择科室");
		}
		if(null==regType){
			return ResultUtils.renderFailureResult("请选择挂号类型");
		}
		Hospital hospital = this.hospitalManager.get(hospId.toString());
		Department department = this.departmentManager.get(deptId.toString());
		if(null==hospital){
			return ResultUtils.renderFailureResult("医院不存在");
		}
		if(null==department){
			return ResultUtils.renderFailureResult("科室不存在");
		}
		Doctor doctor =null;
		if(null!=docId &&!"".equals(docId) )doctor = this.doctorManager.get(docId.toString());
		String dateString = (null!= date)?date.toString():null;
		List<RegistSource> list = hisManager.getRegistSource(hospital,department,doctor,regType.toString(),dateString);
		Page page = new Page();
		page.setResult(list);
		page.setTotal(list.size());
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 获取预约挂号号源
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/reg/sources/realtime", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result regRealtimeSources(@RequestParam(value = "data", defaultValue = "") String data) {
		Map<?,?> params = JSONUtils.deserialize(data, Map.class);
		Object hospId = params.get("hospital");
		Object deptId = params.get("department");
		Object docId = params.get("doctor");
		Object regType = params.get("regType");
		Object date = params.get("date");
		if(null==hospId){
			return ResultUtils.renderFailureResult("请选择医院");
		}
		if(null==deptId){
			return ResultUtils.renderFailureResult("请选择科室");
		}
		if(null==regType){
			return ResultUtils.renderFailureResult("请选择挂号类型");
		}
		Hospital hospital = this.hospitalManager.get(hospId.toString());
		Department department = this.departmentManager.get(deptId.toString());
		if(null==hospital){
			return ResultUtils.renderFailureResult("医院不存在");
		}
		if(null==department){
			return ResultUtils.renderFailureResult("科室不存在");
		}
		Doctor doctor =null;
		if(null!=docId &&!"".equals(docId) )doctor = this.doctorManager.get(docId.toString());
		String dateString = (null!= date)?date.toString():null;
		List<RegistSource> list = hisManager.getRegistSource(hospital,department,doctor,regType.toString(),dateString);
		Page page = new Page();
		page.setResult(list);
		page.setTotal(list.size());
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 申请锁号 锁成功---实时挂号生成订单等待支付-非实时挂号不支付 TODO 该方法未完成 
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/reg/lock",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result lockToken(@RequestBody String data){
		RegistSource source =  JSONUtils.deserialize(data, RegistSource.class);
		System.out.println("锁号申请开始");
		Hospital hospital =this.hospitalManager.get(source.getHospital());
		Department dept =this.departmentManager.get(source.getDepartment());
		Patient patient =this.patientManager.get(source.getPatient());
		String regType = source.getType();
		//根据不同的医院获取不同的接口实现
		//HISManager hisManager = this.getHisManagerByHspt(hospital);
		RegistSource lockedSource = hisManager.lockRegistSource(source);
		System.out.println("锁号申请结束");
		
		if(null != lockedSource){//锁号成功
			Treatment treatment = this.creatAndSaveTreatment(source, hospital, dept, patient);
			//保存挂号
			RegisterVom register= this.createRegByRegSource(source);
			//保存挂号订单			
			if("1".equals(regType)){//实时挂号
				/*Order order = */
				this.creatAndSaveRegisterOrder(register, treatment);
			}
			
			return ResultUtils.renderSuccessResult(register);
		}else{//锁号失败
			return ResultUtils.renderFailureResult("锁定号源失败");
		}
	}
	
	/**
	 * 预约挂号  
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/reg/appoint",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forAppoint(@RequestBody String data){
		try{
			RegistSource source =  JSONUtils.deserialize(data, RegistSource.class);
			RegistSource aSource = this.hisManager.registAppiont(source);
			//开启就诊记录
			Treatment treatment = createTreatByRegSource(aSource);
			User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
			if(null!=_user)treatment.setAppUser(_user.getId());
			this.treatmentManager.save(treatment);
			//保存挂号表
			
			RegisterVom registerVom =createRegByRegSource(aSource);
			TreatDetail detail = registerVom.getTreatDetail();
			Register register = registerVom.getRegister();
			
			detail.setTreatment(treatment.getId());
			detail.setDescription("预约挂号成功");;
			detail.setNotification("请与"+register.getRegDate()+"日到"+detail.getHospitalName()+"取号就诊");
			TreatDetail savedDetail = this.treatDetailManager.save(detail);
			register.setId(savedDetail.getId());
			this.registerManager.save(register);
			this.saveTreatDetailLog(savedDetail,"创建预约挂号记录");
			//上次就医过程结束
			
			List<Treatment> oldTreatments  = this.treatmentManager.find("from Treatment where patientId = ? and hospitalId = ? and departmentId = ? and status = 0 ", 
					treatment.getPatientId(),treatment.getHospitalId(),treatment.getDepartmentId());
			for(Treatment old : oldTreatments){
				if(!old.getId().equals(treatment.getId())){
					old.setStatus("1");
					this.treatmentManager.save(old);
				}
			}
			return ResultUtils.renderSuccessResult(registerVom);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("");
		}
	}
	private Treatment createTreatByRegSource(RegistSource aSource){
		Treatment treatment = new Treatment();
		treatment.setCreateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		//private String startTime;//开始时间 取号后开始
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
		treatment.setCardTypeName(aSource.getCardTypeName());
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
		registerVom.setHospitalId(aSource.getHospital());
		registerVom.setHospitalName(aSource.getHospitalName());
		registerVom.setPatientId(aSource.getPatient());
		registerVom.setPatientName(aSource.getPatientName());
		registerVom.setRegdate(aSource.getDate());
		registerVom.setName("预约挂号");
		registerVom.setBiz("register");//业务类别 分组排序时使用
		registerVom.setBizName("挂号");//业务类别名称
		registerVom.setDescription("在线预约挂号");;//描述
		registerVom.setNotification("请于"+aSource.getDate()+"日在医院窗口换号");
		registerVom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setCreateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setUpdateTime(DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss"));
		registerVom.setNeedPay(false);
		registerVom.setPayed(false);
		registerVom.setStatus("0");//状态 未完成 已完成
		registerVom.setAppointNo(aSource.getAppointNo());//预约码 预约挂号换号时用
		registerVom.setCardNo(aSource.getCardNo());
		registerVom.setCardType(aSource.getCardType());
		registerVom.setCardTypeName(aSource.getCardTypeName());
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
	/**
	 * 实时挂号,支付完成后调用,该接口不会被调用 实时挂号记录由医院推送
	 * @param request
	 * @return
	 */
	@Deprecated
	@RequestMapping(value="/reg/reqister",method = RequestMethod.GET, produces = MediaTypes.TEXT_PLAIN_UTF_8)
	public Result forReqister(@PathVariable("registerId") String registerId){
		/*System.out.println("挂号开始");
		//修改挂号表状态
		TreatDetail treatDetail = this.treatDetailManager.get(registerId);
		if(!treatDetail.getPayed()){
			return ResultUtils.renderFailureResult("您还未支付");
		}
		treatDetail.setStatus("1");//状态
		this.treatDetailManager.save(treatDetail);
		System.out.println("挂号结束");*/
		return ResultUtils.renderSuccessResult();
	}	
	private TreatDetailLog saveTreatDetailLog(TreatDetail savedDetail,String operate){
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
		return this.treatDetailLogManager.save(log);
	}
	private void saveAndUpateDetailLog(TreatDetail savedDetail,String operate){//更新该就医下的所有日志的更新时间
		TreatDetailLog log = saveTreatDetailLog(savedDetail,operate);
		this.treatDetailLogManager.executeSql(
				"UPDATE ELH_TREATDETAIL_LOG SET UPDATE_TIME = ? WHERE BIZ_ID = ? ", 
				log.getUpdateTime(),savedDetail.getId());
	}
	/**
	 * app端使用
	 * @param treatmentId
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value="/my/treatGuide/{treatment}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result myTreatGuide(@PathVariable("treatment") String treatmentId) throws JsonProcessingException{
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		Treatment treatment = this.treatmentManager.get(treatmentId);
		if(!userId.equals(treatment.getAppUser())){
			return ResultUtils.renderFailureResult("无权查看其它用户的导诊记录");
		}
		return this.geneTreatGuide(treatment);
	}
	/**
	 * 机构端使用
	 * @param treatmentId
	 * @return
	 * @throws JsonProcessingException
	 */
	@RequestMapping(value="/treatGuide/{treatment}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result treatGuide(@PathVariable("treatment") String treatmentId) throws JsonProcessingException{
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		Treatment treatment = this.treatmentManager.get(treatmentId);
		if(!loginOrg.getId().equals(treatment.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的挂号记录");
		}
		
		return this.geneTreatGuide(treatment);
	}
	private Result geneTreatGuide(Treatment treatment) throws JsonProcessingException{
		try {
			//查询所有就诊项
			
			List<TreatDetail> details = this.treatDetailManager.find("from TreatDetail where treatment = ? ", treatment.getId());
			List<Charge> charges = this.chargeManager.find("from Charge where treatment = ? ",  treatment.getId());
			List<Order> orders = this.orderManager.find("from Order where treatment = ? ",  treatment.getId());
			
			Map<String,Order> orderMap= new HashMap<String,Order>();
			Map<String,List<Charge>> orderCharge= new HashMap<String,List<Charge>>();
			
			for(Charge charge : charges){
				List<Charge> cList= orderCharge.get(charge.getOrderId());
				if(null == cList){
					cList = new ArrayList<Charge>();
					orderCharge.put(charge.getOrderId(),cList);
				}
				cList.add(charge);
			}
			for(Order order : orders){
				orderMap.put(order.getId(), order);
				TreatDetail td = new TreatDetail();
				td.setBiz("order");
				td.setId(order.getId());
				td.setCreateTime(order.getCreateTime());
				td.setUpdateTime(order.getUpdateTime());
				details.add(td);
			}
			//时间排序
			details = this.sortByTime(details);
			//分组
			TreatDetail pre = null;
			TreatGroup group =null; 
			List<TreatGroup> groups = treatment.getGroups();
			for(TreatDetail detail : details){
				
				Date time = DateUtils.string2Date(detail.getUpdateTime(), "yyyy-MM-dd HH:mm:ss");
				Date now = new Date();
				@SuppressWarnings("deprecation")
				boolean today = (time.getYear()==now.getYear()&&time.getMonth()==now.getMonth()&&time.getDate()==now.getDate());
				if("order".equals(detail.getBiz())){
					group = new TreatGroup();
					groups.add(group);
					group.setName("缴费");
					group.setBizType("order");
					group.setToday(today);
					group.setUpdateTime(detail.getUpdateTime());
					Order order= orderMap.get(detail.getId());
					order.setCharges(orderCharge.get(order.getId()));
					TreatStep step = new TreatStep(order);
					step.setToday(today);
					group.addStep(step);
					continue;
				}
				if( group == null||pre==null ||(!detail.getBiz().equals(pre.getBiz()))){
					group = new TreatGroup();
					groups.add(group);
					group.setName(detail.getBizName());
					group.setBizType(detail.getBiz());
				}
				group.setToday(today);
				group.setUpdateTime(detail.getUpdateTime());
				TreatStep step;
				if("drugOrder".equals(detail.getBiz())){
					DrugOrder dg = drugOrderManager.get(detail.getId());
					dg.setDetails(this.drugDetailManager.find("from DrugDetail where drugOrder = ? ", detail.getId()));
					DrugOrderVom vom = new DrugOrderVom(dg,detail);
					step = new TreatStep(vom,detail.getName(),detail.getBiz(),detail.getUpdateTime());
				}else{
					step = new TreatStep(detail);
				}
				step.setToday(today);
				group.addStep(step);
				pre=detail;
			}
			return ResultUtils.renderSuccessResult(treatment);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	public List<TreatDetail> sortByTime(List<TreatDetail> details){
		System.out.println("sortByTime");
		Collections.sort(details, new java.util.Comparator<TreatDetail>(){
			@Override
			public int compare(TreatDetail o1, TreatDetail o2) {
				Date date1 = DateUtils.string2Date(o1.getCreateTime(), "yyyy-MM-dd HH:mm:ss");
				Date date2 = DateUtils.string2Date(o2.getCreateTime(), "yyyy-MM-dd HH:mm:ss");
				int c = date2.compareTo(date1);//.compareTo(o1.getCreateTime());
				if(c==0){
					if("order".equals(o1.getBiz()))c =  -1;
					if("order".equals(o2.getBiz()))c = 1;
				}
				return c;
			}
		});
		return details;
	}
	
	/**
	 * 支付完成后回调
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/pay/callback/{orderId}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayOrder(@PathVariable("orderId") String orderId,@RequestParam(value = "data", defaultValue = "data") String userId){
		//TODO 校验银行数据正确性安全性。。。。
		//this.getRequest().getParameter("");
		try {
			Order order  = this.orderManager.get(orderId);
			if(null == order ){
				return ResultUtils.renderFailureResult("找不到订单："+orderId);
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Date now = new Date();
			order.setPayTime(sdf.format(now ));
			order.setUpdateTime(sdf.format(now));
			order.setStatus("1");		
			List<Charge> charges = this.chargeManager.find("from Charge where orderId = ? ", orderId);
			List<Charge> payedCharges = this.hisManager.payCharges(charges);
			Map<String,String> treatments = new HashMap<String,String>();
			for(Charge charge : payedCharges){//TODO 不考虑部分支付情况 不考虑异常情况  不考虑一个就诊项目包含多个收费项的情况
				charge.setPayTime(sdf.format( new Date()));
				charge.setStatus("1");
				//修改收费项状态
				this.chargeManager.save(charge);
				TreatDetail detail = this.treatDetailManager.get(charge.getTreatdetail());
				detail.setDescription("支付"+charge.getName()+"成功");
				detail.setUpdateTime(sdf.format(now));
				detail.setNotification("支付"+charge.getName()+"成功");
				this.treatDetailManager.save(detail);
				this.saveAndUpateDetailLog(detail, "支付订单成功");
				treatments.put(charge.getTreatment(), "");
			}
			for(String treatmentId : treatments.keySet()){
				Treatment treatment = this.treatmentManager.get(treatmentId);
				treatment.setUpdateTime(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
				treatment.setNotification("支付订单成功");
				this.treatmentManager.save(treatment);
			}
			this.orderManager.save(order);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResultUtils.renderFailureResult("支付异常"+e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/*
	@RequestMapping(value="/reportSheet",method = RequestMethod.POST, produces = MediaTypes.JSON)
	public Map forReportSheet(HttpServletRequest request){
		Map map = new HashMap<String, Object>();
//		String userId = "402881e54da9651a014da9674e1e0000";
		String userId = request.getParameter("id");
		String jql = "select a from Person a,UserPatient b where a.id = b.pid and b.uid = ?0";
		List<Patient> plist = patientManager.find(jql, userId);
		System.out.println(userId+"----------"+plist.size());
		List<MedicalCheck> totalList = new ArrayList<MedicalCheck>();
		if(plist.size() > 0){
			for(int i = 0; i < plist.size();i++){
				Patient p = plist.get(i);
				String jql1 = "from MedicalCheck where 1=1 and patientId = ?0";
				List<MedicalCheck> checkList = medicalCheckManager.find(jql1, p.getId());
				System.out.println("==========="+p.getId());
				if(checkList.size() > 0){
					for(int j = 0;j < checkList.size();j++){
						MedicalCheck check = checkList.get(j);
						check.setPatientId(p.getId());
					}
					totalList.addAll(checkList);
				}
			}
			map.put("reports", totalList);
			map.put("success", true);
			map.put("rsg", "请求报告单列表成功");
		}else{
			map.put("success", false);
			map.put("rsg", "请求报告单列表失败");
		}
		return map ;
	}
	@RequestMapping(value="/medicalCheck",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public String getOrderById(HttpServletRequest request){
		String checkId = request.getParameter("checkId");
		MedicalCheck medicalCheck = this.medicalCheckManager.get(checkId);
		List<CheckDetail> detailList = checkDetailManager.find("from CheckDetail where 1=1 and checkOrder = ?0", checkId);
		medicalCheck.setDetails(detailList);
		Person patient = this.patientManager.get(medicalCheck.getPatientId());
		medicalCheck.setPatient(patient);
		return this.writeToJson(medicalCheck, "medicalCheck");
	}
	@RequestMapping(value="/reportDetails",method = RequestMethod.POST, produces = MediaTypes.JSON)
	public Map forReportDetail(HttpServletRequest request){
		map = new HashMap<String, Object>();
//		String checkId ="402880f24dad006e014dad006e970001";
		String checkId = request.getParameter("id");
		String jql = "from CheckDetail where 1=1 and checkOrder = ?0";
		List<CheckDetail> detailList = checkDetailManager.find(jql, checkId);
		if(detailList.size() > 0){
			map.put("details", detailList);
			map.put("success", true);
			map.put("rsg", "请求报告单详情成功");
		}else{
			map.put("success", true);
			map.put("rsg", "请求报告单详情失败");
		}
		return map ;
	}
	@RequestMapping(value="/treatments",method = RequestMethod.POST, produces = MediaTypes.JSON)
	public String treatments(HttpServletRequest request){
		String pId = request.getParameter("pId");
		if(null==pId||"".equals(pId))return "{success:flase,msg:'用户不能为空'}";
		String jql = "select a from Person a,UserPatient b where a.id = b.pid and b.uid = ?0";
		List<Person> plist = patientManager.find(jql, pId);
		StringBuffer ids = new StringBuffer();
		for(int i=0;i<plist.size();i++){
			if(i!=0)ids.append(",");
			ids.append("'").append(plist.get(i).getId()).append("'");
		}
		System.out.println("from Treatment where patient in ("+ids+")");
		List<Treatment> treatments = this.treatmentManager.find("from Treatment where patientId in ("+ids+") and status !='1'");//TODO 未完成的 或者今天的 
		for(Treatment treat : treatments){
			String card = treat.getCardId();
			String patient = treat.getPatientId();
			if(null!=card&&!"".equals(card)){
				treat.setCard(this.cardManager.get(card));
			}
			if(null!=patient&&!"".equals(patient)){
				treat.setPatient(this.patientManager.get(patient));
			}
		}
		return this.writeToJson(treatments,"treatments");
	}*/
	
	/*private RegisterVom creatAndSaveRegister(RegistSource source, Treatment treatment){
		Register register = new Register();
		Date date = new Date();
		String currentDate = DateUtils.date2String(date, "yyyy-MM-dd HH:mm:ss");
		TreatDetail treatDetail = new TreatDetail();
		treatDetail.setPatientId(source.getPatient());//就诊人
		treatDetail.setPatientName(treatment.getPatientName());//就诊人
		treatDetail.setName("挂号");//名称
		treatDetail.setBizName("挂号");
		treatDetail.setBiz("register");//类别
		treatDetail.setDescription("在线预约挂号");//简述
		treatDetail.setNotification("请于"+source.getDate()+"日在医院窗口换号");//提醒
		treatDetail.setTreatment(treatment.getId());//所属就医记录
		treatDetail.setStartTime(currentDate);//开始时间
		treatDetail.setCreateTime(currentDate);//创建时间
		treatDetail.setUpdateTime(currentDate);
		treatDetail.setStatus("0");//状态
		treatDetail.setNeedPay(true);//是否需要交费
		treatDetail.setPayed(false);//是否缴费
		treatDetail.setHospitalName(treatment.getHospitalName());//挂号医院
		treatDetail.setHospitalId(treatment.getHospitalId());//挂号医院
		
		register.setNo(source.getNo());//号码
		register.setAppointNo(source.getAppointNo());
		register.setRegisterTime(currentDate);//挂号时间
		register.setCardNo(treatment.getCardNo());;
		register.setCardType(treatment.getCardType());
		register.setDepartmentId(treatment.getDepartmentId());//挂号科室
		register.setDoctorName(treatment.getDoctorName());//挂号医生
		register.setDepartmentName(treatment.getDepartmentName());//挂号科室
		register.setDoctorName(treatment.getDoctorName());//挂号医生
		
		if(source.getType().indexOf("实时挂号")!=0){
			register.setType("0");//挂号类别
		}else{
			register.setType("1");//挂号类别
		}
		register.setAmount(source.getAmt());//收费金额
		treatDetail.setStatus("0");//状态
		register.setReserved(true);//预约标志
		treatDetailManager.save(treatDetail);
		register.setId(treatDetail.getId());
		registerManager.save(register);
		return new RegisterVom(register,treatDetail);
	}*/
	private Order creatAndSaveRegisterOrder(RegisterVom register,Treatment treatment){
		Order order = new Order();
		Date date = new Date();
		String currentDate = DateUtils.date2String(date, "yyyy-MM-dd HH:mm:ss");
		order.setTreatmentId(treatment.getId());
		order.setOrderNo(DateUtils.date2String(new Date(), "yyyyMMddHHmmss")); //订单号
		order.setPatientId(treatment.getPatientId()); //就诊人
		order.setHospitalId(treatment.getHospitalId()); //就诊医院
//		order.setDepartment(treatment.getDepartmentId());//所属科室
		order.setStatus("0"); //状态
		order.setAmount(register.getAmount()); //金额
		order.setPayTime(""); //支付时间
		order.setCreateTime(currentDate); //创建时间
		order.setUpdateTime(currentDate);
		order.setDescription(""); //描述
		order = orderManager.save(order);
		//保存收费项
		Charge charge = new Charge();
		charge.setReceiveAmount(register.getAmount());//应收金额
		charge.setRealAmount(0.0);//实收金额
		charge.setStatus("0");//缴费状态
		charge.setBizSource("register");//业务对象来源
		charge.setBizId(register.getId());//业务对象id
		charge.setTreatdetail(register.getId());//就医项ID
		charge.setTreatment(treatment.getId());//所属医疗记录
		charge.setPatient(treatment.getPatientId());
		charge.setType("0");//类别
		charge.setPricePer("");//划价人
		charge.setChargePer("");//收费人
		charge.setOrderPer("");//开单人
		charge.setComment(register.getDepartmentName()+"挂号费");//摘要
		charge.setCreateTime(currentDate);//创建时间
		charge.setOccurTime(currentDate);//发生时间
		charge.setRegTime(currentDate);//登记时间
		charge.setPayTime("");//缴费时间
		charge.setOrderNo(order.getOrderNo());
		charge.setOrderId(order.getId());
		charge = chargeManager.save(charge);
		treatment.setNotification("您有订单未支付");
		this.treatmentManager.save(treatment);
		List<Charge> charges = new ArrayList<Charge>();
		charges.add(charge);
		order.setCharges(charges);
		order.setPatient(this.patientManager.get(register.getPatientId()));
		return order;
	}
	private Treatment creatAndSaveTreatment(RegistSource source, Hospital hospital,Department dept,Patient patient){
		Date date = new Date();
		String currentDate = DateUtils.date2String(date, "yyyy-MM-dd HH:mm:ss");
		//保存就医记录
		Treatment treatment = new Treatment();		
		treatment.setCardNo(source.getCardNo());//挂号的卡号
		treatment.setCardType(source.getCardType());//挂号的卡类型
		treatment.setCreateTime(currentDate);
		
		treatment.setHospitalId(hospital.getId());
		treatment.setDepartmentId(dept.getId());
		treatment.setPatientId(patient.getId());
		
		treatment.setHospitalName(hospital.getName());
		treatment.setDepartmentName(dept.getName());
		treatment.setPatientName(patient.getName());
		
		//treatment.setMedcialResult("");
		treatment.setStatus("0");//进行中
		treatment.setType("0");//诊门
		
		return this.treatmentManager.save(treatment);
	}

	
}