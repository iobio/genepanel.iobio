<template>
  <div>
    <v-snackbar
        :timeout="snackbarTimeout"
        :top="y === 'top'"
        :bottom="y === 'bottom'"
        :right="x === 'right'"
        :left="x === 'left'"
        :multi-line="mode === 'multi-line'"
        :vertical="mode === 'vertical'"
        v-model="snackbar"
      >
        {{ snackbarText }}
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    <div  id="gene-bar-chart-box"  >
      <div id="gene-bar-chart"></div>
    </div>
    <v-alert style="width:85%" outline color="info" icon="check_circle" dismissible v-model="alert">
      {{ alertText }}
    </v-alert>

      <v-data-table
          id="genes-table"
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="name"
          v-bind:search="search"
          no-data-text="No Genes Available Currently"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                primary
                hide-details
                @click.native="toggleAll"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
              ></v-checkbox>
            </th>
            <th v-for="header in props.headers" :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '', header.visibility, header.class, header.width]"

            >
              {{ header.text }}
            </th>

          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <!-- <tr :active="props.selected" @click="props.selected = !props.selected"> -->
          <tr :active="props.selected">
            <td>
              <v-checkbox
                primary
                hide-details
                v-model="props.selected"
                :input-value="props.selected"
              ></v-checkbox>
            </td>
            <!-- <td><strong>{{ (props.index + 1) * pagination.page}}</strong></td> -->
            <td>
              <div id="app">
                <div>
                  <v-menu open-on-hover top offset-y>
                    <span style="font-size:13px; margin-top:2px" slot="activator">{{ props.item.name }}</span>
                      <v-card>
                        <v-card-text style="margin-top:-22px">
                          <center ><h3>{{ props.item.name }}</h3></center>
                          <hr>
                          <div style="width:600px"><strong>Conditions: </strong></div>
                          {{props.item.conditions}}
                          <hr>
                          <div><strong>Resources: </strong></div>
                          <ul style="margin-left:25px; margin-top:5px">
                            <li><a v-bind:href="props.item.omimSrc" target="_blank">OMIM</a></li>
                            <li><a v-bind:href="props.item.medGenSrc" target="_blank">MedGen</a></li>
                            <li><a v-bind:href="props.item.geneCardsSrc" target="_blank">Gene Cards</a></li>
                            <li><a v-bind:href="props.item.ghrSrc" target="_blank">Genetics Home Reference</a></li>
                            <li><a v-bind:href="props.item.clinGenLink" target="_blank">ClinGen</a></li>
                          </ul>
                        </v-card-text>
                      </v-card>
                  </v-menu>
                </div>
              </div>
            </td>
            <!-- <td>{{ props.item.searchTermIndex }}</span></td> -->
            <td>
              <span v-for="x in props.item.searchTermIndex">
                <span v-html="x"></span>
              </span>
            </td>
            <td>
              <span
                v-html="props.item.htmlData">
              </span>
            </td>
            <td>
              <v-menu bottom offset-y style="color:black">
                <v-icon slot="activator" style="padding-right:4px">more_horiz</v-icon>

                <v-list style="width:250px">
                  <v-list-tile >
                    <v-list-tile-title><strong> Links: </strong></v-list-tile-title>
                  </v-list-tile>
                  <hr>
                  <v-list-tile >
                    <v-list-tile-title><a v-bind:href="props.item.omimSrc" target="_blank">OMIM</a></v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile >
                    <v-list-tile-title><a v-bind:href="props.item.medGenSrc" target="_blank">MedGen</a></v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile >
                    <v-list-tile-title><a v-bind:href="props.item.geneCardsSrc" target="_blank">Gene Cards</a></v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile >
                    <v-list-tile-title><a v-bind:href="props.item.ghrSrc" target="_blank">Genetics Home Reference</a></v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile >
                    <v-list-tile-title><a v-bind:href="props.item.clinGenLink" target="_blank">ClinGen</a></v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
            <!-- <td style="font-size:0">{{ props.item.value }}</td> -->
          </tr>
        </template>
        <!-- <template slot="footer">
        <td colspan="100%">
          <strong>{{ selected.length}} of {{ items.length }} genes selected</strong>
        </td>
      </template> -->
      </v-data-table>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import Model from '../../models/Model';
var model = new Model();

  export default {
    components: {
      'ConditionsDistribution': ConditionsDistribution
    },
    //props: ['GeneData'],
    props: {
      modeOfInheritanceData: {
        type: Array
      },
      GeneData: {
        type: Array
      },
      geneSearch: {
        type: String
      },
      multipleSearchItems: {
        type: Array
      }
    },
    data(){
      return {
        alert:false,
        alertText: "",
        geneHistogramChart: {},
        geneBarChart: {},
        GetGeneData : [],
        GenesToDisplay: [],
        genesTopCounts: [5, 10, 30, 50, 80, 100],
        pagination: {
          sortBy: 'value',
          descending: true, //Sorts the column in descending order
          rowsPerPage: 25 //Sets the number of rows per page

        },
        tmp: '',   //For searching the rows in data table
        search: '',  //For searching the rows in data table
        selected: [],
        headers: [
          // {
          //   text: 'Index',
          //   align: 'left',
          //   sortable: false,
          //   value: 'name'
          // },
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Search Terms', align: 'left', value: 'searchTermIndex' },
          { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
          {
            text: 'More',
            align: 'left',
            sortable: false,
            value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', ''] },
          // {
          //   text: '',
          //   value: ['haploScore', 'value', 'omimSrc', 'clinGenLink'],
          //   width: '10%',
          //   class: 'headerWidth',
          //   visibility: 'hidden-lg-only'
          //
          //  },
        ],
        items: [],
        GenesFromD3Bars: [],
        dataForTables:[],
        modeOfInheritanceList: [],
        countForEmit:0,
        modeOfInheritanceProps: [],
        flagForNumberOfGenesSelected: false,
        NumberOfGenesSelectedFromFilter: 50,
        selectedGenesText:"",
        NumberOfTopGenes: 50,
        snackbar: false,
        snackbarText: "",
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
        multipleSearchDisorders: [],
        DataToIncludeSearchTerms: [],
        arrangedSearchData: [],

      }
    },
    mounted(){
      this.modeOfInheritanceProps = this.modeOfInheritanceData;
      this.multipleSearchDisorders = this.multipleSearchItems;
      this.AddGeneData();

    },
    updated(){
      // console.log("this.selected from Show Genes ", this.selected.map(gene=> {
      //    var x =  gene.name;
      //    //.toString().replace(/,/gi , ' ')
      //    return x.toString() ;
      // }) );

      this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";


      bus.$on('deSelectAllGenesBus', ()=>{
        this.deSelectAllGenes();
      });

      bus.$on('SelectAllGenesBus', ()=>{
        this.selectAllGenes();
      });


      bus.$on('SelectNumberOfGenes', (data)=> {
        this.filterGenesOnSelectedNumber(data);
      })

      bus.$on('SelectGenesInNumberOfPanels', (data)=>{
        this.filterGenesOnSelectedNumberOfPanels(data);
      })

      bus.$on("updateFromGenesHistogram", (data, count)=>{
        // console.log("updateFromGenesHistogram", data);
        if(count>1){
          this.selected = data;
          this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
          this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
          this.$emit("TotalNoOfGenesFromGTR", this.items.length);
        }
      })

      this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
      this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
      this.$emit("SelectedGenesToCopy", this.selected);
      this.$emit("TotalNoOfGenesFromGTR", this.items.length);

    },
    watch: {
      GeneData: function(){
        this.AddGeneData();
      },
      modeOfInheritanceData: function(){
      },
      NumberOfTopGenes: function() {
        this.selectNumberOfTopGenes();
      },
      geneSearch: function(){
        this.search = this.geneSearch;
      },
      multipleSearchItems: function(){
        this.multipleSearchDisorders = this.multipleSearchItems;
      }
    },
    methods:{

      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0, data);
        this.flagForNumberOfGenesSelected = true;
        this.NumberOfGenesSelectedFromFilter = data;
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
      },
      filterGenesOnSelectedNumberOfPanels(data){
        // console.log("items in filterGenesOnSelectedNumber", this.items);
        var tempArrForGenesInPanels = [];
        for(var i=0; i<this.items.length; i++){
          if(data<=this.items[i].value){
            tempArrForGenesInPanels.push(this.items[i]);
          }
        }
        if(this.flagForNumberOfGenesSelected){
          if(tempArrForGenesInPanels.length<this.NumberOfGenesSelectedFromFilter){
            this.selected = tempArrForGenesInPanels;
            this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
            this.$emit("UpdateSelectedGenesText", this.selectedGenesText)
            this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
            this.$emit("TotalNoOfGenesFromGTR", this.items.length);
          }
          else{
            this.selected = tempArrForGenesInPanels.slice(0, this.NumberOfGenesSelectedFromFilter);
            this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
            this.$emit("UpdateSelectedGenesText", this.selectedGenesText)
            this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
            this.$emit("TotalNoOfGenesFromGTR", this.items.length);
          }
        }
        else {
          this.selected = tempArrForGenesInPanels;
          this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdateSelectedGenesText", this.selectedGenesText)
          this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
          this.$emit("TotalNoOfGenesFromGTR", this.items.length);
        }

      },
      addSelectedGenesFromD3(selectedGeneNames){
        this.GenesFromD3Bars = selectedGeneNames;
        // console.log("this.GenesFromD3Bars", this.GenesFromD3Bars)
      },
      copy () { //Copy to clipboard
        var geneNames = this.selected.map(gene => {
          return gene.name
        })
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);
        this.alert = true;
        this.alertText = " Number of Genes Selected : " + this.selected.length + " ";
        setTimeout(()=>{
          this.alert = false;
        }, 3500);
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      AddGeneData: function(){
        bus.$emit("openNavDrawer");
        this.GetGeneData = this.GeneData;
        // console.log("this.GetGeneData", this.GetGeneData);
        this.modeOfInheritanceList = this.modeOfInheritanceData;
        // console.log("this.multipleSearchDisorders", this.multipleSearchDisorders)
        this.DataToIncludeSearchTerms = this.GeneData;

        this.arrangedSearchData = this.searchTermsForGeneId(this.DataToIncludeSearchTerms);
        // console.log("this.arrangedSearchData", this.arrangedSearchData)


        var mergedGenes = model.mergeGenesAcrossPanels(this.GetGeneData);
        // console.log("mergedGenes", mergedGenes);

        // this.GenesToDisplay = mergedGenes;
        // console.log("data is ", this.GenesToDisplay)


        // console.log('mergedGenes', mergedGenes)

        let data = model.getGeneBarChartData(mergedGenes, $('#genes-table').innerWidth() );
        // console.log("data is ", data[50].geneid)
        this.GenesToDisplay = data;
        // console.log("this.GenesToDisplay", this.GenesToDisplay);

        this.arrangeAllData(this.arrangedSearchData, this.GenesToDisplay)

        this.items = data;
        this.noOfSourcesSvg();
        // console.log(this.items)
        // let dataWithClinGenFlag = model.getClinGenFlag(data);
        // this.items = dataWithClinGenFlag;
        this.selected = data.slice(0,50);
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
        bus.$emit("GeneDistributionChartData", this.items);

        this.dataForTables = data.slice(0,10);

      },
      arrangeAllData: function(terms, genesData){
        for(var i=0; i<terms.length; i++){
          for(var j=0; j<genesData.length; j++){
            if(terms[i].id == genesData[j].geneid){
              genesData[j].searchTermIndex = terms[i].searchData
            }
          }
        }
      },
      searchTermsForGeneId: function(genePanels){
        genePanels.forEach(function(genePanel) {
          genePanel._genes.forEach(function(gene, i) {
            gene["searchTermArray"] = genePanel.searchTermArray;
            gene["searchTermIndex"] = genePanel.searchTermIndex;
          })
        })

        var genesTempArr = [];
        var tempGeneArrId = [];

        genePanels.forEach(function(genePanel) {
          genePanel._genes.forEach(function(gene, i) {
            genesTempArr.push(gene);
            tempGeneArrId.push(gene.geneid)
          })
        })


      //Need to optimize
        // for(var i=0; i<genesTempArr.length; i++){
        //   for(var j=genesTempArr.length-1; j>i; j--){
        //     if(genesTempArr[i].geneid ===genesTempArr[j].geneid){
        //         // dupGeneId.push(genesTempArr[j].geneid)
        //       genesTempArr[i].searchTermArray = [...genesTempArr[i].searchTermArray, ...genesTempArr[j].searchTermArray];
        //       genesTempArr[i].searchTermIndex = [...genesTempArr[i].searchTermIndex, ...genesTempArr[j].searchTermIndex];
        //       genesTempArr[i].searchTermArray = Array.from(new Set(genesTempArr[i].searchTermArray))
        //       genesTempArr[i].searchTermIndex = Array.from(new Set(genesTempArr[i].searchTermIndex))
        //     }
        //   }
        // }

        var dupsObj = {};

        for(var i=0; i<genesTempArr.length; i++){
          if(dupsObj[genesTempArr[i].geneid]===undefined){
            dupsObj[genesTempArr[i].geneid] = genesTempArr[i];
          }
          else {
            // console.log(dupsObj[genesTempArr[i].geneid].searchTermArray)
            dupsObj[genesTempArr[i].geneid].searchTermIndex = [...dupsObj[genesTempArr[i].geneid].searchTermIndex, ...genesTempArr[i].searchTermIndex];
            dupsObj[genesTempArr[i].geneid].searchTermIndex = Array.from(new Set(dupsObj[genesTempArr[i].geneid].searchTermIndex))
          }
        }

        // console.log(dupsObj);
        var newGeneArr = [];

        for(var key in dupsObj){
          newGeneArr.push(dupsObj[key])
        }


        // for(var i=0; i<newGeneArr.length; i++){
        //   if(newGeneArr[i].geneid==2077){
        //     console.log("newGeneArr[i].searchTermArray", newGeneArr[i].searchTermArray)
        //     // console.log("ggene", genesTempArr[i])
        //   }
        // }

        var obj = {};
        for(var i=0; i<newGeneArr.length; i++){
          if(obj[newGeneArr[i].geneid]===undefined){
            obj[newGeneArr[i].geneid] = newGeneArr[i].searchTermIndex;
          }
        }

        // for(var i=0; i<genesTempArr.length; i++){
        //   // console.log("obj[genesTempArr[i].geneid]", genesTempArr[i].geneid)
        //   // console.log("obj[genesTempArr[i].geneid]", genesTempArr[i].searchTermArray)
        //   if(obj[genesTempArr[i].geneid]===undefined){
        //     obj[genesTempArr[i].geneid] = genesTempArr[i].searchTermIndex;
        //   }
        // }

        // console.log(obj)

        var anotherArr = [];
        for(var key in obj){
          anotherArr.push({
            id: key,
            searchData: obj[key]
          })
        }

        // console.log("anotherArr", anotherArr)

        anotherArr.map(x=>{
          x.searchData.sort();
        })

        return anotherArr

      },
      noOfSourcesSvg: function(){
        this.items.map(x=>{
          x.searchTermIndex = x.searchTermIndex.map(y=>{
            // console.log(y)
            return `<svg height="30" width="30">
                  <circle class="sourceIndicator"  />
                  <text x="12" y="15" text-anchor="middle" fill="white" font-weight="600" font-size="10px" font-family="Arial" dy=".3em">${y}</text>
                </svg> `
          })
        });
        // console.log(this.items)
      },
      selectAllGenes: function(){
        this.selected = this.items.slice();
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
      },
      deSelectAllGenes: function(){
        this.selected = [];
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
      },
      selectNumberOfTopGenes: function(){
        setTimeout(()=>{
          if(this.NumberOfTopGenes>0){
            bus.$emit('SelectNumberOfGenes', this.NumberOfTopGenes);
            this.flagForNumberOfGenesSelected= true;
            this.snackbarText = "Top " + this.NumberOfTopGenes + " genes selected";
            this.snackbar = true;
          }
          else if (this.NumberOfTopGenes<0) {
            document.getElementById("geneSelection").reset();
          }
         }, 1500);
      },
    }
  }

</script>

<style>
/*
.genepanelsRect{
  fill: #ffffff00;
  pointer-events: all;
}
.genepanelsRect:hover{
  fill: #D04F4C;
} */

#gene-histogram-chart .bar rect {
    fill:   #7dc2e5;
    stroke: #1f5d7a;
    stroke-width: .5;
}

#gene-histogram-chart .bar.selected rect {
    fill: #2d8fc1;
}

#gene-histogram-chart .bar text {
    font-size: 10px;
}

#gene-histogram-chart .x.axis {
  font-size: 10px;
}
#gene-histogram-chart .y.axis {
  font-size: 10px !important;
}
#gene-histogram-chart .axis .label {
  font-size: 12px !important;
}


div.tooltip {
  position: absolute;
  text-align: center;
  z-index:20;
  color:white;
  padding: 4px 6px 4px 6px;
  font: 11px arial;
  background: rgb(80,80,80);
  border: 0px;
  border-radius: 4px;
  pointer-events: none;
}

/*                           */
/* Gene horizontal barchart  */
/*                           */
#gene-bar-chart #title {
  font-size: 20px;
  padding-bottom: 10px;
  padding-top: 20px;
  font-weight: 300;
}



/*                      */
/*  Any svg chart       */
/*                      */
.y.axis line {
  fill: none;
  stroke: #e0e0e0;
  shape-rendering: crispEdges;
}

.x.axis line {
  fill: none;
  stroke: #e0e0e0;
  shape-rendering: crispEdges;
}

.axis path {
  fill: none;
  stroke: #848383;
  shape-rendering: crispEdges;
}

.axis .label {
  font-size: 12px;
}

.brush .extent {
  fill-opacity: .125;
  shape-rendering: crispEdges;
}

.resize {
  display: inline !important; /* show when empty */
  fill: #7A7A7A;
  fill-opacity: 1;
  stroke: #7A7A7A;
  stroke-width: 2px;
}

.input-group__input{
  min-height: 3px;
}


.headerWidth{
  width: 1%;
  color: red
}
</style>


<style lang="sass">
@import ../assets/sass/variables


.genepanelsRect
  fill: $svgBar-fill
  pointer-events: all
  stroke: #FFE650
  stroke-width: 2
  fill: #FFE650

.genepanelsRect:hover
  fill: #FFE650

.sourceIndicator
  fill: #ff9800
  stroke: #ff9800
  stroke-width: 2
  cx: 12
  cy: 15
  r: 10


</style>
