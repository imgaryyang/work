'use strict';

var depts = [
  {
    "deptId": "001", 
    "deptName": "专病", 
    "children": [
      {
        "deptId": "001001", 
        "deptName": "康复治疗", 
        "children": [
          {
            "deptId": "001001002", 
            "deptName": "物理康复"
          }, 
          {
            "deptId": "001001003", 
            "deptName": "中风康复"
          }, 
          {
            "deptId": "001001004", 
            "deptName": "小儿麻痹康复"
          }
        ]
      }, 
      {
        "deptId": "001002", 
        "deptName": "心里咨询"
      }, 
      {
        "deptId": "001003", 
        "deptName": "更年期保健门诊"
      }, 
      {
        "deptId": "001004", 
        "deptName": "周围神经病门诊"
      }, 
      {
        "deptId": "001005", 
        "deptName": "手外科", 
        "children": [
          {
            "deptId": "001005002", 
            "deptName": "手创伤外科"
          }, 
          {
            "deptId": "001005003", 
            "deptName": "手畸形专科"
          }
        ]
      }, 
      {
        "deptId": "001006", 
        "deptName": "脊柱外科"
      }, 
      {
        "deptId": "001007", 
        "deptName": "肠道肿瘤门诊"
      }, 
      {
        "deptId": "001008", 
        "deptName": "学生和儿童青少年心理门诊"
      }, 
      {
        "deptId": "001009", 
        "deptName": "创口治疗门诊"
      }, 
      {
        "deptId": "001010", 
        "deptName": "乳腺、肿瘤门诊"
      }, 
      {
        "deptId": "001011", 
        "deptName": "骨质酥松"
      }, 
      {
        "deptId": "001012", 
        "deptName": "脑卒中门诊"
      }, 
      {
        "deptId": "001013", 
        "deptName": "白癜风门诊"
      }, 
      {
        "deptId": "001014", 
        "deptName": "心胸外科随访门诊"
      }, 
      {
        "deptId": "001015", 
        "deptName": "记忆门诊"
      }, 
      {
        "deptId": "001016", 
        "deptName": "房颤"
      }, 
      {
        "deptId": "001017", 
        "deptName": "糖尿病门诊"
      }, 
      {
        "deptId": "001018", 
        "deptName": "激光门诊"
      }, 
      {
        "deptId": "001019", 
        "deptName": "起搏器随访门诊"
      }, 
      {
        "deptId": "001020", 
        "deptName": "鼾症咨询门诊"
      }, 
      {
        "deptId": "001021", 
        "deptName": "胆囊、胆结石门诊"
      }, 
      {
        "deptId": "001022", 
        "deptName": "瘢痕整形门诊"
      }, 
      {
        "deptId": "001023", 
        "deptName": "小儿视光门诊"
      }, 
      {
        "deptId": "001024", 
        "deptName": "慢性肾病团队诊疗"
      }, 
      {
        "deptId": "001025", 
        "deptName": "男性病门诊"
      }, 
      {
        "deptId": "001026", 
        "deptName": "再生育门诊"
      }, 
      {
        "deptId": "001027", 
        "deptName": "高血压"
      }, 
      {
        "deptId": "001028", 
        "deptName": "洗牙"
      }, 
      {
        "deptId": "001029", 
        "deptName": "PICC"
      }, 
      {
        "deptId": "001030", 
        "deptName": "经颅磁治疗"
      }, 
      {
        "deptId": "001031", 
        "deptName": "疝（小肠）气门诊"
      }, 
      {
        "deptId": "001032", 
        "deptName": "药物咨询"
      }, 
      {
        "deptId": "001033", 
        "deptName": "肝癌微创介入门诊"
      }, 
      {
        "deptId": "001034", 
        "deptName": "脑胶质瘤专病门诊"
      }, 
      {
        "deptId": "001035", 
        "deptName": "妇科治疗门诊"
      }, 
      {
        "deptId": "001036", 
        "deptName": "伤口/造口护理门诊"
      }, 
      {
        "deptId": "001037", 
        "deptName": "产前筛查咨询门诊"
      }, 
      {
        "deptId": "001038", 
        "deptName": "宫颈门诊"
      }
    ]
  }, 
  {
    "deptId": "002", 
    "deptName": "外科", 
    "children": [
      {
        "deptId": "002001", 
        "deptName": "肠胃外科"
      }, 
      {
        "deptId": "002002", 
        "deptName": "胆结石诊疗中心"
      }, 
      {
        "deptId": "002003", 
        "deptName": "肛肠外科"
      }, 
      {
        "deptId": "002004", 
        "deptName": "血管外科"
      }, 
      {
        "deptId": "002005", 
        "deptName": "泌尿外科", 
        "children": [
          {
            "deptId": "002005002", 
            "deptName": "前列腺专科"
          }, 
          {
            "deptId": "002005003", 
            "deptName": "尿路感染专科"
          }, 
          {
            "deptId": "002005004", 
            "deptName": "前列腺肥大专科"
          }
        ]
      }, 
      {
        "deptId": "002006", 
        "deptName": "烧伤/伤口中心"
      }, 
      {
        "deptId": "002007", 
        "deptName": "创伤外科"
      }, 
      {
        "deptId": "002008", 
        "deptName": "肝胆外科"
      }, 
      {
        "deptId": "002009", 
        "deptName": "移植科"
      }, 
      {
        "deptId": "002010", 
        "deptName": "胸外科"
      }, 
      {
        "deptId": "002011", 
        "deptName": "神经外科"
      }, 
      {
        "deptId": "002012", 
        "deptName": "骨科"
      }
    ]
  }, 
  {
    "deptId": "003", 
    "deptName": "内科", 
    "children": [
      {
        "deptId": "003001", 
        "deptName": "消化内科"
      }, 
      {
        "deptId": "003002", 
        "deptName": "呼吸内科"
      }, 
      {
        "deptId": "003003", 
        "deptName": "感染科"
      }, 
      {
        "deptId": "003004", 
        "deptName": "神经内科"
      }, 
      {
        "deptId": "003005", 
        "deptName": "全科医学（门诊体检）"
      }, 
      {
        "deptId": "003006", 
        "deptName": "甲状腺诊疗中心"
      }, 
      {
        "deptId": "003007", 
        "deptName": "老年病（门诊体检）"
      }, 
      {
        "deptId": "003008", 
        "deptName": "心血管内科"
      }, 
      {
        "deptId": "003009", 
        "deptName": "神经卫生科"
      }, 
      {
        "deptId": "003010", 
        "deptName": "康复科"
      }, 
      {
        "deptId": "003011", 
        "deptName": "肾内科"
      }, 
      {
        "deptId": "003012", 
        "deptName": "血液内科"
      }, 
      {
        "deptId": "003013", 
        "deptName": "风湿免疫科"
      }, 
      {
        "deptId": "003014", 
        "deptName": "内分泌科"
      }, 
      {
        "deptId": "003015", 
        "deptName": "核医学"
      }
    ]
  }, 
  {
    "deptId": "004", 
    "deptName": "生殖中心", 
    "children": [
      {
        "deptId": "004001", 
        "deptName": "生殖中心"
      }
    ]
  }, 
  {
    "deptId": "005", 
    "deptName": "五官", 
    "children": [
      {
        "deptId": "005001", 
        "deptName": "眼科"
      }, 
      {
        "deptId": "005002", 
        "deptName": "口腔科"
      }, 
      {
        "deptId": "005003", 
        "deptName": "耳鼻喉科"
      }
    ]
  }, 
  {
    "deptId": "006", 
    "deptName": "皮肤", 
    "children": [
      {
        "deptId": "006001", 
        "deptName": "皮肤科"
      }
    ]
  }, 
  {
    "deptId": "007", 
    "deptName": "中医", 
    "children": [
      {
        "deptId": "007001", 
        "deptName": "中医科"
      }, 
      {
        "deptId": "007002", 
        "deptName": "骨伤科"
      }, 
      {
        "deptId": "007003", 
        "deptName": "针推理疗科"
      }
    ]
  }, 
  {
    "deptId": "008", 
    "deptName": "妇产", 
    "children": [
      {
        "deptId": "008001", 
        "deptName": "产科"
      }, 
      {
        "deptId": "008002", 
        "deptName": "妇科"
      }
    ]
  }, 
  {
    "deptId": "009", 
    "deptName": "儿科", 
    "children": [
      {
        "deptId": "009001", 
        "deptName": "儿科"
      }
    ]
  }, 
  {
    "deptId": "010", 
    "deptName": "疼痛", 
    "children": [
      {
        "deptId": "010001", 
        "deptName": "疼痛科"
      }
    ]
  }, 
  {
    "deptId": "011", 
    "deptName": "肿瘤", 
    "children": [
      {
        "deptId": "011001", 
        "deptName": "肿瘤科"
      }, 
      {
        "deptId": "011002", 
        "deptName": "放化疗科"
      }
    ]
  }, 
  {
    "deptId": "012", 
    "deptName": "医学美容", 
    "children": [
      {
        "deptId": "012001", 
        "deptName": "医学美容"
      }
    ]
  }
];

module.exports = {

  'GET /api/ssm/client/dept/list': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: depts,
      });
    }, 500);
  },

};
