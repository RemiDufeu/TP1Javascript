class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
    "./assets/images/FakeCookie.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
    "./assets/images/FakeCookie.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;


    // On créé l'élément HTML
    this.htmlImage = document.createElement('img');
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.width = 80;
    this.htmlImage.height = 80;
    this.htmlImage.dataset.colonne = colonne;
    this.htmlImage.dataset.ligne = ligne;
    this.htmlImage.classList.add("cookies")

  }

  selectionnee() {
    this.htmlImage.classList.add("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  deselectionnee() {
    this.htmlImage.classList.remove("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }

  static swapCookies(c1, c2) {
   
    let tampon1Image = this.urlsImagesNormales[c1.type]
    let tampon1Type = c1.type
    let tampon2Image = this.urlsImagesNormales[c2.type]
    let tampon2Type = c2.type
    
    c1.htmlImage.src = tampon2Image;
    c1.type = tampon2Type;

    c2.htmlImage.src = tampon1Image;
    c2.type = tampon1Type;
    
  }

  static ChuteCookies(c1, c2) {
    c1.htmlImage.classList.toggle("cache")
    c2.htmlImage.classList.toggle("cache")
    this.swapCookies(c1, c2)
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    return distance;
  }
}
