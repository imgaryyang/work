/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/12/15 11:13:30                          */
/*==============================================================*/


DROP TABLE IF EXISTS BASE_ADDRESS;

DROP TABLE IF EXISTS BASE_ATTACHMENT;

DROP TABLE IF EXISTS BASE_COMMENT;

DROP TABLE IF EXISTS BASE_CONTACT_WAYS;

DROP TABLE IF EXISTS BASE_DESCRIPTION;

DROP TABLE IF EXISTS BASE_DIC;

DROP TABLE IF EXISTS BASE_DIC_ITEM;

DROP TABLE IF EXISTS BASE_IMAGES;

DROP TABLE IF EXISTS BASE_NEWS;

DROP TABLE IF EXISTS BASE_NOTICE;

DROP TABLE IF EXISTS BASE_REGION;

DROP TABLE IF EXISTS BASE_TRANSPORTATION;

/*==============================================================*/
/* Table: BASE_ADDRESS                                          */
/*==============================================================*/
CREATE TABLE BASE_ADDRESS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   ZIP_CODE             CHAR(6),
   AREA_CODE            CHAR(6),
   AREA_NAME            VARCHAR(50),
   ADDRESS              VARCHAR(255) NOT NULL,
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_ATTACHMENT                                       */
/*==============================================================*/
CREATE TABLE BASE_ATTACHMENT
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(2),
   MEMO                 VARCHAR(50),
   PATH                 VARCHAR(200),
   FILE_NAME            VARCHAR(50),
   EXT_NAME             VARCHAR(10),
   SORT                 INT COMMENT '同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。',
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_COMMENT                                          */
/*==============================================================*/
CREATE TABLE BASE_COMMENT
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(20),
   USER_ID              CHAR(32),
   USER_NAME            VARCHAR(50),
   USER_NICKNAME        VARCHAR(50),
   COMMENT              VARCHAR(500),
   POST_AT              DATETIME,
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_CONTACT_WAYS                                     */
/*==============================================================*/
CREATE TABLE BASE_CONTACT_WAYS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   TYPE                 CHAR(1) NOT NULL COMMENT '1 - 手机号
            2 - 电话
            3 - 传真
            4 - 400电话
            5 - 微信
            6 - 微博
            7 - QQ
            8 - EMAIL',
   CONTENT              VARCHAR(50) NOT NULL,
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 已作废',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_DESCRIPTION                                      */
/*==============================================================*/
CREATE TABLE BASE_DESCRIPTION
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(20),
   CAPTION              VARCHAR(100),
   BODY                 VARCHAR(500),
   SORT                 INT,
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_DIC                                              */
/*==============================================================*/
CREATE TABLE BASE_DIC
(
   ID                   CHAR(32) NOT NULL,
   CODE                 CHAR(50),
   NAME                 VARCHAR(100),
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_DIC_ITEM                                         */
/*==============================================================*/
CREATE TABLE BASE_DIC_ITEM
(
   ID                   CHAR(32) NOT NULL,
   PARENT_ID            CHAR(32),
   DIC_ID               CHAR(32),
   CODE                 CHAR(32),
   TEXT                 VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_IMAGES                                           */
/*==============================================================*/
CREATE TABLE BASE_IMAGES
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(2),
   MEMO                 VARCHAR(50),
   PATH                 VARCHAR(200),
   FILE_NAME            VARCHAR(50),
   EXT_NAME             VARCHAR(10),
   RESOLUTION           VARCHAR(50),
   SIZE                 NUMERIC(17,2),
   SORT                 INT COMMENT '同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。',
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_NEWS                                             */
/*==============================================================*/
CREATE TABLE BASE_NEWS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) COMMENT '机构id(医院ID)',
   FK_TYPE              CHAR(2) NOT NULL COMMENT 'H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告',
   CAPTION              VARCHAR(100) NOT NULL,
   DIGEST               VARCHAR(300),
   BODY                 VARCHAR(2046) NOT NULL,
   IMAGE                VARCHAR(100) NOT NULL,
   FEEDED_BY            VARCHAR(50),
   STATUS               CHAR(1) NOT NULL COMMENT 'A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_NOTICE                                           */
/*==============================================================*/
CREATE TABLE BASE_NOTICE
(
   ID                   CHAR(32) NOT NULL,
   TITLE                VARCHAR(255),
   CONTENT              VARCHAR(2000),
   TARGET               VARCHAR(255),
   TYPE                 CHAR(2) COMMENT '系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码',
   MODE                 CHAR(1) COMMENT '0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER',
   APP_CHANNEL          CHAR(3),
   APP_ID               CHAR(32),
   RECEIVER_TYPE        CHAR(1) COMMENT '0 - 所有
            1 - 用户
            2 - 组别
            
            ',
   RECEIVER_VALUE       VARCHAR(2000),
   ORG_ID               CHAR(32),
   ORG_NAME             VARCHAR(70),
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_REGION                                           */
/*==============================================================*/
CREATE TABLE BASE_REGION
(
   ID                   CHAR(32) NOT NULL,
   父ID                  CHAR(32) DEFAULT '0',
   NAME                 VARCHAR(50),
   SHORT_NAME           VARCHAR(50),
   LONGITUDE            NUMERIC(10,2) DEFAULT 0,
   LATITUDE             NUMERIC(10,2) DEFAULT 0,
   LEVEL                INT COMMENT '等级(1省/直辖市,2地级市,3区县,4镇/街道)',
   SORT                 INT DEFAULT 1,
   STATUS               CHAR(1) DEFAULT '0' COMMENT '状态(0启用/1禁用)',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: BASE_TRANSPORTATION                                   */
/*==============================================================*/
CREATE TABLE BASE_TRANSPORTATION
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   TYPE                 CHAR(1) NOT NULL COMMENT '1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他',
   CONTENT              VARCHAR(50) NOT NULL,
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

ALTER TABLE BASE_DIC_ITEM ADD CONSTRAINT FK_DICITEM_DIC FOREIGN KEY (DIC_ID)
      REFERENCES BASE_DIC (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

