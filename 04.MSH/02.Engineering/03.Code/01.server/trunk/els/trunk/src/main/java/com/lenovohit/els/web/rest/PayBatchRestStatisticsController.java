package com.lenovohit.els.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.els.model.PayBatch;

@RestController
@RequestMapping("/els/paybatch")
public class PayBatchRestStatisticsController extends BaseRestController {

	@Autowired
	private GenericManager<PayBatch, String> payBatchManager;

	/**
	 *  查询综合统计信息 ELS_STAT_001
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/querystatistics", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList1(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
//			PayBatch tpb = JSONUtils.deserialize(data, PayBatch.class);
//			PayBatch.hasStatus(tpb.getState());
			
			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

			if (StringUtils.isEmpty(orgId)){
				throw new BaseException("机构id为空！请重新登录！");
			}
//			if(null == tpb){
//				tpb = new PayBatch();
//			}
//			tpb.setOrgId(orgId);
			
//			List<String> values = new ArrayList<String>();
//			values.add(orgId);

			List<Object[]> p = (List<Object[]>) payBatchManager.findBySql(
					"select sum(succ_amount), count(id) ,sum(succ_num)  from ELS_PAY_BATCH where org_id = ? ",
					orgId);

			Object[] ps = (Object[]) p.get(0);

			log.info("查询结果为：" + ps[0] + ps[1] + ps[2]);
			
			Map<String, String> result = new HashMap<String, String>();
			result.put("allamount", ps[0].toString());
			result.put("allbatchnum", ps[1].toString());
			result.put("allpernum", ps[2].toString());
			log.info("查询结果为：" + result);
			
			return ResultUtils.renderSuccessResult(result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);

	}
	
	/**
	 * 发放数据年报 ELS_STAT_002
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/yearstatistics", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList2() {
		try {
//			PayBatch tpb = JSONUtils.deserialize(data, PayBatch.class);
//			PayBatch.hasStatus(tpb.getState());

			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

			if (StringUtils.isEmpty(orgId)){
				throw new BaseException("机构id为空！请重新登录！");
			}
			//tpb.setOrgId(orgId);
			
			//List<String> values = new ArrayList<String>();
			//values.add(tpb.getOrgId());
			/*按年搜索金额汇总*/
			List<Object[]> p = (List<Object[]>) payBatchManager.findBySql(
					"select substring(month,1,4),sum(succ_amount),sum(succ_num)  from ELS_PAY_BATCH where org_id = ? Group by substring(month,1,4) ",
					orgId);
			/*获取总年份数*/
			int yearNum = p.size();
			
			List<Map> resultall = new ArrayList<Map>();
			/*循环把拼接好的map放入list*/
			for(int i=0; i<yearNum; i++){
				HashMap<String,String> result = new HashMap<String,String>();
				/*List<Object>转换成String*/
				Object[] ps = (Object[]) p.get(i);
				log.info("查询结果为：" + ps[0] + ps[1] + ps[2] );
				
				result.put("year", ps[0].toString());
				result.put("allamount", ps[1].toString());
				result.put("allcnt", ps[2].toString());
				resultall.add(result);
			}
				
			return ResultUtils.renderSuccessResult(resultall);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);

	}

	
	/**
	 * 发放数据半年报 ELS_STAT_003
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/hfyearstatistics", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList3(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			/*PayBatch tpb = JSONUtils.deserialize(data, PayBatch.class);
			PayBatch.hasStatus(tpb.getState());
			
			if (StringUtils.isEmpty(tpb.getOrgId())) {
				throw new BaseException("请输入机构ID！");
			}
			List<String> values = new ArrayList<String>();
			values.add(tpb.getOrgId());*/
			PayBatch tpb = new PayBatch();
			Map<String, String> m = new HashMap<String, String>();
			
			if(StringUtils.isEmpty(data)){
				throw new BaseException("输入数据为空！");
			}
			
			m = JSONUtils.deserialize(data, Map.class);

			String startYear = m.get("startYear");
			String endYear = m.get("endYear");
			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

			if (StringUtils.isEmpty(orgId)){
				throw new BaseException("机构id为空！请重新登录！");
			}
			
			if (StringUtils.isEmpty(startYear)||StringUtils.isEmpty(endYear))
				throw new BaseException("请输入起止年份！");
			
			/*按年搜索金额汇总*/
			List<Object[]> p = (List<Object[]>) payBatchManager.findBySql(
					"select case when substring(month,5,6) between '01' and '06' then concat(substring(MONTH, 1, 4),'上半年') "
					+" else concat(substring(MONTH, 1, 4),'下半年') end ,sum(succ_amount), sum(succ_num) "
					+ " from ELS_PAY_BATCH where org_id = ? and substring(month,1,4) >= ? and substring(month,1,4) <= ? "
					+ " group by case when substring(month,5,6) between '01' and '06' then concat(substring(MONTH, 1, 4),'上半年') "
					+" else concat(substring(MONTH, 1, 4),'下半年') end ",
					orgId,startYear,endYear);
			
			/*获取总年份数*/
			int yearNum = p.size();
			
			List<Map> resultall = new ArrayList<Map>();
			/*循环把拼接好的map放入list*/
			for(int i=0; i<yearNum; i++){
				HashMap<String,String> result = new HashMap<String,String>();
				/*List<Object>转换成String*/
				Object[] ps = (Object[]) p.get(i);
				log.info("查询结果为：" + ps[0] + ps[1] );
				
				result.put("hfyear", ps[0].toString());
				result.put("allamount", ps[1].toString());
				result.put("allcnt", ps[2].toString());
				resultall.add(result);
			}
				
			return ResultUtils.renderSuccessResult(resultall);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);

	}

	/**
	 * 发放数据季报 ELS_STAT_004
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/quarterstatistics", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList4(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
//			PayBatch tpb = JSONUtils.deserialize(data, PayBatch.class);
//			PayBatch.hasStatus(tpb.getState());
//			
//			if (StringUtils.isEmpty(tpb.getOrgId())) {
//				throw new BaseException("请输入机构ID！");
//			}
//			PayBatch tpb = new PayBatch();
			Map<String, String> m = new HashMap<String, String>();
			
			if(StringUtils.isEmpty(data)){
				throw new BaseException("输入数据为空！");
			}
			
			m = JSONUtils.deserialize(data, Map.class);

			String startYear = m.get("startYear");
			String endYear = m.get("endYear");
			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

			if (StringUtils.isEmpty(orgId)){
				throw new BaseException("机构id为空！请重新登录！");
			}
			
			if (StringUtils.isEmpty(startYear)||StringUtils.isEmpty(endYear))
				throw new BaseException("请输入起止年份！");
		
			/*按年搜索金额汇总*/
			List<Object[]> p = (List<Object[]>) payBatchManager.findBySql(
					"select case when substring(month,5,6) between '01' and '03' "
					+ "then concat(substring(MONTH,1,4),'-1季度') when substring(month,5,6) between '04' and '06' then concat(substring(MONTH,1,4),'-2季度') "
					+ "when substring(month,5,6) between '07' and '09' then concat(substring(MONTH,1,4),'-3季度' ) else concat(substring(MONTH,1,4),'-4季度' )"
					+ "end ,sum(succ_amount), sum(succ_num) from ELS_PAY_BATCH where org_id = ? and substring(month,1,4) >= ? and substring(month,1,4) <= ? "
					+ "group by case when substring(month,5,6) between '01' and '03' then concat(substring(MONTH,1,4),'-1季度') "
					+ "when substring(month,5,6) between '04' and '06' then concat(substring(MONTH,1,4),'-2季度')"
					+ " when substring(month,5,6) between '07' and '09' then concat(substring(MONTH,1,4),'-3季度') else concat(substring(MONTH,1,4),'-4季度') end ",
					orgId,startYear,endYear);
			/*获取总年份数*/
			int yearNum = p.size();
			
			List<Map> resultall = new ArrayList<Map>();
			/*循环把拼接好的map放入list*/
			for(int i=0; i<yearNum; i++){
				HashMap<String,String> result = new HashMap<String,String>();
				/*List<Object>转换成String*/
				Object[] ps = (Object[]) p.get(i);
				log.info("查询结果为：" + ps[0] + ps[1] );
				
				result.put("quarter", ps[0].toString());
				result.put("allamount", ps[1].toString());
				result.put("allcnt", ps[2].toString());
				resultall.add(result);
			}
				
			return ResultUtils.renderSuccessResult(resultall);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);

	}
}



