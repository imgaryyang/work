package com.lenovohit.hwe.pay.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * 交易异常记录，包括交易码，错误级别，以及异常信息
 * <p>异常码组成规则说明：异常码由8位数字组成，第1位代表错误级别，第2-4位代表模块编号，第5-8位为错误编号</p>
 * <p>一级级别，错误级别说明：9-"ERROR", 4-"WARN", 1-"INFO", 0-"DEFAULT" 默认"0"</p>
 * <p>二级业务，业务模块说明：000-"系统错误", 100-"支付业务异常", 900-"其他错误"</p>
 * <p>三级系统错误码，系统错误说明：0000-"程序错误", 1000-"文件错误"，2000-"数据库错误"，3000-"数据库异常"....9000-"其他错误"</p>
 * <p>三级业务错误码，业务异常说明：00xx-"预留", 10xx-"数据错误"，20xx-"权限错误"，30xx-"交易异常"，40xx-"第三方异常"，50xx-"账务异常"....9000-"其他错误"</p>
 * <p>数据错误说明：00-"预留", 1x-"非空字段未空"，2x-"数据格式错误"，3x-"业务控制错误"，....</p>
 * <p>权限错误说明：00-"预留", 1x-"商户账户状态错误"，2x-"开通支付渠道权限错误"，3x-"开通费种权限错误"</p>
 * <p>交易错误说明：00-"预留", 1x-"数据错误"，2x-"签名错误"，3x-"网络错误"</p>
 * <p>第三方错误说明：00-"预留", 1x-"数据错误"，2x-"签名错误"，3x-"网络错误"</p>
 * <p>账务异常说明：00-"预留"</p>
 */
public class PayException extends RuntimeException {
	private static final long serialVersionUID = -623045610790927931L;
	private static String EXCEPTION_CODE_DEFAULT = "00000000";//系统默认错误
	
	protected String exceptionCode;
	protected String exceptionMsg;
	protected ExceptionLevel level;
	
	
	public PayException() {
	}

	public PayException(String message) {
		super();
		this.exceptionMsg = message;
		this.exceptionCode = EXCEPTION_CODE_DEFAULT;
	}
	
	public PayException(PayException e) {
		super();
		this.exceptionCode = e.getExceptionCode();
		this.exceptionMsg = e.getExceptionMsg();
	}
	public PayException(Exception e) {
		super(getTraceMessage(e));
		this.exceptionCode = EXCEPTION_CODE_DEFAULT;
		this.exceptionMsg = e.getMessage();
	}
	public PayException(Throwable cause) {
		super(cause);
		this.exceptionCode = EXCEPTION_CODE_DEFAULT;
		this.exceptionMsg = cause.getMessage();
	}
	
	public PayException(String exceptionCode, String message) {
		super(message);
		this.exceptionCode = exceptionCode;
		this.exceptionMsg = message;
	}
	
	public PayException(String exceptionCode, Exception e) {
		super(getTraceMessage(e));
		this.exceptionCode = exceptionCode;
		this.exceptionMsg = e.getMessage();
	}
	
	public PayException(String exceptionCode, Throwable cause) {
		super(cause);
		this.exceptionCode = exceptionCode;
		this.exceptionMsg = cause.getMessage();
	}


	public String getExceptionCode() {
		return this.exceptionCode;
	}
	public void setExceptionCode(String exceptionCode) {
		this.exceptionCode = exceptionCode;
	}

	public String getExceptionMsg() {
		return exceptionMsg;
	}

	public void setExceptionMsg(String exceptionMsg) {
		this.exceptionMsg = exceptionMsg;
	}

	public ExceptionLevel getLevel(){
		switch (Integer.valueOf(exceptionCode) / 10000000) {
		case 1:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_INFO;
			break;
		case 2:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_INFO;
			break;
		case 3:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_INFO;
			break;
		case 4:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_WARN;
			break;
		case 5:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_WARN;
			break;
		case 6:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_WARN;
			break;
		case 7:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_ERROR;
			break;
		case 8:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_ERROR;
			break;
		case 9:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_ERROR;
			break;
		default:
			this.level = ExceptionLevel.EXCEPTION_LEVEL_UNDEFINED;
			break;
		}
		return this.level;
	}
	
	public void setExceptionLevel(ExceptionLevel level){
		this.level = level;
	}
	
	
	public String getExceptionCodeAndMessage() {
		return " 错误号:【"+this.getExceptionCode() + "】<br/>" + this.getExceptionMsg();
	}
	
	
	static String getTraceMessage(Exception e){
		StringWriter stringWriter = new StringWriter();
		e.printStackTrace(new PrintWriter(stringWriter));
		
		return stringWriter.toString();
	}
	
}
