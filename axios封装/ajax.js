import axios from 'axios'
import Vue from 'vue'
import {callForceLogin,openLoading,closeLoading} from '../util/app'
import qs from 'qs'

class AJAX {
    constructor(cfg) {
        // 成功标志key
        this.reqSuccessKey = cfg.reqSuccessKey
            // 成功标志value
        this.reqSuccessValue = cfg.reqSuccessValue
            // 消息key
        this.msgKey = cfg.msgKey
            // 拦截错误
        this.interceptError = cfg.interceptError
        // 禁用进度条
        this.forbidIndicator = cfg.forbidIndicator
        // 默认错误提示
        this.errorTips = cfg.errorTips
        this.instance = axios.create({
            baseURL: cfg.baseUrl,
            timeout: cfg.timeout || 300000
        })
        this.initInterceptors()
    }
    get(url, params) {
        return this.fetch(url,params)
    }
    post(url, params,flag,config) {
        let _params = qs.stringify(params)
        let _config = Object.assign(
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },
            config
        )
        return this.fetch(url, _params, true, _config)
    }
    fetch(url, params, flag, config) {
        let instance = flag ? this.instance.post(url, params, config) : this.instance.get(url, params)
        return new Promise((resolve, reject) => {
            instance.then((res) => {
                let code = res && res[this.reqSuccessKey]
                if (this.reqSuccessValue.indexOf(code) > -1) {
                    resolve(res)
                } else {
                    let msg = res && res[this.msgKey] || JSON.stringify(res)
                    msg ? Toast(msg) : '';
                    reject(res)      
                }
            }).catch((error) => {
                reject(error)
            })
        })
    }

    initInterceptors() {

        var index = 0;
        var forbidIndicator = this.forbidIndicator
        // 拦截请求，给header添加token
        this.instance.interceptors.request.use(function(config) {
           
            config.headers['WEBAPP-USER-HEADER'] = localStorage.getItem("token");
            ;(!forbidIndicator) && openLoading()
            index++;
            return config
        });


        // 接口response拦截器
        this.instance.interceptors.response.use((response) => {
            // this.$store.dispatch('setNowTime', response.headers.date);
            Vue.prototype.$DataStore.nowData = response.headers.date; //全局日期
            // closeLoading
            index--;
            if (!index) {
                closeLoading()
            }
            response = response.data
            let callbackFn = this.interceptError
            // 202登录超时
            if (response.status == 202) {
                Toast(response.msg);
                callForceLogin()
                callbackFn && callbackFn(response.status)
            } else {
                return response
            }
        }, (res) => {
            // Vue.prototype.$DataStore.nowData = res.headers.date; //全局日期
            // closeLoading
            index--;
            if (!index) {
                closeLoading()
            }

            res = res.response
            let msg = this.errorTips ? this.errorTips : '请求服务失败'
            if (res && res.status) {
                msg += `，错误码${res.status}`
            }
            Toast(msg);
        })
    }
}
export default AJAX