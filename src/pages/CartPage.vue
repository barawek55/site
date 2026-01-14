<template>
	<main class="main">
		<section class="section cart">
			<div class="container cart__container">
				<div class="cart__content">
					<h2 class="cart__title">Корзина</h2>
					<div v-if="cart.length === 0" class="cart__empty">Корзина пуста</div>
					<ul v-else class="cart__list">
						<li
							class="cart__list-item"
							v-for="item in groupedCart"
							:key="item.id"
						>
							<div class="cart__imgbox">
								<img :src="item.img" alt="" width="200" />
							</div>
							<div class="cart__info">
								<h2 class="cart__title">
									{{ item.name }}
								</h2>
								<p class="cart__subtitle">Цена: {{ item.price }} рублей</p>
								<p class="cart__subtitle">Количество: {{ item.quantity }}</p>
								<p class="cart__subtitle">
									Общая цена: {{ item.totalPrice }} рублей
								</p>
								<p class="cart__subtitle">Оценка: {{ item.rating }}</p>

								<div class="cart__quantity-controls">
									<button
										class="cart__quantity-btn"
										@click="decreaseQuantity(item.id)"
										:disabled="item.quantity <= 1"
									>
										-
									</button>
									<span class="cart__quantity">{{ item.quantity }}</span>
									<button
										class="cart__quantity-btn"
										@click="increaseQuantity(item.id)"
									>
										+
									</button>
									<button class="cart__remove-btn" @click="removeItem(item.id)">
										Удалить
									</button>
								</div>
							</div>
						</li>
					</ul>

					<div v-if="cart.length > 0" class="cart__summary">
						<h3 class="cart__summary-title">Итого:</h3>
						<p class="cart__summary-text">Товаров: {{ totalItems }}</p>
						<p class="cart__summary-text">
							Общая сумма: {{ totalPrice }} рублей
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const cart = ref([])

const groupedCart = computed(() => {
	if (!cart.value || cart.value.length === 0) return []
	const grouped = {}
	cart.value.forEach(item => {
		if (!grouped[item.id]) {
			grouped[item.id] = {
				...item,
				quantity: 0,
				totalPrice: 0,
			}
		}
		grouped[item.id].quantity += 1
		grouped[item.id].totalPrice = grouped[item.id].quantity * item.price
	})

	return Object.values(grouped)
})

const totalItems = computed(() => {
	return cart.value.length
})

const totalPrice = computed(() => {
	return groupedCart.value.reduce((sum, item) => sum + item.totalPrice, 0)
})

const getCart = () => {
	try {
		const products = localStorage.getItem('cartData')
		cart.value = JSON.parse(products) || []
	} catch (e) {
		console.error(e)
		cart.value = []
	}
}

const increaseQuantity = productId => {
	const item = cart.value.find(item => item.id === productId)
	if (item) {
		cart.value.push({ ...item })
		saveCart()
	}
}

const decreaseQuantity = productId => {
	const index = cart.value.findIndex(item => item.id === productId)
	if (index !== -1) {
		cart.value.splice(index, 1)
		saveCart()
	}
}

const removeItem = productId => {
	cart.value = cart.value.filter(item => item.id !== productId)
	saveCart()
}

const saveCart = () => {
	try {
		localStorage.setItem('cartData', JSON.stringify(cart.value))
	} catch (e) {
		console.error('Ошибка при сохранении корзины:', e)
	}
}

onMounted(() => {
	getCart()
})

window.addEventListener('storage', event => {
	if (event.key === 'cartData') {
		getCart()
	}
})
</script>

<style scoped>
.cart__title {
	font-size: 24px;
	font-weight: 700;
	margin-bottom: 30px;
}

.cart__list {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-bottom: 40px;
}

.cart__list-item {
	display: flex;
	gap: 20px;
	align-items: flex-start;
	border: solid 2px black;
	padding: 15px;
	background-color: #f9f9f9;
	border-radius: 8px;
}

.cart__imgbox {
	flex-shrink: 0;
	width: 120px;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.cart__img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.cart__info {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.cart__item-title {
	font-weight: 700;
	font-size: 18px;
	margin: 0;
	line-height: 1.3;
}

.cart__subtitle {
	font-size: 16px;
	margin: 0;
	color: #555;
}

.cart__controls {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 15px;
	margin-top: 12px;
}

.cart__quantity-controls {
	display: flex;
	align-items: center;
	gap: 10px;
}

.cart__quantity-btn {
	width: 36px;
	height: 36px;
	border: 2px solid #333;
	background-color: white;
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s;
	border-radius: 4px;
}

.cart__quantity-btn:hover {
	background-color: #333;
	color: white;
}

.cart__quantity-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	background-color: #f0f0f0;
}

.cart__quantity-btn:disabled:hover {
	background-color: #f0f0f0;
	color: inherit;
}

.cart__quantity {
	font-size: 18px;
	font-weight: bold;
	min-width: 25px;
	text-align: center;
}

.cart__remove-btn {
	padding: 8px 16px;
	background-color: #ff4444;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	transition: background-color 0.3s;
}

.cart__remove-btn:hover {
	background-color: #cc0000;
}

.cart__summary {
	border-top: 2px solid #333;
	padding-top: 20px;
	margin-top: 20px;
}

.cart__summary-title {
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 10px;
}

.cart__summary-text {
	font-size: 16px;
	margin: 5px 0;
}

.cart__empty {
	font-size: 18px;
	color: #666;
	text-align: center;
	padding: 50px 0;
}


@media (max-width: 768px) {
	.cart__title {
		font-size: 20px;
		margin-bottom: 20px;
	}

	.cart__list-item {
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 15px;
		gap: 15px;
	}

	.cart__imgbox {
		width: 150px;
		height: 150px;
	}

	.cart__info {
		width: 100%;
		align-items: center;
	}

	.cart__item-title {
		font-size: 16px;
	}

	.cart__subtitle {
		font-size: 14px;
	}

	.cart__controls {
		flex-direction: column;
		width: 100%;
	}

	.cart__quantity-controls {
		justify-content: center;
	}

	.cart__remove-btn {
		width: 100%;
		max-width: 200px;
	}

	.cart__summary-title {
		font-size: 18px;
	}

	.cart__summary-text {
		font-size: 14px;
	}
}

@media (max-width: 480px) {
	.cart__title {
		font-size: 18px;
	}

	.cart__list {
		gap: 15px;
	}

	.cart__list-item {
		padding: 12px;
	}

	.cart__imgbox {
		width: 120px;
		height: 120px;
	}

	.cart__item-title {
		font-size: 15px;
	}

	.cart__subtitle {
		font-size: 13px;
	}

	.cart__quantity-btn {
		width: 32px;
		height: 32px;
		font-size: 16px;
	}

	.cart__quantity {
		font-size: 16px;
	}

	.cart__remove-btn {
		font-size: 13px;
		padding: 6px 12px;
	}
}
</style>
