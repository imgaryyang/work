package com.lenovohit.ssm.treat.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.Operator;
import com.lenovohit.ssm.base.model.SSMConfig;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.ChargeItem;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.utils.IdentificationCodeUtil;

/**
 * 患者基本信息
 */
@RestController
@RequestMapping("/ssm/treat/patient")
public class PatientRestController extends SSMBaseRestController {
	static Logger logger = Logger.getLogger(PatientRestController.class);
//	private static BigDecimal CARD_AMT = new BigDecimal(2);
//	private static BigDecimal PROFILE_AMT = new BigDecimal(5);
	
	Calendar calendar = new GregorianCalendar(2017,6,9,0,0,0);//2017年6月9日
	
	@Autowired
	private GenericManagerImpl<SSMConfig,String> configManager;
	@Autowired
	private HisPatientManager hisPatientManager;
	@Autowired
	private GenericManagerImpl<Operator,String> operatorManager;
	@Autowired
	private GenericManager<Order, String> orderManager;
//	@Autowired
//	private GenericManager<Settlement, String> settlementManager;
	/**
	 * 查询患者基本信息 优先级 先插病人编号，后查医保卡号，最后身份证号
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatients(@RequestParam(value = "data", defaultValue = "") String data){
		Patient searchInfo =  JSONUtils.deserialize(data, Patient.class);//入参字段映射
		String idNo = searchInfo.getIdNo();
		
		List<Patient> patients = new ArrayList<Patient>();
		
		if(StringUtils.isEmpty(idNo))return ResultUtils.renderFailureResult();
		
		if(idNo!=null && idNo.length() == 15){//15 查15和18小写
			searchInfo.setIdNo(idNo.toLowerCase());
			HisListResponse<Patient>  patientResponse_15  = hisPatientManager.getPatients(searchInfo);
			List<Patient> list_15 = patientResponse_15.getList();
			if(null != list_15 )patients.addAll(list_15);
			
			String idNo_18 =  IdentificationCodeUtil.update2eighteen(idNo);
			searchInfo.setIdNo(idNo_18.toLowerCase());
			HisListResponse<Patient>  patientResponse_18 = hisPatientManager.getPatients(searchInfo);
			List<Patient> list_18 = patientResponse_18.getList();
			if(null != list_18 )patients.addAll(list_18);
		}else if(idNo.endsWith("x") || idNo.endsWith("X")){//15 查18的大小写
			searchInfo.setIdNo(idNo.toLowerCase());
			HisListResponse<Patient>  patientResponse_18_low  = hisPatientManager.getPatients(searchInfo);
			List<Patient> list_18_low = patientResponse_18_low.getList();
			if(list_18_low != null )patients.addAll(list_18_low);
			
			searchInfo.setIdNo(idNo.toUpperCase());
			HisListResponse<Patient>  patientResponse_18_up  = hisPatientManager.getPatients(searchInfo);
			List<Patient> list_18_up =  patientResponse_18_up.getList();
			if(list_18_low != null )patients.addAll(list_18_up);
		}else{
			searchInfo.setIdNo(idNo);
			HisListResponse<Patient>  patientResponse = hisPatientManager.getPatients(searchInfo);
			List<Patient> list =  patientResponse.getList();
			if(list != null )patients.addAll(list);
		}
		
		return ResultUtils.renderSuccessResult(patients);
	}
	/**
	 * 查询患者基本信息 优先级 先插病人编号，后查医保卡号，最后身份证号
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/info",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientInfo(@RequestParam(value = "data", defaultValue = "") String data){
		Patient searchInfo =  JSONUtils.deserialize(data, Patient.class);//入参字段映射
		Patient patient = null;
		Patient param = new Patient();
		
		if(!StringUtils.isEmpty(searchInfo.getNo())){
			HisEntityResponse<Patient>  noPatientResponse = hisPatientManager.getPatientByPatientNo(searchInfo);
			patient = noPatientResponse.getEntity();
			if(null == patient){
				return ResultUtils.renderFailureResult("无效的患者信息"); 
			}else{
				return ResultUtils.renderSuccessResult(patient);
			}
		}
		
		String miCardNo = searchInfo.getMiCardNo();
		if(!StringUtils.isEmpty(miCardNo)){//医保卡的关联档
			param.setMiCardNo(miCardNo);//只有查询条件
			HisEntityResponse<Patient>  miPatientResponse = hisPatientManager.getPatientByCardNo(param);
			HisListResponse<Patient>  miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(param);
			List<Patient>  miRelaPatient = miRelaPatientResponse.getList();
			if(null != miRelaPatient && miRelaPatient.size() == 1){
				patient =  miRelaPatient.get(0);
				Patient miPatient = miPatientResponse.getEntity();
				if(null != miPatient){
					patient.setMiPatientNo(miPatient.getNo());//社保档的病人编号 补卡打印用
					patient.setIdNo(miPatient.getIdNo());
					System.out.println("医保档编号 : "+patient.getMiPatientNo());
				}
				return ResultUtils.renderSuccessResult(patient);
			}else if(null == miRelaPatient || miRelaPatient.size()<=0){
				return ResultUtils.renderSuccessResult();
			}else{
				return ResultUtils.renderFailureResult("存在额外的档案信息");
			}
		}
		
		String idNo = searchInfo.getIdNo();
		if(!StringUtils.isEmpty(idNo)){//身份证自费档
			param.setIdNo(idNo);
			HisListResponse<Patient>  idPatientResponse = hisPatientManager.getSelfPatientByIdNo(param);
			List<Patient> idPatients = idPatientResponse.getList();
			if(null != idPatients && idPatients.size() == 1){
				patient =  idPatients.get(0);
				return ResultUtils.renderSuccessResult(patient);
			}else if(null == idPatients || idPatients.size()<=0){
				return ResultUtils.renderSuccessResult();
			}else{
				return ResultUtils.renderFailureResult("存在额外的档案信息");
			}
		}
	    return ResultUtils.renderFailureResult("查询条件有误");
	}
	/**
	 * 查询患者基本信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/loginInfo",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientLoginInfo(@RequestParam(value = "data", defaultValue = "") String data){
		Patient searchInfo =  JSONUtils.deserialize(data, Patient.class);//入参字段映射
		Patient patient = this.findLoginPatient(searchInfo);
		if(null != patient) return ResultUtils.renderSuccessResult(patient);
	    return ResultUtils.renderFailureResult();
	}
	
	/**
	 * 建立档案
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/profile/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateProfile(@RequestBody String data){
		Patient baseInfo = JSONUtils.deserialize(data, Patient.class);
        baseInfo.setHisUserid(this.getCurrentMachine().getHisUser());
		String unitCode = baseInfo.getUnitCode();
		
		//HisListResponse<Patient> response = hisPatientManager.getPatientByIdNo(baseInfo);//查询
		//List<Patient> profiles = filterByUnitCode(response.getList(), unitCode);//过滤档案结算类型
		// List<Patient> profiles   = new ArrayList<Patient>();
		Patient patient = null;
		if(!StringUtils.isEmpty(baseInfo.getIdNo())){//有身份证号
			HisEntityResponse<Patient> createResponse = hisPatientManager.createProfile(baseInfo);
			if(null == createResponse || !createResponse.isSuccess()){//建档失败 
				String msg = "建档失败";
				try{
					String content = createResponse.getContent();
					JSONArray jbs = (JSONArray)JSONUtils.parse(content);
					JSONObject jb = (JSONObject)jbs.get(0);
					msg = jb.getString("msg");
				}catch(Exception e){
					e.printStackTrace();
				}
				return ResultUtils.renderFailureResult(msg);
	        }
			Patient param = createResponse.getEntity();
			HisEntityResponse<Patient> response = hisPatientManager.getPatientByPatientNo(param);
			patient = response.getEntity();
		}else{
			HisEntityResponse<Patient> createResponse = hisPatientManager.createProfileWithoutIdNo(baseInfo);
			if(null == createResponse || !createResponse.isSuccess()){//建档失败 
				String msg = "建档失败";
				try{
					String content = createResponse.getContent();
					JSONArray jbs = (JSONArray)JSONUtils.parse(content);
					JSONObject jb = (JSONObject)jbs.get(0);
					msg = jb.getString("msg");
				}catch(Exception e){
					e.printStackTrace();
				}
				return ResultUtils.renderFailureResult(msg);
	        }
			
			Patient param = createResponse.getEntity();
			HisEntityResponse<Patient> response = hisPatientManager.getPatientByPatientNo(param);
			patient = response.getEntity();
		}
		
		if(patient == null ){
			return ResultUtils.renderFailureResult("建档失败");
		}else{
			return ResultUtils.renderSuccessResult(patient);
		}
	}
	
	/**
     * 就诊卡绑定
     * @param data
     * @return
     */
    @RequestMapping(value="/bindCard",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    public Result forBindCard(@RequestBody String data){
        Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
        baseInfo.setHisUserid(this.getCurrentMachine().getHisUser());
        HisEntityResponse<Patient> response = hisPatientManager.bindCard(baseInfo);
        if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getEntity()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
    }
	
	/**
	 * 生成就诊卡收费订单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/card/order",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateCardOrder(@RequestBody String data){
		System.out.println("forCreateCardOrder : "+data);
		Patient param =  JSONUtils.deserialize(data, Patient.class);
		HisEntityResponse<Patient> response =  hisPatientManager.getPatientByPatientNo(param);
		Patient patient = response.getEntity();
		Machine machine = this.getCurrentMachine();
		Map<String,Order> result = new HashMap<String,Order>();
		Order consume = new Order();
		consume.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
		//病人信息
		consume.setPatientNo(patient.getNo());//病人姓名
		consume.setPatientName(patient.getName());//病人姓名	
		consume.setPatientIdNo(patient.getIdNo());//病人身份证号
		consume.setPatientCardNo(patient.getMedicalCardNo());//病人卡号	
		consume.setPatientCardType(patient.getCardType());//就诊卡类型 TODO 就诊卡
		consume.setHisNo(machine.getHospitalNo());
		//订单信息
		Date now = new Date();
		consume.setAmt(new BigDecimal(getProfileFee().getDj()));//建档//PROFILE_AMT
		consume.setSelfAmt(consume.getAmt());
		consume.setCreateTime(now);
		consume.setStatus(Order.ORDER_STAT_INITIAL);
		consume.setOrderType(Order.ORDER_TYPE_PAY);
		consume.setOrderDesc("办理就诊卡建档收费");
		consume.setBizBean("");//消费没有回调
		consume.setBizType(Order.BIZ_TYPE_PROFILE);//办卡
		consume.setOrderTitle("就诊人"+consume.getPatientName()+"消费建档费"+consume.getAmt()+"元");	
		
		consume.setMachineId(machine.getId());//自助机id
		consume.setMachineMac(machine.getMac());//自助机mac地址
		consume.setMachineCode(machine.getCode());
		consume.setMachineName(machine.getName());//自助机名称
		consume.setMachineUser(machine.getHisUser());
		consume.setMachineMngCode(machine.getMngCode());

		
		consume = this.orderManager.save(consume);
		result.put("consume", consume);
		if(patient.getBalance().compareTo(consume.getAmt()) == -1){//生成充值订单
			Order recharge = new Order();
			recharge.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
			recharge.setPatientNo(patient.getNo());//病人姓名
			recharge.setPatientName(patient.getName());//病人姓名	
			recharge.setPatientIdNo(patient.getIdNo());//病人身份证号
			recharge.setPatientCardNo(patient.getMedicalCardNo());//病人卡号	
			recharge.setPatientCardType(patient.getCardType());//就诊卡类型 TODO 就诊卡
			recharge.setHisNo(machine.getHospitalNo());
			recharge.setOrderType(Order.ORDER_TYPE_PAY);
			recharge.setAmt(consume.getAmt().subtract(patient.getBalance()));
			recharge.setSelfAmt(recharge.getAmt());
			recharge.setCreateTime(now);
			recharge.setStatus(Order.ORDER_STAT_INITIAL);
			recharge.setOrderDesc("建档余额不足充值");
			recharge.setBizBean("hisDepositManager");//充值回调
			recharge.setBizType(Order.BIZ_TYPE_PRESTORE);//充值
			
			recharge.setMachineId(machine.getId());//自助机id
			recharge.setMachineMac(machine.getMac());//自助机mac地址
			recharge.setMachineCode(machine.getCode());
			recharge.setMachineName(machine.getName());//自助机名称
			recharge.setMachineUser(machine.getHisUser());
			recharge.setMachineMngCode(machine.getMngCode());
			
			recharge.setOrderTitle("就诊人"+recharge.getPatientName()+"鉴定充值"+recharge.getAmt()+"元");
			recharge = this.orderManager.save(recharge);
			
			result.put("recharge", recharge);
		}
		return ResultUtils.renderSuccessResult(result);
	}
	/**
	 * 生成补办就诊卡收费订单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/card/order/reissue",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReissueCardOrder(@RequestBody String data){
		Patient param =  JSONUtils.deserialize(data, Patient.class);
		HisEntityResponse<Patient> response =  hisPatientManager.getPatientByPatientNo(param);
		Patient patient = response.getEntity();
		Machine machine = this.getCurrentMachine();
		Map<String,Order> result = new HashMap<String,Order>();
		Order consume = new Order();
		consume.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
		//病人信息
		consume.setPatientNo(patient.getNo());//病人姓名
		consume.setPatientName(patient.getName());//病人姓名	
		consume.setPatientIdNo(patient.getIdNo());//病人身份证号
		consume.setPatientCardNo(patient.getMedicalCardNo());//病人卡号	
		consume.setPatientCardType(patient.getCardType());//就诊卡类型 TODO 就诊卡
		consume.setHisNo(machine.getHospitalNo());
		//订单信息
		Date now = new Date();
		consume.setAmt(new BigDecimal(getCardFee().getDj()));//补卡费CARD_AMT
		consume.setSelfAmt(consume.getAmt());
		consume.setCreateTime(now);
		consume.setStatus(Order.ORDER_STAT_INITIAL);
		consume.setOrderType(Order.ORDER_TYPE_PAY);
		consume.setOrderDesc("补办就诊卡收费");
		consume.setBizBean("");//消费没有回调
		consume.setBizType(Order.BIZ_TYPE_CARD);//办卡
		consume.setOrderTitle("就诊人"+consume.getPatientName()+"消费补卡费"+consume.getAmt()+"元");	
		
		consume.setMachineId(machine.getId());//自助机id
		consume.setMachineMac(machine.getMac());//自助机mac地址
		consume.setMachineCode(machine.getCode());
		consume.setMachineName(machine.getName());//自助机名称
		consume.setMachineUser(machine.getHisUser());
		consume.setMachineMngCode(machine.getMngCode());

		
		consume = this.orderManager.save(consume);
		result.put("consume", consume);
		if(patient.getBalance().compareTo(consume.getAmt()) == -1){//生成充值订单
			Order recharge = new Order();
			recharge.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
			recharge.setPatientNo(patient.getNo());//病人姓名
			recharge.setPatientName(patient.getName());//病人姓名	
			recharge.setPatientIdNo(patient.getIdNo());//病人身份证号
			recharge.setPatientCardNo(patient.getMedicalCardNo());//病人卡号	
			recharge.setPatientCardType(patient.getCardType());//就诊卡类型 TODO 就诊卡
			recharge.setHisNo(machine.getHospitalNo());
			recharge.setOrderType(Order.ORDER_TYPE_PAY);
			recharge.setAmt(consume.getAmt().subtract(patient.getBalance()));
			recharge.setSelfAmt(recharge.getAmt());
			recharge.setCreateTime(now);
			recharge.setStatus(Order.ORDER_STAT_INITIAL);
			recharge.setOrderDesc("补办就诊卡余额不足充值");
			recharge.setBizBean("hisDepositManager");//充值回调
			recharge.setBizType(Order.BIZ_TYPE_PRESTORE);//充值
			
			recharge.setMachineId(machine.getId());//自助机id
			recharge.setMachineMac(machine.getMac());//自助机mac地址
			recharge.setMachineCode(machine.getCode());
			recharge.setMachineName(machine.getName());//自助机名称
			recharge.setMachineUser(machine.getHisUser());
			recharge.setMachineMngCode(machine.getMngCode());
			
			recharge.setOrderTitle("就诊人"+recharge.getPatientName()+"补卡充值"+recharge.getAmt()+"元");
			recharge = this.orderManager.save(recharge);
			
			result.put("recharge", recharge);
		}
		return ResultUtils.renderSuccessResult(result);
	}
	/**
	 * 办理就诊卡（记录） 收费后 吐卡前
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/card/issue",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateCard(@RequestBody String data){
		Patient card2bind = JSONUtils.deserialize(data, Patient.class);
		card2bind.setHisUserid(this.getCurrentMachine().getHisUser());
		HisEntityResponse<Patient> response =  hisPatientManager.bindCard(card2bind);
		if(response.isSuccess()){
			HisEntityResponse<Patient> patient = hisPatientManager.getPatientByPatientNo(card2bind);
			Patient card =patient.getEntity();
			if(null != card){
				return ResultUtils.renderSuccessResult(card);
			}else{
				return ResultUtils.renderFailureResult();
			}
		}else{
			return ResultUtils.renderFailureResult();
		}
	}
	/**
	 * 支付卡费 并发卡
	 * @deprecated
	 * @return
	 */
	@RequestMapping(value="/card/payAndIssue/{orderId}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayCard(@PathVariable("orderId") String orderId,  @RequestBody String data){
		Patient card2bind = JSONUtils.deserialize(data, Patient.class);
		card2bind.setHisUserid(this.getCurrentMachine().getHisUser());
		Order order = this.orderManager.get(orderId);
		order.setRealAmt( order.getSelfAmt() );
		order.setTranTime(new Date());	
		order.setStatus("0");
		order.setFinishTime(new Date());
		this.orderManager.save(order);
		HisEntityResponse<Patient> response =  hisPatientManager.bindCard(card2bind);
		if(null == response || !response.isSuccess()){
			return ResultUtils.renderFailureResult("绑卡失败");
		}
		HisEntityResponse<Patient> patient =  hisPatientManager.getPatientByPatientNo(card2bind);
//		Patient card = response.getEntity();
//		card.setAccountNo(card.getAccountNo());
		return ResultUtils.renderSuccessResult(patient.getEntity());
	}
	/**
	 * 办理就诊卡（记录） 收费后 吐卡前
	 * @param data(no-病人编号,cardStatus(0-无效，1-有效))
	 * 
	 * @return
	 */
	@RequestMapping(value="/card/change", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forChangeCard(@RequestBody String data){
		Patient card2bind = JSONUtils.deserialize(data, Patient.class);
		card2bind.setHisUserid(this.getCurrentMachine().getHisUser());
		HisEntityResponse<Patient> response =  hisPatientManager.changeCardStatus(card2bind);
		return ResultUtils.renderSuccessResult((Patient)response.getEntity());
	}
	
	/**
     * 患者登录
     * @param data
     * @return
     */
	@RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data) {
		Patient loginInfo = JSONUtils.deserialize(data, Patient.class);
		if (!StringUtils.isEmpty(loginInfo.getMedicalCardNo())) {
			List<Operator> operators = this.operatorManager.find("from Operator where medicalCardNo = ? ", loginInfo.getMedicalCardNo());
			if(operators != null && operators.size() == 1){
				Operator operator = operators.get(0);
				log.info("卡号 "+loginInfo.getMedicalCardNo()+"是运维人员");
				this.getSession().setAttribute(SSMConstants.SSM_OPERATOR_KEY, operator);
				return ResultUtils.renderSuccessResult(operator);
			}
		}
		Patient patient = this.findLoginPatient(loginInfo);

		if (patient == null) {
			return ResultUtils.renderFailureResult();
		}
		this.getSession().setAttribute(SSMConstants.SSM_PATIENT_KEY, patient);
		return ResultUtils.renderSuccessResult(patient);
	}
	
	/**
	 * 患者登出
	 * @return
	 */
	@RequestMapping(value="/logout",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogout(){
		this.getSession().removeAttribute(SSMConstants.SSM_PATIENT_KEY);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value="/chargeItem/{xmid}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forChargeItemInfo(@PathVariable("xmid") String xmid){
		HisEntityResponse<ChargeItem> response =  hisPatientManager.chargeItemInfo(xmid);
		return ResultUtils.renderSuccessResult((ChargeItem)response.getEntity());
	}

	private List<Patient> filterByUnitCode(List<Patient> patients,String unitCode){
		List<Patient> profiles = new ArrayList<Patient>();
		if(null != patients && patients.size() > 0 ){
			for( Patient patient : patients){
				String unit = patient.getUnitCode();
				if(unitCode.equals(unit)) profiles.add(patient);
				if(StringUtils.isEmpty(unit)) profiles.add(patient);//TODO 测试用
			}
		}
		return profiles;
	}
	//逻辑解释
	//如果用身份证查询，返回自费档案
	//如果用医保卡内数据查询，返回医保关联的自费卡
	
	public Patient findPatient(Patient searchInfo ){
		HisEntityResponse<Patient> response = null;
		if(!StringUtils.isEmpty(searchInfo.getNo())){
			response = hisPatientManager.getPatientByPatientNo(searchInfo);
		}else if(!StringUtils.isEmpty(searchInfo.getMedicalCardNo())){
	    	response = hisPatientManager.getPatientByCardNo(searchInfo);
	    }
	    
	    if(null != response && response.isSuccess() && null!= response.getEntity()){
	    	return response.getEntity();
	    }
	    
	    if(!StringUtils.isEmpty(searchInfo.getIdNo())){
	    	HisListResponse<Patient> listResponse = hisPatientManager.getPatientByIdNo(searchInfo);
	    	if(null == listResponse || !listResponse.isSuccess()){
	    		return null;
		    }
	    	List<Patient> patients = filterByUnitCode(listResponse.getList(), searchInfo.getUnitCode());
	    	if(null == patients || patients.size() != 1 ){
	    		return null;
	    	}	 
	    	return patients.get(0);
	    }
	    return null;
	}

	public Patient findLoginPatient(Patient searchInfo) {

		HisEntityResponse<Patient> response = null;
		if (!StringUtils.isEmpty(searchInfo.getNo())) {
			response = hisPatientManager.getPatientByPatientNo(searchInfo);
		} else if (!StringUtils.isEmpty(searchInfo.getMedicalCardNo())) {
			response = hisPatientManager.getPatientByCardNo(searchInfo);
		}

		if (null != response && response.isSuccess() && null != response.getEntity()) {
			
			Patient self = response.getEntity();
			if(StringUtils.isEmpty(self.getRelationCard())){
				return self;
			}
			Patient mi = getMiPatient(self);
			if(mi != null)return mi; 
		}

		if (!StringUtils.isEmpty(searchInfo.getIdNo())) {
			HisListResponse<Patient> listResponse = hisPatientManager.getPatientByIdNo(searchInfo);
			if (null == listResponse || !listResponse.isSuccess()) {
				return null;
			}
			List<Patient> patients = filterByUnitCode(listResponse.getList(), searchInfo.getUnitCode());
			if (null == patients || patients.size() != 1) {
				return null;
			}
			Patient self = patients.get(0);
			if(StringUtils.isEmpty(self.getRelationCard())){
				return self;
			}
			return getMiPatient(self);
		}
		return null;
	}
	private Patient getMiPatient(Patient self){
		Patient miSearch = new Patient();
		miSearch.setMiCardNo(self.getRelationCard());
		HisEntityResponse<Patient> miResponse = hisPatientManager.getPatientByCardNo(miSearch);
		
		if (null != miResponse && miResponse.isSuccess() && null != miResponse.getEntity()) {
			return miResponse.getEntity();
		}
		return null;
	}
	
//	private Patient getMiPatient(Patient self){
//		Patient miSearch = new Patient();
//		miSearch.setIdNo(self.getIdNo());
//		miSearch.setNo("0000099564");
//		Patient test = hisPatientManager.getPatientByPatientNo(miSearch).getEntity();
//		
//		HisListResponse<Patient> miResponse = hisPatientManager.getPatientByIdNo(miSearch);
//		
//		if (null != miResponse && miResponse.isSuccess() && null != miResponse.getList()) {
//			List<Patient> patients =  miResponse.getList();
//			for(Patient p: patients){
//				System.out.println(p.getMedicalCardNo());
//				System.out.println(p.getMiCardNo());
//			}
//			
//		}
//		return null;
//	}
	
	private ChargeItem getCardFee(){
		SSMConfig config = configManager.findOne("from SSMConfig where code = ? ", "fee.card");
		if(null != config && "false".equals(config.getValue())){
			ChargeItem item = new ChargeItem();
			item.setDj("0");
			return item;
			
		}
		HisEntityResponse<ChargeItem> response = this.hisPatientManager.chargeItemInfo("6581");//磁卡费
		return response.getEntity();
	}
	private ChargeItem getProfileFee(){
		
		SSMConfig config = configManager.findOne("from SSMConfig where code = ? ", "fee.profile");
		if(null != config && "false".equals(config.getValue())){
			ChargeItem item = new ChargeItem();
			item.setDj("0");
			return item;
			
		}
		HisEntityResponse<ChargeItem> response = this.hisPatientManager.chargeItemInfo("22868");//出诊病人建档费
		return response.getEntity();
	}
}
