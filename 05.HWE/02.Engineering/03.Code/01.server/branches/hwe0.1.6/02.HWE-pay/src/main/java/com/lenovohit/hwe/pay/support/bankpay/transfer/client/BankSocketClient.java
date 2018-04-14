package com.lenovohit.hwe.pay.support.bankpay.transfer.client;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.Socket;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.hwe.pay.support.bankpay.transfer.config.Constants;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.request.BankFileRequest;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.request.BankRequest;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankDownloadResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.utils.StringParser;

public class BankSocketClient implements BankClient{
    protected Log log = LogFactory.getLog(getClass());
	private String frontIp;
	private int frontPort;
	private String charset = "UTF-8";

	private int connectTimeout = 30000;
//	private int readTimeout = 15000;

	public BankSocketClient(String frontIp, int frontPort, String charset) {
		this.frontIp = frontIp;
		this.frontPort = frontPort;
		this.charset = charset;
	}

	@Override
	public <T extends BankResponse> T execute(BankRequest<T> request) throws BaseException {
		Socket socket = null;
		BufferedOutputStream out = null;
		BufferedInputStream in = null;
		T tRsp = null;
		try {
			// 1、创建客户端Socket，指定服务器地址和端口
			socket = new Socket(this.frontIp, this.frontPort);
			socket.setSoTimeout(this.connectTimeout);
            log.info("客户端启动成功--------------------------");
            log.info("银行Socket发送报文:【"+ new String(request.getContentBytes(), this.charset) + "】");
            // 2、获取输出流，向服务器端发送信息
            // 由Socket对象得到输出流，并构造BufferedOutputStream对象
            out = new BufferedOutputStream(socket.getOutputStream());
            out.write(request.getContentBytes());
            out.flush();
            socket.shutdownOutput();
            // 3、获取输入流，并读取服务器端的响应信息 
            // 由Socket对象得到输入流，并构造相应的BufferedInputStream对象
			in = new BufferedInputStream(socket.getInputStream());
			byte[] content = new byte[request.getResponseLength()];
			if( in.read(content) == -1 ){
				log.error("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求报文长度错误！");
				throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求报文长度错误！");
			}
			// 4、结果解析
			StringParser<T> parser = new StringParser<T>(request.getResponseClass());
			tRsp = parser.parse(content, this.charset);
			tRsp.setBody(new String(content, this.charset));
			log.info("银行Socket接收报文：【" + new String(content, this.charset) + "】");
            log.info("银行Socket客户端关闭--------------------------");
            // 5、关闭资源 
            out.close(); // 关闭Socket输出流
            in.close(); // 关闭Socket输入流
            socket.close(); // 关闭Socket
		} catch (BaseException be) {
        	log.error(be.getMessage());
        	throw be;
		} catch (Exception e) {
        	log.error(e.getMessage());
        	throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
		} finally {
        	try {
        		if (out != null) {
        			out.close(); // 关闭Socket输出流
        		}
        		if (in != null) {
        			in.close(); // 关闭Socket输出流
        		}
        		if (socket != null) {
        			socket.close(); // 关闭Socket输出流
        		}
			} catch (Exception e) {
	        	log.error(e.getMessage());
	        	throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
	        }
		}
		
		return tRsp;
	}

	@Override
	public <T extends BankResponse> T executeFile(BankFileRequest<T> request) throws BaseException {
		Socket socket = null;
		BufferedOutputStream out = null;
		BufferedInputStream in = null;
		FileOutputStream fos = null;  
		T tRsp = null;
		try {
			// 1、创建客户端Socket，指定服务器地址和端口
			socket = new Socket(this.frontIp, this.frontPort);
            socket.setSoTimeout(this.connectTimeout);
            log.info("客户端启动成功--------------------------");
            log.info("银行Socket发送报文:【"+ new String(request.getContentBytes(), this.charset) + "】");
            // 2、获取输出流，向服务器端发送信息
            // 由Socket对象得到输出流，并构造BufferedOutputStream对象
            out = new BufferedOutputStream(socket.getOutputStream());
            out.write(request.getContentBytes());
            out.flush();
            socket.shutdownOutput();
            // 3、获取输入流，并读取服务器端的响应信息 
            // 由Socket对象得到输入流，并构造相应的BufferedInputStream对象
			in = new BufferedInputStream(socket.getInputStream());
			byte[] content = new byte[request.getResponseLength()];
			if( in.read(content) == -1 ){
				throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求报文长度错误！");
			}
			// 4、结果解析
			StringParser<T> parser = new StringParser<T>(request.getResponseClass());
			tRsp = parser.parse(content, this.charset);
			tRsp.setBody(new String(content, this.charset));
			BankDownloadResponse bdr = (BankDownloadResponse)tRsp;
			if(bdr != null && Constants.SUCCESS.equals(bdr.getRespCode())){
				File file = new File(request.getFilePath() + bdr.getFileName());  
				if(!file.getParentFile().exists()) file.getParentFile().mkdirs();
				if(!file.exists()) file.createNewFile();    
				fos = new FileOutputStream(file);
				int l = -1;
				byte[] tmp = new byte[1024];
				while ((l = in.read(tmp)) != -1) {
					fos.write(tmp, 0, l);
				}
				fos.flush();
	            fos.close();// 关闭文件流输出流
			}
			
			log.info("银行Socket接收报文：【" + new String(content, this.charset) + "】");
            log.info("银行Socket客户端关闭--------------------------");
            // 5、关闭资源 
            out.close(); // 关闭Socket输出流
            in.close(); // 关闭Socket输入流
            socket.close(); // 关闭Socket
		} catch (BaseException be) {
        	log.error(be.getMessage());
        	throw be;
		} catch (Exception e) {
        	log.error(e.getMessage());
        	throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
		} finally {
        	try {
        		if (out != null) {
        			 out.close(); // 关闭Socket输出流
        		}
        		if (in != null) {
        			in.close(); // 关闭Socket输出流
        		}
        		if (fos != null) {
        			fos.close(); // 关闭文件流输出流
        		}
        		if (socket != null) {
        			socket.close(); // 关闭Socket
        		}
			} catch (Exception e) {
	        	log.error(e.getMessage());
	        	throw new BaseException("银行Socket【" +this.frontIp+ "：" +this.frontPort+"】客户端请求错误！");
	        }
		}
		
		return tRsp;
	}

}
