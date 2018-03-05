package com.infohold.ebpp.bill.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.ebpp.bill.model.BillCatalog;

@RestController
@RequestMapping("/bill/billcatalog")
public class BillCatalogRestController extends BaseRestController {

	@Autowired
	private GenericManager<BillCatalog, String> billCatalogManager;

	/**
	 * 创建业务账单类别，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		
		log.info("创建账单类别，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BillCatalog bc = JSONUtils.deserialize(data, BillCatalog.class);
		if (null == bc) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(bc.getCode())) {
			throw new BaseException("账单类别号不可为空！");
		}

		String vldJql = "from BillCatalog where code = ? ";
		List<BillCatalog> lst = null;
		try {
			lst = (List<BillCatalog>) this.billCatalogManager.findByJql(vldJql, bc.getCode());

			if (lst.size() > 0) {
				throw new BaseException("该账单类别号已存在！");
			}
		} catch (Exception e) {
			e.printStackTrace();
		
		}
		vldJql = "from BillCatalog where code != ? and name = ? ";
		lst = (List<BillCatalog>) this.billCatalogManager.findByJql(vldJql, bc.getCode(), bc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该账单类别名已存在！");
		}
		bc.setStatus(BillCatalog.STATUS_ENABLED);
		bc.setCreatedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));

		this.billCatalogManager.save(bc);

		return ResultUtils.renderSuccessResult(bc);
	}

	/**
	 * 更新业务账单类别，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("更新账单类别，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BillCatalog bc = JSONUtils.deserialize(data, BillCatalog.class);
		if (null == bc) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(bc.getCode())) {
			throw new BaseException("账单类别号不可为空！");
		}

		BillCatalog tbc = this.billCatalogManager.get(bc.getCode());
		if (null == tbc) {
			throw new BaseException("更新账单类别不存在！");
		}

		String vldJql = "from BillCatalog where code != ? and name = ? ";

		@SuppressWarnings("unchecked")
		List<BillCatalog> lst = (List<BillCatalog>) this.billCatalogManager.findByJql(vldJql, bc.getCode(), bc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该账单类别名已存在！");
		}

		tbc.setName(bc.getName());
		tbc.setMemo(bc.getMemo());
		if (StringUtils.isNotBlank(bc.getStatus()) && BillCatalog.hasStatus(bc.getStatus())) {
			tbc.setStatus(bc.getStatus());
		}
		if(StringUtils.isNotBlank(bc.getParent())){
			BillCatalog pbc = billCatalogManager.get(bc.getParent());
			if (null == pbc) {
				throw new BaseException("无效的上级类别！");
			}
			tbc.setParent(bc.getParent());
		}
		this.billCatalogManager.save(tbc);

		return ResultUtils.renderSuccessResult(tbc);
	}

	/**
	 * 分页查询业务账单类别
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/query", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forQuery(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询账单类别，输入查询内容为：" + data);
		Map<String, Object> params = null;
		Page p = new Page();
		List<Object> values = new ArrayList<Object>();
		String jql = "from BillCatalog where 1=1 ";
		if (StringUtils.isNotBlank(data)) {
			params = JSONUtils.deserialize(data, HashMap.class);
			 
			if(null != params.get("pageSize")){
				p.setPageSize(params.get("pageSize").toString());
			}
			
			if(null != params.get("start")){
				p.setStart(params.get("start").toString());
			}
			
			if(null != params.get("code") && StringUtils.isNotEmpty(params.get("code").toString())){
				jql += "and code like ? ";
				values.add("%" + params.get("code").toString() + "%");
			}
			
			if(null != params.get("name") && StringUtils.isNotEmpty(params.get("name").toString())){
				jql += "and name like ? ";
				values.add("%" + params.get("name").toString() + "%");
			}
			
			if(null != params.get("parent") && StringUtils.isNotEmpty(params.get("parent").toString())){
				jql += "and parent = ? ";
				values.add(params.get("parent").toString());
			}
			
			if(null != params.get("status") && StringUtils.isNotEmpty(params.get("status").toString())){
				jql += "and Status = ? ";
				values.add( params.get("status").toString());
			}
		}
		
		if(!values.isEmpty()){
			p.setValues(values.toArray());
		}
		
		p.setQuery(jql);
		this.billCatalogManager.findPage(p);

		return p;
	}

	/**
	 * 通过账单类别编号查询业务账单类别
	 * 
	 * @param code
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("code") String code) {
		log.info("查询账单类别，输入code为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(code)) {
			throw new BaseException("账单类别号不可为空！");
		}

		BillCatalog tbc = this.billCatalogManager.get(code);
		if (null == tbc) {
			throw new BaseException("账单类别【" + code + "】不存在！");
		}

		return ResultUtils.renderSuccessResult(tbc);
	}
	
	/**
	 * 停用账单类别
	 * @param code
	 * @return
	 */
	@RequestMapping(value="/{code}",method=RequestMethod.DELETE,produces = MediaTypes.JSON_UTF_8)
	public Result forAbandon(@PathVariable("code") String code){
		log.info("停用账单类别，输入数据为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}
		BillCatalog bcg = this.billCatalogManager.get(code);
		if(null==bcg){
			throw new BaseException("停用账单类别不存在");
		}
		bcg.setStatus(BillCatalog.STATUS_DISABLED);
		this.billCatalogManager.save(bcg);
		return ResultUtils.renderSuccessResult(bcg);
		
	}

}
