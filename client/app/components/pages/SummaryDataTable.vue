<template>
  <div>
    <v-card-title>
      <!-- <btn @click="copy">
          <i class="material-icons">content_copy</i> Copy to clipboard
      </btn> -->
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
          <td>{{ props.item.name }}</td>
          <td>
            <span v-if="props.item.isGtr"><v-icon color="green" >check_circle</v-icon></span>
            <span v-else></span>
          </td>
          <td>
            <span v-if="props.item.isPheno"><v-icon color="green" >check_circle</v-icon></span>
            <span v-else></span>
          </td>
          <td>{{ props.item.indexVal }}</td>

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
        {
          text: 'Name',
          align: 'left',
          value: 'name'
        },
        { text: 'GTR', align: 'left', sortable: false, value: 'isGtr' },
        { text: 'phenolyzer', align: 'left', sortable: false, value: 'isPheno' },
        { text: 'indexVal', align: 'left', sortable: false, value: 'indexVal' },
      ],
      items: [],
      tableData:[],
    }),
    watch: {
      summaryTableData: function(){
        this.tableData = this.summaryTableData;
        this.items = this.tableData;
        this.selected = this.items.slice()
      },

    },
    mounted(){
      this.tableData = this.summaryTableData;
      this.items = this.tableData;
      this.selected = this.items.slice();
    },
    methods: {
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
