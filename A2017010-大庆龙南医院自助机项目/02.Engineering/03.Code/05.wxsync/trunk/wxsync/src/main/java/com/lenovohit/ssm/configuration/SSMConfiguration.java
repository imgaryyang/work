package com.lenovohit.ssm.configuration;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import com.alibaba.druid.pool.DruidDataSource;

@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties({HISDataSourceProperties.class,EHospitalDataSourceProperties.class})
public class SSMConfiguration {
	
	@Autowired
	private HISDataSourceProperties hisProperties;
	@Autowired
	private EHospitalDataSourceProperties eHospitalProperties;
	

	@Bean(name="hisDataSource")
	public DataSource hisDataSource() {
		
		DruidDataSource druidDataSource = new DruidDataSource();
		druidDataSource.setDriverClassName(this.hisProperties.getDriverClassName());
		druidDataSource.setUrl(this.hisProperties.getUrl());
		druidDataSource.setUsername(this.hisProperties.getUsername());
		druidDataSource.setPassword(this.hisProperties.getPassword());
		druidDataSource.setInitialSize(this.hisProperties.getInitialSize());
		druidDataSource.setMinIdle(this.hisProperties.getMinIdle());
		druidDataSource.setMaxActive(this.hisProperties.getMaxActive());
		druidDataSource.setMaxWait(this.hisProperties.getMaxWait());
		druidDataSource.setMaxWait(this.hisProperties.getMaxWait());
		druidDataSource.setTimeBetweenEvictionRunsMillis(this.hisProperties.getMaxWait());
		druidDataSource.setMinEvictableIdleTimeMillis(this.hisProperties.getMaxWait());
		druidDataSource.setValidationQuery(this.hisProperties.getValidationQuery());
		druidDataSource.setTestWhileIdle(this.hisProperties.isTestWhileIdle());
		druidDataSource.setTestOnBorrow(this.hisProperties.isTestOnBorrow());
		druidDataSource.setTestOnReturn(this.hisProperties.isTestOnReturn());

		druidDataSource.setPoolPreparedStatements(this.hisProperties.isPoolPreparedStatements());
		druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(this.hisProperties.getMaxPoolPreparedStatementPerConnectionSize());
		
		try {
			druidDataSource.setFilters(this.hisProperties.getFilters());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return druidDataSource;
	}
	@Bean(name="eHospitalDataSource")
	public DataSource eHospitalDataSource() {
		DruidDataSource druidDataSource = new DruidDataSource();
		druidDataSource.setDriverClassName(this.eHospitalProperties.getDriverClassName());
		druidDataSource.setUrl(this.eHospitalProperties.getUrl());
		druidDataSource.setUsername(this.eHospitalProperties.getUsername());
		druidDataSource.setPassword(this.eHospitalProperties.getPassword());
		druidDataSource.setInitialSize(this.eHospitalProperties.getInitialSize());
		druidDataSource.setMinIdle(this.eHospitalProperties.getMinIdle());
		druidDataSource.setMaxActive(this.eHospitalProperties.getMaxActive());
		druidDataSource.setMaxWait(this.eHospitalProperties.getMaxWait());
		druidDataSource.setMaxWait(this.eHospitalProperties.getMaxWait());
		druidDataSource.setTimeBetweenEvictionRunsMillis(this.eHospitalProperties.getMaxWait());
		druidDataSource.setMinEvictableIdleTimeMillis(this.eHospitalProperties.getMaxWait());
		druidDataSource.setValidationQuery(this.eHospitalProperties.getValidationQuery());
		druidDataSource.setTestWhileIdle(this.eHospitalProperties.isTestWhileIdle());
		druidDataSource.setTestOnBorrow(this.eHospitalProperties.isTestOnBorrow());
		druidDataSource.setTestOnReturn(this.eHospitalProperties.isTestOnReturn());

		druidDataSource.setPoolPreparedStatements(this.eHospitalProperties.isPoolPreparedStatements());
		druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(this.eHospitalProperties.getMaxPoolPreparedStatementPerConnectionSize());
		
		try {
			druidDataSource.setFilters(this.eHospitalProperties.getFilters());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return druidDataSource;
	}
}
