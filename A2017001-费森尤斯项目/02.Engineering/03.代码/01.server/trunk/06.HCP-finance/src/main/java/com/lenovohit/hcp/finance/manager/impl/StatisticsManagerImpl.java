package com.lenovohit.hcp.finance.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.finance.manager.StatisticsManager;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

@Service
@Transactional
public class StatisticsManagerImpl implements StatisticsManager {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;

	public void exportStatistics(List<Object> dataList, List<String> titleList, String fileName,
			HttpServletRequest request, HttpServletResponse response) {
		OutputStream out = null;
		int titleSize = titleList.size();
		if (titleSize > 0) {
			try {
				String header = request.getHeader("USER-AGENT");
				if (StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")) {// IE浏览器
					fileName = URLEncoder.encode(fileName, "UTF8");
				} else if (StringUtils.contains(header, "Mozilla")) {// google,火狐浏览器
					fileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.reset();
				response.setContentType("application/vnd.ms-word");
				// 定义文件名
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
				// 定义一个输出流
				response.setCharacterEncoding("UTF-8");
				out = response.getOutputStream();
				// 工作区
				XSSFWorkbook wb = new XSSFWorkbook();
				XSSFCellStyle cellStyle = wb.createCellStyle();
				XSSFFont font = wb.createFont();
				font.setFontHeightInPoints((short) 12);
				font.setFontName(" 黑体 ");
				cellStyle.setFont(font);

				// 创建第一个sheet
				XSSFSheet sheet = wb.createSheet();
				XSSFCellStyle style = wb.createCellStyle();
				font.setFontName("宋体");// 字体类型
				font.setFontHeightInPoints((short) 25);// 高度
				style.setFont(font);
				XSSFRow row1 = sheet.createRow(0);
				row1.setHeightInPoints((short) 30);
				// 给这一行赋值设置title
				for (int i = 0; i < titleSize; i++) {// 循环设置表头
					row1.createCell(i).setCellValue(titleList.get(i));
				}
				// 循环将dataList插入表中
				if (dataList != null && dataList.size() > 0) {
					for (int j = 0; j < dataList.size(); j++) {
						XSSFRow row = sheet.createRow(j + 1);
						Object[] obj = (Object[]) dataList.get(j);
						for (int i = 0; i < titleSize; i++) {
							if (obj[i] != null) {
								row.createCell(i).setCellValue(obj[i].toString());
							}
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
		} else {
			System.err.println("数据传递错误");
		}
	}

	@Override
	public List getPatientFee(String start, String limit, JSONObject query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List getTotalFeeByFeeType(JSONObject query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List getTotalFee(JSONObject query) {
		String startMonth = query.getString("startMonth");
		String endMonth = query.getString("endMonth");
		String hosId = query.getString("hosId");
		String chanel = query.getString("chenal");

		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();

		jql.append("SELECT '门诊' 项目,月份 日期, ");
		jql.append("(CASE WHEN charindex('医保',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 总费用_医保, ");
		jql.append("(CASE WHEN charindex('农合',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 总费用_农合, ");
		jql.append("(CASE 医保类别 ");
		jql.append("WHEN '现金' THEN sum(项目金额)  ");
		jql.append("ELSE 0 END) 总费用_自费, ");
		jql.append("sum(项目金额) 总费用_合计 ,aa.HOS_ID,	aa.HOS_NAME ");
		jql.append("FROM ");
		jql.append("( ");
		jql.append("SELECT ");
		jql.append("  LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) 月份, ");
		jql.append("  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE' ");
		if(StringUtils.isNotBlank(hosId)){
			jql.append("  and d.hos_id = '"+hosId+"' ");
		}
		jql.append("and d.COLUMN_KEY = a.PAY_TYPE),'现金') 医保类别, ");
		jql.append("  b.TOT_COST 项目金额 ,a.HOS_ID,h.HOS_NAME ");
		jql.append("FROM reg_info a,oc_chargedetail b,b_patientinfo c, b_hosinfo h ");
		jql.append("where a.PATIENT_ID = b.PATIENT_ID and a.HOS_ID = h.HOS_ID ");
		if(StringUtils.isNotBlank(hosId)){
			jql.append(" and a.hos_id = '"+hosId+"' ");
			jql.append(" and b.hos_id = '"+hosId+"' ");
			jql.append(" and c.hos_id = '"+hosId+"' ");
		}
		jql.append("  and a.PATIENT_ID = c.ID ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) >= '" + startMonth + "' ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) <= '" + endMonth + "' ");
		jql.append(") aa ");
		jql.append("GROUP BY aa.HOS_ID,aa.HOS_NAME,医保类别, 月份    ");
		jql.append("ORDER BY 月份 ");

		List total = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
		return total;
	}

	@Override
	public List getTotalInsurance(JSONObject query) {
		String startMonth = query.getString("startMonth");
		String endMonth = query.getString("endMonth");
		String hosId = query.getString("hosId");
		String chanel = query.getString("chenal");
		
		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();

		jql.append("SELECT '门诊' 项目,月份 日期, ");
		jql.append("(CASE WHEN charindex('医保',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 记帐_医保, ");
		jql.append("(CASE WHEN charindex('农合',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 记帐_农合, ");
		jql.append("(CASE 医保类别 ");
		jql.append("WHEN '现金' THEN sum(项目金额)  ");
		jql.append("ELSE 0 END) 记帐_自费, ");
		jql.append("sum(项目金额) 记帐_合计 ,aa.HOS_ID,	aa.HOS_NAME ");
		jql.append("FROM ");
		jql.append("( ");
		jql.append("SELECT ");
		jql.append("  LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) 月份, ");
		jql.append("  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE'");
		if(StringUtils.isNotBlank(hosId)){
			jql.append("  and d.hos_id = '"+hosId+"' ");
		}
		jql.append(" and d.COLUMN_KEY = a.PAY_TYPE),'现金') 医保类别, ");
		jql.append("  b.PUB_COST 项目金额 ,a.HOS_ID,h.HOS_NAME ");
		jql.append("FROM reg_info a,oc_chargedetail b,b_patientinfo c , b_hosinfo h ");
		jql.append("where a.PATIENT_ID = b.PATIENT_ID and a.HOS_ID = h.HOS_ID ");
		if(StringUtils.isNotBlank(hosId)){
			jql.append(" and a.hos_id = '"+hosId+"' ");
			jql.append(" and b.hos_id = '"+hosId+"' ");
			jql.append(" and c.hos_id = '"+hosId+"' ");
		}
		jql.append("  and a.PATIENT_ID = c.ID ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) >= '" + startMonth + "' ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) <= '" + endMonth + "' ");
		jql.append(") aa ");
		jql.append("GROUP BY aa.HOS_ID,aa.HOS_NAME,医保类别, 月份  ");
		jql.append("ORDER BY 月份 ");
		List insurance = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
		return insurance;
	}

	@Override
	public List getTotalCash(JSONObject query) {
		String startMonth = query.getString("startMonth");
		String endMonth = query.getString("endMonth");
		String hosId = query.getString("hosId");
		String chanel = query.getString("chenal");
		
		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();

		jql.append("SELECT '门诊' 项目,月份 日期, ");
		jql.append("(CASE WHEN charindex('医保',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 现金_医保, ");
		jql.append("(CASE WHEN charindex('农合',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 现金_农合, ");
		jql.append("(CASE 医保类别 ");
		jql.append("WHEN '现金' THEN sum(项目金额)  ");
		jql.append("ELSE 0 END) 现金_自费, ");
		jql.append("sum(项目金额) 现金_合计 ,aa.HOS_ID,	aa.HOS_NAME ");
		jql.append("FROM ");
		jql.append("( ");
		jql.append("SELECT ");
		jql.append("  LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) 月份, ");
		jql.append("  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE'");
		if(StringUtils.isNotBlank(hosId)){
			jql.append("  and d.hos_id = '"+hosId+"' ");
		}
		jql.append(" and d.COLUMN_KEY = a.PAY_TYPE),'现金') 医保类别, ");
		jql.append("  b.tot_cost - b.PUB_COST 项目金额 ,a.HOS_ID,h.HOS_NAME ");
		jql.append("FROM reg_info a,oc_chargedetail b,b_patientinfo c ,b_hosinfo h ");
		jql.append("where a.PATIENT_ID = b.PATIENT_ID  and a.HOS_ID = h.HOS_ID ");
		if(StringUtils.isNotBlank(hosId)){
			jql.append(" and a.hos_id = '"+hosId+"' ");
			jql.append(" and b.hos_id = '"+hosId+"' ");
			jql.append(" and c.hos_id = '"+hosId+"' ");
		}
		jql.append("  and a.PATIENT_ID = c.ID ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) >= '" + startMonth + "' ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) <= '" + endMonth + "' ");
		jql.append(") aa ");
		jql.append("GROUP BY aa.HOS_ID,aa.HOS_NAME,医保类别, 月份   ");
		jql.append("ORDER BY 月份 ");

		List cash = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
		return cash;
	}

	@Override
	public List getTotalDrugFee(JSONObject query) {
		String startMonth = query.getString("startMonth");
		String endMonth = query.getString("endMonth");
		String hosId = query.getString("hosId");
		String chanel = query.getString("chenal");
		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();

		jql.append("SELECT '门诊' 项目,月份 日期, ");
		jql.append("(CASE WHEN charindex('医保',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 药费_医保, ");
		jql.append("(CASE WHEN charindex('农合',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 药费_农合, ");
		jql.append("(CASE 医保类别 ");
		jql.append("WHEN '现金' THEN sum(项目金额)  ");
		jql.append("ELSE 0 END) 药费_自费, ");
		jql.append("sum(项目金额) 药费_合计 ,aa.HOS_ID,	aa.HOS_NAME ");
		jql.append("FROM ");
		jql.append("( ");
		jql.append("SELECT ");
		jql.append("  LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) 月份, ");
		jql.append(
				"  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE' and d.COLUMN_KEY = a.PAY_TYPE),'现金') 医保类别, ");
		jql.append("  b.tot_cost 项目金额 ,a.HOS_ID,h.HOS_NAME ");
		jql.append("FROM reg_info a,oc_chargedetail b,b_patientinfo c ,b_hosinfo h ");
		jql.append("where a.PATIENT_ID = b.PATIENT_ID and a.HOS_ID = h.HOS_ID ");
		if(StringUtils.isNotBlank(hosId)){
			jql.append(" and a.hos_id = '"+hosId+"' ");
			jql.append(" and b.hos_id = '"+hosId+"' ");
			jql.append(" and c.hos_id = '"+hosId+"' ");
		}
		jql.append("  and a.PATIENT_ID = c.ID ");
		jql.append("  AND b.DRUG_FLAG = '1' ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) >= '" + startMonth + "' ");
		jql.append("  and LEFT(CONVERT(varchar(50), a.REG_TIME, 20), 7) <= '" + endMonth + "' ");
		jql.append(") aa ");
		jql.append("GROUP BY aa.hos_id,aa.hos_name , 医保类别, 月份  ");
		jql.append("ORDER BY 月份 ");

		List drug = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
		return drug;
	}

	@Override
	public void exportTotalFee(Object[] dataList, HttpServletRequest request, HttpServletResponse response) {
		String fileName = "总费用分类统计";
		OutputStream out = null;
		int titleSize = 18;
		if (titleSize > 0) {
			try {
				String header = request.getHeader("USER-AGENT");
				if (StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")) {// IE浏览器
					fileName = URLEncoder.encode(fileName, "UTF8");
				} else if (StringUtils.contains(header, "Mozilla")) {// google,火狐浏览器
					fileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.reset();
				response.setContentType("application/vnd.ms-word");
				// 定义文件名
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
				// 定义一个输出流
				response.setCharacterEncoding("UTF-8");
				out = response.getOutputStream();
				// 工作区
				XSSFWorkbook wb = new XSSFWorkbook();
				XSSFCellStyle cellStyle = wb.createCellStyle();
				XSSFFont font = wb.createFont();
				font.setFontHeightInPoints((short) 12);
				font.setFontName(" 黑体 ");
				cellStyle.setFont(font);
				

				// 创建第一个sheet
				XSSFSheet sheet = wb.createSheet();
				XSSFCellStyle style = wb.createCellStyle();
				font.setFontName("宋体");// 字体类型
				font.setFontHeightInPoints((short) 12);// 高度
				style.setFont(font);
				style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
			    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
			    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
				style.setFillPattern(CellStyle.SOLID_FOREGROUND);
				// 给这一行赋值设置title
				for (int i = 0; i < dataList.length+2; i++) {// 循环创建单元格
					XSSFRow row = sheet.createRow(i);
					for(int j=0;j<titleSize;j++){
						if(i==0){
							row.createCell(j).setCellStyle(style);
						}else{
							row.createCell(j);
						}
					}
				}
				//合并单元格（开始行，结束行，开始列，结束列）
				sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, 0));//项目
				sheet.addMergedRegion(new CellRangeAddress(0, 1, 1, 1));//日期
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 2, 5));//总费用
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 6, 9));//记账
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 10, 13));//现金
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 14, 17));//药费
				//第一行
				sheet.getRow(0).getCell(0).setCellValue("项目");
				sheet.getRow(0).getCell(1).setCellValue("日期");
				sheet.getRow(0).getCell(2).setCellValue("总费用");
				sheet.getRow(0).getCell(6).setCellValue("记账");
				sheet.getRow(0).getCell(10).setCellValue("现金");
				sheet.getRow(0).getCell(14).setCellValue("药费");
				//第二行
				sheet.getRow(1).getCell(2).setCellValue("医保");
				sheet.getRow(1).getCell(3).setCellValue("居保");
				sheet.getRow(1).getCell(4).setCellValue("自费");
				sheet.getRow(1).getCell(5).setCellValue("合计");
				sheet.getRow(1).getCell(6).setCellValue("医保");
				sheet.getRow(1).getCell(7).setCellValue("居保");
				sheet.getRow(1).getCell(8).setCellValue("自费");
				sheet.getRow(1).getCell(9).setCellValue("合计");
				sheet.getRow(1).getCell(10).setCellValue("医保");
				sheet.getRow(1).getCell(11).setCellValue("居保");
				sheet.getRow(1).getCell(12).setCellValue("自费");
				sheet.getRow(1).getCell(13).setCellValue("合计");
				sheet.getRow(1).getCell(14).setCellValue("医保");
				sheet.getRow(1).getCell(15).setCellValue("居保");
				sheet.getRow(1).getCell(16).setCellValue("自费");
				sheet.getRow(1).getCell(17).setCellValue("合计");
				// 循环将dataList插入表中
				if (dataList != null && dataList.length > 0) {
					for (int j = 0; j < dataList.length; j++) {
						XSSFRow row = sheet.getRow(j + 2);
						Object[] obj = (Object[]) dataList[j];
						for (int i = 0; i < titleSize; i++) {
							if (obj[i] != null) {
								row.getCell(i).setCellValue(obj[i].toString());
							}else{
								row.getCell(i).setCellValue("0");
							}
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
		} else {
			System.err.println("数据传递错误");
		}
	}
	
	/**    
	 * 功能描述：根据条件导出会计收款统计
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	 */
	public void exportIncomeAndExpenses(List dataList, HttpServletRequest request, HttpServletResponse response,String title) {
		String fileName = "会计收款";
		OutputStream out = null;
		int titleSize = 5;
		if (titleSize > 0) {
			try {
				String header = request.getHeader("USER-AGENT");
				if (StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")) {// IE浏览器
					fileName = URLEncoder.encode(fileName, "UTF8");
				} else if (StringUtils.contains(header, "Mozilla")) {// google,火狐浏览器
					fileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.reset();
				response.setContentType("application/vnd.ms-word");
				// 定义文件名
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
				// 定义一个输出流
				response.setCharacterEncoding("UTF-8");
				out = response.getOutputStream();
				// 工作区
				XSSFWorkbook wb = new XSSFWorkbook();
				XSSFCellStyle cellStyle = wb.createCellStyle();
				XSSFCellStyle titleStyle = wb.createCellStyle();
				XSSFFont font = wb.createFont();
				font.setFontHeightInPoints((short) 12);
				font.setFontName(" 黑体 ");
				cellStyle.setFont(font);
				cellStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
				
				
				// 创建第一个sheet
				XSSFSheet sheet = wb.createSheet();
				XSSFCellStyle style = wb.createCellStyle();
				font.setFontName("宋体");// 字体类型
				font.setFontHeightInPoints((short) 12);// 高度
				style.setFont(font);
				style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				titleStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				titleStyle.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
				style.setFillPattern(CellStyle.SOLID_FOREGROUND);
				// 给这一行赋值设置title
				for (int i = 0; i < dataList.size()+3; i++) {// 循环创建单元格
					XSSFRow row = sheet.createRow(i);
					for(int j=0;j<titleSize;j++){
						if(i==0){
							row.createCell(j).setCellStyle(style);
						}else if(i!=3){
							row.createCell(j).setCellStyle(titleStyle);
						}else {
							row.createCell(j).setCellStyle(cellStyle);
						}
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));//表头
				//合并单元格（开始行，结束行，开始列，结束列）
				sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));//收入
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, 2));//药品消耗
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 3, 4));//物资消耗
				//第一行
				sheet.getRow(0).getCell(0).setCellValue(title);
				sheet.getRow(1).getCell(0).setCellValue("收入");
				sheet.getRow(1).getCell(1).setCellValue("药品消耗");
				sheet.getRow(1).getCell(3).setCellValue("物资消耗");
				//第二行
				sheet.getRow(2).getCell(1).setCellValue("进价");
				sheet.getRow(2).getCell(2).setCellValue("售价");
				sheet.getRow(2).getCell(3).setCellValue("进价");
				sheet.getRow(2).getCell(4).setCellValue("售价");
				
				sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
				sheet.setColumnWidth(1,8 * 512);
				sheet.setColumnWidth(2,8 * 512);
				sheet.setColumnWidth(3,8 * 512);
				sheet.setColumnWidth(4,8 * 512);
				// 循环将dataList插入表中
				if (dataList != null && dataList.size() > 0) {
					XSSFRow row = sheet.getRow(3);
					Map<String,Object> map = (Map<String, Object>) dataList.get(0);
					DecimalFormat myformat=new DecimalFormat("0.0000");
					for (int i = 0; i < titleSize; i++) {
						if ( map!= null) {
							if(map.get("totalAmt")!=null){
								row.getCell(0).setCellValue(myformat.format(map.get("totalAmt")));
							}else{
								row.getCell(0).setCellValue("0.00");
							}
							if(map.get("totalBuyOfDrug")!=null){
								row.getCell(1).setCellValue(myformat.format(map.get("totalBuyOfDrug")));
							}else{
								row.getCell(1).setCellValue("0.00");
							}
							if(map.get("totalSaleOfDrug")!=null){
								row.getCell(2).setCellValue(myformat.format(map.get("totalSaleOfDrug")));
							}else{
								row.getCell(2).setCellValue("0.00");
							}
							if(map.get("totalBuyOfMat")!=null){
								row.getCell(3).setCellValue(myformat.format(map.get("totalBuyOfMat")));
							}else{
								row.getCell(3).setCellValue("0.00");
							}
							if(map.get("totalSaleOfMat")!=null){
								row.getCell(4).setCellValue(myformat.format(map.get("totalSaleOfMat")));
							}else{
								row.getCell(4).setCellValue("0.00");
							}
						}else{
							row.getCell(0).setCellValue("0.00");
							row.getCell(1).setCellValue("0.00");
							row.getCell(2).setCellValue("0.00");
							row.getCell(3).setCellValue("0.00");
							row.getCell(4).setCellValue("0.00");
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
		} else {
			System.err.println("数据传递错误");
		}
	}
	
	/**    
	 * 功能描述：根据条件导出物资消耗
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	 */
	public void exportMatConsum(List dataList, HttpServletRequest request, HttpServletResponse response,String title) {
		String fileName = "会计收款";
		OutputStream out = null;
		int titleSize = 5;
		if (titleSize > 0) {
			try {
				String header = request.getHeader("USER-AGENT");
				if (StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")) {// IE浏览器
					fileName = URLEncoder.encode(fileName, "UTF8");
				} else if (StringUtils.contains(header, "Mozilla")) {// google,火狐浏览器
					fileName = new String(fileName.getBytes(), "ISO8859-1");
				} else {
					fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
				}
				response.reset();
				response.setContentType("application/vnd.ms-word");
				// 定义文件名
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
				// 定义一个输出流
				response.setCharacterEncoding("UTF-8");
				out = response.getOutputStream();
				// 工作区
				XSSFWorkbook wb = new XSSFWorkbook();
				XSSFCellStyle cellStyle = wb.createCellStyle();
				XSSFCellStyle titleStyle = wb.createCellStyle();
				XSSFFont font = wb.createFont();
				font.setFontHeightInPoints((short) 12);
				font.setFontName(" 黑体 ");
				cellStyle.setFont(font);
				cellStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
				
				
				// 创建第一个sheet
				XSSFSheet sheet = wb.createSheet();
				XSSFCellStyle style = wb.createCellStyle();
				font.setFontName("宋体");// 字体类型
				font.setFontHeightInPoints((short) 12);// 高度
				style.setFont(font);
				style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				titleStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
				style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				titleStyle.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
				style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
				style.setFillPattern(CellStyle.SOLID_FOREGROUND);
				// 给这一行赋值设置title
				for (int i = 0; i < dataList.size()+3; i++) {// 循环创建单元格
					XSSFRow row = sheet.createRow(i);
					for(int j=0;j<titleSize;j++){
						if(i==0){
							row.createCell(j).setCellStyle(style);
						}else if(i==1){
							row.createCell(j).setCellStyle(titleStyle);
						}else {
							row.createCell(j).setCellStyle(cellStyle);
						}
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));//表头
				//第一行
				sheet.getRow(0).getCell(0).setCellValue(title);
				sheet.getRow(1).getCell(0).setCellValue("物资名称");
				sheet.getRow(1).getCell(1).setCellValue("数量");
				sheet.getRow(1).getCell(2).setCellValue("单价");
				sheet.getRow(1).getCell(3).setCellValue("金额");
				
				sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
				sheet.setColumnWidth(1,8 * 512);
				sheet.setColumnWidth(2,8 * 512);
				sheet.setColumnWidth(3,8 * 512);
				sheet.setColumnWidth(4,8 * 512);
				// 循环将dataList插入表中
				if (dataList != null && dataList.size() > 0) {
					for(int i=0;i<dataList.size();i++){
						XSSFRow row = sheet.getRow(i+2);
						Object [] objList = (Object []) dataList.get(i);
						DecimalFormat myformat=new DecimalFormat("0.0000");
						DecimalFormat myformat2=new DecimalFormat("0.00");
						DecimalFormat myformat0=new DecimalFormat("0");

						if ( objList!= null) {
							if(objList[0]!=null){
								row.getCell(0).setCellValue(objList[1].toString());
							}
							if(objList[4]!=null){
								if(objList[2]!=null){
									row.getCell(1).setCellValue(myformat0.format(objList[4])+objList[2]);
								}else{
									System.out.println(objList[4]);
									row.getCell(1).setCellValue(myformat0.format(objList[4]));
								}
							}else{
								row.getCell(1).setCellValue("0");
							}
							if(objList[5]!=null){
								row.getCell(2).setCellValue(myformat.format(objList[5]));
							}else{
								row.getCell(2).setCellValue("0.00");
							}
							if(objList[6]!=null){
								row.getCell(3).setCellValue(myformat2.format(objList[6]));
							}else{
								row.getCell(3).setCellValue("0.00");
							}
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
		} else {
			System.err.println("数据传递错误");
		}
	}

	@Override
	public Map<String, List<Object>> findBaseFeeType() {
		String sql = "select 'drugFee',LEFT (CONVERT (VARCHAR(50), info.invoice_time, 20),7	) dtime, sum(de.tot_cost) cost from oc_invoiceinfo_detail de LEFT JOIN oc_invoiceinfo info on de.INVOICE_NO = info.INVOICE_NO "
				+ "where FEE_CODE='001' or FEE_CODE='002' or FEE_CODE='003' GROUP BY LEFT (CONVERT (VARCHAR(50), info.invoice_time, 20),7) "
				+ "UNION ALL  "
				+ "select 'treatFee',LEFT (	CONVERT (VARCHAR(50), info.invoice_time, 20),7)dtime, sum(de.tot_cost) cost from oc_invoiceinfo_detail de LEFT JOIN oc_invoiceinfo info on de.INVOICE_NO = info.INVOICE_NO "
				+ "where FEE_CODE='009' GROUP BY LEFT (	CONVERT (VARCHAR(50), info.invoice_time, 20),7) "
				+ "UNION ALL "
				+ "select 'regFee',LEFT (CONVERT (VARCHAR(50), info.invoice_time, 20),7	)dtime, sum(de.tot_cost) cost from oc_invoiceinfo_detail de LEFT JOIN oc_invoiceinfo info on de.INVOICE_NO = info.INVOICE_NO "
				+ "where FEE_CODE='007' GROUP BY LEFT (	CONVERT (VARCHAR(50), info.invoice_time, 20),7) "
				+ "UNION ALL "
				+ "select 'othersFee',LEFT (CONVERT (VARCHAR(50), info.invoice_time, 20),7)dtime, sum(de.tot_cost) cost from oc_invoiceinfo_detail de LEFT JOIN oc_invoiceinfo info on de.INVOICE_NO = info.INVOICE_NO "
				+ "where FEE_CODE !='001' AND FEE_CODE!='002' and FEE_CODE!='003' and FEE_CODE!='009' and FEE_CODE!='007' GROUP BY LEFT (CONVERT (VARCHAR(50), info.invoice_time, 20),	7)";
		List rtn = outpatientChargeDetailManager.findBySql(sql);
		Map<String, List<Object>> map = transformFeeType(rtn);
		return map;
	}

	private Map<String, List<Object>> transformFeeType(List rtn) {
		Date date = new Date();
		String year = DateUtils.getCurrentYear();
		Map<String,TreeMap<String,Object>> mapView = new HashMap<>();
		if(rtn!=null && rtn.size()>0){
			for(Object o:rtn){
				Object [] oList = (Object[]) o;
				String feeType = oList[0].toString();
				TreeMap<String,Object> tMap = mapView.get(feeType);
				if(tMap!=null){
					tMap.put(oList[1].toString(), oList[2]);
				}else{
					TreeMap<String,Object> tmpMap = new TreeMap<String,Object>();
					tmpMap.put(year+"-01", "0");
					tmpMap.put(year+"-02", "0");
					tmpMap.put(year+"-03", "0");
					tmpMap.put(year+"-04", "0");
					tmpMap.put(year+"-05", "0");
					tmpMap.put(year+"-06", "0");
					tmpMap.put(year+"-07", "0");
					tmpMap.put(year+"-08", "0");
					tmpMap.put(year+"-09", "0");
					tmpMap.put(year+"-10", "0");
					tmpMap.put(year+"-11", "0");
					tmpMap.put(year+"-12", "0");
					tmpMap.put(oList[1].toString(), oList[2]);
					mapView.put(feeType, tmpMap);
				}
			}
		}
		Map<String,List<Object>> mapList = new HashMap<>();
		for (Entry<String, TreeMap<String, Object>> entry : mapView.entrySet()) {
			String key = entry.getKey();
			List<Object> oList = new ArrayList<>();
			for(Entry<String, Object> m : entry.getValue().entrySet()){
				oList.add(m.getValue());
			}
			mapList.put(key, oList);
		}
		return mapList;
	}

}
