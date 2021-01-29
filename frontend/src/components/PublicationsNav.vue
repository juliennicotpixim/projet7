<template>
    <v-card class="d-flex flex-column flex-md-row align-center" :color="'#ffff'" min-height="50"  tile>
      <h3 class="pa-3">Affichage des publications :</h3>
      <router-link to="/publications/most-recent" id="" class="nav-button">Les plus récentes</router-link>
      <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/publications/most-liked" id="" class="nav-button">Les plus aimées</router-link>
      <v-divider class="my-4 d-none d-sm-flex" vertical></v-divider>
      <router-link to="/publications/most-commented" id="" class="nav-button">Les plus commentées</router-link>
    </v-card>
</template>

<style scoped>
    .nav-button{
        margin: 10px 10px ;
        padding: 10px 12px;
        font-size: 1rem;
        color:#fd2d00;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s; 
    }

    .nav-button:hover{
        transform: scale(1.1);
    }
</style>