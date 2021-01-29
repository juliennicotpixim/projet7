<template>
    <v-card class="d-flex flex-column flex-md-row align-center" :color="'#ffd7d7'" min-height="50" tile>
      <div class="pa-3 mr-auto">Bonjour Julien Nicot !</div>
      <router-link to="/publications" id="" tag="button" class="nav-button text-uppercase">Toutes les publications</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
       <router-link to="/mespublications" id="" tag="button" class="nav-button text-uppercase">Nouvelle publication</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/mespublications" id="" tag="button" class="nav-button text-uppercase">Mes publications</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/profil" id="" tag="button" class="nav-button text-uppercase">Profil</router-link>
       <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/" id="" tag="button" class="nav-button text-uppercase">Déconnexion</router-link>
    </v-card>
</template>

<style scoped>
    .nav-button{
        margin: 0 5px ;
        padding: 10px 12px;
        font-size: 1rem;
        color:black;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        transition-duration: 0.2s; 
    }

    .nav-button:hover{
        transform: scale(1.1);
    }
</style>