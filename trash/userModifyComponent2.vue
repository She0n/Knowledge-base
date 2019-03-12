<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div class="container-fluid" v-else>
      <div class="row">
        <div class="col-xl-3 col-lg-4 u-mb-medium">
          <div class="c-stage n-mh-col-2 u-height-100">
            <div class="u-p-medium">
              <div class="u-text-center u-pt-small u-pb-small">
                <div class="u-inline-block u-relative u-mh-auto">
                  <div :class="'c-avatar c-avatar--xlarge u-inline-block u-mt-xsmall '+(activeTab === 'settings' ? 'trigger' : '')" >
                    <img :src="renderUserAvatar((activeTab === 'settings' ? edit_user : user), 'sm')" onerror="window.setDefaultAvatar(this)" class="c-avatar__img">
                  </div>
                  <div class="avatar-upload-ico  trigger" v-if="activeTab === 'settings'" v-on:click="changeAvatarDialog()">
                    <i class="fa fa-upload"></i>
                  </div>
                </div>
              </div>
              <h4 class="u-h4 u-mb-4 u-text-bold u-text-center" v-html="renderUserRealName(activeTab === 'settings' ? edit_user : user)"></h4>
              <div class="u-text-mute u-text-center" v-html="renderUserType(activeTab === 'settings' ? edit_user : user)"></div>
            </div>
            <div class="c-divider"></div>
            <div class="u-pv-medium">
              <ul class="card-links-list">
                <li v-if="allowMessage(user) && user.user_id">
                  <router-link :to="'/messages?p='+user.user_id">
                    <i class="fa fa-envelope u-mr-small"></i> Отправить сообщение
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-xl-9 col-lg-8 u-mb-medium">

            <div class="c-stage u-height-100">
              <div class="u-relative">
                <div>
                  <ul class="c-tabs__list nav nav-tabs no-border-tabs">
                    <li v-if="user.user_id"><a :class="'c-tabs__link' + (activeTab === 'profile' ? ' active' : '')" v-on:click="activeTab = 'profile'">Профиль</a></li>
                     <li v-if=!user.user_id><a class="c-tabs__link">&nbsp;</a></li>
                  </ul>
                </div>
                <div :class="'rounded-icon icon-edit-user trigger ' + (activeTab === 'settings' ? 'active' : '')" v-if="allowModifyProfile(user) || isSelf(user)" v-on:click="activeTab === 'settings' && user.user_id ? activeTab = 'profile' : activeTab = 'settings'">
                  <i class="fa fa-cog"></i>
                </div>

              </div>
              <div class="u-p-medium">
                <div class="u-pt-medium u-mb-medium">
                <div v-if="activeTab === 'profile'">
                  <div class="u-mb-medium">
                      <div class="c-field" v-if="!isFieldEmpty(user.phone)">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label">Телефон:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field n-field-result" v-html="user.phone"></div>
                          </div>
                        </div>
                      </div>

                      <div class="c-field" v-if="!isFieldEmpty(user.phone2)">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label">Альт. телефон:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field n-field-result" v-html="user.phone2"></div>
                          </div>
                        </div>
                      </div>

                      <div class="c-field" v-if="!isFieldEmpty(user.email)">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label">Емайл:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field n-field-result" v-html="user.email"></div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <!-- birthday, about, expirience, -->
                  <div class="u-mb-small" v-if="!isFieldEmpty(user.birthday) || !isFieldEmpty(user.instrument) || !isFieldEmpty(user.test_results) || !isFieldEmpty(user.about) || !isFieldEmpty(user.expirience) || !isFieldEmpty(user.specialization) || areasByIds[user.area_id]">
                    <div class="c-field" v-if="!isFieldEmpty(user.birthday)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Дата рождения:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="renderBirthday(user.birthday)"></div>
                        </div>
                      </div>
                    </div>
                  <!-- end birthday -->
                  <div class="c-field" v-if="!isFieldEmpty(user.specialization)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Специальность:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.specialization"></div>
                        </div>
                      </div>
                  </div>
                  <!-- specialization -->
                    <div class="c-field" v-if="!isFieldEmpty(user.expirience)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Опыт работы:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result"  v-html="user.expirience + ' ' +rusificate(ceil(user.expirience), 'год', 'года', 'лет')"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.instrument)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Инструмент:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result"  v-html="user.instrument"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.test_results)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Анализ тестирования:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result"  v-html="user.test_results"></div>
                        </div>
                      </div>
                    </div>
                    <!-- end expirience -->
                    <div class="c-field" v-if="areasByIds[user.area_id]">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Район:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result"  v-html="areasByIds[user.area_id].title"></div>
                        </div>
                      </div>
                    </div>

                    <div class="c-field" v-if="!isFieldEmpty(user.about)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">О себе:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.about"></div>
                        </div>
                      </div>
                    </div>
                    <!-- about -->
                  </div>

                  <!-- passport -->
                  <div class="u-mb-small" v-if="allowWatchConfidencialInformation(user) && (
                  !isFieldEmpty(user.passport_data.author) || !isFieldEmpty(user.passport_data.code) || !isFieldEmpty(user.passport_data.registration) ||
                  !isFieldEmpty(user.passport_data.date) || !isFieldEmpty(user.passport_data.photo1) || !isFieldEmpty(user.passport_data.photo2) )
                  ">
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.series)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (серия и номер):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.passport_data.series"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.author)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (кем выдан):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.passport_data.author"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.date)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (дата выдачи):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="renderSimpleDate(user.passport_data.date)"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.code)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (код подразделения):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.passport_data.code"></div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.registration)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (регистрация):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result" v-html="user.passport_data.registration"></div>
                        </div>
                      </div>
                    </div>
                    <div class="u-mt-medium">


                    <div class="c-field u-mb-medium " v-if="!isFieldEmpty(user.passport_data.photo1)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (фото):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result">
                            <img :src="renderImage('/images/passports/sm/'+user.passport_data.photo1)" alt="">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field" v-if="!isFieldEmpty(user.passport_data.photo2)">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label">Паспорт (фото регистрации):</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field n-field-result">
                            <img :src="renderImage('/images/passports/sm/'+user.passport_data.photo2)" alt="">
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>

                </div>
                <div v-if="activeTab === 'history'">
                  <div class="n-edit-field u-mh-auto">
                  <div class="dev-mode-comp  u-mt-large u-pt-large u-relative">


                    <span class="c-card__icon">
                        <i class="u-h2 fa fa-cogs"></i>
                    </span>



                  </div>
                  </div>
                </div>
                <div v-if="activeTab === 'settings'">
                  <div class="u-mb-large" v-if="!$store.state.usertypes[this.edit_user.usertype].nologin">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Данные для входа</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div class="c-field u-mb-small" v-for="item, index in loginFields">
                    <div class="row">
                      <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                        <label class="c-field__label n-field-label" v-html="item.title+':'"></label>
                      </div>
                      <div class="col-12 col-sm-8 col-xl-9">
                        <div class="n-edit-field">
                          <input class="c-input" :type="item.type" v-model="edit_user[index]"
                                 :placeholder="item.placeholder">
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div class="u-mb-large">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Персональные данные</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="allowModifyUser(edit_user, 1)">
                      <div class="c-field u-mb-small" v-for="item, index in personalFieldsA">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label n-field-label" v-html="item.title+':'"></label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field">
                              <input class="c-input" type="text" :id="'field-id-'+index" v-model="edit_user[index]"
                                     :placeholder="item.placeholder">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="allowModifyUser(this.edit_user, 1)">
                      <div class="c-field u-mb-small">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label n-field-label">Дата рождения:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field">
                              <datepicker :clear-button="true" v-model="edit_user.birthday" placeholder="Выберите дату"
                                          :input-class="'c-input trigger'" language="ru"
                                          :monday-first="true"></datepicker>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- birthday -->


                    </div>
                    <!-- expirience -->
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">О себе:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <textarea class="c-input" v-model="edit_user.about"></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div v-if="allowModifyUser(this.edit_user, 1)">
                  <div class="u-mb-large" v-if="isCoworker(edit_user) || isAdmin(edit_user)">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Профессиональные данные</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field u-mb-small" v-if="$store.state.professions.length && (((isCoworker(edit_user) && edit_user.usertype !== 'workman' && !isSelf(edit_user)) || isAdmin(edit_user)))">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Должность</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <nselect2 id="modify-user-profession" :options="$store.state.professions" select_key="profession_id" :nullable="true" :value="edit_user.profession_id" v-model="edit_user.profession_id" placeholderVal="Не выбрана"></nselect2>
                          </div>
                        </div>
                      </div>
                    </div>
                      <div class="c-field u-mb-small">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label n-field-label">Специальность:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field">
                              <vue-tags-input
                                v-model="activeSpecialization"
                                :tags="baseSpecializationTags"
                                placeholder="Добавить специализацию"
                                :autocomplete-items="filteredSpecialization"
                                @tags-changed="specializationChangeHandler"
                              >
                              </vue-tags-input>
                            </div>
                          </div>
                        </div>
                      </div>
                    <div class="c-field u-mb-small" v-if="edit_user.usertype === 'workman'">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Инструмент:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div id="instrument-tag-fields" :style="instrumentMode === 'tags' ? '' : 'display: none;'">
                              <vue-tags-input
                                v-model="activeInstrument"
                                :tags="baseInstrumentTags"
                                placeholder="Добавить инструмент"
                                :autocomplete-items="filteredInstruments"
                                @tags-changed="instrumentsChangeHandler"
                              >
                              </vue-tags-input>
                            </div>
                            <div class="u-text-right">
                              <span class="trigger u-text-mute u-text-xsmall u-mt-xsmall u-text-dark-hover" @click="instrumentMode = (instrumentMode === 'tags' ? 'cbs' : 'tags')">Выбрать из списка</span>
                            </div>
                            <div class="instrument-checkbox-fields" id="instrument-checkbox-fields" :style="instrumentMode === 'tags' ? 'display: none;' : ''">
                              <div class="c-choice c-choice--checkbox cb-blue u-mb-3" v-for="inst, k in autocompleteInstruments" >
                                <input :id="'instrument-'+k"  type="checkbox"  @change="addInstrument($event.target.value.toLowerCase())" :value="inst.text" :checked="selectedInstruments.indexOf(inst.text.toLowerCase()) !== -1" class="c-choice__input">
                                <label :for="'instrument-'+k" :class="'c-choice__label'" v-html="inst.text"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- specialization -->
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Опыт работы:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <input class="c-input" type="text" maxlength="4" onkeypress="return validateFloatInput(event)" v-model="edit_user.expirience"
                                   placeholder="Укажите опыт работы">
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- expirience -->
                    <div v-if="edit_user.usertype === 'workman'">
                      <div class="c-field u-mb-small">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label n-field-label">Анализ теста:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field">
                              <input type="text" v-model="edit_user.test_results" class="c-input" placeholder="Заключение по итогам тестирования на собеседовании">
                            </div>
                          </div>
                        </div>
                      </div>
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Уровень объектов:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field u-pt-8 u-mb-3">
                            <div class="row">
                              <div v-for="pm, k in $store.state.priceModes" class="col-12 col-sm-6">
                                <div class="c-choice c-choice--checkbox cb-blue u-mb-3" >
                                  <input :id="'crmpcb-'+k"  type="checkbox" :value="k" v-model="edit_user.priceModes" class="c-choice__input">
                                  <label :for="'crmpcb-'+k" :class="'c-choice__label'" v-html="pm.title"></label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div class="u-mb-small">
                      <div class="c-field u-mb-small">
                        <div class="row">
                          <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                            <label class="c-field__label n-field-label">Примечание:</label>
                          </div>
                          <div class="col-12 col-sm-8 col-xl-9">
                            <div class="n-edit-field">
                              <textarea placeholder="Укажите примечание (если есть)" class="c-input" v-model="edit_user.comment"></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- end add.comment -->
                    </div>
                  </div>
                  <div class="u-mb-large" v-if="allowModifyUser(this.edit_user)">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Контактные данные</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field u-mb-small" v-for="item, index in contactFields">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label" v-html="item.title+':'"></label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <input class="c-input" type="text" :id="'field-id-'+index" v-model="edit_user[index]"
                                   :placeholder="item.placeholder">
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- end contact fields -->

                  </div>

                  <div v-if="allowModifyUser(edit_user, 1) && edit_user.usertype === 'workman'">
                    <div v-if="areas.length">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Локация</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Район проживания:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <nselect2 id="areas-selector" :options="areas" v-model="edit_user.area_id" :nullable="true" :placeholderVal="'Не выбран'" :select_key="'area_id'"></nselect2>
                            <div class="c-divider  u-mt-medium"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="c-choice c-choice--checkbox u-mt-xsmall">
                              <input id="is-legal-workman" name="active" type="checkbox" v-model="edit_user.is_legal_worker" class="c-choice__input">
                              <label for="is-legal-workman" class="c-choice__label">Трудоустроен</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <!-- about -->
                  <div class="u-mb-large" id="passport-container" v-if="allowWatchConfidencialInformation(edit_user)" :style="isHiddenPassportContainer ?  'display: none;' : 'display: block;'">
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">&nbsp;</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="fields-label">Паспортные данные</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field u-mb-small" v-for="item, index in passportFields">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label" v-html="item.title+':'"></label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <datepicker :clear-button="true" v-model="edit_user.passport_data[index]" :placeholder="item.placeholder"
                                        input-class="c-input trigger" language="ru"
                                        :monday-first="true" v-if="item.type === 'date'"></datepicker>
                            <input class="c-input" :id="'passport-'+index" type="text" :placeholder="item.placeholder" v-model="edit_user.passport_data[index]" v-else>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Фото паспорта:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="dropzone dz-clickable n-edit-field">
                            <div class="dz-message" v-on:click="uploadPassportPhoto1()">
                              <div class="loading-content" v-if="uploadingProcess1">
                                <div class="m-loader"></div>
                                <span class="u-text-dark">загрузка ...</span>
                              </div>
                              <div v-else>
                                <div v-if="edit_user.passport_data.photo1">
                                  <img :src="renderImage('/images/passports/'+edit_user.passport_data.photo1)" alt="">
                                </div>
                                <div v-else>
                                <i class="dz-icon fa fa-cloud-upload"></i>
                                  <div>Загрузить  файл</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                    <!-- end passport photo -->
                    <div class="c-field u-mb-small">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3 u-text-right-sm">
                          <label class="c-field__label n-field-label">Фото регистрации:</label>
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="dropzone dz-clickable n-edit-field">
                            <div class="dz-message" v-on:click="uploadPassportPhoto2()">
                              <div class="loading-content" v-if="uploadingProcess2">
                                <div class="m-loader"></div>
                                <span class="u-text-dark">загрузка ...</span>
                              </div>
                              <div v-else>
                                <div v-if="edit_user.passport_data.photo2">
                                  <img :src="renderImage('/images/passports/'+edit_user.passport_data.photo2)" alt="">
                                </div>
                                <div v-else>
                                  <i class="dz-icon fa fa-cloud-upload"></i>
                                  <div>Загрузить  файл</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- end reg photo -->
                  </div>

                  <div class="u-mb-large">
                    <div class="c-field">
                      <div class="row">
                        <div class="col-12 col-sm-4 col-xl-3">
                          &nbsp;
                        </div>
                        <div class="col-12 col-sm-8 col-xl-9">
                          <div class="n-edit-field">
                            <div class="u-text-center">
                              <button class="c-btn c-btn--success" v-on:click="modifyUser()">
                                <span class="m-loader" v-if="process"></span>
                                <span v-html="user.user_id ? 'Сохранить' : 'Создать'"></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

        </div>
      </div>
    <div class="c-modal modal fade" :id="avatarModalName" tabindex="-1" role="dialog"
         :aria-labelledby="avatarModalName">
      <div class="c-modal__dialog modal-dialog" role="document">
        <div class="c-modal__content modal-content">
          <header class="c-modal__header gray-header">
            <h1 class="c-modal__title u-text-dark">Выберите главное изображение</h1>
            <span class="c-modal__close u-text-dark" data-dismiss="modal" aria-label="Close">&times;</span>
          </header>
          <div class="c-modal__body">
            <div class="owner_photo_desc">
              Осталось выбрать область для маленьких фотографий.
              <br/>
              Выбранная миниатюра будет использоваться в новостях, личных сообщениях и комментариях.
            </div>
            <div class="owner_photo_crop_thumb">
              <div class="owner_photo_crop_wrap">
                <div class="owner-photo-crop-left2">
                  <div class="">
                    <vue-croppie ref=croppieRef v-if="user.user_id" :boundary="{ width: 240, height: 240 }"
                      :mouseWheelZoom="true"  :enableResize="false" :viewport="{ width: 200, height: 200,  }" />

                  </div>
                </div>
              </div>
            </div>
            <div class="owner_photo_controls">
              <button class="c-btn" v-on:click="createResult()">резалт</button>
              <button class="c-btn">сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
  import Component from '@/components/Component'
  import Inputmask from 'inputmask';
  import usertypeSelector from '@/components/elements/usertypeSelector.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import profileSummariesMixin from '@/mixins/profileSummariesMixin.vue';
  import summariesFunctionsMixin from '@/mixins/summariesFunctionsMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import summariesComponent from '@/components/users/summariesComponent.vue';

  import userModifyMixin from '@/mixins/userModifyMixin.vue';
  const routesByTypes = {
    client: '/clients/modify',
    observer: '/clients/modify-observer',
    workman: '/coworkers/workmans/modify',
    coworker: '/coworkers/office-workers/modify',
    admin: '/coworkers/office-workers/modify',
  };
  const pageData = {headerClass: 'u-mb-large', bodyClass: 'mh-scroll'};

  export default {
    props: ['uid'],
    extends: Component,
    mixins: [permissionsMixin, profileSummariesMixin, summariesFunctionsMixin, commonMixin, usersMixin, userModifyMixin],
    data() {

      return {
        activeStatsBtn: 'all',
        avatarModalName: 'avatar-modify-modal',
        pageData: pageData,
        activeTab: 'profile',
        user: this.getClearUser(),
        edit_user: this.getClearUser(),
        error: '',
        mode: 'default',
        user_id: null,
        exists: false,
        cropped: null,
        activeProfileTab: 'profile',

        croppieRef: null,

      }
    },
    async beforeMount() {
      this.user.user_id = this.getUserId();
      if (this.user.user_id == this.$store.state.user.user_id) {
        this.$router.push('/profile');
      }
      if(window.location.pathname === '/profile') {
        this.user.user_id = this.$store.state.user.user_id;
      }
      if(!this.user.user_id) {
        if(!this.isSelf(this.user)) {
          let access = await this.$store.dispatch('havePermission', ['crm', this.getPermissionKeyByType()]);
          if(!access) {
            this.permissions({
              permissionDenied: true,
              title: '',
              description: ''
            });
          }
        }
      }
      this.$store.commit('titleStatement', false);
    },
    created() {
      this.$store.commit('titleStatement', false);
    },
    async mounted() {
      await this.getInstruments();
      await this.getAreas();
      await this.getUser();
      this.setMasks();
      this.addEvents();
    },
    destroyed() {
      this.dropEvents();
    },
    watch: {
      'edit_user.is_legal_worker'(a) {
        if(this.edit_user.usertype !== 'workman') { return; }
        let el = $('#passport-container');
        if(a) {
         el.slideDown();
        } else {
          el.slideUp();
        }
      },
      activeTab(a) {
        if(a === 'settings') {
          this.setMasks();
          this.isHiddenPassportContainer = (this.edit_user.usertype === 'workman' && !this.edit_user.is_legal_worker);
        }
      },
      uid: async function (oldv, newv) {
        if (oldv === newv) {
          return;
        }
        this.activeTab = 'profile';
        await this.getUser();
      },
    },
    methods: {

      async createResult() {
        let a = await this.$refs.croppieRef.result();
        console.log(a);
      },
      result(output) {
        console.log(output);
        this.cropped = output;
      },
      update(val) {
        console.log(val);
      },
      cropImage() {

      },
      cropAvatarDialog() {
        if(this.activeTab !== 'settings') { return; }
        this.modifyAvatarDialog();
        setTimeout(() => {
          this.$refs.croppieRef.bind({
            url: this.renderUserAvatar(this.user, ''),
            zoom: 1
          });
        }, 400);

      },
      modifyAvatarDialog() {
        $('#'+this.avatarModalName).modal('show');
      },

      calculateRouteByUsertype(t) {
        return routesByTypes[t] ? routesByTypes[t] : '/coworkers/office-workers/modify';
      },

      toggleActiveStatsBtn(x) {
        this.activeStatsBtn = x;
      },
      toggleStatsTab() {
        this.activeProfileTab = 'stats';
        $('#profile-summary-controls-wrapper-overlay').animate({width: '0'}, 400);
      },
      toggleProfileTab() {
        this.activeStatsBtn = 'all';
        $('#profile-summary-controls-wrapper-overlay').animate({width: '100%'}, 400);
        this.activeProfileTab = 'profile';
      },

      toggleEditMode() {
        this.mode = 'edit';
        setTimeout(() => {
          this.setMasks();
        }, 400);
      },
      toggleDefaultMode() {
        this.fillEditFields();
        this.mode = 'default';
        if (this.activeProfileTab === 'stats') {
          $('#profile-summary-controls-wrapper-overlay').animate({width: '0'}, 400);
        } else {
          $('#profile-summary-controls-wrapper-overlay').animate({width: '100%'}, 400);
        }
      },

      calculatePageTitle() {
        this.pageData.title = (this.$store.state.user && this.$store.state.user.user_id == this.user_id) ? 'Мой профиль' : 'Профиль ' +(this.calculatePageTitleText());
        this.pageData.metaTitle = this.pageData.title;
      },


      allowWatchPersonalInformation(user) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(this.isCoworker(user)) {
          if(this.havePermission('crm', 'watchCoworkersPersonalData')) { return 1; }
        }
        if(user.usertype === 'client') {
          return this.havePermission('crm', 'watchClientPersonalData');
        }
        return 0;
      },
      async getUser() {
        this.loading = true;
        let id = window.location.getParameter('user_id');
        let myProfile = (window.location.pathname === '/profile' && !id);
        this.user_id =  myProfile ? this.$store.state.user.user_id : id;
        let user = (await axios.get('/api/users/profile?user_id=' + this.user_id)).data;
        user = (user.result && user.user) ? user.user : {};
        let except = ['passport_data', 'priceModes'];
        for (let prop in this.user) {
          if(except.indexOf(prop) !== -1) { continue; }
          this.user[prop] = user[prop];
        }
        if(typeof user.additional !== 'object' || !user.additional) { user.additional = {}; }
        this.user.priceModes = Array.isArray(user.priceModes) ? user.priceModes : [];
        if(user.passport_data) {
          for(let prop in this.user.passport_data) {
            this.user.passport_data[prop] = user.passport_data[prop] ? user.passport_data[prop] : '';
          }
        }

        if(!this.user.user_id) {
          this.user.usertype = this.calculateCreatingUsertype();
          this.edit_user.usertype = this.calculateCreatingUsertype();
        } else {
          this.computeUsertype();
        }
        if(window.location.pathname.indexOf('modify') !== -1) {
          let route = this.calculateRouteByUsertype(this.user.usertype);
          if(window.location.pathname !== route) {
            this.$router.replace(route+(window.location.search ? '?'+window.location.search : ''));
          }
        }
        if (user.user_id) {
          let summariesData = await axios.post('/api/get-account-summaries', {user_id: user.user_id});
          if (summariesData.data) {
            this.setAccountSummaries(summariesData.data.summaries);
          }
        }
        this.fillEditFields();

        if (user.user_id) {
          this.calculatePageTitle();
          this.exists = true;
        } else {
          let access = this.allowModifyUser(user);
          if (access) {
            this.user.usertype = this.calculateCreatingUsertype();
            this.edit_user.usertype = this.user.usertype;
            this.pageData.title = 'Создание ' + this.calculatePageTitleText();
            this.pageData.metaTitle = this.pageData.title;
            this.user.user_id = 0;
            this.edit_user.user_id = 0;
            this.activeTab = 'settings';
          } else {
            this.permissions({
              permissionDenied: true
            });
            this.pageData.title = 'Доступ запрещен';
            this.pageData.metaTitle = this.pageData.title;
          }
        }
        this.$store.commit('titleStatement', true);
        this.page();
        this.process = false;
        this.$store.dispatch('setComponentReady', true);
        this.loading = false;
      },
    },
    components: {
      usertypeSelector, summariesComponent
    }
  }
</script>
