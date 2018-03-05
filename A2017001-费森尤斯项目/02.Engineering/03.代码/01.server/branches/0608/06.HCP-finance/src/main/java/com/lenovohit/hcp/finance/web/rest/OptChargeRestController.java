package com.lenovohit.hcp.finance.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.HisInterChargeManager;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.ChargePkg;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.CommonItemInfoExpand;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

/**    
 *         
 * 类描述：   门诊收费-确认收费
 *@author GW
 *@date 2017年4月10日          
 *     
 */
@RestController
@RequestMapping("/hcp/payment/outpatientCharge")
public class OptChargeRestController extends HcpBaseRestController {
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<InvoiceManage, String> invoiceManageManager;
	@Autowired
	private GenericManager<ChargePkg, String> chargePkgManager;
	@Autowired
	private GenericManager<ChargeDetail, String> chargeDetailManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private HisInterChargeManager hisInterChargeManager;
	@Autowired
	private GenericManager<CommonItemInfo, String> commonItemInfoManager;

	/**
	 * 功能描述：结账将相关信息插入表或更新
	 * 
	 * @param data
	 * @return
	 * @author gw
	 * @date 2017年4月6日
	 */
	@RequestMapping(value = "/submitCharge", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result submitCharge(@RequestBody String data) {

		String userInfo = data.substring(data.lastIndexOf("{"), data.length() - 1);
		data = data.replace("," + userInfo, "");
		JSONObject jsonObj = JSONObject.parseObject(userInfo);
		jsonObj.get("invoiceNo");
		List<OutpatientChargeDetail> chargeList = JSONUtils.parseObject(data, new TypeReference<List<OutpatientChargeDetail>>() {
		});
		// 收费相关信息更新数据库
		if (chargeList != null && chargeList.size() > 0) {
			HcpUser user = this.getCurrentUser();
			//收费确认后相关数据更新
			HisOrder order = updataOutpatientChargeDetail(chargeList, jsonObj, user);
			return ResultUtils.renderSuccessResult(order);
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	/**    
	 * 功能描述：划价保存
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年4月16日             
	*/
	@RequestMapping(value = "/submitItemCharge", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result submitItemCharge(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		String userInfo = data.substring(data.lastIndexOf("{"), data.length() - 1);
		data = data.replace("," + userInfo, "");
		JSONObject jsonObj = JSONObject.parseObject(userInfo);
		List<CommonItemInfoExpand> chargeList = JSONUtils.parseObject(data, new TypeReference<List<CommonItemInfoExpand>>() {
		});
		//收费明细表列表
		List<OutpatientChargeDetail>  chargedetailLsit = new ArrayList<OutpatientChargeDetail>();
		if (chargeList != null && chargeList.size() > 0) {
			for(int i=0;i<chargeList.size();i++){
				CommonItemInfoExpand itemInfo = chargeList.get(i);
				//对于自定义项目操作
				OutpatientChargeDetail detail = new OutpatientChargeDetail();
				detail.setApplyState("0");				//未交费状态
				detail.setHosId(user.getHosId());
				detail.setRegId(jsonObj.get("regId").toString());
				detail.setSpecs(itemInfo.getItemSpecs());	//规格
				Patient patient = new Patient();
				patient.setId(jsonObj.get("patientId").toString());
				detail.setPatient(patient);
				//detail.setFeeType(opt.getDrugType());	//费用类别
				detail.setPlusMinus(new BigDecimal(1));	//正负类型
				detail.setRecipeId(itemInfo.getRecipeId());			//由于自定义不往医嘱信息表中插入信息所以此处id没有意义
				detail.setRecipeNo(i+1); 				//同上
				detail.setItemName(itemInfo.getItemName());		//项目名称 
				detail.setItemCode(itemInfo.getId());		//项目编码
				detail.setSalePrice(itemInfo.getSalePrice());	//单价
				detail.setQty(new BigDecimal(itemInfo.getAmount()));			//数量
				detail.setUnit(itemInfo.getItemUnit());			//单位
				detail.setRecipeTime(new Date());				//划价默认开处方时间为当前日期
				if(StringUtils.isNotEmpty(itemInfo.getExeDept())){
					Department exeDept = new Department();
					exeDept.setId(itemInfo.getExeDept());
					detail.setExeDept(exeDept);						//执行科室
					detail.setDrugDept(exeDept); 					//取药药房
				}
				detail.setCancelFlag("0");							//取消标志
				if(StringUtils.isNotEmpty(itemInfo.getRecipeDept())){
					Department recipeDept = new Department();
					recipeDept.setId(itemInfo.getRecipeDept());
					detail.setRecipeDept(recipeDept);						//开单科室
				}
				if(StringUtils.isNotEmpty(itemInfo.getRecipeDoc())){
					HcpUser recipeDoc = new HcpUser();
					recipeDoc.setId(itemInfo.getRecipeDoc());
					detail.setRecipeDoc(recipeDoc);						//开单医生
				}						//开单医生
				BigDecimal salePrice = itemInfo.getSalePrice();
				BigDecimal amount =new BigDecimal(itemInfo.getAmount());		//数量
				BigDecimal totCost = new BigDecimal(0);
				if(salePrice!=null){//单价存在
					if(amount!=null){
						totCost=salePrice.multiply(amount);
					}else{
						totCost=salePrice;
					}
				}
				detail.setTotCost(totCost);	//项目金额
				//detail.setPubCost("支付环节处理后返回");//报销金额
				//detail.setOwnCost(jsonObj.getBigDecimal("ownCost"));//自付金额
				detail.setFeeCode(itemInfo.getFeeCode());				//费用类别
				detail.setCreateOper(user.getName()); 	//创建人
				detail.setCreateOperId(user.getId()); 	//创建人id
				detail.setCreateTime(new Date()); 		//创建时间
				detail.setChargeOper(user); 			//收费员
				detail.setChargeTime(new Date());
				chargedetailLsit.add(detail);
			}
			
			if(chargedetailLsit!=null&&chargedetailLsit.size()>0){//划价成功
				outpatientChargeDetailManager.batchSave(chargedetailLsit);
				return ResultUtils.renderSuccessResult(null);
			}else{
				return ResultUtils.renderFailureResult();
			}
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	/**    
	 * 功能描述：划价收费
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年4月16日             
	 */
	@RequestMapping(value = "/saveCharge", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result saveCharge(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		String userInfo = data.substring(data.lastIndexOf("{"), data.length() - 1);
		data = data.replace("," + userInfo, "");
		JSONObject jsonObj = JSONObject.parseObject(userInfo);
		List<CommonItemInfoExpand> chargeList = JSONUtils.parseObject(data, new TypeReference<List<CommonItemInfoExpand>>() {});
		//收费明细表列表
		List<OutpatientChargeDetail>  chargedetailLsit = new ArrayList<OutpatientChargeDetail>();
		if (chargeList != null && chargeList.size() > 0) {
			Map<String,Integer> recipeNoMap = new HashMap<String,Integer>();
			for(int i=0;i<chargeList.size();i++){
				CommonItemInfoExpand itemInfo = chargeList.get(i);
				//对于自定义项目操作
				OutpatientChargeDetail detail = new OutpatientChargeDetail();
				detail.setApplyState("0");				//未交费状态（调用收银台之后状态修改为已收费状态）
				detail.setHosId(user.getHosId());
				detail.setRegId(jsonObj.get("regId").toString());
				detail.setSpecs(itemInfo.getItemSpecs());	//规格
				Patient patient = new Patient();
				patient.setId(jsonObj.get("patientId").toString());
				detail.setPatient(patient);
				//detail.setFeeType(opt.getDrugType());	//费用类别
				detail.setPlusMinus(new BigDecimal(1));	//正负类型
				detail.setRecipeId(itemInfo.getRecipeId());		//处方id
				Integer recipeIdToNo = recipeNoMap.get(itemInfo.getRecipeId());
				if(recipeIdToNo!=null){//之前已经有次出访
					detail.setRecipeNo(recipeIdToNo); 				//设置处方序号
					recipeNoMap.put(itemInfo.getRecipeId(), recipeIdToNo+1);
				}else{//在此之前未插入过相同处方
					detail.setRecipeNo(1); 				//设置处方序号
					recipeNoMap.put(itemInfo.getRecipeId(), 2);
				}
				detail.setItemName(itemInfo.getItemName());		//项目名称 
				detail.setItemCode(itemInfo.getId());		//项目编码
				detail.setSalePrice(itemInfo.getSalePrice());	//单价
				detail.setQty(new BigDecimal(itemInfo.getAmount()));			//数量
				detail.setUnit(itemInfo.getItemUnit());			//单位
				detail.setRecipeTime(new Date());				//划价默认开处方时间为当前日期
				if(StringUtils.isNotEmpty(itemInfo.getExeDept())){
					Department exeDept = new Department();
					exeDept.setId(itemInfo.getExeDept());
					detail.setExeDept(exeDept);						//执行科室
					detail.setDrugDept(exeDept);					//取药药房
				}
				detail.setCancelFlag("0");							//取消标志
				if(StringUtils.isNotEmpty(itemInfo.getRecipeDept())){
					Department recipeDept = new Department();
					recipeDept.setId(itemInfo.getRecipeDept());
					detail.setRecipeDept(recipeDept);						//开单科室
				}
				if(StringUtils.isNotEmpty(itemInfo.getRecipeDoc())){
					HcpUser recipeDoc = new HcpUser();
					recipeDoc.setId(itemInfo.getRecipeDoc());
					detail.setRecipeDoc(recipeDoc);						//开单医生
				}
				BigDecimal salePrice = itemInfo.getSalePrice();
				BigDecimal amount =new BigDecimal(itemInfo.getAmount());		//数量
				BigDecimal totCost = new BigDecimal(0);
				if(salePrice!=null){//单价存在
					if(amount!=null){
						totCost=salePrice.multiply(amount);
					}else{
						totCost=salePrice;
					}
				}
				detail.setTotCost(totCost);	//项目金额
				//detail.setPubCost("支付环节处理后返回");//报销金额
				//detail.setOwnCost(jsonObj.getBigDecimal("ownCost"));//自付金额
				detail.setFeeCode(itemInfo.getFeeCode());				//费用类别
				if(itemInfo.getFeeCode()!=null && "003".equals(itemInfo.getFeeCode())){//如果为草药插入付数（暂时先用1）
					detail.setDays(1);
				}else{
					detail.setDays(1);
				}
				if ("001".equals(itemInfo.getFeeCode())||"002".equals(itemInfo.getFeeCode())
						||"003".equals(itemInfo.getFeeCode())){//药品判断
					detail.setDrugFlag("1");
				}else{
					detail.setDrugFlag("2");
				}
				detail.setFeeType(itemInfo.getFeeType());	//就诊类别
				detail.setCreateOper(user.getName()); 		//创建人
				detail.setCreateOperId(user.getId()); 		//创建人id
				detail.setCreateTime(new Date()); 			//创建时间
				detail.setChargeOper(user); 				//收费员
				detail.setChargeTime(new Date());
				chargedetailLsit.add(detail);
			}
			
			if(chargedetailLsit!=null&&chargedetailLsit.size()>0){//划价成功
				List<OutpatientChargeDetail> detailList = outpatientChargeDetailManager.batchSave(chargedetailLsit);
				List<String> chargeIdList = new ArrayList<String>();
				BigDecimal cost = jsonObj.getBigDecimal("itemCost");
				for(OutpatientChargeDetail detail:detailList){//遍历明细表，封装id
					chargeIdList.add(detail.getId());
				}
				// 调用收费接口
				HisOrder order = hisInterChargeManager.handleChargeToPay(user.getName(), cost, chargeIdList,
						InvoiceManage.INVOICE_TYPE_CLINIC, user.getHosId(), "hisClinicPricChargeManager");
				return ResultUtils.renderSuccessResult(order);
			}else{
				return ResultUtils.renderFailureResult();
			}
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	/**    
	 * 功能描述：暂存（保存相关数据到模板中）
	 *@param data
	 *@return       comboName
	 *@author gw
	 *@date 2017年4月22日             
	*/
	@RequestMapping(value = "/saveChargeToTemplate", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result saveChargeToTemplate(@RequestBody String data) {
		String userInfo = data.substring(data.lastIndexOf("{"), data.length() - 1);
		data = data.replace("," + userInfo, "");
		JSONObject jsonObj = JSONObject.parseObject(userInfo);
		String comboName = "";					//套餐名称
		String  shareLevel = "";
		if(jsonObj!=null){
			comboName = jsonObj.getString("comboName");
			shareLevel = jsonObj.getString("shareLevel");
		}
		List<CommonItemInfo> itemInfoList = JSONUtils.parseObject(data, new TypeReference<List<CommonItemInfo>>() {});
		if (itemInfoList != null && itemInfoList.size() > 0) {
			HcpUser user = this.getCurrentUser();
			String hosId = user.getHosId();
			Date date = new Date();
			String userName = user.getName();
			String userId = user.getId();
			ChargePkg groupInfo = new ChargePkg();	//套餐收费项目
			List<ChargeDetail> groupDetailList = new ArrayList<ChargeDetail>(); //套餐明细
			String comboId = redisSequenceManager.get("ITEM_GROUP_INFO", "COMBO_ID");//套餐id
			String comboNo = redisSequenceManager.get("ITEM_GROUP_INFO", "COMBO_NO");//组合号
			groupInfo.setHosId(hosId);
			groupInfo.setComboName(comboName);		//套餐名称
			groupInfo.setSpellCode(PinyinUtil.getFirstSpell(groupInfo.getComboName()));//生成拼音码
			groupInfo.setWbCode(WubiUtil.getWBCode(groupInfo.getComboName()));			//生成五笔码
			groupInfo.setComboId(comboId);
			groupInfo.setStop(false);				//停用标志
			groupInfo.setCreateTime(date);
			groupInfo.setCreateOper(userName);
			if(StringUtils.isNotEmpty(shareLevel)){
				groupInfo.setShareLevel(shareLevel);
			}else{
				groupInfo.setShareLevel("1");			//未选择级别  默认个人
			}
			groupInfo.setUseDept(user.getLoginDepartment());		//默认科室
			//保存套餐项目
			chargePkgManager.save(groupInfo);
			for(int i=0;i<itemInfoList.size();i++){
				CommonItemInfo info = itemInfoList.get(i);
				ChargeDetail detail = new ChargeDetail();
				detail.setHosId(hosId);
				detail.setComboId(comboId);
				detail.setComboNo(Integer.parseInt(comboNo));
				detail.setComboSort(i);
				detail.setDays(new BigDecimal(info.getAmount()));
				detail.setStop(false);
				detail.setDefaultDept(info.getExeDept());
				detail.setItemCode(info.getId());
				detail.setDrugFlag(info.getItemFlag());			//药品标志
				detail.setDefaultNum(new BigDecimal(info.getAmount()));			//默认数量
				detail.setUnit(info.getItemUnit());				//单位
				if(info.getId()!=null){
					PhaDrugInfo model= phaDrugInfoManager.get(info.getId());
					if(model!=null){
						detail.setUsage(model.getUsage());
						detail.setFreq(model.getFreqCode());
						detail.setDosage(new BigDecimal(model.getDosage()));
						detail.setDosageUnit(model.getDoseUnit());
					}
				} 
				groupDetailList.add(detail);
			} 
			//保存套餐收费详细信息
			chargeDetailManager.batchSave(groupDetailList);
			return ResultUtils.renderSuccessResult(null);
		} else {
			return ResultUtils.renderFailureResult();
		}
	}

	/**
	 * 功能描述：根据病人医保卡号查询病人收费明细
	 * 
	 * @param data
	 * @return
	 * @author gw
	 * @date 2017年4月7日
	 */
	@RequestMapping(value = "/findChargeDetail", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result findChargeDetail(@RequestBody String data) {
		List<Object> values = new ArrayList<Object>();
		List<OutpatientChargeDetail>	chargeDetailList =null;
			StringBuilder jql = new StringBuilder("select detail from OutpatientChargeDetail detail "
					+ "left join detail.patient "
					+ "left join detail.recipeDept "
					+ "left join detail.recipeDoc "
					+ "left join detail.exeOper "
					+ "left join detail.cancelOper "
					+ "left join detail.chargeOper "
					+ "left join detail.exeDept "
					+ "left join detail.drugDept "
					+ "left join detail.order "
					+ "where 1=1 AND detail.applyState = '0' ");
				List ids =  JSONUtils.deserialize(data, List.class);
				if(ids!=null&&ids.size()>0){
					jql.append(" AND detail.recipeId IN (  ");
					for(int i=0;i<ids.size();i++){
						jql.append("?");
						values.add(ids.get(i).toString());
						if(i != ids.size()-1)jql.append(",");
					}
					jql.append(")");
					chargeDetailList = (List<OutpatientChargeDetail>) outpatientChargeDetailManager.findByJql(jql.toString(), values.toArray());
				}
			return ResultUtils.renderSuccessResult(chargeDetailList);
	}
	/**    
	 * 功能描述：通过就诊号获取处方
	 *@param miCardNo
	 *@return       
	 *@author gw
	 *@date 2017年4月10日             
	*/
	@RequestMapping(value = "/findRecipeList/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result findRecipeList(@PathVariable("regId") String regId) {
		if (!StringUtils.isEmpty(regId)) {
			List<Object> values = new ArrayList<Object>();
			StringBuilder jql = new StringBuilder(" SELECT DISTINCT RECIPE_ID,RECIPE_NO,RECIPE_DOC,RECIPE_TIME,RECIPE_DEPT  FROM  OC_CHARGEDETAIL ");
			jql.append(" WHERE APPLY_STATE = '0' AND REG_ID = ? ");
			values.add(regId);
			List<OutpatientChargeDetail> chargeList = (List<OutpatientChargeDetail>) outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
			return ResultUtils.renderSuccessResult(chargeList);
		} else {
			return ResultUtils.renderFailureResult("用户不存在已看诊号别！");
		}
	}

	/**    
	 * 功能描述：根据当前诊疗卡号获取当前挂号id
	 *@param medicalCardNo
	 *@return       
	 *@author gw
	 *@date 2017年4月14日             
	*/
	@RequestMapping(value = "/getCurrentRegId/{miCardNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	private Result getCurrentRegId(@PathVariable("miCardNo") String medicalCardNo){
		List<Object> chargeList = null;
		if (!StringUtils.isEmpty(medicalCardNo)) {
			List<Object> values = new ArrayList<Object>();
			StringBuilder jql = new StringBuilder(" SELECT  reg.* FROM reg_info reg  ");
			jql.append(" LEFT JOIN b_patientinfo p ");
			jql.append(" ON reg.PATIENT_ID = p.ID ");
			jql.append(" WHERE reg.REG_STATE != '12' AND  p.MEDICAL_CARD_NO = ? ");
			jql.append(" ORDER BY  reg.CREATE_TIME DESC ");
			values.add(medicalCardNo);
			chargeList = (List<Object>) regInfoManager.findBySql(jql.toString(), values.toArray());
		}
	if(chargeList!=null&&chargeList.size()>0){//存在挂号信息获取最近一条流水号
		Object[] arrObj = (Object[]) chargeList.get(0);
		return ResultUtils.renderSuccessResult(arrObj[0]);
	}else{
		return ResultUtils.renderFailureResult();
	}
	}

	/**    
	 * 功能描述：收费明细和医嘱表更新
	 *@param chargeList
	 *@param jsonObj
	 *@param user       
	 *@author gw
	 *@date 2017年4月8日             
	*/
	private HisOrder updataOutpatientChargeDetail(List<OutpatientChargeDetail> chargeList, JSONObject jsonObj, HcpUser user) {
		//明细idList
		List<String> chargeIdList = new ArrayList<String>();
		if(chargeList!=null&&chargeList.size()>0){
			for(OutpatientChargeDetail detail :chargeList){
				chargeIdList.add(detail.getId());
			}
			BigDecimal cost = jsonObj.getBigDecimal("totCost");
			// 调用收费接口
			return hisInterChargeManager.handleChargeToPay(user.getName(), cost, chargeIdList,
					InvoiceManage.INVOICE_TYPE_CLINIC, user.getHosId(), "hisClinicBizChargeManager");
		} else {// 数据提交异常
			return null;
		}
	}

	/**    
	 * 功能描述：根据领用人姓名查询当前票据信息
	 *@param userName
	 *@return       
	 *@author gw
	 *@date 2017年4月17日             
	*/
	public InvoiceManage findCurrentInvoice( HcpUser user) {
		StringBuilder jql = new StringBuilder("from  InvoiceManage where 1=1 AND invoiceState = '1' and invoiceType = 2 and getOper = ? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getName());
		InvoiceManage models = invoiceManageManager.findOne(jql.toString(), values.toArray());
		return models;
	}
	
	@RequestMapping(value = "/groupDetaillist/{comboId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailList(@PathVariable("comboId") String comboId) {
		List<Object> values = new ArrayList<Object>();
		StringBuffer sql = new StringBuffer();
		sql.append("select  a.ID   AS item_id, "
				+ "		a.DRUG_CODE    AS item_Code, "
				+ " 	a.TRADE_NAME   AS item_Name, "
				+ " 	a.DRUG_SPECS   AS item_Specs, "
				+ " 	a.SALE_PRICE   AS sale_Price, "
				+ " 	a.PACK_UNIT    AS item_Unit, "
				+ " 	'1'            AS item_Flag, "
				+ " 	a.DRUG_TYPE    AS FEE_CODE, "
				+ " 	b.DEFAULT_DEPT AS exe_Dept, "
				+ "  	b.DAYS	       AS  amount  "
				+ " from  item_group_detail b 	"
				+ "		left join pha_druginfo a	"
				+ "		on b.ITEM_CODE = a.DRUG_CODE "
				+ "		where b.DRUG_FLAG != '0'  ");
			sql.append(" and b.combo_id = ? ");
			sql.append("	union all "
				+ "	select   a.ID         AS item_id,"
				+ " 	a.ITEM_CODE       AS item_Code,"
				+ " 	a.ITEM_NAME       AS item_Name,"
				+ " 	a.SPECS           AS item_Specs,"
				+ " 	a.UNIT_PRICE      AS sale_Price, "
				+ " 	a.UNIT            AS item_Unit,"
				+ " 	'0'               AS item_Flag,"
				+ " 	a.FEE_CODE    	  AS FEE_CODE,"
				+ " 	a.DEFAULT_DEPT    aS eexe_Dept,"
				+ " 	b.DAYS	     as  amount"
				+ "	from  item_group_detail b	"
				+ "		left join item_info  a	"
				+ "		on b.ITEM_CODE = a.ITEM_CODE	"
				+ "		where b.DRUG_FLAG = '0' ");
		sql.append(" and b.combo_id = ? ");
		values.add(comboId);
		values.add(comboId);
		List<Object> models = (List<Object>) invoiceManageManager.findBySql(sql.toString(),values.toArray());
		List<CommonItemInfo> itemInfoList = chargeDataConversion(models);
		return ResultUtils.renderSuccessResult(itemInfoList);
	}
	
	/**    
	 * 功能描述：将项目相关信息转化成同一对象
	 *@param objList
	 *@return       
	 *@author gw
	 *@date 2017年4月22日             
	*/
	private List<CommonItemInfo> chargeDataConversion(List<Object> objList) {
		List<CommonItemInfo> chargeList = new ArrayList<CommonItemInfo>();
		if (objList != null && objList.size() > 0) {
			for (int i = 0; i < objList.size(); i++) {
				Object[] obj = (Object[]) objList.get(i);
				CommonItemInfo itemInfo = new CommonItemInfo();
				if (!StringUtils.isEmpty(obj[0])) {// 唯一id
					itemInfo.setId(obj[0].toString());
				}
				if (!StringUtils.isEmpty(obj[1])) {// 项目编码
					itemInfo.setItemCode(obj[1].toString());
				}
				if (!StringUtils.isEmpty(obj[2])) {// 项目名称
					itemInfo.setItemName(obj[2].toString());
				}
				if (!StringUtils.isEmpty(obj[3])) {// 规格
					itemInfo.setItemSpecs(obj[3].toString());
				}
				
				if (!StringUtils.isEmpty(obj[4]) && !"-".equals(obj[4])) {// 价格
					itemInfo.setSalePrice(new BigDecimal(obj[4].toString()));
				}
				if (!StringUtils.isEmpty(obj[5])) {// 单位
					itemInfo.setItemUnit(obj[5].toString());
				}
				if (!StringUtils.isEmpty(obj[6])) {// 药品标志
					itemInfo.setItemFlag(obj[6].toString());
				}
				if (!StringUtils.isEmpty(obj[7])) {// 项目类型
					itemInfo.setFeeCode(obj[7].toString());
				}
				if (!StringUtils.isEmpty(obj[8])) {// 执行科室
					itemInfo.setExeDept(obj[8].toString());
				}
				if (!StringUtils.isEmpty(obj[9])) {// 数量
					itemInfo.setAmount(Integer.parseInt(obj[9].toString()));
				}
				chargeList.add(itemInfo);
			}
		}
		return chargeList;
	}
	
	/**    
	 * 功能描述：生成处方号返回给前台
	 *@return       
	 *@author gw
	 *@date 2017年4月25日             
	*/
	@RequestMapping(value = "/getRecipeId", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getRecipeId(){
		String recipeId = redisSequenceManager.get("OC_CHARGEDETAIL", "RECIPE_ID");//获取处方号
		if(StringUtils.isNotEmpty(recipeId)){
			return ResultUtils.renderSuccessResult(recipeId);
		}else{
			return ResultUtils.renderFailureResult("未获取到处方号");
		}
	}
	
	/**    
	 * 功能描述：根据科室和药品id获取库存
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月16日             
	*/
	@RequestMapping(value = "/getDrugStock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result getDrugStock(@RequestBody String data){
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from CommonItemInfo where 1=1 ");
		if (jsonObj != null) {
			String drugId = jsonObj.getString("drugId");
			String drugDept = jsonObj.getString("exeDept"); // 药品科室id
			if (StringUtils.isNotBlank(drugDept)) {
				jql.append(" and exeDept = ? ");
				values.add(drugDept);
			}
			if (StringUtils.isNotBlank(drugId)) {
				jql.append(" and id = ? ");
				values.add(drugId);
			}
		}
		List<CommonItemInfo> itemList = commonItemInfoManager.find(jql.toString(),values.toArray());
		String msg = "";
		if (itemList!=null && itemList.size()==1){
			CommonItemInfo item = itemList.get(0);
			return ResultUtils.renderSuccessResult(item.getStock());
		}else {
			if(itemList==null){
				msg="该执行科室科室不存在此药品！";
			}else if (itemList.size()==0){
				msg="该执行科室科室此药品库存不足！";
			}else if(itemList.size()>1){
				msg ="库存汇总表中数据不正确，请调整！";
			}
			return ResultUtils.renderFailureResult(msg);
		}
	}
}
