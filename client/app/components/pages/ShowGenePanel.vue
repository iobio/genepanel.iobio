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
              <!-- {{ header.text }} -->
              <span v-if="header.text==='Gene Panels'">
                <v-layout style="margin-left: -20px">
                  <v-flex xs1 style="margin-top:40px; padding-left:20px">
                    <small >{{minSliderValue}}</small>
                  </v-flex>
                  <v-flex xs8 style="padding-top:12px">
                    <div >
                      <v-slider
                         v-if="sliderValue>=0"
                         :track-color="color"
                         thumb-label="always"
                         :color="sliderColor"
                         :thumb-color="color"
                         v-model="sliderValue"
                         :thumb-size="20"
                         :max="maxSliderValue"
                         :min="minSliderValue"
                         v-on:change="sliderClicked"
                      ></v-slider>
                    </div>
                    <div style="margin-top:-20px; padding-bottom:10px">
                      <center>
                        {{header.text}}
                        <v-tooltip bottom>
                          <span style="cursor:pointer" slot="activator"><v-icon>help</v-icon> </span>
                          <span>The slider above sets the cut off value for the panels. Ex. If the slider value is 12, all the genes present in 12 or more panels are selected.</span>
                        </v-tooltip>
                      </center>
                    </div>

                  </v-flex>
                  <v-flex xs1 style="margin-top:40px;">
                    <small >{{maxSliderValue}}</small>
                  </v-flex>
                  <v-flex xs2>
                    <v-flex>
                      <v-text-field
                        style="font-size:14px"
                        v-model="sliderValue"
                        class="mt-0"
                        type="number"
                      ></v-text-field>
                      <v-tooltip bottom>
                        <span style="cursor:pointer" slot="activator"><v-icon>help</v-icon> </span>
                        <span>This numeric entry can be used to set the slider value.</span>
                      </v-tooltip>
                    </v-flex>
                  </v-flex>
                  <v-flex>
                  </v-flex>
                </v-layout>
              </span>
              <span v-else-if="header.text==='Gene Name'">
               <div v-show="!openSearchBox">
                 {{header.text}} &nbsp; &nbsp; <v-icon right style="opacity:2; color:#222; cursor: pointer" v-on:click="openSearchBox = true">search</v-icon>
               </div>
               <div v-show="openSearchBox">
                 <v-layout >
                   <v-flex xs8 style="margin-top:-30px">
                     <div id="geneSearchBox">
                       <v-text-field
                         label="Search for Gene"
                         prepend-icon="search"
                         single-line
                         hide-details
                         v-model="search"
                       ></v-text-field>
                     </div>
                   </v-flex>
                   <v-flex xs1>
                     <v-icon style="opacity:2; color:#222; cursor: pointer" v-on:click="closeSearchBox">close</v-icon>
                   </v-flex>
                 </v-layout>
               </div>
              </span>
              <span v-else-if="header.text===''" >
              </span>
              <span v-else>{{ header.text }}</span>

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
                      </v-list-tile-content>
                    </v-list-tile>

                    <br>
                    <v-list-tile >
                      <v-list-tile-content>
                        <v-list-tile-title><strong>ClinGen</strong><a v-bind:href="props.item.clinGenLink" target="_blank"><v-btn small round outline color="primary">Link</v-btn></a></v-list-tile-title>
                        <br>
                        <v-list-tile-sub-title>
                          The Clinical Genome Resource (ClinGen) consortium curates genes and regions of the genome to assess whether there is evidence to support that these genes/regions are dosage sensitive and should be targeted on a cytogenomic array                       </v-list-tile-sub-title>
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
      GeneDataIndividual: {
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
      associatedGenesIndividual: {
        type: Array
      },
      launchedFromClinProps: {
        type: Boolean
      },
      clinGenes: {
        type: Array
      },
      currentSearchedTerm: {
        type: String
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
        sliderValue: 0,
        minSliderValue: 0,
        maxSliderValue: 0,
        sliderColor: 'grey lighten-1',
        color: 'blue darken-3',
        includeClinGenes: true,
        openSearchBox: false,
        defaultGenesToSelect: this.launchedFromClinProps ? 20 : 50,
        GetGeneDataIndividual: [],
        DataToIncludeSearchTermsIndividual: [],
        arrangedSearchDataIndividual: [],
        GenesToDisplayIndividual: [],
        itemsIndividual: [],
        associatedGenesDataIndividual: [],
        currentSearchTerm: "",
        genesSearchTermObj: {},
      }
    },
    mounted(){
      this.modeOfInheritanceProps = this.modeOfInheritanceData;
      this.multipleSearchDisorders = this.multipleSearchItems;
      this.currentSearchTerm = this.currentSearchedTerm;
      this.AddGeneData();
      // this.AddGeneDataIndividual();
      bus.$on("clearClinGenesArray", ()=>{
        this.includeClinGenes = false;
      });
      bus.$on("includeClinGenesArr", ()=>{
        this.includeClinGenes = true;
      })

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
      this.$emit("GtrFullGeneList", this.items);
      this.$emit("TotalNoOfGenesFromGTR", this.items.length);

    },
    watch: {
      sliderValue: function(){
        this.updateSelectionOnSliderValue();
      },
      GeneData: function(){
        this.AddGeneData();
      },
      GeneDataIndividual: function(){
        this.AddGeneDataIndividual();
      },
      modeOfInheritanceData: function(){
      },
      NumberOfTopGenes: function() {
        this.selectNumberOfTopGenes();
      },
      geneSearch: function(){
        this.search = this.geneSearch;
      },
      clinGenes: function(){
      },
      currentSearchedTerm: function(){
        this.currentSearchTerm = this.currentSearchedTerm;
      },
      multipleSearchItems: function(){
        this.multipleSearchDisorders = this.multipleSearchItems;
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
      sliderClicked() {
        this.includeClinGenes = false;
      },
      filterItemsOnSearch(items, search, filter) {
        search = search.toString().toLowerCase()
        return items.filter(row => filter(row["name"], search));
      },
      updateSelectionOnSliderValue(){
        this.selected = [];
        if(this.clinGenes.length>0 && this.includeClinGenes){
          this.items.map(x=>{
            if(this.clinGenes.includes(x.name)){
              this.selected.push(x);
            }
          })
        }
        else{
          this.items.map(x=>{
            if(x.value>=this.sliderValue || x.isAssociatedGene){
              this.selected.push(x);
            }
          })
        }
      },
      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0, data);
        // this.flagForNumberOfGenesSelected = true;
        this.NumberOfGenesSelectedFromFilter = data;
        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
      },
      filterGenesOnSelectedNumberOfPanels(data){
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
        let data = model.getGeneBarChartData(mergedGenes, $('#genes-table').innerWidth(), this.launchedFromClinProps );
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
          // this.associatedGenesData = this.associatedGenesData.sort(function(a, b){
          //   return a.value < b.value;
          // });

          this.associatedGenesData.sort((a,b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
          this.items = [...this.associatedGenesData, ...data];
        }
        else{
          this.items = data;
        }
        this.noOfSourcesSvg();

        var valuesForMedian = [];
        this.items.map(x=>{
          valuesForMedian.push(x.value);
        })
        var medianValue = model.calculateMedian(valuesForMedian);
        var fiftiethGeneValue;
        if(this.items.length>this.defaultGenesToSelect){
          fiftiethGeneValue = this.items[this.defaultGenesToSelect-1].value;
        }
        var maxValue = Math.max(...valuesForMedian);
        var selectionTempArr = [];
        this.selected = [];
        var cutOffValue;

        if(this.clinGenes.length<1 || !this.includeClinGenes){
          if(this.items.length<=10){
            this.selected = this.items.slice();
          }
          else if(this.items.length>10 && this.items.length<=this.defaultGenesToSelect){
            cutOffValue = medianValue;
            if(maxValue===medianValue){
              this.selected = this.items.slice();
            }
            else{
              this.items.map(x=>{
                if(x.value>medianValue || x.isAssociatedGene){
                  this.selected.push(x);
                }
              })
            }
          }
          else{
            if(medianValue>fiftiethGeneValue){
              cutOffValue = medianValue;
            }
            else {
              cutOffValue = fiftiethGeneValue;
            }
            if(maxValue===cutOffValue){
              this.selected = this.items.slice(0, this.defaultGenesToSelect);
            }
            else {
              this.items.map((x,i)=>{
                if((x.value>cutOffValue || x.isAssociatedGene) && i<this.defaultGenesToSelect){
                  this.selected.push(x);
                }
              })
            }
          }
        }

        //If clin genes have value, set selected accordingly:
        if(this.clinGenes.length>0 && this.includeClinGenes){
          this.items.map(x=>{
            if(this.clinGenes.includes(x.name)){
              this.selected.push(x);
            }
          })
        }

        this.sliderValue = this.selected[this.selected.length-1].value;
        this.minSliderValue = Math.min(...valuesForMedian);
        this.maxSliderValue = Math.max(...valuesForMedian);

        this.selectedGenesText = ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdateSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromGTR", this.selected.length);
        this.$emit("TotalNoOfGenesFromGTR", this.items.length);
        bus.$emit("GeneDistributionChartData", this.items);

        this.dataForTables = data.slice(0,10);
      },
      AddGeneDataIndividual: function(){
        this.GetGeneDataIndividual = this.GeneDataIndividual;
        this.associatedGenesDataIndividual = this.associatedGenesIndividual;
        if(this.associatedGenesIndividual.length){
          this.associatedGenesIndividual.map(x=>{
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

        // this.modeOfInheritanceList = this.modeOfInheritanceData;
        this.DataToIncludeSearchTermsIndividual = this.GeneDataIndividual;
        this.arrangedSearchDataIndividual = this.searchTermsForGeneId(this.DataToIncludeSearchTermsIndividual);

        var mergedGenesIndividual = model.mergeGenesAcrossPanels(this.GeneDataIndividual);
        let dataIndividual = model.getGeneBarChartData(mergedGenesIndividual, $('#genes-table').innerWidth(), this.launchedFromClinProps );
        this.GenesToDisplayIndividual = dataIndividual;

        this.arrangeAllData(this.arrangedSearchDataIndividual, this.GenesToDisplayIndividual);

        if(this.associatedGenesIndividual.length){
          this.associatedGenesIndividual.map(x=>{
            var checkIfAssociatedGeneExist = obj => obj.name === x.name;
            if(dataIndividual.some(checkIfAssociatedGeneExist)){
              var genes = [];
              dataIndividual.map(y=>{
                genes.push(y.name);
              });
              var i = genes.indexOf(x.name);
              x.htmlData = dataIndividual[i].htmlData;
              x.value = dataIndividual[i].value;
              x.conditions = dataIndividual[i].conditions;
              x.diseases = dataIndividual[i].diseases;
              x.geneid = dataIndividual[i].geneid;

              dataIndividual.splice(i, 1);
              dataIndividual = [...dataIndividual];
            }
          })
        }

        if(this.associatedGenesDataIndividual.length){
          // this.associatedGenesData = this.associatedGenesData.sort(function(a, b){
          //   return a.value < b.value;
          // });

          this.associatedGenesDataIndividual.sort((a,b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
          this.itemsIndividual = [...this.associatedGenesDataIndividual, ...dataIndividual];
        }
        else{
          this.itemsIndividual = dataIndividual;
        }
        this.noOfSourcesSvg();
        this.createSeperateGenesObj();
      },
      createSeperateGenesObj: function(){
        if(this.genesSearchTermObj[this.currentSearchTerm]===undefined){
          this.genesSearchTermObj[this.currentSearchTerm] = [];
        }
        this.updateGenesSearchTermObj();
      },
      updateGenesSearchTermObj: function(){
        if(!this.genesSearchTermObj[this.currentSearchTerm].length){
          this.itemsIndividual.map((x,i)=>{
            this.genesSearchTermObj[this.currentSearchTerm].push({
              name: x.name,
              genePanelsCount: x.value,
              rank: i+1,
            })
          })
        }
        // this.itemsIndividual = [];
        this.$emit("individualGenesObj", this.genesSearchTermObj)
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
                  <circle class="sourceIndicator"/>
                  <text class="sourceIndicatorText" x="12" y="15" font-weight="600" font-size="10px" dy=".3em">${y}</text>
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
      closeSearchBox: function(){
        this.search = "";
        this.openSearchBox=false;
      },
    }
  }

</script>

<style lang="sass" >
@import ../assets/sass/variables

.accent--text
  color: $accent-text-color !important

.genepanelsRect
  fill: #4e7ad3
  pointer-events: all
  stroke: $svgBar-fill
  stroke-width: 2

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

.input-group__input
  min-height: 3px

.headerWidth
  width: 1%
  color: red

#geneSearchBox .v-label
  font-size: 12px

</style>
