<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div class="stats-page" v-else>
      <div class="row">
        <div class="col-12">
        </div>
        <div class="col-12" style="display: none;">
          <div class="c-stage u-mb-medium">
            <div class="u-p-small u-inline-block u-width-100">
              <div class="stats-float-left">
                <div class="stats-control-field">
                  <datepicker :clear-button="true" v-model="from" placeholder="Выберите дату начала"
                              :input-class="'c-input trigger'" language="ru"
                              :monday-first="true"></datepicker>
                </div>
                <div class="stats-control-delimeter d-text-mute">до</div>
                <div class="stats-control-field">
                  <datepicker :clear-button="true" v-model="to" placeholder="Выберите дату окончания"
                              :input-class="'c-input trigger'" language="ru"
                              :monday-first="true"></datepicker>
                </div>
              </div>
              <div class="stats-float-right">
                <div class="stats-control-delimeter d-text-mute">отдел:</div>
                <div class="c-dropdown dropdown">
                  <button class="c-btn btn-box-shadow has-dropdown dropdown-toggle u-mw-170" id="select-stats" v-html="reports[activeReport] ? reports[activeReport].title : ''" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                  <div class="c-dropdown__menu dropdown-menu dropdown-menu-right" aria-labelledby="select-stats">
                    <div class="c-dropdown__item dropdown-item trigger" v-for="item, index in reports" v-on:click="activeReport = index" v-html="item.title"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div class="row hr-panels-1">
          <div class="col-12 col-md-6 col-xl-3 col-lg-6 d-mb-20" v-for="item, key in reports.hr.topStats">
              <div class="d-card">
                <div class="d-p-20">
                  <div class="stats-col-inner">
                    <div class="stats-col-title d-mb-15">
                      <div v-html="item.title"></div>
                      <div :class="'stats-col-total-value d-color-'+item.color" v-html="reports.hr[key].total" v-if="componentReady"></div>
                      <div class="skeleton-string-xs" v-else></div>
                    </div>
                    <div class="stats-col-subtitle" v-html="item.subtitle"></div>
                    <div class="d-mb-25">
                      <div class="d-progress-wrapper bullet" v-if="componentReady">
                        <div :class="'d-progress d-bg-'+item.color" :style="'width: '+moduleX(reports.hr[key].diff)+'%'"></div>
                      </div>
                      <div class="skeleton-string d-width-100" v-else></div>
                    </div>

                    <div class="stats-col-change">
                      <div >Изменение</div>
                      <div  v-html="renderDiff(reports.hr[key].diff)" ></div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="d-card d-flex">
              <div class="hr-stats-profs-chart">
                <div class="d-p-20 fs-20 d-border-bottom">
                  <div class="stats-col-title">
                    <div>Офисный персонал</div>
                    <div class="d-color-success" v-if="componentReady" v-html="reports.hr.officeWorkers.total"></div>
                    <div class="skeleton-string-xs" v-else></div>
                  </div>
                </div>
                <div class="d-p-20">
                  <div class="echarts-a">
                    <chart class="echarts" :auto-resize="true" :options="reports.hr.charts.professions"></chart>
                  </div>
                </div>
              </div>
              <div class="hr-stats-workmans-chart">
                <div class="d-p-20 fs-20">
                  <div class="stats-col-title">
                    <div>Рабочие</div>
                    <div class="d-color-info" v-html="reports.hr.workmans.total" v-if="componentReady"></div>
                    <div class="skeleton-string-xs" v-else></div>
                  </div>
                </div>
                <div class="echarts-b">
                  <chart  :auto-resize="true" class="echarts" :options="reports.hr.charts.workmanExperiences"></chart>
                </div>
                <div class="d-border-bottom d-border-top d-p-12 d-text-center fs-14">
                    <div class="row d-text-center d-text-semi-mute">
                      <div class="col-12 col-sm-4">
                        <i class="fa fa-circle d-mr-12 d-color-info"></i> До трех лет
                      </div>
                      <div class="col-12 col-sm-4">
                        <i class="fa fa-circle d-mr-12 d-color-warning"></i> Более трех лет
                      </div>
                      <div class="col-12 col-sm-4">
                        <i class="fa fa-circle d-mr-12 d-color-fancy"></i> Более пяти лет
                      </div>
                    </div>
                </div>
                <div class="d-flex flex-grow-1 align-items-center justify-content-center d-text-dark d-text-center">
                  <div class="row d-width-100 d-mw-380">
                    <div class="col-4">
                      <div class="fs-35 d-text-sbold" v-html="reports.hr.workmans.experience_1"></div>
                      <p class="d-text-mute d-text-uppercase u-mb-small fs-14">До трех лет</p>
                      <div class="d-progress-wrapper">
                        <div class="d-progress d-bg-info" :style="'width: '+calculateDiff((reports.hr.workmans.experience_1+reports.hr.workmans.experience_3+reports.hr.workmans.experience_5), reports.hr.workmans.experience_1)+'%'"></div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="fs-35 d-text-sbold" v-html="reports.hr.workmans.experience_5"></div>
                      <p class="d-text-mute u-text-uppercase u-mb-small fs-14">Более трех лет</p>
                      <div class="d-progress-wrapper">
                        <div class="d-progress d-bg-fancy"  :style="'width: '+calculateDiff((reports.hr.workmans.experience_1+reports.hr.workmans.experience_3+reports.hr.workmans.experience_5), reports.hr.workmans.experience_5)+'%'"></div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="fs-35 d-text-sbold" v-html="reports.hr.workmans.experience_3"></div>
                      <p class="d-text-mute u-text-uppercase u-mb-small fs-14">Более пяти лет</p>
                      <div class="d-progress-wrapper">
                        <div class="d-progress d-bg-warning" :style="'width: '+calculateDiff((reports.hr.workmans.experience_1+reports.hr.workmans.experience_3+reports.hr.workmans.experience_5), reports.hr.workmans.experience_3)+'%'"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="hr-stats-period-row">
              <div class="u-color-primary trigger stats-current-period fs-25 d-text-dark2 d-text-sbold" v-html="renderPeriodString()"></div>
              <div class="stats-period-selector">
                <span class="stats-period-item" v-on:click="setMonthPeriod()">За месяц</span>
                <span class="stats-period-item" v-on:click="setWeeksPeriod(2)">За две недели</span>
                <span class="stats-period-item" v-on:click="setWeeksPeriod()">За неделю</span>
                <span class="stats-period-item" v-on:click="setDayPeriod(1)">За вчера</span>
                <span class="stats-period-item" v-on:click="setDayPeriod()">За сегодня</span>
                <span class="stats-period-item" style="display: none;">за период</span>
              </div>
            </div>

          </div>
        </div>
        <div class="stats-row-1 d-flex d-card d-mb-20">

          <div class="col-12 col-lg-4 col-xl-4 d-p-zero stats-panel-col-1">
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Нанято <br/>сотрудников</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                  <div class=" d-color-info" v-html="renderDiff(reports.hr.coworkers.currentPeriod.inc, 1)"></div>
                  </div>
                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Качественных <br/> сотрудников</div>
                    <div class="stats-cell-card-desc">кол-во сотрудников отработавших мин. время</div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-success" v-html="reports.hr.coworkers.currentPeriod.quality_inc"></div>
                  </div>
                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Уволено <br/>сотрудников</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class="d-color-danger" v-html="reports.hr.coworkers.currentPeriod.out"></div>
                  </div>
                </div>
          </div>
          <div class="col-12 col-lg-4 col-xl-4 d-p-zero stats-panel-col-2">
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Нанято <br/>рабочих</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-info" v-html="renderDiff(reports.hr.workmans.currentPeriod.inc, 1)"></div>
                  </div>


                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Качественных <br/>рабочих</div>
                    <div class="stats-cell-card-desc">кол-во рабочих отработавших месяц</div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-success" v-html="reports.hr.workmans.currentPeriod.quality_inc"></div>
                  </div>
                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Уволено <br/>рабочих</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-danger" v-html="reports.hr.workmans.currentPeriod.out"></div>
                  </div>
                </div>
          </div>
          <div class="col-12 col-lg-4 col-xl-4 d-p-zero stats-panel-col-3">
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Нанято <br/>офисного персонала</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-info" v-html="renderDiff(reports.hr.officeWorkers.currentPeriod.inc, 1)"></div>
                  </div>
                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Кол-во <br/>качественных</div>
                    <div class="stats-cell-card-desc">кол-во сотрудников отработавших две недели</div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class=" d-color-success" v-html="reports.hr.officeWorkers.currentPeriod.quality_inc"></div>
                  </div>
                </div>
                <div class="stats-cell-card">
                  <div class="stats-cell-card-left">
                    <div class="stats-cell-card-title">Уволено</div>
                    <div class="stats-cell-card-desc" v-html="renderPeriodString()"></div>
                  </div>
                  <div class="stats-cell-card-right">
                    <div class="d-color-danger" v-html="reports.hr.officeWorkers.currentPeriod.out"></div>
                  </div>

                </div>
              </div>

        </div>


        <div class="d-flex hr-user-stats-results d-mb-20">
          <div class="hr-user-stats-results-left">
            <div class="d-card d-height-100" v-if="hr_ids.length">
              <div class="fs-20 d-p-20 d-mb-10 d-text-dark d-text-sbold">Результаты работы специалистов</div>
              <div>
                <div v-for="hr_id, index in hr_ids">
                  <div class="hr-stat-wrapper" v-if="hrCreators[hr_id]">
                    <div class="hr-stat-list-item">
                      <div class="hr-stat-list-item-left">
                        <div class="avatar avatar-large d-mr-20">
                          <img class="avatar-img" :src="renderUserAvatar(hrCreators[hr_id], '')" @error="renderUserAvatarError($event, { usertype: 'coworker' })">
                        </div>
                        <div class="hr-stat-list-item-user">
                          <div class="fs-25 d-text-sbold d-text-dark d-width-100" v-html="renderUserRealName(hrCreators[hr_id])"></div>
                          <div class="d-text-mute fs-14" v-html="renderUserProfession(hrCreators[hr_id])"></div>
                        </div>
                      </div>
                      <div class="hr-stat-list-item-total fs-25 d-color-success d-text-sbold" v-html="reports.hr.coworkers.statsByUsers[hr_id] ? renderDiff(reports.hr.coworkers.statsByUsers[hr_id].inc, 1) : '-'"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hr-user-stats-results-right">
            <div class="d-card d-p-20">
              <div class="fs-20 d-text-dark d-text-sbold d-mb-20">Эффективность найма <span class="u-text-lowercase" v-html="renderPeriodString()"></span></div>
              <div class="echarts-d">
                <chart :auto-resize="true" class="echarts" :options="reports.hr.charts.hr_calendar"></chart>
              </div>
            </div>
          </div>
        </div>

        <div class="hr-stats-personal-dynamic">
            <div class="d-card d-p-20">
              <div class="fs-20 d-text-sbold">Динамика численности персонала  <span class="u-text-lowercase" v-html="renderPeriodString()"></span></div>
              <div class="echarts-c">
                <chart :auto-resize="true" class="echarts" :options="reports.hr.charts.personal_calendar"></chart>
              </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import Datepicker from 'vuejs-datepicker';
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/chart/pie';
  import 'echarts/lib/component/legend';

  const baseTooltip = { trigger: 'axis', axisPointer: { type: 'shadow' }};
  const baseGrid = { left: '3%', right: '4%', bottom: '3%', containLabel: true, show: false };
  const baseLineStyle = { color: '#40557d' };
  const totalsObject = class {
    constructor(a) {
      this.total = 0;
      this.diff = 0;
      this.prevPeriod = {
        inc: 0,
        out: 0
      };
      this.currentPeriod = {
        inc: 0,
        out: 0,
      };
      this.statsByUsers = {};
      if(a) {
        for(let i = 0; i < a.length; i++) {
          this.prevPeriod[a[i]] = 0;
          this.currentPeriod[a[i]] = 0;
        }
      }
    }
  };
  const workerFields = ['quality_inc'];
  export default {
    extends: Component,
    mixins: [permissionsMixin, commonMixin],
    computed: {
      pageData() {
        return { title: 'Показатели ' +this.reports[this.activeReport].xTitle, metaTitle: 'Показатели ' +this.reports[this.activeReport].xTitle, headerClass: 'u-mb-medium' };
      }
    },
    data() {
      return {
        from: '',
        to: '',
        activeReport: 'hr',
        hrCalendar: [],
        hrCreators: {},
        hr_ids: [],
        professions: [],
        professionsByIds: {},
        loading: false,
        reports: {
          hr: {
            title: 'отдел кадров',
            xTitle: 'отдела кадров',
            topStats: {
              coworkers: { color: 'warning', title: 'Всего сотрудников', subtitle: 'Общее количество сотрудников' },
              officeWorkers: { color: 'success', title: 'Офисные сотрудники', subtitle: 'Количество офисных сотрудников' },
              workmans: { color: 'info', title: 'Рабочие и мастера', subtitle: 'Количество рабочих и мастеров' },
              blackList: { color: 'danger', title: 'В черном списке', subtitle: 'Объем черного списка соискателей' },
            },
            coworkers: new totalsObject(workerFields),
            fired: new totalsObject,
            inc: new totalsObject,
            officeWorkers: new totalsObject(workerFields),
            workmans: new totalsObject(workerFields),
            blackList: new totalsObject,
            charts: {
              hr_calendar: {
                title: { text: '',  subtext: '' },
                tooltip: baseTooltip,
                grid: baseGrid,
                legend: {
                  data: [],
                  left: 66,
                  itemGap: 25
                },
                xAxis: {
                  type: 'category',
                  data: [],
                  axisLabel: {
                    rotate: 90,
                    margin: 15,
                    color: '#9fa6b1',
                  }
                },
                color: this.getChartColors(),
                yAxis: {
                  type: 'value',
                  data: [],
                  axisLine: {
                    lineStyle: baseLineStyle
                  },
                  axisLabel: {
                    color: '#11223e'
                  },
                  onZero: false
                },
                series: []
              },
              // hr_activity_calendar ends
              personal_calendar: {
                title: {
                  text: '',
                  subtext: ''
                },
                tooltip: baseTooltip,
                grid: baseGrid,
                legend: {
                  data: [],
                  left: 66,
                  itemGap: 25
                },
                xAxis: {
                  type: 'category',
                  data: [],
                  boundaryGap: false,
                  axisLabel: {
                    rotate: 90,
                    margin: 15,
                    color: '#9fa6b1',
                  }
                },
                color: ['#1875f0'],
                yAxis: {
                  type: 'value',
                  data: [],
                  axisLine: {
                    lineStyle: baseLineStyle,
                  },
                  axisLabel: {
                    color: '#11223e'
                  },
                  onZero: false
                },
                series: []
              },
              // personal total calendar ends ----------------------------------------------------------------->
              professions: {
                title: {
                  text: '',
                  subtext: ''
                },
                tooltip: baseTooltip,
                legend: {
                  data: [],
                  show: false,
                },
                aria: {
                  show: false
                },
                grid: baseGrid,
                xAxis: {
                  type: 'value',
                  gridIndex: 0,
                  axisLabel: {
                    show: false,
                  },
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: baseLineStyle,
                    onZero: false
                  },
                  splitArea: {
                    show: false
                  },
                  splitLine: {
                    show: false
                  }
                },
                color: '#43be80',
                yAxis: {
                  type: 'category',
                  data: [],
                  axisLine: {
                    lineStyle: baseLineStyle,
                    onZero: false
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    color: '#959595'
                  },

                },
                series: [

                ]
              },
              // professions chart ends ---------------------------------------------------------->
              workmanExperiences: {
                legend: {

                  show: false
                },
                tooltip: {
                  trigger: 'none'
                },
                color: [
                  '#6a07b2',
                  '#fa6800',
                  '#1875f0'],
                series: [
                  {
                    name:'Опыт работы сотрудников',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: true,
                    label: {
                      normal: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        show: false,
                        textStyle: {
                          fontSize: '14',
                          fontWeight: 'bold'
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data:[]
                  }
                ]
              }
              // experience chart ends ----------------------------------------------->
            },
          },
        },
      }
    },
    async mounted() {
      if(!this.isAdmin() && !this.isHr()) {
        this.permissions({
          permissionDenied: true,
        });
        this.redirectHome();
        return;
      }
      this.addEvents();
      await this.setDefaultData();
      this.componentReady = true;
    },
    destroyed() {
      this.dropEvents();
    },
    methods: {
      async setMonthPeriod() {
        let date = new Date();
        let to = (new Date());
        this.to = to;
        date.setDate(date.getDate() - 30);
        this.from = date;
        this.getHrStats();
      },
      setWeeksPeriod(x) {
        x = x ? x : 1;
        let date = new Date();
        let to = (new Date());
        date.setDate(date.getDate() - 7*x);
        this.from = date;
        this.to = to;
        this.getHrStats();
      },
      setDayPeriod(x) {
        x = x ? x : 0;
        let date = new Date();
        date.setDate(date.getDate()-x);
        this.from = date;
        this.to = date;
        this.getHrStats();
      },
      addEvents() {

      },
      dropEvents() {

      },
      renderMinus(a) {
        return a ? '-'+a : a;
      },
      calculateDiff(a, b) {
        if(!b) { return 0; }
        if(!a) { return 0; }
        let c =  parseInt(b/a*100);
        return c > 100 ? 100 : c;
      },
      renderPeriodString() {
        let now = new Date();
        let baseString = 'За период с &nbsp; '+this.renderDateString(this.from)+' &nbsp; по &nbsp; ' +this.renderDateString(this.to);
        let diff = this.to-this.from;
        let diffInDays = Math.floor((diff) / (1000*60*60*24));
        if(diffInDays === 1) { return 'За вчера'; }
        if(diffInDays === 0) { return 'За сегодня'; }
        if(this.to.toDateString() != now.toDateString()) { return baseString; }
        return 'За '+(diffInDays > 1 ? diffInDays :  '')+ ' '+this.rusificate(diffInDays, 'последний', 'последних', 'последних') + ' ' +this.rusificate(diffInDays, 'день', 'дня', 'дней');
      },
      redirectHome() {
        this.$router.push('/messages');
        if(this.isHr(this.$store.state.user)) {
          //this.$router.push('/coworkers/office-workers');
         // return;
        }
      },
      renderDiff(a, b) {
        let p = b ? '' : '%';
        return (a > 0 ? '+' : '') + a +  p;
      },
      buildHrProfessionsChart(data) {
        let total = 0;
        let yAxis = [];
        let series1 =  {
          name: '',
          type: 'bar',
          data: [],
          label: {
            show: true,
            fontSize: 15,
            rich: {

            }
          },

        };
        let series = [series1];
        for(let i = 0; i < data.professions.length; i++) {
          let item = data.professions[i];
          yAxis.push(item.title);
          series1.data.push(item.total);
          total += item.total;
        }
        let professionsByIds = {};
        this.professions = data.professions;
        for(let i = 0; i < data.professions.length; i++) {
          professionsByIds[data.professions[i].profession_id] = data.professions[i];
        }
        this.professionsByIds = professionsByIds;
        this.reports.hr.charts.professions.yAxis.data = yAxis;
        this.reports.hr.charts.professions.series = series;
      },
      async getHrStats() {
        this.loading = true;
        const resp = await $http.post('/stats/hr', { from: this.from.toISOString().split('T')[0], to: this.to.toISOString().split('T')[0] });
        if(resp) {
          if(resp.result) {
            if(!Array.isArray(resp.professions)) { resp.professions = []; }
            this.reports.hr.coworkers = resp.coworkers;
            this.reports.hr.fired = resp.fired;
            this.reports.hr.blackList = resp.blackList;
            this.reports.hr.inc = resp.inc;
            this.reports.hr.workmans = resp.workmans;
            this.reports.hr.officeWorkers = resp.officeWorkers;
            this.hrCalendar = resp.day_series;
            this.hrCreators = resp.creators;
            this.hr_ids = resp.hr_ids;
            this.reports.hr.charts.workmanExperiences.series[0].data = [
              {value: resp.workmans.experience_1, name:'До трех лет'},
              {value: resp.workmans.experience_3, name:'Более трех лет'},
              {value: resp.workmans.experience_5, name:'Более пяти лет'},
            ];
            this.buildHrProfessionsChart(resp);
            this.buildBaseHrCalendar();
          } else {
            this.alert(resp.display);
          }
        }
        this.loading = false;
      },
      verticalLabelOption() {
        let labelOption = {
          normal: {
            show: false,
          },
        };
        return labelOption;
      },
      buildBaseHrCalendar() {
        let series = [];
        let legend = [];
        let seriesCls = {
          name: '',
          type: 'bar',
          data: [],
          label: this.verticalLabelOption(),
        };
        let totalSeries = JSON.parse(JSON.stringify(seriesCls));
        let personalSeries = JSON.parse(JSON.stringify(seriesCls));
        personalSeries.type = 'line';
        personalSeries.areaStyle = {};
        personalSeries.smooth = true;
        let name = 'Общий показатель'; //'Общий показатель';
        totalSeries.name = name;
        legend.push(name);
        let xaxis = [];
        let otherLegendPushed = false;
        let pushedIds = [];
        if(this.hrCalendar) {
          for(let i = 0; i < this.hrCalendar.length; i++) {
            let row = this.hrCalendar[i];
            xaxis.push(row.day);
            for(let prop in row.statsByUsers) {
              if(prop === 'other') {
                if(!otherLegendPushed) {
                  otherLegendPushed = 1;
                  legend.push('Другие пользователи');
                }
              } else {
                if(pushedIds.indexOf(prop) === -1) {
                  pushedIds.push(prop);
                  let name = this.renderUserRealName(this.hrCreators[prop]);
                  legend.push(name);
                }
              }
              // ---------------------
            }
          }
        }
        let hrSeriesObjects = [];
        let hrSeriesByHrs = {
          other: {
            name: 'Другие пользователи',
            type: 'bar',
            data: [],
            label: this.verticalLabelOption(),
          }
        };
        hrSeriesObjects.push(hrSeriesByHrs.other);
        for(let i = 0; i < this.hr_ids.length; i++) {
          let newSeries = JSON.parse(JSON.stringify(seriesCls));
          newSeries.name = this.renderUserRealName(this.hrCreators[this.hr_ids[i]]);
          hrSeriesByHrs[this.hr_ids[i]] = newSeries;
          hrSeriesObjects.push(newSeries);
        }


        for(let i = 0; i < this.hrCalendar.length; i++) {
          let row = this.hrCalendar[i];
          totalSeries.data.push({
            value: row.stats.inc,
          });
          personalSeries.data.push({
            value: row.stats.on_work
          });
          for(let prop in hrSeriesByHrs) {
            if(row.statsByUsers[prop]) {
              hrSeriesByHrs[prop].data.push(row.statsByUsers[prop].inc);
            } else {
              hrSeriesByHrs[prop].data.push(0);
            }
          }
        }
        series.push(totalSeries);
        series = series.concat(hrSeriesObjects);
        // set hr_calendar
        this.reports.hr.charts.hr_calendar.legend.data = legend;
        this.reports.hr.charts.hr_calendar.xAxis.data = xaxis;
        this.reports.hr.charts.hr_calendar.series = series;
        // set personal_calendar
        this.reports.hr.charts.personal_calendar.xAxis.data = xaxis;
        this.reports.hr.charts.personal_calendar.series = personalSeries;
      },
      getChartColors() {
        return ['#1875f0',
          '#f7396b',
        '#339966',
          '#fa6800',
        '#6a07b2',
        '#11223e'];
      },
      async setDefaultData() {
       await this.setMonthPeriod();
      }

    },
    components: {
      Datepicker, chart: ECharts  //GChart
    }
  }
</script>
