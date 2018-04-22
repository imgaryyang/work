package com.lenovohit.ssm.treat.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.apache.cxf.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.treat.hisModel.EEGOrderReport;
import com.lenovohit.ssm.treat.manager.EEGManager;

@RestController
@RequestMapping("/ssm/treat/eeg")
public class EEGRestController extends BaseRestController {
	
//	@Autowired
//	private HisPatientManager hisPatientManager;
	@Autowired
	private EEGManager<EEGOrderReport, String> eEGOrderReportManager;
	
	
	/**
	 * 心电图分页查询
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		EEGOrderReport query =  JSONUtils.deserialize(data, EEGOrderReport.class);
		StringBuilder jql = new StringBuilder( " from EEGOrderReport where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		//非自费患者设置关联卡病人编号
//		if (!"0000".equals(query.getPatientNo())) {//查找关联的医保患者自费卡
//			Patient args = new Patient();
//			args.setMiCardNo(query.getPatientNo());// 只有查询条件
//			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
//			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
//			if (null != miRelaPatient && miRelaPatient.size() == 1) {
//				Patient patient = miRelaPatient.get(0);
//				System.out.println("关联卡病人编号 "+patient.getNo());
//				if(!StringUtils.isEmpty(patient.getNo())){
//					jql.append(" and patinetNo like ? ");
//					values.add("%"+patient.getNo()+"%");
//				}
//				
//			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
//				return ResultUtils.renderFailureResult("不存在关联的医保档案");
//			} else {
//				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
//			}
//		}else{
//			if(!StringUtils.isEmpty(query.getPatientNo())){
//				jql.append(" and patinetNo like ? ");
//				values.add("%"+query.getPatientNo()+"%");
//			}
//		}
		if(!StringUtils.isEmpty(query.getPatientNo())){
			jql.append(" and patinetNo = ? ");
			values.add(query.getPatientNo());
		}
		if(!StringUtils.isEmpty(query.getInpatientNo())){
			jql.append(" and inpatientNo = ? ");
			values.add(query.getInpatientNo());
		}
		if(!StringUtils.isEmpty(query.getStartDate())){
			jql.append(" and reportTime > ? ");
			values.add(DateUtils.string2Date(query.getStartDate(), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		}
		if(!StringUtils.isEmpty(query.getEndDate())){
			jql.append(" and reportTime < ? ");
			values.add(DateUtils.string2Date(query.getEndDate(), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		}
//		jql.append(" and reportFileName = ? ");
//		values.add("JZNK1FS2017091700010_4.jpg");
		jql.append(" order by reportTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		eEGOrderReportManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 心电图列表查询
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		EEGOrderReport query = JSONUtils.deserialize(data, EEGOrderReport.class);
		StringBuilder jql = new StringBuilder( " from EEGOrderReport where 1=1 ");
		List<Object> values = new ArrayList<Object>();
//		
//		//非自费患者设置关联卡病人编号
//		if (!"0000".equals(query.getPatientNo())) {//查找关联的医保患者自费卡
//			Patient args = new Patient();
//			args.setMiCardNo(query.getPatientNo());// 只有查询条件
////			args.setMiCardNo("530121A31489278");//手动设置医保患者卡内数据
//			HisListResponse<Patient> miRelaPatientResponse = hisPatientManager.getRelaCardByMiCardNo(args);// PATIENT0026
//			List<Patient> miRelaPatient = miRelaPatientResponse.getList();
//			if (null != miRelaPatient && miRelaPatient.size() == 1) {
//				Patient patient = miRelaPatient.get(0);
//				if(!StringUtils.isEmpty(patient.getNo())){
//					jql.append(" and patientNo = ? ");
//					values.add(patient.getNo());
//				}
//			} else if (null == miRelaPatient || miRelaPatient.size() <= 0) {
//				return ResultUtils.renderFailureResult("不存在关联的医保档案");
//			} else {
//				return ResultUtils.renderFailureResult("存在额外的医保档案信息");
//			}
//		}else{
//			if(!StringUtils.isEmpty(query.getPatientNo())){
//				jql.append(" and patientNo = ? ");
//				values.add(query.getPatientNo());
//			}
//		}
		if(!StringUtils.isEmpty(query.getPatientNo())){
			jql.append(" and patinetNo = ? ");
			values.add(query.getPatientNo());
		}
		if(!StringUtils.isEmpty(query.getInpatientNo())){
			jql.append(" and inpatientNo = ? ");
			values.add(query.getInpatientNo());
		}
		if(!StringUtils.isEmpty(query.getStartDate())){
			jql.append(" and reportTime > ? ");
			values.add(DateUtils.string2Date(query.getStartDate(), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		}
		if(!StringUtils.isEmpty(query.getEndDate())){
			jql.append(" and reportTime < ? ");
			values.add(DateUtils.string2Date(query.getEndDate(), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		}
//		jql.append(" and reportFileName = ? ");
//		values.add("JZNK1FS2017091700010_4.jpg");
		jql.append(" order by reportTime desc ");
		
		List<EEGOrderReport> records = eEGOrderReportManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(records);
	}
	/**
	 * 心电图详情打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/{patientId}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrint(@PathVariable("patientId") String patientId){
		return ResultUtils.renderSuccessResult();
	}
}
