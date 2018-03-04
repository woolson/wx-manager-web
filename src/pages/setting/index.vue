<template lang="pug">
div.setting.common-block
	h2.u-mb15 设置
	Tabs(v-model="tabIndex")
		TabPane(label="测试号列表")
			RadioGroup(v-model="app")
				ul.setting__apps
					li(
						v-for="item,index in apps"
						:key="index"
					)
						Radio(:label="item.appId") &nbsp;
						div.content
							h3 {{item.name}}
							div
								label AppId：
								span.u-color-main {{item.appId}}
								span(
									v-clipboard="item.appId"
									class="u-ml10 u-color-blue u-pointer"
									@success="copySuccessFn"
								) 点击复制
					li.setting__apps__buttons
						Button(
							type="success"
							shape="circle"
							size="small"
							@click="useApp"
							:disabled="this.app == this.currentApp"
						) 使用
						Button(
							type="error"
							shape="circle"
							size="small"
							:disabled="this.app == this.currentApp"
							@click="deleteApp"
						) 删除

		TabPane(label="添加测试号")
			div.setting__add
				Form(:model="appInfo" :label-width="80")
					FormItem(label="名称")
						Input(v-model="appInfo.name" placeholder="请输入")
					FormItem(label="AppId")
						Input(v-model="appInfo.appId" placeholder="请输入ID")
					FormItem(label="Secret")
						Input(v-model="appInfo.appSecret" placeholder="请输入秘钥")
					FormItem(label="添加密码")
						Input(v-model="appInfo.password" placeholder="请输入添加密码")
					FormItem.setting__add__buttons
						Button.u-w80(
							type="success"
							shape="circle"
							class="u-mr10"
							size="small"
							@click="addApp"
						) 确定
						Button.u-w80.u-ml20(
							shape="circle"
							size="small"
							@click="tabIndex = 0"
						) 取消
		TabPane.u-ta-center(label="调用清零")
			Button.u-w80.u-mt40(
				type="success"
				shape="circle"
				@click="clearApi"
			) 清零
</template>

<script>
export default {
	data () {
		return {
			app: null,
			currentApp: null,
			apps: [],
			appInfo: {},
			tabIndex: 0,
			copySuccessFn: require('src/common/utils').copySuccessFn,
		}
	},

	mounted () {
		this.fetchApps()
	},

	methods: {
		async fetchApps () {
			this.apps = await this.$get('/wx-manager/api/app/get')
			this.app = (this.apps.find(o => o.checked) || {}).appId
		},
		useApp () {
			this.$post('/wx-manager/api/app/set', {appId: this.app})
				.then(data => {
					this.$Message.success('设置成功')
					this.currentApp = this.app
				})
		},
		addApp () {
			const { name, appId, appSecret, password } = this.appInfo
			if(!name || !appId || !appSecret || !password) {
				this.$Message.error('请填写完整')
				return
			}

			this.$post(`/wx-manager/api/app/add`, this.appInfo)
				.then(data => {
					this.fetchApps()
					this.$Message.success('添加成功')
					this.tabIndex = 0
				})
		},
		deleteApp () {
			this.$get('/wx-manager/api/app/delete', {appId: this.app})
				.then(data => {
					this.appInfo = {}
					this.$Message.success('删除成功')
					this.fetchApps()
				})
		},
		clearApi () {
			this.$Modal.confirm({
				content: '<h3>确认清零API接口调用次数？</h3><p>(每个帐号每月共10次清零操作机会)</p>',
				onOk: () => {
					this.$get('/wx-manager/api/app/reset')
						.then(data => this.$Message.success('清零成功'))
				},
			})
		}
	},
}
</script>

<style lang="stylus" scoped>
.ivu-radio-group
	width: 100%

.setting__apps
	border: $border-default
	border-radius .5rem
	width: 100%
	li
		display flex
		align-items: center
		padding .8rem
		border-bottom: $border-default
		&:last-child
			border-bottom: none

.setting__apps__buttons
.setting__add__buttons div
	display: flex
	justify-content: space-around
	button
		flex-basis 25%
</style>
