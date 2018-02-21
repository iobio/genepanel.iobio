<!-- <template>
      <v-app>
          <v-select
                  label="Food Type"
                  :items="['vegetable', 'meat', 'fruit']"
                  v-model="search"
                    multiple
          ></v-select>

          <v-data-table
                  :headers="headers"
                  :items="food"
                  :search="search"
                  :custom-filter="customFilter"
          > -->
              <!-- <template slot="items" slot-scope="{ item }">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.calories }}</td>
              </template> -->
          <!-- </v-data-table>
      </v-app>
</template> -->




<template>
  <v-card>
    <p id="demo">Nutrition</p>
    <v-card-title>

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
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
      >
      <template slot="items" slot-scope="props">
        <!-- <td>
          <v-edit-dialog
            lazy
          > {{ props.item.name }}
            <v-text-field
              slot="input"
              label="Edit"
              v-model="props.item.name"
              single-line
              counter
              :rules="[max25chars]"
            ></v-text-field>
          </v-edit-dialog>
        </td> -->
        <td class="text-xs-right">{{ props.item.name }}</td>
        <td class="text-xs-right abcd">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="text-xs-right">{{ props.item.sodium }}</td>
        <td class="text-xs-right">{{ props.item.calcium }}</td>
        <td class="text-xs-right">
          <v-edit-dialog
            @open="tmp = props.item.iron"
            @save="props.item.iron = tmp || props.item.iron"
            large
            lazy
          >
            <div>{{ props.item.iron }}</div>
            <div slot="input" class="mt-3 title">Update Iron</div>
            <v-text-field
              slot="input"
              label="Edit"
              v-model="tmp"
              single-line
              counter
              autofocus
              :rules="[max25chars]"
            ></v-text-field>
          </v-edit-dialog>
        </td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>

 <script>
 import d3 from 'd3'

//  export default {
//    data() {
//     return {
//         food: [
//             { name: 'Bakchoi', type: 'vegetable', calories: 100 },
//             { name: 'Pork', type: 'meat', calories: 200 },
//             { name: 'Chicken Thigh', type: 'meat', calories: 300 },
//             { name: 'Watermelon', type: 'fruit', calories: 10 },
//         ],
//         headers: [
//             { text: 'Name', align: 'left', value: 'name' },
//             { text: 'Food Type', align: 'left', value: 'type' },
//             { text: 'Calories', align: 'left', value: 'calories' },
//         ],
//         search: '',
//
//     };
// },
// methods: {
//     customFilter(items, search, filter) {
//       // alert("sjkskhskjs")
//         console.log("search ", search);
//         //search = search.toString().toLowerCase();
//       var tempArr = [];
//       if(search.length>0){
//         console.log("true")
//         for(var i=0; i<search.length; i++){
//           for(var j=0; j<items.length; j++){
//             console.log("items[j].type", items[j].type , " and  search[i]", search[i] )
//             if( search[i] === items[j].type ){
//               tempArr.push(items[j]);
//
//             }
//           }
//         }
//
//         items = tempArr;
//         return items;
//       }
//       else {
//         return items;
//       }

        //return items.filter(row => filter(row["type"], search));

//     }
// }
//  }
  export default {
    methods: {
      doSomething(){
        var x = d3.select(".abcd")
            .append('svg')
            .attr("heigth", 500)
            .attr("width", 500)
          .append('rect')
              .attr('width', 100)
              .attr('height', 30)
              .style('fill', "red");

        return x;
      }
    },
    data () {
      return {
        max25chars: (v) => v.length <= 25 || 'Input too long!',
        tmp: '',
        search: '',
        pagination: {},
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Sodium (mg)', value: 'sodium' },
          { text: 'Calcium (%)', value: 'calcium' },
          { text: 'Iron (%)', value: 'iron' }
        ],
        items: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: '<strong>sbdhsdb</strong>',
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: document.getElementsByClassName('abcd').innerHTML = '<strong>dshgsnsh</strong>',
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            sodium: 129,
            calcium: '8%',
            iron: '1%'
          },
          // {
          //   value: false,
          //   name: 'Eclair',
          //   calories: 262,
          //   fat: 16.0,
          //   carbs: 23,
          //   protein: 6.0,
          //   sodium: 337,
          //   calcium: '6%',
          //   iron: '7%'
          // },
          // {
          //   value: false,
          //   name: 'Cupcake',
          //   calories: 305,
          //   fat: 3.7,
          //   carbs: 67,
          //   protein: 4.3,
          //   sodium: 413,
          //   calcium: '3%',
          //   iron: '8%'
          // },
          // {
          //   value: false,
          //   name: 'Gingerbread',
          //   calories: 356,
          //   fat: 16.0,
          //   carbs: 49,
          //   protein: 3.9,
          //   sodium: 327,
          //   calcium: '7%',
          //   iron: '16%'
          // },
          // {
          //   value: false,
          //   name: 'Jelly bean',
          //   calories: 375,
          //   fat: 0.0,
          //   carbs: 94,
          //   protein: 0.0,
          //   sodium: 50,
          //   calcium: '0%',
          //   iron: '0%'
          // },
          // {
          //   value: false,
          //   name: 'Lollipop',
          //   calories: 392,
          //   fat: 0.2,
          //   carbs: 98,
          //   protein: 0,
          //   sodium: 38,
          //   calcium: '0%',
          //   iron: '2%'
          // },
          // {
          //   value: false,
          //   name: 'Honeycomb',
          //   calories: 408,
          //   fat: 3.2,
          //   carbs: 87,
          //   protein: 6.5,
          //   sodium: 562,
          //   calcium: '0%',
          //   iron: '45%'
          // },
          // {
          //   value: false,
          //   name: 'Donut',
          //   calories: 452,
          //   fat: 25.0,
          //   carbs: 51,
          //   protein: 4.9,
          //   sodium: 326,
          //   calcium: '2%',
          //   iron: '22%'
          // },
          // {
          //   value: false,
          //   name: 'KitKat',
          //   calories: 518,
          //   fat: 26.0,
          //   carbs: 65,
          //   protein: 7,
          //   sodium: 54,
          //   calcium: '12%',
          //   iron: '6%'
          // }
        ]
      }
    }
  }
</script>



<!-- <template>
  <v-app id="inspire">
    {{ selected }}
    <v-data-table
        v-model="selected"
        v-bind:headers="headers"
        v-bind:items="items"
        select-all
        v-bind:pagination.sync="pagination"
        item-key="name"
        class="elevation-1"
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
            @click="changeSort(header.value)"
          >
            <v-icon>arrow_upward</v-icon>
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
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.calories }}</td>
          <td class="text-xs-right">{{ props.item.fat }}</td>
          <td class="text-xs-right">{{ props.item.carbs }}</td>
          <td class="text-xs-right">{{ props.item.protein }}</td>
          <td class="text-xs-right">{{ props.item.sodium }}</td>
          <td class="text-xs-right">{{ props.item.calcium }}</td>
          <td class="text-xs-right">{{ props.item.iron }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
export default {
  data(){
      return {
        pagination: {
          sortBy: 'name'
        },
        selected: [],
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            value: 'name'
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Sodium (mg)', value: 'sodium' },
          { text: 'Calcium (%)', value: 'calcium' },
          { text: 'Iron (%)', value: 'iron' }
        ],
        items: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            sodium: 129,
            calcium: '8%',
            iron: '1%'
          },
          {
            value: false,
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            sodium: 337,
            calcium: '6%',
            iron: '7%'
          },
          {
            value: false,
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            sodium: 413,
            calcium: '3%',
            iron: '8%'
          },
          {
            value: false,
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            sodium: 327,
            calcium: '7%',
            iron: '16%'
          },
          {
            value: false,
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            sodium: 50,
            calcium: '0%',
            iron: '0%'
          },
          {
            value: false,
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            sodium: 38,
            calcium: '0%',
            iron: '2%'
          },
          {
            value: false,
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            sodium: 562,
            calcium: '0%',
            iron: '45%'
          },
          {
            value: false,
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            sodium: 326,
            calcium: '2%',
            iron: '22%'
          },
          {
            value: false,
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            sodium: 54,
            calcium: '12%',
            iron: '6%'
          }
        ]
      }
    },
    methods: {
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
      }
    }
}
</script> -->
