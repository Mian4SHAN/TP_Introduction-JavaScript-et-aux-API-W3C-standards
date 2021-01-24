/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  cookieClique = [];

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies(6);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */

  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");
    caseDivs.forEach((div, index) => {
      //le quotien de la division  
      let ligne = Math.floor(index / this.nbLignes);
      //le reste de la division 
      let colonne = index % this.nbColonnes ;
      let img = this.tabCookies [ligne][colonne].htlmImage;

      // clique sur l'image 
      img.onclick = (evt) => {
        let img = evt.target;
        let l = img.dataset.ligne; 
        let c = img.dataset.colonne;

        // initialisation du cookie cliqué
        let cookieClickee = this.tabCookies[l][c];

        //console.log("on clique ligne " + l + " colonne " + c + " type = " + cookieClickee.type);

        // premier clique 
        if(this.cookieClique.length === 0){
          this.cookieClique.push(cookieClickee);
          cookieClickee.selectionnee();

        }
        // deuxieme clique 
        else if (this.cookieClique.length === 1){
          // on est en train de rajouter la cookie 2
          // on vérifie qu'on n'a pas recliqué sur la première 
          if (!this.cookieClique.includes(cookieClickee)){
            this.cookieClique.push(cookieClickee);
            cookieClickee.selectionnee();

            // la distance = 1 on swap les deux cookies 
            if(Cookie.distance(this.cookieClique[0], this.cookieClique[1])=== 1){
              Cookie.swapCookies(this.cookieClique[0], this.cookieClique[1])

              this.cookieClique[0].deselectionnee();
              this.cookieClique[1].deselectionnee();
              this.cookieClique = [];
            }

            // on déselection et supprime le cookie 2 du table
            else{
              this.cookieClique[1].deselectionnee();
              this.cookieClique.splice(1);
              console.log(this.cookieClique[0].type);

            }
              
              
          }

          // si on clique sur le même on déselectionne et on recommence 
          else{
            cookieClickee.deselectionnee();
            this.cookieClique = [];
          }
        }
      }

      img.ondragstart = (evt) => {
        console.log("s");
        let imgD = evt.target;
        let l = imgD.dataset.ligne; 
        let c = imgD.dataset.colonne;

        // initialisation du cookie 
        let cookieD = this.tabCookies[l][c];
        this.cookieSelectionnee = [];
        this.cookieSelectionnee.push(cookieD);
        cookieD.selectionnee();   
      }

      img.ondragover = (evt) =>{
        return false;
      }
      

      img.ondragenter = (evt) =>{
        let img = evt.target;
        let l = img.dataset.ligne; 
        let c = img.dataset.colonne;

        // initialisation du cookie 
        let cookie = this.tabCookies[l][c];
        
        if(Cookie.distance(this.cookieSelectionnee[0], cookie) === 1){
          img.classList.add("grilleDragOver1");
        }

        else {
          img.classList.add("grilleDragOver");
        }

      }

      img.ondragleave = (evt) =>{
        let img = evt.target;
        //img.classList.remove('grillDragOver1');
        img.classList.remove("grilleDragOver");
        img.classList.remove("grilleDragOver1")
      }

      img.ondrop = (evt) => {
        
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne; 
        let c = imgDrop.dataset.colonne;

        // initialisation du cookie 
        let cookieDrop = this.tabCookies[l][c];

        this.cookieSelectionnee.push(cookieDrop);

          // la distance = 1 on swap les deux cookies 
        if(Cookie.distance(this.cookieSelectionnee[0], this.cookieSelectionnee[1])=== 1){
          Cookie.swapCookies(this.cookieSelectionnee[0], this.cookieSelectionnee[1])
          console.log("drop");
        }

        // on déselection et supprime le cookie 2 du table
        else{
          console.log("la distancce != 1");
        }
        this.cookieSelectionnee[0].deselectionnee();
        this.cookieSelectionnee[1].deselectionnee();
        imgDrop.classList.remove('grilleDragOver');
        imgDrop.classList.remove("grilleDragOver1")
        this.cookieSelectionnee = [];
      }


      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }


  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  
  remplirTableauDeCookies(nbDeCookiesDifferents) {

    this.tabCookies =  create2DArray(9);
    for (let l = 0; l < this.nbLignes; l++){
      for (let c = 0; c < this.nbColonnes; c ++){
        // retourn un random entre 0 et 5
        let type = Math.floor(Math.random()* 6); 
        let cookie = new Cookie(type,l,c)
        this.tabCookies [l][c] = cookie;
      }
    }
  }

  //détection des cookies identiques sur les lignes
  detecterMach3Lignes(){
    for (let l = 0; l < this.nbLignes; l++){
      let ligne = this.tabCookies[l];
      console.log('ligne = ' + l);
      for (let i = 0; i <= this.nbColonnes - 3; i ++){
        let cookie1 = ligne[i];
        let cookie2 = ligne[i+1];
        let cookie3 = ligne[i+2];

        if (cookie1.type === cookie2.type && cookie2.type === cookie3.type){ 
          console.log("ligne " + l + " cookies1 colonne " + i +" cookie2 colonne " + (i+1)  + " cookie 3 colonne " + (i+2));
          cookie1.selectionnee();
          cookie2.selectionnee();
          cookie3.selectionnee();
        }
      }
    }
  }

  //détection des cookies identiques sur les colonnes
  detecterMach3Colonnes(){
    for (let c = 0; c < this.nbColonnes; c++){
      console.log('colonne = ' + c);
      for (let i = 0; i <= this.nbLignes -3 ; i ++){
        let cookie1 = this.tabCookies[i][c];
        let cookie2 = this.tabCookies[i+1][c];
        let cookie3 = this.tabCookies[i+2][c];

        if (cookie1.type === cookie2.type && cookie2.type === cookie3.type){
          console.log("colonne " + c + " cookies1 ligne " + i +" cookie2 ligne " + (i+1)  + " cookie 3 ligne " + (i+2));
          cookie1.selectionnee();
          cookie2.selectionnee();
          cookie3.selectionnee();
        }
      }
    }
  }


  detecterMach3Lignes1(){
    for (let l = 0; l < this.nbLignes; l++){
      let ligne = this.tabCookies[l];
      //console.log('ligne = ' + l);
      for (let i = 0; i <= this.nbColonnes - 3; i ++){
        let cookie1 = ligne[i];
        let cookie2 = ligne[i+1];
        let cookie3 = ligne[i+2];

        if (cookie1.type === cookie2.type && cookie2.type === cookie3.type){
          // console.log("ligne " + l + " cookies1 colonne " + i +" cookie2 colonne " + (i+1)  + " cookie 3 colonne " + (i+2));
          cookie1.supprimer();
          console.log(cookie1.htlmImage.classList.contains("cookie-supprime"))
          cookie2.supprimer();
          cookie3.supprimer();
        }
      }
    }
  }

  detecterMach3Colonnes1(){
    for (let c = 0; c < this.nbColonnes; c++){
      //console.log('colonne = ' + c);
      for (let i = 0; i <= this.nbLignes -3 ; i ++){
        let cookie1 = this.tabCookies[i][c];
        let cookie2 = this.tabCookies[i+1][c];
        let cookie3 = this.tabCookies[i+2][c];

        if (cookie1.type === cookie2.type && cookie2.type === cookie3.type){
            //console.log("colonne " + c + " cookies1 ligne " + i +" cookie2 ligne " + (i+1)  + " cookie 3 ligne " + (i+2));
          cookie1.supprimer();
          cookie2.supprimer();
          cookie3.supprimer();
          console.log(cookie1.htlmImage.classList.contains("cookie-supprime"));
        }
      }
    }
  }

  // détecter tout les lignes et colonnes
  detecterTout(){
    this.detecterMach3Colonnes();
    this.detecterMach3Lignes();
  }

  // supprimer tout les cookies
  supprimerCookie(){
    this.detecterMach3Colonnes1();
    this.detecterMach3Lignes1();
  }

  //la chute des cookies 
  chute(){
    for (let boucle = 0; boucle < 8; boucle ++){
      let b;
      for (let c = 0; c < this.nbColonnes; c++){
        //console.log('colonne = ' + c);
        for (let i = this.nbLignes - 1; i > 0  ; i --){
          let cookie1 = this.tabCookies[i][c];
          if (cookie1.htlmImage.classList.contains("cookie-supprime")){
            if (this.tabCookies[i-1][c].htlmImage.classList.contains("cookie-supprime")){
              b = true;
            }
            else{
              b = false;
            } 
            Cookie.swapCookies(cookie1, this.tabCookies[i-1][c]);
            if (!b){
            cookie1.ajouter();
            }
            this.tabCookies[i-1][c].supprimer();
          }
        }
      }
    }
  }


  // remplir le tableau quand les cases sont vides
  remplirTableauDeCookiesVide(){
    for (let l = 0; l < this.nbLignes; l++){
      for (let c = 0; c < this.nbColonnes; c ++){
        // retourn un random entre 0 et 5
        if(this.tabCookies[l][c].htlmImage.classList.contains("cookie-supprime")){
          let type = Math.floor(Math.random()* 6); 
          let cookie = new Cookie(type,l,c)
          this.tabCookies[l][c].type = cookie.type;
          this.tabCookies[l][c].htlmImage.src = cookie.htlmImage.src;
          this.tabCookies[l][c].ajouter();
        }
      }
    }
  }

}


