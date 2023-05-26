import React from "react";
import ReactDOM from "react-dom";
import CSVReader from "react-csv-reader";
// import "./styles.css";
// import { stash, unstash } from 'json-stash';
import {Link} from 'react-router-dom';
import Treemap from './Treemap';
import TheContextMenu from './TheContextMenu';

var resulting_data = {};

//
// keys used in output tree structure
//
const name_all = "name";
const children_all = "children";
const name_tree = "name";
const name_state = "name";
const children_state = "children";
const value_tree = "value";


function dotest(key, e){
  console.log(key, e)
  document.getElementById("lblTreeKind").innerHTML = key;
  re_getdata();
  document.getElementById("lblTreeKind").innerHTML = key;

  
}

//
// function to add data from a single tree to the output
// tree structure in "mystates".  mystates is in a tree structure
// format used the TreeMap in the D3 library.
//
function AddTree2(mystates, st, spec_c, spec_s, treetype) {

  //
  // some states input from the CSV file seem to be null.
  // so ignore them.
  //
  if (st === null){
    return false;
  }

  //
  // treedict is the format of the leaf nodes in the output
  // tree structure
  var treedict = {
    "category": st,
    "name": spec_c,
    // "speciesnamescientific": spec_s,
    // "treetype": treetype,
    "value" : 1
  };

  //
  // statedict is the output format of the state nodes whose children
  // are trees.
  // 
  var statedict = {
    namestate: st,
    childrenstate: []
  }

  if (mystates.length === 0){
    //
    // only get here if there are no states yet in the output mystates.
    mystates.push([]);
    (mystates[0])[name_state] = st;
    (mystates[0])[children_state] = [];
    var treedict2 = {};
    Object.assign(treedict2, treedict);
    (mystates[0])[children_state].push(treedict2);
    return true;
  }
  const n = mystates.length;
  //
  // lets iterate through the output so far to see if the
  // if the tree being added is from a state that has already
  // been added to the output
  //
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
          //
          // note: not sure of "Object.assign" is needed 
          // given the vagaries of pass by reference/value in javascript
          // but this cant hurt.
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

function filterByStates(data, mystatename){
  var data2 = [];
  if (st === null || st === "") {
    return data;
  }
  for ( var i = 0; i < data.length; i++ ) {
    var st = data[i].stateabbr;
    if (st === mystatename)
    {
      var species_c = data[i].speciesnamecommon;
      var species_s = data[i].speciesnamescientific;
      var treetype = data[i].treetype;
      data2.push(data[i]);
    }
  }
  return data2;
}

function filterByTreeKind(data, mytreekind){
  var data2 = [];
 
  if (mytreekind === null || mytreekind === "") {
    return data;
  }
  const mytreekindL = mytreekind.toLowerCase();
  if (mytreekindL.startsWith("all")) {
    return data;
  }
  for ( var i = 0; i < data.length; i++ ) {
    var st = data[i].treetype;
    if (st.toLowerCase() === mytreekindL)
    {
      var species_c = data[i].speciesnamecommon;
      var species_s = data[i].speciesnamescientific;
      var treetype = data[i].treetype;
      data2.push(data[i]);
    }
  }
  return data2;
}

var data_persisted = null;

const re_getdata = () => {
  if (data_persisted != null) {
    getdata(data_persisted, null);
  }
}


const getdata = (data, fileInfo) => {
  var ss = "";
  data_persisted = data;
  // console.log(data, fileInfo);  

  var TreeKind = document.getElementById("lblTreeKind").innerHTML;
  data = filterByTreeKind(data, TreeKind);

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

  // Note: following code rerenders the window with just the
  // new TreeMap displayed with the data from the user selected
  // CSV file.
  // Note: this might not be the most elegant place 
  // for this code but saving the output tree structure in 
  // int things like session storage doesnt work for me yet.
  // JSON.stringify() seems to have some problems with my 
  // output data that will be needed by TreeMap. So having
  // the redisplay in a different page doesnt work yet.
  //
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(    
    <React.StrictMode>
      <div id='lblTreeKind' align='left' ></div>
      <div id='customContextmenuArea1' >          
            <TheContextMenu                         
              targetId='customContextmenuArea1'
              options={['Conifer', 'Broadleaf', 'All']}
              classes={{
                listWrapper: 'customContextmenuAreaTreeKindListWrapper',
                listItem: 'customContextmenuAreaTreeKindListItem'
              }}
              dotest={dotest}              
            />
            <Treemap data={resulting_data} height={400} width={600} className="mytreemap" >             
            </Treemap>       
      </div>


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