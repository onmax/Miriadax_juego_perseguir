var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/alien.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('obj2', 'assets/violeta.png');
      game.load.image('cuadro', 'assets/nave1.png');
      game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');


    }
var texto;
    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      obj2 = game.add.sprite(app.inicioX(), app.inicioY(), 'obj2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      cuadro = game.add.sprite(app.inicioX(), app.inicioY(), 'cuadro');
      //TEXT
     texto = game.add.bitmapText(document.documentElement.clientWidth/2,document.documentElement.clientHeight/2,'desyrel','',60);
     texto.anchor.x = 0.5;
     texto.anchor.y = 0.5;


      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(obj2);
      game.physics.arcade.enable(cuadro);


      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);

    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, obj2, app.incrementaPuntuacion2, null,this);
      game.physics.arcade.moveToObject(cuadro, bola, 60,null);
      game.physics.arcade.overlap(bola, cuadro, app.finjuego, null, this);      

    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;

     if(puntuacion < -1000){
      //FIN JUEGO

      app.finjuego();
    }
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();


    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },
incrementaPuntuacion2: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

    obj2.body.x = app.inicioX();
    obj2.body.y = app.inicioY();


    if (puntuacion > 0){
      dificultad = dificultad + 3;
    }
  },

  finjuego: function(){
    t=game.add.bitmapText(200, 100, 'desyrel', 'Fin!', 64);
    game.destroy();

  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}