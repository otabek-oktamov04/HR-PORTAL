import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/layouts/dashboard.vue"),
      redirect: { name: "home" },
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/pages/home.vue"),
        },
        {
          path: "/userCreate",
          name: "user-create",
          component: () => import("@/pages/users/userCreate.vue"),
        },
        {
          path: "/userList",
          name: "user-list",
          component: () => import("@/pages/users/userList.vue"),
        },
        {
          path: "/employeeChanges",
          name: "employee-changes",
          component: () => import("@/pages/employe/employeeChanges.vue"),
        },
        {
          path: "/employee-termination",
          name: "employee-termination",
          component: () => import("@/pages/employe/employeeTermination.vue"),
        },
        {
          path: "/secondaryPosition",
          name: "secondary-position",
          component: () => import("@/pages/employe/secondaryPosition.vue"),
        },
        {
          path: "/addDepartment",
          name: "add-department",
          component: () => import("@/pages/organization/addDepartment.vue"),
        },
        {
          path: "/removeDepartment",
          name: "remove-department",
          component: () => import("@/pages/organization/removeDepartment.vue"),
        },
        {
          path: "/addPosition",
          name: "add-position",
          component: () => import("@/pages/organization/addPosition.vue"),
        },
        {
          path: "/removePosition",
          name: "remove-position",
          component: () => import("@/pages/organization/removePosition.vue"),
        },
        {
          path: "/changePosition",
          name: "change-position",
          component: () => import("@/pages/organization/changePosition.vue"),
        },
        {
          path: "/oldapprovals",
          name: "oldapprovals",
          component: () => import("@/pages/oldApprovals.vue"),
        },
        {
          path: "/fte",
          name: "fte",
          component: () => import("@/pages/fte.vue"),
        },
        {
          path: "/valueList",
          name: "value-list",
          component: () => import("@/pages/valueList.vue"),
        },
        {
          path: "/approvals",
          name: "approvals",
          component: () => import("@/pages/approvals.vue"),
        },
        {
          path: "/test",
          name: "test",
          component: () => import("@/pages/test.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  // const isLoggedIn = true

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!!isLoggedIn && token) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
