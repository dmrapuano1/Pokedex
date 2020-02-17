function Pokemon(name, height, ...types) {
    this.name = name;
    this.height = height;
    this.types = [types];
}

var repository = [
    new Pokemon('Bulbasaur', 0.7, 'grass', 'poison'),
    new Pokemon('Charmander', 0.6, 'fire'),
    new Pokemon('Squirtle', 0.5, 'water'),
    new Pokemon('Ninetales', 1.1, 'fire'),
    ];

for (i = 0; i < repository.length; i++) {
    var heightText;
    if (repository[i].height >= 1) {
        heightText = `(height:${repository[i].height} m) - Wow, that's big!`;
    } else {
        heightText = `(height:${repository[i].height} m)`;
    };
    document.write(`${repository[i].name} ${heightText} `);
};
