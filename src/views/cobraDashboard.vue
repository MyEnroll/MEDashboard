<template>
	<v-container fluid>
		<v-row>
			<v-col>
				<cobraDash />
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped></style>

<script>
	import cobraDash from '@/components/cobraDashboardCard.vue';
	export default {
		name: 'cobraDashboard',
		components: {
			cobraDash,
		},
	};
</script>
