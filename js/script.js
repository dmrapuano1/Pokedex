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

function printRepsoitory(list) {
    var heightText;
    for (i = 0; i < list.length; i++) {
        if (list[i].height >= 1) {
            heightText = `(height:${list[i].height} m) - Wow, that's big!`;
        } else {
            heightText = `(height:${list[i].height} m)`;
        };
        document.write(`<p>${list[i].name} ${heightText}</p>`);
    };
};

printRepsoitory(repository);
