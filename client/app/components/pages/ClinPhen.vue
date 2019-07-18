<template>
  <div>
    <div style="background-color:#f9fbff">
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
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text style="margin-bottom:-5px">
                <h3>HPO <small><i> [ beta ] </i></small></h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8 xl8>
                    <div id="HPOInput" style="display:inline-block; padding-top:5px;">
                      <label>Enter Phenotype or HPO term</label>
                      <input
                        id="hpo_input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        v-on:focus="ClearInputForNewSearch"
                        v-on:keydown="EnterForSearch"
                        placeholder="Search phenotype (Mandibulofacial dysostosis) or HPO term (HP:0005321)">
                      <typeahead
                        v-model="searchInput"
                        hide-details="false"
                        force-select :force-clear="true"
                        target="#hpo_input"
                        :data="HpoTermsTypeaheadData"
                        :limit="parseInt(100)"
                        item-key="HPO_Data"/>

                    </div>
                    <v-btn
                        :class="{'disable-events': !submitButtonEnabled}"
                        style="margin-top:-0.35px; text-transform: none"
                        class="btnColor"
                        v-on:click="searchForTheInputTerm"
                        >
                      Search
                    </v-btn>
                    <p v-if="checked" ><v-progress-linear height="3" color="primary" :indeterminate="true"></v-progress-linear></p>

                    <p>
                      <br>
                      ------ <i>OR</i> ------
                    </p>

                    <!-- Clinical notes text entry box -->
                    <label>Enter or paste clinical notes</label>

                    <v-layout row wrap>
                      <v-flex lg8>
                        <v-textarea
                          solo
                          v-model="notes"
                          name="input-7-4"
                          rows="4"
                          label="Patient has symptoms such as Mandibulofacial dysostosis, Lactic acidosis.."
                        ></v-textarea>
                      </v-flex>
                      <v-flex lg4>
                        <v-btn style="text-transform:none" v-on:click="fetchHpoTerm" color="primary">Submit</v-btn>
                      </v-flex>
                    </v-layout>

                    <p></p>

                    <div v-if="this.HpoTerms.length">
                        HPO Terms:
                      <v-chip  color="primary" text-color="white" close v-for="(term, i) in HpoTerms" :key="i" @input="remove(term)">
                        {{ i+1 }}. <b> {{ term.hpoNumber }} </b> &nbsp; <i> ({{term.phenotype}}) </i>
                      </v-chip>
                    </div>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg4 xl4>
                    <v-layout row wrap>
                      <v-flex style="margin-left:20px">
                        <div v-if="items.length>0">
                          <GenesSelection
                            :items="items.length"
                            :selected="selected.length"
                            :multipleSearchTerms="multipleSearchTerms"
                            v-on:selectNgenes="selectNgenes($event)"
                          />
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 >
            <v-card >

            </v-card>
          </v-flex>

          <v-flex d-flex xs12 >
            <v-layout row wrap>
              <!-- Start data table  -->
              <v-flex xs8>
                <v-card>
                  <ContentLoaderPlaceholder v-show="checked===true"></ContentLoaderPlaceholder>
                </v-card>
              </v-flex>

              <!-- Datatable goes here -->
              <v-flex xs12>
                <v-card v-if="items.length">
                  <v-data-table
                      id="clinphen-genes-table"
                      v-model="selected"
                      v-bind:headers="headers"
                      v-bind:items="items"
                      select-all
                      v-bind:pagination.sync="pagination"
                      item-key="gene"
                      class="elevation-1"
                      v-bind:search="search"
                      no-data-text="No pheotype genes Available Currently"
                      :custom-filter="filterItemsOnSearchClinPhen"
                      :rows-per-page-items="[5, 10, 25, 50]"
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
                        >
                          <!-- {{ header.text }} -->
                          <span v-if="header.text===''">
                            <GeneSearchBox
                              v-on:search="searchedGeneName($event)">
                            </GeneSearchBox>
                          </span>
                          <span v-else-if="header.text==='Search Terms'">
                            <v-layout style="margin-left: -20px; width:65%">
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
                                     ticks="always"
                                     tick-size="2"
                                  ></v-slider>
                                </div>
                                <div style="margin-top:-20px; padding-bottom:10px">
                                  <center>
                                    {{header.text}}
                                    <v-tooltip bottom>
                                      <span style="cursor:pointer" slot="activator"><v-icon>help</v-icon> </span>
                                      <span>The slider above sets the cut off value for gene selection. Ex. If the slider value is 4, it would select all the genes present in 4 or more HPO terms.</span>
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
                          <span v-else>{{ header.text }}</span>

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
                        <td>{{ props.item.index }}</td>
                        <td >
                          <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.gene }}</span>
                        </td>
                        <td >
                          <span v-for="x in props.item.searchTermIndexSVG">
                            <span v-html="x"></span>
                          </span>
                        </td>
                        <td class="text-xs-right">
                          <v-menu bottom offset-y style="color:black">
                            <v-icon slot="activator" style="padding-right:4px">more_vert</v-icon>
                            <v-card>
                              <div class="conditionsBox">
                                <v-list>
                                  <v-list-tile>
                                    <v-list-tile-content>
                                      <v-list-tile-title><strong style="font-size:18px"> Gene Resource Links &nbsp;<i>( {{ props.item.gene }} )</i> </strong></v-list-tile-title>
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
                </v-card>
              </v-flex>
              <!-- End data table -->


            </v-layout>
          </v-flex>

        </v-layout>
      </v-container>

      <!-- Confirmation Dialog box -->
      <v-dialog
        v-model="confirmationDialog"
        max-width="950px"
        persistent
      >
        <v-card>
          <v-card-title class="headline grey lighten-2">
            <span>HPO Terms</span>
          </v-card-title>

          <v-card-text>
            <b>Clinical Note: </b>  {{notes}}
            <v-alert
                v-if="confirmationItems.length>0"
                dismissible
                :value="true"
                color="blue darken-1"
                outline
                style="border-style:none; border-color:white !important; border:0px !important"
              >
              ClinPhen uses natural language processing to extract HPO terms from clinical notes. This is a difficult problem, and unexpected results can occur. We highly recommend ensuring the accuracy of the clinical note, and that all returned HPO terms are reviewed for relevance.
            </v-alert>
          </v-card-text>
          <v-card-text>
            <div v-if="confirmationItems.length>0">
              <v-btn small color="blue darken-1" round outline dark v-on:click="confirmationSelected = confirmationItems">Select All</v-btn>
              <v-btn small color="blue darken-1" round outline dark v-on:click="confirmationSelected = []">Deselect All</v-btn>
              <br>
            </div>
            <!-- Datatable -->
            <v-data-table
              v-if="confirmationItems.length"
              :headers="confirmationTableHeader"
              :items="confirmationItems"
              class="elevation-1"
              hide-actions=false
            >
              <template v-slot:items="props">
                <td style="padding-top:20px">
                  <!-- <v-switch color="success" v-model="confirmationSelected" :value="props.item"></v-switch> -->
                  <v-checkbox color="primary" v-model="confirmationSelected" :value="props.item"></v-checkbox>
                </td>
                <td>{{ props.item.hpoNumber }}</td>
                <td >{{ props.item.phenotype }}</td>
                <td >{{ props.item.occurrences }}</td>
                <td >{{ props.item.earliness }}</td>
                <td>
                  <TruncatedSentence :exampleSentence="props.item.sentence" />
                </td>
              </template>
            </v-data-table>
            <div v-if="confirmationItems.length===0">
              <center>
                <v-alert
                    :value="true"
                    color="error"
                    outline
                    icon="priority_high"
                  >
                  No HPO terms found for the entered text
                </v-alert>
              </center>
            </div>
          </v-card-text>
          <!-- <v-card-text>
            <i style="text-align:justify" v-if="confirmationItems.length">
              Phenotypes extracted from the clinical notes are prioritized, first by number of occurrences in the notes (phenotypes that likely pertain to a genetic disease are usually mentioned in multiple clinical notes, and even multiple times in the same note), <br>
              then by earliest occurrence in the notes (clinicians usually begin a note with a summary of the phenotypes that seem striking and indicative of a genetic disease).
            </i>
          </v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="confirmationDialog=false">Cancel</v-btn>
            <v-btn color="blue darken-1" :disabled="!confirmationSelected.length" flat @click="updateHPOtermsSelection">Generate Gene List</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- End Confirmation Dialog box -->

      <!-- Loading dialog box -->
      <v-dialog
        v-model="loadingDialog"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
              <p style="color:white">Fetching the HPO terms...</p>
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-container fluid grid-list-md style="min-height:500px">
        <v-layout row wrap style="margin-top: -20px;margin-left: -20px;margin-right: -20px;">
          <v-flex d-flex xs12 sm12 md12 lg12>

          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import GeneModel from '../../models/GeneModel';
var geneModel = new GeneModel();
import Model from '../../models/Model';
var model = new Model();
import IntroductionText from '../../../data/IntroductionText.json'
import Dialogs from '../partials/Dialogs.vue';
import HelpDialogs from '../../../data/HelpDialogs.json';
import SvgBar from '../viz/SvgBar.vue'
import progressCircularDonut from '../partials/progressCircularDonut.vue';
import ContentLoaderPlaceholder from '../partials/ContentLoaderPlaceholder.vue';
import ContentLoaderSidebar from '../partials/ContentLoaderSidebar.vue';
import hpo_genes from '../../../data/hpo_genes.json';
import HpoTermsData from '../../../data/HpoTermsData.json';
import GenesSelection from '../partials/GenesSelection.vue';
import GeneSearchBox from '../partials/GeneSearchBox.vue';
import HPO_Phenotypes from '../../../data/HPO_Phenotypes';
import HPO_Terms from '../../../data/HPO_Terms';
import TruncatedSentence from '../partials/TruncatedSentence.vue';
import { Client } from 'iobio-api-client';
const api = new Client('backend.iobio.io', { secure: true });

  export default {
    components: {
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      'progressCircularDonut': progressCircularDonut,
      'ContentLoaderPlaceholder': ContentLoaderPlaceholder,
      'ContentLoaderSidebar': ContentLoaderSidebar,
      'GenesSelection': GenesSelection,
      'GeneSearchBox': GeneSearchBox,
      'TruncatedSentence': TruncatedSentence,
      Typeahead
    },
    props: {
      isMobile: {
        type: Boolean
      },
      browser: {
        type: String
      },
      launchedFromClin: {
        type: Boolean
      }
    },
    data(){
      let self = this;
      return {
        notes: "",
        HpoTerms: [],
        multipleSearchTerms: [],
        checked: false,
        HpoGenesData: null,
        HpoTermsTypeaheadData: null,
        items: [],
        selected: [],
        confirmationDialog: false,
        loadingDialog: false,
        //DataTable
        pagination: {
          sortBy: 'index',
          // descending: true,
          rowsPerPage: 25
        },
        search: '',
        searchInput: "",
        selected: [],
        headers: [
          {
            text: 'Number',
            value: 'index',
            sortable: false,
            align: 'left',
          },
          {
            text: 'Gene Name',
            align: 'left',
            value: 'gene',
            sortable: false,
          },
          { text: 'Search Terms', align: 'center', sortable: false, value: 'searchTermIndexSVG'},
          {
            text: '',
            align: 'left',
            value: [, 'omimSrc', 'clinGenLink', 'medGenSrc', 'geneCardsSrc', 'ghrSrc' ] ,
            sortable: false,
          },
        ],
        confirmationItems: [],
        confirmationSelected: [],
        confirmationTableHeader: [
          {
            text: 'Selection',
            sortable: false,
          },
          {
            text: 'HPO ID',
            value: 'hpoNumber',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Phenotype',
            value: 'phenotype',
            sortable: false,
            align: 'left'
          },
          {
            text: 'No. occurrences',
            value: 'occurrences',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Earliness',
            value: 'earliness',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Example sentence',
            value: 'sentence',
            sortable: false,
            align: 'left'
          },
        ],
        openSearchBox: false,
        search: '',
        submitButtonEnabled: false,
        sliderValue: 1,
        minSliderValue: 1,
        maxSliderValue: 1,
        sliderColor: 'grey lighten-1',
        color: 'blue darken-3',
        HPO_Phenotypes_data: null,
        HPO_Terms_data: null,
        snackbar: false,
        snackbarText: "",
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
      }
    },
    beforeCreate(){
    },
    created(){
    },
    mounted(){
      this.HpoGenesData = hpo_genes;
      this.HpoTermsTypeaheadData  = HpoTermsData.data;
      this.HPO_Terms_data = HPO_Terms;
      this.HPO_Phenotypes_data = HPO_Phenotypes;
      bus.$on("newAnalysis", ()=>{
        this.items = [];
        this.selected = [];
        this.multipleSearchTerms = [];
        this.notes = "";
        this.openSearchBox = false;
        this.HpoTerms = [];
        this.search = "";
        this.$emit("ClinPhenGenes", []);
        this.$emit("clinphenTerms", []);
        document.getElementById("hpo_input").value="";
      })
    },
    updated(){
      this.$emit("ClinPhenGenes", this.selected);
    },
    watch: {
      searchInput: function(){
        if(this.searchInput===undefined){
          this.submitButtonEnabled = false;
        }
        else {
          this.submitButtonEnabled = true;
        }
      },
      sliderValue: function(){
        this.updateSelectionOnSliderValue(this.sliderValue);
      },
    },
    methods: {
      updateSelectionOnSliderValue(sliderValue){
        this.selected = [];
        var len = this.items.length;
        for(var i=0; i<len; i++){
          if(this.items[i].hpoSource >= sliderValue) this.selected.push(this.items[i]);
          else break;
        }
      },
      EnterForSearch(){
        if(event.key==='Enter'){
          this.checked = true;
          setTimeout(()=>{
            this.searchForTheInputTerm();
            document.getElementById("hpo_input").blur();
          }, 500)
        }
      },

      searchForTheInputTerm(){
        bus.$emit("clearSearchInput");
        this.checked = true;
        var inputString = document.getElementById("hpo_input").value;
        inputString = inputString.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();

        var cleanedInputString;
        var idx;
        var hpoId;
        var phenoTerm;

        if(this.searchInput===undefined){ //If the input is not selected from the typeahead
          if(inputString.substr(0,2).toUpperCase() === "HP"){ //Check if the input is in HP: format
            cleanedInputString = [inputString.slice(0,2), ":" , inputString.slice(2)].join('');
            cleanedInputString = cleanedInputString.toUpperCase();
            if(this.HPO_Terms_data.includes(cleanedInputString)){
              idx = this.HPO_Terms_data.indexOf(cleanedInputString);
              hpoId = cleanedInputString;
              phenoTerm = this.HPO_Phenotypes_data[idx];
              if(!this.multipleSearchTerms.includes(hpoId)){
                this.multipleSearchTerms.push(hpoId);
                this.HpoTerms.push(
                  {
                    hpoNumber:hpoId,
                    phenotype:phenoTerm
                  }
                )
                this.getGenesForHpoTerms();
              }
            }
            else {
              this.snackbarText = "Please select an option from the autocomplete";
              this.snackbar = true;
              this.checked = false;
            }
          }
          else { //checks if the input is a phenotype term
            cleanedInputString = model.capitalizeFirstLetter(inputString.toLowerCase());
            if(this.HPO_Phenotypes_data.includes(cleanedInputString)){
              idx = this.HPO_Phenotypes_data.indexOf(cleanedInputString);
              phenoTerm = cleanedInputString;
              hpoId = this.HPO_Terms_data[idx];
              if(!this.multipleSearchTerms.includes(hpoId)){
                this.multipleSearchTerms.push(hpoId);
                this.HpoTerms.push(
                  {
                    hpoNumber:hpoId,
                    phenotype:phenoTerm
                  }
                )
                this.getGenesForHpoTerms();
              }
            }
            else {
              this.snackbarText = "Please select an option from the autocomplete";
              this.snackbar = true;
              this.checked = false;
            }
          }
        }
        else { //If the input is selected from the typeahead
          var res = this.searchInput.HPO_Data.split(" - ");
          hpoId = res[1].replace(/[\])}[{(]/g, '').trim();
          phenoTerm = res[0];
          if(!this.multipleSearchTerms.includes(hpoId)){
            this.multipleSearchTerms.push(hpoId);
            this.HpoTerms.push(
              {
                hpoNumber:hpoId,
                phenotype:phenoTerm
              }
            )
            this.getGenesForHpoTerms();
          }
          else {
            this.snackbarText = "This HPO Term already exists";
            this.snackbar = true;
            this.checked = false;
          }
        }
      },
      fetchHpoTerm: function(){
        // this.HpoTerms = [];
        this.loadingDialog = true;
        const cmd = api.clinphen({ notes: `${this.notes}`});
        cmd.run();

        let fullData = "";
        cmd.on('data', (data) => {
          fullData += data;
        });

        cmd.on('end', () => {
          this.parseTerms(fullData);
        });

        cmd.on('error', (e) => {
          console.error(e);
        });

      },
      parseTerms: function(res){
        var count = 0;
        var hpoTermArr = [];
        var terms = [];
        res.split("\n").forEach(function(rec){
          var fields = rec.split("\t");
          if(fields.length===5){
            var hpoNumber = fields[0];
            var phenotype = fields[1];
            var occurrences = fields[2];
            var earliness = fields[3];
            var sentence = fields[4];
            terms.push(hpoNumber)
            hpoTermArr.push(
              {
                hpoNumber:hpoNumber,
                phenotype:phenotype,
                occurrences:occurrences,
                earliness:earliness,
                sentence:sentence
              }
            )
          }
        })
        hpoTermArr.shift();
        terms.shift();
        // this.multipleSearchTerms = terms;
        // this.HpoTerms = hpoTermArr;
        this.confirmationItems = hpoTermArr;
        // this.confirmationSelected = hpoTermArr;
        this.confirmationSelected = [];
        this.loadingDialog = false;
        this.confirmationDialog = true;
      },
      updateHPOtermsSelection: function(){
        this.checked = true;
        this.confirmationDialog = false;
        // this.HpoTerms = this.confirmationSelected; => this is replacing the hpo terms chips
        var temp = [];
        this.confirmationSelected.map(term =>{
          temp.push(term.hpoNumber)
        })
        // this.multipleSearchTerms = temp;  => this is replacing the hpo terms searched
        temp.map((hpoId, idx) => {
          if(!this.multipleSearchTerms.includes(hpoId)){
            this.multipleSearchTerms.push(hpoId);
            this.HpoTerms.push(this.confirmationSelected[idx])
          }
        })
        this.getGenesForHpoTerms();
      },
      getGenesForHpoTerms: function(){
        bus.$emit("clearSearchInput");
        var genes = [];
        this.items = [];
        this.selected = [];
        this.$emit("clinphenTerms", this.HpoTerms);
        this.multipleSearchTerms.map((term, i)=>{
          if(this.HpoGenesData[term]!==undefined){
            // this.items = [...this.items, ...this.HpoGenesData[x].gene_symbol]
            this.HpoGenesData[term].gene_symbol.map(gene_name=>{
              if(!genes.includes(gene_name)){
                genes.push(gene_name);
                this.items.push({
                  gene: gene_name,
                  searchTermIndex: [i+1],
                  hpoTerm: [term],
                  componentSource: "ClinPhen",
                  hpoSource:1,
                })
              }
              else if(genes.includes(gene_name)){
                var idx = genes.indexOf(gene_name);
                if(this.items[idx].hpoTerm!==term){
                  this.items[idx].searchTermIndex.push(i+1);
                  this.items[idx].hpoTerm.push(term);
                  this.items[idx].hpoSource = this.items[idx].hpoSource+1;
                }
              }
            })

          }
        })
        this.checked = false;
        this.items.sort((a,b)=> b.hpoSource - a.hpoSource );
        this.noOfSourcesSvg();
        this.selectGenes();
      },
      noOfSourcesSvg: function(){
        this.items.map((x, i)=>{
          x.index = i+1;
          x.searchTermIndexSVG = x.searchTermIndex.map(y=>{
            return `<svg height="30" width="30">
                  <circle class="sourceIndicator"/>
                  <text class="sourceIndicatorText" x="12" y="15" font-weight="600" font-size="10"  dy=".3em">${y}</text>
                </svg> `
          })
          x.omimSrc = `https://www.ncbi.nlm.nih.gov/omim/?term=${x.gene}`;
          x.medGenSrc = `https://www.ncbi.nlm.nih.gov/medgen/?term=${x.gene}`;
          x.geneCardsSrc = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${x.gene}`;
          x.ghrSrc = `https://ghr.nlm.nih.gov/gene/${x.gene}`;
          x.clinGenLink = `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${x.gene}`;

        });
      },
      selectGenes(){
        if(this.multipleSearchTerms.length){
          this.maxSliderValue = this.items[0].hpoSource;

          this.maxSliderValue > 1 ?
            this.maxSliderValue === 2 ?
              this.sliderValue = 2 :
                this.sliderValue = Math.ceil(this.maxSliderValue/2) :
            this.sliderValue = 1 ;

          this.updateSelectionOnSliderValue(this.sliderValue);
        }
      },
      remove(term){
        bus.$emit("clearSearchInput");
        this.checked = true;
        var idx = this.multipleSearchTerms.indexOf(term.hpoNumber);
        this.HpoTerms.splice(idx,1);
        this.HpoTerms = [...this.HpoTerms];
        this.multipleSearchTerms.splice(idx,1);
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.$emit("clinphenTerms", this.HpoTerms);
        this.getGenesForHpoTerms();
      },
      toggleAll () { //Data Table
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      filterItemsOnSearchClinPhen(items, search, filter) {
        search = search.toString().toLowerCase()
        return items.filter(row => filter(row["gene"], search));
      },
      closeSearchBox: function(){
        this.search = "";
        this.openSearchBox=false;
      },
      ClearInputForNewSearch: function(){
        this.searchInput = "";
        document.getElementById("hpo_input").value="";
        document.getElementById("hpo_input").focus();
      },
      selectNgenes: function(number){
        if(number>0){
          this.selected = this.items.slice(0,number);
        }
      },
      searchedGeneName: function(gene){
        this.search = gene;
      },
    }
  }
</script>

<style>

</style>

<style lang="sass">

  @import ../assets/sass/variables

  .disable-events
    pointer-events: none

  #hpo_input
    width: 600px
    height: 40px
    margin-top: 4px
    background-color: $search-box-color
    border-color: $search-box-color


  @media screen and (max-width: 1620px)
    #hpo_input
      width: 420px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 1050px)
    #hpo_input
      width: 450px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 950px)
    #hpo_input
      width: 290px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 700px)
    #hpo_input
      width: 300px
      height: 40px
      margin-top: 4px
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

    .btnColor
      margin-top: 2px
</style>
