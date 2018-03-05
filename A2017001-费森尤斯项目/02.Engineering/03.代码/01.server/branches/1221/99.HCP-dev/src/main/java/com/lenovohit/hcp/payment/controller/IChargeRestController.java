package com.lenovohit.hcp.payment.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.payment.model.ICharge;
import com.lenovohit.hcp.payment.model.IChargeDetail;

/**    
 *         
 * 类描述：   门诊确认收费
 *@author GW
 *@date 2017年4月10日          
 *     
 */
@RestController
@RequestMapping("/hcp/app/payment/outpatientCharge")
public class IChargeRestController extends HcpBaseRestController {
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<CommonItemInfo, String> commonItemManager;





	/**
	 * 功能描述：查询病人待缴费明细
	 * 
	 * @param data
	 * @return
	 * @author red
	 * @date 2017年4月7日
	 */
	@RequestMapping(value = "/findChargeDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forfindChargeDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		IChargeDetail query = JSONUtils.deserialize(data, IChargeDetail.class);
		StringBuilder jql = new StringBuilder("from OutpatientChargeDetail  where applyState = '0' ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			//医院编号
			if (!StringUtils.isEmpty(query.getHosNo())) {
				jql.append("and hosId = ? ");
				values.add(query.getHosNo());
			}
			//医院名称
			if (!StringUtils.isEmpty(query.getHosName())) {
				jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
				values.add("%" + query.getHosName() + "%");
			}
			//档案编号
			if (!StringUtils.isEmpty(query.getProNo())) {
				jql.append("and patient.patientId = ? ");
				values.add(query.getProNo());
			}
			//档案名称
			if (!StringUtils.isEmpty(query.getProName())) {
				jql.append("and patient.name like ? ");
				values.add("%" + query.getProName() + "%");
			}
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getCardNo())) {
				jql.append("and patient.medicalCardNo = ?  ");
				values.add(query.getCardNo());
			}

			//诊疗活动编号
			if (!StringUtils.isEmpty(query.getActivityNo())) {
				jql.append("and regId in (select id from RegInfo where regId = ? ) ");
				values.add(query.getActivityNo());
			}
			//项目名称
			if (!StringUtils.isEmpty(query.getName())) {
				jql.append("and itemName = ? ");
				values.add(query.getName());
			}
			//开始日期 -结束日期
			/*	if (query.getStartDate()!=null && query.getEndDate()!=null) {
			jql.append("and createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			jql.append("and createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}*/
		}
		List<OutpatientChargeDetail> chargeDetailList=(List<OutpatientChargeDetail>) outpatientChargeDetailManager.findByJql(jql.toString(), values.toArray());
		List<IChargeDetail> records=ConventHisModel(chargeDetailList);
		return ResultUtils.renderSuccessResult(records);
	}
	
	@RequestMapping(value = "/getPreChargeInfo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result getPreChargeInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		List<IChargeDetail> chagerList = JSONUtils.parseObject(data, new TypeReference<List<IChargeDetail>>() {
		});
		ICharge charge = new ICharge();
		BigDecimal total = new BigDecimal(0);
		if(chagerList!=null && chagerList.size()>0){
			for(int i=0;i<chagerList.size();i++){
				IChargeDetail detail = chagerList.get(i);
				if(i == 0){
					BeanUtils.copyProperties(detail, charge);
				}
				total = total.add(detail.getCost());
			}
		}
		charge.setAmt(total);
		charge.setReduceAmt(total.multiply(new BigDecimal(0.1)));
		charge.setMyselfAmt(total.multiply(new BigDecimal(0.9)));
		return ResultUtils.renderSuccessResult(charge);
	}
	/**
	 * @param chargeDetailList
	 * @return
	 */
	private List<IChargeDetail> ConventHisModel(List<OutpatientChargeDetail> chargeDetailList) {
		List<IChargeDetail> ichargeDetails=new ArrayList<IChargeDetail>();
		for(int i=0;i<chargeDetailList.size();i++){
			OutpatientChargeDetail chargeDetails=chargeDetailList.get(i);
			ichargeDetails.add(TransFormModel(chargeDetails));
		}
		return ichargeDetails;
	}
	/**
	 * @param chargeDetails
	 * @return
	 */
	private IChargeDetail TransFormModel(OutpatientChargeDetail chargeDetails) {
		IChargeDetail ichargeDetail = new IChargeDetail();
		ichargeDetail.setHosNo(chargeDetails.getHosId());
		Hospital hos=hospitalManager.get(chargeDetails.getHosId());
		ichargeDetail.setHosName(hos!=null ? hos.getHosName():null);
		Department dept=departmentManager.get(chargeDetails.getRecipeDept().getId());
		ichargeDetail.setDepNo(dept!=null ? dept.getDeptId():null);
		ichargeDetail.setDepName(dept!=null ? dept.geteName():null);
		if(chargeDetails.getRecipeDoc()!=null){
			HcpUser doc=hcpUserManager.get(chargeDetails.getRecipeDoc().getId());
			ichargeDetail.setDocNo(doc!=null ? doc.getUserId():null);
			ichargeDetail.setDocName(doc!=null ? doc.getName():null);
		}
		// ichargeDetail.setProNo(chargeDetails.getPatient().getPatientId());
		// ichargeDetail.setProName(chargeDetails.getPatient().getName());
		//		ichargeDetail.setActivityNo(regInfoManager.get(chargeDetails.getRegId()).getRegId());
		List<CommonItemInfo> comm=commonItemManager.findByProp("itemId", chargeDetails.getItemCode());
		ichargeDetail.setCode(comm.size()!=0 && comm.get(0)!=null ?comm.get(0).getItemCode():null);
		ichargeDetail.setName(chargeDetails.getItemName());
		ichargeDetail.setSpec(chargeDetails.getSpecs());
		ichargeDetail.setUnit(chargeDetails.getUnit());
		ichargeDetail.setNum(chargeDetails.getQty());
		ichargeDetail.setPrice(chargeDetails.getSalePrice());
		ichargeDetail.setType((comm.size()!=0 && comm.get(0)!=null) ?comm.get(0).getFeeCode():null);
		ichargeDetail.setMyselfScale(chargeDetails.getOwnCost());
		ichargeDetail.setCost(chargeDetails.getTotCost());
		ichargeDetail.setAmount(chargeDetails.getTotCost());
		ichargeDetail.setRealAmount(chargeDetails.getOwnCost());
		ichargeDetail.setRecipeNo(chargeDetails.getRecipeId());
		ichargeDetail.setRecipeTime(chargeDetails.getRecipeTime());
		ichargeDetail.setStatus(chargeDetails.getDrugFlag());
		if(chargeDetails.getFeeCode().equals("004") || chargeDetails.getFeeCode().equals("007")){
			ichargeDetail.setType("1");
		}else{
			ichargeDetail.setType("2");
		}

		ichargeDetail.setChargeUser(chargeDetails.getChargeOper()!=null ? chargeDetails.getChargeOper().getName():"");
		ichargeDetail.setChargeTime(chargeDetails.getChargeTime());
		return ichargeDetail;
	}
	/**
	 * 功能描述：查询已缴费明细
	 * 
	 * @param data
	 * @return
	 * @author red
	 * @date 2017年4月7日
	 */
	@RequestMapping(value = "/findChargedDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forfindChargedDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		IChargeDetail query = JSONUtils.deserialize(data, IChargeDetail.class);
		StringBuilder jql = new StringBuilder("from OutpatientChargeDetail  where applyState = '1' ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			//医院编号
			if (!StringUtils.isEmpty(query.getHosNo())) {
				jql.append("and hosId = ? ");
				values.add(query.getHosNo());
			}
			//医院名称
			if (!StringUtils.isEmpty(query.getHosName())) {
				jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
				values.add("%" + query.getHosName() + "%");
			}
			//档案编号
			if (!StringUtils.isEmpty(query.getProNo())) {
				jql.append("and patient.patientId = ? ");
				values.add(query.getProNo());
			}
			//档案名称
			if (!StringUtils.isEmpty(query.getProName())) {
				jql.append("and patient.name like ? ");
				values.add("%" + query.getProName() + "%");
			}
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getCardNo())) {
				jql.append("and patient.medicalCardNo = ?  ");
				values.add(query.getCardNo());
			}
			/*	//卡状态
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and  patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}*/
			//诊疗活动编号
			if (!StringUtils.isEmpty(query.getActivityNo())) {
				jql.append("and regId in (select id from RegInfo where regId = ? ) ");
				values.add(query.getActivityNo());
			}
			//项目名称
			if (!StringUtils.isEmpty(query.getName())) {
				jql.append("and itemName = ? ");
				values.add(query.getName());
			}
			//开始日期 -结束日期
			/*	if (query.getStartDate()!=null && query.getEndDate()!=null) {
			jql.append("and createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			//jql.append("and createTime between ? and ? ");
			//values.add(HcpDateUtils.getBeginOfDay());
			//values.add(HcpDateUtils.getEndOfDay());
		}*/
		}
		List<OutpatientChargeDetail> chargeDetailList=(List<OutpatientChargeDetail>) outpatientChargeDetailManager.findByJql(jql.toString(), values.toArray());
		List<IChargeDetail> records=ConventHisModel(chargeDetailList);
		return ResultUtils.renderSuccessResult(records);
	}

}
