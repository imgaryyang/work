package com.lenovohit.hcp.material.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.DecimalFormat;
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
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatInputInfoBill;
import com.lenovohit.hcp.material.model.MatOutputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;




@RestController
@RequestMapping("/hcp/material/directIn")
public class MatDirectInRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MatInputInfo, String> matInputInfoManager;
	@Autowired
	private GenericManager<MatInputInfoBill, String> inputInfoBillManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;


	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		System.out.println(data);
		List<MatInputInfo> models =  (List<MatInputInfo>) JSONUtils.parseObject(data,new TypeReference< List<MatInputInfo>>(){});
		String inBill = null;//
//		Date now =  new Date();
//		HcpUser user = this.getCurrentUser();
		try {
			HcpUser user = this.getCurrentUser();
			for( MatInputInfo model : models ){
				model.setDeptId(user.getLoginDepartment().getId());
				if( StringUtils.isEmpty(model.getInBill())){
					if(inBill == null){inBill =redisSequenceManager.get("PHA_INPUTINFO", "IN_BILL");}
					model.setInBill(inBill);
				}
			}
			System.out.println("====batchSave======");
			this.matInputInfoManager.batchSave(models);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		//TODO 校验
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
			this.matInputInfoManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
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
		MatInputInfo query =  JSONUtils.deserialize(data, MatInputInfo.class);
		StringBuilder jql = new StringBuilder( " from MatInputInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		
		jql.append(" And createOperId = ?");
		values.add(user.getId());
		
		
		
		if(StringUtils.isNotEmpty(query.getInputState())){
			System.out.println("===inputState===="+query.getInputState());
			jql.append(" And inputState = ?");
			values.add(query.getInputState());
			
		}
		if(StringUtils.isNotEmpty(query.getInBill())){
			System.out.println("===getInBill===="+query.getInBill());
			jql.append(" And inBill = ?");
			values.add(query.getInBill());
			
		}
	
		
		List<MatInputInfo> models = matInputInfoManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询列表--历史采购入库信息，有分页
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBuyHistoryList(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query =  JSONUtils.deserialize(data, MatInputInfo.class);
		StringBuilder jql = new StringBuilder( " from MatInputInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("===data===="+query);
		HcpUser user = this.getCurrentUser();
		
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		
		if(StringUtils.isNotEmpty(query.getInType())){
			System.out.println("===inType===="+query.getInType());
			jql.append(" And inType = ?");
			values.add(query.getInType());
		}
		
		if(!StringUtils.isEmpty(query.getTradeName())){
			System.out.println("===tradeName===="+query.getTradeName());
			jql.append(" And tradeName = ?");
			values.add(query.getTradeName());
		}
		
		if(!StringUtils.isEmpty(query.getMaterialCode())){
			System.out.println("===DrugCode===="+query.getMaterialCode());
			jql.append(" And materialCode = ?");
			values.add(query.getMaterialCode());
		}
		
		jql.append(" order by inTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		System.out.println(jql.toString());
		matInputInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
		
	}
	

	/**
	 * searchBar请领查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "searchBar/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result searchBarList(@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query =  JSONUtils.deserialize(data, MatInputInfo.class);
		StringBuilder jql = new StringBuilder( " select store from MatInputInfo store left join store.drugInfo drug  where store.inputState = '0' ");
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
	
		List<MatInputInfo> models = matInputInfoManager.find(jql.toString(), values.toArray());
		
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
			idSql.append("DELETE FROM PHA_INPUTINFO WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.matInputInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**    
	 * 功能描述：入库汇总信息查询
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/inputSummarySum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOutputSummarySum(@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		
		
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select SUM(a.sumBuyCost) as totalBuyCost,SUM(a.sumSaleCost) as totalSaleCost from ( select sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost from material_inputinfo as p WHERE 1=1 ");
		HcpUser user = this.getCurrentUser();
		sql.append(" and p.hos_Id = ? ");
		values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(query.getMaterialType())){
			sql.append(" AND p.MATERIAL_TYPE = ? ");
			values.add(query.getMaterialType());
		}
		if(StringUtils.isNotBlank(query.getInputState())){
			sql.append("and p.INPUT_STATE = ? ");
			values.add(query.getInputState());
		}
		
		if(!StringUtils.isEmpty(query.getInType())){
			sql.append(" AND p.IN_TYPE = ? ");
			values.add(query.getInType());
		}
		if(!StringUtils.isEmpty(query.getDeptId())&&!StringUtils.isEmpty(query.getDeptId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getDeptId());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.IN_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		sql.append(" group by p.DEPT_ID ) a ");

        List<Object> models =(List<Object>) matInputInfoManager.findBySql(sql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}

	/**    
	 * 功能描述：物资入库汇总信息查询--分页
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/InStoreSummaryPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result foroutputSummaryPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		System.out.println(query);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select p.DEPT_ID, sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost, c.DEPT_NAME from material_inputinfo as p LEFT JOIN b_deptinfo as c ON c.ID = p.DEPT_ID  WHERE 1=1 ");
		
		HcpUser user = this.getCurrentUser();
		sql.append(" and p.hos_Id = ? ");
		values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(query.getMaterialType())){
			sql.append(" AND p.MATERIAL_TYPE = ? ");
			values.add(query.getMaterialType());
		}
		if(StringUtils.isNotBlank(query.getInputState())){
			sql.append("and p.INPUT_STATE = ? ");
			values.add(query.getInputState());
		}
		if(!StringUtils.isEmpty(query.getInType())){
			sql.append(" AND p.IN_TYPE = ? ");
			values.add(query.getInType());
		}
		if(!StringUtils.isEmpty(query.getDeptId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getDeptId());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.IN_TIME between ? and  ? ");
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
	 * 功能描述：入库明细查询
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/InStoreDetailPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInStoreDetailPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("from MatInputInfo WHERE 1=1 ");
		
		HcpUser user = this.getCurrentUser();
		sql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(query.getMaterialType())){
			sql.append(" AND materialType = ? ");
			values.add(query.getMaterialType());
		}
		if(!StringUtils.isEmpty(query.getInType())){
			sql.append(" AND inType = ? ");
			values.add(query.getInType());
		}
		if(!StringUtils.isEmpty(query.getDeptId())){
			sql.append(" AND deptId = ? ");
			values.add(query.getDeptId());
		}
		if(!StringUtils.isEmpty(query.getInBill())){
			sql.append(" AND inBill = ? ");
			values.add(query.getInBill());
		}
		if(!StringUtils.isEmpty(query.getCompany())){
			sql.append(" AND companyInfo.id = ? ");
			values.add(query.getCompany());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and inTime between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(sql.toString());
		page.setValues(values.toArray());
		matInputInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**    
	 * 功能描述：入库单查询
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	 */
	@RequestMapping(value = "/InStoreBillPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInStoreBillPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		String hosId = this.getCurrentUser().getHosId();
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("from MatInputInfoBill WHERE 1=1 and hosId = ? ");
		values.add(hosId);
		if(!StringUtils.isEmpty(query.getInputState())){//状态
			sql.append(" AND inputState = ? ");
			values.add(query.getInputState());
		}
		if(!StringUtils.isEmpty(query.getInBill())){//单号
			sql.append(" AND id like ? ");
			values.add("%"+query.getInBill()+"%");
		}
		sql.append(" order by inTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(sql.toString());
		page.setValues(values.toArray());
		inputInfoBillManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}


	/**    
	 * 功能描述：导出数据到excel中
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 * @throws IOException 
	 * @date 2017年5月23日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportDetailToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		if(json!=null && json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MatInputInfo WHERE 1=1 ");
		if(query!=null){
			if(!StringUtils.isEmpty(query.getMaterialType())){
				jql.append(" AND materialType = ? ");
				values.add(query.getMaterialType());
			}
			if(!StringUtils.isEmpty(query.getInType())){
				jql.append(" AND inType = ? ");
				values.add(query.getInType());
			}
			if(!StringUtils.isEmpty(query.getDeptId())){
				jql.append(" AND deptId = ? ");
				values.add(query.getDeptId());
			}
			if(!StringUtils.isEmpty(query.getInBill())){
				jql.append(" AND inBill = ? ");
				values.add(query.getInBill());
			}
			if(!StringUtils.isEmpty(query.getCompany())){
				jql.append(" AND companyInfo.id = ? ");
				values.add(query.getCompany());
			}
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					jql.append(" and inTime between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		List<MatInputInfo> inputInfoList = matInputInfoManager.find(jql.toString(), values.toArray());
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_物资入库明细查询";
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
		createExcel(inputInfoList,out);
	}
	
	/**    
	 * 功能描述：导出入库明细到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcel(List<MatInputInfo> inputInfoList,OutputStream out) {
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
			XSSFSheet sheet = wb.createSheet("物资入库明细查询");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,6 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,12 * 512);
			sheet.setColumnWidth(8,12 * 512);
			sheet.setColumnWidth(9,12 * 512);
			sheet.setColumnWidth(10,12 * 512);
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 10));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("物资入库明细查询");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("物资名称");
			row1.createCell(1).setCellValue("规格");
			row1.createCell(2).setCellValue("进价");
			row1.createCell(3).setCellValue("售价");
			row1.createCell(4).setCellValue("进价总额");
			row1.createCell(5).setCellValue("入库数量");
			row1.createCell(6).setCellValue("批号");
			row1.createCell(7).setCellValue("生厂商");
			row1.createCell(8).setCellValue("供货商");
			row1.createCell(9).setCellValue("有效期");
			row1.createCell(10).setCellValue("入库时间");
			//循环将dataList插入表中
			if(inputInfoList!=null&& inputInfoList.size()>0){
				for(int i=0;i<inputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					MatInputInfo info = inputInfoList.get(i);
					row.createCell(0).setCellValue(info.getMatInfo().getCommonName());
					row.createCell(1).setCellValue(info.getMatInfo().getMaterialSpecs());
					DecimalFormat myformat=new DecimalFormat("0.0000");//BigDecimal保留四位小数
					DecimalFormat myformat2=new DecimalFormat("0.00");//BigDecimal保留两位小数
					DecimalFormat myformat0=new DecimalFormat("0");//BigDecimal保留整数
					if(info.getBuyPrice()!=null){
						row.createCell(2).setCellValue(myformat.format(info.getBuyPrice()));
					}
					if(info.getSalePrice()!=null){
						row.createCell(3).setCellValue(myformat.format(info.getSalePrice()));
					}
					if(info.getBuyCost()!=null){
						row.createCell(4).setCellValue(myformat2.format(info.getBuyCost()));
					}
					if(info.getInSum()!=null){
						row.createCell(5).setCellValue(myformat0.format(info.getInSum()));
					}
					row.createCell(6).setCellValue(info.getApprovalNo());
					row.createCell(7).setCellValue(info.getMatInfo()!=null?(info.getMatInfo().getCompanyInfo()!=null?info.getMatInfo().getCompanyInfo().getCompanyName():""):"");
					if(info.getCompanyInfo()!=null){
						row.createCell(8).setCellValue(info.getCompanyInfo().getCompanyName());
					}
					if (info.getValidDate()!=null){//日期格式特殊处理
						row.createCell(9).setCellValue(DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"));
					}
					if (info.getInTime()!=null){
						row.createCell(10).setCellValue(DateUtils.date2String(info.getInTime(), "yyyy-MM-dd HH:mm:ss"));
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
	
	@RequestMapping(value = "/exportInStoreSummary", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportInStoreSummary(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) {
		MatInputInfo query = JSONUtils.deserialize(data, MatInputInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("select p.COMPANY, sum(p.BUY_COST) AS sumBuyCost,sum(p.SALE_COST) AS sumSaleCost, c.COMPANY_NAME from pha_inputinfo as p LEFT JOIN pha_companyinfo as c ON c.ID = p.COMPANY  WHERE 1=1 ");
		if(!StringUtils.isEmpty(query.getMaterialType())){
			sql.append(" AND p.DRUG_TYPE = ? ");
			values.add(query.getMaterialType());
		}
		if(!StringUtils.isEmpty(query.getInType())){
			sql.append(" AND p.IN_TYPE = ? ");
			values.add(query.getInType());
		}
		if(!StringUtils.isEmpty(query.getDeptId())){
			sql.append(" AND p.DEPT_ID = ? ");
			values.add(query.getDeptId());
		}
		if(!StringUtils.isEmpty(query.getCompany())){
			sql.append(" AND p.COMPANY = ? ");
			values.add(query.getCompany());
		}
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd  HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and p.IN_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
			
		}
		sql.append(" group by p.COMPANY,c.COMPANY_NAME ");
		List<Object> tmpList = (List<Object>) matInputInfoManager.findBySql(sql.toString(), values.toArray());
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_入库汇总查询";
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
		writeExcel(tmpList, out);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**    
	 * 功能描述：导出入库明细到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void writeExcel(List<Object> inputSumInfo,OutputStream out) {
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
			XSSFSheet sheet = wb.createSheet("入库汇总信息");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,8 * 512);
			
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
			 cell.setCellValue("入库按供应商汇总统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("供货商");
			row1.createCell(1).setCellValue("进价总额");
			row1.createCell(2).setCellValue("售价总额");
			//循环将dataList插入表中
			if(inputSumInfo!=null&& inputSumInfo.size()>0){
				for(int i=0;i<inputSumInfo.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					Object[] info = (Object[]) inputSumInfo.get(i);
					if(info[3]!=null){
						row.createCell(0).setCellValue(info[3].toString());
					}
					if(info[1]!=null){
						row.createCell(1).setCellValue(info[1].toString());
					}
					if(info[2]!=null){
						row.createCell(2).setCellValue(info[2].toString());
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
	 * 功能描述：翻页封装
	 *@param sqlContent
	 *@param values
	 *@param start
	 *@param limit
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	private Page PageData(Page page){
		if(page!=null){
			String sql = page.getQuery();
			Object [] values = page.getValues();
			System.out.println(sql);
			String tmp = "select COUNT(*) from ( "+sql+" ) o";
			List<Object> tmpList = (List<Object>) matInputInfoManager.findBySql(tmp, values);
			int count = 0;
			if(tmpList!=null && tmpList.size()>0){
				count =  (int) tmpList.get(0);
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
				List<Object> objList = (List<Object>) matInputInfoManager.findBySql(sb.toString(), values);
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
