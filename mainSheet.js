// Retrieve the filtered data from sessionStorage
var data = JSON.parse(sessionStorage.getItem('filteredData'));

// Create an object to store the formatted data
const formattedData = [];

// Iterate over the data and group entries by week
data.forEach(entry => {
    const week = entry["Week"];
    const subject = entry["Subject"];
    const signature = entry["Signature"];

    // Find the corresponding week entry in the formattedData
    let weekEntry = formattedData.find(item => item.Week === week);

    if (!weekEntry) {
        // If the week entry doesn't exist, create a new one
        weekEntry = {
            Week: week,
            Subject: subject,
            Signature: signature,
            Classes: []
        };
        formattedData.push(weekEntry);
    }

    // Remove the "Week" property from the entry
    const { Week, ...classEntry } = entry;

    // Add the class entry to the Classes array
    weekEntry.Classes.push(classEntry);
});

// Iterate over the formatted data and add roll numbers to the parameter "Attendance [Roll No ?]"
formattedData.forEach(weekEntry => {
    weekEntry.Classes.forEach(classEntry => {
        const rollNumbersKey = 'Roll numbers of other students (if any)';
        const rollNumbersString = classEntry[rollNumbersKey];
        if (rollNumbersString && rollNumbersString !== "NA") {
            const rollNumbers = rollNumbersString.split(', ').map(rollNumber => rollNumber.trim());
            classEntry.Backlog = {};
            rollNumbers.forEach(rollNumber => {
                const attendanceKey = `Attendance [Roll No ${ rollNumber }]`;
                classEntry.Backlog[attendanceKey] = "P";
            });
        }
    });
});


// Log the formatted data
console.log("formattedData", formattedData);

document.addEventListener("DOMContentLoaded", function () {
    
    var container = document.querySelector('.container');
    // var topBox = document.querySelector('.top-box');
    // var bottomBox = document.querySelector('.bottom-box');

    // var body = document.querySelector('.pageBody');
    let noOfWeek = formattedData.length 
    // console.log("noOfWeek", noOfWeek);

    for (var i = 0; i < noOfWeek; i++) {
        var weekEntry = formattedData[i];
        // console.log("weekEntry", weekEntry);
        var week = weekEntry.Week;
        var subject = weekEntry.Subject;
        var signature = weekEntry.Signature;

        // console.log("subject", subject);

        // Create the HTML structure for each week entry
        var weekEntryHTML = `
            <div class="break"></div>
            <div class="logo-container">
                <div class="logo"></div>
                <div class="logo-text">F/QSP 11/07/04</div>
            </div>

            <div class="heading">
                <h3>Weekly Attendance Sheet</h3>
                <h3>BACHELORS PROGRAMME</h3>
                <h3>Department of Computer Science</h3>
                <h3>Second Year (CSIT) SEC B (2021)</h3>
            </div>

            <div class="subject-input">
                <div class="left">
                    <span>Subject: </span>
                    <input type="text" value="${subject}" class="no-outline" name="subject">
                </div>
                <div class="right">
                    <span></span>
                </div>
            </div>`;

        // Append the week entry HTML to the container
        container.innerHTML += weekEntryHTML;
        let noOfClasses = weekEntry.Classes.length
        // console.log("noOfClasses", noOfClasses);

        for (let j = 0; j < noOfClasses; j++){
            var classEntry = formattedData[i].Classes[j];
            console.log("classEntry", classEntry);
            // console.log("Week",i);
            // console.log("Class",j);

            var topic = classEntry.Topic;
            var options = { day: '2-digit', month: 'short', year: 'numeric' };
            var formattedDate = formatDate(classEntry.Date, options);
            var formattedTime = formatTime(classEntry.Period);

            // Initialize counters
            let totalStudents = 0;
            let presentStudents = 0;
            let absentStudents = 0;

            // Loop through the attendance records for each class
            for (var key in classEntry) {
                if (key.startsWith('Attendance [Roll No')) {
                    var rollNumber = key.substring(key.indexOf('N') + 2, key.indexOf(']'));
                    // Now you can use the `rollNumber` as needed
                    // console.log("Roll Number:", rollNumber);
                    totalStudents++; // Increment the total number of students
                    if (classEntry[key] === 'P') {
                        presentStudents++; // Increment the number of present students
                    } else if (classEntry[key] === 'A') {
                        absentStudents++; // Increment the number of absent students
                    }
                }
            }
            if(classEntry.Backlog){
                // Loop through the attendance records for each class
                for (var key in classEntry.Backlog) {
                    if (key.startsWith('Attendance [Roll No')) {
                        var rollNumber = key.substring(key.indexOf('N') + 2, key.indexOf(']'));
                        // Now you can use the `rollNumber` as needed
                        // console.log("Roll Number:", rollNumber);
                        totalStudents++; // Increment the total number of students
                        if (classEntry.Backlog[key] === 'P') {
                            presentStudents++; // Increment the number of present students
                        } else if (classEntry.Backlog[key] === 'A') {
                            absentStudents++; // Increment the number of absent students
                        }
                    }
                }
            }

            var classEntryHTML = `
            <div class="pageBodyContainer">
                <div class="big-box">
                    <div class="top-box">
                        <div class="info">
                            <div class="left">
                                Date: <span><input type="text" value="${formattedDate}" class="no-outline" name="date"></span>
                                <br>
                                Week: <span><input type="text" value="${week}" class="no-outline" name="week"></span>
                            </div>
                            <div class="middle">
                                Time/Period: <span><input type="text" value="${formattedTime}" class="no-outline" name="time"></span>
                                <br>
                                Topic: <span><input type="text" value="${topic}" class="no-outline" name="topic"></span>
                            </div>
                            <div class="right">
                                <span class="regular" id="regular-${i+','+j}"></span>
                                <br>
                                <span class="compensatory" id="compensatory-${i+','+j}"></span>
                            </div>
                        </div>
                        <div class="myTable" id="${i+','+j}"></div>
                        <div class="result">
                            <div class="left">
                                Total: <span><input type="text" value="${totalStudents}" class="no-outline" name="total"></span>
                            </div>
                            <div class="middle">
                                Present: <span><input type="text" value="${presentStudents}" class="no-outline" name="present"></span>
                            </div>
                            <div class="right">
                                Absent: <span><input type="text" value="${absentStudents}" class="no-outline" name="absent"></span>
                            </div>
                        </div>
                    </div>`;

            container.innerHTML += classEntryHTML;

            var regularSpans = document.getElementById('regular-' + i + ',' + j);
            var compensatorySpans = document.getElementById('compensatory-' + i + ',' + j);

            // Circle "Regular" or "Compensatory" based on the parameter Class Scheduling
            if (classEntry["Class Scheduling"] === "Regular") {
                console.log("regularSpans[j]", regularSpans);
                console.log("compensatorySpans[j]", compensatorySpans);
                regularSpans.textContent = "Regular";
                regularSpans.style.borderRadius = "10%";
                regularSpans.style.width = "36%";
                regularSpans.style.border = "1px solid black";
                compensatorySpans.textContent = "Compensatory";
            } else if (classEntry["Class Scheduling"] === "Compensatory") {
                regularSpans.textContent = "Regular";
                compensatorySpans.textContent = "Compensatory";
                compensatorySpans.style.borderRadius = "10%";
                compensatorySpans.style.width = "64%";
                compensatorySpans.style.border = "1px solid black";
            }

            createTable(i,j);

            var myTable = document.getElementById(i + ',' + j);
            // console.log("myTable", myTable) 

            var tableCells = myTable.querySelectorAll('table th');

            let cellIndex = 0; // Initialize a separate counter for tableCells

            // Loop through the attendance records for each class
            for (var key in classEntry) {
                if (key.startsWith('Attendance [Roll No')) {
                    var rollNumber = key.substring(key.indexOf('N') + 2, key.indexOf(']'));
                    // Now you can use the `rollNumber` as needed
                    // console.log("Roll Number:", rollNumber);
                    let tableCell = tableCells[cellIndex]; // Get the correct table cell using cellIndex
                    tableCell.innerText = rollNumber;

                    if (classEntry[key] === 'A') {
                        // Add inline CSS styles for styling to the table cell itself
                        tableCell.style.textDecoration = 'line-through'; // Add line-through text decoration
                        tableCell.style.color = 'red'; // Set the text color to red
                    }
                    cellIndex++; // Increment the separate counter for tableCells
                }
            }
            console.log("finished");
            if (classEntry.Backlog){
                console.log("finished Backlog");
                for (var key in classEntry.Backlog) {
                    
                    if (key.startsWith('Attendance [Roll No')) {
                        console.log("key", key);
                        var rollNumber = key.substring(key.indexOf('N') + 2, key.indexOf(']'));
                        // Now you can use the `rollNumber` as needed
                        console.log("Roll Number:", rollNumber);
                        let tableCell = tableCells[cellIndex]; // Get the correct table cell using cellIndex
                        tableCell.innerText = rollNumber;

                        if (classEntry.Backlog[key] === 'A') {
                            // Add inline CSS styles for styling to the table cell itself
                            tableCell.style.textDecoration = 'line-through'; // Add line-through text decoration
                            tableCell.style.color = 'red'; // Set the text color to red
                        }
                        cellIndex++; // Increment the separate counter for tableCells
                    }
                }
            }
        }
        var bottomEntryHTML = ` <div class="bottom-box">
                        <div class="details">
                            <div class="left">
                                Teacher Name: <span><input type="text" value="${signature}" class="no-outline" name="teacher"></span>
                                <br>
                                Class Advisor: <span><input type="text" value="Dr.M.Faraz Hyder" name="advisor"></span>
                            </div>
                            <div class="right">
                                Signature: <span><input type="text" value="${signature}" class="no-outline" name="signature"></span>
                                <br>
                                Data Entered: <span><input type="text" class="no-outline" name="entry"></span>
                            </div>
                        </div>

                        <div class="note">
                            <div class="left">
                                Note: <span></span>
                                <br>
                                <span>1. Please circle out the absent students' seat numbers.</span>
                                <br>
                                <span>2. Kindly mention the period, in case of compensatory class.</span>
                            </div>
                            <div class="right">
                                <span></span>
                                <br>
                                <span>3. '#' shows Provisional Registration.</span>
                                <br>
                                <span>4. '*' show fee is not submitted.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        `;
        container.innerHTML += bottomEntryHTML;
    }
    

    function createTable(weekId,tableId) {
        // Create the table element
        var table = document.createElement("table");

        // Create the table header element
        var thead = document.createElement("thead");

        // Create the table header row
        var tr = document.createElement("tr");

        // Loop to create the table header cells
        for (var i = 1; i <= 60; i++) {
            if ((i - 1) % 20 === 0) {
                // If the current cell index is a multiple of 20, create a new row
                thead.appendChild(tr);
                tr = document.createElement("tr");
            }

            // Create the table header cell
            var th = document.createElement("th");
            // th.textContent = i;

            // Append the cell to the row
            tr.appendChild(th); 
        }

        // Append the last row to the table header
        thead.appendChild(tr);

        // Append the table header to the table
        table.appendChild(thead);

        // Append the table to the specified container element on your page
        var myTable = document.getElementById(weekId+','+tableId);
        // console.log("myTable", myTable)  
        myTable.appendChild(table);
    }



    function formatDate(date, options) {
        var formattedDate = new Date(date).toLocaleDateString(undefined, options);
        var [day, month, year] = formattedDate.split(' ');
        var monthAbbreviation = month.substring(0, 3); // Get the first three letters of the month
        return `${day} ${monthAbbreviation} ${year}`;
    }

    function formatTime(time) {
        var timePeriods = time.split(',');
        var formattedTimePeriods = timePeriods.map(function (timePeriod) {
            var [period, timeRange] = timePeriod.split('_');
            var [startTime, endTime] = timeRange.split('-');
            var formattedStartTime = formatTimePart(startTime);
            var formattedEndTime = formatTimePart(endTime);
            return `${formattedStartTime}-${formattedEndTime} / ${period}`;
        });
        return formattedTimePeriods.join(', ');
    }

    function formatTimePart(timePart) {
        var [hour, minute] = timePart.split(':');
        var formattedHour = hour.padStart(2, '0');
        var formattedMinute = minute.padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
    }

    window.print();
});