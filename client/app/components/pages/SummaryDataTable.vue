<template>
  <div>
    <v-data-table
        v-model="selected"
        v-bind:headers="headers"
        v-bind:items="items"
        select-all
        v-bind:pagination.sync="pagination"
        item-key="name"
        v-bind:search="search"
        no-data-text="No Genes Available Currently"
        :custom-filter="filterItemsOnSearch"
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
        <tr :active="props.selected">
          <td>
            <v-checkbox
              primary
              hide-details
              v-model="props.selected"
              :input-value="props.selected"
            ></v-checkbox>
          </td>

          <td>{{ props.item.SummaryIndex}}</td>
          <td>
            <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.name }}</span>
            <span v-if="props.item.isAssociatedGene===true">
              <v-icon style="font-size:20px" color="blue darken-2">verified_user</v-icon>
            </span>
          </td>
          <td>
            <span v-for="x in props.item.sourceGTR">
              <span v-html="x"></span>
            </span>
          </td>
          <td>
            <span v-for="x in props.item.sourcePheno">
              <span v-html="x"></span>
            </span>
          </td>
          <td>
            <v-menu bottom offset-y style="color:black">
              <v-icon slot="activator" style="padding-right:4px">more_vert</v-icon>
              <v-card>
                <div class="conditionsBox">
                  <v-list>
                    <div class="v-list__group__header">
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title><strong>  &nbsp;  Gene Resource Links &nbsp;<i>( {{ props.item.name }} )</i> </strong></v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                    <a v-bind:href="props.item.medGenSrc" target="_blank">
                      <v-list-tile style="font-size:14px; height:36px" @click="">
                        <v-list-tile-content style="margin-left:10px">
                          <v-list-tile-title><v-icon>arrow_right</v-icon>MedGen</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </a>

                    <a v-bind:href="props.item.omimSrc" target="_blank">
                      <v-list-tile style="font-size:14px; height:36px" @click="">
                        <v-list-tile-content style="margin-left:10px">
                          <v-list-tile-title><v-icon>arrow_right</v-icon>OMIM</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      </a>

                    <a v-bind:href="props.item.geneCardsSrc" target="_blank">
                      <v-list-tile style="font-size:14px; height:36px" @click="">
                        <v-list-tile-content style="margin-left:10px">
                          <v-list-tile-title><v-icon>arrow_right</v-icon>Gene Cards</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      </a>

                    <a v-bind:href="props.item.ghrSrc" target="_blank">
                      <v-list-tile style="font-size:14px; height:36px" @click="">
                        <v-list-tile-content style="margin-left:10px">
                          <v-list-tile-title><v-icon>arrow_right</v-icon>Genetics Home Reference</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      </a>

                    <a v-bind:href="props.item.clinGenLink" target="_blank">
                      <v-list-tile style="font-size:14px; height:38px" @click="">
                        <v-list-tile-content style="margin-left:10px">
                          <v-list-tile-title><v-icon>arrow_right</v-icon>ClinGen</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </a>

                    <v-list-tile style="font-size:14px; height:38px" @click="">
                      <v-list-tile-content style="margin-left:10px">
                        <v-list-tile-title><v-icon>arrow_right</v-icon>Gene ID:<a v-bind:href="props.item.geneIdLink" target="_blank"> {{props.item.geneId}} </a></v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <br>
                  </v-list>
                </div>
              </v-card>
            </v-menu>
          </td>
        </tr>
      </template>
      <template slot="footer">
    </template>
    </v-data-table>
  </div>
</template>

<script>
import { bus } from '../../routes';
  export default {
    props:{
      summaryTableData:{
        type: Array
      },
      geneSearch: {
        type: String
      },

    },
    data: () => ({
      pagination: {
        sortBy: 'SummaryIndex',
        rowsPerPage: 25 //Sets the number of rows per page
      },
      tmp: '',   //For searching the rows in data table
      search: '',  //For searching the rows in data table
      selected: [],
      headers: [
        { text: '#', align: 'left', sortable: false, value:'SummaryIndex' },
        { text: 'Gene Name', align: 'left', sortable: false, value:'name' },
        { text: 'GTR Conditions', align: 'left', sortable: false, value: 'sourceGTR' },
        { text: 'Phenolyzer', align: 'left', sortable: false, value: ['isPheno', 'sourcePheno', ] },
        { text: '', align: 'left', sortable: false, value: [ 'omimSrc', 'ghrSrc', 'medGenSrc', 'geneCardsSrc', 'clinGenLink', 'isAssociatedGene', 'geneId', 'geneIdLink'] },

      ],
      items: [],
      tableData:[],
      selectedGenesText: "",
      associatedGenesData : [],
    }),
    watch: {
      summaryTableData: function(){
        console.log("Watching")
        // this.tableData = this.summaryTableData;
        // console.log("this.summaryTableData", this.summaryTableData);
        this.addTableData();
      },
      geneSearch: function(){
        this.search = this.geneSearch;
      },

    },
    mounted(){
      console.log("mounted")
      // this.tableData = this.summaryTableData;
      this.addTableData();
      // this.items = this.tableData;
      // this.selected = this.items.slice();
      // this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
      // bus.$emit("updateAllGenes", this.selected);
    },
    updated(){
      bus.$on('deSelectAllSummaryGenesBus', (data)=>{
        this.DeSelectAllSummaryGenes(data);
      })

      bus.$on('SelectAllSummaryGenesBus', (data)=>{
        this.SelectAllSummaryGenes(data);
      })

      bus.$on("selectCommonGenesBus", ()=>{
        this.selectCommonGenes();
      })

      this.$emit("TotalSummaryGenes", this.items.length);
      this.$emit("TotalSummarySelectedGenes", this.selected.length);

      this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
      bus.$emit("updateAllGenes", this.selected);
    },
    methods: {
      addTableData(){
        var xtableData = [];
        this.tableData = this.summaryTableData;
        // xtableData = this.tableData;
        var associatedGenes = [];
        var nonAssociatedGenes = [];

        this.tableData.map(x=>{
          if(x.isAssociatedGene===true){
            associatedGenes.push(x);
          }
          else{
            nonAssociatedGenes.push(x);
          }
        })
        this.associatedGenesData = associatedGenes;

        if(associatedGenes.length){
          this.items = [...associatedGenes, ...nonAssociatedGenes];
        }
        else {
          this.items = this.tableData;
        }

        this.items.map((x,i)=>{
          x.SummaryIndex = i + 1;
        })

        this.selected = this.items.slice();
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        bus.$emit("updateAllGenes", this.selected);

      },
      filterItemsOnSearch(items, search, filter) {
        search = search.toString().toLowerCase()
        return items.filter(row => filter(row["name"], search));
      },
      selectCommonGenes(){
        var tempSelected = [];
        for(var i=0; i<this.items.length; i++){
          if(this.items[i].isGtr && this.items[i].isPheno){
            tempSelected.push(this.items[i]);
          }
        }
        this.selected = tempSelected;
      },
      SelectAllSummaryGenes(){
        this.selected = this.items.slice();
      },
      DeSelectAllSummaryGenes(){
        this.selected = [];
      },
      toggleAll () { //Data Table
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) { //Data Table
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
    }
  }
</script>
