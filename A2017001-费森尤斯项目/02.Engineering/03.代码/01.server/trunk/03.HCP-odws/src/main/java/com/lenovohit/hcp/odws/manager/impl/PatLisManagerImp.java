package com.lenovohit.hcp.odws.manager.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
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
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.odws.manager.PatLisManager;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PhaLisResult;
import com.lenovohit.hcp.onws.moddel.PhaPatLis;

@Service
@Transactional
public class PatLisManagerImp implements PatLisManager {

	@Autowired
	private GenericManager<PatStore, String> patStoreManager;
	@Autowired
	private GenericManager<PhaPatLis, String> phaPatlisManager;
	@Autowired
	private GenericManager<PhaLisResult, String> phaLisResultManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	

	/**
	 * 非复合项目（物资项目）确认
	 * @param recordList
	 * @param user
	 * @return
	 */
	public PhaPatLis savePatLis(PhaPatLis patLis, HcpUser user){
		Date now = new Date();
		try{
			PatStore storeExec = new PatStore();
			storeExec.setHosId(user.getHosId());				//医院
			storeExec.setPatientId(patLis.getPatient().getId());//病人id
			storeExec.setName(patLis.getPatient().getName());	//姓名
			storeExec.setRecipeId(patLis.getRecipeId());		//处方Id
			storeExec.setRecipeNo(patLis.getRecipeNo());		//处方序号
			if(patLis.getItemInfo()!=null){
				ItemInfo info = patLis.getItemInfo();
				storeExec.setItemCode(info.getId());//项目id
				storeExec.setSpecs(info.getSpecs());			//规格
			}
			storeExec.setCombNo(patLis.getCombNo());
			storeExec.setItemName(patLis.getItemInfo().getItemName());
			storeExec.setUnit(patLis.getUnit());
			storeExec.setUnitPrice(patLis.getItemInfo().getUnitPrice());//单价
			storeExec.setCombNo(patLis.getCombNo());//组号
			storeExec.setExecOper(user.getName());	//操作人信息
			storeExec.setCreateOper(user.getName());
			storeExec.setCreateOperId(user.getId());
			storeExec.setCreateTime(now);
			storeExec.setUpdateOper(user.getName());
			storeExec.setUpdateOperId(user.getId());
			storeExec.setUpdateTime(now);
			storeExec.setState("1");
			storeExec.setQty(new BigDecimal(1));
			patStoreManager.save(storeExec);
			
			if(patLis.getItemInfo()!=null){//化验项目信息
				ItemInfo info = patLis.getItemInfo();
				patLis.setItemName(info.getItemName());
				patLis.setSpecs(info.getSpecs());
				patLis.setUnit(info.getUnit());
			}
			if(patLis.getPatient()!=null){//病人基本信息
				Patient p = patLis.getPatient();
				patLis.setName(p.getName());
			}
			patLis.setId(null);
			patLis.setCreateTime(now);
			patLis.setCreateOperId(user.getId());
			patLis.setCreateOper(user.getName());
			patLis.setUpdateTime(now);
			patLis.setUpdateOper(user.getName());
			patLis.setUpdateOperId(user.getId());
			patLis.setStateFlag("1");
			String exambarcode =redisSequenceManager.get("PHA_PATLIS", "EXAMBARCODE");
			patLis.setExambarcode(exambarcode);
			
			patLis = phaPatlisManager.save(patLis);
		}catch(Exception e){
			new  RuntimeException("添加送检信息失败！");
		}
		return  patLis;
	}


	public Map<String, Object> findLisResult(String exambarcode) {
		Map<String,Object> map = new HashMap<String,Object>();
		Map<String,Object> patient = new HashMap<String,Object>();
		List<PhaPatLis>  patList = phaPatlisManager.findByProp("exambarcode",exambarcode );
		PhaPatLis p = patList.get(0);
		 
		patient.put("name", p.getPatient().getName());
		patient.put("sex", p.getPatient().getSex());
		patient.put("type", p.getSpecimenType());
		patient.put("exambarcode", p.getExambarcode());
		patient.put("regNo", p.getRegNo());
		List<PhaLisResult>  resultList = phaLisResultManager.findByProp("exambarcode",exambarcode );
		map.put("patient", patient);
		map.put("RList", resultList);
		return map;
	}


	@Override
	public void saveResultList(List<Map<String, Object>> mapList) {
		List<PhaLisResult> resultList = new ArrayList<PhaLisResult>();
		List<PhaPatLis> lisList = new ArrayList<PhaPatLis>();
		for(Map<String,Object> map:mapList){
			PhaLisResult result = new PhaLisResult();
			String barcode = (String) map.get("barcode"); 
			if(StringUtils.isNotBlank(barcode)){
				List<PhaPatLis>  patList = phaPatlisManager.findByProp("exambarcode",barcode );
				Date nowDate = new Date();
				if(patList!=null&&patList.size()>0){
					PhaPatLis lis = patList.get(0);
					lis.setStateFlag("2");//结果已返回
					lisList.add(lis);
					result.setHosId(lis.getHosId());
					result.setRegId(lis.getRegId());
					result.setRecipeId(lis.getRecipeId());
					result.setRecipeNo(lis.getRecipeNo());
					result.setPatientId(lis.getPatient().getId());
					
					String shortname = (String) map.get("shortname");  
					if(StringUtils.isNotBlank(shortname)){//规格
						result.setSpecs(shortname);
					}
					String units = (String) map.get("units");  
					if(StringUtils.isNotBlank(units)){//单位
						result.setUnit(units);
					}
					String displowhigh = (String) map.get("displowhigh");
					if(StringUtils.isNotBlank(displowhigh)){//参考值
						result.setDisplowhigh(displowhigh);
					}
					String displowhighF = (String) map.get("displowhighF");
					if(StringUtils.isNotBlank(displowhighF)){//男性参考值
						result.setDisplowhighF(displowhighF);
					}
					String displowhighM = (String) map.get("displowhighM");
					if(StringUtils.isNotBlank(displowhighM)){//女性参考值
						result.setDisplowhighM(displowhighM);
					}
					
					String collectddate = (String) map.get("collectddate");
					if(StringUtils.isNotBlank(barcode)){
						
					}
					String analyte = (String) map.get("analyte");
					if(StringUtils.isNotBlank(analyte)){//测试项目名称
						result.setAnalyte(analyte);
					}
					String submitdate = (String) map.get("submitdate");  
					if(StringUtils.isNotBlank(barcode)){
						
					}
					String testcode = (String) map.get("testcode");    
					if(StringUtils.isNotBlank(testcode)){//检测编号
						result.setItemNo(testcode);
					}
					String apprdate =  (String) map.get("apprdate");    
					if(StringUtils.isNotBlank(apprdate)){
						result.setApprdate(new Date());
						//result.setApprdate(DateUtils.string2Date(apprdate, "yyyy-MM-dd HH:mm:ss"));
					}
					String dept = (String) map.get("dept");        
					if(StringUtils.isNotBlank(dept)){//检测机构
						result.setDept(dept);
					}
					String servgrp = (String) map.get("servgrp");     
					if(StringUtils.isNotBlank(servgrp)){//检测科室
						result.setServgrp(servgrp);
					}
					String usrnam = (String) map.get("usrnam");      
					if(StringUtils.isNotBlank(usrnam)){//检测科室
						result.setUsrnam(usrnam);
					}
					String apprvedby = (String) map.get("apprvedby");   
					if(StringUtils.isNotBlank(apprvedby)){//审核人
						result.setApprvedby(apprvedby);
					}
					String sinonym = (String) map.get("sinonym");     
					if(StringUtils.isNotBlank(sinonym)){//检测项目
						result.setSinonym(sinonym);
					}
					String finalValue = (String) map.get("final");       
					if(StringUtils.isNotBlank(finalValue)){//检测值
						result.setValue(finalValue);
					}
					String s = (String) map.get("s");           
					if(StringUtils.isNotBlank(barcode)){
						
					}
					String sorter = (String) map.get("sorter");      
					if(StringUtils.isNotBlank(barcode)){
						
					}
					
					result.setExambarcode(barcode);
					result.setCreateTime(nowDate);
					result.setUpdateTime(nowDate);
					resultList.add(result);
				}
			}
		}
		if(resultList!=null && resultList.size()>0){
			phaLisResultManager.batchSave(resultList);
			phaPatlisManager.batchSave(lisList);
		}
	}


	/**    
	 * 功能描述：导出送检信息到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	@Override
	public void writeExcel(List<Object> tmpList, OutputStream out) {
		// 输出流
		Date minDate = null;
		Date maxDate = null;
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFCellStyle cellStyle = wb.createCellStyle();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			cellStyle.setFont(font);
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("送检信息");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,8 * 512);
			sheet.setColumnWidth(7,8 * 512);
			sheet.setColumnWidth(11,12 * 512);
			sheet.setColumnWidth(12,8 * 512);
			sheet.setColumnWidth(13,8 * 512);
			sheet.setColumnWidth(15,8 * 512);
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 18));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("送检信息");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("医院条码");
			row1.createCell(1).setCellValue("样本号");
			row1.createCell(2).setCellValue("病人姓名");
			row1.createCell(3).setCellValue("性别");
			row1.createCell(4).setCellValue("年龄");
			row1.createCell(5).setCellValue("样本类型");
			row1.createCell(6).setCellValue("床号");
			row1.createCell(7).setCellValue("采样时间");
			row1.createCell(8).setCellValue("申请医生");
			row1.createCell(9).setCellValue("申请科室");
			row1.createCell(10).setCellValue("临床诊断");
			row1.createCell(11).setCellValue("项目代码");
			row1.createCell(12).setCellValue("项目中文名");
			row1.createCell(13).setCellValue("门诊号");
			row1.createCell(14).setCellValue("compute_0015");
			row1.createCell(15).setCellValue("collectiondate");
			row1.createCell(16).setCellValue("标本个数");
			row1.createCell(17).setCellValue("备注");
			row1.createCell(18).setCellValue("迪安条码");
			//循环将dataList插入表中
			if(tmpList!=null&& tmpList.size()>0){
				for(int i=0;i<tmpList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					Object[] info = (Object[]) tmpList.get(i);
					if(info[0 ]!=null){//医院条码
						row.createCell(0 ).setCellValue(info[0].toString());
					}
					try {
						if(info[1 ]!=null){//样本号
							row.createCell(1 ).setCellValue(i+1);
						} 
						if(info[2 ]!=null){//病人名称
							row.createCell(2 ).setCellValue(info[2].toString());
						} 
						if(info[3 ]!=null){//性别
							row.createCell(3 ).setCellValue("1".equals(info[3].toString()) ? "男" : "女");
						} 
						if(info[4 ]!=null){//年龄
							row.createCell(4 ).setCellValue(getAge(DateUtils.string2Date(info[4 ].toString(), "yyyy-MM-dd")));
						} 
						if(info[6 ]!=null){//样本类型
							row.createCell(5 ).setCellValue(info[6].toString());
						} 
						if(info[6 ]!=null){//床号
							//row.createCell(6 ).setCellValue(info[6].toString());
						} 
						if(info[8 ]!=null){//采样时间
							Date date = (Date)info[8];
							row.createCell(7 ).setCellValue(DateUtils.date2String(date, "yyyy-MM-dd"));
							if(minDate!=null){
								if(date.before(minDate)){//比最小日期小
									minDate = date;
								}
							}else{
								minDate = date;
							}
							if(maxDate!=null){
								if(date.after(minDate)){//比最大日期大
									maxDate = date;
								}
							}else{
								maxDate = date;
							}
						} 
						if(info[9 ]!=null){//申请医生
							row.createCell(8 ).setCellValue(info[9].toString());
						} 
						if(info[10 ]!=null){//申请科室
							row.createCell(9 ).setCellValue(info[10].toString());
						} 
						if(info[11]!=null){//临床诊断
							row.createCell(10).setCellValue(info[11].toString());
						}
						if(info[12]!=null){//项目代码
							row.createCell(11).setCellValue(info[12].toString());
						}
						if(info[13]!=null){//项目中文名
							row.createCell(12).setCellValue(info[13].toString());
						}
						if(info[14]!=null){//门诊号
							row.createCell(13).setCellValue(info[14].toString());
						}
						if(info[14]!=null){//compute_0015
							//row.createCell(14).setCellValue(info[15].toString());
						}
						if(info[15]!=null){//collectiondate
							row.createCell(15).setCellValue(DateUtils.date2String((Date)info[8], "yyyy-MM-dd"));
						}
						if(info[16]!=null){//标本个数
							row.createCell(16).setCellValue(info[16].toString());
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					/*if(info[17]!=null){//备注
						//row.createCell(17).setCellValue(info[17].toString());
					}
					if(info[18]!=null){//迪安条码
						//row.createCell(18).setCellValue(info[18].toString());
					}*/
					String d = DateUtils.date2String(minDate, "yyyy-MM-dd")+"至"+DateUtils.date2String(maxDate, "yyyy-MM-dd")+"采样信息送检";
					cell.setCellValue(d);
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
	
    //由出生日期获得年龄  
    public  int getAge(Date birthDay) throws Exception {  
        Calendar cal = Calendar.getInstance();  
  
        if (cal.before(birthDay)) {  
            throw new IllegalArgumentException(  
                    "The birthDay is before Now.It's unbelievable!");  
        }  
        int yearNow = cal.get(Calendar.YEAR);  
        int monthNow = cal.get(Calendar.MONTH);  
        int dayOfMonthNow = cal.get(Calendar.DAY_OF_MONTH);  
        cal.setTime(birthDay);  
  
        int yearBirth = cal.get(Calendar.YEAR);  
        int monthBirth = cal.get(Calendar.MONTH);  
        int dayOfMonthBirth = cal.get(Calendar.DAY_OF_MONTH);  
  
        int age = yearNow - yearBirth;  
  
        if (monthNow <= monthBirth) {  
            if (monthNow == monthBirth) {  
                if (dayOfMonthNow < dayOfMonthBirth) age--;  
            }else{  
                age--;  
            }  
        }  
        return age;  
    }
}
