<template>
  <div>
    <div>
      <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
      <div :class="'object-page '+(object.object_id ? '' : 'empty-object')" v-else>
        <div class="c-card u-p-zero u-border-zero u-mb-medium">
          <div class="page-top-toolbar u-border-bottom">
            <div class="page-top-toolbar-left">
              <div class="page-toolbar-nav-item">
                <i class="fa fa-home u-mr-small"></i><span v-html="object.object_id ? object.relatedEstimate.address : 'Новый объект'"></span>
              </div>
              <div class="page-toolbar-nav-item">
                <i class="fa fa-angle-double-right u-mr-xsmall"></i> <span v-html="tabs[mode].title"></span>
              </div>
            </div>
            <div class="page-top-toolbar-right">
              <router-link :to="link(item.mode)" :key="item.mode" v-for="item in tabs">
                <i :class="'fa '+item.icon" :title="item.title"></i>
              </router-link>
            </div>
          </div>
        </div>
        <div class="container-fluid" v-if="mode === 'settings'">
          <div class="row">
            <div class="col-12">
              <div class="c-stage u-mb-small u-relative">

                <div :class="'obj-settings-row u-relative '+(!selectEstimateMode ? ' n-bg-gray' : '')">
                  <div class="obj-settings-col-left obj-settings-col u-border-right">
                    <div class="obj-settings-col-inner">
                    <div class="u-height-100">
                      <div class="u-ph-medium">

                        <div class="c-progress u-mt-medium u-mb-large c-progress--medium">
                          <div class="c-progress__bar" :style="'width:' +(calculateSettingsWidth())+'%'"></div>
                        </div>
                        <div class="object-settings-steps">
                          <div :class="'step trigger step-'+(index)+' '+ (index === settingsStep ? ' active' : '')+(!allowEditClientStep() && index !== 'object' ? ' locked' : '')" v-on:click="setSettingsStep(index)" v-for="step, index in tabs.settings.steps">
                            <div class="step-segment">
                              <i :class="'step-icon fa '+step.icon" ></i>
                            </div>
                            <div class="step-content">
                              <span class="u-text-bold"  v-html="step.title"></span>
                            </div>
                          </div>
                          <div  :class="'step trigger '+(!allowModifyObject()  ? ' locked' : '')" v-on:click="modifyObject()">
                            <div class="step-segment">
                              <i class="step-icon fa fa-check"></i>
                            </div>
                            <div class="step-content">
                              <span class="u-text-bold" v-html="e_object.object_id ? 'Сохранить объект' : 'Создать объект'"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div class="obj-settings-col obj-settings-col-right">
                    <div class="obj-settings-col-right-inner obj-settings-col-inner u-height-100">
                      <div v-if="settingsStep === 'object'">
                        <div class="u-relative" v-if="!selectEstimateMode">
                          <div class="settings-center-div">
                            <div class="row">
                              <div class="col-12 col-xl-8">
                                <div class="desk-card stacked u-mb-medium">
                                  <div class="desk-card-title">
                                    Данные объекта
                                    <div class="desk-card-icon" >
                                      <div v-if="!e_object.object_id">
                                        <div v-if="!allowEditClientStep()">

                                        </div>
                                        <div v-else></div>
                                      </div>
                                      <div v-else>
                                        <img @click="editObjectMode = !editObjectMode" v-if="!editObjectMode"  src="/static/images/edit-pencil.png" class="top@1@5 trigger">
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="editObjectMode">
                                    <div v-if="editObjectMode" class="desk-card-body desk-card-body-3">
                                      <div class="row u-mb-small row-object-form">
                                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                          <label class="c-field__label">Тип дома:</label>
                                        </div>
                                        <div class="col-12 col-sm-8 col-xl-9">
                                          <div class="n-field-result">
                                            <nselect2 v-model="e_object.relatedEstimate.building_type" id="select-bt" :options="$store.state.buildingTypes"></nselect2>
                                            <div class="status-ball status-ball-success"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- bt -->
                                      <div class="row u-mb-small row-object-form">
                                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                          <label class="c-field__label">Тип помещения:</label>
                                        </div>
                                        <div class="col-12 col-sm-8 col-xl-9">
                                          <div class="n-field-result">
                                            <nselect2 v-model="e_object.relatedEstimate.object_type"  id="select-ot" :options="$store.state.objectTypes"></nselect2>
                                            <div class="status-ball status-ball-success"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- ot -->
                                      <div class="row u-mb-small row-object-form">
                                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                          <label class="c-field__label">Адрес:</label>
                                        </div>
                                        <div class="col-12 col-sm-8 col-xl-9">
                                          <div class="n-field-result">
                                            <input type="text" placeholder="Укажите адрес" class="c-input" v-model="e_object.relatedEstimate.address">
                                            <div :class="'status-ball '+((!isFieldEmpty(e_object.relatedEstimate.address) && e_object.relatedEstimate.address.length > 6) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- address -->
                                      <div class="row u-mb-small row-object-form">
                                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                          <label class="c-field__label">Период работ:</label>
                                        </div>
                                        <div class="col-12 col-sm-8 col-xl-9">
                                          <div class="n-field-result">
                                            <div class="row">
                                              <div class="col-12 col-md-6">
                                                <datepicker :clear-button="true" v-model="e_object.start_date" placeholder="Выберите дату начала работ"
                                                            input-class="c-input trigger" language="ru"
                                                            :monday-first="true"></datepicker>
                                              </div>
                                              <div class="col-12 col-md-6">
                                                <div class="prev-def">-</div>
                                                <datepicker :clear-button="true" v-model="e_object.finish_date" placeholder="Выберите дату сдачи объекта"
                                                            input-class="c-input trigger" language="ru"
                                                            :monday-first="true"></datepicker>
                                              </div>
                                            </div>
                                            <div :class="'status-ball '+((isCorrectDate(e_object.start_date, 'start_date') && (isCorrectDate(e_object.finish_date, 'finish_date'))) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row u-mb-small row-object-form" v-if="e_object.object_id">
                                        <div class="col-12 col-sm-4 col-xl-3">&nbsp;</div>
                                        <div class="col-12 col-sm-8 col-xl-9">
                                          <div class="n-field-result">
                                            <div class=" u-text-right">
                                              <button class="c-btn" v-on:click="editObjectMode = !editObjectMode">сохранить</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="desk-card-body desk-card-body-3" v-else>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Дом</div>
                                      <div class="desk-card-item-val">
                                        <div v-html="$store.state.buildingTypes[e_object.relatedEstimate.building_type].title"></div>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Объект</div>
                                      <div class="desk-card-item-val">
                                        <div v-html="$store.state.objectTypes[e_object.relatedEstimate.object_type].title"></div>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Адрес</div>
                                      <div class="desk-card-item-val">
                                        <div v-html="e_object.relatedEstimate.address"></div>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Дата начала работ</div>
                                      <div class="desk-card-item-val">
                                        <div v-html="renderSimpleDate(e_object.start_date)"></div>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Дата окончания работ</div>
                                      <div class="desk-card-item-val">
                                        <div v-html="renderSimpleDate(e_object.finish_date)"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="desk-card stacked u-mb-large">
                                  <div class="desk-card-title">
                                    Помещения
                                    <div class="desk-card-icon"><img src="/static/images/house-gray.png" /></div>
                                  </div>
                                  <div class="desk-card-body ">
                                    <div v-for="room in e_object.relatedEstimate.objects_list" class="desk-card-item">
                                      <div class="desk-card-item-key" v-html="room.title" ></div>
                                      <div class="desk-card-item-val"><span v-html="room.square"></span> м<sup>2</sup></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 col-xl-4">
                                <div class="desk-card stacked u-mb-large">
                                  <div class="desk-card-title">
                                    Рассчёты
                                    <div class="desk-card-icon"><img src="/static/images/lamp.png" /></div>
                                  </div>
                                  <div class="desk-card-body ">
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Общая площадь</div>
                                      <div class="desk-card-item-val">
                                        <span  v-html="e_object.relatedEstimate.total_square"></span> м<sup>2</sup>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Чистовые материалы</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.wrms.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Черновые материалы</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.brms.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Расходные материалы</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.materials.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Транспортные расходы</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.fare.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key">Уборка мусора</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.garbage.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div v-if="e_object.relatedEstimate.discount">
                                      <div class="desk-card-item">
                                        <div class="desk-card-item-key">Скидка</div>
                                        <div class="desk-card-item-val" v-html="e_object.relatedEstimate.discount + ' %'"></div>
                                      </div>
                                    </div>
                                    <div class="desk-card-item">
                                      <div class="desk-card-item-key" >Стоимость работ</div>
                                      <div class="desk-card-item-val" v-html="e_object.relatedEstimate.totals.jobs.toLocaleString() + ' р.'"></div>
                                    </div>
                                    <div class="desk-card-item desk-card-item-large">
                                      <div class="card-big-text" v-html="e_object.relatedEstimate.totals.final_price.toLocaleString() + ' р.'"></div>
                                      <div class="card-big-desc">Общая стоимость</div>
                                    </div>
                                  </div>
                                  <div class="desk-card-footer">
                                    <div class="trigger u-text-dark-hover" v-on:click="selectEstimateMode = true"><i class="fa fa-chevron-left u-mr-small"></i>выбрать другую смету</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="u-relative" v-if="selectEstimateMode">
                          <h3 v-html="e_object.relatedEstimate.estimate_id ? 'Доступные сметы' : 'Выберите смету'" class=""></h3>
                          <div class="u-mb-large">
                            <div class="panel-desc u-text-mute u-text-small">Карточка объекта будет частично сформирована из данных сметы. </div>
                            <div v-on:click="selectEstimateMode = false" class=" u-inline-block u-text-mute u-text-dark-hover u-mt-small u-text-small trigger" v-if="e_object.relatedEstimate.estimate_id"><i class="fa u-text-dark fa-long-arrow-left u-mr-xsmall top@1@5"></i>вернуться</div>
                          </div>
                              <div class="object-settings-table-wrapper">
                                <div>
                                  <table class="c-table u-border-bottom-zero">
                                    <thead class="c-table__head c-table__head--slim">
                                    <tr class="c-table__row">
                                      <th class="c-table__cell c-table__cell--head n-object-cell u-relative">
                                      <span>Объект</span>
                                      <div class="table-head-search-wrapper">
                                        <input type="text" class="u-text-mute" v-model="estimates.q" placeholder="Поиск по сметам" />
                                        <i class="fa fa-search"></i>
                                      </div>
                                      </th>
                                      <th class="c-table__cell c-table__cell--head n-date-cell">Дата</th>
                                      <th class="c-table__cell c-table__cell--head n-projecter-cell">Проектировщик</th>
                                      <th class="c-table__cell c-table__cell--head n-client-cell">Клиент</th>
                                      <th class="c-table__cell c-table__cell--head n-select-cell">Действия</th>
                                    </tr>
                                    </thead>
                                    <tbody >
                                    <tr v-if="!estimates.list.length" class="u-border-bottom-zero">
                                      <td colspan="10" class="u-border-bottom-zero">
                                        <div class="empty-table-error-container u-text-mute u-text-center fff-imp">
                                          <i class="fa fa-tint u-mr-xsmall" style="position: relative; top: 2px;"></i>
                                          <span v-html="estimates.list.q ? 'Смет соответствующих вашему запросу не найдено' : 'В системе нет смет не прикрепленных к объектам'"></span>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr class="c-table__row"  v-for="estimate in estimates.list">
                                      <td class="c-table__cell n-object-cell">
                                        <span v-html="estimate.address"></span>
                                        <small class="u-block u-text-mute" v-html="(estimate.rooms_count +' ' +rusificate(estimate.rooms_count, 'помещение', 'помещения', 'помещений')) + ' &nbsp;&nbsp;-&nbsp;&nbsp; '+estimate.total_square+' м<sup>2</sup>'"></small>
                                      </td>
                                      <td class="c-table__cell n-date-cell">
                                        <span v-html="estimate.updated_at ? renderSimpleDate(estimate.updated_at) : renderSimpleDate(estimate.created_at)"></span>
                                        <small class="u-block u-text-mute" v-html="estimate.updated_at ? renderSimpleDate(estimate.created_at) : ''"></small>
                                      </td>

                                      <td class="c-table__cell n-projecter-cell">
                                        <div class="u-text-dark" >
                                          <div class="o-media">
                                            <div class="o-media__img u-mr-xsmall">
                                              <div class="c-avatar c-avatar--xsmall">
                                                <img :src="renderAvatar(estimate.created_by_user.avatar)" onerror="window.setDefaultAvatar(this)" class="c-avatar__img">

                                              </div>
                                            </div>
                                            <div class="o-media__body"><span class="u-text-dark" v-html="renderUserRealName(estimate.created_by_user)"></span>
                                              <small class="u-block u-text-mute" v-html="renderUserType(estimate.created_by_user)"></small>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td class="c-table__cell n-client-cell" v-html="(estimate.client && estimate.client.length) ? estimate.client : '- - - - -'"></td>
                                      <td class="c-table__cell n-select-cell">
                                        <button :class="(e_object.relatedEstimate.estimate_id === estimate.estimate_id ? 'active ' : '')+'c-btn c-btn--secondary2 c-btn--small c-btn-select'" v-on:click="setRelatedEstimate(estimate.estimate_id)">выбрать</button>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                        </div>
                      </div>
                      <!-- settingsStep = 'estimate' -->
                      <!-- settingsStep === 'object' -->
                      <div v-if="settingsStep === 'client'">
                        <div class="u-mb-small u-relative">
                          <div class="n-mh-col-3">
                          <div class="settings-center-div">
                            <div class="row">
                              <div class="col-12 col-xl-6">
                                <div class="desk-card u-height-100 stacked u-mb-large">
                                  <div class="desk-card-body u-height-100">
                                    <div class="desk-card-body-2">
                                      <div class="selected-object-client">
                                        <div class="selected-object-client-col-1">
                                          <div class="u-relative u-mb-small">
                                          <div class="c-avatar c-avatar--xlarge u-mh-auto ">
                                            <img class="c-avatar__img" :src="renderUserListAvatar(e_object.relatedClient)" onerror="window.setDefaultAvatar(this)">
                                          </div>
                                            <div class="avatar-upload-ico u-text-center  trigger"><i class="fa fa-upload" v-on:click="changeClientAvatarDialog()"></i></div>
                                          </div>
                                          <div class="u-block u-color-primary u-text-center" v-html="renderUserRealName(e_object.relatedClient)"></div>
                                          <div class="u-text-center"><small class="u-text-mute u-text-small ">клиент <span v-if="e_object.relatedClient.user_id" v-html="'№'+e_object.relatedClient.user_id"></span></small></div>
                                        </div>
                                        <div class="selected-object-client-col-2">
                                          <div class="select-user-from-list" >
                                            <span class="trigger u-text-mute u-text-dark-hover" v-on:click="selectClientModal()">выбрать из списка <i class="u-ml-xsmall u-color-db fa fa-list-ul"></i></span>
                                            <span class="u-text-mute u-ml-xsmall" v-if="e_object.relatedClient.user_id">|<span class="u-ml-xsmall trigger u-text-dark-hover" @click="clearRelatedClient()">создать другого</span></span>
                                          </div>
                                          <div class="u-mt-13@5">
                                            <div class="row u-mb-small row-object-form" v-if="e_object.relatedClient.user_id">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Логин:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" disabled placeholder="Введите логин..." v-model="e_object.relatedClient.username">
                                                  <div :class="'status-ball '+(!isFieldEmpty(e_object.relatedClient.username) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="row u-mb-medium row-object-form" v-if="e_object.relatedClient.user_id">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Пароль:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="password" class="c-input" placeholder="------" v-model="e_object.relatedClient.password">
                                                  <div :class="'status-ball '+((!isFieldEmpty(e_object.relatedClient.password) && e_object.relatedClient.password.length > 5) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div>

                                            <div class="row u-mb-small row-object-form">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Фамилия:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" placeholder="Укажите фамилию..." v-model="e_object.relatedClient.last_name">
                                                  <div :class="'status-ball '+((!isFieldEmpty(e_object.relatedClient.last_name)) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div><!-- end last_name -->
                                            <div class="row u-mb-small row-object-form">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Имя:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" placeholder="Укажите имя..." v-model="e_object.relatedClient.first_name">
                                                  <div :class="'status-ball '+((!isFieldEmpty(e_object.relatedClient.first_name)) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div><!-- end first_name -->
                                            <div class="row u-mb-small row-object-form">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Отчество:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" placeholder="Укажите отчество..." v-model="e_object.relatedClient.third_name">
                                                  <div :class="'status-ball '+((!isFieldEmpty(e_object.relatedClient.third_name)) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div><!-- end third_name -->
                                            <div class="row u-mb-small row-object-form">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Телефон:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" id="field-client-phone" placeholder="+7 (911) 951-91-91" v-model="e_object.relatedClient.phone">
                                                  <div :class="'status-ball '+((validatePhone(e_object.relatedClient.phone)) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div><!-- end third_name -->
                                            <div class="row u-mb-small row-object-form">
                                              <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                                                <label class="c-field__label">Емайл:</label>
                                              </div>
                                              <div class="col-12 col-sm-8 col-xl-9">
                                                <div class="n-field-result">
                                                  <input type="text" class="c-input" placeholder="client@gmail.com" v-model="e_object.relatedClient.email">
                                                  <div :class="'status-ball '+((validateEmail(e_object.relatedClient.email) || isFieldEmpty(e_object.relatedClient.email)) ? 'status-ball-success' : 'status-ball-warning')"></div>
                                                </div>
                                              </div>
                                            </div><!-- end third_name -->
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div><!-- client data -->
                              </div>
                              <div class="col-12 col-xl-6">
                                <div class="desk-card u-height-100 stacked u-mb-large">
                                  <div class="desk-card-body u-height-100">
                                    <div class="desk-card-body-2">
                                      <div class="selected-object-client select-object-observer">
                                        <div v-if="settingsObserversMode !== 'list'">
                                          <div class="selected-object-client-col-1">
                                            <div class="u-relative u-mb-small">
                                              <div class="c-avatar c-avatar--xlarge u-mh-auto ">
                                                <img class="c-avatar__img" :src="renderUserListAvatar(e_object.relatedClient)" onerror="window.setDefaultAvatar(this)">
                                              </div>
                                              <div class="avatar-upload-ico u-text-center  trigger"></div>
                                            </div>
                                            <div class="u-block u-color-primary u-text-center" v-html="renderUserRealName(e_object.relatedClient)"></div>
                                            <div class="u-text-center"><small class="u-text-mute u-text-small">наблюдатель</small></div>
                                          </div>
                                          <div class="selected-object-client-col-2">
                                            <div class="select-user-from-list" v-if="settingsObserversMode !== 'list'">
                                              <span class="trigger u-text-mute u-text-dark-hover" v-on:click="settingsObserversMode = 'list'"><i class="u-mr-xsmall u-color-db fa fa-mail-reply top@0@5"></i> к списку</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div v-if="settingsObserversMode === 'list'" class="unshift-selected-object-client-col">
                                          <div v-if="e_object.observers_list.length === 0">
                                            <div class="c-avatar c-avatar--xlarge u-mh-auto u-mt-100">
                                              <img class="c-avatar__img" src="/static/images/default-client.png" onerror="window.setDefaultAvatar(this)">
                                            </div>
                                            <div class="u-color-db  u-text-bold u-text-center u-mt-medium">
                                              <div class="u-h2 u-mb-zero">нет наблюдателей</div>
                                            </div>
                                            <div class="u-text-mute u-text-dark-hover u-text-center u-mt-xsmall trigger">добавить?</div>
                                          </div>
                                          <div v-if="e_object.observers_list.length === 1">
                                              one observer, edit, or add one more
                                          </div>
                                          <div v-if="e_object.observers_list.length > 2">
                                            observers list & add one more
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div><!-- observers data -->
                              </div>
                            </div>
                          </div><!-- settings center div -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                    </div>
            </div>
          </div>
        </div> <!--------------------------------------- END SETTINGS TAB ------------------------------------>
        <div class="container-fluid" v-if="mode === 'estimate'">
          <div class="row">
            <div class="col-12">
                <div class="c-invoice-mw-wrapper">
                  <div class="c-invoice estimate-table">
                    <div class="c-invoice__header">

                    </div>
                    <div class="c-invoice__body">
                     <div v-if="object.relatedEstimate.estimate_id" class="estimate-table">
                      <div class="estimate-table-head estimate-table-row" style="display: none;">
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-n">№</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-name">Наименование</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-vol-type">Ед. изм</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-vol">Кол-во</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-price">Цена за ед.</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-total">Сумма</div>
                          <div class="c-table__cell c-table__cell--head estimate-table-cell estimate-table-cell-comment"></div>
                      </div>
                       <div v-if="object.relatedEstimate.calculated">
                         <estimateObject :item="object.relatedEstimate.object_jobs" :activePriceMode="object.relatedEstimate.price_mode" :key="'object_jobs'"></estimateObject>
                         <estimateObject :item="item" v-for="item, ind in object.relatedEstimate.objects_list" :activePriceMode="object.relatedEstimate.price_mode" :key="'object-'+ind"></estimateObject>
                       </div>
                     </div>







                    </div>

                    <div class="c-invoice__footer">

                      <div class="c-invoice__footer-brand">
                        <img src="img/logo.png" alt="Dashboard Logo">
                        <span>Dashboard UI Kit</span>
                      </div>

                      <div class="c-invoice__footer-info">
                        <span>hello@dashboard.com</span>
                      </div>

                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="container-fluid" v-if="mode === 'default'">
          <div class="row">
            <div class="col-12 col-lg-9">
              <div class="object-general-row-1">
                <div class="object-general-row-inner">
                  <div class="object-general-row-left">
                 <div class="desk-card stacked u-mb-small">
                   <div class="desk-card-title-2">
                     <div class="row">
                       <div class="col-6 object-date-left-col">
                         Дата начала
                       </div>
                       <div class="col-6 object-date-right-col">
                         Дата окончания
                       </div>
                     </div>
                   </div>
                   <div class="desk-card-body">
                     <div class="row">
                       <div class="col-6 object-date-left-col">
                         <div class="object-date-box">
                          <div class="object-date-box-inner">
                           <div class="object-date-day" v-html="renderDay(object.start_date)"></div>
                           <div class="object-date-month" v-html="renderMonth(object.start_date)"></div>
                          </div>
                         </div>
                       </div>
                       <div class="col-6 object-date-right-col">
                         <div class="object-date-box">
                           <div class="object-date-box-inner object-date-box-inner-2">
                           <div class="object-date-day" v-html="renderDay(object.finish_date)"></div>
                           <div class="object-date-month" v-html="renderMonth(object.finish_date)"></div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div class="desk-card stacked">
                   <div class="desk-card-body">
                     <div class="desk-card-item desk-card-item-2">
                       <div class="desk-card-item-key">Помещений</div>
                       <div class="desk-card-item-val">
                         <div v-html="object.relatedEstimate.objects_list.length"></div>
                       </div>
                     </div>
                   </div>
                 </div>
                  </div>
                  <div class="object-general-row-right">
                 <div class="desk-card stacked u-mb-medium2">
                   <div class="desk-card-title">
                     Об объекте
                   </div>
                   <div class="desk-card-body desk-card-body-3">
                     <div class="desk-card-item">
                       <div class="desk-card-item-key">Дом</div>
                       <div class="desk-card-item-val">
                         <div>Новостройка</div>
                       </div>
                     </div>
                     <div class="desk-card-item">
                       <div class="desk-card-item-key">Объект</div>
                       <div class="desk-card-item-val">
                         <div>Квартира</div>
                       </div>
                     </div>
                     <div class="desk-card-item">
                       <div class="desk-card-item-key">Адрес</div>
                       <div class="desk-card-item-val">
                         <div>ЖК Две Столицы</div>
                       </div>
                     </div>
                     <div class="desk-card-item">
                       <div class="desk-card-item-key">Статус работ</div>
                       <div class="desk-card-item-val">
                         <div>ЖК Две Столицы</div>
                       </div>
                     </div>
                   </div>
                 </div>
                  </div>
                </div>
              </div>
              <div class="object-objects-list-wrapper u-mb-small">
                    <div class="object-wall-wrapper">
                      <objectsSlider :items="object.relatedEstimate.objects_list"></objectsSlider>
                    </div>

              </div>
            </div>
            <div class="col-12 col-lg-3">
              <div class="desk-card stacked">
                <div class="desk-card-title">
                 Последние документы
                </div>
                <div class="desk-card-body desk-card-body-3 h-general-col">
                  <div v-if="object.documents.length">
                    <div class="desk-card-item">
                      <div class="desk-card-item-key"></div>
                      <div class="desk-card-item-val">
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div class="empty-h-col u-text-mute u-text-center" v-else>
                    <div class="u-mb-3">Пока нет ни одного документа</div>
                    <div><span class="trigger u-color-info" v-on:click="selectUploadNewDocTab()">Загрузить новый</span></div>
                  </div>


                </div>
              </div>
            </div>
          </div>

          <div class="object-wall-wrapper u-mt-small">
            <div class="row">
              <div class="col-12">
                <div class="c-card">стена</div>
              </div>
            </div>
          </div>
        </div><!------------------------------------------ END DEFAULT TAB ----------------->
      </div>
    </div>
    <modalUsers :allowUserTypes="modalUsersData.allowUserTypes" :title="modalUsersData.title" :select="modalUsersData.select" :force="modalUsersData.force" ></modalUsers>
  </div>


</template>
<script>
  import Component from '@/components/Component';
  import ChatMessage from '@/components/chat/ChatMessage.vue';
  import SubmitForm from '@/components/chat/SubmitForm.vue';
  import modalUsers from '@/components/users/modalUsers.vue';
  import relatedUser from '@/components/users/relatedUser.vue';
  import modifyObserverModal from '@/components/users/modifyObserverModal.vue';
  import Datepicker from 'vuejs-datepicker';
  import ObjectPost from '@/components/object/ObjectPost.vue';
  import GalleryComponent from '@/components/object/GalleryComponent.vue';
  import galleryParentMixin from '@/mixins/galleryParentMixin.vue';
  import galleryModal from '@/components/elements/galleryModal.vue';
  import objectsMixin from '@/mixins/objectsMixin.vue';
  import nselect2 from '@/components/elements/nselect2.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import estimateMixin from '@/mixins/estimateMixin.vue';
  import calculatorMixin from '@/mixins/calculatorMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import validatorMixin from '@/mixins/validatorMixin.vue';
  import objectsSlider from '@/components/objectsSlider.vue';
  import estimateObject from '@/components/estimateObject.vue';
  import Inputmask from 'inputmask';
  const baseLink = '/objects/object';
  const pageData = {headerClass: '', title: 'Карточка объекта', metaTitle: 'Карточка объекта', style: 'component-offset' };
  const defaultMode = 'default';
  export default {
    extends: Component,
    mixins: [objectsMixin, commonMixin, estimateMixin, usersMixin, calculatorMixin, validatorMixin],
    data() {
      return {
        lock: false,
        pageData: pageData,
        object: this.getClearObject(),
        e_object: this.getClearObject(),
        timeoutEstimatesAxios: null,
        q: '',
        loading: false,
        stepsLength: 3,
        modifyLoad: false,
        modalUsersData: {
          allowUserTypes: [],
          title: '',
          select: '',
          force: 0
        },
        tabs: {
          default:  { mode: 'default', title: 'Информация', icon: 'fa-history' },
          estimate: { mode: 'estimate', title: 'Смета', icon: 'fa-clipboard' },
          docs: { mode: 'docs', title: 'Документы', icon: 'fa-docs' },
          users: { mode: 'users', title: 'Персонал', icon: 'fa-coworkers2' },
          schedule: { mode: 'schedule', title: 'График производства', icon: 'fa-calendar' },
          settings: { mode: 'settings', title: 'Настройки', icon: 'fa-cog',
            steps: {
              object: { title: 'Данные объекта', icon: 'fa-home', index: 1 },
              client: { title: 'Данные клиента', icon: 'fa-user', index: 2 }
            }
          }
        },
        costs: {
          totals: this.getClearTotals()
        },
        estimates: {
          q: '',
          f: '',
          t: '',
          p: 1,
          total: 0,
          loading: false,
          list: [],
        },
        post_content: '',
        post_photo: '',
        errorMessage: '',
        settingsStep: 'object',
        posts: [],
        photos: [],
        creatingPostProcess: false,
        usersLoading: false,
        modalUserTypes: null,
        emitCreate: false,
        modalUserTitle: '',
        modalUserSelect: null,
        modalUserCreate: null,
        modalUserType: null,
        mode: 'default',
        selectEstimateMode: true,
        settingsObserversMode: 'list',
        editObjectMode: false
      };
    },
    beforeCreate() {
      this.$store.commit('titleStatement', true);
    },
    created() {

    },
    destroyed() {
      this.$store.commit('loading', false);
    },
    async beforeMount() {


    },
    async mounted() {
      await this.init();
      this.$store.dispatch('setComponentReady', true);
    },
    destroyed() {
      this.dropEvents();
    },
    computed: {

    },
    created() {
      this.$on('createClient', (user) => {
        this.e_object.relatedClient = user;
      });
      this.$on('selectRelatedClient', (user) => {
        this.e_object.relatedClient = user;
        this.e_object.relatedClient.password = this.$store.state.defaultPassword;
      });
      this.$on('dropObserver', async (user) => {
        if(!user) { return; }
        if(!user.user_id) { return; }
        this.$dialog.confirm('<div class="dg-header">Подтверждение</div><div class="dg-body">Вы уверены что хотите удалить этого наблюдателя?</div>', {
          okText: 'Да',
          cancelText: 'Нет',
          html: true
        })
          .then(() => {

          })
          .catch(() => {
          });


      });
    },
    watch: {
      modifyLoad(v) {
        this.$store.commit('loading', v);
      },
      async $route(v) {
        if(v.query.object_id != this.object.object_id) {
          await this.initObject(v);
        }
        this.calculateMode();
      },
      settingsStep() {
        this.setMasks();
      },
      selectEstimateMode(v) {
        if(v) {
          this.getEstimates();
        }
      },
      'estimates.q'() {
        this.timeoutEstimates();
      },
      'estimates.loading'(v) {
        this.$store.commit('loading', v);
      },
      loading(v) {
        this.$store.commit('loading', v);
      },
    },
    methods: {
      selectUploadNewDocTab() {
        this.$router.push(this.link('docs'));
      },
      renderMonth(date) {
        date = new Date(date);
        let month = date.getMonth();
        return window.dateFormatter.switchMonth(month)[1] + ' '+date.getFullYear();
      },
      renderDay(date) {
        if(!date) { return ''; }
        let day = new Date(date).getDate();
        return day ? day : '';
      },
      async init() {
        this.objectStatuses = JSON.parse(JSON.stringify(this.$store.state.objectStatuses));
        let limits = (await this.getLimits());
        this.unpackLimits(limits);
        this.initObject(this.$route);
        await this.calculateMode();
      },
      async initObject(v) {
        let object_id = parseInt(v.query.object_id);
        object_id = object_id ? object_id : null;
        if(object_id) {
          this.e_object.object_id = object_id;
          this.object.object_id = object_id;
          let objectData = await this.getObjectById(object_id);
          if(objectData) {
            if(objectData.result) {
              objectData.object.finish_date = new Date(objectData.object.finish_date);
              objectData.object.start_date = new Date(objectData.object.start_date);
              objectData.object.relatedEstimate.totals = this.getClearTotals();
              this.e_object = objectData.object;
              this.object = JSON.parse(JSON.stringify(objectData.object));
              this.parseIncomingEstimate(this.e_object.relatedEstimate, this.e_object.relatedEstimate);
              this.recalculateCosts(this.e_object.relatedEstimate);
              this.parseIncomingEstimate(this.object.relatedEstimate, this.object.relatedEstimate);
              this.recalculateCosts(this.object.relatedEstimate);
            } else {
              this.$router.push('/not-found');
              return;
            }
          } else {
            this.$router.push('/not-found');
            return;
          }
        }
        if(!this.e_object.object_id) { this.editObjectMode = true; }
      },
      setMasks() {
        setTimeout(() => {
          this.setMask('field-client-phone');
        }, 700);
      },
      setMask(id, mask) {
        mask = mask ? mask : '+7 (999)-999-99-99';
        let el = document.getElementById(id);
        if (!el) {
          return;
        }
        let im = new Inputmask(mask);
        im.mask(el);
      },
      changeClientAvatarDialog() {
        window.Uploader.addCallback(this.confirmChangeClientAvatar);
        window.Uploader.selectFile();
      },
      confirmChangeClientAvatar() {
        let form = $('#uploadForm');
        if (!form.length) {
          return;
        }
        let formData = new FormData(form[0]);
        if (this.e_object.relatedClient.user_id) {
          formData.append('user_id', this.e_object.relatedClient.user_id);
        }
        $http.post('/api/users/modify/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if (parseInt(response.status) === 200) {
            if (response.data.result) {
              this.e_object.relatedClient.avatar = response.data.files[0].filename;
            } else {

            }
            window.Uploader.reset();
          }
        });

      },
      isCorrectDate(a, type) {
        if(!a) { return 0; }
        if(type === 'start_date') {
          if(!this.e_object.finish_date) { return 1; }
          if(this.e_object.finish_date.getTime() <= a.getTime()) { return 0; }
          return 1;
        }
        if(type === 'finish_date') {
          if(!this.e_object.start_date) { return 1; }
          let st = this.e_object.start_date.getTime();
          let ft = a.getTime();
          if(st >= ft) { return 0; }
          let diff = (ft/1000/60/60/24)-(st/1000/60/60/24);
          if(diff < 15) {
            return 0;
          }
          return 1;
        }
      },
      clearRelatedClient() {
        this.e_object.relatedClient = this.getClearRelatedUser({ usertype: 'client' });
      },
      collectObjectData() {
        let data = {
          object_id: this.e_object.object_id,
          relatedClient: this.e_object.relatedClient,
          relatedEstimate: {
            estimate_id: this.e_object.relatedEstimate.estimate_id,
            address: this.e_object.relatedEstimate.address,
            building_type: this.e_object.relatedEstimate.building_type,
            object_type: this.e_object.relatedEstimate.object_type,
          },
          observers_list: [],
          start_date: this.e_object.start_date,
          finish_date: this.e_object.finish_date,

        };
        return data;
      },
      async modifyObject() {
        if(this.modifyLoad) { return; }
        if(!this.allowModifyObject()) { return; }
        this.modifyLoad = 1;
        const resp = await $http.post('/objects/modify-object', this.collectObjectData());

        if(resp) {
          if(resp.result) {
            this.$msg.success(resp.display);
            if(resp.objectCreated) {
              this.e_object.object_id = resp.object_id;
              this.$router.push('/objects/object?object_id='+this.e_object.object_id);
              this.modifyLoad = 0;
              return;
            }
            this.modifyLoad = 0;
            return;
          }
          this.modifyLoad = 0;
          this.$msg.error(resp.display);
        }
        this.modifyLoad = 0;

      },
      allowModifyObject() {
        if(!this.allowEditClientStep()) {
          return 0;
        }
        if(!this.clientIsValid()) {
          return 0;
        }
        if(!this.observersAreValid()) {
          return 0;
        }
        return 1;
      },
      observersAreValid() {
        return 1;
      },
      clientIsValid() {
        if(this.e_object.relatedClient.user_id) {
          if(!this.e_object.relatedClient.password) { return 0; }
          if(this.e_object.relatedClient.password.length < 6) { return 0; }
        }
        if(this.isFieldEmpty(this.e_object.relatedClient.first_name)) { return 0; }
        if(this.isFieldEmpty(this.e_object.relatedClient.last_name)) { return 0; }
        if(this.isFieldEmpty(this.e_object.relatedClient.third_name)) { return 0; }
        if(!this.validatePhone(this.e_object.relatedClient.phone)) { return 0; }
        if(!this.isFieldEmpty(this.e_object.relatedClient.email) && !this.validateEmail(this.e_object.relatedClient.email)) { return 0; }
        return 1;
      },

      selectClientModal() {
        this.modalUsersData.allowUserTypes = ['client'];
        this.modalUsersData.select = 'selectRelatedClient';
        this.modalUsersData.title = 'Выберите клиента из списка';
        this.callUsersModal();
      },
      callUsersModal() {
        $('#usersModal').modal('show');
      },
      getClearTotals() {
        return {
          jobsBase: 0,
          jobs: 0,
          garbage: 0,
          fare: 0,
          materials: 0,
          wrms: 0,
          brms: 0,
          rms: 0,
          discount: 0,
          final_price: 0
        };
      },
      setSettingsStep(index) {
        if(index === 'object') {
          this.settingsStep = index;
          return;
        }
        if(!this.allowEditClientStep()) {
          return;
        }
        this.settingsStep = index;
      },
      allowEditClientStep() {
        if(!this.e_object.relatedEstimate.estimate_id) { return 0; }
        if(!this.isCorrectDate(this.e_object.start_date, 'start_date')) { return 0; }
        if(!this.isCorrectDate(this.e_object.finish_date, 'finish_date')) { return 0; }
        if(this.isFieldEmpty(this.e_object.relatedEstimate.address)) { return 0; }
        return 1;
      },
      async setRelatedEstimate(id) {
        if(this.e_object.relatedEstimate.estimate_id === id) {
          this.selectEstimateMode = false;
          return;
        }
        if(this.loading) { return; }
        this.loading = true;
        const resp = await $http.get('/calc/get-estimate?additional=1&estimate_id='+id);
        if(resp) {
          if(resp.result) {
            this.e_object.relatedEstimate = resp.estimate;
            this.e_object.relatedEstimate.totals = this.getClearTotals();
            this.parseIncomingEstimate(this.e_object.relatedEstimate, this.e_object.relatedEstimate);
            this.recalculateCosts(this.e_object.relatedEstimate);
            if(!this.e_object.relatedClient.user_id) {
              // set client
              if(this.e_object.relatedEstimate.phone) {
                this.e_object.relatedClient.phone = this.e_object.relatedEstimate.phone;
                let userData = await (await $http.post('/api/users/profile-by-phone', { phone: this.e_object.relatedEstimate.phone }));
                if(userData) {
                  if(userData.result) {
                    if(userData.user.usertype === 'client') {
                      this.e_object.relatedClient = userData.user;
                    }
                  }
                }
              }
              if(!this.e_object.relatedClient.user_id) {
                let names = this.e_object.relatedEstimate.client.split(' ');
                if(names[0]) {
                  this.e_object.relatedClient.last_name = names[0];
                }
                if(names[1]) {
                  this.e_object.relatedClient.last_name = names[1];
                }
                if(names[2]) {
                  this.e_object.relatedClient.last_name = names[2];
                }
              }
            }
          } else {
            // window.toastr.error('Смета не найдена');
          }
        }
        this.loading = false;
        this.selectEstimateMode = false;
      },
      async timeoutEstimates() {
        if(this.timeoutEstimatesAxios) { clearTimeout(this.timeoutEstimatesAxios); }
        this.timeoutEstimatesAxios = setTimeout(() => {
          this.getEstimates();
        }, 170);
      },
      async getEstimates() {
        if(this.estimates.loading) { return; }
        this.estimates.loading = 1;
        this.estimates.p = 1;
        const resp = await $http.post('/calc/get-estimates', {
          p: this.estimates.p,
          f: this.estimates.f,
          t: this.estimates.t,
          q: this.estimates.q,
          no_object: true,
          except_object_id: this.e_object.object_id
        });
        if (resp) {
          if(!this.permissions(resp)) { return; }
          this.estimates.list = resp.estimates ? resp.estimates : [];
          this.estimates.p++;
          this.estimates.total = resp.total;
        }
        this.estimates.loading = 0;
      },
      calculateSettingsWidth() {
        if(!this.settingsStep) { return 0; }
        let step = this.tabs.settings.steps[this.settingsStep];
        return (step.index)*(100/this.stepsLength);
      },
      async calculateMode() {
        let mode = this.$route.query.mode;

        if (!this.object.object_id && mode !== 'settings') {
          this.$router.push(this.link('settings'));
          return;
        }
        if(!mode) { mode = defaultMode; }
        if(!this.tabs[mode]) { mode = defaultMode; }
        if(mode === 'settings') {
          this.selectEstimateMode = this.e_object.object_id ? false : true;
          if(this.selectEstimateMode) {
            await this.getEstimates();
          }
        }
        this.setMasks();
        this.mode = mode;
      },
      link(a) {
        let link = baseLink + (this.object.object_id ? '?object_id='+this.object.object_id : '');
        if(!a || a === 'default') { return link; }
        let v = link.indexOf('?') !== -1 ? '&' : '?';
        return link+v+'mode='+a;
      },
      getClearObject() {
        return {
          object_id: 0,
          client_id: 0,
          relatedClient: this.getClearRelatedUser({ usertype: 'client' }),
          relatedEstimate: this.getClearEstimate(),
          observers_list: [],
          documents: [],
          start_date: '',
          finish_date: '',
        };
      },
      getClearRelatedUser(opts) {
        return {
          user_id: 0,
          username: '',
          password: '',
          first_name: '',
          last_name: '',
          avatar: '',
          profession_id: 0,
          usertype: opts.usertype,
          phone: '',
          phone2: ''
        };
      },
      getClearEstimate() {
        return {
          estimate_id: 0,
          address: '',
          phone: '',
          object_type: '',
          building_type: '',
          created_at: '',
          created_by: '',
          jobs: [],
          objects_list: [],
          updated_at: '',
          deleted: false,
          deleted_by: 0,
          price_mode: '',
          rough_materials: [],
          rooms_count: 0,
          created_by_user: this.getClearRelatedUser({ usertype: 'coworker' }),
          client: this.getClearRelatedUser({ usertype: 'client' }),
          salary_percent: 0,
          discount: 0,
          garbage_removal: 0,
          fare: 0,
          total_cost: 0,
          total_square: 0,
          object_jobs: [],
          temp_jobs: [],
          version_id: 0,
          totals: this.getClearTotals(),
          calculated: false,
        };
      },
      async rotateImage() {
        if(this.lockRotateProcess) { return; }
        this.lockRotateProcess = 1;
        if(!window.gallery.items) { return; }
        if(!window.gallery.items.length) { return; }
        let item = window.gallery.items[window.gallery.currentIndex];
        const resp = await $http.post('/rotate-object-photo', { image_id: item.image_id });
        if(resp) {
          if(resp.result) {
            window.gallery.items[window.gallery.currentIndex].image = resp.newname;
            window.gallery.setItem(window.gallery.currentIndex);
            for(let i = 0; i < this.posts.length; i++) {
              let post = this.posts[i];
              if(post.message_type !== 'addPhoto') { continue; }
              if(!Array.isArray(post.message)) { continue; }
              for(let j = 0; j < post.message.length; j++) {
                let img = post.message[j];
                if(img.image_id === item.image_id) {
                  img.image = resp.newname;
                }
              }
            }
          } else {

          }
        }
        this.lockRotateProcess = 0;

      },
      async dropImage() {
        if(!window.gallery.items) { return; }
        if(!window.gallery.items.length) { return; }
        let item = window.gallery.items[window.gallery.currentIndex];
        const resp = await $http.post('/drop-object-photo', { image_id: item.image_id });
        if(resp) {
          if(resp.result) {
            window.gallery.items.splice(window.gallery.currentIndex, 1);
            // 4 -1 = 3
            if(!window.gallery.items.length) {
              $('#n-gallery-modal').modal('hide');
            } else {
              if(!window.gallery.items[window.gallery.currentIndex]) {
                window.gallery.currentIndex = 0;
              }
              window.gallery.setItem(window.gallery.currentIndex);
            }
          }
        }
      }
    },
    components: {
      estimateObject,
      ChatMessage,
      modalUsers,
      relatedUser,
      modifyObserverModal,
      Datepicker,
      ObjectPost,
      GalleryComponent,
      galleryModal,
      nselect2,
      objectsSlider
    }
  }
</script>
