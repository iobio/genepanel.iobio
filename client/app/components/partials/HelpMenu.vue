<template>
  <span>
    <v-menu bottom offset-y style="color:black">
      <v-btn :class="launchedFromClin ? 'clinButtonColor' : '' " flat slot="activator">
        <v-icon v-if="!launchedFromClin">help</v-icon> Help
      </v-btn>
      <v-list>
        <v-list-tile @click="showDisclaimer=true">
          <v-list-tile-title>Disclaimer</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showAbout=true">
          <v-list-tile-title>About</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showSoftwareResources=true">
          <v-list-tile-title>Software and resources</v-list-tile-title>
        </v-list-tile>
        <v-divider style="height:2px"></v-divider>
        <v-list-tile >
          <v-list-tile-title><a href="http://iobio.io/tags/panel.iobio/" target="_iobio">Blog</a></v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
          <v-list-tile-title><a href="http://iobio.io/user_guides.html" target="_iobio">Tutorials</a></v-list-tile-title>
        </v-list-tile>

        <v-list-tile >
          <v-list-tile-title><a href="http://iobio.io" target=")iobio">iobio</a></v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
          <v-list-tile-title><a href="http://iobio.io/blog.html" target="_iobio">iobio Blog</a></v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
          <v-list-tile-title><a href="http://iobio.io/support.html" target=")iobio">Support the iobio project</a></v-list-tile-title>
        </v-list-tile>


      </v-list>
    </v-menu>

    <NavBarDialogs
      v-if="showDisclaimer"
      v-on:closeDialog="closeDisclaimer($event)"
      :HeadlineText="NavBarDialogData[0].HeadlineText"
      :ContentText="NavBarDialogData[0].Content"
      id="DisclaimerDialog">
    </NavBarDialogs>

    <NavBarDialogs
      v-if="showAbout"
      v-on:closeDialog="closeDisclaimer($event)"
      :HeadlineText="NavBarDialogData[1].HeadlineText"
      :ContentText="NavBarDialogData[1].Content"
      id="AboutDialog">
    </NavBarDialogs>

    <NavBarDialogs
      v-if="showSoftwareResources"
      v-on:closeDialog="closeDisclaimer($event)"
      :HeadlineText="NavBarDialogData[2].HeadlineText"
      :ContentText="NavBarDialogData[2].Content"
      id="SoftwareResourcesDialog">
    </NavBarDialogs>
  </span>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import NavBarDialogs from './NavBarDialogs.vue';
import NavBarDialogContent from '../../../data/NavBarDialogContent.json';

var model = new Model();

  export default {
    components: {
      'NavBarDialogs': NavBarDialogs,
    },
    props: {
      launchedFromClin: {
        type: Boolean
      }
    },
    data(){
      return {
        NavBarDialogData: null,
        showDisclaimer: false,
        showAbout: false,
        showSoftwareResources: false,
      }
    },
    mounted(){
      this.NavBarDialogData = NavBarDialogContent.data;
    },
    updated(){

    },
    watch: {
    },
    methods:{
      closeDisclaimer(){
        this.showDisclaimer = false;
        this.showAbout = false;
        this.showSoftwareResources = false;
      }
    }
  }
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import ../assets/sass/variables

#versions
  font-size: 14px
  color:  rgb(132,132,132)
  padding-top: 5px
  margin-bottom: 20px !important

  div
    margin-bottom: 0px !important
    clear: both

    .version-label
      width: 230px
      float: left
      padding-right: 5px
      clear: none
      padding-bottom: 7px
      color: #717171
      font-weight: 600
      font-size: 15px !important

    .number
      width: 220px
      float: left
      padding-bottom: 7px
      clear: none
      font-size: 14px !important

#credits
  font-size: 12px

.citation-title
  margin-bottom: 0px !important
  margin-top: 5px !important
  font-size: 12px
  color: #717171
  font-weight: 600
  clear: both

</style>
