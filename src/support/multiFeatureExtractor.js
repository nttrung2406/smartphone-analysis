import Papa from 'papaparse';

/**
 * Extracts data for two specific features (columns) from the Mobiles_Dataset.csv file located in the public folder.
 * @param {string} featureName1 - The name of the first feature (column) to extract data for.
 * @param {string} featureName2 - The name of the second feature (column) to extract data for.
 * @returns {Promise} - Resolves with an array of objects, each containing values for the two selected features, or rejects with an error.
 */

export const extractTwoFeatureData = (featureName1, featureName2) => {
  return new Promise((resolve, reject) => {
    const csvFilePath = process.env.PUBLIC_URL + '/Mobiles_Dataset.csv';  // Public folder 

    // Check if featureName1 or featureName2 are undefined or empty
    if (!featureName1 || !featureName2) {
      reject('Both feature names must be provided.');
      return;
    }

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        console.log('Available features:', Object.keys(data[0]));

        const trimmedFeatureName1 = featureName1.trim();
        const trimmedFeatureName2 = featureName2.trim();

        // Check if both features exist in the dataset
        if (!data[0] || !data[0].hasOwnProperty(trimmedFeatureName1) || !data[0].hasOwnProperty(trimmedFeatureName2)) {
          reject(`One or both features ("${trimmedFeatureName1}", "${trimmedFeatureName2}") do not exist in the CSV.`);
          return;
        }

        // Extract the data for the two given features
        const featureData = data.map(row => ({
          [trimmedFeatureName1]: parseFloat(row[trimmedFeatureName1]) || row[trimmedFeatureName1],
          [trimmedFeatureName2]: parseFloat(row[trimmedFeatureName2]) || row[trimmedFeatureName2],
        }));

        console.log('Feature data:', featureData);

        resolve(featureData);
      },
      error: (err) => {
        reject(`Error parsing CSV: ${err.message}`);
      }
    });
  });
};

