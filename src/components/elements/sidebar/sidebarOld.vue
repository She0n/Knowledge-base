<template>
  <div :class="'sidebar-wrapper '+(open ? ' is-visible': '')">
    <div class="sidebar">
      <div class="sidebar-brand">
        <router-link tag="a"  to="/">
          <img src="/static/images/logo.svg" class="logo"  v-on:click="toggleSidebar()">
        </router-link>
      </div>
      <div class="sidebar-underline"></div>
      <div id="close-sidebar" v-on:click="toggleSidebar()">&times;</div>
      <ul class="sidebar-list" id="sidebar-el" >
        <li v-for="node in nodes"  :id="'sidebar-root-item-'+node.key" :class="'sidebar-item   '+(hasChilds(node) ? 'has-submenu' : '')">
          <a :href="node.link" v-if="node.tag === 'a'"  class="sidebar-link  sidebar-link-level-1">
            <img :src="'/static/images/sidebar/'+node.icon" />
            <span class="menu-item-title" v-html="node.title"></span>
          </a>
          <router-link v-if="!hasChilds(node) && !node.tag" :key="'sidebar-key-'+node.key" @click.native="toggleSidebar()" class="sidebar-link sidebar-link-level-1 " :to="node.link">
            <img :src="'/static/images/sidebar/'+node.icon" />
            <span class="menu-item-title" v-html="node.title"></span>
            <span class="c-badge c-badge--info c-badge--xsmall u-ml-xsmall" v-if="displayMessagesBadge(node.id)" v-html="displayMessagesBadge(node.id)"></span>
          </router-link>
          <div v-if="hasChilds(node) && !node.tag">
            <router-link class="sidebar-link  sidebar-link-level-1 trigger" event=""  @click.native.prevent="toggleSidebarItem(node.key, $event)" :to="node.link"   >
              <img :src="'/static/images/sidebar/'+node.icon" />
              <span class="menu-item-title" v-html="node.title"></span>
            </router-link>
            <ul class="sidebar-submenu collapse" :id="'sidebar-submenu-'+node.key">
              <li v-for="node2 in node.childs" v-if="!node2.dev">
                <router-link :to="node2.link" class="sidebar-link child-sidebar-link" @click.native="toggleSidebar()" :key="'sidebar-key-'+node2.key"  >
                  <span class="menu-item-title" v-html="node2.title"></span>
                  <span :class="'c-badge--info' + ' c-badge c-badge--xsmall u-ml-xsmall'" v-if="displayMessagesBadge(node2.id)" v-html="displayMessagesBadge(node2.id)"></span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">

  .sidebar {
    width: 221px;
    background: #fff;
    padding: 20px 30px;
    position: fixed;
    top: 0;
    bottom: 0;
    transition: transform .2s;
    z-index: 700;
    -webkit-transform: translateX(0);
    transform: translateX(0);
    font-size: 14px;
    font-weight: 400;
    &.is-visible {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    a {
      color: #3f4953;
    }

  }

  .sidebar-item {
    margin-bottom: 28px;
  }

  .sidebar-submenu {
    padding: 15px 6px 0;
  }

  a.sidebar-link.child-sidebar-link {
    margin-bottom: 12px;
    display: block;
  }
  .menu-item-title {
    opacity: 0.5;
  }

  .router-link-active > .menu-item-title, .sidebar a:hover > .menu-item-title {
    opacity: 1;
  }

  .sidebar-link-level-1 {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;


  }

  .sidebar-brand {
    height: 45px;
    margin-bottom: 20px;
  }

  .sidebar-underline {
    height: 1px;
    opacity: 0.1;
    background-color: #3f4953;
    margin-bottom: 35px;
  }

  #close-sidebar {
    display: none;
  }


  .sidebar-link {
    img {
      display: inline-block;
      width: 25px;
      height: 25px;
      margin-right: 12px;
    }
  }

  .sidebar-submenu.collapse {
    display: none;
  }
  @media(max-width: 1200px) {
    .sidebar {
      transform: translateX(-300px);
    }
  }
</style>
<script>

  export default {
    props: ['open'],
    data() {
      return {
        mappedMenu: {},
        path: {
          path: window.location.pathname,
          segments: null
        },

        nodes: [],
        menu: [
          {
            title: 'Главная',
            link: '/main',
            icon: 'home.svg',
            id: 'main-menu-item',
            key: 'main'
          },
          /*{
            title: 'Показатели',
            link: '/stats',
            icon: 'speed.png',
            id: 'stats-menu-item',
            key: 'stats',
            usertypes: ['admin'],
            requirements: ['modifyCoworkers'],
            childs: [
              {
                title: "Продажи",
                link: '/stats/sales',
                id: 'sales-stats-menu-item',
                key: 'sales-stats',
                dev: true,
                usertypes: ['admin']
              },
              {
                title: "Кадры",
                link: '/stats/hr',
                id: 'hr-stats-menu-item',
                key: 'hr-stats',
                usertypes: ['admin'],
                requirements: 'modifyCoworkers'
              },
              {
                title: "Производство",
                link: '/stats/prod',
                id: 'prod-stats-menu-item',
                key: 'prod-stats',
                dev: true,
                usertypes: ['admin'],
              },
              {
                title: "Контроль качества",
                link: '/stats/prod',
                id: 'prod-stats-menu-item',
                key: 'otk-stats',
                dev: true,
                usertypes: ['admin'],
              },
              {
                title: "Маркетинг",
                link: '/stats/prod',
                id: 'prod-stats-menu-item',
                key: 'marketing-stats',
                dev: true,
                usertypes: ['admin'],
              }
            ]
          },*/
          {
            title: 'CRM',
            link: '/crm',
            icon: 'modules.png',
            id: 'crm-menu-item',
            key: 'crm',
            childs: [
              {
                title: 'Call-center',
                link: '/crm/call-center',
                id: 'callcenter-menu-item',
                key: 'callcenter'
              },
              {
                title: 'Сделки',
                link: '/crm/leads',
                id: 'crm-rep-menu-item',
                key: 'crm-leads'
              },
              {
                title: 'Контакты',
                link: '/crm/contacts',
                id: 'crm-contacts',
                key: 'crm-contacts'
              },
              {
                title: 'Условный отказ',
                link: '/crm/trash',
                id: 'crm-trash',
                key: 'crm-trash'
              },
            ]
          },
          {
            title: "Сообщения",
            link: "/messages",
            icon: 'docs.png',
            id: "messages-menu-item",
          },
          {
            title: "Сотрудники",
            icon: 'brain.png',
            id: "coworkers-menu-item",
            link: '/coworkers',
            key: 'users',
          },
          {
            title: 'Клиенты',
            link: '/clients',
            icon: 'shirt.png',
            id: 'clients-obs-menu-item',
            key: 'clients',
            dev: true,
            requirements: 'modifyClients',
          }
        ]
      }
    },
    watch: {
      async categories() {
        this.nodes = (await this.getNodes());
      },
      async usertype() {
        this.nodes = (await this.getNodes());
      },
    },
    computed: {
      usertype() {
        return this.$store.state.user ? this.$store.state.user.usertype : false;
      },
      map() {
        return {
          'messages-menu-item': this.$store.state.chat.unreadedDialogsCount,
          'tasks-all': this.$store.state.tasks.tasksLength.all,
          'tasks-in_progress': this.$store.state.tasks.tasksLength.in_progress,
          'tasks-helping': this.$store.state.tasks.tasksLength.helping,
          'tasks-accepting': this.$store.state.tasks.tasksLength.accepting,
          'tasks-observing': this.$store.state.tasks.tasksLength.observing,
          'tasks-projects': this.$store.state.tasks.tasksLength.projects
        };
      }
    },
    async mounted() {
      let splitted = window.location.pathname.split('/');
      splitted = splitted.splice(0, 1);
      this.path.segments = splitted;
      this.nodes = await this.getNodes();
      this.openHiddenMenu();
    },
    methods: {
      openHiddenMenu() {
        setTimeout(() => {
          let activeLink = $('#sidebar-el').find('.router-link-exact-active');
          let closest = activeLink.closest('.has-submenu');
          if(!closest.length) { return; }
          closest.addClass('is-open');
          closest.find('.sidebar-submenu').slideDown(200);
        }, 200);

        // sidebar-el
      },
      toggleSidebarItem(key, e) {
        e.preventDefault();
        let childs = $('#sidebar-submenu-'+key);
        let parent = childs.closest('.sidebar-root-item');
        let rootItems = $('.sidebar-root-item');
        for(let i = 0; i < rootItems.length; i++) {
          let item = $(rootItems[i]);
          if(item.attr('id') === parent.attr('id')) { continue; }
          item.removeClass('is-open');
          item.find('.sidebar-submenu').removeClass('show').slideUp(200);
        }
        if(childs.hasClass('show')) {
          childs.slideUp(200, function() {
            childs.removeClass('show');
          });
          parent.removeClass('is-open');
        } else {
          childs.slideDown(200, function() {
            childs.addClass('show');
          });
          parent.addClass('is-open');
        }
      },
      hasChilds(node) {
        if(!node.childs) { return 0; }
        return node.childs.length;
      },
      async getNodes() {
        /*let menu = JSON.parse(JSON.stringify(this.menu));
        let result = [];
        for(let i = 0; i < menu.length; i++) {
          let item = menu[i];
          let access = await this.checkMenuItem(item);
          if(!access) { continue; }
          if(item.childs) {
            let childs = [];
            for(let j = 0; j < item.childs.length; j++) {
              let access2 = await this.checkMenuItem(item.childs[j]);
              if(!access2) { continue; }
              childs.push(item.childs[j]);
            }
            item.childs = childs;
          }
          result.push(item);
        }
        return result;*/
        let menu = [
          {
            title: "Главная",
            link: "/main",
            icon: "fa fa-home u-mr-xsmall",
            id: "main-menu-item",
            key: '/main'
          }
        ];
        for(let i = 0; i < this.$store.state.categoryTree.length; i++) {
          let cat = this.$store.state.categoryTree[i];
          if(!cat.status) { continue; }
          menu.push({
            title: cat.title,
            link: cat.link,
            icon: 'fa '+(this.hasChilds(cat) ? 'fa-folder-open' : 'fa-folder')+' u-mr-xsmall',
            id: 'cat-'+cat.category_id,
            childs: cat.childs,
            key: cat.key
          });
        }
        if(this.$store.state.user) {
          if(this.$store.state.canModerate) {
            menu.push({
              title: "Модерирование",
              link: "/moderate",
              icon: "fa fa-tasks u-mr-xsmall",
              id: "moderate-menu-item",
              key: 'moderate'
            });
            menu.push({
              title: 'Тесты',
              link: '/tests',
              icon: 'fa fa-list-alt u-mr-xsmall',
              id: 'tests-menu-item',
              key: 'tests'
            });
          }
        }
        menu.push(
          {
            title: "Выход",
            link: "/logout",
            icon: "fa fa-sign-in u-mr-xsmall",
            id: "logout-menu-item",
            key: 'logout'
          }
        );
        this.nodes = menu;
      },
      async checkMenuItem(item) {
        if(!item.requirements && !item.usertypes) { return 1; }
        let menuRequirementsAccess = true;
        let menuRequired = false;
        if(item.requirements) {
          menuRequired = true;
          let menuRequirementsAccess = (await this.$store.dispatch('havePermission', ['crm', item.requirements]));
          if(!menuRequirementsAccess) { return 0; }
        }
        if(item.usertypes) {
          let ut = this.$store.state.user ? this.$store.state.user.usertype : 0;
          let access = item.usertypes.indexOf(ut) !== -1;
          if(!access) {
            if((menuRequirementsAccess && menuRequired)) {
              return 1;
            }
            return 0;
          }
        }
        return 1;
      },
      displayMessagesBadge(id) {
        return this.map[id] ? this.map[id] : 0;
      },
      toggleSidebar() {
        this.$parent.$emit('toggleSidebar');
      }
    }
  }
</script>
