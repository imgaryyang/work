package com.lenovohit.hcp.pharmacy.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
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
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.ConvertUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaOutStockCheckManger;
import com.lenovohit.hcp.pharmacy.model.PhaApplyIn;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;



@RestController  
@RequestMapping("/hcp/pharmacy/instock")
public class PhaApplyInRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaApplyIn, String> phaApplyInManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private PhaOutStockCheckManger phaOutStockCheckManger;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<Company, String> companyManager;


	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		//System.out.println(data);
		List<PhaApplyIn> models =  (List<PhaApplyIn>) JSONUtils.parseObject(data,new TypeReference< List<PhaApplyIn>>(){});
		Date now =  new Date();
		String appBill = null;
		try {
			for( PhaApplyIn model : models ){
				if( StringUtils.isEmpty(model.getAppBill())){
					if(appBill == null){appBill =redisSequenceManager.get("PHA_APPLYIN", "APP_BILL");}
					model.setAppBill(appBill);
				}
				model.setAppTime(now);
			}
			//System.out.println("====batchSave======");
			this.phaApplyInManager.batchSave(models);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.phaApplyInManager.delete(id);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();

		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "apply/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " from PhaApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		
		jql.append(" And createOperId = ?");
		values.add(user.getId());
		
		
		
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
	
		
		List<PhaApplyIn> models = phaApplyInManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询请领单--请领核准入库
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "applyAuitd/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result auitdList(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( "select distinct appBill,createOper,createTime from PhaApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
						
		if(StringUtils.isNotEmpty(query.getAppState())){
			System.out.println("===getAppState===="+query.getAppState());
			jql.append(" And appState = ?");
			values.add(query.getAppState());
			
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			System.out.println("===getDeptId===="+query.getDeptId());
			jql.append(" And deptId = ?");
			values.add(query.getDeptId());
			
		}
		jql.append(" order by createTime desc");
		List<?> models = phaApplyInManager.findByJql(jql.toString(), values.toArray());
		List<PhaApplyIn> result = new ArrayList<PhaApplyIn>();
		
		for(Object model : models){
			Object[] m = (Object[])model;
			PhaApplyIn phaApplyIn = new PhaApplyIn();
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
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " from PhaApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And ( fromDeptId = ? or deptId = ? ) ");
		values.add(user.getLoginDepartment().getId());
		values.add(user.getLoginDepartment().getId());
		if(StringUtils.isNotEmpty(query.getAppBill())){
			System.out.println("===getAppBill===="+query.getAppBill());
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
		phaApplyInManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 查询请领详细列表--根据请领单号,无分页,
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/applyInDetailInfo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forApplyInDetailInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " from PhaApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And fromDeptId = ?");
		values.add(user.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(query.getAppBill())){
			System.out.println("===getAppBill===="+query.getAppBill());
			jql.append(" And appBill = ?");
			values.add(query.getAppBill());
			
		}
		
		List<PhaApplyIn> models=phaApplyInManager.find(jql.toString(), values.toArray());
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
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( "select id, appOper, appTime, deptName from PhaApplyInView where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		HcpUser user = this.getCurrentUser();
		 
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And fromDeptId = ? or deptId = ? "); 
		values.add(user.getLoginDepartment().getId());
		values.add(user.getLoginDepartment().getId());
	    
		if(StringUtils.isNotEmpty(query.getAppBill())){
			jql.append(" And id = ?");
			values.add(query.getAppBill());
		}
		if(StringUtils.isNotEmpty(query.getAppState())){
			jql.append(" And appState = ?");
			values.add(query.getAppState());
			
		}
		if(StringUtils.isNotEmpty(query.getAppOper())){
			jql.append(" And appOper like ?");
			values.add("%"+query.getAppOper()+"%");
			
		}
		
		if(StringUtils.isNotBlank(query.getAppTime())){
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
		phaApplyInManager.findPage(page);
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
	 * @author BLB
	 */
	@RequestMapping(value = "/apply/mainList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result applyInMainList(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);

		StringBuilder jql = new StringBuilder( "select distinct appBill,hosId,appState,createOper,createOperId from PhaApplyIn where 1=1 ");
		//StringBuilder jql = new StringBuilder( "select id, appOper, appTime, deptName, createOperId from PhaApplyInView where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		//jql.append(" And fromDeptId = ?");
		//values.add(user.getLoginDepartment().getId());
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
		/*
		if(StringUtils.isNotEmpty(query.getAppOper())){
			System.out.println("===getAppOper1===="+query.getAppOper());
			jql.append(" And appOper like ?");
			values.add("%"+query.getAppOper()+"%");
			
		}*/
		/*
		if(StringUtils.isNotBlank(query.getAppTime())){
			System.out.println("===getAppTime1===="+query.getAppTime());
			Date beginDay = getBeginOfDay(query.getAppTime());
			Date endDay=getEndOfDay(query.getAppTime());
			jql.append(" And appTime BETWEEN ? AND ? ");
			values.add(beginDay);
			values.add(endDay);
			
		}*/
		jql.append(" and appBill is not null and createOper is not null ");
		
		jql.append(" order by appBill desc ");
		
		System.out.println(jql.toString());
		
		List<PhaApplyIn> models = phaApplyInManager.find(jql.toString(), values.toArray());
		
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
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " select store from PhaApplyIn store left join store.drugInfo drug  where store.appState = '0' ");
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
	
		List<PhaApplyIn> models = phaApplyInManager.find(jql.toString(), values.toArray());
		
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
			this.phaApplyInManager.executeSql(idSql.toString(), idvalues.toArray());
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
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " update PHA_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		values.add(user.getName());
		Date date=new Date();
		values.add(date);
		values.add("3");
		
		System.out.println("===getComm===="+query.getComm());
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
			System.out.println("===getAppBill===="+query.getAppBill());
			jql.append(" And APP_BILL = ?");
			values.add(query.getAppBill());
			
		}
		
		phaApplyInManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 通过事物实现--请领审核出库 
	 * @param data
	 * @author zhx 2017.5.29
	 * @return
	 */
	@RequestMapping(value = "/phaOutCheck", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPhaOutCheck(@RequestBody String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		List<PhaOutputInfo> phaOutputInfos = null;
		try {
			HcpUser hcpUser = this.getCurrentUser();
			phaOutputInfos = phaOutStockCheckManger.phaOutCheck(query.getAppBill(), query.getComm(), hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(phaOutputInfos);
	}
	
	/**
	 * 驳回--请领审核出库 
	 * @param data
	 * @author zhx 2017.6.4
	 * @return
	 */
	@RequestMapping(value = "/phaOutCheckBack", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPhaOutCheckBack(@RequestBody String data) {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);
		StringBuilder jql = new StringBuilder( " update PHA_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,UPDATE_OPER = ?,UPDATE_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		Date date=new Date();
		values.add(user.getName());
		values.add(date);
		values.add(user.getName());
		values.add(date);
		values.add("7");
		
		System.out.println("===getComm===="+query.getComm());
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
			System.out.println("===getAppBill===="+query.getAppBill());
			jql.append(" And APP_BILL = ?");
			values.add(query.getAppBill());
			
		}
		
		phaApplyInManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}

	/**    
	 * 功能描述：导出数据到excel中,请领计划查询（右侧）
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author zhx
	 * @throws IOException 
	 * @date 2017年6月14日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportDetailToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		PhaApplyIn query =  JSONUtils.deserialize(data, PhaApplyIn.class);

		StringBuilder jql = new StringBuilder( "from PhaApplyIn where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(StringUtils.isNotBlank(query.getAppBill())){
			jql.append(" and appBill = ? ");
			values.add(query.getAppBill());
		}
		List<PhaApplyIn> buyBillList = phaApplyInManager.find(jql.toString(), values.toArray());
		
		String fileName = "请领计划明细";
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
		response.setCharacterEncoding("UTF-8") ;
		out = response.getOutputStream();
		createExcel(buyBillList,out);
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：导出出库明细到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcel(List<PhaApplyIn> OutputInfoList,OutputStream out) {
		
		Map<String, String> drugType=new HashMap<String,String>();
		drugType.put("001", "西药");
		drugType.put("002", "中成药");
		drugType.put("003", "中草药");
		
		Map<String, String> appState=new HashMap<String,String>();
		appState.put("1", "未出库");
		appState.put("2", "已出库（请领完成）");
		appState.put("3", "请领");
		appState.put("4", "请领单作废");
		appState.put("5", "请领出库未入库");
		appState.put("6", "出库单已核准入库");
		appState.put("7", "请领驳回");
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFCellStyle cellStyle = wb.createCellStyle();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			cellStyle.setFont(font);
			
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("请领计划明细");
			sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,8 * 512);
			sheet.setColumnWidth(3,8 * 512);
			sheet.setColumnWidth(4,8 * 512);
			sheet.setColumnWidth(5,8* 512);
			sheet.setColumnWidth(6,8 * 512);
			sheet.setColumnWidth(7,8 * 512);
			sheet.setColumnWidth(8,8 * 512);
			sheet.setColumnWidth(9,8 * 512);
			sheet.setColumnWidth(10,8 * 512);
			sheet.setColumnWidth(11,8 * 512);
			sheet.setColumnWidth(12,8 * 512);
			sheet.setColumnWidth(13,8 * 512);
			sheet.setColumnWidth(14,8 * 512);
			sheet.setColumnWidth(15,8 * 512);
			sheet.setColumnWidth(16,8 * 512);
			sheet.setColumnWidth(17,8 * 512);
			sheet.setColumnWidth(18,8 * 512);
			sheet.setColumnWidth(19,8 * 512);
			sheet.setColumnWidth(20,8 * 512);
			sheet.setColumnWidth(21,8 * 512);
			sheet.setColumnWidth(22,8 * 512);
			sheet.setColumnWidth(23,8 * 512);
			sheet.setColumnWidth(24,8 * 512);

			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
		    font.setFontHeightInPoints((short) 25);//高度
		    style.setFont(font);
		    style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
		    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			 row0.setHeightInPoints((short) 50);
			 XSSFCell cell = row0.createCell(0);
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 24));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("请领计划清单");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("请领单号");
			row1.createCell(1).setCellValue("请领科室");
			row1.createCell(2).setCellValue("出药库房");
			row1.createCell(3).setCellValue("药品编码");
			row1.createCell(4).setCellValue("药品名称");
			row1.createCell(5).setCellValue("规格");
			row1.createCell(6).setCellValue("类型");
			row1.createCell(7).setCellValue("批次");
			row1.createCell(8).setCellValue("批号");
			row1.createCell(9).setCellValue("生产日期");
			row1.createCell(10).setCellValue("有效期");
			row1.createCell(11).setCellValue("生产厂商");
			row1.createCell(12).setCellValue("供应商");
			row1.createCell(13).setCellValue("购入价");
			row1.createCell(14).setCellValue("售价");
			row1.createCell(15).setCellValue("请领数量");
			row1.createCell(16).setCellValue("审核数量");
			row1.createCell(17).setCellValue("采购金额");
			row1.createCell(18).setCellValue("售价金额");
			row1.createCell(19).setCellValue("申请人");
			row1.createCell(20).setCellValue("申请时间");
			row1.createCell(21).setCellValue("核准人");
			row1.createCell(22).setCellValue("审核时间");
			row1.createCell(23).setCellValue("状态");
			row1.createCell(24).setCellValue("备注");
			//循环将dataList插入表中
			if(OutputInfoList!=null&& OutputInfoList.size()>0){
				for(int i=0;i<OutputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					PhaApplyIn info = OutputInfoList.get(i);
					row.createCell(0).setCellValue(info.getAppBill());
					row.createCell(1).setCellValue(!"".equals(info.getDeptId()) && info.getDeptId()!=null ? departmentManager.get(info.getDeptId()).getDeptName():"");
					row.createCell(2).setCellValue(!"".equals(info.getFromDeptId()) && info.getFromDeptId()!=null ? departmentManager.get(info.getFromDeptId()).getDeptName():"");
					row.createCell(3).setCellValue(info.getDrugCode());
					row.createCell(4).setCellValue(info.getTradeName());
					row.createCell(5).setCellValue(info.getSpecs());
					row.createCell(6).setCellValue(!"".equals(info.getDrugType()) && info.getDrugType()!=null ? drugType.get(info.getDrugType()):"");
					row.createCell(7).setCellValue(info.getBatchNo());
					row.createCell(8).setCellValue(info.getApprovalNo());
					row.createCell(9).setCellValue(info.getProduceDate()!=null ? DateUtils.date2String(info.getProduceDate(), "yyyy-MM-dd"):"");
					row.createCell(10).setCellValue(info.getValidDate()!=null ? DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"):"");
					row.createCell(11).setCellValue( info.getDrugInfo()!=null && info.getDrugInfo().getCompanyInfo()!=null ? info.getDrugInfo().getCompanyInfo().getCompanyName():"");
					row.createCell(12).setCellValue(!"".equals(info.getCompany()) && info.getCompany()!=null ? companyManager.get(info.getCompany()).getCompanyName():"");
					row.createCell(13).setCellValue(info.getBuyPrice()!=null ? info.getBuyPrice().toString():"");
					row.createCell(14).setCellValue(info.getSalePrice()!=null ? info.getSalePrice().toString():"");
					row.createCell(15).setCellValue(info.getAppNum()!=null ? info.getAppNum().intValue()+info.getAppUnit():"");
					row.createCell(16).setCellValue(info.getCheckNum()!=null ? info.getCheckNum().intValue()+info.getAppUnit():"");
					row.createCell(17).setCellValue(info.getBuyCost()!=null ? info.getBuyCost().toString():"");
					row.createCell(18).setCellValue(info.getSaleCost()!=null ? info.getSaleCost().toString():"");
					row.createCell(19).setCellValue(info.getAppOper());
					row.createCell(20).setCellValue(info.getAppTime()!=null ? DateUtils.date2String(info.getAppTime(), "yyyy-MM-dd"):"");
					row.createCell(21).setCellValue(info.getCheckOper());
					row.createCell(22).setCellValue(info.getCheckTime()!=null ? DateUtils.date2String(info.getCheckTime(), "yyyy-MM-dd"):"");
					row.createCell(23).setCellValue(!"".equals(info.getAppState()) && info.getAppState()!=null ? appState.get(info.getAppState()):"");
					row.createCell(24).setCellValue(info.getComm());
					
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {

			e.printStackTrace();
		} catch (IOException e) {

			e.printStackTrace();
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
	}

}
