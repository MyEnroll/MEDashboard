<template>
	<div>hi</div>
</template>
// STEP 1: to include the dependencies
<script>
	import Vue from 'vue';
	import VueFusionCharts from 'vue-fusioncharts';
	import FusionCharts from 'fusioncharts';
	import Column2D from 'fusioncharts/fusioncharts.charts';
	import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

	Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

	export default {
		name: 'detailChart',
		props: ['chartdata'],
		data() {
			return {
				type: 'pie2d',
				renderAt: 'chart-container',
				width: '100%',
				height: '350',
				dataFormat: 'json',
				dataSource: {
					chart: {
						yaxisname: 'Count',
						theme: 'fusion',
					},
					data: this.chartdata,
				},
			};
		},
	};
</script>

//STEP 4: Render the chart
<template>
	<div id="detailChart">
		<div id="chart-container">
			<fusioncharts
				:type="type"
				:width="width"
				:height="height"
				:dataformat="dataFormat"
				:dataSource="dataSource"
			>
			</fusioncharts>
		</div>
	</div>
</template>
