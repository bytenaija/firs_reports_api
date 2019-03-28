module.exports = {
  user: process.env.NODE_ORACLEDB_USER || "REPORT_ADMIN",

  // Instead of hard coding the password, consider prompting for it,
  // passing it in an environment variable via process.env, or using
  // External Authentication.
  password: process.env.NODE_ORACLEDB_PASSWORD || 'welcome1',

  // For information on connection strings see:
  // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING ||  "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 10.2.252.102)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = REVENUE.firs.gov.ng)))",

  // Setting externalAuth is optional.  It defaults to false.  See:
  // https://oracle.github.io/node-oracledb/doc/api.html#extauth
  externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH = false 
};