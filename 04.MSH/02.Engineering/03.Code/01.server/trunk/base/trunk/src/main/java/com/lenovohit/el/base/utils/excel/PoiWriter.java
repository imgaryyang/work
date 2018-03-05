package com.lenovohit.el.base.utils.excel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;

public class PoiWriter {

	// 设置合并单元格样式
	@SuppressWarnings("deprecation")
	public  static void setRegionStyle(HSSFSheet targetSheet, Region region, HSSFCellStyle style) {
		int rowFrom = region.getRowFrom();
		int rowTo = region.getRowTo();
		int colFrom = region.getColumnFrom();
		int colTo = region.getColumnTo();
		for (int r = rowFrom; r <= rowTo; r++) {
			HSSFRow row = targetSheet.getRow(r);
			if (row != null) {
				for (int c = colFrom; c <= colTo; c++) {
					HSSFCell cell = row.getCell((short)c);
					if (cell == null) {
						cell = row.createCell((short)c);
					}
					cell.getCellStyle().setBorderLeft(style.getBorderLeft());
					cell.getCellStyle().setBorderRight(style.getBorderRight());
					cell.getCellStyle().setBorderTop(style.getBorderTop());
					cell.getCellStyle().setBorderBottom(style.getBorderBottom());
				}
			}
		}
	}
	// 设置边框
	public  static HSSFCellStyle setBorder(HSSFCellStyle cellStyle) {
		
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		return cellStyle;
	}
    //获得标题样式
	public  static HSSFCellStyle getTitleStyle(HSSFWorkbook wb){
		
		HSSFFont titlefont = wb.createFont();
		titlefont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		titlefont.setFontHeight((short) (300));
		HSSFCellStyle style = wb.createCellStyle(); // 样式对象
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平
		style.setFont(titlefont);
		setBorder(style);
		return style;
	}
	//获得内容样式
	public  static HSSFCellStyle getContentStyle(HSSFWorkbook wb){
		
		HSSFCellStyle style = wb.createCellStyle(); // 样式对象
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直
		setBorder(style);
		return style;
	}
	public static String toUtf8String(String s) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			//判断是否为中文字,是中文字就进行转码
			if (c >= 0 && c <= 255) {
				sb.append(c);
			} else {
				byte[] b;
				try {
					b = Character.toString(c).getBytes("utf-8");
				} catch (Exception ex) {
					System.out.println(ex);
					b = new byte[0];
				}
				for (int j = 0; j < b.length; j++) {
					int k = b[j];
					if (k < 0)
						k += 256;
					sb.append("%" + Integer.toHexString(k).toUpperCase());
				}
			}
		}
		return sb.toString();
	}
	
}
