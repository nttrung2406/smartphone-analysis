import Papa from 'papaparse';
// import * as d3 from 'd3';

/**
 * Extract latitude and longitude from the Accidents.csv file
 * @returns {Promise<Array<{ latitude: number, longitude: number }>>} - Returns a promise that resolves to an array of latitude and longitude objects
 */

export const extractLatLong = () => {
  return new Promise((resolve, reject) => {
    const csvFilePath = process.env.PUBLIC_URL + '/Accidents.csv';  // Public folder

    Papa.parse(csvFilePath, {
      download: true,
      header: true, 
      complete: (result) => {
        const data = result.data;

        // Extract and filter valid coordinates
        const coordinates = data.map(row => {
          const lat = parseFloat(row.Latitude);
          const long = parseFloat(row.Longitude);

          // Include rows Latitude and Longitude are valid numbers
          return (!isNaN(lat) && !isNaN(long)) ? { latitude: lat, longitude: long } : null;
        }).filter(coord => coord !== null);  // Remove invalid

        console.log('Extracted Coordinates:', coordinates);
        resolve(coordinates);  // Resolve with the valid coordinates
      },
      error: (error) => {
        console.error("Error extracting coordinates:", error);
        reject(error);  // Reject the promise in case of an error
      }
    });
  });
};


