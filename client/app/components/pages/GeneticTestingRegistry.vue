<template>
  <div>
    <div style="background-color:#f9fbff">
      <!-- <v-app id="inspire" style="background-color:#f9fbff"> -->
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
        <!-- <button v-on:click="scrollToTop" v-if="GoToTop" id="GoToTopBtn">Top</button> -->
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-20px;">
            <v-flex d-flex xs12>
              <v-card>
                <v-card-text style="margin-bottom:-5px">
                  <h3>Genetic Testing Registry</h3>

                  <!-- <span><strong style="font-size:24.5px font-width:400">GENETIC TESTING REGISTRY</strong></span> -->
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg8>
                      <DisorderSearch
                        v-bind:DisordersPropsBackArr="DisordersPropsBackArr"
                        v-on:showDiseases="addDiseases($event)"
                        v-on:multipleSearchData="multipleSearchData($event)"
                        @search-gtr="onSearchGTR">
                      </DisorderSearch>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg4 >
                      <div style="display:inline-block; padding-top:5px;">
                        <label>Genes</label>
                        <input
                          :disabled="geneProps.length<1"
                          id="top-genes-input"
                          class="form-control"
                          type="text"
                          v-model="NumberOfTopGenes"
                          autocomplete="off"
                          list="genes"
                          placeholder="50">
                          <datalist id="genes">
                            <option v-for="genesCount in genesTopCounts">
                              {{ genesCount }}
                            </option>
                          </datalist>
                      </div>

                      <v-btn
                          :disabled="geneProps.length<1"
                          style="margin-top:-0.35px; text-transform: none"
                          class="btnColor"
                          v-on:click.prevent="selectNumberOfTopGenes">
                        Select
                      </v-btn>
                      <br> <br>
                      <div v-if="diseases.length && modeOfInheritanceProps.length > 0 ">
                        <label>Panels Selection</label>
                        <!-- <span v-if="!editPanelDefinition" style="cursor:pointer" v-on:click="editPanelDefinition=true"><v-icon>settings</v-icon>  &nbsp; Edit definition <br></span> -->
                        <v-tooltip bottom v-if="!editPanelDefinition">
                          <span style="cursor:pointer" v-on:click="editPanelDefinition=true" slot="activator"><v-icon>settings</v-icon> </span>
                          <span>Edit Panels Definition</span>
                        </v-tooltip>

                        <span>
                          <v-dialog v-model="editPanelDefinition" persistent max-width="400">
                            <v-card>
                              <v-card-title class="headline">Edit Panels Definition</v-card-title>
                              <v-divider style="margin-top:-4px"></v-divider>
                              <Alerts
                                v-if="panelsAlert"
                                alertType="warning"
                                alertTransition="scale-transition"
                                :alertText="panelAlertText"
                              >
                              </Alerts>
                              <v-card-text style="margin-left:20px">
                                <v-layout row>
                                  <v-flex xs4>
                                    <strong>Lower limit:</strong>
                                  </v-flex>
                                  <v-flex xs3>
                                    <input type="number" onkeydown="javascript: return event.keyCode !== 69"  v-model="lowerLimitInput" class="form-control">
                                </v-flex>
                                <v-flex xs5>
                                </v-flex>
                              </v-layout>
                              <br>
                                <v-layout row>
                                  <v-flex xs4>
                                    <strong>Upper limit:</strong>
                                  </v-flex>
                                  <v-flex xs3>
                                    <input type="number" onkeydown="javascript: return event.keyCode !== 69"  v-model="upperLimitInput" class="form-control">
                                </v-flex>
                                <v-flex xs5>
                                </v-flex>
                              </v-layout>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" dark  @click.native="ChangePanelsDefinition">Save</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="closePanelsDefinitionEdit">Cancel</v-btn>
                              </v-card-actions>
                              <br>
                            </v-card>
                          </v-dialog>
                        </span>

                        <v-layout v-on:click="clickedTopPanelFilters" style="margin-top:-12px">
                          <v-flex xs4>
                            <v-tooltip bottom>
                              <v-checkbox slot="activator" v-model="selectedPanelFilters" color="green" label="Specific" value="specific"></v-checkbox>
                              <span>
                                <center><i>Less than {{ lowerLimitProps}} genes</i></center>
                              </span>
                            </v-tooltip>
                          </v-flex>
                          <v-flex xs4>
                            <v-tooltip bottom>
                              <v-checkbox slot="activator" v-model="selectedPanelFilters" color="amber accent-4" label="Moderate" value="moderate"></v-checkbox>
                                <span>
                                  <center><i>More than {{ lowerLimitProps}} genes & Less than {{ upperLimitProps }} genes</i></center>
                                </span>
                            </v-tooltip>
                          </v-flex>
                          <v-flex x4>
                            <v-tooltip bottom>
                              <v-checkbox slot="activator" v-model="selectedPanelFilters" color="red" label="General" value="general"></v-checkbox>
                              <span>
                                <center><i>More than {{ upperLimitProps}} genes</i></center>
                              </span>
                            </v-tooltip>
                          </v-flex>
                        </v-layout>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 >
              <v-card >
                <div v-if="!disordersSearchedByUser">
                  <v-card-title>
                      <h3>{{ IntroductionTextData.Title }}</h3>
                  </v-card-title>
                  <v-card-text v-html="IntroductionTextData.Content"></v-card-text>
                </div>
              </v-card>

            </v-flex>

            <v-flex d-flex xs12  >
                  <v-layout row wrap>

                    <v-flex  xs8 >
                      <v-card>
                        <show-gene-panel1
                        v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length && multipleSearchItems.length"
                          v-bind:GeneData="geneProps"
                          v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                          v-on:UpdateSelectedGenesText="ChangeSelectedGenesText($event)"
                          v-on:NoOfGenesSelectedFromGTR="UpdateNoOfGenesSelectedFromGTR($event)"
                          v-on:TotalNoOfGenesFromGTR="TotalNoOfGenesFromGTR($event)"
                          v-on:SelectedGenesToCopy="UpdateListOfSelectedGenes($event)"
                          v-bind:multipleSearchItems="multipleSearchItems"
                          v-bind:geneSearch="geneSearch"
                          v-bind:associatedGenes="associatedGenes">
                        </show-gene-panel1>
                        <div v-if="geneProps.length===0 && modeOfInheritanceProps.length && multipleSearchItems.length">
                          <NoGenesDisplayTable></NoGenesDisplayTable>
                        </div>
                      </v-card>
                    </v-flex>


                   <v-flex xs4 class="pr-2 pl-2" >

                     <div class="d-flex mb-2 xs12 mb-3">
                       <v-card v-if="geneProps.length">
                        <v-card-title primary-title>
                          <v-text-field
                            append-icon="search"
                            label="Search Genes"
                            single-line
                            hide-details
                            v-model="geneSearch"
                          ></v-text-field>
                        </v-card-title>
                        <br>
                       </v-card>
                       <v-card v-else-if="geneProps.length===0 && modeOfInheritanceProps.length && multipleSearchItems.length">
                        <v-card-title primary-title>
                          <v-text-field
                            append-icon="search"
                            label="Search Genes"
                            single-line
                            hide-details
                          ></v-text-field>
                        </v-card-title>
                        <br>
                       </v-card>
                     </div>

                     <div id="activeFilterCard" >
                     </div>

                     <div class="d-flex mb-2 xs12 mb-3">
                       <v-card v-bind:class="[chartComponent===null || chartComponent==='PanelFilters' || chartComponent==='PanelsDefinition' ? 'activeCardBox elevation-5' : 'rightbarCard ']" v-if="geneProps.length">
                         <v-card-text>
                           <center>
                             <span class="Rightbar_CardHeading">
                             GENES
                             </span>
                             <Dialogs
                               id="genesDialog"
                               class="dialogBox"
                               :HeadlineText="HelpDialogsData[0].HeadlineText"
                               :ContentText="HelpDialogsData[0].Content">
                             </Dialogs>

                           <v-divider class="Rightbar_card_divider"></v-divider>
                           <span class="Rightbar_card_content_subheading">
                             <strong class="Rightbar_card_content_heading">{{ GtrGenesTabNumber }}</strong> of {{ TotalGtrGenes }} genes selected
                           </span>
                           </center>
                           <SvgBar
                            class="SvgBarClass"
                            id="genesSvgBox"
                            :selectedNumber="GtrGenesTabNumber"
                            :totalNumber="TotalGtrGenes">
                           </SvgBar>
                         </v-card-text>
                       </v-card>


                       <v-card v-bind:class="[chartComponent===null ? 'activeCardBox elevation-5' : 'rightbarCard ']" v-else-if="geneProps.length===0 && modeOfInheritanceProps.length && multipleSearchItems.length">
                         <v-card-text>
                           <center>
                             <span class="Rightbar_CardHeading">
                             GENES
                             </span>
                             <Dialogs
                               id="genesDialog"
                               class="dialogBox"
                               :HeadlineText="HelpDialogsData[0].HeadlineText"
                               :ContentText="HelpDialogsData[0].Content">
                             </Dialogs>

                           <v-divider class="Rightbar_card_divider"></v-divider>
                           <span class="Rightbar_card_content_subheading">
                             <strong class="Rightbar_card_content_heading">0</strong> of 0 selected
                           </span>
                           </center>
                         </v-card-text>
                       </v-card>
                     </div>

                <div  id="inActiveDisordersAndModesFilterCard">
                  <div id="activeDisordersAndModesFilterCard" class="mb-3">
                    <v-layout wrap>
                    <v-flex xs12>
                    <div v-if="diseases.length && modeOfInheritanceProps.length > 0 ">
                      <v-card v-bind:class="[chartComponent==='disorders' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                        <v-card-text>
                          <center>
                            <span class="Rightbar_CardHeading" style="font-size:14px">
                              ASSOCIATED DISORDERS & MODES OF INHERITANCE
                            </span>
                            <Dialogs
                              id="disordersDialog"
                              class="dialogBox"
                              :HeadlineText="HelpDialogsData[2].HeadlineText"
                              :ContentText="HelpDialogsData[2].Content">
                            </Dialogs>
                            <v-divider class="Rightbar_card_divider"></v-divider>

                           <div v-bind:class="[chartComponent==='disorders' ? 'disabledClass' : 'activeClass']">
                             <span class="Rightbar_card_content_subheading">
                               <strong class="Rightbar_card_content_heading">{{ selectDisorders.length }}</strong> of {{ multiSelectDisorder.length }} disorders selected
                             </span>
                             <SvgBar
                              class="SvgBarClass"
                              id="disordersSvgBox"
                              :selectedNumber="selectDisorders.length"
                              :totalNumber="multiSelectDisorder.length">
                             </SvgBar>
                             <br>
                             <span class="Rightbar_card_content_subheading">
                               <strong class="Rightbar_card_content_heading">{{ selectedModesOfInheritance.length }}</strong> of {{ modeOfInheritanceProps.length }} modes of inheritance selected
                             </span>
                             <SvgBar
                              class="SvgBarClass"
                              id="ModesOfInheritanceSvgBox"
                              :selectedNumber="selectedModesOfInheritance.length"
                              :totalNumber="modeOfInheritanceProps.length">
                             </SvgBar>
                             <br>
                             <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('disorders')">
                               View & Filter
                             </v-btn>
                         </div>
                       </center>
                        </v-card-text>
                      <div v-bind:class="[chartComponent==='disorders' ? 'activeClass' : 'disabledClass']">
                          <v-card flat >
                            <v-card-text style="margin-left:5px" v-on:click="DisordersAndModesComponent='disorders'">
                              <center>
                                <span class="Rightbar_card_content_subheading">
                                  <strong class="Rightbar_card_content_heading">{{ selectDisorders.length }}</strong> of {{ multiSelectDisorder.length }} disorders selected
                                </span>
                                <SvgBar
                                 class="SvgBarClass"
                                 id="disordersSvgBoxInside"
                                 :selectedNumber="selectDisorders.length"
                                 :totalNumber="multiSelectDisorder.length">
                                </SvgBar>
                              </center>
                              <!-- <v-checkbox
                                v-for="(item, i) in multiSelectDisorder"
                                :key="i" :label="item.Title" :value="item" id="disordersBox"
                                style="margin-top:-5px"
                                v-model="selectDisorders">
                              </v-checkbox> -->
                              <v-layout>
                                <v-flex xs7>
                                  <center><strong>ASSOCIATED DISORDERS</strong></center>
                                </v-flex>
                                <v-flex xs5>
                                  <center><strong>GENES</strong></center>
                                </v-flex>
                              </v-layout>
                              <br>
                              <div class="vendorsCardClass">
                                <v-layout row wrap v-for="(item, i) in multiSelectDisorder" :key="i">
                                  <v-flex xs7>
                                    <v-tooltip left nudge-right="180">
                                      <v-checkbox slot="activator" style="margin-top:-8px" :label="item.Title" :value="item" v-model="selectDisorders">
                                      </v-checkbox>
                                      <span >
                                        <center><strong>{{ item.Title}}</strong></center>
                                        <br>
                                        Mode of inheritance: {{ item._modeOfInheritance}}
                                        <br>
                                        OMIM: {{ item._omim}}
                                        <br>
                                        Gene Panels: {{ item._genePanelCount}}
                                        <br>
                                      </span>
                                    </v-tooltip>
                                  </v-flex>
                                  <v-flex xs5>
                                    <!-- {{ item._geneCount}} -->
                                    <div>
                                      <DisordersGeneBar
                                       v-if="TotalGtrGenes>0 && chartComponent==='disorders'"
                                       class="SvgBarClass"
                                       id="disordersGeneBar"
                                       :selectedNumber="item._geneCount"
                                       :totalNumber="maxGenes">
                                      </DisordersGeneBar>
                                    </div>
                                  </v-flex>
                                </v-layout>
                              </div>
                              <br>
                              <v-layout>
                                <v-flex xs6>
                                  <center>
                                    <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="SelectAllDisordersButton">SELECT ALL</v-btn>
                                  </center>
                                </v-flex>
                                <v-flex xs6>
                                  <center>
                                    <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="DeSelectAllDisordersButton">DESELECT ALL</v-btn>
                                  </center>
                                </v-flex>
                              </v-layout>
                              <br>

                            </v-card-text>
                            <!-- end disorders subcomponent -->
                              <v-divider></v-divider>
                            <v-card-text style="margin-left:5px" v-on:click="DisordersAndModesComponent='modes'">
                              <center>
                                <span class="Rightbar_card_content_subheading">
                                  <strong class="Rightbar_card_content_heading">{{ selectedModesOfInheritance.length }}</strong> of {{ modeOfInheritanceProps.length }} modes of inheritance selected
                                </span>
                                <SvgBar
                                 class="SvgBarClass"
                                 id="ModesOfInheritanceSvgBox"
                                 :selectedNumber="selectedModesOfInheritance.length"
                                 :totalNumber="modeOfInheritanceProps.length">
                                </SvgBar>
                                <br>
                              </center>
                              <span style="font-size13px; font-weight:600">
                                Each disorder is associated with one or more modes of inheritance. If a mode of inheritance is selected below,
                                all disorders associated with it will be retained. If a disorder is associated with multiple modes of inheritance,
                                all must be deselected to remove the disorder.
                              </span>
                              <br><br>
                              <!-- <v-checkbox
                                v-for="(item, j) in modeOfInheritanceProps"
                                :key="j" :label="item._modeOfInheritance" :value="item._modeOfInheritance" id="modeBoxInside"
                                style="margin-top:-5px"
                                v-model="selectedModesOfInheritance">
                              </v-checkbox> -->
                              <v-layout>
                                <v-flex xs7>
                                  <center><strong>MODE OF INHERITANCE</strong></center>
                                </v-flex>
                                <v-flex xs5>
                                  <center><strong>DISORDERS</strong></center>
                                </v-flex>
                              </v-layout>
                              <br>
                              <v-layout row wrap v-for="(item, i) in modeOfInheritanceProps" :key="i">
                                <v-flex xs7>
                                  <v-checkbox style="margin-top:-5px" :label="item._modeOfInheritance" :value="item._modeOfInheritance" v-model="selectedModesOfInheritance">
                                  </v-checkbox>
                                </v-flex>
                                <v-flex xs5>
                                  <div>
                                    <ModesSvgBar
                                     v-if="multiSelectDisorder.length>0 && chartComponent==='disorders'"
                                     class="SvgBarClass"
                                     id="ModesGeneBar"
                                     :selectedNumber="item._numberOfDisorder"
                                     :totalNumber="multiSelectDisorder.length">
                                    </ModesSvgBar>
                                  </div>
                                </v-flex>
                              </v-layout>
                              <br>
                              <v-layout>
                                <v-flex xs6>
                                  <center>
                                    <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="SelectAllModesButton">SELECT ALL</v-btn>
                                  </center>
                                </v-flex>
                                <v-flex xs6>
                                  <center>
                                    <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="DeSelectAllModesButton">DESELECT ALL</v-btn>
                                  </center>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        <!-- </v-card-title> -->
                        <center>
                          <v-btn color="primary darken-1" flat="flat" v-on:click="closeComponent">Close</v-btn>
                        </center>
                        <br>
                      </div>
                    </v-card>
                  </div>
                </v-flex>
        </v-layout>
                </div>
              </div>

              <div id="inActivePanelsFilterCard">
                    <div id="activePanelsFilterCard" class="mb-3">
                      <v-layout wrap>
                        <v-flex xs12>
                          <div v-if=" diseasesProps.length && modeOfInheritanceProps.length"">
                            <v-card v-bind:class="[chartComponent==='GeneMembership' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                              <v-card-text>
                                <center>
                                <span class="Rightbar_CardHeading">
                                  PANELS
                                </span>
                                <Dialogs
                                  id="GeneMembershipDialog"
                                  class="dialogBox"
                                  :HeadlineText="HelpDialogsData[3].HeadlineText"
                                  :ContentText="HelpDialogsData[3].Content">
                                </Dialogs>
                                <v-divider class="Rightbar_card_divider"></v-divider>

                                 <div v-bind:class="[chartComponent==='GeneMembership' ? 'disabledClass' : 'activeClass']">
                                   <span class="Rightbar_card_content_subheading">
                                     <strong class="Rightbar_card_content_heading">{{ selectedPanelsInCheckBox.length }}</strong> of panels {{ multiSelectPanels.length }} selected
                                   </span>
                                   <SvgBar
                                    class="SvgBarClass"
                                    id="panelssvgbar"
                                    :selectedNumber="selectedPanelsInCheckBox.length"
                                    :totalNumber="multiSelectPanels.length">
                                   </SvgBar>
                                   <br>
                                   <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('GeneMembership')">
                                     View & Filter
                                   </v-btn>
                                 </div>
                               </center>
                              </v-card-text>
                              <div v-bind:class="[chartComponent==='GeneMembership' ? 'activeClass' : 'disabledClass']">
                                  <v-card flat v-if="vendorList.length">
                                    <v-card-text >
                                      <center>
                                        <span class="Rightbar_card_content_subheading">
                                          <strong class="Rightbar_card_content_heading">{{ selectedPanelsInCheckBox.length }}</strong> of {{ multiSelectPanels.length }} panels selected
                                        </span>
                                        <SvgBar
                                         class="SvgBarClass"
                                         id="disordersSvgBoxInside"
                                         :selectedNumber="selectedPanelsInCheckBox.length"
                                         :totalNumber="multiSelectPanels.length">
                                        </SvgBar>
                                      </center>
                                      <!-- <br>
                                      <span v-if="!editPanelDefinition" style="cursor:pointer" v-on:click="editPanelDefinition=true"><v-icon>settings</v-icon>  &nbsp; Edit definition <br></span>

                                      <Alerts
                                        v-if="panelsAlert"
                                        alertType="warning"
                                        alertTransition="scale-transition"
                                        :alertText="panelAlertText"
                                      >
                                      </Alerts>
                                      <div v-if="editPanelDefinition">
                                        <v-layout row>
                                          <v-flex xs4>
                                            <strong>Lower limit:</strong>
                                          </v-flex>
                                          <v-flex xs3>
                                            <input type="number" onkeydown="javascript: return event.keyCode !== 69"  v-model="lowerLimitInput" class="form-control">
                                        </v-flex>
                                        <v-flex xs5>
                                        </v-flex>
                                      </v-layout>
                                        <v-layout row>
                                          <v-flex xs4>
                                            <strong>Upper limit:</strong>
                                          </v-flex>
                                          <v-flex xs3>
                                            <input type="number" onkeydown="javascript: return event.keyCode !== 69"  v-model="upperLimitInput" class="form-control">
                                        </v-flex>
                                        <v-flex xs5>
                                        </v-flex>
                                      </v-layout>
                                    <br>
                                    <v-layout>
                                      <v-flex xs4>
                                        <center>
                                          <v-btn outline color="primary darken-1" dark v-on:click="ChangePanelsDefinition" >SAVE</v-btn>
                                        </center>
                                      </v-flex>
                                      <v-flex xs3>
                                        <center>
                                          <v-btn color="primary darken-1" flat="flat" v-on:click="closePanelsDefinitionEdit" >CANCEL</v-btn>
                                        </center>
                                      </v-flex>
                                      <v-flex xs5>
                                      </v-flex>
                                    </v-layout>
                                    <br>


                                      </div>
                                      <v-layout>
                                        <v-flex xs4>
                                          <v-tooltip bottom>
                                            <v-checkbox slot="activator" v-model="selectedPanelFilters" color="green" label="Specific panels" value="specific"></v-checkbox>
                                            <span>
                                              <center><i>Less than {{ lowerLimitProps}} genes</i></center>
                                            </span>
                                          </v-tooltip>
                                        </v-flex>
                                        <v-flex xs4>
                                          <v-tooltip bottom>
                                            <v-checkbox slot="activator" v-model="selectedPanelFilters" color="amber accent-4" label="Moderate panels" value="moderate"></v-checkbox>
                                              <span>
                                                <center><i>More than {{ lowerLimitProps}} genes & Less than {{ upperLimitProps }} genes</i></center>
                                              </span>
                                          </v-tooltip>
                                        </v-flex>
                                        <v-flex x4>
                                          <v-tooltip bottom>
                                            <v-checkbox slot="activator" v-model="selectedPanelFilters" color="red" label="General panels" value="general"></v-checkbox>
                                            <span>
                                              <center><i>More than {{ upperLimitProps}} genes</i></center>
                                            </span>
                                          </v-tooltip>
                                        </v-flex>
                                      </v-layout>
                                      <hr>-->
                                      <v-layout>
                                        <v-flex xs8>
                                        <strong style="font-size:11px">PANELS</strong>
                                        </v-flex>
                                        <v-flex xs1>
                                          <strong style="font-size:11px">GENES</strong>
                                        </v-flex>
                                        <v-flex x3>
                                          <center><strong style="font-size:11px">CONDITIONS</strong></center>
                                        </v-flex>
                                      </v-layout>
                                      <br>
                                      <div class="vendorsCardClass">
                                        <v-layout row wrap v-for="(item, i) in multiSelectPanels" :key="i">
                                          <v-flex xs8>
                                            <v-checkbox style="margin-top:-8px" :label="item.testname" :value="item" v-model="selectedPanelsInCheckBox">
                                            </v-checkbox>
                                          </v-flex>
                                          <v-flex xs1>
                                            <!-- <center><strong style="margin-top-6px; font-size:14px">{{ item.genecount }}</strong></center> -->
                                            <center style="margin-top:-6px">
                                              <span v-if="item.filter==='specific'">
                                                <strong style="margin-top:-6px; font-size:14px; color:green; ">
                                                  {{ item.genecount }}
                                                </strong>
                                              </span>
                                              <span v-else-if="item.filter==='moderate'">
                                                <strong style="margin-top:-6px; font-size:14px; color:#FFAB00; ">
                                                  {{ item.genecount }}
                                                </strong>
                                              </span>
                                              <span v-else-if="item.filter==='general'">
                                                <strong style="margin-top:-6px; font-size:14px; color:red; ">
                                                  {{ item.genecount }}
                                                </strong>
                                              </span>
                                            </center>

                                          </v-flex>
                                          <v-flex xs3>
                                            <!-- <center><strong style="margin-top-6px; font-size:14px">{{ item._diseaseCount }}</strong></center> -->
                                            <center>
                                              <PanelsConditions
                                              v-if="chartComponent==='GeneMembership'"
                                               :selectedNumber="item._diseaseCount"
                                               :totalNumber="multiSelectDisorder.length">
                                             </PanelsConditions>
                                            </center>

                                          </v-flex>
                                        </v-layout>
                                      </div>
                                      <br>
                                      <br>
                                      <v-layout>
                                        <v-flex xs6>
                                          <center>
                                            <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="SelectAllPanels">SELECT ALL</v-btn>
                                          </center>
                                        </v-flex>
                                        <v-flex xs6>
                                          <center>
                                            <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="DeSelectAllPanels">DESELECT ALL</v-btn>
                                          </center>
                                        </v-flex>
                                      </v-layout>
                                      <br>

                                    </v-card-text>
                                  </v-card>
                                  <center>
                                    <v-btn color="primary darken-1" flat="flat" v-on:click="closeComponent">Close</v-btn>
                                  </center>
                                  <br>
                              </div>
                            </v-card>
                          </div>

                        </v-flex>
                      </v-layout>
                    </div>
                  </div>

                    <!-- start vendor cars -->
                  <div id="inActiveVendorsCard">
                    <div id="activeVendorsCard" class="mb-3">
                    <v-layout wrap>
                    <v-flex xs12>
                      <div v-if=" diseasesProps.length && modeOfInheritanceProps.length && multiSelectItems.length>0">
                        <v-card v-bind:class="[chartComponent==='Vendors' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                          <v-card-text primary-title>
                            <center>
                              <span class="Rightbar_CardHeading">
                                VENDORS
                              </span>
                              <Dialogs
                                id="vendorsDialog"
                                class="dialogBox"
                                :HeadlineText="HelpDialogsData[4].HeadlineText"
                                :ContentText="HelpDialogsData[4].Content">
                              </Dialogs>
                              <v-divider class="Rightbar_card_divider"></v-divider>

                             <div v-bind:class="[chartComponent==='Vendors' ? 'disabledClass' : 'activeClass']">
                               <span class="Rightbar_card_content_subheading">
                                 <strong class="Rightbar_card_content_heading">{{ vendorsSelect.length }}</strong> of {{ multiSelectItems.length }} vendors selected
                               </span>
                               <SvgBar
                                class="SvgBarClass"
                                id="disordersSvgBoxInside"
                                :selectedNumber="vendorsSelect.length"
                                :totalNumber="multiSelectItems.length">
                               </SvgBar>
                               <br>
                               <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('Vendors')">View & Filter</v-btn>
                             </div>
                            </center>
                          </v-card-text>
                          <div v-bind:class="[chartComponent==='Vendors' ? 'activeClass' : 'disabledClass']">
                            <v-card flat v-if="multiSelectItems.length">
                              <v-card-text >
                                <center>
                                  <span class="Rightbar_card_content_subheading">
                                    <strong class="Rightbar_card_content_heading">{{ vendorsSelect.length }}</strong> of {{ multiSelectItems.length }} vendors selected
                                  </span>
                                  <SvgBar
                                   class="SvgBarClass"
                                   id="disordersSvgBoxInside"
                                   :selectedNumber="vendorsSelect.length"
                                   :totalNumber="multiSelectItems.length">
                                  </SvgBar>
                                </center>
                                <br>
                                <div class="vendorsCardClass">
                                  <v-layout row wrap v-for="(item, i) in multiSelectItems" :key="i">
                                    <v-flex xs8>
                                      <v-checkbox style="margin-top:-8px" :label="item" :value="item" v-model="vendorsSelect">
                                      </v-checkbox>
                                    </v-flex>
                                    <v-flex xs4>
                                    </v-flex>
                                  </v-layout>
                                </div>
                                <br>
                                <v-layout>
                                  <v-flex xs6>
                                    <center>
                                      <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="SelectAllVendors">SELECT ALL</v-btn>
                                    </center>
                                  </v-flex>
                                  <v-flex xs6>
                                    <center>
                                      <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="DeSelectAllVendors">DESELECT ALL</v-btn>
                                    </center>
                                  </v-flex>
                                </v-layout>
                              </v-card-text>
                            </v-card>
                            <!-- <v-btn v-show="vendorsSelect.length<multiSelectItems.length" small v-on:click="SelectAllVendors">Select All vendors</v-btn>
                            <br> -->
                            <center>
                              <v-btn color="primary darken-1" flat="flat" v-on:click="closeComponent">Close</v-btn>
                            </center>
                            <br>
                          </div>
                        </v-card>
                      </div>
                    </v-flex>
                  </v-layout wrap>
                </div>
              </div>
                    <!-- end vendor card -->

                   </v-flex>
                  </v-layout>
            </v-flex>

            <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px" >
              <v-card >
                <v-card-title primary class="title">Disorders</v-card-title>
                <v-card-text>
                  <disease-panel
                    v-if="diseases.length && removeSearchTermFlag===false"
                    v-bind:DiseasePanelData="diseases"
                    v-on:selectedDiseases="selectDiseases($event)"
                    v-on:setDisorderNamesList="updateDisorderNamesList($event)"
                    v-on:PieChartSelectorData="PieChartSelectorData($event)"
                    v-bind:selectedDisordersProps="selectDisordersProps"
                    v-bind:selectedModesOfInheritance="selectedModesOfInheritanceProps"
                    v-on:ModesSelectedData="ModesSelectedData($event)"
                    v-on:disordersSelectedData="disordersSelectedData($event)">
                  </disease-panel>
                </v-card-text>
              </v-card>
            </v-flex>
            <br>
<!-- style="visibility:hidden; height:0px" -->
            <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px" >
              <v-card >
                <v-card-title primary class="title">Panels</v-card-title>
                <v-card-text>
                  <gene-panel
                    v-if="diseasesProps.length"
                    v-bind:DiseasePanelData="diseasesProps"
                    v-on:selectedPanels="selectPanels($event)"
                    v-on:NoOfPanels="NoOfPanels($event)"
                    v-on:setVendorList="updateVendorList($event)"
                    v-bind:selectedVendorsProps="vendorsSelectProps"
                    v-on:setPanelsNamesList="setPanelsNamesList($event)"
                    v-bind:selectedPanelsInCheckBox="selectedPanelsInCheckBoxProps"
                    v-bind:selectedPanelsInCheckBoxPropsOne="selectedPanelsInCheckBoxPropsOne"
                    v-on:selectVendors="selectVendors($event)"
                    v-on:selectPanelsFromVendorsUpdate="selectPanelsFromVendorsUpdate($event)"
                    v-bind:lowerLimitProps="lowerLimitProps"
                    v-bind:upperLimitProps="upperLimitProps">
                    <!-- v-bind:selectedVendorsProps="selectedVendorsList"> -->
                  </gene-panel>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      <!-- </v-app> -->
    </div>

</div>
</template>

<script>
import DisorderSearch from './DisorderSearch.vue';
import DiseasesPanel from './DiseasesPanel.vue';
import GenePanel from './GenePanel.vue';
import ShowGenePanel from './ShowGenePanel.vue';
import { bus } from '../../routes';
import PieChartSelector from '../viz/PieChartSelector.vue';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import GeneMembership from '../viz/GeneMembership.vue';
import Alerts from '../partials/Alerts.vue';
import Dialogs from '../partials/Dialogs.vue';
import HelpDialogs from '../../../data/HelpDialogs.json';
import IntroductionText from '../../../data/IntroductionText.json';
import SvgBar from '../viz/SvgBar.vue';
import DisordersGeneBar from '../viz/DisordersGeneBar.vue'
import ModesSvgBar from '../viz/ModesSvgBar.vue';
import NoGenesDisplayTable from '../partials/NoGenesDisplayTable.vue'
var _ = require('lodash');
import Model from '../../models/Model';
var model = new Model();
import PanelsConditions from '../viz/PanelsConditions.vue';


export default {
  components: { //Registering locally for nesting!
    'DisorderSearch': DisorderSearch,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel1': ShowGenePanel,
    'PieChartSelector': PieChartSelector,
    'ConditionsDistribution': ConditionsDistribution,
    'GeneMembership': GeneMembership,
    'Alerts': Alerts,
    'Dialogs': Dialogs,
    'SvgBar': SvgBar,
    'DisordersGeneBar': DisordersGeneBar,
    'ModesSvgBar': ModesSvgBar,
    'NoGenesDisplayTable': NoGenesDisplayTable,
    'PanelsConditions': PanelsConditions
  },
  name: 'home',
  props: {
    selectedVendorsListCB:{
      type: Array
    },
    selectedDisordersListCB:{
      type: Array
    },
    chartColor: null,
    barColor: null
  },
  data() {
    return {
      diseases: [],
      diseasesProps: [],
      geneProps: [],
      vendorList: [],
      selectedVendorsList: [],
      modeOfInheritanceProps: [],
      disorderNamesList: [],
      selectedDisordersList: [],
      showSummaryComponent: false,
      NumberOfTopGenes: null,
      selectedGenesText: "",
      selectedVendorsListFromFilterCB:[],
      GtrGenesTabNumber: 0,
      DisordersPropsBackArr: [],
      chartComponent: null,
      isActive: true,
      TotalGtrGenes: 0,
      maxGenes: 0,
      genePanelsCount:0,
      loading: false, //multiselect
      multiSelectItems: [],   //multiselect
      search: null,  //multiselect
      vendorsSelect: [],  //multiselect
      Genes: [],  //multiselect
      disordersDataList: [],
      selectDisorders: [],
      selectDisordersProps:[],
      multiSelectDisorder: [],
      snackbar: false,
      snackbarText: "",
      y: 'top',
      x: null,
      mode: '',
      snackbarTimeout: 4000,
      genesTopCounts: [5, 10, 30, 50, 80, 100],
      dialog: false,
      DisordersDialog: false,
      geneSearch: '',
      GoToTop: false,
      disordersSearchedByUser: false,
      multipleSearchItems:[],
      removeSearchTermFlag: false,
      filterFeed: [],
      saveSelectedVendorsCount: 0,
      saveSelectedVendors: [],
      saveSelectedPanels: [],
      newSearchFlag: false,
      lastVendorItem: [],
      HelpDialogsData: null,
      IntroductionTextData: null,
      selectedModesOfInheritance: [],
      selectedModesOfInheritanceProps: [],
      DisordersAndModesComponent: "",
      multiSelectPanels: [],
      selectedPanelsInCheckBox: [],
      vendorsSelectProps:[],
      selectedPanelsInCheckBoxProps: [],
      selectedPanelsInCheckBoxPropsOne: [],
      panelFilters: ["specific", "moderate", "general"],
      selectedPanelFilters: ["specific"],
      upperLimitProps: 45,
      lowerLimitProps: 20,
      panelsAlert: false,
      panelAlertText: "",
      editPanelDefinition: false,
      upperLimitInput: 45,
      lowerLimitInput: 20,
      associatedGenes: [],
    }
  },
  watch:{
    selectedPanelFilters: function(){
      console.log("chartComponent", this.chartComponent)
      this.filterPanelsOnselectedPanelFilters();
    },
    NumberOfTopGenes: function(){
      this.selectNumberOfTopGenes()
    },
    selectedVendorsListCB: function(){
      this.selectedVendorsList = this.selectedVendorsListCB
    },
    selectedDisordersListCB: function(){
      this.selectedDisordersList = this.selectedDisordersListCB
    },
    vendorsSelect(val) {
      console.log("Vendors watching");
      console.log("this.multiSelectPanels.length in vendors watch 1", this.multiSelectPanels.length)

      if(this.chartComponent==='Vendors'){
        this.vendorsSelectProps = this.vendorsSelect;
        var tempArr=[];
        for(var i=0; i<this.vendorsSelect.length; i++){
          for(var j=0; j<this.multiSelectPanels.length; j++){
            if( this.vendorsSelect[i] === this.multiSelectPanels[j].offerer ){
              tempArr.push(this.multiSelectPanels[j]);
            }
          }
        }
        this.selectedPanelsInCheckBox = tempArr;
      }
      var diff = this.multiSelectItems.length - this.vendorsSelect.length;
      var lastItem = [];
      if(this.chartComponent==='GeneMembership' || this.chartComponent==='Vendors' || this.chartComponent===null){
        if(diff>0 ){ //because everytime a new term is searched this difference will be zero.
          this.saveSelectedVendorsCount = this.multiSelectItems.length - this.vendorsSelect.length;
          this.saveSelectedVendors = this.multiSelectItems.filter( vendor => !this.vendorsSelect.includes(vendor));
        }
        else if(diff===0){
          this.saveSelectedVendors = [];
        }
      }
      console.log("this.multiSelectPanels.length in vendors watch 2", this.multiSelectPanels.length)
    },
    selectedPanelsInCheckBox(val){
      console.log("watching selectedPanelsInCheckBox and this.multiSelectPanels.length", this.multiSelectPanels.length)
      if(this.chartComponent==='GeneMembership' || this.chartComponent==="PanelFilters"){
        this.selectedPanelsInCheckBoxProps = this.selectedPanelsInCheckBox
      }
      else if(this.chartComponent==='Vendors'){
        this.selectedPanelsInCheckBoxPropsOne = this.selectedPanelsInCheckBox
      }
      var diff = this.multiSelectPanels.length - this.selectedPanelsInCheckBox.length;
      var temp = [];
      if(this.chartComponent==='GeneMembership' || this.chartComponent==='Vendors' || this.chartComponent===null){
        if(diff>0){
          // this.saveSelectedPanels = this.selectedPanelsInCheckBox
          this.selectedPanelsInCheckBox.map(x=>{
            temp.push(x.testname);
          })
          this.saveSelectedPanels = temp;
        }
        else if(diff===0){
          this.saveSelectedPanels=[];
        }
      }

    },
    selectDisorders(val) {
      if(this.DisordersAndModesComponent==="disorders"){
        this.selectDisordersProps = this.selectDisorders;
      }
    },
    selectedModesOfInheritance(val){
      if(this.DisordersAndModesComponent==="modes"){
        this.selectedModesOfInheritanceProps = this.selectedModesOfInheritance;
      }
    }
  },
  updated(){
    console.log("updated - this.multiSelectPanels.length", this.multiSelectPanels.length)
  },
  mounted(){
    this.HelpDialogsData = HelpDialogs.data;
    bus.$on("lastDisorder", ()=>{
      this.snackbarText = "It is required that atleast one disorder is kept selected";
      this.snackbar = true;
      this.selectDisorders = [this.multiSelectDisorder[0]];
    });
    bus.$on("newSearch", ()=>{
      this.newSearchFlag = true;
      this.saveSelectedPanels=[];
      this.saveSelectedVendors=[];
      this.chartComponent= null;
      this.DisordersAndModesComponent="";
      // this.selectedPanelFilters= ["specific", "moderate", "general"];
      this.closeComponentForNewResults();
    })
    bus.$on("removeSearchTerm", ()=>{
      this.maxGenes = 0;
      this.selectDisorders = [];
      // this.vendorsSelect = [];
      this.vendorsSelect = this.multiSelectItems;
      this.removeSearchTermFlag = true;
      this.saveSelectedPanels=[];
      this.saveSelectedVendors=[];
      this.chartComponent= null;
      this.DisordersAndModesComponent="";
      // this.selectedPanelFilters= ["specific", "moderate", "general"];
      this.closeComponentForNewResults();
    });
    bus.$on("updateModeOfInheritance", (modeOfInheritance, selection)=>{
      this.filterFeed.unshift("Mode of inheritance")
    });
    bus.$on("vendorsFilter", ()=>{
      if(this.chartComponent==='Vendors'){
        this.filterFeed.unshift("Vendors")
      }
    });
    bus.$on("disordersFilter", ()=>{
      if(this.chartComponent==='disorders'){
        this.filterFeed.unshift("Disorders");
      }
    });
    bus.$on("updateFromGenesHistogram", (data, count)=>{
      if(this.chartComponent==='GeneMembership'){
        this.filterFeed.unshift("Gene Membership")
      }
    });
    bus.$on("newAnalysis", ()=>{
      this.disordersSearchedByUser= false;
      this.NumberOfTopGenes = null;
      this.saveSelectedPanels = [];
      this.saveSelectedVendors = [];
      this.selectedPanelFilters= ["specific"];
      this.lowerLimitInput = 20;
      this.lowerLimitProps = 20;
      this.upperLimitInput = 45;
      this.upperLimitProps = 45;
      this.closeComponentForNewResults();
    });
  },
  created () {
    this.IntroductionTextData = IntroductionText.data[0];
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    clickedTopPanelFilters: function(){
      this.chartComponent = "PanelFilters";
      this.closeComponentForNewResults();
    },
    filterPanelsOnselectedPanelFilters: function(){
      console.log("inside filterPanelsOnselectedPanelFilters and multiSelectPanels length", this.multiSelectPanels.length )
      var temp = [];
      this.selectedPanelFilters.map(x=>{
        this.multiSelectPanels.map(y=>{
          if(x === y.filter){
            temp.push(y);
          }
        })
      })
      this.selectedPanelsInCheckBox = temp;
    },
    selectNumberOfTopGenes: function(){
       if(parseInt(this.NumberOfTopGenes)>0){
        bus.$emit('SelectNumberOfGenes', parseInt(this.NumberOfTopGenes));
      }
    },
    addDiseases: function(e){
      // console.log("addDiseases", e)
      this.removeSearchTermFlag = false;
      this.disordersSearchedByUser= true;
      // console.log("E", e);
      for(var i=0; i<e.length; i++){
        for(var j=e.length-1; j>i; j--){
          {
            if(e[i].Title === e[j].Title){
              // var temp = e[i].searchTerm + " , " + e[j].searchTerm;
              e[i].searchTerm = e[i].searchTerm + " " + e[j].searchTerm;
              // e[i].searchTermIndex = e[i].searchTermIndex + " , " + e[j].searchTermIndex;
              e[i].searchTermArray = [...e[i].searchTermArray, ...e[j].searchTermArray];
              e[i].searchTermIndex = [...e[i].searchTermIndex, ...e[j].searchTermIndex];
              // e[j].searchTerm = temp;
              // temp = "";
            }
          }
        }
      }

      //Remove duplicates from the disorders array.
      e = e.filter((disorder, index, self) =>
        index === self.findIndex((t) => (
          t.Title === disorder.Title
        ))
      );
      // console.log(e);
      this.DisordersPropsBackArr = e;
      this.showSummaryComponent = true
      this.diseases = e;
      // this.selectDisorders = [];
      this.$emit("diseasesCB", e);
      if(e.length<= 0){
        this.geneProps = [];
        this.diseasesProps = [];
        this.vendorList=[];
        this.disorderNamesList=[];
        this.modeOfInheritanceProps=[];
        this.selectedGenesText = "";
        this.$emit("UpdateListOfSelectedGenesGTR", []);
      }
    },
    checkForAssociatedGenes: function(){
      console.log("checkForAssociatedGenes", this.diseasesProps);
      var temp = [];
      this.diseasesProps.map(x=>{
        if(x.ConceptMeta.AssociatedGenes!==undefined && x.ConceptMeta.AssociatedGenes!==""){
          console.log("x.ConceptMeta.AssociatedGenes.Gene.__text", x.ConceptMeta.AssociatedGenes.Gene.__text);
          if(x.ConceptMeta.AssociatedGenes.Gene.__text!==undefined){
            temp.push({
              name: x.ConceptMeta.AssociatedGenes.Gene.__text,
              searchTermIndex: x.searchTermIndex,
              searchTermArray: x.searchTermArray
            })
          }
          else if(x.ConceptMeta.AssociatedGenes.Gene.__text===undefined){
            x.ConceptMeta.AssociatedGenes.Gene.map(y=>{
              temp.push({
                name: y.__text,
                searchTermIndex: x.searchTermIndex,
                searchTermArray: x.searchTermArray
              })
            })
          }
        }
      })
      console.log("associated gene", temp)
      this.associatedGenes = temp;
    },
    selectDiseases: function(e){ //Gets back the data based on the changes or updates in the disease panel;
     // console.log("e is from home: ", e)
      this.diseasesProps = e;
      if(e.length<=0){
        this.geneProps = [];
        this.$emit("UpdateListOfSelectedGenesGTR", []);
      }
      this.checkForAssociatedGenes();
    },
    selectPanels: function(e){
      console.log("inside selectPanels and the component is - ", this.chartComponent)
      console.log("selectPanels", e)
      if(this.chartComponent!=='GeneMembership'&& this.chartComponent!=='Vendors' && this.chartComponent!=='PanelFilters' && this.chartComponent!=='PanelsDefinition'){
          //set the items in the panels card
          this.multiSelectPanels = e;
      }
      var temp = [];
      if(this.saveSelectedPanels.length===0 && this.chartComponent === 'disorders'){
        temp = e;
      }
      else if(this.saveSelectedPanels.length>0 && this.chartComponent === 'disorders'){
        e.map(x=>{
          if(this.saveSelectedPanels.includes(x.testname)){
            temp.push(x);
          }
        })
      }
      else {
        // temp = e;

        if(this.chartComponent!=='PanelFilters'){
          var tempArr = [];
          tempArr = e;
          this.selectedPanelFilters.map(x=>{
            tempArr.map(y=>{
              if(x === y.filter){
                temp.push(y);
              }
            })
          })
        }
        else {
          temp = e;
        }
      }

      if(this.chartComponent!=='GeneMembership'&& this.chartComponent!=='Vendors' && this.chartComponent!=='PanelFilters'  && this.chartComponent!=='PanelsDefinition'){
        this.selectedPanelsInCheckBox = temp;
        //Add condition to keep the panels filters in track and select accordingly:
        // var tempArr = [];
        // this.selectedPanelFilters.map(x=>{
        //   temp.map(y=>{
        //     if(x === y.filter){
        //       tempArr.push(y);
        //     }
        //   })
        // })
        // this.selectedPanelsInCheckBox = tempArr;
        // temp = tempArr
      }
      console.log("temp in select panels ", temp)
      this.geneProps = temp;
    },
    setPanelsNamesList: function(e){
      console.log("inside setPanelsNamesList")
      // if(this.chartComponent!=='disorders' && this.saveSelectedPanels.length>0){
      //   this.multiSelectPanels = e;
      //   this.selectedPanelsInCheckBox = this.multiSelectPanels;
      // }
      // else {
      //   this.multiSelectPanels = e;
      //   this.selectedPanelsInCheckBox = this.multiSelectPanels;
      // }

      // this.checkForDeselectedPanels();
    },
    updateVendorList: function(e){
      // console.log("vendor list as callback to home", e);
      this.vendorList = e;
      this.multiSelectItems = e;
      this.vendorsSelect = this.multiSelectItems;
      this.$emit("vendorListCB", e);
      this.checkForDeselectedVendor();
    },
    selectVendors: function(e){
      console.log("receiving vendors list")
      // console.log("selectVendors ", e);
      this.vendorsSelect = e;
      if(!this.chartComponent==='Vendors'){
        this.vendorsSelect = e;
      }
      // this.vendorsSelect = e;
      // this.checkForDeselectedPanels();
    },
    selectPanelsFromVendorsUpdate: function(e){
    },
    checkForDeselectedVendor: function(){
      if(this.saveSelectedVendors.length===0){
        this.vendorsSelect = this.multiSelectItems;
      }
      else if(this.saveSelectedVendors.length>0){
        this.vendorsSelect = this.multiSelectItems.filter( vendor => !this.saveSelectedVendors.includes(vendor))
      }
    },
    checkForDeselectedPanels: function(){
      if(this.saveSelectedPanels.length===0){
        this.selectedPanelsInCheckBox = this.multiSelectPanels;
      }
      else if(this.saveSelectedPanels.length>0){
        this.selectedPanelsInCheckBox = this.multiSelectPanels.filter( panel => !this.saveSelectedPanels.includes(panel))
      }
    },
    updateSelectedVendors: function(e){
      // console.log("selected vendors from callback to home", e);
      this.selectedVendorsList = e;
    },
    PieChartSelectorData: function(e){
      this.modeOfInheritanceProps = e;
      // var x = e;
      // this.selectedModesOfInheritance = this.modeOfInheritanceProps;
      this.$emit("modeOfInheritanceData", e);

      var x = [];
      e.map(y=>{
        x.push(y._modeOfInheritance);
      });
      // this.modeOfInheritanceProps = x;
      // this.selectedModesOfInheritance = this.modeOfInheritanceProps;
      this.selectedModesOfInheritance = x;


    },
    ModesSelectedData:function(e){
      // this.selectedModesOfInheritance = [];
      // if(e.length === this.modeOfInheritanceProps){
      //   this.selectedModesOfInheritance = this.modeOfInheritanceProps;
      // }
      // else {
      //   this.selectedModesOfInheritance = e;
      var x = [];
      e.map(y=>{
        x.push(y._modeOfInheritance);
      });
      this.selectedModesOfInheritance = x;

    },
    SelectAllModesButton: function(){
      var x = [];
      this.modeOfInheritanceProps.map(y=>{
        x.push(y._modeOfInheritance);
      });
      this.selectedModesOfInheritance = x;
    },
    DeSelectAllModesButton: function(){
      this.selectedModesOfInheritance = [];
    },
    updateDisorderNamesList: function(e){
      // console.log("disorderNamesList from callback to home", e);
      this.disorderNamesList = e;
      this.multiSelectDisorder = e;
      this.selectDisorders = this.multiSelectDisorder;
      this.$emit("disorderNamesListCB", e)
    },
    disordersSelectedData:function(e){
      this.selectDisorders = e;
    },
    updateSelectedDisorders: function(e){
      // console.log("selected disorders from callback to home ", e)
      this.selectedDisordersList = e;
    },
    ChangeSelectedGenesText: function(e){
      this.selectedGenesText = e;
    },
    UpdateNoOfGenesSelectedFromGTR: function(e){
      this.GtrGenesTabNumber = e;
      this.$emit("UpdateNumberOfGenesSelectedFromGTR", e)
    },
    UpdateListOfSelectedGenes: function(e){
      this.$emit("UpdateListOfSelectedGenesGTR", e);
    },
    onSearchGTR: function(genes, phenotype) {
      this.$emit('search-gtr', genes, phenotype)
    },
    showChartComponent: function(chart_component){
      this.chartComponent = chart_component;
      $("#activeFilterCard").fadeIn("slow", function() {
        $(this).addClass("activeFilterCardBackground");
      });

      setTimeout(function(){$("#activeFilterCard").removeClass("activeFilterCardBackground");}, 5500);

      if(chart_component==='disorders'){
        $('#activePanelsFilterCard').appendTo('#inActivePanelsFilterCard');
        $('#activeDisordersAndModesFilterCard').appendTo('#activeFilterCard');
        $('#activeVendorsCard').appendTo('#inActiveVendorsCard');

      }
      else if(chart_component==='GeneMembership'){
        $('#activeDisordersAndModesFilterCard').appendTo('#inActiveDisordersAndModesFilterCard');
        $('#activePanelsFilterCard').appendTo('#activeFilterCard');
        $('#activeVendorsCard').appendTo('#inActiveVendorsCard');

      }
      else if(chart_component==='Vendors'){
        $('#activeDisordersAndModesFilterCard').appendTo('#inActiveDisordersAndModesFilterCard');
        $('#activePanelsFilterCard').appendTo('#inActivePanelsFilterCard');
        $('#activeVendorsCard').appendTo('#activeFilterCard');
      }

      window.scrollTo(0,120);
    },
    TotalNoOfGenesFromGTR: function(e){
      this.TotalGtrGenes = e;
      this.maxGenes = this.maxGenes>this.TotalGtrGenes?this.maxGenes:this.TotalGtrGenes;
    },
    NoOfPanels: function(e){
      this.genePanelsCount = e.length;
    },
    SelectAllVendors: function(){
      this.vendorsSelect=this.multiSelectItems;
      this.saveSelectedVendors = [];
      this.selectedPanelFilters= ["specific", "moderate", "general"];
    },
    DeSelectAllVendors: function(){
      this.saveSelectedVendors = this.multiSelectItems;
      this.vendorsSelect = [];
      this.selectedPanelFilters = [];
    },
    SelectAllDisordersButton: function(){
      this.selectDisorders = this.multiSelectDisorder;
      bus.$emit("updatedFromDisorders");
    },
    DeSelectAllDisordersButton:function(){
      this.selectDisorders = [];
      bus.$emit("updatedFromDisorders");
    },
    SelectAllPanels: function(){
      this.selectedPanelsInCheckBox = this.multiSelectPanels;
      this.selectedPanelFilters= ["specific", "moderate", "general"];
    },
    DeSelectAllPanels: function(){
      this.selectedPanelsInCheckBox = [];
      this.selectedPanelFilters = [];
    },
    resetDisorders: function(){
      this.selectDisorders = [];
      bus.$emit("resetDisordersBus");
      // bus.$emit("updatedFromDisorders");
    },
    scrollDown: function(){
      window.scrollTo(0, 120);
      // $vuetify.goTo(120)
    },
    handleScroll (event) {
      if(window.scrollY>=120){
        this.GoToTop=true;
      }
      else if(window.scrollY<120){
        this.GoToTop=false;
      }
    },
    scrollToTop: function(){
      window.scrollTo(0,0);
    },
    multipleSearchData: function(e){
      this.multipleSearchItems = e;
    },
    closeComponent: function(){
      $("#activeFilterCard").removeClass("activeFilterCardBackground");

      if(this.chartComponent==='disorders'){
        $('#activeDisordersAndModesFilterCard').appendTo('#inActiveDisordersAndModesFilterCard');
      }
      else if(this.chartComponent==='GeneMembership'){
        $('#activePanelsFilterCard').appendTo('#inActivePanelsFilterCard');
      }
      else if(this.chartComponent==='Vendors'){
        $('#activeVendorsCard').appendTo('#inActiveVendorsCard');
      }
      window.scrollTo(0,120);
      this.chartComponent=null;
      this.DisordersAndModesComponent = "";
    },
    closeComponentForNewResults: function(){
      $("#activeFilterCard").removeClass("activeFilterCardBackground");
      $('#activeDisordersAndModesFilterCard').appendTo('#inActiveDisordersAndModesFilterCard');
      $('#activePanelsFilterCard').appendTo('#inActivePanelsFilterCard');
      $('#activeVendorsCard').appendTo('#inActiveVendorsCard');
    },
    ChangePanelsDefinition: function(){
      this.chartComponent = "PanelsDefinition";
      if(parseInt(this.upperLimitInput)<=parseInt(this.lowerLimitInput)){
        this.panelsAlert = true;
        this.panelAlertText = "Upper limit should be greater than lower limit";
        setTimeout(()=>{ this.panelsAlert=false; }, 3000);
      }
      else if(parseInt(this.upperLimitInput)>parseInt(this.lowerLimitInput)){
        // this.selectedPanelFilters = ["specific", "moderate", "general"];
        this.upperLimitProps = this.upperLimitInput;
        this.lowerLimitProps = this.lowerLimitInput;
        bus.$emit("ChangeDefinition", parseInt(this.upperLimitProps), parseInt(this.lowerLimitProps));
        this.snackbarText = "Panels Definition changed";
        this.snackbar = true;
        this.editPanelDefinition = false;
      }
    },
    closePanelsDefinitionEdit: function(){
      this.editPanelDefinition = false;
      this.upperLimitInput = this.upperLimitProps;
      this.lowerLimitInput = this.lowerLimitProps;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Quicksand:500');
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

  .toolbar__title{
    /* color: #66D4ED; */
    font-family: 'Quicksand', sans-serif;
    font-size: 24px;
  }

  label, strong, th{
    font-family: 'Open Sans', sans-serif;
  }

  center, span, h1, h2, h3, h4{
    font-family: 'Open Sans', sans-serif;
  }

  .btn__content{
    font-family: 'Open Sans', sans-serif;
  }

  .btn{
    padding: 0px
  }
  .cardBoxTitle{
    font-size: 16px;
    color: #000000;
  }

  .activeClass{
    display: visible;
  }
  .disabledClass{
    display: none;
  }
  .FilterAndViewBtn{
    background: #e0e0e0;
    color: rgba(68, 68, 68, 0.87);
    padding:3px 8px;
    border-radius:8px;
    cursor: pointer;
    height:30px;
    margin-left: 8px;
  }
  /* .activeCardBox{
    border-bottom: 4px solid #F16335;
    box-shadow: 0 2px 2px 0 #CC423F;
  } */
  .btnColor{
    color: white;
    background-color: #4267b2 !important;
    /* border-radius: 5px; */
  }
  .btn{
    padding: 0px;
    height:39px;
  }
  .form-control{
    font-size: 15px;
  }
 #top-genes-input{
   width: 200px;
   height:40px;
   margin-top: 4px;
   background-color: #F4F4F4;
   border-color: #F4F4F4;
 }



 .chip_fontSize{
   overflow-wrap: break-word;
   word-break: break-word;
   overflow-x:hidden;
   display:inline-block;
   text-overflow: ellipsis;
   max-width: 370px;
   font-size: 11px;
 }

 @media screen and (max-width:1700px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 300px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1520px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 250px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1210px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 150px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1000px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 100px;
     font-size:9px;
   }
 }


 @media screen and (max-width:1600px){
   #top-genes-input{
     width: 120px;
     height:40px;
     margin-top: 4px;
   }
 }

 .activeFilterCardBackground{
   /* box-shadow: 0 0 12px 6px #ededed; */
   /* transition: 3s ease-in-out; */
   animation: hideBoxShadow 5s;
   animation-fill-mode: forwards;
   border-top-right-radius: 6px;
   border-top-left-radius: 6px;
 }

 @keyframes hideBoxShadow {
  0% {box-shadow: 0 0 12px 6px #d3d3d3;}
  100% {box-shadow: 0 0 0 0 white;}
}
</style>

<style lang="sass">
@import ../assets/sass/variables

// .activeCardBox
//   box-shadow: 0 2px 6px 0 $app-color

#GoToTopBtn
  position: fixed
  bottom: 20px
  right: 30px
  z-index: 99
  font-size: 18px
  border: none
  outline: none
  background-color: $app-color
  color: white
  cursor: pointer
  padding: 15px
  border-radius: 4px

#GoToTopBtn:hover
  background-color: #555

// .btnColor
//   color: white
//   background-color: $search-button-color !important
  // border-radius: 5px

.rightbarCard
  border-top-right-radius: 8px
  border-top-left-radius: 8px

.activeCardBox
    border-bottom: 6px solid $activeCard-border
    border-top-right-radius: 8px
    border-top-left-radius: 8px

.filterFeed
  height: 175px
  overflow: auto

.dialogBox
  margin-top: -20px

.vendorsCardClass
  max-height: 355px
  overflow: scroll


.SvgBarClass
  margin-top: 5px

.viewFilterButton
  height: 30px
  margin-top: -2px
  border-radius: 6px

.Rightbar_CardHeading
  font-size: 16px
  font-weight: 550

.Rightbar_card_content_subheading
  margin-top: 0px
  margin-bottom: 0px
  font-size: 16px

.Rightbar_card_content_heading
  font-size: 26px

.Rightbar_card_divider
  margin-top: 10px
  margin-bottom: 10px

.disordersCheckbox
  margin-top: 0px
  font-size: 14px
  font-weight: 200

.v-messages
  margin-top: -16px
</style>
