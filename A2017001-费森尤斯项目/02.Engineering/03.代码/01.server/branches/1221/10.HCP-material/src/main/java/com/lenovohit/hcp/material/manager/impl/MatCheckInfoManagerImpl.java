package com.lenovohit.hcp.material.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MatCheckinfoManager;
import com.lenovohit.hcp.material.model.MatCheckInfo;
import com.lenovohit.hcp.material.model.MatStoreInfo;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;

@Service
@Transactional
public class MatCheckInfoManagerImpl implements MatCheckinfoManager {

	@Autowired
	private GenericManager<MatCheckInfo, String> matCheckInfoManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	
	@Override
	public void updateStockInfo(List<MatCheckInfo> checkList, HcpUser user) {
		//更新数据为盘清
		matCheckInfoManager.batchSave(checkList);
		//更新库存表
		updateStoreInfo(user,checkList);
		updateStoreSumInfo(checkList);
	}

	/**    
	 * 功能描述：盘点结束后更新库存表
	 *@param deptId
	 *@param hosId
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月12日             
	*/
	private void updateStoreInfo(HcpUser user, List<MatCheckInfo> checkList) {
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<MatStoreInfo> storeList = new ArrayList<MatStoreInfo>();  
		if(checkList!=null && checkList.size()>0){
			for(MatCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && 0!= check.getProfitFlag()){
					String storeId = check.getStoreId();		//库存id
					String storeMaterialId = check.getMaterialInfo().getId();	//物资id
					String batchNo = check.getBatchNo();		//批次
					String appNo = check.getApprovalNo();		//批号
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from MatStoreInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ? ");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(storeId)){
						jql.append(" and storeId = ?");
						values.add(storeId);
					}
					if(!StringUtils.isEmpty(storeMaterialId)){
						jql.append(" and materialInfo.id = ?");
						values.add(storeMaterialId);
					}
					
					if(!StringUtils.isEmpty(batchNo)){
						jql.append(" and batchNo = ? ");
						values.add(batchNo);
					}
					if(!StringUtils.isEmpty(appNo)){
						jql.append(" and approvalNo = ? ");
						values.add(appNo);
					}
					MatStoreInfo storeInfo = matStoreInfoManager.findOne(jql.toString(), values.toArray());
					if(storeInfo!=null){
						storeInfo.setStoreSum(check.getWriteSum());
						if(check.getMaterialInfo().getBuyPrice()!=null && check.getMaterialInfo().getSalePrice()!=null){
							storeInfo.setSaleCost(check.getWriteSum().multiply(check.getMaterialInfo().getSalePrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
							storeInfo.setBuyCost(check.getWriteSum().multiply(check.getMaterialInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
						} else {
							throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
						}
						storeList.add(storeInfo);
					}
					
				}
			}
			matStoreInfoManager.batchSave(storeList);
		}
	}

	/**    
	 * 功能描述：更新库存汇总信息
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月15日             
	*/
	private void updateStoreSumInfo(List<MatCheckInfo> checkList) {
		if(checkList!=null && checkList.size()>0){
			//更新汇总信息列表
			List<MatStoreSumInfo> storeSumList = new ArrayList<MatStoreSumInfo>();
			for(MatCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && 0!=check.getProfitFlag()){
					String storeMatId = check.getMaterialInfo().getId();	//物资id
					String deptId = check.getDeptId();					//科室（库房）
					String hosId = check.getHosId();					//医院ID
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from MatStoreSumInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ? ");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(storeMatId)){
						jql.append(" and materialInfo.id = ?");
						values.add(storeMatId);
					}
					
					MatStoreSumInfo storeSumInfo = matStoreSumInfoManager.findOne(jql.toString(), values.toArray());
					if(storeSumInfo!=null){//汇总表中存在该项信息
						//查询条件列表
						List<Object> storeValues = new ArrayList<Object>();
						StringBuilder jqlInfo = new StringBuilder( " from MatStoreInfo where stop = '1' ");
						if(!StringUtils.isEmpty(deptId)){
							jqlInfo.append(" and deptId = ?");
							storeValues.add(deptId);
						}
						if(!StringUtils.isEmpty(hosId)){
							jqlInfo.append(" and hosId = ? ");
							storeValues.add(hosId);
						}
						if(!StringUtils.isEmpty(storeMatId)){
							jqlInfo.append(" and materialInfo.id = ?");
							storeValues.add(storeMatId);
						}
						List<MatStoreInfo> storeInfoList = matStoreInfoManager.find(jqlInfo.toString(), storeValues.toArray());
						if(storeInfoList!=null && storeInfoList.size()>0){//库存中存在此种物资
							BigDecimal storeSum = new BigDecimal(0);
							for(MatStoreInfo store:storeInfoList){
								if(store.getStoreSum()!=null){//库存明细中存在
									storeSum = storeSum.add(store.getStoreSum());
								}
							}
							storeSumInfo.setStoreSum(storeSum);
							if(check.getMaterialInfo().getBuyPrice()!=null && check.getMaterialInfo().getSalePrice()!=null){
								storeSumInfo.setSaleCost(check.getWriteSum().multiply(check.getMaterialInfo().getSalePrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
								storeSumInfo.setBuyCost(check.getWriteSum().multiply(check.getMaterialInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
							} else {
								throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
							}
							storeSumList.add(storeSumInfo);
						}
					}
				}
			}
			matStoreSumInfoManager.batchSave(storeSumList);
		}
	}
	
	/**    
	 * 功能描述：根据盘点单信息导出到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	public void exportDetailToExcel(List<MatCheckInfo> inputInfoList,OutputStream out) {
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
			XSSFSheet sheet = wb.createSheet("物资盘点明细");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,12 * 512);
			sheet.setColumnWidth(2,10 * 512);
			sheet.setColumnWidth(3,10 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,10 * 512);
			sheet.setColumnWidth(8,6 * 512);
			sheet.setColumnWidth(9,8 * 512);
			sheet.setColumnWidth(10,6 * 512);
			sheet.setColumnWidth(11,6 * 512);
			
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
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 11));//合并单元格（开始行，结束行，开始列，结束列）
			cell.setCellStyle(style);
			cell.setCellValue("盘点单明细");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("物资分类");
			row1.createCell(1).setCellValue("物资名称");
			row1.createCell(2).setCellValue("编号");
			row1.createCell(3).setCellValue("规格");
			row1.createCell(4).setCellValue("批次");
			row1.createCell(5).setCellValue("批号");
			row1.createCell(6).setCellValue("物资位置");
			row1.createCell(7).setCellValue("有效期");
			row1.createCell(8).setCellValue("原始数量");
			row1.createCell(9).setCellValue("盘点数量");
			row1.createCell(10).setCellValue("结存数量");
			row1.createCell(11).setCellValue("盘点状态");
			
			Map<String,String> dicMapType = findDicByColumnNameAndKey("MATERIAL_TYPE");
			Map<String,String> dicMapState = findDicByColumnNameAndKey("CHECK_STATE");
			//循环将dataList插入表中
			if(inputInfoList!=null&& inputInfoList.size()>0){
				for(int i=0;i<inputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					MatCheckInfo info = inputInfoList.get(i);
					if(info.getMaterialType()!=null){
						if(dicMapType.get(info.getMaterialType())!=null){
							row.createCell(0).setCellValue(dicMapType.get(info.getMaterialType()));
						}
					}
					row.createCell(1).setCellValue(info.getTradeName());
					row.createCell(2).setCellValue(info.getMaterialCode());
					row.createCell(3).setCellValue(info.getMaterialSpecs());
					row.createCell(4).setCellValue(info.getBatchNo());
					row.createCell(5).setCellValue(info.getApprovalNo());
					row.createCell(6).setCellValue(info.getLocation());
					row.createCell(7).setCellValue(DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"));
					BigDecimal startSum = info.getStartSum();//初始数量
					BigDecimal wirteSum = info.getWriteSum();//盘点数量
					BigDecimal endSum = info.getEndSum();//结存数量
					DecimalFormat myformat0=new DecimalFormat("0");//BigDecimal保留整数部分
					if(info.getMaterialInfo()!=null &&startSum != null && startSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						if(!StringUtils.isEmpty(info.getMaterialInfo().getMaterialUnit())){
							row.createCell(8).setCellValue(startSum.toString()+info.getMaterialInfo().getMaterialUnit());
						}else{
							row.createCell(8).setCellValue(startSum.toString());
						}
					}else{
						row.createCell(8).setCellValue(0);
					}
					if(info.getMaterialInfo()!=null	&&wirteSum != null && wirteSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						if(!StringUtils.isEmpty(info.getMaterialInfo().getMaterialUnit()) && !StringUtils.isEmpty(info.getMaterialInfo().getMaterialUnit())){
							row.createCell(9).setCellValue(wirteSum.toString()+info.getMaterialInfo().getMaterialUnit());
						}else{
							row.createCell(9).setCellValue(wirteSum.toString());
						}
					}else{
						row.createCell(9).setCellValue(0);
					}
					if(info.getMaterialInfo()!=null &&endSum != null && endSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						if(!StringUtils.isEmpty(info.getMaterialInfo().getMaterialUnit())){
							row.createCell(10).setCellValue(endSum.toString()+info.getMaterialInfo().getMaterialUnit());
						}else{
							row.createCell(10).setCellValue(endSum.toString());
						}
					}else{
						row.createCell(10).setCellValue(0);
					}
					if(info.getCheckState()!=null){//盘点状态
						if(dicMapState.get(info.getCheckState())!=null){
							row.createCell(11).setCellValue(dicMapState.get(info.getCheckState()));
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
	}
	
	/**    
	 * 功能描述：根据columnNamea查询出字典表对应的map
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	public Map<String,String> findDicByColumnNameAndKey(String columnName) {
		Map<String,String> map = new HashMap<String,String>();
		if(!StringUtils.isEmpty(columnName)){
			StringBuilder idSql = new StringBuilder();
			List<String> values = new ArrayList<String>();
			idSql.append("SELECT dict from Dictionary dict WHERE columnName = ?  and stop = true ");
			values.add(columnName);
			List<Dictionary> modelList = dictionaryManager.find(idSql.toString(), values.toArray());
			if(modelList!=null && modelList.size()>0){
				for(Dictionary dic:modelList){//循环封装成map
					map.put(dic.getColumnKey(), dic.getColumnVal());
				}
			}
		}
		return map;
	}
}
