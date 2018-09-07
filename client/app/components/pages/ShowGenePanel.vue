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
    <v-alert
        v-if="associatedGenesData.length"
        v-model="alertAssociatedInfo"
        dismissible
        color="blue darken-1"
        outline
        style="width:90%; border-style:none; border-color:white !important; border:0px !important"
      >
        Genes marked with the <v-icon style="font-size:20px">verified_user</v-icon> icon are reported to be associated with the condition; it is possible that they do not appear on any panels that test for the condition. These genes will always appear at the top of the gene list.
      </v-alert>

      <v-data-table
          id="genes-table"
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          class="elevation-1"
          v-bind:pagination.sync="pagination"
          item-key="name"
          :search="search"
          :custom-filter="filterItemsOnSearch"
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
            <td>{{ props.item.indexVal }}</td>
            <td>
              <div id="app">
                <div>
                  <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">
                    {{ props.item.name }}
                  </span>
                  <span v-if="props.item.isAssociatedGene===true">
                    <v-icon style="font-size:20px" color="blue darken-2">verified_user</v-icon>
                  </span>
                </div>
              </div>
            </td>
            <td v-if="multipleSearchDisorders.length>1">
              <span v-for="x in props.item.searchTermIndexSVG">
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
                <v-icon slot="activator" style="padding-right:4px">more_vert</v-icon>
                <v-card>
                  <div class="conditionsBox">
                    <v-list>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title><strong style="font-size:18px"> Gene Resource Links &nbsp;<i>( {{ props.item.name }} )</i> </strong></v-list-tile-title>
                          </v-list-tile-content>
                          </v-list-tile>
                        <v-divider class="Rightbar_card_divider"></v-divider>
                        <v-list-tile >
                         <v-list-tile-content>
                           <v-list-tile-title><strong>MedGen</strong><a v-bind:href="props.item.medGenSrc" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                           <br>
                           <v-list-tile-sub-title>
                             MedGen organizes information related to human medical genetics, such as attributes of conditions with a genetic contribution.
                          </v-list-tile-sub-title>
                            <!-- <v-list-tile-sub-title><a v-bind:href="props.item.medGenSrc" target="_blank"><v-btn block small color="primary" >Link</v-btn></a></v-list-tile-sub-title> -->
                         </v-list-tile-content>
                       </v-list-tile>

                       <br>
                       <v-list-tile >
                        <v-list-tile-content>
                          <v-list-tile-title><strong>OMIM</strong><a v-bind:href="props.item.omimSrc" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                          <br>
                          <v-list-tile-sub-title>
                            OMIM is a comprehensive, authoritative compendium of human genes and genetic phenotypes
                          </v-list-tile-sub-title>
                           <!-- <v-list-tile-sub-title><a v-bind:href="props.item.omimSrc" target="_blank"><v-btn block  small color="primary" >Link</v-btn></a></v-list-tile-sub-title> -->
                        </v-list-tile-content>
                      </v-list-tile>

                      <br>
                      <v-list-tile >
                       <v-list-tile-content>
                         <v-list-tile-title><strong>GeneCards</strong><a v-bind:href="props.item.geneCardsSrc" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                         <br>
                         <v-list-tile-sub-title>
                           GeneCards is a searchable, integrative database that provides comprehensive, user-friendly information on all annotated and predicted human genes.
                         </v-list-tile-sub-title>
                          <!-- <v-list-tile-sub-title><a v-bind:href="props.item.geneCardsSrc" target="_blank"><v-btn block outline small color="primary" >Link</v-btn></a></v-list-tile-sub-title> -->
                       </v-list-tile-content>
                     </v-list-tile>

                     <br>
                     <v-list-tile >
                      <v-list-tile-content>
                        <v-list-tile-title><strong>Genetics Home Reference</strong><a v-bind:href="props.item.ghrSrc" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                        <br>
                        <v-list-tile-sub-title>
                          Genetics Home Reference provides consumer-friendly information about the effects of genetic variation on human health.
                        </v-list-tile-sub-title>
                         <!-- <v-list-tile-sub-title><a v-bind:href="props.item.ghrSrc" target="_blank"><v-btn block outline small color="primary" >Link</v-btn></a></v-list-tile-sub-title> -->
                      </v-list-tile-content>
                    </v-list-tile>

                    <br>
                    <v-list-tile >
                     <v-list-tile-content>
                       <v-list-tile-title><strong>ClinGen</strong><a v-bind:href="props.item.clinGenLink" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                       <br>
                       <v-list-tile-sub-title>
                         The Clinical Genome Resource (ClinGen) consortium curates genes and regions of the genome to assess whether there is evidence to support that these genes/regions are dosage sensitive and should be targeted on a cytogenomic array                       </v-list-tile-sub-title>
                        <!-- <v-list-tile-sub-title><a v-bind:href="props.item.clinGenLink" target="_blank"><v-btn block outline small color="primary" >Link</v-btn></a></v-list-tile-sub-title> -->
                     </v-list-tile-content>
                   </v-list-tile>

                       <br>
                       <v-list-tile >
                        <v-list-tile-content>
                          <v-list-tile-title><strong>Gene ID <i> ( {{props.item.geneid}} )</i> </strong><a v-bind:href="props.item.geneIdLink" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                          <br>
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
      </v-data-table>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
var model = new Model();

  export default {
    components: {
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
      },
      associatedGenes: {
        type: Array
      },
      launchedFromClinProps: {
        type: Boolean
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
          sortBy: 'indexVal',
          // descending: true, //Sorts the column in descending order
          rowsPerPage: 25 //Sets the number of rows per page

        },
        tmp: '',   //For searching the rows in data table
        search: '',  //For searching the rows in data table
        selected: [],
        headers: [
          { text: 'Rank', align: 'left', value: 'indexVal' },
          {
            text: 'Gene Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
          {
            text: '',
            align: 'left',
            sortable: false,
            value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'isAssociatedGene', 'geneid', 'geneIdLink'] },
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
        associatedGenesData: [],
        alertAssociatedInfo: true,

      }
    },
    mounted(){
      this.modeOfInheritanceProps = this.modeOfInheritanceData;
      this.multipleSearchDisorders = this.multipleSearchItems;
      this.AddGeneData();

    },
    updated(){
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
        // console.log("this.multipleSearchItems", this.multipleSearchItems.length)
        if(this.multipleSearchItems.length>=2){
          this.headers = [
            { text: 'Rank', align: 'left', value: 'indexVal' },
            {
              text: 'Gene Name',
              align: 'left',
              sortable: false,
              value: 'name'
            },
            { text: 'Search Terms', align: 'left', value: 'searchTermIndexSVG' },
            { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
            {
              text: '',
              align: 'left',
              sortable: false,
              value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'geneid', 'geneIdLink'] },
          ]
        }
        else if(this.multipleSearchItems.length<=1){
          this.headers = [
            { text: 'Rank', align: 'left', value: 'indexVal' },
            {
              text: 'Gene Name',
              align: 'left',
              sortable: false,
              value: 'name'
            },
            { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
            {
              text: '',
              align: 'left',
              sortable: false,
              value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'geneid', 'geneIdLink'] },
          ]
        }

      }
    },
    methods:{
      filterItemsOnSearch(items, search, filter) {
        search = search.toString().toLowerCase()
        return items.filter(row => filter(row["name"], search));
      },
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
      drawHtmlData: function(width){
        return "<span style='color:#4e7ad3'><i>Not on any panels </i><span>"
      },
      AddGeneData: function(){
        bus.$emit("openNavDrawer");
        this.GetGeneData = this.GeneData;
        this.associatedGenesData = this.associatedGenes;
        if(this.associatedGenesData.length){
          this.associatedGenesData.map(x=>{
            x.omimSrc= `https://www.ncbi.nlm.nih.gov/omim/?term=${x.name}`;
            x.medGenSrc= `https://www.ncbi.nlm.nih.gov/medgen/?term=${x.name}`;
            x.geneCardsSrc= `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${x.name}`;
            x.ghrSrc= `https://ghr.nlm.nih.gov/gene/${x.name}`;
            x.clinGenLink= `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${x.name}`;
            x.htmlData = this.drawHtmlData($('#genes-table').innerWidth());
            x.isAssociatedGene = true;
            x.value = 0;
          })
        }

        this.modeOfInheritanceList = this.modeOfInheritanceData;
        this.DataToIncludeSearchTerms = this.GeneData;

        this.arrangedSearchData = this.searchTermsForGeneId(this.DataToIncludeSearchTerms);

        var mergedGenes = model.mergeGenesAcrossPanels(this.GetGeneData);
        let data = model.getGeneBarChartData(mergedGenes, $('#genes-table').innerWidth() );
        this.GenesToDisplay = data;

        this.arrangeAllData(this.arrangedSearchData, this.GenesToDisplay);

        if(this.associatedGenesData.length){
          this.associatedGenesData.map(x=>{
            var checkIfAssociatedGeneExist = obj => obj.name === x.name;
            if(data.some(checkIfAssociatedGeneExist)){
              var genes = [];
              data.map(y=>{
                genes.push(y.name);
              });
              var i = genes.indexOf(x.name);
              x.htmlData = data[i].htmlData;
              x.value = data[i].value;
              x.conditions = data[i].conditions;
              x.diseases = data[i].diseases;
              x.geneid = data[i].geneid;

              data.splice(i, 1);
              data = [...data];
            }
          })
        }

        if(this.associatedGenesData.length){
          this.associatedGenesData.sort(function(a, b){
            return a.value < b.value;
          });

          this.items = [...this.associatedGenesData, ...data];
        }
        else{
          this.items = data;
        }
        this.noOfSourcesSvg();
        if(this.launchedFromClinProps){
          this.selected = this.items.slice(0,10);
        }
        else {
          this.selected = this.items.slice(0,50);
        }
        // console.log("this.selected", this.selected)
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
              genesData[j].searchTermIndex = terms[i].searchData;
              genesData[j].searchTermArray = terms[i].searchDataTerms;
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

        var dupsObj = {};

        for(var i=0; i<genesTempArr.length; i++){
          if(dupsObj[genesTempArr[i].geneid]===undefined){
            dupsObj[genesTempArr[i].geneid] = genesTempArr[i];
          }
          else {
            dupsObj[genesTempArr[i].geneid].searchTermIndex = [...dupsObj[genesTempArr[i].geneid].searchTermIndex, ...genesTempArr[i].searchTermIndex];
            dupsObj[genesTempArr[i].geneid].searchTermIndex = Array.from(new Set(dupsObj[genesTempArr[i].geneid].searchTermIndex))
            dupsObj[genesTempArr[i].geneid].searchTermArray = [...dupsObj[genesTempArr[i].geneid].searchTermArray, ...genesTempArr[i].searchTermArray];
            dupsObj[genesTempArr[i].geneid].searchTermArray = Array.from(new Set(dupsObj[genesTempArr[i].geneid].searchTermArray))

          }
        }

        var newGeneArr = [];

        for(var key in dupsObj){
          newGeneArr.push(dupsObj[key])
        }
        var obj = {};
        for(var i=0; i<newGeneArr.length; i++){
          if(obj[newGeneArr[i].geneid]===undefined){
            obj[newGeneArr[i].geneid] = {
              index: newGeneArr[i].searchTermIndex,
              terms: newGeneArr[i].searchTermArray
            }
          }
        }

        var anotherArr = [];
        for(var key in obj){
          anotherArr.push({
            id: key,
            searchData: obj[key].index,
            searchDataTerms: obj[key].terms
          })
        }

        anotherArr.map(x=>{
          x.searchData.sort();
        })
        return anotherArr

      },
      noOfSourcesSvg: function(){
        this.items.map((x, i)=>{
          x.indexVal = i+1;
          x.searchTermIndexSVG = x.searchTermIndex.map(y=>{
            return `<svg height="30" width="30">
                  <circle class="sourceIndicator"  />
                  <text x="12" y="15" text-anchor="middle" fill="#455A64" font-weight="600" font-size="10px" font-family="Arial" dy=".3em">${y}</text>
                </svg> `
          })
        });
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

<style lang="sass">
@import ../assets/sass/variables

.accent--text
  color: $accent-text-color !important

.genepanelsRect
  fill: #4e7ad3
  pointer-events: all
  stroke: $svgBar-fill
  stroke-width: 2
  // fill: #FF6845

// .genepanelsRect:hover
//   fill: #FFE650

.sourceIndicator
  fill: #ffffff00
  stroke: #455A64
  stroke-width: 2
  cx: 12
  cy: 15
  r: 10

.grayRect
  fill: #e8ebed
  stroke: white
  stroke-width: 2

.Rightbar_card_divider
  margin-top: 10px
  margin-bottom: 10px


.v-list__tile__sub-title, .v-list__tile__title
  white-space: initial
  overflow: initial
  text-overflow: initial


.v-list__tile
  height: auto

.conditionsBox
  width: 470px
  overflow-wrap: break-word
  height:  370px
  overflow-y: scroll


#gene-histogram-chart .bar rect
    fill:   #7dc2e5
    stroke: #1f5d7a
    stroke-width: .5


#gene-histogram-chart .bar.selected rect
    fill: #2d8fc1


#gene-histogram-chart .bar text
    font-size: 10px


#gene-histogram-chart .x.axis
  font-size: 10px

#gene-histogram-chart .y.axis
  font-size: 10px !important

#gene-histogram-chart .axis .label
  font-size: 12px !important



div.tooltip
  position: absolute
  text-align: center
  z-index: 20
  color: white
  padding: 4px 6px 4px 6px
  font: 11px arial
  background: rgb(80,80,80)
  border: 0px
  border-radius: 4px
  pointer-events: none


/*                           */
/* Gene horizontal barchart  */
/*                           */
#gene-bar-chart #title
  font-size: 20px
  padding-bottom: 10px
  padding-top: 20px
  font-weight: 300


/*                      */
/*  Any svg chart       */
/*                      */
.y.axis line
  fill: none
  stroke: #e0e0e0
  shape-rendering: crispEdges


.x.axis line
  fill: none
  stroke: #e0e0e0
  shape-rendering: crispEdges


.axis path
  fill: none
  stroke: #848383
  shape-rendering: crispEdges

.axis .label
  font-size: 12px

.brush .extent
  fill-opacity: .125
  shape-rendering: crispEdges

.resize
  display: inline !important
  fill: #7A7A7A
  fill-opacity: 1
  stroke: #7A7A7A
  stroke-width: 2px

.input-group__input
  min-height: 3px

.headerWidth
  width: 1%
  color: red

</style>
