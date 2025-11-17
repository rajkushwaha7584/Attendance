// =======================
// Full Attendance & Payment Logic
// =======================

// Load student list from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];
let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};
let today = new Date().toISOString().slice(0, 10);
let currentDate = today;

let dateInput = document.getElementById("dateSelector");
dateInput.value = today;
dateInput.min = today;

dateInput.addEventListener("change", function () {
  currentDate = this.value;
  if (!attendanceData[currentDate]) attendanceData[currentDate] = {};
  loadAttendanceTable();
});

// Save students to localStorage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ------------------------
// Load Attendance Table
// ------------------------
function loadAttendanceTable() {
  let tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";

  students.forEach((student) => {
    if (!attendanceData[currentDate]) attendanceData[currentDate] = {};
    if (!attendanceData[currentDate][student.id]) {
      attendanceData[currentDate][student.id] = "absent";
    }

    let status = attendanceData[currentDate][student.id];
    let disabledAttr = currentDate !== today ? "disabled" : "";

    let totalPresent = 0,
      totalAbsent = 0;
    Object.values(attendanceData).forEach((day) => {
      if (day[student.id] === "present") totalPresent++;
      else totalAbsent++;
    });

    let totalDays = totalPresent + totalAbsent;

    let expireDate = student.paidDate
      ? new Date(new Date(student.paidDate).getTime() + 30 * 86400000)
          .toISOString()
          .slice(0, 10)
      : "";

    let lockFields = student.amount && student.paidDate ? "readonly" : "";

    let row = document.createElement("tr");
    row.className = status;

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td><input type="checkbox" ${
        status === "present" ? "checked" : ""
      } onchange="toggleAttendance('${student.id}',this)" ${disabledAttr}></td>
      <td>${totalPresent}</td>
      <td>${totalAbsent}</td>
      <td>${totalDays}</td>
      <td><input type="number" value="${
        student.amount || ""
      }" min="0" onchange="updateAmount('${
      student.id
    }',this)" ${lockFields}></td>
      <td><input type="date" value="${
        student.paidDate || ""
      }" onchange="updatePaidDate('${student.id}',this)" ${lockFields}></td>
      <td>${expireDate}</td>
    `;

    tbody.appendChild(row);
  });

  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  saveStudents();
}

// ------------------------
// Attendance toggle
// ------------------------
function toggleAttendance(id, checkbox) {
  if (currentDate !== today) return;
  attendanceData[currentDate][id] = checkbox.checked ? "present" : "absent";
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  loadAttendanceTable();
}

// ------------------------
// Update Payment Info
// ------------------------
function updateAmount(id, input) {
  let student = students.find((s) => s.id === id);
  if (student && !student.amount) {
    student.amount = input.value;
    saveStudents();
    loadAttendanceTable();
  }
}

function updatePaidDate(id, input) {
  let student = students.find((s) => s.id === id);
  if (student && !student.paidDate) {
    student.paidDate = input.value;
    saveStudents();
    loadAttendanceTable();
  }
}

// ------------------------
// Search Student
// ------------------------
function searchStudent() {
  let query = document.getElementById("searchInput").value.toLowerCase();
  let resultDiv = document.getElementById("searchResult");
  let student = students.find(
    (s) => s.id.toLowerCase() === query || s.name.toLowerCase() === query
  );
  if (student) {
    let status = attendanceData[currentDate][student.id] || "absent";
    resultDiv.innerHTML = `<p>${student.id} - ${student.name} : <b>${status}</b></p>`;
  } else {
    resultDiv.innerHTML = `<p>Student not found</p>`;
  }
}

// ------------------------
// Export to Excel
// ------------------------
function exportExcel() {
  let wb = XLSX.utils.book_new();
  let data = [
    [
      "ID",
      "Name",
      "Status",
      "Total Present",
      "Total Absent",
      "Total Days",
      "Amount",
      "Paid Date",
      "Expire Date",
    ],
  ];

  students.forEach((s) => {
    let totalPresent = 0,
      totalAbsent = 0;
    Object.values(attendanceData).forEach((day) => {
      if (day[s.id] === "present") totalPresent++;
      else totalAbsent++;
    });
    let totalDays = totalPresent + totalAbsent;
    let status = attendanceData[currentDate][s.id] || "absent";
    let expireDate = s.paidDate
      ? new Date(new Date(s.paidDate).getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
      : "";
    data.push([
      s.id,
      s.name,
      status,
      totalPresent,
      totalAbsent,
      totalDays,
      s.amount || "",
      s.paidDate || "",
      expireDate,
    ]);
  });

  let ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Attendance " + currentDate);
  XLSX.writeFile(wb, `Attendance-${currentDate}.xlsx`);
}

// ------------------------
// Load Students from Excel
// ------------------------
function loadFromExcel() {
  let fileInput = document.getElementById("fileInput");
  let file = fileInput.files[0];
  if (!file) {
    alert("Select Excel file");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });
    let firstSheet = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[firstSheet];
    let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    jsonData.forEach((row) => {
      let id = (row.id || row.ID || "").toString().trim();
      let name = (row.name || row.Name || "").toString().trim();
      let amount = row.amount || row.Amount || "";
      let paidDate = row.paidDate || row.PaidDate || "";
      if (id && name && !students.find((s) => s.id === id)) {
        students.push({ id, name, amount, paidDate });
      }
    });
    saveStudents();
    alert(`${students.length} students loaded successfully!`);
    loadAttendanceTable();
  };
  reader.readAsArrayBuffer(file);
}

// ------------------------
// Add New Student
// ------------------------
function addNewStudent() {
  let id = prompt("Enter Student ID:");
  let name = prompt("Enter Student Name:");
  if (!id || !name) return alert("ID and Name required!");
  if (students.find((s) => s.id === id))
    return alert("Student with this ID exists!");

  students.push({ id, name, amount: "", paidDate: "" });
  saveStudents();
  loadAttendanceTable();
  alert("Student added successfully!");
}

// ------------------------
// Delete Student with ID prompt
// ------------------------
function deleteStudent() {
  let id = prompt("Enter Student ID to delete:");
  if (!id) return alert("ID is required!"); // Cancel pressed

  // Find student index
  let index = students.findIndex((s) => s.id === id.trim());
  if (index === -1) return alert("Student not found!");

  // Remove student from array
  students.splice(index, 1);

  // Remove attendance records
  for (let date in attendanceData) {
    if (attendanceData[date][id]) delete attendanceData[date][id];
  }

  // Save updates
  saveStudents();
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  loadAttendanceTable();
  alert(`Student with ID ${id} deleted successfully!`);
}

// ------------------------
// Initial load
// ------------------------
loadAttendanceTable();
