const x2js = require('x2js');
const LZUTF8 = require('lzutf8');
// var brotli = require('brotli');
// const { StringDecoder } = require('string_decoder');


export default class Model {
  constructor() {
  this.x2js = new x2js();
  // this.lzwCompress = new lzwCompress();
  this.mergedGenes = null;
  this.selectedGenes = null;
}

  sumGenesBasedOnModeOfInheritance(items) {
    var obj ={};
    items.map(x=> {
      if(obj[x._modeOfInheritance]===undefined){
        obj[x._modeOfInheritance] = 1;
      }
      else if(obj[x._modeOfInheritance]!== undefined){
        obj[x._modeOfInheritance]++;
      }
    });

    var newArr = [];
    for(var i in obj){
      newArr.push(
        {
          _modeOfInheritance: i,
          _geneCount: 10,
          _numberOfDisorder: obj[i],
        }
      )
    }
    return newArr
  }

  filterItemsForModeOfInheritance(items){
    var arr =[];
    var obj= {};
    var tempArr = [];
    items.map(x=> {
      if(x._modeOfInheritance===""){
        arr.push({_modeOfInheritance:"Not provided", _geneCount: x._geneCount})
      }
      else if(x._modeOfInheritance.includes(",")) {
         tempArr = x._modeOfInheritance.split(", ");
         tempArr.map(y=> {
           arr.push({_modeOfInheritance: y, _geneCount: x._geneCount})
         });
         tempArr = [];
      }
      else {
        arr.push(x)
      }
    });
     return this.sumGenesBasedOnModeOfInheritance(arr);
  }

  filterItemsForDisorderNames(items){
    var disorderNames = [];
    items.map(x=>{
      disorderNames.push(x.Title);
    })
    return disorderNames;
  }

  promiseGetDiseases(searchTerm, conceptId, HierarchyRelations, HierarchyParentIds) {
  var me = this;
  return new Promise(function(resolve, reject) {
    if(conceptId!==""){
      var searchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=medgen"
                      + '&usehistory=y&retmode=json'
                      + '&term='
                      + '(((' + conceptId +'[ConceptId]) AND "in gtr"[Filter])) AND (("conditions"[Filter] OR "diseases"[Filter]))';
      // console.log("searchUrl", searchUrl)

      $.ajax( searchUrl )
      .done(function(data) {
        if (data["esearchresult"]["ERROR"] != undefined) {
          msg = "disease search error: " + data["esearchresult"]["ERROR"];
          reject(msg);
        } else {
          var webenv = data["esearchresult"]["webenv"];
          var queryKey = data["esearchresult"]["querykey"];

          var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gtr" + "&query_key=" + queryKey + "&WebEnv=" + webenv + "&usehistory=y"
          $.ajax( summaryUrl )
          .done(function(data) {
            if (data.childNodes.length < 2) {
              if (data.esummaryresult && data.esummaryresult.length > 0) {
                sumData.esummaryresult.forEach( function(message) {
                });
              }
              resolve({'searchTerm': searchTerm, 'diseases': []})
            } else {
              var results = me.x2js.xml2js(data.childNodes[1].innerHTML);
              if (results.ERROR) {
                if (results.ERROR == 'Empty result - nothing todo') {
                  resolve({'searchTerm': searchTerm, 'diseases': []});
                  // resolve({'searchTerm': searchTerm, 'diseases': [{ConceptId:"C0795864", Title:"Smith-Magenis syndrome"}]});
                } else {
                  reject("Unable to parse disease summary results." + results.ERROR);
                }
              } else {
                var diseases = [];
                diseases.push(results.DocumentSummarySet.DocumentSummary)
                if(HierarchyParentIds.includes(conceptId)){
                  var i = HierarchyParentIds.indexOf(conceptId);
                  HierarchyRelations[i].children.map(x=>{
                    diseases.push({
                      ConceptId: x.id,
                      Title: x.name,
                      ConceptMeta: x.ConceptMeta
                    })
                  })
                }

                //To get all the conditions even of the children
                // var queue = [];
                // queue.push(conceptId);
                // while(queue.length>0){
                //   var current = queue.shift();
                //   if(HierarchyParentIds.includes(current)){
                //     var i = HierarchyParentIds.indexOf(current);
                //     HierarchyRelations[i].children.map(x=>{
                //       diseases.push({
                //         ConceptId: x.id,
                //         Title: x.name,
                //         ConceptMeta: x.ConceptMeta
                //       })
                //       queue.push(x.id);
                //     })
                //   }
                // }


                resolve({'searchTerm': searchTerm, 'diseases': Array.isArray(diseases) ? diseases : diseases});
              }
            }
          })
          .fail(function() {
            var msg = "Error in medgen disease summary. ";
            reject(msg);
          })
        }

      })
      .fail(function(data) {
          var msg = "Error in medgen disease search. ";
          reject(msg);
      })
    }
    else if(conceptId===""){
      var searchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=medgen"
                + '&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09&usehistory=y&retmode=json'
                + '&term='
                + '(((' + searchTerm +'[title]) AND "in gtr"[Filter])) AND (("conditions"[Filter] OR "diseases"[Filter]))';

      // console.log("search url with text", searchUrl)
      $.ajax( searchUrl )
      .done(function(data) {

        if (data["esearchresult"]["ERROR"] != undefined) {
          msg = "disease search error: " + data["esearchresult"]["ERROR"];
          reject(msg);
        } else {
          var webenv = data["esearchresult"]["webenv"];
          var queryKey = data["esearchresult"]["querykey"];

          var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gtr" + "&query_key=" + queryKey + "&WebEnv=" + webenv + "&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09"

          $.ajax( summaryUrl )
          .done(function(data) {
            if (data.childNodes.length < 2) {
              if (data.esummaryresult && data.esummaryresult.length > 0) {
                sumData.esummaryresult.forEach( function(message) {
                });
              }
              resolve({'searchTerm': searchTerm, 'diseases': []})
            } else {
              var results = me.x2js.xml2js(data.childNodes[1].innerHTML);
              if (results.ERROR) {
                if (results.ERROR == 'Empty result - nothing todo') {
                  resolve({'searchTerm': searchTerm, 'diseases': []});
                } else {
                  reject("Unable to parse disease summary results." + results.ERROR);
                }
              } else {
                var diseases = results.DocumentSummarySet.DocumentSummary;
                resolve({'searchTerm': searchTerm, 'diseases': Array.isArray(diseases) ? diseases : [diseases]});
              }
            }
          })
          .fail(function() {
            var msg = "Error in medgen disease summary. ";
            reject(msg);
          })
        }

      })
      .fail(function(data) {
          var msg = "Error in medgen disease search. ";
          reject(msg);
      })
    }
  })
}

promiseGetGenePanels(disease) {
  var me = this;
  return new Promise(function(resolve, reject) {



    var searchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gtr"
                    + '&usehistory=y&retmode=json'
                    + '&term='
                    +  disease.ConceptId +'[DISCUI]&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09';
                    // console.log("url in promiseGetGenePanels", searchUrl)

    $.ajax( searchUrl )
    .done(function(data) {
      if (data["esearchresult"]["ERROR"] != undefined) {
        msg = "gene panel search error: " + data["esearchresult"]["ERROR"];
        reject(msg);
      } else {
        var webenv = data["esearchresult"]["webenv"];
        var queryKey = data["esearchresult"]["querykey"];

        var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gtr" + "&query_key=" + queryKey + "&retmode=json&WebEnv=" + webenv + "&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09";
        // console.log("summaryUrl in getpanels", summaryUrl)

        $.ajax( summaryUrl )
        .done(function(sumData) {
          if (sumData.result == null) {
            if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
              sumData.esummaryresult.forEach( function(message) {
              });
            }
            resolve({'disease': disease, 'genePanels': []})
          } else {
            var genePanels = [];
            for (var key in sumData.result) {
              if (key != 'uids') {
                genePanels.push(sumData.result[key]);
              }
            }
            resolve({'disease': disease, 'genePanels': genePanels});
          }
        })
        .fail(function() {
          var msg = "Error in gtr summary. ";
          console.log(msg);
          reject(msg);
        })
      }

    })
    .fail(function(data) {
        var msg = "Error in gtr search. ";
        console.log(msg)
        reject(msg);
    })

  })

}

promiseGetGenePanelsWithAPI(disease){
  const decoder = new StringDecoder('utf8');

  return new Promise(function(resolve, reject){
    var diseaseTitle = encodeURIComponent(disease.Title.trim());
    fetch(`http://localhost:4046/genepanels/?term=${diseaseTitle}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.Item.genePanels.data)
        console.log(data.Item)
        var output = data.Item.genePanels.data;

        // const cent = Buffer.from(data.Item.genePanels.data);
        // // console.log(decoder.write(cent));
        // var x = decoder.write(cent)
        //
        // var obj = JSON.parse(x);
        // console.log(obj)

        const buf = new Buffer(output);
        console.log(buf)


        var decompressed = LZUTF8.decompress(buf, {"outputEncoding" : "String"})
        console.log(decompressed)
        var obj = JSON.parse(decompressed);
        console.log(obj)
        resolve({'disease': disease, 'genePanels': obj.genePanels})
      })
  })
}

promiseGetGenePanelsUsingSearchTermEsearch(disease){
  return new Promise(function(resolve, reject) {
    var diseaseTitle = encodeURIComponent(disease.Title.trim());
    var searchUrl = `http://localhost:4048/esearch-wrapper/?diseaseName=${diseaseTitle}%5D&retmax=99&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09`
    $.ajax(searchUrl)
      .done(function(data){
        console.log(data)
      })
  });
}

promiseGetGenePanelsUsingSearchTerm(disease) {
  var me = this;
  return new Promise(function(resolve, reject) {

  var diseaseTitle = encodeURIComponent(disease.Title.trim());
    var searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gtr&retmode=json&term=${diseaseTitle}%5D&retmax=99&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09`
    var XMLsearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gtr&retmode=xml&term=${diseaseTitle}%5D&retmax=99&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09`

    setTimeout(()=>{
      $.ajax( searchUrl )
      .done(function(data) {
        setTimeout(()=>{
          // If using xml url
          // var r = data.childNodes[1].innerHTML
          // r = `<esearchresult>${r}</esearchresult>`
          // data = me.x2js.xml2js(r);

          if (data["esearchresult"]["ERROR"] != undefined) {
            msg = "gene panel search error: " + data["esearchresult"]["ERROR"];
            reject(msg);
          } else {
            var webenv = data["esearchresult"]["webenv"];
            var queryKey = data["esearchresult"]["querykey"];
            // If using XML url
            // var webenv = data["esearchresult"]["WebEnv"];
            // var queryKey = data["esearchresult"]["QueryKey"];
            var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gtr" + "&query_key=" + queryKey + "&retmode=json&retmax=99&WebEnv=" + webenv + "&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09"
            var xmlSummaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gtr" + "&query_key=" + queryKey + "&retmode=xml&WebEnv=" + webenv + "&usehistory=y&api_key=2ce5a212af98a07c6e770d1e95b99a2fef09"
            $.ajax( summaryUrl )
            .done(function(sumData) {
              if (sumData.result == null) {
                if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
                  sumData.esummaryresult.forEach( function(message) {
                  });
                }
                resolve({'disease': disease, 'genePanels': []})
              } else {
                var genePanels = [];
                for (var key in sumData.result) {
                  if (key != 'uids') {
                    genePanels.push(sumData.result[key]);
                  }
                }
                // console.log("{'disease': disease, 'genePanels': genePanels}", {'disease': disease, 'genePanels': genePanels})
                resolve({'disease': disease, 'genePanels': genePanels});
              }
            })
            .fail(function(err) {
              var msg = "Error in gtr summary. ";
              // console.log(msg);
              console.log(err)
              // reject(msg);
              resolve({'disease': disease, 'genePanels': []})
            })
          }

        },200)
      })
      .fail(function(data) {
          var msg = "Error in gtr search. ";
          console.log(msg)
          reject(msg);
      })
    }, 200);



  })

}


processGenePanelData(genePanels) {
  var me = this;

  genePanels.forEach(function(genePanel) {

    genePanel._genes = genePanel.analytes
    .filter(function(analyte) {
      return analyte.analytetype.toUpperCase() == 'GENE';
    });

    genePanel._geneNames = genePanel._genes.map(function(gene,idx) {
      return gene.name;
    })
    .join(" ");

    genePanel._conditionNames = genePanel.conditionlist.map(function(condition) {
      return condition.name;
    })
    .join(", ");

  })

  var filteredGenePanels = genePanels.filter(function(genePanel) {
    return genePanel._genes.length > 0;
  });
  return filteredGenePanels
}


processDiseaseData(diseases) {
  var me = this;
  var filteredDiseases = diseases.filter(function(disease) {
    if(disease.genePanels){
      return disease.genePanels.length>0;
    }
    else return;
  })

  let rowNumber = 1;
  filteredDiseases.forEach(function(disease) {
    disease._rowNumber = rowNumber++;
    disease._genePanelCount = disease.genePanels.length;


    var mergedGenes = me.mergeGenesAcrossPanels(disease.genePanels);
    disease._geneCount = mergedGenes.length;
    disease._geneNames = mergedGenes.map(function(gene) {
      return gene.name;
    })
    .join(" ")

    disease._omim = (disease.ConceptMeta && disease.ConceptMeta.OMIM && disease.ConceptMeta.OMIM.MIM) ? disease.ConceptMeta.OMIM.MIM : "";

    disease._modeOfInheritance = "";
    if (disease.ConceptMeta && disease.ConceptMeta.ModesOfInheritance) {
      for (var key in disease.ConceptMeta.ModesOfInheritance) {
        if (key == 'ModeOfInheritance') {
          var modes = Array.isArray(disease.ConceptMeta.ModesOfInheritance[key]) ? disease.ConceptMeta.ModesOfInheritance[key] : [disease.ConceptMeta.ModesOfInheritance[key]];
          modes.forEach(function(mode) {
            if (disease._modeOfInheritance.length > 0) {
              disease._modeOfInheritance += ", ";
            }
            disease._modeOfInheritance += mode.Name;
          })
        }
      }
    }
  })
  return filteredDiseases;
}


getGenePanelVendors(genePanels) {
  let vendors = {};
  genePanels.forEach(function(gp) {
    vendors[gp.offerer] = true;
  })
  return Object.keys(vendors).sort();
}


mergeGenePanelsAcrossDiseases(diseases) {
  var me = this;
  var genePanelMap = {};
//Find a way to pass the search terms here...
  diseases.forEach((disease)=> {
    disease.genePanels.forEach((genePanel)=> {
      genePanel["searchTermArray"] = disease.searchTermArray;
      genePanel["searchTermIndex"] = disease.searchTermIndex;
      genePanel["_uid"] = disease._uid;
      genePanel["disease"] = disease

    })
  })

  var diseaseTempArr = [];
  diseases.forEach((disease)=> {
    disease.genePanels.forEach((genePanel)=> {
      diseaseTempArr.push(genePanel)
    })
  })

  for(var i=0; i<diseaseTempArr.length; i++){
    for(var j=diseaseTempArr.length-1; j>i; j--){
      if(diseaseTempArr[i].id ===diseaseTempArr[j].id){
        diseaseTempArr[i].searchTermArray = [...diseaseTempArr[i].searchTermArray, ...diseaseTempArr[j].searchTermArray];
        diseaseTempArr[i].searchTermIndex = [...diseaseTempArr[i].searchTermIndex, ...diseaseTempArr[j].searchTermIndex];
        diseaseTempArr[i].searchTermArray = Array.from(new Set(diseaseTempArr[i].searchTermArray))
        diseaseTempArr[i].searchTermIndex = Array.from(new Set(diseaseTempArr[i].searchTermIndex))

      }
    }
  }

  diseaseTempArr.forEach((genePanel)=>{
    var theGenePanel = genePanelMap[genePanel.id];
    if (theGenePanel == null) {
      genePanel._diseases = {};
      theGenePanel = genePanel;
      genePanelMap[genePanel.id] = theGenePanel;
    }
    theGenePanel._diseases[genePanel._uid] = genePanel.disease;
  })

  var mergedGenePanels = [];
  for (var key in genePanelMap) {
    var genePanel = genePanelMap[key];
    genePanel._diseaseNames = me.hashToSimpleList(genePanel._diseases, "Title", ", ");
    genePanel._diseaseCount = Object.keys(genePanel._diseases).length;
    genePanel._rowNumber = mergedGenePanels.length+1;
    mergedGenePanels.push(genePanel);
  }
  return mergedGenePanels;
}



mergeGenesAcrossPanels(genePanels) {
    var me = this;
    var geneMap = {};
    var tempGeneArr = [];

    genePanels.forEach(function(genePanel) {
      genePanel._genes.forEach(function(gene, i) {
        gene["searchTermArray"] = genePanel.searchTermArray;
        gene["searchTermIndex"] = genePanel.searchTermIndex;
        var theGene = geneMap[gene.geneid];
        if (theGene == null) {
          gene._genePanels = {};
          gene._conditions = {};
          gene._diseases = {};
          theGene = gene;
          geneMap[gene.geneid] = theGene;
        }

        theGene._genePanels[genePanel.id] = genePanel;
        for (var uid in genePanel._diseases) {
          theGene._diseases[uid] = genePanel._diseases[uid];
        }
        genePanel.conditionlist.forEach(function(condition) {
          theGene._conditions[condition.cuid] = condition;
        })

      })
    })

    this.mergedGenes = [];
    var b =[];
    for (var key in geneMap) {
      var gene = geneMap[key];
      b.push(key);
      gene._genePanelNames = me.hashToSimpleList(gene._genePanels, "testname", ", ");
      gene._genePanelCount = Object.keys(gene._genePanels).length;

      gene._diseaseNames = me.hashToSimpleList(gene._diseases, "Title", ", ");
      gene._diseaseCount = Object.keys(gene._diseases).length;

      gene._conditionNames = me.hashToSimpleList(gene._conditions, "name", ", ");
      gene._rowNumber      = me.mergedGenes.length+1;

      me.mergedGenes.push(gene);
    }
    this.mergedGenes.sort(function (a, b) {
      return a.geneid - b.geneid;
    });
    return this.mergedGenes;

  }

  formatGeneRecs(genes) {
    var me = this;
    const skipFields = {_genePanels: true, _diseases: true, analytetype: true};

    var geneRecs = genes.map(function(gene, idx) {
      var hdr = "";
      if (idx == 0) {
        for (var key in gene) {
          if (!skipFields[key]) {
            if (hdr.length > 0) {
              hdr += "\t";
            }
            hdr += key;
          }
        }
        hdr += "\n";
      }
      var rec = "";
      for (var key in gene) {
        if (!skipFields[key]) {
          if (rec.length > 0) {
            rec += "\t";
          }
          rec += gene[key];
        }
      }

      return hdr + rec;
    })
    .join("\n");
    return geneRecs;
  }


  getGeneBarChartData(genes, width, launchedFromClinProps) {
    if(width===undefined || width===0 || launchedFromClinProps){
      width = 850;
    }
    // Sort genes by gene panel count (descending order)
    // Sort genes by gene panel count (descending order)
    var sortedGenes = genes.sort(function(a,b) {
      if (a._genePanelCount == b._genePanelCount) {
        return b._diseaseCount - a._diseaseCount;
      } else {
        return b._genePanelCount - a._genePanelCount ;
      }
    })
    var multiplicationFactor = Math.abs((width - 770)/sortedGenes[0]._genePanelCount);
    var svgWidth = (sortedGenes[0]._genePanelCount * multiplicationFactor)+50;
    var firstBarWidth = sortedGenes[0]._genePanelCount * multiplicationFactor;
      return sortedGenes.map(function(gene, idx) {
        return {
              key: idx,
              name: gene.name,
              geneid: gene.geneid,
              value: +gene._genePanelCount,
              diseases: gene._diseaseCount,
              conditions: gene._diseaseNames,
              // searchTerm: gene.searchTerm,
              searchTermArray: gene.searchTermArray,
              searchTermIndex: gene.searchTermIndex,
              isAssociatedGene: false,
              omimSrc: `https://www.ncbi.nlm.nih.gov/omim/?term=${gene.name}`,
              medGenSrc: `https://www.ncbi.nlm.nih.gov/medgen/?term=${gene.name}`,
              geneCardsSrc: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.name}`,
              ghrSrc: `https://ghr.nlm.nih.gov/gene/${gene.name}`,
              clinGenLink: `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${gene.name}`,
              geneIdLink: `https://www.ncbi.nlm.nih.gov/gene/${gene.geneid}`,
              htmlData: `<svg width="${svgWidth}" height="18" xmlns="http://www.w3.org/2000/svg">
                            <rect class="genepanelsRect"
                                x="1" y="1" rx="5" width="${gene._genePanelCount * multiplicationFactor}" height="16"/>
                            <rect class="grayRect"
                                x="${(gene._genePanelCount * multiplicationFactor)+3}" y="1" rx="5" width="${(firstBarWidth - (gene._genePanelCount * multiplicationFactor))}" height="16"/>
                            <text class="tableRectBarText"
                                x="${(firstBarWidth + 19)}" y="14" font-size="13">${gene._genePanelCount}</text>
                        </svg>`,
            };
      });

  }


  getIndividualGenes(genes) {
    var sortedGenes = genes.sort(function(a,b) {
      if (a._genePanelCount == b._genePanelCount) {
        return b._diseaseCount - a._diseaseCount;
      } else {
        return b._genePanelCount - a._genePanelCount ;
      }
    })
      return sortedGenes.map(function(gene, idx) {
        return {
              key: idx,
              name: gene.name,
              geneid: gene.geneid,
              value: +gene._genePanelCount,
              diseases: gene._diseaseCount,
              conditions: gene._diseaseNames,
              // searchTerm: gene.searchTerm,
              searchTermArray: gene.searchTermArray,
              searchTermIndex: gene.searchTermIndex,
              isAssociatedGene: false,
              omimSrc: `https://www.ncbi.nlm.nih.gov/omim/?term=${gene.name}`,
              medGenSrc: `https://www.ncbi.nlm.nih.gov/medgen/?term=${gene.name}`,
              geneCardsSrc: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.name}`,
              ghrSrc: `https://ghr.nlm.nih.gov/gene/${gene.name}`,
              clinGenLink: `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${gene.name}`,
              geneIdLink: `https://www.ncbi.nlm.nih.gov/gene/${gene.geneid}`,
            };
      });

  }


  binarySearchFunction(array, targetValue){
    var min = 0;
    var max = array.length - 1;
    var guess;

    while(min <= max) {
        guess = Math.floor((max + min) / 2);

        if (array[guess] === targetValue) {
            return true;
        }
        else if (array[guess] < targetValue) {
            min = guess + 1;
        }
        else {
            max = guess - 1;
        }

    }

    return false;
  }

  getHaploInsufficiencyScore(gene){
    var genesScr = [
      {
        name: "ACP5",
        score: "sufficient evidence"
      },
      {
        name: "ALX1",
        score: "some evidence"
      },
      {
        name: "AVP",
        score: "some evidence"
      },
      {
        name: "BRAC2",
        score: "sufficient evidence"
      },
      {
        name: "CPT2",
        score: "minimal evidence"
      },
      {
        name: "DHODH",
        score: "some evidence"
      },
      {
        name: "EYA1",
        score: "some evidence"
      },
      {
        name: "POLR1D",
        score: "sufficient evidence"
      },
      {
        name: "SF3B4",
        score: "no evidence"
      },
      {
        name: "TCOF1",
        score: "sufficient evidence"
      }
    ];
    for(var i=0; i<genesScr.length; i++){
      if(gene === genesScr[i].name){
        return genesScr[i].score;
      }
    }
  }

  getClinGenFlag(data){
    var curatedGenes = [
      "ACP5", "ALX1", "AVP", "BRAC2", "CPT2", "DHODH", "EYA1", "POLR1D", "SF3B4", "TCOF1"
    ];
    data.map((x,i)=>{
    if(this.binarySearchFunction(curatedGenes, x.name)){
      x["clinGen"] = {
        val: true
      };
      x["haploScore"]= this.getHaploInsufficiencyScore(x.name);
      x["locationImgSrc"] = `<img src="https://ghr.nlm.nih.gov/gene/${x.name}/location.png">`
    }
    else {
      x["clinGen"] = {
        val: false
      };;
    }
  })

  return data;
  }

  calculateMedian(values){
    values.sort(function(a,b){
      return a-b;
      });

      if(values.length ===0) return 0

      var half = Math.floor(values.length / 2);

      if (values.length % 2)
      return values[half];
      else
      return (values[half - 1] + values[half]) / 2.0;
  }

  getGeneHistogramData(genes) {

    var histoMap = {};
    genes.forEach(function(gene) {
      var geneCount = histoMap[gene._genePanelCount];
      if (geneCount == null) {
        geneCount = 0;
      }
      geneCount++;
      histoMap[gene._genePanelCount] = parseInt(geneCount);
    })

    var histo = [];
    for (let gpCount in histoMap) {
      let geneCount = histoMap[gpCount];
      histo.push([parseInt(gpCount), geneCount])
    }

    return histo.sort(function(a,b) {
      return b[1] - a[1];
    })
  }

  hashToSimpleList(map, fieldName, delim=" ") {
    var me = this;
    let buf = "";
    for (var key in map) {
      var theObject = map[key];
      if (buf.length > 0) {
        buf += delim;
      }
      buf += theObject[fieldName];
    }
    return buf;
  }

  capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
