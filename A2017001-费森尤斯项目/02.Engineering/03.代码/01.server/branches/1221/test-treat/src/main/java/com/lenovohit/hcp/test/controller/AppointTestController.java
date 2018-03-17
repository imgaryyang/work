  package com.lenovohit.hcp.test.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.test.model.TestAppoint;
import com.lenovohit.hcp.test.model.TestDepartment;

// 预约挂号
@RestController
@RequestMapping("/hcp/app/his/appoint")
public class AppointTestController extends AuthorityRestController {
	@Autowired
	private GenericManager<TestAppoint, String> testAppointManager;
	@Autowired
	private GenericManager<TestDepartment, String> testDepartmentManager;

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forList Start ========\ndata:\n"+data);
			TestAppoint query =  JSONUtils.deserialize(data, TestAppoint.class);
			StringBuilder jql = new StringBuilder( " from TestAppoint where 1=1 ");
			List<Object> values = new ArrayList<Object>();
			
			if(!StringUtils.isEmpty(query)) {
				if(!StringUtils.isEmpty(query.getHosNo())){
					jql.append(" and hosNo = ? ");
					values.add(query.getHosNo());
				}
				
				if(!StringUtils.isEmpty(query.getSchNo())){
					jql.append(" and schNo = ? ");
					values.add(query.getSchNo());
				}
			}
			jql.append(" and (status is null or status = '') order by abs(num)");
			List<TestAppoint> appoints = this.testAppointManager.find(jql.toString(),values.toArray());
			
			log.info("\n======== forList Success End ========\nlist:\n"+JSONUtils.serialize(appoints));
			return ResultUtils.renderSuccessResult(appoints);
		} catch (Exception e) {
			log.error("\n======== forList Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	@RequestMapping(value = "/deptList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forDeptList Start ========\ndata:\n"+data);
			TestDepartment query =  JSONUtils.deserialize(data, TestDepartment.class);
			StringBuilder jql = new StringBuilder( " from TestDepartment where 1=1 ");
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
				
				if(!StringUtils.isEmpty(query.getName())){
					jql.append(" and name = ? ");
					values.add(query.getName());
				}
			}
			jql.append(" order by abs(sort)");
			List<TestDepartment> departments = this.testDepartmentManager.find(jql.toString(),values.toArray());
			
			log.info("\n======== forDeptList Success End ========\nlist:\n"+JSONUtils.serialize(departments));
			return ResultUtils.renderSuccessResult(departments);
		} catch (Exception e) {
			log.error("\n======== forDeptList Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	@RequestMapping(value = "/reserved/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forReservedList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forReservedList Start ========\ndata:\n"+data);
			TestAppoint query =  JSONUtils.deserialize(data, TestAppoint.class);
			StringBuilder jql = new StringBuilder( " from TestAppoint where 1=1 ");
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
				
				if(!StringUtils.isEmpty(query.getProNo()) || !StringUtils.isEmpty(query.getMobile())){
					jql.append(" and (proNo = ? or mobile = ?) ");
					values.add(query.getProNo());
					values.add(query.getMobile());
				}
			}

//			if(StringUtils.isEmpty(query))		throw new BaseException("参数错误！");
//			jql.append(" and hosNo = ? and (proNo = ? or (mobile = ? and idNo = ?))");
//			jql.append(" and hosNo = ? and (proNo = ? or mobile = ?)");
//			values.add(query.getHosNo());
//			values.add(query.getProNo());
//			values.add(query.getMobile());
//			values.add(query.getIdNo());
			jql.append(" and status is not null order by appointTime desc, abs(num)");
			List<TestAppoint> appoints = this.testAppointManager.find(jql.toString(),values.toArray());
			
			log.info("\n======== forReservedList Success End ========\nlist:\n"+JSONUtils.serialize(appoints));
			return ResultUtils.renderSuccessResult(appoints);
		} catch (Exception e) {
			log.error("\n======== forReservedList Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	@RequestMapping(value = "/reserve", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReserve(@RequestBody String data) {
		try {
			log.info("\n======== forReserve Start ========\ndata:\n"+data);
			TestAppoint appoint =  JSONUtils.deserialize(data, TestAppoint.class);
			
			TestAppoint model = this.testAppointManager.get(appoint.getId());
			model.setProNo(appoint.getProNo());
			model.setProName(appoint.getProName());
			model.setCardNo(appoint.getCardNo());
			model.setIdNo(appoint.getIdNo());
			model.setMobile(appoint.getMobile());
			model.setStatus("1");
			model.setStatusName("已预约");
			model.setAppointTime(new Date());
			TestAppoint saved = this.testAppointManager.save(model);
			
			log.info("\n======== forReserve Success End ========\nlist:\n"+JSONUtils.serialize(saved));
			return ResultUtils.renderSuccessResult(saved);
		} catch (Exception e) {
			log.error("\n======== forReserve Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

	
	@RequestMapping(value = "/sign", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSign(@RequestBody String data) {
		try {
			log.info("\n======== forSign Start ========\ndata:\n"+data);
			TestAppoint appoint =  JSONUtils.deserialize(data, TestAppoint.class);
			
			TestAppoint model = this.testAppointManager.get(appoint.getId());
			model.setProNo(appoint.getProNo());
			model.setProName(appoint.getProName());
			model.setCardNo(appoint.getCardNo());
			model.setStatus("2");
			model.setStatusName("已签到");
			model.setSignTime(new Date());
			TestAppoint saved = this.testAppointManager.save(model);
			
			log.info("\n======== forSign Success End ========\nlist:\n"+JSONUtils.serialize(saved));
			return ResultUtils.renderSuccessResult(saved);
		} catch(Exception e) {
			log.error("\n======== forSign Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

	@RequestMapping(value = "/cancel", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancel(@RequestBody String data) {
		try {
			log.info("\n======== forCancel Start ========\ndata:\n"+data);
			TestAppoint appoint =  JSONUtils.deserialize(data, TestAppoint.class);
			
			TestAppoint model = this.testAppointManager.get(appoint.getId());
			model.setStatus("3");
			model.setStatusName("已取消");
			
			TestAppoint newAppoint = new TestAppoint();
			BeanUtils.copyProperties(model, newAppoint);

			newAppoint.setId(null);
			newAppoint.setProNo(null);
			newAppoint.setProName(null);
			newAppoint.setCardNo(null);
			newAppoint.setMobile(null);
			newAppoint.setIdNo(null);
			newAppoint.setStatus(null);
			newAppoint.setStatusName(null);
			
			TestAppoint saved = this.testAppointManager.save(model);
			this.testAppointManager.save(newAppoint);

			log.info("\n======== forCancel Success End ========\nlist:\n"+JSONUtils.serialize(saved));
			return ResultUtils.renderSuccessResult(saved);
		} catch(Exception e) {
			log.error("\n======== forCancel Exception End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
