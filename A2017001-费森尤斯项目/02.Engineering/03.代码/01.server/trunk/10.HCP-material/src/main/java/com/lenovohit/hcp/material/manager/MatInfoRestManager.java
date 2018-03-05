package com.lenovohit.hcp.material.manager;

import java.io.OutputStream;
import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatInfo;

public interface MatInfoRestManager {
	/**
	 * 子医院保存物资基本信息
	 * @param matInfo
	 * @param user
	 * @return
	 */
	public MatInfo createMatInfo(MatInfo matInfo, HcpUser user);
	
	/**
	 * 集团保存物资基本信息
	 * @param matInfo
	 * @param user
	 * @return
	 */
	public MatInfo createMatInfoGroup(MatInfo matInfo, HcpUser user);
	
	/**
	 * 导出物资信息到Excel中
	 * @param infoList
	 * @param out
	 */
	public void exportInfoToExcel(List<MatInfo> infoList,OutputStream out,HcpUser user);

}
