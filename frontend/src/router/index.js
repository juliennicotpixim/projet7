import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import OnePublication from '../views/OnePublication.vue'
import NewPublication from '../views/NewPublication.vue'
import UserProfil from '../views/UserProfil.vue'
import OneUserPublications from '../views/OneUserPublications.vue'
import PublicationsMostRecent from '../views/PublicationsMostRecent.vue'
import PublicationsMostLiked from '../views/PublicationsMostLiked.vue'
import PublicationsMostCommented from '../views/PublicationsMostCommented.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/publication/:id',
    name: 'OnePublication',
    component: OnePublication
  },
  {
    path: '/publications/user',
    name: 'OneUserPublications',
    component: OneUserPublications
  },
  {
    path: '/user/profil',
    name: 'UserProfil',
    component: UserProfil
  },
  {
    path: '/newpublication',
    name: 'NewPublication',
    component: NewPublication
  },
  {
    path: '/publications/most-recent',
    name: 'PublicationsMostRecent',
    component: PublicationsMostRecent
  },
  {
    path: '/publications/most-liked',
    name: 'PublicationsMostLiked',
    component: PublicationsMostLiked
  },
  {
    path: '/publications/most-commented',
    name: 'PublicationsMostCommented',
    component: PublicationsMostCommented
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;