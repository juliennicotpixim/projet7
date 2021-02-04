<template>
  <div class="OnePublication">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>

    <div v-if="approuvedConnexion" class="background d-flex flex-column">
      <div v-if="publication == 0" class="mx-auto mt-6 mb-15" elevation="24" width="700">
        <div class="mt-15 mb-15 mx-auto text-h4 text-center">Aucune publication trouvée...</div>
      </div>
      <v-card class="mx-auto mt-8" v-if="publication !== 0" :key="publication.publicationId" elevation="24" width="700">
          <v-list-item five-line class="px-0 py-0">
              <v-list-item-content class="px-0 py-0">
                  <button v-if="sessionUserId === publication.publicationCreateByUserId || sessionUserAcces === 1" v-on:click="deletePublication(publication.publicationId)" class="supprimer">Supprimer la publication</button>
                  <v-divider v-if="sessionUserId === publication.publicationCreateByUserId || sessionUserAcces === 1" horizontal></v-divider>
                  <div class="nom-date px-5 py-3">Publié par {{publication.publicationCreateByUserPrenom}} {{publication.publicationCreateByUserNom}} | Le {{dateFormat(publication.publicationCreationDate)}}</div>
                  <v-divider horizontal></v-divider>
                  <div class="titre px-5 py-3">{{publication.publicationTitre}}</div>
                  <div class="description px-5 py-3">{{publication.publicationDescription}}</div>
                  <v-img class="mx-auto mb-3" :src="publication.publicationImageUrl" :alt="publication.publicationTitre" max-width="650" height="auto"></v-img>
                  <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                  <div class="like-comment d-flex flex-md-row align-center">
                      <div class="pl-1 pr-2"><v-btn v-on:click="modifyLike" text icon :color="likeColor.color"><v-icon>mdi-thumb-up</v-icon></v-btn>({{publication.publicationLikeCount}})</div>
                      <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                      <div class="pl-1"><v-btn v-on:click="modifyDislike" text icon :color="dislikeColor.color"><v-icon>mdi-thumb-down</v-icon></v-btn>({{publication.publicationDislikeCount}})</div>
                      <div class="ml-auto pr-2">Commentaires ({{publication.publicationCommentCount}})</div>
                  </div>
              </v-list-item-content>
          </v-list-item>
      </v-card>

      <v-card class="mx-auto mt-3 comment" v-for = "commentaire in commentaires" :key="commentaire.commentaireId"  elevation="24" width="650">
          <v-list-item five-line class="px-0 py-0">
              <v-list-item-content class="px-0 py-0">
                  <button v-if="sessionUserId === commentaire.commentaireCreateByUserId || sessionUserAcces === 1" v-on:click="deleteComment(commentaire.commentaireId)" class="supprimer">Supprimer le commentaire</button>
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
                  <form class="poster" @submit.prevent = createComment()>
                      <textarea id="commentaire" ref="commentaire" name="commentaire" placeholder="Ecrivez votre commentaire..." required></textarea>
                      <button id="poster" type="submit" class="mx-5">Poster</button>
                  </form>
                  <div class="message-erreur">{{ message }}</div>
              </v-list-item-content>
          </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import {connectedClient} from "@/services/auth.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';
import UserNav from '@/components/UserNav.vue';
import PublicationsNav from '@/components/PublicationsNav.vue';

export default {
  name: 'OnePublication',

  components: {     // déclaration des composants utilisés par la Vue
    Login,
    Header,
    UserNav,
    PublicationsNav
  },

  data() {
    return{
      approuvedConnexion: false,          // on déclare une varibale de type boléen, false par défault (contiendra la validation comme quoi un utilisateur est authentifié)
      sessionUserId: 0,
      sessionUserAcces: 0,
      publication: [],
      commentaires: [],
      likeColor: [],
      dislikeColor: [],
      message: ""
    };
  },

  created(){
    this.connectedUser()
  },

  mounted() {
    if(this.approuvedConnexion === true) {
      const token = JSON.parse(localStorage.groupomaniaUser).token                            // on récupère le token dans le localstorage
      let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);        // on décode le token avec la fonction verify qui prend le token et la clé secrète
      this.sessionUserId = decodedToken.userId                                                // on récupère le UserId
      this.sessionUserAcces = decodedToken.niveau_acces                                       // on récupère le niveau d'acces
      this.getOnePublication();
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

    getOnePublication(){                                // fonction qui gère la récupération d'une publication avec l'id transmis
      const publicationId = this.$route.params.id;
      connectedClient.get(`/publications/${publicationId}`)
      .then(res => {
          if(res.data.publication[0] === undefined) {
            this.publication = 0;
          } else {
            this.publication = res.data.publication[0];
            if(this.publication.userVote === null || this.publication.userVote === 1) {
            this.likeColor = { color: 'black lighten-2' };
            this.dislikeColor = { color: 'black lighten-2' };
            }
            if(this.publication.userVote === 2) {
            this.likeColor = { color: 'green lighten-2' };
            this.dislikeColor = { color: 'black lighten-2' };
            }
            if(this.publication.userVote === 3) {
            this.likeColor = { color: 'black lighten-2' };
            this.dislikeColor = { color: 'red lighten-2' };
            }
          }
          this.commentaires = res.data.commentaires;
      })
    },

    modifyLike(){                                         // fonction qui gère la création ou la modification d'un LIKE sur une publication
      const userVote = this.publication.userVote;
      if(userVote === 2){
        const userId = this.sessionUserId;
        const publicationId = this.publication.publicationId;
        const vote = 1;
        const alreadyVote = true;
        
        connectedClient.post("/publications/vote", {
          userId,
          publicationId,
          vote,
          alreadyVote
        })
          .then(res => {
            this.publication.userVote = 1;
            this.publication.publicationLikeCount--;
            this.likeColor = { color: 'black lighten-2' };
          })
      } else {
          if(userVote === null){
            const userId = this.sessionUserId;
            const publicationId = this.publication.publicationId;
            const vote = 2;
            const alreadyVote = false;
            
            connectedClient.post("/publications/vote", {
              userId,
              publicationId,
              vote,
              alreadyVote
            })
              .then(res => {
                this.publication.userVote = 2;
                this.publication.publicationLikeCount++;
                this.likeColor = { color: 'green lighten-2' };
              })
          }
          
          if(userVote === 1 || userVote === 3){
            const userId = this.sessionUserId;
            const publicationId = this.publication.publicationId;
            const vote = 2;
            const alreadyVote = true;

            connectedClient.post("/publications/vote", {
              userId,
              publicationId,
              vote,
              alreadyVote
            })
              .then(res => {
                if(userVote === 1){
                  this.publication.userVote = 2;
                  this.publication.publicationLikeCount++;
                  this.likeColor = { color: 'green lighten-2' };
                }
                if(userVote === 3){
                  this.publication.userVote = 2;
                  this.publication.publicationDislikeCount--;
                  this.publication.publicationLikeCount++;
                  this.likeColor = { color: 'green lighten-2' };
                  this.dislikeColor = { color: 'black lighten-2' };
                }
              })
          }
        }
    },

    modifyDislike(){                                          // fonction qui gère la création ou la modification d'un DISLIKE sur une publication
      const userVote = this.publication.userVote;
      if(userVote === 3){
        const userId = this.sessionUserId;
        const publicationId = this.publication.publicationId;
        const vote = 1;
        const alreadyVote = true;
        
        connectedClient.post("/publications/vote", {
          userId,
          publicationId,
          vote,
          alreadyVote
        })
          .then(res => {
            this.publication.userVote = 1;
            this.publication.publicationDislikeCount--;
            this.dislikeColor = { color: 'black lighten-2' };
          })
      } else {
          if(userVote === null){
            const userId = this.sessionUserId;
            const publicationId = this.publication.publicationId;
            const vote = 3;
            const alreadyVote = false;
            
            connectedClient.post("/publications/vote", {
              userId,
              publicationId,
              vote,
              alreadyVote
            })
              .then(res => {
                this.publication.userVote = 3;
                this.publication.publicationDislikeCount++;
                this.dislikelikeColor = { color: 'red lighten-2' };
              })
          }

          if(userVote === 1 || userVote === 2){
            const userId = this.sessionUserId;
            const publicationId = this.publication.publicationId;
            const vote = 3;
            const alreadyVote = true;

            connectedClient.post("/publications/vote", {
              userId,
              publicationId,
              vote,
              alreadyVote
            })
              .then(res => {
                if(userVote === 1){
                  this.publication.userVote = 3;
                  this.publication.publicationDislikeCount++;
                  this.dislikeColor = { color: 'red lighten-2' };
                }
                if(userVote === 2){
                  this.publication.userVote = 3;
                  this.publication.publicationDislikeCount++;
                  this.publication.publicationLikeCount--;
                  this.likeColor = { color: 'black lighten-2' };
                  this.dislikeColor = { color: 'red lighten-2' };
                }      
              })
          }
        }
    },

    createComment(){                                    // fonction qui gère la création d'un commentaire pour une publication
      const userId = this.sessionUserId;
      const publicationId = this.publication.publicationId;
      const message = this.$refs.commentaire.value;

      connectedClient.post("/publications/commentaire", {
        userId,
        publicationId,
        message
      })
      .then((res) => {
        if(res.status === 201) {
            location.reload();
        }
      })
      .catch((error) => {
            this.message = error.response.data.error;
      })
    },

    deleteComment(id){                                  // fonction qui gère la suppression d'un commentaire en fonction du niveau d'acces et du userId
      const commentaireId = id;
      connectedClient.delete(`/publications/commentaire/${commentaireId}`)
      .then((res) => {
        if(res.status === 200) {
            location.reload();
        }
      })
    },

    deletePublication(id){                              // fonction qui gère la suppression d'une publication en fonction du niveau d'acces et du userId
      const publicationId = id;
      connectedClient.delete(`/publications/${publicationId}`)
      .then((res) => {
        if(res.status === 200) {
            location.href = '/';
        }
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

    form.poster{
          display: flex;
          flex-direction: row;
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

    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>