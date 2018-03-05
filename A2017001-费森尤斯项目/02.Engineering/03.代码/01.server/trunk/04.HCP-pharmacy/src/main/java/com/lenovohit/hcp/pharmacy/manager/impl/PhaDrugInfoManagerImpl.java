package com.lenovohit.hcp.pharmacy.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

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
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugInfoManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPrice;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;

@Service
@Transactional
public class PhaDrugInfoManagerImpl implements PhaDrugInfoManager {

	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<PhaDrugPrice, String> phaDrugPriceManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	
	//子医院新增药品基本信息
	@Override
	public PhaDrugInfo createDrugPrice(PhaDrugPrice price, PhaDrugInfo phaDrugInfo, HcpUser hcpUser) {
		PhaDrugInfo drugInfo = phaDrugInfoManager.save(phaDrugInfo);
		price.setDrugInfo(drugInfo);
		price.setDrugCode(drugInfo.getDrugCode());
		price.setHosId(hcpUser.getHosId());
		this.phaDrugPriceManager.save(price);
		return drugInfo;
	}
	
	//集团新增药品基本信息
	@Override
	public PhaDrugInfo createDrugPriceGroup(PhaDrugPrice price, PhaDrugInfo phaDrugInfo, HcpUser hcpUser) {
		PhaDrugInfo drugInfo = phaDrugInfoManager.save(phaDrugInfo);
		price.setDrugInfo(drugInfo);
		price.setDrugCode(drugInfo.getDrugCode());
		price.setHosId(hcpUser.getHosId());
		this.phaDrugPriceManager.save(price);
		//当集团新建药品基本信息时，对各个下级医院也新增相应的信息
		this.createPhaDrugPrice(drugInfo, hcpUser);
		return drugInfo;
	}
	/**
	 * 当集团新建药品基本信息时，对各个下级医院也新增相应的药品价格信息
	 * @param drugInfo
	 * @param user
	 * @return
	 */
	private void createPhaDrugPrice(PhaDrugInfo drugInfo,HcpUser user){
		Date now = new Date();
		//1、获取集团下所有的下级医院
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId != ? ");
		values.add(user.getHosId());
		List<Hospital> hospitals = hospitalManager.find(jql.toString(), values.toArray());
		//2、对每个下级医院新增相应的药品价格信息
		for(Hospital hos : hospitals){
			PhaDrugPrice d = new PhaDrugPrice();
			d.setHosId(hos.getHosId());
			d.setDrugCode(drugInfo.getDrugCode());
			d.setDrugInfo(drugInfo);
			d.setCenterCode(drugInfo.getCenterCode());
			d.setBuyPrice(drugInfo.getBuyPrice());
			d.setSalePrice(drugInfo.getSalePrice());
			d.setTaxBuyPrice(drugInfo.getTaxBuyPrice());
			d.setTaxSalePrice(drugInfo.getTaxSalePrice());
			d.setWholePrice(drugInfo.getWholePrice());
			d.setStopFlag(drugInfo.getStopFlag());
			
			d.setCreateOper(user.getName());
			d.setCreateOperId(user.getId());
			d.setCreateTime(now);
			d.setUpdateOper(user.getName());
			d.setUpdateOperId(user.getId());
			d.setUpdateTime(now);
			phaDrugPriceManager.save(d);
		}
	}

	@Override
	public void exportInfoToExcel(List<PhaDrugPriceView> infoList, OutputStream out) {
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
			XSSFSheet sheet = wb.createSheet("药品基本信息");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,10 * 512);
			sheet.setColumnWidth(2,10 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,18 * 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,6 * 512);
			sheet.setColumnWidth(8,6 * 512);
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("药品基本信息");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("通用名称");
			row1.createCell(1).setCellValue("商品名称");
			row1.createCell(2).setCellValue("规格");
			row1.createCell(3).setCellValue("国药准字");
			row1.createCell(4).setCellValue("药品分类");
			row1.createCell(5).setCellValue("生产厂商");
			row1.createCell(6).setCellValue("进价");
			row1.createCell(7).setCellValue("售价");
			row1.createCell(8).setCellValue("是否处方药");
			//循环将dataList插入表中
			if(infoList!=null&& infoList.size()>0){
				for(int i=0;i<infoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					PhaDrugPriceView info = infoList.get(i);
					row.createCell(0).setCellValue(info.getCommonName());
					row.createCell(1).setCellValue(info.getTradeName());
					row.createCell(2).setCellValue(info.getDrugSpecs());
					if(info.getApprovedId()!=null){
						row.createCell(3).setCellValue(info.getApprovedId());
					}
					if(info.getDrugType()!=null){
						String drugType = info.getDrugType();
						if(drugType.equals("001")){
							row.createCell(4).setCellValue("西药");
						}else if(drugType.equals("002")){
							row.createCell(4).setCellValue("中成药");
						}else{
							row.createCell(4).setCellValue("中草药");
						}
					}
					row.createCell(5).setCellValue(info.getCompanyInfo().getCompanyName());
					DecimalFormat myformat=new DecimalFormat("0.0000");//BigDecimal保留四位小数
					
					if(info.getBuyPrice()!=null){
						row.createCell(6).setCellValue(myformat.format(info.getBuyPrice()));
					}
					if(info.getSalePrice()!=null){
						row.createCell(7).setCellValue(myformat.format(info.getSalePrice()));
					}
					if(info.getIsrecipe()){
						row.createCell(8).setCellValue("是");
					}else{
						row.createCell(8).setCellValue("否");
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
	
}
