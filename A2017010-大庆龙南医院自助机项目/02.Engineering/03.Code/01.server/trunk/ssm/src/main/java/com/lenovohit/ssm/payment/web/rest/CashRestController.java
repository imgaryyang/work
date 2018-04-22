package com.lenovohit.ssm.payment.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
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
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.CashBatch;
import com.lenovohit.ssm.payment.model.CashError;
import com.lenovohit.ssm.payment.model.Settlement;

/**
 * 结算单管理
 * 
 * 
 */
@RestController
@RequestMapping("/ssm/pay/cash")
public class CashRestController extends SSMBaseRestController {

	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<CashBatch, String> cashBatchManager;
	@Autowired
	private GenericManager<CashError, String> cashErrorManager;
	/**
	 * 现金回调 
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/error/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRecordCashError(@RequestBody String data){
		Machine machine = this.getCurrentMachine();
		CashError model =  JSONUtils.deserialize(data, CashError.class);
		model.setCreateTime(new Date());
		model.setMachineCode(machine.getCode());
		model.setMachineId(machine.getId());
		model.setMachineMac(machine.getMac());
		model.setMachineName(machine.getName());
		CashError saved = this.cashErrorManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/batch/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBatchPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		CashBatch query = JSONUtils.deserialize(data, CashBatch.class);
		StringBuilder jql = new StringBuilder(" from CashBatch where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (!StringUtils.isEmpty(query.getBatchNo())) {
			jql.append(" and batchNo = ? ");
			values.add("%"+query.getBatchNo()+"%");
		}
		if (!StringUtils.isEmpty(query.getBatchDay())) {
			jql.append(" and batchDay = ? ");
			values.add(query.getBatchDay());
		}
		if (!StringUtils.isEmpty(query.getStatus())) {
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if (!StringUtils.isEmpty(query.getMachineName())) {
			jql.append(" and machineName like ? ");
			values.add("%"+query.getMachineName()+"%");
		}
		if (!StringUtils.isEmpty(query.getMachineCode())) {
			jql.append(" and machineCode like ? ");
			values.add("%"+query.getMachineCode()+"%");
		}
		jql.append(" order by batchDay desc, machineCode ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		cashBatchManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/detail/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Settlement query = JSONUtils.deserialize(data, Settlement.class);
		StringBuilder jql = new StringBuilder(" from Settlement where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (!StringUtils.isEmpty(query.getPrintBatchNo())) {
			jql.append(" and printBatchNo = ? ");
			values.add(query.getPrintBatchNo());
		}
		if (!StringUtils.isEmpty(query.getMachineCode())) {
			jql.append(" and machineCode = ? ");
			values.add(query.getMachineCode());
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		settlementManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/batch/export/{batchDay}/{payChannelCode}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBatchs(@PathVariable("batchDay") String batchDay, @PathVariable("payChannelCode") String payChannelCode) {

		StringBuilder jql = new StringBuilder("select distinct(cb) from CashBatch cb left join cb.machine m where cb.batchDay = ? and m.mngCode = ? order by cb.machineCode");
		List<CashBatch> batchs = cashBatchManager.find(jql.toString(), batchDay, payChannelCode);
		try {
			HttpServletResponse response = this.getResponse();
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ payChannelCode +"_"+ batchDay + ".xlsx");
			// 定义一个输出流
			OutputStream out = null;
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();
			writeBatchExcel(batchs, out, batchDay);
			
			this.cashBatchManager.batchSave(batchs);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/detail/export/{batchNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportDetails(@PathVariable("batchNo") String batchNo) {
		CashBatch batch = this.cashBatchManager.findOne(" from CashBatch where batchNo = ? ", batchNo);
		StringBuilder jql = new StringBuilder(" from Settlement where printBatchNo = ? ");
		List<Settlement> settlements = settlementManager.find(jql.toString(), batchNo);
		try {
			HttpServletResponse response = this.getResponse();
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename=大庆龙南医院自助机清钞数据_" + batch.getMachineCode() + ".xlsx");
			// 定义一个输出流
			OutputStream out = null;
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();
			writeDetailsExcel(settlements, out, batch);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/batch/import", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result importBatchs(@RequestParam("file") MultipartFile file) {
		try {
			if (file.isEmpty()) {
				return ResultUtils.renderFailureResult("文件为空");
			}
			// 获取文件名
			String fileName = file.getOriginalFilename();
			logger.info("上传的文件名为：" + fileName);
			// 获取文件的后缀名
			String suffixName = fileName.substring(fileName.lastIndexOf("."));
			logger.info("上传的后缀名为：" + suffixName);
			
			List<CashBatch> batchs = new ArrayList<CashBatch>();
			readBatchExcel(batchs, file.getInputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderSuccessResult();
//		// 文件上传后的路径
//		String filePath = "E://test//";
//		// 解决中文问题，liunx下中文路径，图片显示问题
//		// fileName = UUID.randomUUID() + suffixName;
//		File dest = new File(filePath + fileName);
//		// 检测是否存在目录
//		if (!dest.getParentFile().exists()) {
//			dest.getParentFile().mkdirs();
//		}
//		try {
//			file.transferTo(dest);
//			return "上传成功";
//		} catch (IllegalStateException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
	}

	public void writeBatchExcel(List<CashBatch> batchs, OutputStream out, String day) {
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFSheet sheet = wb.createSheet("清钞数据");
//			XSSFCellStyle cellStyle = wb.createCellStyle();
//			XSSFFont font = wb.createFont();
//			font.setFontHeightInPoints((short) 12);
//			font.setFontName(" 黑体 ");
//			cellStyle.setFont(font);
//			// 创建第一个sheet
//			XSSFSheet sheet = wb.createSheet("入库汇总信息");
			sheet.setColumnWidth(0, 4 * 512);//// 设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1, 10 * 512);
			sheet.setColumnWidth(2, 8 * 512);
			sheet.setColumnWidth(3, 8 * 512);
			sheet.setColumnWidth(4, 8 * 512);
			sheet.setColumnWidth(5, 10 * 512);
			sheet.setColumnWidth(6, 8 * 512);
			sheet.setColumnWidth(7, 8 * 512);
//
//			XSSFCellStyle style = wb.createCellStyle();
//			font.setFontName("宋体");// 字体类型
//			font.setFontHeightInPoints((short) 25);// 高度
//			style.setFont(font);
//			style.setAlignment(XSSFCellStyle.ALIGN_CENTER);// 水平居中
//			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);// 上下居中
//			style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());// 设置单元格颜色
//			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
//			// 生成第一行
//			XSSFRow row0 = sheet.createRow(0);
//			row0.setHeightInPoints((short) 50);
//			XSSFCell cell = row0.createCell(0);
//			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));// 合并单元格（开始行，结束行，开始列，结束列）
//			cell.setCellStyle(style);
//			cell.setCellValue("云南省第一人民医院清钞统计("+day+")");
			XSSFRow row1 = sheet.createRow(0);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("序号");
			row1.createCell(1).setCellValue("批号");
			row1.createCell(2).setCellValue("笔数");
			row1.createCell(3).setCellValue("金额");
			row1.createCell(4).setCellValue("机器");
			row1.createCell(5).setCellValue("MAC");
			row1.createCell(6).setCellValue("日期");
			row1.createCell(7).setCellValue("银行点钞");
			
			XSSFCellStyle amtStyle = wb.createCellStyle();
			XSSFDataFormat format= wb.createDataFormat();
			amtStyle.setDataFormat(format.getFormat("¥#,##0.00")); 
			amtStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
			XSSFRow row = null;
			XSSFCell cell = null;
			CashBatch info = null;
			BigDecimal totalAmt = new BigDecimal(0);
			// 循环将dataList插入表中
			if (batchs != null && batchs.size() > 0) {
				for (int i = 1; i <= batchs.size(); i++) {
					row = sheet.createRow(i);
					info = batchs.get(i-1);
					info.setStatus(CashBatch.PRINT_STAT_PRINTED);
					totalAmt = totalAmt.add(info.getAmt());
					
					cell = row.createCell(0);
					cell.setCellValue(i);

					cell = row.createCell(1);
					cell.setCellValue(info.getBatchNo());

					cell = row.createCell(2);
					cell.setCellValue(info.getCount());

					cell = row.createCell(3);
					cell.setCellValue(info.getAmt().doubleValue());
					cell.setCellStyle(amtStyle);

					cell = row.createCell(4);
					cell.setCellValue(info.getMachineCode());

					cell = row.createCell(5);
					cell.setCellValue(info.getMachineMac());

					cell = row.createCell(6);
					cell.setCellValue(info.getBatchDay());

					cell = row.createCell(7);
					cell.setCellStyle(amtStyle);
					cell.setCellValue(0);
				}
				row = sheet.createRow(batchs.size() + 1);
				cell = row.createCell(0);
				cell.setCellValue("合计");
				
				cell = row.createCell(3);
				cell.setCellStyle(amtStyle);
				cell.setCellValue(totalAmt.doubleValue());
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
	
	public void writeDetailsExcel(List<Settlement> settles,OutputStream out,CashBatch batch) {
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
			sheet.setColumnWidth(0, 12 * 512);//// 设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1, 8 * 512);
			sheet.setColumnWidth(2, 8 * 512);

			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");// 字体类型
			font.setFontHeightInPoints((short) 25);// 高度
			style.setFont(font);
			style.setAlignment(XSSFCellStyle.ALIGN_CENTER);// 水平居中
			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);// 上下居中
			style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());// 设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			row0.setHeightInPoints((short) 50);
			XSSFCell cell = row0.createCell(0);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));// 合并单元格（开始行，结束行，开始列，结束列）
			cell.setCellStyle(style);
			cell.setCellValue("云南省第一人民医院清钞明细-"+batch.getMachineCode()+"("+batch.getBatchDay()+")");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("机器编号");
			row1.createCell(1).setCellValue("机器mac");
			row1.createCell(2).setCellValue("金额");
			row1.createCell(3).setCellValue("时间");
			// 循环将dataList插入表中
			if (settles != null && settles.size() > 0) {
				for (int i = 0; i < settles.size(); i++) {
					XSSFRow row = sheet.createRow(i + 2);
					Settlement info = settles.get(i);
					row.createCell(0).setCellValue(info.getMachineCode());
					row.createCell(1).setCellValue(info.getMachineMac());
					row.createCell(2).setCellValue(info.getAmt()+"");
					row.createCell(3).setCellValue(info.getCreateTime());
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
	public void readBatchExcel(List<CashBatch> batchs, InputStream in){
		// 输出流
		try {
			// 构造工作区 XSSFWorkbook 对象，strPath 传入文件路径
			XSSFWorkbook workbook = new XSSFWorkbook(in);
			// 读取第一章表格内容
			XSSFSheet sheet = workbook.getSheetAt(0);
			// 定义 row、cell
			XSSFRow row = null;
			String batchNo = "";
			CashBatch batch = null;
			for (int i = sheet.getFirstRowNum()+1 ; i < sheet.getPhysicalNumberOfRows(); i++) {
				row = sheet.getRow(i);
				if (row == null || row.getCell(0) == null || "合计".equals(getCellValue(row.getCell(0)))) {
					continue;
				}
				batchNo = getCellValue(row.getCell(1));
				batch = this.cashBatchManager.findOne("from CashBatch  where batchNo = ?", batchNo);
				if(batch != null && row.getCell(7).getNumericCellValue() > 0 ){
					batch.setBankAmt(new BigDecimal(getCellValue(row.getCell(7))));
					batch.setImportTime(DateUtils.getCurrentDate());
					this.cashBatchManager.save(batch);
				} 
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private String getCellValue(XSSFCell cell){
        // System.out.println("列：" + cell.getCellNum()); 
		String value = "";
        switch (cell.getCellType()) {     
	        case XSSFCell.CELL_TYPE_NUMERIC: // 数字     
	            value = cell.getNumericCellValue() + "";
	            break;     
	        case XSSFCell.CELL_TYPE_STRING: // 字符串     
	        	 value = cell.getStringCellValue() + "";
	            break;     
	        case XSSFCell.CELL_TYPE_BOOLEAN: // Boolean     
	        	value = cell.getBooleanCellValue() + "";
	            break;
	        case XSSFCell.CELL_TYPE_FORMULA: // 公式     
	        	value = cell.getCellFormula() + "";
	            break;
	        case XSSFCell.CELL_TYPE_BLANK: // 空值     
	        	value = "";
	            break;     
	        case XSSFCell.CELL_TYPE_ERROR: // 故障     
	        	value = "";
	            break;     
	        default:     
	        	value = "";  
	            break;     
        } 
        
        return value;
	}
}
