import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import map from '../views/map/map'
import cityList from "@/components/lib-map/cityList";
import searchWrap from "@/components/search/searchWrap";
import draw from "@/components/lib-map/draw";
import drawer from  "@/components/lib-map/drawer";
import tip from "@/components/lib-map/tip";
import dramDemo from "@/components/lib-map/dramDemo";
import card from "@/components/lib-map/card";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/map',
    name: 'name',
    component: map
  },
  {
    path: '/city',
    name: 'city',
    component: cityList
  },
  {
    path: '/search',
    name: 'search',
    component: searchWrap
  },
  {
    path: '/draw',
    name: 'draw',
    component: draw
  },
  {
    path: '/drawer',
    name: 'drawer',
    component: drawer
  },
  {
    path: '/tip',
    name: 'tip',
    component: tip
  },
  {
    path: '/dramDemo',
    name: 'dramDemo',
    component: dramDemo
  },
  {
    path: '/card',
    name: 'card',
    component: card
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
