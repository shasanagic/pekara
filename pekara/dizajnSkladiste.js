


/*  FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA  */
// FUNKCIJA KOJA MJENJA DIVOVE ODNOSNO NA PRITISNUTI BUTTON SA LIJEVOG SIDE NAVA
// FUNKCIJA KOJA ZATVARA I OTVARA DIVOVE NA PRITITSAK TABLICA
// DOVRŠENA 19.11.2018 U 4:50h
function show(elementId) {
        document.getElementById("divFormaZaUnosNovogArtikla").style.display = "none";
        document.getElementById("divZaPregledUnesenihArtikala").style.display = "none";
        document.getElementById("divUredivanjeUnesenihArtikala").style.display = "none";
        document.getElementById("divDetaljanPrikazPregledaArtikla").style.display = "none";
        document.getElementById("divUrediArtikalDiv").style.display = "none";
        document.getElementById(elementId).style.display = "block";
    }
/*  FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA  */




/*---------------------------------------------------------------------------*/
/*-------------------DEKLARACIJE ID-EVA---------------*/
var txtNazivArtikla = document.getElementById("txtNazivArtikla");
var inputGroupSelect = document.getElementById("inputGroupSelect02");
var txtNazivDobavljaca = document.getElementById("txtNazivDobavljaca");
var txtBarkodProizvoeda = document.getElementById("txtBarkodProizvoeda");
var txtUlaznaCijenaProizvoda = document.getElementById("txtUlaznaCijenaProizvoda");
var txtOpisArikla = document.getElementById("txtOpisArikla");


// var VARIJABLA = document.getElementById("idVARIJABLE");

/*---------------------------------------------------------------------------*/
function testirajFunkcija(){
var e = document.getElementById("txtOptionJedinicaMjere");
var value = e.options[e.selectedIndex].value;
var text = e.options[e.selectedIndex].text;
console.log(text);
console.log(value);
}

/*******************GENERIRANJE ID-ARTIKLA GLOBALNO****************************/
/*******************POZIVANJE FUNKCIJA ZA DOHVACANJE I UPDATE******************/

let globalIdArtikla;
$( document ).ready(function() {
    $(document).on('click', '.urediButton', function(){
     let row=$(this).closest('tr');
     let id=row.find( ".skriveniId" ).text();
     funDohvatiArtiklePoBarkodu(id);
   });
   $(document).on('click', '.promjeniBroj', function(){
    let id=$('#txtFirebaseId').text();
    btnFunZaUpdate(id);
  });
});
/*******************GENERIRANJE ID-ARTIKLA GLOBALNO****************************/
/*******************POZIVANJE FUNKCIJA ZA DOHVACANJE I UPDATE******************/


/*---------------------------------------------------------------------------*/
/*-------------------FUNKCIJA ZA UNOS NOVOG ARTIKLA U FIREBASE---------------*/
function funZaIniciranjeArtikalaUBazu(){
var d = new Date();
var t = d.getTime();
var counter = t;
/* FUKCIJA ZA OCITAVANJE VRIJEDNOSTI IZ SELECTA */
var e = document.getElementById("txtOptionJedinicaMjere");
var jedinicaMjere = e.options[e.selectedIndex].value;
var text = e.options[e.selectedIndex].text;
console.log(text);
console.log(jedinicaMjere);
/* FUKCIJA ZA OCITAVANJE VRIJEDNOSTI IZ SELECTA */

var rotRef = firebase.database().ref().child('Artikli/' + counter);

console.log(counter);
counter+=1;
console.log(counter);

rotRef.set({
  NazivArtikla: $('#txtNazivArtikla').val(),
  NazivDobavljaca: $('#txtNazivDobavljaca').val(),
  Barkod: $('#txtBarkodProizvoeda').val(),
  UkaznaCijena: $('#txtUlaznaCijenaProizvoda').val(),
  OpisArtikla: $('#txtOpisArikla').val(),
  JedinicaMjere : jedinicaMjere,
  JedinstvenaSifraArtikla: counter,
});
    }
/*   unos artikla zavrsen   */




/*------------------FUNKCIJA ZA PREGLED UNESENIH ARIKALA-------------------*/
 function funPregledUnesenihArtikala() {
     $('#ex-table tbody').remove();

     var database = firebase.database();
     database.ref("Artikli").once('value', function (snapshot) {
         if (snapshot.exists()) {
             var content = '';
             // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA
             content += '<thead><tr class="text-center">';
             content += '<td><b>NAZIV ARTIKLA</b></td>';
             content += '<td><b>NAZIV DOBAVLJAČA</b></td>';
             content += '<td><b>BARKOD</b></td>';
             content += '<td><b>ŠIFRA ARTIKLA</b></td>';
             content += '</tr></thead>';
             // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA
             snapshot.forEach(function (data) {
                 var val = data.val();
                 content += '<tr class="text-center">';
                 content += '<td>' + data.child("NazivArtikla").val() + '</td>';
                 content += '<td>' + data.child("NazivDobavljaca").val(); + '</td>';
                 content += '<td>' + data.child("Barkod").val(); + '</td>';
                 content += '<td class="skriveniId" style="display:none">' + data.key; + '</td>';
                 content += '<td><button class="urediButton">Uredi</button></td>';
                 content += '</tr>';
             });
             $('#ex-table').empty();
             $('#ex-table').append(content);
           }
     });

 }
/*
 content += '<tr class="text-center"><td><b>Jedinstvena šifra artikla:</b></td>';
 content += '<td id="txtFirebaseId">' + childSnapshot.key + '</td></tr>';
 */
 /*------------------FUNKCIJA ZA PREGLED UNESENIH ARIKALA-------------------*/



/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*-------------------DOHVAĆANJE KORISNIKA PO OIB-u----------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/

function funDohvatiArtiklePoBarkodu(id){
  console.log("1");
  $('#ex-tableOib tbody').remove();
  $('#ex-tableOib').empty();
    console.log("2");
    var oibKorisnika = $('#test').val();


    var root = firebase.database().ref().child("Artikli").orderByKey().equalTo(id).once("value", function (snapshot){
    snapshot.forEach(function(childSnapshot){
      if (childSnapshot.exists()) {
        console.log("uslo u cvor");
        var content = '';
        // ZAGLAVLJE TABLICE POČINJE
        content += '<thead><tr class="text-center">';
        content += '<td><b>KORISNIK</b></td>';
        content += '<td><b>DETALJNO</b></td></tr></thead>';
        // ZAGLAVLJE TABLICE ZAVRŠAVA
        // table content
        content += '<tr class="text-center"><td><b>Naziv artikla:</b></td>';
        content += '<td>' + childSnapshot.child("NazivArtikla").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Naziv dobavljača:</b></td>';
        content += '<td>' + childSnapshot.child("NazivDobavljaca").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Jedinica mjere:</b></td>';
        content += '<td>' + childSnapshot.child("JedinicaMjere").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Ulazna cijena artikla:</b></td>';
        content += '<td>' + childSnapshot.child("UkaznaCijena").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Barkod:</b></td>';
        content += '<td>' + childSnapshot.child("Barkod").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Opis artikla:</b></td>';
        content += '<td>' + childSnapshot.child("OpisArtikla").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Jedinstvena šifra artikla:</b></td>';
        content += '<td id="txtFirebaseId">' + childSnapshot.key + '</td></tr>';

        globalIdArtikla = childSnapshot.key;

      }

      $('#ex-tableOib').append(content);
      $('#divUrediArtikalDiv').show();
    });
  });
}
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*-------------------DOHVAĆANJE KORISNIKA PO OIB-u----------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/

function funDohvatiDodatnePostavkePoNazivuArtikla(){
  console.log("1");
  $('#ex-tableSifra tbody').remove();
    console.log("2");
    var varZaDohvacanjuPoNazivuArtikla = $('#txtPretraziPoNazivuArtikla').val();

    var root = firebase.database().ref().child("Artikli").orderByChild("NazivArtikla").equalTo(varZaDohvacanjuPoNazivuArtikla).once("value", function (snapshot){
    snapshot.forEach(function(childSnapshot){
      if (childSnapshot.exists()) {
        console.log("uslo u cvor");
        var content = '';
        // ZAGLAVLJE TABLICE POČINJE
        content += '<thead><tr class="text-center">';
        content += '<td><b>ARTIKAL</b></td>';
        content += '<td><b>DETALJNO</b></td></tr></thead>';
        console.log(childSnapshot.key);
        // ZAGLAVLJE TABLICE ZAVRŠAVA
        // table content

        content += '<tr class="text-center"><td><b>Naziv artikla:</b></td>';
        content += '<td>' + childSnapshot.child("NazivArtikla").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Naziv dobavljača:</b></td>';
        content += '<td>' + childSnapshot.child("NazivDobavljaca").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Jedinica mjere:</b></td>';
        content += '<td>' + childSnapshot.child("JedinicaMjere").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Ulazna cijena artikla:</b></td>';
        content += '<td>' + childSnapshot.child("UlaznaCijena").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Barkod:</b></td>';
        content += '<td>' + childSnapshot.child("Barkod").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Opis artikla:</b></td>';
        content += '<td>' + childSnapshot.child("OpisArtikla").val() + '</td></tr>';

        content += '<tr class="text-center"><td><b>Jedinstvena šifra artikla:</b></td>';
        content += '<td id="txtFirebaseId">' + childSnapshot.key + '</td></tr>';

        globalIdArtikla=childSnapshot.key

        console.log("testiranje");
      }
      $('#ex-tableSifra').append(content);
    });
  });
}
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*
FUNKCIJA KOJA BRISE SAMO JEDAN �VOR I SVE NJEGOVE VRIJEDNOSTI
*/
var txtBrisanjeKorisnika = document.getElementById("txtIdArtiklaKojegZelimoIzbrisatiIliPromjeniti");
function funIzrisiKorisnikaPoIdu() {
    const fb = firebase.database().ref();
  //   key = document.getElementById('txtIdArtiklaKojegZelimoIzbrisatiIliPromjeniti').value;
    fb.child('Artikli/' + globalIdArtikla + '/').remove();
    alert("Uspješno ste obrisali korisnika");
}

/*
FUNKCIJA KOJA BRISE SAMO JEDAN �VOR I SVE NJEGOVE VRIJEDNOSTI
*/



function btnFunZaUpdate(key){
var noviOpisArtikla = $('#txtNoviOpisArikla').val();
// key = $('#txtIdArtiklaKojegZelimoIzbrisatiIliPromjeniti').val();
  alert("Updaejtali ste korisnika");
  var db = firebase.database();
  var updateRef = db.ref('Artikli/').orderByChild('JedinstvenaSifraArtikla').equalTo(key);
//  updateRef.child('Korisnik/' + key + '/')
//  updateRef.update({BrojMobitela: noviBrojTelefona});
    var testRot =db.ref('Artikli/' + key + '/')
    testRot.update({OpisArtikla: noviOpisArtikla});
  //  console.log(key);
    console.log("Unesen novi br");
//  updateRef.update({BrojMobitela: noviBrojTelefona});
//  console.log("0 je unesena");
}
