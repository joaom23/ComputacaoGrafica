

Physijs.scripts.worker = 'JavaScript/physijs_worker.js'; 
Physijs.scripts.ammo = 'ammo.js';

document.addEventListener('DOMContentLoaded', Start);

cena = new Physijs.Scene;
cena.setGravity(new THREE.Vector3(0, -100, 0)); //gravidade
cena.fog = new THREE.Fog( branco, 5, 10000 ); //nevoeiro

var renderer = new THREE.WebGLRenderer( {antialias: true});

document.body.appendChild(renderer.domElement);

//Cores
var vermelho = "rgb(255,0,0)";
var verde = "rgb(10,200,10)";
var branco = "rgb(255,255,255)";    
var preto = "rgb(0,0,0)";
var azul = "rgb(0,180,250)";

renderer.setSize(window.innerWidth -15, window.innerHeight -15);
renderer.setClearColor(azul);
renderer.shadowMap.enablednabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.setPixelRatio( window.devicePixelRatio );

window.addEventListener( 'resize', windowResize, false );

var aspectRatio = window.innerWidth/window.innerHeight;
var step = 0;
var clock = new THREE.Clock();

var cameraPerspetiva = new THREE.PerspectiveCamera(35, aspectRatio, 300, 10000);
cena.add(cameraPerspetiva);

var viewsize = 500;
cameraOrtografica = new THREE.OrthographicCamera(-aspectRatio*viewsize / 2, aspectRatio * viewsize/ 2, viewsize/2, -viewsize/2, -1000, 1000);
cena.add(cameraOrtografica);

camara = cameraPerspetiva;

//Luzes
var luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
cena.add(luzAmbiente);

var luzPoint = new THREE.PointLight(0xffffff, 0.8);

//luzPoint.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1, 500, 1000));
luzPoint.shadow.bias= 0.001;
luzPoint.shadowDarkness = 0.5;
luzPoint.shadow.mapSize.width = 1024;  
luzPoint.shadow.mapSize.height = 1024;
luzPoint.shadow.camera.near = 0.1;
luzPoint.shadow.camera.far = 25;    
luzPoint.shadowCameraVisible = true;
luzPoint.shadowDarkness = 0.95;
luzPoint.castShadow = true;
luzPoint.position.set(0,1000,-150);
cena.add(luzPoint);



//Criar camião
function criarCamiao(){


var geom = new THREE.Geometry();
 var material= new THREE.MeshPhongMaterial({color: vermelho});
 
 //Camiao mian
var camiao_main = new THREE.Mesh(new THREE.BoxGeometry(100,30,40),
                    new THREE.MeshLambertMaterial({color:vermelho}));
        camiao_main.position.set(0,0,-150);
        camiao_main.updateMatrix();
        geom.merge(camiao_main.geometry, camiao_main.matrix);

//Camiao frente

var camiao_frente = new THREE.Mesh(new THREE.BoxGeometry(20,20,40),
                    new THREE.MeshLambertMaterial({color: vermelho}));
                    camiao_frente.position.set(58.5,-5,-150);
                    camiao_frente.updateMatrix();
                    geom.merge(camiao_frente.geometry, camiao_frente.matrix);

//Roda1
 var roda1 = new THREE.Mesh(new THREE.TorusGeometry(8,4,100,100),
                    new THREE.MeshLambertMaterial({color: preto}));
            roda1.position.set(40,-10, -130);
            roda1.updateMatrix();
            geom.merge(roda1.geometry, roda1.matrix);
//Roda2
var roda2 = new THREE.Mesh(new THREE.TorusGeometry(8,4,100,100),
                     new THREE.MeshLambertMaterial({color: preto}));
        roda2.position.set(-30,-10, -130);
        roda2.updateMatrix();
        geom.merge(roda2.geometry, roda2.matrix);

 //Roda3
 var roda3= new THREE.Mesh(new THREE.TorusGeometry(8,4,100,100),
                 new THREE.MeshLambertMaterial({color: preto}));
        roda3.position.set(40,-10, -170);
        roda3.updateMatrix();
        geom.merge(roda3.geometry, roda3.matrix);

 //Roda4
var roda4 = new THREE.Mesh(new THREE.TorusGeometry(8,4,100,100),
                 new THREE.MeshLambertMaterial({color: preto}));
        roda4.position.set(-30,-10, -170);
        roda4.updateMatrix();
        geom.merge(roda4.geometry, roda4.matrix);

//Criar camião final

 var truck = new Physijs.BoxMesh(geom, material);
 truck.position.y=100;
 truck.position.x = -200;
 truck.__dirtyPosition = true;
 truck.reciveShadow = true;
 truck.castShadow = true;
 luzPoint.add(truck);
 cena.add(truck);

 return truck;

}

//Bola

function adicionarBola(){
    
var raio = 25;
var geom_bola= new THREE.Geometry();
var bola_material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture("./Texturas/bola.jpg")});
var bola_main = new THREE.Mesh( new THREE.SphereGeometry(raio,20,20),
                    new  THREE.MeshPhongMaterial({wireframe: false, color:azul}),0.1,10);
                    bola_main.position.set(-10,0,-150);
                    bola_main.updateMatrix();
                    geom_bola.merge(bola_main.geometry, bola_main.matrix);

var bola = new Physijs.SphereMesh(geom_bola, bola_material, 10, 0.5);
bola.reciveShadow= true;
bola.castShadow= true;
bola.__dirtyPosition = true;
luzPoint.add(bola);
cena.add(bola);

return bola;

}


    
//Terreno
function adicionarTerreno(){
var textureLoader = new THREE.TextureLoader();
var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

var terreno_textura = textureLoader.load("./Texturas/campo.jpg");
var terreno_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({map:terreno_textura}));

terreno_textura.anisotropy = maxAnisotropy;
terreno_textura.wrapS = terreno_textura.wrapT = THREE.RepeatWrapping;
terreno_textura.repeat.set(25,25);

var terreno_geometria= new THREE.PlaneBufferGeometry(12000,10000, 10,10);

var terreno = new Physijs.BoxMesh(terreno_geometria, terreno_material);
terreno.position.set(0,-100,-150);
terreno.rotation.x = Math.PI/-2;
terreno.reciveShadow = true;
cena.add(terreno);

return terreno;

}

//SkyBox
function adicionarSkybox(){
var skyboxArray= [];
var skybox_bk = new THREE.TextureLoader().load("./SkyBox/bluecloud_bk.jpg");
var skybox_dn = new THREE.TextureLoader().load("./SkyBox/bluecloud_dn.jpg");
var skybox_ft = new THREE.TextureLoader().load("./SkyBox/bluecloud_ft.jpg");
var skybox_lf = new THREE.TextureLoader().load("./SkyBox/bluecloud_lf.jpg");
var skybox_rt = new THREE.TextureLoader().load("./SkyBox/bluecloud_rt.jpg");
var skybox_up = new THREE.TextureLoader().load("./SkyBox/bluecloud_up.jpg");

skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_ft}));
skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_bk}));
skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_up}));
skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_dn}));
skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_rt}));
skyboxArray.push(new THREE.MeshBasicMaterial({map:skybox_lf}));

for(var i = 0; i<6;i++){
    skyboxArray[i].side = THREE.BackSide;
}

var skyboxGeom = new THREE.BoxGeometry(10000,10000,10000);
var skybox = new THREE.Mesh(skyboxGeom, skyboxArray);
cena.add(skybox);

return skybox;

}


//Model Baliza
var loader = new THREE.MTLLoader();
loader.load("./Objetos/football_goal.mtl", function(materials){
    materials.preload();
    var objectLoader = new THREE.OBJLoader();
    objectLoader.setMaterials(materials);
    objectLoader.load("./Objetos/football_goal.obj", function(mesh){
        //mesh.position.set(0,-100,200);
        mesh.position.set(200,-100,0);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.4;
        //mesh.rotation.y = Math.PI/2;
      cena.add(mesh);
    })
});

function adicionarBaliza(){

var geomBaliza = new THREE.Geometry();

var matBaliza = new THREE.MeshLambertMaterial({color: verde, opacity: 1, transparent: true});

var baliza1 = new THREE.Mesh(new THREE.BoxGeometry(200,80,10),
                    new THREE.MeshLambertMaterial({color: preto}));
                    baliza1.position.set(100, 0, 240);
                    baliza1.updateMatrix();
                    geomBaliza.merge(baliza1.geometry, baliza1.matrix);
var baliza2 = new THREE.Mesh(new THREE.BoxGeometry(10,80,70),
                    new THREE.MeshLambertMaterial({color: preto}));
                    baliza2.position.set(205,0,210);
                    baliza2.updateMatrix();
                    geomBaliza.merge(baliza2.geometry, baliza2.matrix);
var baliza3 = new THREE.Mesh(new THREE.BoxGeometry(10,80,70),
                    new THREE.MeshLambertMaterial({color: preto}));
                    baliza3.position.set(-5,0,210);
                    baliza3.updateMatrix();
                    geomBaliza.merge(baliza3.geometry, baliza3.matrix);

var baliza = new Physijs.BoxMesh(geomBaliza, matBaliza); 
baliza.__dirtyPosition = true;
cena.add(baliza);

return baliza;
}

var cubogeo = new THREE.BoxGeometry(50,50,50);
var cubomat = new THREE.MeshLambertMaterial({color:verde});
var cubo = new THREE.Mesh(cubogeo, cubomat);
cubo.castShadow= true;
cubo.reciveShadow=true;
luzPoint.add(cubo);
//cena.add(cubo);
                
                var butoes = {

					'Ambient': function() {

						luzAmbiente.visible = ! luzAmbiente.visible;

					},

					'Point': function() {
                        luzPoint.visible = ! luzPoint.visible;

					},

					'Ligar todas': function() {

                        luzAmbiente.visible = true;
                        luzPoint.visible = true;

					},

					'Desligar todas': function() {

						luzAmbiente.visible = false;
                        luzPoint.visible = false;

					}

				};

		var gui = new dat.GUI();
				gui.add( butoes, 'Ambient' );
				gui.add( butoes, 'Point' );
				gui.add( butoes, 'Ligar todas' );
				gui.add( butoes, 'Desligar todas' );

 function Start(){
  
    requestAnimationFrame(Animacao);
   
     
 }
var delta = 0;
var firsttime = true;
var mytruck;

 function Animacao(){

     //step +=1;
    var okok = clock.getDelta();
    delta+= 0.01;

 
   //camara.position.x = 1000;
  // camara.position.z= -100;
    
    if(firsttime){
        adicionarSkybox();
        terreno = adicionarTerreno();
        mytruck = criarCamiao();
        adicionarBola();
        //adicionarBaliza();
        
        firsttime = false;
    }   

    camara.lookAt(terreno.position);
    camara.position.x = Math.sin(delta) *1000;
    camara.position.y=100;
    camara.position.z = Math.cos(delta) *1000;

    mexerCamiao();

/*     if(bola.position.x >= 200){
        cena.remove(bola);
   
    } */

      cena.simulate(); //faz as físicas
     requestAnimationFrame(Animacao);
      renderer.render(cena, camara);

    
 }

 var move_left, move_right, move_up, move_down;

 function mexerCamiao(){
     if(move_left){
         //truck.position.x-=2
         mytruck.rotation.y += Math.PI/100;
         mytruck.__dirtyRotation = true;
     } else if(move_right){
         //truck.position.x+=2;
       mytruck.rotation.y -= Math.PI/100;
        mytruck.__dirtyRotation = true;
     } else if(move_up){
        var c_rotation = new THREE.Matrix4().extractRotation(mytruck.matrix);
        var force_vector = new THREE.Vector3(1000000,0,0).applyMatrix4(c_rotation);
        mytruck.applyCentralImpulse(force_vector); 
        mytruck.__dirtyPosition = true;

        
     }else if(move_down){
        var c_rotation = new THREE.Matrix4().extractRotation(mytruck.matrix);
        var force_vector = new THREE.Vector3(-1000000,0,0).applyMatrix4(c_rotation);
        mytruck.applyCentralImpulse(force_vector);
       mytruck.__dirtyPosition = true;
     }

 }

 document.addEventListener('keydown', function(event){

     var code = event.keyCode;
     /* move_left = 0; move_right = 0; move_up = 0; move_down = 0; */
     if(code == 37) move_left =1; //Seta esquerda, -x
     if(code == 38) move_up = 1; //Seta cima, -z
     if(code == 39) move_right = 1;//Seta direita, +x
     if(code == 40) move_down = 1;//Seta baixo, +z

 });

 document.addEventListener('keyup', function(event){
    var code = event.keyCode;
  
    if(code == 37) move_left =0; //Seta esquerda, -x
    if(code == 38) move_up = 0; //Seta cima, -z
    if(code == 39) move_right = 0;//Seta direita, +x
    if(code == 40) move_down = 0;//Seta baixo, +z

});

function windowResize(){
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

document.addEventListener( 'keydown', onKeyDown, false );

function onKeyDown( event ) {

    switch ( event.keyCode ) {

        case 79: /*O*/

            camara = cameraOrtografica;
       

            break;

        case 80: /*P*/

            camara = cameraPerspetiva;
            

            break;

    }

}