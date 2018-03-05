package com.lenovohit.hcp.pharmacy.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
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
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaBuyBillManager;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@RestController
@RequestMapping("/hcp/pharmacy/buyBill")
public class PhaBuyBillRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaBuyBill, String> phaBuyBillManager;
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<Company, String> companyManager;
	@Autowired
	private PhaBuyBillManager phaBillManager;
	
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
		PhaBuyBill query =  JSONUtils.deserialize(data, PhaBuyBill.class);
		StringBuilder jql = new StringBuilder( "from PhaBuyBill where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("forPage"+data);
		
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());

		if(!StringUtils.isEmpty(query.getCreateOper())){
			jql.append("and createOper = ? ");
			values.add(query.getCreateOper());
		}
		
		if(!StringUtils.isEmpty(query.getBuyBill())){
			jql.append("and buyBill like ? ");
			values.add("%"+query.getBuyBill()+"%");
		}

		if(!StringUtils.isEmpty(query.getBuyState())){
			jql.append("and buyState = ? ");
			values.add(query.getBuyState());
		}
		if(!StringUtils.isEmpty(query.getDeptId())){
			jql.append("and deptId = ? ");
			values.add(query.getDeptId());
		}
		jql.append(" order by createTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaBuyBillManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PhaBuyBill model= phaBuyBillManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaBuyBill query =  JSONUtils.deserialize(data, PhaBuyBill.class);
		StringBuilder jql = new StringBuilder( " from PhaBuyBill where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		HcpUser user = this.getCurrentUser();
		// 科室和医院id作为查询条件
		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
		jql.append(" And deptId = ? ");
		values.add(user.getLoginDepartment().getId());
		if(StringUtils.isNotEmpty(query.getCreateOper())){
			jql.append(" And createOper = ?");
			values.add(query.getCreateOper());
		}
		if (StringUtils.isNotEmpty(query.getBuyState()) && "-1".equals(query.getBuyState())) {
			jql.append(" And ( buyState = ? or buyState = ? ) ");
			values.add("1");
			values.add("3");
		}
		
		if(!StringUtils.isEmpty(query.getBuyBill())){
			jql.append(" AND buyBill = ? ");
			values.add(query.getBuyBill());
		}
		
		List<PhaBuyBill> models = phaBuyBillManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	/**
	 * 查询company信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/load", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLoadCompanyInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaBuyBill query =  JSONUtils.deserialize(data, PhaBuyBill.class);
		StringBuilder jql = new StringBuilder( "select c.companyName from PhaBuyBill b,PhaCompanyInfo c where c.id = b.company ");
		
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		if(!StringUtils.isEmpty(query.getBuyBill())){
			jql.append(" And b.buyBill = ?");
			values.add(query.getBuyBill());
		}
		
		List<PhaBuyBill> models = phaBuyBillManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		PhaBuyBill retunPhaBuyBill = null;
		PhaBuyBill phaBuyBill =  (PhaBuyBill) JSONUtils.parseObject(data, PhaBuyBill.class);
		HcpUser user = this.getCurrentUser();
		try {
			phaBuyBill = phaBillManager.createBuyBill(phaBuyBill, user);
			
			retunPhaBuyBill = new PhaBuyBill();
			retunPhaBuyBill.setBuyBill(phaBuyBill.getBuyBill());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		
		return ResultUtils.renderSuccessResult(retunPhaBuyBill);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaBuyBill model =  JSONUtils.deserialize(data, PhaBuyBill.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.phaBuyBillManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		System.out.println(id);
		if ( StringUtils.isEmpty(id)){
			return ResultUtils.renderFailureResult("采购单ID不允许为空！");
		}
		try {
			this.phaBuyBillManager.delete(id);
			String sql = new String( " delete from pha_buydetail where bill_id = ? ");
			List<Object> values = new ArrayList<Object>();
			values.add(id);
			this.phaBuyDetailManager.executeSql(sql, values.toArray());
		} catch (Exception e) {
			e.printStackTrace();
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
			this.phaBuyBillManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 入库更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateInstock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forInstock(@RequestBody String data) {
		PhaBuyBill model =  JSONUtils.deserialize(data, PhaBuyBill.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PhaBuyBill newModel= this.phaBuyBillManager.get(model.getId());
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		if(newModel.getBuyState().equals("1") && model.getBuyState().equals("2")){
		  newModel.setAuitdOper(user.getName());
		  newModel.setAuitdTime(now);
		}
		if(!StringUtils.isEmpty(model.getBuyCost())){
			newModel.setBuyCost(model.getBuyCost());
		}
		if(!StringUtils.isEmpty(model.getCompany())){
			newModel.setCompany(model.getCompany());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		newModel.setBuyState(model.getBuyState());
		this.phaBuyBillManager.save(newModel);
		return ResultUtils.renderSuccessResult(newModel);
	}
	/**
	 * 采购审核入库
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateInstock2", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forInstock2(@RequestBody String data) {
		String inBill="";
		// System.out.println("updateInstock2...");
		PhaBuyBill model =  JSONUtils.deserialize(data, PhaBuyBill.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		
		//替换输入的数量
		if(model.getInputInfos()!=null){
			for(PhaInputInfo input : model.getInputInfos()){
				input.setComm(input.getInSum().toString());
			}
		}
		
		try {
			inBill = this.phaBillManager.doProcureInstock(model, this.getCurrentUser());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		
		return ResultUtils.renderSuccessResult(inBill);
	}
	
	/**
	 * 采购计划审批，驳回，状态更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateBackInstock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBackInstock(@RequestBody String data) {
		PhaBuyBill model =  JSONUtils.deserialize(data, PhaBuyBill.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PhaBuyBill newModel= this.phaBuyBillManager.get(model.getId());
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		if(newModel.getBuyState().equals("1") && model.getBuyState().equals("3")){
		  newModel.setBuyState(model.getBuyState());
		}
	
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		this.phaBuyBillManager.save(newModel);
		return ResultUtils.renderSuccessResult(newModel);
	}
	
	/**    
	 * 功能描述：导出数据到excel中,采购计划查询（左侧）
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author zhx
	 * @throws IOException 
	 * @date 2017年6月12日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportDetailToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		PhaBuyBill query =  JSONUtils.deserialize(data, PhaBuyBill.class);
		
		JSONObject json = JSONObject.parseObject(data);
		
		JSONArray selectedRowKeys= json.getJSONArray("selectedRowKeys") ;
		
		List<Object[]> buyBillList = null;
		StringBuilder jql = new StringBuilder( "select buy_Bill,dept_id,company,buy_Cost,create_oper,create_time,auitd_oper,auitd_time,buy_State,comm from Pha_BuyBill where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(selectedRowKeys.size()>0){
            jql.append(" and ID in ( ");
            for(int i=0;i<selectedRowKeys.size();i++){
            	jql.append("?");
            	values.add(selectedRowKeys.get(i).toString());
				if(i != selectedRowKeys.size()-1)jql.append(",");
			}
			jql.append(" )");
			
		}else{
			
			if(StringUtils.isNotBlank(query.getBuyBill())){
				jql.append(" and buy_Bill = ? ");
				values.add(query.getBuyBill());
			}
			if(StringUtils.isNotBlank(query.getBuyState())){
				jql.append(" and buy_State = ? ");
				values.add(query.getBuyState());
			}
			
		}
		buyBillList =  (List<Object[]>) phaBuyBillManager.findBySql(jql.toString(), values.toArray());

		String fileName = "采购计划清单";
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
	public void createExcel(List<Object[]> OutputInfoList,OutputStream out) {
		
		Map<String, String> map=new HashMap<String,String>();
		map.put("1", "新计划");
		map.put("2", "已审批");
		map.put("3", "已退回");
		map.put("4", "已入库");
		
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
			XSSFSheet sheet = wb.createSheet("采购计划清单");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,12 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,12* 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,12 * 512);
			sheet.setColumnWidth(8,12 * 512);
			sheet.setColumnWidth(9,12 * 512);

			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 9));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("采购计划清单");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("采购单号");
			row1.createCell(1).setCellValue("申请科室");
			row1.createCell(2).setCellValue("供应商");
			row1.createCell(3).setCellValue("采购总额");
			row1.createCell(4).setCellValue("申请人");
			row1.createCell(5).setCellValue("申请时间");
			row1.createCell(6).setCellValue("核准人");
			row1.createCell(7).setCellValue("核准时间");
			row1.createCell(8).setCellValue("状态");
			row1.createCell(9).setCellValue("备注");
			//循环将dataList插入表中
			if(OutputInfoList!=null&& OutputInfoList.size()>0){
				for(int i=0;i<OutputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					Object[] info = OutputInfoList.get(i);
					row.createCell(0).setCellValue(info[0].toString());
					if(!"".equals(info[1])&& info[1]!=null){
						Department dept =  departmentManager.get(info[1].toString());
						row.createCell(1).setCellValue(dept !=null ? dept.getDeptName() : "");
					}
					if(!"".equals(info[2])&& info[2]!=null){
						Company company = companyManager.get(info[2].toString());
						row.createCell(2).setCellValue(company !=null ? company.getCompanyName() : "");
					}
					row.createCell(3).setCellValue(!"".equals(info[3])&& info[3]!=null ? info[3].toString():"");
					row.createCell(4).setCellValue(!"".equals(info[4])&& info[4]!=null ? info[4].toString():"");
					row.createCell(5).setCellValue(!"".equals(info[5])&& info[5]!=null ? DateUtils.date2String((Date) info[5], "yyyy-MM-dd HH:mm:ss"):"");
					row.createCell(6).setCellValue(!"".equals(info[6])&& info[6]!=null ? info[6].toString():"");
					row.createCell(7).setCellValue(!"".equals(info[7])&& info[7]!=null ? DateUtils.date2String((Date) info[7], "yyyy-MM-dd HH:mm:ss"):"");
					row.createCell(8).setCellValue(!"".equals(info[8])&& info[8]!=null ? map.get(info[8].toString()):"");
					row.createCell(9).setCellValue(!"".equals(info[9])&& info[9]!=null ? info[9].toString():"");
					
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
	 * 查询按库存定义需要生成采购计划的药品
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listStockWarnDurg", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listStockWarnDurg(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PhaBuyDetail> phaBuyDetails = new ArrayList<PhaBuyDetail>();
		try {
			PhaBuyBill query =  JSONUtils.deserialize(data, PhaBuyBill.class);
			String comm = query.getComm();
			String[] params = comm.split("/");
			
			Double percent1 = new Double(params[0]);
			Double percent2 = new Double(params[1]);
			Double proportion = new Double(params[2]);
			
			
			StringBuilder jql = new StringBuilder( "from PhaStoreSumInfo WHERE 1=1 ");
			
			List<Object> values = new ArrayList<Object>();
			System.out.println(data);
			
			if(!StringUtils.isEmpty(query.getDeptId())){
				jql.append(" and deptId = ? ");
				values.add(query.getDeptId());
			}
			
			jql.append(" and storeSum <= (alertNum * ?) ");
			values.add(new BigDecimal(proportion));
			
			List<PhaStoreSumInfo> phaStoreSumInfos = phaStoreSumInfoManager.find(jql.toString(), values.toArray());
		    
			PhaBuyDetail tmpPhaBuyDetail;
			PhaDrugInfo tmpPhaDrugInfo;
			
//			PhaDrugInfo tmpDrugInfo;
			System.out.println("#### phaStoreSumInfos.size() = " + phaStoreSumInfos.size());
			for(PhaStoreSumInfo storeSumInfo : phaStoreSumInfos){
				tmpPhaBuyDetail = new PhaBuyDetail();
				tmpPhaDrugInfo = storeSumInfo.getDrugInfo();
				
	//			tmpDrugInfo = new PhaDrugInfo();
	//			tmpDrugInfo.setId(tmpPhaDrugInfo.getId());
	//			tmpDrugInfo.setPackQty(tmpPhaDrugInfo.getPackQty());
				tmpPhaBuyDetail.setDrugInfo(tmpPhaDrugInfo);
				
				double buyNum = ((1 + percent1.doubleValue() / 100) * storeSumInfo.getAlertNum().doubleValue() - storeSumInfo.getStoreSum().doubleValue() * percent2.doubleValue()/100)
						/tmpPhaDrugInfo.getPackQty().doubleValue();
				
				tmpPhaBuyDetail.setBuyNum(new Double(buyNum).intValue());
				
				phaBuyDetails.add(tmpPhaBuyDetail);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(phaBuyDetails);
	}
}
