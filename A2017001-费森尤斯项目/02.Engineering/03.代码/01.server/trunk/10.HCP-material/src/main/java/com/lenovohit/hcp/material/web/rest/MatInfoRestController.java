package com.lenovohit.hcp.material.web.rest;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.manager.MatInfoRestManager;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatPrice;
import com.lenovohit.hcp.material.model.MatPriceView;

@RestController
@RequestMapping("/hcp/material/settings/materialInfo")
public class MatInfoRestController extends HcpBaseRestController {
	
	

	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	
	@Autowired
	private GenericManager<MatPrice, String> matPriceManager;
	
	@Autowired
	private GenericManager<MatPriceView, String> matPriceViewManager;
	
	@Autowired
	private GenericManager<Company, String> companyManager;
	
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	@Autowired
	private MatInfoRestManager matInfoRestManager;
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
		MatInfo query = JSONUtils.deserialize(data, MatInfo.class);
		StringBuilder jql = new StringBuilder("from MatPriceView where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and commonSpell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and commonWb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getMaterialType())) {
			jql.append("and materialType = ? ");
			values.add(query.getMaterialType());
		}
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and (commonName like ? or commonSpell like ? or commonWb like ? or alias like ? or aliasSpell like ? or aliasWb like ? or barcode = ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add(query.getCommonName());
		}
		if (StringUtils.isNotBlank(query.getMaterialCode())) {
			jql.append("and materialCode = ? ");
			values.add(query.getMaterialCode());
		}
		HcpUser user = this.getCurrentUser();
		if("operate".equals(chanel)){
			jql.append(" and  mHosId = 'H0027' and hosId = 'H0027' ");
		}else{
			jql.append(" and  ( mHosId = ? or mHosId = 'H0027' ) and hosId = ? ");
			values.add(user.getHosId());
			values.add(user.getHosId());
		} 
		
		jql.append(" order by materialCode, updateTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		matPriceViewManager.findPage(page);
		page.setResult(convertList((List<MatPriceView>)page.getResult()));
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		//MatPriceView model = matPriceViewManager.get(id);
		//查询物资-价格单项
		StringBuilder jql = new StringBuilder("from MatPriceView where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		HcpUser user = this.getCurrentUser();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		
		jql.append("and materialId = ? ");
		values.add(id);
		
		MatPriceView model = matPriceViewManager.findOne(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(convertTo(model));
	}

	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<MatPriceView> models = matPriceViewManager.findAll();
		return ResultUtils.renderSuccessResult(convertList(models));
	}

	/**
	 * 保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save/{chanel}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@PathVariable("chanel") String chanel, @RequestBody String data) {
		MatInfo model = JSONUtils.deserialize(data, MatInfo.class);
		// 设置厂商
		Company company = new Company();
		company.setId(model.getProducer());
		model.setCompanyInfo(company);
		// 设置通用名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonSpell()))
			model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonWb()))
			model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		// 设置别名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasSpell()))
			model.setAliasSpell(PinyinUtil.getFirstSpell(model.getAlias()));
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasWb()))
			model.setAliasWb(WubiUtil.getWBCode(model.getAlias()));
		
		HcpUser user = this.getCurrentUser();
		MatInfo saved = null;
		if("operate".equals(chanel)){//判断操作方是集团还是子级医院
			//保存集团以及下级医院的物资、价格基本信息
			saved = this.matInfoRestManager.createMatInfoGroup(model, user);
		}else{
			//保存子医院的物资、价格基本信息
			saved = this.matInfoRestManager.createMatInfo(model, user);
		}
		
		return ResultUtils.renderSuccessResult(saved);
	}

	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MatInfo model = JSONUtils.deserialize(data, MatInfo.class);
		// 设置厂商
		Company company = new Company();
		company.setId(model.getProducer());
		model.setCompanyInfo(company);
		// 设置通用名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonSpell()))
			model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonWb()))
			model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		// 设置别名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasSpell()))
			model.setAliasSpell(PinyinUtil.getFirstSpell(model.getAlias()));
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasWb()))
			model.setAliasWb(WubiUtil.getWBCode(model.getAlias()));
		
		HcpUser user = this.getCurrentUser();
		MatInfo saved = this.matInfoRestManager.createMatInfo(model, user);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id) {
		try {
			this.matInfoManager.delete(id);
			
			//删除物质-价格相关记录
			MatInfo info = new MatInfo();
			info.setId(id);
			delPrice(info);
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
	public Result forRemoveSelected(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM MATERIAL_INFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
				
				//删除物质-价格相关记录
				MatInfo info = new MatInfo();
				info.setId(ids.get(i).toString());
				delPrice(info);
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.matInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	
	/**
	 * 
	 * @param matInfo
	 * @return
	 */
	public MatPrice converTo(MatInfo matInfo, MatPrice price){
		if(price == null){
			price = new MatPrice();
		}
		price.setMatInfo(matInfo);
		price.setMaterialCode(matInfo.getMaterialCode());
		price.setCenterCode(matInfo.getCenterCode());
		price.setBuyPrice(matInfo.getBuyPrice());
		price.setWholePrice(matInfo.getWholePrice());
		price.setSalePrice(matInfo.getSalePrice());
		price.setTaxBuyPrice(matInfo.getTaxBuyPrice());
		price.setTaxSalePrice(matInfo.getTaxSalePrice());
		price.setStopFlag(matInfo.getStopFlag());
		price.setItemCode(matInfo.getItemCode());
		price.setFeeFlag(matInfo.getFeeFlag());
		HcpUser user = this.getCurrentUser();
		price.setHosId(user.getHosId());
	    return price;
	}
	
	
	/**
	 * 
	 * @param matInfo
	 * @return
	 */
	public MatInfo convertTo(MatPriceView view){
		MatInfo info = new MatInfo();
		info = matInfoManager.get(view.getMaterialId());
		/*info.setId(view.getMaterialId());
		info.setMaterialSpecs(view.getMaterialSpecs());
		info.setMaterialUnit(view.getMaterialUnit());
		info.setMaxUnit(view.getMaxUnit());
		info.setMaterialQuantity(view.getMaterialQuantity());
		Company company = companyManager.get(view.getProducer());
		if(company == null){
			company = new Company();
			company.setId(view.getProducer());
		}
		info.setCompanyInfo(company);
		info.setRegisterId(view.getRegisterId());
		info.setRegisterCode(view.getRegisterCode());
		info.setRegisterName(view.getRegisterName());
		info.setCountryCode(view.getCountryCode());
		info.setPriceCode(view.getPriceCode());
		info.setDisposable(view.getDisposable());
		info.setImplant(view.getImplant());
		info.setAlias(view.getAlias());
		info.setAliasSpell(view.getAliasSpell());
		info.setAliasWb(view.getAliasWb());
		info.setCommonSpell(view.getCommonSpell());
		info.setCommonWb(view.getCommonWb());
		info.setUserCode(view.getUserCode());
		info.setMaterialType(view.getMaterialType());
		info.setBarcode(view.getBarcode());
		info.setCommonName(view.getCommonName());
		info.setMaterialCode(view.getMaterialCode());
		info.setCenterCode(view.getCenterCode());*/
		info.setFeeFlag(view.getFeeFlag());
		info.setItemCode(view.getItemCode());
		info.setItemName(view.getItemName());
		info.setBuyPrice(view.getBuyPrice());
		info.setWholePrice(view.getWholePrice());
		info.setSalePrice(view.getSalePrice());
		info.setTaxBuyPrice(view.getTaxBuyPrice());
		info.setTaxSalePrice(view.getTaxSalePrice());
		info.setStopFlag(view.getStopFlag());
		//info.setHosId(view.getHosId());
		info.setCreateOper(view.getCreateOper());
		info.setCreateOperId(view.getCreateOperId());
		info.setCreateTime(view.getCreateTime());
		info.setUpdateOper(view.getUpdateOper());
		info.setUpdateOperId(view.getUpdateOperId());
		info.setUpdateTime(view.getUpdateTime());
	    return info;
	}
	
	/**
	 * 
	 * @param matInfo
	 * @return
	 */
	public List<MatInfo> convertList(List<MatPriceView> viewList){
		List<MatInfo> matList = new ArrayList<MatInfo>();
		if(viewList != null && viewList.size()>0){
			for(int i = 0; i < viewList.size(); i++){
				matList.add(convertTo(viewList.get(i)));
			}
		}
	    return matList;
	}
	
	/**
	 * 装配查询语句
	 * @param chanel
	 * @param query
	 * @return
	 */
	public Map search(String chanel,  MatInfo query){
		Map map = new HashMap();
		StringBuilder jql = new StringBuilder("select m.id, m.host_id, m.material_code from MATERIAL_INFO m left join MATERIAL_PRICE p on p.MATERIAL_ID = m.id where 1=1");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and m.common_spell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and m.common_wb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getMaterialType())) {
			jql.append("and m.material_type = ? ");
			values.add(query.getMaterialType());
		}
		
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and (m.common_name like ? or m.common_spell like ? or m.common_wb like ? or m.alias like ? or m.alias_spell like ? or m.alias_wb like ? or m.barcode = ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add(query.getCommonName());
		}
		if (StringUtils.isNotBlank(query.getMaterialCode())) {
			jql.append("and m.material_code = ? ");
			values.add(query.getMaterialCode());
		}
		if (!StringUtils.isEmpty(query.getId())) {
			jql.append("and m.id = ? ");
			values.add(query.getId());
		}
		HcpUser user = this.getCurrentUser();
		if("operate".equals(chanel)){
			jql.append(" and  m.hos_id = 'H0027' ");
		}else{
			jql.append(" and ( m.hos_id = ? or m.hos_id = 'H0027' ) ");
			values.add(user.getHosId());
		}
		
		jql.append(" order by m.update_time desc ");
		map.put("sql", jql);
		map.put("values", values.toArray());
	    return map;
	}
	
	
	
	/**
	 * 删除物资-价格记录
	 * @param matInfo
	 */
	public void delPrice(MatInfo matInfo){
		StringBuilder jql = new StringBuilder("from MatPrice where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		HcpUser user = this.getCurrentUser();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		
		jql.append("and matInfo.id = ? ");
		values.add(matInfo.getId());
		
		List<MatPrice> priceList = matPriceManager.find(jql.toString(), values.toArray());
		if(priceList != null && priceList.size() > 0){
			for(MatPrice price : priceList){
				this.matPriceManager.delete(price);
			}
		}
		
	}
	
	@RequestMapping(value = "/{chanel}/exportInfoToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportInfoToExcel(HttpServletRequest request, HttpServletResponse response,
			@PathVariable("chanel") String chanel,@RequestParam(value = "data", defaultValue = "") String data) {
		MatInfo query = JSONUtils.deserialize(data, MatInfo.class);
		StringBuilder jql = new StringBuilder("from MatPriceView where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and commonSpell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and commonWb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getMaterialType())) {
			jql.append("and materialType = ? ");
			values.add(query.getMaterialType());
		}
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and (commonName like ? or commonSpell like ? or commonWb like ? or alias like ? or aliasSpell like ? or aliasWb like ? or barcode = ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add(query.getCommonName());
		}
		if (StringUtils.isNotBlank(query.getMaterialCode())) {
			jql.append("and materialCode = ? ");
			values.add(query.getMaterialCode());
		}
		HcpUser user = this.getCurrentUser();
		if("operate".equals(chanel)){
			jql.append(" and  mHosId = 'H0027' and hosId = 'H0027' ");
		}else{
			jql.append(" and  ( mHosId = ? or mHosId = 'H0027' ) and hosId = ? ");
			values.add(user.getHosId());
			values.add(user.getHosId());
		} 
		
		jql.append(" order by materialType,materialCode, updateTime desc ");
		List<MatPriceView> list = matPriceViewManager.find(jql.toString(), values.toArray());
		List<MatInfo> infoList = convertList(list);
		try {
			String fileName = "QUANZHOU_DRUGINFO";
			String currentDate = DateUtils.getCurrentDateTimeStr();
			fileName = currentDate+fileName;
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
		matInfoRestManager.exportInfoToExcel(infoList, out,user);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
