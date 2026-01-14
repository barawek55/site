<template>
	<main class="main">
		<section class="section product-detail">
			<div class="container product-detail__container">
				<div class="loader" v-if="loading">Загрузка...</div>
				<div class="product-detail__content" v-else-if="product">
					<div class="product-detail__image">
						<img
							:src="product.img"
							:alt="product.name"
							class="product-detail__img"
						/>
					</div>
					<div class="product-detail__info">
						<h1 class="product-detail__title">{{ product.name }}</h1>

						<div class="product-detail__price">
							<span class="product-detail__price-value"
								>{{ product.price }} рублей
							</span>
						</div>

						<div class="product-detail__rating">
							<div class="product-detail__rating-score">
								<span class="product-detail__rating-label">Рейтинг:</span>
								<span class="product-detail__rating-value">{{
									formattedRating
								}}</span>
								<span class="product-detail__rating-count"
									>({{ product.rating_count }} оценок)</span
								>
							</div>
						</div>

						<div class="product-detail__description" v-if="product.description">
							<h2 class="product-detail__description-title">Описание</h2>
							<p class="product-detail__description-text">
								{{ product.description }}
							</p>
						</div>

						<div class="product-detail__description" v-else>
							<h2 class="product-detail__description-title">Описание</h2>
							<p class="product-detail__description-text">
								Описание товара отсутствует
							</p>
						</div>

						<div class="product-detail__actions">
							<button
								class="button product-detail__button product-detail__button--cart"
								@click="addToCart"
								:disabled="isProductInCart"
							>
								{{ isProductInCart ? 'Товар в корзине' : 'Добавить в корзину' }}
							</button>
							<button
								class="button product-detail__button product-detail__button--back"
								@click="goBack"
							>
								Вернуться в каталог
							</button>
						</div>
					</div>
				</div>
				<div class="product-detail__not-found" v-else>
					<h2>Товар не найден</h2>
					<button class="button product-detail__button" @click="goBack">
						Вернуться в каталог
					</button>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_KEY, BASE_LINK } from '@/base-params'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(true)
const basket = ref([])

const productId = computed(() => route.params.id)

const formattedRating = computed(() => {
	if (!product.value) return '0'
	return product.value.rating.toFixed(1)
})

const isProductInCart = computed(() => {
	if (!product.value) return false
	const cartData = getCartFromLocalStorage()
	return cartData.some(item => item.id === product.value.id)
})

const getCartFromLocalStorage = () => {
	try {
		const cartData = localStorage.getItem('cartData')
		return cartData ? JSON.parse(cartData) : []
	} catch (e) {
		console.error('Ошибка при чтении корзины из localStorage:', e)
		return []
	}
}

const addToCart = () => {
	if (!product.value) return

	try {
		const cartData = getCartFromLocalStorage()

		if (!cartData.some(item => item.id === product.value.id)) {
			cartData.push(product.value)
			localStorage.setItem('cartData', JSON.stringify(cartData))
			basket.value = cartData

			alert('Товар добавлен в корзину!')
		}
	} catch (e) {
		console.error('Ошибка при добавлении товара в корзину:', e)
	}
}

const goBack = () => {
	router.push('/')
}

const fetchProduct = async () => {
	loading.value = true
	try {
		const response = await fetch(
			`${BASE_LINK}product/${productId.value}?api_key=${API_KEY}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		)

		if (!response.ok) {
			throw new Error('Ошибка загрузки товара')
		}

		product.value = await response.json()
	} catch (error) {
		console.error('Ошибка при загрузке товара:', error)
		product.value = null
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchProduct()
	basket.value = getCartFromLocalStorage()
})
</script>

<style scoped>
.product-detail__container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.product-detail__content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 40px;
	align-items: start;
}

.product-detail__image {
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	background-color: #f9f9f9;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 400px;
}

.product-detail__img {
	max-width: 100%;
	max-height: 400px;
	object-fit: contain;
}

.product-detail__info {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.product-detail__title {
	font-size: 32px;
	font-weight: 700;
	color: #333;
	margin: 0;
}

.product-detail__price {
	font-size: 28px;
	font-weight: 600;
	color: #e53935;
}

.product-detail__price-value {
	background-color: #f5f5f5;
	padding: 10px 20px;
	border-radius: 4px;
	display: inline-block;
}

.product-detail__rating {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 15px;
	background-color: #f8f9fa;
	border-radius: 8px;
}

.product-detail__rating-label {
	font-weight: 600;
	color: #666;
}

.product-detail__rating-value {
	font-size: 24px;
	font-weight: 700;
	color: #ff9800;
	margin: 0 5px;
}

.product-detail__rating-count {
	color: #757575;
	font-size: 14px;
}

.product-detail__description {
	margin-top: 20px;
	padding: 20px;
	background-color: #f5f5f5;
	border-radius: 8px;
}

.product-detail__description-title {
	font-size: 20px;
	font-weight: 600;
	color: #333;
	margin-bottom: 10px;
}

.product-detail__description-text {
	font-size: 16px;
	line-height: 1.6;
	color: #555;
	margin: 0;
}

.product-detail__actions {
	display: flex;
	gap: 15px;
	margin-top: 30px;
	flex-wrap: wrap;
}

.product-detail__button {
	padding: 12px 24px;
	font-size: 16px;
	font-weight: 600;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.product-detail__button--cart {
	background-color: #4caf50;
	color: white;
	flex: 1;
	min-width: 200px;
}

.product-detail__button--cart:hover:not(:disabled) {
	background-color: #388e3c;
}

.product-detail__button--cart:disabled {
	background-color: #9e9e9e;
	cursor: not-allowed;
}

.product-detail__button--back {
	background-color: #2196f3;
	color: white;
	flex: 1;
	min-width: 200px;
}

.product-detail__button--back:hover {
	background-color: #1976d2;
}

.product-detail__not-found {
	text-align: center;
	padding: 60px 20px;
}

.product-detail__not-found h2 {
	font-size: 28px;
	color: #757575;
	margin-bottom: 30px;
}

.loader {
	text-align: center;
	font-size: 20px;
	color: #666;
	padding: 100px 0;
}

/* Адаптивность */
@media (max-width: 992px) {
	.product-detail__content {
		grid-template-columns: 1fr;
		gap: 30px;
	}

	.product-detail__image {
		min-height: 300px;
	}
}

@media (max-width: 576px) {
	.product-detail__title {
		font-size: 24px;
	}

	.product-detail__price {
		font-size: 22px;
	}

	.product-detail__actions {
		flex-direction: column;
	}

	.product-detail__button {
		width: 100%;
	}
}
</style>
