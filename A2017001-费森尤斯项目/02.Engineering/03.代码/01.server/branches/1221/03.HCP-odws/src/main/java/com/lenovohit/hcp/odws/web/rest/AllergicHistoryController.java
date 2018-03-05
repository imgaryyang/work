package com.lenovohit.hcp.odws.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.AllergicHistory;
import com.lenovohit.hcp.odws.model.InquiryRecord;

/**
 * 过敏史
 */
@RestController
@RequestMapping("/hcp/odws/allergicHistory")
public class AllergicHistoryController extends HcpBaseRestController {

	@Autowired
	private GenericManager<AllergicHistory, String> allergicHistoryManager;

	/**
	 * 根据患者id查询患者过敏史
	 * 
	 * @param patientId
	 * @return
	 */
	@RequestMapping(value = "/list/{patientId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisPage(@PathVariable("patientId") String patientId) {
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from AllergicHistory where patientId = ? order by createTime desc ");
		values.add(patientId);

		List<AllergicHistory> list = (List<AllergicHistory>) allergicHistoryManager.find(jql.toString(),
				values.toArray());
		return ResultUtils.renderSuccessResult(list);
	}

	/**
	 * 保存过敏记录
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@RequestBody String data) {

		HcpUser user = this.getCurrentUser();
		AllergicHistory model = JSONUtils.deserialize(data, AllergicHistory.class);
		AllergicHistory saved = allergicHistoryManager.save(model);
		
		//RestTemplate rt = 
		
		return ResultUtils.renderSuccessResult(saved);
	}

}
