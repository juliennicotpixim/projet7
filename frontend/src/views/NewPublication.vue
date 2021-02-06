<template>
  <div class="NewPublication">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if="approuvedConnexion"/>

    <div v-if="approuvedConnexion" class="background d-flex flex-column">
      <form @submit.prevent = newPublication()>
        <div class="mb-2 mt-15 ml-15">Champs requis (*)</div>
        <textarea id="titre" class="mt-5" ref="titre" name="titre" placeholder="Titre de la publication... (*)" title="Renseignez un titre pour votre publication" required></textarea>
        <textarea id="description" class="mt-5" ref="description" name="description" placeholder="Description de la publication... (*)" title="Renseignez une description pour votre publication" required></textarea>
        <input type="file" class="mt-5" accept="image/jpg,image/jpeg,image/png" ref="uploadImage" id="uploadImage" title="Renseignez une image pour votre publication"/>
        <div class="message-erreur">{{ message }}</div>
        <div class="mx-auto mt-6 mb-15">
          <button id="newpublication" type="submit" class="mx-5">Créer la publication</button>
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
  name: 'NewPublication',

  components: {     // déclaration des composants utilisés par la Vue
    Login,
    Header,
    UserNav,
    PublicationsNav
  },

  data() {
    return{
      approuvedConnexion: false,      // on déclare une varibale de type boléen, false par défault (contiendra la validation comme quoi un utilisateur est authentifié)
      sessionUserId: 0,               // on déclare une varibale de type nombre, 0 par défault (contiendra le userId du token de la session utilisateur)
      sessionUserAcces: 0,            // on déclare une varibale de type nombre, 0 par défault (contiendra le niveau d'acces du token de la session utilisateur)
      message: ""                     // on déclare une varibale de type string, vide par défault (contiendra les messages d'erreur envoyé par le back)
    };
  },

  created(){                          // hook de cycle de vie qui intervient avant le hook mounted et vérifie la session utilisateur (Item dans le localStorage)
    this.connectedUser()
  },

  mounted(){
    if(this.approuvedConnexion === true) {
      const token = JSON.parse(localStorage.groupomaniaUser).token                            // on récupère le token dans le localstorage
      let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);        // on décode le token avec la fonction verify qui prend le token et la clé secrète
      this.sessionUserId = decodedToken.userId                                                // on récupère le UserId
      this.sessionUserAcces = decodedToken.niveau_acces                                       // on récupère le niveau d'acces
    }
  },
  
  methods: {
    connectedUser(){                                        // fonction de vérification de la session utilisateur (Item dans le localStorage)
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
        this.$router.push({ name:'Home' })
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    },

    newPublication(){                                     // fonction qui gère la création d'une nouvelle publication (requête)
      const userId = this.sessionUserId;
      const titre = this.$refs.titre.value;
      const description = this.$refs.description.value;
      const uploadImage = this.$refs.uploadImage.files[0];
      
      const fileName = this.$refs.uploadImage.value;
      const lastDot = fileName.lastIndexOf(".") + 1;
      const extensionFile = fileName.substr(lastDot, fileName.length).toLowerCase();
      
      if (extensionFile=="jpg" || extensionFile=="jpeg" || extensionFile=="png" || uploadImage === undefined){    // vérification de l'extension du fichier
          let formData = new FormData();
          formData.append("userId", userId);
          formData.append("titre", titre);
          formData.append("description", description);
          formData.append("image", uploadImage);

          connectedClient.post('/publications', formData)
          .then((res) => {
            if(res.status === 201) {
                this.$router.push({ name:'OneUserPublications' });
            }
          })
      } else{
          this.message = "Seul les images de type JPG/JPEG/PNG sont autorisées.";
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
    
    form{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: baseline;
    }

    form input{
        margin: auto;
        width: 80%;
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 15px;
    }
    
    form input::placeholder{
        color: #585858;
        font-weight: 500;
    }

    .container-button{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: baseline;
    }

    #newpublication{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #newpublication:hover{
        transform: scale(1.1);
    }

    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>