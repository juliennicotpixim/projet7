<template>
    <div class="background d-flex flex-column">
        <div v-if="publications.length === 0" class="container-button mx-auto mt-6 mb-15" elevation="24" width="700">
            <div class="mt-15 mb-15 mx-auto text-h4 text-center">Aucune publication trouvée...</div>
        </div>
        <v-card class="mx-auto mt-8" v-for = "publication in publications" :key="publication.publicationId" elevation="24" width="700">
            <v-list-item five-line class="px-0 py-0">
                <v-list-item-content class="px-0 py-0">
                    <div class="nom-date px-5 py-3">Publié par {{publication.publicationCreateByUserPrenom}} {{publication.publicationCreateByUserNom}} | Le {{dateFormat(publication.publicationCreationDate)}}</div>
                    <v-divider horizontal></v-divider>
                    <router-link class="router-link" :to="{ name : 'OnePublication', params: { id: publication.publicationId }}">
                        <div class="titre px-5 py-3">{{publication.publicationTitre}}</div>
                        <div class="description px-5 py-3">{{publication.publicationDescription}}</div>
                    </router-link>
                    <v-divider class="mb-0" horizontal style="border: 1px solid #ffd7d7"></v-divider>
                    <div class="like-comment d-flex flex-md-row align-center">
                        <div class="pl-1 pr-2"><v-btn text icon color="green lighten-2" disabled><v-icon>mdi-thumb-up</v-icon></v-btn>({{publication.publicationLikeCount}})</div>
                        <v-divider vertical style="border: 1px solid #ffd7d7"></v-divider>
                        <div class="pl-1"><v-btn text icon color="blac lighten-2" disabled><v-icon>mdi-thumb-down</v-icon></v-btn>({{publication.publicationDislikeCount}})</div>
                        <div class="ml-auto pr-2">Commentaires ({{publication.publicationCommentCount}})</div>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
        <div class="container-button-pagination mx-auto mt-6 mb-15">
              <button v-if="this.page > 1" v-on:click="pagePrecedente()" id="btn-pagination" type="button" class="mx-5">Page précédente</button>
              <button v-if="this.publicationsTotalPageCount < this.publicationsCount" v-on:click="pageSuivante()" id="btn-pagination" type="button" class="mx-5">Page suivante</button>
        </div>
    </div>
</template>

<script>
import {connectedClient} from "@/services/auth.js"      // importation de la configuration de requête pour un client connecté

export default {
    name: 'Publications',

    data(){
        return {
            publications: [],                           // on déclare une varibale de type tableau, vide par défault (contiendra les 10 publications)
            publicationsCount: 0,                       // on déclare une varibale de type nombre, null par défault (contiendra le nombre de publications dans la base de données)
            publicationsPageCount: 0,                   // on déclare une varibale de type tableau, null par défault (contiendra le nombre de publication sur la page)
            publicationsTotalPageCount: 0,              // on déclare une varibale de type tableau, null par défault (contiendra le nombre de publication déjà vu en fonction de la page)
            page: 1                                     // on déclare une varibale de type tableau, 1 par défault (contiendra le numéro de la page)
        }
    },

    mounted() {                                         // hook de cycle de vie qui intervient après le hook created de vérification de session
        this.getAllPublications();                      // fonction qui récupère les publications
    },

    methods: {
        getAllPublications(){
            connectedClient.get(`/publications?page=${this.page}`)          // requête page 1
            .then(res => {
                this.publications = res.data[0];                            // récupération des publications
                this.publicationsPageCount = res.data[0].length;            // récupération du nombre de publications reçu
                this.publicationsTotalPageCount = this.publicationsTotalPageCount + this.publicationsPageCount;     // calcul du nombre de publication déjà vu (en fonction des pages précédentes)
                this.publicationsCount = res.data[1][0]["COUNT(*)"];                                                // récupération du nombre totale de publications dans la bdd
            })
        },
        
        pageSuivante(){                                                         // fonction qui récupère la page suivante
            if(this.publicationsTotalPageCount < this.publicationsCount){       // même traitement que AllPublication avec une page différente
                this.page++;
                connectedClient.get(`/publications?page=${this.page}`)
                    .then(res => {
                        this.publications = res.data[0];
                        this.publicationsPageCount = res.data[0].length;
                        this.publicationsTotalPageCount = this.publicationsTotalPageCount + this.publicationsPageCount;
                        this.publicationsCount = res.data[1][0]["COUNT(*)"];
                    })
            }
        },

        pagePrecedente(){                                                       // fonction qui récupère la page précédente
            if(this.page > 1){                                                  // même traitement que AllPublication avec une page différente
                this.page--;
                this.publicationsTotalPageCount = this.publicationsTotalPageCount - this.publicationsPageCount;
                connectedClient.get(`/publications?page=${this.page}`)
                    .then(res => {
                        this.publications = res.data[0];
                        this.publicationsPageCount = res.data[0].length;
                        this.publicationsCount = res.data[1][0]["COUNT(*)"];
                    })
            }
        },

        dateFormat(date){                                                       // fonction qui transforme le format de la date reçu pour un meilleur affichage
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        }
    }
}
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

    #btn-pagination{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #btn-pagination:hover{
        transform: scale(1.1);
    }

    .container-button-pagination{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: baseline;
    }
</style>