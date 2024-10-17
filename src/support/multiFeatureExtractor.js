import Papa from 'papaparse';

/**
 * Extracts data for multiple features (columns) from the Accidents.csv file located in the public folder.
 * @param {Array<string>} featureNames - The names of the features (columns) to extract data for.
 * @returns {Promise} - Resolves with an array of objects containing values for the selected features or rejects with an error.
 */

export const extractFeatureData = (features) => {
    return new Promise((resolve, reject) => {
      const csvFilePath = process.env.PUBLIC_URL + '/Accidents.csv';  
  
      Papa.parse(csvFilePath, {
        download: true,  
        header: true,  
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
  
          // Add a console log to inspect data
          console.log("Parsed data:", data);
  
          if (!data || data.length === 0) {
            reject("No data found in CSV file.");
            return;
          }
  
          // Ensure that features exist in the data
          const selectedData = data.map(row => {
            const filteredRow = {};
            features.forEach(feature => {
              if (row.hasOwnProperty(feature)) {
                filteredRow[feature] = row[feature];
              }
            });
            return filteredRow;
          });
  
          resolve(selectedData);
        },
        error: (err) => {
          reject(`Error parsing CSV: ${err.message}`);
        }
      });
    });
  };
  
  