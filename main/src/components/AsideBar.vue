<template>
	<div class="aside-wrapper">
		<ul class="menu-ul">
			<li @click="switchSubitem(3)">Vue3项目</li>
			<li @click="switchSubitem(2)">Vue2项目</li>
		</ul>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'AsideBar',
	setup() {
		console.log('aside setup')

		const router = useRouter()
		
		function switchSubitem(version) {
			router.push(`/vue${version}`)
		}

		return {
			switchSubitem
		}
	}
})
</script>

<style scoped>
.aside-wrapper {
	background: pink;
	width: 200px;
	height: 100vh;
	box-sizing: border-box;
}
.menu-ul {
	margin: 0;
	padding: 0;
	text-align: center;
	list-style: none;
}
.menu-ul li {
	border-bottom: 1px wheat solid;
	background: lightblue;
	height: 50px;
	vertical-align: middle;
	cursor: pointer;
}
.menu-ul li::before {
	content: '';
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}
</style>