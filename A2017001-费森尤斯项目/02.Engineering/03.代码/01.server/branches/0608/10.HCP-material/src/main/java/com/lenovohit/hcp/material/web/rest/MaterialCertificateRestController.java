package com.lenovohit.hcp.material.web.rest;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.ICommonRedisSequenceManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.model.MatCertificate;

/**
 * 单级数据字典管理
 */
@RestController
@RequestMapping("/hcp/material/certificate")
public class MaterialCertificateRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<MatCertificate, String> materialCertificateManager;
	
	/*@Autowired
	private ICommonRedisSequenceManager commonRedisSequenceManager;*/
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, @RequestParam(value = "data", defaultValue = "") String data){
		MatCertificate query =  JSONUtils.deserialize(data, MatCertificate.class);
		
		StringBuilder jql = new StringBuilder( "from MatCertificate where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getRegNo())){
			jql.append("and regNo like ? ");
			values.add("%"+query.getRegNo()+"%");
		}

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		if(!StringUtils.isEmpty(query.getRegStartDate())){
			try {
				Date startDate = df.parse(DateUtils.date2String(query.getRegStartDate(), "yyyy-MM-dd") + " 00:00:00");
				jql.append("and regStartDate >= ? ");
				values.add(startDate);
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
		if(!StringUtils.isEmpty(query.getRegStopDate())){
			try {
				Date endDate = df.parse(DateUtils.date2String(query.getRegStopDate(), "yyyy-MM-dd") + " 00:00:00");
				jql.append("and regStopDate <= ? ");
				values.add(endDate);
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
		
		//增加排序字段
		jql.append("order by updateTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		materialCertificateManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/save",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@RequestBody String data){
		MatCertificate model =  JSONUtils.deserialize(data, MatCertificate.class);
		if (StringUtils.isEmpty(model.getRegName())) {
			model.setRegNameSpell(PinyinUtil.getFirstSpell(model.getRegName()));
			model.setRegNameWb(WubiUtil.getWBCode(model.getRegName()));
		}
		MatCertificate saved = this.materialCertificateManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelet(@PathVariable("id") String id){
		try {
			this.materialCertificateManager.delete(id);
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
	@RequestMapping(value = "/removeSelected",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteSelected(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM MATERIAL_CERTIFICATE WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			
			this.materialCertificateManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

}
