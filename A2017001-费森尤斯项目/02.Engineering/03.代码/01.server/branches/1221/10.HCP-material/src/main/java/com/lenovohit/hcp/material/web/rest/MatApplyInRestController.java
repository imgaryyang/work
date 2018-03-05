package com.lenovohit.hcp.material.web.rest;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
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

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.ConvertUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.manager.MatOutStockCheckManger;
import com.lenovohit.hcp.material.model.MatApplyIn;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;



@RestController  
@RequestMapping("/hcp/material/instock")
public class MatApplyInRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MatApplyIn, String> matApplyInManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private MatOutStockCheckManger matOutStockCheckManger;
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;

	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		System.out.println(data);
		List<MatApplyIn> models =  (List<MatApplyIn>) JSONUtils.parseObject(data,new TypeReference< List<MatApplyIn>>(){});
		Date now =  new Date();
		String appBill = null;
		try {
			for( MatApplyIn model : models ){
				if( StringUtils.isEmpty(model.getAppBill())){
					if(appBill == null){appBill =redisSequenceManager.get("MATERIAL_APPLYIN", "APP_BILL");}
					model.setAppBill(appBill);
				}
				model.setBuyCost(model.getBuyPrice().multiply(model.getAppNum()).setScale(2,BigDecimal.ROUND_HALF_UP));
				model.setSaleCost(model.getSalePrice().multiply(model.getAppNum()).setScale(2,BigDecimal.ROUND_HALF_UP));
				model.setAppTime(now);
			}
			//TODO 校验
			HcpUser user = this.getCurrentUser();
			for(int i=0;i<models.size();i++){
				MatApplyIn temp=models.get(i);
				temp.getMatInfo().getId();   //物资Id;
				String jql ="from MatStoreSumInfo m where m.hosId = ? and m.materialInfo.id = ? and deptId = ? ";
				List<Object> values=new ArrayList<Object>();
				values.add(user.getHosId());
				values.add(temp.getMatInfo().getId());
				values.add(temp.getFromDeptId());
				List<MatStoreSumInfo> storeSum=(List<MatStoreSumInfo>) matStoreSumInfoManager.findByJql(jql, values.toArray());
				if(storeSum!=null && storeSum.size()>0 && storeSum.get(0).getStoreSum().compareTo(temp.getAppNum())<0){
					return ResultUtils.renderFailureResult("申请数量大于原科室库存量，请重新输入");
				}
			}
			System.out.println("====batchSave======");
			this.matApplyInManager.batchSave(models);
		} catch (Exception e) {

			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		
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
			this.matApplyInManager.delete(id);
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
		MatApplyIn model =  JSONUtils.deserialize(data, MatApplyIn.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.matApplyInManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "apply/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " from MatApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		
		jql.append(" And deptId = ? ");
		values.add(user.getLoginDepartment().getId());
		
		
		
		if(StringUtils.isNotEmpty(query.getAppState())){
			System.out.println("===getAppState===="+query.getAppState());
			jql.append(" And appState = ?");
			values.add(query.getAppState());
			
		}
		if(StringUtils.isNotEmpty(query.getAppBill())){
			System.out.println("===getAppState===="+query.getAppBill());
			jql.append(" And appBill = ?");
			values.add(query.getAppBill());
			
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			System.out.println("===getAppState===="+query.getDeptId());
			jql.append(" And deptId = ?");
			values.add(query.getDeptId());
			
		}
	
		
		List<MatApplyIn> models = matApplyInManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询请领单--请领核准入库
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "applyAuitd/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result auitdList(@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( "select distinct appBill,createOper,createTime from MatApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
						
		if(StringUtils.isNotEmpty(query.getAppState())){
			jql.append(" And appState = ?");
			values.add(query.getAppState());
			
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			jql.append(" And deptId = ?");
			values.add(query.getDeptId());
			
		}
		
		List<Object> models = (List<Object>) matApplyInManager.findByJql(jql.toString(), values.toArray());
		List<MatApplyIn> result = new ArrayList<MatApplyIn>();
		
		for(Object model : models){
			Object[] m = (Object[])model;
			MatApplyIn phaApplyIn = new MatApplyIn();
			if(StringUtils.isNotEmpty(m[0])){
				phaApplyIn.setAppBill(m[0].toString());
			}
			if(StringUtils.isNotEmpty(m[1])){
				phaApplyIn.setCreateOper(m[1].toString());
			}
			
			phaApplyIn.setCreateTime((Date)m[2]);
		
			result.add(phaApplyIn);
		}
		
		return ResultUtils.renderSuccessResult(result);
	}
	
	/**
	 * 查询请领详细列表--根据请领单号，药品名称，有分页
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/applyInDetail/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result applyInDetail(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " from MatApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And ( fromDeptId = ? or deptId =  ? ) ");
		values.add(user.getLoginDepartment().getId());
		values.add(user.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(query.getAppBill())){

			jql.append(" And appBill = ?");
			values.add(query.getAppBill());
			
		}
		if(StringUtils.isNotEmpty(query.getTradeName())){
			jql.append(" and tradeName like ? ");
			values.add("%"+query.getTradeName()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		System.out.println(jql.toString());
		matApplyInManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 查询请领详细列表--根据请领单号,无分页,
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/applyInDetailInfo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forApplyInDetailInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " from MatApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And fromDeptId = ?");
		values.add(user.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(query.getAppBill())){
			jql.append(" And appBill = ?");
			values.add(query.getAppBill());
			
		}
		
		List<MatApplyIn> models=matApplyInManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	/**
	 * 查询请领单--请领核准出库
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/applyInList/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result applyInList(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( "select id, appOper, appTime, deptName from MatApplyInView where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And ( fromDeptId = ? or deptId = ? ) ");
		values.add(user.getLoginDepartment().getId());
		values.add(user.getLoginDepartment().getId());
	    
		if(StringUtils.isNotEmpty(query.getAppState())){
			jql.append(" And appState = ?");
			values.add(query.getAppState());
			
		}
		if(StringUtils.isNotEmpty(query.getAppBill())){
			jql.append(" And id = ?");
			values.add(query.getAppBill());
			
		}
		if(StringUtils.isNotEmpty(query.getAppOper())){
			jql.append(" And appOper like ?");
			values.add("%"+query.getAppOper()+"%");
			
		}
		
		if(StringUtils.isNotBlank(query.getAppTime())){
			System.out.println("===getAppTime===="+query.getAppTime());
			Date beginDay = getBeginOfDay(query.getAppTime());
			Date endDay=getEndOfDay(query.getAppTime());
			jql.append(" And appTime BETWEEN ? AND ? ");
			values.add(beginDay);
			values.add(endDay);
			
		}
//		jql.append(" order by appTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		System.out.println(jql.toString());
		matApplyInManager.findPage(page);
		List<Object> objList = (List<Object>) page.getResult();
		//将List<Object[]>转换成List<Map>
		List<Map<Object, Object>> mapList = ConvertUtils.objectListToListMap(objList);
		page.setResult(mapList);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询请领单 (查询可修改请领单列表)
	 * @param data
	 * @return
	 * @author nobody
	 */
	@RequestMapping(value = "/apply/mainList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result applyInMainList(@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);

		StringBuilder jql = new StringBuilder( "select distinct appBill,hosId,appState,createOper,createOperId from MatApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And createOperId = ?");
		values.add(user.getId());
		System.out.println("user.getId():"+user.getId());
		
		if(StringUtils.isNotEmpty(query.getAppState())){
			System.out.println("===getAppState1===="+query.getAppState());
			jql.append(" And appState in (");
			String[] appStates = query.getAppState().split(",");
			for (int i = 0; i < appStates.length; i++) {
				jql.append("?");
				values.add(appStates[i]);
				if (i != appStates.length - 1)
					jql.append(",");
			}
			jql.append(")");

			
		}
		jql.append(" and appBill is not null and createOper is not null ");
		
		jql.append(" order by appBill desc ");
		
		System.out.println(jql.toString());
		
		List<MatApplyIn> models = matApplyInManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 得到当天开始的时刻 比如 2017-03-21 00:00:00
	 * 
	 * @return
	 */
	private Date getBeginOfDay(Date date) {
		String beginTime = "00:00:00";
		String temp=DateUtils.date2String(date, DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		return getTimeOfDay(beginTime, temp);
	}

	private Date getTimeOfDay(String time, String date) {
		return DateUtils.string2Date(date + " " + time, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
	}

	/**
	 * 得到当天结束的时刻 比如 2017-03-21 23:59:59
	 * 
	 * @return
	 */
	private Date getEndOfDay(Date date) {
		String endTime = "23:59:59";
		String temp=DateUtils.date2String(date, DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		return getTimeOfDay(endTime, temp);
	}
	
	/**
	 * searchBar请领查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "searchBar/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result searchBarList(@RequestParam(value = "data", defaultValue = "") String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " select store from MatApplyIn store left join store.drugInfo drug  where store.appState = '0' ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append("and (store.tradeName like ? or drug.commonSpell like ? or drug.commonWb like ? or store.drugCode like ?) ");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
		}
		
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And store.hosId = ?");
		values.add(user.getHosId());
		
		jql.append(" And store.createOperId = ?");
		values.add(user.getId());
	
		List<MatApplyIn> models = matApplyInManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
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
			idSql.append("DELETE FROM PHA_APPLYIN WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.matApplyInManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 更新---根据单号修改---用于请领审核出库
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateApplyIn", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateApplyIn(@RequestBody String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " update MATERIAL_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		
		values.add(user.getName());
		Date date=new Date();
		values.add(date);
		values.add("3");
		
		if(StringUtils.isNotEmpty(query.getComm())){
			values.add(query.getComm());	
		}else{
			values.add(null);	
		}
		
		jql.append(" And HOS_ID = ?");
		values.add(user.getHosId());
		jql.append(" And FROM_DEPT_ID = ?");
		values.add(user.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(query.getAppBill())){
			jql.append(" And APP_BILL = ?");
			values.add(query.getAppBill());
			
		}
		
		matApplyInManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 通过事物实现--请领审核出库 
	 * @param data
	 * @author zhx 2017.5.29
	 * @return
	 */
	@RequestMapping(value = "/matOutCheck", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMatOutCheck(@RequestBody String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		try {
			HcpUser hcpUser = this.getCurrentUser();
			matOutStockCheckManger.matOutCheck(query.getAppBill(), query.getComm(), hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 驳回--请领审核出库 
	 * @param data
	 * @author zhx 2017.6.4
	 * @return
	 */
	@RequestMapping(value = "/matOutCheckBack", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMatOutCheckBack(@RequestBody String data) {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		StringBuilder jql = new StringBuilder( " update MATERIAL_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,UPDATE_OPER = ?,UPDATE_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		
		Date date=new Date();
		values.add(user.getName());
		values.add(date);
		values.add(user.getName());
		values.add(date);
		values.add("7");
		
		if(StringUtils.isNotEmpty(query.getComm())){
			values.add(query.getComm());	
		}else{
			values.add(null);	
		}
		
		jql.append(" And HOS_ID = ?");
		values.add(user.getHosId());
		jql.append(" And FROM_DEPT_ID = ?");
		values.add(user.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(query.getAppBill())){
			jql.append(" And APP_BILL = ?");
			values.add(query.getAppBill());
			
		}
		
		matApplyInManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：导出单个盘点单详情
	 *@param request
	 *@param response
	 *@param data
	 *@throws IOException       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBillToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		MatApplyIn query =  JSONUtils.deserialize(data, MatApplyIn.class);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String hosId = user.getLoginDepartment().getHosId();

		StringBuilder jql = new StringBuilder( " from MatApplyIn check where 1=1 and hosId= ? ");
		values.add(hosId);
		
		if(!StringUtils.isEmpty(query.getAppBill())){//盘点单号
			jql.append(" and check.appBill = ? ");
			values.add(query.getAppBill());
		}
		List<MatApplyIn> infoList = matApplyInManager.find(jql.toString(), values.toArray());
	
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_请领计划明细";
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
		
		matOutStockCheckManger.exportDetailToExcel(infoList,out);
	}
}
