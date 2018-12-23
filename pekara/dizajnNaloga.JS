/*-----------------FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA--------------------*/
function show(elementId) {
        document.getElementById("divZaPregledUnesenihRecepata").style.display = "none";
        document.getElementById("divBezIcega").style.display = "none";
        document.getElementById(elementId).style.display = "block";
    }
/*  FUNKCIJA ZA SKRIVANJE I OTKRIVANJE DIVA  */
/*---------------------------------------------------------------------------*/
let currentReceptId;


$(document).ready(function(){


  $(document).on('click', '.pokaziButton', function(){
     let row=$(this).closest('tr');
     let id=row.find( ".skriveniId" ).text();
     funDohvatiDodatnePostavkeDjelatnikaOib(id);
   });

  // var select_item = function(){
  //   $('#combination').val(
  //       $("#element_table select").map(function(index, element){ return $(element).val(); }).get().join("+")
  //   );
  // };

  var add_row = function(){
    var options ;
    recepti.forEach(function (arrayItem) {
       options +='<option value="'+arrayItem.key+'">'+arrayItem.naziv+'</option>';

    });
    var new_row = $("<tr><td>"+ ($("#element_table>tr").length+1) +
    `</td><td><select id="artikliDropdown" class='form-control'>`+
    options
    +`</select></td><td><input class="kolicina" type='number' name='kolicinaZamjesaName' id='txtKolicinaZamjesaID'></td><td><a id='delete_row' class='pull-right btn btn-default'>Delete Row</a></td>`).appendTo("#element_table");
//    var kolicinaZamjesa = $("<tr><td>"+ ($("#element_table>tr").length+1) +"</td><td><input type='number' name='kolicinaZamjesaName' id='txtKolicinaZamjesaID'></td></tr>").appendTo("#element_table");
    // select_item();
console.log(new_row.value);

console.log(Object.values(new_row));




  //  kolicinaZamjesa.find('select').on('change', select_item)
    // new_row.find('select').on('change', select_item);
    new_row.find("#delete_row").click(function(){
        $(this).parents("tr").remove();
      // select_item();
      // console.log(new_row.value);
    });
  };
  // add_row();
  $("#add_row").click(add_row);
$("#spremiNalog").on('click',function(){
    let keys=[];
    let kolicine=[];

    $('#tab_logic select').each(function(){
      keys.push($(this).val());

    });
    $('#tab_logic input.kolicina').each(function(){
      kolicine.push($(this).val());

    });

    console.log("kljucevi",keys);
    console.log("kolicine",kolicine);

    var d = new Date();
    var t = d.getTime();
    var counter = t;
    counter+=1;
    var rotRef = firebase.database().ref().child('Nalozi/' + counter);
    let foo = {};
    for(let i=0;i<keys.length;i++){
      foo[keys[i]] = kolicine[i];
    }

    rotRef.set(foo);

   alert("Uspješno unesen nalog");
});
// console.log(new_row.value);


  var database = firebase.database();
  let recepti=[];
  database.ref("Recepti").once('value', function (snapshot) {
      if (snapshot.exists()) {

          snapshot.forEach(function (data) {
            let recept={};
            let naziv= data.child("Naziv").val();
            let key= data.key;

            recept["naziv"]=naziv;

            recept["key"]=key;
            recepti.push(recept);
          });
      }
      add_row();
  });
});






/*------------------FUNKCIJA ZA PREGLED UNESENIH KORISNIKA-------------------*/
function funPregledUnesenihKorisnika() {

    $('#ex-table tbody').remove();

    var database = firebase.database();
    database.ref("Nalozi").once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';

            // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA
            content += '<thead><tr class="text-center">';
            content += '<td><b>BROJ NALOGA</b></td>';
            content += '<td><b>POKAŽI</b></td>';
            content += '</tr></thead>';
            // ZAGLAVLJE ZA TABLICU PREGLED UNESENIH KORISNIKA


            snapshot.forEach(function (data) {
                var val = data.val();
                content += '<tr class="text-center">';
                content += '<td>' + data.key + '</td>';
                content += '<td class="skriveniId" style="display:none">' + data.key; + '</td>';
                content += '<td><button class="pokaziButton">Pokazi</button></td>';
                content += '</tr>';
            });
            $('#ex-table').empty();
            $('#ex-tableOib').empty();
            $('#ex-table').append(content);
            $('#divUrediPostojecegDjelatnika').hide();
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



/********************************************************************************/
function funDohvatiDodatnePostavkeDjelatnikaOib(id){
  console.log("uslo  u funkcijom");
  $('#ex-tableOib tbody').remove();

//  $('#btnIzbrisiKorisnikaPoOibu').remove();
  currentReceptId=id;
//  var varOib = $('#txtOibKorisnikaKojegPretrazujemo').val();
  var root = firebase.database().ref().child("Nalozi").orderByKey().equalTo(id).once("value", function (snapshot){
    snapshot.forEach(function(childSnapshot){

      if (childSnapshot.exists()) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log('CHILDDATA', childData)
        /*    iniciranje polja u koje spremam vrijednost ključa recepta i vrijednost količine   */
        let receptKeys= [];
        let receptKolicine=[];
        /*  puni polje  */
        for (var key in childData) {
            if (childData.hasOwnProperty(key)) {

                receptKeys.push(key);
                receptKolicine.push(childData[key]);
            }
        }


        var content = '';
  console.log("uslo  u if fun");
        // ZAGLAVLJE TABLICE POČINJE
        content += '<thead><tr class="text-center">';
        content += '<td><b>RECEPT</b></td>';
        content += '<td colspan=2><b>DETALJNO</b></td></tr></thead>';
        // ZAGLAVLJE TABLICE ZAVRŠAVA

        // table content


        content += '<tr class="text-center"><td >ID:</td>';
        content += '<td id="txtFirebaseId" colspan=2>' + childSnapshot.key + '</td></tr>';
        content += '<tr class="text-center"><td colspan="3">Recepti:</td>';
        $('#ex-tableOib').empty();
        $('#ex-tableOib').append(content);
        /*   iniciranje praznog polja u koje lijepim vrijednosti  */
        let contentArray=[];
        for(let i=0;i<receptKeys.length;i++){
          /*   iniciranje praznog stringa, da bi se kasnije u njega moglo lijepiti   */
          contentArray[i]="";

          var root = firebase.database().ref().child("Recepti").orderByKey().equalTo(receptKeys[i]).once("value", function (snapshot){
            snapshot.forEach(function(childSnapshot){
              if (childSnapshot.exists()) {

                let contentRec="";
                contentRec += '<tr class="text-center"><td>' + childSnapshot.child("Naziv").val() + '</td>';
                contentRec += '<td colspan=2>' +receptKolicine[i]+'</td></tr>';
                contentRec += '<tr class="sastojciRow"><td colspan="3">Sastojci:</td></tr>';
                contentArray[i]+=contentRec;

                /*  za pojedini recept dohvaća sve artikle iz tog recepta  */
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log('CHILDDATA', childData)
                let artiklKeys= [];
                let artiklKolicine=[];
                for (var key in childData) {
                    if (childData.hasOwnProperty(key)) {
                      if(key!="Naziv"){
                        artiklKeys.push(key);
                        artiklKolicine.push(childData[key]);
                      }
                    }
                }
                /*  u ovoj funkciji dohvaća nazive artikla jedinicaMjere artikla i množi s zadanom količinom  */
                for(let j=0;j<artiklKeys.length;j++){
                  var root = firebase.database().ref().child("Artikli").orderByKey().equalTo(artiklKeys[j]).once("value", function (snapshot){
                    snapshot.forEach(function(childSnapshot){
                      if (childSnapshot.exists()) {
                        let contentArt="";
                        contentArt += '<tr><td>' + childSnapshot.child("NazivArtikla").val() + '</td><td>' + artiklKolicine[j]+childSnapshot.child("JedinicaMjere").val() +'  </td><td>'+ '*'+receptKolicine[i]+'=<b>'+(parseFloat(artiklKolicine[j])*parseFloat(receptKolicine[i])).toFixed(2)+childSnapshot.child("JedinicaMjere").val()+' </b></td></tr>';
                        contentArray[i]+=contentArt;
                        /*  kada dodem do zadnjeg artikla od zadnjeg recepta onda prodem po polju u kojem smo
                        zaljepili sve stringove te ih ispiše redom  */
                        if ((i==receptKeys.length-1) && (j==artiklKeys.length-1)){
                          for(let z=0;z<contentArray.length;z++){
                            $('#ex-tableOib').append(contentArray[z]);
                          }
                        }
                      }
                    });

                  });
                }
              }
            });
          });
        }
      }

      $('#divUrediPostojecegDjelatnika').show();
  //    $('#ex-btnIzbrisiKorisnikaPoOibu').append(content);
    });
  });
}
/********************************************************************************/


// function funTestDruga() {
//     const fb = firebase.database().ref();
//     console.log('CURRENTRECEPTID', currentReceptId)
//     // key = document.getElementById('txtBrisanjeKorisnika').value;
//       fb.child('Recepti/' + currentReceptId + '/').remove();
//       alert("Uspješno ste obrisali recept");
// }
