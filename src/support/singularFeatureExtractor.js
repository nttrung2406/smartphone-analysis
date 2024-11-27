import Papa from 'papaparse';

/**
 * Extracts data for a specific feature (column) from the Mobiles_Dataset.csv file located in the public folder.
 * @param {string} featureName - The name of the feature (column) to extract data for.
 * @returns {Promise} - Resolves with an array of values for the selected feature or rejects with an error.
 */
export const extractFeatureData = (featureName) => {
  return new Promise((resolve, reject) => {
    const csvFilePath = process.env.PUBLIC_URL + '/Mobiles_Dataset.csv';  // Public folder 

    Papa.parse(csvFilePath, {
      download: true,  
      header: true,    
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        if (!data[0] || !data[0].hasOwnProperty(featureName)) {
          reject(`Feature "${featureName}" does not exist in the CSV.`);
          return;
        }

        // Extract the data for the given featureName
        const featureData = data.map(row => row[featureName]);

        resolve(featureData);
      },
      error: (err) => {
        reject(`Error parsing CSV: ${err.message}`);
      }
    });
  });
};
