var Celule = function(){
	var etat = 0;

	this.vivant = function(){
		etat++;
	}
	this.mort = function(){
		etat = 0;
	}
	this.getEtat = function(){
		return etat;
	}
	this.setEtat = function(x){
		etat = x;
	}
}


var JeuDeLaVie = function(){

	var conteneur;
	var grille;
	var tableau;

	var dimX;
	var dimY;

	var nbrAnnee;

	//ajouter les ecouteurs de click sur une case pour modifier si la case est vivant ou morte.

	this.creeJeu = function(cont,x,y){

		dimX = x;
		dimY = y;
		conteneur = cont;
		nbrAnnee = 0;
		
		var tblHTML = creeTableau(dimX,dimY);
		conteneur.appendChild(tblHTML);
		tableau = tblHTML.getElementsByTagName("td");

		grille = creeGrille(dimX);

		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){
				grille[i][j] = new Celule();
			}
		}
		this.initGrille();
		this.initEcouteur();	
	}

	this.initGrille = function(){
		nbrAnnee = 0;

		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){
				grille[i][j].mort();
			}
		}	
	}

	this.initEcouteur = function(){

		// A REVOIR
		for(var i = 0 ; i < tableau.length ; i++){
			tableau[i].addEventListener("click",testCase,false);
		}

		var that = this;

		function testCase(event){

			for(var i  = 0 ; i < dimX ; i++){
				for(var j = 0 ; j < dimY ; j++){
					if(tableau[dimX*i+j] == event.target){
						that.modifCelule(i,j);
					}
				}
			}
		}
	}

	this.modifCelule = function(i,j){

		if(grille[i][j].getEtat() == 0){
			grille[i][j].vivant();
		} else {
			grille[i][j].mort();
		}

		this.afficheGrille();
	}

	this.grilleAleatoire = function(){

		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){
				if(Math.random() < 0.5){
					grille[i][j].vivant();
				} else {
					grille[i][j].mort();
				}
			}
		}		
	}

	this.afficheGrille = function(){

		nbrAnnee++;

		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){
				if(grille[i][j].getEtat() == 0){
					tableau[dimX*i+j].setAttribute("id","mort");
				} else if(grille[i][j].getEtat() < 2){
					tableau[dimX*i+j].setAttribute("id","vivant1");
				} else if(grille[i][j].getEtat() < 5){
					tableau[dimX*i+j].setAttribute("id","vivant2");
				} else if(grille[i][j].getEtat() < 7){
					tableau[dimX*i+j].setAttribute("id","vivant3");
				} else if(grille[i][j].getEtat() < 10){
					tableau[dimX*i+j].setAttribute("id","vivant4");
				}
			}
		}
	}

	this.modifGrille = function(){

		var sauvGrille = new Array();

		for(var i  = 0 ; i < dimX ; i++){

			sauvGrille[i] = new Array();
			for(var j = 0 ; j < dimY ; j++){

				//copie de la grille
				sauvGrille[i][j] = new Celule();
				sauvGrille[i][j].setEtat(grille[i][j].getEtat());

				//modifgrille
				var nbrVoisin = this.testVoisin(i,j);
				
				if(grille[i][j].getEtat() == 0){
					if(nbrVoisin == 3){
						sauvGrille[i][j].vivant();
					}
				} else {
					if(nbrVoisin < 2 || nbrVoisin > 3){
						sauvGrille[i][j].mort();
					} else {
						sauvGrille[i][j].vivant();
					}
				}
			}
		}

		//copie de la nouvelle grille
		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){

				//grille[i][j] = sauvGrille[i][j]; //MARCHE AUSSI !!!?? WTF
				grille[i][j].setEtat(sauvGrille[i][j].getEtat());
			}
		}

		this.afficheGrille();
	}

	this.testVoisin = function(i,j){

		var nbrVoisin = 0;

		if( i>0 && j>0 && grille[i-1][j-1].getEtat() != 0){
			 nbrVoisin++;
		}
		if( i>0 && grille[i-1][j].getEtat() != 0){
			 nbrVoisin++;
		}
		if( i>0 && j<dimY-1 && grille[i-1][j+1].getEtat() != 0){
			 nbrVoisin++;
		}
		if( j<dimY-1 && grille[i][j+1].getEtat() != 0){
			 nbrVoisin++;
		}
		if( i<dimX-1 && j<dimY-1 && grille[i+1][j+1].getEtat() != 0){
			 nbrVoisin++;
		}
		if( i<dimX-1 && grille[i+1][j].getEtat() != 0){
			 nbrVoisin++;
		}
		if( i<dimX-1 && j>0 && grille[i+1][j-1].getEtat() != 0){
			 nbrVoisin++;
		}
		if( j>0 && grille[i][j-1].getEtat() != 0){
			 nbrVoisin++;
		}

		return nbrVoisin;
	}

	this.testCeluleVivante = function(){

		var celuleVivante = false;
		for(var i  = 0 ; i < dimX ; i++){
			for(var j = 0 ; j < dimY ; j++){
				if(grille[i][j].getEtat() != 0){
					celuleVivante = true;
				}
			}
		}
		return celuleVivante;
	}

	this.getNbrAnnee = function(){
		return nbrAnnee;
	}

}


window.addEventListener('DOMContentLoaded',function(){

	//VARIABLES
	var dimX = 50;
	var dimY = 50;
	var timer;

	var lancer = false;
	var vitesse = 50;

	var jeuDeLaVie = new JeuDeLaVie();
	var conteneurTableau = document.getElementById("conteneur-tableau");

	var annonce = document.getElementById('annonces');
	var btnInit = document.getElementById("btn-init");
	var btnAleatoire = document.getElementById("btn-aleatoire");
	var btnVitesse = document.getElementById("btn-vitesse");
	var btnStart = document.getElementById("btn-start");
	var annee = document.getElementById("annee").parentElement;

	//ECOUTEURS
	btnStart.addEventListener("click",gestionJeu,false);
	btnVitesse.addEventListener("click",gestionVitesse,false);
	btnInit.addEventListener("click",viderGrille,false);
	btnAleatoire.addEventListener("click",grilleAleatoire,false);

	conteneurTableau.addEventListener("click",gestionClick,false);

	//LANCEMENT
	jeuDeLaVie.creeJeu(conteneurTableau,dimX,dimY);
	viderGrille();

	grilleAleatoire();
	gestionJeu();
	
	function viderGrille(){

		btnStart.style.marginRight = "-200px";
		btnVitesse.style.marginRight = "-200px";
		annee.style.marginRight = "-200px";
		annonce.style.marginRight = 0;

		lancer = false;
		jeuDeLaVie.initGrille();
		gestionAffichage();
	}

	function grilleAleatoire(){

		btnStart.style.marginRight = "0";
		btnVitesse.style.marginRight = "0";
		annonce.style.marginRight = "-310px";
		annee.style.marginRight = "-200px";

		lancer = false;
		jeuDeLaVie.initGrille();
		jeuDeLaVie.grilleAleatoire();
		gestionAffichage();
	}
	function gestionAffichage(){
		document.getElementById("annee").innerHTML = jeuDeLaVie.getNbrAnnee();
		jeuDeLaVie.afficheGrille();
	}
	function gestionJeu(){
		
		lancer = !lancer;
		if(lancer){
			btnStart.innerHTML = "stop";
			annee.style.marginRight = 0;
			btnInit.style.marginRight = "-200px";
			btnAleatoire.style.marginRight = "-200px";
		} else {
			btnStart.innerHTML = "lancez";
			btnInit.style.marginRight = 0;
			btnAleatoire.style.marginRight = 0;
		}
		tempsQuiPasse();
	}

	function gestionVitesse(){

		if(vitesse == 50){
			btnVitesse.innerHTML = "accelerer";
			vitesse = 800;
		} else {
			vitesse = 50;
			btnVitesse.innerHTML = "ralentir";
		}
	}

	function gestionClick(){
		if(jeuDeLaVie.testCeluleVivante()){
			btnStart.style.marginRight = "0";
			btnVitesse.style.marginRight = "0";
			annonce.style.marginRight = "-310px";
		} else {
			btnStart.style.marginRight = "-200px";
			btnVitesse.style.marginRight = "-200px";
			annonce.style.marginRight = 0;
		}
	}

	function tempsQuiPasse(){

		jeuDeLaVie.modifGrille();
		document.getElementById("annee").innerHTML = jeuDeLaVie.getNbrAnnee();

		if(!jeuDeLaVie.testCeluleVivante() && lancer){
			gestionJeu();
			gestionClick();
		}
		if(lancer){
			time = setTimeout(tempsQuiPasse,vitesse);
		} 

	}

},false);



//FONCTIONS
function creeGrille(x){

	var grille = new Array();

	for( var i = 0 ; i < x ; i++ ){
		grille[i] = new Array();
	}
	return(grille);
}

function creeTableau(x,y){

	var table = document.createElement("table");

	for (var i = 0 ; i < x ; i++ ){

		var ligne = document.createElement("tr");

		for (var j = 0 ; j < y ; j++ ){
			var macase = document.createElement("td");
			ligne.appendChild(macase);
		}
		table.appendChild(ligne);
	}
	return(table);
}