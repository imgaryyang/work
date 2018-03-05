package com.lenovohit.hcp.material.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.transaction.annotation.Transactional;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MatOutStockCheckManger;
import com.lenovohit.hcp.material.manager.MatStoreManager;
import com.lenovohit.hcp.material.model.MatApplyIn;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;

@Service
@Transactional
public class MatOutStockCheckManagerImpl implements MatOutStockCheckManger {
	
	@Autowired
	private GenericManager<MatApplyIn, String> matApplyInManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private MatStoreManager matStoreManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	

	@Override
	public void matOutCheck(String appBill, String comm, HcpUser hcpUser) {
		List<MatApplyIn> appList=LoadApplyInListByAppBill(appBill);
		List<MatOutputInfo> outStockList= MakeOutStockList(comm, hcpUser, appList);
		try {
			matStoreManager.matOutput(outStockList, hcpUser);
			updateAppInDetail(appBill, comm, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}

	//更新MATERIAL_APPLYIN相关字段
	private void updateAppInDetail(String appBill,String comm,HcpUser hcpUser){
		StringBuilder jql = new StringBuilder( " update MATERIAL_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		values.add(hcpUser.getName());
		Date date=new Date();
		values.add(date);
		values.add("3");
		
		if(StringUtils.isNotEmpty(comm)){
			values.add(comm);	
		}else{
			values.add(null);	
		}
		
		jql.append(" And HOS_ID = ?");
		values.add(hcpUser.getHosId());
		jql.append(" And FROM_DEPT_ID = ?");
		values.add(hcpUser.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(appBill)){
			jql.append(" And APP_BILL = ?");
			values.add(appBill);
			
		}
		try {
			matApplyInManager.executeSql(jql.toString(), values.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}
	
	
	//构造出库outStockList
	private List<MatOutputInfo> MakeOutStockList(String comm, HcpUser hcpUser, List<MatApplyIn> appList) {
		List<MatOutputInfo> outStockList = new ArrayList<MatOutputInfo>(); 
		int i=0;
		for (MatApplyIn phaApplyIn : appList) {
			i++;
			MatOutputInfo outputInfo =new MatOutputInfo();
			outputInfo.setHosId(phaApplyIn.getHosId());
			outputInfo.setAppBill(phaApplyIn.getAppBill());
			
			String outBill = redisSequenceManager.get("MATERIAL_OUTPUTINFO", "OUT_BILL");//获取出库单号
			if(StringUtils.isNotEmpty(outBill)){
				outputInfo.setOutBill(outBill);
			}
			
			Department deptInfo=new Department();
			deptInfo.setId(hcpUser.getLoginDepartment().getId());
			outputInfo.setDeptInfo(deptInfo);
			
			Department toDept=new Department();
			toDept.setId(phaApplyIn.getDeptId());
			outputInfo.setToDept(toDept);
			
			outputInfo.setOutType("O6");
			outputInfo.setBillNo(i);
			
			MatInfo matInfo=new MatInfo();
			if(StringUtils.isNotBlank(phaApplyIn.getMatInfo())&& StringUtils.isNotBlank(phaApplyIn.getMatInfo().getId())){
				matInfo.setId(phaApplyIn.getMatInfo().getId());
			}
			outputInfo.setMatInfo(matInfo);
			
			outputInfo.setBatchNo(phaApplyIn.getBatchNo());
			outputInfo.setApprovalNo(phaApplyIn.getApprovalNo());
			
			Company companyInfo=new Company();
			companyInfo.setId(phaApplyIn.getCompany());
			outputInfo.setCompanyInfo(companyInfo);
			
			Company producerInfo=new Company();
			producerInfo.setId(phaApplyIn.getProducer());
			outputInfo.setProducerInfo(producerInfo);
			
			outputInfo.setProduceDate(phaApplyIn.getProduceDate());
			outputInfo.setValidDate(phaApplyIn.getValidDate());
			outputInfo.setBuyPrice(phaApplyIn.getBuyPrice());
			outputInfo.setSalePrice(phaApplyIn.getSalePrice());
			outputInfo.setOutSum(phaApplyIn.getAppNum());
			outputInfo.setOutputState("5");
			outputInfo.setComm(comm);
			
			outStockList.add(outputInfo);
		}
		return outStockList;
	}

    //获取请领单明细
	private List<MatApplyIn> LoadApplyInListByAppBill(String appBill) {
		StringBuilder jql =new StringBuilder();
		List<Object> values=new ArrayList<Object>();
		jql.append(" from MatApplyIn where appBill = ? ");
		if(!StringUtils.isEmpty(appBill)){
			values.add(appBill);
			List<MatApplyIn> appList= matApplyInManager.find(jql.toString(), values.toArray());
			return appList;
		}else{
			throw new RuntimeException("请领单号appBill不能为空！");
		}
	}

	/**    
	 * 功能描述：请领单导出
	 *@param infoList
	 *@param out       
	 *@author GW
	 *@date 2017年7月5日             
	*/
	public void exportDetailToExcel(List<MatApplyIn> infoList, OutputStream out) {
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
			XSSFSheet sheet = wb.createSheet("请领单明细");
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
			cell.setCellValue("请领单明细");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("物资分类");
			row1.createCell(1).setCellValue("物资名称");
			row1.createCell(2).setCellValue("编号");
			row1.createCell(3).setCellValue("规格");
			row1.createCell(4).setCellValue("批次");
			row1.createCell(5).setCellValue("批号");
			row1.createCell(6).setCellValue("进价");
			row1.createCell(7).setCellValue("售价");
			row1.createCell(8).setCellValue("有效期");
			row1.createCell(9).setCellValue("请领数量");
			row1.createCell(10).setCellValue("审批数量");
			row1.createCell(11).setCellValue("请领状态");
			Map<String,String> dicMapType = findDicByColumnNameAndKey("MATERIAL_TYPE");
			Map<String,String> dicMapState = findDicByColumnNameAndKey("INPUT_STATE");
			//循环将dataList插入表中
			if(infoList!=null&& infoList.size()>0){
				for(int i=0;i<infoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					MatApplyIn info = infoList.get(i);
					if(info.getMaterialType()!=null){
						if(dicMapType.get(info.getMaterialType())!=null){
							row.createCell(0).setCellValue(dicMapType.get(info.getMaterialType()));
						}
					}
					row.createCell(1).setCellValue(info.getTradeName());
					row.createCell(2).setCellValue(info.getMaterialCode());
					row.createCell(3).setCellValue(info.getMaterialSpec());
					row.createCell(4).setCellValue(info.getBatchNo());
					row.createCell(5).setCellValue(info.getApprovalNo());
					row.createCell(8).setCellValue(DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"));
					BigDecimal appNum = info.getAppNum();//请领数量
					BigDecimal checkNum = info.getCheckNum();//请领数量
					DecimalFormat myformat4=new DecimalFormat("0.00");//BigDecimal保留两位小数
					BigDecimal buyPrice = info.getBuyPrice(); //进价
					BigDecimal salePrice = info.getSalePrice(); //售价
					
					if(buyPrice!=null){
						row.createCell(6).setCellValue(myformat4.format(buyPrice));
					}else{
						row.createCell(6).setCellValue("0.00");
					}
					if(salePrice!=null){
						row.createCell(7).setCellValue(myformat4.format(salePrice));
					}else{
						row.createCell(7).setCellValue("0.00");
					}
					if(appNum != null && appNum.compareTo(BigDecimal.ZERO) == 1){//请领数量存在并且初始数量大于0
						if(!StringUtils.isEmpty(info.getAppUnit())){
							row.createCell(9).setCellValue(appNum.toString()+info.getAppUnit());
						}else{
							row.createCell(9).setCellValue(appNum.toString());
						}
					}else{
						row.createCell(9).setCellValue(0);
					}
					if(checkNum != null && checkNum.compareTo(BigDecimal.ZERO) == 1){//审批数量存在并且初始数量大于0
						if(!StringUtils.isEmpty(info.getAppUnit())){
							row.createCell(10).setCellValue(checkNum.toString()+info.getAppUnit());
						}else{
							row.createCell(10).setCellValue(checkNum.toString());
						}
					}else{
						row.createCell(10).setCellValue(0);
					}
					if(info.getAppState()!=null){//请领状态
						if(dicMapState.get(info.getAppState())!=null){
							row.createCell(11).setCellValue(dicMapState.get(info.getAppState()));
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
