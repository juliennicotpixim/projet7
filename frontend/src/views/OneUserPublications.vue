<template>
  <div class="OneUserPublications">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>

    <div v-if="approuvedConnexion" class="background d-flex flex-column pb-15">
      <div v-if="publications.length === 0" class="container-button mx-auto mt-6 mb-15" elevation="24" width="700">
        <div class="mt-15 mb-15 mx-auto text-h4 text-center">Aucune publication trouvée...</div>
        <router-link to="/newpublication" id="creer" class="mx-5" tag="button">Créer une nouvelle publication !</router-link>
      </div>
        <v-card class="mx-auto mt-8" v-for = "publication in publications" :key="publication.publicationId" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <div class="nom-date px-5 py-3">Publié par {{publication.publicationCreateByUserPrenom}} {{publication.publicationCreateByUserNom}} | Le {{dateFormat(publication.publicationCreationDate)}}</div>
                    <v-divider horizontal></v-divider>
                    <router-link class="router-link" :to="{ name : 'OnePublication', params: { id: publication.publicationId }}">
                        <div class="titre px-5 py-3">{{publication.publicationTitre}}</div>
                        <div class="description px-5 py-3">{{publication.publicationDescription}}</div>
                    </router-link>
                    <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                    <div class="like-comment d-flex flex-md-row align-center">
                        <div class="pl-1 pr-2"><v-btn text icon color="green lighten-2" disabled><v-icon>mdi-thumb-up</v-icon></v-btn>({{publication.publicationLikeCount}})</div>
                        <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                        <div class="pl-1"><v-btn text icon color="blac lighten-2" disabled><v-icon>mdi-thumb-down</v-icon></v-btn>({{publication.publicationDislikeCount}})</div>
                        <div class="ml-auto pr-2">Commentaires ({{publication.publicationCommentCount}})</div>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
    </div>

  </div>
</template>

<script>
import {connectedClient} from "@/services/auth.js"

import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';
import UserNav from '@/components/UserNav.vue';
import PublicationsNav from '@/components/PublicationsNav.vue';

export default {
  name: 'OneUserPublications',

  components: {     // déclaration des composants utilisés par la Vue
    Login,
    Header,
    UserNav,
    PublicationsNav
  },

  data() {
    return{
      approuvedConnexion: false,          // on déclare une varibale de type boléen, false par défault (contiendra la validation comme quoi un utilisateur est authentifié)
      publications: []
    };
  },

  created(){
    this.connectedUser()
  },

  mounted() {
    if(this.approuvedConnexion === true) {
      this.getAllUserPublications();
    }
  },

  methods: {
    connectedUser(){                                    // fonction de vérification de la session utilisateur (Item dans le localStorage)
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
        this.$router.push({ name:'Home' })
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    },

    getAllUserPublications(){
      connectedClient.get("/publications/user")
      .then(res => {
          this.publications = res.data;
      })
    },

    dateFormat(date){
        const event = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return event.toLocaleDateString('fr-FR', options);
    }
  }
}
</script>

<style>
   .background{
      background-image: url(../assets/background-white.jpg);
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      min-height: 100vh;
    }

    .nom-date{
        font-size: 1.1rem;
        color: rgba(0, 0, 0, 0.781);
    }

    .titre{
        font-size: 1.5rem;
        color: black;
    }

    .description{
        font-size: 1rem;
        color: black;
    }

    .like-comment{
        font-size: 1.1rem;
        color: black;
    }

    .router-link{
        text-decoration:none;
    }

    #creer{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #creer:hover{
        transform: scale(1.1);
    }

    .container-button{
          display: flex;
          flex-direction: column;
          align-items: center;
    }
</style>