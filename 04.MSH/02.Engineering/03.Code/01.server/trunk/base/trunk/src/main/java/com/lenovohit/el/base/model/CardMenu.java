package com.lenovohit.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_CARD_MENU")
public class CardMenu extends BaseIdModel {
	private static final long serialVersionUID = -1996966236963036122L;
	
	private String typeId;
	private String code; //菜单编码
	private String text; //菜单显示文字
	private String textSize; //文字显示大小
	private String textColor; //文字显示颜色
	private String icon; //图标
	private String iconSize; //图标显示大小
	private String iconColor; //图标显示颜色
	private String image; //图片
	private String imageResolution; //图片分辨率
	private String conponent; //跳转到的组件
	private String onClick; //点击触发事件

	private CardType type;

	@Column(name = "TYPE_ID")
	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}

	@Column(name = "CODE", length = 20)
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "TEXT", length = 20)
	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Column(name = "TEXT_SIZE", length = 3)
	public String getTextSize() {
		return this.textSize;
	}

	public void setTextSize(String textSize) {
		this.textSize = textSize;
	}

	@Column(name = "TEXT_COLOR", length = 40)
	public String getTextColor() {
		return this.textColor;
	}

	public void setTextColor(String textColor) {
		this.textColor = textColor;
	}

	@Column(name = "ICON", length = 50)
	public String getIcon() {
		return this.icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column(name = "ICON_SIZE", length = 3)
	public String getIconSize() {
		return this.iconSize;
	}

	public void setIconSize(String iconSize) {
		this.iconSize = iconSize;
	}

	@Column(name = "ICON_COLOR", length = 40)
	public String getIconColor() {
		return this.iconColor;
	}

	public void setIconColor(String iconColor) {
		this.iconColor = iconColor;
	}

	@Column(name = "IMAGE", length = 200)
	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Column(name = "IMAGE_RESOLUTION", length = 50)
	public String getImageResolution() {
		return this.imageResolution;
	}

	public void setImageResolution(String imageResolution) {
		this.imageResolution = imageResolution;
	}

	@Column(name = "CONPONENT", length = 30)
	public String getConponent() {
		return this.conponent;
	}

	public void setConponent(String conponent) {
		this.conponent = conponent;
	}

	@Column(name = "ON_CLICK", length = 30)
	public String getOnClick() {
		return this.onClick;
	}

	public void setOnClick(String onClick) {
		this.onClick = onClick;
	}
	
	@Transient
	public CardType getType() {
		return this.type;
	}

	public void setType(CardType type) {
		this.type = type;
	}
}