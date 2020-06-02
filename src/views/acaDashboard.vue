<template>
	<v-container fluid>
		<v-slide-x-reverse-transition>
			<template v-if="reports.length < 6">
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
		<v-row>
			<v-col>
				<acaquicktable
					v-for="(item, index) in reports"
					:key="index"
					:reports="item.details"
					:reporthdr="item.report_group"
					:acctSelection="acctSelection"
					@opendetails="detailsDialog"
				/>
			</v-col>
		</v-row>
		<v-row justify="center">
			<v-dialog v-model="detailDialog" max-width="800px" top>
				<v-card>
					<v-card-title>
						<span class="headline pr-5">{{ detailTitle }}</span>
						<v-spacer></v-spacer>
						<v-btn
							@click="detailDialog = !detailDialog"
							icon
							absolute
							top
							right
						>
							<v-icon>
								mdi-close
							</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text>
						<template v-if="detailDialog">
							<fusionchart
								:chartdata="chartData"
								:chartType="chartType"
								ref="fusionchart"
							/>
						</template>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-row>
	</v-container>
</template>
<style scoped>
	.me-top-right {
		position: absolute;
		top: -15px;
		right: 20px;
	}
</style>
<script>
	import $ from 'jquery';
	import acaquicktable from '@/components/acaquicktable.vue';
	import fusionchart from '@/components/fusionChart.vue';
	export default {
		name: 'acaDashboard',
		props: ['acctSelection'],
		components: {
			acaquicktable,
			fusionchart,
		},
		data: () => ({
			reports: [],
			detailDialog: false,
			detailTitle: '',
			detailLocCnt: null,
			detailEECnt: null,
			chartData: [
				{
					label: 'Affected Locations',
					value: '',
				},
				{
					label: 'Total Locations',
					value: '',
				},
			],
			chartType: '',
		}),
		created: function() {
			this.getData();
		},
		watch: {
			detailsDialog: function() {
				if (!this.detailDialog) {
					this.chartData[0].value = '';
					this.chartData[1].value = '';
				}
			},
		},
		methods: {
			detailsDialog(...args) {
				var [w, x, y, z] = args;
				var self = this;
				this.detailDialog = z;
				this.detailTitle = w;
				this.detailLocCnt = x;
				this.detailEECnt = y;
				self.chartData[0].value = x;
				self.chartData[1].value = y;
			},
			getData: function() {
				var self = this;
				if (
					window.location.href.toLowerCase().indexOf('bastest.com') > -1 ||
					window.location.href.toLowerCase().indexOf('myenroll.com') > -1
				) {
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 1,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 2,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 3,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 4,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 5,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
					$.ajax({
						type: 'POST',
						url:
							'/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport',
						data: JSON.stringify({
							report_id: 6,
						}),
						contentType: 'application/json; charset=utf-8',
					})
						.done(function(n) {
							self.reports.push(JSON.parse(n.d)[0]);
						})
						.fail(function() {
							console.log('fail');
						});
				} else {
					$.getJSON('./data/quickTableSample.json', function(d) {
						self.reports = d.reports;
					});
				}
			},
		},
	};
</script>
