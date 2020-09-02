<template>
	<div>
		<v-slide-x-reverse-transition>
			<template v-if="loaded.length < 6">
				<v-card class="text-center me-top-right">
					<v-card-text>
						<v-progress-circular
							:size="50"
							color="primary"
							indeterminate
						></v-progress-circular>
						<div class="font-weight-bold">Loading Reports...</div>
					</v-card-text>
				</v-card>
			</template>
		</v-slide-x-reverse-transition>
		<div>
			<v-card
				loader-height="6"
				:loading="allRepsLoaded"
				color="blue-grey darken-4"
				dark
				class="overflow-hidden"
				outlined
			>
				<apexchart
					ref="cobrachart"
					type="bar"
					height="350"
					:options="chartOptions"
					:series="series"
				></apexchart>
				<div>
					<table
						class="uk-table uk-table-middle uk-table-hover uk-table-divider uk-table-responsive"
					>
						<transition-group
							tag="tbody"
							name="slide-x-transition"
							transition="slide-x-transition"
						>
							<tr
								v-for="(item, index) in configLoaded"
								:key="index"
								@click="exportCSV(item.report, item.title, true)"
								style="cursor: pointer; font-size: 1rem"
							>
								<td>
									<v-icon :color="getSeriesColor(item.sort_order)"
										>mdi-square</v-icon
									>
								</td>
								<td>
									<span
										v-html="item.reportAbbr"
										class="font-weight-bold"
										style="font-size: 1.15rem"
									></span>
								</td>
								<td>
									<span v-html="item.title"></span>
								</td>
								<td class="text-no-wrap">
									<span v-if="item.countBill > 0">
										<b>Billable</b>
									</span>
								</td>
								<td class="text-no-wrap">
									<span v-if="item.countRec == 0">
										<span class="text--accent-2 pink--text">(No Data)</span>
									</span>
								</td>
								<td class="text-no-wrap">
									<v-btn text color="primary lighten-2" class="pa-0"
										>Download Data</v-btn
									>
								</td>
							</tr>
						</transition-group>
					</table>
				</div>
			</v-card>
		</div>
	</div>
</template>
<style scoped>
	.uk-table-hover tbody tr:hover,
	.uk-table-hover > tr:hover {
		background: #455a64;
		transition: 0.1s ease;
	}
	.me-top-right {
		position: absolute;
		top: -15px;
		right: 20px;
	}
	.uk-table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
		margin-bottom: 20px;
	}
	* + .uk-table {
		margin-top: 20px;
	}
	.uk-table th {
		padding: 16px 12px;
		text-align: left;
		vertical-align: bottom;
		/* 1 */
		font-size: 0.875rem;
		font-weight: normal;
		color: #999;
		text-transform: uppercase;
	}
	.uk-table td {
		padding: 16px 12px;
		vertical-align: top;
	}
	.uk-table td > :last-child {
		margin-bottom: 0;
	}
	.uk-table-middle,
	.uk-table-middle td {
		vertical-align: middle !important;
	}
	.uk-table-divider > tr:not(:first-child),
	.uk-table-divider > :not(:first-child) > tr,
	.uk-table-divider > :first-child > tr:not(:first-child) {
		border-top: 1px solid #e5e5e5;
	}
	@media (max-width: 959px) {
		.uk-table-responsive,
		.uk-table-responsive tbody,
		.uk-table-responsive th,
		.uk-table-responsive td,
		.uk-table-responsive tr {
			display: block;
		}
		.uk-table-responsive thead {
			display: none;
		}
		.uk-table-responsive th,
		.uk-table-responsive td {
			width: auto !important;
			max-width: none !important;
			min-width: 0 !important;
			overflow: visible !important;
			white-space: normal !important;
		}
		.uk-table-responsive th:not(:first-child):not(.uk-table-link),
		.uk-table-responsive td:not(:first-child):not(.uk-table-link),
		.uk-table-responsive .uk-table-link:not(:first-child) > a {
			padding-top: 5px !important;
		}
		.uk-table-responsive th:not(:last-child):not(.uk-table-link),
		.uk-table-responsive td:not(:last-child):not(.uk-table-link),
		.uk-table-responsive .uk-table-link:not(:last-child) > a {
			padding-bottom: 5px !important;
		}
		.uk-table-justify.uk-table-responsive th,
		.uk-table-justify.uk-table-responsive td {
			padding-left: 0;
			padding-right: 0;
		}
	}
	.uk-table tbody tr {
		transition: background-color 0.1s linear;
	}
</style>
<script>
	import Vue from 'vue';
	import $ from 'jquery';
	import VueApexCharts from 'vue-apexcharts';

	Vue.component('apexchart', VueApexCharts);
	export default {
		name: 'cobraDashboardCard',
		components: {
			apexchart: VueApexCharts,
		},
		data: function () {
			return {
				config: [],
				acctSelected: '',
				dashDataA: [],
				dashDataB: [],
				dashDataC: [],
				dashDataD: [],
				dashDataE: [],
				dashDataF: [],

				loaded: [],
				model: [
					{
						id: 'A',
						title: 'TC&apos;s with Initial Election Ends within OBP',
						json: 'dashDataA',
						details: [],
					},
					{
						id: 'B',
						title: 'TC&apos;s with initial Election Ends after OBP',
						json: 'dashDataB',
						details: [],
					},
					{
						id: 'C',
						title: 'All C&apos;s',
						json: 'dashDataC',
						details: [],
					},
					{
						id: 'D',
						title:
							'All XC&apos;s (Reinstated to &apos;C&apos;) where original termination date within OBP',
						json: 'dashDataD',
						details: [],
					},
					{
						id: 'E',
						title: 'C&apos;s with Natural End of 18/29/26 months after OBP',
						json: 'dashDataE',
						details: [],
					},
					{
						id: 'F',
						title: 'C&apos;s with Natural End of 18/29/26 months within OBP',
						json: 'dashDataF',
						details: [],
					},
				],
				series: [
					{
						name: 'A',
						data: [],
					},
					{
						name: 'B',
						data: [],
					},
					{
						name: 'C',
						data: [],
					},
					{
						name: 'D',
						data: [],
					},
					{
						name: 'E',
						data: [],
					},
					{
						name: 'F',
						data: [],
					},
				],
				chartOptions: {
					colors: [
						'#20c997',
						'#1e87f0',
						'#fd7e14',
						'#17a2b8',
						'#e83e8c',
						'#ffc107',
						'#6f42c1',
						'#28a745',
						'#dc3545',
						'#17A2B5',
						'#6c757d',
					],
					tooltip: {
						fillSeriesColor: true,
						x: {
							show: false,
						},
						y: {
							title: {
								formatter: (seriesName) => seriesName,
							},
						},
						followCursor: true,
					},
					chart: {
						type: 'bar',
						height: 350,
						background: '#263238',
						foreColor: '#fff',
						toolbar: {
							show: false,
						},
					},
					plotOptions: {
						bar: {
							horizontal: false,
							endingShape: 'flat',
							dataLabels: {
								position: 'top',
								offsetY: 30,
							},
						},
					},
					responsive: [
						{
							breakpoint: undefined,
							options: {},
						},
					],
					dataLabels: {
						enabled: true,
					},
					stroke: {
						show: true,
						width: 2,
						colors: ['transparent'],
					},
					xaxis: {
						type: 'category',
					},
					yaxis: {
						title: {
							text: 'Count',
						},
					},
					legend: {
						show: false,
					},
					fill: {
						opacity: 1,
					},
				},
			};
		},
		computed: {
			configLoaded: function () {
				var self = this;
				return self.config.filter((itemX) =>
					self.loaded
						.map((itemY) => {
							return itemY;
						})
						.includes(itemX.json),
				);
			},
			allRepsLoaded: function () {
				var self = this;
				if (self.loaded.length == 6) {
					return true;
				} else {
					return 'pink';
				}
			},
			dashA1: function () {
				var self = this;
				return self.dashDataA.filter(function (n) {
					return n.Series == 'A1';
				});
			},
			dashA2: function () {
				var self = this;
				return self.dashDataA.filter(function (n) {
					return n.Series == 'A2';
				});
			},
		},
		methods: {
			getSeriesColor: function (index) {
				var self = this;
				return self.chartOptions.colors[index];
			},
			getConfig: function () {
				var self = this;
				$.getJSON('./data/config.json', function (n) {
					self.config = n.queries;
				});
			},
			getData: function () {
				var self = this;
				if (
					location.href.toLowerCase().indexOf('bastest') > -1 ||
					location.href.toLowerCase().indexOf('myenroll') > -1
				) {
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 1,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataA = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataA');
						self.config[0].countRec = self.dashDataA.filter(function (n) {
							return n.Series == 'A1';
						}).length;
						self.config[0].countBill = self.dashDataA.filter(function (n) {
							return n.Series == 'A1' && n.Billable == 'Yes';
						}).length;
						self.config[1].countRec = self.dashDataA.filter(function (n) {
							return n.Series == 'A2';
						}).length;
						self.config[1].countBill = self.dashDataA.filter(function (n) {
							return n.Series == 'A2' && n.Billable == 'Yes';
						}).length;
					});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 2,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataB = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataB');
						self.config[2].countRec = self.dashDataB.length;
					});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 3,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataC = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataC');
						self.config[3].countRec = self.dashDataC.length;
					});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 4,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataD = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataD');
						self.config[4].countRec = self.dashDataD.length;
						self.config[4].countBill = self.dashDataD.filter(function (n) {
							return n.Billable == 'Yes';
						}).length;
					});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 5,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataE = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataE');
						self.config[5].countRec = self.dashDataE.length;
					});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/CobraWebMethod.aspx/GetCovidCOBRAReport',
						data: JSON.stringify({
							report_id: 6,
						}),
						contentType: 'application/json; charset=utf-8',
					}).done(function (e) {
						self.dashDataF = JSON.parse(e.d);
						self.meUpdate();
						self.loaded.push('dashDataF');
						self.config[6].countRec = self.dashDataF.length;
					});
				} else {
					$.getJSON('./data/sample.json', function (e) {
						self.dashDataA = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataA');
						self.config[0].countRec = self.dashDataA.filter(function (n) {
							return n.Series == 'A1';
						}).length;
						self.config[0].countBill = self.dashDataA.filter(function (n) {
							return n.Series == 'A1' && n.Billable == 'Yes';
						}).length;
						self.config[1].countRec = self.dashDataA.filter(function (n) {
							return n.Series == 'A2';
						}).length;
						self.config[1].countBill = self.dashDataA.filter(function (n) {
							return n.Series == 'A2' && n.Billable == 'Yes';
						}).length;
					});
					$.getJSON('data/sample2.json', function (e) {
						self.dashDataB = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataB');
						self.config[2].countRec = self.dashDataB.length;
					});
					$.getJSON('data/sample3.json', function (e) {
						self.dashDataC = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataC');
						self.config[3].countRec = self.dashDataC.length;
					});
					$.getJSON('data/sample4.json', function (e) {
						self.dashDataD = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataD');
						self.config[4].countRec = self.dashDataD.length;
					});
					$.getJSON('data/sample5.json', function (e) {
						self.dashDataE = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataE');
						self.config[5].countRec = self.dashDataE.length;
					});
					$.getJSON('data/sample6.json', function (e) {
						self.dashDataF = e;
					}).done(function () {
						self.meUpdate();
						self.loaded.push('dashDataF');
						self.config[6].countRec = self.dashDataF.length;
					});
				}
			},
			pushConfigCountBill: function (g, h) {
				var self = this;
				self.config.filter(function (n) {
					return n.reportAbbr == g;
				})[0].count = h;
			},
			meUpdate: function () {
				var self = this;
				self.$refs.cobrachart.updateSeries([
					{
						name: 'A1',
						data: [{ x: '', y: self.dashA1.length }],
					},
					{
						name: 'A2',
						data: [{ x: '', y: self.dashA2.length }],
					},
					{
						name: 'B',
						data: [{ x: '', y: self.dashDataB.length }],
					},
					{
						name: 'C',
						data: [{ x: '', y: self.dashDataC.length }],
					},
					{
						name: 'D',
						data: [{ x: '', y: self.dashDataD.length }],
					},
					{
						name: 'E',
						data: [{ x: '', y: self.dashDataE.length }],
					},
					{
						name: 'F',
						data: [{ x: '', y: self.dashDataF.length }],
					},
				]);
			},

			exportCSV: function (report, ReportTitle, ShowLabel) {
				var self = this;
				var dt = new Date();
				var todayDt =
					((dt.getMonth() + 1).toString().length == 1
						? '0' + (dt.getMonth() + 1).toString()
						: dt.getMonth() + 1) +
					'-' +
					(dt.getDate().toString().length == 1
						? '0' + dt.getDate().toString()
						: dt.getDate()) +
					'-' +
					dt.getFullYear();
				var JSONData;
				if (report == 'A1') {
					JSONData = self.dashA1;
				} else if (report == 'A2') {
					JSONData = self.dashA2;
				} else if (report == 2) {
					JSONData = self.dashDataB;
				} else if (report == 3) {
					JSONData = self.dashDataC;
				} else if (report == 4) {
					JSONData = self.dashDataD;
				} else if (report == 5) {
					JSONData = self.dashDataE;
				} else if (report == 6) {
					JSONData = self.dashDataF;
				}
				var arrData =
					typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

				var CSV = '';

				CSV += ReportTitle + '\r\n\n';

				if (ShowLabel) {
					var row = '';
					for (var index in arrData[0]) {
						row += index + ',';
					}

					row = row.slice(0, -1);
					CSV += row + '\r\n';
				}

				for (var i = 0; i < arrData.length; i++) {
					var row2 = '';
					for (var index2 in arrData[i]) {
						row2 += '"' + arrData[i][index2] + '",';
					}

					row2.slice(0, row2.length - 1);
					CSV += row2 + '\r\n';
				}

				if (CSV == '') {
					alert('Invalid data');
					return;
				}

				var fileName = '';
				fileName += ReportTitle.replace(/ /g, '_') + '_' + todayDt;

				var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

				var link = document.createElement('a');
				link.href = uri;
				link.style = 'visibility:hidden';
				link.download = fileName + '.csv';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			},
		},
		created: function () {
			var self = this;

			self.getConfig();
		},
		mounted: function () {
			var self = this;
			self.getData();
		},
	};
</script>
