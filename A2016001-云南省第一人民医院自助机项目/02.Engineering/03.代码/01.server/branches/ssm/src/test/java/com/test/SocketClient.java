package com.test;

import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Reader;
import java.net.Socket;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;

public class SocketClient {
	
	public static void main(String[] args) {
//		String knsj = "53012101027373123";
//		String knsj = "00011211788612133737";
		SocketClient soctetClient = new SocketClient();
		soctetClient.sendMsg("0046HB13的轻微");
//		soctetClient.getPrescriptions(knsj);
//		soctetClient.prepaied(knsj, "^1", "1");
//		soctetClient.pay(knsj);
	}
	
	public String sendMsg(String msg){
		try {
			/** 创建Socket */
			// 创建一个流套接字并将其连接到指定 IP 地址的指定端口号(本处是本机)
			Socket socket = new Socket("10.20.170.92", 2017);//农行----
			// 60s超时
			socket.setSoTimeout(60000);

			/** 发送客户端准备传输的信息 */
			// 由Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "utf-8"));
			// 将输入读入的字符串输出到Server
			printWriter.println(msg);
			// 刷新输出流，使Server马上收到该字符串
			printWriter.flush();

			/** 用于获取服务端传输来的信息 */
			Reader reader = new InputStreamReader(socket.getInputStream(), "utf-8");
			char chars[] = new char[1024];
			int len;
			StringBuilder builder = new StringBuilder();
			while ((len = reader.read(chars)) != -1) {
				builder.append(new String(chars, 0, len));
			}
			System.out.println("Receive from client message=: " + builder);

			/** 关闭Socket */
			printWriter.close();
			reader.close();
			socket.close();
			return builder.toString();
		} catch (Exception e) {
			System.out.println("Exception:" + e);
		}
		return null;
	}
	
	public void getPrescriptions(String knsj){
		String msg = "A^" + knsj + "^";
		String response = this.sendMsg(msg);
		
		if(StringUtils.isNotBlank(response)){
			Map<String, Object> entity = JSONUtils.parseObject(response, new TypeReference<Map<String,Object>>(){});
			System.out.println("数组长度" + entity.size());
		}
	}
	public void prepaied(String knsj, String groups, String payType){
		String msg = "B^"+ knsj /*+ payType*/ + groups +"^";
		String response = this.sendMsg(msg);
		Map<String, Object> entity = JSONUtils.parseObject(response, new TypeReference<Map<String,Object>>(){});
		System.out.println("预结算长度" + entity.size());
	}
	
	public void pay(String knsj){
		String msg = "C^"+ knsj + "^";
		String response = this.sendMsg(msg);
		Map<String, Object> entity = JSONUtils.parseObject(response, new TypeReference<Map<String,Object>>(){});
		System.out.println("结算长度" + entity.size());
	}
	
	
}