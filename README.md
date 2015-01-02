Usage:
var fre = require('food-reverse-engieer');
fre.run(input, options, function(error, result) { /\* do something \*/ });

_Note: Algorithm is run asynchronously._

Example _result_ object:
```
{ 
  input: { /* input object */ },
   amount: [
    { name: 'sesame', amount: 0.058210649595114974 },
    { name: 'flex seeds', amount: 0.11450554722488634 },
    { name: 'raisins', amount: 0.13232693840615012 },
    { name: 'almonds', amount: 0.13740219462342493 },
    { name: 'date paste', amount: 0.15239908063363478 },
    { name: 'agave sirup', amount: 0.17971114071786315 },
    { name: 'brown rice protein', amount: 0.22544444879892583 }
  ],
  total: { /* new nutrition data */
    energy: 1635.6887218153524,
    protein: 27.736885010506708,
    carbohydrate: 43.46070512777145,
    sugar: 29.82414576205363,
    fiber: 7.465429650308641,
    fat: 14.105646907164719,
    saturates: 1.4472382243023976,
    sodium: 5.244270938513696
  },
  diff: { 
    energy: -162.31127818464756,
    protein: -2.2631149894932925,
    carbohydrate: -0.5392948722285524,
    sugar: 3.8241457620536288,
    fiber: -2.534570349691359,
    fat: 2.1056469071647186,
    saturates: -0.5527617756976024,
    sodium: -12.755729061486303 
  },
  deviation: {
    energy: -0.09027323592027114,
    protein: -0.07543716631644304,
    carbohydrate: -0.01225670164155801,
    sugar: 0.14708252930975485,
    fiber: -0.25345703496913585,
    fat: 0.1754705755970598,
    saturates: -0.2763808878488012,
    sodium: -0.7086516145270169
  }
}
```

Example options object:
```
var options = {
  popSize: 200,
  generations: 150,
  mutateProbability: 0.3,
  crossoverProbability: 04
}
```

Example input object:
```
var input = {
  ingredients: [ {
    name: "sesame",
    //amount: 0.09,
    nutrition: {
      energy: 2366.0,
      protein: 17.0,
      carbohydrate: 25.7,
      sugar: 0.0,
      fiber: 14.0,
      fat: 48.0,
      saturates: 6.7,
      sodium: 11.0
    }
  }, {
    name: "flex seeds",
    //amount: 0.12,
    nutrition: {
      energy: 2236.0,
      protein: 18.3,
      carbohydrate: 28.9,
      sugar: 1.5,
      fiber: 27.3,
      fat: 42.2,
      saturates: 4.7,
      sodium: 30.0
    }
  }, {
    name: "raisins",
    nutrition: {
    energy: 1252.0,
    protein: 3.2,
    carbohydrate: 79.2,
    sugar: 59.2,
    fiber: 3.7,
    fat: 0.5,
    saturates: 0.1,
    sodium: 11.0
    }
  }, {
    name: "almonds",
    nutrition: {
    energy: 2407.0,
    protein: 21.2,
    carbohydrate: 21.7,
    sugar: 3.9,
    fiber: 12.2,
    fat: 49.4,
    saturates: 3.7,
    sodium: 1.0
    }
  }, {
    name: "date paste",
    nutrition: {
    energy: 1160.0,
    protein: 1.8,
    carbohydrate: 75.0,
    sugar: 66.5,
    fiber: 6.7,
    fat: 0.2,
    sodium: 1.0
    }
  }, {
    name: "agave sirup",
    nutrition: {
    energy: 1197.0,
    protein: 0.0,
    carbohydrate: 76.2,
    sugar: 71.4,
    fiber: 4.8
    }
  }, {
    name: "brown rice protein",
    nutrition: {
    energy: 1570.0,
    protein: 80.0,
    carbohydrate: 10.0,
    fat: 1.0
    }
  } ],

  total: {
    energy: 1798.0,
    protein: 30.0,
    carbohydrate: 44.0,
    sugar: 26.0,
    fiber: 10.0,
    fat: 12.0,
    saturates: 2.0,
    sodium: 18.0
  }
};
```
