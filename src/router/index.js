import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import { setTitle } from 'src/common/utils'

Vue.use(Router)

const config = [
	{ path: '', name: 'home' },
	{ path: '/login', name: 'login' },
	{ path: '/article', name: 'article' },
	{ path: '/article/add', name: 'articleAdd' },
	{ path: '/media', name: 'media' },
	{ path: '/media/add', name: 'mediaAdd' },
	{ path: '/menu', name: 'menu' },
	{ path: '/setting', name: 'setting' },
]

const routes = [
	...parseRoute(config),
	{
		path: '*',
		component: resolve => require(['../pages/not-found/index.vue'], resolve),
	},
]

// 用于解析路由配置
function parseRoute (items) {
	return items.map(item => {
		const path = item.path.replace(/(:|\?)\w+$/g, '')
		const result = {
			path,
			name: item.name,
			component: resolve => require([`../pages${path}/index.vue`], resolve),
		}

		return result
	})
}

const RootRouter = new Router({
	mode: 'history',
	base: process.env.NODE_ENV === 'production' ? '/wx-manager/' : '',
	routes,
})

RootRouter.beforeEach((to, from, next) => {
	iView.LoadingBar.start()
	const titleMap = {
		home: '主页',
		login: '登录',
		article: '图文',
		articleAdd: '添加图文',
		media: '媒体',
		mediaAdd: '添加媒体',
		menu: '菜单',
		setting: '设置',
	}
	// 切换页面修改title
	setTitle(titleMap[to.name])
	next()
})

RootRouter.afterEach((to, from, next) => {
	iView.LoadingBar.finish()
})

export default RootRouter
