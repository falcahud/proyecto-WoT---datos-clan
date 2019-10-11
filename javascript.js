
//Materialize

document.addEventListener('DOMContentLoaded', function() {
M.AutoInit();
var instances = M.updateTextFields();
var elems = document.querySelectorAll('.collapsible');
var instances = M.Collapsible.init(elems, {onOpenStart: compruebaEspacio});

});


//variables

var req = new XMLHttpRequest();
//var id = 500038506;
var id
var clanTag
//var id = 500025989
var menu_act = 0;
var miembros = [];
var datos_clan = [];
var captura = [];
var current = 0;
var GM10 = 'statistics.globalmap_absolute';
var GM08 = 'statistics.globalmap_champion';
var GM06 = 'statistics.globalmap_middle';
var GM10_batallas;
var GM08_batallas;
var GM06_batallas;
var avances;
var gestor_archivos =[{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,coment:"",posDatos:9}];
f = new Date()
var year = f.getFullYear()
var dia = f.getDate()
var mes = f.getMonth()+1
var hora = f.getHours()
var minuto = f.getMinutes()
if (minuto<10){minuto = '0'+minuto}
var fecha = dia+'.'+mes+'.'+year
var ultimo_check = 0;
var activos;
var posicion;
var archDatos;
var posDatos =[9,9,9,9,9]
var posArchDatos = 9
var capturaAbierta = 9
var vect_comp =[]
var datosComp=[]
var datosInicio =[]
var datosFin =[]
var clanVector = []
var tipoCapt = ""
var clanLogo
var datosExp = []
var data = []


window.onload = iniciar


function capturaDatos(){

    document.getElementById('barraProg').style.display = 'block'
    posicion = sitioCaptura()
    req.timeout = 10000
    req.open('GET', 'https://api.worldoftanks.eu/wot/clans/info/?application_id=e6d6b9d34ae22c1094317b26ae69c5fd&clan_id='+id+'&members_key=id', true);
    req.onload = function(){
        var data = JSON.parse(req.response)
        for (let i in data.data[id].members) {
            id_miembro= data.data[id].members[i].account_id
            nick = data.data[id].members[i].account_name
            link_id = 'https://api.worldoftanks.eu/wot/account/info/?application_id=e6d6b9d34ae22c1094317b26ae69c5fd&language=es&extra='+GM10+'%2C+'+GM08+'%2C'+GM06+'&account_id='+id_miembro
            miembros.push({
                "nick" : nick,
                "id" : id_miembro,
                "link" : link_id
            }) 
        }
    datos_clan.length=0
    obten_datos(miembros[current].link);
    }

    req.send()

    req.onerror = function(){
        console.log('Algo ha salido mal')
        document.getElementById('lleno').innerHTML = 'Algo ha salido mal, intentalo de nuevo'
    }


    req.ontimeout = function(){
        console.log('está tardando mucho')
        document.getElementById('lleno').innerHTML = 'Está tardando mucho, intentalo de nuevo'
    }
    

}

function eliminaDatos(){

    let vector_elim = [0,0,0,0,0]
    if (gestor_archivos[0].ocup == 1) {
        if(document.getElementById('chk0').checked == true){
        vector_elim[0] = vector_elim[0]+1
        }
    }
    if (gestor_archivos[1].ocup == 1) {
        if(document.getElementById('chk1').checked == true){
        vector_elim[1] = vector_elim[1]+1
        }
    }
    if (gestor_archivos[2].ocup == 1) {
        if(document.getElementById('chk2').checked == true){
        vector_elim[2] = vector_elim[2]+1
        }
    }
    if (gestor_archivos[3].ocup == 1) {
        if(document.getElementById('chk3').checked == true){
        vector_elim[3] = vector_elim[3]+1
        }
    }
    if (gestor_archivos[4].ocup == 1) {
        if(document.getElementById('chk4').checked == true){
        vector_elim[4] = vector_elim[4]+1
        }
    }

    desplaza(vector_elim)
    for (i=0;i<5;i++){
        let index = "chk"+i
        let lupaIndex = "lupa"+i
        if (document.getElementById(index)){ 
        document.getElementById(lupaIndex).style.display = "none"
        document.getElementById("kk"+i).style.display ="block"
        }
    }
}

function comparaDatos(){
    
    if (activos<2){
        document.getElementById('pocasCap').innerHTML='Selecciona dos capturas para poder comparar'
    }
    if (activos==2){
        let comparaInicio=9
        let comparaFin=9
        let i,j
        let GMIni, AVIni, SKIni, GMFin, AVFin, SKFin
        for (k=0;k<5;k++) {
            
            if (vect_comp[k] == 1 && comparaInicio != 9){comparaFin=k}
            if (vect_comp[k] == 1 && comparaInicio == 9){comparaInicio=k}
        }
        i = parseInt(gestor_archivos[comparaInicio].posDatos)
        j = parseInt(gestor_archivos[comparaFin].posDatos)

        datos_clan.length = 0
        datosInicio = JSON.parse(localStorage.getItem('datos'+i))
        datos_clan.length = 0
        datosFin = JSON.parse(localStorage.getItem('datos'+j))
        datosComp.length = 0
        datosComp.push({
            "nick" : i,
            "batallas" : j
        })

        for (key in datosInicio){
            nick = datosInicio[key].nick
            GMIni = datosInicio[key].batallas.GM
            AVIni = datosInicio[key].batallas.AV
            SKIni = datosInicio[key].batallas.SK
            for (keyFin in datosFin){
                if (nick == datosFin[keyFin].nick){
                    GMFin = datosFin[keyFin].batallas.GM
                    AVFin = datosFin[keyFin].batallas.AV
                    SKFin = datosFin[keyFin].batallas.SK
                    break
                } else {
                    GMFin = 0
                    AVFin = 0
                    SKFin = 0
                }
            }

            let battlesComp = {'GM': GMFin-GMIni, 'AV':AVFin-AVIni, 'SK' : SKFin-SKIni}
            if ((GMFin-GMIni)<0) {
                battlesComp = {'GM': "Sin datos", 'AV':"Usa la opción", 'SK' : "Añadir jugador"}
            }
            datosComp.push({
            "nick" : nick,
            'batallas' : battlesComp
        })
        }

        objSerialized = JSON.stringify(datosComp);
        localStorage.setItem('datos5', objSerialized);
        muestraCap(5)
        tipoCapt = "comparacion"
    }
}

function nuevoMiembro(){
    
    var newPlayer = document.getElementById("nuevoJugador")
    let newId,newNick
    let newGM10_batallas
    let newGM08_batallas
    let newGM06_batallas
    let newGM_batallas
    let newAV
    let newSK
    let newDatos0 = []
    let newDatos1 = []
    let newDatos2 = []
    let newDatos3 = []
    let newDatos4 = []
    let newBatallas
    var clanes = []

    req.open('GET', 'https://api.worldoftanks.eu/wot/account/list/?application_id=e6d6b9d34ae22c1094317b26ae69c5fd&search='+newPlayer.value, true);
    req.onload = function(){
        let newData = JSON.parse(req.response)
        if (newData.meta.count>0){
            
            newId = newData.data[0].account_id
            let newLink = 'http://api.worldoftanks.eu/wot/account/info/?application_id=e6d6b9d34ae22c1094317b26ae69c5fd&language=es&extra='+GM10+'%2C+'+GM08+'%2C'+GM06+'&account_id='+newId
            var req3 = new XMLHttpRequest();
            req3.open('GET',newLink, true );
            req3.timeout = 10000
            req3.onload = function(){
                let newData = JSON.parse(req3.responseText)
                newGM10_batallas = newData.data[newId].statistics.globalmap_absolute.battles;
                newGM08_batallas = newData.data[newId].statistics.globalmap_champion.battles;
                newGM06_batallas = newData.data[newId].statistics.globalmap_middle.battles;
                newGM_batallas = newGM10_batallas + newGM08_batallas + newGM06_batallas;
                newAV = newData.data[newId].statistics.stronghold_defense.battles;
                newSK = newData.data[newId].statistics.stronghold_skirmish.battles;
                newBatallas = {'GM': newGM_batallas, 'AV':newAV, 'SK' : newSK}

                document.getElementById('noexiste').className = "green-text"
                document.getElementById('noexiste').innerHTML = 'Añadido'

                leeGestor()
                if (gestor_archivos[0].ocup == 1) {
                    if(document.getElementById('chk0').checked == true){
                        newDatos0.length = 0
                        newDatos0 = JSON.parse(localStorage.getItem('datos'+gestor_archivos[0].posDatos))
                        newDatos0.push({
                            "id" : newId,
                            "nick" : newPlayer.value,
                            'batallas' : newBatallas
                        })
                        objSerialized = JSON.stringify(newDatos0);
                        localStorage.setItem('datos'+gestor_archivos[0].posDatos, objSerialized);
                    }
                }
                if (gestor_archivos[1].ocup == 1) {
                    if(document.getElementById('chk1').checked == true){
                        newDatos1.length = 0
                        newDatos1 = JSON.parse(localStorage.getItem('datos'+gestor_archivos[1].posDatos))
                        newDatos1.push({
                            "id" : newId,
                            "nick" : newPlayer.value,
                            'batallas' : newBatallas
                        })
                        objSerialized = JSON.stringify(newDatos1);
                        localStorage.setItem('datos'+gestor_archivos[1].posDatos, objSerialized);
                    }
                }
                if (gestor_archivos[2].ocup == 1) {
                    if(document.getElementById('chk2').checked == true){
                        newDatos2.length = 0
                        newDatos2 = JSON.parse(localStorage.getItem('datos'+gestor_archivos[2].posDatos))
                        newDatos2.push({
                            "id" : newId,
                            "nick" : newPlayer.value,
                            'batallas' : newBatallas
                        })
                        objSerialized = JSON.stringify(newDatos2);
                        localStorage.setItem('datos'+gestor_archivos[2].posDatos, objSerialized);
                    }
                }
                if (gestor_archivos[3].ocup == 1) {
                    if(document.getElementById('chk3').checked == true){
                        newDatos3.length = 0
                        newDatos3 = JSON.parse(localStorage.getItem('datos'+gestor_archivos[3].posDatos))
                        newDatos3.push({
                            "id" : newId,
                            "nick" : newPlayer.value,
                            'batallas' : newBatallas
                        })
                        objSerialized = JSON.stringify(newDatos3);
                        localStorage.setItem('datos'+gestor_archivos[3].posDatos, objSerialized);
                    }
                }
                if (gestor_archivos[4].ocup == 1) {
                    if(document.getElementById('chk4').checked == true){
                        newDatos4.length = 0
                        newDatos4 = JSON.parse(localStorage.getItem('datos'+gestor_archivos[4].posDatos))
                        newDatos4.push({
                            "id" : newId,
                            "nick" : newPlayer.value,
                            'batallas' : newBatallas
                        })
                        objSerialized = JSON.stringify(newDatos4);
                        localStorage.setItem('datos'+gestor_archivos[4].posDatos, objSerialized);
                    }
                }
                newPlayer.value = ""
                M.updateTextFields()
            }
            req3.onerror = function(){
                console.log('Algo ha salido mal')
                document.getElementById('noexiste').className = "red-text text-darken-1"
                document.getElementById('noexiste').innerHTML = 'Algo ha salido mal, intentalo de nuevo'
            }

            req3.ontimeout = function(){
                console.log('está tardando mucho')
                document.getElementById('noexiste').className = "red-text text-darken-1"
                document.getElementById('noexiste').innerHTML = 'Está tardando mucho, intentalo de nuevo'
            }
            req3.send()
            
        } else {
            console.log('El jugador no existe')
            document.getElementById('noexiste').className = "red-text text-darken-1"
            document.getElementById('noexiste').innerHTML = 'El jugador no existe.'
        }
    }
    req.send()
}

function seleccionaClan(){
    var clan = document.getElementById("clan").value
    var reqClan = new XMLHttpRequest();
    reqClan.open('GET', 'https://api.worldoftanks.eu/wot/clans/list/?application_id=e6d6b9d34ae22c1094317b26ae69c5fd&search='+clan, true);
    reqClan.onload = function(){
        let clanData = JSON.parse(reqClan.responseText)
        if (clanData.meta.count>0){
            id = clanData.data[0].clan_id
            clanTag = clanData.data[0].tag
            clanLogo = clanData.data[0].emblems.x195.portal
            document.getElementById("clantag").innerHTML = clanTag
            document.getElementById("clanlogo").src = clanLogo
        }
        clanVector.length = 0
        clanVector.push({"id":id,"tag":clanTag, "logo":clanLogo})
        objSerialized = JSON.stringify(clanVector);
        localStorage.setItem('archClan', objSerialized);
        document.getElementById("clan").value = clanTag
        M.updateTextFields()
    }
    reqClan.send()
}

function sitioCaptura(){
    let cont=0

    for (let i in gestor_archivos) {
        if(gestor_archivos[i].ocup==0){
            return cont
        }
        cont++
    }
    return 9
}

function compruebaEspacio(){
    leeGestor()
    let posicion = sitioCaptura()
    if (posicion == 9){
        document.getElementById('btn_capt').disabled = true
        document.getElementById('lleno').innerHTML = 'El almacen de capturas está lleno.'
        document.getElementById('llenoimp').innerHTML = 'El almacen de capturas está lleno.'
        document.getElementById('btnimp').disabled = true
    } else {
        if (id!=null){
        document.getElementById('btn_capt').disabled = false
        document.getElementById('lleno').innerHTML = ''
        document.getElementById('llenoimp').innerHTML = ''
        document.getElementById('btnimp').disabled = false
        }
    }
}

function addTabla(fecha, hora, comentario, k){
    let contenido = "<tr><td><div align='center'>" + fecha + "  " + hora + "</div></td><td><div align='center'>" + comentario + '</td><td><label style="display:" id="kk'+k+'" for="chk'+k+'"><input type="checkbox" id="chk'+k+'" onclick="compCheck('+k+')"/><span></span></label></td></div><td><div align="center"><button onclick="muestraCap('+k+')" id="lupa'+k+'"class="btn-floating btn-small waves-effect waves-light teal lighten-2"><i class="material-icons">search</i></button></div></td></tr>'
    let fila = document.createElement("TR")
    fila.innerHTML = contenido
    document.getElementById('tabla').appendChild(fila)
    document.getElementById("kk"+k).style.display ="none"
}

function addCaptura(indice){
    let contenido = "<tr><td><div align='center'>" + datos_clan[indice].nick + "</div></td><td><div align='center'>" + datos_clan[indice].batallas.GM + "</div></td><td><div align='center'>" + datos_clan[indice].batallas.AV + '</div></td><td><div align="center">' + datos_clan[indice].batallas.SK + '</div></td></tr>'
    let fila = document.createElement("TR")
    fila.innerHTML = contenido
    document.getElementById('captura').appendChild(fila)
}

function iniciar(){

    gestor_archivos = JSON.parse(localStorage.getItem('gestor'))
    buscaPosArchDatos()
    var clanVector = []

    if (gestor_archivos == null){
        var gestor_archivos =[{ocup:0,f:0,h:0,coment:""},{ocup:0,f:0,h:0,coment:""},{ocup:0,f:0,h:0,coment:""},{ocup:0,f:0,h:0,coment:""},{ocup:0,f:0,coment:""}];
        grabaGestor()
    }

    for (let i in gestor_archivos) {
        if (gestor_archivos[i].ocup==1){
            addTabla(gestor_archivos[i].f,gestor_archivos[i].h,gestor_archivos[i].coment,i)
        }    
    }

    clanVector = JSON.parse(localStorage.getItem('archClan'))
    if (clanVector!=null){
        id = clanVector[0].id
        clanTag = clanVector[0].tag
        clanLogo = clanVector[0].logo
        document.getElementById("clantag").innerHTML = clanTag
        document.getElementById("clanlogo").src = clanLogo
    }
    menu(0)
} 

function rellenaDatos(){
    for (let i in gestor_archivos) {
        if (gestor_archivos[i].ocup==1){
            addTabla(gestor_archivos[i].f,gestor_archivos[i].h,gestor_archivos[i].coment,i)
        }
    }
}

function menu(valor){
    if(valor != menu_act){menu_act = valor} else {menu_act = 0}

    if (menu_act == 0){
        
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
            document.getElementById("kk"+i).style.display ="block"
            document.getElementById(index).checked = false
            document.getElementById(index).disabled = true
            document.getElementById(lupaIndex).style.display = "none"
            }
        }
    } else {
            for (i=0;i<5;i++){
                let index = "chk"+i
                let lupaIndex = "lupa"+i
                if (document.getElementById(index)){ 
                document.getElementById(index).disabled = false
                }
            }
        }

    if (menu_act == 1){
        
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
                document.getElementById("kk"+i).style.display ="none"
                document.getElementById(index).checked = false
                document.getElementById(index).disabled = true
                document.getElementById(lupaIndex).style.display = "block"
            }
        }
        if (id== null){
            document.getElementById('muestraclan').innerHTML = "DEBES SELECCIONAR UN CLAN"
            document.getElementById('muestraclan').className = "red-text text-darken-1"
            document.getElementById('btn_capt').disabled = true
        } else { 
            document.getElementById('muestraclan').innerHTML = "CLAN: "+clanTag
            document.getElementById('muestraclan').className = "purple-text text-darken-4"
            document.getElementById('btn_capt').disabled = false
        }

        document.getElementById('barraProg').style.display = "none"
        compruebaEspacio()
        
    }
    if (menu_act == 2){
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
            document.getElementById("kk"+i).style.display ="block"
            document.getElementById(lupaIndex).style.display = "none"
            }
        }
    }
    if (menu_act == 3){
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
            document.getElementById("kk"+i).style.display ="block"
            document.getElementById(index).checked = false
            document.getElementById(lupaIndex).style.display = "none"
            }
        }
        compCheck(0)

    }
    if (menu_act == 4){
        document.getElementById('noexiste').innerHTML = ''
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
            document.getElementById("kk"+i).style.display ="block"
            document.getElementById(lupaIndex).style.display = "none"
            }
        }
    }
    if (menu_act == 5){
        if (id==null){
            document.getElementById("clan").value = ""
        } else {document.getElementById("clan").value = clanTag}
        M.updateTextFields()
        for (i=0;i<5;i++){
            let index = "chk"+i
            let lupaIndex = "lupa"+i
            if (document.getElementById(index)){ 
                document.getElementById("kk"+i).style.display ="none"
                document.getElementById(index).checked = false
                document.getElementById(index).disabled = true
                document.getElementById(lupaIndex).style.display = "none"
            }
        }
        document.getElementById('barraProg').style.display = "none"
        compruebaEspacio()
    }

    if (menu_act == 6){
        document.getElementById('nombrearchivo').addEventListener('change', archivo, false);
        compruebaEspacio()
    }
}

function desplaza(vect){

    let col = 0
    let col_aux = 0
    let long = gestor_archivos.length-1
    let gestor_aux = [{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,coment:"",posDatos:9}]

    for(const i of vect){
        if(i==1){
            gestor_archivos[col].ocup=0
        }
        col++
    }

    col = 0
    for (const i in gestor_archivos) {

        if (gestor_archivos[i].ocup==1){
            gestor_aux[col_aux]=gestor_archivos[col]
            col_aux++
        }
        col++
    }
    gestor_archivos = gestor_aux
    borraTabla()
    rellenaDatos()
    grabaGestor()
} 

function borraTabla(){
    let filas = document.getElementById('tabla').rows.length
    for (k=0;k<filas;k++){
        document.getElementById('tabla').deleteRow(0)
    }
}

function borraCap(){
    let filas = document.getElementById('captura').rows.length
    for (k=0;k<filas;k++){
        document.getElementById('captura').deleteRow(0)
    }
    tipoCapt = ""
}

//Gestiona que en el menu de comparacion no haya mas de dos checkbox activos

function compCheck(pos){

    vect_comp=[0,0,0,0,0]
    activos = 0

    if(menu_act==3){
        if (document.getElementById('chk0')) {
            if(document.getElementById('chk0').checked == true){
                vect_comp[0] = 1
                activos++
            } else { vect_comp[0] = 0}
        }
        if (document.getElementById('chk1')) {
            if(document.getElementById('chk1').checked == true){
                vect_comp[1] = 1
                activos++
            } else { vect_comp[1] = 0}
        }
        if (document.getElementById('chk2')) {
            if(document.getElementById('chk2').checked == true){
                vect_comp[2] = 1
                activos++
            } else { vect_comp[2] = 0}
        }
        if (document.getElementById('chk3')) {
            if(document.getElementById('chk3').checked == true){
                vect_comp[3] = 1
                activos++
            } else { vect_comp[3] = 0}
        }
        if (document.getElementById('chk4')) {
            if(document.getElementById('chk4').checked == true){
                vect_comp[4] = 1
                activos++
            } else { vect_comp[4] = 0}
        }

        if(activos>2){
            index = "chk"+ultimo_check
            document.getElementById(index).checked = false
            vect_comp[ultimo_check]=0
            activos=2
        }
        leeGestor()

        if (sitioCaptura()<2){
            document.getElementById('btn_comp').disabled = true
            document.getElementById('pocasCap').innerHTML='Necesitas al menos dos capturas para poder comparar'
        } else {

            if (activos>1){
                document.getElementById('pocasCap').innerHTML=''
            }
        }
    }
    
    ultimo_check=pos
}
 
//Manejo del fichero gestor de archivos

function grabaGestor(){
    objSerialized = JSON.stringify(gestor_archivos);
    localStorage.setItem('gestor', objSerialized);
}

function leeGestor(){
    gestor_archivos = JSON.parse(localStorage.getItem('gestor'))
    buscaPosArchDatos()
}

// Funciones de obtención de datos de la API de WoT

function obten_datos(url){

    var req2 = new XMLHttpRequest();
    req2.open('GET',url, true );
    req2.onload = function(){
        var data2 = JSON.parse(req2.responseText)
        var id_m = miembros[current].id;
        var nick_m = miembros[current].nick
        GM10_batallas = data2.data[id_m].statistics.globalmap_absolute.battles;
        GM08_batallas = data2.data[id_m].statistics.globalmap_champion.battles;
        GM06_batallas = data2.data[id_m].statistics.globalmap_middle.battles;
        GM_batallas = GM10_batallas + GM08_batallas + GM06_batallas;
        miembros[current].GM = GM_batallas
        miembros[current].avances = data2.data[id_m].statistics.stronghold_defense.battles;
        miembros[current].skirm = data2.data[id_m].statistics.stronghold_skirmish.battles;
        var battles = {'GM': GM_batallas, 'AV':miembros[current].avances, 'SK' : miembros[current].skirm}
        datos_clan.push({
            "id" : id_m,
            "nick" : nick_m,
            'batallas' : battles
        })

        ++current
        if (current < miembros.length) {
            
            obten_datos(miembros[current].link)
            document.getElementById('numProg').innerHTML = current+'/'+(miembros.length-1)
            addCaptura(current-1)
        } else {
            document.getElementById('barraProg').style.display = 'none'
            document.getElementById('numProg').innerHTML = ""
            current = 0
            miembros=[]
            var comentario = document.getElementById("comentario")
            gestor_archivos[posicion].coment = comentario.value
            gestor_archivos[posicion].ocup = 1
            gestor_archivos[posicion].f = dia + "/" + mes + "/" + year
            gestor_archivos[posicion].h = hora + ":" + minuto
            gestor_archivos[posicion].posDatos = posArchDatos
            addTabla(gestor_archivos[posicion].f, gestor_archivos[posicion].h, gestor_archivos[posicion].coment,posicion)
            document.getElementById('chk'+posicion).disabled = true
            grabaGestor()
            compruebaEspacio()
            comentario.value = ""
            M.updateTextFields()
            grabaDatos(gestor_archivos[posicion].posDatos)
        }
    }
    req2.send()
}

// Muestra los datos de la captura

function muestraCap(pos){
    let i
    let datos=[]
    borraCap()

    if (pos == 5){
        datos = leeDatos(5)
        document.getElementById('expcsv').style.display = "none"
        let inicio = datos[0].nick
        let fin = datos[0].batallas
        datos.shift()
        document.getElementById("encabezadoCaptura").innerHTML = "Datos entre la captura "+ gestor_archivos[inicio].f +' '+gestor_archivos[inicio].h+' - '+gestor_archivos[inicio].coment + " y la captura "+ gestor_archivos[fin].f +' '+gestor_archivos[fin].h+' - '+gestor_archivos[fin].coment

    } else {
        i = parseInt(gestor_archivos[pos].posDatos)
        document.getElementById('expcsv').style.display = ""
        datos = leeDatos(i)   
        document.getElementById("encabezadoCaptura").innerHTML = "Captura: "+ gestor_archivos[pos].f +' '+gestor_archivos[pos].h+' - '+gestor_archivos[pos].coment 
    }

    for (const indice in datos) {
        let contenido = "<tr><td><div align='center'>" + datos[indice].nick + "</div></td><td><div align='center'>" + datos[indice].batallas.GM + "</div></td><td><div align='center'>" + datos[indice].batallas.AV + '</div></td><td><div align="center">' + datos[indice].batallas.SK + '</div></td></tr>'
        let fila = document.createElement("TR")
        fila.innerHTML = contenido
        document.getElementById('captura').appendChild(fila)
    }

    //Muestra el pop-up con la captura
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
      });
    //initialize all modals
    $('.modal').modal({
    dismissible: false,
    });
    //call the specific div (modal)
    $('#modal1').modal('open');
    capturaAbierta = i

}

// Graba los datos de los miembros obtenidos con la captura

function grabaDatos(pos){

    archDatos = "datos"+pos
    objSerialized = JSON.stringify(datos_clan);
    localStorage.setItem(archDatos, objSerialized);
}

function leeDatos(pos){
    archDatos = "datos"+pos
    datos_clan.length = 0
    datos_clan = JSON.parse(localStorage.getItem(archDatos))
    return datos_clan
}

function buscaPosArchDatos() {
    posArchDatos = 9
    posDatos =[9,9,9,9,9]
    let i = 0
    for (const key in gestor_archivos) {
        i = parseInt(gestor_archivos[key].posDatos)
        if (i<6) {posDatos[i] = 1}
        }

    for (const key in posDatos) {
        if (posDatos[key] == 9){
            posArchDatos = key
            return
        } else {
            posArchDatos = 9
        }
    }
  }

function copiarCap(){
    var codigoACopiar = document.getElementById('modal1');
    var seleccion = document.createRange();
    seleccion.selectNodeContents(codigoACopiar);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(seleccion);
    var res = document.execCommand('copy');
    window.getSelection().removeRange(seleccion);
    borraCap()
}

//Hoja Excel

function exportarCap(){
    
    alert("Debes usar 'Guardar como' para archivar la hoja Excel")
    let i=0


    if (tipoCapt=="comparacion"){
        datosExp = leeDatos(5)
        let inicio = datosExp[0].nick
        let fin = datosExp[0].batallas
        data[0] = ["Captura: "+ "Datos entre la captura "+ gestor_archivos[inicio].f +' '+gestor_archivos[inicio].h+' - '+gestor_archivos[inicio].coment + " y la captura "+ gestor_archivos[fin].f +' '+gestor_archivos[fin].h+' - '+gestor_archivos[fin].coment]
        datosExp.shift()

    } else {
        datosExp = leeDatos(capturaAbierta)
        data[0] = ["Captura: "+ gestor_archivos[capturaAbierta].f +' '+gestor_archivos[capturaAbierta].h+' - '+gestor_archivos[capturaAbierta].coment]
    }
       
    data[1] = ["JUGADOR","BATALLAS EN MAPA GLOBAL","BATALLAS EN AVANCES","BATALLAS EN ESCARAMUZAS"]
    for (i=0;i<datosExp.length;i++){
        data[i+2] = [datosExp[i].nick,datosExp[i].batallas.GM,datosExp[i].batallas.AV,datosExp[i].batallas.SK]
    }

    var wb = new Workbook()
    ws = sheet_from_array_of_arrays(data);

    //ws['!cols'] = fitToColumn(data);
    ws['!cols'] =[
    {wch:40},
    {wch:30},
    {wch:30},
    {wch:30}
    ];
    ws['!merges']=[{s:{c:0,r:0},e:{c:3,r:0}}]

    function fitToColumn(arrayOfArray) {
        // get maximum character of each column
        return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
    }
       
    /* add worksheet to workbook */
    ws_name = "Captura"
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "sample2.xlsx")

}
 
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

// Estilo hoja Excel

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
            else cell.t = 's';
            
            cell.s={alignment:{horizontal:"center",wrapText:false},border:{bottom:{style:"thin", color:{auto:1}},right:{style:"dotted",color:{auto:1}}}}
			
			if(C == 0){
				cell.s={
					font:{
						bold:true
                    },
                    alignment:{horizontal:"center",wrapText:false},
                    border:{bottom:{style:"thin", color:{auto:1}}, right:{style:"dotted",color:{auto:1}}}
                            
                }
				
			}
			if(R == 0 || R == 1){
				cell.s={
					fill:{
						fgColor:{ rgb: "FFFFAA00" }
					},
                    alignment:{horizontal:"center",wrapText:false},
                    border:{bottom:{style:"thin", color:{auto:1} },right:{style:"thin",color:{auto:1}},top:{style:"thin", color:{auto:1} }}
				}
			}
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

//Trabajos CSV

function exportarCSV(){

    datosExp = leeDatos(capturaAbierta)
    strIni =gestor_archivos[capturaAbierta].f +','+gestor_archivos[capturaAbierta].h+','+gestor_archivos[capturaAbierta].coment+ "\r\n"
    let str = strIni+convertToCSV(datosExp)
    let csvContent = "data:text/csv;charset=utf-8,"+str;
    var encodedUri = encodeURI(csvContent);
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); 
    borraCap()
}

function convertToCSV(objArray) {
    const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    for (let i = 0; i < array.length; i++) {
        let line = "";
        for (let index in array[i]) {
        if (line != "") line += ",";
            let objeto = array[i][index]
            if (index=="batallas"){
                let objGM = objeto.GM
                let objAV = objeto.AV
                let objSK = objeto.SK
                line += objGM+','+objAV+','+objSK
                } else {
                line += array[i][index];
                }
        }
        str += line + "\r\n";
    }
    return str;
}


  function archivo (evt){
      var files = evt.target.files
      var fileList = document.getElementById('nombrearchivo').value
      var reader = new FileReader()
      reader.onload = function (event){
        var contents = event.target.result;
        csvJson(contents)
      }

      reader.readAsText(files[0]);
  }

  function csvJson (csv){

    var lines=csv.split("\r\n");
    var headers=lines[1].split(",");
    leeGestor()
    compruebaEspacio()
    let titulo = lines[0].split(",");
    let comentario = titulo[2]
    let fecha = titulo[0]
    let hora = titulo[1]
    let datosImp = []
    console.log(fecha,hora,comentario)
    buscaPosArchDatos()

    for(var i=1;i<lines.length-1;i++){
        var currentline=lines[i].split(",");
        let GM,AV,SK,id,nick
        console.log(currentline)
        for(var j=0;j<headers.length;j++){
            if (j==0){id = parseInt(currentline[j])}
            if (j==1){nick = currentline[j]}
            if (j==2){GM = parseInt(currentline[j])}
            if (j==3){AV = parseInt(currentline[j])}
            if (j==4){SK = parseInt(currentline[j])}
        }
        let batallas = {'GM': GM, 'AV':AV, 'SK' : SK}
        datosImp.push({
            "id" : id,
            "nick" : nick,
            'batallas' : batallas
        })
    }
    let posHueco = ordenaFechas(fecha,hora)
    let nuevoGestor = huecoGestor(posHueco)
    if (nuevoGestor !=9){
        nuevoGestor[posHueco].f = fecha
        nuevoGestor[posHueco].h = hora
        nuevoGestor[posHueco].coment = comentario
        nuevoGestor[posHueco].ocup = 1
        nuevoGestor[posHueco].posDatos = posArchDatos
    }
    gestor_archivos = nuevoGestor
    datos_clan.length = 0
    datos_clan = datosImp
    grabaGestor()
    grabaDatos(posArchDatos)
    borraTabla()
    rellenaDatos()
  }

function ordenaFechas(fechaText,horaText){
    var fechaComp = fechaDate(fechaText,horaText)
    for (let i=0;i<5;i++){
        if (gestor_archivos[i].ocup == 1){
            let fecha = gestor_archivos[i].f
            let hora = gestor_archivos[i].h
            let fechaGestor = fechaDate(fecha,hora)
            if (fechaComp<=fechaGestor){
                return i
            }
        }
    }
}

function fechaDate(textfecha,texthora){
    var myDate = textfecha.split('/');
    var myHour = texthora.split(':');
    return new Date(myDate[2], myDate[1] - 1, myDate[0],myHour[0],myHour[1]);
}

function huecoGestor(pos){
    leeGestor()
    let posLibre = sitioCaptura()
    if (posLibre !=9){
        let copiaGestor = [{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9},{ocup:0,f:0,h:0,coment:"",posDatos:9}]
        for (k=posLibre;k>pos;k--){
            copiaGestor[k]=gestor_archivos[k-1]
        }
        return copiaGestor
    } else {
        return 9
    }
}