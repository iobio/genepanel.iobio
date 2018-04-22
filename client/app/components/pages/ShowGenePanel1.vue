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
    <!-- <div v-if="dataForTables.length">
      <ul>
        <li class="abcde" v-for="(data, index) in dataForTables">
          <span v-html="data.htmlData"></span></p>
        </li>
      </ul>
    </div> -->
    <!-- <v-container grid-list-md text-xs-center> -->
      <!-- <v-layout row wrap>

        <v-flex d-flex xs12 sm6 md5>
          <v-card >
            <v-card-title primary class="title">Genes inheritance modes</v-card-title> -->
            <!-- <PieChartSelector
                v-if="modeOfInheritanceProps.length>0"
                v-bind:modeOfInheritanceData="modeOfInheritanceProps">
            </PieChartSelector> -->
          <!-- </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm6 md7>
          <v-card>
            <v-card-title primary class="title">Gene membership in panels</v-card-title>
            <div id="gene-histogram-box" >
              <svg id="gene-histogram-chart"></svg>
            </div>
          </v-card>
        </v-flex>

      </v-layout> -->
      <!-- <v-layout row wrap>
        <v-flex d-flex xs12 sm6 md6>
          <v-card >
            <v-card-title primary class="title">Gene distribution across panels</v-card-title>
            <GenePanelDistribution
                v-bind:distributionData="GetGeneData">
            </GenePanelDistribution>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm6 md6>
          <v-card >
            <v-card-title primary class="title">Conditions distribution across panels</v-card-title>
            <ConditionsDistribution
                v-bind:distributionData="GetGeneData">
            </ConditionsDistribution>
          </v-card>
        </v-flex>

      </v-layout> -->
      <!-- <GenePanelDistribution
          v-bind:distributionData="GetGeneData">
      </GenePanelDistribution> -->
    <!-- </v-container> -->
    <!-- <PieChartSelector
        v-if="modeOfInheritanceProps.length>0"
        v-bind:modeOfInheritanceData="modeOfInheritanceProps">
    </PieChartSelector> -->
    <!-- <GeneDistribution
        v-bind:GeneData="items">
    </GeneDistribution> -->
    <!-- <div id="gene-histogram-box" >
      <svg id="gene-histogram-chart"></svg>
    </div> -->
    <div  id="gene-bar-chart-box"  >
      <div id="gene-bar-chart"></div>
    </div>
    <v-alert style="width:85%" outline color="info" icon="check_circle" dismissible v-model="alert">
      {{ alertText }}
    </v-alert>



    <!-- <v-app id="inspire"> -->
      <v-card-title>
        <!-- <btn @click="copy">
            <i class="material-icons">content_copy</i> Copy to clipboard
        </btn> -->
        <!-- <strong>
          Select top &nbsp; <input v-on:focusout="selectNumberOfTopGenes" type="number" style="width:18%; padding: 5px ;border: 1px solid #c6c6c6 ; font-size:16px" v-model="NumberOfTopGenes"> &nbsp; genes
          &nbsp;<a><v-icon v-on:click="selectNumberOfTopGenes">navigate_next</v-icon></a>
        </strong> -->
        <span id="genes-top-input" style="display:inline-block;max-width:130px;width:130px;margin-left:25px;padding-top:4px">
          <v-select
          v-model="NumberOfTopGenes"
          label="Select Genes"
          hide-details
          hint="Genes"
          combobox
          :items="genesTopCounts"
          >
          </v-select>
        </span>
        <span style="padding-top:22px">
          <v-btn v-on:click="selectNumberOfTopGenes" flat icon color="indigo">
                <v-icon >navigate_next</v-icon>
          </v-btn>
        </span>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="name"
          class="elevation-1"
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
              <!-- <v-icon>arrow_upward</v-icon> -->
              {{ header.text }}
            </th>

          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox
                primary
                hide-details
                v-model="props.selected"
                :input-value="props.selected"
              ></v-checkbox>
            </td>
            <td>
              <div id="app">
                <div>
                  <v-menu open-on-hover top offset-y>
                    <p style="font-size:13px; margin-top:2px" slot="activator"><strong>{{ props.item.name }}</strong></p>
                      <v-card>
                        <v-card-title>
                            <div><strong>Conditions: </strong></div>
                        </v-card-title>
                        <v-card-text style="margin-top:-25px">{{props.item.conditions}}</v-card-text>
                      </v-card>
                  </v-menu>
                </div>
              </div>
            </td>
            <td><span v-html="props.item.htmlData"></span></td>
            <!-- <td >
              <div id="app">
                <div v-if="props.item.clinGen.val">
                  <v-menu open-on-hover top offset-y>
                      <span style="margin-top:2px" slot="activator">
                           ClinGen
                      </span>
                      <v-card>
                        <v-card-title>
                            <div style="cursor: context-menu"><strong>ClinGen Analysis: </strong></div>
                        </v-card-title>
                        <v-card-text style="margin-top:-25px">
                          <strong>{{props.item.name}}</strong>
                          <br>
                          <strong > Haploinsufficiency Score: {{props.item.haploScore}}</strong>
                          <br>
                          <br>
                          <p v-html="props.item.locationImgSrc"></p>
                          <p></p>
                        </v-card-text>
                      </v-card>
                  </v-menu>
                </div>
              </div>
            </td> -->
            <!-- <td></td> -->
            <td style="font-size:0">{{ props.item.value }}</td>

            <!-- <td>{{ props.item._conditionNames }}</td> -->
            <!-- <td>{{ props.item._geneCount }}</td> -->

          </tr>
        </template>
        <!-- <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text><a>ClinGen Analysis <strong> > </strong></a></v-card-text>
        </v-card>
      </template> -->
        <template slot="footer">
        <td colspan="100%">
          <strong>{{ selected.length}} of {{ items.length }} genes selected</strong>
        </td>
      </template>
      </v-data-table>
    <!-- </v-app> -->
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
// import PieChartSelector from './PieChartSelector.vue'
import GeneDistribution from './GeneDistribution.vue';
import GenePanelDistribution from './GenePanelDistribution.vue';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import Model from '../../models/Model';
var model = new Model();

  export default {
    components: {
      // 'PieChartSelector': PieChartSelector,
      'GeneDistribution': GeneDistribution,
      'GenePanelDistribution': GenePanelDistribution,
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
          {
            text: 'Name',
            align: 'left',
            value: 'name'
          },
          { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
          // { text: 'ClinGen', align: 'left', sortable: false, value: 'clinGen' },
          // {
          //   text: '',
          //   value: 'locationImgSrc',
          //   width: '10%',
          //   class: 'headerWidth',
          //   visibility: 'hidden-lg-only'
          //
          //  },
          {
            text: '',
            value: ['haploScore', 'value'],
            width: '10%',
            class: 'headerWidth',
            visibility: 'hidden-lg-only'

           },


        //  { text: 'Conditions', align: 'left', value: '_conditionNames' },
          // { text: 'Genes', align: 'left', value: '_conditionNames' },
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

      }
    },
    mounted(){
      // alert("modeOfInheritance length " + this.modeOfInheritanceData.length)
      this.modeOfInheritanceProps = this.modeOfInheritanceData;
      this.draw();
      this.AddGeneData();
      // this.drawSimpleViz();

    },
    updated(){
      console.log("this.selected from Show Genes ", this.selected.map(gene=> {
         var x =  gene.name;
         //.toString().replace(/,/gi , ' ')
         return x.toString() ;
      }) );

      this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";


      bus.$on('deSelectAllGenesBus', ()=>{
        this.deSelectAllGenes();
      });

      bus.$on('SelectAllGenesBus', ()=>{
        this.selectAllGenes();
      });


      bus.$on('SelectNumberOfGenes', (data)=> {
        //this.filterGenePanelsOnSelectedNumber(data);
        this.filterGenesOnSelectedNumber(data);
      })

      bus.$on('SelectGenesInNumberOfPanels', (data)=>{
        this.filterGenesOnSelectedNumberOfPanels(data);
      })

      bus.$on("updateFromGenesHistogram", (data, count)=>{
        console.log("updateFromGenesHistogram", data);
        if(count>1){
          this.selected = data;
          this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
          this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        }
      })

      this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
      this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
      this.$emit("SelectedGenesToCopy", this.selected);

    },
    watch: {
      GeneData: function(){
        console.log("watch genes : " , this.GeneData);
        this.AddGeneData();
      },
      modeOfInheritanceData: function(){
        console.log("Watch modeOfInheritanceData from show-gene-panel1: ", this.modeOfInheritanceData)
      }
    },
    methods:{
      showSomeAlert(){
      },
      drawSimpleViz: function(){
        var arr = [40, 70, 30, 25, 102];
        var x = 40;
        var max = Math.max(...arr);
        console.log(max);
        var no = Math.round(x*500/max);
        console.log(no)


        d3.select(".abcd")
            .append('svg')
            .attr("heigth", 500)
            .attr("width", 500)
          .append('rect')
              .attr('width', no)
              .attr('height', 30)
              .style('fill', "red")
      },
      draw(){
        //Drawing histogram chart
        this.geneHistogramChart = HistogramChart()
            .width(390)
            .height(150)
            .widthPercent("100%")
            .heightPercent("270px")
            .margin( {left: 45, right: 15, top: 10, bottom: 30})
            .yAxisLabel( "# of genes" )
            .xAxisLabel( "# of Panels" )
            .on("barselect", function(selectedGeneNames){
              console.log("bars selected ", selectedGeneNames);
              addSelectedFromHistogramChart(selectedGeneNames);
            })
        var addSelectedFromHistogramChart = (data)=>{
          this.selected = data;
        }

        //Drawing horizontal bar chart
        // console.log("bar chart before mounting", this.geneBarChart)
        // this.geneBarChart = HorizontalBarChart()
        //     .width(650)
        //     .height(1000)
        //     .widthSmall(80)
        //     // .on("barselect", function(selectedGeneNames){
        //     //   console.log("bars selected ", selectedGeneNames);
        //     //   addSelectedGeneFunction(selectedGeneNames);
        //     // })
        //  var addSelectedGeneFunction=(selectedGeneNames)=>{
        //   this.addSelectedGenesFromD3(selectedGeneNames);
        // }
      },
      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0, data);
        this.flagForNumberOfGenesSelected = true;
        this.NumberOfGenesSelectedFromFilter = data;
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
      },
      filterGenesOnSelectedNumberOfPanels(data){
        console.log("items in filterGenesOnSelectedNumber", this.items);
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
          }
          else{
            this.selected = tempArrForGenesInPanels.slice(0, this.NumberOfGenesSelectedFromFilter);
            this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
            this.$emit("UpdateSelectedGenesText", this.selectedGenesText)
            this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
          }
        }
        else {
          this.selected = tempArrForGenesInPanels;
          this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdateSelectedGenesText", this.selectedGenesText)
          this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        }

      },
      addSelectedGenesFromD3(selectedGeneNames){
        this.GenesFromD3Bars = selectedGeneNames;
        console.log("this.GenesFromD3Bars", this.GenesFromD3Bars)
      },
      copy () { //Copy to clipboard
        var geneNames = this.selected.map(gene => {
          return gene.name
        })
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        // console.log("this.GenesFromD3Bars from copy", this.GenesFromD3Bars)
        //  var geneNames = this.GenesFromD3Bars;
        //  var geneNamesToString = geneNames.toString();
        //  console.log("geneNamesToString", geneNamesToString)
        // var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);
        this.alert = true;
        this.alertText = " Number of Genes Selected : " + this.selected.length + " ";
        setTimeout(()=>{
          this.alert = false;
        }, 3500);
        // this.alertText = " Number of Genes Selected : " + this.GenesFromD3Bars.length + "  . ";
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
        this.GetGeneData = this.GeneData;
        console.log("this.GetGeneData", this.GetGeneData);

        this.modeOfInheritanceList = this.modeOfInheritanceData;

        var mergedGenes = model.mergeGenesAcrossPanels(this.GetGeneData);
        console.log("mergedGenes", mergedGenes);

        this.GenesToDisplay = mergedGenes;
        console.log("GenesToDisplay",this.GenesToDisplay);

        //Draws the histogram
        // var selection = d3.select('#gene-histogram-chart').datum(model.mergedGenes);
        // this.geneHistogramChart(selection, {'logScale': true, 'descendingX': true, 'selectTop': 50});

        let data = model.getGeneBarChartData(mergedGenes);
        // console.log("model.getGeneBarChartData(mergedGenes)", model.getGeneBarChartData(mergedGenes).slice(0,50));
        // console.log("bar char", this.geneBarChart)

        let dataWithClinGenFlag = model.getClinGenFlag(data);
        console.log("dataWithClinGenFlag", dataWithClinGenFlag[0])
        this.items = dataWithClinGenFlag;
        this.selected = data.slice(0,50);
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);

        bus.$emit("GeneDistributionChartData", this.items);

        // console.log("this.selected from Show Genes ", this.selected )
       // this.geneBarChart(d3.select('#gene-bar-chart'), data);
        // console.log("bar chart1", this.geneBarChart)
        this.dataForTables = data.slice(0,10);
        // console.log("dataForTables: ", this.dataForTables)

      },
      selectAllGenes: function(){
        this.selected = this.items.slice();
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
      },
      deSelectAllGenes: function(){
        this.selected = [];
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
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

  function HistogramChart() {

    let svg = null;

    let margin = {top: 30, right: 20, bottom: 20, left: 50};

    let width = 200;
    let height = 100;
    let widthPercent = "95%";
    let heightPercent = "95%";

    let brush = null;

    let defaults = {outliers: true, averageLine: true};

    let xValue = function(d) { return d[0]; };
    let yValue = function(d) { return d[1]; };

    let formatXTick = null;

    let xAxisLabel = null;
    let yAxisLabel = null;

    var dispatch = d3.dispatch("barselect");

    let tooltip = d3.select("#tooltip");
    let tooltipText = function(d, i) {
          return d[0] + ", " + d[1];
    };

    let onSelected = function(selected) {
      console.log(selected);
      dispatch.barselect(selected);
    }

    // A formatter for counts.
    let formatCount = d3.format(",.0f");

    let logFormat = function(d) {
      if (d < 1) {
        return "";
      } else {
        var x = Math.log(d) / Math.log(10) + 1e-6;
        return Math.abs(x - Math.floor(x)) < .7 ? formatCount(d) : "";
      }
    }

    let brushEnd = function() {
      var start = brush.extent()[0];
      var end   = brush.extent()[1];
      svg.selectAll(".bar")
         .classed("selected", function(d,i) {
            var inBrushExtent = d.x >= Math.floor(start) && d.x <= Math.ceil(end);
            return inBrushExtent;
         })

      var selected = [];
      svg.selectAll(".bar.selected").data().forEach(function(selectedBarData) {
        selected = selected.concat(Array.from(selectedBarData));
        // console.log("selected", selected)
      })
      onSelected(selected);
    }


    function chart(selection, options) {

      // merge options and defaults
      options = $.extend(defaults,options);
      let innerHeight = height - margin.top - margin.bottom;
      let innerWidth  = width  - margin.left - margin.right;


      selection.each(function(dataOrig) {
        console.log("dataOrig" , dataOrig)
        // set svg element
        svg = d3.select(this);

        svg.attr("width", widthPercent)
          .attr("height", heightPercent)
          .attr('viewBox', "0 0 " + parseInt(width) + " " + parseInt(height))
          .attr("preserveAspectRatio", "none");

        svg.select("g").remove();

        if (dataOrig == null || dataOrig.length == 0) {
          return;
        }
        var group = svg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var max = d3.max(dataOrig, function(d){ return d._genePanelCount;});
        var min = d3.min(dataOrig, function(d){ return d._genePanelCount;});
        var x = d3.scale.linear()
              .domain([min, max+1])
              .range(options.descendingX ? [innerWidth, 0] : [0, innerWidth]);




        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(x.ticks(max))
            .value(function(d){return d._genePanelCount;})
            (dataOrig);

        console.log("data in histogram", data)



        var yMax = d3.max(data, function(d){return d.length});
        var yMin = d3.min(data, function(d){return d.length});


        var y = null;
        if (options.logScale) {
          y = d3.scale.log()
            .clamp(true)
            .base(2)
            .domain([.1, yMax])
            .range([innerHeight, 0])
            .nice();
        } else {
          y = d3.scale.linear()
            .domain([0, yMax])
            .range([innerHeight, 0])
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function(tickValue) {
              return tickValue;
            })
            .ticks(max/1.5)


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(options.logScale ? logFormat : d3.format("i"))


        var barGroup = group.append("g")
                            .attr("transform", "translate(0,0)");

        var bar = barGroup.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + innerHeight + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", Math.abs((x(data[0].dx) - x(0))) - 1)
            .attr("height", function(d) { return 0; })
            .attr("x", options.descendingX ? x(data[0].dx) - x(0) : 0);
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -9)
            .attr("x", (x(data[0].dx) - x(0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y) <= 0 ? "" : formatCount(d.y) });


        group.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + ((x(data[0].dx) - x(0)) / 2) + "," + innerHeight + ")")
            .call(xAxis);


        // All of the ticks were shifted left to be in the bar's center.  So get rid of the last tick.
        group.selectAll('.x.axis .tick').filter(function(d, i) {
            return i === data.length;
        }).remove()

        group.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add the text label for the x axis
        //gEnter.selectAll("g.xaxis label")
        if (xAxisLabel) {
          group.selectAll("g.x axis label").remove();
          group.append("text")
            .attr("class", "x axis label")
            .attr("transform", "translate(" + (width / 2) + " ," + (y.range()[0]  + margin.bottom) + ")")
            .style("text-anchor", "end")
            .text(xAxisLabel);
        }

        // Add the text label for the Y axis
        if (yAxisLabel) {
        group.selectAll("g.y axis label").remove();
        group.append("text")
            .attr("class", "y axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text(yAxisLabel);

        }



        // Update bars.
        bar.transition()
           .duration(1000)
           .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.selectAll('rect')
           .transition()
           .duration(1000)
           .attr("height", function(d) { return innerHeight - y(d.y); })

        brush = d3.svg.brush().x(x);


        // Select all bars to equal total count of 100
        if (options.selectTop) {
          var maxX = data.length+1;
          var minX = null;
          var total = 0;
          for (let i = data.length-1; i >= 0; i-- ) {
            let d = data[i];
            total += d.y;
            if (minX == null && total >= options.selectTop) {
              minX = i+1;
            }
          }
          if (minX == null) {
            minX = data.length;
          }
          brush.extent([minX, maxX]);
        }

        let brushHeight = innerHeight + margin.top;
        let brushY = (margin.top-1) * -1;
        group.selectAll("g.x.brush").remove();
        let brushGroup = group.selectAll("g.x.brush").data([0]);
        brushGroup.enter().append("g")
            .attr("class", "x brush")
            .transition()
            .duration(1000)
            .call(brush)
            .selectAll("rect")
            .attr("y", brushY)
            .attr("height", brushHeight);




        brushGroup.selectAll(".resize")
          .append("line")
          .style("visibility", options.selectTop ? "visible" : "hidden")
          .attr("y2", innerHeight);

        brushGroup.selectAll(".resize")
          .append("path")
          .style("visibility", options.selectTop ? "visible" : "hidden")
          .attr("d", d3.svg.symbol().type("triangle-up").size(20))
          .attr("transform", function(d,i) {
            return i ?  "translate(-4," + (innerHeight/2) + ") rotate(-90)" : "translate(4," + (innerHeight/2) + ") rotate(90)";
          });

        brush.on("brushend", function() {
          brushEnd();
        });
        brush.on("brush", function() {
          svg.selectAll(".x.brush .resize line")
             .style("visibility", "visible");
          svg.selectAll(".x.brush .resize path")
             .style("visibility", "visible");
        })

        if (options.selectTop) {
          d3.select("g.x.brush")
            .transition()
            .duration(1000)
            .call(brushEnd);
        }






      });


    }

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.xValue = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.yValue = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.xAxis = function(_) {
      if (!arguments.length) return xAxis;
      xAxis = _;
      return chart;
    };

    chart.yAxis = function(_) {
      if (!arguments.length) return yAxis;
      yAxis = _;
      return chart;
    };

    chart.formatXTick = function(_) {
      if (!arguments.length) return formatXTick;
      formatXTick = _;
      return chart;
    }

    chart.xAxisLabel = function(_) {
      if (!arguments.length) return xAxisLabel;
      xAxisLabel = _;
      return chart;
    }

    chart.yAxisLabel = function(_) {
      if (!arguments.length) return yAxisLabel;
      yAxisLabel = _;
      return chart;
    }

    chart.brush = function(_) {
      if (!arguments.length) return brush;
      brush = _;
      return chart;
    };

    chart.widthPercent = function(_) {
      if (!arguments.length) return widthPercent;
      widthPercent = _;
      return chart;
    };

    chart.heightPercent = function(_) {
      if (!arguments.length) return heightPercent;
      heightPercent = _;
      return chart;
    };

    chart.tooltipText = function(_) {
      if (!arguments.length) return tooltipText;
      tooltipText = _;
      return chart;
    };

    chart.onSelected = function(_) {
      if (!arguments.length) return onSelected;
      onSelected = _;
      return chart;
    };


    d3.rebind(chart, dispatch, "on");
    return chart;
  }

</script>

<style>

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

table.table tbody td, table.table tbody th{
  height: 7px;
}

.headerWidth{
  width: 1%;
  color: red
}
</style>
