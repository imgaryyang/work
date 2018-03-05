package com.lenovohit.ebpp.bill.web.rest;

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
import com.lenovohit.ebpp.bill.model.BillCatalog;
import com.lenovohit.ebpp.bill.model.BillType;
import com.lenovohit.ebpp.bill.model.BizChannel;

@RestController
@RequestMapping("/bill/type")
public class BillTypeRestController extends BaseRestController {

	@Autowired
	private GenericManager<BillType, String> billTypeManager;
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;
	@Autowired
	private GenericManager<BillCatalog, String> billCatalogManager;

	/**
	 * 创建账单类型，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("创建账单类型，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BillType bt = JSONUtils.deserialize(data, BillType.class);
		if (null == bt) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(bt.getCode())) {
			throw new BaseException("账单类型号不可为空！");
		}

		String vldJql = "from BillType where code = ? ";

		List<BillType> lst = (List<BillType>) this.billTypeManager.findByJql(vldJql, bt.getCode());

		if (lst.size() > 0) {
			throw new BaseException("该账单类型号已存在！");
		}

		vldJql = "from BillType where code != ? and name = ? ";
		lst = (List<BillType>) this.billTypeManager.findByJql(vldJql, bt.getCode(), bt.getName());

		if (lst.size() > 0) {
			throw new BaseException("该账单类型名已存在！");
		}
		if(StringUtils.isNotBlank(bt.getBizChannel())){
			BizChannel biz = bizChannelManager.get(bt.getBizChannel());
			if (null == biz) {
				throw new BaseException("无效的业务渠道！");
			}
		}
		if(StringUtils.isNotBlank(bt.getCatalog())){
			BillCatalog bic = billCatalogManager.get(bt.getCatalog());
			if (null == bic) {
				throw new BaseException("无效的账单类别！");
			}
		}
		bt.setStatus(BillType.STATUS_ENABLED);
		bt.setRegeditedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));

		this.billTypeManager.save(bt);

		return ResultUtils.renderSuccessResult(bt);
	}

	/**
	 * 创建账单类型，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("更新账单类型，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BillType bt = JSONUtils.deserialize(data, BillType.class);
		if (null == bt) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(bt.getCode())) {
			throw new BaseException("账单类型号不可为空！");
		}

		BillType tbt = this.billTypeManager.get(bt.getCode());
		if (null == tbt) {
			throw new BaseException("更新账单类型不存在！");
		}

		String vldJql = "from BillType where code != ? and name = ? ";

		@SuppressWarnings("unchecked")
		List<BillType> lst = (List<BillType>) this.billTypeManager.findByJql(vldJql, bt.getCode(), bt.getName());

		if (lst.size() > 0) {
			throw new BaseException("该账单类型名已存在！");
		}

		tbt.setName(bt.getName());
		tbt.setMemo(bt.getMemo());
		if(StringUtils.isNotBlank(bt.getBizChannel())){
			BizChannel biz = bizChannelManager.get(bt.getBizChannel());
			if (null == biz) {
				throw new BaseException("无效的业务渠道！");
			}
			tbt.setBizChannel(bt.getBizChannel());
		}
		if(StringUtils.isNotBlank(bt.getCatalog())){
			BillCatalog bic = billCatalogManager.get(bt.getCatalog());
			if (null == bic) {
				throw new BaseException("无效的账单类别！");
			}
			tbt.setCatalog(bt.getCatalog());
		}
		
		if(StringUtils.isNotBlank(bt.getStatus()) && BillType.hasStatus(bt.getStatus())){
			tbt.setStatus(bt.getStatus());
		}
		

		this.billTypeManager.save(tbt);

		return ResultUtils.renderSuccessResult(tbt);
	}

	/**
	 * 分页查询账单类型
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/query", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forQuery(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询账单类型，输入查询内容为：" + data);
		Page p = new Page();
		String jql = "from BillType where 1=1 ";
		Map<String, Object> params;
		List<Object> values = new ArrayList<Object>();
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
			if(null != params.get("memo") && StringUtils.isNotEmpty(params.get("memo").toString())){
				jql += "and memo like ? ";
				values.add("%" + params.get("memo").toString() + "%");
			}
		}
		
		if(!values.isEmpty()){
			p.setValues(values.toArray());
		}
		
		p.setQuery(jql);
		this.billTypeManager.findPage(p);

		return p;
	}

	/**
	 * 通过账单类型编号查询账单类型
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("code") String code) {
		log.info("查询账单类型，输入code为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(code)) {
			throw new BaseException("账单类型号不可为空！");
		}

		BillType tbt = this.billTypeManager.get(code);
		if (null == tbt) {
			throw new BaseException("账单类型【" + code + "】不存在！");
		}

		return ResultUtils.renderSuccessResult(tbt);
	}
	
	/**
	 * 弃用账单类型
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forAbandon(@PathVariable(value = "code") String code) {
		log.info("弃用账单类型，输入数据为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		BillType tbt = this.billTypeManager.get(code);
		if (null == tbt) {
			throw new BaseException("弃用账单类型【" + code + "】不存在！");
		}

		tbt.setStatus(BizChannel.STATUS_DISABLED);

		tbt = this.billTypeManager.save(tbt);

		return ResultUtils.renderSuccessResult(tbt);
	}
}
