package com.lenovohit.hcp.finance.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

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
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;

/**    
 *         
 * 类描述：   门诊收费统计
 *@author GW
 *@date 2017年4月10日          
 *     
 */
@RestController
@RequestMapping("/hcp/payment/chargeStatis")
public class chargeStatisRestController extends HcpBaseRestController {
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	/**    
	 * 功能描述：门诊收费-开单医生按会计科目统计
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/statisByDeptAndDoc", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByDeptAndDoc(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null && json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("SELECT DISTINCT oc.FEE_CODE,	item.COLUMN_VAL"
				+ " FROM	oc_chargedetail oc"
				+ " LEFT JOIN b_dicvalue item ON item.COLUMN_KEY = oc.FEE_CODE"
				+ " WHERE	item.COLUMN_NAME = 'FEE_CODE'");

		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and oc.CHARGE_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sql.append(" and oc.RECIPE_DEPT = ? ");
			values.add(json.get("deptId"));
		}
		
		List<Object> feeInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sql.toString(), values.toArray());
		List<Map<String,String>> titleMap = new ArrayList<Map<String,String>>();
		Map<String,String> deptClumn = new HashMap<String,String>();
		deptClumn.put("title", "开单科室");
		deptClumn.put("dataIndex", "deptName");
		titleMap.add(deptClumn);
		Map<String,String> nameMap = new HashMap<String,String>();
		nameMap.put("title", "开单医生");
		nameMap.put("dataIndex", "doc");
		titleMap.add(nameMap);
		
		if(feeInfoList!=null && feeInfoList.size()>0){
			//循环设置表头（Map<feeCode,columnVal>）
			for(int i=0;i<feeInfoList.size();i++){
				Map<String,String> map = new HashMap<String,String>();
				Object[] obj = (Object[]) feeInfoList.get(i);
				if(obj[0]!=null){
					map.put("title", obj[1].toString());
					map.put("dataIndex",obj[0].toString());
				}
				titleMap.add(map);
			}
		}
		
		//收费明细数据组装成按科室和人员收费明细显示
		StringBuilder sumSql = new StringBuilder("SELECT a.RECIPE_DEPT , a.RECIPE_DOC , a.FEE_CODE ,   sum(a.TOT_COST) totCost,b.name,d.DEPT_NAME "
				+ " FROM oc_chargedetail a "
				+ " LEFT JOIN B_DEPTINFO d "
				+ " ON d.ID = a.RECIPE_DEPT "
				+ " LEFT JOIN hcp_user b "
				+ " ON a.RECIPE_DOC = b.id where 1=1 ");
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sumSql.append(" and a.CHARGE_TIME between ? and  ? ");
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sumSql.append(" and a.RECIPE_DEPT = ? ");
		}
		sumSql.append(" GROUP BY a.RECIPE_DEPT,a.RECIPE_DOC, a.FEE_CODE,b.NAME,d.DEPT_NAME");

		List<Object> detailInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sumSql.toString(), values.toArray());
		Map<String,Map<String,Map<String,Object>>> deptMap = new HashMap<String,Map<String,Map<String,Object>>>();
		if(detailInfoList!=null&&detailInfoList.size()>0){
			for(int i=0;i<detailInfoList.size();i++){
				Object[] object = (Object[]) detailInfoList.get(i);
				//科室下医生Map
				Map<String,Map<String,Object>> userMap = null;
				//医生详细信息
				Map<String,Object> userInfo = null;
				if(object[0]!=null){
					userMap = deptMap.get(object[0]);
				}else{
					userMap = deptMap.get("empty");
				}
				if(userMap!=null){//该科室下已经有医生
					if(object[1]!=null){
						userInfo= userMap.get(object[1].toString());
					}else{
						userInfo=userMap.get("empty");
					}
					if(userInfo!=null){//该医生存在信息
						userInfo.put(object[2].toString(), object[3]);
					} else {//该医生不存在信息
						userInfo = new HashMap<String,Object>();
						userInfo.put("deptId", object[0]);		//科室
						userInfo.put("deptName", object[5]);	//科室名称
						userInfo.put("doc", object[4]);			//开单医生名称
						userInfo.put(object[2].toString(), object[3]);
						if(object[1]!=null){//姓名是否存在
							userMap.put(object[1].toString(), userInfo);
						}else{
							userMap.put("empty", userInfo);
						}
						if(object[0]!=null){//科室不存在
							deptMap.put(object[0].toString(), userMap);
						}else{
							deptMap.put("empty", userMap);
						}
					}
				}else{//该科室下暂时不存在医生
					userInfo = new HashMap<String,Object>();
					userMap = new HashMap<String, Map<String,Object>>();
					userInfo.put("deptId", object[0]);
					userInfo.put("deptName", object[5]);
					userInfo.put("doc", object[4]);
					userInfo.put(object[2].toString(), object[3]);
					if(object[1]!=null){//姓名是否存在
						userMap.put(object[1].toString(), userInfo);
					}else{
						userMap.put("empty", userInfo);
					}
					if(object[0]!=null){//科室不存在
						deptMap.put(object[0].toString(), userMap);
					}else{
						deptMap.put("empty", userMap);
					}
				
				}
			}
		}
		//循环将数据放到数组总
		Map<Object,Integer> rowMap = new HashMap<Object,Integer>();
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
		int point = 0;
	  for (Map.Entry<String,Map<String,Map<String,Object>>> entry : deptMap.entrySet()) {
		  if(entry.getValue()!=null){
			  for (Map.Entry<String, Map<String, Object>> model : entry.getValue().entrySet()) {
				  mapList.add(model.getValue());
			  }
		  }
		  if(mapList!=null && mapList.size()>0){
			  int size = mapList.size();
			  rowMap.put(point, size-point);
			  point = size;
		  }
	  }
	  rowMap.put("size", mapList.size());
	  Map<String,Object> resultMap = new HashMap<String,Object>();
	  resultMap.put("title", titleMap);//表格列头
	  resultMap.put("dataList", mapList);//数据集
	  resultMap.put("rowMap", rowMap);	//和并列数据
	return ResultUtils.renderPageResult(resultMap);
	}
	/**    
	 * 功能描述：
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月27日             
	*/
	@RequestMapping(value = "/exportStatisByDeptAndDoc", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportStatisByDeptAndDoc(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Result  result = this.statisByDeptAndDoc(data);
		Map<String,Object> resultMap = (Map<String, Object>) result.getResult();
		//标题头
		List<Map<String,String>> titleMap = (List<Map<String, String>>) resultMap.get("title");
		//数据list
		List<Map<String,Object>> dataList = (List<Map<String, Object>>) resultMap.get("dataList");
		//对应行号
		Map<Object,Integer> rowMap = (Map<Object, Integer>) resultMap.get("rowMap");
		int titleSize = titleMap.size();
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_门诊收费统计";
		OutputStream out = null;
		try {
			out= response.getOutputStream();
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
			response.setCharacterEncoding("UTF-8");
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("门诊收费-开单医生按会计科目统计");
			sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			for(int i=2;i<titleMap.size();i++){
				sheet.setColumnWidth(i,8 * 512);
			}
			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, titleSize-1));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("门诊收费-开单医生按会计科目统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			for(int i=0;i<titleMap.size();i++){
				Map<String,String> map = titleMap.get(i);
				row1.createCell(i).setCellValue(map.get("title"));
			}
			//循环将dataList插入表中
			for(int i=0;i<dataList.size();i++){
				XSSFRow row = sheet.createRow(i+2);
				if(rowMap.get(i)!=null && rowMap.get(i)!=1){
					sheet.addMergedRegion(new CellRangeAddress(i+2, rowMap.get(i)+i+1, 0, 0));
				}
				for(int j=0;j<titleMap.size();j++){//从单条数据中取出列表头中所具有的属性写入表格
					if(titleMap.get(j).get("dataIndex")!=null && dataList.get(i).get(titleMap.get(j).get("dataIndex"))!=null){
						row.createCell(j).setCellValue(dataList.get(i).get(titleMap.get(j).get("dataIndex")).toString());
					}else {
						if(j>1){
							row.createCell(j).setCellValue("0.0000");
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
}
