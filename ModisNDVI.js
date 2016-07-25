var srL5 = ee.ImageCollection("LEDAPS/LT5_L1T_SR"),
    srL8 = ee.ImageCollection("LANDSAT/LC8_SR"),
    srL7 = ee.ImageCollection("LEDAPS/LE7_L1T_SR");
// region:clifornia 
// reduce the image set to low cloud cover collections and take the median 

var medfun = function(dataset, year, imgCol, band ){
  var akey= 'ft:17aT9Ud-YnGiXdXEJUyycH2ocUqreOeKGbzCkUw';
  
  // get the 1st list of the multipolygon (main boundary)
  var caBd = ee.Geometry.Polygon(ee.FeatureCollection(akey)//,'geometry');
                .filterMetadata('id','equals','CA')
                .geometry()
                .coordinates()
                .get(0));
                
  // filter by data to grap the image collection of each year 
  
  var subL = imgCol.filterDate(year+'-01-01', year+'-12-13')
                  .filterBounds(caBd)
                  .select(band);

  print('subL', subL);
  Map.centerObject(caBd,6);
  // Map.addLayer(caBd, {'color':'f6546a', 'Opacity':100}, 'County Boundary');
  // Map.addLayer(subL, {opacity:0.95, min:-2000, max:11000,bands:['B4','B3','B2'],gamma: 1.6}, 'median');
  
  //get the median of the yearly image stack
  var medLca = subL.median().clip(caBd);

  print(medLca);
  // show the median image 
  Map.addLayer(medLca, {opacity:1, min:-2000, max:11000,gamma: 1.6}, 'median');
  
 // set the output paramter and export image to g-drive
  var exPar = {
            image: medLca,
            description: dataset + year + band,
            crs:'EPSG:3310',
            scale: 30,
            //crsTransform:[231.65635826395825,0,-20015109.353988,0,-231.65635826395834,10007554.676994],
            folder:'summerL5',
            maxPixels: 5000000000, 
            region: caBd 
            };
    
    exPar.description=dataset + year + '_' + band.toLowerCase(); //input is string
    exPar.region=caBd; 
    exPar.fileNamePrefix= dataset + '_' + year + band.toLowerCase(),
    print(exPar.fileNamePrefix);
    print(exPar.region);
    
    Export.image.toDrive(exPar);
};

var dataname = 'srL5';
var imgCol = srL5;
var bands =['B1','B2','B3','B4','B5','B7', 'QA']; // for landsat 5 and 7
// var bands =['B2','B3','B4','B5','B6','B7']; // for landsat 7

// execute the funciton 
// for (var j=0; j<bands.length; j++){
//   // print(dataname, i, bands[j])
//   medfun('srL7', 2012, srL7, bands[j]);
//   }

for (var i = 2013; i < 2015; ++ i){
  for (var j=0; j<bands.length; j++){
  print(dataname, i, bands[j])
  medfun(dataname, i, imgCol, bands[j]);
  }
}
