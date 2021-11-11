const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const readFile = '../../../Desktop/nr_product_tags.csv';
const results = [];
const completeTags = [];

const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'handle', title: 'handle'},
    {id: 'width', title: 'width'},
    {id: 'material', title: 'material'},
    {id: 'color', title: 'color'},
  ]
});

fs.createReadStream(readFile)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(result => {
      let finalLine = {};
      let parsedTags = [];
      finalLine["handle"] = result.Handle;
      let tags = result.Tags.split(',');
      tags.forEach(tag => parsedTags.push((tag.replace(/\s/g, ''))));
      parsedTags.forEach(tag => {
        if (tag.substring(0,5) === 'Width') {finalLine["width"] = tag.replace('Width_', '')};
        if (tag.substring(0,8) === 'Material') {finalLine["material"] = tag.replace('Material_', '')};
        if (tag.substring(0,5) === 'Color') {finalLine["color"] = tag.replace("Color_", "")};
      });
      completeTags.push(finalLine);
    })
    console.log(completeTags)
    csvWriter.writeRecords(completeTags).then(() => console.log('complete'))
  });

