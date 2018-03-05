package com.lenovohit.elh.pay.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.elh.pay.model.Order;

@RestController
@RequestMapping("/elh/statistics")
public class StatisticsRestController extends BaseRestController {
	// ELH_STAT_002 查询综合统计信息（院端首页）
	// ELH_STAT_005 结算金额月报
	// ELH_STAT_008 结算人次月报

	@Autowired
	private GenericManager<Order, String> orderManager;

	/**
	 * 
	 * ELH_STAT_002 查询综合统计信息（院端首页）
	 * 
	 * **/
	@RequestMapping(value = "/multiple", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result multiple(@RequestParam(value = "hospId", defaultValue = "") String hospId) {
		if (StringUtils.isEmpty(hospId)) {
			throw new BaseException("请输入机构ID！");
		}

		try {
			List<Object[]> p = (List<Object[]>) orderManager
					.findBySql(
							"select sum(amount),sum(cash),sum(mi_payed), count(id) from ELH_ORDER where hospital = ? ",
							hospId );

			Object[] ps = (Object[]) p.get(0);
			
			List<Object> regstCount = (List<Object>) orderManager
					.findBySql(
							"select count(apur.ID) from EL_APPS ap,EL_APP_USER_REL apur where ap.BIZ_ID = ? and ap.ID = apur.APP_ID ",
							hospId );
			
			Object pd =  regstCount.get(0);

			Map<String, String> result = new HashMap<String, String>();
			result.put("allAmount", (ps[0] == null)?"0":ps[0].toString());
			result.put("cash", (ps[1] == null)?"0":ps[1].toString());
			result.put("reimburse", (ps[2] == null)?"0":ps[2].toString());
			result.put("perCount", ps[3].toString());
			result.put("regstCount", pd.toString());
			return ResultUtils.renderSuccessResult(result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);
	}

	/**
	 * ELH_STAT_005 结算金额月报
	 * 
	 * @param startDate
	 * @param endDate
	 * @param hospId
	 * @return
	 */
	@RequestMapping(value = "/month/amount", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMonthAmount(
			@RequestParam(value = "startDate", defaultValue = "") String startDate,
			@RequestParam(value = "endDate", defaultValue = "") String endDate,
			@RequestParam(value = "hospId", defaultValue = "") String hospId) {
		if (StringUtils.isEmpty(hospId)) {
			throw new BaseException("请输入机构ID！");
		}
		if (StringUtils.isEmpty(startDate)) {
			throw new BaseException("请输入起始日期！");
		}
		if (StringUtils.isEmpty(endDate)) {
			throw new BaseException("请输入结束日期！");
		}

		try {
			List<Object[]> p = (List<Object[]>) orderManager
					.findBySql(
							"select substring(pay_time,1,7),sum(amount),sum(cash),sum(mi_payed) from ELH_ORDER where hospital = ? and substring(pay_time,1,7) between ? and ? group by substring(pay_time,1,7) ",
							hospId, startDate, endDate);

			int count = p.size();

			List<Map> result = new ArrayList<Map>();

			for (int i = 0; i < count; i++) {
				Map<String, String> resultList = new HashMap<String, String>();

				Object[] ps = (Object[]) p.get(i);
				resultList.put("date", ps[0].toString());
				resultList.put("allAmount", (ps[1] == null)?"0":ps[1].toString());
				resultList.put("cash", (ps[2] == null)?"0":ps[2].toString());
				resultList.put("reimburse", (ps[3] == null)?"0":ps[3].toString());
				result.add(resultList);
			}
			return ResultUtils.renderSuccessResult(result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);
	}
	
	/**
	 * ELH_STAT_008 结算人次月报
	 * @param startDate
	 * @param endDate
	 * @param hospId
	 * @return
	 */
	@RequestMapping(value = "/month/count", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMonthCount(
			@RequestParam(value = "startDate", defaultValue = "") String startDate,
			@RequestParam(value = "endDate", defaultValue = "") String endDate,
			@RequestParam(value = "hospId", defaultValue = "") String hospId) {
		if (StringUtils.isEmpty(hospId)) {
			throw new BaseException("请输入机构ID！");
		}
		if (StringUtils.isEmpty(startDate)) {
			throw new BaseException("请输入起始日期！");
		}
		if (StringUtils.isEmpty(endDate)) {
			throw new BaseException("请输入结束日期！");
		}

		try {
			List<Object[]> p = (List<Object[]>) orderManager
					.findBySql(
							"select substring(pay_time,1,7),count(id) from ELH_ORDER where hospital = ? and substring(pay_time,1,7) between ? and ? group by substring(pay_time,1,7) ",
							hospId, startDate, endDate);

			int count = p.size();

			List<Map> result = new ArrayList<Map>();

			for (int i = 0; i < count; i++) {
				Map<String, String> resultList = new HashMap<String, String>();

				Object[] ps = (Object[]) p.get(i);
				resultList.put("date", ps[0].toString());
				resultList.put("perCount", ps[1].toString());
				result.add(resultList);
			}
			return ResultUtils.renderSuccessResult(result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);
	}

}
