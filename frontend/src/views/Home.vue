<template>
  <div class="home">
    <Login v-if="!approuvedConnexion"/>
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>
    <PublicationsNav v-if="approuvedConnexion"/>
    <Publications v-if="approuvedConnexion"/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';
import UserNav from '@/components/UserNav.vue';
import PublicationsNav from '@/components/PublicationsNav.vue';
import Publications from '@/components/Publications.vue';

export default {
  name: 'Home',
  components: {
    Login,
    Header,
    UserNav,
    PublicationsNav,
    Publications
  },

  data() {
    return{
      approuvedConnexion: false
    };
  },

  created(){
    this.connectedUser()
  },

  methods: {
    connectedUser(){
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    }
  }
}
</script>