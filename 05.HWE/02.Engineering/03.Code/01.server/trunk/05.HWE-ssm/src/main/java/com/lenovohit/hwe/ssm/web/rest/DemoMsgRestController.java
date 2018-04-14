package com.lenovohit.hwe.ssm.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.text.DecimalFormat;
import java.util.Map;
import java.util.Random;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;

@RestController
@RequestMapping("/hwe/ssm/demo")
public class DemoMsgRestController extends SSMBaseRestController {

	private static final Logger log = LoggerFactory.getLogger(DemoMsgRestController.class);
	
	public static final String posturl = "https://api.ums86.com:9600/sms/Api/Send.do?";
	
	public static final String SpCode = "229072";

	public static final String LoginName = "km_dyrmyy";
	
	public static final String Password = "dyrmyy2730";
	
	/*public static String SMS(String sdst, String smsg) {
        try {
        	String postUrl = posturl;
        	String postData ="";
        	postData+="sname="+sname;
        	postData+="&spwd="+spwd;
        	postData+="&scorpid=";
        	postData+="&sprdid="+sprdid;
        	postData+="&sdst="+sdst;
        	postData+="&smsg="+smsg;
            //发送POST请求
            URL url = new URL(postUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Connection", "Keep-Alive");
            conn.setUseCaches(false);
            conn.setDoOutput(true);

            conn.setRequestProperty("Content-Length", "" + postData.length());
            OutputStreamWriter out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
            out.write(postData);
            out.flush();
            out.close();

            //获取响应状态
            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                System.out.println("connect failed!");
                return "";
            }
            //获取响应内容体
            String line, result = "";
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            while ((line = in.readLine()) != null) {
                result += line + "\n";
            }
            in.close();
            return result;
        } catch (IOException e) {
            e.printStackTrace(System.out);
        }
        return "";
    }*/
	
	//	做一个创建client的工具类
	public static CloseableHttpClient createSSLClientDefault() {
		try {
			SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {
				// 信任所有
				public boolean isTrusted(X509Certificate[] chain, String authType) throws CertificateException {
					return true;
				}
			}).build();
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, new X509HostnameVerifier() {  
                @Override  
                public boolean verify(String arg0, SSLSession arg1) {  
                    return true;  
                }  
                @Override  
                public void verify(String host, SSLSocket ssl) throws IOException {  
                }  
                @Override  
                public void verify(String host, X509Certificate cert) throws SSLException {  
                }  
                @Override  
                public void verify(String host, String[] cns, String[] subjectAlts) throws SSLException {  
                }  
            });
			return HttpClients.custom().setSSLSocketFactory(sslsf).build();
		} catch (KeyManagementException e) {
			e.printStackTrace();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (KeyStoreException e) {
			e.printStackTrace();
		}
		return HttpClients.createDefault();
	}
	
	/**
	 * 发送短信
	 * @param mobile 手机号码(多个号码用”,”分隔)，最多1000个号码
	 * @param msg 短信内容 最大402个字或字符
	 * @param sendTime 预约发送时间，格式 yyyyMMddHHmmss,如‘20090901010101’，
	 * @return 是否发送成功
	 */
	public static boolean sendMsg(String mobile, String msg, String sendTime) {
		CloseableHttpClient httpclient = createSSLClientDefault();
		boolean flag = true;
		HttpResponse response = null;
		BufferedReader inbr = null;
		try {
			String postUrl = posturl;
        	String postData ="";
        	postData+="SpCode="+SpCode;
        	postData+="&LoginName="+LoginName;
        	postData+="&Password="+Password;
        	postData+="&MessageContent="+URLEncoder.encode(msg, "gbk");
        	postData+="&UserNumber="+mobile;
        	postData+="&SerialNumber="+calculateCode();
        	if(StringUtils.isNotEmpty(sendTime)){
            	postData+="&ScheduleTime="+sendTime;
        	}
        	postData+="&f=1";
        	log.info("短信请求：" + postData);
        	
			response = httpclient.execute(new HttpGet(postUrl + postData));
			//获取响应内容体
            String line, result = "";
            inbr = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "gbk"));
            while ((line = inbr.readLine()) != null) {
                result += line + "\n";
            }
        	log.info("短信响应：" + result);
            if(StringUtils.isNotBlank(result) && result.contains("result=0")){
            	flag = true;
            } else {
            	flag = false;
            }
            inbr.close();
			httpclient.close();
		} catch (IOException e) {
			flag = false;
			e.printStackTrace();
		} finally {
			try {
				if(inbr != null){
					inbr.close();
				}
				if(httpclient != null){
					httpclient.close();
				}
			} catch (Exception e2) {
				flag = false;
				e2.printStackTrace();
			}
		}
		return flag;
	}
	/**
	 * 生产短信验证码
	 * @param numberFlag
	 * @param length
	 * @return
	 */
	public static String createCode(boolean numberFlag, int length) {
		
		char[] allChar = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
		char[] numChar = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
		char[] chr = numberFlag ? numChar : allChar;	    
	    Random random = new Random();
	    StringBuffer buffer = new StringBuffer();
	    for (int i = 0; i < length; i++) {
	        buffer.append(chr[random.nextInt(chr.length)]);
	    }
	    return buffer.toString();
	}
	
	/**
	 * 
	 * @Title: calculateCode
	 * @Description: 计算交易流水
	 * @return
	 */
	synchronized public static String calculateCode() {
		
		Random rdm = new Random();
        int codeValue = Math.abs(rdm.nextInt())%1000;
		DecimalFormat df = new DecimalFormat();
		df.applyPattern("000");
		// 2 + (6+6+3) + 3 = 20
		String seq = "SM" + DateUtils.getCurrentDateStr("yyMMddHHmmssSSS") + df.format(codeValue);	
		
		return seq;
	}
	@RequestMapping(value="/sendMsg",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result sendPayMsg(@RequestBody String data) {
		@SuppressWarnings("unchecked")
		Map<String,String> message =  JSONUtils.deserialize(data, Map.class);
		String msg = message.get("msg");
		String phone = message.get("phone");
		sendMsg(phone, msg,  "");
		return ResultUtils.renderSuccessResult();
	}

}
