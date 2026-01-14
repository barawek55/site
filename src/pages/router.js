import { createRouter, createWebHistory } from 'vue-router'

import CatalogPage from './CatalogPage.vue'
import CartPage from './CartPage.vue'
import DescriptionPage from './DescriptionPage.vue'

const routes = [
	{
		path: '/',
		name: 'Каталог',
		component: CatalogPage,
		meta: {
			title: 'Каталог',
		},
	},
	{
		path: '/cart',
		name: 'Корзина товаров',
		component: CartPage,
		meta: {
			title: 'Корзина',
		},
	},
	{
		path: '/product/:id',
		name: 'Описание товара',
		component: DescriptionPage,
		meta: {
			title: 'Описание товара',
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const title = to.meta.title

	if (title) {
		document.title = title
	} else {
		document.title = 'Магазин'
	}

	next()
})

export default router
