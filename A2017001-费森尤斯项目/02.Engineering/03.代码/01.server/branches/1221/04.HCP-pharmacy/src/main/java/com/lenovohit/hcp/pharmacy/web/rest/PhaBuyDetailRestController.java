package com.lenovohit.hcp.pharmacy.web.rest;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.model.PhaActualBuy;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

import freemarker.cache.TemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

@RestController
@RequestMapping("/hcp/pharmacy/buyDetail")
public class PhaBuyDetailRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
	@Autowired
	private GenericManager<PhaActualBuy, String> phaActualBuyManager;
	
	
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
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		StringBuilder jql = new StringBuilder( "select a from PhaBuyDetail a left join a.drugInfo drug left join a.phaBuyBill b left join a.producer c where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(query.getCreateOper())){
			jql.append("and a.createOper = ? ");
			values.add(query.getCreateOper());
		}
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append("and a.hosId = ? ");
			values.add(query.getHosId());
		}
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append("and a.buyBill = ? ");
			values.add(query.getBuyBill());
		}
		if(StringUtils.isNotEmpty(query.getDrugCode())){
			jql.append("and a.drugCode = ? ");
			values.add(query.getDrugCode());
		}
		if(StringUtils.isNotEmpty(query.getDrugCode())){
			jql.append("and a.drugCode = ? ");
			values.add(query.getDrugCode());
		}
		if(query.getPhaBuyBill() != null ){
			if(StringUtils.isNotEmpty(query.getPhaBuyBill().getBuyState())){
				jql.append("and b.buyState = ? ");
				values.add(query.getPhaBuyBill().getBuyState());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		//System.out.println(jql.toString());
		phaBuyDetailManager.findPage(page);
		//if(query.getPhaBuyBill().getBuyState() =="instock"||"instock".equals(query.getPhaBuyBill().getBuyState())){
			if(page.getResult()!=null){
				for(PhaBuyDetail detail : (List<PhaBuyDetail>)page.getResult()){
					List<Object> value = new ArrayList<Object>();
					StringBuilder hql = new StringBuilder( " from PhaActualBuy where detailId = ? ");
					value.add(detail.getId());
					List<PhaActualBuy> buy = phaActualBuyManager.find(hql.toString(), value.toArray());
					if(buy!=null&&buy.size()>0){
						detail.setComm(buy.get(0).getBuyNum().intValue()+"");
						detail.setInNum(buy.get(0).getBuyNum().intValue());
					}else{
						detail.setComm(detail.getAuitdNum()+"");
						detail.setInNum(detail.getAuitdNum());
					}
				}
			//}
		}
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PhaBuyDetail model= phaBuyDetailManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		StringBuilder jql = new StringBuilder( "select a from PhaBuyDetail a left join a.producer where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append(" And a.hosId = ?");
			values.add(query.getHosId());
		}
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append(" And a.buyBill = ?");
			values.add(query.getBuyBill());
		}
		if(StringUtils.isNotEmpty(query.getCreateOper())){
			jql.append(" And a.createOper = ?");
			values.add(query.getCreateOper());
		}
		
		List<PhaBuyDetail> models = phaBuyDetailManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	/**
	 * 查询列表--包含  本院库存， 本科室库存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		System.out.println(query);
		
		StringBuilder jql = new StringBuilder( " from PhaBuyDetail where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();

		jql.append(" And hosId = ? ");
		values.add(user.getHosId());
			
		if(StringUtils.isNotEmpty(query.getBuyBill())){
			jql.append(" And buyBill = ?");
			values.add(query.getBuyBill());
		}
		
		List<PhaBuyDetail> models = phaBuyDetailManager.find(jql.toString(), values.toArray());
		
		for(PhaBuyDetail item : models){
			//查询本科室库存
			StringBuilder jql2 = new StringBuilder(" from PhaStoreSumInfo where hosId = ? and deptId = ? and drugCode = ? ");
			List<Object> values2 = new ArrayList<Object>();
			values2.add(user.getHosId());
			values2.add(user.getLoginDepartment().getId());
			values2.add(item.getDrugCode());
			List<PhaStoreSumInfo> models2 = phaStoreSumInfoManager.find(jql2.toString(), values2.toArray());
			if(StringUtils.isNotBlank(models2)&& models2.size()>0&&StringUtils.isNotBlank(models2.get(0))){
				item.setDeptSum(models2.get(0).getStoreSum());
			}else{
				item.setDeptSum(new BigDecimal(0));
			}
			
			//查询本院库存
			StringBuilder jql3 = new StringBuilder(" select sum(store_Sum),drug_Code,hos_Id from Pha_StoreSumInfo group by hos_Id,drug_Code having hos_Id=? and drug_Code = ?  ");
			List<Object> values3 = new ArrayList<Object>();
			values3.add(user.getHosId());
			values3.add(item.getDrugCode());
			List<Object> models3 =(List<Object>) phaStoreSumInfoManager.findBySql(jql3.toString(), values3.toArray());

			if(StringUtils.isNotBlank(models3)&& models3.size()>0&&StringUtils.isNotBlank(models3.get(0))){
				Object[] obj =(Object[]) models3.get(0);
				item.setTotalSum(new BigDecimal(String.valueOf(obj[0])));
			}else{
				item.setTotalSum(new BigDecimal(0));
			}
		}
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/saveBatch",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		System.out.println(data);
		List<PhaBuyDetail> models =  (List<PhaBuyDetail>) JSONUtils.parseObject(data,new TypeReference< List<PhaBuyDetail>>(){});
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		try {
			for( PhaBuyDetail model : models ){
				if( StringUtils.isEmpty(model.getId())){
					model.setCreateOper(user.getName());
					model.setCreateTime(now);
				}
				model.setUpdateOper(user.getName());
				model.setUpdateTime(now);
			}
			System.out.println("====batchSave======");
			this.phaBuyDetailManager.batchSave(models);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaBuyDetail model =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PhaBuyDetail newModel =phaBuyDetailManager.get(model.getId());
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		if(!StringUtils.isEmpty(model.getAuitdNum())){
			newModel.setAuitdNum(model.getAuitdNum());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		this.phaBuyDetailManager.save(newModel);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.phaBuyDetailManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除多项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_COMPANYINFO WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaBuyDetailManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	
	/**    
	 * 功能描述：导出数据到excel中,采购计划查询（右侧）
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author zhx
	 * @throws IOException 
	 * @date 2017年6月12日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result exportDetailToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
		StringBuilder jql = new StringBuilder( "from PhaBuyDetail where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(StringUtils.isNotBlank(query.getBuyBill())){
			jql.append(" and buyBill = ? ");
			values.add(query.getBuyBill());
		}
		List<PhaBuyDetail> buyBillList = phaBuyDetailManager.find(jql.toString(), values.toArray());
		
		String fileName = "采购计划明细";
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
		OutputStream out = null;
		response.setCharacterEncoding("UTF-8") ;
		out = response.getOutputStream();
		createExcel(buyBillList,out);
		return ResultUtils.renderSuccessResult();
	}
	
	/**    
	 * 功能描述：导出出库明细到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcel(List<PhaBuyDetail> OutputInfoList,OutputStream out) {
		
		Map<String, String> map=new HashMap<String,String>();
		map.put("001", "西药");
		map.put("002", "中成药");
		map.put("003", "中草药");
		
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
			XSSFSheet sheet = wb.createSheet("采购计划明细");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,12 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,12* 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,12 * 512);
			sheet.setColumnWidth(8,12 * 512);
			sheet.setColumnWidth(9,12 * 512);
			sheet.setColumnWidth(10,12 * 512);
			sheet.setColumnWidth(11,12 * 512);
			sheet.setColumnWidth(12,12 * 512);
			sheet.setColumnWidth(13,12 * 512);
			sheet.setColumnWidth(14,12 * 512);
			sheet.setColumnWidth(15,12 * 512);
			sheet.setColumnWidth(16,12 * 512);
			sheet.setColumnWidth(17,12 * 512);
			sheet.setColumnWidth(18,12 * 512);
			sheet.setColumnWidth(19,12 * 512);
			sheet.setColumnWidth(20,12 * 512);
			sheet.setColumnWidth(21,12 * 512);

			
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
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 21));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("采购计划清单");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("采购单号");
			row1.createCell(1).setCellValue("药品编码");
			row1.createCell(2).setCellValue("药品名称");
			row1.createCell(3).setCellValue("规格");
			row1.createCell(4).setCellValue("类型");
			row1.createCell(5).setCellValue("批次");
			row1.createCell(6).setCellValue("批号");
			row1.createCell(7).setCellValue("生产日期");
			row1.createCell(8).setCellValue("有效期");
			row1.createCell(9).setCellValue("生产厂商");
			row1.createCell(10).setCellValue("购入价");
			row1.createCell(11).setCellValue("售价");
			row1.createCell(12).setCellValue("计划数量");
			row1.createCell(13).setCellValue("单位");
			row1.createCell(14).setCellValue("审核数量");
			row1.createCell(15).setCellValue("入库数量");
			row1.createCell(16).setCellValue("采购金额");
			row1.createCell(17).setCellValue("售价金额");
			row1.createCell(18).setCellValue("入库人");
			row1.createCell(19).setCellValue("入库时间");
			row1.createCell(20).setCellValue("申请人");
			row1.createCell(21).setCellValue("申请时间");
			//循环将dataList插入表中
			if(OutputInfoList!=null&& OutputInfoList.size()>0){
				for(int i=0;i<OutputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					PhaBuyDetail info = OutputInfoList.get(i);
					row.createCell(0).setCellValue(info.getBuyBill());
					row.createCell(1).setCellValue(info.getDrugCode());
					row.createCell(2).setCellValue(info.getTradeName());
					row.createCell(3).setCellValue(info.getSpecs());
					row.createCell(4).setCellValue(info.getDrugType()!=null ? map.get(info.getDrugType()):"");
					row.createCell(5).setCellValue(info.getBatchNo());
					row.createCell(6).setCellValue(info.getApprovalNo());
					row.createCell(7).setCellValue(info.getProcuceDate()!=null ? DateUtils.date2String(info.getProcuceDate(), "yyyy-MM-dd"):"");
					row.createCell(8).setCellValue(info.getValidDate()!=null ? DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"):"");
					row.createCell(9).setCellValue(info.getProducer()!=null ? info.getProducer().getCompanyName():"");
					row.createCell(10).setCellValue(info.getBuyPrice().toString());
					row.createCell(11).setCellValue(info.getSalePrice().toString());
					row.createCell(12).setCellValue(info.getBuyNum());
					row.createCell(13).setCellValue(info.getBuyUnit());
					row.createCell(14).setCellValue(info.getAuitdNum());
					row.createCell(15).setCellValue(info.getInNum());
					row.createCell(16).setCellValue(info.getBuyCost().toString());
					row.createCell(17).setCellValue(info.getSaleCose().toString());
					row.createCell(18).setCellValue(info.getInOper());
					row.createCell(19).setCellValue(info.getInTime()!=null ? DateUtils.date2String(info.getInTime(), "yyyy-MM-dd"):"");
					row.createCell(20).setCellValue(info.getCreateOper());
					row.createCell(21).setCellValue(info.getCreateTime()!=null ? DateUtils.date2String(info.getCreateTime(), "yyyy-MM-dd"):"");
//					row.createCell(5).setCellValue(!"".equals(info[5])&& info[5]!=null ? DateUtils.date2String((Date) info[5], "yyyy-MM-dd HH:mm:ss"):"");
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
	 * 功能描述：导出数据到word中
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年8月9日             
	*/
	@RequestMapping(value = "/expertToWord", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public  void exportToWord(HttpServletRequest request, HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data){
		try {
			PhaBuyDetail query =  JSONUtils.deserialize(data, PhaBuyDetail.class);
			String path = PhaBuyDetailRestController.class.getClassLoader().getResource("").getPath();
			
			Configuration cfg = new Configuration();  
            TemplateLoader templateLoader=null;  
            String dir = path.substring(path.indexOf("/")+1, path.lastIndexOf("/"));
            System.out.println(dir.substring(0, dir.lastIndexOf("/")+1));
            cfg.setDirectoryForTemplateLoading(new File(dir.substring(0, dir.lastIndexOf("/")+1)));
            
            InputStream stream = PhaBuyDetailRestController.class.getClassLoader().getResourceAsStream("PurchaseOrderTemplate.xml");
            String template="PurchaseOrderTemplate.xml";  
            Template t=cfg.getTemplate(template,"UTF-8");  
            
			 Map<String,Object> dataMap=new HashMap<String,Object>(); 
			 dataMap = findBuyDetail(query);
		        try {  
		        	response.setCharacterEncoding("UTF-8");
					String fileName ="PurchaseOrderDetail.doc";
					String buyBill = dataMap.get("buyBill").toString();
					if(StringUtils.isNotBlank(buyBill)){
						fileName = buyBill+fileName;
					}
					//对中文文件名编码  
					byte[] yte = fileName.getBytes("GB2312");  
					String unicoStr = new String(yte, "ISO-8859-1");
					response.setHeader("Content-disposition", "attachment; filename=" + unicoStr);  
					PrintWriter out = response.getWriter();
		            t.process(dataMap, out);  
		        } catch (TemplateException e) {  
		            e.printStackTrace();  
		        } catch (IOException e) {  
		            e.printStackTrace();  
		        } 
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	private Map<String, Object> findBuyDetail(PhaBuyDetail query) {
		Map<String,Object> map = new HashMap<String,Object>();
		StringBuilder jql = new StringBuilder( "from PhaBuyDetail where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(StringUtils.isNotBlank(query.getBuyBill())){
			jql.append(" and buyBill = ? ");
			values.add(query.getBuyBill());
		}
		List<PhaBuyDetail> buyBillList = phaBuyDetailManager.find(jql.toString(), values.toArray());
		map.put("producerName", query.getProducer()!=null?query.getProducer().getCompanyName():"");
		map.put("buyBill", query.getBuyBill());
		map.put("createTime", query.getCreateTime());
		map.put("buyCost", query.getPhaBuyBill().getBuyCost());
		map.put("buyList", buyBillList);
		return map;
	}
}
