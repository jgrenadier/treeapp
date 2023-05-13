import React  from 'react';
// import logo from './logo.svg';
import Treemap from './Treemap';
import data from './data';
import data2 from './data2';
import getdata from './getdata3';
import CSVReader from 'react-csv-reader'
// import './App.css';

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

function App() { 
  // if (typeof(sessionStorage.getItem("all"))!='undefined'){
  //   dataToUse = sessionStorage["all"];
  // }
  // dataToUse = data;
  return (
    <div className="App"> 
      <script src="http://localhost:8097"></script>
      <CSVReader
        cssClass="react-csv-input"
        label="Select CSV with tree data"
        onFileLoaded={getdata}
        parserOptions={papaparseOptions}
      />
      <p>and then open the console if you like.</p>
      
      <Treemap data={data} height={400} width={600} />
      
    </div>
  );
  
}

export default App;
