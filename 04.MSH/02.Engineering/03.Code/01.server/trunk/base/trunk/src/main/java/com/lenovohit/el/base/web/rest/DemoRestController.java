package com.lenovohit.el.base.web.rest;

import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.base.model.Demo;
import com.lenovohit.el.base.model.DemoRel;
import com.lenovohit.el.base.utils.excel.PoiWriter;

@RestController
@RequestMapping("/el/base/demo/")
public class DemoRestController extends BaseController {
	
	@Autowired
	private GenericManager<Demo, String> demoManager;
	
	@Autowired
	private GenericManager<DemoRel, String> demoRelManager;

	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		Demo d = new Demo();
		//TODO 接收前端传入数据，转化为
		System.out.println(data);
		d = JSONUtils.deserialize(data, Demo.class);
		d.setRel("rel");
//		d.setId("aaaaa");
//		d.setName("aaaaasdfdafds");
		d = this.demoManager.save(d);
		DemoRel dr = new DemoRel();
		dr.setName("demorel:"+ d.getName());
		dr.setRel("rel");
		this.demoRelManager.save(dr);
		return ResultUtils.renderSuccessResult(d);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Demo d = new Demo();
		//TODO 接收前端传入数据，转化为
		System.out.println(id);
//		d = JSONUtils.deserialize(data, Demo.class);
//		d.setId("aaaaa");
//		d.setName("aaaaasdfdafds");
//		d.setId(id);
		d = this.demoManager.get(id);
		
		return ResultUtils.renderSuccessResult(d);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		Demo d = new Demo();
		//TODO 接收前端传入数据，转化为
		System.out.println(id);
		d = JSONUtils.deserialize(data, Demo.class);
//		d.setId("aaaaa");
//		d.setName("aaaaasdfdafds");
//		d.setId(id);
		d = this.demoManager.save(d);
		
		return ResultUtils.renderSuccessResult(d);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		Demo d = new Demo();
		//TODO 接收前端传入数据，转化为
		System.out.println(id);
//		d = JSONUtils.deserialize(data, Demo.class);
//		d.setId("aaaaa");
//		d.setName("aaaaasdfdafds");
//		d.setId(id);
		d = this.demoManager.delete(id);
		
		return ResultUtils.renderSuccessResult(d);
	}
	
	
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Demo d = new Demo();
		//TODO 接收前端传入数据，转化为
//		System.out.println(id);
//		d = JSONUtils.deserialize(data, Demo.class);
//		d.setId("aaaaa");
//		d.setName("aaaaasdfdafds");
//		d.setId(id);
		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);
		p.setQuery("select distinct d from Demo d,DemoRel dr where d.rel=dr.rel  ");
		this.demoManager.findPage(p);
		
		return ResultUtils.renderSuccessResult(p);
	}
	
	@RequestMapping(value = "upload", method = RequestMethod.POST)
	public @ResponseBody String handleFileUpload(
			@RequestParam("name") String name,
			@RequestParam("file") MultipartFile file) {
		String ret = null;
		if (!file.isEmpty()) {
			try {
				/*byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(new File(name + "-uploaded")));
				stream.write(bytes);
				stream.close();*/
				ret = importDemos(file.getOriginalFilename(), file.getInputStream(), true);
				return ret;
			} catch (Exception e) {
				return "You failed to upload " + name + " => " + e.getMessage();
			}
		} else {
			return "You failed to upload " + name
					+ " because the file was empty.";
		}
	}

	
	private String importDemos(String fileName, InputStream is, boolean isCover){
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
			// 定义 row、cell
			Row row = null;
			String result = null;
			for (int i = 2; i < sheet.getLastRowNum(); i++) {
				row = sheet.getRow(i);
				if (row == null) {
					continue;
				}
				
				result = this.importDemo(row);
				if ("success".equals(result)) {
					sucessCount++;
				}
				if("fail".equals(result)){
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
	
	private String importDemo(Row row) throws Exception{
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
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
	}
	
	/**
	 * 获取单元格值
	 * @param row 获取的行
	 * @param column 获取单元格列号
	 * @return 单元格值
	 */
	private Object getCellValue(Row row, int column){
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
	
	@RequestMapping(value = "/export", method = RequestMethod.GET)
	public void handleFileExport(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			List<Demo> list = new ArrayList<Demo>();
			
			Demo demo = new Demo();
			demo.setId("a11111");
			demo.setName("name111111");
			demo.setRel("rel11111111");
			list.add(demo);

			demo = new Demo();
			demo.setId("b222222222222");
			demo.setName("name22222");
			demo.setRel("rel22222");
			list.add(demo);
			
			byte[] fileNameByte = ("demo-import.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportDemos(response.getOutputStream(), list);
			
		} catch (Exception ex) {
			logger.debug(ex.getMessage());
		} 
	}
	
	public void exportDemos(OutputStream os, List<Demo> list) throws Exception{
		BufferedOutputStream bos = null;
		try {
			List<String> headlist = new ArrayList<String>();
			headlist.add("序号");
			headlist.add("ID*");
			headlist.add("NAME*");
			headlist.add("备注");
			
			// sheet页
		    int size = headlist.size() - 1;
		    HSSFWorkbook workbook = new HSSFWorkbook();// 生成excel文件
		    HSSFSheet sheet = workbook.createSheet("学生个人信息");// 创建工作薄(sheet)
		    sheet.setDefaultColumnWidth((short) 20);
		  
		    // 表头行
		    HSSFCellStyle titleStyle = PoiWriter.getTitleStyle(workbook);
		    HSSFRow row = sheet.createRow((short) 0);
		    HSSFCell ce = row.createCell((short) 0);
		    ce.setCellType(HSSFCell.CELL_TYPE_STRING);
		    ce.setCellValue("学生个人信息"); // 表格的第一行第一列显示的数据
		    ce.setCellStyle(titleStyle);
		    Region region = new Region(0, (short) 0, 0, (short) size);
		    PoiWriter.setRegionStyle(sheet, region, titleStyle);
		    sheet.addMergedRegion(region);
	
		    // 列样式
		    HSSFCellStyle columnStyle = PoiWriter.getContentStyle(workbook);
		    HSSFFont columnfont = workbook.createFont();
		    columnfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		    columnStyle.setFont(columnfont);
		   
		    // 标题栏
		    HSSFRow colrow = sheet.createRow(1);// 新建第二行
		    for (int i = 0; i < headlist.size(); i++) {
				HSSFCell colcell = colrow.createCell((short) i);
				colcell.setCellValue((String) headlist.get(i));
				colcell.setCellType(HSSFCell.CELL_TYPE_STRING);
				colcell.setCellStyle(columnStyle);
				Region columnRegion3 = new Region(2, (short) i, 2, (short) i);
				PoiWriter.setRegionStyle(sheet, columnRegion3, columnStyle);
				sheet.addMergedRegion(columnRegion3);
		    }
		    
		    // 内容
		    for (int i = 0; i < list.size(); i++) {
		    	Demo demo = list.get(i);
		    	HSSFRow _row = sheet.createRow(i+2);// 新建第三行
		    	
				//序号
				HSSFCell indexcell = _row.createCell(0);
				indexcell.setCellValue(i);					
				//班级名称
		    	HSSFCell classcell = _row.createCell(1);
		    	classcell.setCellValue(demo.getId());
		    	//班主任名称
		    	HSSFCell hrTeachercell = _row.createCell(2);
		    	hrTeachercell.setCellValue(demo.getName());
		    	//班级备注
		    	HSSFCell memocell = _row.createCell(3);
		    	memocell.setCellValue(demo.getRel());
		    }
		    bos = new BufferedOutputStream(os);
		    workbook.write(bos);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		    if (bos != null) {
			    bos.close();
		    }
		}
	}
}
