package com.lenovohit.ssm.base.web.rest;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
import com.lenovohit.ssm.base.model.Material;
import com.lenovohit.ssm.base.model.MaterialDetailOut;
import com.lenovohit.ssm.base.model.User;

@RestController
@RequestMapping("/ssm/base/materialDetailOut")
public class MaterialDetailOutRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<MaterialDetailOut, String> materialDetailOutManager;
	@Autowired
	private GenericManagerImpl<Material, String> materialManager;
	@Autowired
	private GenericManagerImpl<Machine, String> machineManager;
	
	/**
	 * 出库信息保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateMaterial(@RequestBody String data){
		MaterialDetailOut materialDetail = JSONUtils.deserialize(data, MaterialDetailOut.class);
		
		User user = this.getCurrentUser();
		materialDetail.setOperator(user.getName());
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		String outTime = DateUtils.date2String(now, "yyyy-MM-dd");
		materialDetail.setOutTime(outTime);
		materialDetail.setOutPutTime(time);
		MaterialDetailOut saved = this.materialDetailOutManager.save(materialDetail);
		
		String id = materialDetail.getMaterial().getId();
		Material material = materialManager.get(id);
		int account = materialDetail.getOutPutAccount();
		int oldAccount = material.getAccount();
		int newAccount = oldAccount - account;
		material.setAccount(newAccount);
		materialManager.save(material);
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 同步材料数量
	 */
	public void updateMaterialAccount(String id){
		StringBuilder jql = new StringBuilder(" select sum(inPutAccount) from MaterialDetailOut where material.id = ?");
		long account = materialDetailOutManager.getCount(jql.toString(), id);
	}
	/**
	 * 修改出库信息
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MaterialDetailOut model =  JSONUtils.deserialize(data, MaterialDetailOut.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		User user = this.getCurrentUser();
		model.setOperator(user.getName());
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		String outTime = DateUtils.date2String(now, "yyyy-MM-dd");
		model.setOutTime(outTime);
		model.setOutPutTime(time);
		//获取原来的出库数
		MaterialDetailOut MaterialDetailOut = this.materialDetailOutManager.get(model.getId());
		int oldAccount = MaterialDetailOut.getOutPutAccount();
		//获取新的出库数
		int outPutAccount = model.getOutPutAccount();
		Material material = this.materialManager.get(MaterialDetailOut.getMaterial().getId());
		int account = material.getAccount();
		int newAccount = account - (outPutAccount-oldAccount);
		material.setAccount(newAccount);
		
		this.materialDetailOutManager.save(model);
		this.materialManager.save(material);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 删除出库信息
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@RequestBody String data) {
		MaterialDetailOut model =  JSONUtils.deserialize(data, MaterialDetailOut.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		MaterialDetailOut MaterialDetailOut = this.materialDetailOutManager.get(model.getId());
		int outPutAccount = MaterialDetailOut.getOutPutAccount();
		
		Material material = this.materialManager.get(MaterialDetailOut.getMaterial().getId());
		int account = material.getAccount();
		int newAccount = account + outPutAccount;
		material.setAccount(newAccount);
		this.materialManager.save(material);
		this.materialDetailOutManager.delete(model);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/out/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		MaterialDetailOut query =  JSONUtils.deserialize(data, MaterialDetailOut.class);
		List<Object> values = new ArrayList<Object>();
		Page page = new Page();
		StringBuilder jql = new StringBuilder( " from MaterialDetailOut where 1=1 ");
		if(query.getMaterial()!=null){
			if(query.getMaterial().getId()!=null && query.getMaterial().getId()!=""){
				jql.append(" and material.id = ?");
				values.add(query.getMaterial().getId());
			}
		}
		if(query.getMachine()!=null){
			if(query.getMachine().getId()!=null && query.getMachine().getId()!=""){
				jql.append(" and machine.id = ?");
				values.add(query.getMachine().getId());
			}
		}
		if(query.getOutTime()!=null && query.getOutTime()!=""){
			jql.append(" and outTime = ? ");
			values.add(query.getOutTime());
		}
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		materialManager.findPage(page);
		materialDetailOutManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 导出出库记录
	 * @param batchDay
	 * @param payChannelCode
	 */
	@RequestMapping(value = "/export/{outTime}/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBatchs(@PathVariable("outTime") String outTime, @PathVariable("code") String code) {

		List<Material> materials = materialManager.find("from Material where 1=1");
		StringBuilder sql = new StringBuilder("select code ");
		for(Material material : materials){
			sql.append(" ,sum("+material.getName()+") "+material.getName());
		}
		sql.append(" ,out_time,operator from ( select a.code,b.out_time,b.operator");
		for(Material material : materials){
			sql.append(" ,decode(c.name, '"+material.getName()+"', sum(b.out_put_account), 0) "+material.getName());
		}
		sql.append(" from SSM_MACHINE a, SSM_MATERIAL_DETAIL_OUT b, SSM_MATERIAL c");
		sql.append(" where a.id = b.machine_id and b.material_id = c.id(+)");
		sql.append(" group by a.code,c.name,b.out_time,b.operator) aa");
		//留下备用
		/*StringBuilder sql = new StringBuilder("select code,sum(rmz) rmz,sum(a4z) a4z,sum(sedai) sedai,"
				+ " sum(jzk) jzk,sum(fk) fk,sum(xg) xg,sum(qjk) qjk,sum(qjz) qjz,out_time,operator from ( "
				+ " select a.code,b.out_time,b.operator,"
				+ " decode(c.name, '热敏纸', sum(b.out_put_account), 0) rmz,"
				+ " decode(c.name, 'A4纸', sum(b.out_put_account), 0) a4z,"
				+ " decode(c.name, '色带', sum(b.out_put_account), 0) sedai,"
				+ " decode(c.name, '就诊卡', sum(b.out_put_account), 0) jzk,"
				+ " decode(c.name, '废卡', sum(b.out_put_account), 0) fk,"
				+ " decode(c.name, '硒鼓', sum(b.out_put_account), 0) xg,"
				+ " decode(c.name, '清洁卡', sum(b.out_put_account), 0) qjk,"
				+ " decode(c.name, '清洁轴', sum(b.out_put_account), 0) qjz"
				+ " from SSM_MACHINE a, SSM_MATERIAL_DETAIL_OUT b, SSM_MATERIAL c"
				+ " where a.id = b.machine_id"
				+ " and b.material_id = c.id(+)"
				+ " group by a.code,c.name,b.out_time,b.operator) aa");*/
		if(code != null && code !=""){
			sql.append(" where aa.code like '"+code+"%'");
		}	
		if(outTime !=null && outTime != ""){
			sql.append(" and aa.out_time = '"+outTime+"'");
		}
		sql.append(" group by aa.code,aa.out_time,aa.operator");
		logger.info("sql语句：" + sql.toString());
		List batchs = machineManager.findBySql(sql.toString());
		try {
			HttpServletResponse response = this.getResponse();
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ code + "_haocai_"+ outTime + ".xlsx");
			// 定义一个输出流
			OutputStream out = null;
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();
			writeBatchExcel(batchs, materials, out, outTime);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 输出为excel表格
	 * @param batchs
	 * @param out
	 * @param day
	 */
	public void writeBatchExcel(List batchs, List<Material> materials, OutputStream out, String day) {
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFSheet sheet = wb.createSheet("耗材领用明细表");

			sheet.setColumnWidth(0, 4 * 512);//// 设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1, 4 * 512);
			sheet.setColumnWidth(2, 4 * 512);
			sheet.setColumnWidth(3, 5 * 512);
			for(int i=0; i<materials.size(); i++){
				sheet.setColumnWidth(i+4, 5 * 512);
			}
			sheet.setColumnWidth(3+materials.size(), 10 * 512);
			sheet.setColumnWidth(4+materials.size(), 6 * 512);
			XSSFRow row1 = sheet.createRow(0);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("编号");
			row1.createCell(1).setCellValue("医院编号");
			row1.createCell(2).setCellValue("银行编号");
			row1.createCell(3).setCellValue("楼层位置");
			for(int i=0; i<materials.size(); i++){
				row1.createCell(i+4).setCellValue(materials.get(i).getName());
			}
			row1.createCell(4+materials.size()).setCellValue("出库时间");
			row1.createCell(5+materials.size()).setCellValue("操作人");
			
			XSSFCellStyle amtStyle = wb.createCellStyle();
			XSSFDataFormat format= wb.createDataFormat();
			amtStyle.setDataFormat(format.getFormat("")); 
			amtStyle.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
			XSSFRow row = null;
			XSSFCell cell = null;
			//MaterialDetail info = null;
			Object[] info = null;
			BigDecimal totalAmt = new BigDecimal(0);
			// 循环将dataList插入表中
			if (batchs != null && batchs.size() > 0) {
				for (int i = 1; i <= batchs.size(); i++) {
					row = sheet.createRow(i);
					info = (Object[])batchs.get(i-1);
					
					cell = row.createCell(0);
					cell.setCellValue(i);
					
					cell = row.createCell(1);
					cell.setCellValue("");

					cell = row.createCell(2);
					cell.setCellValue(info[0]+"");

					cell = row.createCell(3);
					cell.setCellValue("");
					for(int a=1; a<info.length; a++){
						cell = row.createCell(a+3);
						cell.setCellValue(info[a]+"");
					}
				}
				row = sheet.createRow(batchs.size() + 1);
				cell = row.createCell(0);
				cell.setCellValue("合计");
				
				cell = row.createCell(3);
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
	 * 判断材料名字
	 */
	public int forMaterialName(MaterialDetailOut md,String name){
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		if(md.getMaterial().getName().equals(name)){
			return md.getOutPutAccount();
		}
		return 0;
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
			
			List<MaterialDetailOut> batchs = new ArrayList<MaterialDetailOut>();
			readBatchExcel(batchs, file.getInputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public void readBatchExcel(List<MaterialDetailOut> batchs, InputStream in){
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
				
				for(int a=4; a<rowHead.getPhysicalNumberOfCells()-2; a++){
					String account = getCellValue(row.getCell(a));
					Material material = this.materialManager.findOne("from Material where name = ?", getCellValue(rowHead.getCell(a)));
					save(machine, material, Integer.parseInt(account));
				}
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void save(Machine machine,Material material,int account){
		if(account > 0){
			if(machine != null && material != null){
				MaterialDetailOut batch = new MaterialDetailOut();
				Date now =  new Date();
				String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
				String outTime = DateUtils.date2String(now, "yyyy-MM-dd");
				batch.setOutTime(outTime);
				batch.setOutPutTime(time);
				batch.setOutPutAccount(account);
				User user = this.getCurrentUser();
				batch.setOperator(user.getName());
				batch.setMachine(machine);
				batch.setMaterial(material);
				this.materialDetailOutManager.save(batch);
				//矫正库存量
				int old = material.getAccount();
				material.setAccount(old - account);
				this.materialManager.save(material);
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
