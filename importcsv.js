// const fs = require('fs');
// const csv = require('csv-parser');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// // Function to insert data from a CSV file into the database
// const insertDataFromFile = async (filePath) => {
//   const rows = [];

//   // Read CSV file
//   fs.createReadStream(filePath)
//     .pipe(csv({ delimiter: '\t' })) // adjust delimiter based on your CSV format
//     .on('data', (row) => {
//       rows.push(row);
//     })
//     .on('end', async () => {
//       // Insert rows into the database, checking for duplicates
//       for (const row of rows) {
//         const existingRecord = await prisma.vehiclemodelyear.findUnique({
//           where: {
//             year: parseInt(row.year),
//             make: row.make,
//             model: row.model,
//           },
//         });

//         if (!existingRecord) {
//           await prisma.vehiclemodelyear.create({
//             data: {
//               year: parseInt(row.year),
//               make: row.make,
//               model: row.model,
//               bodyStyles: JSON.parse(row.body_styles.replace(/'/g, '"')),
//             },
//           });
//         } else {
//           console.log(`Record for year=${row.year}, make=${row.make}, model=${row.model} already exists. Skipping.`);
//         }
//       }

//       console.log(`Data from ${filePath} inserted into the database.`);
//     });
// };

// // Function to process CSV files in a directory
// const processCSVFiles = async (csvDirectory) => {
//   const files = fs.readdirSync(csvDirectory);

//   for (const file of files) {
//     if (file.endsWith('.csv')) {
//       const filePath = `${csvDirectory}/${file}`;
//       await insertDataFromFile(filePath);
//     }
//   }

//   // Close Prisma Client connection
//   await prisma.$disconnect();
// };

// // Example usage
// const csvDirectory = '/path/to/your/csv/files/';
// processCSVFiles(csvDirectory);


const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to insert data from a CSV file into the database
const insertDataFromFile = async (filePath) => {
  const rows = [];

  // Read CSV file
  fs.createReadStream(filePath)
    .pipe(csv({ delimiter: '\t' })) // adjust delimiter based on your CSV format
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', async () => {
      // Insert or update rows in the database
      for (const row of rows) {
        // const existingRecord = await prisma.vehiclemodelyear.findUnique({
        //   where: {
        //     year: parseInt(row.year),
        //     make: row.make,
        //     model: row.model,
        //   },
        // });
        const existingRecord = await prisma.vehiclemodelyear.findUnique({
            where: {
              U_vehiclemodelyear_year_make_model: {
                year: parseInt(row.year),
                make: row.make,
                model: row.model,
              },
            },
          });
          

        if (!existingRecord) {
          await prisma.vehiclemodelyear.create({
            data: {
              year: parseInt(row.year),
              make: row.make,
              model: row.model,
              bodyStyles: JSON.parse(row.body_styles.replace(/'/g, '"')),
            },
          });
        } else {
          // Merge existing body styles with new body styles
          const updatedBodyStyles = Array.from(new Set([
            ...existingRecord.bodyStyles,
            ...JSON.parse(row.body_styles.replace(/'/g, '"')),
          ]));

          // Update the record with the merged body styles
          await prisma.vehiclemodelyear.update({
            where: {
              id: existingRecord.id,
            },
            data: {
              bodyStyles: updatedBodyStyles,
            },
          });

          console.log(`Record for year=${row.year}, make=${row.make}, model=${row.model} updated with additional body styles.`);
        }
      }

      console.log(`Data from ${filePath} inserted or updated in the database.`);
    });
};

// Function to process CSV files in a directory
const processCSVFiles = async (csvDirectory) => {
  const files = fs.readdirSync(csvDirectory);

  for (const file of files) {
    if (file.endsWith('.csv')) {
      const filePath = `${csvDirectory}/${file}`;
      await insertDataFromFile(filePath);
    }
  }

  // Close Prisma Client connection
  await prisma.$disconnect();
};

// Example usage
const csvDirectory = './db/csvfiles92-24';
processCSVFiles(csvDirectory);
