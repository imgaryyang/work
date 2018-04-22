package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.Clinical;
import com.lenovohit.ssm.treat.model.Guide;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
/**
 * 就医指南
 * @author xiaweiyi
 *
 */
public interface HisGuideManager {
	/**
	 * 患者历次门诊诊疗信息(OUTP000010)
	 * @param param
	 * @return
	 */
	public HisListResponse<Clinical> getClinicals(Clinical param);
	/**
	 * 患者门诊诊疗信息(OUTP000010)
	 * @param param
	 * @return
	 */
	public HisListResponse<Clinical> getClinical(String clinicalId);
	/**
	 * 指引单内容查询(MZSF000003)
	 * @param param
	 * @return
	 */
	public HisListResponse<Guide> getGuides(Clinical param);
}
