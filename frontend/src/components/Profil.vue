<template>
  <div class="background">
    <div class="container mx-auto pt-10">
        <form>
            <div class="mb-4 font-weight-bold mx-auto">Mon profil :</div>
            <input id="nom" type="text" placeholder="Nom">
            <input id="prenom" type="text" placeholder="Prénom">
            <input id="email" type="email" placeholder="E-mail (*)" required>
            <input id="departement" type="text" placeholder="N° de département">
            <input id="poste" type="text" placeholder="Poste occupé">
            <div class="mb-4 font-weight-bold mx-auto mt-8">Modifier mon mot de passe :</div>
            <input id="password" type="password" placeholder="Mot de passe actuel" required>
            <input id="confirmedpassword" type="password" placeholder="Nouveau mot de passe" required>

            <div class="message-erreur">{{ message }}</div>

            <div class="container-button mx-auto mt-10 mb-15">
              <button id="sauvegarder" type="submit" class="mx-auto my-5">Sauvegarder mon profil</button>
              <button to="/" id="supprimer" tag="button" class="mx-auto my-5">Supprimer mon compte</button>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
  // a écrire
</script>

<style scoped>
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

    .container-button{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: baseline;
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
    }
</style>