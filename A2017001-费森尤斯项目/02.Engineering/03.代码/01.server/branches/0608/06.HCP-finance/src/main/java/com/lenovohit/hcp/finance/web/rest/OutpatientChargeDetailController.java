package com.lenovohit.hcp.finance.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

/**
 * 收费管理
 */
@RestController
@RequestMapping("/hcp/finance/chargeDetail")
public class OutpatientChargeDetailController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;

	/**
	 * 根据条件查询收费信息
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		// 取当前用户
		HcpUser user = this.getCurrentUser();

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);

		OutpatientChargeDetail query = JSONUtils.deserialize(data, OutpatientChargeDetail.class);
		StringBuilder jql = new StringBuilder(" from OutpatientChargeDetail ocd where ocd.hosId=? and ocd.drugDept.id = ? ");
		List<Object> values = new ArrayList<Object>();
		// 医院id
		values.add(user.getHosId());
		// 取药药房id
		values.add(user.getLoginDepartment().getId());

		// 取药药房id
		/*if (!StringUtils.isEmpty(query.getDrugDeptId())) {
			jql.append("and ocd.drugDept.id = ? ");
			values.add(query.getDrugDeptId());
		}*/
		// 申请单状态
		if (!StringUtils.isEmpty(query.getApplyState())) {
			jql.append("and ocd.applyState = ? ");
			values.add(query.getApplyState());
		}

		// 发票号
		if (!StringUtils.isEmpty(query.getInvoiceNo())) {
			jql.append("and ocd.invoiceNo like ? ");
			values.add("%" + query.getInvoiceNo() + "%");
		}

		// 患者id
		if (!StringUtils.isEmpty(query.getPatientId())) {
			jql.append("and ocd.patient.id like ? ");
			values.add("%" + query.getPatientId() + "%");
		}

		// 诊疗卡或医保卡
		if (!StringUtils.isEmpty(query.getMedicalCardNo()) || !StringUtils.isEmpty(query.getMiCardNo())
				|| !StringUtils.isEmpty(query.getPatientName())) {
			jql.append("and ocd.patient.id in (select id from Patient where hosId=? ");
			values.add(user.getHosId());
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
				jql.append("and medicalCardNo like ? ");
				values.add("%" + query.getMedicalCardNo() + "%");
			}
			// 医保卡
			if (!StringUtils.isEmpty(query.getMiCardNo())) {
				jql.append("and miCardNo like ? ");
				values.add("%" + query.getMiCardNo() + "%");
			}
			// 患者姓名
			if (!StringUtils.isEmpty(query.getPatientName())) {
				jql.append("and name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			jql.append(")");
		}

		page.setQuery(jql.toString());
		page.setValues(values.toArray());

		outpatientChargeDetailManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 根据条件查询收费发票信息
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/invoice/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findInvoicePage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		// 取当前用户
		HcpUser user = this.getCurrentUser();

		/*
		 * Page page = new Page(); page.setStart(start);
		 * page.setPageSize(limit);
		 * 
		 * OutpatientChargeDetail query = JSONUtils.deserialize(data,
		 * OutpatientChargeDetail.class); StringBuilder jql = new StringBuilder(
		 * "select distinct ocd.invoiceNo, ocd.applyState, ocd.patient.id, " +
		 * "p.name, p.sex, p.birthday, " +
		 * "ocd.chargeOper, ocd.chargeTime, ocd.drugDept, " +
		 * "ri.seeDoc, ri.regTime, ri.feeType, hu.name " +
		 * "from OutpatientChargeDetail ocd, Patient p, RegInfo ri, HcpUser hu "
		 * +
		 * "where ocd.patient.id=p.id and ocd.regId=ri.id and ri.seeDoc=hu.id and ocd.hosId=? "
		 * ); List<Object> values = new ArrayList<Object>();
		 * values.add(user.getHosId());
		 * 
		 * //取药药房id if(!StringUtils.isEmpty(query.getDrugDeptId())){
		 * jql.append("and ocd.drugDept.id = ? ");
		 * values.add(query.getDrugDeptId()); } //申请单状态
		 * if(!StringUtils.isEmpty(query.getApplyState())){
		 * jql.append("and ocd.applyState = ? ");
		 * values.add(query.getApplyState()); }
		 * 
		 * //发票号 if(!StringUtils.isEmpty(query.getInvoiceNo())){
		 * jql.append("and ocd.invoiceNo like ? "); values.add("%" +
		 * query.getInvoiceNo() + "%"); }
		 * 
		 * //患者id if(!StringUtils.isEmpty(query.getPatientId())){
		 * jql.append("and ocd.patient.id like ? "); values.add("%" +
		 * query.getPatientId() + "%"); }
		 * 
		 * //诊疗卡或医保卡 if(!StringUtils.isEmpty(query.getMedicalCardNo()) ||
		 * !StringUtils.isEmpty(query.getMiCardNo()) ||
		 * !StringUtils.isEmpty(query.getPatientName())){ jql.
		 * append("and ocd.patient.id in (select id from Patient where hosId=? "
		 * ); values.add(user.getHosId()); //诊疗卡
		 * if(!StringUtils.isEmpty(query.getMedicalCardNo())){
		 * jql.append("and medicalCardNo like ? "); values.add("%" +
		 * query.getMedicalCardNo() + "%"); } //医保卡
		 * if(!StringUtils.isEmpty(query.getMiCardNo())){
		 * jql.append("and miCardNo like ? "); values.add("%" +
		 * query.getMiCardNo() + "%"); } //患者姓名
		 * if(!StringUtils.isEmpty(query.getPatientName())){
		 * jql.append("and name like ? "); values.add("%" +
		 * query.getPatientName() + "%"); } jql.append(")"); }
		 * 
		 * page.setQuery(jql.toString()); page.setValues(values.toArray());
		 * 
		 * outpatientChargeDetailManager.findPage(page); return
		 * ResultUtils.renderPageResult(page);
		 */

		OutpatientChargeDetail query = JSONUtils.deserialize(data, OutpatientChargeDetail.class);
		StringBuilder sql = new StringBuilder(
				"SELECT DISTINCT  ocd.INVOICE_NO,  ocd.APPLY_STATE,  ocd.PATIENT_ID,  p.NAME as PATIENT_NAME,  p.SEX,  p.BIRTHDAY,  "
						+ "ocd.CHARGE_OPER,  ocd.CHARGE_TIME,  ocd.DRUG_DEPT,  ri.SEE_DOC,  ri.REG_TIME,  ri.FEE_TYPE, hu.NAME as DOC_NAME "
						+ "FROM  OC_CHARGEDETAIL ocd,  B_PATIENTINFO p,  REG_INFO ri,  HCP_USER hu "
						+ "WHERE  ocd.PATIENT_ID = p.ID AND ocd.REG_ID = ri.ID AND ri.SEE_DOC = hu.ID "
						+ "AND ocd.HOS_ID = ? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());

		// 取药药房id
		if (!StringUtils.isEmpty(query.getDrugDeptId())) {
			sql.append("and ocd.DRUG_DEPT = ? ");
			values.add(query.getDrugDeptId().trim());
		}
		// 申请单状态
		if (!StringUtils.isEmpty(query.getApplyState())) {
			sql.append("and ocd.APPLY_STATE = ? ");
			values.add(query.getApplyState().trim());
		}

		// 发票号
		if (!StringUtils.isEmpty(query.getInvoiceNo())) {
			sql.append("and ocd.INVOICE_NO like ? ");
			values.add("%" + query.getInvoiceNo().trim() + "%");
		}

		// 患者id
		if (!StringUtils.isEmpty(query.getPatientId())) {
			sql.append("and ocd.PATIENT_ID like ? ");
			values.add("%" + query.getPatientId().trim() + "%");
		}

		// 诊疗卡或医保卡
		if (!StringUtils.isEmpty(query.getMedicalCardNo()) || !StringUtils.isEmpty(query.getMiCardNo())
				|| !StringUtils.isEmpty(query.getPatientName())) {
			sql.append("and ocd.PATIENT_ID in (select ID from B_PATIENTINFO where HOS_ID=? ");
			values.add(user.getHosId().trim());
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
				sql.append("and MEDICAL_CARD_NO like ? ");
				values.add("%" + query.getMedicalCardNo().trim() + "%");
			}
			// 医保卡
			if (!StringUtils.isEmpty(query.getMiCardNo())) {
				sql.append("and MI_CARD_NO like ? ");
				values.add("%" + query.getMiCardNo().trim() + "%");
			}
			// 患者姓名
			if (!StringUtils.isEmpty(query.getPatientName())) {
				sql.append("and NAME like ? ");
				values.add("%" + query.getPatientName().trim() + "%");
			}
			sql.append(")");
		}

		List<Object> result = (List<Object>) this.outpatientChargeDetailManager.findBySql(sql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(result);
	}

}
