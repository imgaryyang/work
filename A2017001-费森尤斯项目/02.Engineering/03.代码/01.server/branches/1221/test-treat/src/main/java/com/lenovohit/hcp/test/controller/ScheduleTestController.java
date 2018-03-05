  package com.lenovohit.hcp.test.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.test.model.TestSchedule;

/**
 * 医院管理
 * 
 */
@RestController
@RequestMapping("/hcp/app/his/schedule")
public class ScheduleTestController extends AuthorityRestController {

	@Autowired
	private GenericManager<TestSchedule, String> testScheduleManager;

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forList Start ========\ndata:\n"+data);
			TestSchedule query =  JSONUtils.deserialize(data, TestSchedule.class);
			StringBuilder jql = new StringBuilder( " from TestSchedule where 1=1 ");
			List<Object> values = new ArrayList<Object>();
			
			if(!StringUtils.isEmpty(query)) {
				if(!StringUtils.isEmpty(query.getHosId())){
					jql.append(" and hosId = ? ");
					values.add(query.getHosId());
				}
				
				if(!StringUtils.isEmpty(query.getHosNo())){
					jql.append(" and hosNo = ? ");
					values.add(query.getHosNo());
				}
				
				if(!StringUtils.isEmpty(query.getDepNo())){
					jql.append(" and depNo = ? ");
					values.add(query.getDepNo());
				}

				if(!StringUtils.isEmpty(query.getStartDate())){
					jql.append(" and clinicDate >= ? ");
					values.add(query.getStartDate());
				}
				
				if(!StringUtils.isEmpty(query.getEndDate())){
					jql.append(" and clinicDate <= ? ");
					values.add(query.getEndDate());
				}
			}
			jql.append("order by clinicDate, shift, docName, abs(no)");
			List<TestSchedule> schedules = this.testScheduleManager.find(jql.toString(),values.toArray());
			
			log.info("\n======== forList Success End ========\nlist:\n"+JSONUtils.serialize(schedules));
			return ResultUtils.renderSuccessResult(schedules);
		} catch (Exception e) {
			log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
