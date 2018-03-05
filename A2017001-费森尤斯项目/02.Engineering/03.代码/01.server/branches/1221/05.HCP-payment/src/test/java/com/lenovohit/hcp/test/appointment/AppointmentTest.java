package com.lenovohit.hcp.test.appointment;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import static org.junit.Assert.*;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.appointment.model.RegVisit;
import com.lenovohit.hcp.appointment.model.RegVisitTemp;

public class AppointmentTest extends BaseTest {
	@Autowired
	private GenericManager<RegVisitTemp, String> regVisitTempManager;
	@Resource
	private GenericManager<RegVisit, String> regVisitManager;
	@Resource
	private GenericManager<RegInfo, String> regInfoManager;
	public static final String HOS_ID = "H31AAAA001";

	public static void main(String[] args) {
		String beginTime = "00:00:00";
		String endTime = "23:59:59";
		String date = DateUtils.getCurrentDateStr(DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		System.out.println(date);
		Date beginDate = DateUtils.string2Date(date + " " + beginTime, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
		System.out.println(beginDate.toString());
		Date endDate = DateUtils.string2Date(date + " " + endTime, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
		System.out.println(endDate.toString());
	}

	@Test
	public void getNowRegTemp() {
		Date nowTime = new Date();
		StringBuilder sql = new StringBuilder(
				"select * from reg_visitmodel where hos_id = ? and ? between start_time and end_time ");
		String jql = new String("from RegVisit where hosId = ? and ? between startTime and endTime");
		List<RegVisit> nowReg = (List<RegVisit>) regVisitManager.findByJql(jql.toString(), HOS_ID, nowTime);
		assertEquals(1, nowReg.size());
	}

	@Test
	public void getRegedInfo() {
		String beginTime = "00:00:00";
		String endTime = "23:59:59";
		String date = DateUtils.getCurrentDateStr(DateUtils.DATE_PATTERN_DASH_YYYYMMDD);
		Date beginDate = DateUtils.string2Date(date + " " + beginTime, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
		Date endDate = DateUtils.string2Date(date + " " + endTime, DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS);
		String sql = "select * from reg_info where hos_id = ? and create_time between ? and ? ";
		String jql = new String("from RegInfo where hosId = ? and createTime between ? and ?");
		List<RegInfo> result = (List<RegInfo>) regInfoManager.findByJql(jql, HOS_ID, beginDate, endDate);
		assertEquals(1, result.size());
	}
}
