ALTER TABLE [dbo].[pha_druginfo] ALTER COLUMN [BASE_DOSE] decimal(10,4) 
GO
/*
 * 固定资产信息表增加TAX_BUY_PRICE、TAX_SALE_PRICE字段
 */
ALTER TABLE [dbo].[INSTRM_INFO]
ADD [TAX_BUY_PRICE] decimal(14,4) NULL ,
[TAX_SALE_PRICE] decimal(14,4) NULL 
/*
 * 物质信息表增加TAX_BUY_PRICE、TAX_SALE_PRICE字段
 */
ALTER TABLE [dbo].[MATERIAL_INFO]
ADD [TAX_BUY_PRICE] decimal(14,4) NULL ,
[TAX_SALE_PRICE] decimal(14,4) NULL ;
/*
 * 药房药库 - 药品信息表增加TAX_BUY_PRICE、TAX_SALE_PRICE字段
 */
ALTER TABLE [dbo].[pha_druginfo]
ADD [TAX_BUY_PRICE] decimal(14,4) NULL ,
[TAX_SALE_PRICE] decimal(14,4) NULL ;

INSERT INTO [b_freq] VALUES ('28                              ', 'H31AAAA001', 'qw', '1次/周', 'QW', NULL, NULL, NULL, 1, 'D', 1, '0:01', '1', '2017-4-22 10:08:45', 'SYSTEM', NULL, NULL, NULL, NULL);
-- 收费项目视图修改
SELECT
	b.ID as ID,
	a.ID AS item_id,
	a.DRUG_CODE AS item_Code,
	a.TRADE_NAME AS item_Name,
	a.DRUG_SPECS AS item_Specs,
	a.PRODUCER AS manufacturer,
	b.STORE_SUM AS stock,
	b.SALE_PRICE AS sale_Price,
	a.PACK_UNIT AS item_Unit,
	a.PACK_QTY AS PACK_QTY,
	a.MINI_UNIT AS MINI_UNIT,
	a.COMMON_SPELL AS common_Spell,
	a.COMMON_WB AS common_Wb,
	a.TRADE_SPELL AS trade_Spell,
	a.TRADE_WB AS trade_Wb,
	a.USER_CODE AS user_Code,
	'1' AS item_Flag,
	a.DRUG_TYPE AS FEE_CODE,
	b.DEPT_ID AS exe_Dept,
	c.COMPANY_NAME AS COMPANY_NAME,
	a.DOSAGE AS DOSAGE,
	a.DOSE_UNIT AS DOSE_UNIT,
	a.USAGE_ AS USAGE_,
	a.HOS_ID as Drug_Hos_id,
	b.HOS_ID 
FROM
	(
		(
			pha_druginfo a
			LEFT JOIN pha_storesuminfo b ON ((a.DRUG_CODE = b.DRUG_CODE))
		)
		LEFT JOIN B_COMPANY c ON ((c.ID = a.PRODUCER))
	)
WHERE
	(
		(b.STOP_FLAG = '1')
		AND (a.DRUG_TYPE = '001')
		AND (c.STOP_FLAG = '1')
		AND (a.STOP_FLAG = '1')
	)
UNION ALL
	SELECT
		b.ID as ID,
		a.ID AS item_id,
		a.DRUG_CODE AS item_Code,
		a.TRADE_NAME AS item_Name,
		a.DRUG_SPECS AS item_Specs,
		a.PRODUCER AS manufacturer,
		b.STORE_SUM AS stock,
		b.SALE_PRICE AS sale_Price,
		a.PACK_UNIT AS item_Unit,
		a.PACK_QTY AS PACK_QTY,
		a.MINI_UNIT AS MINI_UNIT,
		a.COMMON_SPELL AS common_Spell,
		a.COMMON_WB AS common_Wb,
		a.TRADE_SPELL AS trade_Spell,
		a.TRADE_WB AS trade_Wb,
		a.USER_CODE AS user_Code,
		'1' AS item_Flag,
		a.DRUG_TYPE AS FEE_CODE,
		b.DEPT_ID AS exe_Dept,
		c.COMPANY_NAME AS COMPANY_NAME,
		a.DOSAGE AS DOSAGE,
		a.DOSE_UNIT AS DOSE_UNIT,
		a.USAGE_ AS USAGE_,
		a.HOS_ID as Drug_Hos_id,
		b.HOS_ID
	FROM
		(
			(
				pha_druginfo a
				LEFT JOIN pha_storesuminfo b ON ((a.DRUG_CODE = b.DRUG_CODE))
			)
			LEFT JOIN B_COMPANY c ON ((c.ID = a.PRODUCER))
		)
	WHERE
		(
			(b.STOP_FLAG = '1')
			AND (a.DRUG_TYPE = '002')
			AND (c.STOP_FLAG = '1')
			AND (a.STOP_FLAG = '1')
		)
	UNION ALL
		SELECT
			b.ID as ID,
			a.ID AS item_id,
			a.DRUG_CODE AS item_Code,
			a.TRADE_NAME AS item_Name,
			a.DRUG_SPECS AS item_Specs,
			a.PRODUCER AS manufacturer,
			b.STORE_SUM AS stock,
			b.SALE_PRICE AS sale_Price,
			a.PACK_UNIT AS item_Unit,
			a.PACK_QTY AS PACK_QTY,
			a.MINI_UNIT AS MINI_UNIT,
			a.COMMON_SPELL AS common_Spell,
			a.COMMON_WB AS common_Wb,
			a.TRADE_SPELL AS trade_Spell,
			a.TRADE_WB AS trade_Wb,
			a.USER_CODE AS user_Code,
			'1' AS item_Flag,
			a.DRUG_TYPE AS FEE_CODE,
			b.DEPT_ID AS exe_Dept,
			c.COMPANY_NAME AS COMPANY_NAME,
			a.DOSAGE AS DOSAGE,
			a.DOSE_UNIT AS DOSE_UNIT,
			a.USAGE_ AS USAGE_,
			a.HOS_ID as Drug_Hos_id,
			b.HOS_ID
		FROM
			(
				(
					pha_druginfo a
					LEFT JOIN pha_storesuminfo b ON ((a.DRUG_CODE = b.DRUG_CODE))
				)
				LEFT JOIN B_COMPANY c ON ((c.ID = a.PRODUCER))
			)
		WHERE
			(
				(b.STOP_FLAG = '1')
				AND (a.DRUG_TYPE = '003')
				AND (c.STOP_FLAG = '1')
				AND (a.STOP_FLAG = '1')
			)
		UNION ALL
			SELECT
				a.ID as ID,
				a.ID AS item_id,
				a.ITEM_CODE AS item_Code,
				a.ITEM_NAME AS item_Name,
				a.SPECS AS item_Specs,
				'-' AS manufacturer,
				99 AS stock,
				a.UNIT_PRICE AS sale_Price,
				a.UNIT AS item_Unit,
				1 AS PACK_QTY,
				'' AS MINI_UNIT,
				a.SPELL_CODE AS common_Spell,
				a.WB_CODE AS common_Wb,
				'' AS trade_Spell,
				'' AS trade_Wb,
				a.USER_CODE AS user_Code,
				'0' AS item_Flag,
				a.FEE_CODE AS FEE_CODE,
				a.DEFAULT_DEPT AS exe_Dept,
				'' AS COMPANY_NAME,
				'-' AS DOSAGE,
				'-' AS DOSE_UNIT,
				'-' AS USAGE_,
				a.HOS_ID as Drug_Hos_id,
				a.HOS_ID
			FROM
				item_info a
			WHERE
				(a.STOP_FLAG = '1');


ALTER TABLE [dbo].[hcp_role]
ADD [IS_GROUP] nchar(1) NULL ;

-- ----------------------------
-- Table structure for medical_info
-- ----------------------------
DROP TABLE [dbo].[medical_info]
GO
CREATE TABLE [dbo].[medical_info] (
[ID] nchar(32) NOT NULL ,
[HOS_ID] nvarchar(10) NOT NULL ,
[ITEM_ID] nvarchar(14) NOT NULL ,
[ITEM_CODE] nvarchar(14) NOT NULL ,
[COMMON_NAME] nvarchar(100) NULL DEFAULT NULL ,
[COMMON_SPELL] nvarchar(100) NULL DEFAULT NULL ,
[COMMON_WB] nvarchar(100) NULL DEFAULT NULL ,
[ITEM_SPECS] nvarchar(100) NULL DEFAULT NULL ,
[ITEM_TYPE] nvarchar(3) NULL DEFAULT NULL ,
[DOSAGE] nvarchar(10) NULL DEFAULT NULL ,
[SELF_PAY_RATIO] nvarchar(10) NULL DEFAULT NULL ,
[PRODUCER] nvarchar(100) NULL DEFAULT NULL ,
[COMM] nvarchar(500) NULL,
[MATERNITY_INSURANCE_ISPAY] nvarchar(2),
[PACK_UNIT] nvarchar(10) NULL DEFAULT NULL ,
[PACK_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[PACK_PAY_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[SPLIT_RATIO] nvarchar(10) NULL DEFAULT NULL ,
[MINI_UNIT] nvarchar(10) NULL DEFAULT NULL ,
[MINI_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[MINI_PAY_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[INVOICE_TYPE] nvarchar(4) NULL DEFAULT NULL ,
[MEDICAL_INSURANCE_ISPAY] nvarchar(2),
[STOP_FLAG] nvarchar(1) NULL ,
[CREATE_TIME] datetime2(7) NULL ,
[CREATE_OPER] nvarchar(50) NULL DEFAULT NULL ,
[UPDATE_TIME] datetime2(7) NULL DEFAULT NULL ,
[UPDATE_OPER] nvarchar(10) NULL DEFAULT NULL ,
[CREATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[UPDATE_OPER_ID] nchar(32) NULL DEFAULT NULL 
)
GO
ALTER TABLE [dbo].[medical_info] ADD PRIMARY KEY ([ID])
GO
ALTER TABLE [dbo].[medical_info] ADD UNIQUE ([HOS_ID] ASC, [ITEM_CODE] ASC)
GO

/**
 * 新建物资-价格信息表      dys  2017.10.24
 */
-- ----------------------------
-- Table structure for MATERIAL_PRICE
-- ----------------------------
DROP TABLE [dbo].[MATERIAL_PRICE]
GO
CREATE TABLE [dbo].[MATERIAL_PRICE] (
[ID] nchar(32) NOT NULL ,
[HOS_ID] nvarchar(10) NOT NULL ,
[MATERIAL_ID] nchar(32) NOT NULL ,
[MATERIAL_CODE] nvarchar(50) NULL ,
[CENTER_CODE] nvarchar(30) NULL DEFAULT NULL ,
[BUY_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[SALE_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[STOP_FLAG] nvarchar(1) NOT NULL ,
[TAX_BUY_PRICE] decimal(14,4) NULL ,
[TAX_SALE_PRICE] decimal(14,4) NULL ,
[CREATE_TIME] datetime2(7) NOT NULL ,
[CREATE_OPER] nvarchar(50) NULL DEFAULT NULL ,
[UPDATE_TIME] datetime2(7) NULL DEFAULT NULL ,
[UPDATE_OPER] nvarchar(10) NULL DEFAULT NULL ,
[CREATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[UPDATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[WHOLE_PRICE] decimal(14,4) NULL DEFAULT NULL 
)


/**
 * 新建 物资-价格视图     dys  2017.10.24
 */
SELECT DISTINCT
   b . ID              AS  ID,
   a . ID              AS  MATERIAL_ID ,
   a . MATERIAL_CODE   AS  MATERIAL_CODE ,
   b . HOS_ID          AS  HOS_ID ,
   a . MATERIAL_TYPE   AS  MATERIAL_TYPE ,
   a . CENTER_CODE     AS  CENTER_CODE ,
   a . ITEM_CODE       AS  ITEM_CODE ,
   a . BARCODE         AS  BARCODE ,
   a . COMMON_NAME     AS  COMMON_NAME ,
   a . COMMON_SPELL    AS  COMMON_SPELL ,
   a . COMMON_WB       AS  COMMON_WB ,
   a . USER_CODE       AS  USER_CODE ,
   a . MATERIAL_SPECS  AS  MATERIAL_SPECS ,
   a . MATERIAL_UNIT   AS  MATERIAL_UNIT ,
   a . PRODUCER        AS  PRODUCER ,
   a . REGISTER_CODE   AS  REGISTER_CODE ,
   a . COUNTRY_CODE    AS  COUNTRY_CODE ,
   b . BUY_PRICE       AS  BUY_PRICE ,
   b . WHOLE_PRICE     AS  WHOLE_PRICE ,
   b . SALE_PRICE      AS  SALE_PRICE ,
   a . PRICE_CODE      AS  PRICE_CODE ,
   a . STOP_FLAG       AS  STOP_FLAG ,
   a . CREATE_TIME     AS  CREATE_TIME ,
   a . CREATE_OPER     AS  CREATE_OPER ,
   a . UPDATE_TIME     AS  UPDATE_TIME ,
   a . UPDATE_OPER     AS  UPDATE_OPER ,
   a . CREATE_OPER_ID  AS  CREATE_OPER_ID ,
   a . UPDATE_OPER_ID  AS  UPDATE_OPER_ID ,
   a . ALIAS           AS  ALIAS ,
   a . ALIAS_SPELL     AS  ALIAS_SPELL ,
   a . ALIAS_WB        AS  ALIAS_WB ,
   a . MATERIAL_QUANTITY AS  MATERIAL_QUANTITY ,
   a . MAX_UNIT        AS  MAX_UNIT ,
   a . ITEM_NAME       AS  ITEM_NAME ,
   a . FEE_FLAG        AS  FEE_FLAG ,
   a . DISPOSABLE      AS  DISPOSABLE ,
   a . IMPLANT         AS  IMPLANT ,
   a . REGISTER_ID     AS  REGISTER_ID,
   a . REGISTER_NAME   AS  REGISTER_NAME ,
   b . TAX_BUY_PRICE   AS  TAX_BUY_PRICE ,
   b . TAX_SALE_PRICE  AS  TAX_SALE_PRICE 
FROM  MATERIAL_INFO   a ,
  MATERIAL_PRICE   b 
WHERE ( a . ID  =  b . MATERIAL_ID );

-- 2017-10-24 gw 药品价格表创建
CREATE TABLE [dbo].[PHA_DRUG_PRICE] (
[ID] nchar(32) NOT NULL ,
[HOS_ID] nvarchar(10) NOT NULL ,
[DRUG_ID] nchar(32) NOT NULL ,
[DRUG_CODE] nvarchar(50) NULL ,
[CENTER_CODE] nvarchar(30) NULL DEFAULT NULL ,
[BUY_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[SALE_PRICE] decimal(14,4) NULL DEFAULT NULL ,
[STOP_FLAG] nvarchar(1) NOT NULL ,
[TAX_BUY_PRICE] decimal(14,4) NULL ,
[TAX_SALE_PRICE] decimal(14,4) NULL ,
[CREATE_TIME] datetime2(7) NOT NULL ,
[CREATE_OPER] nvarchar(50) NULL DEFAULT NULL ,
[UPDATE_TIME] datetime2(7) NULL DEFAULT NULL ,
[UPDATE_OPER] nvarchar(10) NULL DEFAULT NULL ,
[CREATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[UPDATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[WHOLE_PRICE] decimal(14,4) NULL DEFAULT NULL 
)
GO
ALTER TABLE [dbo].[PHA_DRUG_PRICE] ADD PRIMARY KEY ([ID])
GO
-- 2017-10-24 gw 药品基本信息和价格表视图（DRUG_PRICE_VIEW）
SELECT
	D.ID,
	P.ID AS PRICE_ID,
	D.HOS_ID,
	D.DRUG_CODE,
	D.CENTER_CODE,
	D.BARCODE,
	D.APPROVED_ID,
	D.COMMON_NAME,
	D.TRADE_NAME,
	D.COMMON_SPELL,
	D.TRADE_SPELL,
	D.COMMON_WB,
	D.TRADE_WB,
	D.USER_CODE,
	D.BASE_DOSE,
	D.DOSE_UNIT,
	D.PACK_QTY,
	D.MINI_UNIT,
	D.PACK_UNIT,
	D.DRUG_SPECS,
	D.DRUG_TYPE,
	D.DOSAGE,
	D.PRODUCER,
	D.ISSKIN,
	D.ISRECIPE,
	D.PRICE_CASE,
	D.DRUG_QUALITY,
	D.PRICE_CODE,
	D.USAGE_,
	D.FREQ_CODE,
	D.ANT_CODE,
	D.STOP_FLAG,
	P.BUY_PRICE,
	P.SALE_PRICE,
	P.WHOLE_PRICE,
	P.TAX_BUY_PRICE,
	P.TAX_SALE_PRICE,
	P.HOS_ID AS P_HOS_ID,
	D.CREATE_TIME
FROM PHA_DRUGINFO D LEFT JOIN PHA_DRUG_PRICE P ON ( D.ID = P.DRUG_ID);

GO
CREATE TABLE [dbo].[INTERFACE_CONFIG] (
[ID] nchar(32) NOT NULL ,
[HOS_ID] nvarchar(32) NULL DEFAULT NULL ,
[BIZ_NAME] nvarchar(50) NULL DEFAULT NULL ,
[BIZ_MANAGER] nvarchar(50) NULL DEFAULT NULL ,
[EFFECTIVE_FLAG] nchar(1) NOT NULL ,
[CREATE_TIME] datetime2(7) NULL DEFAULT NULL ,
[CREATE_OPER] nvarchar(20) NULL DEFAULT NULL ,
[CREATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[UPDATE_TIME] datetime2(7) NULL DEFAULT NULL ,
[UPDATE_OPER] nvarchar(20) NULL DEFAULT NULL ,
[UPDATE_OPER_ID] nchar(32) NULL DEFAULT NULL ,
[comment] nvarchar(500) NULL ,
[interface_type] nvarchar(10) NULL ,
[hospital_id] nvarchar(32) NULL 
);



-- 2017-10-26 dys 删除集团数据字典中（剂型编码）重复的数据
DELETE
FROM
	b_dicvalue
WHERE
	id IN (
		SELECT
			id
		FROM
			b_dicvalue
		WHERE
			HOS_ID = 'H0027'
		AND COLUMN_key IN (
			SELECT
				COLUMN_key
			FROM
				b_dicvalue
			WHERE
				HOS_ID = 'H0027'
			AND COLUMN_NAME = 'DOSAGE'
			GROUP BY
				COLUMN_key
			HAVING
				COUNT (*) > 1
		)
		AND COLUMN_NAME = 'DOSAGE'
	)
AND column_key <> sort_id

-- 2017-10-26 dys 删除泉州费森安馨血液透析中心数据字典中（剂型编码）重复的数据
DELETE
FROM
	b_dicvalue
WHERE
	id IN (
		SELECT
			id
		FROM
			b_dicvalue
		WHERE
			HOS_ID = 'H31AAAA001'
		AND COLUMN_key IN (
			SELECT
				COLUMN_key
			FROM
				b_dicvalue
			WHERE
				HOS_ID = 'H31AAAA001'
			AND COLUMN_NAME = 'DOSAGE'
			GROUP BY
				COLUMN_key
			HAVING
				COUNT (*) > 1
		)
		AND COLUMN_NAME = 'DOSAGE'
	)
AND column_key <> sort_id;

-- 2017-10-31 医院拼音码、五笔码长度修改   gw
ALTER TABLE [dbo].[b_dicvalue] ALTER COLUMN [UPDATE_OPER] nvarchar(50) COLLATE Chinese_PRC_CI_AS 
GO

ALTER TABLE [dbo].[b_hosinfo] ALTER COLUMN [SPELL_CODE] nvarchar(20) COLLATE Chinese_PRC_CI_AS 
GO

ALTER TABLE [dbo].[b_hosinfo] ALTER COLUMN [WB_CODE] nvarchar(20) COLLATE Chinese_PRC_CI_AS 
GO

-- 2017-10-31 收费项中添加检查检验  gw
INSERT INTO [FMC].[dbo].[b_dicvalue] ([ID], [HOS_ID], [COLUMN_GROUP], [COLUMN_NAME], [COLUMN_DIS], [COLUMN_KEY], [COLUMN_VAL], [SORT_ID], [ISDEFAULT], [SPELL_CODE], [WB_CODE], [USER_CODE], [STOP_FLAG], [CREATE_TIME], [CREATE_OPER], [UPDATE_TIME], [UPDATE_OPER], [CREATE_OPER_ID], [UPDATE_OPER_ID]) VALUES (N'4028a0815f71ec47015f7212c40e2832', N'H31AAAA001', N'收费', N'GROUP_TYPE', N'套餐类别', N'4', N'检查检验', N'3', N'0', N'JCJY', N'SSSC', NULL, N'1', '2017-10-31 18:55:53.3580000', N'费森尤斯集团管理员', '2017-10-31 18:55:53.3580000', N'费森尤斯集团管理员', N'4028c0815dd44b1c015dd46d59d9001c', N'4028c0815dd44b1c015dd46d59d9001c');

-- 2017-10-31 dys 问诊记录增加血压、体温、心率/脉搏、呼吸（设置上、下限范围）等字段
alter table OW_INQUIRY_RECORD add blood_pressurepr nvarchar(20) 
alter table OW_INQUIRY_RECORD add temperature nvarchar(20) 
alter table OW_INQUIRY_RECORD add pulse_rate nvarchar(20) 
alter table OW_INQUIRY_RECORD add breath_max nvarchar(20) 
alter table OW_INQUIRY_RECORD add breath_min nvarchar(20) 

-- 2017-11-01 dys 修改物质价格视图（MATERIAL_PRICE_VIEW）
SELECT DISTINCT
   b . ID              AS  ID,
   a . ID              AS  MATERIAL_ID ,
   a . MATERIAL_CODE   AS  MATERIAL_CODE ,
   b . HOS_ID          AS  HOS_ID ,
   a . HOS_ID          AS  M_HOS_ID ,
   a . MATERIAL_TYPE   AS  MATERIAL_TYPE ,
   a . CENTER_CODE     AS  CENTER_CODE ,
   a . ITEM_CODE       AS  ITEM_CODE ,
   a . BARCODE         AS  BARCODE ,
   a . COMMON_NAME     AS  COMMON_NAME ,
   a . COMMON_SPELL    AS  COMMON_SPELL ,
   a . COMMON_WB       AS  COMMON_WB ,
   a . USER_CODE       AS  USER_CODE ,
   a . MATERIAL_SPECS  AS  MATERIAL_SPECS ,
   a . MATERIAL_UNIT   AS  MATERIAL_UNIT ,
   a . PRODUCER        AS  PRODUCER ,
   a . REGISTER_CODE   AS  REGISTER_CODE ,
   a . COUNTRY_CODE    AS  COUNTRY_CODE ,
   b . BUY_PRICE       AS  BUY_PRICE ,
   b . WHOLE_PRICE     AS  WHOLE_PRICE ,
   b . SALE_PRICE      AS  SALE_PRICE ,
   a . PRICE_CODE      AS  PRICE_CODE ,
   a . STOP_FLAG       AS  STOP_FLAG ,
   a . CREATE_TIME     AS  CREATE_TIME ,
   a . CREATE_OPER     AS  CREATE_OPER ,
   a . UPDATE_TIME     AS  UPDATE_TIME ,
   a . UPDATE_OPER     AS  UPDATE_OPER ,
   a . CREATE_OPER_ID  AS  CREATE_OPER_ID ,
   a . UPDATE_OPER_ID  AS  UPDATE_OPER_ID ,
   a . ALIAS           AS  ALIAS ,
   a . ALIAS_SPELL     AS  ALIAS_SPELL ,
   a . ALIAS_WB        AS  ALIAS_WB ,
   a . MATERIAL_QUANTITY AS  MATERIAL_QUANTITY ,
   a . MAX_UNIT        AS  MAX_UNIT ,
   a . ITEM_NAME       AS  ITEM_NAME ,
   a . FEE_FLAG        AS  FEE_FLAG ,
   a . DISPOSABLE      AS  DISPOSABLE ,
   a . IMPLANT         AS  IMPLANT ,
   a . REGISTER_ID     AS  REGISTER_ID,
   a . REGISTER_NAME   AS  REGISTER_NAME ,
   b . TAX_BUY_PRICE   AS  TAX_BUY_PRICE ,
   b . TAX_SALE_PRICE  AS  TAX_SALE_PRICE 
FROM  MATERIAL_INFO   a ,
  MATERIAL_PRICE   b 
WHERE ( a . ID  =  b . MATERIAL_ID )

-- 2017-11-02 dys 修改物资科室请领视图(MATERIAL_APPLYIN_VIEW)
SELECT DISTINCT
   a . APP_BILL      AS  ID ,
   a . APP_OPER      AS  APP_OPER ,
   a . HOS_ID        AS  HOS_ID ,
   a . APP_TIME      AS  APP_TIME ,
   a . APP_STATE     AS  APP_STATE ,
   a . FROM_DEPT_ID  AS  FROM_DEPT_ID ,
   b . DEPT_NAME     AS  DEPT_NAME ,
	 a.DEPT_ID,
	 c.DEPT_NAME   AS d_Dept_name
FROM  MATERIAL_APPLYIN   a ,
  b_deptinfo   b ,
b_deptinfo c
WHERE ( a . DEPT_ID  =  b . ID AND c.ID = a.FROM_DEPT_ID );

-- 2017-11-2 药品和物资单点向集团化转换   gw
INSERT INTO pha_drug_price (
	id,
	HOS_ID,
	drug_id,
	drug_code,
	CENTER_CODE,
	BUY_PRICE,
	SALE_PRICE,
	STOP_FLAG,
	TAX_BUY_PRICE,
	TAX_SALE_PRICE,
	CREATE_TIME,
	CREATE_OPER,
	UPDATE_TIME,
	UPDATE_OPER,
	CREATE_OPER_ID,
	UPDATE_OPER_ID,
	WHOLE_PRICE
) SELECT
	dbo.getUUID32 (NEWID()),
	'H31AAAA001',
	ID,
	drug_code,
	CENTER_CODE,
	BUY_PRICE,
SALE_PRICE,
	STOP_FLAG,
	TAX_BUY_PRICE,
	TAX_SALE_PRICE,
	CREATE_TIME,
	CREATE_OPER,
	UPDATE_TIME,
	UPDATE_OPER,
	CREATE_OPER_ID,
	UPDATE_OPER_ID,
	WHOLE_PRICE
FROM
	pha_druginfo;
	
	
	
INSERT INTO MATERIAL_PRICE (
	id,
	HOS_ID,
	material_id,
	material_code,
	CENTER_CODE,
	BUY_PRICE,
	SALE_PRICE,
	STOP_FLAG,
	TAX_BUY_PRICE,
	TAX_SALE_PRICE,
	CREATE_TIME,
	CREATE_OPER,
	UPDATE_TIME,
	UPDATE_OPER,
	CREATE_OPER_ID,
	UPDATE_OPER_ID,
	WHOLE_PRICE
) SELECT
	dbo.getUUID32 (NEWID()),
	'H31AAAA001',
	ID,
	material_code,
	CENTER_CODE,
	BUY_PRICE,
SALE_PRICE,
	STOP_FLAG,
	TAX_BUY_PRICE,
	TAX_SALE_PRICE,
	CREATE_TIME,
	CREATE_OPER,
	UPDATE_TIME,
	UPDATE_OPER,
	CREATE_OPER_ID,
	UPDATE_OPER_ID,
	WHOLE_PRICE
FROM
	MATERIAL_INFO;
	
-- 2017-11-3 药品请领视图修改（pha_applyin_view）
SELECT DISTINCT
   a . APP_BILL      AS  ID ,
   a . APP_OPER      AS  APP_OPER ,
   a . HOS_ID        AS  HOS_ID ,
   a . APP_TIME      AS  APP_TIME ,
   a . APP_STATE     AS  APP_STATE ,
   a . FROM_DEPT_ID  AS  FROM_DEPT_ID ,
   b . DEPT_NAME     AS  DEPT_NAME ,
   a.DEPT_ID as DEPT_ID
FROM  pha_applyin   a ,
  b_deptinfo   b 
WHERE  a . DEPT_ID  =  b . ID 
and a . HOS_ID is not null
and a . APP_BILL is not null
and a . APP_OPER is not null
and a . FROM_DEPT_ID is not null;

-- 2017-11-8 创建患者修改人员名称长度修改(后续还要修改其他对应表的updateOpera的长度) gw
ALTER TABLE [dbo].[b_patientinfo] ALTER COLUMN [UPDATE_OPER] nvarchar(50) COLLATE Chinese_PRC_CI_AS 
GO
ALTER TABLE [dbo].[card_master_info] ALTER COLUMN [UPDATE_OPER] nvarchar(50) COLLATE Chinese_PRC_CI_AS ;


-- 2017-11-9 医嘱明细、收费明细、药品申领明细增加dataFrom字段
ALTER TABLE [dbo].[ow_order]
ADD [DATA_FROM] nchar(32) NULL 
GO

ALTER TABLE [dbo].[oc_chargedetail]
ADD [DATA_FROM] nchar(32) NULL 
GO

ALTER TABLE [dbo].[pha_recipe]
ADD [DATA_FROM] nchar(32) NULL 
GO
---- 2017-11-13 门诊病例添加dataFrom字段
ALTER TABLE [dbo].[ow_inquiry_record]
DROP [BLOOD_PRESSUREPR] nvarchar(20) NULL 

ALTER TABLE [dbo].[ow_inquiry_record]
ADD [BLOOD_PRESSUREPR_MAX] nvarchar(20) NULL 

ALTER TABLE [dbo].[ow_inquiry_record]
ADD [BLOOD_PRESSUREPR_MIN] nvarchar(20) NULL 


-- 2017-11-9 新增RECIPE_INFO视图
SELECT DISTINCT
   a . REG_ID          AS  ID ,
   a . RECIPE_ID       AS  RECIPE_ID ,
   a . HOS_ID          AS  HOS_ID ,
   c . REG_TIME        AS  REG_TIME,
   c . REG_DEPT        AS  REG_DEPT,
   d . DEPT_NAME       AS  DEPT_NAME,
   b . ID              AS  PATIENT_ID ,
   a . DATA_FROM       AS  DATA_FROM,
   b . NAME            AS  NAME,
   b . MEDICAL_CARD_NO AS  MEDICAL_CARD_NO,
   b . MI_CARD_NO      AS  MI_CARD_NO,
   b . ID_NO           AS  ID_NO,
   a . APPLY_STATE     AS  APPLY_STATE,
   a . CREATE_TIME     AS  CREATE_TIME ,
   a . CREATE_OPER     AS  CREATE_OPER ,
   a . UPDATE_TIME     AS  UPDATE_TIME ,
   a . UPDATE_OPER     AS  UPDATE_OPER ,
   a . CREATE_OPER_ID  AS  CREATE_OPER_ID ,
   a . UPDATE_OPER_ID  AS  UPDATE_OPER_ID 
FROM  reg_info  c ,
      pha_recipe   a ,
      b_patientinfo   b,
      b_deptinfo  d
WHERE ( a . REG_ID =  c . ID AND c . PATIENT_ID =  b . ID AND c.REG_DEPT = d.ID )

-- 2017-11-16 呼吸字段改为breath
ALTER TABLE [dbo].[ow_inquiry_record] DROP COLUMN [breath_min]
GO

EXEC sp_rename N'[dbo].[ow_inquiry_record].[breath_max]', N'breath', 'COLUMN'
GO


--  201711-17  护士站执行确认视图修改 （PATIENTSTORE_RECORD）gw
SELECT 
  oc.ID AS ID,
  oc.HOS_ID AS HOS_ID,
  reg.REG_ID AS REG_NO,
	reg.ID   AS REG_ID,
  reg.SEE_DEPT AS SEE_DEPT_ID,
  reg.SEE_DOC AS SEE_DOC_ID,
  oc.PATIENT_ID AS PATIENT_ID,
  oc.RECIPE_ID AS RECIPE_ID,
  oc.RECIPE_NO AS RECIPE_NO,
  oc.ITEM_CODE AS ITEM_ID,
  oc.UNIT AS UNIT,
	oc.TOT_COST AS TOTAL_MONEY,
  oc.COMB_NO AS COMB_NO,
	oc.INVOICE_NO,
  oc.CHARGE_TIME AS CHARGE_TIME,
  oc.QTY AS QTY,
  ISNULL(store.use_qty, 0) AS use_qty,
  (oc.QTY - ISNULL(store.use_qty, 0)) AS REMAIN_QTY,
	oc.APPLY_STATE as APPLY_STATE
FROM
  oc_chargedetail oc 
  LEFT JOIN reg_info reg 
    ON reg.ID = oc.REG_ID 
  left join 
    (SELECT 
      ps.ITEM_CODE,
      ps.ITEM_NAME,
      ps.RECIPE_ID,
      ps.RECIPE_NO,
      ps.hos_id,
      ISNULL(SUM(ps.QTY), 0) AS USE_QTY 
    FROM
      pha_patstore as ps 
			where ps.STATE!=0
    GROUP by ps.ITEM_CODE,
      ps.ITEM_NAME,
      ps.RECIPE_ID,
      ps.RECIPE_NO,
      ps.HOS_ID) store
  on ((oc.HOS_ID = store.HOS_ID)
           AND (oc.RECIPE_ID = store.RECIPE_ID)
           AND (oc.RECIPE_NO = store.RECIPE_NO)
           AND (oc.ITEM_CODE = store.ITEM_CODE))    
WHERE (
    (oc.FEE_CODE <> '001') 
    AND (oc.FEE_CODE <> '002') 
    AND (oc.FEE_CODE <> '003')
  );
  
  -- 2017-11-28 新增字段item_code,fee_flag
 ALTER TABLE [dbo].[MATERIAL_PRICE] ADD [ITEM_CODE] nvarchar(32) NULL 
GO
ALTER TABLE [dbo].[MATERIAL_PRICE] ADD [FEE_FLAG] nvarchar(14) NULL 
GO
  -- 2017-11-28 修改视图的item_code,fee_flag字段为mat_price表的
ALTER VIEW [dbo].[MATERIAL_PRICE_VIEW] AS 
SELECT DISTINCT
   b . ID              AS  ID,
   a . ID              AS  MATERIAL_ID ,
   a . MATERIAL_CODE   AS  MATERIAL_CODE ,
   b . HOS_ID          AS  HOS_ID ,
   a . HOS_ID          AS  M_HOS_ID ,
   a . MATERIAL_TYPE   AS  MATERIAL_TYPE ,
   a . CENTER_CODE     AS  CENTER_CODE ,
   b . ITEM_CODE       AS  ITEM_CODE ,
   a . BARCODE         AS  BARCODE ,
   a . COMMON_NAME     AS  COMMON_NAME ,
   a . COMMON_SPELL    AS  COMMON_SPELL ,
   a . COMMON_WB       AS  COMMON_WB ,
   a . USER_CODE       AS  USER_CODE ,
   a . MATERIAL_SPECS  AS  MATERIAL_SPECS ,
   a . MATERIAL_UNIT   AS  MATERIAL_UNIT ,
   a . PRODUCER        AS  PRODUCER ,
   a . REGISTER_CODE   AS  REGISTER_CODE ,
   a . COUNTRY_CODE    AS  COUNTRY_CODE ,
   b . BUY_PRICE       AS  BUY_PRICE ,
   b . WHOLE_PRICE     AS  WHOLE_PRICE ,
   b . SALE_PRICE      AS  SALE_PRICE ,
   a . PRICE_CODE      AS  PRICE_CODE ,
   a . STOP_FLAG       AS  STOP_FLAG ,
   a . CREATE_TIME     AS  CREATE_TIME ,
   a . CREATE_OPER     AS  CREATE_OPER ,
   a . UPDATE_TIME     AS  UPDATE_TIME ,
   a . UPDATE_OPER     AS  UPDATE_OPER ,
   a . CREATE_OPER_ID  AS  CREATE_OPER_ID ,
   a . UPDATE_OPER_ID  AS  UPDATE_OPER_ID ,
   a . ALIAS           AS  ALIAS ,
   a . ALIAS_SPELL     AS  ALIAS_SPELL ,
   a . ALIAS_WB        AS  ALIAS_WB ,
   a . MATERIAL_QUANTITY AS  MATERIAL_QUANTITY ,
   a . MAX_UNIT        AS  MAX_UNIT ,
   a . ITEM_NAME       AS  ITEM_NAME ,
   b . FEE_FLAG        AS  FEE_FLAG ,
   a . DISPOSABLE      AS  DISPOSABLE ,
   a . IMPLANT         AS  IMPLANT ,
   a . REGISTER_ID     AS  REGISTER_ID,
   a . REGISTER_NAME   AS  REGISTER_NAME ,
   b . TAX_BUY_PRICE   AS  TAX_BUY_PRICE ,
   b . TAX_SALE_PRICE  AS  TAX_SALE_PRICE 
FROM  MATERIAL_INFO   a ,
  MATERIAL_PRICE   b 
WHERE ( a . ID  =  b . MATERIAL_ID )
GO


  
