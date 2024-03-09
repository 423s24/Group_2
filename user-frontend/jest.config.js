/** @type {import('jest').Config} */
const config = {
    verbose: true,
  //  setupFilesAfterEnv: ['./jest.setup.js'], // Adjust the path as needed
    testEnvironment: 'jsdom'
  };
  
module.exports = config