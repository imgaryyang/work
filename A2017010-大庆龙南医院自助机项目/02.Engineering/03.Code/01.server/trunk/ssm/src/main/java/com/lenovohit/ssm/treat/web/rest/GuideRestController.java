package com.lenovohit.ssm.treat.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.treat.manager.HisGuideManager;
import com.lenovohit.ssm.treat.model.Clinical;
import com.lenovohit.ssm.treat.model.Guide;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * 就医指南
 */
@RestController
@RequestMapping("/ssm/treat/guide")
public class GuideRestController extends SSMBaseRestController {
	@Autowired
	private HisGuideManager hisGuideManager;

	/**
	 * 获取诊疗活动
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/clinical/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forClincalList(@RequestParam(value = "data", defaultValue = "") String data) {

		Clinical param = JSONUtils.deserialize(data, Clinical.class);

		HisListResponse<Clinical> response = hisGuideManager.getClinicals(param);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getList());
		} else {
			return ResultUtils.renderFailureResult();
		}
	}

	/**
	 * 获取诊疗活动的就医指南
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/content/{clinicalId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forGuideContent(@PathVariable("clinicalId") String clinicalId) {
		Clinical param = new Clinical();
		param.setClinicalId(clinicalId);
		HisListResponse<Guide> response = hisGuideManager.getGuides(param);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getList());
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	
	/**
	 * 获取诊疗活动的就医指南
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/contents", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forGuideContents(@RequestParam(value = "data", defaultValue = "") String data) {
		List<?> ids =  JSONUtils.deserialize(data, List.class);
		List<Clinical> clinicals = new ArrayList<Clinical>();
		for(Object id : ids){
			if(id == null)continue;
			String clinicalId = id.toString();
			HisListResponse<Clinical>  clinicalEntity = hisGuideManager.getClinical(clinicalId);
			List<Clinical> clinicalArray = clinicalEntity.getList();
			if(clinicalArray == null || clinicalArray.size()<1)continue;
			Clinical clinical = clinicalArray.get(0);
			System.out.println("clinical "+clinical.getClinicalId());
			HisListResponse<Guide> response = hisGuideManager.getGuides(clinical);
			if (null != response && response.isSuccess()) {
				clinical.setGuides(response.getList());
				clinicals.add(clinical); 
			} else {
				continue;
			}
		}
		return ResultUtils.renderSuccessResult(clinicals);
	}
	
	/**
	 * 交易完成后获取就医指南
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/tradeContents", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTradeGuideContents(@RequestParam(value = "data", defaultValue = "") String data) {
		List<?> ids =  JSONUtils.deserialize(data, List.class);
		List<Clinical> clinicals = new ArrayList<Clinical>();
		Clinical clinical = null;
		for(Object id : ids){
			if(id == null)continue;
			String tradeId = id.toString();
			clinical = new Clinical();
			clinical.setTradeId(tradeId);
			HisListResponse<Guide> response = hisGuideManager.getTradeGuides(clinical);
			if (null != response && response.isSuccess()) {
				clinical.setGuides(response.getList());
				clinicals.add(clinical); 
			} else {
				continue;
			}
		}
		return ResultUtils.renderSuccessResult(clinicals);
	}
}
