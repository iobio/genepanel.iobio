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

          <td>{{ props.item.indexVal}}</td>
          <td>
            <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.name }}</span>
          </td>
          <!-- <td>
            <span v-if="props.item.isGtr"><v-icon >check_circle</v-icon></span>
            <span v-else></span>
          </td> -->
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
          <!-- <td>
            <span v-if="props.item.isPheno"><v-icon >check_circle</v-icon></span>
            <span v-else></span>
          </td> -->
        </tr>
      </template>
      <template slot="footer">
      <!-- <td colspan="100%">
        <strong>{{ selected.length}} of {{ items.length }} genes selected</strong>
      </td> -->
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
        sortBy: 'indexVal',
        rowsPerPage: 25 //Sets the number of rows per page
      },
      tmp: '',   //For searching the rows in data table
      search: '',  //For searching the rows in data table
      selected: [],
      headers: [
        { text: 'Index', align: 'left', sortable: false, value:'indexVal' },
        { text: 'Name', align: 'left', sortable: false, value:'name' },
        // { text: 'Sources', align: 'center', sortable: false, value: 'sources' },
        // { text: 'GTR', align: 'left', sortable: false, value: 'isGtr' },
        { text: 'GTR Disorders', align: 'left', sortable: false, value: 'sourceGTR' },
        { text: 'Phenolyzer', align: 'left', sortable: false, value: ['isPheno', 'sourcePheno', ] },
        { text: 'Links', align: 'left', sortable: false, value: [ 'omimSrc', 'ghrSrc', 'medGenSrc', 'geneCardsSrc'] },

      ],
      items: [],
      tableData:[],
      selectedGenesText: ""
    }),
    watch: {
      summaryTableData: function(){
        this.tableData = this.summaryTableData;
        console.log("this.summaryTableData", this.summaryTableData)
        this.items = this.tableData;
        this.selected = this.items.slice();
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
      },
      geneSearch: function(){
        this.search = this.geneSearch;
      },

    },
    mounted(){
      console.log("this.summaryTableData", this.summaryTableData)
      this.tableData = this.summaryTableData;
      this.items = this.tableData;
      this.selected = this.items.slice();
      this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
      bus.$emit("updateAllGenes", this.selected);
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
