/* eslint-disable */
const oracledb = require('oracledb');

const express = require('express');

const dbConfig = require('./dbConfig');
const cors = require('cors')

require('dotenv').config();


oracledb.outFormat = oracledb.ARRAY;

const PORT = process.env.PORT || 3019;
const app = express();

app.use(cors())


app.get('/api', (req, res) => {

  // //console.log(dbConfig)
  oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
    }).then(async conn => {
    // //console.log(conn)
    const currentYearContractSumQuery = 'select contractSubType, count(contractSubType) as count from REVENUE_SOAINFRA.reports_vendor group by contractSubType';
    const currentYearSpendAreasQuery = 'select contractSubType, paymentType from REVENUE_SOAINFRA.reports_vendor';
    const contractAwardedForYearsQuery = 'select contractSubType, extract(YEAR FROM requestDate) as YEAR from REVENUE_SOAINFRA.reports_vendor where requestDate between add_months(trunc(sysdate), -24) and trunc(sysdate)'
    
    const allForTableQuery = 'select * from REVENUE_SOAINFRA.reports_vendor';

    const currentYearContractSumRow = await conn.execute(currentYearContractSumQuery);
      let currentYearSpendAreas = await conn.execute(currentYearSpendAreasQuery);
      
      let contractAwardedForYears = await conn.execute(contractAwardedForYearsQuery);
      oracledb.outFormat = oracledb.OBJECT;
      let allForTable = await conn.execute(allForTableQuery);
      oracledb.outFormat = oracledb.ARRAY;
      // yearsContractSumVariousSpend = [];

      let currentYearContractSum = currentYearContractSumRow.rows;
      let sum = currentYearContractSum.reduce((sum, contract) =>{
        sum += contract[1];
        return sum;
      }, 0)

      currentYearContractSum =  currentYearContractSum.map((contract) =>{
        // //console.log(contract)
       return [contract[0], ((contract[1]/sum)*100).toFixed(2)]
      })
     
      currentYearSpendAreas = currentYearSpendAreas.rows,
      contractAwardedForYears =  contractAwardedForYears.rows;

      currentYearSpendAreas = currentYearSpendAreas.reduce(function(obj, b) {
        // //console.log(b)
        obj[b] = ++obj[b] || 1;
        return obj;
      }, {});

      let result = []
      for(let current in currentYearSpendAreas){
        //console.log(current)
        let [area, type] = current.split(',')
        result.push([area, type, currentYearSpendAreas[current]])
        // //console.log(area, type)
        
      }
      let goods = result.filter((current) => current[0] == 'Goods');
      let JOMotors = result.filter((current) => current[0] == 'Job Order Motor Vehicle');
      let JOGen = result.filter((current) => current[0] == 'Job Order General');
      let SPD = result.filter((current) => current[0] == 'SPD');
      let Services = result.filter((current) => current[0] == 'Services Main');
      let Works = result.filter((current) => current[0] == 'Works');
      let totalGoods = goods.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      //console.log(result)

      let JOMotorsTotal = JOMotors.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let JOGenTotal = JOGen.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let SPDTotal = SPD.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let ServicesTotal = Services.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let WorksTotal = Works.reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)
    

      
      //console.log('jmotoror', JOMotors)
      

      let total = {
        name: 'Total Awards',
        data: {
          'Job Order (Motor Vehicle)': JOMotorsTotal,
          'Job Order (General)': JOGenTotal,
          'SPD': SPDTotal,
          'Goods': totalGoods,
          'Services': ServicesTotal,
          'Works': WorksTotal
        }
      }



      
      let JOMotorsCompleted = JOMotors.filter((current) => current[1] == 'Full' || current[1] == 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let JOGenCompleted = JOGen.filter((current) => current[1] == 'Full' || current[1] == 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let SPDCompleted = SPD.filter((current) => current[1] == 'Full' || current[1] == 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let ServicesCompleted = Services.filter((current) =>{
        //console.log('curret', current)
        return current[1] == 'Full' || current[1] == 'Final'
      }).reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let WorksCompleted = Works.filter((current) => current[1] == 'Full' || current[1] == 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)


      let GoodsCompleted = goods.filter((current) => current[1] == 'Full' || current[1] == 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)
      
     let completed = {
      name: 'Total Completed',
         data: {
           'Job Order (Motor Vehicle)': JOMotorsCompleted,
           'Job Order (General)': JOGenCompleted,
           'SPD': SPDCompleted,
           'Goods': GoodsCompleted,
           'Services': ServicesCompleted,
           'Works': WorksCompleted
         }
      }



      
      let JOMotorsOngoing = JOMotors.filter((current) => current[1] !== 'Full' || current[1] != 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let JOGenOngoing = JOGen.filter((current) => current[1] != 'Full' || current[1] != 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let SPDOngoing = SPD.filter((current) => current[1] != 'Full' || current[1] != 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let ServicesOngoing = Services.filter((current) =>{
        //console.log('fillflflflf', current)
        return current[1] != 'Full' || current[1] != 'Final'
      }).reduce((sum, good) =>{
        sum += good[2];
        return sum;
      }, 0)

      //console.log('onoogogogog',ServicesOngoing, Services)

      let WorksOngoing = Works.filter((current) => current[1] != 'Full' || current[1] != 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)


      let GoodsOngoing = goods.filter((current) => current[1] != 'Full' || current[1] != 'Final').reduce((sum, good) =>{
        
        sum += good[2];
        return sum;
      }, 0)

      let onGoing =  {
        name: 'Ongoing',
        data: {
          'Job Order (Motor Vehicle)': JOMotorsOngoing,
          'Job Order (General)': JOGenOngoing,
          'SPD': SPDOngoing,
          'Goods': GoodsOngoing,
          'Services': ServicesOngoing,
          'Works': WorksOngoing
        }
      }

      currentYearSpendAreas = [total, completed, onGoing]




      // console.log(contractAwardedForYears)

      contractAwardedForYears = contractAwardedForYears.reduce(function(obj, b) {
        // //console.log(b)
        obj[b] = ++obj[b] || 1;
        return obj;
      }, {});

      let results = []
      for(let current in contractAwardedForYears){
        //console.log(current)
        let [area, type] = current.split(',')
        results.push([area, type, contractAwardedForYears[current]])
        // //console.log(area, type)
        
      }

      
      let jbMotor = results.filter((current) =>{
        return current[0] == 'Job Order Motor Vehicle'
      })

      for(let jb of jbMotor){
        console.log(jb)
      }
      let yearsJBMotor = {
      
      }

    let yearsContractSumVariousSpend = [
      {
        name: 'Job Order (Motor Vehicle)',
        data: {
          '2016': 968,
          '2017': 786,
          '2018': 136,
        }
      },

      {
        name: 'Job Order (General)',
        data: {
          '2016': 364,
          '2017': 480,
          '2018': 118,

        }
      },
      {
        name: 'SPD',
        data: {
          '2016': 968,
          '2017': 786,
          '2018': 136,
        }
      },

        {
          name: 'Goods',
          data: {
            '2016': 968,
            '2017': 786,
            '2018': 136,
          }
        },


        {
          name: 'Services',
          data: {
            '2016': 968,
            '2017': 786,
            '2018': 136,
          }
        },
        {
          name: 'Works',
          data: {
            '2016': 968,
            '2017': 786,
            '2018': 136,
          }
        }
    ]

    res.json({
      currentYearContractSum,
      currentYearSpendAreas,
      contractAwardedForYears,
      // liabilitiesInSpendAreas,
      // fecAwardedProjectsCurrentLiabilities,
      // contractAwardedForYears,
      // yearsContractSumVariousSpend
      allForTable: allForTable.rows
    });


  }).catch(err => {
    console.log(err)
    res.status(500).json({
      err
    })
  })

});


app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});