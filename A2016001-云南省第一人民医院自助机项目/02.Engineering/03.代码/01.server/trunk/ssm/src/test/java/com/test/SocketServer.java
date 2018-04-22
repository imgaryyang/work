package com.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.UUIDGenerator;


public class SocketServer {
	private static ServerSocket serverSocket;

	public static void main(String[] args) {
		try {
			serverSocket = new ServerSocket(2017);
			System.out.println("启动本地Socket测试服务器,IP：【127.0.0.1】,端口：【2017】！");
			while (true) {
				// 侦听并接受到此Socket的连接,请求到来则产生一个Socket对象，并继续执行
				Socket socket = serverSocket.accept();

				/** 获取客户端传来的信息 */
				// 由Socket对象得到输入流，并构造相应的BufferedReader对象
				BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream(),"UTF-8"));
				// 获取从客户端读入的字符串
				String requestContent = bufferedReader.readLine();

				System.out.println("accept client Request:【" + requestContent +"】") ;
				System.out.println("accept client Request length: " + requestContent.getBytes("UTF-8").length) ;
				System.out.println("accept client Request \"length\": " + requestContent.substring(0, 4));
				
				String code = requestContent.substring(4, 8);
				List<String> retLineList = new ArrayList<>();
				switch (code) {
					case "HB02" : 
						retLineList =  refund(requestContent);
						break;
					case "HB09" :
						retLineList =  query(requestContent);
						break;
					case "HB06" :
						retLineList =  queryCard(requestContent);
						break;
					case "HB05" :
						retLineList =  checkOrder(requestContent);
						break;
					default :
						;
				}
				/** 发送服务端准备传输的 */
				// 由Socket对象得到输出流，并构造PrintWriter对象
				PrintWriter printWriter = new PrintWriter(socket.getOutputStream());
				for(int i = 0;i<retLineList.size(); i++ ){
					printWriter.print(retLineList.get(i));
					System.out.println("accept client Response:【" + retLineList.get(i)+"】") ;
					System.out.println("accept client Response length: " + retLineList.get(i).getBytes("UTF-8").length) ;
					System.out.println("accept client Response \"length\": " + retLineList.get(i).substring(0, 4));
				}
				printWriter.flush();

				/** 关闭Socket */
				printWriter.close();
				bufferedReader.close();
				socket.close();
			}
		} catch (Exception e) {
			System.out.println("Exception:" + e);
		} finally {
			// serverSocket.close();
		}
	}
	
	public static List<String> refund(String requestContent) throws UnsupportedEncodingException {

//		String length = requestContent.substring(0, 4);
		String code = subBytes(requestContent, 4, 8);
//		String hisCode = subBytes(requestContent, 8, 14);
		String bankCode = subBytes(requestContent, 14, 18);
		String outTradeNo = subBytes(requestContent, 18, 34); 
		String outTradeDate = subBytes(requestContent, 34, 42);
		String outTradeTime = subBytes(requestContent, 42, 48);
		String cardBankCode = subBytes(requestContent, 48, 60);
		String account = subBytes(requestContent, 60, 92);
		String accountName = subBytes(requestContent, 92, 220);
		String amount = subBytes(requestContent, 220, 232);
		
		String _length = "496";
		String _code = code;
		String _bankCode = bankCode;
		String _outTradeNo = outTradeNo;
		String bankTradeNo = UUIDGenerator.uuid().substring(20, 32);
		String bankTradeDate = outTradeDate;
		String bankTradeTime = outTradeTime;
		String _cardBankCode = cardBankCode;
		String _account = account;
		String _accountName = accountName;
		String _amount = amount;
		String respCode = "000011";
		String respMsg = "退款处理中";

		final StringBuilder sb = new StringBuilder("");
        sb.append(getBytes(4, (byte) 48, "left", _length));
		sb.append(getBytes(4, (byte) 32, "right", _code));
		sb.append(getBytes(4, (byte) 32, "right", _bankCode));
        sb.append(getBytes(16, (byte)32, "right", _outTradeNo));
        sb.append(getBytes(12, (byte)32, "right", bankTradeNo));
        sb.append(getBytes(8, (byte)32, "right", bankTradeDate));
        sb.append(getBytes(6, (byte)32, "right", bankTradeTime));
        sb.append(getBytes(12, (byte)32, "right", _cardBankCode));
        sb.append(getBytes(32, (byte)32, "right", _account));
        sb.append(getBytes(128, (byte)32, "right", _accountName));
        sb.append(getBytes(12, (byte)48, "left", _amount));
        sb.append(getBytes(6, (byte)32, "right", respCode));
        sb.append(getBytes(256, (byte)32, "right",  respMsg));
        
//		String responseContent = _length + _code + _bankCode + _outTradeNo + bankTradeNo + bankTradeDate + bankTradeTime 
//				+ _cardBankCode + _account + _accountName + _amount + respCode + respMsg;
//		
		List<String> ret = new ArrayList<String>();
		ret.add(sb.toString());
		
		return ret;
	}
	
	public static List<String> query(String requestContent) {
//		String length = requestContent.substring(0, 4);
		String code = requestContent.substring(4, 8);
//		String hisCode = requestContent.substring(8, 14);
		String bankCode = requestContent.substring(14, 18); 
		String tradeType = requestContent.substring(18, 20);
		String outTradeNo = requestContent.substring(20, 36);
		String outTradeDate = requestContent.substring(36, 44);
		String outTradeTime = requestContent.substring(44, 50);
		
		
		String _length = "358";
		String _code = code;
		String _tradeType = tradeType;
		String _bankCode = bankCode;
		String _outTradeNo = outTradeNo;
		String bankTradeNo = UUIDGenerator.uuid().substring(20, 32);
		String bankTradeDate = outTradeDate;
		String bankTradeTime = outTradeTime;
		String account = "testAccount";
		String amount = String.format("%12s", Math.random()*10);
		String respCode = "000001";
		String respMsg = "交易失败";
		
		final StringBuilder sb = new StringBuilder("");
        sb.append(getBytes(4, (byte) 48, "left", _length));
		sb.append(getBytes(4, (byte) 32, "right", _code));
		sb.append(getBytes(4, (byte) 32, "right", _bankCode));
		sb.append(getBytes(2, (byte) 32, "right", _tradeType));
        sb.append(getBytes(16, (byte)32, "right", _outTradeNo));
        sb.append(getBytes(12, (byte)32, "right", bankTradeNo));
        sb.append(getBytes(8, (byte)32, "right", bankTradeDate));
        sb.append(getBytes(6, (byte)32, "right", bankTradeTime));
        sb.append(getBytes(32, (byte)32, "right", account));
        sb.append(getBytes(12, (byte)48, "left", amount));
        sb.append(getBytes(6, (byte)32, "right", respCode));
        sb.append(getBytes(256, (byte)32, "right",  respMsg));
        
//		String responseContent = _length + _code + _bankCode + _tradeType + _outTradeNo + bankTradeNo + bankTradeDate + bankTradeTime 
//				+ account + amount + respCode + respMsg;
//		
		List<String> ret = new ArrayList<String>();
		ret.add(sb.toString());
		
		return ret;
	}
	
	public static List<String> queryCard(String requestContent) {
//		String length = requestContent.substring(0, 4);
		String code = requestContent.substring(4, 8);
//		String hisCode = requestContent.substring(8, 14);
		String bankCode = requestContent.substring(14, 18); 
//		String account = requestContent.substring(18, 50);
		
		String _length = "270";
		String _code = code;
		String _bankCode = bankCode;
		String respCode = "000000";
		String respMsg = "交易成功";
		
		final StringBuilder sb = new StringBuilder("");
        sb.append(getBytes(4, (byte) 48, "left", _length));
		sb.append(getBytes(4, (byte) 32, "right", _code));
		sb.append(getBytes(4, (byte) 32, "right", _bankCode));
        sb.append(getBytes(6, (byte) 32, "right", respCode));
        sb.append(getBytes(256, (byte) 32, "right",  respMsg));
        
//		String responseContent = _length + _code + _bankCode + respCode + respMsg;
//
		List<String> ret = new ArrayList<String>();
		ret.add(sb.toString());
		
		return ret;
	}
	
	public static List<String> checkOrder(String requestContent) {
//		String length = requestContent.substring(0, 4);
		String code = requestContent.substring(4, 8);
//		String hisCode = requestContent.substring(8, 14);
		String bankCode = requestContent.substring(14, 18); 
		String checkDate = requestContent.substring(18, 26);

		String _length = "332";
		String _code = code;
		String _bankCode = bankCode;
		String _checkDate = checkDate;
		String checkTotal = "10";
		String checkTotalAmt = "100.01";
		String checkFileName = bankCode + "_20170406.txt";
		String checkFileSize = "1012314";
		String respCode = "000000";
		String respMsg = "交易成功";
		
		final StringBuilder sb = new StringBuilder("");
        sb.append(getBytes(4, (byte) 48, "left", _length));
		sb.append(getBytes(4, (byte) 32, "right", _code));
		sb.append(getBytes(4, (byte) 32, "right", _bankCode));
		sb.append(getBytes(8, (byte) 32, "right", _checkDate));
		sb.append(getBytes(10, (byte) 48, "left", checkTotal));
		sb.append(getBytes(16, (byte) 48, "left", checkTotalAmt));
		sb.append(getBytes(20, (byte) 32, "right", checkFileName));
		sb.append(getBytes(8, (byte) 48, "left", checkFileSize));
        sb.append(getBytes(6, (byte)32, "right", respCode));
        sb.append(getBytes(256, (byte)32, "right",  respMsg));
//		String responseContent = _length + _code + _bankCode + _checkDate + checkTotal+ checkTotalAmt+ checkFileName+ checkFileSize+ respCode + respMsg;
		
        List<String> ret = new ArrayList<String>();
		ret.add(sb.toString());
		ret.add("0102                                                  ");
		ret.add("HB02|11|689.59                                        ");
		ret.add("000000978712|0000003988|HB02|6222081203006090000|2.10 ");
		ret.add("000000979120|0000003989|HB02|6222350031400004|32.00   ");
		ret.add("000000979218|0000003990|HB02|6212261001013000648|13.10");
		
		return ret;
	}
	
	private static String subBytes(String str, int start, int limit) throws UnsupportedEncodingException {
		byte[] bytes = str.getBytes("UTF-8");
		int length = limit - start;
		byte[] bs = new byte[length];
		for (int i = 0; i < length; i++) {
			bs[i] = bytes[i + start];
		}
		return new String(bs, "UTF-8");
	}

	public static String getBytes(int length, byte filler, String pattern, String value) {
		byte[] bt = null;
		byte[] _bt = new byte[length];
		try {
			bt = value.getBytes("UTF-8");
			switch (pattern) {
			case "right":
				for (int i = 0; i < length; i++) {
					if (i < bt.length) {
						_bt[i] = bt[i];
					} else {
						_bt[i] = filler;
					}
				}
				break;
			case "left":
				for (int i = 0; i < length; i++) {
					if (i < bt.length) {
						_bt[length - 1 - i] = bt[bt.length - 1 - i];
					} else {
						_bt[length - 1 - i] = filler;
					}
				}
				break;
			default:
			}
			return new String(_bt, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			new BaseException("系统错误，不支持的字符！");
		} catch (Exception e) {
			e.printStackTrace();
			new BaseException("字符串转固定长度字节错误！");
		}
		return "";
	}
}