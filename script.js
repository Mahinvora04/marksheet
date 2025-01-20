// Array to store student data
let students = [];

// fetch data from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const storedData = localStorage.getItem("students");
  if (storedData) {
    students = JSON.parse(storedData);
    updateTable();
  }
});

// event listener for form submission
document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const maths = parseInt(document.getElementById("maths").value);
  const science = parseInt(document.getElementById("science").value);
  const english = parseInt(document.getElementById("english").value);

  // total and grade
  const total = maths + science + english;
  const grade = getGrade(total / 3);

  // Add to students array
  students.push({ name, maths, science, english, total, grade });

  // Update localStorage
  saveToLocalStorage();

  // Update table
  updateTable();

  // Clear form
  document.getElementById("studentForm").reset();
});

// to calculate grade
function getGrade(avg) {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

// to update table (with delete and print options)
function updateTable() {
  const tableBody = document.querySelector("#marksTable tbody");
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    for (const key in student) {
      const cell = document.createElement("td");
      cell.textContent = student[key];
      row.appendChild(cell);
    }

    // Add a delete button for each row
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i> `;
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => deleteStudent(index);
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // Add a print button for each row
    const printCell = document.createElement("td");
    const printButton = document.createElement("button"); // Declare printButton here
    printButton.innerHTML = `<i class="fa-solid fa-print"></i> print`;
    printButton.className = "print-btn";
    printButton.onclick = () => printMarksheet(student);
    printCell.appendChild(printButton);
    row.appendChild(printCell);

    tableBody.appendChild(row);
  });
}

// Function to delete a student
function deleteStudent(index) {
  students.splice(index, 1);
  saveToLocalStorage();
  updateTable();
}

// Function to print a student's marksheet
function printMarksheet(student) {
  const marksheetContent = `
    <html>
      <head>
        <title>Marksheet - ${student.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .marksheet {
            margin: 20px auto;
            border: 1px solid black;
            padding: 20px;
            width: 80%;
          }
          h1 {
            color: #007BFF;
          }
          table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        <div class="marksheet">
          <h1>Marksheet</h1>
          <p><strong>Name:</strong> ${student.name}</p>
          <table>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
            <tr>
              <td>Maths</td>
              <td>${student.maths}</td>
            </tr>
            <tr>
              <td>Science</td>
              <td>${student.science}</td>
            </tr>
            <tr>
              <td>English</td>
              <td>${student.english}</td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>${student.total}</strong></td>
            </tr>
            <tr>
              <td><strong>Grade</strong></td>
              <td><strong>${student.grade}</strong></td>
            </tr>
          </table>
        </div>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `;

  const newWindow = window.open("", "_blank");
  newWindow.document.write(marksheetContent);
  newWindow.document.close();
}

// Update saveToLocalStorage to ensure data is stored correctly
function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Function to download CSV file
function downloadCsv() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Maths,Science,English,Total,Grade\n";

  students.forEach((student) => {
    const row = `${student.name},${student.maths},${student.science},${student.english},${student.total},${student.grade}`;
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", encodedUri);
  downloadLink.setAttribute("download", "marksheet.csv");

  downloadLink.click(); // clicks download button
}

// Add event listener to download button
document.getElementById("downloadCsv").addEventListener("click", downloadCsv);

// Upload CSV file
document.getElementById("uploadCsvInput").addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvData = e.target.result;
      parseCsvData(csvData);
      saveToLocalStorage();
      updateTable();
    };

    reader.readAsText(file);
  }
});

// Parse CSV data
function parseCsvData(csvData) {
  const rows = csvData.split("\n").slice(1);

  students = rows
    .map((row) => {
      const [name, maths, science, english] = row.split(",");
      if (name && maths && science && english) {
        const total = parseInt(maths) + parseInt(science) + parseInt(english);
        const grade = getGrade(total / 3);
        return {
          name,
          maths: parseInt(maths),
          science: parseInt(science),
          english: parseInt(english),
          total,
          grade,
        };
      }
    })
    .filter((student) => student); // Remove undefined entries
}
