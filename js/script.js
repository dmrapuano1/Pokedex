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

repository.forEach(function (currentObject) {
    var heightText;
    if (currentObject.height >= 1) {
        heightText = `(height:${currentObject.height} m) - Wow, that's big!`;
    } else {
        heightText = `(height:${currentObject.height} m)`;
    };
    document.write(`<p>${currentObject.name} ${heightText}</p>`);
});
