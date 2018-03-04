<template lang="pug">
div.menu.common-block
	div.menu__operate__wrapper
		ul.menu__operate
			li.menu__operate__item(v-for="(item, index) in data")
				span(@click="deleteItem(0, index)") {{item.name}}
				ul.menu__operate__item__sub
					li.item(v-for="(subItem, subIndex) in item.sub")
					li.item--new(
						@click="newItem(1, subIndex)"
					)
						Icon(type="plus-round")
			li.menu__operate__item--new(
				@click="newItem(0)"
				v-if="data.length !== 3"
			)
				Icon(type="plus-round")
	div.menu__info(v-show="showSelect")
		h2 填写当前信息
		Form(:model="current", :label-width="80")
			FormItem(label="文字")
				Input(v-model="current.name")
			FormItem(label="类型")
				RadioGroup(v-model="current.type")
					Radio(
						v-for="item,index in types"
						:key="index"
						:label="item.type"
					)
						span {{item.text}}
			FormItem
				Button(type="primary", @click="addItem") 确认
				Button(
					type="ghost",
					style="margin-left: 1rem",
					@click="showSelect = false"
				) 取消
</template>

<script>
export default {
	data () {
		return {
			showSelect: false,
			currentLevel: 0,
			currentIndex: 0,
			types: [
				{
					type: 'view',
					text: '链接'
				},
				{
					type: 'click',
					text: '点击弹窗'
				},
				{
					type: 'miniprogram',
					text: '小程序'
				}
			],
			data: [],
			current: {
				name: '',
				type: 'view',
			},
		}
	},

	methods: {
		newItem (level = 0, index = 0) {
			this.currentLevel = level
			this.currentIndex = index
			this.showSelect = true
		},

		addItem () {
			this.showSelect = false
			this.data.push({...this.current, sub: []})
			this.current = {
				name: '',
				type: 'view',
			}
		},

		deleteItem () {
			console.log(this.currentIndex, this.currentLevel)
			this.data.splice(index, 1)
		},
	},
}
</script>

<style lang="stylus">

.menu__operate
	border $border-default
	height 2rem
	width 18rem
	margin-left 5rem
	display flex
	li:last-child
		border-right none !important

.menu__operate__item
.menu__operate__item--new
	flex 1
	padding 0 .6rem
	font-size .8rem
	line-height 2rem
	border-right $border-default
	text-align center

.menu__operate__item--new
	font-size 1.2rem
	cursor pointer

.menu__operate__item
	position relative
	&:hover
		> .menu__operate__item__sub
			display block

.menu__operate__item__sub
	display none
	position absolute
	top 100%
	left 0
	background white
	border $border-default
	width 100%

.menu__info
	width 70%
	padding 1rem
	h2
		margin-left 4rem
	> *
		margin-bottom .5rem
</style>
