## Import modis 8-day 250-meter-resolution 
var mod8day = ee.ImageCollection("MODIS/MYD09Q1"),
    geometry = /* color: 0B4A8B */ee.Geometry.Point([-120.1025390625, 36.73888412439431]);

## Set a function to 
var exFun = function(dateS, dateE, filenameS1, filenameS2, filenameS3, filenameS4 ) {
    //calfornia state boundary 
    var cabound = 'ft:17aT9Ud-YnGiXdXEJUyycH2ocUqreOeKGbzCkUw';
    // var cabound = 'ft:175UPi_xi5DWyt7HFT6lnN5f1KfNxfBODJuHQ3M7J';
    var caBd0 = ee.FeatureCollection(cabound)//,'geometry');
                  .filterMetadata('id','equals','CA');
                  // .filterBounds(s1);
    // print(caBd.toGeoJSON());

    var caBd = ee.Geometry.Polygon(caBd0.geometry().coordinates().get(0));   
    
    Map.centerObject(caBd,5);

    var sq1 = caBd.intersection(ee.Geometry.Rectangle([-124.50,39.05,-119.50,42.05]));
    var sq2 = caBd.intersection(ee.Geometry.Rectangle([-124.00,36.55,-116.50,39.05])); 
    var sq3 = caBd.intersection(ee.Geometry.Rectangle([-122.00,34.55,-114.00,36.55])); 
    var sq4 = caBd.intersection(ee.Geometry.Rectangle([-121.00,32.35,-114.00,34.55])); 
    
    var mod = mod8day.filterDate(dateS, dateE)
                    .filterBounds( caBd );

    Map.addLayer(caBd, {'color':'f6546a', 'Opacity':100}, 'County Boundary');
    // Map.addLayer(mod, {min:100, max:16000}, 'modisCA');
    
    var viFun = function(img){
      var r = img.select('sur_refl_b01').multiply(0.0001);
      var nir = img.select('sur_refl_b02').multiply(0.0001);
      var vi = nir.subtract(r).divide(nir.add(r));
      return vi.set('system:time_start', img.get('system:time_start'));
        };

    var caBdg = caBd0.geometry();
    var ndvi = mod.map(viFun)
                .map(function(feature, caBdg)
                      {return feature.clip(caBd).rename(['ndvi']);      
                      });
    // .set('system:time_start', feature.get('system:time_start')); 
    print('modis', mod);
    print('ndvi', ndvi);
    
    print('property of ndvi object', ndvi);
    
    // create a list of the band names 
    var daylist = [];
    for (var i = 1; i < 47; ++i) daylist.push('day' + i.toString());
    print(daylist);
    
    var imgList = ndvi.toList(46);
    var imgListAll = ee.Image(imgList.get(0)).rename(daylist[0]);
    
    // add all bands to the image for exporting
    for (i = 1; i < 46; i++) {
      // print('this it the index',i, daylist[i]);
      var t1=ee.Image(imgList.get(i)).rename(daylist[i]);
      var imgListAll = imgListAll.addBands(t1);
       }

    var modisProjection = ee.Image(mod.first()).projection();
    print(modisProjection);    
    
    print('imgListAll',imgListAll);
    // print('One Band tosrting',ee.Image(imgList.get(0)).toString());
  
    // export to epsg 3310 projection
    var exPar = {
            image: imgListAll,
            description: 'modisNDVI',
            crs:'EPSG:3310',
            crsTransform:[231.65635826395825,0,-20015109.353988,0,-231.65635826395834,10007554.676994],
            folder:'modisSub'};
    
    exPar.description=filenameS1;
    exPar.region=sq1; 
    exPar.fileNamePrefix=filenameS1,
    print(exPar.fileNamePrefix);
    print(exPar.region);
    Export.image.toDrive(exPar);
    
    exPar.description=filenameS2;
    exPar.region=sq2; 
    exPar.fileNamePrefix=filenameS2,
    print(exPar.fileNamePrefix);
    print(exPar.region);
    Export.image.toDrive(exPar);
    
    exPar.description=filenameS3;
    exPar.region=sq3; 
    exPar.fileNamePrefix=filenameS3,
    print(exPar.fileNamePrefix);
    print(exPar.region);
    Export.image.toDrive(exPar);
    
    exPar.description=filenameS4;
    exPar.region=sq4; 
    exPar.fileNamePrefix=filenameS4,
    print(exPar.fileNamePrefix);
    print(exPar.region);
    Export.image.toDrive(exPar);
    

    
    var ndvi_palette =
    'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
    '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301';
  
    Map.addLayer(ndvi, {min: -0.1, max: 1.0,bands:['ndvi'], palette: ndvi_palette});
    
    var tempTimeSeries = Chart.image.seriesByRegion(
        ndvi.select(['ndvi']), geometry, ee.Reducer.min())
            .setOptions({
              title: 'NDVI',
              vAxis: {title: 'NDVI'},
              lineWidth: 1,
              pointSize: 4,
              legend:'none',
              series: {
                NDVI: {color: 'FF0000'}, // ndvi
    }});
    print(tempTimeSeries);
    
    Map.addLayer(sq1, {}, "SQ1");
    Map.addLayer(sq2, {color:"CE7E45"}, "SQ2");
    Map.addLayer(sq3, {color:"011301"}, "SQ3");
    Map.addLayer(sq4, {color:"023B01"}, "SQ4");
    };

var dateS = [];
for (var i = 2010; i < 2016; ++i) dateS.push(i.toString()+'-01-01');
var dateE = [];
for (var i = 2010; i < 2016; ++i) dateE.push(i.toString()+'-12-31');
var filenameS1 = [];
for (var i = 2010; i < 2016; ++i) filenameS1.push('mo' + i.toString() + 's1');
var filenameS2 = [];
for (var i = 2010; i < 2016; ++i) filenameS2.push('mo' + i.toString() + 's2');
var filenameS3 = [];
for (var i = 2010; i < 2016; ++i) filenameS3.push('mo' + i.toString() + 's3');
var filenameS4 = [];
for (var i = 2010; i < 2016; ++i) filenameS4.push('mo' + i.toString() + 's4');

print(dateS);
print(dateE);
print(filenameS1);

for (i = 0; i < 8; i++) {
  print(filenameS1[i]);
  exFun(dateS[i], dateE[i], filenameS1[i], filenameS2[i], filenameS3[i], filenameS4[i]);
}
