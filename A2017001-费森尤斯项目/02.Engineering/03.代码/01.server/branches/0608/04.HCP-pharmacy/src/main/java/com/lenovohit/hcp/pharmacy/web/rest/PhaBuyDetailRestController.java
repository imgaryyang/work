package com.lenovohit.hcp.pharmacy.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@RestController
@RequestMapping("/hcp/pharmacy/buyDetail")
public class PhaBuyDetailRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		System.out.println(data);
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		StringBuilder jql = new StringBuilder( "select a from PhaBuyDetail a left join a.drugInfo drug left join a.phaBuyBill b left join a.producer c where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(query.getCreateOper())){
			jql.append("and a.createOper = ? ");
			values.add(query.getCreateOper());
		}
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append("and a.hosId = ? ");
			values.add(query.getHosId());
		}
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append("and a.buyBill = ? ");
			values.add(query.getBuyBill());
		}
		if(StringUtils.isNotEmpty(query.getDrugCode())){
			jql.append("and a.drugCode = ? ");
			values.add(query.getDrugCode());
		}
		if(query.getPhaBuyBill() != null ){
			if(StringUtils.isNotEmpty(query.getPhaBuyBill().getBuyState())){
				jql.append("and b.buyState = ? ");
				values.add(query.getPhaBuyBill().getBuyState());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		System.out.println(jql.toString());
		phaBuyDetailManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PhaBuyDetail model= phaBuyDetailManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		StringBuilder jql = new StringBuilder( "select a from PhaBuyDetail a left join a.producer where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append(" And a.hosId = ?");
			values.add(query.getHosId());
		}
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append(" And a.buyBill = ?");
			values.add(query.getBuyBill());
		}
		if(StringUtils.isNotEmpty(query.getCreateOper())){
			jql.append(" And a.createOper = ?");
			values.add(query.getCreateOper());
		}
		
		List<PhaBuyDetail> models = phaBuyDetailManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	/**
	 * 查询列表--包含  本院库存， 本科室库存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		System.out.println(query);
		
		StringBuilder jql = new StringBuilder( " from PhaBuyDetail where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();

		jql.append(" And hosId = ?");
		values.add(user.getHosId());
			
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append(" And buyBill = ?");
			values.add(query.getBuyBill());
		}
		
		List<PhaBuyDetail> models = phaBuyDetailManager.find(jql.toString(), values.toArray());
		
		for(PhaBuyDetail item : models){
			//查询本科室库存
			StringBuilder jql2 = new StringBuilder(" from PhaStoreSumInfo where hosId = ? and deptId = ? and drugCode = ? ");
			List<Object> values2 = new ArrayList<Object>();
			values2.add(user.getHosId());
			values2.add(user.getLoginDepartment().getId());
			values2.add(item.getDrugCode());
			List<PhaStoreSumInfo> models2 = phaStoreSumInfoManager.find(jql2.toString(), values2.toArray());
			if(StringUtils.isNotBlank(models2)&& models2.size()>0&&StringUtils.isNotBlank(models2.get(0))){
				item.setDeptSum(models2.get(0).getStoreSum());
			}else{
				item.setDeptSum(new BigDecimal(0));
			}
			
			//查询本院库存
			StringBuilder jql3 = new StringBuilder(" select sum(store_Sum),drug_Code,hos_Id from Pha_StoreSumInfo group by hos_Id,drug_Code having hos_Id=? and drug_Code = ?  ");
			List<Object> values3 = new ArrayList<Object>();
			values3.add(user.getHosId());
			values3.add(item.getDrugCode());
			List<Object> models3 =(List<Object>) phaStoreSumInfoManager.findBySql(jql3.toString(), values3.toArray());

			if(StringUtils.isNotBlank(models3)&& models3.size()>0&&StringUtils.isNotBlank(models3.get(0))){
				Object[] obj =(Object[]) models3.get(0);
				item.setTotalSum(new BigDecimal(String.valueOf(obj[0])));
			}else{
				item.setTotalSum(new BigDecimal(0));
			}
		}
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/saveBatch",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		System.out.println(data);
		List<PhaBuyDetail> models =  (List<PhaBuyDetail>) JSONUtils.parseObject(data,new TypeReference< List<PhaBuyDetail>>(){});
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		try {
			for( PhaBuyDetail model : models ){
				if( StringUtils.isEmpty(model.getId())){
					model.setCreateOper(user.getName());
					model.setCreateTime(now);
				}
				model.setUpdateOper(user.getName());
				model.setUpdateTime(now);
			}
			System.out.println("====batchSave======");
			this.phaBuyDetailManager.batchSave(models);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaBuyDetail model =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PhaBuyDetail newModel =phaBuyDetailManager.get(model.getId());
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		if(!StringUtils.isEmpty(model.getAuitdNum())){
			newModel.setAuitdNum(model.getAuitdNum());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		this.phaBuyDetailManager.save(newModel);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.phaBuyDetailManager.delete(id);
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
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_COMPANYINFO WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaBuyDetailManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
