package com.lenovohit.hcp.hrp.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

import com.alibaba.fastjson.JSONObject;
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
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.hrp.manager.InstrmOutputInfoMng;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;

@RestController
@RequestMapping("/hcp/hrp/outputInfo")
public class InstrmOutputInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<InstrmOutputInfo, String> instrmOutputInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	
	@Autowired
	private InstrmOutputInfoMng instrmOutputInfoManager1;
	
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
		System.out.println("forPage"+data);
		
		InstrmOutputInfo query =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		
		
		StringBuilder jql = new StringBuilder( "from InstrmOutputInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if(StringUtils.isNotBlank(query.getOutputState())){
			jql.append("and outputState = ? ");
			values.add(query.getOutputState());
		}
		if(StringUtils.isNotBlank(query.getOutBill())){
			jql.append("and outBill like ? ");
			values.add("%"+query.getOutBill()+"%");
		}
		
		if(StringUtils.isNotBlank(query.getInstrmType())){
			jql.append("and instrmType = ? ");
			values.add(query.getInstrmType());
		}
		
		if(StringUtils.isNotBlank(query.getOutType())){
			jql.append("and outType = ? ");
			values.add(query.getOutType());
		}
		if(StringUtils.isNotBlank(query.getToDept())&&StringUtils.isNotBlank(query.getToDept().getId())){
			jql.append("and toDept.id = ? ");
			values.add(query.getToDept().getId());
		}
		
		if(StringUtils.isNotBlank(query.getCompanyInfo())&&StringUtils.isNotBlank(query.getCompanyInfo().getId())){
			jql.append("and companyInfo.id = ? ");
			values.add(query.getCompanyInfo().getId());
		}
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			System.out.println(dateRange);
			jql.append(" and outTime between ? and ? ");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate;
			Date endDate;
			try {
				startDate = sdf.parse(dateRange.get(0).toString());
				endDate = sdf.parse(dateRange.get(1).toString());
			} catch (ParseException e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult(e.getMessage());
			}
			values.add(startDate);
			values.add(endDate);
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		instrmOutputInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询出库总金额
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/totalSum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTotalSum(@RequestParam(value = "data", defaultValue = "") String data) {
		InstrmOutputInfo query =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		StringBuilder jql = new StringBuilder( "select sum(saleCost) from InstrmOutputInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
			
		if(StringUtils.isNotBlank(query.getOutputState())){
			jql.append("and outputState = ? ");
			values.add(query.getOutputState());
		}
		if(StringUtils.isNotBlank(query.getOutBill())){
			jql.append("and outBill = ? ");
			values.add(query.getOutBill());
		}
		if(StringUtils.isNotBlank(query.getInstrmType())){
			jql.append("and instrmType = ? ");
			values.add(query.getInstrmType());
		}
		if(StringUtils.isNotBlank(query.getOutType())){
			jql.append("and outType = ? ");
			values.add(query.getOutType());
		}
		if(StringUtils.isNotBlank(query.getToDept())&&StringUtils.isNotBlank(query.getToDept().getId())){
			jql.append("and toDept.id = ? ");
			values.add(query.getDeptInfo().getId());
		}
		if(StringUtils.isNotBlank(query.getCompanyInfo())&&StringUtils.isNotBlank(query.getCompanyInfo().getId())){
			jql.append("and companyInfo.id = ? ");
			values.add(query.getCompanyInfo().getId());
		}
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			System.out.println(dateRange);
			jql.append(" and outTime between ? and ? ");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate;
			Date endDate;
			try {
				startDate = sdf.parse(dateRange.get(0).toString());
				endDate = sdf.parse(dateRange.get(1).toString());
			} catch (ParseException e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult(e.getMessage());
			}
			values.add(startDate);
			values.add(endDate);
		}

		
		List<Object> models = (List<Object>)instrmOutputInfoManager.findByJql(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		InstrmOutputInfo model= instrmOutputInfoManager.get(id);
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
		InstrmOutputInfo query =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		StringBuilder jql = new StringBuilder( ""
				+ " Select DISTINCT a.OUT_BILL, a.DEPT_ID, b.DEPT_NAME, convert(char, OUT_TIME, 120) "
				+ " From instrm_outputinfo a, b_deptinfo b "
				+ " Where a.DEPT_ID=b.ID ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("--"+query.getOutBill());
		if( StringUtils.isNotBlank(query.getOutBill())){
			jql.append("and a.out_bill like ? ");
			values.add("%"+query.getOutBill()+"%");
		}
		if( StringUtils.isNotBlank(query.getOutputState())){
			jql.append("and a.output_state = ? ");
			values.add(query.getOutputState());
		}
		
		if( query.getDeptInfo() != null && StringUtils.isNotBlank(query.getDeptInfo().getId())){
			jql.append("and a.dept_id = ? ");
			values.add(query.getDeptInfo().getId());
		}
		if( query.getToDept() != null && StringUtils.isNotBlank(query.getToDept().getId())){
			jql.append("and a.to_dept = ? ");
			values.add(query.getToDept().getId());
		}

		
		List<Object> models = (List<Object>)instrmOutputInfoManager.findBySql(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/detail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		InstrmOutputInfo query =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		StringBuilder jql = new StringBuilder( "From InstrmOutputInfo where 1=1");
		List<Object> values = new ArrayList<Object>();

		if( StringUtils.isNotBlank(query.getOutBill())){
			jql.append("and outBill = ? ");
			values.add(query.getOutBill());
		}
		
		List<InstrmOutputInfo> models = instrmOutputInfoManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/instock",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forInstock(@RequestBody String data){
		System.out.println(data);

		try {
			List<InstrmOutputInfo> models =  (List<InstrmOutputInfo>) JSONUtils.parseObject(data,new TypeReference< List<InstrmOutputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			instrmOutputInfoManager1.createOutputInfo(models, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
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
		InstrmOutputInfo model =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.instrmOutputInfoManager.save(model);
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
			this.instrmOutputInfoManager.delete(id);
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
//		@SuppressWarnings("rawtypes")
//		List ids =  JSONUtils.deserialize(data, List.class);
//		StringBuilder idSql = new StringBuilder();
//		List<String> idvalues = new ArrayList<String>();
//		try {
//			idSql.append("DELETE FROM PHA_COMPANYINFO WHERE ID IN (");
//			for(int i=0;i<ids.size();i++){
//				idSql.append("?");
//				idvalues.add(ids.get(i).toString());
//				if(i != ids.size()-1)idSql.append(",");
//			}
//			idSql.append(")");
//			System.out.println(idSql.toString());
//			this.instrmBuyBillManager.executeSql(idSql.toString(), idvalues.toArray());
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("删除失败");
//		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 更新出库单状态
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateByAppBill/{appBill}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateByAppBill(@PathVariable("appBill") String appBill){

		StringBuilder idSql = new StringBuilder();
	
		try {
			idSql.append(" UPDATE INSTRM_OUTPUTINFO SET OUTPUT_STATE = '2' WHERE APP_BILL = '" + appBill + "'");
			System.out.println(idSql.toString());
			this.instrmOutputInfoManager.executeSql(idSql.toString());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("更新出库单状态失败！");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**    
	 * 功能描述：生成 出库单号 返回给前台
	 *@return       
	 *@author gw
	 *@date 2017年4月25日             
	*/
	@RequestMapping(value = "/receiveOutBill", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result receiveOutBill(){
		String outBill = redisSequenceManager.get("INSTRM_OUTPUTINFO", "OUT_BILL");//获取出库单号
		if(StringUtils.isNotEmpty(outBill)){
			return ResultUtils.renderSuccessResult(outBill);
		}else{
			return ResultUtils.renderFailureResult("未获取到出库单号");
		}
	}
	/**    
	 * 功能描述：出库汇总信息查询
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/outputSummarySum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOutputSummarySum(@RequestParam(value = "data", defaultValue = "") String data) {
		InstrmOutputInfo query = JSONUtils.deserialize(data, InstrmOutputInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select SUM(a.sumBuyCost) as totalBuyCost,SUM(a.sumSaleCost) as totalSaleCost from ( select sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost from instrm_outputinfo as p WHERE 1=1 ");
		if(!StringUtils.isEmpty(query.getInstrmType())){
			sql.append(" AND p.INSTRM_TYPE = ? ");
			values.add(query.getInstrmType());
		}
		if(StringUtils.isNotBlank(query.getOutputState())){
			sql.append("and p.OUTPUT_STATE = ? ");
			values.add(query.getOutputState());
		}
		
		if(!StringUtils.isEmpty(query.getOutType())){
			sql.append(" AND p.OUT_TYPE = ? ");
			values.add(query.getOutType());
		}
		if(!StringUtils.isEmpty(query.getToDept())&&!StringUtils.isEmpty(query.getToDept().getId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getToDept().getId());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.OUT_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		sql.append(" group by p.DEPT_ID ) a ");

		List<Object> models = (List<Object>) instrmOutputInfoManager.findBySql(sql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**    
	 * 功能描述：导出数据到excel中,出库明细
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 * @throws IOException 
	 * @date 2017年5月23日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportDetailToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		InstrmOutputInfo query =  JSONUtils.deserialize(data, InstrmOutputInfo.class);
		
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		
		
		StringBuilder jql = new StringBuilder( "from InstrmOutputInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(StringUtils.isNotBlank(query.getOutputState())){
			jql.append("and outputState = ? ");
			values.add(query.getOutputState());
		}
		if(StringUtils.isNotBlank(query.getOutBill())){
			jql.append("and outBill like ? ");
			values.add("%"+query.getOutBill()+"%");
		}
		
		if(StringUtils.isNotBlank(query.getInstrmType())){
			jql.append("and instrmType = ? ");
			values.add(query.getInstrmType());
		}
		
		if(StringUtils.isNotBlank(query.getOutType())){
			jql.append("and outType = ? ");
			values.add(query.getOutType());
		}
		if(StringUtils.isNotBlank(query.getToDept())&&StringUtils.isNotBlank(query.getToDept().getId())){
			jql.append("and toDept.id = ? ");
			values.add(query.getToDept().getId());
		}
		
		if(StringUtils.isNotBlank(query.getCompanyInfo())&&StringUtils.isNotBlank(query.getCompanyInfo().getId())){
			jql.append("and companyInfo.id = ? ");
			values.add(query.getCompanyInfo().getId());
		}
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			System.out.println(dateRange);
			jql.append(" and outTime between ? and ? ");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate;
			Date endDate;
			try {
				startDate = sdf.parse(dateRange.get(0).toString());
				endDate = sdf.parse(dateRange.get(1).toString());
			} catch (ParseException e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult(e.getMessage());
			}
			values.add(startDate);
			values.add(endDate);
		}
		List<InstrmOutputInfo> outputInfoList = instrmOutputInfoManager.find(jql.toString(), values.toArray());
		String fileName = "固定资产出库明细查询";
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
		createExcel(outputInfoList,out);
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：导出出库明细到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcel(List<InstrmOutputInfo> OutputInfoList,OutputStream out) {
		
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
			XSSFSheet sheet = wb.createSheet("固定资产出库明细统计");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,12 * 512);
			sheet.setColumnWidth(2,6 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,8 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,10 * 512);
			sheet.setColumnWidth(7,12 * 512);
			sheet.setColumnWidth(8,12 * 512);
			sheet.setColumnWidth(9,6 * 512);
			sheet.setColumnWidth(10,10 * 512);
			sheet.setColumnWidth(11,10 * 512);
			sheet.setColumnWidth(12,10 * 512);
			sheet.setColumnWidth(13,10 * 512);
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 13));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("固定资产出库明细统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("资产编号");
			row1.createCell(1).setCellValue("资产名称");
			row1.createCell(2).setCellValue("规格");
			row1.createCell(3).setCellValue("型号");
			row1.createCell(4).setCellValue("进价");
			row1.createCell(5).setCellValue("出库数量");
			row1.createCell(6).setCellValue("总额");
			row1.createCell(7).setCellValue("生产商");
			row1.createCell(8).setCellValue("供货商");
			row1.createCell(9).setCellValue("折旧");
			row1.createCell(10).setCellValue("出厂日期");
			row1.createCell(11).setCellValue("购入日期");
			row1.createCell(12).setCellValue("目标科室");
			row1.createCell(13).setCellValue("出库时间");
			//循环将dataList插入表中
			if(OutputInfoList!=null&& OutputInfoList.size()>0){
				for(int i=0;i<OutputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					InstrmOutputInfo info = OutputInfoList.get(i);
					row.createCell(0).setCellValue(info.getInstrmCode());
					row.createCell(1).setCellValue(info.getTradeName());
					row.createCell(2).setCellValue(info.getInstrmSpecs().toString());
					row.createCell(3).setCellValue(info.getBatchNo().toString());
					row.createCell(4).setCellValue(info.getBuyPrice().toString());
					if(info.getOutSum()!=null){
						row.createCell(5).setCellValue(info.getOutSum().toString()+info.getInstrmInfo().getInstrmUnit().toString());
					}
					row.createCell(6).setCellValue(info.getBuyCost().toString());
					if(info.getProducerInfo()!=null){
						row.createCell(7).setCellValue(info.getProducerInfo().getCompanyName());
					}
					if(info.getCompanyInfo()!=null){
						row.createCell(8).setCellValue(info.getCompanyInfo().getCompanyName());
					}
					if(info.getInstrmInfo()!=null){
						row.createCell(9).setCellValue(info.getInstrmInfo().getLimitMonth().toString());
					}
					if (info.getProduceDate()!=null){
						row.createCell(10).setCellValue(DateUtils.date2String(info.getProduceDate(), "yyyy-MM-dd"));
					}
					if (info.getPurchaseDate()!=null){
						row.createCell(11).setCellValue(DateUtils.date2String(info.getPurchaseDate(), "yyyy-MM-dd"));
					}
					if(info.getToDept()!=null){
						row.createCell(12).setCellValue(info.getToDept().getDeptName().toString());
					}
					if (info.getOutTime()!=null){
						row.createCell(13).setCellValue(DateUtils.date2String(info.getOutTime(), "yyyy-MM-dd HH:mm:ss"));
					}
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
	
	/**    
	 * 功能描述：导出数据到excel中,出库汇总
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 * @throws IOException 
	 * @date 2017年5月23日             
	*/
	@RequestMapping(value = "/expertToExcelSum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportSumToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		InstrmOutputInfo query = JSONUtils.deserialize(data, InstrmOutputInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select p.DEPT_ID, sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost, c.DEPT_NAME from instrm_outputinfo as p LEFT JOIN b_deptinfo as c ON c.ID = p.DEPT_ID  WHERE 1=1 ");
		if(!StringUtils.isEmpty(query.getInstrmType())){
			sql.append(" AND p.INSTRM_TYPE = ? ");
			values.add(query.getInstrmType());
		}
		if(StringUtils.isNotBlank(query.getOutputState())){
			sql.append("and p.OUTPUT_STATE = ? ");
			values.add(query.getOutputState());
		}
		if(!StringUtils.isEmpty(query.getOutType())){
			sql.append(" AND p.OUT_TYPE = ? ");
			values.add(query.getOutType());
		}
		if(!StringUtils.isEmpty(query.getToDept())&&!StringUtils.isEmpty(query.getToDept().getId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getToDept().getId());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.OUT_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		sql.append(" group by p.DEPT_ID,c.DEPT_NAME ");

		List<Object> objList = (List<Object>)instrmOutputInfoManager.findBySql(sql.toString(), values.toArray());
		
		String fileName = "固定资产出库汇总统计";
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
		createExcelSum(objList,out);
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：导出出库汇总到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcelSum(List<Object> objList,OutputStream out) {
		
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
			XSSFSheet sheet = wb.createSheet("固定资产出库汇总统计");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,6 * 512);
			sheet.setColumnWidth(2,6 * 512);
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("固定资产出库汇总统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("出库科室");
			row1.createCell(1).setCellValue("进价金额");
			row1.createCell(2).setCellValue("零售金额");
			
			//循环将dataList插入表中
			if(objList!=null&& objList.size()>0){
				for(int i=0;i<objList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					Object[] info = (Object[]) objList.get(i);
					row.createCell(0).setCellValue(info[3].toString());
					row.createCell(1).setCellValue(info[1].toString());
					row.createCell(2).setCellValue(info[2].toString());
					
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
	
	
	/**    
	 * 功能描述：出库汇总信息查询--分页
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/outputSummaryPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result foroutputSummaryPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		InstrmOutputInfo query = JSONUtils.deserialize(data, InstrmOutputInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select p.DEPT_ID, sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost, c.DEPT_NAME from instrm_outputinfo as p LEFT JOIN b_deptinfo as c ON c.ID = p.DEPT_ID  WHERE 1=1 ");
		if(!StringUtils.isEmpty(query.getInstrmType())){
			sql.append(" AND p.INSTRM_TYPE = ? ");
			values.add(query.getInstrmType());
		}
		if(StringUtils.isNotBlank(query.getOutputState())){
			sql.append("and p.OUTPUT_STATE = ? ");
			values.add(query.getOutputState());
		}
		if(!StringUtils.isEmpty(query.getOutType())){
			sql.append(" AND p.OUT_TYPE = ? ");
			values.add(query.getOutType());
		}
		if(!StringUtils.isEmpty(query.getToDept())&&!StringUtils.isEmpty(query.getToDept().getId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getToDept().getId());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.OUT_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		sql.append(" group by p.DEPT_ID,c.DEPT_NAME ");

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(sql.toString());
		page.setValues(values.toArray());
		page = PageData(page);
		return ResultUtils.renderPageResult(page);
	}
	
	
	/**    
	 * 功能描述：翻页封装
	 *@param sqlContent
	 *@param values
	 *@param start
	 *@param limit
	 *@return       
	 *@author gw
	 *@date 2017年5月22日             
	*/
	private Page PageData(Page page){
		if(page!=null){
			String sql = page.getQuery();
			Object [] values = page.getValues();
			System.out.println(sql);
			String tmp = "select COUNT(*) from ( "+sql+" ) o";
			List<Object> tmpList = (List<Object>)instrmOutputInfoManager.findBySql(tmp, values);
			int count = 0;
			if(tmpList!=null && tmpList.size()>0){
				count =  (Integer) tmpList.get(0);
			}
			page.setTotal(count);
			if( count>0){
				int topTot = page.getStart()+page.getPageSize();
				int topSize = 0;
				if(count>= topTot){//当前页数数据小于总数量可以整页显示
					topSize = page.getPageSize();
				}else {
					topSize = count%page.getPageSize();
				}
				StringBuilder sb = new StringBuilder("select top "+topSize+" o.* from ( ");
				sb.append("select top "+topTot+sql.substring(sql.toLowerCase().indexOf("select")+6, sql.length()));
				sb.append(" order by 1 desc ) as o");
				List<Object> objList = (List<Object>)instrmOutputInfoManager.findBySql(sb.toString(), values);
				if(objList!=null && objList.size()>0){
					page.setResult(objList);
				}
			}else{
				page.setStart(0);
				page.setTotal(0);
			}
			return page;
		}else{
			System.out.println("page数据传输错误！！");
			return null;
		}
	}
}
