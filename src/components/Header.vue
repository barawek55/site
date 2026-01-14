<template>
	<header class="header">
		<div class="header__container container">
			<p class="header__logo">Магазин для барашков</p>
			<nav class="header__nav">
				<ul class="header__list">
					<li class="header__item">
						<router-link to="/">
							<svg
								fill="#000000"
								width="44px"
								height="44px"
								viewBox="0 0 1024 1024"
								xmlns="http://www.w3.org/2000/svg"
								class="icon"
							>
								<path
									d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z"
								/>
							</svg>
						</router-link>
					</li>
					<li class="header__item">
						<router-link to="/cart">
							<svg
								width="44px"
								height="44px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5 7H13H18.79C19.9733 7 20.8978 8.02164 20.7801 9.19901L20.1801 15.199C20.0779 16.2214 19.2175 17 18.19 17H8.63961C7.68625 17 6.86542 16.3271 6.67845 15.3922L5 7Z"
									stroke="#000000"
									stroke-width="2"
									stroke-linejoin="round"
								/>
								<path
									d="M5 7L4.18937 3.75746C4.07807 3.3123 3.67809 3 3.21922 3H2"
									stroke="#000000"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8 21H10"
									stroke="#000000"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16 21H18"
									stroke="#000000"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</router-link>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<style scoped lang="css">
.header {
	padding-block: 30px;
}

.header__logo {
	font-weight: 700;
}

.header__container {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.header__list {
	display: flex;
	align-items: center;
	gap: 30px;
}
</style>
