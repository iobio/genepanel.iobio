<template>
  <div>
    <!-- Hello from DiseasesPanel! -->
    <!-- <btn type="primary" v-on:click.prevent="showDiseasesData">Show Diseases</btn> -->

    <!-- <ul>
      <li v-for="(disease,index) in DiseasePanelData" v-on:click.prevent="alertIndex(index, disease.Title)">{{ index +1}}..{{ disease.Title }} -- {{ disease._geneCount}} -- {{ disease._modeOfInheritance }}</li>
    </ul> -->
    <!-- <v-app id="inspire"> -->
      <!-- <v-card-title>
        Disease Table -->
        <!-- <btn v-on:click.prevent="selectAllDisorders">Select All</btn> -->
        <!-- <btn v-on:click.prevent="deSelectAllDisorders">De Select All</btn> -->
        <!-- <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title> -->
      <!-- <ul>
        <li v-for="item in items "> {{item._modeOfInheritance}}
        </li>
      </ul> -->
      <div id="pie-chart-box"></div>
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="Title"
          class="elevation-1"
          v-bind:search="search"
          no-data-text="No Disorders Available Currently"
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
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon>arrow_upward</v-icon>
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
                :input-value="props.selected"
              ></v-checkbox>
            </td>
            <!-- <td></td> -->
            <td>{{ props.item.Title }}</td>
            <td>{{ props.item._omim }}</td>
            <td>{{ props.item._modeOfInheritance }}</td>
            <td>{{ props.item._genePanelCount }}</td>
            <td>{{ props.item._geneCount }}</td>
          </tr>
        </template>
        <template slot="footer">
        <td colspan="100%">
          <strong>{{ selected.length}} of {{ items.length }} results selected</strong>
        </td>
      </template>
      </v-data-table>
    <!-- </v-app> -->

    <br>
    <br>

    <!-- {{ selected.Title }} -->


  </div>
</template>


<script>
import { bus } from '../../routes';
import dt from 'datatables.net';
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery;

import Model from './Model';
var model = new Model();


  export default {
    props: ['DiseasePanelData'],
    data(){
        return {
          propsData : [],
          tmp: '',
          search: '',
          pagination: {
            sortBy: 'Title'
          },
          selected: [],
          headers: [
            {
              text: 'Title',
              align: 'left',
              value: 'Title'
            },
            {
              text: 'OMIM',
              align: 'left',
              value: '_omim'
             },
            { text: 'Mode Of Inheritance', align: 'left', value: '_modeOfInheritance' },
            { text: 'Gene Panels', align: 'left', value: '_genePanelCount' },
            { text: 'Genes', align: 'left', value: '_geneCount' },
          ],
          items: [],
          tempItems: [],
          modeOfInheritanceData: [],
          piechart : {}
        }
      },
    methods:{
        alertIndex: function(i, title){
          alert(i);
          console.log( "i" , i , " and title is : ", title)
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
        showDiseasesData: function(){
          console.log("propsData from showDiseasesData: ", this.propsData);
          this.items = this.DiseasePanelData;
          this.tempItems = this.DiseasePanelData;
          // console.log("this.items  : ", this.items);
          this.modeOfInheritanceData = model.filterItemsForModeOfInheritance(this.items);
          console.log(" modeOfInheritanceData from Disease Panel ", this.modeOfInheritanceData);
          this.$emit("PieChartSelectorData", this.modeOfInheritanceData); //Emit
                                            // the mode of Inheritance back to parent so it can be used as props in summary panel

          // this.draw(this.modeOfInheritanceData)
          //if (this.selected.length) this.selected = []
           this.selected = this.items.slice()
          console.log("this.selected from showDiseases ", this.selected )
          //this.toggleAll();
        },
        selectAllDisorders: function(){
          this.selected = this.items.slice()
        },
        deSelectAllDisorders: function(){
          this.selected = []
        },
        draw(dataForModeOfInheritance){
          console.log("dataForModeOfInheritance: ", dataForModeOfInheritance)
          var data = dataForModeOfInheritance

          var width = 400,
            height = 220,
            radius = Math.min(width, height) / 2;



          var color = d3.scale.ordinal()
            .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

          var arcOver = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 110);

            var arc = d3.svg.arc().outerRadius(radius + 10).innerRadius(radius - 108);



          var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
              return d._geneCount;
            });

            var svg = d3.select("#pie-chart-box").append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var g = svg.selectAll(".arc")
              .data(pie(data))
              .enter().append("g")
              .attr("class", "arc");

            var path = g.append("path")
              .attr("d", arc)
              .attr("stroke", "white")
              .attr("stroke-width", 3)
              .style("fill", function(d) {
                return color(d.data._modeOfInheritance);
              });

              // path.on("mouseenter", function (d) {
              //   d3.select(this)
              //       // .attr("stroke", "black")
              //       .transition()
              //       .duration(200)
              //       .attr("d", arcOver)
              //       // .attr("stroke-width", 1);
              //   })
              //
              //   path.on("mouseleave", function (d) {
              //     d3.select(this).transition()
              //          .duration(200)
              //          .attr("d", arc)
              //          // .attr("stroke", "black")
              //          // .attr("stroke-width", 1);
              //        })

                path.on("click", function(d){
                  if(d.data.selected){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("d", arcOver);

                    d.data.selected = !d.data.selected
                    pieChartSomething(d.data._modeOfInheritance, d.data.selected)
                  }
                  else {
                    d3.select(this).transition()
                         .duration(200)
                         .attr("d", arc)
                         .attr("stroke", "white")
                         .attr("stroke-width", 3)

                         d.data.selected = !d.data.selected
                         pieChartSomething(d.data._modeOfInheritance, d.data.selected)

                  }
                  // d.data.selected = !d.data.selected
                  // pieChartSomething(d.data._modeOfInheritance, d.data.selected)
                })

            g.append("text")
              .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
              })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) {
                return d.data._modeOfInheritance;
              })
              .on('click', function(d){
                if(d.data.selected){
                  d3.select(this)
                      .transition()
                      .duration(200)
                      .attr("d", arcOver);

                  d.data.selected = !d.data.selected
                  pieChartSomething(d.data._modeOfInheritance, d.data.selected)
                }
                else {
                  d3.select(this).transition()
                       .duration(200)
                       .attr("d", arc)


                       d.data.selected = !d.data.selected
                       pieChartSomething(d.data._modeOfInheritance, d.data.selected)

                }
                // d.data.selected = !d.data.selected
                // pieChartSomething(d.data._modeOfInheritance, d.data.selected)
              })
            var pieChartSomething =(modeOfInheritance, selection)=>{
              this.updateFromPieChart(modeOfInheritance, selection)
            }
        },
        sendModeOfInheritanceData(){
          alert(this.modeOfInheritanceData.length)
          bus.$emit("PieChartSelectorData");
        },
        updateFromPieChart(modeOfInheritance, selection){
          console.log("selection is ", selection)
          // if (selection) {
          //   alert(modeOfInheritance+ " is selected ")
          // }
          // else {
          //   alert(modeOfInheritance+ " is deselected")
          // }
          console.log("this tempItems from updateFromPieChart", this.tempItems)
          if(modeOfInheritance === "Not provided"){
            modeOfInheritance="";
          }
          var tempArr = [];
          var splitHelperArr = [];
          // this.items = this.tempItems;

          if(!selection){
            for(var i=0; i<this.items.length; i++){

              if(modeOfInheritance!==this.items[i]._modeOfInheritance && this.items[i]._modeOfInheritance.split(", ").length===1){
                tempArr.push(this.items[i])
              }
              else if(this.items[i]._modeOfInheritance.split(", ").length >1){
                console.log("splitter array ", this.items[i]._modeOfInheritance.split(", "))
                splitHelperArr = this.items[i]._modeOfInheritance.split(", ");
                if(!splitHelperArr.includes(modeOfInheritance)){
                  tempArr.push(this.items[i])
                }
              }
            }
            console.log("tempArr is ", tempArr)
            this.items = tempArr;
            this.selected = this.items.slice();
          }
          else if(selection){
            tempArr = this.items;
            for(var i=0; i<this.tempItems.length; i++){
              if(modeOfInheritance===this.tempItems[i]._modeOfInheritance && this.tempItems[i]._modeOfInheritance.split(", ").length===1){
                tempArr.push(this.tempItems[i])
              }
              else if(this.tempItems[i]._modeOfInheritance.split(", ").length >1){
                splitHelperArr = this.tempItems[i]._modeOfInheritance.split(", ");
                if(splitHelperArr.includes(modeOfInheritance)){
                  tempArr.push(this.tempItems[i])
                }
              }
            }
            this.items = tempArr;
            this.selected = this.items.slice();
          }
        }


    },
    mounted(){
      //this.draw();
      console.log("DiseasePanel: I am mounted!");
      this.showDiseasesData()
      bus.$on("RequestModeOfInheritanceData", ()=>{
        this.sendModeOfInheritanceData();
      });
      bus.$on("updateModeOfInheritance", (modeOfInheritance, selection)=>{
        this.updateFromPieChart(modeOfInheritance, selection)
      })
    },
    updated(){
      console.log("DiseasePanel: I am updated!");
      console.log("this.selected from showDiseases updated", this.selected );

      //Emit the this.selected array back to the home.vue so it can be passed as props
      this.$emit('selectedDiseases', this.selected);

      bus.$on('deSelectAllDisordersBus', ()=>{
        this.deSelectAllDisorders();
      });

      bus.$on('SelectAllDisordersBus', ()=>{
        this.selectAllDisorders();
      })

    },
    watch: {
      DiseasePanelData: function(){
        this.showDiseasesData();
      }
    }

  }
</script>

<style scoped>
 /* #inspire {
   height: 500px;
 } */
</style>
