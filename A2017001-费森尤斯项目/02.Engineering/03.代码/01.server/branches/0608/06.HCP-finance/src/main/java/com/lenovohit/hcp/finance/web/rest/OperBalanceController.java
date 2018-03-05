package com.lenovohit.hcp.finance.web.rest;

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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.manager.CheckOutStatisticsManager;
import com.lenovohit.hcp.finance.model.AccountItemStatisticsDto;
import com.lenovohit.hcp.finance.model.OperBalance;
import com.lenovohit.hcp.finance.model.PayWayStatisticsDto;

/**
 * 会计收款
 */
@RestController
@RequestMapping("/hcp/finance/operBalance")
public class OperBalanceController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OperBalance, String> operBalanceManager;

	@Autowired
	private CheckOutStatisticsManager checkOutStatisticsManager;

	@RequestMapping(value = "/update/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id) {
		OperBalance model = operBalanceManager.get(id);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		if (true == model.getIscheck()) {
			model.setCheckOper("");
			model.setCheckOperId("");
			model.setCheckTime(null);
			model.setIscheck(OperBalance.UN_CHECK);
		} else {
			model.setCheckOper(getCurrentUser().getName());
			model.setCheckOperId(getCurrentUser().getId());
			model.setCheckTime(new Date());
			model.setIscheck(OperBalance.CHECKED);
		}
		this.operBalanceManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		OperBalance query = JSONUtils.deserialize(data, OperBalance.class);
		StringBuilder jql = new StringBuilder("from OperBalance where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		Date[] date = query.getDateRange();
		if (!StringUtils.isEmpty(query.getInvoiceSource())) {
			jql.append("and invoiceSource = ? ");
			values.add(query.getInvoiceSource());
		}
		if (date != null && date.length == 2) {
			jql.append("and balanceTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and balanceTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		if (!StringUtils.isEmpty(query.getInvoiceOper())) {
			jql.append("and invoiceOper like ? ");
			values.add(query.getInvoiceOper());
		}
		if (!StringUtils.isEmpty(query.getIscheck())) {
			jql.append("and isCheck = ? ");
			values.add(query.getIscheck());
		}
		jql.append("order by updateTime desc");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		operBalanceManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/statistics/payWay", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result queryByPayWay(@RequestParam(value = "data", defaultValue = "") String data) {
		OperBalance query = JSONUtils.deserialize(data, OperBalance.class);
		StringBuilder jql = new StringBuilder("from OperBalance where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		Date[] date = query.getDateRange();
		jql.append("and hosId = ? ");
		values.add(getCurrentUser().getHosId());
		if (!StringUtils.isEmpty(query.getInvoiceSource())) {
			jql.append("and invoiceSource = ? ");
			values.add(query.getInvoiceSource());
		}
		if (date != null && date.length == 2) {
			jql.append("and balanceTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and balanceTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		if (!StringUtils.isEmpty(query.getInvoiceOper())) {
			jql.append("and invoiceOper like ? ");
			values.add(query.getInvoiceOper());
		}
		if (!StringUtils.isEmpty(query.getIscheck())) {
			jql.append("and isCheck = ? ");
			values.add(query.getIscheck());
		}
		jql.append("order by updateTime desc");
		List<PayWayStatisticsDto> result;
		try {
			List<OperBalance> operBalances = operBalanceManager.find(jql.toString(), values.toArray());
			result = checkOutStatisticsManager.listPayWayStatistics(operBalances);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取统计信息失败，信息为：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(result);
	}

	@RequestMapping(value = "/statistics/accountItem", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result queryByAccountItem(@RequestParam(value = "data", defaultValue = "") String data) {
		OperBalance query = JSONUtils.deserialize(data, OperBalance.class);
		StringBuilder jql = new StringBuilder("from OperBalance where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId = ? ");
		values.add(getCurrentUser().getHosId());
		Date[] date = query.getDateRange();
		if (!StringUtils.isEmpty(query.getInvoiceSource())) {
			jql.append("and invoiceSource = ? ");
			values.add(query.getInvoiceSource());
		}
		if (date != null && date.length == 2) {
			jql.append("and balanceTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and balanceTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		if (!StringUtils.isEmpty(query.getInvoiceOper())) {
			jql.append("and invoiceOper like ? ");
			values.add(query.getInvoiceOper());
		}
		if (!StringUtils.isEmpty(query.getIscheck())) {
			jql.append("and isCheck = ? ");
			values.add(query.getIscheck());
		}
		jql.append("order by updateTime desc");
		List<AccountItemStatisticsDto> result;
		try {
			List<OperBalance> operBalances = operBalanceManager.find(jql.toString(), values.toArray());
			result = checkOutStatisticsManager.listAccountItemStatistics(operBalances);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取统计信息失败，信息为：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(result);
	}
}
