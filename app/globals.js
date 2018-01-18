let diseaseTable = null;
let genePanelTable = null;
let geneTable = null;
let geneHistogramChart = null;
let getBarChart = null;

const DATA_TABLE_DOM = "<'row data-table-controls'<'col-sm-8 data-table-buttons's><'col-sm-4 data-table-search'fl>>" +
                       "<'row'<'col-sm-12'tr>>" +
                       "<'row'<'col-sm-5'><'col-sm-7'p>>";

const DATA_TABLE_DOM_ALT = "<'row data-table-controls'<'data-table-search'fl>>" +
                       "<'row'<'col-sm-12'tr>>" +
                       "<'row'<'col-sm-5'><'col-sm-7'p>>";

let model = new Model();

let colorMS = [
   "#8ca252",
   "#e7ba52",
   "#1f77b4",
   "#ad494a"
 ];

