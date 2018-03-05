package com.lenovohit.hcp.odws.web.rest;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.model.ItemShortDetail;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.PatLisManager;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PatStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;
import com.lenovohit.hcp.onws.moddel.PhaPatLis;

/**
 * 护士确认保管执行单
 */
@RestController
@RequestMapping("/hcp/onws/phaPatlis")
public class PhaPatlisController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<PatStore, String> patStoreManager;
	@Autowired
	private GenericManager<PatStoreExec, String> patStoreExecManager;
	@Autowired
	private GenericManager<PatientStoreRecord, String> patientStoreRecordManager;
	@Autowired
	private GenericManager<ItemShortDetail, String> itemShortDetailManager;
	@Autowired
	private PatLisManager patLisManagerImp;
	
	/**    
	 * 功能描述：检索送检项目
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
		StringBuilder jql = new StringBuilder(" from PatientStoreRecord op where op.invoiceNo not in (select invoiceNo from RegInfo where invoiceNo is not NULL) AND op.invoiceNo IS NOT NULL and itemInfo.exec = true ");
		List<Object> values = new ArrayList<Object>();
		String hosId = this.getCurrentUser().getHosId();
		jql.append(" and op.hosId = ? ");
		values.add(hosId);
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
		if(!StringUtils.isEmpty(medicalCardNo)||!StringUtils.isEmpty(name)||!StringUtils.isEmpty(IDCard)){
			jql.append(" and op.patient.id IN ( ");
			jql.append(" select p.id from Patient p where 1=1 ");
			if(!StringUtils.isEmpty(medicalCardNo)){
				jql.append(" and p.medicalCardNo like ? ");
				values.add("%"+medicalCardNo+"%");
			}
			if(!StringUtils.isEmpty(name)){
				jql.append(" and p.name like ? ");
				values.add("%"+name+"%");
			}
			if(!StringUtils.isEmpty(IDCard)){
				jql.append(" and p.idNo like ? ");
				values.add("%"+IDCard+"%");
			}
			jql.append(" and p.hosId = ? ");
			values.add(hosId);
			jql.append(" )");
		}
		
		if(!StringUtils.isEmpty(regId)){
			jql.append(" and op.regNo like ? ");
			values.add("%"+regId+"%");
		}
		if(dateRange!=null && dateRange.size()>0){
			String startDate = dateRange.get(0).toString();
			String endDate = dateRange.get(1).toString();
			if(startDate!=null && endDate!=null){
				jql.append(" and CONVERT(varchar(100), op.chargeTime, 120) between ? and  ? ");
				values.add(startDate);
				values.add(endDate);
			}
		}
		jql.append(" and itemInfo.feeCode = ? ");
		values.add("012");
		
		//有效
		if(isEffect==null || isEffect){
			jql.append(" and remainQty >0 ");
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patientStoreRecordManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**    
	 * 功能描述：检索已送检项目
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月14日             
	 */
	@RequestMapping(value = "/getPatLisPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPatLisPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		StringBuilder jql = new StringBuilder(" from PhaPatLis op where op.invoiceNo not in (select invoiceNo from RegInfo where invoiceNo is not NULL) AND op.invoiceNo IS NOT NULL and itemInfo.exec = true ");
		List<Object> values = new ArrayList<Object>();
		String hosId = this.getCurrentUser().getHosId();
		jql.append(" and op.hosId = ? ");
		values.add(hosId);
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
		if(!StringUtils.isEmpty(medicalCardNo)||!StringUtils.isEmpty(name)||!StringUtils.isEmpty(IDCard)){
			jql.append(" and op.patient.id IN ( ");
			jql.append(" select p.id from Patient p where 1=1 ");
			if(!StringUtils.isEmpty(medicalCardNo)){
				jql.append(" and p.medicalCardNo like ? ");
				values.add("%"+medicalCardNo+"%");
			}
			if(!StringUtils.isEmpty(name)){
				jql.append(" and p.name like ? ");
				values.add("%"+name+"%");
			}
			if(!StringUtils.isEmpty(IDCard)){
				jql.append(" and p.idNo like ? ");
				values.add("%"+IDCard+"%");
			}
			jql.append(" and p.hosId = ? ");
			values.add(hosId);
			jql.append(" )");
		}
		
		if(!StringUtils.isEmpty(regId)){
			jql.append(" and op.regId like ? ");
			values.add("%"+regId+"%");
		}
		if(dateRange!=null && dateRange.size()>0){
			String startDate = dateRange.get(0).toString();
			String endDate = dateRange.get(1).toString();
			if(startDate!=null && endDate!=null){
				jql.append(" and CONVERT(varchar(100), op.chargeTime, 120) between ? and  ? ");
				values.add(startDate);
				values.add(endDate);
			}
		}
		jql.append(" and itemInfo.feeCode = ? ");
		values.add("012");
		
		//有效
		if(isEffect==null || isEffect){
			jql.append(" and remainQty >0 ");
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patientStoreRecordManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**    
	 * 功能描述：查看执行记录
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
		PatStore query = JSONUtils.deserialize(data, PatStore.class);
		StringBuilder jql = new StringBuilder(" from PatStore  where 1=1 ");
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
		jql.append(" order by createTime desc");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patStoreManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	// 不分页
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<OutpatientChargeDetail> prts = outpatientChargeDetailManager.find(" from PatientStoreRecord prt where 1 = 1 order by prt.modelId ");
		return ResultUtils.renderSuccessResult(prts);
	}

	/**    
	 * 功能描述：非复合项目执行确认
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月13日             
	*/
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreatePatientStoreRecord(@RequestBody String data) {
		PhaPatLis phaLis = JSONUtils.parseObject(data, PhaPatLis.class);
		HcpUser user = this.getCurrentUser();
		try{
			PhaPatLis patLis = patLisManagerImp.savePatLis(phaLis,user);
			return ResultUtils.renderSuccessResult(patLis);
		}catch(Exception e1){
			e1.printStackTrace();
			return ResultUtils.renderFailureResult("通讯中断，请检查数据库或Redis连接！");
		}
	}

	/**    
	 * 功能描述：根据符合项目ID检索复合项目明细
	 *@param itemId
	 *@return       
	 *@author GW
	 *@date 2017年6月16日             
	*/
	@RequestMapping(value = "/findItemDetailByItemId", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findItemDetailByItemId (@RequestParam(value = "data", defaultValue = "") String data){
		PatientStoreRecord query = JSONUtils.deserialize(data, PatientStoreRecord.class);
		List<ItemShortDetail> detailList =null;//查询对应复合套餐明细
		List<PatStoreExec> patStoreExecList = new ArrayList<PatStoreExec>();//确认项明细
		String itemId = query.getItemInfo().getId();
		if(!StringUtils.isEmpty(itemId)){
			String hosId = this.getCurrentUser().getHosId();
			List<String> values = new ArrayList<String>();
			values.add(hosId);
			values.add(itemId);
			detailList = itemShortDetailManager.find(" from ItemShortDetail where hosId = ? and shortId = ? ", values.toArray());
			if(detailList!=null && detailList.size()>0){
				for(ItemShortDetail item : detailList){
					PatStoreExec storeExec = new PatStoreExec();
					storeExec.setHosId(query.getHosId()); 				//医院id
					storeExec.setPatientId(query.getPatient().getId());	//病人ID
					storeExec.setRegId(query.getRegId()); 				//挂号流水
					storeExec.setName(query.getPatient().getName());	//病人姓名
					if(item.getItemInfo()!=null){//项目相关信息
						ItemInfo info = item.getItemInfo();
						storeExec.setItemCode(info.getId());
						storeExec.setItemName(info.getItemName());
						storeExec.setSpecs(info.getSpecs());
						storeExec.setUnit(info.getUnit());
						storeExec.setUnitPrice(info.getUnitPrice());
					}
					storeExec.setId(item.getId());
					storeExec.setRecipeId(query.getRecipeId());			//处方号
					storeExec.setRecipeNo(query.getRecipeNo());			//处方序号
					storeExec.setQty(item.getDefaultNum());				//默认收费数量
					patStoreExecList.add(storeExec);
				}
			}
			Map<String,List<String>> map = findApprovalNoByShortId(itemId);
			Map<String,Object> resultMap = new HashMap<String,Object>();
			resultMap.put("data", patStoreExecList);
			resultMap.put("approvalNo", map);
			return ResultUtils.renderSuccessResult(resultMap);
		}else{
			return ResultUtils.renderFailureResult("数据传输错误（符合项目ID为空）！");
		}
		
	}
	
	/**    
	 * 功能描述：通过保管单号查询确认单内使用的详细信息
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月19日             
	*/
	@RequestMapping(value = "/findRecordDetailByExecNo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findRecordDetailByExecNo (@RequestParam(value = "data", defaultValue = "") String data){
		JSONObject json = JSONObject.parseObject(data);
		if(json!=null){
			List<PatStoreExec> recordList = new ArrayList<PatStoreExec>();
			String execNo = json.getString("execNo");
			if(execNo!=null){
				String hosId = this.getCurrentUser().getHosId();
				List<String> values = new ArrayList<String>();
				values.add(hosId);
				values.add(execNo);
				recordList = patStoreExecManager.find(" from PatStoreExec where hosId = ? and execNo = ? ", values.toArray());
				
			}
			return ResultUtils.renderSuccessResult(recordList);
		}else{
			return ResultUtils.renderFailureResult("数据传输错误（符合项目ID为空）！");
		}
		
	}
	
	/**    
	 * 功能描述：通过符合项目id查询执行明细的物资批号
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年8月2日             
	*/
	public Map<String,List<String>> findApprovalNoByShortId (String shortId){
		Map<String,List<String>> map = new HashMap<String,List<String>>();
		//当前登录科室
		String deptId = this.getCurrentUser().getLoginDepartment().getId();
		StringBuilder sql = new StringBuilder(" SELECT	isd.ITEM_CODE,	st.APPROVAL_NO,	st.BATCH_NO,	st.DEPT_ID, st.STORE_SUM "
				+ "FROM	item_short_detail isd "
				+ "LEFT JOIN item_info item ON isd.ITEM_CODE = item.ID "
				+ "LEFT JOIN MATERIAL_INFO mat ON mat.ITEM_CODE = item.ID "
				+ "LEFT JOIN MATERIAL_STOREINFO st ON st.MATERIAL_ID = mat.ID "
				+ "WHERE	st.ID IS NOT NULL and st.STORE_SUM!=0 "
				+ "AND isd.SHORT_ID = '"+shortId+"' "
				+ "and st.DEPT_ID = '"+deptId+"'");
		//查询该符合项目中明细物资批号列表
		List<Object> objList = (List<Object>) patStoreExecManager.findBySql(sql.toString());
		if(objList!=null && objList.size()>0){
			for(int i=0;i<objList.size();i++){
				Object[] obj = (Object[]) objList.get(i);
				String itemCode = obj[0].toString();
				String approvalNo = obj[1].toString();
				List<String> optionList = map.get(itemCode);
				String op = approvalNo;
				if(optionList!=null && optionList.size()>0){//之前存在此项目相关批号信息
					optionList.add(op);
				} else {
					List<String> opTmp = new ArrayList<String>();
					opTmp.add(op);
					map.put(itemCode, opTmp);
				}
			}
		}
		return map;
	}
	
	@RequestMapping(value = "/exportToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportInStoreSummary(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) {
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("SELECT "
				+ "lis.ExamBarCode,"
				+ "	'' AS num,"
				+ "	p.NAME,"
				+ "	p.SEX,"
				+ " p.BIRTHDAY,	"
				+ " lis.SPECIMEN_TYPE,"
				+ "	dic.COLUMN_VAL,"
				+ "	'' as bedNo,"
				+ "	lis.SpecimenDate,"
				+ " u.NAME as doc,"
				+ " dept.DEPT_NAME as dept,"
				+ " diag.disease_name,"
				+ " lis.ITEM_CODE,"
				+ " lis.ITEM_NAME,"
				+ " lis.REG_NO,"
				+ " lis.SendDate,"
				+ " lis.QTY "
				+ " FROM"
				+ "	PHA_PATLIS lis "
				+ " LEFT JOIN b_patientinfo p ON p.ID = lis.PATIENT_ID "
				+ " LEFT JOIN OW_DIAGNOSE diag ON diag.reg_id = lis.REG_ID "
				+ " LEFT JOIN ow_order o ON (o.REG_ID = lis.REG_ID AND o.ITEM_ID = lis.ITEM_CODE) "
				+ " LEFT JOIN b_deptinfo dept on o.RECIPE_DEPT = dept.ID "
				+ " LEFT JOIN hcp_user u on u.ID = o.RECIPE_DOC "
				+ " LEFT JOIN b_dicvalue dic ON lis.SPECIMEN_TYPE = dic.COLUMN_KEY AND dic.HOS_ID = ? AND dic.COLUMN_NAME = 'SPECIMENT'"
				+ " where lis.hos_id = ? and lis.STATE_FLAG = '1' ");
		HcpUser user = this.getCurrentUser();
		values.add(user.getHosId());
		values.add(user.getHosId());
		
		List<Object> tmpList = (List<Object>) patientStoreRecordManager.findBySql(sql.toString(), values.toArray());
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_送检信息";
		try {
			String header = request.getHeader("USER-AGENT");
			if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
				fileName = URLEncoder.encode(fileName,"UTF8");
			}else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
			   fileName = new String(fileName.getBytes(), "ISO8859-1");
			}else{
			   fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
			}
		response.reset();
		response.setContentType("application/vnd.ms-word");
		// 定义文件名
		response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
		// 定义一个输出流
		OutputStream out = null;
		response.setCharacterEncoding("UTF-8");
		out = response.getOutputStream();
		patLisManagerImp.writeExcel(tmpList, out);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
}
