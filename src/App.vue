<template>
	<Header />
	<router-view :categories="categories"></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import { BASE_LINK, API_KEY } from './base-params'
import { reactive, ref } from 'vue'

let categories = ref([])

const getCategories = async link => {
	try {
		const response = await fetch(link, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (!response.ok) {
			throw new Error('Ошибка')
		}

		categories.value = await response.json()
	} catch (e) {
		console.error(e)
		categories.value = []
	}
}

onMounted(() => {
	getCategories(`${BASE_LINK}category?api_key=${API_KEY}`)
})
</script>

<style scoped></style>
