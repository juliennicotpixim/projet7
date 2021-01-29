<template>
    <div class="background d-flex flex-column">
        <v-card class="mx-auto mt-8" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <div class="nom-date px-5 py-3">Publié par Julien Nicot | Il y a 2 jours...</div>
                    <v-divider horizontal></v-divider>
                    <router-link class="router-link" to="" id="">
                        <div class="titre px-5 py-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, nam est vero expedita.</div>
                        <div class="description px-5 py-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint numquam architecto cupiditate temporibus assumenda explicabo in, eos quisquam similique quas quod ipsa voluptatibus magni alias corporis. Nihil dolorem voluptatem laboriosam.</div>
                    </router-link>
                    <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                    <div class="like-comment d-flex flex-md-row align-center">
                        <div class="pl-1 pr-2"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-up</v-icon></v-btn>(2)</div>
                        <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                        <div class="pl-1"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-down</v-icon></v-btn>(1)</div>
                        <div class="ml-auto pr-2">Commentaires (8)</div>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <v-card class="mx-auto mt-8" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <div class="nom-date px-5 py-3">Publié par Julien Nicot | Il y a 55 minutes...</div>
                    <v-divider horizontal></v-divider>
                    <router-link class="router-link" to="" id="">
                        <div class="titre px-5 py-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, nam est vero expedita.</div>
                        <div class="description px-5 py-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint numquam architecto cupiditate temporibus assumenda explicabo in, eos quisquam similique quas quod ipsa voluptatibus magni alias corporis. Nihil dolorem voluptatem laboriosam.</div>
                    </router-link>
                    <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                    <div class="like-comment d-flex flex-md-row align-center">
                        <div class="pl-1 pr-2"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-up</v-icon></v-btn>(3)</div>
                        <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                        <div class="pl-1"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-down</v-icon></v-btn>(0)</div>
                        <div class="ml-auto pr-2">Commentaires (6)</div>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <div class="text-center my-15"><v-pagination v-model="page" :length="5" circle></v-pagination></div>

    </div>
</template>

<script>

</script>

<style scoped>
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