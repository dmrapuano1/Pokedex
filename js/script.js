function Pokemon(name, height, ...types) {
    this.name = name;
    this.height = height;
    this.types = [types];
}

var repository = [
    new Pokemon('Bulbasaur', .7, 'grass', 'poison'),
    new Pokemon('Charmander', .6, 'fire'),
    new Pokemon('Squirtle', .5, 'water'),
    ]

console.log(repository)
