package com.lenovohit.els.web.rest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.Region;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.OptUser;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.utils.excel.PoiWriter;
import com.lenovohit.els.model.StubTemplate;
import com.lenovohit.els.model.StubTemplateinfo;
import com.lenovohit.els.model.StubBatch;

@RestController
@RequestMapping("/els/stubtemplate")
public class StubTemplateRestController extends BaseRestController {
	@Autowired
	private GenericManager<StubTemplate, String> stubTemplateManager;
	@Autowired
	private GenericManager<StubTemplateinfo, String> stubTemplateinfoManager;
	@Autowired
	private GenericManager<StubBatch, String> stubBatchManager;

	/**
	 * ELS_STUB_016 新增工资模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("新增工资模板，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		/*
		String orgId = this.getSession().getAttribute(Constants.ORG_KEY).toString();
		OptUser optUser= (OptUser)this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		String perId = optUser.getPersionId();*/
		
		StubTemplate in = JSONUtils.deserialize(data, StubTemplate.class);
		if (null == in) {
			throw new BaseException("输入数据为空！");
		}
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		in.setOrgId(orgId);
		in.setCreateAt(DateUtils.getCurrentDateTimeStr());

		// 新增模板表
		this.stubTemplateManager.save(in);

		for (StubTemplateinfo sti : in.getStubTemplateinfos()) {
			sti.setTemplateId(in.getId());
			sti.setTemplate(in.getTemplate());
		}
		// 新增模板明细表
		this.stubTemplateinfoManager.batchSave(in.getStubTemplateinfos());

		return ResultUtils.renderSuccessResult(in);
	}

	/**
	 * ELS_STUB_016 修改工资模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("修改工资模板，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		StubTemplate in = JSONUtils.deserialize(data, StubTemplate.class);
		if (null == in) {
			throw new BaseException("输入数据为空！");
		}
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		in.setOrgId(orgId);

		if (StringUtils.isEmpty(in.getId())) {
			throw new BaseException("模板ID不可为空！");
		}
		// 删除该模板ID模板明细

		String vldJql = "DELETE FROM ELS_STUB_TEMPLATEINFO WHERE TEMPLATE_ID = ? ";
		this.stubTemplateinfoManager.executeSql(vldJql, in.getId());
		
		for (StubTemplateinfo sti : in.getStubTemplateinfos()) {
			sti.setTemplateId(in.getId());
			sti.setTemplate(in.getTemplate());
		}
		this.stubTemplateinfoManager.batchSave(in.getStubTemplateinfos());
		// 修改模板
		this.stubTemplateManager.save(in);


		return ResultUtils.renderSuccessResult(in);
	}

	/**
	 * ELS_STUB_018 删除工资模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		log.info("删除批次明细，输入数据为：" + id);

		if (StringUtils.isEmpty(id)) {
			throw new BaseException("批次ID不可为空！");
		}

		String jql = "from StubBatch where templateId = ? ";
		List<StubBatch> lsout= this.stubBatchManager.find(jql, id);
		if( lsout.size()>0 ) throw new BaseException("工资批次表中存在应用该模板的数据,请先删除工资批次数据！");
		
		//删除模板明细
		String vldJql = "delete from ELS_STUB_TEMPLATEINFO where template_Id = ? ";
		this.stubTemplateinfoManager.executeSql(vldJql, id);
		
		//删除模板
		StubTemplate tin = this.stubTemplateManager.delete(id);
		if (null == tin) {
			throw new BaseException("删除模板不存在！");
		}

		return ResultUtils.renderSuccessResult();
	}

	/**
	 * ELS_STUB_018 批量删除工资模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/deletes/{ids}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletes(@PathVariable("ids") String ids) {
		log.info("删除批次明细，输入数据为：" + ids);
		if (StringUtils.isEmpty(ids)) {
			throw new BaseException("输入数据为空！");
		}
		
		//删除模板明细
		String vldJql = "from StubTemplateinfo where templateId in ( ? )";
		this.stubTemplateManager.executeSql(vldJql, ids);
		
		//删除模板
		vldJql = "from StubTemplate where id in ( ? )";
		this.stubTemplateManager.executeSql(vldJql, ids);

		return ResultUtils.renderSuccessResult();
	}

	/**
	 * ELS_STUB_014	查询工资明细模板列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "template", defaultValue = "") String template,
			@RequestParam(value = "createAt", defaultValue = "") String createAt) {

		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		log.info("分页查询工资明细模板列表，输入数据为：【" + orgId + "】");
		if (StringUtils.isEmpty(orgId)) {
			throw new BaseException("输入数据为空！");
		}
		List<String> al = new ArrayList<String>();
		al.add(orgId);
		
		String hsql = "from StubTemplate where orgId = ? ";
		if( !(StringUtils.isEmpty(template)) ) {
			hsql += "and template like ? ";
			al.add("%"+template+"%");
		}
		if( !(StringUtils.isEmpty(createAt)) ) {
			hsql += "and createAt like ?";
			al.add("%"+createAt+"%");
		}		

		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);

		p.setQuery(hsql);
		p.setValues(al.toArray());
		
		this.stubTemplateManager.findPage(p);

		return ResultUtils.renderSuccessResult(p);
	}

	/**
	 * ELS_STUB_015	查询工资明细模板详情
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/detail/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable(value = "id") String templateId) {
		log.info("查询工资明细模板详情，输入数据为：【" + templateId + "】");
		if (StringUtils.isEmpty(templateId)) {
			throw new BaseException("输入数据为空！");
		}
		
		StubTemplate out = this.stubTemplateManager.get(templateId);
		
		String vldJql = "from StubTemplateinfo where templateId = ? order by seqno";
		List<StubTemplateinfo> sti = this.stubTemplateinfoManager.find(vldJql, templateId);		
		out.setStubTemplateinfos(sti);
		return ResultUtils.renderSuccessResult(sti);
	}
	/**
	 * ELS_STUB_017	下载工资明细模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/export/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDownload(HttpServletRequest request,
			HttpServletResponse response,@PathVariable(value = "id") String templateId) {
		log.info("下载工资明细模板，输入数据为：【" + templateId + "】");
		if (StringUtils.isEmpty(templateId)) {
			throw new BaseException("输入数据为空！");
		}
		
		try {
			StubTemplate out = this.stubTemplateManager.get(templateId);
			
			String vldJql = "from StubTemplateinfo where templateId = ? order by seqNo";
			List<StubTemplateinfo> sti = this.stubTemplateinfoManager.find(vldJql, templateId);		
			out.setStubTemplateinfos(sti);
			byte[] fileNameByte = (out.getTemplate()+".xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportStubTemplate(response.getOutputStream(), out);
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return ResultUtils.renderSuccessResult();
	}
	private void exportStubTemplate(OutputStream os, StubTemplate list) throws Exception{
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			List<Object> headlist = new ArrayList<Object>();

			// sheet页
		    HSSFWorkbook workbook = new HSSFWorkbook();// 生成excel文件
		    HSSFSheet sheet = workbook.createSheet(list.getTemplate());// 创建工作薄(sheet)
		    sheet.setDefaultColumnWidth((short) 20);
		    
		    // 列样式
		    HSSFCellStyle columnStyle = PoiWriter.getContentStyle(workbook);
		    HSSFFont columnfont = workbook.createFont();
		    columnfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		    columnStyle.setFont(columnfont);
		    HSSFCellStyle TextStyle = workbook.createCellStyle();
	        HSSFDataFormat format = workbook.createDataFormat();
	        TextStyle.setDataFormat(format.getFormat("@"));
	        TextStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			headlist.add("序号");
			headlist.add("身份证号");
			headlist.add("姓名");
			headlist.add("备注");
		    sheet.setDefaultColumnStyle(1, TextStyle);
		    sheet.setColumnWidth(0, 3000);
		    sheet.setColumnWidth(1, 6000);
		    sheet.setDefaultColumnStyle(2, TextStyle);
		    sheet.setColumnWidth(2, 6000);
		    sheet.setDefaultColumnStyle(3, TextStyle);
		    sheet.setColumnWidth(3, 6000);
		    int k=4;
			for (StubTemplateinfo item : list.getStubTemplateinfos()) {
				headlist.add(item.getItem());
				if(item.getIsAmt().equals("0")){
				    sheet.setDefaultColumnStyle(k, TextStyle);
				}
			    sheet.setColumnWidth(k, 4000);
				k++;
			}
		    
		    // 表头行
		    int size = headlist.size() - 1;
		    HSSFCellStyle titleStyle = PoiWriter.getTitleStyle(workbook);
		    HSSFRow row = sheet.createRow((short) 0);
		    HSSFCell ce = row.createCell(2);
		    ce.setCellType(HSSFCell.CELL_TYPE_STRING);
		    ce.setCellValue(list.getTemplate()); // 表格的第一行第一列显示的数据
		    ce.setCellStyle(titleStyle);
		    row.createCell(0).setCellValue("模板ID(不可修改):");
		    row.createCell(1).setCellValue(list.getId());
		    Region region = new Region(0, (short) 2, 0, (short) size);
		    PoiWriter.setRegionStyle(sheet, region, titleStyle);
		    sheet.addMergedRegion(region);
	        
		    // 标题栏
		    HSSFRow colrow = sheet.createRow(1);// 新建第二行
		    for (int i = 0; i < headlist.size(); i++) {
				HSSFCell colcell = colrow.createCell(i);
				colcell.setCellValue((String) headlist.get(i));
				colcell.setCellType(HSSFCell.CELL_TYPE_STRING);
				colcell.setCellStyle(columnStyle);
				Region columnRegion3 = new Region(2, (short) i, 2, (short) i);
				PoiWriter.setRegionStyle(sheet, columnRegion3, columnStyle);
				sheet.addMergedRegion(columnRegion3);
		    }
		    
		    bos = new BufferedOutputStream(os);
		    workbook.write(bos);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		    if (bis != null) {
			    bis.close();
			}
		    if (bos != null) {
			    bos.close();
		    }
		}
	}
	
}
