<template>
  <div class="OnePublication">
    <Login v-if="!approuvedConnexion"/>
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>

    <div class="background d-flex flex-column">
      <v-card class="mx-auto mt-8" v-if="publication !== 0" :key="publication.publicationId" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <button v-if="sessionUserId === publication.publicationCreateByUserId || sessionUserAcces === 1" class="supprimer">Supprimer la publication</button>
                    <v-divider v-if="sessionUserId === publication.publicationCreateByUserId || sessionUserAcces === 1" horizontal></v-divider>
                    <div class="nom-date px-5 py-3">Publié par {{publication.publicationCreateByUserPrenom}} {{publication.publicationCreateByUserNom}} | Le {{dateFormat(publication.publicationCreationDate)}}</div>
                    <v-divider horizontal></v-divider>
                    <div class="titre px-5 py-3">{{publication.publicationTitre}}</div>
                    <div class="description px-5 py-3">{{publication.publicationDescription}}</div>
                    <v-img class="mx-auto mb-3" :src="publication.publicationImageUrl" :alt="publication.publicationTitre" max-width="650" height="auto"></v-img>
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

        <v-card class="mx-auto mt-3 comment" v-for = "commentaire in commentaires" :key="commentaire.commentaireId"  elevation="24" width="650">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <button v-if="sessionUserId === commentaire.commentaireCreateByUserId || sessionUserAcces === 1" class="supprimer">Supprimer le commentaire</button>
                    <v-divider v-if="sessionUserId === commentaire.commentaireCreateByUserId || sessionUserAcces === 1" horizontal></v-divider>
                    <div class="nom-date px-5 py-1">Commenté par {{commentaire.commentaireCreateByUserPrenom}} {{commentaire.commentaireCreateByUserNom}} | Le {{dateFormat(commentaire.commentaireCreationDate)}}</div>
                    <v-divider horizontal></v-divider>
                        <div class="description px-5 py-3">{{commentaire.commentaireMessage}}</div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <v-card v-if="publication !== 0" class="mx-auto mt-15 mb-10" elevation="24" width="650">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <div class="nom-date px-3 py-1">Nouveau commentaire :</div>
                    <v-divider horizontal></v-divider>
                    <form>
                        <textarea id="commentaire" name="commentaire" placeholder="Ecrivez votre commentaire..." required></textarea>
                        <button id="poster" type="submit" class="mx-5">Poster</button>
                    </form>
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
  name: 'OnePublication',
  components: {
    Login,
    Header,
    UserNav,
    PublicationsNav
  },

  data() {
    return{
      approuvedConnexion: false,
      sessionUserId: 0,
      sessionUserAcces: 0,
      publication: [],
      commentaires: []
    };
  },

  created(){
    this.connectedUser()
  },

  mounted() {
    if(this.approuvedConnexion === true) {
      this.getOnePublication();
    }
  },

  methods: {
    connectedUser(){
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
      } else {
        this.sessionUserId = JSON.parse(localStorage.groupomaniaUser).userId;
        this.sessionUserAcces = JSON.parse(localStorage.groupomaniaUser).niveau_acces;
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    },

    getOnePublication(){
      const publicationId = this.$route.params.id;
      connectedClient.get(`/publications/${publicationId}`)
      .then(res => {
          if(res.data.publication[0] === undefined) {
            this.publication = 0
          } else {
            this.publication = res.data.publication[0];
            console.log(this.publication)
          }
          this.commentaires = res.data.commentaires;
          console.log(this.commentaires)
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

    .comment{
        background-color: rgb(231, 231, 231);
    }

    form{
          display: flex;
          flex-direction: inline;
          justify-content: space-around;
          align-items: center;
    }

    form textarea{
        margin: auto;
        width: 80%;
        height: 100px;
        font-size: 1.05rem;
        padding: 10px;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 5px;
    }

    #poster{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #poster:hover{
        transform: scale(1.1);
    }

    .newcomment{
        background-color: rgb(255, 255, 255);
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

    .supprimer{
        padding: 6px 12px;
        margin-left: auto;
        font-size: 1rem;
        color:rgb(187, 0, 0);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        font-weight: bold;
    }

    .supprimer:hover{
        transform: scale(1.1);
    }
</style>