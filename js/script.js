var myApplication = (function () {

    var pokemonRepository = (function () {

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

        function add(name, height, ...types) {
            if (typeof (name) !== 'string') {
                alert(typeof name);
                return false;
            }
            if (typeof (height) !== 'number') {
                alert('Height must be a number');
                return false;
            }
            for (i = 0; i < types.length; i++) {
                if (typeof (types[i]) !== 'string') {
                    alert(`All types must be a string. '${types[i]}' is not a string`);
                    return false;
                }
            }
            this.name = new Pokemon(name, height, ...types);
            repository.push(this.name);
        };

        function getAll() {
            return repository;
        }
        return {
            add: add,
            getAll: getAll
        };
    })();
    pokemonRepository.add('Charzard', 2, 'fire', 'flying')
    var list = pokemonRepository.getAll();
    console.log(list);
    list.forEach(function (currentObject) {
        var heightText;
        if (currentObject.height >= 1) {
            heightText = `(height: ${currentObject.height}m) - Wow, that's big!`;
        } else {
            heightText = `(height: ${currentObject.height}m)`;
        };
        document.write(`<p>${currentObject.name} ${heightText}</p>`);
    });
})();
