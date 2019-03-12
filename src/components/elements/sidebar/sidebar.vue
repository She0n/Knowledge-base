<template>
  <div :class="'o-page__sidebar js-page-sidebar'+(open ? ' is-visible': '')">
    <div class="sidebar">
      <div class="sidebar-brand">
        <router-link tag="a"  to="/">
          <img src="/static/images/logo.svg" class="logo" @click="toggleSidebar()">
        </router-link>
      </div>
      <div class="sidebar-underline"></div>
      <div id="close-sidebar" v-on:click="toggleSidebar()">&times;</div>
      <ul class="sidebar-list" id="sidebar-el">
        <li v-for="node in nodes"  :id="'sidebar-root-item-'+node.key" :class="'sidebar-item   '+(hasChilds(node) ? 'has-submenu' : '')">
          <a :href="node.link" v-if="node.tag === 'a'"  class="sidebar-link sidebar-link-level-1">
            <img :src="'/static/images/sidebar/'+node.icon" />
            <span class="menu-item-title" v-html="node.title"></span>
          </a>
          <router-link v-if="!hasChilds(node) && !node.tag" :key="'sidebar-key-'+node.key" @click.native="toggleSidebar()" class="sidebar-link sidebar-link-level-1" :to="node.link">
            <img :src="'/static/images/sidebar/'+node.icon" />
            <span class="menu-item-title" v-html="node.title"></span>
            <span class="c-badge c-badge--info c-badge--xsmall" v-if="displayMessagesBadge(node.id)" v-html="displayMessagesBadge(node.id)"></span>
          </router-link>
          <div v-if="hasChilds(node) && !node.tag">
            <router-link class="sidebar-link sidebar-link-level-1 trigger" event=""  @click.native.prevent="toggleSidebarItem(node.key, $event)" :to="node.link"   >
              <img :src="'/static/images/sidebar/'+node.icon" />
              <span class="menu-item-title" v-html="node.title"></span>
            </router-link>
            <ul class="sidebar-submenu collapse" :id="'sidebar-submenu-'+node.key">
              <li v-for="node2 in node.childs" v-if="!node2.dev">
                <router-link :to="node2.link" class="sidebar-link child-sidebar-link" @click.native="toggleSidebar()" :key="'sidebar-key-'+node2.key"  >
                  <span class="menu-item-title" v-html="node2.title"></span>
                  <span :class="'c-badge--info' + ' c-badge c-badge--xsmall'" v-if="displayMessagesBadge(node2.id)" v-html="displayMessagesBadge(node2.id)"></span>
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
    padding: 20px 0;
    position: fixed;
    top: 0;
    bottom: 0;
    transition: transform .2s;
    z-index: 700;
    transform: translateX(0);
    font-size: 14px;
    font-weight: 400;
    &.is-visible {
      transform: translateX(0);
    }
    a {
      color: #3f4953;
    }
  }

  .sidebar-submenu {
    .sidebar-link {
      font-size: 14px;
      font-weight: 300;
      color: #2c2c2c;
      padding: 10px 0 10px 65px;
    }
  }

  a.sidebar-link.child-sidebar-link {
    display: block;
  }
  .menu-item-title {
    opacity: 0.5;
  }

  .sidebar-list .sidebar-link-level-1.router-link-active {
    position: relative;
    background-color: rgba(#1875f0, .1);
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background-color: #1875f0;
    }
    + .sidebar-submenu {
      background-color: rgba(#1875f0, .1);
    }
  }

  .router-link-active > .menu-item-title, .sidebar a:hover > .menu-item-title {
    opacity: 1;
  }

  .sidebar-link-level-1 {
    font-size: 16px;
    font-weight: 500;
    min-height: 55px;
    display: flex;
    align-items: center;
  }

  .sidebar-brand {
    height: 45px;
    margin-bottom: 20px;
    padding: 0 30px;
  }

  .sidebar-underline {
    height: 1px;
    opacity: 0.1;
    background-color: #3f4953;
    margin: 20px 30px;
  }

  #close-sidebar {
    display: none;
  }

  .sidebar-link {
    padding-left: 30px;
    transition: all .3s;
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
    props: ['depth',  'open'],
    data() {
      return {
        mappedMenu: {},
        path: {
          path: window.location.pathname,
          segments: null
        },
        nodes: []
      }
    },
    watch: {
      categories() {
        this.getNodes();
      },
      usertype() {
        this.getNodes();
      },
      profession_id() {
        this.getNodes();
      },
      moderationLength() {
        this.getNodes();
      }
    },
    computed: {
      categories() {
        return this.$store.state.categories;
      },
      profession_id() {
        return this.$store.state.user ? this.$store.state.user.profession_id : false;
      },
      usertype() {
        return this.$store.state.user ? this.$store.state.user.usertype : false;
      },
      moderationLength() {
        return this.$store.state.moderationLength;
      }
    },
    async beforeMount() {
      let splitted = window.location.pathname.split('/');
      splitted = splitted.splice(0, 1);
      this.path.segments = splitted;
      this.getNodes();
      this.highlightMenu();
    },
    methods: {
      toggleSidebarItem(key, e) {
        e.preventDefault();
        let childs = $('#sidebar-submenu-'+key);
        let parent = childs.closest('.sidebar-root-item');
        let rootItems = $('.sidebar-root-item');
        for(let i = 0; i < rootItems.length; i++) {
          let item = $(rootItems[i]);
          if(item.attr('id') === parent.attr('id')) { continue; }
          item.removeClass('is-open');
          item.find('.c-sidebar__submenu').removeClass('show').slideUp(200);
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
        for(let i = 0; i < node.childs.length; i++) {
          if(node.childs[i].status) { return 1; }
        }
        return 0;
      },
      getNodes() {
        let menu = [
          {
            title: "Главная",
            link: "/main",
            icon: "home.svg",
            id: "main-menu-item",
            key: 'main'
          }
        ];
        for(let i = 0; i < this.$store.state.categoryTree.length; i++) {
          let cat = this.$store.state.categoryTree[i];
          if(!cat.status) { continue; }
          menu.push({
            title: cat.title,
            link: cat.link,
            icon: this.hasChilds(cat) ? 'articles.svg' : "goal.svg",
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
              icon: "moderate.svg",
              id: "moderate-menu-item",
              key: 'moderate'
            });
            menu.push({
              title: 'Тесты',
              link: '/tests',
              icon: 'tests.svg',
              id: 'tests-menu-item',
              key: 'tests'
            });
          }
        }
        menu.push(
          {
            title: "Выход из системы",
            link: "/logout",
            icon: "exit.svg",
            id: "logout-menu-item",
            key: 'logout'
          }
        );
        this.nodes = menu;
      },
      displayMessagesBadge(id) {
        if (id !== 'moderate') {
          return 0;
        }
        return this.moderationLength;
      },
      highlightMenu() {
        for (let i = 0; i < this.nodes.length; i++) {
          this.mapNode(this.nodes[i]);
        }
        this.highlightNode(this.path.path);
      },
      mapNode(node) {
        this.mappedMenu[node.link] = node;
        if (node.childs) {
          for (let i = 0; i < node.childs.length; i++) {
            this.mapNode(node.childs[i]);
          }
        }
      },
      highlightNode(incPath) {
        let splitted = incPath.split('/');
        if (splitted.length < 1) {
          return;
        }
        let item = this.mappedMenu[incPath];
        if (item) {
          item.isActive = true;
        }
        splitted = splitted.splice(1, splitted.length - 2);
        if (splitted.length < 1) {
          return;
        }
        let nextPath = '/' + splitted.join('/');
        this.highlightNode(nextPath);
      },
      toggleSidebar() {
        this.$parent.$emit('toggleSidebar');
      },
    }
  }
</script>
