## NDVImodis
[Google Earth Engine](https://earthengine.google.com/) provides an intuitive UI for querying, investigating, and downloading satellite images(for 
further anlaysis with other tools). It also comes with lots image procesing functions that can be applied in 
research.

In the modisNDVI script, I used Google Engine for visualizing Normalized difference vegetation index (NDVI) time series.
NDVI is one of the variable I used to estimate crop evapotranspiration in California. 

NDVI values range from -1.0 to 1.0. High NDVI value (> 0.6) corresponds to dense healthy vegetation, e.g. 
peak season forests or crops. Moderate NDVI value (0.2-0.5) correponds to sparse vegetation, e.g. grassland 
or crop. Low NDVI value indicates either the land cover was barren/artificial cover/water/snow or the area 
was covered by cloud at the time the scene was acquired. 
- [reference: usgs phenology website](http://phenology.cr.usgs.gov/ndvi_foundation.php)

The results were clipped to California boundary using boundary layer download from State website, which was reproejcted to match the 
projection setting of google earth engine, and converted to KML file for uploading using open source function [ogr2ogr](http://www.gdal.org/ogr2ogr.html).
