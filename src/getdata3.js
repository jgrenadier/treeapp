import React from "react";
import ReactDOM from "react-dom";
import CSVReader from "react-csv-reader";
// import "./styles.css";
// import { stash, unstash } from 'json-stash';
import {Link} from 'react-router-dom';
import Treemap from './Treemap';

var resulting_data = {};

const name_all = "name";
const children_all = "children";
const name_tree = "name";
const name_state = "name";
const children_state = "children";
const value_tree = "value";

function AddTree2(mystates, st, spec_c, spec_s, treetype) {
  if (st === null){
    return false;
  }

  var treedict = {
    "category": st,
    "name": spec_c,
    // "speciesnamescientific": spec_s,
    // "treetype": treetype,
    "value" : 1
  };

  var statedict = {
    namestate: st,
    childrenstate: []
  }

  if (mystates.length === 0){
    mystates.push([]);
    (mystates[0])[name_state] = st;
    (mystates[0])[children_state] = [];
    var treedict2 = {};
    Object.assign(treedict2, treedict);
    (mystates[0])[children_state].push(treedict2);
    return true;
  }
  const n = mystates.length;
  for (var i=0; i < n; i++) {
    var sti = (mystates[i])[name_state];
    if (sti != null){
      if (sti === st){ 
        //
        // state found
        var trees = mystates[i][children_state];
        if (trees === null || trees.length === 0)
        {
          // found state with no trees
          // so add a treee to this state
          //
          mystates[i][children_state] = [];
          var treedict3 = [];
          Object.assign(treedict3, treedict);
          mystates[i][children_state].push(treedict3);
          return true;
        }
        //
        // state with trees, so search for tree match
        trees = mystates[i][children_state];
        var m = trees.length;
        for (var j = 0; j < m; j++){
          var treej = trees[j];
          if (treej != null && trees[j]["name"] === spec_c){
            // tree found, so just increment count
            trees[j]["value"] = trees[j]["value"] + 1;
            return true;                  
          }
        }
        // tree not found in existing state
        // so add a tree
        if (mystates[i][children_state] === null){
          mystates[i][children_state] = [];
        }        
        var treedict4 = {};
        Object.assign(treedict4, treedict);
        mystates[i][children_state].push(treedict4);
        return true;
      }   
    }
  }
  //
  // state not found, add a new state and add one tree
  //
  mystates.push([]);
  var mm = mystates.length;
  mystates[mm-1][name_state] = st;
  mystates[mm-1][children_state] = [];
  var treedict5 = {};
  Object.assign(treedict5, treedict);
  mystates[mm-1][children_state].push(treedict5);
  return true;
}



const getdata = (data, fileInfo) => {
  var ss = "";
  // console.log(data, fileInfo);  
  var mystates = [];
  for ( var i = 0; i < data.length; i++ ) {
    var st = data[i].stateabbr;
    var species_c = data[i].speciesnamecommon;
    var species_s = data[i].speciesnamescientific;
    var treetype = data[i].treetype;
    AddTree2(mystates, st, species_c, species_s, treetype);
  }
  console.log(ss);
  // localStorage.setItem("ss", ss);
  // console.log(mystates);
  var all = {};
  all[name_all] = "States";
  all[children_all] = mystates;
  
  resulting_data = all;
  // var sAll = JSON.stringify(all);
  // sessionStorage["all"] = sAll;
  // console.log(sessionStorage["all"]);

  // <Treemap data={data} height={400} width={600} />
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Treemap data={all} height={400} width={600} />
    </React.StrictMode>
  );


  return all;
}
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

//const reader = (  
//  <div className="container">
//    <script src="http://localhost:8097"></script>
//    <CSVReader
//      cssClass="react-csv-input"
//      label="Select CSV with tree data"
//      onFileLoaded={handleForce}
//      parserOptions={papaparseOptions}
//    />
//    <p>and then open the console</p>
//    <Link to={{ pathname: "/index", state: resulting_data }}></Link>
//  </div>
//);

// ReactDOM.render(reader, document.getElementById("root")); 

export default getdata;