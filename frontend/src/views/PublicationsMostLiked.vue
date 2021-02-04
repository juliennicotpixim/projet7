<template>
  <div class="PublicationsMostRecent">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>
    <PublicationsNav v-if="approuvedConnexion"/>

    <div v-if="approuvedConnexion" class="background d-flex flex-column">
        <div v-if="publications.length === 0" class="container-button mx-auto mt-6 mb-15" elevation="24" width="700">
            <div class="mt-15 mb-15 mx-auto text-h4 text-center">Aucune publication trouvée...</div>
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

        <div class="container-button-pagination mx-auto mt-6 mb-15">
              <button v-if="this.page > 1" v-on:click="pagePrecedente()" id="btn-pagination" type="button" class="mx-5">Page précédente</button>
              <button v-if="this.publicationsTotalPageCount < this.publicationsCount" v-on:click="pageSuivante()" id="btn-pagination" type="button" class="mx-5">Page suivante</button>
        </div>
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
  name: 'PublicationsMostLiked',

  components: {     // déclaration des composants utilisés par la Vue
    Login,
    Header,
    UserNav,
    PublicationsNav
  },

  data() {
    return{
      approuvedConnexion: false,          // on déclare une varibale de type boléen, false par défault (contiendra la validation comme quoi un utilisateur est authentifié)
      publications: [],
      publicationsCount: 0,
      publicationsPageCount: 0,
      publicationsTotalPageCount: 0,
      page: 1
    };
  },

  created(){
    this.connectedUser()
  },

  mounted() {
    if(this.approuvedConnexion === true) {
      this.getAllPublications();
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

    getAllPublications(){
      connectedClient.get(`/publications/most-liked?page=${this.page}`)
      .then(res => {
        this.publications = res.data[0];
        this.publicationsPageCount = res.data[0].length;
        this.publicationsTotalPageCount = this.publicationsTotalPageCount + this.publicationsPageCount;
        this.publicationsCount = res.data[1][0]["COUNT(*)"];
      })
    },
        
    pageSuivante(){
      if(this.publicationsTotalPageCount < this.publicationsCount){
        this.page++;
        connectedClient.get(`/publications/most-liked?page=${this.page}`)
          .then(res => {
            this.publications = res.data[0];
            this.publicationsPageCount = res.data[0].length;
            this.publicationsTotalPageCount = this.publicationsTotalPageCount + this.publicationsPageCount;
            this.publicationsCount = res.data[1][0]["COUNT(*)"];
          })
      }
    },

    pagePrecedente(){
      if(this.page > 1){
        this.page--;
        this.publicationsTotalPageCount = this.publicationsTotalPageCount - this.publicationsPageCount;
        connectedClient.get(`/publications/most-liked?page=${this.page}`)
          .then(res => {
            this.publications = res.data[0];
            this.publicationsPageCount = res.data[0].length;
            this.publicationsCount = res.data[1][0]["COUNT(*)"];
          })
      }
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
</style>