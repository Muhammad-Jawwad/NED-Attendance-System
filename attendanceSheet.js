// Function to handle form submission
function validateForm(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Retrieve user inputs
    var startWeek = document.getElementById('startWeek').value;
    var endWeek = document.getElementById('endWeek').value;

    // Validate week inputs
    if (startWeek === '' || endWeek === '') {
        alert('Please enter start and end weeks.');
        return;
    }

    var startWeekNumber = parseInt(startWeek);
    var endWeekNumber = parseInt(endWeek);

    if (isNaN(startWeekNumber) || isNaN(endWeekNumber) || startWeekNumber > endWeekNumber) {
        alert('Invalid week range. Start week should be less than or equal to end week.');
        return;
    }

    // Call the retrieveData function to fetch the data
    retrieveData();
}

// Function to retrieve data from the provided URL
function retrieveData() {
    var url = 'https://script.google.com/macros/s/AKfycbwham3RFiEkdZJggaIGPxlIu8AysXySUoNceY5vR_7b-_QvlzVVPINYZ07VJL_6cnBG/exec';

    // Send an AJAX request to the URL
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            // Log the extracted JSON data
            console.log('Extracted JSON:', data);

            // Retrieve inputted values
            var subject = document.getElementById('subject').value;
            var startWeek = document.getElementById('startWeek').value;
            var endWeek = document.getElementById('endWeek').value;

            // Filter the data based on inputted details
            var filteredData = data.filter(function (entry) {
                return (
                    entry.Subject === subject &&
                    entry.Week >= 'Week ' + startWeek &&
                    entry.Week <= 'Week ' + endWeek
                    // Add more conditions for other inputted details if needed
                );
            });

            // Log the filtered data
            console.log('Filtered JSON:', filteredData);

            // Redirect to mainSheet.html
            window.location.href = 'mainSheet.html';

            // Pass the filtered data to mainSheet.html
            sessionStorage.setItem('filteredData', JSON.stringify(filteredData));

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.log('Failed to retrieve data. Error:', xhr.status);
        }
    };
    xhr.send();
}
