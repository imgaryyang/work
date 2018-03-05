package com.lenovohit.hcp.odws.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

/**
 * 接诊科室工作量统计
 */
@RestController
@RequestMapping("/hcp/odws/workloadSearch")
public class TotalChargeDetailController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	
	/**
	 * 根据条件查询收费信息
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/workloadList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forWorkloadList(@RequestParam(value = "data", defaultValue = "") String data){
		OutpatientChargeDetail query =  JSONUtils.deserialize(data, OutpatientChargeDetail.class);
		List<Object> values = new ArrayList<Object>();
		
		List<Object> dateRange = new ArrayList<Object>();
		JSONObject json = JSONObject.parseObject(data);
		
		StringBuilder sql = new StringBuilder(
		  " SELECT aa.deptName, SUM (aa.regCount) regCountTotal, SUM (aa.regFee) regFeeTotal, SUM (aa.medicFee) medicFeeTotal, SUM (aa.extraFee) extraFeeTotal,  SUM (aa.regFee+aa.medicFee+aa.extraFee) regTotal,"
		  + " SUM (aa.bRegCount) bRegCountTotal, SUM (aa.bRegFee) bRegFeeToTal, SUM (aa.bMedicFee) bMedicFeeTotal, SUM (aa.bExtraFee) bExtraFeeTotal,  SUM (aa.bRegFee+aa.bMedicFee+aa.bExtraFee) bRegTotal, "
		  + " SUM (aa.regCount - aa.bRegCount) countSum, SUM (aa.regFee + aa.bRegFee) RegSum, SUM (aa.medicFee + aa.bMedicFee) medicSum, SUM (aa.extraFee + aa.bExtraFee) extraSum,  SUM (aa.regFee+aa.medicFee+aa.extraFee+aa.bRegFee+aa.bMedicFee+aa.bExtraFee) sumTotal "
		  + " FROM ( SELECT c.dept_name deptName,COUNT(1) regCount,SUM (a.TOT_COST) regFee,0 medicFee,0 extraFee,"
		  + " SUM ( CASE WHEN a.PLUS_MINUS = - 1 THEN 1 ELSE 0 END ) bRegCount,SUM ( CASE WHEN a.PLUS_MINUS = - 1 THEN a.TOT_COST ELSE 0 END) bRegFee,"
		  + " 0 bMedicFee,0 bExtraFee FROM oc_chargedetail a,b_deptinfo c WHERE a.EXE_DEPT = c.ID "
		  + " AND a.ITEM_CODE IN (SELECT b.ITEM_ID FROM oc_regfee b WHERE b.ITEM_ID = '8a942a695ac81f88015aca9329-00855')");
		//科室名称
		if(!StringUtils.isEmpty(query.getExeDept())&&!StringUtils.isEmpty(query.getExeDept().getId())){
			sql.append("and a.EXE_DEPT = ? ");
			values.add(query.getExeDept().getId());
		}
		//时间区间
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			sql.append(" and a.CHARGE_TIME between ? and ? ");
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
		
		sql.append(" GROUP BY c.dept_name UNION ALL "
		  + " SELECT c.dept_name deptName, 0 regCount, 0 regFee, SUM (a.TOT_COST) medicFee, 0 extraFee, 0 bRegCount, 0 bRegFee,"
		  + " SUM ( CASE WHEN a.PLUS_MINUS = - 1 THEN a.TOT_COST ELSE 0 END ) bMedicFee, 0 bExtraFee FROM oc_chargedetail a, b_deptinfo c "
		  + " WHERE a.EXE_DEPT = c.ID AND a.ITEM_CODE IN ( "
		  + " SELECT b.ITEM_ID FROM oc_regfee b WHERE b.item_id IN ( '8a942a695ac81f88015aca9329-00858', '8a942a695ac81f88015aca9329-00859', '8a942a695ac81f88015aca9329-00860', '8a942a695ac81f88015aca9329-00861' ))");

		//科室名称
		if(!StringUtils.isEmpty(query.getExeDept())&&!StringUtils.isEmpty(query.getExeDept().getId())){
			sql.append("and a.EXE_DEPT = ? ");
			values.add(query.getExeDept().getId());
		}
		//时间区间
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			sql.append(" and a.CONFIRM_TIME between ? and ? ");
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

		sql.append(" GROUP BY c.dept_name UNION ALL "
		  + " SELECT c.DEPT_NAME deptName, 0 regCount, 0 regFee, 0 medicFee, "
		  + " SUM (a.TOT_COST) extraFee, 0 bRegCount, 0 bRegFee, 0 bMedicFee, "
		  + " SUM ( CASE WHEN a.PLUS_MINUS = - 1 THEN a.TOT_COST ELSE 0 END )"
		  + " bExtraFee FROM oc_chargedetail a, b_deptinfo c WHERE a.EXE_DEPT = c.ID "
		  + " AND a.ITEM_CODE IN ( SELECT b.ITEM_ID FROM oc_regfee b WHERE b.item_id NOT IN "
		  + " ('8a942a695ac81f88015aca9329-00855','8a942a695ac81f88015aca9329-00858','8a942a695ac81f88015aca9329-00859','8a942a695ac81f88015aca9329-00860','8a942a695ac81f88015aca9329-00861'))");
		//科室名称
		if(!StringUtils.isEmpty(query.getExeDept())&&!StringUtils.isEmpty(query.getExeDept().getId())){
			sql.append("and a.EXE_DEPT = ? ");
			values.add(query.getExeDept().getId());
		}
		//时间区间
		if(json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
			sql.append(" and a.CONFIRM_TIME between ? and ? ");
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

		sql.append(" GROUP BY c.dept_name ) aa GROUP BY aa.deptName");

		
		List<?> models = outpatientChargeDetailManager.findBySql(sql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**    
	 * 功能描述：导出数据到excel中,接诊科室工作量统计
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author zhx
	 * @throws IOException 
	 * @date 2017年5月26日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportSumToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {

		List<?> objList = (List<?>) this.forWorkloadList(data).getResult();
		
		String fileName = "接诊科室工作量统计";
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
	public void createExcelSum(List<?> objList,OutputStream out) {
		
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
			XSSFSheet sheet = wb.createSheet("接诊科室工作量统计");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,6 * 512);
			sheet.setColumnWidth(2,6 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,6 * 512);
			sheet.setColumnWidth(8,6 * 512);
			sheet.setColumnWidth(9,6 * 512);
			sheet.setColumnWidth(10,6 * 512);
			sheet.setColumnWidth(11,6 * 512);
			sheet.setColumnWidth(12,6 * 512);
			sheet.setColumnWidth(13,6 * 512);
			sheet.setColumnWidth(14,6 * 512);
			sheet.setColumnWidth(15,6 * 512);
			
			//头标题样式
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
		    font.setFontHeightInPoints((short) 25);//高度
		    style.setFont(font);
		    style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
		    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			
			//项目样式
			XSSFCellStyle style2 = wb.createCellStyle();
			XSSFFont font2 = wb.createFont();
			font2.setFontName("宋体");//字体类型
			font2.setFontHeightInPoints((short) 15);//高度
		    style2.setFont(font2);
		    style2.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style2.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
			
		    
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			row0.setHeightInPoints((short) 50);
			XSSFCell cell = row0.createCell(0);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 15));//合并单元格（开始行，结束行，开始列，结束列）
			cell.setCellStyle(style);
			cell.setCellValue("接诊科室工作量统计");
			 
			
			    
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			XSSFCell cell1 = row1.createCell(0);
		    sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));
			cell1.setCellValue("科室名称");
			XSSFCell cell2 = row1.createCell(1);
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, 5));
			cell2.setCellStyle(style2);
			cell2.setCellValue("挂号");
			XSSFCell cell3 = row1.createCell(6);
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 6, 10));
			cell3.setCellStyle(style2);
			cell3.setCellValue("退号");
			XSSFCell cell4 = row1.createCell(11);
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 11, 15));
			cell4.setCellStyle(style2);
			cell4.setCellValue("合计");
		 
			XSSFRow row2 = sheet.createRow(2);
			row2.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row2.createCell(0).setCellValue("科室名称");
			row2.createCell(1).setCellValue("数量");
			row2.createCell(2).setCellValue("挂号费");
			row2.createCell(3).setCellValue("诊疗费");
			row2.createCell(4).setCellValue("附加费");
			row2.createCell(5).setCellValue("费用小计");
			row2.createCell(6).setCellValue("数量");
			row2.createCell(7).setCellValue("挂号费");
			row2.createCell(8).setCellValue("诊疗费");
			row2.createCell(9).setCellValue("附加费");
			row2.createCell(10).setCellValue("费用小计");
			row2.createCell(11).setCellValue("数量");
			row2.createCell(12).setCellValue("挂号费");
			row2.createCell(13).setCellValue("诊疗费");
			row2.createCell(14).setCellValue("附加费");
			row2.createCell(15).setCellValue("费用小计");
			
			//循环将dataList插入表中
			if(objList!=null&& objList.size()>0){
				for(int i=0;i<objList.size();i++){
					XSSFRow row = sheet.createRow(i+3);
					Object[] info = (Object[]) objList.get(i);
					row.createCell(0).setCellValue(info[0].toString());
					row.createCell(1).setCellValue(info[1].toString());
					row.createCell(2).setCellValue(info[2].toString());
					row.createCell(3).setCellValue(info[3].toString());
					row.createCell(4).setCellValue(info[4].toString());
					row.createCell(5).setCellValue(info[5].toString());
					row.createCell(6).setCellValue(info[6].toString());
					row.createCell(7).setCellValue(info[7].toString());
					row.createCell(8).setCellValue(info[8].toString());
					row.createCell(9).setCellValue(info[9].toString());
					row.createCell(10).setCellValue(info[10].toString());
					row.createCell(11).setCellValue(info[11].toString());
					row.createCell(12).setCellValue(info[12].toString());
					row.createCell(13).setCellValue(info[13].toString());
					row.createCell(14).setCellValue(info[14].toString());
					row.createCell(15).setCellValue(info[15].toString());
					
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
