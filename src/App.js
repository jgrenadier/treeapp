import React  from 'react';
// import logo from './logo.svg';
import Treemap from './Treemap';
import data from './data';
import data2 from './data2';
import getdata from './getdata3';
import CSVReader from 'react-csv-reader'

// contextnote: reference new menu context component
// import MenuContext from "./components/MenuContext";

import { data_context } from "./data/data_context";
import TheContextMenu from './TheContextMenu';

import './App.css';

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

function dotest(key, e){
  console.log(key, e)
  document.getElementById("lblTreeKind").innerHTML = key;
}

function App() { 
  return (
    // contextnote: Prevent normal right click behavior
    <div className="App"
      onContextMenu={(e) => {
        e.preventDefault(); // prevent the default behaviour when right clicked
        console.log("Right Click");      
      }}
    > 
      <script src="http://localhost:8097"></script>
      <CSVReader
        cssClass="react-csv-input"
        label="Select CSV with tree data"
        onFileLoaded={getdata}
        parserOptions={papaparseOptions}
      />
      <p>and then open the console if you like.</p>
      
      <div id='lblTreeKind' align='left' style={{ visibility: 'hidden' }}>All Tree Types displayed</div>
      <div id='customContextmenuArea1' style={{ visibility: 'hidden' }} >          
            <TheContextMenu                         
              targetId='customContextmenuArea1'
              options={['Conifer', 'Broadleaf', 'All']}
              classes={{
                listWrapper: 'customContextmenuAreaTreeKindListWrapper',
                listItem: 'customContextmenuAreaTreeKindListItem'
              }}
              dotest={dotest}              
            />
            <Treemap data={data} height={400} width={600} className="mytreemap" >             
            </Treemap>       
      </div>
  
    </div>
  );
  
}

export default App;
