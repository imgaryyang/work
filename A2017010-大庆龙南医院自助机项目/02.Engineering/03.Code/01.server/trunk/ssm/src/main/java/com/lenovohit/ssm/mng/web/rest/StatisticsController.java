package com.lenovohit.ssm.mng.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Menu;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.Settlement;

/**
 * 统计
 * @author victor
 *
 */
@RestController
@RequestMapping("/ssm/statistics")
public class StatisticsController extends SSMBaseRestController {

	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@RequestMapping(value = "/ssmSettlement/channel/{startDate}/{endDate}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result ssmSumByChannel(@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate) {
		List<Object> settlements = (List<Object>)settlementManager.findBySql("select pay_channel_code, sum(amt) from ssm_settlement where status = '0' and create_time < ? and create_time > ? group by pay_channel_code", startDate, endDate);
		return ResultUtils.renderSuccessResult(settlements);
	}
	
}
