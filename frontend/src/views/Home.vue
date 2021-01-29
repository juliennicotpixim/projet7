<template>
  <div class="home">
    <Header/>
    <UserNav/>
    <PublicationsNav/>
    <OnePublication/>
  </div>
</template>

<script>

import Login from '@/components/Login.vue';
import Signup from '@/components/Signup.vue';
import Header from '@/components/Header.vue';
import UserNav from '@/components/UserNav.vue';
import PublicationsNav from '@/components/PublicationsNav.vue';
import Publications from '@/components/Publications.vue';
import PublicationsMostCommented from '@/components/PublicationsMostCommented.vue';
import PublicationsMostLiked from '@/components/PublicationsMostLiked.vue';
import PublicationsMostRecent from '@/components/PublicationsMostRecent.vue';
import OneUserPublications from '@/components/OneUserPublications.vue';
import OnePublication from '@/components/OnePublication.vue';

export default {
  name: 'Home',
  components: {
    Login,
    Signup,
    Header,
    UserNav,
    PublicationsNav,
    Publications,
    PublicationsMostCommented,
    PublicationsMostLiked,
    PublicationsMostRecent,
    OneUserPublications,
    OnePublication
  }
}
</script>