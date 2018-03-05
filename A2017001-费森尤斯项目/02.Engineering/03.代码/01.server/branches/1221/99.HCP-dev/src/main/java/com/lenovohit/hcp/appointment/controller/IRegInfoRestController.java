package com.lenovohit.hcp.appointment.controller;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.manager.RegisterManager;
import com.lenovohit.hcp.appointment.manager.RegisterStatisticsManager;
import com.lenovohit.hcp.appointment.model.IActivity;
import com.lenovohit.hcp.appointment.model.RegFree;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.appointment.model.RegInfoStatisticsDto;
import com.lenovohit.hcp.appointment.model.RegRefundDto;
import com.lenovohit.hcp.appointment.model.RegVisit;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IMedCard;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * @author red
 * @date 2017年12月26日
 */
@RestController
@RequestMapping("/hcp/app/appointment/register/")
public class IRegInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<RegFree, String> regFreeManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private RegisterManager registerManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	
	/**
	 * 挂号
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		
		IActivity model = JSONUtils.deserialize(data, IActivity.class);
		Date now = new Date();
		StringBuilder jql = new StringBuilder(" from RegInfo ri  where ri.hosId = ? and ri.patient.patientId = ? and ri.regLevel = ? and Convert(char(10),ri.createTime,112) = ? and ri.regState <> ?");
		List<Object> values = new ArrayList<Object>();
		values.add(model.getHosNo());
	    values.add(model.getProId());
	    values.add(model.getClinicType()); //诊疗类型
		values.add(DateUtils.date2String(now, "yyyyMMdd"));
		values.add(RegInfo.REG_CANCELED);
		List<RegInfo> regList = regInfoManager.find(jql.toString(), values.toArray());
		if(regList==null || regList.size()<=0 ){
			RegInfo reg =new RegInfo();
			reg.setFeeType("1");
			reg.setMedicalCardNo(model.getCardNo());
			reg.setPatientId(model.getProNo());
			reg.setRegState(RegInfo.REG_RESERVE_NUMED);
			reg.setHosId(model.getHosNo());
			reg.setCreateOper(model.getOperator());
			reg.setCreateOperId(model.getOperatorId());
			HisOrder saved = null;
			try {
				checkRegInfo(reg);
				long before = System.currentTimeMillis();
				saved = this.registerManager.registerToPay(reg);
				long time = System.currentTimeMillis() - before;
				System.out.println("执行时间为：" + time);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(e.getMessage());
				return ResultUtils.renderFailureResult("挂号失败，失败原因为：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(reg);
		}else{
			return ResultUtils.renderFailureResult("挂号失败，失败原因为：患者已挂号，请直接就诊！！");
		}
		
	}
	private void checkRegInfo(RegInfo info) {
		if (StringUtils.isBlank(info.getPatientId()))
			throw new RuntimeException("病人id不能为空");
	}
	private RegInfo TransFormModelToHis(IActivity model) {
		// TODO Auto-generated method stub
		return null;
	}
	/**
	 * 取消挂号
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateToCanceled(@RequestBody String data) {
		try {
			IActivity model = JSONUtils.deserialize(data, IActivity.class);
			StringBuilder jql = new StringBuilder(" from RegInfo ri  where ri.hosId = ? and ri.patient.patientId = ? and ri.regDept.deptId = ? ");
			List<Object> values = new ArrayList<Object>();
			values.add(model.getHosNo());
		    values.add(model.getProNo());
		    values.add(model.getDepNo());
		    RegInfo reg = regInfoManager.findOne(jql.toString(), values.toArray());
			RegInfo info = this.regInfoManager.get(reg.getId());
			if (!(RegInfo.REG_RESERVE_NUMED.equals(info.getRegState()))) {
				throw new RuntimeException("挂号记录不符合退号条件，请检查");
			}
			HcpUser user = this.getCurrentUser();
			info.setCancelOper(user.getName());
			this.registerManager.cancel(info, user);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("退号失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 挂号记录查询
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		IActivity query = JSONUtils.deserialize(data, IActivity.class);
		StringBuilder jql = new StringBuilder(" from RegInfo ri where ri.hosId = ? and ri.invoiceNo is not null ");
		List<Object> values = new ArrayList<Object>();
		values.add(query.getHosNo());
		
		//档案编号
		if(!StringUtils.isEmpty(query.getProNo())){
			jql.append("and ri.patient.patientId = ? ");
			values.add(query.getProNo());
		}
		//档案姓名
		if(!StringUtils.isEmpty(query.getProName())){
			jql.append("and ri.patient.name like ? ");
			values.add("%" + query.getProName() + "%");
		}
		
		//卡号
		if(!StringUtils.isEmpty(query.getCardNo())){
			jql.append("and  ri.patient.medicalCardNo = ? ");
			values.add(query.getCardNo());
		}
		//卡状态
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and  ri.patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}
		//手机号
		if(!StringUtils.isEmpty(query.getMobile())){
			jql.append("and ri.patient.mobile = ? ");
			values.add(query.getMobile());
		}
		//身份证号
		if (!StringUtils.isEmpty(query.getIdNo())) {
			jql.append("and ri.patient.idNo = ? ");
			values.add(query.getIdNo());
		}
		//开始日期 -结束日期
		if (!StringUtils.isEmpty(query.getStartDate())&& !StringUtils.isEmpty(query.getEndDate())) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			jql.append("and ri.createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		
		List<RegInfo> regins = (List<RegInfo>) regInfoManager.findByJql(jql.toString(), values.toArray());
		List<IActivity> iactivities=TransFormHisModel(regins);
		return ResultUtils.renderPageResult(iactivities);

	}
	/**
	 * @param regins
	 * @return
	 */
	private List<IActivity> TransFormHisModel(List<RegInfo> regins) {
		List<IActivity> iactivities=new ArrayList<IActivity>();
		for(int i=0;i<regins.size();i++){
			RegInfo reginfo=regins.get(i);
			iactivities.add(TransFormModel(reginfo));
		}
		return iactivities;
	}
	private IActivity TransFormModel(RegInfo reginfo) {
		IActivity iactivity=new IActivity();
		List<Object> values=new ArrayList<Object>();
		String[] fee=new String[]{"regId","feeCode"};
		values.add(reginfo.getId());
		values.add("004");
		OutpatientChargeDetail regFee = outpatientChargeDetailManager.findOneByProps(fee, values.toArray());
		iactivity.setRegFee(regFee.getTotCost());
		values.remove(1);
		values.add("007");
		OutpatientChargeDetail  treatFee = outpatientChargeDetailManager.findOneByProps(fee, values.toArray());
		iactivity.setTreatFee(treatFee.getTotCost());
		//医生信息
		iactivity.setDocNo(reginfo.getSeeNo());
		iactivity.setDocName(reginfo.getSeeDoc().getName());
		//科室
		iactivity.setDepNo(reginfo.getRegDept().getDeptId());
		iactivity.setDepName(reginfo.getRegDept().getDeptName());
		//病人信息
		iactivity.setHosNo(reginfo.getHosId());
		iactivity.setHosName(hospitalManager.get(reginfo.getHosId()).getHosName());
		iactivity.setMobile(reginfo.getPatient().getMobile());
		iactivity.setIdNo(reginfo.getPatient().getIdNo());
		iactivity.setProId(reginfo.getPatient().getPatientId());
		iactivity.setProName(reginfo.getPatient().getName());
		iactivity.setAppointTime(reginfo.getRegTime());
	
	return iactivity;
}
	

}
