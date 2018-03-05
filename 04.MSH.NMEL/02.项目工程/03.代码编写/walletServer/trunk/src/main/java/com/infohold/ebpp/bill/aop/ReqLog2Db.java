package com.infohold.ebpp.bill.aop;

import java.math.BigInteger;
import java.util.Date;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.ebpp.bill.model.IfcLog;

/**
 * 记录接口日志
 * @author Administrator
 *
 */
@Aspect
@Component
public class ReqLog2Db {
	
	@Autowired
	private GenericManager<IfcLog, String> ifcLogManager;
	
	@Around("execution(public * com.infohold.ebpp.bill.web.rest.*.*(..))")
	public Object process(ProceedingJoinPoint pjp) throws Throwable {
		Date begin = new Date();
		String beginTime = DateUtils.date2String(begin, "yyyy-MM-dd HH:mm:ss");
		String reqClass = pjp.getTarget().getClass().getSimpleName();
		String reqMethod = pjp.getSignature().getName();
		String errInfo = "";
		String flag = "1";
		
		Object[] objs = pjp.getArgs();
		
		StringBuilder sb = new StringBuilder();
		for(int i=0; i<objs.length; i++) {
			if(i==0) {
				sb.append("{");
			}
			sb.append("param"+i+":").append(objs[i].toString());
			if(i==(objs.length-1)) {
				sb.append("}");
			} else {
				sb.append(",");
			}
		}
		String reqContent = sb.toString();
		Object ren = null;
		String returnInfo = "";
		try {
			ren = pjp.proceed();
			returnInfo = JSONUtils.serialize(ren);
		} catch (Throwable e) {
			flag = "0";
			errInfo = BaseException.getStackTraceAsString(e);
			returnInfo = e.getMessage();
			throw e;
		} finally {
			Date end = new Date();
			String returnTime = DateUtils.date2String(end, "yyyy-MM-dd HH:mm:ss");
			long l = end.getTime()-begin.getTime();
			//存入数据库
			IfcLog ifcLog = new IfcLog();
			ifcLog.setBeginTime(beginTime);
			ifcLog.setReqClass(reqClass);
			ifcLog.setReqMethod(reqMethod);
			ifcLog.setReqContent(reqContent);
			ifcLog.setFlag(flag);
			ifcLog.setErrInfo(errInfo);
			ifcLog.setReturnInfo(returnInfo);
			ifcLog.setReturnTime(returnTime);
			ifcLog.setCostTime(BigInteger.valueOf(l));
			ifcLogManager.save(ifcLog);
		}
		return ren;
	}
}
