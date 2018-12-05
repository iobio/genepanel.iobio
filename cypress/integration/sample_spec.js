import Model from '../../client/app/models/Model';
var model = new Model();


describe("A Model calculator suite", function() {
 it("should add two numbers", function() {
   expect(model.addNos(3,5)).to.equal(8);
 })
})

describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true)
  })
})

function add(a,b){
     return a + b;
   }

describe("A calculator suite", function() {
 it("should add two numbers", function() {
   expect(add(3,5)).to.equal(8);
 })
})
