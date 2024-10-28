import Papa from 'papaparse';

/**
 * Extract unique information for each phone model from the mobile_dataset.csv file.
 * @returns {Promise<Array<Object>>} - Returns a promise that resolves to an array of unique phone information objects.
 */
export const extractPhoneData = () => {
  return new Promise((resolve, reject) => {
    const csvFilePath = process.env.PUBLIC_URL + '/Mobiles_Dataset.csv';  

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data;

        // Create a map to hold unique products by Product Name
        const uniquePhonesMap = new Map();
        data.forEach(row => {
          const productName = row['Product Name'];
          if (!uniquePhonesMap.has(productName)) {
            uniquePhonesMap.set(productName, {
              Product_Name: productName,
              Actual_price: row['Actual price'],
              Discount_price: row['Discount price'],
              Stars: row['Stars'],
              Rating: row['Rating'],
              Reviews: row['Reviews'],
              RAM_GB: row['RAM (GB)'],
              Storage_GB: row['Storage (GB)'],
              Display_Size: row['Display Size (inch)'],
              Camera: row['Camera'],
              Description: row['Description'],
              Img_path: row['Img_path']
            });
          }
        });

        const uniquePhones = Array.from(uniquePhonesMap.values());
        resolve(uniquePhones);
      },
      error: (error) => {
        console.error("Error extracting phone data:", error);
        reject(error);
      }
    });
  });
};
