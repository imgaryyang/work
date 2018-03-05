package com.infohold.els.web.rest;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.els.model.PayBatch;
import com.infohold.els.model.PayBatchinfo;

@RestController
@RequestMapping("/els/paybatch")
public class PayBatchRestController extends BaseRestController {

	@Autowired
	private GenericManager<PayBatch, String> payBatchManager;
	
	@Autowired
	private GenericManager<PayBatchinfo, String> payBatchinfoManager;

	/**
	 * 查询发放批次列表 ELS_PAY_001
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{year}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "year") String year) {
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

		if (StringUtils.isEmpty(orgId)){
			throw new BaseException("机构id为空！请重新登录！");
		}
		
		if (StringUtils.isEmpty(year)){
			throw new BaseException("请输入年份！");
		}

		String jql = "from PayBatch where substring(month,1,4) = ? and orgId = ? order by month desc, batchNo+0 desc ";
		List<PayBatch> lpb = payBatchManager.find(jql, year, orgId);

		return ResultUtils.renderSuccessResult(lpb);
	}

	/**
	 * 新增发放批次 ELS_PAY_007
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		
		PayBatch tpb = new PayBatch();
		Map<String, String> m = new HashMap<String, String>();
		
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		
		if (StringUtils.isEmpty(orgId)){
			throw new BaseException("机构id为空！请重新登录！");
		}
		
		if(StringUtils.isEmpty(data)){
			throw new BaseException("未检测到数据！");
		}
		
		m = JSONUtils.deserialize(data, Map.class);

		String year = String.valueOf(m.get("year"));
		String month = String.valueOf(m.get("month"));
		String note = m.get("note");

		if (StringUtils.isEmpty(year))
			throw new BaseException("请输入年份！");
		if (StringUtils.isEmpty(month))
			throw new BaseException("请输入月份！");
		
		if(month.length() < 2){
			month = "0"+month;
		}
		
		//查询批次编号
		String sql = "SELECT MAX(BATCH_NO + 0) FROM ELS_PAY_BATCH WHERE MONTH = ? AND ORG_ID = ? ";
		List<Double> maxBacthNo = (List<Double>) payBatchManager.findBySql(sql, year + month, orgId);
		
		int bacthNo = 1;//初始化默认批次号
		Double bacthNoDouble = 0.0;
		
		if(maxBacthNo != null && maxBacthNo.size() > 0)
			bacthNoDouble = maxBacthNo.get(0);
		if(null != bacthNoDouble)//判断查询出的最大批次号是否不为空
			bacthNo = (int) (bacthNoDouble+1);
		
		tpb.setMonth(year+month);
		tpb.setOrgId(orgId);
		tpb.setNote(note);
		tpb.setAmount(new BigDecimal(0));
		tpb.setSuccAmount(new BigDecimal(0));
		tpb.setSuccNum(0);
		tpb.setNum(0);
		tpb.setState(PayBatch.STATUS_CREATE);
		tpb.setBatchNo(bacthNo+"");
		
		try {
			tpb = payBatchManager.save(tpb);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		log.info(tpb);
		
		return ResultUtils.renderSuccessResult(tpb);
	}
	
	/**
	 * 查询批次信息 ELS_PAY_008
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		
		PayBatch tpb = new PayBatch();
		
		if (StringUtils.isEmpty(id)){
			throw new BaseException("请输入批次ID！");
		}
		
		try {
			tpb = payBatchManager.get(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderSuccessResult(tpb);
	}
	
	/**
	 * 删除发放批次表记录 ELS_PAY_013
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {

		if (StringUtils.isEmpty(id)) {
			throw new BaseException("请输入批次明细ID！");
		}
		
		PayBatch tpb = new PayBatch();
		
		try {
			tpb = payBatchManager.get(id);
			
			if(tpb == null){
				throw new BaseException("批次明细ID错误！");
			}
			
			if(!PayBatch.STATUS_CREATE.equals(tpb.getState())){
				throw new BaseException("已提交/完成的批次不允许删除！");
			}
			
			String sql = " delete from ELS_PAY_BATCHINFO where BATCH_ID = ? ";
			int iCount = payBatchinfoManager.executeSql(sql, tpb.getId());
			log.info("删除批次明细记录：" + iCount + "条！");
			
			tpb = payBatchManager.delete(id);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_PAY_014 提交发放批次  ELS_PAY_015 确认发放
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		
		//判断是否存在更新数据
		if(StringUtils.isEmpty(data)){
			throw new BaseException("未检测到更新数据！");
		}
		
		PayBatch payBatch = JSONUtils.deserialize(data, PayBatch.class);
		
		if(null == payBatch){
			throw new BaseException("更新数据存在错误！");
		}
		
		//判断是否是提交状态，如果是，设置提交时间
		if(payBatch.getState().equals("2") && StringUtils.isEmpty(payBatch.getSubmitTime())){
			SimpleDateFormat time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			payBatch.setSubmitTime(time.format(new Date()));
			
		}

		try {
			//判断是否是完成发放
			if(payBatch.getState().equals("3")){
				//当前台确认发放成功时，所有金额和人次都发放成功
				payBatch.setSuccAmount(payBatch.getAmount());
				payBatch.setSuccNum(payBatch.getNum());
				String sql = " UPDATE ELS_PAY_BATCHINFO SET PAY_STATE = ? WHERE BATCH_ID = ? ";
				//将批次明细的记录更改为已发放状态
				payBatchinfoManager.executeSql(sql, "1",payBatch.getId());
			}
			payBatch = payBatchManager.save(payBatch);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderSuccessResult(payBatch);
	}
}
