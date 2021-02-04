<template>
    <v-card class="d-flex flex-column flex-md-row align-center" :color="'#ffd7d7'" min-height="50" tile>
      <div class="pa-3 mr-auto">Bienvenue chez Groupomania !</div>
      <router-link to="/" tag="button" class="nav-button text-uppercase">Toutes les publications</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
       <router-link to="/newpublication" tag="button" class="nav-button text-uppercase">Nouvelle publication</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/publications/user" tag="button" class="nav-button text-uppercase">Mes publications</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/user/profil" tag="button" class="nav-button text-uppercase">Profil</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <button v-on:click="deconnexion()" class="nav-button text-uppercase">Déconnexion</button>
    </v-card>
</template>

<script>

export default {
    name: 'UserNav',

    methods: {
        deconnexion(){                                      // fonction qui supprime la session utilisateur (item du localStorage)
            localStorage.removeItem('groupomaniaUser');
            location.href = '/';
        }
    }
}
</script>

<style scoped>
    .nav-button{
        margin: 0 5px ;
        padding: 10px 12px;
        font-size: 1rem;
        color:black;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s; 
    }

    .nav-button:hover{
        transform: scale(1.1);
    }

    .nav-button.router-link-exact-active{
        margin: 0 5px ;
        padding: 10px 12px;
        font-size: 1.1rem;
        color:black;
        font-weight: bold;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        text-decoration: underline;
    }
</style>