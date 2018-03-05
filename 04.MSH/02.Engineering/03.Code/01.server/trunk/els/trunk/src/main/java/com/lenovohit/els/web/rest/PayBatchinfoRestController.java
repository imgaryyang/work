package com.lenovohit.els.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.core.dao.Page;
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
import com.lenovohit.els.model.PayBatchinfo;
import com.lenovohit.els.model.PerMng;

@RestController
@RequestMapping("/els/paybatchinfo")
public class PayBatchinfoRestController extends BaseRestController {

	@Autowired
	private GenericManager<PayBatchinfo, String> payBatchinfoManager;
	@Autowired
	private GenericManager<PerMng, String> perMngManager;
	@Autowired
	private GenericManager<PayBatch, String> payBatchManager;

	/**
	 * 新增批次明细 ELS_PAY_011
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {

		PayBatchinfo model = JSONUtils.deserialize(data, PayBatchinfo.class);
		
		if (StringUtils.isEmpty(model.getPerId())
				|| StringUtils.isEmpty(model.getBatchId())
				|| StringUtils.isEmpty(model.getAcctNo())
				|| StringUtils.isEmpty(model.getName()) || (model.getAmount().compareTo(BigDecimal.valueOf(0.0)) == -1)) {
			throw new BaseException("请输入必填信息！");
		}
		
		//判断批次信息是否正确
		PayBatch pb = payBatchManager.get(model.getBatchId());
		if(null == pb){
			throw new BaseException("信息存在错误！");
		}
		
		String jql = "from PayBatchinfo where perId = ? and batchId = ? ";
		long lCount = payBatchManager.getCount(jql,  model.getPerId(), model.getBatchId());
		//判断该人员工资是否重复添加
		if(lCount > 0){
			return ResultUtils.renderFailureResult("此条记录已存在！");
		}
		//判断金额是否为空
		if(null == pb.getAmount()){
			pb.setAmount(new BigDecimal(0));
		}
		//判断发放人次是否为空
		if(null == pb.getAmount()){
			pb.setNum(0);
		}
		
		pb.setAmount(pb.getAmount().add(model.getAmount()));
		pb.setNum(pb.getNum() + 1);
		
		model.setBatchNo(pb.getBatchNo());
		model.setMonth(pb.getMonth());
		model.setPayState(PayBatchinfo.STATUS_WAIT);
		model = payBatchinfoManager.save(model);
		payBatchManager.save(pb);

		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 修改批次明细ELS_PAY_011
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {

		if (StringUtils.isEmpty(data)){
			throw new BaseException("请输入必填信息！");
		}
		
		PayBatchinfo model = JSONUtils.deserialize(data, PayBatchinfo.class);
		if (null == model){
			throw new BaseException("更新信息存在错误！");
		}

		try {
			PayBatch payBatch = payBatchManager.get(model.getBatchId());
			PayBatchinfo oldPayBatchinfo = payBatchinfoManager.get(model.getId());
			if (null == payBatch || null == oldPayBatchinfo ){
				throw new BaseException("更新信息存在错误！");
			}
			if (!PayBatchinfo.STATUS_WAIT.equals(oldPayBatchinfo.getPayState())) {
				throw new BaseException("该笔发放明细已经不允许修改！");
			}
			if (!PayBatch.STATUS_CREATE.equals(payBatch.getState())) {
				throw new BaseException("该笔发放明细已经不允许修改！");
			}
			
			//减去原来工资的金额
			payBatch.setAmount(payBatch.getAmount().subtract(oldPayBatchinfo.getAmount()));
			//增加新工资的金额
			payBatch.setAmount(payBatch.getAmount().add(model.getAmount()));
			
			payBatch = payBatchManager.save(payBatch);
			model = payBatchinfoManager.save(model);
		} catch (BaseException e) {
			e.printStackTrace();
		}

		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询发放批次列表 ELS_PAY_009
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}/{bacthId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize, @PathVariable(value = "bacthId") String bacthId,
			@RequestParam(value = "name") String name, @RequestParam(value = "acctNo") String acctNo) {

		if (StringUtils.isEmpty(bacthId)){
			throw new BaseException("请输入批次ID！");
		}

		List<String> values = new ArrayList<String>();
		
		StringBuffer sb = new StringBuffer("from PayBatchinfo where batchId = ? ");
		values.add(bacthId);
		
		if( !(StringUtils.isEmpty(name)) ) {
			sb.append(" and name like ? ");
			values.add("%"+name+"%");
		}
		if( !(StringUtils.isEmpty(acctNo)) ) {
			sb.append(" and acctNo like ? ");
			values.add("%"+acctNo+"%");
		}	

		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);
		p.setQuery(sb.toString());
		p.setValues(values.toArray());
		payBatchinfoManager.findPage(p);

		return ResultUtils.renderSuccessResult(p);
	}
	
	/**
	 * ELS_PAY_012  查询发放批次明细信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("请输入批次明细ID！");
		}
		
		PayBatchinfo model = payBatchinfoManager.get(id);
		if (null == model) {
			throw new BaseException("没有此记录！");
		}
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 删除发放批次明细记录 ELS_PAY_010
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {

		if (StringUtils.isEmpty(id)) {
			throw new BaseException("请输入批次明细ID！");
		}

		PayBatchinfo model = new PayBatchinfo();

		try {
			model = payBatchinfoManager.get(id);
			
			if (null == model) {
				throw new BaseException("不存在此信息！");
			}
			if (!PayBatchinfo.STATUS_WAIT.equals(model.getPayState())) {
				throw new BaseException("此发放明细已不允许删除！");
			}
			
			PayBatch pb  =  payBatchManager.get(model.getBatchId());
			pb.setAmount(pb.getAmount().subtract(model.getAmount()));
			pb.setNum(pb.getNum()-1);
			
			payBatchManager.save(pb);
			payBatchinfoManager.delete(id);
		} catch (BaseException e) {
			e.printStackTrace();
		}

		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 批量删除发放批次明细记录 ELS_PAY_010
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/delete/{ids}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forBatchDelete(@PathVariable("ids") String ids) {

		if (StringUtils.isEmpty(ids)) {
			throw new BaseException("请输入批次明细ID！");
		}
		
		String[] idArry = ids.split(",");
		String values = "?";//拼接查询占位标志的字符串
		for(int i = 1;i < idArry.length;i++){
			values += ",?";
		}
		
		try {
			
			updatePayBatch(idArry, values);//更新批次的发放总金额和总人次
			
			String deleteSql = "delete from ELS_PAY_BATCHINFO where id in ("+values+")";
			long lCount = payBatchinfoManager.executeSql(deleteSql, idArry);
			
			System.out.println("共删除发放批次明细" + lCount + "条！");
		} catch (BaseException e) {
			e.printStackTrace();
		}

		return ResultUtils.renderSuccessResult();
	}

	
	/**
	 * 更新批次记录
	 * 
	 * @param ids
	 * @return
	 */
	private void updatePayBatch(String[] idArry, String values) throws BaseException{
		
		String jql = "from PayBatchinfo where id in ("+values+")";
		List<PayBatchinfo> payBatchinfoList = payBatchinfoManager.find(jql, idArry);
		
		if(null == payBatchinfoList){
			throw new BaseException("不存在相应的批次明细！");
		}
		
		String batchId = payBatchinfoList.get(0).getBatchId();
		PayBatch payBatch = payBatchManager.get(batchId);
		
		if(null == payBatch){
			throw new BaseException("不存在相应的批次信息！");
		}
		
		int i = 0;
		BigDecimal amount = new BigDecimal(0);
		
		if(payBatchinfoList != null){
			Iterator<PayBatchinfo> it = payBatchinfoList.iterator();
			while(it.hasNext()){
				PayBatchinfo p =it.next();
				amount.add(p.getAmount());
				i++;
			}
		}
		
		payBatch.setNum(payBatch.getNum() - i);
		payBatch.setAmount(payBatch.getAmount().subtract(amount));
		
		payBatchManager.save(payBatch);
	}
	
	/**
	 * ELS_PAY_017	查询用户工资列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/perpaylist/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPerPayList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "perId", defaultValue = "") String perId) {
		
		log.info("查询用户工资列表: 人员" + perId );
		if (StringUtils.isEmpty(perId)) {
			throw new BaseException("输入用户数据为空！");
		}
		String jql = "from PayBatchinfo p where p.perId = ? and p.payState='1' order by month desc";
		List<String> values = new ArrayList<String>();
		values.add(perId);
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql);
		page.setValues(values.toArray());
		this.payBatchinfoManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);

	}
}
