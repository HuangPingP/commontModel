let startTime = 0;
let endTime = 0;
let clickCount = 0;
let timer = null;
const PTC = {
    // 浅拷贝 对象
    DeepCopy (obj) {
        let str
        let newobj
        if (typeof obj !== 'object') {
          return obj
        } else if (window.JSON) {
          str = JSON.stringify(obj)
          newobj = JSON.parse(str)
        } else {
          newobj = obj.constructor === Array ? [] : {}
          for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? DeepCopy(obj[i]) : obj[i]
          }
        }
        return newobj
      },
    getBranchStatus(val) {
        switch (val) {
            case 0:
                return '筹建';
                break;
            case 1:
                return '开业';
                break;
            case 2:
                return '筹建中解约';
                break;
            case 3:
                return '开业后解约';
                break;
            case 5:
                return '下线整改';
                break;
            case 6:
                return '售出未下线';
                break;
            case 7:
                return '转品牌';
                break;
            case -1:
                return '开发';
                break;
        }
    },
    getDepType(val) {
        switch (val) {
            case 1:
                return '部门';
                break;
            case 2:
                return '区域';
                break;
            case 3:
                return '事业群';
                break;
            case 4:
                return '事业部';
                break;
            case 6:
                return '外部企业';
                break;
            default:
                return '其他';
        }
    },
    getIdType(val) {
        switch (val) {
            case 1:
                return '身份证';
                break;
            case 2:
                return '护照';
                break;
            case 3:
                return '通行证';
                break;
            case 100:
                return '其他证件';
                break;
            default:
                return '';
        }
    },
    // tree 添加disabled
    setDisable(menu, val) {
        let par = menu;
        menu.forEach((m, i) => {
            if (m.type != val) {
                m.disabled = true
            }
            if (m.subs) {
                m.subs.type != val ? m.subs.disabled = true : "";
                m.subs.forEach((o, j) => {
                    if (o.type != val) o.disabled = true;
                    if (o.subs) {
                        o.subs.forEach((k, r) => {
                            if (k.type != val) k.disabled = true;
                        })
                    }
                })
            }
        });
        return par;
    },
    // 密码强度
    passStrong(sValue) {
        let leg = sValue.length,
            modes = 0;
        if (/\d/.test(sValue)) modes++; //数字
        if (/[a-zA-Z]/.test(sValue)) modes++; //大小写
        if (/[\\.,!@#$%^&*()}{:<>|]/.test(sValue)) modes++; //特殊字符
        if (modes == 2 && (leg >= 6)) {
            modes = 2
        } else if (modes == 3 && (leg > 6)) {
            modes = 3
        } else {
            modes = 1
        }
        return modes;
    },
    // 双击事件
    hotelDbclick() {
        clickCount == 0 && (startTime = Date.now());
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            clickCount = 0;
            startTime = 0;
            endTime = 0;
            clearTimeout(timer);
        }, 300);
        clickCount == 1 && (endTime = Date.now());
        clickCount += 1;
        // console.log("后面：" + endTime, startTime, clickCount);
        if (endTime - startTime > 0) {
            // 双击
            // console.log("双击");
            return true;
        } else {
            // 单击
            // console.log("单击");
            return false;
        }
    },
    // 过滤 子元素  1002 1002001 1002003  =》 1002
    pickArr(arrObj, callback) {
        if (arrObj.length > 0) {
          var arrRemain = arrObj;
          for (var i = 0; i < arrRemain.length; i++) {
            var strOne = arrRemain[i];
            if (typeof strOne == "string") {
              var reg = new RegExp("^" + strOne);
              var arrteo = arrRemain.filter(function (vlaue, index) {
                if (i == index) {
                  return true;
                } else {
                  return !reg.test(vlaue);
                }
              });
              arrRemain = arrteo;
            }
          }
          callback(arrRemain);
          return arrRemain;
        }
      },
      //身份证校验
    expIdCard(val) {
        let idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        let idCardReg = idCard.test(val);
        if(idCardRe) {
            return true
        }else{
            return false
        }
    },
    // 手机号校验
    expTel(val) {
        this.telReg = /(^1[0-9]\d{9}$)/.test(val);
        if (this.telReg) {
            return true;
        }else{
            return false;
        }
    },
    // 邮箱校验
    expEmail(val) {
        let email = /^\w[\w\-\.]*@[0-9a-zA-Z\-]{2,}\.[a-zA-Z]{2,}$/;
          let idEmail = email.test(val);
          if (idEmail) {
            return false;
          }else{
              return true;
          }
    }
}
export { PTC }