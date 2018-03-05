package com.infohold.wallet.utils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpUtils {
	private static final CloseableHttpClient httpclient = HttpClients.createDefault(); 
	
	public static void get(String host,String path,Map<String,String> params,HttpCallBack callback) throws ClientProtocolException, IOException, URISyntaxException{
		URIBuilder uriBuilder = new URIBuilder().setScheme("http").setHost(host).setPath(path);  
		if(params!=null && !params.isEmpty()){
			Set<String> keys = params.keySet();
			for(String key : keys){
				uriBuilder.setParameter(key, params.get(key)); 
			}
		}
		HttpGet httpget = new HttpGet(uriBuilder.build());  
		CloseableHttpResponse response = httpclient.execute(httpget);  
		try {  
		    HttpEntity entity = response.getEntity();  
		    if (entity != null) {  
		    	String responseText = EntityUtils.toString(entity, "UTF-8");
				callback.callBack(responseText);
		    }else{
		    	callback.callBack(null);
		    }  
		} finally {  
		    response.close();  
		}  
	}
	
	public static void get(String url,HttpCallBack callback) throws ClientProtocolException, IOException{
		HttpGet httpget = new HttpGet(url);  
		CloseableHttpResponse response = httpclient.execute(httpget);  
		try {  
		    HttpEntity entity = response.getEntity();  
		    if (entity != null) {  
		    	String responseText = EntityUtils.toString(entity, "UTF-8");
				callback.callBack(responseText);
		    }else{
		    	callback.callBack(null);
		    }   
		} finally {  
		    response.close();  
		}  
	}
	
	public static void postForm(String url, Map<String,String> params,HttpCallBack callback) throws ClientProtocolException, IOException {

		HttpPost httpPost = new HttpPost(url);
		// 创建参数队列
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		if(params!=null && !params.isEmpty()){
			Set<String> keys = params.keySet();
			for(String key : keys){
				formparams.add(new BasicNameValuePair(key, params.get(key)));
			}
		}
		UrlEncodedFormEntity entity;
		try {
			entity = new UrlEncodedFormEntity(formparams, "UTF-8");
			httpPost.setEntity(entity);
			CloseableHttpResponse httpResponse = httpclient.execute(httpPost);
			HttpEntity httpEntity = httpResponse.getEntity();
			if (httpEntity != null) {
				String responseText = EntityUtils.toString(httpEntity, "UTF-8");
				callback.callBack(responseText);
			}else{
		    	callback.callBack(null);
		    } 
			// 释放资源
			httpResponse.close();
			//httpclient.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public static void postText(String url, String text,HttpCallBack callback) throws ClientProtocolException, IOException {

		HttpPost httpPost = new HttpPost(url);
		// 创建参数队列
		try {
			httpPost.addHeader("Content-type","application/json; charset=utf-8");  
			httpPost.setHeader("Accept", "application/json");  
			httpPost.setEntity(new StringEntity(text, Charset.forName("UTF-8")));  
			CloseableHttpResponse httpResponse = httpclient.execute(httpPost);
			HttpEntity httpEntity = httpResponse.getEntity();
			if (httpEntity != null) {
				String responseText = EntityUtils.toString(httpEntity, "UTF-8");
				callback.callBack(responseText);
			}else{
		    	callback.callBack(null);
		    } 
			// 释放资源
			httpResponse.close();
			//httpclient.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
