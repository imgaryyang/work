package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_MENU")
public class Menu extends BaseIdModel {

	private static final long serialVersionUID = 5186135925868196095L;
	private String name;// 名称
	private String alias;// 别名
	private String code;// 编码
	private String pathname;
	private String coordinate;
	private String parent;// 父菜单
	private String colspan;
	private String rowspan;
	private String color;
	private String url;// url
	private String icon;// 图标
	private String type;
	private int sort;//排序
	private String template;
	private String rules;
	
	
	
	public String getTemplate() {
		return template;
	}
	public void setTemplate(String template) {
		this.template = template;
	}
	public String getRules() {
		return rules;
	}
	public void setRules(String rules) {
		this.rules = rules;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPathname() {
		return pathname;
	}
	public void setPathname(String pathname) {
		this.pathname = pathname;
	}
	public String getCoordinate() {
		return coordinate;
	}
	public void setCoordinate(String coordinate) {
		this.coordinate = coordinate;
	}
	public String getColspan() {
		return colspan;
	}
	public void setColspan(String colspan) {
		this.colspan = colspan;
	}
	public String getRowspan() {
		return rowspan;
	}
	public void setRowspan(String rowspan) {
		this.rowspan = rowspan;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public int getSort() {
		return sort;
	}
	public void setSort(int sort) {
		this.sort = sort;
	}
	
	/*private HcpSystem system;
	
	@ManyToOne(cascade=CascadeType.REFRESH,optional=false)
    @JoinColumn(name = "system")
	public HcpSystem getSystem() {
		return system;
	}
	public void setSystem(HcpSystem system) {
		this.system = system;
	}*/
}
