<template>
  <div>
    <v-card-title>
      <v-chip outline color="primary">{{ selectedGenesText }}</v-chip>
      <strong>

      </strong>
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
              :input-value="props.selected"
            ></v-checkbox>
          </td>

          <!-- <td><span v-html="props.item.htmlData"></span></td> -->
          <td>
            <div id="app">
              <div>
                <v-menu open-on-hover top offset-y>
                  <span style="font-size:13px; margin-top:2px" slot="activator">{{ props.item.name }}</span>
                    <div >
                      <v-card>
                        <v-card-text style="margin-top:-25px">
                          <center ><h3>{{ props.item.name }}</h3></center>
                          <hr>
                          <div style="width:600px"><strong>Resources: </strong></div>
                          <ul style="margin-left:25px; margin-top:5px">
                            <li><a v-bind:href="props.item.omimSrc" target="_blank">OMIM</a></li>
                            <li><a v-bind:href="props.item.medGenSrc" target="_blank">MedGen</a></li>
                            <li><a v-bind:href="props.item.geneCardsSrc" target="_blank">Gene Cards</a></li>
                            <li><a v-bind:href="props.item.ghrSrc" target="_blank">Genetics Home Reference</a></li>
                          </ul>
                        </v-card-text>
                      </v-card>
                    </div>
                </v-menu>
              </div>
            </div>
            <!-- {{ props.item.name }} -->
          </td>
          <!-- <td>
              <span v-if="props.item.sources==='gtrPheno'">
                <v-progress-circular
                  :size="25"
                  :width="5"
                  :rotate="360"
                  :value="100"
                  color="light-blue darken-1"
                >
                </v-progress-circular>
              </span>
              <span v-else-if="props.item.sources==='gtr'">
                <v-progress-circular
                  :size="25"
                  :width="5"
                  :rotate="90"
                  :value="50"
                  color="light-blue darken-1"
                >
                </v-progress-circular>
              </span>
              <span v-else-if="props.item.sources==='pheno'">
                <v-progress-circular
                  :size="25"
                  :width="5"
                  :rotate="-90"
                  :value="50"
                  color="light-blue darken-1"
                >
                </v-progress-circular>
              </span>
          </td> -->
          <td>
            <span v-if="props.item.isGtr"><v-icon >check_circle</v-icon></span>
            <span v-else></span>
          </td>
          <td>
            <span v-if="props.item.isPheno"><v-icon >check_circle</v-icon></span>
            <span v-else></span>
          </td>
          <!-- <td style="font-size:0px;">{{ props.item.indexVal }}</td> -->

          <!-- <td>{{ props.item._conditionNames }}</td> -->
          <!-- <td>{{ props.item._geneCount }}</td> -->
        </tr>
      </template>
      <template slot="footer">
      <td colspan="100%">
        <strong>{{ selected.length}} of {{ items.length }} genes selected</strong>
      </td>
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
        { text: 'Name', align: 'left', sortable: false, value:'name' },
        // { text: 'Sources', align: 'center', sortable: false, value: 'sources' },
        { text: 'GTR', align: 'left', sortable: false, value: 'isGtr' },
        { text: 'Phenolyzer', align: 'left', sortable: false, value: ['indexVal', 'isPheno', 'omimSrc', 'ghrSrc', 'medGenSrc', 'geneCardsSrc'] },
        // {
        //   text: '',
        //   align: 'left',
        //   value: 'name'
        // }

      ],
      items: [],
      tableData:[],
      selectedGenesText: ""
    }),
    watch: {
      summaryTableData: function(){
        this.tableData = this.summaryTableData;
        this.items = this.tableData;
        this.selected = this.items.slice();
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
      },

    },
    mounted(){
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
