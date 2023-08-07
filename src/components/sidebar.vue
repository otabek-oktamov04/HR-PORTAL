<template>
  <sidebar-menu
    class="sidebar"
    :menu="menu"
    @item-click="onItemClick"
    @collapse="onCollapse"
    :hideToggle="true"
    width="250px"
    :show-one-child="true"
    @itemClick="onItemClick"
  >
    <template v-slot:header>
      <div
        style="
          padding: 20px;
          display: flex;
          justify-content: center;
          background: white;
        "
      >
        <i class="fa-solid fa-arrow-right-arrow-left"></i>
        <img src="/public/logo.png" style="height: 70px" />
      </div>
    </template>
    <template v-slot:toggle-icon>
      <i class="fa-solid fa-arrow-right-arrow-left"></i>
    </template>
  </sidebar-menu>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      menu: [
        {
          href: "/home",
          title: "Home",
          icon: "fa fa-home",
        },
        {
          title: "Organization",
          icon: "fa fa-sitemap",
          exact: true,
          child: [
            {
              href: "/addDepartment",
              title: "Add Department",
              exact: true,
            },
            {
              href: "/removeDepartment",
              exact: true,
              title: "Remove Department",
            },
            {
              exact: true,
              href: "/addPosition",
              title: "Add Position",
            },
            {
              exact: true,
              href: "/removePosition",
              title: "Remove Position",
            },
            {
              exact: true,
              href: "/changePosition",
              title: "Change Position",
            },
          ],
        },
        {
          title: "Employee",
          exact: true,
          icon: "fa fa-user",
          child: [
            {
              href: "/employeeChanges",
              title: "Employee Changes",
              exact: true,
            },
            {
              href: "/employee-termination",
              title: "Employee Removal",
              exact: true,
            },
            {
              href: "/secondaryPosition",
              exact: true,
              title: "Secondary Position",
            },
          ],
        },
        {
          href: "/fte",
          title: "FTE",
          icon: "fa fa-chart-simple",
        },
        {
          href: "/approvals",
          title: "Approvals",
          icon: "fa fa-clipboard-check",
        },
        {
          href: "/valueList",
          title: "Value Lists",
          icon: "fa fa-list-ul",
        },

        {
          title: "Users",
          icon: "fa fa-users",
          exact: true,
          child: [
            {
              href: "/userCreate",
              title: "Create User",
              exact: true,
            },
            {
              exact: true,
              href: "/userList",
              title: "Deactivate / Re-activate ",
            },
          ],
        },
      ],
    };
  },
  methods: {
    onItemClick(e, i) {
      // console.log("onItemClick");
    },
    onCollapse(c) {
      console.log("onCollapse");
      // this.collapsed = c;
    },
  },
};
</script>

<style>
.v-sidebar-menu.vsm_expanded .vsm--link_level-1.vsm--link_open {
  background: linear-gradient(#873c03, #873c03), #873c03;
  text-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0;
  box-shadow: rgba(0, 0, 0, 0.25) 0 1px 0,
    inset rgba(255, 255, 255, 0.16) 0 1px 0;
}

.v-sidebar-menu .vsm--link_level-1.vsm--link_hover {
  background: #873c03;
}

.v-sidebar-menu .vsm--dropdown {
  background-color: #cc5c06;
}

.sidebar.v-sidebar-menu {
  /* background: #2a3f54; */
  background: #f58025;
}

.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
}

.vsm--link_open .vsm--icon {
  background-color: transparent !important;
}
.vsm--title {
  color: #fff;
  font-weight: 700 !important;
  font-family: "Helvetica Neue", sans-serif;
  font-size: 12px;
  line-height: 20px;
}

.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: "\f105";
  font-family: "FontAwesome";
}

.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f07e";
  font-family: "FontAwesome";
}

.header {
  padding: 20px 0 !important;
  text-align: center;
}

.vsm--toggle-btn {
  background-color: #873c03 !important;
  color: #fff;
  border-top: 1px solid rgb(75, 93, 110) !important;
}

.v-sidebar-menu .vsm--mobile-bg {
  background: #873c03 !important;
  padding-left: 50px !important;
}

.v-sidebar-menu .vsm--link_active {
  background: #873c03;
  box-shadow: inset 3px 0 0 0 white !important;
}

.v-sidebar-menu .vsm--link:hover {
  background: #873c03;
}

.v-sidebar-menu .vsm--dropdown .vsm--link {
  padding-left: 60px;
}
</style>
