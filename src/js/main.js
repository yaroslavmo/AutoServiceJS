import "generatingClients.js"
const studentsUrl = 'http://localhost:3000/clients'
var studentForm;

function init(){
	loadStudents()
		.then(renderStudents);

	studentForm = document.getElementById('student-form');
	studentForm.addEventListener('submit',(event) => {
		event.preventDefault();
		createStudent()
			.then(loadStudents)
			.then(renderStudents);
	});	
};
window.onload = init;

function createStudent(){
	let studentFormValues = {
		'name': studentForm.name.value,
		'mark': studentForm.mark.value
	} 
	return fetch(studentsUrl,{
		method: 'POST',
		headers: {
      		'Accept': 'application/json',
      		'Content-Type': 'application/json'
    		},
    	 body: JSON.stringify(studentFormValues)

	})
		.then(r => r.json())
};

function loadStudents() {
	return fetch(studentsUrl)
				.then(r => r.json());
};

function updateStudentElement(studentElement, student){
	studentElement.querySelector("h1").innerHTML = student.name;
	studentElement.querySelector('div').innerHTML = student.mark;
};

function renderStudents(students){
	console.log(students);
	let summMarks = 0;
	let template = document.getElementById('student-template');
	let studentElement = template.content.querySelector('.student');
	let studentList = document.getElementById('students');
	studentList.innerHTML = '';
	for (let student of students){
		let studentClone = studentElement.cloneNode(true);
		updateStudentElement(studentClone, student);
		summMarks += parseInt(student.mark);
		studentList.appendChild(studentClone);
	}

	let avarageElement = document.getElementById("avarage-mark");
	avarageElement.innerHTML = String(summMarks/students.length);
	studentForm.mark.value = '';
};

var studentsArray = [{name:"Anton", mark:"3"}, {name:"Maksim",mark:"4"}, {name:"Yarik",mark:"5"}];