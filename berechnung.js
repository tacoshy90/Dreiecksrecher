// EventListener um Funktionen bzw. Funktionsketten auszulösen
window.addEventListener('DOMContentLoaded', function() {
  seiten_auswahl();
  input_auslesen();

  document.querySelector('#seite').addEventListener('change', function() {
    seiten_auswahl();
  });

  document.querySelectorAll('#eingabe input').forEach(el => 
    el.addEventListener('change', input_auslesen)   
  );

  document.querySelector('input[type="button"]').addEventListener('click', input_auslesen);
});


// Funktion zum anzeigen der richtigen Ausgabefelder / Verstecken von nicht aktiven Feldern
function seiten_auswahl() {
  let seiten_auswahl = document.querySelector('#seite').value;
  const seiten_wert = document.querySelector('#seiten_laenge');

  document.querySelectorAll('#ausgabe > *').forEach(el => el.classList.remove('d-none'));

  switch (seiten_auswahl) {
    case 'hypothenuse':
      document.querySelectorAll('[data-hypothenuse]').forEach(el => el.classList.add('d-none'));
      seiten_wert.ariaLabel = "Eingabefeld für die Hypothenuse in Millimeter";
      break;
    case 'ankathete':
      document.querySelectorAll('[data-ankathete]').forEach(el => el.classList.add('d-none'));
      seiten_wert.ariaLabel = "Eingabefeld für die Ankathete Alpha in Millimeter";
      break;
    case 'gegenkathete':
      document.querySelectorAll('[data-gegenkathete]').forEach(el => el.classList.add('d-none'));
      seiten_wert.ariaLabel = "Eingabefeld für die Gegenkathete Alpha in Millimeter";
      break;
  }
};


/* ----

Funktionen zur Berechnung und Ausgabe

---- */


// Daten aus den Inputs auslesen
function input_auslesen() {
  let seiten_laenge = document.querySelector('#seiten_laenge').value,
      winkel_alpha  = document.querySelector('#winkel-alpha').value;

  input_validieren(seiten_laenge, winkel_alpha);
};


// Inputs validieren
function input_validieren(seiten_laenge, winkel_alpha) {
  // Abrufen der Minimum und Maximum Werte
  let min = +document.querySelector('#winkel-alpha').min,
      max = +document.querySelector('#winkel-alpha').max;  
  let min_seitenlaenge = +document.querySelector('#seiten_laenge').min; 

  // Validation, ob Winkel alpha im logischen Bereich zwischen 0° und 90°
  if (winkel_alpha < min) {
    document.querySelector('#winkel-alpha').value = min;
  }
  if (winkel_alpha > max) {
    document.querySelector('#winkel-alpha').value = max;
  }
  if (winkel_alpha >= min && winkel_alpha <= max) {
    document.querySelector('#winkel-alpha').value = parseFloat(winkel_alpha).toFixed(2).replace(/\./g, ',');
  }

  // Validation, ob Seitenlänge im logischen Bereich von >0 ist
  if (seiten_laenge < min_seitenlaenge){
    document.querySelector('#seiten_laenge').value = min_seitenlaenge;
  }   
  if (seiten_laenge >= min_seitenlaenge){
    document.querySelector('#seiten_laenge').value = parseFloat(seiten_laenge).toFixed(2).replace(/\./g, ',');
  }  

  berechnen_beta(seiten_laenge, winkel_alpha);
};


// Berechnen von Winkel Beta
function berechnen_beta(seiten_laenge, winkel_alpha) {
  const winkel_gamma = 90;
  let winkel_beta = 180 - (+winkel_alpha + winkel_gamma);
  document.querySelector('#winkel-beta').value = parseFloat(winkel_beta).toFixed(2).replace(/\./g, ',');

  berechnen_seiten(seiten_laenge, winkel_alpha);
};


// Berechnen der Seitenlängen
function berechnen_seiten(seiten_laenge, winkel_alpha) { 
  let seiten_auswahl = document.querySelector('#seite').value;
  let ankathete,
      hypothenuse,
      gegenkathete;

  switch (seiten_auswahl) {
    case 'hypothenuse':
      //Ankathete berechnen
      ankathete = Math.cos(winkel_alpha * Math.PI / 180) * seiten_laenge;
      //Gegenkathete berechnen
      gegenkathete = Math.sin(winkel_alpha * Math.PI / 180) * seiten_laenge;
      //Hypothenuse setzen
      hypothenuse = seiten_laenge;
      break;
    case 'ankathete':
      //Hypothenuse berechnen
      hypothenuse = seiten_laenge / Math.cos(winkel_alpha * Math.PI / 180);
      //Gegenkathete berechnen
      gegenkathete = Math.sin(winkel_alpha * Math.PI / 180) * hypothenuse;
      //Ankathete setzen
      ankathete = seiten_laenge;
      break;
    case 'gegenkathete':
      //Hypothenuse berechnen
      hypothenuse = seiten_laenge / Math.sin(winkel_alpha * Math.PI / 180);
      //Ankathete berechnen
      ankathete = Math.sin(winkel_alpha * Math.PI / 180) * hypothenuse;
      //Gegenkathete setzen
      gegenkathete = seiten_laenge;
      break;
  }

  ausgabe_anzeigen(hypothenuse, ankathete, gegenkathete);
  dreiech_zeichnen(winkel_alpha, ankathete, hypothenuse);
}


//Ausgabe der Seiten auf 2 Nachkommastellen gerundet
function ausgabe_anzeigen(hypothenuse, ankathete, gegenkathete) {
  document.querySelector('#hypothenuse').value = parseFloat(hypothenuse).toFixed(2).replace(/\./g, ',');
  document.querySelector('#ankathete-alpha').value = parseFloat(ankathete).toFixed(2).replace(/\./g, ','); 
  document.querySelector('#gegenkathete-alpha').value = parseFloat(gegenkathete).toFixed(2).replace(/\./g, ','); 
}


// Berechnen und zeichnen des Dreiecks
function dreiech_zeichnen(winkel_alpha, ankathete, hypothenuse) {
  // Berechnen der Dreieckshöhe
  let hoehe = Math.sin(winkel_alpha * Math.PI / 180) * ankathete,
      Xachse = Math.cos(winkel_alpha * Math.PI / 180) * ankathete;
  
  const leinwand = document.querySelector('#graf');
  const zeichnung = leinwand.getContext('2d');

  let leinwandBreite = +leinwand.clientWidth;
  let leinwandHoehe = +leinwand.clientWidth;
  leinwand.width = leinwandBreite;
  leinwand.height = leinwandHoehe;

  // Berechnen der Dreieckskoordinaten
  let Ax = 0,
      Ay = leinwandHoehe, 
      Bx = leinwandBreite,
      By = leinwandHoehe,
      Cx = (Xachse / hypothenuse) * leinwandBreite,
      Cy = leinwandBreite - ((hoehe / hypothenuse) * leinwandBreite);

  // Zeichnen des Dreiecks
  zeichnung.lineWidth = 3;
  zeichnung.strokeStyle = 'blue';
  zeichnung.beginPath();
  zeichnung.lineTo(Ax, Ay);
  zeichnung.lineTo(Bx, By); 
  zeichnung.lineTo(Cx, Cy);
  zeichnung.lineTo(Ax, Ay);
  zeichnung.stroke();
}