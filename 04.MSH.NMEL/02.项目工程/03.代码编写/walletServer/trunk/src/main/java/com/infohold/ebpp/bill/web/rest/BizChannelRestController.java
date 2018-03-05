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
import com.infohold.ebpp.bill.model.BizChannel;

@RestController
@RequestMapping("/bill/bizchannel")
public class BizChannelRestController extends BaseRestController {

	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;

	/**
	 * 创建业务渠道，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("创建业务渠道，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BizChannel bc = JSONUtils.deserialize(data, BizChannel.class);
		if (null == bc) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(bc.getCode())) {
			throw new BaseException("业务渠道号不可为空！");
		}

		String vldJql = "from BizChannel where code = ? ";

		List<BizChannel> lst = (List<BizChannel>) this.bizChannelManager.findByJql(vldJql, bc.getCode());

		if (lst.size() > 0) {
			throw new BaseException("该业务渠道号已存在！");
		}

		vldJql = "from BizChannel where code != ? and name = ? ";
		lst = (List<BizChannel>) this.bizChannelManager.findByJql(vldJql, bc.getCode(), bc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该业务渠道名已存在！");
		}
		bc.setStatus(BizChannel.STATUS_ENABLED);
		bc.setRegistedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));

		this.bizChannelManager.save(bc);

		return ResultUtils.renderSuccessResult(bc);
	}

	/**
	 * 创建业务业务渠道，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable(value = "code") String code, @RequestBody String data) {
		log.info("更新业务渠道【" + code + "】，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		BizChannel tbc = this.bizChannelManager.get(code);
		if (null == tbc) {
			throw new BaseException("更新业务渠道不存在！");
		}

		BizChannel bc = JSONUtils.deserialize(data, BizChannel.class);
		if (null == bc) {
			throw new BaseException("输入数据为空！");
		}

		String vldJql = "from BizChannel where code != ? and name = ? ";

		@SuppressWarnings("unchecked")
		List<BizChannel> lst = (List<BizChannel>) this.bizChannelManager.findByJql(vldJql, code, bc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该业务渠道名已存在！");
		}

		tbc.setName(bc.getName());
		tbc.setMemo(bc.getMemo());
		tbc.setType(bc.getType());
		if (StringUtils.isNotBlank(bc.getStatus()) &&BizChannel.hasStatus(bc.getCode())) {
			tbc.setStatus(bc.getStatus());
		}

		tbc = this.bizChannelManager.save(tbc);

		return ResultUtils.renderSuccessResult(tbc);
	}

	/**
	 * 分页查询业务业务渠道
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pagesize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forQuery(@PathVariable(value = "start") int start, @PathVariable(value = "pagesize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询业务渠道，输入查询内容为：" + data);

		Page p = new Page();
		String jql = "from BizChannel where 1=1 ";

		p.setPageSize(pageSize);
		p.setStart(start);

		if (StringUtils.isNotEmpty(data)) {
			@SuppressWarnings("unchecked")
			Map<String, ?> params = JSONUtils.deserialize(data, HashMap.class);
			List<Object> values = new ArrayList<Object>();
			if (null != params.get("code") && StringUtils.isNoneBlank(params.get("code").toString())) {
				jql += "and code like ? ";
				values.add("%" + params.get("code").toString() + "%");
			}

			if (null != params.get("name") && StringUtils.isNotEmpty(params.get("name").toString())) {
				jql += "and name like ? ";
				values.add("%" + params.get("name").toString() + "%");
			}

			if (null != params.get("memo") && StringUtils.isNotEmpty(params.get("memo").toString())) {
				jql += "and memo like ? ";
				values.add("%" + params.get("memo").toString() + "%");
			}

			if (!values.isEmpty()) {
				p.setValues(values.toArray());
			}

		}

		p.setQuery(jql);

		this.bizChannelManager.findPage(p);

		return p;
	}

	/**
	 * 通过业务渠道编号查询业务业务渠道
	 * 
	 * @param code
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("code") String code) {
		log.info("查询业务渠道，输入code为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(code)) {
			throw new BaseException("业务渠道号不可为空！");
		}

		BizChannel tbc = this.bizChannelManager.get(code);
		if (null == tbc) {
			throw new BaseException("业务渠道【" + code + "】不存在！");
		}

		return ResultUtils.renderSuccessResult(tbc);
	}

	/**
	 * 停用支付渠道
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forAbandon(@PathVariable(value = "code") String code) {
		log.info("停用业务渠道，输入数据为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		BizChannel tbc = this.bizChannelManager.get(code);
		if (null == tbc) {
			throw new BaseException("停用业务渠道不存在！");
		}

		tbc.setStatus(BizChannel.STATUS_DISABLED);

		tbc = this.bizChannelManager.save(tbc);

		return ResultUtils.renderSuccessResult(tbc);
	}
}
