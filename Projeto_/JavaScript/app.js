Physijs.scripts.worker = "JavaScript/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

document.addEventListener("DOMContentLoaded", Start);

cena = new Physijs.Scene();
cena.setGravity(new THREE.Vector3(0, -100, 0)); //gravidade
cena.fog = new THREE.Fog(branco, 5, 10000); //nevoeiro

var renderer = new THREE.WebGLRenderer({ antialias: true });

document.body.appendChild(renderer.domElement);

//Cores
var vermelho = "rgb(255,0,0)";
var verde = "rgb(10,200,10)";
var branco = "rgb(255,255,255)";
var preto = "rgb(0,0,0)";
var azul = "rgb(0,180,250)";
var amarelo = "rgb(255,255,0)";

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);
renderer.setClearColor(preto);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener("resize", windowResize, false);

var aspectRatio = window.innerWidth / window.innerHeight;
var step = 0;
var clock = new THREE.Clock();

var cameraPerspetiva = new THREE.PerspectiveCamera(35, aspectRatio, 300, 10000);
cena.add(cameraPerspetiva);

var viewsize = 500;
cameraOrtografica = new THREE.OrthographicCamera(
  (-aspectRatio * viewsize) / 2,
  (aspectRatio * viewsize) / 2,
  viewsize / 2,
  -viewsize / 2,
  -1000,
  1000
);
cena.add(cameraOrtografica);

var cameraFirstperson = new THREE.PerspectiveCamera(35, aspectRatio, 50, 10000);
cena.add(cameraFirstperson);

var cameraDrone = new THREE.PerspectiveCamera(35, aspectRatio, 300, 10000);
cena.add(cameraDrone);

var camara = cameraFirstperson;

//Luzes
var luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
luzAmbiente.castShadow = true;
cena.add(luzAmbiente);

var luzPoint = new THREE.PointLight(0xffffff, 0.8);
luzPoint.shadowCameraVisible = true;
luzPoint.shadowMapWidth = 512;
luzPoint.shadowMapHeight = 512;
luzPoint.castShadow = true;
luzPoint.position.set(0, 1000, -150);
cena.add(luzPoint);

var spotLight1 = new THREE.SpotLight(branco, 0.5);
var spotLight2 = new THREE.SpotLight(branco, 0.5);
var spotLight3 = new THREE.SpotLight(branco, 0.5);
var spotLight4 = new THREE.SpotLight(branco, 0.5);

//Criar camião
function criarCamiao() {
  //Camiao maian
  var camiao = new Physijs.BoxMesh(
    new THREE.BoxGeometry(100, 30, 39.9),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/trascamiao.jpg"),
    })
  );
  camiao.position.set(-1000, 0, -150);
  camiao.updateMatrix();
  camiao.castShadow = true;

  //Camiao frente
  var camiao_frente = new Physijs.BoxMesh(
    new THREE.BoxGeometry(35, 15, 40),
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/camiao.jpg"),
    })
  );
  camiao_frente.position.set(51.5, -11.5, 0);
  camiao_frente.updateMatrix();

  //Roda1
  var roda1 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda1.position.set(45, -13, -20);
  roda1.updateMatrix();

  //Roda2
  var roda2 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda2.position.set(-35, -13, 20);
  roda2.updateMatrix();

  //Roda3
  var roda3 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda3.position.set(45, -13, 20);
  roda3.updateMatrix();

  //Roda4
  var roda4 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda4.position.set(-35, -13, -20);
  roda4.updateMatrix();

  //roda5
  var roda5 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda5.position.set(-15, -13, -20);
  roda5.updateMatrix();

  //Roda6
  var roda6 = new Physijs.SphereMesh(
    new THREE.TorusGeometry(5, 4, 100, 100),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/roda.jpg"),
    })
  );
  roda6.position.set(-15, -13, 20);
  roda6.updateMatrix();

  //Criar eixos

  var eixo1 = new Physijs.BoxMesh(
    new THREE.CylinderGeometry(5, 5, 45, 32),
    new THREE.MeshLambertMaterial({ color: preto })
  );
  eixo1.updateMatrix();
  eixo1.position.set(-35, -10, 0);
  eixo1.rotation.x = Math.PI / -2;

  var eixo2 = new Physijs.BoxMesh(
    new THREE.CylinderGeometry(5, 5, 45, 32),
    new THREE.MeshLambertMaterial({ color: preto })
  );
  eixo2.updateMatrix();
  eixo2.position.set(45, -10, 0);
  eixo2.rotation.x = Math.PI / -2;

  var eixo3 = new Physijs.BoxMesh(
    new THREE.CylinderGeometry(5, 5, 45, 32),
    new THREE.MeshLambertMaterial({ color: preto })
  );
  eixo3.updateMatrix();
  eixo3.position.set(-15, -10, 0);
  eixo3.rotation.x = Math.PI / -2;

  //Criar frente

  var frente = new Physijs.BoxMesh(
    new THREE.CylinderGeometry(20, 20, 39.8, 32, 32, false, 0, 2.9),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/camiao.jpg"),
    })
  );
  frente.updateMatrix();
  frente.position.set(49.5, -10, 0);
  frente.rotation.x = Math.PI / -2;
  frente.rotation.y = Math.PI / -2;

  var vidro = new Physijs.BoxMesh(
    new THREE.CylinderGeometry(12, 12, 36, 32, 32, false, 0, 2.9),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/vidro.jpg"),
    })
  );
  vidro.updateMatrix();
  vidro.position.set(56, -4, 0);
  vidro.rotation.x = Math.PI / -2;
  vidro.rotation.y = Math.PI / -2;

  //Criar grelha da frente
  var grelha = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 10, 19),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/grelha.jpg"),
    })
  );
  grelha.updateMatrix();
  grelha.position.set(69, -10, -1);
  //Criar Farois

  var farol1 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farolfrente.jpg"),
    })
  );
  farol1.updateMatrix();
  farol1.position.set(69, -8, -15);

  var farol2 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farolfrente.jpg"),
    })
  );
  farol2.updateMatrix();
  farol2.position.set(69, -8, 15);

  var farol3 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farolvermelho.jpg"),
    })
  );
  farol3.updateMatrix();
  farol3.position.set(-49, -8, 15);

  var farol4 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farolvermelho.jpg"),
    })
  );
  farol4.updateMatrix();
  farol4.position.set(-49, -8, -15);

  var farol5 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farollaranja.jpg"),
    })
  );
  farol5.updateMatrix();
  farol5.position.set(-49, -8, -9);

  var farol6 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/farollaranja.jpg"),
    })
  );
  farol6.updateMatrix();
  farol6.position.set(-49, -8, 9);

  //Criar matricula

  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  var matricula_textura = textureLoader.load("./Texturas/matricula.jpg");
  matricula_textura.anisotropy = maxAnisotropy;
  matricula_textura.wrapS = matricula_textura.wrapT = THREE.RepeatWrapping;

  var matricula = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 4, 15),
    new THREE.MeshLambertMaterial({ map: matricula_textura })
  );
  matricula.updateMatrix();
  matricula.position.set(67, -17.5, -1);

  var matricula2 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(5, 4, 15),
    new THREE.MeshLambertMaterial({ map: matricula_textura })
  );
  matricula2.updateMatrix();
  matricula2.position.set(-48, -12, -1);

  //Criar camião final

  camiao.add(camiao_frente);
  camiao.add(roda1);
  camiao.add(roda2);
  camiao.add(roda3);
  camiao.add(roda4);
  camiao.add(roda5);
  camiao.add(roda6);
  camiao.add(eixo1);
  camiao.add(eixo2);
  camiao.add(eixo3);
  camiao.add(frente);
  camiao.add(farol1);
  camiao.add(farol2);
  camiao.add(farol3);
  camiao.add(farol4);
  camiao.add(farol5);
  camiao.add(farol6);
  camiao.add(matricula);
  camiao.add(matricula2);
  camiao.add(grelha);
  camiao.add(vidro);
  camiao.material.FlatShading = true;
  camiao.position.set(300, -70, -900);
  camiao.rotation.y = Math.PI / -2;
  camiao.castShadow = true;
  cena.add(camiao);

  return camiao;
}

//Bola

function adicionarBola() {
  var raio = 25;
  var bola = new Physijs.SphereMesh(
    new THREE.SphereGeometry(raio, 20, 20),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/bola.png"),
    })
  );
  bola.updateMatrix();
  bola.reciveShadow = true;
  bola.castShadow = true;
  luzPoint.add(bola);
  bola.FlatShading = true;
  bola.position.set(300, -50, -250);
  cena.add(bola);

  return bola;
}

//Terreno
function adicionarTerreno() {
  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  var terreno_textura = textureLoader.load("./Texturas/campo.jpg");
  var terreno_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: terreno_textura,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading,
    })
  );

  terreno_textura.anisotropy = maxAnisotropy;
  terreno_textura.wrapS = terreno_textura.wrapT = THREE.RepeatWrapping;
  terreno_textura.repeat.set(25, 25);
  terreno_textura.reciveShadow = true;

  var terreno_geometria = new THREE.PlaneBufferGeometry(12000, 10000, 10, 10);

  var terreno = new Physijs.BoxMesh(terreno_geometria, terreno_material);
  terreno.position.set(0, -100, -150);
  terreno.rotation.x = Math.PI / -2;
  terreno.reciveShadow = true;
  terreno.renderReverseSided = false;
  cena.add(terreno);

  return terreno;
}

//SkyBox
function adicionarSkybox() {
  var skyboxArray = [];
  var skybox_bk = new THREE.TextureLoader().load("./SkyBox/bluecloud_bk.jpg");
  var skybox_dn = new THREE.TextureLoader().load("./SkyBox/bluecloud_dn.jpg");
  var skybox_ft = new THREE.TextureLoader().load("./SkyBox/bluecloud_ft.jpg");
  var skybox_lf = new THREE.TextureLoader().load("./SkyBox/bluecloud_lf.jpg");
  var skybox_rt = new THREE.TextureLoader().load("./SkyBox/bluecloud_rt.jpg");
  var skybox_up = new THREE.TextureLoader().load("./SkyBox/bluecloud_up.jpg");

  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_ft }));
  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_bk }));
  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_up }));
  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_dn }));
  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_rt }));
  skyboxArray.push(new THREE.MeshBasicMaterial({ map: skybox_lf }));

  for (var i = 0; i < 6; i++) {
    skyboxArray[i].side = THREE.BackSide;
  }

  var skyboxGeom = new THREE.BoxGeometry(10000, 10000, 10000);
  var skybox = new THREE.Mesh(skyboxGeom, skyboxArray);
  cena.add(skybox);

  return skybox;
}

//Model Baliza
var bal = new THREE.Object3D();

var loader = new THREE.MTLLoader();
loader.load("./Objetos/football_goal.mtl", function (materials) {
  materials.preload();
  var objectLoader = new THREE.OBJLoader();
  objectLoader.setMaterials(materials);
  objectLoader.load("./Objetos/football_goal.obj", function (mesh) {
    mesh.position.set(200, -100, 0);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.4;
    bal.add(mesh);
    return bal;
  });
});

//Model Drone
var drone = new THREE.Object3D();

var loader2 = new THREE.MTLLoader();
loader2.load("./Objetos/drone.mtl", function (materials2) {
  materials2.preload();
  var objectLoader2 = new THREE.OBJLoader();
  objectLoader2.setMaterials(materials2);
  objectLoader2.load("./Objetos/drone.obj", function (mesh2) {
    drone.add(mesh2);
    return drone;
  });
});

//Model Texto
var texto = new THREE.Object3D();

var loader3 = new THREE.FontLoader();

loader3.load("./Fonts/helvetiker_regular.typeface.json", function (font) {
  var textgeometry = new THREE.TextGeometry("Golooo", {
    font: font,
    size: 100,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  var textmaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/golojpg.jpg"),
  });
  var text = new THREE.Mesh(textgeometry, textmaterial);
  texto.add(text);
  texto.position.set(-1500, 0, -1500);
  texto.rotation.y = Math.PI / 2;
  //cena.add(texto);

  return texto;
});

//Model arvores
var arvore1 = new THREE.Object3D();

var loader4 = new THREE.MTLLoader();
loader4.load("./Objetos/tree.mtl", function (materials4) {
  materials4.preload();
  var objectLoader4 = new THREE.OBJLoader();
  objectLoader4.setMaterials(materials4);
  objectLoader4.load("./Objetos/tree.obj", function (mesh4) {
    mesh4.scale.x = mesh4.scale.y = mesh4.scale.z = 5;

    arvore1.add(mesh4);
    arvore1.position.set(-150, -100, -900);

    cena.add(arvore1);

    return arvore1;
  });
});

var arvore2 = new THREE.Object3D();

var loader5 = new THREE.MTLLoader();
loader5.load("./Objetos/tree.mtl", function (materials5) {
  materials5.preload();
  var objectLoader5 = new THREE.OBJLoader();
  objectLoader5.setMaterials(materials5);
  objectLoader5.load("./Objetos/tree.obj", function (mesh5) {
    mesh5.scale.x = mesh5.scale.y = mesh5.scale.z = 5;

    arvore2.add(mesh5);
    arvore2.position.set(-150, -100, -600);

    cena.add(arvore2);

    return arvore2;
  });
});

var arvore3 = new THREE.Object3D();

var loader6 = new THREE.MTLLoader();
loader6.load("./Objetos/tree.mtl", function (materials6) {
  materials6.preload();
  var objectLoader6 = new THREE.OBJLoader();
  objectLoader6.setMaterials(materials6);
  objectLoader6.load("./Objetos/tree.obj", function (mesh6) {
    mesh6.scale.x = mesh6.scale.y = mesh6.scale.z = 5;

    arvore3.add(mesh6);
    arvore3.position.set(-150, -100, -300);

    cena.add(arvore3);

    return arvore3;
  });
});

var arvore4 = new THREE.Object3D();

var loader7 = new THREE.MTLLoader();
loader7.load("./Objetos/tree.mtl", function (materials7) {
  materials7.preload();
  var objectLoader7 = new THREE.OBJLoader();
  objectLoader7.setMaterials(materials7);
  objectLoader7.load("./Objetos/tree.obj", function (mesh7) {
    mesh7.scale.x = mesh7.scale.y = mesh7.scale.z = 5;

    arvore4.add(mesh7);
    arvore4.position.set(-150, -100, 0);

    cena.add(arvore4);

    return arvore4;
  });
});

//Criar "Estadio"
function adicionarCampo() {
  var op = 0.01;

  var baliza = new Physijs.BoxMesh(
    new THREE.BoxGeometry(200, 80, 100),
    new THREE.MeshLambertMaterial({
      color: verde,
      opacity: op,
      transparent: true,
    })
  );
  baliza.position.set(100, 0, -100);
  baliza.updateMatrix();

  var baliza2 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(100, 80, 70),
    new THREE.MeshLambertMaterial({
      color: verde,
      opacity: op,
      transparent: true,
    })
  );
  baliza2.position.set(150, 0, -70);
  baliza2.updateMatrix();

  var baliza3 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(100, 80, 70),
    new THREE.MeshLambertMaterial({
      color: verde,
      opacity: op,
      transparent: true,
    })
  );
  baliza3.position.set(-150, 0, -70);
  baliza3.updateMatrix();

  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  var parede_textura = textureLoader.load("./Texturas/pedra.jpg");
  parede_textura.anisotropy = maxAnisotropy;
  parede_textura.wrapS = parede_textura.wrapT = THREE.RepeatWrapping;
  parede_textura.repeat.set(3, 3);

  var campo = new Physijs.BoxMesh(
    new THREE.BoxGeometry(250, 60, 50),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  campo.position.set(-225, -10, -120);
  campo.updateMatrix();

  var campo2 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(250, 60, 50),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  campo2.position.set(225, -10, -120);
  campo2.updateMatrix();

  var campo3 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(1200, 60, 50),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  campo3.position.set(-325, -10, -700);
  campo3.rotation.y = Math.PI / -2;
  campo3.updateMatrix();

  var campo4 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(1200, 60, 50),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  campo4.position.set(325, -10, -700);
  campo4.rotation.y = Math.PI / -2;
  campo4.updateMatrix();
  var campo5 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(700, 60, 50),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  campo5.position.set(0, -10, -1300);
  campo5.updateMatrix();

  var poste = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 400, 42),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/madeira.jpg"),
    })
  );
  poste.position.set(325, 100, -110);
  poste.updateMatrix();

  var poste2 = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 400, 42),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/madeira.jpg"),
    })
  );
  poste2.position.set(-325, 100, -110);
  poste2.updateMatrix();

  var poste3 = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 400, 42),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/madeira.jpg"),
    })
  );
  poste3.position.set(-325, 100, -1300);
  poste3.updateMatrix();

  var poste4 = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, 400, 42),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/madeira.jpg"),
    })
  );
  poste4.position.set(325, 100, -1300);
  poste4.updateMatrix();
  //Bancada

  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  var bancada_textura = textureLoader.load("./Texturas/povo2.jpg");
  bancada_textura.anisotropy = maxAnisotropy;
  bancada_textura.wrapS = bancada_textura.wrapT = THREE.RepeatWrapping;
  bancada_textura.repeat.set(1, 1);

  var textureLoader = new THREE.TextureLoader();
  var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  var bancada_textura2 = textureLoader.load("./Texturas/povo.jpg");
  bancada_textura2.anisotropy = maxAnisotropy;
  bancada_textura2.wrapS = bancada_textura2.wrapT = THREE.RepeatWrapping;
  bancada_textura2.repeat.set(1, 1);

  var bancada1 = new THREE.Mesh(
    new THREE.BoxGeometry(200, 1200, 10),
    new THREE.MeshLambertMaterial({ map: bancada_textura2 })
  );
  bancada1.position.set(400, 30, -700);
  bancada1.rotation.x = Math.PI / -2;
  bancada1.rotation.y = Math.PI / -4;

  var bancada2 = new THREE.Mesh(
    new THREE.BoxGeometry(700, 200, 10),
    new THREE.MeshLambertMaterial({ map: bancada_textura })
  );
  bancada2.position.set(0, 30, -1400);
  bancada2.rotation.x = Math.PI / -4;

  var bancada3 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 200, 10),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  bancada3.position.set(-345.1, 0, -1400);
  bancada3.rotation.y = Math.PI / -2;

  var bancada4 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 200, 10),
    new THREE.MeshLambertMaterial({ map: parede_textura })
  );
  bancada4.position.set(400, 0, -100);

  baliza.add(baliza2);
  baliza.add(baliza3);
  baliza.add(campo);
  baliza.add(campo2);
  baliza.add(campo3);
  baliza.add(campo4);
  baliza.add(campo5);
  baliza.add(poste);
  baliza.add(poste2);
  baliza.add(poste3);
  baliza.add(poste4);
  baliza.add(bancada1);
  baliza.add(bancada2);
  baliza.add(bancada3);
  baliza.add(bancada4);
  baliza.position.set(300, -60, 100);
  cena.add(baliza);

  return baliza;
}

//"Holofotes"
var lampada1 = new THREE.Mesh(
  new THREE.OctahedronBufferGeometry(25),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
  })
);
lampada1.position.set(625, 250, -1200);
lampada1.updateMatrix();
lampada1.add(spotLight1);
spotLight1.visible = false;

var lampada2 = new THREE.Mesh(
  new THREE.OctahedronBufferGeometry(25),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
  })
);
lampada2.position.set(-25, 250, -1200);
lampada2.updateMatrix();
lampada2.add(spotLight2);
spotLight2.visible = false;

var lampada3 = new THREE.Mesh(
  new THREE.OctahedronBufferGeometry(25),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
  })
);
lampada3.position.set(-25, 250, -10);
lampada3.updateMatrix();
lampada3.add(spotLight3);
spotLight3.visible = false;

var lampada4 = new THREE.Mesh(
  new THREE.OctahedronBufferGeometry(25),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
  })
);
lampada4.position.set(625, 250, -15);
lampada4.updateMatrix();
lampada4.add(spotLight4);
spotLight4.visible = false;

cena.add(lampada1);
cena.add(lampada2);
cena.add(lampada3);
cena.add(lampada4);

//Linhas do campo
var linha1 = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 10),
  new THREE.MeshLambertMaterial({ color: branco })
);
linha1.position.set(300, -99.5, -200);
linha1.rotation.x = Math.PI / -2;

var linha2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 200),
  new THREE.MeshLambertMaterial({ color: branco })
);
linha2.position.set(445, -99.5, -100);
linha2.rotation.x = Math.PI / -2;

var linha3 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 200),
  new THREE.MeshLambertMaterial({ color: branco })
);
linha3.position.set(155, -99.5, -100);
linha3.rotation.x = Math.PI / -2;

var linha4 = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 10),
  new THREE.MeshLambertMaterial({ color: branco })
);
linha4.position.set(300, -99.5, -700);
linha4.rotation.x = Math.PI / -2;

var meialua = new THREE.Mesh(
  new THREE.RingGeometry(79, 85, 30, 1, 0, Math.PI),
  new THREE.MeshLambertMaterial({ color: branco })
);
meialua.position.set(300, -99.5, -200);
meialua.rotation.x = Math.PI / -2;

var circulo = new THREE.Mesh(
  new THREE.RingGeometry(89, 95, 30, 1, 0, Math.PI * 2),
  new THREE.MeshLambertMaterial({ color: branco })
);
circulo.position.set(320, -99.5, -700);
circulo.rotation.x = Math.PI / -2;

var festejo1 = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/festejo.jpg"),
  })
);
festejo1.position.set(-1500, 150, -1500);
festejo1.updateMatrix();

var festejo2 = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/festejo.jpg"),
  })
);
festejo2.position.set(-1500, 150, -2000);
festejo2.updateMatrix();

var festejo3 = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/festejo.jpg"),
  })
);
festejo3.position.set(-1500, -50, -1500);
festejo3.updateMatrix();

var festejo4 = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture("./Texturas/festejo.jpg"),
  })
);
festejo4.position.set(-1500, -50, -2000);
festejo4.updateMatrix();

function Start() {
  requestAnimationFrame(Animacao);
}

var inc = 0;
var firsttime = true;
var count = 0;
var countbola = 0;
var flag = true;
var andar;
var rever = false;
var primeiradrone = true;
var cores = [vermelho, verde, branco, preto, azul, amarelo];

function Animacao() {
  inc += 0.01;

  lampada1.rotation.y += 0.05;
  lampada2.rotation.y += 0.05;
  lampada3.rotation.y += 0.05;
  lampada4.rotation.y += 0.05;

  if (firsttime) {
    myskybox = adicionarSkybox();
    myterrain = adicionarTerreno();
    mytruck = criarCamiao();
    mytruck.add(camara);
    myball = adicionarBola();
    myfield = adicionarCampo();
    cena.add(bal);
    cena.add(linha1);
    cena.add(linha2);
    cena.add(linha3);
    cena.add(linha4);
    cena.add(meialua);
    cena.add(circulo);

    firsttime = false;
  }

  spotLight1.target.updateMatrixWorld();
  spotLight1.target.position.set(300, 0, -550);

  spotLight2.target.updateMatrixWorld();
  spotLight2.target.position.set(300, 0, -550);

  spotLight3.target.updateMatrixWorld();
  spotLight3.target.position.set(300, 0, -550);

  spotLight4.target.updateMatrixWorld();
  spotLight4.target.position.set(300, 0, -550);

  //Posições camara
  if (camara == cameraFirstperson) {
    //camara.position.set(300,100,0);
    camara.position.set(-300, 80, 80);
    camara.lookAt(mytruck.position);
  } else if (camara == cameraPerspetiva) {
    camara.position.x = -500;
    camara.position.z = 600;
    camara.position.y = 500;
    camara.lookAt(mytruck.position);
  } else if (camara == cameraOrtografica) {
    camara.position.set(-60, 30, -500);
    camara.lookAt(mytruck.position);
  }

  mexerCamiao();

  if (myball.position.z > 0) {
    if (flag) {
      cena.remove(myball);
      count++;
    }
  }
  if (count == 1) {
    flag = false;
    andar = true;
  }

  if (andar) {
    cena.add(texto);
    cena.add(drone);
    cena.add(festejo1);
    cena.add(festejo2);
    cena.add(festejo3);
    cena.add(festejo4);

    if (primeiradrone) {
      drone.position.set(200, 200, 0);
      primeiradrone = false;
    }
    camara = cameraDrone;
    camara.position.set(1000, 400, 500);
    //camara.position.set(200,200,0);
    drone.add(camara);
    camara.lookAt(texto.position);
    texto.rotation.y += 0.02;

    festejo1.rotation.y += 0.03;
    festejo1.rotation.x += 0.03;

    festejo2.rotation.y += 0.03;
    festejo2.rotation.x += 0.03;

    festejo3.rotation.y += 0.03;
    festejo3.rotation.x += 0.03;

    festejo4.rotation.y += 0.03;
    festejo4.rotation.x += 0.03;

    var targetPosition1 = new THREE.Vector3(-900, -50, -1300);

    var tween1 = new TWEEN.Tween(drone.position).to(targetPosition1, 200);

    tween1.start();
    andar = false;
  }

  if (rever) {
    cena.remove(myskybox);
    cena.remove(myterrain);
    cena.remove(mytruck);
    cena.remove(myball);
    cena.remove(myfield);
    cena.remove(bal);
    cena.remove(drone);
    cena.remove(texto);
    cena.remove(festejo1);
    cena.remove(festejo2);
    cena.remove(festejo3);
    cena.remove(festejo4);
    cena.remove(linha1);
    cena.remove(linha2);
    cena.remove(linha3);
    cena.remove(linha4);
    cena.remove(meialua);
    cena.remove(circulo);
    camara = cameraFirstperson;
    count = 0;
    flag = true;
    andar = false;
    primeiradrone = true;
    firsttime = true;
  }

  TWEEN.update();
  cena.simulate(); //faz as físicas
  requestAnimationFrame(Animacao);
  renderer.render(cena, camara);
}

var move_left, move_right, move_up, move_down;

function mexerCamiao() {
  if (move_left) {
    //truck.position.x-=2
    mytruck.rotation.y += Math.PI / 100;
    mytruck.__dirtyRotation = true;
  } else if (move_right) {
    //truck.position.x+=2;
    mytruck.rotation.y -= Math.PI / 100;
    mytruck.__dirtyRotation = true;
  } else if (move_up) {
    var rotation = new THREE.Matrix4().extractRotation(mytruck.matrix);
    var vector = new THREE.Vector3(1000000, 0, 0).applyMatrix4(rotation);
    mytruck.applyCentralImpulse(vector);
  } else if (move_down) {
    var rotation = new THREE.Matrix4().extractRotation(mytruck.matrix);
    var vector = new THREE.Vector3(-1000000, 0, 0).applyMatrix4(rotation);
    mytruck.applyCentralImpulse(vector);
  }
}

document.addEventListener("keydown", function (event) {
  var code = event.keyCode;
  /* move_left = 0; move_right = 0; move_up = 0; move_down = 0; */
  if (code == 37) move_left = 1; //Seta esquerda, -x
  if (code == 38) move_up = 1; //Seta cima, -z
  if (code == 39) move_right = 1; //Seta direita, +x
  if (code == 40) move_down = 1; //Seta baixo, +z
  if (code == 82) rever = true; //Tecla r
});

document.addEventListener("keyup", function (event) {
  var code = event.keyCode;

  if (code == 37) move_left = 0; //Seta esquerda, -x
  if (code == 38) move_up = 0; //Seta cima, -z
  if (code == 39) move_right = 0; //Seta direita, +x
  if (code == 40) move_down = 0; //Seta baixo, +z
  if (code == 82) rever = false; //Tecla r
});

function windowResize() {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener("keydown", onKeyDown, false);

function onKeyDown(event) {
  switch (event.keyCode) {
    case 79 /*O*/:
      camara = cameraOrtografica;
      break;

    case 80 /*P*/:
      camara = cameraPerspetiva;
      break;

    case 49 /*1*/:
      camara = cameraFirstperson;
      break;
  }
}

var butoes = {
  "Ambient Light": function () {
    luzAmbiente.visible = !luzAmbiente.visible;
  },

  "Point Light": function () {
    luzPoint.visible = !luzPoint.visible;
  },

  Holofote1: function () {
    spotLight1.visible = !spotLight1.visible;
    if (spotLight1.visible) {
      lampada1.material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    } else {
      lampada1.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    }
  },

  Holofote2: function () {
    spotLight2.visible = !spotLight2.visible;
    if (spotLight2.visible) {
      lampada2.material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    } else {
      lampada2.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    }
  },

  Holofote3: function () {
    spotLight3.visible = !spotLight3.visible;
    if (spotLight3.visible) {
      lampada3.material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    } else {
      lampada3.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    }
  },

  Holofote4: function () {
    spotLight4.visible = !spotLight4.visible;
    if (spotLight4.visible) {
      lampada4.material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    } else {
      lampada4.material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
      });
    }
  },

  "Ligar todas": function () {
    luzAmbiente.visible = true;
    luzPoint.visible = true;
    spotLight1.visible = false;
    spotLight2.visible = false;
    spotLight3.visible = false;
    spotLight4.visible = false;
  },

  "Desligar todas": function () {
    luzAmbiente.visible = false;
    luzPoint.visible = false;

    spotLight1.visible = false;
    lampada1.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
    });

    spotLight2.visible = false;
    lampada2.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
    });

    spotLight3.visible = false;
    lampada3.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
    });

    spotLight4.visible = false;
    lampada4.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("./Texturas/lampada.jpg"),
    });
  },
};

var gui = new dat.GUI();
gui.add(butoes, "Ambient Light");
gui.add(butoes, "Point Light");
gui.add(butoes, "Holofote1");
gui.add(butoes, "Holofote2");
gui.add(butoes, "Holofote3");
gui.add(butoes, "Holofote4");
gui.add(butoes, "Ligar todas");
gui.add(butoes, "Desligar todas");
