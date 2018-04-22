package com.lenovohit.ssm.payment.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.CashBatch;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.utils.SettleSeqCalculator;

/**
 * 结算单管理
 * 
 * 
 */
@RestController
@RequestMapping("/ssm/pay/settle")
public class SettleRestController extends SSMBaseRestController {

	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<CashBatch, String> cashBatchManager;
	@Autowired
	private GenericManager<Machine, String> machineManager;

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("id") String id) {
		Settlement settle = settlementManager.get(id);
		return ResultUtils.renderPageResult(settle);
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println("data "+data);
		Settlement query = JSONUtils.deserialize(data, Settlement.class);
		StringBuilder jql = new StringBuilder(" from Settlement where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(query != null ){
			if (!StringUtils.isEmpty(query.getPayChannelCode())) {
				jql.append(" and payChannelCode like ? ");
				values.add("%"+query.getPayChannelCode()+"%");
			}
			if (!StringUtils.isEmpty(query.getPrintBatchNo())) {
				jql.append(" and printBatchNo = ? ");
				values.add(query.getPrintBatchNo());
			}
			Order order = query.getOrder();
			if (order != null && !StringUtils.isEmpty(order.getId())) {
				jql.append(" and order.id = ? ");
				values.add(order.getId());
			}
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		settlementManager.findPage(page);

		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Settlement> list = settlementManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	// @RequestMapping(value = "/cash/print/list", method = RequestMethod.GET,
	// produces = MediaTypes.JSON_UTF_8)
	// public Result forPrintCashList(@RequestParam(value = "data", defaultValue
	// = "") String data) {
	// long total = this.settlementManager.getCount("from Settlement where
	// payChannelCode = ? and printBatchNo is null ", "0000");
	// if(total>0){
	// String batchNo = SettleSeqCalculator.calculateCode("CP");
	// System.out.println("batchNo "+ batchNo);
	// try {
	// this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET
	// PRINT_BATCH_NO = ? WHERE PRINT_BATCH_NO IS NULL and PAY_CHANNEL_CODE = ?
	// ", batchNo,"0000" );
	// List<?> results = this.settlementManager.findBySql("SELECT SUM(AMT)
	// ,COUNT(ID) FROM SSM_SETTLEMENT WHERE PRINT_BATCH_NO = ? ",batchNo);
	// Object[] result = (Object[])results.get(0);
	// CashBatch batch = new CashBatch();
	// batch.setBatchNo(batchNo);
	// batch.setCreateTime(new Date());
	// batch.setCount(Long.parseLong(result[1].toString()));
	// batch.setAmt(new BigDecimal(result[0].toString()));
	// batch = cashBatchManager.save(batch);
	// } catch (Exception e) {
	// this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET
	// PRINT_BATCH_NO = NULL WHERE PRINT_BATCH_NO = ? ", batchNo );
	// e.printStackTrace();
	// return ResultUtils.renderFailureResult();
	// }
	// }
	// List<CashBatch> batchs = cashBatchManager.find("from CashBatch where
	// status = ? ", CashBatch.PRINT_STAT_INIT);
	// return ResultUtils.renderSuccessResult(batchs);
	// }
	// @RequestMapping(value = "/cash/printCallback/{batchId}", method =
	// RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	// public Result forPrintCash(@PathVariable("batchId") String batchId) {
	// CashBatch batch = this.cashBatchManager.get(batchId);
	// if(null == batch)return ResultUtils.renderFailureResult("不存在的批次");
	//
	// this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET PRINT_STAT =
	// ? WHERE PRINT_BATCH_NO = ? ","1", batch.getBatchNo());
	//
	// batch.setPrintTime(new Date());
	// batch.setStatus(CashBatch.PRINT_STAT_PRINTED);
	// this.cashBatchManager.save(batch);
	//
	// return ResultUtils.renderSuccessResult();
	// }

	@RequestMapping(value = "/cash/unPrinted/machine", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUnPrintedCash() {
		Machine machine = this.getCurrentMachine();
		
		List<CashBatch> batchs = cashBatchManager.find("from CashBatch where status = ?  and machineMac = ? ", CashBatch.PRINT_STAT_INIT,machine.getMac());
		if (batchs != null && !batchs.isEmpty()) {
			return ResultUtils.renderSuccessResult(batchs);
		}
		
		List<?> results = this.settlementManager.findBySql(
				"SELECT SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE " 
						+ "PRINT_BATCH_NO IS NULL "
						+ "AND PAY_CHANNEL_CODE = '0000' "
						+ "AND SETTLE_TYPE = 'SP' "
						+ "AND MACHINE_MAC = ? ",
				machine.getMac());
		Object[] result = (Object[]) results.get(0);
		CashBatch batch = new CashBatch();
		if (null == result[0]){
			List<Object> temp = new ArrayList<Object>();
			temp.add(new Long(0));
			temp.add(new BigDecimal(0));
			result = temp.toArray();
		}
			// batch.setBatchNo("未生成");
			//batch.setCreateTime(new Date());
			batch.setCount(Long.parseLong(result[1].toString()));
			batch.setAmt(new BigDecimal(result[0].toString()));
			batch.setMachine(machine);
			batch.setMachineCode(machine.getCode());
			batch.setMachineName(machine.getName());
			batch.setMachineMac(machine.getMac());		
			batch.setCreateTime(new Date());
			batch.setCount(Long.parseLong(result[1].toString()));
			batch.setAmt(new BigDecimal(result[0].toString()));
			List<CashBatch> news = new ArrayList<CashBatch>();
			news.add(batch);
			return ResultUtils.renderSuccessResult(news);
	}

	@RequestMapping(value = "/cash/createBatch", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateCashBatch() {
		Machine machine = this.getCurrentMachine();
		String batchNo = SettleSeqCalculator.calculateCode("CP");
		System.out.println(machine.getMac() + " : " + batchNo);
		this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET PRINT_BATCH_NO = ? WHERE "
				+ " PRINT_BATCH_NO IS NULL " + "AND PAY_CHANNEL_CODE = '0000' "
				+ "AND SETTLE_TYPE = 'SP' " + "AND MACHINE_MAC = ? ", batchNo,
				machine.getMac());
		List<?> results = this.settlementManager
				.findBySql("SELECT SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE PRINT_BATCH_NO  = ? ", batchNo);
		Object[] result = (Object[]) results.get(0);
		if (null == result[0]){
			List<Object> temp = new ArrayList<Object>();
			temp.add(new Long(0));
			temp.add(new BigDecimal(0));
			result = temp.toArray();
		}
		CashBatch batch = new CashBatch();
		batch.setBatchNo(batchNo);
		batch.setCreateTime(new Date());
		batch.setCount(Long.parseLong(result[1].toString()));
		batch.setAmt(new BigDecimal(result[0].toString()));
		batch.setMachine(machine);
		batch.setMachineCode(machine.getCode());
		batch.setMachineName(machine.getName());
		batch.setMachineMac(machine.getMac());
		batch.setStatus(CashBatch.PRINT_STAT_INIT);
		batch.setBatchDay(DateUtils.date2String(new Date(), "yyyy-MM-dd"));
		batch.setBankCount(new Long(0));
		batch.setBankAmt(new BigDecimal(0));
		
		List<?> amtResults = this.settlementManager
				.findBySql("SELECT AMT,SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE PRINT_BATCH_NO  = ? GROUP BY AMT", batchNo);
		
		for(Object obj : amtResults){
			Object[] amts = (Object[])obj;
			if(null == amts[0])continue;
			
			BigDecimal amt = new BigDecimal(amts[0].toString());
			BigDecimal total = new BigDecimal(amts[1].toString());
			Long  count = Long.parseLong(amts[2].toString());
			
			if(amt.compareTo(new BigDecimal(100)) == 0 ){
				batch.setAmt100(total);
				batch.setCount100(count);
			}else if(amt.compareTo(new BigDecimal(50)) == 0 ){
				batch.setAmt50(total);
				batch.setCount50(count);
			}else if(amt.compareTo(new BigDecimal(20)) == 0 ){
				batch.setAmt20(total);
				batch.setCount20(count);
			}else if(amt.compareTo(new BigDecimal(10)) == 0 ){
				batch.setAmt10(total);
				batch.setCount10(count);
			}else if(amt.compareTo(new BigDecimal(5)) == 0 ){
				batch.setAmt5(total);
				batch.setCount5(count);
			}else if(amt.compareTo(new BigDecimal(2)) == 0 ){
				batch.setAmt2(total);
				batch.setCount2(count);
			}else if(amt.compareTo(new BigDecimal(1)) == 0 ){
				batch.setAmt1(total);
				batch.setCount1(count);
			}
		}
		
		CashBatch saved = this.cashBatchManager.save(batch);
		
		//日志
		StringBuilder sb = new StringBuilder();
		sb.append("清钞：");
		sb.append("[id ：").append(saved.getId()).append("]");
		sb.append("[batchNo ：").append(saved.getBatchNo()).append("]");
		sb.append("[amt ：").append(saved.getAmt()).append("]");
		sb.append("[count ：").append(saved.getCount()).append("]");
		
		sb.append("[amt100 ：").append(saved.getAmt100()).append("]");
		sb.append("[count100 ：").append(saved.getCount100()).append("]");
		sb.append("[amt50 ：").append(saved.getAmt50()).append("]");
		sb.append("[count50 ：").append(saved.getCount50()).append("]");
		sb.append("[amt20 ：").append(saved.getAmt20()).append("]");
		sb.append("[count20 ：").append(saved.getCount20()).append("]");
		sb.append("[amt10 ：").append(saved.getAmt10()).append("]");
		sb.append("[count10 ：").append(saved.getCount10()).append("]");
		sb.append("[amt5 ：").append(saved.getAmt5()).append("]");
		sb.append("[count5 ：").append(saved.getCount5()).append("]");
		sb.append("[amt2 ：").append(saved.getAmt2()).append("]");
		sb.append("[count2 ：").append(saved.getCount2()).append("]");
		sb.append("[amt1 ：").append(saved.getAmt1()).append("]");
		sb.append("[count1 ：").append(saved.getCount1()).append("]");
		log.info(sb.toString());
		
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 管理端清钞
	 * @param machineId
	 * @return
	 */
	@RequestMapping(value = "/cash/mngCreateBatch/{machineId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result mngCreateBatch(@PathVariable("machineId") String machineId){
		Machine machine = machineManager.get(machineId);
		try{
			printedCash(machine);
		}catch(Exception e){
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		String batchNo = SettleSeqCalculator.calculateCode("CP");
		System.out.println(machine.getMac() + " : " + batchNo);
		this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET PRINT_BATCH_NO = ? WHERE "
				+ " PRINT_BATCH_NO IS NULL " + "AND PAY_CHANNEL_CODE = '0000' "
				+ "AND SETTLE_TYPE = 'SP' " + "AND MACHINE_MAC = ? ", batchNo,
				machine.getMac());
		List<?> results = this.settlementManager
				.findBySql("SELECT SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE PRINT_BATCH_NO  = ? ", batchNo);
		Object[] result = (Object[]) results.get(0);
		if (null == result[0]){
			List<Object> temp = new ArrayList<Object>();
			temp.add(new Long(0));
			temp.add(new BigDecimal(0));
			result = temp.toArray();
		}
		CashBatch batch = new CashBatch();
		batch.setBatchNo(batchNo);
		batch.setCreateTime(new Date());
		batch.setCount(Long.parseLong(result[1].toString()));
		batch.setAmt(new BigDecimal(result[0].toString()));
		batch.setMachine(machine);
		batch.setMachineCode(machine.getCode());
		batch.setMachineName(machine.getName());
		batch.setMachineMac(machine.getMac());
		batch.setStatus(CashBatch.PRINT_STAT_INIT);
		batch.setBatchDay(DateUtils.date2String(new Date(), "yyyy-MM-dd"));
		batch.setBankCount(new Long(0));
		batch.setBankAmt(new BigDecimal(0));
		List<?> amtResults = this.settlementManager
				.findBySql("SELECT AMT,SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE PRINT_BATCH_NO  = ? GROUP BY AMT", batchNo);
		
		for(Object obj : amtResults){
			Object[] amts = (Object[])obj;
			if(null == amts[0])continue;
			
			BigDecimal amt = new BigDecimal(amts[0].toString());
			BigDecimal total = new BigDecimal(amts[1].toString());
			Long  count = Long.parseLong(amts[2].toString());
			
			if(amt.compareTo(new BigDecimal(100)) == 0 ){
				batch.setAmt100(total);
				batch.setCount100(count);
			}else if(amt.compareTo(new BigDecimal(50)) == 0 ){
				batch.setAmt50(total);
				batch.setCount50(count);
			}else if(amt.compareTo(new BigDecimal(20)) == 0 ){
				batch.setAmt20(total);
				batch.setCount20(count);
			}else if(amt.compareTo(new BigDecimal(10)) == 0 ){
				batch.setAmt10(total);
				batch.setCount10(count);
			}else if(amt.compareTo(new BigDecimal(5)) == 0 ){
				batch.setAmt5(total);
				batch.setCount5(count);
			}else if(amt.compareTo(new BigDecimal(2)) == 0 ){
				batch.setAmt2(total);
				batch.setCount2(count);
			}else if(amt.compareTo(new BigDecimal(1)) == 0 ){
				batch.setAmt1(total);
				batch.setCount1(count);
			}
		}
		this.cashBatchManager.save(batch);
		return ResultUtils.renderSuccessResult(batch);
	}
	private Result printedCash(Machine machine){
		List<CashBatch> batchs = cashBatchManager.find("from CashBatch where status = ?  and machineMac = ? ", CashBatch.PRINT_STAT_INIT,machine.getMac());
		if (batchs != null && !batchs.isEmpty()) {
			return ResultUtils.renderSuccessResult(batchs);
		}
		
		List<?> results = this.settlementManager.findBySql(
				"SELECT SUM(AMT) ,COUNT(ID) FROM SSM_SETTLEMENT WHERE " 
						+ "PRINT_BATCH_NO IS NULL "
						+ "AND PAY_CHANNEL_CODE = '0000' "
						+ "AND SETTLE_TYPE = 'SP' "
						+ "AND MACHINE_MAC = ? ",
				machine.getMac());
		Object[] result = (Object[]) results.get(0);
		CashBatch batch = new CashBatch();
		if (null == result[0]){
			List<Object> temp = new ArrayList<Object>();
			temp.add(new Long(0));
			temp.add(new BigDecimal(0));
			result = temp.toArray();
		}
		
		batch.setCreateTime(new Date());
		batch.setCount(Long.parseLong(result[1].toString()));
		batch.setAmt(new BigDecimal(result[0].toString()));
		List<CashBatch> news = new ArrayList<CashBatch>();
		news.add(batch);
		return ResultUtils.renderSuccessResult(news);
	}
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreate(@RequestBody String data) {
		Settlement menu = JSONUtils.deserialize(data, Settlement.class);
		// TODO 校验
		Settlement saved = this.settlementManager.save(menu);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Settlement model = JSONUtils.deserialize(data, Settlement.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult();
		}
		this.settlementManager.save(model);

		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		try {
			this.settlementManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
}
