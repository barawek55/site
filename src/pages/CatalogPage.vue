<template>
	<main class="main">
		<section class="section catalog">
			<div class="container catalog__container">
				<div class="loader" v-if="categories.length === 0">Загрузка...</div>
				<div class="catalog__content" v-else>
					<div class="catalog__select">
						<h2 class="catalog__title">Категории</h2>
						<select
							v-model="categorySelected"
							@change="handleChange"
							name="catSelect"
							id="sel1"
						>
							<option value="0">Любые</option>
							<option v-for="cat in categories" :key="cat.id" :value="cat.id">
								{{ cat.name }}
							</option>
						</select>
					</div>
					<div class="catalog__products">
						<ul class="catalog__list">
							<li
								class="catalog__list-item"
								v-for="item in items"
								:key="item.id"
								@click="goToProductPage(item.id)"
							>
								<div class="catalog__imgbox">
									<img :src="item.img" alt="" width="200" />
								</div>
								<div class="catalog__info">
									<h2 class="catalog__title">
										{{ item.name }}
									</h2>
									<p class="catalog__subtitle">{{ item.price }} рублей</p>
									<p class="catalog__subtitle">Оценка: {{ item.rating }}</p>
									<button
										class="button catalog__button"
										@click.stop="setCartLocalStorage(item)"
									>
										В корзину
									</button>
								</div>
							</li>
						</ul>
					</div>
					<div class="catalog__pagination">
						<button @click="handlePrev" class="button catalog__pagination-prev">
							Назад
						</button>
						<p>
							{{ `${currentPage} / ${totalPages}` }}
						</p>
						<button @click="handleNext" class="button catalog__pagination-next">
							Вперед
						</button>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { API_KEY, BASE_LINK } from '@/base-params'

const router = useRouter()

const categorySelected = ref(0)
const products = reactive({})
const items = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const basket = ref([])

const props = defineProps({
	categories: {
		type: Array,
		default: () => [],
	},
})

const goToProductPage = productId => {
	router.push(`/product/${productId}`)
}

const getCartFromLocalStorage = () => {
	try {
		const cartData = localStorage.getItem('cartData')
		return cartData ? JSON.parse(cartData) : []
	} catch (e) {
		console.error('Ошибка при чтении корзины из localStorage:', e)
		return []
	}
}

const setCartLocalStorage = product => {
	basket.value.push(product)
	const currentBasket = getCartFromLocalStorage()
	try {
		localStorage.setItem(
			'cartData',
			JSON.stringify([...currentBasket, ...basket.value])
		)
		basket.value = []
	} catch (e) {
		console.error(e)
	}
}

const handlePrev = async () => {
	if (currentPage.value > 1) {
		currentPage.value -= 1
		await fetchProducts(currentPage.value)
	}
}

const handleNext = async () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value += 1
		await fetchProducts(currentPage.value)
	}
}

const handleChange = async () => {
	await fetchProducts(1)
	currentPage.value = 1
}

const fetchProducts = async page => {
	try {
		const response = await fetch(
			`${BASE_LINK}product?api_key=${API_KEY}&page=${page}&category_id=${categorySelected.value}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)

		if (!response.ok) {
			throw new Error('Ошибка')
		}

		products.value = await response.json()
		totalPages.value = products.value.total_pages
		items.value = products.value.items
	} catch (e) {
		console.error(e)
		products.value = []
		categorySelected.value = 0
		items.value = []
		currentPage.value = 1
		totalPages.value = 1
	}
}

onMounted(() => {
	fetchProducts(currentPage.value)
})
</script>

<style scoped>
.catalog__title {
	font-weight: 800;
	font-size: 20px;
}

.catalog__subtitle {
	font-size: 18px;
}

.catalog__select {
	display: flex;
	flex-direction: column;
	gap: 30px;
	max-width: max-content;

	& select {
		cursor: pointer;
		border: 2px solid black;
		padding: 10px;
	}
}

.catalog__content {
	display: flex;
	flex-direction: column;
	row-gap: 30px;
}

.catalog__list {
	display: flex;
	flex-wrap: wrap;
	gap: 60px;
}

.catalog__list-item {
	cursor: pointer;
	display: flex;
	gap: 30px;
	align-items: center;
	border: solid 2px black;
	padding: 10px 20px;
}

.catalog__info {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.catalog__button {
	transition-duration: 0.3s;

	&:hover {
		color: white;
		background-color: black;
	}
}

.catalog__button[disabled] {
	filter: brightness(40%);
	pointer-events: none;
	cursor: not-allowed;
	&:hover {
		color: inherit;
		background-color: inherit;
	}
}

.catalog__pagination {
	display: flex;
	align-items: center;
	gap: 30px;
}

@media (width < 468px) {
	.catalog__list-item {
		flex-direction: column;
	}
}
</style>
