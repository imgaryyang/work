package com.lenovohit.hcp.pharmacy.web.rest;

import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugInfoManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPrice;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;

@RestController
@RequestMapping("/hcp/pharmacy/settings/medicineMng")
public class PhaDrugInfoRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<PhaDrugPriceView, String> phaDrugPriceViewManager;
	@Autowired
	private GenericManager<PhaDrugPrice, String> phaDrugPriceManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	@Autowired
	private GenericManager<Company, String> phaCompanyInfoManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private PhaDrugInfoManager phaDrugInfo;

	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{chanel}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("chanel") String chanel, @PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		PhaDrugInfo query = JSONUtils.deserialize(data, PhaDrugInfo.class);
		StringBuilder jql = new StringBuilder("from PhaDrugPriceView where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		String hosId = user.getHosId();
		if("operate".equals(chanel)){//是否为集团判断
			jql.append(" and  hosId = 'H0027' ");
		}else{
			jql.append(" and ( hosId = ? or hosId = 'H0027' ) ");
			values.add(user.getHosId());
		}
		jql.append(" and pHosId = ? ");
		values.add(user.getHosId());
		if(!"H0027".equals(hosId)){
			/*
			if("undefined".equals(chanel)){//普通列表查询
				jql.append(" and pHosId = ? ");
			}else{//基础数据维护列表
				jql.append(" and (pHosId = ? or pHosId is null )");
			}
			values.add(user.getHosId());
		*/}
		//jql.append(" and hosId = ? ");
		//values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and commonSpell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and commonWb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getDrugType())) {
			jql.append("and drugType like ? ");
			values.add("%" + query.getDrugType() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and ( commonName like ? or commonSpell like ? or commonWb like ? or barCode = ? or tradeName like ? or tradeSpell like ? or tradeWb like ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add(query.getCommonName());
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			
		}
		if (!StringUtils.isEmpty(query.getTradeName())) {
			jql.append("and (tradeName like ? or commonName like ? or tradeSpell like ? or tradeWb like ? or barCode = ? )");
			values.add("%" + query.getTradeName() + "%");
			values.add("%" + query.getTradeName() + "%");
			values.add("%" + query.getTradeName() + "%");
			values.add("%" + query.getTradeName() + "%");
			values.add(query.getTradeName());
		}
		if (StringUtils.isNotBlank(query.getDrugCode())) {
			jql.append("and drugCode = ? ");
			values.add(query.getDrugCode());
		}

		jql.append(" order by createTime desc");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaDrugPriceViewManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		PhaDrugInfo model = phaDrugInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PhaDrugInfo> models = phaDrugInfoManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create/{chanel}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@PathVariable("chanel") String chanel,@RequestBody String data) {
		PhaDrugInfo model = JSONUtils.deserialize(data, PhaDrugInfo.class);
		PhaDrugPrice price = JSONUtils.deserialize(data, PhaDrugPrice.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		model.setCompanyInfo(phaCompanyInfoManager.get(model.getProducer()));
		model.setDoseUnit(StringUtils.isBlank(getDictNameByKey("DOSE_UNIT", model.getDoseUnit())) ? model.getDoseUnit()
				: getDictNameByKey("DOSE_UNIT", model.getDoseUnit()));
		model.setMiniUnit(StringUtils.isBlank(getDictNameByKey("MINI_UNIT", model.getMiniUnit())) ? model.getMiniUnit()
				: getDictNameByKey("MINI_UNIT", model.getMiniUnit()));
		model.setPackUnit(StringUtils.isBlank(getDictNameByKey("PACK_UNIT", model.getPackUnit())) ? model.getPackUnit()
				: getDictNameByKey("PACK_UNIT", model.getPackUnit()));
		model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		model.setTradeSpell(PinyinUtil.getFirstSpell(model.getTradeName()));
		model.setTradeWb(WubiUtil.getWBCode(model.getTradeName()));
		model.setDrugSpecs(model.getBaseDose() + model.getDoseUnit() + "*" + model.getPackQty() + model.getMiniUnit()
				+ "/" + model.getPackUnit());
		PhaDrugInfo saved = null;
		if("operate".equals(chanel)){
			//保存集团以及下级医院的药品、价格基本信息
			saved = this.phaDrugInfo.createDrugPriceGroup(price,model,user);
		}else{
			//保存子医院的药品、价格基本信息
			saved = this.phaDrugInfo.createDrugPrice(price, model, user);
		}
		return ResultUtils.renderSuccessResult(saved);
	}

	private String getDictNameByKey(String columnName, String key) {
		String hql = "from Dictionary where columnName = ? and columnKey = ? ";
		List<Dictionary> result = dictionaryManager.find(hql, columnName, key);
		if (result.size() > 0)
			return result.get(0).getColumnVal();
		return null;
	}

	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaDrugInfo model = JSONUtils.deserialize(data, PhaDrugInfo.class);
		JSONObject jsonObj = JSONObject.parseObject(data);
		if (model == null || StringUtils.isBlank(model.getProducer())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setCompanyInfo(phaCompanyInfoManager.get(model.getProducer()));
		model.setUpdateTime(now);
		model.setDoseUnit(StringUtils.isBlank(getDictNameByKey("DOSE_UNIT", model.getDoseUnit())) ? model.getDoseUnit()
				: getDictNameByKey("DOSE_UNIT", model.getDoseUnit()));
		model.setMiniUnit(StringUtils.isBlank(getDictNameByKey("MINI_UNIT", model.getMiniUnit())) ? model.getMiniUnit()
				: getDictNameByKey("MINI_UNIT", model.getMiniUnit()));
		model.setPackUnit(StringUtils.isBlank(getDictNameByKey("PACK_UNIT", model.getPackUnit())) ? model.getPackUnit()
				: getDictNameByKey("PACK_UNIT", model.getPackUnit()));
		model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		model.setTradeSpell(PinyinUtil.getFirstSpell(model.getTradeName()));
		model.setTradeWb(WubiUtil.getWBCode(model.getTradeName()));
		model.setDrugSpecs(model.getBaseDose() + model.getDoseUnit() + "*" + model.getPackQty() + model.getMiniUnit()
		+ "/" + model.getPackUnit());
		if(jsonObj!=null && StringUtils.isNotBlank(jsonObj.getString("chanel")) 
				&& jsonObj.getString("chanel").equalsIgnoreCase("finance")){//在财务界面编辑价格
			PhaDrugPrice price = JSONUtils.deserialize(data, PhaDrugPrice.class);
			String priceId = jsonObj.getString("priceId");
			if(StringUtils.isNotBlank(priceId)){//如果数据库中已存在次药品的价格信息
				price.setId(priceId);
			}
			PhaDrugInfo d = new PhaDrugInfo();
			d.setId(model.getId());
			price.setDrugInfo(d);
			phaDrugPriceManager.save(price);
		}else{
			this.phaDrugInfoManager.save(model);
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.phaDrugInfoManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除多项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_DRUGINFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaDrugInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/import", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result saveDrugInfoList(@RequestBody String data) {
		List<PhaDrugInfo> drugInfoList;
		try {
			drugInfoList = readXlsx("C:/Users/Administrator/Documents/druginfo.xlsx");
			this.phaDrugInfoManager.batchSave(drugInfoList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	 private List<PhaDrugInfo> readXlsx(String path) throws Exception {
	        InputStream is = new FileInputStream(path);
	        XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
	        List<PhaDrugInfo> result = new ArrayList<PhaDrugInfo>();
	        //生产厂商处理
	        HashMap<String,Company> companyMap = getCompanyMap();
	        //计量单位处理
	        Map<String,String> doseUnitMap = getDictByColumnName("DOSE_UNIT");
	        //最小单位
	        Map<String,String> miniUnitMap = getDictByColumnName("MINI_UNIT");
	        //包装单位
	        Map<String,String> packUnitMap = getDictByColumnName("PACK_UNIT");
	        // 循环每一页，并处理当前循环页
	        for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
	        	 XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
	            if (xssfSheet == null) {
	                continue;
	            }
	            // 处理当前页，循环读取每一行
	            for (int rowNum = 2; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
	                XSSFRow xssfRow = xssfSheet.getRow(rowNum);
	                PhaDrugInfo drugInfo = new PhaDrugInfo();
	                drugInfo.setHosId(xssfRow.getCell(0).toString());
	                drugInfo.setCommonName(xssfRow.getCell(5).toString());
	                drugInfo.setTradeName(xssfRow.getCell(6).toString());
	                drugInfo.setDrugSpecs(xssfRow.getCell(17).toString());
	                String drugSpecs = xssfRow.getCell(17).toString();
	                if(drugSpecs!=null){//规格处理
	        			if(drugSpecs.contains("/")){//判断是否包含包装单位
	        				String packUnit = drugSpecs.substring(drugSpecs.lastIndexOf("/")+1, drugSpecs.length()).trim();
	        				drugInfo.setPackUnit(packUnitMap.get(packUnit));
	        				if(drugSpecs.contains("*")){//最小包装单位
	        					String mini = drugSpecs.substring(drugSpecs.lastIndexOf("*")+1, drugSpecs.lastIndexOf("/")).trim();
	        					String miniUnit = mini.replaceAll("\\d+","").replaceAll("\\.","");
	        					if(mini.replaceAll(miniUnit, "")!=null){//最小数量
	        						Integer qty = new Integer(mini.replaceAll(miniUnit, "")); 
	        						drugInfo.setPackQty(qty);
	        					}
	        					drugInfo.setMiniUnit(miniUnitMap.get(miniUnit));
	        					
	        					String dose = drugSpecs.substring(0, drugSpecs.indexOf("*")).trim();
	        					String doseUnit = dose.replaceAll("\\d+","").replaceAll("\\.","");
	        					BigDecimal baseDose = new BigDecimal(dose.replaceAll(doseUnit, "")); 
	        					drugInfo.setDoseUnit(doseUnitMap.get(doseUnit));
	        					drugInfo.setBaseDose(baseDose);
	        				}else{
	        					String dose = drugSpecs.substring(0, drugSpecs.indexOf("/")).trim();
	        					String doseUnit = dose.replaceAll("\\d+","").replaceAll("\\.","");
	        					BigDecimal baseDose = new BigDecimal(dose.replaceAll(doseUnit, "")); 
	        					drugInfo.setDoseUnit(doseUnitMap.get(doseUnit));
	        					drugInfo.setBaseDose(baseDose);
	        				}
        				}else if(drugSpecs.contains("*")){//最小包装单位
        					String mini = drugSpecs.substring(drugSpecs.lastIndexOf("*")+1, drugSpecs.length()).trim();
        					String miniUnit = mini.replaceAll("\\d+","").replaceAll("\\.","");
        					if(mini.replaceAll(miniUnit, "")!=null){//最小数量
        						Integer qty = new Integer(mini.replaceAll(miniUnit, "")); 
        						drugInfo.setPackQty(qty);
        					}
        					drugInfo.setMiniUnit(miniUnitMap.get(miniUnit));
        					
        					String dose = drugSpecs.substring(0, drugSpecs.indexOf("*")).trim();
        					String doseUnit = dose.replaceAll("\\d+","").replaceAll("\\.","");
        					BigDecimal baseDose = new BigDecimal(dose.replaceAll(doseUnit, "")); 
        					drugInfo.setDoseUnit(doseUnitMap.get(doseUnit));
        					drugInfo.setBaseDose(baseDose);
        				}else{
        					String dose = drugSpecs;
        					String doseUnit = dose.replaceAll("\\d+","").replaceAll("\\.","");
        					BigDecimal baseDose = new BigDecimal(dose.replaceAll(doseUnit, "")); 
        					drugInfo.setDoseUnit(doseUnitMap.get(doseUnit));
        					drugInfo.setBaseDose(baseDose);
        				}
        			}
	                if(xssfRow.getCell(20)!=null){
	                	drugInfo.setCompanyInfo(companyMap.get(xssfRow.getCell(20).toString()));
	                }
	                //drugInfo.setBuyPrice(new BigDecimal(xssfRow.getCell(24).toString()));
	                drugInfo.setSalePrice(new BigDecimal(xssfRow.getCell(26).toString()));
	                drugInfo.setUsage(xssfRow.getCell(29).toString());
	                drugInfo.setStopFlag(new Boolean(xssfRow.getCell(34).toString()));
	                result.add(drugInfo);
	            }
	        }
	        return result;
	    }
	 
	 /**
	 * 查询所有生产厂商并封装成map
	 */
	private HashMap<String, Company> getCompanyMap(){
		 HashMap<String, Company> map = new HashMap<String,Company>();
		 List<Company> companyList =  phaCompanyInfoManager.findAll();
		 if(companyList!=null){
			 for(Company c: companyList){
				 map.put(c.getCompanyName(), c);
			 }
		 }
		 return map;
	 } 
	 
	/**
	 * @param data
	 * @return
	 */
	private Map<String,String> getDictByColumnName(String columnName) {
		Map<String,String> map = new HashMap<String,String>();
		try {
			List<String> idValues = new ArrayList<String>();
			StringBuilder idSql = new StringBuilder();
			String hosId = this.getCurrentUser().getHosId();
			idValues.add(hosId);
			idValues.add(columnName);
			
			idSql.append("SELECT dict from Dictionary dict WHERE dict.hosId = ? and columnName = ? ");
			idSql.append(") and stop = true order by columnName");
			List<Dictionary> models = dictionaryManager.find(idSql.toString(), idValues.toArray());
			
			if(models!=null){
				for(Dictionary d : models){
					map.put(d.getColumnVal(), d.getColumnKey());
				}
			}
			return map;
		} catch (Exception e) {
			return map;
		}
	}
	
	private PhaDrugInfo convertDrugSpecs(PhaDrugInfo drugInfo,String drugSpecs){
		if(drugSpecs!=null){
			if(drugSpecs.contains("/")){//判断是否包含包装单位
				String packUnit = drugSpecs.substring(drugSpecs.lastIndexOf("/")+1, drugSpecs.length()).trim();
			}
			
		}
		return drugInfo;
	}
}
