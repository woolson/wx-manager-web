import axios from 'axios'
import iView from 'iview'
import { obj2Params, getType } from 'src/common/utils'

const isProduction = process.env.NODE_ENV === 'production'

export const post = (url, data, options) => {
	return common('POST', url, data, options)
}

export const get = (url, data, options) => {
	return common('GET', url, data, options)
}

export const common = (type, url, data, options = {}) => {
	if (getType(url) === 'object') {
		const request = url
		url = request.url
		data = request.data
		options = request.options || {}
	}
	// 设置默认值
	options = Object.assign({
		// 显示loading
		process: true,
		// 超时时间
		timeout: null,
	}, options)

	var config = {
		method: type,
		dataType: 'json',
		timeout: options.timeout,
		withCredentials: true,
		headers: {
			'content-type': 'application/json;charset=utf-8',
		},
	}
	const baseUrl = isProduction ? '' : 'http://localhost:3000'
	config.url = baseUrl + url

	if (type.toLowerCase() === 'get') config.params = data
	else config.data = data

	if (!options.disableLoading) {
		// 添加loading
		iView.LoadingBar.start()
	}

	return axios(config).
		then(({success, data, error: errorMsg}) => {
			if (success) return data || {}
			else {
				const msg = getType(errorMsg) === 'object' ? errorMsg.errmsg : errorMsg
				const error = {
					errorMessage: msg,
					error: true,
				}
				iView.Message.error(msg)
				return Promise.reject(errorMsg)
			}
		})
}

axios.interceptors.request.use(function (config) {
	return config
}, function (error) {
	// Do something with request error
	return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
	// 关闭loading
	iView.LoadingBar.finish()

	return response.data || {}
}, function (error) {
	// 关闭loading
	iView.LoadingBar.finish()

	if (error.response.status === 403) {
		window.vm.$router.push('/login')
	}

	return Promise.reject(error)
})

// 全局绑定
function install (Vue) {
	Object.defineProperty(Vue.prototype, '$get', {
		get: () => get,
	})
	Object.defineProperty(Vue.prototype, '$post', {
		get: () => post,
	})
	Object.defineProperty(Vue.prototype, '$fetch', {
		get: () => common,
	})
}

export default install
