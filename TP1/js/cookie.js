class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne; 
    this.colonne = colonne;
    //création d'un élément en html
    this.htlmImage = document.createElement('img');
    this.htlmImage.src = Cookie.urlsImagesNormales[type];
    this.htlmImage.width = 80;
    this.htlmImage.height = 80;
    this.htlmImage.dataset.colonne = colonne;
    this.htlmImage.dataset.ligne = ligne;
    
    this.htlmImage.classList.add("cookies");
  }

  selectionnee() {
    // zoom sur le cookie séléctionné 
    this.htlmImage.src = Cookie.urlsImagesSurlignees[this.type];
    this.htlmImage.classList.add("cookies-selected");
  }

  deselectionnee() {
    // forme normal du cookie
    this.htlmImage.src= Cookie.urlsImagesNormales[this.type];
    this.htlmImage.classList.remove("cookies-selected");
  }

  
  // changer deux cookies 
  static swapCookies(c1, c2) {
    
    console.log("SWAP C1 C2");

    // On échange leurs images et types temporairement  
    let tmpType = c1.type;
    let tmpImg = c1.htlmImage.src;
    
    c1.type = c2.type;
    c1.htlmImage.src = c2.htlmImage.src; 

    c2.type = tmpType;
    c2.htlmImage.src = tmpImg;
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }

  // cacher les cookies
  supprimer(){
    this.htlmImage.classList.add("cookie-supprime");
    this.deselectionnee();
  }

  // les faire apparaitre 
  ajouter(){
    this.htlmImage.classList.remove('cookie-supprime');
    this.deselectionnee();
  }
}
