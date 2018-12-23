/*
NAPOMENA: OVO JE CIST JAVASCRIPT, TU JE VALIDACIJA FORME, PRELAZ SA TABA NA DRUGI
TAB I UNOS PODATAKA U NOVOG KORISNIKA U BAZU
VAŽNO!!! TREBA PROVJERITI DIO KODA S PROFESOROM (LINIJA 104 - 111) DA LI JE TO U SUŠTINI POTREBNO
*/
/*---------------------------VARIJABLE----------------------------------*/
var txtImeKorisnika = document.getElementById("txtImeKorisnika");
var txtPrezimeKorisnika = document.getElementById("txtPrezimeKorisnika");
var txtLozinka = document.getElementById("txtLozinka");
var txtPotvrdaLozinka = document.getElementById("txtPotvrdaLozinka");
var txtOibKorisnika = document.getElementById("txtOibKorisnika");
var txtBrojMobitelaKorisnika = document.getElementById("txtBrojMobitelaKorisnika");
// role za admin i korisnik //
var radAdmin = document.getElementById("radAdmin");
var radKorisnik = document.getElementById("radKorisnik");

let currentUserId;
$( document ).ready(function() {
    $(document).on('click', '.urediButton', function(){
     let row=$(this).closest('tr');
     let id=row.find( ".skriveniId" ).text();
     funDohvatiDodatnePostavkeDjelatnikaOib(id);
   });
   $(document).on('click', '.promjeniBroj', function(){
    let row=$(this).closest('tr');
    let id=$('#txtFirebaseId').text();
    btnFunZaUpdate(id);
  });
});
/*---------------------------------------------------------------------------*/

/*-------------VALIDACIJA FORME ZA UNOS NOVOG DJELATNIKA----------------------*/
function funkcijaProvjeriSvePodatke() {
    /*----------------------PROVJERA DA LI JE UNE�ENO IME KORISNIKA PO�ETAK--------------*/
    var imeProvjera = document.forms["formaUnosNovogRadnika"]["imeKorisnika"].value;
    var prezimeProvjera = document.forms["formaUnosNovogRadnika"]["prezimeKorisnika"].value;
    var lozinkaProvjera = document.forms["formaUnosNovogRadnika"]["lozinkaKorisnika"].value;
    var brojPonovljenaLozinkaProvjera = document.forms["formaUnosNovogRadnika"]["lozinkaKorisnikaProvjera"].value;
    var oibProvjera = document.forms["formaUnosNovogRadnika"]["oibKorisnika"].value;
    var brojMobitelaProvjera = document.forms["formaUnosNovogRadnika"]["brojMobitela"].value;


    if (imeProvjera == "" || prezimeProvjera == "" || lozinkaProvjera == "" || brojPonovljenaLozinkaProvjera == "" || oibProvjera =="" || brojMobitelaProvjera=="") {
        return false;
    }
    else {
        return true;
    }
}
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
/* FUNKCIJA ZA PRIKAZIVANJE LOZINKE (SVE RADI NORMALNO) */
function funPrikaziLozinkuKorisniku() {
    var x = document.getElementById("txtLozinka");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
/* FUNKCIJA ZA PRIKAZIVANJE LOZINKE (SVE RADI NORMALNO) */
function funPrikaziPotvrdenuLozinkuKorisniku() {
    var x = document.getElementById("txtPotvrdaLozinka");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

/*---------------------------------------------------------------------------*/

/*-----------------FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA--------------------*/
function show(elementId) {
        document.getElementById("divFormaZaUnosNovogDjelatnika").style.display = "none";
        document.getElementById("divZaPregledUnesenihDjelatnika").style.display = "none";
        document.getElementById("divUredivanjeUnesenihDjelatnika").style.display = "none";
        document.getElementById("divDetaljanPregledDjelatnika").style.display = "none";
        document.getElementById("divUrediPostojecegDjelatnika").style.display = "none";
        document.getElementById(elementId).style.display = "block";
    }
/*  FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA  */
/*---------------------------------------------------------------------------*/

/*------------------FUNKCIJA ZA UNOS NOVOG DJELATNIKA------------------------*/
function funUnosKorisnika(){
if (funkcijaProvjeriSvePodatke()==true) {
  console.log("uslo");

  var d = new Date();
  var t = d.getTime();
  var counter = t;

  console.log(counter);
  counter+=1;
  console.log(counter);

  var rotRef = firebase.database().ref().child('Korisnik/' + counter);
  rotRef.set({
    Ime: $('#txtImeKorisnika').val(),
    Prezime: $('#txtPrezimeKorisnika').val(),
    Lozinka: $('#txtLozinka').val(),
    Oib: $('#txtOibKorisnika').val(),
    BrojMobitela: $('#txtBrojMobitelaKorisnika').val(),
    JedinstvenaSifraKorisnika: counter,
  });

  console.log("izaslo");
 alert("Uspješno unesen korisnik");

}

else {
  alert("Validacija nije uspješna");
}
// window.location.reload()

}


/*------------------FUNKCIJA ZA UNOS NOVOG DJELATNIKA------------------------*/
/*
var txtImeKorisnika = document.getElementById("txtImeKorisnika");
var txtPrezimeKorisnika = document.getElementById("txtPrezimeKorisnika");
var txtLozinka = document.getElementById("txtLozinka");
var txtPotvrdaLozinka = document.getElementById("txtPotvrdaLozinka");
var txtOibKorisnika = document.getElementById("txtOibKorisnika");
var txtBrojMobitelaKorisnika = document.getElementById("txtBrojMobitelaKorisnika");
// role za admin i korisnik //
var radAdmin = document.getElementById("radAdmin");
var radKorisnik = document.getElementById("radKorisnik");
*/


/*------------------FUNKCIJA ZA PREGLED UNESENIH KORISNIKA-------------------*/
function funPregledUnesenihKorisnika() {

    $('#ex-table tbody').remove();

    var database = firebase.database();
    database.ref("Korisnik").once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';

            // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA
            content += '<thead><tr class="text-center">';
            content += '<td><b>IME</b></td>';
            content += '<td><b>PREZIME</b></td>';
            content += '<td><b>BROJ MOBITELA</b></td>';
            content += '<td><b>OIB</b></td>';
            content += '<td>Uredi</td>';
            content += '</tr></thead>';
            // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA


            snapshot.forEach(function (data) {
                var val = data.val();
                content += '<tr class="text-center">';
                content += '<td>' + data.child("Ime").val() + '</td>';
                content += '<td>' + data.child("Prezime").val(); + '</td>';
                content += '<td>' + data.child("BrojMobitela").val(); + '</td>';
                content += '<td>' + data.child("Oib").val(); + '</td>';
                content += '<td class="skriveniId" style="display:none">' + data.key; + '</td>';
                content += '<td><button class="urediButton">Uredi</button></td>';

                content += '</tr>';
            });
            $('#ex-table').append(content);
            /*
            // NA MILIJUN ITERACIJA INTERVAL VREMENA SA I BEZ INDEKSIRANJA
            console.time('looper');
            while (i < 1000000) {
              i ++
            }
            console.timeEnd('looper')
*/

        }
    });

}
/*------------------FUNKCIJA ZA PREGLED UNESENIH KORISNIKA-------------------*/

/*-----FUNKCIJA KOJA PRIKAZUJE BUTTON ZA PREUZIMANJE MAIN FORME U PDF-U-------*/
function prikaziBtnZaIspisPDFa() {
    document.getElementById("btnSpremiTablicuDjelatnikaPDF").style.display = "";
}
/*-----FUNKCIJA KOJA PRIKAZUJE BUTTON ZA PREUZIMANJE MAIN FORME U PDF-U-------*/

/*-----FUNKCIJA KOJA SKRIVA DUGME DOHVATI SVE DJELATNIKE----------------------*/
function funSakriOvoDugmeNakonKlika() {
    var x = document.getElementById("btnDohvatiDjelatnikeDrugaFormaPregledDjelatnika");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
/*-----FUNKCIJA KOJA SKRIVA DUGME DOHVATI SVE DJELATNIKE----------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/

// function funDohvatiDodatnePostavkeDjelatnikaBrojMobitela(){
//   console.log("uslo  u funkcijom");
//   $('#ex-tablee tbody').remove();
//
//   var brojMobitelaKorisnika = $('#txtBrojMobitelaKorisnikaKojegPretrazujemo').val();
//   var root = firebase.database().ref().child("Korisnik").orderByChild("BrojMobitela").equalTo(brojMobitelaKorisnika).once("value", function (snapshot){
//     snapshot.forEach(function(childSnapshot){
//
//       if (childSnapshot.exists()) {
//         var content = '';
//   console.log("uslo  u if fun");
//         // ZAGLAVLJE TABLICE POČINJE
//         content += '<thead><tr class="text-center">';
//         content += '<td><b>DETALJNO</b></td>';
//         content += '<td><b>KORISNIK</b></td></tr></thead>';
//         // ZAGLAVLJE TABLICE ZAVRŠAVA
//
//         // table content
//         content += '<tr class="text-center"><td>Ime</td>';
//         content += '<td>' + childSnapshot.child("Ime").val() + '</td></tr>';
//
//         content += '<tr class="text-center"><td>Prezime</td>';
//         content += '<td>' + childSnapshot.child("Prezime").val() + '</td></tr>';
//
//         content += '<tr class="text-center"><td>Broj Mobitela</td>';
//         content += '<td>' + childSnapshot.child("BrojMobitela").val() + '</td></tr>';
//
//         content += '<tr class="text-center"><td>Oib</td>';
//         content += '<td>' + childSnapshot.child("Oib").val() + '</td></tr>';
//
//         content += '<tr class="text-center"><td>ID:</td>';
//         content += '<td id="txtFirebaseId">' + childSnapshot.key + '</td></tr>';
//
//         console.log(childSnapshot.val());
//         console.log(childSnapshot.child("Ime").val());
//         console.log(childSnapshot.child("Prezime").val());
//         console.log(childSnapshot.child("BrojMobitela").val());
//         console.log(childSnapshot.child("Oib").val());
//         console.log(childSnapshot.key);
//
//       }
//
//       $('#ex-tablee').append(content);
//     });
//   });
// }
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
// var btnIzbrisiKorisnikaPoOibu = document.getElementById("btnIzbrisiKorisnikaPoOibu");

function funDohvatiDodatnePostavkeDjelatnikaOib(id){
  console.log("uslo  u funkcijom");
  $('#ex-tableOib tbody').remove();

//  $('#btnIzbrisiKorisnikaPoOibu').remove();

  var varOib = $('#txtOibKorisnikaKojegPretrazujemo').val();
  var root = firebase.database().ref().child("Korisnik").orderByKey().equalTo(id).once("value", function (snapshot){
    snapshot.forEach(function(childSnapshot){

      if (childSnapshot.exists()) {
        var content = '';
  console.log("uslo  u if fun");
        // ZAGLAVLJE TABLICE POČINJE
        content += '<thead><tr class="text-center">';
        content += '<td><b>KORISNIK</b></td>';
        content += '<td><b>DETALJNO</b></td></tr></thead>';
        // ZAGLAVLJE TABLICE ZAVRŠAVA

        // table content
        content += '<tr class="text-center"><td>Ime</td>';
        content += '<td>' + childSnapshot.child("Ime").val() + '</td></tr>';

        content += '<tr class="text-center"><td>Prezime</td>';
        content += '<td>' + childSnapshot.child("Prezime").val() + '</td></tr>';

        content += '<tr class="text-center"><td>Broj Mobitela</td>';
        content += '<td>' + childSnapshot.child("BrojMobitela").val() + '</td></tr>';

        content += '<tr class="text-center"><td>Oib</td>';
        content += '<td>' + childSnapshot.child("Oib").val() + '</td></tr>';

        content += '<tr class="text-center"><td>ID:</td>';
        content += '<td id="txtFirebaseId">' + childSnapshot.key + '</td></tr>';

        console.log(childSnapshot.val());
        console.log(childSnapshot.child("Ime").val());
        console.log(childSnapshot.child("Prezime").val());
        console.log(childSnapshot.child("BrojMobitela").val());
        console.log(childSnapshot.child("Oib").val());
        console.log(childSnapshot.key);
        currentUserId=childSnapshot.key;
      }
      $('#ex-tableOib').empty();
      $('#ex-tableOib').append(content);
      $('#divUrediPostojecegDjelatnika').show();
  //    $('#ex-btnIzbrisiKorisnikaPoOibu').append(content);
    });
  });

}

/*
FUNKCIJA KOJA BRISE SAMO JEDAN �VOR I SVE NJEGOVE VRIJEDNOSTI
*/
var txtBrisanjeKorisnika = document.getElementById("txtBrisanjeKorisnika");
function funTestDruga() {
    const fb = firebase.database().ref();
    // key = document.getElementById('txtBrisanjeKorisnika').value;


      fb.child('Korisnik/' + currentUserId + '/').remove();
      alert("Uspješno ste obrisali korisnika");


}

/*
FUNKCIJA KOJA BRISE SAMO JEDAN �VOR I SVE NJEGOVE VRIJEDNOSTI
*/



/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*-----------FUNKCIJA ZA UPDATE TELEFONSKOG BROJA NEDOVRŠENA********************/
/*
function btnTestZaUpdate(){
  var firebaseRef = firebase.database().ref('Korisnik/1544679441274');
  firebaseRef.update({ Ime: 'Test', Prezime: 'Testić ', BrojMobitela: '000 000 000' });
  console.log("USPJELO");
}
*/



/*
// naziv funkcije za testiranje funZaTestiranjeBrojaTelefona
function funTestZaModul(){
  console.log("uslo  u fun koja bi trebala updejtati broj telefona");
//  $('#btnIzbrisiKorisnikaPoOibu').remove();

  var trenutniBrojTelefona = $('#txtPostojeciBrojTelefonaKorisnikaKojegaZelimoPromjeniti').val();
  var noviBrojTelefonaKorisnika = $('#txtNoviBrojTelefonaKorisnikaKojegZelimoPromjeniti').val();

  var root = firebase.database().ref('Korisnik/').orderByChild('BrojMobitela').equalTo(trenutniBrojTelefona).once("value", function (snapshot){
    snapshot.forEach(function(childSnapshot){
      if (childSnapshot.exists()) {
        console.log("doso je do to");
        root.update({ BrojMobitela: noviBrojTelefonaKorisnika });

//  firebaseRef.update({ Ime: 'Test', Prezime: 'Testić ', BrojMobitela: '000 000 000' });
/*
        console.log(childSnapshot.key);
        console.log(trenutniBrojTelefona);
        console.log("uslo u testnu funkciju");
        console.log(noviBrojTelefonaKorisnika);

        // izdjednačavanje sa novim brojem varijablu sa starim borjem telefona

        console.log(trenutniBrojTelefona);

      }
    });
  });
}
*/

/*------------------------------------NE BRISATI------------------------------*/
/*---------------------------------------------------------------------------*/
/*-------------DOHVAĆA DVA TELEFONSKA BROJA I TREBA IH ZAMJENITI-------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*
function funBlaBla(){
  alert("Kliknuli ste na potvrdi novi unos");
  var trenutniBrojTelefona = $('#txtPostojeciBrojTelefonaKorisnikaKojegaZelimoPromjeniti').val();
  var noviBrojTelefonaKorisnika = $('#txtNoviBrojTelefonaKorisnikaKojegZelimoPromjeniti').val();
  firebase.database().ref("Korisnik").orderByChild("BrojMobitela").equalsTo("091000000").once("value", function(snapshot){
    snapshot.forEach(function(user){
      console.log(trenutniBrojTelefona);
      user.ref.child("Korisnik").set("1");
    });
  })
}


function funBlaBla(){
 var testU = firebase.database().ref("Korisnik").orderByChild("BrojMobitela").equalto("1").once("value", function(snapshot){
   snapshot.forEach(function(user){
     user.ref.child("BrojMobitela").set(30);
   });
 })
}
*/
/*------------------------------------NE BRISATI------------------------------*/
/*---------------------------------------------------------------------------*/
/*-------------DOHVAĆA DVA TELEFONSKA BROJA I TREBA IH ZAMJENITI-------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*
FUNKCIJA KOJA UPDATA ZADNJEG KORISNIKA I NEKU NJEGOVU VRIJEDNSOT
function btnTestZaUpdate(){
  console.log("uslo u testnu funkciju za update");
// var db = firebase.database();
var query = firebase.database().ref().child("Korisnik").orderByChild("JedinstvenaSifraKorisnika").equalTo("1544679441274");
query.once("value", function(snapshot) {
//  snapshot.ref.update({ Ime: "tutututu" })
  console.log("doslo do ovdje");
   snapshot.ref.update({ BrojMobitela: "7" })
});
}
*/

//  https://stackoverflow.com/questions/48926410/how-to-match-the-textbox-value-then-update-the-specific-data-into-firebase-web
/*
 function btnTestZaUpdate(){
   console.log("uslo u testnu funkciju za update");
// var db = firebase.database();
var db = firebase.database();
// var query = db.ref('Korisnik/1544737739615/Ime').set("test");
var query = db.ref('Korisnik/1544737739615').update({ Ime: "Novo Ime" });
// query.once('value', function(snapshot) {
//  snapshot.forEach(function(child){
//    child.ref.update({ BrojMobitela: "Test" });
//  })
//  snapshot.ref.update({ Ime: "tutututu" })
   console.log("doslo do ovdje");

// });
}
*/



// konačno proradio update

function btnTestZaUpdate(){
  var firebaseRef = firebase.database().ref('Korisnik/1544679441274');
  firebaseRef.update({ Ime: 'Test', Prezime: 'Testić ', BrojMobitela: '000 000 000' });
  console.log("USPJELO");
}



/*
function btnFunZaUpdate(){
var noviBrojTelefona = $('#txtNoviBrojMobitela').val();
  alert("Updaejtali ste korisnika");
  var db = firebase.database();
  var updateRef = db.ref('Korisnik/1544679441278');
  updateRef.update({BrojMobitela: noviBrojTelefona});
  console.log("0 je unesena");
}
*/




function btnFunZaUpdate(key){
var noviBrojTelefona = $('#txtNoviBrojMobitela').val();
// key = $('#txtBrisanjeKorisnika').val();
  alert("Updaejtali ste korisnika");
  var db = firebase.database();
  var updateRef = db.ref('Korisnik/').orderByChild('JedinstvenaSifraKorisnika').equalTo(key);
//  updateRef.child('Korisnik/' + key + '/')
//  updateRef.update({BrojMobitela: noviBrojTelefona});
    var testRot =db.ref('Korisnik/' + key + '/')
    testRot.update({BrojMobitela: noviBrojTelefona});
    console.log(key);
    console.log("Unesen novi br");
//  updateRef.update({BrojMobitela: noviBrojTelefona});
//  console.log("0 je unesena");
}




/*
var txtBrisanjeKorisnika = document.getElementById("txtBrisanjeKorisnika");
function funTestDruga() {
    const fb = firebase.database().ref();
    key = document.getElementById('txtBrisanjeKorisnika').value;
    fb.child('Korisnik/' + key + '/').remove();
    alert("Uspješno ste obrisali korisnika");
}
*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
