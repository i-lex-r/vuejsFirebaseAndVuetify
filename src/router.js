import Vue from "vue";
import Router from "vue-router";
import { auth } from "./firebaseConfig";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Messages from "./views/Messages";
import Schedule from "./views/Schedule";
import Profile from "./views/Profile";

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    title: "Задачи",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      navItem: true,
      navItemOrder: 0,
      navItemIcon: "mdi-star"
    }
  },
  {
    path: "/messages",
    name: "Messages",
    title: "Сообщения",
    component: Messages,
    meta: {
      requiresAuth: true,
      navItem: true,
      navItemOrder: 1,
      navItemIcon: "mdi-email"
    }
  },
  {
    path: "/schedule",
    name: "Schedule",
    title: "Расписание",
    component: Schedule,
    meta: {
      requiresAuth: true,
      navItem: true,
      navItemOrder: 2,
      navItemIcon: "mdi-clock-start"
    }
  },
  {
    path: "/profile",
    name: "Profile",
    title: "Профиль",
    component: Profile,
    meta: {
      requiresAuth: true,
      navItem: true,
      navItemOrder: 3,
      navItemIcon: "mdi-account"
    }
  },
  {
    path: "*",
    redirect: {
      name: "Dashboard"
    }
  }
];

const getNavList = () => {
  return routes
    .filter(i => i.meta && i.meta.navItem)
    .sort((a, b) => {
      return a.navItemOrder > b.navItemOrder ? 1 : -1;
    })
    .map(i => {
      return {
        href: i.path,
        title: i.title,
        icon: i.navItemIcon
      };
    });
};

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

let prevUserData = null;
router.onReady(() => {
  auth.onAuthStateChanged(user => {
    const { name } = router.currentRoute;

    // 1) simple auth processing
    /* if (prevUserData !== user) {
      router.go();
    } */

    // 2) separate processing
    // handle login
    if (!prevUserData && user && name === "Login") {
      router.go(-1);
    }
    // handle logout
    if (prevUserData && !user) {
      router.push({ name: "Login" });
    }
    prevUserData = user;
  });
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const { currentUser } = auth;

  if (requiresAuth && !currentUser) {
    next({
      name: "Login",
      query: { redirect: to.fullPath }
    });
  } else if (currentUser && to.name === "Login") {
    next(to.query.redirect || { name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
export { getNavList };
