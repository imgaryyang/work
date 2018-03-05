package com.lenovohit.hcp.base.manager;

import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;

/**
 * 打印数据获取manager，获取printdata顺序为打印文档（svn打印模板doc）
 * 	展示从左到右从上到下的顺序对应printdata的t1 t2 以此类推
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年5月6日
 */
public interface PrintDataManager {
	PrintData getPrintData(String bizId, HcpUser user);

}
