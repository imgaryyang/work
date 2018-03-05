package com.lenovohit.ebpp.bill.web.rest;

import java.util.ArrayList;
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

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ebpp.bill.manager.BillInstanceManager;
import com.lenovohit.ebpp.bill.model.BillInstance;
import com.lenovohit.ebpp.bill.model.BillType;
import com.lenovohit.ebpp.bill.model.BizChannel;
import com.lenovohit.ebpp.bill.model.PayInfo;

@RestController
@RequestMapping("/bill/instance")
public class BillInstanceRestController extends BaseRestController {

	@Autowired
	private BillInstanceManager billInstanceManager;
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;
	@Autowired
	private GenericManager<BillType, String> billTypeManager;

	/**
	 * 创建账单
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("创建账单，输入数据为：【" + data + "】");
		
		checkEmpty(data, "输入数据data不能为空！");

		BillInstance tbi = JSONUtils.deserialize(data, BillInstance.class);
		if (null == tbi) {
			throw new BaseException("输入数据为空！");
		}
		
		if(StringUtils.isNotBlank(tbi.getBizChannel())){
			BizChannel biz = bizChannelManager.get(tbi.getBizChannel());
			if (null == biz) {
				throw new BaseException("无效的业务渠道bizChannel！");
			}
		}
		if(StringUtils.isNotBlank(tbi.getType())){
			BillType bt = billTypeManager.get(tbi.getType());
			if (null == bt) {
				throw new BaseException("无效的账单类型type！");
			}
		}
		tbi = this.billInstanceManager.create(tbi);

		return ResultUtils.renderSuccessResult(tbi);
	}
	
	/**
	 * 批量创建账单
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/batchcreate", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public String forBatchCreate(@RequestBody String data) {
		log.info("批量创建账单，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		JSONObject object = null;
		object = JSON.parseObject(data);
		JSONArray jas= object.getJSONArray("data");
		BillInstance bi = null;
		StringBuffer sb = new StringBuffer("{success:'true',data:[");
		for(int i=0; i<jas.size(); i++){
			Object jo = jas.get(i);
			bi = JSON.parseObject(jo.toString(), BillInstance.class);
			bi = this.billInstanceManager.create(bi);
			sb.append(",{");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("',");
			sb.append("id:'").append(bi.getId()).append("'}");
		}
	
//		tbi 
//		if (null == tbi) {
//			throw new BaseException("输入数据为空！");
//		}
//		
//		
//		tbi = this.billInstanceManager.create(tbi);

		return "";
	}
	
	/**
	 * 账单基本信息更新
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{no}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable(value="no") String no, @RequestBody String data) {
		log.info("账单基本信息更新，输入数据为：【" + data + "】");
		checkEmpty(data, "输入数据data不能为空！");
		checkEmpty(no, "流水号no不能为空！");
		
		BillInstance tbi = JSONUtils.deserialize(data, BillInstance.class);
		tbi.setNo(no);
		if(StringUtils.isNotBlank(tbi.getBizChannel())){
			BizChannel biz = bizChannelManager.get(tbi.getBizChannel());
			if (null == biz) {
				throw new BaseException("无效的业务渠道bizChannel！");
			}
		}
		if(StringUtils.isNotBlank(tbi.getType())){
			BillType bt = billTypeManager.get(tbi.getType());
			if (null == bt) {
				throw new BaseException("无效的账单类型type！");
			}
		}
		BillInstance ret = this.billInstanceManager.update(tbi);
		
		return ResultUtils.renderSuccessResult(ret);
	}
	
	/**
	 * 账单实例状态变更
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updatestatus/{no}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateStatus(@PathVariable(value="no") String no, @RequestBody String data) {
		log.info("账单实例状态变更，输入数据为：【" + data + "】");
		checkEmpty(data, "输入数据data不能为空！");
		checkEmpty(no, "流水号no不能为空！");
		
		BillInstance tbi = JSONUtils.deserialize(data, BillInstance.class);
		tbi.setNo(no);
		BillInstance ret = this.billInstanceManager.updateStatus(tbi);
		
		return ResultUtils.renderSuccessResult(ret);
	}
	
	/**
	 * 账单实例撤销
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{no}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forAbandon(@PathVariable(value="no") String no) {
		log.info("账单实例撤销，输入数据为：【" + no + "】");
		checkEmpty(no, "流水号no不能为空！");
		
		BillInstance tbi = new BillInstance();
		tbi.setNo(no);
		BillInstance ret = this.billInstanceManager.abandon(tbi);
		
		return ResultUtils.renderSuccessResult(ret);
	}

	/**
	 * 账单分页查询
	 * 
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/query", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forQuery(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("账单分页查询，输入查询内容为：" + data);
		Map<String, Object> params = new HashMap<String, Object>();
		if (StringUtils.isEmpty(data)) {
			log.info("查询账单信息，输入查询内容为空：");
		}else{
			params = JSONUtils.deserialize(data, Map.class);
		}
		return this.billInstanceManager.query(params);
	}

	/**
	 * 账单单体查询
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{no}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("no") String no) {
		log.info("账单单体查询，输入no为：【" + no + "】");
		checkEmpty(no, "流水号no不能为空！");

		BillInstance tbi = this.billInstanceManager.findOneByProp("no", no);
		if (null == tbi) {
			throw new BaseException("流水号【" + no + "】不存在！");
		}

		return ResultUtils.renderSuccessResult(tbi);
	}

	/**
	 * 支付成功通知接收
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/payInfo/load", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayInfoLoad(@RequestBody String data) {
		log.info("支付成功通知接收，输入数据为：【" + data + "】");
		checkEmpty(data, "输入数据data不能为空！");

		PayInfo pi = null;
		List<PayInfo> pis = new ArrayList<PayInfo>();
		JSONObject object = null;
		JSONArray pis1 = null;
			object = JSON.parseObject(data);
			pis1= object.getJSONArray("payInfo");
			if ( null==pis1) {
				throw new BaseException("付款详细信息payInfo不能为空！");
			}
			//记录PyaInfo公共部分信息
			pi = JSON.parseObject(object.toJSONString(), PayInfo.class);
			if ( null==pi) {
				throw new BaseException("付款信息不能为空！");
			}
			pis.add(pi);
			for(Object obj:pis1){
				pi = JSON.parseObject(obj.toString(), PayInfo.class);
				if ( null==pi) {
					throw new BaseException("付款详细信息payInfo单条信息不能为空！");
				}
				pis.add(pi);
			}

		this.billInstanceManager.loadPayInfo(pis );
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 批量支付成功通知接收
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/payInfo/batchload", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayInfoBatchLoad(@RequestBody String data) {
		log.info("批量支付成功通知接收，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		@SuppressWarnings("unchecked")
		HashMap<String, Object> hp = JSONUtils.deserialize(data, HashMap.class);
//		int total = (int)hp.get("total");
		PayInfo pi = null;
		try {
			JSONArray jas = (JSONArray)hp.get("data");
			for(int i=0; i<jas.size(); i++){
				Object o = jas.get(i).toString();
				pi = JSONUtils.deserialize(o.toString(), PayInfo.class);
//				bid = 
				if (null != pi) {
//					this.billInstanceManager.loadPayInfo(pi, bid);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	private void checkEmpty(String data, String msg){
		if (StringUtils.isEmpty(data) || "null".equalsIgnoreCase(data.trim())) {
			throw new BaseException(msg);
		}
	}
}
