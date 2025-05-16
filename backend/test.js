fetch("https://localhost:3000")
  .then((response) => response.json()) // Parse the JSON response
  .then((data) => {
    console.log(data); // Log the parsed JSON data
  })
  .catch((error) => {
    console.error('Error fetching data:', error); // Handle errors if any
  });
