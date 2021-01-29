<template>
  <div class="background">
    <div class="container mx-auto">
        <img src="../assets/icon-above-font.svg" alt="Groupomania logo">
        
        <form>
            <div class="mb-2">Champs requis (*)</div>
            <input id="email" type="email" placeholder="E-mail (*)" required>
            <input id="password" type="password" placeholder="Mot de passe (*)" required>

            <div class="message-erreur">{{ message }}</div>

            <div class="container-button mx-auto mt-6 mb-15">
              <button id="login" type="submit" class="mx-5">Connexion</button>
              <router-link to="/signup" id="signup" class="mx-5" tag="button">Inscription</router-link>
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
          justify-content: space-around;
          align-items: baseline;
    }

    #login{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: black;
        background-color: #fe7d55;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #login:hover{
        transform: scale(1.1);
    }

    #signup{
        padding: 6px 12px;
        font-size: 1rem;
        color: black;
        background-color: #ffb49d;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #signup:hover{
        transform: scale(1.1);
    }

    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>