package com.lenovohit.hcp.odws.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.model.ItemShortDetail;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.PatStoreMng;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PatStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;
import com.lenovohit.hcp.onws.moddel.PhaPatLis;

/**
 * 护士确认保管执行单
 */
@RestController
@RequestMapping("/hcp/onws/phaLisResult")
public class PhaLisResultController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<PatStore, String> patStoreManager;
	@Autowired
	private GenericManager<PatStoreExec, String> patStoreExecManager;
	@Autowired
	private GenericManager<PhaPatLis, String> phaPatlisManager;
	@Autowired
	private GenericManager<ItemShortDetail, String> itemShortDetailManager;
	@Autowired
	private PatStoreMng patStoreManagerImp;
	
	private static Log log = LogFactory.getLog(PhaLisResultController.class);;
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
		StringBuilder jql = new StringBuilder(" from PhaPatLis op ");
		List<Object> values = new ArrayList<Object>();
		String hosId = this.getCurrentUser().getHosId();
		jql.append(" where op.hosId = ? ");
		values.add(hosId);
		JSONObject json = JSONObject.parseObject(data);
		String medicalCardNo = "";
		String name = "";
		String regId = "";
		String IDCard = "";
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null){
			medicalCardNo = json.getString("medicalCardNo");
			name = json.getString("name");
			regId = json.getString("regId");
			IDCard = json.getString("IDCard");
			dateRange = json.getJSONArray("dateRange");
		}
		if(!StringUtils.isEmpty(medicalCardNo)||!StringUtils.isEmpty(name)||!StringUtils.isEmpty(IDCard)){
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
		}
		if(!StringUtils.isEmpty(regId)){
			jql.append(" and op.regNo like ? ");
			values.add("%"+regId+"%");
		}
		if(dateRange!=null && dateRange.size()>0){
			String startDate = dateRange.get(0).toString();
			String endDate = dateRange.get(1).toString();
			if(startDate!=null && endDate!=null){
				jql.append(" and CONVERT(varchar(100), op.senddate, 120) between ? and  ? ");
				values.add(startDate);
				values.add(endDate);
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaPatlisManager.findPage(page);
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
		PatientStoreRecord record = JSONUtils.parseObject(data, PatientStoreRecord.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		try{
			PatStore storeExec = new PatStore();
			if(record!=null ){
				storeExec.setHosId(user.getHosId());				//医院
				storeExec.setPatientId(record.getPatient().getId());//病人id
				storeExec.setName(record.getPatient().getName());	//姓名
				storeExec.setRecipeId(record.getRecipeId());		//处方Id
				storeExec.setRecipeNo(record.getRecipeNo());		//处方序号
				if(record.getItemInfo()!=null){
					ItemInfo info = record.getItemInfo();
					storeExec.setItemCode(info.getId());//项目id
					storeExec.setSpecs(info.getSpecs());			//规格
				}
				storeExec.setCombNo(record.getCombNo());
				storeExec.setItemName(record.getItemInfo().getItemName());
				storeExec.setQty(record.getThisQty());
				storeExec.setUnit(record.getUnit());
				storeExec.setUnitPrice(record.getItemInfo().getUnitPrice());//单价
				storeExec.setCombNo(record.getCombNo());//组号
				storeExec.setExecOper(user.getName());	//操作人信息
				storeExec.setCreateOper(user.getName());
				storeExec.setCreateOperId(user.getId());
				storeExec.setCreateTime(now);
				storeExec.setUpdateOper(user.getName());
				storeExec.setUpdateOperId(user.getId());
				storeExec.setUpdateTime(now);
				storeExec.setState("1");
				storeExec.setQty(new BigDecimal(1));
			}
			
			patStoreManager.save(storeExec);
			return ResultUtils.renderSuccessResult();
		}catch(Exception e1){
			e1.printStackTrace();
			return ResultUtils.renderFailureResult("通讯中断，请检查数据库或Redis连接！");
		}
	}
	/**    
	 * 功能描述：复合项目确认
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月17日             
	*/
	@RequestMapping(value = "/saveDetail", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result saveDetail(@RequestBody String data) {
		try{
			HcpUser user = this.getCurrentUser();
			JSONObject json = JSONObject.parseObject(data);
			String patStore = json.getString("confirmData");
			String record = json.getString("record");
			List<PatStoreExec> patStoreExecList = JSONUtils.parseObject(patStore, new TypeReference<List<PatStoreExec>>() {});
			PatientStoreRecord query = JSONUtils.deserialize(record, PatientStoreRecord.class);
			//调用保存复合项目接口
			patStoreManagerImp.saveItemShort(query, patStoreExecList,user);
			return ResultUtils.renderSuccessResult();
		}catch(Exception e){
			e.getStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

	/**    
	 * 功能描述：取消本次执行
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月7日             
	*/
	@RequestMapping(value = "/remove", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletePatientStoreRecord(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		PatStore query = JSONUtils.deserialize(data, PatStore.class);
		if(query!=null&&query.getId()!=null){
			try {
				query.setCancelOper(user.getName());//作废操作者名称
				query.setCancelId(user.getId());//作废操作者id
				query.setCancelTime(new Date());//作废时间
				query.setState("0");//作废状态
				query.setUpdateOper(user.getName());
				query.setUpdateOperId(user.getId());
				query.setUpdateTime(new Date());
				patStoreManagerImp.deleteItemShort(query,user);
				return ResultUtils.renderSuccessResult();
			} catch (Exception e) {
				System.err.println(e.getMessage());
				log.info(e.getMessage());
				return ResultUtils.renderFailureResult("作废失败！！");
			}
		}else{
			System.err.println("获取执行记录失败！");
			log.error("获取执行记录失败！");
			return ResultUtils.renderFailureResult("获取执行记录失败！");
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
}
