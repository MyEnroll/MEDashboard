<template>
	<v-container fluid class="fill-height">
		<v-row>
			<v-col cols="12" md="4">
				<v-menu
					ref="dateMenu"
					:close-on-content-click="false"
					:close-on-click="false"
					transition="scale-transition"
					offset-y
					max-width="290px"
					min-width="290px"
					v-model="rangeMenu"
					:return-value.sync="dateRange"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateRangeText"
							label="Date range"
							prepend-icon="mdi-calendar"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="dateRange" no-title>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="rangeMenu = false"
							>Cancel</v-btn
						>
						<v-btn
							text
							color="primary"
							@click="getSample(dateRangeText1, dateRangeText2)"
							>OK</v-btn
						>
					</v-date-picker>
				</v-menu>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
			<v-col cols="12" class="headline mt-3">
				<v-toolbar flat dense>
					<v-toolbar-title>Daily Performance</v-toolbar-title>
				</v-toolbar>
			</v-col>
			<v-col cols="12" md="7">
				<v-card :loading="initLoading || dlProgress > 0" min-height="450">
					<v-card-text>
						<v-overlay :value="initLoading" absolute>
							<v-progress-circular
								:indeterminate="dlProgress == 0"
								:rotate="-90"
								size="72"
								:value="dlProgress"
								>{{ dlProgress }}</v-progress-circular
							>
						</v-overlay>
						<fusioncharts
							key="loaded"
							@dataplotClick="openDetails"
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
			<v-col cols="12" md="5">
				<v-card min-height="450" :loading="initLoading || dlProgress > 0">
					<v-card-text>
						<v-overlay :value="initLoading" absolute>
							<v-progress-circular
								:indeterminate="dlProgress == 0"
								:rotate="-90"
								size="72"
								:value="dlProgress"
								>{{ dlProgress }}</v-progress-circular
							>
						</v-overlay>
						<fusioncharts
							:type="spread.type"
							:width="spread.width"
							:height="spread.height"
							:dataFormat="spread.dataFormat"
							:dataSource="spread.dataSource"
						></fusioncharts>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-slide-x-transition mode="out-in">
			<template v-if="sample.length > 0">
				<v-row key="metrics">
					<v-col cols="12" class="headline mt-3">
						<v-toolbar dense flat>
							<v-toolbar-title
								>Claims Processed between {{ startDate }} and
								{{ endDate }}</v-toolbar-title
							>
						</v-toolbar>
					</v-col>
					<v-col
						cols="12"
						md="4"
						sm="6"
						v-for="item in procTotalsProc"
						:key="item.label"
					>
						<v-card @click="rangeDetailShow(e, item.label)">
							<v-card-title>
								<span>{{ item.label }}</span>
								<v-spacer></v-spacer>
								<v-avatar size="36" :color="retColor(item.label)" dark>
									<v-icon dark>mdi-account-circle</v-icon>
								</v-avatar>
							</v-card-title>
							<v-card-text
								class="text-center pa-5 display-md-2 display-1 font-weight-light"
								>{{ numberWithCommas(item.value) }}</v-card-text
							>
						</v-card>
					</v-col>
				</v-row>
			</template>
		</v-slide-x-transition>
		<v-dialog v-model="detailPop" max-width="750">
			<v-card>
				<v-card-title :style="'background:' + selProcColor" class="white--text">
					<span>{{ selProcDate }}</span>
					<v-spacer></v-spacer>
					<v-btn icon dark @click="detailPop = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-subtitle
					:style="'background:' + selProcColor"
					class="white--text"
				>
					{{ selProcDtl }}
				</v-card-subtitle>
				<v-card-text style="height: calc(100vh - 250px)">
					<v-fade-transition mode="out-in" duration="200">
						<template v-if="detail.dataSource.data.length == 0">
							<v-container class="fill-height">
								<v-row justify="center" align="center">
									<v-col class="text-center">
										<v-progress-circular
											width="10"
											indeterminate
											size="100"
											:color="selProcColor"
										></v-progress-circular>
										<h4 class="text-h4">Loading</h4>
									</v-col>
								</v-row>
							</v-container>
						</template>
						<template v-else>
							<fusioncharts
								key="hourly"
								:type="detail.type"
								:width="detail.width"
								:height="detail.height"
								:dataFormat="detail.dataFormat"
								:dataSource="detail.dataSource"
							></fusioncharts>
						</template>
					</v-fade-transition>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-dialog v-model="rangeDetailPop" max-width="750">
			<v-card>
				<v-card-title :style="'background:' + selProcColor" class="white--text">
					<span>{{ selProcDtl }}</span>
					<v-spacer></v-spacer>
					<v-btn icon dark @click="rangeDetailPop = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<fusioncharts
						:type="rangeDetail.type"
						:width="rangeDetail.width"
						:height="rangeDetail.height"
						:dataFormat="rangeDetail.dataFormat"
						:dataSource="rangeDetail.dataSource"
					></fusioncharts>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>
<style>
	g[class*='plot-group'] path:not([stroke='#ffc533']) {
		cursor: pointer;
	}
</style>
<script>
	import Vue from 'vue';
	import VueFusionCharts from 'vue-fusioncharts';
	import FusionCharts from 'fusioncharts';
	import Column2D from 'fusioncharts/fusioncharts.charts';
	import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
	import _ from 'lodash';
	import axios from 'axios';

	Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

	export default {
		name: 'fsaProcessing',
		watch: {
			detailPop() {
				var self = this;
				if (!self.detailPop) {
					self.selProcDtl = '';
					self.selProcDate = '';
					self.detail.dataSource.data = [];
					self.detail.type = '';
				}
			},
			procTotalsProc() {
				var self = this;
				self.spread.dataSource.data = self.procTotalsProc;
			},

			dates() {
				var self = this;
				self.setCategories(self.dates);
			},
			theme() {
				if (this.theme) {
					this.timeline.dataSource.chart.bgColor = '#1e1e1e';
					this.timeline.dataSource.chart.toolTipBgColor = '#1e1e1e';
					this.timeline.dataSource.chart.baseFontColor = '#ffffff';
					this.spread.dataSource.chart.bgColor = '#1e1e1e';
					this.spread.dataSource.chart.toolTipBgColor = '#1e1e1e';
					this.spread.dataSource.chart.baseFontColor = '#ffffff';
					this.spread.dataSource.chart.labelFontColor = '#ffffff';
					this.spread.dataSource.chart.centerLabelColor = '#ffffff';
					this.detail.dataSource.chart.bgColor = '#1e1e1e';
					this.detail.dataSource.chart.toolTipBgColor = '#1e1e1e';
					this.detail.dataSource.chart.baseFontColor = '#ffffff';
				} else {
					this.timeline.dataSource.chart.bgColor = '#ffffff';
					this.timeline.dataSource.chart.toolTipBgColor = '#ffffff';
					this.timeline.dataSource.chart.baseFontColor = '#1e1e1e';
					this.spread.dataSource.chart.bgColor = '#ffffff';
					this.spread.dataSource.chart.toolTipBgColor = '#ffffff';
					this.spread.dataSource.chart.baseFontColor = '#1e1e1e';
					this.spread.dataSource.chart.labelFontColor = '#1e1e1e';
					this.spread.dataSource.chart.centerLabelColor = '#1e1e1e';
					this.detail.dataSource.chart.bgColor = '#ffffff';
					this.detail.dataSource.chart.toolTipBgColor = '#ffffff';
					this.detail.dataSource.chart.baseFontColor = '#1e1e1e';
				}
			},
			sample() {
				var self = this;
				self.setChartData();
			},
		},
		data: () => ({
			rangeDetailPop: false,
			rangeMenu: false,
			selProcDtl: '',
			selProcDate: '',
			selProcArr: [],
			selProcColor: '',
			detailPop: false,
			clFilter: '',
			perPage: 10,
			initLoading: false,
			queryLoad: false,
			dlProgress: 0,
			dateRange: [],
			sample: [],
			processors: ['Paulette', 'Chau', 'Kaitlyn'],
			spread: {
				type: '',
				width: '100%',
				height: '450',
				dataFormat: 'json',
				dataSource: {
					chart: {
						animation: '1',
						defaultAnimation: '1',
						bgColor: '#ffffff',
						baseFontColor: '#1e1e1e',
						labelFontColor: '#1e1e1e',
						showLabels: '0',
						showpercentvalues: '1',
						defaultcenterlabel: 'Claims Processed',
						decimals: '1',
						plottooltext:
							'<b>$percentValue</b> of claims were processed by <b>$label</b>',
						centerlabel: 'Claims Processed: $value',
						theme: 'fusion',
					},
					data: [],
				},
			},
			timeline: {
				type: '',
				width: '100%',
				height: '450',
				dataFormat: 'json',
				dataSource: {
					chart: {
						animation: '1',
						defaultAnimation: '1',
						bgColor: '#ffffff',
						baseFontColor: '#1e1e1e',
						yaxisname: 'Claims Processed',
						showhovereffect: '1',
						showLabels: '1',
						drawcrossline: '1',
						labelDisplay: 'rotate',
						slantLabel: '1',
						labelStep: 2,
						plottooltext:
							'<div style="display: flex;justify-content:space-between;width:100px"><b>$dataValue</b><span>$seriesName</span></div>',
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
			detail: {
				type: 'bar2d',
				width: '100%',
				height: '90%',
				dataFormat: 'json',
				dataSource: {
					chart: {
						yaxisname: 'Claims Processed',
						aligncaptionwithcanvas: '0',
						plottooltext:
							'<b>$dataValue</b> Claims processed during the <b>$label</b> hour',
						theme: 'fusion',
					},
					data: [],
				},
			},
			rangeDetail: {
				type: 'column2d',
				width: '100%',
				height: '550',
				dataFormat: 'json',
				dataSource: {
					chart: {
						yaxisname: 'Claims Processed',
						aligncaptionwithcanvas: '0',
						plottooltext: '<b>$dataValue</b> Claims processed on <b>$label</b>',
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
		}),
		created: function () {
			var self = this;
			var dt = new Date();
			var dtSub = dt.setDate(dt.getDate() - 10);
			var dtLess = new Date(dtSub).toISOString().substr(0, 10);
			var dtForm = new Date().toISOString().substr(0, 10);
			self.dateRange = [dtLess, dtForm];

			if (this.theme) {
				this.timeline.dataSource.chart.bgColor = '#1e1e1e';
				this.timeline.dataSource.chart.toolTipBgColor = '#1e1e1e';
				this.timeline.dataSource.chart.baseFontColor = '#ffffff';
				this.spread.dataSource.chart.bgColor = '#1e1e1e';
				this.spread.dataSource.chart.toolTipBgColor = '#1e1e1e';
				this.spread.dataSource.chart.baseFontColor = '#ffffff';
				this.spread.dataSource.chart.labelFontColor = '#ffffff';
				this.spread.dataSource.chart.centerLabelColor = '#ffffff';
				this.detail.dataSource.chart.bgColor = '#1e1e1e';
				this.detail.dataSource.chart.toolTipBgColor = '#1e1e1e';
				this.detail.dataSource.chart.baseFontColor = '#ffffff';
			} else {
				this.timeline.dataSource.chart.bgColor = '#ffffff';
				this.timeline.dataSource.chart.toolTipBgColor = '#ffffff';
				this.timeline.dataSource.chart.baseFontColor = '#1e1e1e';
				this.spread.dataSource.chart.bgColor = '#ffffff';
				this.spread.dataSource.chart.toolTipBgColor = '#ffffff';
				this.spread.dataSource.chart.baseFontColor = '#1e1e1e';
				this.spread.dataSource.chart.labelFontColor = '#1e1e1e';
				this.spread.dataSource.chart.centerLabelColor = '#1e1e1e';
				this.detail.dataSource.chart.bgColor = '#ffffff';
				this.detail.dataSource.chart.toolTipBgColor = '#ffffff';
				this.detail.dataSource.chart.baseFontColor = '#1e1e1e';
			}
		},
		mounted: function () {
			var self = this;
			self.getSample(self.dateRangeText1, self.dateRangeText2);
		},
		computed: {
			dateRangeText1() {
				var self = this;
				if (self.dateRange.length > 0) {
					return (
						self.dateRange[0].substr(5, 2) +
						'/' +
						self.dateRange[0].substr(8, 2) +
						'/' +
						self.dateRange[0].substr(0, 4)
					);
				} else {
					return '';
				}
			},
			dateRangeText2() {
				var self = this;
				if (self.dateRange.length > 1) {
					return (
						self.dateRange[1].substr(5, 2) +
						'/' +
						self.dateRange[1].substr(8, 2) +
						'/' +
						self.dateRange[1].substr(0, 4)
					);
				} else {
					return '';
				}
			},
			dateRangeText() {
				var self = this;
				if (self.dateRange[1] == undefined) {
					return [];
				} else {
					return self.dateRangeText1 + ' ~ ' + self.dateRangeText2;
				}
			},
			startDate() {
				var self = this;
				return (
					self.dateRange[0].substr(5, 2) +
					'/' +
					self.dateRange[0].substr(8, 2) +
					'/' +
					self.dateRange[0].substr(0, 4)
				);
			},
			endDate() {
				var self = this;
				if (self.dateRange.length > 1) {
					return (
						self.dateRange[1].substr(5, 2) +
						'/' +
						self.dateRange[1].substr(8, 2) +
						'/' +
						self.dateRange[1].substr(0, 4)
					);
				} else {
					return '';
				}
			},
			chau() {
				var self = this;
				return {
					seriesname: 'Chau',
					anchorBgColor: '#5D62B5',
					data: self.procNum.map(function (n) {
						return {
							value: n.chau.toString(),
						};
					}),
				};
			},
			kaitlyn() {
				var self = this;
				return {
					seriesname: 'Kaitlyn',
					anchorBgColor: '#29C3BE',
					data: self.procNum.map(function (n) {
						return {
							value: n.kaitlyn.toString(),
						};
					}),
				};
			},
			paulette() {
				var self = this;
				return {
					seriesname: 'Paulette',
					anchorBgColor: '#F2726F',
					data: self.procNum.map(function (n) {
						return {
							value: n.paulette.toString(),
						};
					}),
				};
			},
			total() {
				var self = this;
				return {
					seriesname: 'Total',
					anchorBgColor: '#ffc533',
					data: self.procNum.map(function (n) {
						return {
							value: n.total.toString(),
						};
					}),
				};
			},

			procNum() {
				var self = this;
				return _.sortBy(
					_.map(_.countBy(self.sample, 'ADD_DATE_SIMPLIFIED'), (val, key) => ({
						date: key,
						total: val,
						chau: self.sample.filter(function (a) {
							return a.LOCKED_USERID == 'LeCha' && a.ADD_DATE_SIMPLIFIED == key;
						}).length,
						kaitlyn: self.sample.filter(function (a) {
							return (
								a.LOCKED_USERID == 'IncKai' && a.ADD_DATE_SIMPLIFIED == key
							);
						}).length,
						paulette: self.sample.filter(function (a) {
							return (
								a.LOCKED_USERID == 'PauPry' && a.ADD_DATE_SIMPLIFIED == key
							);
						}).length,
					})),
					'date',
				);
			},

			dates() {
				var self = this;
				return _.uniq(
					_.map(
						self.sample.map(function (n) {
							return (
								n.ADD_DATE_SIMPLIFIED.substr(5, 2) +
								'/' +
								n.ADD_DATE_SIMPLIFIED.substr(8, 2) +
								'/' +
								n.ADD_DATE_SIMPLIFIED.substr(0, 4)
							);
						}),
					),
				).sort();
			},
			theme() {
				return this.$store.getters.darkTheme;
			},
			procTotalsProc() {
				var self = this;
				return self.procTotals.filter(function (n) {
					return n.label != 'Total';
				});
			},
			procTotals() {
				var self = this;
				return self.timeline.dataSource.dataset
					.map(function (n) {
						return n.seriesname;
					})
					.map(function (n) {
						var x = self.timeline.dataSource.dataset.filter(function (m) {
							return m.seriesname == n;
						})[0];

						return {
							label: n,
							value: _.sumBy(x.data, function (l) {
								return Number(l.value);
							}),
							color: x.anchorBgColor,
						};
					});
			},
		},
		methods: {
			rangeDetailShow(e, r) {
				var self = this;
				self.rangeDetailPop = true;
				self.selProcDtl = r;
				self.selProcDate = e.data.categoryLabel;
				self.selProcColor = self.retColor(r);
				self.detailPop = true;
				var selDt = new Date(e.data.categoryLabel).toISOString().substr(0, 10);
				var proc =
					e.data.datasetName == 'Chau'
						? 'LeCha'
						: e.data.datasetName == 'Kaitlyn'
						? 'IncKai'
						: e.data.datasetName == 'Paulette'
						? 'PauPry'
						: 'Total';

				setTimeout(function () {
					self.detail.dataSource.data = _.sortBy(
						_.uniqWith(
							self.sample
								.filter(function (a) {
									return (
										new Date(a.ADD_DATE_TIME).toISOString().substr(0, 10) ==
										selDt
									);
								})
								.map(function (n) {
									return {
										label:
											Number(n.ADD_DATE_TIME.substr(11, 2)) == 12
												? Number(n.ADD_DATE_TIME.substr(11, 2)) + ':00pm'
												: Number(n.ADD_DATE_TIME.substr(11, 2)) > 11
												? Number(n.ADD_DATE_TIME.substr(11, 2)) - 12 + ':00pm'
												: Number(n.ADD_DATE_TIME.substr(11, 2)) + ':00am',
										sortBy: n.ADD_DATE_TIME.substr(11, 2),
										color: self.retColor(e.data.datasetName),
										value: self.sample.filter(function (r) {
											return (
												r.LOCKED_USERID == proc &&
												r.ADD_DATE_SIMPLIFIED.substr(0, 10) == selDt &&
												n.ADD_DATE_TIME.substr(11, 2) ==
													r.ADD_DATE_TIME.substr(11, 2)
											);
										}).length,
									};
								}),
							_.isEqual,
						),
						'sortBy',
					);
					setTimeout(function () {
						self.detail.type = 'bar2d';
					}, 1);
				}, 250);
			},
			openDetails(e) {
				var self = this;
				console.log(e);
				self.selProcDtl = e.data.datasetName;
				self.selProcDate = e.data.categoryLabel;
				self.selProcColor = self.retColor(e.data.datasetName);
				self.detailPop = true;
				var selDt = new Date(e.data.categoryLabel).toISOString().substr(0, 10);
				var proc =
					e.data.datasetName == 'Chau'
						? 'LeCha'
						: e.data.datasetName == 'Kaitlyn'
						? 'IncKai'
						: e.data.datasetName == 'Paulette'
						? 'PauPry'
						: 'Total';

				setTimeout(function () {
					self.detail.dataSource.data = _.sortBy(
						_.uniqWith(
							self.sample
								.filter(function (a) {
									return (
										new Date(a.ADD_DATE_TIME).toISOString().substr(0, 10) ==
										selDt
									);
								})
								.map(function (n) {
									return {
										label:
											Number(n.ADD_DATE_TIME.substr(11, 2)) == 12
												? Number(n.ADD_DATE_TIME.substr(11, 2)) + ':00pm'
												: Number(n.ADD_DATE_TIME.substr(11, 2)) > 11
												? Number(n.ADD_DATE_TIME.substr(11, 2)) - 12 + ':00pm'
												: Number(n.ADD_DATE_TIME.substr(11, 2)) + ':00am',
										sortBy: n.ADD_DATE_TIME.substr(11, 2),
										color: self.retColor(e.data.datasetName),
										value: self.sample.filter(function (r) {
											return (
												r.LOCKED_USERID == proc &&
												r.ADD_DATE_SIMPLIFIED.substr(0, 10) == selDt &&
												n.ADD_DATE_TIME.substr(11, 2) ==
													r.ADD_DATE_TIME.substr(11, 2)
											);
										}).length,
									};
								}),
							_.isEqual,
						),
						'sortBy',
					);
					setTimeout(function () {
						self.detail.type = 'bar2d';
					}, 1);
				}, 250);
			},
			retColor(r) {
				var self = this;
				return self.timeline.dataSource.dataset.filter(function (n) {
					return n.seriesname == r;
				})[0].anchorBgColor;
			},
			procName(r) {
				switch (r) {
					case 'LeCha':
						return 'Chau';
					case 'IncKai':
						return 'Kaitlyn';
					case 'PauPry':
						return 'Paulette';
				}
			},
			numberWithCommas: function (x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			},
			formatDate(date) {
				if (!date) return null;

				const [year, month, day] = date.split('-');
				return `${month}/${day}/${year}`;
			},
			getSample(r, s) {
				var self = this;
				self.$refs.dateMenu.save(self.dateRange);
				self.initLoading = true;
				self.dlProgress = 0;
				axios
					.post(
						'/web_projects/MyEnrollWebService/FSAMetricWebMethod.aspx/GET_FSA_PaperClaim_Metrics',
						{
							begin_date: r,
							end_date: s,
						},
						{
							onDownloadProgress: function (downloadEvent) {
								self.dlProgress = Math.round(
									(downloadEvent.loaded / downloadEvent.total) * 100,
								);
							},
						},
					)
					.then(function (response) {
						self.sample = JSON.parse(response.data.d);
						setTimeout(function () {
							self.dlProgress = 0;
							self.initLoading = false;
						}, 1000);
					})
					.catch(function () {
						self.dlProgress = 0;
						self.initLoading = false;
						alert('error getting data');
					});
			},
			setChartData() {
				var self = this;
				self.timeline.type = '';
				self.spread.type = '';
				self.timeline.dataSource.dataset = [
					self.chau,
					self.kaitlyn,
					self.paulette,
					self.total,
				];
				self.timeline.type = 'msspline';
				self.spread.type = 'doughnut2d';
			},
			setCategories(r) {
				var self = this;
				self.timeline.dataSource.categories[0].category = [];
				r.forEach(function (n) {
					self.timeline.dataSource.categories[0].category.push({ label: n });
				});
			},
			exportCSV: function () {
				var self = this;
				var ShowLabel = true;
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
				var arrData =
					typeof self.sample != 'object'
						? JSON.parse(self.sample)
						: self.sample;
				var CSV = '';
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
				fileName += 'ClaimsProcessed' + '_' + todayDt;
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
	};
</script>
