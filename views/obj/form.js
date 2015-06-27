// &R stands for necessary information
// &O stands for optional information

// All information in basicInfo is considered necessary
var basicInfo = 
{
    "name": "姓名_Name",
    "sex": "性别_Sex",
    // "dob": "出生日期_Date of Birth",
    "id_number": "身份证号码_ID Number",
    "school": "在读学校_School",
    "grade": "在读年级_Grade"
};

var contactInfo = 
{
    "mobile_phone": "手机_Mobile Phone&R",
    // "alternative_mobile_phone": "备选手机_Alternative Mobile Phone",
    "wechat": "微信_WeChat",
    "email": "邮箱_Email&R"
};

var team_info = 
{
    "team_name": "团队名称_Team Name",
    "team_member_count": "团队人数_Number of Team Members",
    "project_summary": "项目简介_Brief Summary of Project"
};

module.exports.basicInfo = basicInfo;
module.exports.contactInfo = contactInfo;
module.exports.team_info = team_info;