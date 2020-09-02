<template>
	<v-container fluid class="fill-height">
		<v-row align="center" justify="center">
			<v-col cols="12">
				<v-card>
					<v-card-title>Daily Performance </v-card-title>
					<v-card-text>
						<fusioncharts
							ref="timeline"
							:type="timeline.type"
							:width="timeline.width"
							:height="timeline.height"
							:dataformat="timeline.dataFormat"
							:dataSource="timeline.dataSource"
						></fusioncharts>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="4" v-for="item in procTotals" :key="item.name">
				<v-card>
					<v-card-title>
						{{ item.name }}
					</v-card-title>
					<v-card-text
						class="text-center pa-5 display-md-2 display-1 font-weight-light"
					>
						{{ item.value }}
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
	import Vue from 'vue';
	import VueFusionCharts from 'vue-fusioncharts';
	import FusionCharts from 'fusioncharts';
	import Column2D from 'fusioncharts/fusioncharts.charts';
	import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
	import _ from 'lodash';

	Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

	export default {
		name: 'fsaProcessing',
		data() {
			return {
				processors: ['Paulette', 'Chau', 'Kaitlyn'],
				timeline: {
					type: 'msline',
					width: '100%',
					height: '450',
					dataFormat: 'json',
					dataSource: {
						chart: {
							yaxisname: 'Claims Processed',
							showhovereffect: '1',
							drawcrossline: '1',
							plottooltext: '<b>$dataValue</b> of youth were on $seriesName',
							theme: 'fusion',
						},
						categories: [
							{
								category: [],
							},
						],
						dataset: [],
					},
				},
			};
		},
		created: function () {
			var self = this;
			self.setCategories(['2012', '2013', '2014', '2015', '2016']);
			self.setChartData();
		},
		computed: {
			procTotals() {
				var self = this;
				return self.processors1.map(function (n) {
					var x = self.timeline.dataSource.dataset.filter(function (m) {
						return m.seriesname == n;
					})[0].data;

					return {
						name: n,
						value: _.sumBy(x, function (l) {
							return Number(l.value);
						}),
					};
				});
			},
			processors1() {
				var self = this;
				return self.timeline.dataSource.dataset.map(function (n) {
					return n.seriesname;
				});
			},
		},
		methods: {
			setChartData() {
				var self = this;
				self.timeline.dataSource.dataset = [
					{
						seriesname: 'Kaitlyn',
						data: [
							{ value: '62' },
							{ value: '64' },
							{ value: '64' },
							{ value: '66' },
							{ value: '78' },
						],
					},
					{
						seriesname: 'Chau',
						data: [
							{ value: '16' },
							{ value: '28' },
							{ value: '34' },
							{ value: '42' },
							{ value: '54' },
						],
					},
					{
						seriesname: 'Paulette',
						data: [
							{ value: '20' },
							{ value: '22' },
							{ value: '27' },
							{ value: '22' },
							{ value: '29' },
						],
					},
				];
			},
			setCategories(r) {
				var self = this;
				self.timeline.dataSource.categories[0].category = [];
				r.forEach(function (n) {
					self.timeline.dataSource.categories[0].category.push({ label: n });
				});
			},
		},
	};
</script>
