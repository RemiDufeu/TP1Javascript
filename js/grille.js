/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  constructor(l, c, nbDeCookiesDifferents) {
    this.nbLigne = l;
    this.nbColonne = c;
    this.cookieCliquees = [];
    this.nbDeCookiesDifferents = nbDeCookiesDifferents;
    this.estAutomatique = false;
    this.remplirTableauDeCookies();
  }

  getCookieDepuisLC(ligne, colonne) {
    return this.tabCookie[ligne][colonne];
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */

  // ne pas toucher aux éléments du DOM, seulement a tab cookies
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonne);
      let colonne = index % this.nbLigne;

      let cookie = this.getCookieDepuisLC(ligne, colonne);

      cookie.htmlImage.onclick = (e) => {
        let c = this.getCookieDepuisLC(
          e.target.dataset.ligne,
          e.target.dataset.colonne
        );

        if (this.cookieCliquees.length === 0) {
          this.cookieCliquees.push(c);
          c.selectionnee();
        } else {
          if (Cookie.distance(this.cookieCliquees[0], c) <= 1) {
            this.cookieCliquees.push(c);
            Cookie.swapCookies(this.cookieCliquees[0], this.cookieCliquees[1]);
            this.detecterMatch3Colonnes();
            this.detecterMatch3Lignes();
            this.estAutomatique && this.supprimerCookiesMarque();
          }

          this.cookieCliquees[0].deselectionnee();
          this.cookieCliquees.splice(0);
        }
      };

      //pour le style quand on survol un élément
      cookie.htmlImage.ondragover = (e) => {
        e.preventDefault();
        cookie.htmlImage.classList.add("survolCookie");
      };

      cookie.htmlImage.addEventListener("dragleave", (e) => {
        cookie.htmlImage.classList.remove("survolCookie");
      });

      cookie.htmlImage.ondragstart = (e) => {
        if (this.cookieCliquees.length > 0) {
          this.cookieCliquees[0].deselectionnee();
          this.cookieCliquees.splice(0);
        }
        let c = this.getCookieDepuisLC(
          e.target.dataset.ligne,
          e.target.dataset.colonne
        );
        this.cookieCliquees.push(c);
      };

      cookie.htmlImage.ondrop = (e) => {
        e.preventDefault();
        let c = this.getCookieDepuisLC(
          e.target.dataset.ligne,
          e.target.dataset.colonne
        );
        if (Cookie.distance(this.cookieCliquees[0], c) <= 1) {
          this.cookieCliquees.push(c);
          Cookie.swapCookies(this.cookieCliquees[0], this.cookieCliquees[1]);
          this.detecterMatch3Colonnes();
          this.detecterMatch3Lignes();
          this.estAutomatique && this.supprimerCookiesMarque();
        }
        c.htmlImage.classList.remove("survolCookie");
        this.cookieCliquees.splice(0);
      };

      div.appendChild(cookie.htmlImage);
    });
  }

  modeAutomatique() {
    // fonction pour déclencher le mode automatique (la suppression se calcule a chaque mouvement)
    this.estAutomatique = !this.estAutomatique;
    document.querySelector("#auto").innerHTML = this.estAutomatique
      ? "Auto : true"
      : "Auto : false";
  }

  /**
   * Le principe ici est de "descendre les cookies" d'une case pour combler les vides.
   * On répète l'opération 9 fois pour bien etre sur d'avoir baissé toutes les lignes.
   */
  supprimerCookiesMarque() {
    //méthode pour retirer l'affichage des cases marqués en rouge
    this.disparaitreMarque();
    do {
      this.detecterMatch3Colonnes();
      this.detecterMatch3Lignes();
      //on parcourt le tabelau pour rendre les cases marque invisible
      for (let l = this.nbLigne - 1; l >= 0; l--) {
        for (let c = 0; c < this.nbColonne; c++) {
          let divCookie = this.getCookieDepuisLC(l, c);
          if (divCookie.htmlImage.classList.contains("marque")) {
            divCookie.htmlImage.classList.add("cache");
          }
        }
      }
      this.retirerLesMarques(); // on retire les anciennes marques
      this.chute();
      this.detecterMatch3Colonnes(); // on détecte les nouvelles marques
      this.detecterMatch3Lignes();
      this.reRemplirTableauDeCookies(); // methode pour combler les vides causé par la chute
    } while (this.detecterMarque()); // on répète l'opération jusqu'à que les chutes n'entrainent plus de combinaisons
  }

  detecterMarque() {
    for (let c = 0; c < this.nbColonne; c++) {
      for (let l = 0; l < this.nbLigne; l++) {
        if (
          this.getCookieDepuisLC(l, c).htmlImage.classList.contains("marque")
        ) {
          return true;
        }
      }
    }
    return false;
  }

  chute() {
    for (let c = 0; c < this.nbColonne; c++) {
      for (let l = this.nbLigne - 1; l > 0; l--) {
        let divCookie = this.getCookieDepuisLC(l, c);
        if (divCookie.htmlImage.classList.contains("cache")) {
          // a partir du moment ou on tombe sur un coockie caché on cherche la div non vide au dessus la plus proche
          let targetDiv = null;
          let indexCaseDessus = 0;
          while (targetDiv === null && l - indexCaseDessus > 0) {
            indexCaseDessus++;
            if (
              this.getCookieDepuisLC(
                l - indexCaseDessus,
                c
              ).htmlImage.classList.contains("cache") === false
            ) {
              targetDiv = this.getCookieDepuisLC(l - indexCaseDessus, c);
            }
          }
          if (targetDiv !== null) {
            // si il y a un cookie non vide au dessus alors on le swap, sinon il y a rien à faire
            Cookie.ChuteCookies(divCookie, targetDiv);
          }
        }
      }
    }
  }

  apparaitreMarque() {
    let cokiesmarques = document.querySelectorAll(".marque");
    cokiesmarques.forEach((cookie) => {
      cookie.style.backgroundColor = "rgba(231, 79, 79, 0.53)";
    });
  }

  disparaitreMarque() {
    let cokiesmarques = document.querySelectorAll(".marque");
    cokiesmarques.forEach((cookie) => {
      cookie.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });
  }

  detecterMatch3Lignes() {
    let i, c;
    for (i = 0; i < this.nbLigne; i++) {
      for (c = 0; c < this.nbColonne - 2; c++) {
        if (
          this.getCookieDepuisLC(i, c).type ===
            this.getCookieDepuisLC(i, c + 1).type &&
          this.getCookieDepuisLC(i, c).type ===
            this.getCookieDepuisLC(i, c + 2).type
        ) {
          this.getCookieDepuisLC(i, c).htmlImage.classList.add("marque");
          this.getCookieDepuisLC(i, c + 1).htmlImage.classList.add("marque");
          this.getCookieDepuisLC(i, c + 2).htmlImage.classList.add("marque");
        }
      }
    }
  }

  detecterMatch3Colonnes() {
    let i, c;
    for (c = 0; c < this.nbColonne; c++) {
      for (i = 0; i < this.nbLigne - 2; i++) {
        if (
          this.getCookieDepuisLC(i, c).type ===
            this.getCookieDepuisLC(i + 1, c).type &&
          this.getCookieDepuisLC(i, c).type ===
            this.getCookieDepuisLC(i + 2, c).type
        ) {
          this.getCookieDepuisLC(i, c).htmlImage.classList.add("marque");
          this.getCookieDepuisLC(i + 1, c).htmlImage.classList.add("marque");
          this.getCookieDepuisLC(i + 2, c).htmlImage.classList.add("marque");
        }
      }
    }
  }

  retirerLesMarques() {
    for (let c = 0; c < this.nbColonne; c++) {
      for (let i = 0; i < this.nbLigne; i++) {
        this.getCookieDepuisLC(i, c).htmlImage.classList.remove("marque");
      }
    }
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

  reRemplirTableauDeCookies() {
    let l, c;
    for (l = 0; l < this.nbLigne; l++) {
      for (c = 0; c < this.nbColonne; c++) {
        let cookieBoucle = this.getCookieDepuisLC(l, c);
        if (cookieBoucle.htmlImage.classList.contains("cache")) {
          let type = Math.floor(Math.random() * this.nbDeCookiesDifferents);
          cookieBoucle.type = type;
          cookieBoucle.htmlImage.src = Cookie.urlsImagesNormales[type];
          cookieBoucle.htmlImage.classList.remove("cache");
        }
      }
    }
    this.retirerLesMarques();
    this.detecterMatch3Colonnes();
    this.detecterMatch3Lignes();
  }

  remplirTableauDeCookies() {
    let l, c;
    this.tabCookie = create2DArray(this.nbLigne);
    for (l = 0; l < this.nbLigne; l++) {
      for (c = 0; c < this.nbColonne; c++) {
        let type = Math.floor(Math.random() * this.nbDeCookiesDifferents);
        let cookieBoucle = new Cookie(type, l, c);
        this.tabCookie[l][c] = cookieBoucle;
      }
    }
    this.supprimerCookiesMarque();
  }
}
