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

  components: {     // déclaration des composants utilisés par la Vue
    Login,
    Header,
    UserNav,
    PublicationsNav,
    Publications
  },

  data() {
    return{
      approuvedConnexion: false     // on déclare une varibale de type boléen, false par défault (contiendra la validation comme quoi un utilisateur est authentifié)
    };
  },

  created(){                        // hook de cycle de vie qui intervient avant le hook mounted et vérifie la session utilisateur (Item dans le localStorage)
    this.connectedUser()
  },

  methods: {
    connectedUser(){                // fonction de vérification de la session utilisateur (Item dans le localStorage)
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