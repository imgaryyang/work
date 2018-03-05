package com.lenovohit.hcp.outpatient.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.outpatient.model.IVisitRecord;

/**
 * 就诊记录查询
 */
@RestController
@RequestMapping("/hcp/app/odws/visitRecord")
public class IVisitRecordController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	
	/**
	 * 根据条件查询患者就诊记录
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IVisitRecord query = JSONUtils.deserialize(data, IVisitRecord.class);
		StringBuilder regJql = new StringBuilder("from RegInfo reg where ");
		List<Object> values = new ArrayList<Object>();
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			regJql.append(" reg.hosId = ? ");
			values.add(query.getHosNo());
		}else{
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
		if(query!=null){
		//医院编号
		/*if (!StringUtils.isEmpty(query.getHosNo())) {
			regJql.append("and hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			regJql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}*/
		//档案编号
		if (!StringUtils.isEmpty(query.getNo())) {
			regJql.append("and reg.patient.patientId = ? ");
			values.add(query.getNo());
		}
		//档案名称
		/*if (!StringUtils.isEmpty(query.getProName())) {
			regJql.append("and patient.name like ? ");
			values.add("%" + query.getProName() + "%");
		}*/
		// 诊疗卡
		/*if (!StringUtils.isEmpty(query.getCardNo())) {
			regJql.append("and  patient.medicalCardNo = ?  ");
			values.add(query.getCardNo());
		}
		//卡状态
		if(!StringUtils.isEmpty(query.getCardType())){
			regJql.append("and  patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}*/
		//开始日期 -结束日期
		/*if (query.getStartDate()!=null && query.getEndDate()!=null) {
			regJql.append("and reateTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			regJql.append("and reateTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}*/
		}
		List<RegInfo> regInfos=(List<RegInfo>) medicalOrderManager.findByJql(regJql.toString(), values.toArray());
		List<IVisitRecord> ivisitRecords=ConventHisModel(regInfos);
		return ResultUtils.renderPageResult(ivisitRecords);
	}



	/**
	 * @param regInfos
	 * @return
	 */
	private List<IVisitRecord> ConventHisModel(List<RegInfo> regInfos) {
		List<IVisitRecord> ivisitRecords = new ArrayList<IVisitRecord>();
		for(int i = 0;i < regInfos.size(); i++ ){
			IVisitRecord ivisitRecord =Convent(regInfos.get(i));
			ivisitRecords.add(ivisitRecord);
		}
		return ivisitRecords;
	}



	/**
	 * @param regInfo
	 * @return
	 */
	private IVisitRecord Convent(RegInfo regInfo) {
		IVisitRecord ivisitRecord =new IVisitRecord();
		ivisitRecord.setHosNo(regInfo.getHosId());
		//ivisitRecord.setHosName(hospitalManager.findOneByProp("hosId", regInfo.getHosId()).getHosName());
		ivisitRecord.setDepNo(regInfo.getRegDept().getDeptId());
		ivisitRecord.setDepName(regInfo.getRegDept().getDeptName());
		ivisitRecord.setDocNo(regInfo.getSeeNo());
		ivisitRecord.setDocName(regInfo.getSeeDoc()!=null? regInfo.getSeeDoc().getName():null);
		ivisitRecord.setProNo(regInfo.getPatient().getPatientId());
		ivisitRecord.setProName(regInfo.getPatient().getName());
		// ivisitRecord.setCardNo(regInfo.getPatient().getMedicalCardNo());
		ivisitRecord.setActId(regInfo.getId());
		ivisitRecord.setActNo(regInfo.getRegId());
		ivisitRecord.setTreatStart(regInfo.getCancelTime());
		ivisitRecord.setTreatEnd(regInfo.getCreateEndTime());
		ivisitRecord.setStatus(regInfo.getRegState());
		ivisitRecord.setId(regInfo.getId());
		ivisitRecord.setComplaint(regInfo.getRemark());
		return ivisitRecord;
	}



	
}
