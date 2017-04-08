angular.module('notesApp', [])
	// Un controlador se encarga de la lógica de una parte de la aplicación.
	.controller('MainCtrl', ['peopleService', function (peopleService) {
		var self = this;
		var id = 3;
		self.errorsAge = [];
		self.errorsName = [];
		self.errorsSurname = [];

		self.editingErrorsAge = [];
		self.editingErrorsName = [];
		self.editingErrorsSurname = [];
		// Plantilla de datos de persona
		var personModel = {
		    id: null,
		    name: null,
		    surname: null,
		    age: null
		};

		// Array de personas que se inyectarán en la vista.
		self.people = peopleService.getPeople();

		var modal = $('#modal');

		modal.on('hide.bs.modal', function () {
		    self.editingErrorsAge = [];
		    self.editingErrorsName = [];
		    self.editingErrorsSurname = [];
		});

		// Objeto persona (modelo) inicializado con la plantilla personModel
		self.person = angular.copy(personModel);
		self.editingPerson = angular.copy(personModel);
		self.personName = null;

		// Función privada para inicializar el modelo que será utilizado para guardar los datos del formulario

		// Función para el submit del formulario
		self.insert = function () {
		    self.errorsAge = validAge(self.person.age);
		    self.errorsName = validName(self.person.name);
		    self.errorsSurname = validSurname(self.person.surname);
		    if (!self.errorsAge.length && !self.errorsName.length && !self.errorsSurname.length) {

			// Coger los datos del modelo (obtenidos por la directiva 'ng-model' de cada input del formulario
			peopleService.addPerson(self.person);

			// Limpiar el modelo (que limpiará automáticamente los controles del formulario)
			self.person = angular.copy(personModel);
		    }
		};

		function getPreparedPerson(person) {
		    person.age = parseInt(person.age);
		    return person;
		}

		self.update = function () {
		    self.editingErrorsAge = validAge(self.editingPerson.age);
		    self.editingErrorsName = validName(self.editingPerson.name);
		    self.editingErrorsSurname = validSurname(self.editingPerson.surname);
		    if (!self.editingErrorsAge.length && !self.editingErrorsName.length && !self.editingErrorsSurname.length) {

			// IMPORTANTE: Preparar el objeto de editingPerson para ser actualizado en el array people
			var person = getPreparedPerson(self.editingPerson);
			// Sustituir en el array la persona editada con los nuevos datos de editingPerson
			peopleService.updatePerson(person);
			// limpiar el modelo editingPerson
			self.editingPerson = angular.copy(personModel);
			modal.modal('hide');
		    }
		};

		// Función para cargar los datos de una persona cuando se le de al botón Edit
		self.loadPerson = function (id) {
		    var person = peopleService.getPerson(id);

		    // Copiar los datos de la persona en editingPerson para que los datos del formulario de edición cambien
		    self.editingPerson = angular.copy(person);
		    self.personName = self.editingPerson.name;

		    modal.modal('show');
		};

		// Función para borrar una persona pasándo su id como parámetro.
		self.delete = function (id) {
		    peopleService.deletePerson(id);
		};

		function validName(name) {
		    var ErrorsName = [];
		    if (name === null || name === '') {
			ErrorsName.push('The field name is required');
		    }
		    return ErrorsName;
		}

		function validSurname(surname) {
		    var ErrorsName = [];
		    if (surname === null || surname === '') {
			ErrorsName.push('The field surname is required');
		    }
		    return ErrorsName;
		}

		function validAge(age) {
		    var ErrorsAge = [];
		    if (age <= 18) {
			ErrorsAge.push('The field age must be more tham 18 years');
		    }

		    if (!parseInt(age)) {
			ErrorsAge.push('The field age must be a number not a string');
		    }

		    return ErrorsAge;
		}
	    }]);