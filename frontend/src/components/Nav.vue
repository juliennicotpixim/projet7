<template>
    <v-app-bar dense>
      <v-app-bar-title>Affichage des publications :</v-app-bar-title>
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab>Les plus récentes</v-tab>
          <v-tab>Les mieux notées</v-tab>
          <v-tab>Les plus commentées</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
</template>