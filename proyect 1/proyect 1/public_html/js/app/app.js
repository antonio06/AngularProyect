angular.module('notesApp', [])
	// Un controlador se encarga de la lógica de una parte de la aplicación.
	.controller('MainCtrl', [function () {
		var self = this;
		var id = 3;
		self.arrayErrors = [];
		// Plantilla de datos de persona
		var personModel = {
		    id: null,
		    name: null,
		    surname: null,
		    age: null
		};

		// Array de personas que se inyectarán en la vista.
		self.people = [
		    {id: 0, name: 'Antonio', surname: 'Contreras Román', age: 27},
		    {id: 1, name: 'Santi', surname: 'Camargo Rodríguez', age: 26},
		    {id: 2, name: 'Alejo', surname: 'Aguilar Espinosa', age: 27},
		];

		// Objeto persona (modelo) inicializado con la plantilla personModel
		self.person = angular.copy(personModel);
		self.editingPerson = angular.copy(personModel);
		self.personName = null;

		// Función privada para inicializar el modelo que será utilizado para guardar los datos del formulario

		// Función para el submit del formulario
		self.insert = function () {
		    var arrayErrors = validateForm(self.person);
		    if (arrayErrors.length) {
			self.person = angular.copy(personModel);
		    } else {
			// Añadir nueva id y la incrementamos
			self.person.id = id++;

			// Coger los datos del modelo (obtenidos por la directiva 'ng-model' de cada input del formulario
			self.people.push(self.person);

			// Limpiar el modelo (que limpiará automáticamente los controles del formulario)
			self.person = angular.copy(personModel);
		    }

		};

		function getPreparedPerson(person) {
		    person.age = parseInt(person.age);
		    return person;
		}

		self.update = function () {

		    // Buscar la posición de la persona que está siendo editada
		    var index;
		    for (var a = 0; a < self.people.length; a++) {
			if (self.editingPerson.id === self.people[a].id) {
			    index = a;
			}
		    }

		    // IMPORTANTE: Preparar el objeto de editingPerson para ser actualizado en el array people
		    var person = getPreparedPerson(self.editingPerson);

		    // Sustituir en el array la persona editada con los nuevos datos de editingPerson
		    self.people.splice(index, 1, person);

		    // limpiar el modelo editingPerson
		    self.editingPerson = angular.copy(personModel);
		    $('#modal').modal('hide');
		};

		// Función para cargar los datos de una persona cuando se le de al botón Edit
		self.loadPerson = function (id) {
		    var person;

		    // Buscar la persona que tenga el mismo id que el recibido como parámetro
		    for (var a = 0; a < self.people.length; a++) {
			if (id === self.people[a].id) {
			    person = self.people[a];
			}
		    }

		    // Copiar los datos de la persona en editingPerson para que los datos del formulario de edición cambien
		    self.editingPerson = angular.copy(person);
		    self.personName = self.editingPerson.name;

		    $('#modal').modal('show');
		};

		// Función para borrar una persona pasándo su id como parámetro.
		self.delete = function (id) {
		    self.people.splice(id, 1);
		};

		function validateForm(person) {
		    if (self.person.name === null) {
			self.arrayErrors.push('The field name is required');
		    }

		    if (self.person.surname === null) {
			self.arrayErrors.push('The field surname is required');
		    }

		    if (self.person.age <= 18) {
			self.arrayErrors.push('The field age must be more tham 18 years');
		    }

		    if (!parseInt(self.person.age)) {
			self.arrayErrors.push('The field age must be a number not a string');
		    }
		    return self.arrayErrors;
		}
		;
	    }]);