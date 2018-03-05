package com.infohold.el.base.utils.excel;

import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class PoiReader {
	private PoiCallback callback;
	private Row row;
	public PoiCallback getCallback() {
		return callback;
	}
	public void setCallback(PoiCallback callback) {
		this.callback = callback;
	}
	public Row getRow() {
		return row;
	}
	public void setRow(Row row) {
		this.row = row;
	}
	
	public boolean checkData(String fileName, InputStream is, int column, String toCompare){
		try {
			Workbook workbook = null;
			if(fileName.toLowerCase().endsWith("xls")){    
				workbook = new HSSFWorkbook(is);    
	        }else if(fileName.toLowerCase().endsWith("xlsx")){  
	        	workbook = new XSSFWorkbook(is);
	        }
			// 读取第一章表格内容
			Sheet sheet = workbook.getSheetAt(0);
			return this.getCellValue(sheet.getRow(0), column).toString().equals(toCompare);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public String importFile(String fileName, InputStream is, boolean isCover, Object obj ){
		String resStr = "";
		String failStr = "";
		Integer sucessCount = 0;
		Integer failCount = 0;
		try {
			Workbook workbook = null;
			if(fileName.toLowerCase().endsWith("xls")){    
				workbook = new HSSFWorkbook(is);    
	        }else if(fileName.toLowerCase().endsWith("xlsx")){  
	        	workbook = new XSSFWorkbook(is);
	        }
			// 读取第一章表格内容
			Sheet sheet = workbook.getSheetAt(0);
			// 定义 cell
			boolean result = true;
			for (int i = 2; i <= sheet.getLastRowNum(); i++) {
				this.setRow(sheet.getRow(i));
				if (this.row == null) {
					continue;
				}
				
				result = this.callback.HandleDataRow(this.row,obj);
				if (result) {
					sucessCount++;
				}
				else{
					failCount++;
					failStr += "第【"+ (i + 1) +"】行，";
				}
			}
			resStr = "导入结果：成功【"+ sucessCount +"】";
			if(failCount > 0){
				resStr += ",失败【"+ failCount +"】。";
				resStr += "&nbsp<span style='color：red;'>" + failStr.substring(0, failStr.length()-1) +"存在错误！</span>";
			}
		} catch (Exception e) {
			e.printStackTrace();
			resStr = "导入失败，请核实导入文件格式是否正确！";
		}
		
		return resStr;
	}
	
/*	private boolean HandleDataRow(Row row) throws Exception{
		if (row == null) {
			return null;
		}
		Demo demo = new Demo();
		try {
			// 假设只有四行
			demo.setId((String)this.getCellValue(row, 1));
			demo.setName((String)this.getCellValue(row, 2));
			demo.setRel((String)this.getCellValue(row, 3));
			
			System.out.println(demo.toString());
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}*/
	
	/**
	 * 获取单元格值
	 * @param row 获取的行
	 * @param column 获取单元格列号
	 * @return 单元格值
	 */
	public Object getCellValue(Row row, int column){
		Object val = "";
		try{
			Cell cell = row.getCell(column);
			if (cell != null){
				if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC){
					val = cell.getNumericCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_STRING){
					val = cell.getStringCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA){
					val = cell.getCellFormula();
				}else if (cell.getCellType() == Cell.CELL_TYPE_BOOLEAN){
					val = cell.getBooleanCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_ERROR){
					val = cell.getErrorCellValue();
				}
			}
		}catch (Exception e) {
			return val;
		}
		return val;
	}
	
}
