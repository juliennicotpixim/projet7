<template>
    <div class="background d-flex flex-column">
        <v-card class="mx-auto mt-8" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <button class="supprimer">Supprimer la publication</button>
                    <v-divider horizontal></v-divider>
                    <div class="nom-date px-5 py-3">Publié par Julien Nicot | Il y a 23 minutes...</div>
                    <v-divider horizontal></v-divider>
                        <div class="titre px-5 py-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, nam est vero expedita.</div>
                        <div class="description px-5 py-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint numquam architecto cupiditate temporibus assumenda explicabo in, eos quisquam similique quas quod ipsa voluptatibus magni alias corporis. Nihil dolorem voluptatem laboriosam.</div>
                        <v-img class="mx-auto mb-3" src="https://via.placeholder.com/1000C/O%20https://placeholder.com/" alt="" max-width="650" max-height="400"></v-img>
                    <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                    <div class="like-comment d-flex flex-md-row align-center">
                        <div class="pl-1 pr-2"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-up</v-icon></v-btn>(2)</div>
                        <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                        <div class="pl-1"><v-btn text icon color="black lighten-2"><v-icon>mdi-thumb-down</v-icon></v-btn>(1)</div>
                        <div class="ml-auto pr-2">Commentaires (3)</div>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
        
        <v-card class="mx-auto mt-3 comment" elevation="24" width="650">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <button class="supprimer">Supprimer le commentaire</button>
                    <v-divider horizontal></v-divider>
                    <div class="nom-date px-5 py-1">Commenté par Julien Nicot | Il y a 40 minutes...</div>
                    <v-divider horizontal></v-divider>
                        <div class="description px-5 py-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint numquam architecto cupiditate temporibus assumenda explicabo in, eos quisquam similique quas quod ipsa voluptatibus magni alias corporis. Nihil dolorem voluptatem laboriosam.</div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <v-card class="mx-auto mt-3 comment" elevation="24" width="650">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <button class="supprimer">Supprimer le commentaire</button>
                    <v-divider horizontal></v-divider>
                    <div class="nom-date px-5 py-1">Commenté par Julien Nicot | Il y a 40 minutes...</div>
                    <v-divider horizontal></v-divider>
                        <div class="description px-5 py-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint numquam architecto cupiditate temporibus assumenda explicabo in, eos quisquam similique quas quod ipsa voluptatibus magni alias corporis. Nihil dolorem voluptatem laboriosam.</div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <v-card class="mx-auto mt-15 mb-10" elevation="24" width="650">
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