package com.infohold.wallet.web.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.client.ClientProtocolException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.ebpp.bill.manager.BillInstanceManager;
import com.infohold.ebpp.bill.model.BillInstance;
import com.infohold.ebpp.bill.model.BillType;
import com.infohold.ebpp.bill.model.BizChannel;
import com.infohold.el.model.BankCardLog;
import com.infohold.wallet.model.PaySysCBRequest;
import com.infohold.wallet.model.PaySysResponse;
import com.infohold.wallet.utils.HttpCallBack;
import com.infohold.wallet.utils.HttpUtils;

/**
 * APP用户管理
 * 支付流程
 * app调用钱包-钱包调用支付系统-支付系统调用银联<br>
 * 银联回调支付系统，支付系统回调钱包-钱包回调商城或者医保<br>
 * TODO 异常控制 出错控制 日志记录等
 *
 */
@RestController
@RequestMapping("/wallet/pay")
public class PayRestController extends BaseRestController {
	@Autowired
	private BillInstanceManager billInstanceManager;
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;
	@Autowired
	private GenericManager<BillType, String> billTypeManager;
	
	public static String PAY_SYSTEM_URL;//支付系统url
	public static String WALLET_BASE_URL;//支付系统回调钱包的baseurl
	
	@Value("${app.wallet.base.url:127.0.0.1:9500}")
	public static void setWALLET_BASE_URL(String wALLET_BASE_URL) {
		WALLET_BASE_URL = wALLET_BASE_URL;
	}
	@Value("${app.wallet.paysystem.url:127.0.0.1:9600}")
	public static void setPAY_SYSTEM_URL(String pAY_SYSTEM_URL) {
		PAY_SYSTEM_URL = pAY_SYSTEM_URL;
	}
	
	
	
	/**
	 * 统一的预支付接口<br>
	 * 订单或者缴费请求过来时生成账单<br>
	 * 渠道<br>
	 * CODE	NAME	_TYPE	STATUS	MEMO	CREATED_ON<br>
	 * NWC001	商城	01	01	\N	2016-07-23 10:30:30<br>
	 * NWC002	手机	01	01	\N	2016-07-23 10:30:30<br>
	 * NWC003	12333	02	01	\N	2016-07-23 10:30:30<br>
	 * 类型<br>
	 * CODE	NAME	MEMO	BIZCH_CODE	CREATED_ON	STATUS	CATALOG_ID<br>
	 * NWB101	商城订单	商城的订单	\N	\N	01	\N<br>
	 * NWB201	约定缴费	1233的约定缴费	\N	\N	01	\N<br>
	 * NWB301	钱包充值	钱包的充值账单	\N	\N	01	\N<br>
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/prepare", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayPrepare(@RequestBody String data) {
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
		/*if(StringUtils.isNotBlank(tbi.getBackendurl())){
			throw new BaseException("后端回调url不能为空");
		}
		if(StringUtils.isNotBlank(tbi.getFrontendurl())){
			throw new BaseException("前端回调url不能为空");
		}*/
		tbi = this.billInstanceManager.create(tbi);
		
		return ResultUtils.renderSuccessResult(tbi);
	} 
	/**
	 * 支付接口<br>
	 * 根据账单号码获取账单信息，拿到账单信息打包发给支付系统<br>
	 * 支付系统完成处理返回，返回的结果直接返回给app界面
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{billId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayBill(@PathVariable("billId") String billId) {
		BillInstance tbi = this.billInstanceManager.get(billId);
		if(StringUtils.isEmpty(billId)){
			throw new BaseException("空的账单id");
		}
		if (null == tbi) {
			throw new BaseException("无效的账单："+billId);
		}
		Map<String,String> param = new HashMap<String,String>();
		param.put("version", "");//	消息版本号	String(8)	用于表示支持的协议版本号。
		param.put("charset", "");//	字符编码	String(20)	报文中字符的编码规范,目前仅支持UTF-8
		
		param.put("transType", "");//	交易类型	String(2)	交易的种类
		param.put("catCode", "");//	费种编码	String(10)	商户业务订单的费种类别
		param.put("catName", "");//	费种名称	String(70)	商户业务订单的费种名称
		param.put("appName", "");//	商户名称	String(70)	在iEBP接入注册的商户名称
		param.put("appNo", "");//	商户代码	String(50)	接入iEBP时，分配的唯一商户ID
		param.put("backEndUrl", "");//	后台通知URL	String(256)	商户网站接收支付平台异步通知交易结果的URL
		param.put("bizDate", "");//	订单日期时间	String(19)	订单日期时间。格式：YYYYMMDDHHMMSS", "");//
		param.put("bizNo", "");//	商户订单号	String(50)	表示商户的订单号。在商户内部应唯一
		param.put("settleDesc", "");//	商品名称	String(256)	表示订单的商品信息
		param.put("amt", "");//	交易金额	Number(17,2)	订单的总交易金额
		param.put("ccy", "");//	交易币种	String(3)	交易货币代码
		param.put("payerNo", "");//	付款人标识	String(50)	支付用户在业务系统中的用户标识
		param.put("payerName", "");//	付款人姓名	String(70)	支付用户在业务系统中的用户名称
		param.put("payType", "");//	支付方式	String(2)	交易支付方式
		param.put("bankNo", "");//	银行号	String(12)	支付的银行代码，参见附录F《银行号分类》
		param.put("payerIp", "");//	付款人IP	String(15)	付款人访问商户网站时的IP地址
		param.put("payerMobileNo", "");//	付款人手机号码	String(20)	付款人手机号码
		param.put("appReserved", "");//	商户保留域	String(1024)	此保留域供商户在请求报文中带给支付平台。
		
		String secret_key="";
		String signature = this.getPaySignature(secret_key,param);
		param.put("signMethod", "MD5");//	签名方法	String(20)	报文中签名的算法,仅支持MD5
		param.put("signature", signature);//	签名信息	String(32)	采用签名算法对交易过程中的关键信息和商户密钥进行签名
		
		try {
			HttpCallBack callback = new HttpCallBack(){
				public void callBack(String responseText) {
					Map<String,String> map = JSONUtils.parseObject(responseText,
							new TypeReference<Map<String,String>>(){}
					);
					this.response = JSONUtils.deserialize(map.get("result"), PaySysResponse.class);
				}
			};
			HttpUtils.postForm(PAY_SYSTEM_URL, param, callback);
			return ResultUtils.renderSuccessResult(callback.getResponse());
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			throw new BaseException("无法连接支付系统,e: "+e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new BaseException("支付系统连接出错"+e.getMessage());
		}	
		//return ResultUtils.renderFailureResult();
	}
	private String getPaySignature(String secret_key, Map<String, String> param) {
		StringBuilder sb = new StringBuilder();
		Set<String> keys =  param.keySet();
		for(String key : keys){
			sb.append(key).append("=").append(param.get(key)).append("&");
		}
		String lc_key = DigestUtils.md5Hex(secret_key).toLowerCase();
		String toSignString = sb.append(lc_key).toString();
		String signature=DigestUtils.md5Hex(toSignString).toLowerCase();
		return signature;
	}
	/**
	 * 支付回调<br>
	 * 银联支付完毕后回调支付系统<br>
	 * 支付系统完成处理回调钱包<br>
	 * 钱包处理完毕后回调业务系统(商城或者12333)
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/callback", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPayCallBack(@RequestBody String data) {
		if(null==data){
			throw new BaseException("支付系统回调输入为空");
		}
		PaySysCBRequest request = JSONUtils.deserialize(data, PaySysCBRequest.class);
		if(null==request){
			throw new BaseException("支付系统回调输入为空");
		}
		
		String billNo = request.getBizNo();
		List<BillInstance> bills = this.billInstanceManager.find("from BillInstance where no = ? ", billNo);
		if(null == bills || bills.isEmpty()){
			throw new BaseException("支付回调时未找到相应的账单，账单号："+billNo);
		}
		if(bills.size()>1){
			throw new BaseException("找到多条对应的账单，账单号："+billNo);
		}
		BillInstance tbi = bills.get(0);
		if(!"00".equals(request.getRespCode())){//00代表成功，否则代表处理失败，失败信息见响应信息
			tbi.setStatus(BillInstance.STATUS_PAYED_FAILURE);
			this.billInstanceManager.save(tbi);
		}//TODO 完善资源信息
		tbi.setStatus(BillInstance.STATUS_PAYED_SUCCESS);
		this.billInstanceManager.save(tbi);
		//回调商城 
		try {
			if(!StringUtils.isEmpty(tbi.getBackendurl())){
				Map<String,String> backParam = new HashMap<String,String>();
				HttpCallBack callback = new HttpCallBack(){
					public void callBack(String responseText) {
						Map<String,String> map = JSONUtils.parseObject(responseText,
								new TypeReference<Map<String,String>>(){}
						);
						this.response = JSONUtils.deserialize(map.get("result"), PaySysResponse.class);
					}
				};
				HttpUtils.postForm(tbi.getBackendurl(), backParam, callback);
			}
			//TODO 修改账单最终状态
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			throw new BaseException("回调商城或其他接入方失败,"+e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new BaseException("回调商城或其他接入方失败,"+e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	} 

	private void checkEmpty(String data, String msg){
		if (StringUtils.isEmpty(data) || "null".equalsIgnoreCase(data.trim())) {
			throw new BaseException(msg);
		}
	}
}
