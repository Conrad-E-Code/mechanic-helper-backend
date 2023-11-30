const express = require('express');
const { PrismaClient } = require('@prisma/client')
const cors = require('cors');
const app = express();
const port = 3001;

const prisma = new PrismaClient()
app.use(express.json())
app.use(cors({ origin: 'http://127.0.0.1:5173' }));


// async function main() {
//   await prisma.vehiclemodelyear.create({
//     data: {
//       year: 1909,
//       make: 'Ford',
//       model: 'Model T',
//     },
//   });

//   // Insert more data as needed...

//   await prisma.$disconnect();
// }


// main()

//   .then(async () => {

//     await prisma.$disconnect()

//   })

//   .catch(async (e) => {

//     console.error(e)

//     await prisma.$disconnect()

//     process.exit(1)

//   })
app.get('/vehicles', async (req, res) => {
  try {
    const { year, make } = req.query;
  
    // Check if the parameters are provided
    if (!year || !make) {
      return res.status(400).json({ error: 'Year and make parameters are required.' });
    }
  
    const vehicles = await prisma.vehiclemodelyear.findMany({
      where: {
        year: parseInt(year), // Assuming year is a number in the database
        make: make,
      },
    });
  
    res.json(vehicles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
})

app.get('/makes', async (req, res) => {
  // Include the code to find unique makes here
  try {
    const uniqueMakes = await prisma.vehiclemodelyear.findMany({
      distinct: ['make'],
      select: {
        make: true,
      },
    });
  
    const makes = uniqueMakes.map((vehicle) => vehicle.make);
    res.json(makes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

// app.get('/years', async (req, res) => {
//   try {
//     const availableYears = await prisma.vehiclemodelyear.findMany({

//     })
    
//   } catch(error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }

// })

app.get('/years', async (req, res) => {
  try {
    const { make } = req.query;

    // Find distinct years for a given make (case-insensitive)
    const distinctYears = await prisma.vehiclemodelyear.groupBy({
      by: ['year'],
      where: {
        make: {
          equals: make,
          mode: 'insensitive',
        },
      },
      orderBy: {
        year: 'desc',
      },
      select: {
        year: true,
      },
    });

    const years = distinctYears.map((entry) => entry.year);

    res.json({ years });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${port}
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`),
)