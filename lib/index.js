var _ = require('underscore')
  , Random = require('random-js')
  , GeneticTask = require('genetic').Task
  , sylvester = require('sylvester')
  , Matrix = sylvester.Matrix
  , Vector = sylvester.Vector
  , random = new Random(Random.engines.mt19937().autoSeed());

function readInput(input) {
  var keys = _.keys(input.total);
  var empty = _.reduce(keys, function(obj, key) { obj[key] = 0.0; return obj; }, {});

  return {
    n: input.ingredients.length,
    totalNutrition: _.values(input.total),
    nutritionData: _.map(input.ingredients, function(obj) {
      return _.values(_.pick(_.defaults(obj.nutrition, empty), keys));
    })
  };
}

function getOutput(input, amounts, nutrition, diff, deviation) {
  var keys = _.keys(input.total);

  return {
    input: input,
    amount: _.map(input.ingredients, function(ingridient, index){ return { name: ingridient.name, amount: amounts[index] }; }),
    total: _.object(keys, nutrition),
    diff: _.object(keys, diff),
    deviation: _.object(keys, deviation)
  }
}


function normalizeSolution(s) {
  var sum = _.reduce(decodeSolution(s), function(accumulator, num) { return accumulator + num; }, 0.0);
  _.each(s, function(e, i, list) { list[i] = e / sum; });
  return s;
}

function encodeSolution(s) {
    var sum = _.reduce(s, function(accumulator, num) { return accumulator + num; }, 0.0);
    return _.map(s, function(num) {
      var tmp = this.prev;
      this.prev = num;
      return num - tmp;
    }, { prev: 0.0 });
}

function decodeSolution(s) {
  return _.map(s, function(num) {
    var tmp = this.prev; this.prev = tmp + num;
    return tmp + num;
  }, { prev: 0.0 });
}

function randomSolution(context) {
  return function(callback) {
    var s = new Array(context.n);
    for (var i = 0; i < s.length; i++) {
      s[i] = random.real(0, 1.0, true);
    }
    normalizeSolution(s);
    callback(s);
  }
};

function fitness(context) {
  var sourceNutritionData = Matrix.create(context.nutritionData).transpose();
  var targetNutrition = Vector.create(context.totalNutrition);

  return function(solution, callback) {
    var newAmounts = Vector.create(decodeSolution(solution));

    var d = sourceNutritionData.multiply(newAmounts).elementDivide(targetNutrition).subtract(1.0);
    callback(d.dot(d));
  }
};

function mutate(context) {
  var indices = new Array(context.n);
  for (var i = 0; i < indices.length; i++) { indices[i] = i; }

  return function(solution, callback) {
    var mutation_samples = [ random.integer(0, indices.length - 1) ];//random.sample(indices, random.integer(1, indices.length));
    _.each(mutation_samples, function(i) {
      solution[i] = random.real(0.0, 1.0, true);
    });

    solution = normalizeSolution(solution);
    callback(solution);
  }
}

function crossover(context) {
  var indices = new Array(context.n);
  for (var i = 0; i < indices.length; i++) { indices[i] = i; }

  return function(parent1, parent2, callback) {
    var first_indices = random.sample(indices, random.integer(1, indices.length));
    var second_indices = random.sample(indices, random.integer(1, indices.length));

    var first = _.difference(first_indices, second_indices);
    var second = _.difference(second_indices, first_indices);

    var solution = new Array(context.n);

    _.each(first, function(i) {
      solution[i] = parent1[i];
    });

    _.each(second, function(i) {
      solution[i] = parent2[i];
    });

    _.each(_.difference(indices, first, second), function(i){
      solution[i] = (parent1[i] + parent2[i]) / 2;
    });

    solution = normalizeSolution(solution);
    callback(solution);
  }
}

function run(input, options, callback) {
  var context = readInput(input);

  var opt = {
    getRandomSolution : randomSolution(context),
    fitness : fitness(context),
    mutate : mutate(context),
    crossover : crossover(context),
    stopCriteria : function() { return (this.generation == (options.generations | 100)) },
    popSize : options.popSize | 100,
    minimize : true,
    mutateProbability : options.mutateProbability | 0.2,
    crossoverProbability : options.crossoverProbability | 0.4
  }

  var min = {
    score: 9007199254740992, // Number.MAX_SAFE_INTEGER (ES6)
    solution: undefined
  };

  var t = new GeneticTask(opt);

  t.on('error', function (error) { callback(error); });

  t.on('statistics', function (statistics) {
    if (statistics.minScore < min.score) {
      min.score = statistics.minScore;
      min.solution = decodeSolution(statistics.min);
    }
  });

  t.run(function (stats) {
    if (!min.solution) {
      callback("No solution found!");
    } else {
      var sourceNutritionData = Matrix.create(context.nutritionData).transpose();
      var targetNutrition = Vector.create(context.totalNutrition);
      var newAmounts = Vector.create(min.solution);

      var newNutrition = sourceNutritionData.multiply(newAmounts)
      , deviation = newNutrition.elementDivide(targetNutrition).subtract(1.0)
      , diff = newNutrition.subtract(targetNutrition);

      callback(null, getOutput(input, newAmounts.elements, newNutrition.elements, diff.elements, deviation.elements));
    }
  });
}

module.exports = {
  run: run
}
