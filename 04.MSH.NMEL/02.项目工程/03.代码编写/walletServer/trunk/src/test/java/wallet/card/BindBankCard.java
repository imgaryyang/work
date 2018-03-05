package wallet.card;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.client.ClientProtocolException;

import com.alibaba.fastjson.TypeReference;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.el.base.model.CardBin;
import com.infohold.el.model.BankCardLog;
import com.infohold.wallet.utils.HttpCallBack;
import com.infohold.wallet.utils.HttpUtils;

public class BindBankCard {

	public static void main(String[] args) throws ClientProtocolException, IOException {
		String bankCard = "6226090000000048";
		CardBin cardBin = cardBin(bankCard);
		BankCardLog log = submitInfo(bankCard,cardBin);
//		callback(log);
	}
	public static BankCardLog submitInfo(String bankCard,CardBin cardBin) throws ClientProtocolException, IOException{
		Map<String,String> param = new HashMap<String,String>();
		param.put("cardholder", "张三");
		param.put("idCardNo", "510265790128303");
		param.put("mobile", "18100000000");
		param.put("cardNo", bankCard);
		param.put("personId", "00000000562711b401562723ee840005");
		param.put("cardBin", JSONUtils.serialize(cardBin));
		HttpCallBack callback = new HttpCallBack(){
			public void callBack(String responseText) {
				Map<String,String> map = JSONUtils.parseObject(responseText,
						new TypeReference<Map<String,String>>(){}
				);
				this.response = JSONUtils.deserialize(map.get("result"), BankCardLog.class);
			}
		};
		HttpUtils.postText("http://127.0.0.1:9500/el/cardBin/submitInfo", JSONUtils.serialize(param), callback);
		BankCardLog response = (BankCardLog)callback.getResponse();
		return response;
	}
	public static void callback(BankCardLog log ) throws ClientProtocolException, IOException{
		Map<String,String> param = new HashMap<String,String>();
		String orderId = log.getId(),
				txnTime= DateUtils.date2String(new Date(), "yyyyMMddhhmmss"),
				status="1";
		param.put("orderId", orderId);
		param.put("txnTime", txnTime);
		
		param.put("status", status);
		
		String $key = "zhangzhaoyi";//32md5加密串
		String myKey = DigestUtils.md5Hex($key+orderId+txnTime);
		
		param.put("str", myKey);
		
		
		HttpCallBack callback = new HttpCallBack(){
			public void callBack(String responseText) {
				this.response = responseText;
			}
		};
		HttpUtils.postForm("http://127.0.0.1:9500/el/bankCards/bindCardCallBack", param, callback);
		System.out.println(callback.getResponse());
	}
	
	public static CardBin cardBin(String bankCard) throws ClientProtocolException, IOException{
		
		HttpCallBack callback = new HttpCallBack(){
			public void callBack(String responseText) {
				Map<String,String> map = JSONUtils.parseObject(responseText,
						new TypeReference<Map<String,String>>(){}
				);
				this.response = JSONUtils.deserialize(map.get("result"), CardBin.class);
				//this.response = JSONUtils.deserialize(responseText, CardBin.class);
			}
		};
		HttpUtils.get("http://127.0.0.1:9500/el/cardBin/checkCardNo/"+bankCard, callback);
		
		return (CardBin)callback.getResponse();
	}
	
}
