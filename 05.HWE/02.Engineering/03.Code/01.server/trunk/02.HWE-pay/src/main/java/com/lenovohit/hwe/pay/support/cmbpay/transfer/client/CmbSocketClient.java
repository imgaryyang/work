package com.lenovohit.hwe.pay.support.cmbpay.transfer.client;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.support.cmbpay.transfer.utils.XmlPacket;

public class CmbSocketClient implements CmbClient{
    protected Log log = LogFactory.getLog(getClass());
	private String frontIp;
	private int frontPort;
	private String charset = "GBK";

	private int connectTimeout = 30000;

	public CmbSocketClient(String frontIp, int frontPort, String charset) {
		this.frontIp = frontIp;
		this.frontPort = frontPort;
		this.charset = charset;
	}

	@Override
	public XmlPacket execute(XmlPacket request) throws BaseException {
		Socket socket = null;
		DataOutputStream wr = null;
		DataInputStream rd = null;
		XmlPacket pktRsp = null;
		try {
			socket = new Socket(this.frontIp, this.frontPort);
			socket.setSoTimeout(this.connectTimeout);
			String data = request.toXmlString();
			String result = "";
			log.info("客户端启动成功--------------------------");
        	log.info("Cmb银行Socket发送报文:【"+ data + "】");

			wr = new DataOutputStream(socket.getOutputStream());
			// 通讯头为8位长度，右补空格：先补充8位空格，再取前8位作为报文头
			String strLen = String.valueOf(data.getBytes(charset).length) + "        ";
			wr.write((strLen.substring(0, 8) + data).getBytes(charset));
			wr.flush();
			
			rd = new DataInputStream(socket.getInputStream());
			// 接收返回报文的长度
			byte rcvLen[] = new byte[8];
			rd.read(rcvLen);
			String sLen = new String(rcvLen);
			int iSum = 0;
			try {
				iSum = Integer.valueOf(sLen.trim());
			} catch (NumberFormatException e) {
				throw new BaseException("Cmb銀行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求返回报文长度错误！" + sLen);
			}
			if (iSum > 0) {
				// 接收返回报文的内容	
				int nRecv = 0, nOffset = 0;
				byte[] rcvData = new byte[iSum];// data
				while (iSum > 0) {
					nRecv = rd.read(rcvData, nOffset, iSum);
					if (nRecv < 0)
						break;
					nOffset += nRecv;
					iSum -= nRecv;
				}
				result = new String(rcvData, this.charset);
			}
			if(!StringUtils.isBlank(result)){
				pktRsp = XmlPacket.valueOf(result, this.charset);
				pktRsp.setBody(result);
			}
			log.info("Cmb銀行Socket接收报文：【" + result + "】");
			log.info("Cmb銀行Socket客户端关闭--------------------------");
			wr.close();
			rd.close();
			socket.close();
		} catch (java.net.SocketTimeoutException e) {
			log.error(e.getMessage());
			throw new BaseException("Cmb银Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求超时！");
		} catch (IOException e) {
			log.error(e.getMessage());
        	throw new BaseException("Cmb银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
		} finally {
			try {
        		if (wr != null) {
        			wr.close(); // 关闭Socket输出流
        		}
        		if (rd != null) {
        			rd.close(); // 关闭Socket输出流
        		}
        		if (socket != null) {
        			socket.close(); // 关闭Socket输出流
        		}
			} catch (Exception e) {
	        	log.error(e.getMessage());
	        	throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
	        }
		}
		
		return pktRsp;
	}

	@Override
	public XmlPacket executeFile(XmlPacket request) throws BaseException {
		return null;
	}

}
