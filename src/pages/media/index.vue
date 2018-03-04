<template lang="pug">
div.media.common-block
	h2 媒体列表
	Select(v-model="type" style="width:200px")
		Option(
			v-for="item in typeList"
			:value="item.value"
			:key="item.value"
		) {{ item.label }}
	div
		Button(
			type="info"
			shape="circle"
			size="small"
			@click="fetchData"
		) 查询媒体
		Button(
			type="success"
			class="u-ml10"
			shape="circle"
			size="small"
			@click="$router.push('/media/add')"
		) 添加媒体
	list(
		:list="list[type]"
		title="素材列表"
		v-show="list[type].length"
	)
	p(v-show="!list[type].length") 暂无内容
</template>

<script>
import List from './list/index.vue'

export default {
	components: {
		'list': List,
	},

	data () {
		return {
			typeList: [
				{ label: '图片', value: 'image' },
				{ label: '视频', value: 'video' },
				{ label: '声音', value: 'voice' },
			],
			type: 'image',
			list: {
				image: [],
				video: [],
				voice: [],
			},
		}
	},

	methods: {
		fetchData () {
			this.$get('/wx-manager/api/material/get', {type: this.type})
				.then(data => this.$set(this.list, this.type, data.item))
		},
	},
}
</script>

<style lang="stylus">
.media
	h2
	> div
		margin-bottom 1rem
		margin-bottom 1rem
	> p
		font-size: 1rem
		text-align: center
</style>
