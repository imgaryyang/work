package com.lenovohit.hcp.odws.web.rest;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.onws.moddel.PatientStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;

/**
 * 护士确认保管执行单
 */
@RestController
@RequestMapping("/hcp/onws/patientStoreExec")
public class PatientStoreExecController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<PatientStoreExec, String> patientStoreExecManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<ItemInfo, String> itemInfoManager;
	/**    
	 * 功能描述：检索看诊项目
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月14日             
	*/
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		StringBuilder jql = new StringBuilder("select op from OutpatientChargeDetail op, ItemInfo item where op.itemCode = item.id AND (op.invoiceNo not in (select invoiceNo from RegInfo) or op.invoiceNo IS NULL) and op.feeCode != '001' AND op.feeCode != '002' AND op.feeCode != '003' AND item.exec = true ");
		List<Object> values = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		String medicalCardNo = "";
		String name = "";
		String regId = "";
		String IDCard = "";
		Boolean isEffect = false;
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null){
			medicalCardNo = json.getString("medicalCardNo");
			name = json.getString("name");
			regId = json.getString("regId");
			IDCard = json.getString("IDCard");
			dateRange = json.getJSONArray("dateRange");
			isEffect = json.getBoolean("isEffect");
		}
		if(!StringUtils.isEmpty(medicalCardNo)){
			jql.append(" and op.patient.medicalCardNo like ? ");
			values.add("%"+medicalCardNo+"%");
		}
		if(!StringUtils.isEmpty(name)){
			jql.append(" and op.patient.name like ? ");
			values.add("%"+name+"%");
		}
		if(!StringUtils.isEmpty(IDCard)){
			jql.append(" and op.patient.idNo like ? ");
			values.add("%"+IDCard+"%");
		}
		if(!StringUtils.isEmpty(regId)){
			jql.append(" and op.regId like ? ");
			values.add("%"+regId+"%");
		}
		if(dateRange!=null && dateRange.size()>0){
			Date startDate = stringToDate(dateRange.get(0).toString());
			Date endDate = stringToDate(dateRange.get(1).toString());
			if(startDate!=null && endDate!=null){
				jql.append(" and op.chargeTime between ? and  ? ");
				values.add(startDate);
				values.add(endDate);
			}
			
		}
		//有效
		/*if(isEffect!=null && isEffect){
			jql.append(" and remainQty >0 ");
		}*/
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		outpatientChargeDetailManager.findPage(page);
		if(page.getResult()!=null){
			List<OutpatientChargeDetail> detail = (List<OutpatientChargeDetail>) page.getResult();
			List<PatientStoreRecord> recordList = dataConversion(detail);
			page.setResult(recordList);
		}
		
		return ResultUtils.renderPageResult(page);
	}
	/**    
	 * 功能描述：查看执行单明细
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月14日             
	 */
	@RequestMapping(value = "/detailPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		PatientStoreExec query = JSONUtils.deserialize(data, PatientStoreExec.class);
		StringBuilder jql = new StringBuilder(" from PatientStoreExec  where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			if(!StringUtils.isEmpty(query.getRecipeId())){
				jql.append(" AND recipeId = ? ");
				values.add(query.getRecipeId());
			}
			if(query.getRecipeNo()!=null){
				jql.append(" AND recipeNo = ? ");
				values.add(query.getRecipeNo());
			}
			if(!StringUtils.isEmpty(query.getItemCode())){
				jql.append(" AND itemCode = ? ");
				values.add(query.getItemCode());
			}
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patientStoreExecManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	// 不分页
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<OutpatientChargeDetail> prts = outpatientChargeDetailManager.find(" from PatientStoreRecord prt where 1 = 1 order by prt.modelId ");
		return ResultUtils.renderSuccessResult(prts);
	}

	/**    
	 * 功能描述：添加记录
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月13日             
	*/
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreatePatientStoreRecord(@RequestBody String data) {
		List<PatientStoreRecord> patientStoreRecordList = JSONUtils.parseObject(data, new TypeReference<List<PatientStoreRecord>>() {});
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		List<PatientStoreExec> storeExecList = new ArrayList<PatientStoreExec>();
		try{
			if(patientStoreRecordList!=null && patientStoreRecordList.size()>0){
				for(PatientStoreRecord record : patientStoreRecordList){//循环取出本次记录进行插入记录表
					//本次确认数量不为空且大于0并且填写数量不大于剩余数量才记入记录
					if(record.getThisQty()!=null && record.getThisQty().compareTo(BigDecimal.ZERO)>0 
							&& record.getThisQty().compareTo(record.getRemainQty())<= 0){
						PatientStoreExec storeExec = new PatientStoreExec();
						storeExec.setHosId(user.getHosId());				//医院
						storeExec.setPatientId(record.getPatient().getId());//病人id
						storeExec.setName(record.getPatient().getName());	//姓名
						storeExec.setRecipeId(record.getRecipeId());		//处方Id
						storeExec.setRecipeNo(record.getRecipeNo());		//处方序号
						storeExec.setItemCode(record.getItemId());//项目id
						if(record.getItemId()!=null){
							ItemInfo info = itemInfoManager.get(record.getItemId());
							storeExec.setSpecs(info.getSpecs());			//规格
						}
						storeExec.setItemName(record.getItemName());
						storeExec.setQty(record.getThisQty());
						storeExec.setUnit(record.getUnit());
						storeExec.setUnitPrice(record.getUnitPrice());//单价
						storeExec.setCombNo(record.getCombNo());//组号
						storeExec.setExecOper(user.getName());	//操作人信息
						storeExec.setCreateOper(user.getName());
						storeExec.setCreateOperId(user.getId());
						storeExec.setCreateTime(now);
						storeExec.setUpdateOper(user.getName());
						storeExec.setUpdateOperId(user.getId());
						storeExec.setUpdateTime(now);
						storeExecList.add(storeExec);
					}
				}
			}
			
			if(storeExecList!=null && storeExecList.size()>0){
				patientStoreExecManager.batchSave(storeExecList);
				return ResultUtils.renderSuccessResult();
			}else{
				return ResultUtils.renderFailureResult("没有数据需要提交！！");
			}
		}catch(Exception e1){
			e1.printStackTrace();
			return ResultUtils.renderFailureResult("通讯中断，请检查数据库或Redis连接！");
		}
	}

	// 删除
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletePatientStoreRecord(@PathVariable("id") String id) {
		try {
			patientStoreExecManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除明细失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：string日期转化
	 *@param dateStr
	 *@return       
	 *@author GW
	 *@date 2017年5月14日             
	*/
	private Date stringToDate(String dateStr){
		    Date date = null;
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd ");  
				date = sdf.parse(dateStr);
			} catch (ParseException e) {
				e.printStackTrace();
			}  
		    return date;
	}
	
	/**    
	 * 功能描述：将查询出来的收费信息转换成详细执行单
	 *@param detailList
	 *@return       
	 *@author GW
	 *@date 2017年5月20日             
	*/
	private List<PatientStoreRecord> dataConversion(List<OutpatientChargeDetail> detailList){
		if(detailList!=null && detailList.size()>0){
			List<PatientStoreRecord> recordList = new ArrayList<PatientStoreRecord>();
			StringBuilder sql = new StringBuilder();
			sql.append("SELECT  ps.ITEM_CODE, ps.ITEM_NAME, ps.RECIPE_ID,ps.RECIPE_NO,ps.hos_id,ISNULL(SUM(ps.QTY), 0) AS USE_QTY"
					+ " FROM  pha_patientstore_exec as ps"
					+ " GROUP by ps.ITEM_CODE,ps.ITEM_NAME,ps.RECIPE_ID,ps.RECIPE_NO,ps.HOS_ID");
			List<Object> TmpList = (List<Object>) outpatientChargeDetailManager.findBySql(sql.toString(), null);
			for(OutpatientChargeDetail detail:detailList){
				PatientStoreRecord ps = new PatientStoreRecord();
				//查询封装执行单数据
				ps.setPatient(detail.getPatient());
				ps.setQty(detail.getQty());
				ps.setCombNo(detail.getCombNo());
				ps.setRecipeNo(detail.getRecipeNo());
				ps.setUnit(detail.getUnit());
				ps.setItemId(detail.getItemCode());
				ps.setItemName(detail.getItemName());
				ps.setUnitPrice(detail.getSalePrice());
				ps.setSeeDept(detail.getRecipeDept());
				ps.setSeeDoc(detail.getRecipeDoc());
				if(detail.getRegId()!=null &&!"".equals(detail.getRegId())){
					ps.setRegId(detail.getRegId());
					RegInfo regInfo = regInfoManager.get(detail.getRegId());
					if(regInfo!=null){
						ps.setRegNo(regInfo.getRegId());
					}
				}
				ps.setRecipeId(detail.getRecipeId());
				ps.setRecipeNo(detail.getRecipeNo());
				ps.setUseQty(new BigDecimal(0));
				ps.setRemainQty(detail.getQty());
				for(Object obj:TmpList){
					Object[] objList = (Object[]) obj;
					if(detail.getItemCode().equals(objList[0])&&detail.getHosId().trim().equals(objList[4])
							&&detail.getRecipeId().trim().equals(objList[2])&&detail.getRecipeNo().toString().equals(objList[3].toString())){
						ps.setUseQty(new BigDecimal(objList[5].toString()));
						ps.setRemainQty(ps.getQty().subtract(ps.getUseQty()));//计算余量
					}
				}
				recordList.add(ps);
			}
			return recordList;
		}else{
			return null;
		}
	}
}
