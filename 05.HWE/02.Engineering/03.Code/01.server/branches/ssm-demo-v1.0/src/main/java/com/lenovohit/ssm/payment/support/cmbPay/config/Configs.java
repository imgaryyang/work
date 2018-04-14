package com.lenovohit.ssm.payment.support.cmbPay.config;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Created by zyus1987 
 */
public class Configs {
    private static Log log = LogFactory.getLog(Configs.class);
    private static Configuration configs;

    private static String loginName = "昆华医院贾毅";
    private static String payAccount;
    private static String payAcctCity;
    private static String frontIp;
    private static int frontPort;
    private static int connectTimeout;


    private Configs() {
        // No Constructor
    }

    // 根据文件名读取配置文件，文件后缀名必须为.properties
    public synchronized static void init(String filePath) {
        if (configs != null) {
            return;
        }

        try {
            configs = new PropertiesConfiguration(filePath);
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }

        if (configs == null) {
            throw new IllegalStateException("can`t find file by path:" + filePath);
        }
        loginName = configs.getString("login_name");
        payAccount = configs.getString("pay_account");
        payAcctCity = configs.getString("pay_acct_city");
        frontIp = configs.getString("front_ip");
        frontPort = configs.getInt("front_port");
        connectTimeout = configs.getInt("connect_timeout");

        log.info("配置文件名: " + filePath);
    }

    public static Configuration getConfigs() {
        return configs;
    }

	public static String getLoginName() {
		return loginName;
	}

	public static void setLoginName(String loginName) {
		Configs.loginName = loginName;
	}

	public static String getPayAccount() {
		return payAccount;
	}

	public static void setPayAccount(String payAccount) {
		Configs.payAccount = payAccount;
	}

	public static String getPayAcctCity() {
		return payAcctCity;
	}

	public static void setPayAcctCity(String payAcctCity) {
		Configs.payAcctCity = payAcctCity;
	}

	public static String getFrontIp() {
		return frontIp;
	}

	public static void setFrontIp(String frontIp) {
		Configs.frontIp = frontIp;
	}

	public static int getFrontPort() {
		return frontPort;
	}

	public static void setFrontPort(int frontPort) {
		Configs.frontPort = frontPort;
	}

	public static int getConnectTimeout() {
		return connectTimeout;
	}

	public static void setConnectTimeout(int connectTimeout) {
		Configs.connectTimeout = connectTimeout;
	}

}

