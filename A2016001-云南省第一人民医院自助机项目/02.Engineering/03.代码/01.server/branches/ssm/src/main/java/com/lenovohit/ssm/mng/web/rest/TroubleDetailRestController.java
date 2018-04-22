package com.lenovohit.ssm.mng.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.User;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.mng.model.Trouble;
import com.lenovohit.ssm.mng.model.TroubleDetail;

@Controller
@RequestMapping("/ssm/troubleDetail")
public class TroubleDetailRestController  extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<TroubleDetail, String> troubleDetailManager;
	@Autowired
	private GenericManagerImpl<Trouble, String> troubleManager;
	@Autowired
	private GenericManagerImpl<Machine, String> machineManager;
	
	@RequestMapping(value="/demo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result demo(){
		List<TroubleDetail> troubleDetails = this.troubleDetailManager.find(" from TroubleDetail ");
		return ResultUtils.renderSuccessResult(troubleDetails);
	}
	
	/**
	 * 出库信息保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateMaterial(@RequestBody String data){
		TroubleDetail troubleDetail = JSONUtils.deserialize(data, TroubleDetail.class);
		
		User user = this.getCurrentUser();
		troubleDetail.setOperator(user.getName());
		Date now =  new Date();
		String createTime = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		String createDay = DateUtils.date2String(now, "yyyy-MM-dd");
		troubleDetail.setCreateTime(createTime);
		troubleDetail.setCreateDay(createDay);
		troubleDetail.setAccount(1);
		TroubleDetail saved = this.troubleDetailManager.save(troubleDetail);
		
		String id = troubleDetail.getTrouble().getId();
		Trouble trouble = troubleManager.get(id);
		troubleManager.save(trouble);
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 修改出库信息
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		TroubleDetail model =  JSONUtils.deserialize(data, TroubleDetail.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		User user = this.getCurrentUser();
		model.setOperator(user.getName());
		Date now =  new Date();
		String createTime = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		String createDay = DateUtils.date2String(now, "yyyy-MM-dd");
		model.setCreateTime(createTime);
		model.setCreateDay(createDay);
		
		TroubleDetail troubleDetail = this.troubleDetailManager.get(model.getId());
		Trouble trouble = troubleDetail.getTrouble();
		model.setTrouble(trouble);
		
		this.troubleDetailManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 删除出库信息
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@RequestBody String data) {
		TroubleDetail model =  JSONUtils.deserialize(data, TroubleDetail.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		
		this.troubleDetailManager.delete(model);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		TroubleDetail query =  JSONUtils.deserialize(data, TroubleDetail.class);
		List<Object> values = new ArrayList<Object>();
		Page page = new Page();
		StringBuilder jql = new StringBuilder( " from TroubleDetail where 1=1 ");
		if(query.getTrouble()!=null){
			if(query.getTrouble().getId()!=null && query.getTrouble().getId()!=""){
				jql.append(" and trouble.id = ?");
				values.add(query.getTrouble().getId());
			}
		}
		if(query.getMachine()!=null){
			if(query.getMachine().getId()!=null && query.getMachine().getId()!=""){
				jql.append(" and machine.id = ?");
				values.add(query.getMachine().getId());
			}
		}
		if(query.getCreateDay()!=null && query.getCreateDay()!=""){
			jql.append(" and createDay = ? ");
			values.add(query.getCreateDay());
		}
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		troubleManager.findPage(page);
		troubleDetailManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 按照机器编号导出故障明细
	 * @param batchDay
	 * @param payChannelCode
	 */
	@RequestMapping(value = "/export/{createDay}/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBatchs(@PathVariable("createDay") String createDay, @PathVariable("code") String code) {
		//List<Trouble> troubles = troubleManager.find(" from Trouble where 1=1");
		List<Trouble> troubles = troubleManager.find(" from Trouble where parent is null");
		StringBuilder sql = new StringBuilder(" select code ");
		for(int i=0; i<troubles.size(); i++){
			List<Trouble> list = getTroubles(troubles.get(i));
			for(int j=0; j<list.size(); j++){
				sql.append(" ,sum("+list.get(j).getName()+") "+list.get(j).getName());
			}
		}
		sql.append(" ,create_day,operator from ( select a.code,b.create_day,b.operator");
		for(int i=0; i<troubles.size(); i++){
			List<Trouble> list = getTroubles(troubles.get(i));
			for(int j=0; j<list.size(); j++){
				sql.append(" ,decode(c.name, '"+list.get(j).getName()+"', sum(b.account), 0) "+list.get(j).getName());
			}	
		}
		sql.append(" from SSM_MACHINE a, ssm_trouble_detail b, ssm_trouble c");
		sql.append(" where a.id = b.machine_id and b.trouble_id = c.id(+)");
		sql.append(" group by a.code,c.name,b.create_day,b.operator) aa");
		if(code != null && code != ""){
			sql.append(" where aa.code like '"+code+"%'");
		}
		if(createDay != null && createDay != ""){
			sql.append(" and aa.create_day = '"+createDay+"'");
		}
		sql.append(" group by aa.code,aa.create_day,aa.operator");
		logger.info("sql语句：" + sql.toString());
		List batchs = machineManager.findBySql(sql.toString());
		try {
			HttpServletResponse response = this.getResponse();
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ code + "_guzhang_"+ createDay + ".xlsx");
			// 定义一个输出流
			OutputStream out = null;
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();
			writeBatchExcel(batchs, troubles, out, createDay);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 按照故障类型导出故障明细
	 */
	@RequestMapping(value = "/export/{createDay}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBatchs2(@PathVariable("createDay") String createDay) {
		//List<Trouble> troubles = troubleManager.find(" from Trouble where 1=1");
		List<Trouble> troubles = troubleManager.find(" from Trouble where parent is null");
		StringBuilder sql = new StringBuilder(" select a.name,a.parent,count(c.name) from ssm_trouble a "
				+ "join ssm_trouble_detail b on a.id=b.trouble_id "
				+ "join ssm_machine c on c.id=b.machine_id "
				+ "group by a.name,a.parent,b.create_day ");
		if(createDay != null && createDay != ""){
			sql.append("having b.create_day='"+createDay+"'");
		}
		logger.info("sql语句：" + sql.toString());
		List batchs = machineManager.findBySql(sql.toString());
		try {
			HttpServletResponse response = this.getResponse();
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename=guzhang_"+ createDay + ".xlsx");
			// 定义一个输出流
			OutputStream out = null;
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();
			writeExcel(batchs, troubles, out, createDay);			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 输出excel
	 */
	public void writeExcel(List batchs, List<Trouble> troubles, OutputStream out, String day){
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFSheet sheet = wb.createSheet("故障明细表");
			//sheet.set
			sheet.setColumnWidth(0, 10 * 512);//// 设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1, 15 * 512);
			sheet.setColumnWidth(2, 4 * 512);
			sheet.setColumnWidth(3, 20 * 512);
			XSSFRow row = sheet.createRow(0);
			row.setHeightInPoints((short) 40);
			// 给这一行赋值设置title
			row.createCell(0).setCellValue("类别");
			row.createCell(1).setCellValue("子类");
			row.createCell(2).setCellValue("总次数");
			row.createCell(3).setCellValue("银行编号");
			XSSFCellStyle amtStyle = wb.createCellStyle();
			XSSFDataFormat format= wb.createDataFormat();
			amtStyle.setDataFormat(format.getFormat("")); 
			amtStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
			amtStyle.setWrapText(true);
			XSSFCell cell = null;
			Object[] info = null;
			XSSFRow row2 = null;
			BigDecimal totalAmt = new BigDecimal(0);
			// 循环将dataList插入表中
			if (batchs != null && batchs.size() > 0) {
				for (int i=1; i <= batchs.size(); i++) {
					row2 = sheet.createRow(i);
					info = (Object[]) batchs.get(i-1);
					
					Trouble trouble = troubleManager.get(info[1]+"");
					cell = row2.createCell(0);
					cell.setCellValue(trouble.getName());
					
					cell = row2.createCell(1);
					cell.setCellValue(info[0]+"");

					cell = row2.createCell(2);
					cell.setCellValue(info[2]+"");
					
					cell = row2.createCell(3);
					cell.setCellValue("");
					
				}
				row2 = sheet.createRow(batchs.size());
				cell = row2.createCell(0);
				cell.setCellValue("合计");
				
				cell = row2.createCell(3);
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
	/**
	 * 获取子故障
	 */
	public List<Trouble> getTroubles(Trouble trouble){
		List<Trouble> troubles = this.troubleManager.find(" from Trouble where parent = ?", trouble.getId());
		return troubles;
	}

	/**
	 * 输出为excel表格
	 * @param batchs
	 * @param out
	 * @param day
	 */
	public void writeBatchExcel(List batchs, List<Trouble> troubles, OutputStream out, String day) {
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFSheet sheet = wb.createSheet("故障明细表");
			//sheet.set
			sheet.setColumnWidth(0, 4 * 512);//// 设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1, 4 * 512);
			sheet.setColumnWidth(2, 4 * 512);
			sheet.setColumnWidth(3, 5 * 512);
			sheet.setColumnWidth(4, 5 * 512);
			for(int i=0; i<troubles.size(); i++){
				List<Trouble> list = getTroubles(troubles.get(i));
				
				for(int j=0; j<list.size(); j++){
					if(i == 0){
						sheet.setColumnWidth(i+5+j, 5 * 512);
					}else{
						List<Trouble> list1 = getTroubles(troubles.get(i-1));
						sheet.setColumnWidth(i+5+j+list1.size(), 5 * 512);
					}
				}
			}
			XSSFRow row = sheet.createRow(0);
			XSSFRow row1 = sheet.createRow(1);
			row.setHeightInPoints((short) 40);
			row1.setHeightInPoints((short) 40);
			// 给这一行赋值设置title
			row.createCell(0).setCellValue("编号");
			row.createCell(1).setCellValue("医院编号");
			row.createCell(2).setCellValue("银行编号");
			row.createCell(3).setCellValue("楼层位置");
			row.createCell(4).setCellValue("总故障数");
			// 给这二行赋值设置title
			row1.createCell(0).setCellValue("编号");
			row1.createCell(1).setCellValue("医院编号");
			row1.createCell(2).setCellValue("银行编号");
			row1.createCell(3).setCellValue("楼层位置");
			row1.createCell(4).setCellValue("次数");
			
			XSSFCellStyle cellStyle = wb.createCellStyle();
			cellStyle.setWrapText(true);
			for(int i=0; i<troubles.size(); i++){	
				List<Trouble> list = getTroubles(troubles.get(i));
				for(int j=0; j<list.size(); j++){
					if(i == 0){
						row.createCell(i+5+j).setCellStyle(cellStyle);//设置自动换行
						row1.createCell(i+5+j).setCellStyle(cellStyle);
						row.createCell(i+5+j).setCellValue(troubles.get(i).getName());
						row1.createCell(i+5+j).setCellValue(list.get(j).getName());
					}else{
						List<Trouble> list1 = getTroubles(troubles.get(i-1));
						row.createCell(i+5+j+list1.size()-1).setCellStyle(cellStyle);//设置自动换行
						row1.createCell(i+5+j+list1.size()-1).setCellStyle(cellStyle);
						
						row.createCell(i+5+j+list1.size()-1).setCellValue(troubles.get(i).getName());
						row1.createCell(i+5+j+list1.size()-1).setCellValue(list.get(j).getName());
					}
					
				}
			}
			XSSFCellStyle amtStyle = wb.createCellStyle();
			XSSFDataFormat format= wb.createDataFormat();
			amtStyle.setDataFormat(format.getFormat("")); 
			amtStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
			XSSFCell cell = null;
			Object[] info = null;
			XSSFRow row2 = null;
			BigDecimal totalAmt = new BigDecimal(0);
			// 循环将dataList插入表中
			if (batchs != null && batchs.size() > 0) {
				for (int i=2; i <= batchs.size()+1; i++) {
					row2 = sheet.createRow(i);
					info = (Object[]) batchs.get(i-2);
					
					cell = row2.createCell(0);
					cell.setCellValue(i);
					
					cell = row2.createCell(1);
					cell.setCellValue("");

					cell = row2.createCell(2);
					cell.setCellValue(info[0]+"");
					
					cell = row2.createCell(3);
					cell.setCellValue("");
					
					cell = row2.createCell(4);
					cell.setCellValue("");
					
					for(int a=1; a<info.length; a++){
						cell = row2.createCell(a+4);
						cell.setCellValue(info[a]+"");
					}
					
				}
				row2 = sheet.createRow(batchs.size() + 2);
				cell = row2.createCell(0);
				cell.setCellValue("合计");
				
				cell = row2.createCell(3);
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
	/**
	 * 导入出库记录
	 * @param file
	 * @return
	 */
	@RequestMapping(value = "/import", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
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
			
			List<TroubleDetail> batchs = new ArrayList<TroubleDetail>();
			readBatchExcel(batchs, file.getInputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public void readBatchExcel(List<TroubleDetail> batchs, InputStream in){
		// 输出流
		try {
			// 构造工作区 XSSFWorkbook 对象，strPath 传入文件路径
			XSSFWorkbook workbook = new XSSFWorkbook(in);
			// 读取第一章表格内容
			XSSFSheet sheet = workbook.getSheetAt(0);
			// 定义 row、cell
			XSSFRow row = null;
			String machineCode = "";
			Machine machine = null;
			XSSFRow rowHead = null;
			for (int i = sheet.getFirstRowNum()+1 ; i < sheet.getPhysicalNumberOfRows(); i++) {
				row = sheet.getRow(i);
				rowHead = sheet.getRow(0);
				if (row == null || row.getCell(0) == null || "".equals(getCellValue(row.getCell(0))) || "合计".equals(getCellValue(row.getCell(0)))) {
					continue;
				}
				machineCode = getCellValue(row.getCell(2));
				machine = this.machineManager.findOne("from Machine where code = ?", machineCode);
				
				for(int a=5; a<rowHead.getPhysicalNumberOfCells(); a++){
					String account = getCellValue(row.getCell(a));
					Trouble trouble = this.troubleManager.findOne("from Trouble where name = ?", getCellValue(rowHead.getCell(a)));
					save(machine, trouble, Integer.parseInt(account));
				}
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void save(Machine machine,Trouble trouble,int account){
		if(account > 0){
			if(machine != null && trouble != null){
				TroubleDetail batch = new TroubleDetail();
				Date now =  new Date();
				String createTime = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
				String createDay = DateUtils.date2String(now, "yyyy-MM-dd");
				batch.setCreateTime(createTime);
				batch.setCreateDay(createDay);
				batch.setAccount(account);
				User user = this.getCurrentUser();
				batch.setOperator(user.getName());
				batch.setMachine(machine);
				batch.setTrouble(trouble);
				this.troubleDetailManager.save(batch);
			}
		}
	}
	
	private String getCellValue(XSSFCell cell){
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
