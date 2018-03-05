package com.lenovohit.hcp.appointment.manager;

import java.util.List;

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.appointment.model.RegInfoStatisticsDto;

/**
 * 挂号员工作量统计
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年5月27日
 */
public interface RegisterStatisticsManager {
	List<RegInfoStatisticsDto> listRegInfoStatistics(List<RegInfo> regInfos);
}
