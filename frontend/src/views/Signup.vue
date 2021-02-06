<template>
  <div class="background">
    <div class="container mx-auto">
        <img src="../assets/icon-above-font.svg" alt="Groupomania logo">
        <form @submit.prevent = signup()>
            <div class="mb-2">Champs requis (*)</div>
            <input id="nom" ref="nom" type="text" placeholder="Nom"  title="Renseignez votre nom">
            <input id="prenom" ref="prenom" type="text" placeholder="Prénom" title="Renseignez votre prénom">
            <input id="email" ref="email" type="email" placeholder="E-mail (*)" required title="Renseignez votre email">
            <input id="departement" ref="departement" type="text" placeholder="N° de département" title="Renseignez votre numéro de département">
            <input id="poste" ref="poste" type="text" placeholder="Poste occupé" title="Renseignez votre poste">
            <input id="password" ref="password" type="password" placeholder="Mot de passe (*)" title="Renseignez votre mot de passe" required>
            <input id="confirmedpassword" ref="confirmedpassword" type="password" placeholder="Confirmer mot de passe (*)" title="Renseignez votre mot de passe de nouveau" required>
            <div class="message-erreur">{{ message }}</div>
            <div class="mx-auto mt-6 mb-15">
              <button id="signup" type="submit" class="mx-5">Inscription</button>
              <router-link to="/" id="login" tag="button" class="mx-5">Connexion</router-link>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import {notConnectedClient} from "@/services/auth.js"

export default {
  name: 'Signup',

  data() {
      return {
          message: "",
      };
  },

  created(){
  this.connectedUser()
  },

  methods: {
    connectedUser(){                                    // fonction de vérification de la session utilisateur (Item dans le localStorage)
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
        location.href = '/';
      }
    },

    signup() {                                        // fonction qui gère la création d'un nouvel utilisateur (requête)
      const nom = this.$refs.nom.value;
      const prenom = this.$refs.prenom.value;
      const email = this.$refs.email.value;
      const departement = this.$refs.departement.value;
      const poste = this.$refs.poste.value;
      const password = this.$refs.password.value;
      const confirmedPassword = this.$refs.confirmedpassword.value;

      if(password === confirmedPassword){             // on vérifie que le mot de passe est confirmé
        notConnectedClient.post("/users/signup", {
          nom,
          prenom,
          email,
          departement,
          poste, 
          password
        })
        .then((res) => {
          if(res.status === 201) {                    // si l'inscription s'est bien déroulée, on créer l'item dans le localStorage pour créer la session utilisateur
              const groupomaniaUser = {               
                token: res.data.token
              }
              localStorage.setItem('groupomaniaUser', JSON.stringify(groupomaniaUser));
              this.$router.push({ name:'Home' })
          }
        })
        .catch((error) => {
              this.message = error.response.data.error;
        })
      } else {
        this.message = "Veuillez confirmer votre mot de passe";
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

    #signup{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #signup:hover{
        transform: scale(1.1);
    }

    #login{
        padding: 6px 12px;
        font-size: 1rem;
        color: black;
        background-color: #ffb49d;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #login:hover{
        transform: scale(1.1);
    }
    
    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>