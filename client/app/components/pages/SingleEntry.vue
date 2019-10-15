<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <!-- <v-card v-if="!searchComplete"> -->
            <v-card>
              <v-card-text>
                <h3>Dashboard</h3>
                <v-layout row wrap class="mt-3">
                  <!-- <v-flex xs12 sm12 md12 lg4 xl4> -->
                    <!-- <div id="dropdown-example">
                      <v-overflow-btn
                         :items="dropdown_tool"
                         label="Select tool"
                         hint="Select the tool"
                         persistent-hint
                         target="#dropdown-example"
                         v-model="dropdown_tool_value"
                       ></v-overflow-btn>
                    </div> -->
                    <!-- <i>(For testing: This extracts disorders from the clinical note)</i>
                    <br>
                    <v-textarea
                      solo
                      v-model="textNotes"
                      ref="single_entry_input_textarea"
                      id="single_entry_input_textarea"
                      name="input-7-4"
                      rows="3"
                      style="padding-top:5px"
                    ></v-textarea> -->
                  <!-- </v-flex> -->

                  <v-flex xs12 sm12 md12 lg10 xl10>
                    <!-- <i>(Select a term from typeahead, review the options and click the search button)</i>
                    <br> -->
                    <div id="SingleEntryInput" style="display:inline-block; padding-top:5px;">
                      <input
                        id="single_entry_input"
                        ref="single_entry_input"
                        class="form-control"
                        type="text"
                        v-model="textNotes"
                        v-show="textNotes.length<45"
                        autocomplete="off"
                        placeholder="Enter Phenotypes or Type (paste) Clinical Note">
                        <v-textarea
                          solo
                          v-show="textNotes.length>=45"
                          v-model="textNotes"
                          ref="single_entry_input_textarea"
                          id="single_entry_input_textarea"
                          name="input-7-4"
                          rows="2"
                          style="padding-top:5px"
                        ></v-textarea>
                      <typeahead
                        v-model="search"
                        hide-details="false"
                        target="#single_entry_input"
                        force-select :force-clear="true"
                        :data="DiseaseNames"
                        :limit="parseInt(100)"
                        v-on:keydown="EnterForSearch"
                        v-on:input="mouseSelect"
                        item-key="DiseaseName"/>
                    </div>
                    <v-btn @click="extract" color="primary">Submit</v-btn>

                     <!-- <v-btn class="mx-2" fab dark small color="primary" v-on:click.prevent="mouseSelect">
                      <v-icon color="white">add</v-icon>
                    </v-btn> -->

                    <!-- <br>
                    <div v-if="multipleSearchTerms.length">
                      <br>
                        <span id="conditionChips" v-for="(searchItem, i) in searchTermsObj">
                          <v-chip slot="activator" outline color="primary" text-color="primary" close :key="i" @input="remove(searchItem)">
                            {{ i+1 }}. {{ searchItem.DiseaseName }}  &nbsp;
                            <span v-if="searchItem.tool_to_search==='All resources'"> <i> * </i> </span>
                            <span v-if="searchItem.tool_to_search==='GTR'"> <i> ( G ) </i> </span>
                            <span v-if="searchItem.tool_to_search==='Phenolyzer'"> <i> ( P ) </i> </span>

                          </v-chip>
                        </span>
                    </div> -->
                    <!-- <br>
                    <div>
                      <v-btn class="btnColor" :disabled="!multipleSearchTerms.length" @click="performSearchEvent">Search</v-btn>

                    </div> -->

                  </v-flex>
                  <v-flex xs1 sm1 md1 lg1 xl1>
                  </v-flex>



                </v-layout>
                <div if="textNotes.length<45" style="margin-bottom:32px">
                </div>
              </v-card-text>
            </v-card>

          </v-flex>
        </v-layout>

      </v-container>


      <!-- Terms expansion panel:  -->
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-expansion-panel expand v-model="termsExpansionPanel">
              <v-expansion-panel-content>
                <template slot="header">
                  <div>
                    Search terms:
                  </div>
                </template>
                <v-card>
                  <v-card-text>
                    <div class="col-md-4 mb-2">
                      <strong>GTR Terms: </strong>
                      <br>
                      <span v-for="(term, i) in GtrTermsAdded" v-if="GtrTermsAdded.length">
                        <v-chip slot="activator" color="primary" text-color="white" close :key="i" @input="remove(term, i, 'GTR')">
                          <span v-if="term.DiseaseName!==undefined">{{ i+1 }} . {{ term.DiseaseName }}</span>
                          <span v-else> {{ i+1 }} . {{ term }}</span>
                        </v-chip>
                      </span>
                      <span v-if="GtrTermsAdded.length===0">
                        <v-chip ><v-icon left>error_outline</v-icon> No conditions</v-chip>
                      </span>
                    </div>
                    <div class="col-md-4 mb-2">
                      <strong>Phenolyzer Terms: </strong>
                      <br>
                      <span v-for="(term, i) in phenolyzerTermsAdded" v-if="phenolyzerTermsAdded.length">
                        <v-chip slot="activator" color="primary" text-color="white" close :key="i" @input="remove(term, i, 'phenolyzer')">
                        {{ i+1 }} . {{ term.value }}
                        </v-chip>
                      </span>
                      <span v-if="phenolyzerTermsAdded.length===0">
                        <v-chip ><v-icon left>error_outline</v-icon> No phenotypeSearchTerm</v-chip>
                      </span>
                    </div>
                    <div class="col-md-4 mb-2">
                      <strong>HPO Terms: </strong>
                      <br>
                      <span v-for="(term, i) in hpoTermsAdded" v-if="hpoTermsAdded.length">
                        <v-chip slot="activator" color="primary" text-color="white" close :key="i" @input="remove(term, i, 'HPO')">
                        {{ i+1 }} . {{ term.HPO_Data }}
                        </v-chip>
                      </span>
                      <span v-if="hpoTermsAdded.length===0">
                        <v-chip ><v-icon left>error_outline</v-icon> No HPO terms</v-chip>
                      </span>
                    </div>
                  </v-card-text>
                </v-card>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
      </v-container>


      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>

            <!-- <v-expansion-panel v-if="searchStatus" expand v-model="expansionpanlExpand">
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>Search Status</div>
                </template>
                <v-card>
                  <v-card-text>

                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel> -->


            <v-card>
              <v-dialog
                v-model="searchStatusDialog"
                scrollable
                persistent
                :overlay="false"
                max-width="1000px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-title>Search Status</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <div class="container">
                      <div class="row">
                        <div class="col-md-4">
                          <table class="table">
                            <thead>
                              <tr> <strong>GTR Search status</strong></tr>
                            </thead>
                            <tbody>
                              <tr v-for="(term, i) in Gtr_searchTermsObj" :key="i">
                                <td>{{ term.DiseaseName }}</td>
                                <td >
                                  <span v-if="term.gtrSearchStatus==='Searching'">
                                    <v-progress-circular
                                      :width="2"
                                      :size="20"
                                      indeterminate
                                      color="primary"
                                    ></v-progress-circular>
                                  </span>
                                  <span v-else-if="term.gtrSearchStatus==='Completed'"><v-icon color="green">done</v-icon></span>
                                  <span v-else-if="term.gtrSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                                  <span v-else-if="term.gtrSearchStatus==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                                  <span v-else> <v-icon color="gray lighten-4">error</v-icon>  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div class="col-md-4">
                          <table class="table">
                            <thead>
                              <tr> <strong>Phenolyzer Search status</strong></tr>
                            </thead>
                            <tbody>
                              <tr v-for="(term, i) in Phenolyzer_searchTermsObj" :key="i">
                                <td>{{ term.value }}</td>
                                <td >
                                  <span v-if="term.phenolyzerSearchStatus==='Searching'">
                                    <v-progress-circular
                                      :width="2"
                                      :size="20"
                                      indeterminate
                                      color="primary"
                                    ></v-progress-circular>
                                  </span>
                                  <span v-else-if="term.phenolyzerSearchStatus==='Completed'"><v-icon color="green">done</v-icon></span>
                                  <span v-else-if="term.phenolyzerSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                                  <span v-else-if="term.phenolyzerSearchStatus==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                                  <span v-else> <v-icon color="gray lighten-4">error</v-icon>  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div class="col-md-4">
                          <table class="table">
                            <thead>
                              <tr> <strong>HPO Search status</strong></tr>
                            </thead>
                            <tbody>
                              <tr v-for="(term, i) in Hpo_searchTermsObj" :key="i">
                                <td>{{ term.HPO_Data }}</td>
                                <td >
                                  <span v-if="term.hpoSearchStatus==='Searching'">
                                    <v-progress-circular
                                      :width="2"
                                      :size="20"
                                      indeterminate
                                      color="primary"
                                    ></v-progress-circular>
                                  </span>
                                  <span v-else-if="term.hpoSearchStatus==='Completed'"><v-icon color="green">done</v-icon></span>
                                  <span v-else-if="term.hpoSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                                  <span v-else-if="term.hpoSearchStatus==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                                  <span v-else> <v-icon color="gray lighten-4">error</v-icon>  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>


                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card>


            <v-card>
              <v-dialog
                v-model="alertWarning"
                scrollable
                persistent
                :overlay="false"
                max-width="800px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-text>
                    <v-alert
                       :value="true"
                       color="info"
                       icon="info"
                       outline
                     >
                        This search term is too general to search in GTR. Please select a more specific term from the options below:
                        <br>
                     </v-alert>
                    <br>
                    <li style="cursor: pointer" v-if="generalTermsHint.length>0" v-for="(hint, i) in generalTermsHint" :key="i" v-on:click="selectNewTerm(hint)" > {{hint.Title}} <br> </li>
                    <hr>
                    New option selected: {{ NewOptionFromGeneralTerm }}
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn small color="blue darken-1" round outline dark text @click="skipGtrSearch">Skip search in GTR</v-btn>
                    <v-btn small color="blue darken-1" round outline dark text @click="setInputValueFromHint">Confirm</v-btn>
                  </v-card-actions>

                </v-card>
              </v-dialog>
            </v-card>


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
                    <p style="color:white">Fetching terms for review...</p>
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- End Loading dialog box -->


            <!-- Terms review dialog box -->
            <v-card>
              <v-dialog
                v-model="termsReviewDialog"
                scrollable
                persistent :overlay="false"
                max-width="900px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-title class="headline">Review Terms</v-card-title>
                  <v-card-title v-if="termsReviewDialogPage===1">Select the terms to be searched in GTR:  </v-card-title>
                  <div  v-if="termsReviewDialogPage===1">
                    <br><center><i>Please limit to 5 terms in GTR </i></center>
                  </div>
                  <v-card-title v-if="termsReviewDialogPage===2">Select the terms to be searched in Phenolyzer:</v-card-title>
                  <v-card-title v-if="termsReviewDialogPage===3">Select the terms to be searched in HPO:</v-card-title>

                  <v-card-text style="height: 430px;">

                    <!-- GTR review terms table -->
                    <div v-if="GtrReviewTerms.length && termsReviewDialogPage===1">
                      <div v-if="GtrReviewTerms.length===1">
                        <div >
                          <v-expansion-panel v-model="gtrExpansionPanel" expand popout focusable
                          >
                            <v-expansion-panel-content v-for="(item, i) in GtrReviewTerms" :key="i">
                              <template v-slot:header>
                                <div>{{ item.DiseaseName }}</div>
                              </template>

                              <v-card>
                                <v-card-text>
                                  <div v-for="sub in item.reviewTerms_gtr" class="row">
                                    <div class="col-md-2">
                                      <v-checkbox color="primary" style="margin-top:-2px; margin-bottom:-12px;" v-model="GtrTermsAdded" :value="sub"></v-checkbox>
                                    </div>
                                    <div class="col-md-10">
                                      {{ sub.DiseaseName }}
                                    </div>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-expansion-panel-content>

                          </v-expansion-panel>
                        </div>
                      </div>
                      <div v-if="GtrReviewTerms.length>1">
                        <div>
                          <v-expansion-panel v-model="gtrExpansionPanelMultiple" expand popout focusable>
                            <v-expansion-panel-content
                              v-for="(item, i) in GtrReviewTerms" :key="i">
                              <template v-slot:header>
                                <div>{{ item.DiseaseName }}</div>
                              </template>
                              <v-card>
                                <v-card-text >
                                  <div v-for="sub in item.reviewTerms_gtr" >
                                    <div class="row">
                                      <div class="col-md-2">
                                        <v-checkbox color="primary" style="margin-top:-2px; margin-bottom:-12px;" v-model="GtrTermsAdded" :value="sub"></v-checkbox>
                                      </div>
                                      <div class="col-md-10">
                                        {{ sub.DiseaseName }}
                                      </div>
                                    </div>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-expansion-panel-content>

                          </v-expansion-panel>
                        </div>
                      </div>

                    </div>
                    <div v-if="!GtrReviewTerms.length && termsReviewDialogPage===1">
                      Currently unavailable.
                    </div>



                    <!-- Phenolyzer review terms table -->
                    <div v-if="phenolyzerReviewTerms.length && termsReviewDialogPage===2">
                      <div v-if="phenolyzerReviewTerms.length===1">
                        <div >
                          <v-expansion-panel v-model="phenolyzerExpansionPanel" expand popout focusable
                          >
                            <v-expansion-panel-content v-for="(item, i) in phenolyzerReviewTerms" :key="i">
                              <template v-slot:header>
                                <div>{{ item.DiseaseName }}</div>
                              </template>

                              <v-card>
                                <v-card-text>
                                  <div v-for="sub in item.reviewTerms_phenolyzer" class="row">
                                    <div class="col-md-2">
                                      <v-checkbox color="primary" style="margin-top:-2px; margin-bottom:-12px;" v-model="phenolyzerTermsAdded" :value="sub"></v-checkbox>
                                    </div>
                                    <div class="col-md-10">
                                      {{ sub.value }}
                                    </div>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-expansion-panel-content>

                          </v-expansion-panel>
                        </div>
                      </div>
                      <!-- <table class="table table-hover">
                        <thead>
                          <tr>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(term, i) in phenolyzerReviewTerms" :key="i">
                            <th scope="row">
                              <v-checkbox color="primary" style="margin-top:8px; margin-bottom:-12px;" v-model="phenolyzerTermsAdded" :value="term"></v-checkbox>
                            </th>
                            <td>{{ term.DiseaseName }}</td>
                          </tr>
                        </tbody>
                      </table> -->
                    </div>
                    <div v-if="!phenolyzerReviewTerms.length && termsReviewDialogPage===2">
                      Currently unavailable.
                    </div>


                    <!-- HPO review terms table -->
                    <div v-if="HpoReviewTerms.length && termsReviewDialogPage===3">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(term, i) in HpoReviewTerms" :key="i">
                            <th scope="row">
                              <v-checkbox color="primary" style="margin-top:8px; margin-bottom:-12px;" v-model="hpoTermsAdded" :value="term"></v-checkbox>
                            </th>
                            <td>{{ term.HPO_Data }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-if="!HpoReviewTerms.length && termsReviewDialogPage===3">
                      Currently unavailable.
                    </div>



                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <!-- <v-btn small color="blue darken-1" round outline dark text @click="termsReviewDialog=false">Skip</v-btn> -->
                    <v-btn :disabled="termsReviewDialogPage===1" small color="blue darken-1" flat @click="--termsReviewDialogPage">Back</v-btn>
                    <v-btn :disabled="termsReviewDialogPage>2" small color="blue darken-1" flat @click="++termsReviewDialogPage">Next</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="termsReviewDialogPage!==3" small color="blue darken-1" flat @click="selectReviewTerms">Done</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <keep-alive>
        <SummaryTab
          v-bind:NumberOfGtrGenes="NumberOfGtrGenes"
          v-bind:NumberOfPhenolyzerGenes="NumberOfPhenolyzerGenes"
          v-bind:GtrGenesForSummary="GtrGenesForSummary"
          v-bind:searchTermGTR="searchTermGTR"
          v-bind:PhenolyzerGenesForSummary="PhenolyzerGenesForSummary"
          v-bind:onSearchPhenotype="onSearchPhenotype"
          v-bind:manuallyAddedGenes="manuallyAddedGenes"
          :chartColor="chartColor"
          v-bind:browser="browser"
          v-bind:clinGenesSummary="clinGenesSummary"
          v-bind:launchedFromClin="launchedFromClin"
          v-bind:clinPhenSelectedGenes="clinPhenSelectedGenes"
          v-bind:hpoClinPhenTerms="hpoClinPhenTerms"
          v-bind:gtrCompleteGeneList="gtrCompleteGeneList"
          v-bind:phenolyzerCompleteGeneList="phenolyzerCompleteGeneList"
          v-bind:isMobile="isMobile"
          :GtrTermsLength="GtrTermsAdded.length"
          :PhenolyzerTermsLength="phenolyzerTermsAdded.length"
          :HpoTermsLength="hpoTermsAdded.length">
        </SummaryTab>
        <!-- v-on:summaryGenesFullList="summaryGenesFullList($event)" //Deleted event -->
      </keep-alive>

      <!-- <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12>
                <v-layout row wrap>
                  <div class="col-md-12" style="padding-right:4px; padding-left:4px">
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text class="text-md-center">
                              <strong>GTR Genes: </strong>
                              <br>
                              {{selectedGtrGenes.length}} of {{gtrCompleteGeneList.length}} selected
                              <v-card class="mt-3">
                                <div v-if="!selectedGtrGenes.length">
                                  <v-card-text>
                                    No conditions searched in GTR...
                                  </v-card-text>
                                </div>
                                <div v-else>
                                  <progressCircularDonut
                                    :selectedNumber="selectedGtrGenes.length"
                                    :totalNumber="gtrCompleteGeneList.length"
                                  >
                                  </progressCircularDonut>
                                </div>
                              </v-card>
                              <br>
                              <v-card class="mb-2" v-if="gtrGenes.length">
                                <BarChartSingleEntry
                                  idValue="GtrChart"
                                  label="# of Genepanels (Top 5 genes)"
                                  :VizData="gtrGenes">
                                </BarChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card> -->

                          <!-- <v-card v-if="searchComplete" class="mt-4">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Search terms summary</strong>
                              </div>
                              <v-card class="mt-3 mb-3 pl-3 pr-3 pt-3 pb-3">
                                <DoughnutChartSingleEntry
                                  :GtrTermsLength="GtrTermsAdded.length"
                                  :PhenolyzerTermsLength="phenolyzerTermsAdded.length"
                                  :HpoTermsLength="hpoTermsAdded.length">
                                </DoughnutChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card> -->
                        <!-- </div>
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text class="text-md-center">
                              <strong>Phenolyzer Genes: </strong>
                              <br>
                              {{selectedPhenolyzerGenes.length}} of {{phenolyzerCompleteGeneList.length}} selected
                              <v-card class="mt-3">
                                <div v-if="!selectedPhenolyzerGenes.length">
                                  <v-card-text>
                                    No phenotypes searched in Phenolyzer...
                                  </v-card-text>
                                </div>
                                <div v-else>
                                  <progressCircularDonut
                                    :selectedNumber="selectedPhenolyzerGenes.length"
                                    :totalNumber="phenolyzerCompleteGeneList.length"
                                  >
                                  </progressCircularDonut>
                                </div>
                              </v-card>
                              <br>
                              <v-card class="mb-2" v-if="phenolyzerGenes.length">
                                <HorizontalBarChartSingleEntry
                                  idValue="phenolyzerChart"
                                  label="Phenolyzer score (Top 5 genes)"
                                  :VizData="phenolyzerGenes">
                                </HorizontalBarChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card>
                        </div>
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Summary Genes: </strong>
                                <br>
                                {{TotalSummarySelectedGenes}} of {{TotalSummaryGenes}} selected
                              </div>
                              <v-card class="mt-3">
                                <progressCircularDonut
                                  :selectedNumber="TotalSummarySelectedGenes"
                                  :totalNumber="TotalSummaryGenes"
                                >
                                </progressCircularDonut>
                              </v-card>
                              <br>
                              <div v-if="summaryGenes.length">
                                <v-btn small v-on:click="exportGenesCSV"><v-icon>save</v-icon>&nbsp; &nbsp;Export genes</v-btn>
                              </div>
                              <v-card >
                                <v-card-text>
                                  <v-data-table
                                    :headers="summaryGenesHeader"
                                    :items="summaryGenes"
                                    class="elevation-1"
                                    hide-actions=false
                                  >
                                    <template v-slot:items="props">
                                      <td>{{ props.item.name }}</td>
                                    </template>
                                  </v-data-table>
                                </v-card-text>
                              </v-card>
                              <div class="text-md-center mt-3">
                                <v-btn round small outline style="text-transform:none" color="primary" @click="selectComponent('summary')"> View all genes in Summary </v-btn>
                              </div>
                            </v-card-text>
                          </v-card>
                        </div> -->
<!--
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Search terms summary</strong>
                              </div>
                              <v-card class="mt-3 mb-3 pl-3 pr-3 pt-3 pb-3">
                                <DoughnutChartSingleEntry
                                  :GtrTermsLength="GtrTermsAdded.length"
                                  :PhenolyzerTermsLength="phenolyzerTermsAdded.length">
                                </DoughnutChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card>
                        </div> -->

                  <!-- </div>
                </v-layout>
          </v-flex>
        </v-layout>
      </v-container> -->
      <v-container fluid grid-list-md style="min-height:300px">
      </v-container>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import DiseaseNamesData from '../../../data/DiseaseNames.json'
import DiseaseNames from '../../../data/DiseaseNamesCleaned.json'
import progressCircularDonut from '../partials/progressCircularDonut.vue';
import Chart from 'chart.js';
import BarChartSingleEntry from '../viz/BarChartSingleEntry.vue';
import HorizontalBarChartSingleEntry from '../viz/HorizontalBarChartSingleEntry.vue';
import DoughnutChartSingleEntry from '../viz/DoughnutChartSingleEntry.vue';
import SummaryTab from './SummaryTab.vue';
import HPO_Phenotypes from '../../../data/HPO_Phenotypes';
import HPO_Terms from '../../../data/HPO_Terms';
import HpoTermsData from '../../../data/HpoTermsData';
import { Client } from 'iobio-api-client';
const api = new Client('backend.iobio.io', { secure: true });

var model = new Model();

  export default {
    components: {
      'progressCircularDonut': progressCircularDonut,
      'BarChartSingleEntry': BarChartSingleEntry,
      'HorizontalBarChartSingleEntry': HorizontalBarChartSingleEntry,
      'DoughnutChartSingleEntry': DoughnutChartSingleEntry,
      'SummaryTab': SummaryTab
    },
    props: {
      selectedGtrGenes: {
        type: Array
      },
      gtrCompleteGeneList: {
        type: Array
      },
      selectedPhenolyzerGenes: {
        type: Array
      },
      phenolyzerCompleteGeneList: {
        type: Array
      },
      NumberOfGtrGenes:{
        type: Number
      },
      NumberOfPhenolyzerGenes:{
        type:Number
      },
      GtrGenesForSummary:{
        type:Array
      },
      PhenolyzerGenesForSummary:{
        type:Array
      },
      searchTermGTR: {
        type:Array
      },
      onSearchPhenotype: {
        type: Array
      },
      manuallyAddedGenes: {
        type:Array
      },
      chartColor: null,
      isMobile: {
        type: Boolean
      },
      browser: {
        type: String
      },
      clinGenesSummary: {
        type: Array
      },
      launchedFromClin: {
        type: Boolean
      },
      clinPhenSelectedGenes: {
        type: Array
      },
      hpoClinPhenTerms: {
        type: Array
      },
    },
    data(){
      return {
        search: '',
        multipleSearchTerms: [],
        searchTermsObj: [],
        idx: 0,
        gtrFetchCompleted: false,
        phenolyzerFetchCompleted: false,
        hpoFetchCompleted: false,
        searchTermsObjHeaders: [
          {text: 'Search Term', sortable: false, value: 'DiseaseName'},
          {text: 'GTR Search status', sortable: false, value: 'gtrSearchStatus'},
          {text: 'Phenolyzer Search status', sortable: false, value: 'phenolyzerSearchStatus'},
          {text: 'HPO Search status', sortable: false, value: 'hpoSearchStatus'},
        ],
        summaryGenes: [],
        gtrGenes: [],
        phenolyzerGenes: [],
        searchStatus: false,
        summaryGenesHeader: [
          {text: 'Gene', sortable: false, value: 'name'},
        ],
        alertWarning: false,
        termsReviewDialog: false,
        termsReviewDialogPage: 0,
        generalTermsHint: [],
        gtrVizData: {},
        phenolyzerVizData: {},
        termsExpansionPanel: ['false'],
        expansionpanlExpand: ['true'],
        dropdown_tool: ['All resources', 'GTR', 'Phenolyzer'],
        dropdown_tool_value: 'All resources',
        TotalSummaryGenes: 0,
        TotalSummarySelectedGenes: 0,
        searchComplete: false,
        NewOptionFromGeneralTerm: '',
        GtrReviewTerms: [],
        phenolyzerReviewTerms: [],
        hpoLookupUrl:  "https://nv-prod.iobio.io/hpo/hot/lookup/?term=",
        GtrTermsAdded: [],
        phenolyzerTermsAdded: [],
        loadingDialog: false,
        inputVal: '',
        textNotes: '',
        JaroWinkler: [],
        fuzzyResults: [],
        HPO_Phenotypes_data: null,
        HPO_Terms_data: null,
        HpoTermsTypeaheadData: null,
        HpoReviewTerms: [],
        hpoTermsAdded: [],
        extractedTerms: [],
        extractedTermsObj: [],
        Gtr_searchTermsObj: [],
        Phenolyzer_searchTermsObj: [],
        Hpo_searchTermsObj: [],
        Gtr_idx: 0,
        Phenolyzer_idx: 0,
        Hpo_idx: 0,
        searchStatusDialog: false,
        gtrExpansionPanel: ['true'],
        gtrExpansionPanelMultiple: [],
        phenolyzerExpansionPanel: ['true'],
      }
    },
    mounted(){
      this.HPO_Terms_data = HPO_Terms;
      this.HPO_Phenotypes_data = HPO_Phenotypes;
      this.HpoTermsTypeaheadData  = HpoTermsData.data;
      bus.$on("newAnalysis", ()=>{
        this.multipleSearchTerms = [];
        this.searchTermsObj = [];
        this.idx = 0;
        this.gtrFetchCompleted = false;
        this.phenolyzerFetchCompleted = false;
        this.summaryGenes = [];
        this.gtrGenes = [];
        this.phenolyzerGenes = [];
        this.searchStatus = false;
        this.alertWarning = false;
        this.generalTermsHint = [];
        this.gtrVizData = {};
        this.phenolyzerVizData = {};
        this.expansionpanlExpand = ['true'];
        this.expansionpanlExpand = ['true'];
        this.dropdown_tool = ['All resources', 'GTR', 'Phenolyzer'];
        this.dropdown_tool_value = 'All resources',
        this.TotalSummaryGenes = 0;
        this.TotalSummarySelectedGenes = 0;
        this.searchComplete = false;
        this.NewOptionFromGeneralTerm = ''

      })
      bus.$on("completeFetchRequest", (component)=>{
        if(component === "GTR"){
          this.searchTermsObj[this.idx].gtrSearchStatus = "Completed";
          this.gtrFetchCompleted = true;
          this.Gtr_searchTermsObj[this.Gtr_idx].gtrSearchStatus = "Completed";
          this.Gtr_idx = this.Gtr_idx + 1;
          if(this.Gtr_idx < this.Gtr_searchTermsObj.length){
            setTimeout(()=>{
              this.Gtr_performSearchEvent();
            },1000)
          }
          else { this.checkToCloseSearchStatusDialog(); }
        }
        else if(component === "Phenolyzer"){
          console.log("Phenolyzer completed!");
          this.searchTermsObj[this.idx].phenolyzerSearchStatus = "Completed";
          this.phenolyzerFetchCompleted = true;
          this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx].phenolyzerSearchStatus = "Completed";
          this.Phenolyzer_idx = this.Phenolyzer_idx + 1;
          if(this.Phenolyzer_idx < this.Phenolyzer_searchTermsObj.length){
            setTimeout(()=>{
              this.Phenolyzer_performSearchEvent();
            },1000)
          }
          else { this.checkToCloseSearchStatusDialog(); }
        }
        else if(component === "hpo"){
          this.searchTermsObj[this.idx].hpoSearchStatus = "Completed";
          this.hpoFetchCompleted = true;
          this.Hpo_searchTermsObj[this.Hpo_idx].hpoSearchStatus = "Completed";
          this.Hpo_idx = this.Hpo_idx + 1;
          if(this.Hpo_idx < this.Hpo_searchTermsObj.length){
            setTimeout(()=>{
              this.Hpo_performSearchEvent();
            },1000)
          }
          else { this.checkToCloseSearchStatusDialog(); }
        }
        else if(component === "noGenePanels"){
          // console.log("here")
          this.searchTermsObj[this.idx].gtrSearchStatus = "NoGenes"
          this.gtrFetchCompleted = true;
        }
        else if(component === "noPhenolyzerGenes"){
          // console.log("Phenolyzer completed!");
          this.searchTermsObj[this.idx].phenolyzerSearchStatus = "NoGenes"
          this.phenolyzerFetchCompleted = true;
        }
        else if(component === "skipGtr"){
          // this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "NotAvailable");
          this.searchTermsObj[this.idx].gtrSearchStatus = "NotAvailable"
          this.gtrFetchCompleted = true;
        }
        // console.log("searchTermsObj", this.searchTermsObj)
        // if(this.gtrFetchCompleted && this.phenolyzerFetchCompleted && this.hpoFetchCompleted){
        //   this.searchTermsObj[this.idx].status = "Completed";
        //   this.idx = this.idx + 1;
        //   if(this.idx < this.multipleSearchTerms.length){
        //     setTimeout(()=>{
        //       this.performSearchEvent();
        //     },5000)
        //   }
        //   else {
        //     this.summaryGenes = this.getSummaryGenes.slice(0,12) // Gets data from store
        //     this.expansionpanlExpand = [];
        //     this.searchComplete = true;
        //   }
        // }
      })

      bus.$on("handleGeneralTermsInSingleEntry", (diseases)=>{
        this.alertWarning = true;
        this.generalTermsHint = diseases;
      })

      bus.$on("TotalGenesInSummary", (genes)=>{
        this.TotalSummaryGenes = genes;
      })

      bus.$on("TotalSelectedGenesInSummary", (genes) =>{
        this.TotalSummarySelectedGenes = genes;
      })
    },
    updated(){
    },
    watch: {
      textNotes(){
        console.log("this.textNotes", this.textNotes.length)
        if(this.textNotes.length===45){
          setTimeout(()=>{
            this.$refs.single_entry_input_textarea.focus();
          },10)
        }
        else if(this.textNotes.length===44){
          setTimeout(()=>{
            this.$refs.single_entry_input.focus();
          },10)
        }
      },
      GtrTermsAdded(){
        console.log("GtrTermsAdded", this.GtrTermsAdded)
        if(this.GtrTermsAdded.length > 5){
          alert("max limit reached for GTR");
          this.GtrTermsAdded.pop();
        }

      },
      searchTermsObj(){
      },
      getGtrGenes(){
        this.gtrGenes = this.getGtrGenes.slice(0, 5);
        var geneNames = [];
        var genepanelCounts = [];
        this.gtrGenes.map(gene => {
          geneNames.push(gene.name);
          genepanelCounts.push(gene.value)
        })
        this.gtrVizData.geneNames = geneNames;
        this.gtrVizData.genepanelCounts = genepanelCounts;
      },
      getPhenolyzerGenes(){
        console.log(":getPhenolyzerGenes: ", this.getPhenolyzerGenes)
        // var sortedGenes = this.sortOrder(this.getPhenolyzerGenes);
        //
        // this.phenolyzerGenes = sortedGenes.slice(0,5);
        this.phenolyzerGenes = this.getPhenolyzerGenes.slice(0,5);
        console.log("this.phenolyzerGenes", this.phenolyzerGenes)
        this.$set(this.phenolyzerVizData, 'geneNames', [])
        this.$set(this.phenolyzerVizData, 'genepanelCounts', [])

        var geneNames = [];
        var genepanelCounts = [];
        this.phenolyzerGenes.map(gene => {
          geneNames.push(gene.geneName);
          genepanelCounts.push(gene.score)
        })
        this.$set(this.phenolyzerVizData, 'geneNames', geneNames)
        this.$set(this.phenolyzerVizData, 'genepanelCounts', genepanelCounts)

        // this.phenolyzerVizData.geneNames = geneNames;
        // this.phenolyzerVizData.genepanelCounts = genepanelCounts;
        // console.log("phenolyzerVizData", this.phenolyzerVizData)
      },
      getSummaryGenes(){
        console.log("changing!!")
        this.summaryGenes = this.getSummaryGenes.slice(0,12) // Gets data from store
      },
      phenolyzerVizData(){
        console.log("phenolyzerVizData is changing")
      }
    },
    methods:{
      setPhenolyzerTerms(str){
        return fetch(`https://nv-prod.iobio.io/hpo/hot/lookup/?term=${str}`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              return data
            })
      },
      extract(){
        if(this.textNotes.length<45 && this.search === undefined){
          alert("Please select from typeahaead");
        }
        else if(this.textNotes.length<45 && this.search!==undefined){
          this.mouseSelect()
        }
        else {
          this.JaroWinkler = [];
          this.fuzzyResults = [];
          this.loadingDialog = true;
          // fetch(`http://localhost:4047/phenotype-extractor/?notes=${this.textNotes}`)
          fetch(`http://nv-dev-new.iobio.io/phenotype-extractor/?notes=${this.textNotes}`)
            .then(res => res.json())
            .then(data => {
              this.JaroWinkler = data.JaroWinkler;
              this.fuzzyResults = data.fuzzyResults ;
              data.JaroWinkler.map(x=>{
                x = x.trim();
                if(!this.extractedTerms.includes(x)){
                  this.extractedTerms.push(x);
                }
              })
              data.fuzzyResults.map(x=>{
                x = x.trim()
                if(!this.extractedTerms.includes(x)){
                  this.extractedTerms.push(x);
                }
              })
              console.log(this.extractedTerms);

              // If fine tuning of phenotypes required:
              // var phenotypeTerms = [];
              // var promises = [];
              // this.extractedTerms.map(x => {
              //   var str = x.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase();
              //   str = str.replace("disease", "");
              //   str = str.replace("syndrome", "");
              //   str = str.trim();
              //   var data = this.setPhenolyzerTerms(str);
              //   data.then(res => {
              //     console.log("res", res)
              //     phenotypeTerms = [...phenotypeTerms, ...res];
              //     console.log("phenotypeTerms", phenotypeTerms)
              //   })
              // })

              this.extractedTerms.map(x => {
                var str = x.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase();
                str = str.replace("disease", "");
                str = str.replace("syndrome", "");
                str = str.replace("disorder", "");
                str = str.trim();
                this.phenolyzerReviewTerms.push({
                  id: str,
                  value: str,
                  label: str
                })
              })
              console.log("this.phenolyzerReviewTerms", this.phenolyzerReviewTerms)

              this.fetchHpoTerm();

              this.extractedTerms.map(x=>{
                this.extractedTermsObj.push({
                  DiseaseName: x,
                })
              })
              this.loadingDialog = false;
              this.openReviewDialogForExtractedTerms();
            })
        }
      },
      mouseSelect(){
        if(this.search!==undefined){
          this.loadingDialog = true;
          // this.checkBeforeAddTerm();
          setTimeout(()=>{
            // this.checkBeforeAddTerm();
            this.openReviewDialog();
          }, 1000)
        }
      },
      EnterForSearch(){
        if(event.key === 'Enter') {
          setTimeout(()=>{
            // this.checkBeforeAddTerm();
            this.openReviewDialog();
          }, 1000)
        }
      },
      openReviewDialogForExtractedTerms(){
        this.GtrReviewTerms = this.extractedTermsObj;
        this.GtrReviewTerms.map(item => {
          item.reviewTerms_gtr = [];

          var term = item.DiseaseName.toLowerCase();
          term = term.replace("disease", "");
          term = term.replace("syndrome", "");
          term = term.trim();
          DiseaseNamesData.data.forEach(x => {
            if(x.DiseaseName.toLowerCase().includes(term)){
              // this.GtrReviewTerms.push(x);
              if(x.DiseaseName !== item.DiseaseName){
                item.reviewTerms_gtr.push(x)
              }
              else if(x.DiseaseName === item.DiseaseName){
                item.reviewTerms_gtr.unshift(x);
              }
            }
          })
        })
        // this.gtrExpansionPanelMultiple = Array(this.GtrReviewTerms.length).fill('true');
        console.log("this.GtrReviewTerms", this.GtrReviewTerms)
        setTimeout(()=>{
            this.termsReviewDialog = true;
            this.termsReviewDialogPage = 1;
            this.loadingDialog = false;
        },500)

      },
      fetchHpoTerm(){
        const cmd = api.clinphen({ notes: `${this.textNotes}`});
        cmd.then((data) => {
          this.parseTerms(data);
        });
      },
      parseTerms(res){
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
                sentence:sentence,
                HPO_Data: `${phenotype} - [ ${hpoNumber} ]`
              }
            )
          }
        })
        hpoTermArr.shift();
        terms.shift();
        console.log("hpoTermArr", hpoTermArr)
        this.HpoReviewTerms = hpoTermArr;
      },
      openReviewDialog(){
        this.textNotes = this.search.DiseaseName;
        this.GtrReviewTerms = [];
        this.termsExpansionPanel = ['true'];

        this.GtrReviewTerms.push(this.search);
        this.GtrReviewTerms[0].reviewTerms_gtr = []

        var term = this.search.DiseaseName.toLowerCase();
        term = term.replace("disease", "");
        term = term.replace("syndrome", "");
        term = term.trim();
        DiseaseNamesData.data.forEach(x => {
          if(x.DiseaseName.toLowerCase().includes(term)){
            if(x.DiseaseName !== this.search.DiseaseName){
              this.search.reviewTerms_gtr.push(x)
            }
            else if(x.DiseaseName === this.search.DiseaseName){
              this.search.reviewTerms_gtr.unshift(x)
            }
          }
        })

        this.phenolyzerReviewTerms = [];
        this.phenolyzerReviewTerms.push(this.search);
        this.phenolyzerReviewTerms[0].reviewTerms_phenolyzer = []

        var str = this.search.DiseaseName.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase();
        str = str.replace("disease", "");
        str = str.replace("syndrome", "");
        // str = str.replace("disorder", "");
        str = str.trim();

        var data = this.setPhenolyzerTerms(str);
        data.then(res => {
          // this.phenolyzerReviewTerms = res;
          res.forEach(x => {
            if(x.value.toLowerCase().trim() !== this.search.DiseaseName.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase().trim()) {
              this.phenolyzerReviewTerms[0].reviewTerms_phenolyzer.push(x);
            }
            else if(x.value.toLowerCase().trim() === this.search.DiseaseName.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase().trim()) {
              this.phenolyzerReviewTerms[0].reviewTerms_phenolyzer.unshift(x);
            }
          })

        })

        this.HpoTermsTypeaheadData.forEach(x => {
          if(x.HPO_Data.toLowerCase().includes(str)){
            this.HpoReviewTerms.push(x);
          }
        })

        console.log("HpoReviewTerms", this.HpoReviewTerms)

      setTimeout(()=>{
          this.termsReviewDialog = true;
          this.termsReviewDialogPage = 1;
          this.loadingDialog = false;
      },500)

      },
      closeReviewDialog(){
        this.termsReviewDialog=false;
        this.termsReviewDialogPage = 0;
      },
      remove(item){
        var idxOf = this.multipleSearchTerms.indexOf(item);
        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.searchTermsObj.splice(idxOf, 1)
        this.searchTermsObj = [...this.searchTermsObj];
      },
      sortOrder(arr){
        arr.sort(function(a,b){
          if (a.score===b.score){
             return (b.score-a.score);
          } else if(a.score<b.score){
             return 1;
          } else if(a.score>b.score){
             return -1;
          }
         })
         return arr;
      },
      exportGenesCSV: function(){
        bus.$emit("exportSummaryGenesAsCSV")
      },
      selectComponent(component){
        if(component==='gtr'){
          bus.$emit('openGtrComponent');
        }
        else if(component==='phenolyzer'){
          bus.$emit('openPhenolyzer')
        }
        else if(component==='clinphen'){
          bus.$emit('openClinphen')
        }
        else if(component==='summary'){
          bus.$emit('openSummary')
        }
      },
      checkBeforeAddTerm(){
        this.addTerm();
      },
      Gtr_performSearchEvent(){
        if(this.Gtr_searchTermsObj.length){
          this.searchStatus = true;
          this.searchComplete = false;
          this.expansionpanlExpand = ['true'];

          this.gtrFetchCompleted = false;
          this.$set(this.Gtr_searchTermsObj[this.Gtr_idx], 'status', "Searching");
          this.$set(this.Gtr_searchTermsObj[this.Gtr_idx], 'gtrSearchStatus', "Searching");
          this.$set(this.Gtr_searchTermsObj[this.Gtr_idx], 'phenolyzerSearchStatus', "NotAvailable");
          this.$set(this.Gtr_searchTermsObj[this.Gtr_idx], 'hpoSearchStatus', "NotAvailable");
          // this.phenolyzerFetchCompleted = true;
          // this.hpoFetchCompleted = true;
          bus.$emit("singleTermSearchGTR", this.Gtr_searchTermsObj[this.Gtr_idx]);
        }
        else { this.gtrFetchCompleted = true; }

      },
      Phenolyzer_performSearchEvent(){
        if(this.Phenolyzer_searchTermsObj.length){
          this.searchStatus = true;
          this.searchComplete = false;
          this.expansionpanlExpand = ['true'];

          var str = this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx].value.replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
          this.phenolyzerFetchCompleted = false;
          this.$set(this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx], 'status', "Searching");
          this.$set(this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx], 'gtrSearchStatus', "NotAvailable");
          this.$set(this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx], 'phenolyzerSearchStatus', "Searching");
          this.$set(this.Phenolyzer_searchTermsObj[this.Phenolyzer_idx], 'hpoSearchStatus', "NotAvailable");
          // this.gtrFetchCompleted = true;
          // this.hpoFetchCompleted = true;
          bus.$emit("singleTermSearchPhenolyzer", str);

        }
        else { this.phenolyzerFetchCompleted = true; }
      },
      Hpo_performSearchEvent(){
        if(this.Hpo_searchTermsObj.length){
          this.searchStatus = true;
          this.searchComplete = false;
          this.expansionpanlExpand = ['true'];

          this.hpoFetchCompleted = false;
          this.$set(this.Hpo_searchTermsObj[this.Hpo_idx], 'status', "Searching");
          this.$set(this.Hpo_searchTermsObj[this.Hpo_idx], 'gtrSearchStatus', "NotAvailable");
          this.$set(this.Hpo_searchTermsObj[this.Hpo_idx], 'phenolyzerSearchStatus', "NotAvailable");
          this.$set(this.Hpo_searchTermsObj[this.Hpo_idx], 'hpoSearchStatus', "Searching");
          // this.gtrFetchCompleted = true;
          // this.phenolyzerFetchCompleted = true;
          bus.$emit("singleTermSearchHPO", this.Hpo_searchTermsObj[this.Hpo_idx]);

        }
        else { this.hpoFetchCompleted = true; }

      },
      performSearchEvent(){
        this.Gtr_performSearchEvent();
        this.Phenolyzer_performSearchEvent();
        this.Hpo_performSearchEvent();
        this.searchStatusDialog = true;
        // this.searchStatus = true;
        // this.searchComplete = false;
        // this.expansionpanlExpand = ['true'];
        // // var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
        //
        // if(this.searchTermsObj[this.idx].tool_to_search === "All resources"){
        //   this.gtrFetchCompleted = false;
        //   this.phenolyzerFetchCompleted = false;
        //   this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'hpoSearchStatus', "Searching");
        //   var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
        //   bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        //   bus.$emit("singleTermSearchPhenolyzer", str);
        // }
        // else if(this.searchTermsObj[this.idx].tool_to_search === "GTR"){
        //   this.gtrFetchCompleted = false;
        //   this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "NotAvailable");
        //   this.$set(this.searchTermsObj[this.idx], 'hpoSearchStatus', "NotAvailable");
        //   this.phenolyzerFetchCompleted = true;
        //   this.hpoFetchCompleted = true;
        //   bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        // }
        // else if(this.searchTermsObj[this.idx].tool_to_search === "Phenolyzer"){
        //   var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
        //   this.phenolyzerFetchCompleted = false;
        //   this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "NotAvailable");
        //   this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'hpoSearchStatus', "NotAvailable");
        //   this.gtrFetchCompleted = true;
        //   this.hpoFetchCompleted = true;
        //   bus.$emit("singleTermSearchPhenolyzer", str);
        // }
        // else if(this.searchTermsObj[this.idx].tool_to_search === "Hpo"){
        //   this.hpoFetchCompleted = false;
        //   this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        //   this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "NotAvailable");
        //   this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "NotAvailable");
        //   this.$set(this.searchTermsObj[this.idx], 'hpoSearchStatus', "Searching");
        //   this.gtrFetchCompleted = true;
        //   this.phenolyzerFetchCompleted = true;
        //   bus.$emit("singleTermSearchHPO", this.searchTermsObj[this.idx]);
        // }

      },
      addTerm(){
        var searchTerm ="";
        var conceptId = ""
        searchTerm = this.search.DiseaseName;
        conceptId = this.search.ConceptID;
        this.$set(this.search, 'status', "Not started");
        this.$set(this.search, 'gtrSearchStatus', "Not started");
        this.$set(this.search, 'phenolyzerSearchStatus', "Not started");
        this.$set(this.search, 'tool_to_search', this.dropdown_tool_value);
        if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
          if(searchTerm.length>1){
            this.multipleSearchTerms.push(searchTerm);
            this.searchTermsObj.push(this.search);
            this.search = '';
          }
        }
      },
      selectGtrTerm(term){
        if(this.GtrTermsAdded.length>=4){
          alert("Max terms added in Gtr")
        }
        else {
          var searchTerm ="";
          var conceptId = ""
          searchTerm = term.DiseaseName;
          conceptId = term.ConceptID;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'GTR');

          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
              this.GtrTermsAdded.push(searchTerm);
              this.search = '';
            }
          }
        }
      },
      selectPhenolyzerTerm(term){
        var searchTerm ="";
        searchTerm = term.value;
        this.$set(term, 'status', "Not started");
        this.$set(term, 'gtrSearchStatus', "Not started");
        this.$set(term, 'phenolyzerSearchStatus', "Not started");
        this.$set(term, 'tool_to_search', 'Phenolyzer');
        this.$set(term, 'DiseaseName', term.value);
        if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
          if(searchTerm.length>1){
            this.multipleSearchTerms.push(searchTerm);
            this.searchTermsObj.push(term);
            this.phenolyzerTermsAdded.push(searchTerm);
            this.search = '';
          }
        }
      },
      selectReviewTerms(){

        this.GtrTermsAdded.map(term=>{
          var searchTerm ="";
          var conceptId = ""
          searchTerm = term.DiseaseName;
          conceptId = term.ConceptID;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'hpoSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'GTR');

          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
              this.Gtr_searchTermsObj.push(term);
            }
          }
        })

        this.phenolyzerTermsAdded.map(term => {
          var searchTerm ="";
          searchTerm = term.value;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'hpoSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'Phenolyzer');
          this.$set(term, 'DiseaseName', term.value);
          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
              this.Phenolyzer_searchTermsObj.push(term);
            }
          }
        })

        this.hpoTermsAdded.map(term => {
          var searchTerm ="";
          searchTerm = term.HPO_Data;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'hpoSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'Hpo');
          this.$set(term, 'DiseaseName', term.HPO_Data);

          var res = searchTerm.split(" - ");
          var hpoId = res[1].replace(/[\])}[{(]/g, '').trim();
          var phenoTerm = res[0];
          term.hpoNumber = hpoId;
          term.phenotype = phenoTerm;


          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
              this.Hpo_searchTermsObj.push(term);
            }
          }
        })

        this.termsReviewDialog = false;
        this.search = '';
        this.textNotes = '';
        this.termsReviewDialogPage = 0;
        if(this.hpoTermsAdded.length || this.GtrTermsAdded.length || this.phenolyzerTermsAdded.length){
          this.performSearchEvent();
        }
      },
      selectNewTerm(hint){
        this.NewOptionFromGeneralTerm = hint.Title;
        this.searchTermsObj[this.idx].DiseaseName = hint.Title;
        this.searchTermsObj[this.idx].ConceptID = hint.ConceptId;
      },
      setInputValueFromHint(){
        // this.searchTermsObj[this.idx].DiseaseName = hint.Title;
        // this.searchTermsObj[this.idx].ConceptID = hint.ConceptId;
        bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        this.alertWarning = false;
        this.NewOptionFromGeneralTerm = '';
      },
      skipGtrSearch(){
        this.alertWarning = false;
        bus.$emit("completeFetchRequest", "skipGtr")
      },
      checkToCloseSearchStatusDialog(){
        if(this.gtrFetchCompleted && this.phenolyzerFetchCompleted && this.hpoFetchCompleted){
          setTimeout(()=>{
            this.searchStatusDialog = false;
          }, 2000)
        }
      },
      remove(item, idx, component){
        if(component === 'GTR'){
          bus.$emit("removeGtrTerm", item.DiseaseName)
          this.GtrTermsAdded.splice(idx, 1)
          this.GtrTermsAdded = [...this.GtrTermsAdded];
        }
        else if(component === 'phenolyzer'){
          bus.$emit("removePhenolyzerTerm", item.value)
          this.phenolyzerTermsAdded.splice(idx, 1)
          this.phenolyzerTermsAdded = [...this.phenolyzerTermsAdded];
        }
        else if(component === 'HPO'){
          bus.$emit("removeHpoTerm", item)
          this.hpoTermsAdded.splice(idx, 1)
          this.hpoTermsAdded = [...this.hpoTermsAdded];
        }
      }
    },
    computed: {
      ...mapGetters(['getSummaryGenes', 'getGtrGenes', 'getPhenolyzerGenes']),
      DiseaseNames: function() {
        return DiseaseNames.data.sort(function(a,b) {
          if (a.DiseaseName < b.DiseaseName) {
            return -1;
          } else if (a.DiseaseName > b.DiseaseName) {
            return 1;
          } else {
            return 0;
          }
        });
      },
    }
  }

</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import ../assets/sass/variables
.form-control
  font-size: 15px

#single_entry_input
  width: 600px
  height: 49px
  margin-top: 7px
  // background-color: $search-box-color
  // border-bottom-color: #949494
  // border-right-color: #e9e9e9
  // border-top-color: #e9e9e9
  // border-left-color: #e9e9e9
  border: 0
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  border-radius: 0
  font-size: 16px
  // border-color: #e9e9e9

#single_entry_input_textarea
  width: 600px
  margin-top: 7px
  // // background-color: $search-box-color
  // border-bottom-color: #949494
  // border-right-color: #e9e9e9
  // border-top-color: #e9e9e9
  // border-left-color: #e9e9e9

@media screen and (max-width: 1620px)
  #single_entry_input
    // width: 420px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 1050px)
  #single_entry_input
    // width: 450px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 950px)
  #single_entry_input
    // width: 290px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 700px)
  #single_entry_input
    // width: 300px
    height: 40px
    margin-top: 4px
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

.v-progress-circular
  margin: 1rem

.review-table
  display: block
  height: 300px
  overflow-y: scroll
</style>
