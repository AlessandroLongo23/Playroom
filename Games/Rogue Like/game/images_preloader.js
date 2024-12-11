function preload() {
  // disegni dell'ambiente deserto
  desert_obstacles = [
    {
      img: loadImage("sprites/desert/cactus_0.png"),
      name: "cactus_0",
      trns: createVector(-35, -70),
      w: 100,
      h: 100
    },
    {
      img: loadImage("sprites/desert/cactus_1.png"),
      name: "cactus_1",
      trns: createVector(-73, -103),
      w: 150,
      h: 150
    },
    {
      img: loadImage("sprites/desert/cactus_2.png"),
      name: "cactus_2",
      trns: createVector(-30, -57),
      w: 100,
      h: 100
    }
  ]
  desert_stuff = [
    {
      img: loadImage("sprites/desert/osso.png"),
      name: "osso",
      trns: createVector(-50, -60),
      w: 100,
      h: 100
    },
    {
      img: loadImage("sprites/desert/teschio.png"),
      name: "teschio",
      trns: createVector(-35, -35),
      w: 75,
      h: 70
    }
  ]
  desert_min = loadImage("sprites/desert/min.jpg")
  desert_menù = loadImage("sprites/desert/menù.jpg")
  desert_background = loadImage("sprites/desert/background.jpg")
  // disegni dell'ambiente ghiaccio
  antartica_obstacles = [
    {
      img: loadImage("sprites/antartica/cristallo_di_ghiaccio.png"),
      name: "cristallo_di_ghiaccio",
      trns: createVector(-90, -115),
      w: 230,
      h: 180
    },
    {
      img: loadImage("sprites/antartica/cespuglio_innevato.png"),
      name: "cespuglio_innevato",
      trns: createVector(-43, -56),
      w: 90,
      h: 100
    },
    {
      img: loadImage("sprites/antartica/buco_nel_ghiaccio.png"),
      name: "buco_nel_ghiaccio",
      trns: createVector(-40, -40),
      w: 80,
      h: 80
    }
  ]
  antartica_stuff = []
  antartica_min = loadImage("sprites/antartica/min.jpg")
  antartica_menù = loadImage("sprites/antartica/menù.jpg")
  antartica_background = loadImage("sprites/antartica/background.jpg")
  // disegni dell'ambiente foresta
  grassland_obstacles = [
    {
      img: loadImage("sprites/grassland/sasso.png"),
      name: "sasso",
      trns: createVector(-58, -65),
      w: 120,
      h: 100
    },
    {
      img: loadImage("sprites/grassland/ceppo.png"),
      name: "ceppo",
      trns: createVector(-53, -60),
      w: 110,
      h: 110
    },
    {
      img: loadImage("sprites/grassland/cespuglio.png"),
      name: "cespuglio",
      trns: createVector(-43, -56),
      w: 90,
      h: 100
    },
    {
      img: loadImage("sprites/grassland/carretto_d'oro.png"),
      name: "carretto_d'oro",
      trns: createVector(-117, -145),
      w: 270,
      h: 270
    }
  ]
  grassland_stuff = []
  grassland_min = loadImage("sprites/grassland/min.jpg")
  grassland_menù = loadImage("sprites/grassland/menù.jpg")
  grassland_background = loadImage("sprites/grassland/background.jpg")
  // altri disegni
  filled_heart = loadImage("sprites/cuore_pieno.png")
  empty_heart = loadImage("sprites/cuore_vuoto.png")
  // boss
  treant_roots = loadImage("sprites/treant_roots.png")
  // tempio
  temple_on = loadImage("sprites/tempio_acceso.png")
  temple_off = loadImage("sprites/tempio_spento.png")
}
