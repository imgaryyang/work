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
import com.infohold.ebpp.bill.model.PayChannel;

@RestController
@RequestMapping("/bill/paychannel")
public class PayChannelRestController extends BaseRestController {

	@Autowired
	private GenericManager<PayChannel, String> payChannelManager;
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;
	/**
	 * 创建支付渠道，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("创建支付渠道，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		PayChannel pc = JSONUtils.deserialize(data, PayChannel.class);
		if (null == pc) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(pc.getCode())) {
			throw new BaseException("支付渠道号不可为空！");
		}

		String vldJql = "from PayChannel where code = ? ";

		List<PayChannel> lst = (List<PayChannel>) this.payChannelManager.findByJql(vldJql, pc.getCode());

		if (lst.size() > 0) {
			throw new BaseException("该支付渠道号已存在！");
		}

		vldJql = "from PayChannel where code != ? and name = ? ";
		lst = (List<PayChannel>) this.payChannelManager.findByJql(vldJql, pc.getCode(), pc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该支付渠道名已存在！");
		}
		pc.setStatus(PayChannel.STATUS_ENABLED);
		pc.setCreatedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));

		this.payChannelManager.save(pc);

		return ResultUtils.renderSuccessResult(pc);
	}

	/**
	 * 创建支付渠道，并设置为可用状态
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable(value = "code") String code, @RequestBody String data) {
		log.info("更新支付渠道【" + code + "】，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		
		PayChannel tpc = this.payChannelManager.get(code);
		if (null == tpc) {
			throw new BaseException("更新支付渠道不存在！");
		}
		
		PayChannel pc = JSONUtils.deserialize(data, PayChannel.class);
		if (null == pc) {
			throw new BaseException("输入数据为空！");
		}

		String vldJql = "from PayChannel where code != ? and name = ? ";

		@SuppressWarnings("unchecked")
		List<PayChannel> lst = (List<PayChannel>) this.payChannelManager.findByJql(vldJql, code, pc.getName());

		if (lst.size() > 0) {
			throw new BaseException("该支付渠道名已存在！");
		}

		tpc.setName(pc.getName());
		tpc.setMemo(pc.getMemo());
		
		if(StringUtils.isNotBlank(pc.getBizChannel())){
			BizChannel biz = bizChannelManager.get(pc.getBizChannel());
			if (null == biz) {
				throw new BaseException("无效的业务渠道！");
			}
		}
		tpc.setBizChannel(pc.getBizChannel());
		if(StringUtils.isNotBlank(pc.getStatus()) && PayChannel.hasStatus(pc.getStatus())){
			tpc.setStatus(pc.getStatus());
		}

		tpc = this.payChannelManager.save(tpc);

		return ResultUtils.renderSuccessResult(tpc);
	}

	/**
	 * 分页查询支付渠道
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/query", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forQuery(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询支付渠道，输入查询内容为：" + data);
		Page p = new Page();
		String jql = "from PayChannel where 1=1 ";
		Map<String, Object> params;
		List<Object> values = new ArrayList<Object>();
		if (StringUtils.isNotBlank(data)) {
			params = JSONUtils.deserialize(data, HashMap.class);
			if (null != params.get("pageSize")) {
				p.setPageSize(params.get("pageSize").toString());
			}

			if (null != params.get("start")) {
				p.setStart(params.get("start").toString());
			}

			if (null != params.get("code") && StringUtils.isNotEmpty(params.get("code").toString())) {
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
		}

		if (!values.isEmpty()) {
			p.setValues(values.toArray());
		}

		p.setQuery(jql);
		this.payChannelManager.findPage(p);

		return p;
	}

	/**
	 * 通过支付渠道编号查询支付渠道
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("code") String code) {
		log.info("查询支付渠道，输入code为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(code)) {
			throw new BaseException("支付渠道号不可为空！");
		}

		PayChannel tpc = this.payChannelManager.get(code);
		if (null == tpc) {
			throw new BaseException("支付渠道【" + code + "】不存在！");
		}

		return ResultUtils.renderSuccessResult(tpc);
	}
	
	
	/**
	 * 停用支付渠道
	 * @param code
	 * @return
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forAbandon(@PathVariable(value = "code") String code) {
		log.info("停用业务渠道，输入数据为：【" + code + "】");
		if (StringUtils.isEmpty(code)) {
			throw new BaseException("输入数据为空！");
		}

		PayChannel tpc = this.payChannelManager.get(code);
		if (null == tpc) {
			throw new BaseException("停用业务渠道不存在！");
		}

		tpc.setStatus(PayChannel.STATUS_DISABLED);

		tpc = this.payChannelManager.save(tpc);

		return ResultUtils.renderSuccessResult(tpc);
	}

}
