package com.lenovohit.hcp.material.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.h2.engine.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.material.manager.MatInfoRestManager;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatPrice;
@Service
@Transactional
public class MatInfoRestManagerImpl implements MatInfoRestManager {
	
	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	@Autowired
	private GenericManager<MatPrice, String> matPriceManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;

	/**
	 * 子医院新增物资价格信息
	 */
	@Override
	public MatInfo createMatInfo(MatInfo matInfo, HcpUser user) {
		// TODO 校验
		MatInfo saved = this.matInfoManager.save(matInfo);
		
		//将价格保存物资价格表
		StringBuilder jql = new StringBuilder("from MatPrice where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		jql.append("and matInfo.id = ? ");
		values.add(saved.getId());
		List<MatPrice> priceList = matPriceManager.find(jql.toString(), values.toArray());
		MatPrice price = null;
		if(priceList!=null && priceList.size()>0){
			price = priceList.get(0);
		}
		this.matPriceManager.save(converTo(matInfo,price,user));
		return saved;
	}
	/**
	 * 当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
	 */
	@Override
	public MatInfo createMatInfoGroup(MatInfo matInfo, HcpUser user) {
		// TODO 校验
		MatInfo saved = this.matInfoManager.save(matInfo);
		
		//将价格保存物资价格表
		StringBuilder jql = new StringBuilder("from MatPrice where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		
		jql.append("and matInfo.id = ? ");
		values.add(saved.getId());
		
		MatPrice price = matPriceManager.findOne(jql.toString(), values.toArray());
		this.matPriceManager.save(converTo(matInfo,price,user));
		//当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
		this.createMatInfoPrice(saved, user);
		return saved;
	}
	
	/**
	 * 
	 * @param matInfo
	 * @return
	 */
	public MatPrice converTo(MatInfo matInfo, MatPrice price ,HcpUser user){
		if(price == null){
			price = new MatPrice();
		}
		price.setMatInfo(matInfo);
		price.setMaterialCode(matInfo.getMaterialCode());
		price.setCenterCode(matInfo.getCenterCode());
		price.setBuyPrice(matInfo.getBuyPrice());
		price.setWholePrice(matInfo.getWholePrice());
		price.setSalePrice(matInfo.getSalePrice());
		price.setTaxBuyPrice(matInfo.getTaxBuyPrice());
		price.setTaxSalePrice(matInfo.getTaxSalePrice());
		price.setStopFlag(matInfo.getStopFlag());
		price.setItemCode(matInfo.getItemCode());
		price.setFeeFlag(matInfo.getFeeFlag());
		price.setHosId(user.getHosId());
	    return price;
	}
	
	/**
	 * 当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
	 * @param matInfo
	 * @param user
	 */
	private void createMatInfoPrice(MatInfo matInfo, HcpUser user){
		Date now = new Date();
		//1、获取集团下所有的下级医院
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId != ? ");
		values.add(user.getHosId());
		List<Hospital> hospitals = hospitalManager.find(jql.toString(), values.toArray());
		//2、对每个下级医院新增相应的药品价格信息
		for(Hospital hos : hospitals){
			MatPrice d = new MatPrice();
			d.setHosId(hos.getHosId());
			d.setMaterialCode(matInfo.getMaterialCode());
			d.setMatInfo(matInfo);
			d.setCenterCode(matInfo.getCenterCode());
			d.setBuyPrice(matInfo.getBuyPrice());
			d.setSalePrice(matInfo.getSalePrice());
			d.setTaxBuyPrice(matInfo.getTaxBuyPrice());
			d.setTaxSalePrice(matInfo.getTaxSalePrice());
			d.setWholePrice(matInfo.getWholePrice());
			d.setStopFlag(matInfo.getStopFlag());
			
			d.setCreateOper(user.getName());
			d.setCreateOperId(user.getId());
			d.setCreateTime(now);
			d.setUpdateOper(user.getName());
			d.setUpdateOperId(user.getId());
			d.setUpdateTime(now);
			matPriceManager.save(d);
		}
		
	}
	@Override
	public void exportInfoToExcel(List<MatInfo> infoList, OutputStream out,HcpUser user) {
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
			XSSFSheet sheet = wb.createSheet("物资基本信息");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,12 * 512);
			sheet.setColumnWidth(2,10 * 512);
			sheet.setColumnWidth(3,12 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,4 * 512);
			sheet.setColumnWidth(7,10 * 512);
			sheet.setColumnWidth(8,12 * 512);
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
			 cell.setCellValue("物资基本信息");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("物资类型");
			row1.createCell(1).setCellValue("物资名称");
			row1.createCell(2).setCellValue("规格");
			row1.createCell(3).setCellValue("生产厂家");
			row1.createCell(4).setCellValue("进价");
			row1.createCell(5).setCellValue("售价");
			row1.createCell(6).setCellValue("是否对应收费项");
			row1.createCell(7).setCellValue("收费项名称");
			row1.createCell(8).setCellValue("注册证");
			Map<String,String> map = convertType(user);
			//循环将dataList插入表中
			if(infoList!=null&& infoList.size()>0){
				for(int i=0;i<infoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					MatInfo info = infoList.get(i);
					if(info.getMaterialType()!=null){
						row.createCell(0).setCellValue(map.get(info.getMaterialType()));
					}
					row.createCell(1).setCellValue(info.getCommonName());
					row.createCell(2).setCellValue(info.getMaterialSpecs());
					DecimalFormat myformat=new DecimalFormat("0.0000");//BigDecimal保留四位小数
					if(info.getCompanyInfo()!=null){
						row.createCell(3).setCellValue(info.getCompanyInfo().getCompanyName());
					}
					if(info.getBuyPrice()!=null){
						row.createCell(4).setCellValue(myformat.format(info.getBuyPrice()));
					}
					if(info.getSalePrice()!=null){
						row.createCell(5).setCellValue(myformat.format(info.getSalePrice()));
					}
					if(info.getFeeFlag()!=null){
						if("1".equals(info.getFeeFlag())){
							row.createCell(6).setCellValue("是");
							row.createCell(7).setCellValue(info.getItemName()!=null ? info.getItemName() : "");
							
						}else{
							row.createCell(6).setCellValue("否");
						}
					}else{
						row.createCell(6).setCellValue("否");
					}
					row.createCell(8).setCellValue(info.getRegisterName()!=null ? info.getRegisterName() : "");
					
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

	private Map<String,String> convertType(HcpUser user){
		Map<String,String> map = new HashMap<String,String>();
		StringBuilder jql = new StringBuilder( "from Dictionary where columnName = 'MATERIAL_TYPE' and hosId = '"+user.getHosId()+"' ");
		List<Dictionary> list = dictionaryManager.find(jql.toString());
		for(Dictionary d:list){
			map.put(d.getColumnKey(), d.getColumnVal());
		}
		return map;
	}
}
