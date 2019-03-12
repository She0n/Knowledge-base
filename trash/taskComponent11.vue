<template>
  <div :class="'task-modal-outer '+(allowEditTask ? 'task-modal-outer-edit' : '')" :id="id">
    <div class="task-modal-backdrop" @click="$router.push(clearLinkMode())"></div>
    <div class="task-modal-inner c-scrollbar">
      <div class="task-modal-wrap">
        <div class="task-modal-left u-mr-small">
          <div class="c-card">
            <div class="task-modal-header u-pv-small u-ph-medium">
              <div class="task-modal-title">
                <input type="text" v-model="e_task.title" v-if="allowEditTask"  :class="'task-modal-title-input '+(e_task.title ? 'blank' : '')"/>
                <div class="task-modal-title-input u-border-bottom-zero" v-html="e_task.title" v-else ></div>
                <div class="task-modal-header-icons">
                  <div @click="set('is_important', !e_task.is_important)" title="Горит">
                    <svg class="task-modal-header-icon task-modal-important-icon" fill="none"  viewBox="0 0 14 18"  xmlns="http://www.w3.org/2000/svg" v-if="!e_task.is_important">
                      <path d="M0.69756 9.07097C0.840824 8.31826 1.10151 7.58926 1.46436 6.9089C1.59193 7.27635 1.7726 7.626 1.9999 7.94223C2.19977 8.22031 2.53971 8.26665 2.78971 8.15111C3.02857 8.04072 3.20326 7.77839 3.16133 7.47009C2.96347 6.01505 3.47222 4.45207 4.45424 3.27647C5.20363 2.37935 6.16144 1.68572 7.22257 1.14386C7.02349 1.94688 7.08108 2.81315 7.29582 3.56521L7.29582 3.56521C7.59055 4.59735 8.15635 5.52765 8.67812 6.38556C8.78432 6.56018 8.88871 6.73181 8.98861 6.90069C9.54275 7.83745 10.0081 8.71137 10.1263 9.6305C10.1687 9.9604 10.4261 10.1453 10.6498 10.1922C10.8763 10.2396 11.2005 10.1706 11.3651 9.86217C11.6322 9.36186 11.9297 8.80333 12.1227 8.18365L12.1227 8.18364C12.1537 8.08403 12.1829 7.9826 12.2098 7.87962C12.2855 8.11165 12.3462 8.35634 12.3942 8.61902C12.5649 9.5537 12.5385 10.5398 12.4371 11.5263C12.3012 12.6093 12.0314 13.6681 11.4879 14.5065L11.4861 14.5094C10.8554 15.4955 9.83153 16.222 8.67751 16.6311C6.56103 17.0067 4.50672 16.7226 2.9857 15.4184C2.29134 14.6971 1.94325 14.2646 1.70798 13.8923C1.51285 13.5836 1.3901 13.3107 1.20901 12.9082C1.16723 12.8153 1.12235 12.7155 1.07275 12.6068C0.608211 11.5206 0.47068 10.263 0.69756 9.07097Z" stroke="#7F8FA4" stroke-width="1.1"/>
                    </svg>
                    <svg  class="task-modal-header-icon task-modal-important-icon"  viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
                      <path d="M2.60736 15.8184C1.1762 14.3342 1.07959 13.9464 0.569713 12.8293C0.059581 11.64 -0.0902869 10.2688 0.15726 8.96813C0.38449 7.77425 0.885697 6.64011 1.60543 5.64972C1.66351 5.5698 1.79321 5.61726 1.79602 5.71602C1.81525 6.39089 2.04711 7.06556 2.44651 7.62123C2.50619 7.70427 2.63013 7.64553 2.61635 7.5442C2.39523 5.91812 2.96318 4.20354 4.03213 2.92387C5.088 1.65986 6.51082 0.790144 8.02037 0.176121C8.11867 0.136137 8.21322 0.269054 8.15433 0.357333C7.57939 1.21921 7.53534 2.40087 7.82469 3.41419C8.15418 4.5681 8.84412 5.5762 9.46198 6.62066C10.0141 7.55396 10.5375 8.5162 10.6718 9.56033C10.6849 9.66214 10.8316 9.69369 10.8799 9.60314C11.15 9.09733 11.4223 8.58274 11.5975 8.02011C11.7648 7.48284 11.8658 6.92375 11.8141 6.37774C11.804 6.27077 11.9513 6.20262 12.0136 6.29017C12.4939 6.96518 12.779 7.66474 12.9353 8.52019C13.1198 9.5303 13.0879 10.5773 12.9836 11.5886C12.8436 12.7083 12.5594 13.8646 11.9495 14.8057C11.2333 15.9255 10.0843 16.7234 8.82536 17.1621C8.82049 17.1638 8.81549 17.1652 8.81041 17.1661C6.57617 17.5701 4.30802 17.2901 2.60736 15.8184Z" fill="#F3705A"/>
                      <path d="M4.40397 16.4551C3.63542 15.658 3.58354 15.4498 3.30973 14.8499C3.03578 14.2112 2.9553 13.4749 3.08823 12.7764C3.20084 12.1848 3.43873 11.6205 3.77851 11.119C3.83392 11.0372 3.96787 11.0836 3.97922 11.1817C4.00861 11.4359 4.09288 11.6856 4.22359 11.9086C4.2753 11.9968 4.39835 11.9422 4.39091 11.8402C4.33101 11.0193 4.63252 10.1729 5.16908 9.5306C5.6927 8.90376 6.38436 8.45749 7.12557 8.13318C7.22279 8.09064 7.3294 8.2313 7.28328 8.32687C7.0709 8.76695 7.06909 9.31538 7.20572 9.79391C7.38267 10.4136 7.75317 10.9549 8.08497 11.5158C8.35079 11.9652 8.60423 12.427 8.70578 12.9219C8.72642 13.0224 8.88078 13.0537 8.9284 12.9628C9.04484 12.7404 9.15547 12.5124 9.23178 12.2673C9.30001 12.0482 9.34769 11.8224 9.35453 11.5979C9.3578 11.4906 9.51654 11.4242 9.5725 11.5159C9.76094 11.8248 9.87984 12.1509 9.95016 12.5359C10.0492 13.0783 10.0321 13.6406 9.9761 14.1836C9.90094 14.7849 9.74832 15.4059 9.42077 15.9113C9.03682 16.5116 8.42121 16.9396 7.74649 17.1755C7.74162 17.1772 7.73661 17.1785 7.73153 17.1794C6.53287 17.3955 5.31634 17.2446 4.40397 16.4551Z" fill="#FFD15C"/>
                    </svg>
                  </div>
                  <div @click="set('is_favourite', !e_task.is_favourite)">
                    <svg :class="'task-modal-header-icon task-modal-favourite-icon ' +(e_task.is_favourite ? 'active' : '')" title="В закладки" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 0.618034L10.6574 5.71885C10.7912 6.13087 11.1752 6.40983 11.6084 6.40983H16.9717L12.6327 9.56231C12.2822 9.81695 12.1356 10.2683 12.2694 10.6803L13.9268 15.7812L9.58779 12.6287C9.2373 12.374 8.7627 12.374 8.41221 12.6287L4.0732 15.7812L5.73056 10.6803C5.86443 10.2683 5.71777 9.81695 5.36729 9.56231L1.02828 6.40983H6.39159C6.82481 6.40983 7.20877 6.13087 7.34265 5.71885L9 0.618034Z" stroke="#7F8FA4"/>
                    </svg>
                  </div>
                  <div title="Добавить теги"  @click="toggleTagsDropdown($event)">
                    <svg  :class="'task-modal-header-icon task-modal-tags-icon '+(tagsAreShown ? 'active' : '')" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2117 14.5072L15.7657 19.6025C15.564 19.7912 15.2476 19.7806 15.059 19.579L6.47656 10.4058C6.38684 10.3099 6.33845 10.1825 6.34184 10.0513L6.46903 5.12216C6.47589 4.85611 6.68996 4.64206 6.95601 4.63522L12.3018 4.49776C12.4446 4.49408 12.5821 4.55167 12.6797 4.65599L17.1457 9.42934L21.2353 13.8005C21.4239 14.0021 21.4134 14.3185 21.2117 14.5072Z" stroke="#7F8FA4"/>
                      <path d="M19.11 14.5072L13.6639 19.6025C13.4623 19.7912 13.1459 19.7806 12.9572 19.579L3.85862 9.85407C3.77195 9.76143 3.72373 9.63932 3.72373 9.51247L3.72373 4.44562C3.72373 4.16948 3.94759 3.94562 4.22373 3.94562L9.69642 3.94562C9.8348 3.94562 9.967 4.00297 10.0615 4.10402L14.7909 9.15896L19.1335 13.8005C19.3221 14.0021 19.3116 14.3185 19.11 14.5072Z" fill="white" stroke="#7F8FA4"/>
                      <circle cx="7.35625" cy="7.35622" r="1.55089" stroke="#7F8FA4"/>
                    </svg>
                  </div>
                  <div :class="'c-dropdown dropdown '+(tagsAreShown ? 'show' : '')" id="task-tags-dropdown">
                    <div class="c-dropdown__menu dropdown-menu dropdown-menu-right c-dropdown-menu-cbs">
                      <div class="c-dropdown__item" v-for="tag, index in $store.state.taskTags">
                        <div
                          class="c-choice c-choice--round c-choice--checkbox abs c-choice--checkbox--small c-choice--info">
                          <input :id="'active-task-tag-'+index" :value="index" type="checkbox" v-model="e_task.tags"
                                 class="c-choice__input">
                          <label :for="'active-task-tag-'+index" class="c-choice__label">
                            <span v-html="tag.title"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task-modal-subtitle-bar">
                <div class="task-modal-tags" v-if="e_task.tags.length">

                  <div class="trigger task-modal-tag" v-for="tag, i in e_task.tags" @click="e_task.tags.splice(i, 1)">
                    <div class="task-modal-tag-icon"><i :class="'fa fa-circle-o u-color-'+getTagCls(tag)"></i></div>
                    <div class="" v-html="getTagTitle(tag)"></div>
                  </div>
                </div>
                <div class="task-modal-subtitle-tools">

                </div>
              </div>
              <div class="task-modal-target">
                <div class="material-input-blank-wrapper">
                  <materialInput :required="true" placeholderVal="Ценный конечный продукт" v-model="e_task.target"></materialInput>
                </div>
              </div>
              <div class="task-modal-editor">
                <div class="task-modal-editor-inner">
                  <div
                    :class="'hidden-editr-toolbar ' +(!taskEditorToolbar ? 'no-toolbar' : '')+ (e_task.checklist.length ? ' task-modal-editor-w-checklist' : '')">
                    <wysiwyg v-model="e_task.description" placeholder=""/>
                  </div>
                  <div class="task-modal-content-icons">
                    <div class="task-modal-header-icons">
                      <svg class="task-modal-header-icon task-modal-header-icon-right" @click="taskEditorToolbar = !taskEditorToolbar" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.64203 0.663994H8.16799L13.79 15H12.3242L10.5774 10.5426H4.05191L2.32516 15H0.879517L6.64203 0.663994ZM10.1156 9.37804L7.34478 2.02933L4.47356 9.37804H10.1156Z" fill="#7F8FA4"/>
                        <path d="M20.1128 14.8906C19.9224 14.9595 19.7543 15.0142 19.6085 15.0547C19.4667 15.0993 19.3047 15.1215 19.1224 15.1215C18.8064 15.1215 18.5532 15.0486 18.3628 14.9028C18.1765 14.7529 18.057 14.5362 18.0043 14.2526H17.9679C17.7045 14.5443 17.421 14.7671 17.1172 14.921C16.8174 15.0749 16.4548 15.1519 16.0295 15.1519C15.5798 15.1519 15.2092 15.0142 14.9175 14.7387C14.6299 14.4633 14.4861 14.1027 14.4861 13.6571C14.4861 13.4262 14.5185 13.2196 14.5833 13.0373C14.6481 12.855 14.7453 12.691 14.875 12.5451C14.9762 12.4236 15.1099 12.3163 15.276 12.2231C15.4421 12.1259 15.5981 12.0489 15.7439 11.9922C15.9262 11.9233 16.2948 11.7957 16.8498 11.6094C17.4088 11.423 17.7856 11.2772 17.98 11.1719V10.5703C17.98 10.5177 17.9679 10.4164 17.9435 10.2665C17.9233 10.1166 17.8767 9.97483 17.8038 9.84115C17.7228 9.69127 17.6073 9.56164 17.4574 9.45226C17.3116 9.33884 17.103 9.28212 16.8316 9.28212C16.6452 9.28212 16.471 9.31453 16.309 9.37935C16.151 9.44011 16.0396 9.50492 15.9748 9.57379C15.9748 9.65481 15.993 9.77431 16.0295 9.9323C16.07 10.0903 16.0903 10.2361 16.0903 10.3698C16.0903 10.5116 16.0254 10.6412 15.8958 10.7587C15.7702 10.8762 15.594 10.9349 15.3672 10.9349C15.1646 10.9349 15.0147 10.864 14.9175 10.7222C14.8243 10.5764 14.7778 10.4144 14.7778 10.2361C14.7778 10.0498 14.8426 9.87153 14.9722 9.70139C15.1059 9.53126 15.278 9.37935 15.4887 9.24567C15.671 9.13224 15.8918 9.03704 16.151 8.96007C16.4103 8.87906 16.6635 8.83855 16.9106 8.83855C17.2508 8.83855 17.5466 8.86285 17.7977 8.91146C18.0529 8.95602 18.2838 9.05527 18.4904 9.20921C18.697 9.35909 18.853 9.56366 18.9583 9.82292C19.0677 10.0781 19.1224 10.4083 19.1224 10.8134C19.1224 11.3927 19.1163 11.9071 19.1041 12.3568C19.092 12.8024 19.0859 13.2905 19.0859 13.8212C19.0859 13.9792 19.1122 14.1048 19.1649 14.1979C19.2216 14.2911 19.3067 14.3701 19.4201 14.4349C19.4809 14.4714 19.5761 14.4916 19.7057 14.4957C19.8394 14.4997 19.9751 14.5017 20.1128 14.5017V14.8906ZM17.9922 11.6823C17.6478 11.7836 17.346 11.8828 17.0868 11.98C16.8275 12.0773 16.5865 12.1988 16.3637 12.3446C16.1611 12.4824 16.0011 12.6464 15.8837 12.8368C15.7662 13.0232 15.7074 13.246 15.7074 13.5052C15.7074 13.8414 15.7945 14.0885 15.9687 14.2465C16.147 14.4045 16.3718 14.4835 16.6432 14.4835C16.9308 14.4835 17.184 14.4146 17.4028 14.2769C17.6215 14.1351 17.8058 13.969 17.9557 13.7787L17.9922 11.6823Z" fill="#7F8FA4"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="task-modal-content-icons u-mt-xsmall">
                  <div class="task-modal-header-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" title="Добавить пункт чек-листа" class="task-modal-header-icon" @click="checklistTab = !checklistTab" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 594.149 594.149" style="enable-background:new 0 0 594.149 594.149;" xml:space="preserve">
		                  <path d="M448.8,161.925l-35.7-35.7l-160.65,160.65l35.7,35.7L448.8,161.925z M555.899,126.225l-267.75,270.3l-107.1-107.1    l-35.7,35.7l142.8,142.8l306-306L555.899,126.225z M0,325.125l142.8,142.8l35.7-35.7l-142.8-142.8L0,325.125z" fill="#9699a2"/>
                    </svg>
<svg title="Добавить файл" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="task-modal-header-icon task-modal-files-ico" @click="selectTaskFile()">
			<path d="M21.333,21.333h213.333v96c0,5.891,4.776,10.667,10.667,10.667h96v74.667h21.333v-85.333     c-0.009-2.827-1.132-5.537-3.125-7.541L252.875,3.125C250.87,1.132,248.16,0.009,245.333,0H10.667C4.776,0,0,4.776,0,10.667v448     c0,5.891,4.776,10.667,10.667,10.667H224V448H21.333V21.333z M256,36.416l70.251,70.251H256V36.416z" fill="#9699a2"/>
			<path d="M373.333,234.667c-76.583,0-138.667,62.083-138.667,138.667S296.75,512,373.333,512S512,449.917,512,373.333     C511.918,296.784,449.883,234.749,373.333,234.667z M373.333,490.667C308.532,490.667,256,438.135,256,373.333     S308.532,256,373.333,256s117.333,52.532,117.333,117.333C490.596,438.106,438.106,490.596,373.333,490.667z" fill="#9699a2"/>
			<path d="M431.499,362.667H384v-47.52c0-5.891-4.776-10.667-10.667-10.667s-10.667,4.776-10.667,10.667v47.52h-47.52     c-5.891,0-10.667,4.776-10.667,10.667S309.256,384,315.147,384h47.52v47.52c0,5.891,4.776,10.667,10.667,10.667     S384,437.411,384,431.52V384h47.499c5.891,0,10.667-4.776,10.667-10.667S437.39,362.667,431.499,362.667z" fill="#9699a2"/>
</svg>
                  </div>
                </div>
              </div><!-- // .c-stage__panel -->

            </div>
          </div>
          <div class="c-card u-p-medium u-mt-small " v-show="e_task.checklist.length ||  checklistTab">
            <div class="task-editor-checklist" v-if="e_task.checklist.length">
              <div class="u-mb-small u-text-bold">
                <span>Чек-лист задачи</span>
              </div>
              <div class="edit-task-checklist-items c-todo-stream">
                <div :class="'c-todo  u-pl-zero '+(item.checked ? ' is-completed' : '')" v-for="item, itemIndex in e_task.checklist">
                  <div class="u-relative">
                    <input :id="'active-task-cl-'+itemIndex" name="active" type="checkbox"
                           v-model="item.checked" class="c-todo__input">
                    <label :for="'active-task-cl-'+itemIndex" class="c-todo__label"
                           :id="'active-task-cl-label-'+itemIndex"
                           @contextmenu="openCheckListMenu(itemIndex, $event)">
                      <input type="text" v-if="item.edit" :ref="'eTaskClInput'+itemIndex" v-model="item.title"
                             class="c-input c-input-transparent-x" @keyup="keypressCheckList($event, item)"
                             @blur="item.edit = false;" :mounted="setFocusCheckList(itemIndex)">
                      <span v-html="item.title" v-else></span>
                    </label>
                    <div class="checklist-context c-dropdown__menu dropdown-menu dropdown-menu-right"
                         :id="'active-task-cl-label-context-'+itemIndex" :key="itemIndex"
                         :mounted="focusEl(itemIndex)" v-if="activeChecklistContext === itemIndex">
                      <div class="c-dropdown__item dropdown-item trigger"
                           @click="editCheckListItem(item, itemIndex)">редактировать
                      </div>
                      <div class="c-dropdown__item dropdown-item trigger"
                           @click="e_task.checklist.splice(itemIndex, 1)">удалить
                      </div>
                    </div>
                  </div>
                </div>
              </div> <!-- items -->
            </div>
            <div id="checklist-tab" v-if="checklistTab">
              <div class="task-editor-toolbar-additional u-mt-small">
                <materialInput :submit="createtaskChecklistItem" v-model="newCheckListItemTitle" placeholderVal="Новый пункт в чеклисте">
                </materialInput>
              </div>
            </div>
          </div>
          <div class="c-card u-p-medium u-mt-small" v-if="e_task.files.length">
            <div id="files-tab" class="task-editor-checklist " >
              <div class="u-mb-small u-text-bold">
                <span>Прикрепленные файлы</span>
              </div>
              <div class="u-mt-small task-editor-toolbar-additional">
                <div class="task-editor-file u-mb-xsmall" v-for="file in e_task.files">
                  <a :href="basePath+file.document_name" class="u-text-mute u-color-info-hover" download>
                    <i :class="'fa-file-'+(isImageExtension(file.document_name) ? 'image-o' : 'text-o')+' fa  u-mr-xsmall'"></i><span v-html="file.document_name"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="c-card u-mt-small">
            <div class="n-add-post-header-wrapper u-border-bottom">
              <div class="u-p-medium n-padding-x-1">
                <div class="n-add-post-header">
                  <div class="n-add-post-avatar">
                    <div class="c-avatar c-avatar--xsmall"><img
                      :src="renderUserAvatar($store.state.user)"
                      onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
                  </div>
                  <div class="n-add-post-area">
                    <textarea placeholder="Добавить комментарий" class="c-input" style="height: 42px;"></textarea></div>
                </div>
              </div>
            </div>
            <div class="u-p-medium">
              asd
            </div>
          </div>
        </div>
        <div class="task-modal-right c-card u-pv-small u-ph-medium">
          <materialInput type="datetime" v-if="showStartDate"  :placeholderVal="isPast(e_task.start_date) ? 'Дата начала' : 'Приступить к задаче'" v-model="e_task.start_date"
                         :disabledDates="disabledDates"/>
          <materialInput type="datetime"  placeholderVal="Крайний срок" :required="true" v-model="e_task.deadline"
                         :disabledDates="disabledDates"/>
          <singleRelatedUserComponent :selectedUserTypes="['admin', 'coworker']" title="Ответственный" :user="e_task.responsibleUser"></singleRelatedUserComponent>
          <materialInput v-if="0" type="tagsUsers" placeholderVal="Ответственный" :required="true" :selectedTagUser="e_task.responsibleUser" :allowUserTypes="aut" :multipleTagUsers="false"></materialInput>
          <div class="task-modal-row" v-if="0">
            <div class="task-modal-k">Ответственный:</div>
            <div class="task-modal-v">
              <div class="u-inline-block task-modal-tags-users-wrapper">

                <!-- 'renderUserType', 'renderUserAvatar', 'user', 'title', 'action', 'selectTitle', 'renderUserRealName' -->
              </div>
              <div :class="'task-modal-additional-toggler '+(acceptingUserEl ? 'active' : '')" @click="toggleEl('acceptingUser')">Принимающий</div>
              <div :class="'task-modal-additional-toggler '+(initiatingUserEl ? 'active' : '')" @click="toggleEl('initiatingUser')">Инициатор</div>
              <div :class="'task-modal-additional-toggler '+(coperformersUsersEl ? 'active' : '')" @click="toggleEl('coperformersUsers')">Соисполнители</div>
              <div :class="'task-modal-additional-toggler '+(observersUsersEl ? 'active' : '')" @click="toggleEl('observersUsers')">Наблюдатели</div>
            </div>
          </div> <!-- end resp -->
          <div class="task-modal-tab-content" v-show="activeTab === 'details'" :key="'task-modal-tab-details'" v-if="0">

            <div class="u-bg-white task-modal-padding u-border-top u-border-bottom mh-200  u-width-100">

              <!--

              -->
              <div class="task-modal-row task-modal-row-togglable" id="acceptingUser" >
                <div class="task-modal-k">Принимающий:</div>
                <div class="task-modal-v">
                  <div class="u-inline-block task-modal-tags-users-wrapper">
                    <tagsUsers :selected="e_task.acceptingUser" :allowUserTypes="aut"  ></tagsUsers>
                  </div>
                </div>
              </div>
              <div class="task-modal-row task-modal-row-togglable" id="initiatingUser">
                <div class="task-modal-k">Инициировавший:</div>
                <div class="task-modal-v">
                  <div class="u-inline-block task-modal-tags-users-wrapper">
                    <tagsUsers :selected="e_task.initiatorUser" :allowUserTypes="aut"  ></tagsUsers>
                  </div>
                </div>
              </div>
              <div class="task-modal-row task-modal-row-togglable" id="coperformersUsers">
                <div class="task-modal-k">Соисполнители:</div>
                <div class="task-modal-v">
                  <div class="">
                    <tagsUsers :selected="e_task.performers_list" :allowUserTypes="aut" placeholderVal="Не выбраны" :multiple="true"  ></tagsUsers>
                  </div>
                </div>
              </div>
              <div class="task-modal-row task-modal-row-togglable" id="observersUsers">
                <div class="task-modal-k">Наблюдатели:</div>
                <div class="task-modal-v">
                  <div class="">
                    <tagsUsers :selected="e_task.observers_list" :allowUserTypes="aut" :multiple="true" placeholderVal="Не выбраны"  ></tagsUsers>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>

    </div>
    <div class="task-modal-buttons u-bg-white task-modal-padding u-border-top u-width-100" style="display: none;">
      <button class="c-btn c-btn--success c-btn--small">выполнить</button>
      <button class="c-btn с-btn--success c-btn--small" v-if="1" @click="modifyTask()">сохранить</button>
    </div>
  </div>

</template>
<script>
  import tasksMixin from '@/mixins/tasksMixin.vue';
  import tagsUsers from '@/components/tagsUsers.vue';
  import dateTimePicker from '@/components/elements/dateTimePicker.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import moment from 'moment';
  import materialInput from '@/components/elements/materialInput.vue';
  import singleRelatedUserComponent from '@/components/singleRelatedUserComponent.vue';
  const imageExtensions = ['jpg', 'jpeg', 'bpm', 'png', 'psd'];
  export default {
    mixins: [tasksMixin, commonMixin],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      task: {},
      e_task: {},
      modifyTask: {},
    },
    data() {
      return {
        id: 'taskModal',
        taskEditorToolbar: false,
        checklistTab: false,
        filesTab: false,
        newCheckListItemTitle: '',
        showStartDate: false,
        tagsAreShown: false,
        outsideClicks: 0,
        aut: ['admin', 'coworker'],
        basePath: window.axios.defaults.baseURL+'/files/',
        allowEditTask: true,
        activeChecklistContext: '',
        acceptingUserEl: false,
        initiatingUserEl: false,
        coperformersUsersEl: false,
        observersUsersEl: false,
        taskStartDateEl: false,
        mode: 'view',
        disabledDates: {
          to: null
        },
        tabs: {
          details: {title: 'Детали'},
          history: {title: 'История'}
        },
        activeTab: 'details'
      };
    },
    mounted() {
      let $el = $('#edit-task-checklist');
      if (!$el) {
        return;
      }
      this.recalculateData();
    },
    destroyed() {
      this.hideTagsDropdown();
      this.hideModal();
    },
    watch: {
      'task.task_id'() {
        this.recalculateData();
      },
      show(v) {
        this.toggleModal(v);
      },
      'e_task.tags'() {
        if (this.e_task.tags.length === Object.keys(this.$store.state.taskTags).length || !this.e_task.tags.length) {
          this.hideTagsDropdown();
        }
      },
    },
    methods: {
      isPast(a) {
        return window.dateFormatter.isPast(a);
      },
      isImageExtension(name) {
        let ext = name.split('.');
        ext = ext[ext.length-1];
        return imageExtensions.indexOf(ext.toLowerCase()) !== -1;
      },
      selectTaskFile() {
        window.Uploader.addCallback(this.confirmSelectTaskFile);
        window.Uploader.setAcceptance('*');
        window.Uploader.setMultiple(true);
        window.Uploader.selectFile();
      },
      confirmSelectTaskFile() {
        let form = $('#uploadForm');
        if (!form.length) {
          return;
        }
        let formData = new FormData(form[0]);
        axios.post('/api/files/upload-task-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if (parseInt(response.status) === 200) {
            if (response.data.result) {
              this.e_task.files = this.e_task.files.concat(response.data.files);
            } else {

            }
            window.Uploader.reset();
          }
        });
      },
      keypressCheckList($event, item) {
        this.submitEnter($event, () => {
          this.changeItemProp(item, 'edit', false);
        });
      },
      changeItemProp(item, prop, val) {
        item[prop] = val;
      },
      setFocusCheckList(i) {
        setTimeout(() => {
          this.$refs['eTaskClInput' + i][0].focus();
        }, 100);
      },
      editCheckListItem(item, index) {
        for (let i = 0; i < this.e_task.checklist.length; i++) {
          if (index === i) {
            item.edit = !item.edit;
          } else {
            this.e_task.checklist[i].edit = false;
          }
        }
      },
      focusEl(index) {
        $('#active-task-cl-label-context-' + index).focus();
      },
      openCheckListMenu(ind, e) {
        e.preventDefault();
        this.activeChecklistContext = ind;
        let body = $('body');
        body.off('click.clm');
        body.on('click.clm', () => {
          this.activeChecklistContext = null;
          $('body').off('click.clm');
        });
      },

      clearDeadline(e) {
        this.e_task.deadline = null;
        e.stopPropagation();
        $('#deadline-wrapper')
      },
      recalculateData() {
        // recalculate toggled tabs
        if(this.e_task.performers_list.length) {
          this.toggleEl('coperformersUsers', true);
        }
        if(this.e_task.observers_list.length) {
          this.toggleEl('observersUsers', true);
        }
        if(this.e_task.responsibleUser.user_id !== this.e_task.acceptingUser.user_id) {
          this.toggleEl('acceptingUser', true);
        }
        if(this.e_task.initiatorUser.user_id !== this.e_task.responsibleUser.user_id) {
          this.toggleEl('initiatingUser', true);
        }
        if(this.task.task_id) {
          this.mode = 'edit';
        } else {
          this.mode = 'view';
        }
        this.disabledDates = {
          to: new Date(moment().subtract(1, 'days')),
        };
      },
      set(k, v) {
        this.e_task[k] = v;
      },
      toggleTagsDropdown(e) {
        if (this.tagsAreShown) {
          this.hideTagsDropdown();
        } else {
          this.showTagsDropdown();
        }
      },
      showTagsDropdown() {
        console.log('show');
        let id = 'task-tags-dropdown';
        this.tagsAreShown = true;
        $('body').on('click.task-tags-dropdown', (e) => {
          let $target = $(e.target);
          if ($target.attr('id') === id || $target.closest('#' + id).length || e.target.id === 'task-tags-toggler') {
            return;
          }
          this.outsideClicks++;
          if (this.outsideClicks > 1) {
            this.hideTagsDropdown();
          }
        });
      },
      hideTagsDropdown() {
        console.log('hide');
        this.outsideClicks = 0;
        this.tagsAreShown = false;
        $('body').off('click.task-tags-dropdown');
      },
      submitEnter(e, cb) {
        if (e.key !== 'Enter') {
          return;
        }
        if (e.shiftKey !== false) {
          return;
        }
        cb();
      },
      createtaskChecklistItem() {
        if (!this.newCheckListItemTitle) {
          return;
        }
        this.newCheckListItemTitle = this.newCheckListItemTitle.toString().trim();
        if (!this.newCheckListItemTitle) {
          return;
        }
        this.e_task.checklist.push({
          title: this.newCheckListItemTitle,
          delimeter: false,
          checked: false,
          edit: false
        });
        this.newCheckListItemTitle = '';
      },
      escapeListener(e) {
        if (e.key !== 'Escape') {
          return;
        }
        this.$parent.modalMode = null;
      },
      toggleModal(v) {
        let el = $('#' + this.id);
        let el2 = el.find('.task-modal-backdrop');
        if (v) {
          el.show();
          el2.stop().fadeIn(300);
          el.addClass('show');
          $('body').addClass('task-mode');
          window.addEventListener('keydown', this.escapeListener);
        } else {
          this.hideModal();
        }
      },
      hideModal() {
        let el = $('#' + this.id);
        let el2 = el.find('.task-modal-backdrop');
        el2.stop().fadeOut(300, () => {
          el.hide();
        });
        el.removeClass('show');
        window.removeEventListener('keydown', this.escapeListener);
        $('body').removeClass('task-mode');
      },
      toggleEl(a, arg) {
        let $el = $('#' + a);
        if(typeof arg === 'undefined') {
          arg = !$el.is(":visible");
        }
        if(typeof this[a+'El'] !== 'undefined') {
          this[a+'El'] = arg;
        }
        if(arg) {
          $el.slideDown(200);
        } else {
          $el.slideUp(200);
        }
      },
    },
    components: {tagsUsers, dateTimePicker, materialInput, singleRelatedUserComponent }
  }
</script>
