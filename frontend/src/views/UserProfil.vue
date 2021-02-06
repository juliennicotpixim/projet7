<template>
  <div class="UserProfil">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>

    <div v-if="approuvedConnexion" class="background d-flex flex-column">
        <form id="profil" @submit.prevent = saveUser()>
            <div class="mb-5 mt-15 mx-auto text-h6">Informations personnelles :</div>
            <input id="nom" ref="nom" type="text" title="Renseignez votre nom" placeholder="Nom" :value="userProfil.nom">
            <input id="prenom" ref="prenom" type="text" title="Renseignez votre prénom" placeholder="Prénom" :value="userProfil.prenom">
            <input id="email" ref="email" type="email" title="Renseignez votre email" placeholder="E-mail (*)" :value="userProfil.email" required>
            <input id="departement" ref="departement" title="Renseignez votre numéro de département" type="text" placeholder="N° de département" :value="userProfil.departement">
            <input id="poste" ref="poste" type="text" title="Renseignez votre poste" placeholder="Poste occupé" :value="userProfil.poste">
            <div class="mb-5 mt-8 mx-auto text-h6">Modifier mon mot de passe :</div>
            <input id="password" ref="password" type="password" title="Renseignez votre mot de passe actuel" placeholder="Mot de passe actuel">
            <input id="newpassword" ref="newpassword" type="password" title="Renseignez votre nouveau mot de passe" placeholder="Nouveau mot de passe">
            <div class="message-erreur mt-10">{{ errorMessage }}</div>
            <div class="message-succes">{{ succesMessage }}</div>
            <div class="mx-auto mb-15 container-button-profil">
              <button id="sauvegarder" type="submit" class="mx-5 my-10">Sauvegarder mon profil</button>
              <button id="supprimer" type="button" v-on:click="deleteUser()" class="mx-5">Supprimer mon compte</button>
            </div>
        </form>
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
  name: 'UserProfil',

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
      sessionUserAcces:0,
      userProfil: [],
      errorMessage: "",
      succesMessage: ""
    };
  },

  created(){
    this.connectedUser()
  },

  mounted(){
    if(this.approuvedConnexion === true) {
      const token = JSON.parse(localStorage.groupomaniaUser).token                            // on récupère le token dans le localstorage
      let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);        // on décode le token avec la fonction verify qui prend le token et la clé secrète
      this.sessionUserId = decodedToken.userId                                                // on récupère le UserId
      this.sessionUserAcces = decodedToken.niveau_acces                                       // on récupère le niveau d'acces
      this.getUserProfil();
    }
  },
  
  methods: {
    connectedUser(){
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
        this.$router.push({ name:'Home' })
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    },

    getUserProfil(){
      const userId = this.sessionUserId;
      connectedClient.get(`/users/${userId}`)
        .then(res => {
          this.userProfil = res.data;
          this.userProfil.password = "";
          this.userProfil.newpassword = "";
        })
    },

    saveUser(){
      const nom = this.$refs.nom.value;
      const prenom = this.$refs.prenom.value;
      const email = this.$refs.email.value;
      const departement = this.$refs.departement.value;
      const poste = this.$refs.poste.value;
      const password = this.$refs.password.value;
      const newpassword = this.$refs.newpassword.value;

      connectedClient.put("/users/update", {
        nom,
        prenom,
        email,
        departement,
        poste, 
        password,
        newpassword
      })
      .then((res) => {
        if(res.status === 200) {
            this.errorMessage = ""
            this.succesMessage = res.data.message;
            setTimeout(function(){location.reload()}, 2000)
        }
      })
      .catch((error) => {
            this.errorMessage = error.response.data.error;
      })
    },

    deleteUser(){
      if(window.confirm("ATTENTION : La suppression de votre compte est définitive ! Voulez-vous vraiment supprimer votre compte ?")){
        const userId = this.sessionUserId;
        connectedClient.delete(`/users/${userId}`)
        .then((res) => {
          if(res.status === 200) {
            this.succesMessage = res.data.message;
            localStorage.removeItem('groupomaniaUser');
            setTimeout(function() {location.href = '/';}, 2000)
          }
        })
        .catch((error) => {
            this.errorMessage = error.response.data.error;
            setTimeout(function() {location.reload()}, 2000)
        })
      }
    }
  }
}
</script>

<style>
    .background{
      background-image: url(../assets/background-white.jpg);
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      min-height: 100vh;
    }

    .container{
        max-width: 500px;
        margin: 0;
        padding: 0;
    }
    
    #profil{
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    form input{
      margin: auto;
      width: 80%;
      font-size: 1.05rem;
      padding: 10px 10px;
      margin-bottom: 15px;
      text-align: center;
      background-color: white;
      border: 1px rgba(0, 0, 0, 0.548) solid;
      border-radius: 15px;
    }

    .container-button-profil{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    #sauvegarder{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #00b126cb;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #sauvegarder:hover{
        transform: scale(1.1);
    }

    #supprimer{
        padding: 6px 12px;
        font-size: 1rem;
        color: black;
        background-color: #ff6c40;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #supprimer:hover{
        transform: scale(1.1);
    }

    .message-erreur{
      text-align: center;
      margin: auto;
      color: red;
      font-size: 1rem;
      font-weight: bold;
    }

    .message-succes{
      text-align: center;
      margin: auto;
      color: rgb(3, 102, 0);
      font-size: 1.2rem;
      font-weight: bold;
    }
</style>