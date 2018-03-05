package com.lenovohit.hcp.appointment.web.rest;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.manager.RegisterManager;
import com.lenovohit.hcp.appointment.manager.RegisterStatisticsManager;
import com.lenovohit.hcp.appointment.model.RegFree;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.appointment.model.RegInfoStatisticsDto;
import com.lenovohit.hcp.appointment.model.RegRefundDto;
import com.lenovohit.hcp.appointment.model.RegVisit;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;
import com.lenovohit.hcp.odws.model.MedicalOrder;

@RestController
@RequestMapping("/hcp/appointment/register/")
public class RegInfoRestController extends HcpBaseRestController {
	private static final String GET_REG_DEPT = "1";// 获取当前排班信息
	private static final String GET_REG_INFO = "2";// 获取当前挂号信息
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<RegVisit, String> regVisitManager;
	@Autowired
	private GenericManager<RegFree, String> regFreeManager;
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private RegisterManager registerManager;
	@Autowired
	private RegisterStatisticsManager registerStatisticsManager;
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;

	@RequestMapping(value = "/get/getTotalFee/{regLevel}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getTotalFee(@PathVariable("regLevel") String regLevel) {
		BigDecimal totalFee = getRegFee(regLevel);
		return ResultUtils.renderPageResult(totalFee);
	}

	private BigDecimal getRegFee(String regLevel) {
		List<RegFree> result = regFreeManager.find("from RegFree where regLevel = ? and hosId = ? ", regLevel,this.getCurrentUser().getHosId());
		BigDecimal totalFee = new BigDecimal(0);
		for (RegFree free : result) {
			totalFee = totalFee.add(free.getItemInfo().getUnitPrice());
		}
		return totalFee;
	}

	@RequestMapping(value = "/get/getCancelInfo/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getCancelInfo(@PathVariable("id") String id) {
		RegInfo info = regInfoManager.get(id);
		if (info == null)
			return ResultUtils.renderFailureResult("不存在对应的记录");
		RegRefundDto dto = new RegRefundDto();
		dto.setId(id);
		dto.setRegDept(info.getRegDept());
		dto.setRegLevel(info.getRegLevel());
		BigDecimal amt = getRegFee(info.getRegLevel());
		dto.setTotalAmt(amt);
		dto.setRefundAmt(amt);
		dto.setPayWays(getPayWay(info.getInvoiceNo()));
		return ResultUtils.renderSuccessResult(dto);
	}

	private List<PayWay> getPayWay(String invoiceNo) {
		InvoiceInfo info = invoiceInfoManager.findOneByProp("invoiceNo", invoiceNo);
		String hql = "from PayWay where invoiceNo = ? and plusMinus = ?";
		List<PayWay> payWays = payWayManager.find(hql, info.getInvoiceNo(), info.getPlusMinus());
		return payWays;
	}

	@RequestMapping(value = "/page/{type}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forShowPage(@PathVariable("type") String type, @PathVariable("start") String start,
			@PathVariable("limit") String limit, @RequestParam(value = "data", defaultValue = "") String data) {
		String hosId = this.getCurrentUser().getHosId();
		Date nowTime = new Date();
		List<Object> params = new ArrayList<>();
		if (GET_REG_DEPT.equals(type)) {
			params.add(hosId);
			params.add(nowTime);
			String jql = new String("from RegVisit where hosId = ? and ? between startTime and endTime");
			Page page = buildPage(start, limit, params, jql);
			regVisitManager.findPage(page);
			return ResultUtils.renderPageResult(page);
		} else if (GET_REG_INFO.equals(type)) {
			String jql = new String("from RegInfo where createTime between ? and ? ");
			params.add(HcpDateUtils.getBeginOfDay());
			params.add(HcpDateUtils.getEndOfDay());
			JSONObject jsStr = JSONObject.parseObject(data);
			if (!(StringUtils.isNotEmpty(jsStr) && "1".equals(jsStr.get("flag")))) {
				jql += " and hosId = ? ";
				params.add(hosId);
			}
			Page page = buildPage(start, limit, params, jql);
			regInfoManager.findPage(page);
			return ResultUtils.renderPageResult(page);
		}
		return null;
	}

	private Page buildPage(String start, String limit, List<Object> params, String hql) {
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(hql.toString());
		page.setValues(params.toArray());
		return page;
	}

	private void checkRegInfo(RegInfo info) {
		if (StringUtils.isBlank(info.getPatientId()))
			throw new RuntimeException("病人id不能为空");
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		
		
		RegInfo model = JSONUtils.deserialize(data, RegInfo.class);
		Date now = new Date();
		
		StringBuilder jql = new StringBuilder(" from RegInfo ri  where ri.hosId= ? and ri.patient.id = ? and ri.regLevel = ? and Convert(char(10),ri.createTime,112) = ? and ri.regState <> ?");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
	    values.add(model.getPatientId());
	    values.add(model.getRegLevel());
		values.add(DateUtils.date2String(now, "yyyyMMdd"));
		values.add(RegInfo.REG_CANCELED);
		List<RegInfo> regList = regInfoManager.find(jql.toString(), values.toArray());
		if(regList==null || regList.size()<=0 ){
			model.setRegState(RegInfo.REG_RESERVE_NUMED);
			model.setHosId(user.getHosId());
			model.setCreateOper(user.getName());
			model.setCreateOperId(user.getUserId());
			model.setCreateTime(now);
			model.setUpdateOper(user.getName());
			model.setUpdateOperId(user.getUserId());
			model.setUpdateTime(now);
			HisOrder saved = null;
			try {
				checkRegInfo(model);
				long before = System.currentTimeMillis();
				saved = this.registerManager.registerToPay(model);
				long time = System.currentTimeMillis() - before;
				System.out.println("执行时间为：" + time);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(e.getMessage());
				return ResultUtils.renderFailureResult("挂号失败，失败原因为：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(saved);
		}else{
			return ResultUtils.renderFailureResult("挂号失败，失败原因为：患者已挂号，请直接就诊！！");
		}
		
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		try {
			this.regInfoManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM REG_INFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.regInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		RegInfo model = JSONUtils.deserialize(data, RegInfo.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.regInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/update/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateToCanceled(@PathVariable("id") String id) {
		try {
			RegInfo info = this.regInfoManager.get(id);
			if (!(RegInfo.REG_RESERVE_NUMED.equals(info.getRegState()))) {
				throw new RuntimeException("挂号记录不符合退号条件，请检查");
			}
			HcpUser user = this.getCurrentUser();
			info.setCancelOper(user.getName());
			this.registerManager.cancel(info, user);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("退号失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 接诊更新
	 * step : 1 - 接诊；2 - 取消接诊；3 - 结束就诊
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/visit/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forVisitUpdate(@PathVariable("id") String id, @RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		String step = jsonObj.getString("step");
		String stepName = "";
		try {
			// 查询挂号信息
			RegInfo model = this.regInfoManager.get(id);
			HcpUser user = this.getCurrentUser();

			if ("1".equals(step)) {
				stepName = "接诊";
				// 更新状态为“看诊中”
				model.setRegState(RegInfo.REG_VISITING);
				// 更新挂号医生
				model.setRegDoc(user);
				// 更新看诊医生
				HcpUser doctor = new HcpUser();
				doctor.setId(user.getId());
				model.setSeeDoc(doctor);
				// 更新看诊科室
				Department dept = new Department();
				dept.setId(user.getLoginDepartment().getId());
				model.setSeeDept(dept);
				// 更新开始看诊时间
				model.setSeeBegin(DateUtils.getCurrentDate());
			} else if ("2".equals(step)) {
				stepName = "取消接诊";
				// 更新状态为“预约已取号”
				model.setRegState(RegInfo.REG_RESERVE_NUMED);
				// 更新挂号医生
				model.setRegDoc(null);
				// 更新看诊医生
				model.setSeeDoc(null);
				// 更新看诊科室
				model.setSeeDept(null);
				// 更新开始看诊时间
				model.setSeeBegin(null);
			} else if ("3".equals(step)) {
				stepName = "结束就诊";
				// 更新状态为“完成就诊”
				model.setRegState(RegInfo.REG_TREAT_DONE);
				// 更新结束看诊时间
				model.setSeeEnd(DateUtils.getCurrentDate());
			}

			RegInfo saved = this.regInfoManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(stepName + "操作失败");
		}
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser user = this.getCurrentUser();
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		RegInfo query = JSONUtils.deserialize(data, RegInfo.class);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder(" from RegInfo ri where ri.hosId=? and ri.invoiceNo is not null ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		if (!StringUtils.isEmpty(query.getRegId())) {
			jql.append("and ri.regId = ? ");
			values.add(query.getRegId());
		}
		if (!StringUtils.isEmpty(query.getInvoiceNo())) {
			jql.append("and ri.invoiceNo like ? ");
			values.add("%" + query.getInvoiceNo() + "%");
		}
		if (!StringUtils.isEmpty(query.getRegLevel())) {
			jql.append("and ri.regLevel = ? ");
			values.add(query.getRegLevel());
		}
		if (!StringUtils.isEmpty(query.getRegState())) {
			jql.append("and ri.regState = ? ");
			values.add(query.getRegState());
		}
		if (date != null && date.length == 2) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and ri.createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		// 诊疗卡/医保卡/患者姓名/患者编码
		if (StringUtils.isNotBlank(query.getMedicalCardNo()) || StringUtils.isNotBlank(query.getPatientName())) {
			jql.append("and ri.patient.id in (select id from Patient where hosId = ? ");
			values.add(user.getHosId());
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
				jql.append("and medicalCardNo like ? ");
				values.add("%" + query.getMedicalCardNo() + "%");
			}
			// 患者姓名
			if (!StringUtils.isEmpty(query.getPatientName())) {
				jql.append("and name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			jql.append(")");
		}
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		regInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);

	}

	@RequestMapping(value = "/statistics/registStatistics", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result registStatistics(@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser user = this.getCurrentUser();
		RegInfo query = JSONUtils.deserialize(data, RegInfo.class);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder(" from RegInfo ri where ri.hosId=? and ri.invoiceNo is not null ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		if (!StringUtils.isEmpty(query.getCreateOper())) {
			jql.append("and ri.createOper like ? ");
			values.add(query.getCreateOper());
		}
		if (!StringUtils.isEmpty(query.getRegLevel())) {
			jql.append("and ri.regLevel = ? ");
			values.add(query.getRegLevel());
		}
		if (!StringUtils.isEmpty(query.getRegState())) {
			jql.append("and ri.regState = ? ");
			values.add(query.getRegState());
		}
		if (!StringUtils.isEmpty(query.getRegDeptId())) {
			jql.append("and ri.regDept.id = ? ");
			values.add(query.getRegDeptId());
		}
		if (!StringUtils.isEmpty(query.getFeeType())) {
			jql.append("and ri.feeType= ? ");
			values.add(query.getFeeType());
		}
		if (date != null && date.length == 2) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and ri.createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		List<RegInfo> result = null;
		try {
			result = regInfoManager.find(jql.toString(), values.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取挂号信息失败，原因为：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(result);
	}

	@RequestMapping(value = "/statistics/registStatisticsByAccounter", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result registStatisticsByAccounter(@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser user = this.getCurrentUser();
		RegInfo query = JSONUtils.deserialize(data, RegInfo.class);
		StringBuilder jql = new StringBuilder(" from RegInfo ri where ri.hosId=? and ri.invoiceNo is not null ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		Date[] date = query.getDateRange();
		if (date != null && date.length == 2) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		} else {
			jql.append("and ri.createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		List<RegInfoStatisticsDto> result = null;
		try {
			List<RegInfo> regInfos = regInfoManager.find(jql.toString(), values.toArray());
			result = registerStatisticsManager.listRegInfoStatistics(regInfos);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取挂号信息失败，原因为：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(result);
	}

	/**    
	 * 功能描述：根据挂号id获取病人相关挂号信息(此功能（之前已经写好）现在可以与上面功能合并，后期更改)
	 *@param regId
	 *@return       
	 *@author gw
	 *@date 2017年4月15日             
	*/
	@RequestMapping(value = "/getPatientRegInfo/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPatientRegInfo(@PathVariable("regId") String regId) {
		List<Object> values = new ArrayList<Object>();
		RegInfo model = null;
		if (StringUtils.isNotEmpty(regId)) {
			StringBuilder jql = new StringBuilder(" FROM RegInfo reg ");
			jql.append(" WHERE reg.id = ? OR reg.regId = ? ");
			values.add(regId);
			values.add(regId);
			model = regInfoManager.findOne(jql.toString(), values.toArray());
		}
		return ResultUtils.renderPageResult(model);
	}
	
	/**    
	 * 功能描述：根据挂号id获取病人相关挂号信息(包括挂号费)
	 *@param regId
	 *@return       
	 *@author duanyanshan
	 *@date 2017年09月19日             
	*/
	@RequestMapping(value = "/getRegInfo/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getRegInfo(@PathVariable("regId") String regId) {
		
		//regId="4028a0815e94f4b7015e94fc21110002";
		List<Object> values = new ArrayList<Object>();
		List<Object> val = new ArrayList<Object>();
		RegInfo model = null;
		//挂号费
		BigDecimal totalFee = new BigDecimal(0);
		if (StringUtils.isNotEmpty(regId)) {
			StringBuilder jql = new StringBuilder(" FROM RegInfo reg ");
			jql.append(" WHERE reg.id = ? OR reg.regId = ? ");
			values.add(regId);
			values.add(regId); 
			model = regInfoManager.findOne(jql.toString(), values.toArray());
			
			//查询该病人挂号费
			StringBuilder feeJql = new StringBuilder(" FROM OutpatientChargeDetail charge ");
			feeJql.append(" WHERE charge.regId = ?  and charge.applyState = ? and ( charge.feeCode = ? OR charge.feeCode = ? )");
			val.add(regId);
			val.add("1");    //获取已交费
			val.add("004");  //普通诊疗
			val.add("007");  //普通挂号
			List<OutpatientChargeDetail> detailList= outpatientChargeDetailManager.find(feeJql.toString(), val.toArray());
			
			for (OutpatientChargeDetail free : detailList) {
				totalFee = totalFee.add(free.getTotCost());
			}
		}
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("regInfo", model);
		map.put("totalFee", totalFee);
		
		return ResultUtils.renderPageResult(map);
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		RegInfo model = regInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<RegInfo> models = regInfoManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 根据条件查询挂号信息
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/find/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		// 取当前用户
		HcpUser user = this.getCurrentUser();

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);

		RegInfo query = JSONUtils.deserialize(data, RegInfo.class);
		// StringBuilder jql = new StringBuilder(" from RegInfo ri where
		// ri.hosId=? and ri.regDept=? ");
		StringBuilder jql = new StringBuilder(" from RegInfo ri where ri.hosId=? and ri.regDept.id = ? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		values.add(user.getLoginDepartment().getId());

		// 就诊号
		if (!StringUtils.isEmpty(query.getRegId())) {
			jql.append("and ri.regId = ? ");
			values.add(query.getRegId());
		}
		// 号别
		if (!StringUtils.isEmpty(query.getRegLevel())) {
			jql.append("and ri.regLevel = ? ");
			values.add(query.getRegLevel());
		}

		// 挂号日期
		if (null != query.getRegTime()) {
			try {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date fromDate = df.parse(DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd") + " 00:00:00");
				Date toDate = df.parse(DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd") + " 23:59:59");
				jql.append("and ri.regTime >= ? and ri.regTime <= ? ");
				values.add(fromDate);
				values.add(toDate);
			} catch (Exception e) {
				e.printStackTrace();
			}
			System.out.println("111111111111");
		}

		// 挂号单状态
		if (!StringUtils.isEmpty(query.getRegState())) {
			jql.append("and (ri.regState = ? ");
			values.add(query.getRegState());
			if (RegInfo.REG_RESERVE_NUMED.equals(query.getRegState())){
				jql.append("or ri.regState = ? ");
				values.add(RegInfo.REG_VISITING);
			}
			if (null != query.getRegTime() && DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd").equals(DateUtils.date2String(new Date(), "yyyy-MM-dd"))){
				jql.append("or ri.regState = ? ");
				values.add(RegInfo.REG_TREAT_DONE);
			}
			jql.append(")");
		}

		// 诊疗卡
		if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
			jql.append("and ri.patient.medicalCardNo = ? ");
			values.add(query.getMedicalCardNo());
		}
		// 医保卡
		if (!StringUtils.isEmpty(query.getMiCardNo())) {
			jql.append("and ri.patient.miCardNo = ? ");
			values.add(query.getMiCardNo());
		}
		// 患者编码
		if (!StringUtils.isEmpty(query.getPatientCode())) {
			jql.append("and ri.patient.patientId = ? ");
			values.add(query.getPatientCode());
		}
		// 患者姓名
		if (!StringUtils.isEmpty(query.getPatientName())) {
			jql.append("and ri.patient.name like ? ");
			values.add("%" + query.getPatientName() + "%");
		}
		jql.append("order by ri.regState, seeNo, regId ");
		page.setQuery(jql.toString());
		page.setValues(values.toArray());

		regInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 根据条件查询已经缴费的挂号信息
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/findFeedItem/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findFeeItemPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		// 取当前用户
		HcpUser user = this.getCurrentUser();

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);

		RegInfo query = JSONUtils.deserialize(data, RegInfo.class);
		StringBuilder jql = new StringBuilder(" SELECT ri from RegInfo ri where ri.hosId=? and ri.regDept.id = ? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		values.add(user.getLoginDepartment().getId());

		// 就诊号
		if (!StringUtils.isEmpty(query.getRegId())) {
			jql.append("and ri.regId = ? ");
			values.add(query.getRegId());
		}
		// 号别
		if (!StringUtils.isEmpty(query.getRegLevel())) {
			jql.append("and ri.regLevel = ? ");
			values.add(query.getRegLevel());
		}

		// 挂号日期
		if (null != query.getRegTime()) {
			try {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date fromDate = df.parse(DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd") + " 00:00:00");
				Date toDate = df.parse(DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd") + " 23:59:59");
				//获取当前时间，然后往后加三天
				Date date = new Date();
				Calendar calendar = Calendar.getInstance();
		        calendar.setTime(date);
		        calendar.add(Calendar.DAY_OF_MONTH, -3);
		        date = calendar.getTime();
				jql.append("and ri.regTime >= ? and ri.regTime <= ? and ri.regTime >= ?  ");
				values.add(fromDate);
				values.add(toDate);
				values.add(date);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}else{
			//获取当前时间，然后往后加三天
			Date date = new Date();
			Calendar calendar = Calendar.getInstance();
	        calendar.setTime(date);
	        calendar.add(Calendar.DAY_OF_MONTH, -3);
	        date = calendar.getTime();
			jql.append("and ri.regTime >= ? ");
			values.add(date);
		}

		// 挂号单状态
		if (!StringUtils.isEmpty(query.getRegState())) {
			jql.append("and (ri.regState = ? ");
			values.add(query.getRegState());
			if (RegInfo.REG_RESERVE_NUMED.equals(query.getRegState())){
				jql.append("or ri.regState = ? ");
				values.add(RegInfo.REG_VISITING);
			}
			if (null != query.getRegTime() && DateUtils.date2String(query.getRegTime(), "yyyy-MM-dd").equals(DateUtils.date2String(new Date(), "yyyy-MM-dd"))){
				jql.append("or ri.regState = ? ");
				values.add(RegInfo.REG_TREAT_DONE);
			}
			jql.append(")");
		}

		// 诊疗卡
		if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
			jql.append("and ri.patient.medicalCardNo = ? ");
			values.add(query.getMedicalCardNo());
		}
		// 医保卡
		if (!StringUtils.isEmpty(query.getMiCardNo())) {
			jql.append("and ri.patient.miCardNo = ? ");
			values.add(query.getMiCardNo());
		}
		// 患者编码
		if (!StringUtils.isEmpty(query.getPatientCode())) {
			jql.append("and ri.patient.patientId = ? ");
			values.add(query.getPatientCode());
		}
		// 患者姓名
		if (!StringUtils.isEmpty(query.getPatientName())) {
			jql.append("and ri.patient.name like ? ");
			values.add("%" + query.getPatientName() + "%");
		}
		jql.append(" and ri.id in (select order.regId from MedicalOrder order where order.chargeFlag = 1  and order.orderState != 5 and order.orderState != 4 ) ");
		
		jql.append("order by ri.regTime desc ");
		page.setQuery(jql.toString());
		page.setValues(values.toArray());

		regInfoManager.findPage(page);
		//过滤掉没有收费的挂号信息
		List<RegInfo> reginfos=(List<RegInfo>) page.getResult();
		return ResultUtils.renderPageResult(page);
	}

}
