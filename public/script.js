document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Copper SDK
    var sdk = window.Copper.init();
    console.log('Copper SDK initialized'); // Verify SDK initialization

    // Function to call the server-side endpoint for Clearbit enrichment
    function enrichEmail(email) {
        fetch('/enrich', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the enriched data
            if (data.person) {
                document.querySelector('#fullName span').textContent = data.person.name.fullName;
                document.querySelector('#location span').textContent = data.person.location;
                document.querySelector('#bio span').textContent = data.person.bio;
                // Add more fields as needed
            } else {
                console.error('Person data not found');
            }
        })
        .catch(error => {
            console.error('Error during enrichment:', error);
            // Optionally, display an error message to the user
        });
    }

    // Get the context from Copper and enrich the email
    sdk.getContext()
    .then(function (data) {
        console.log('Copper context:', data); // Check the retrieved context
        if (data.context && data.context.email) {
            enrichEmail(data.context.email);
        } else {
            console.error('Email address not found in context');
        }
    });
});