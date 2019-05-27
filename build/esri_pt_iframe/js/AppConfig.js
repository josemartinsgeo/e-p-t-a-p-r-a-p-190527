define([
  "dijit/Dialog"
], function (Dialog) {

  let hasSigConfig = sigConfig && typeof sigConfig === "object";
  let hasEnvironment = hasSigConfig && sigConfig.environment;
  let hasHost = hasEnvironment && sigConfig.environment.host;
  let hasProxy = hasEnvironment && sigConfig.environment.proxy;
  let hasGeometryService = hasEnvironment && sigConfig.geometryService;
  let hasMap = hasSigConfig && sigConfig.map;
  let hasBasemap = hasMap && sigConfig.map.basemap && sigConfig.map.basemap;
  let hasBasemapUrl = hasMap && hasBasemap && sigConfig.map.basemap && sigConfig.map.basemap.url;
  let hasBasemapTitle = hasMap && hasBasemap && sigConfig.map.basemap && sigConfig.map.basemap.title;
  let hasServiceLayers = hasMap && sigConfig.map.serviceLayers;
  let hasFeatureLayers = hasMap && sigConfig.map.featureLayers;
  let hasPrintTask = hasSigConfig && sigConfig.print && sigConfig.print.task && sigConfig.print.task.url;
  let hasZoom = hasSigConfig && sigConfig.zoom;
  let hasSpatialReference = hasMap && sigConfig.map.spatialReference;

  let _minLevel = hasZoom && hasZoom.minLevel ||  0;
  let _maxLevel = hasZoom && hasZoom.maxLevel || 24;
  let _initialScale = hasZoom && hasZoom.initialScale || 591657527.591555;
  let _initialResolution = hasZoom && hasZoom.initialResolution || 156543.033928;
  let _initialLevel = hasZoom && hasZoom.initialLevel || 0;

  let _createLods = (maxLevel, initialResolution, initialScale, from, to ) => {
    maxLevel = maxLevel || 24;
    from = from || 0;
    to = to || maxLevel;
    initialResolution = initialResolution || 156543.033928;
    initialScale = initialScale || 591657527.591555;
    let currentResolution = initialResolution;
    let currentScale = initialScale;
    return [...Array(maxLevel).keys()].map(index => {
        currentResolution = index === 0 ? initialResolution : currentResolution / 2;
        currentScale = index === 0 ? initialScale : currentScale / 2;
        return {
          level: index,
          resolution: currentResolution,
          scale: currentScale
        }
    })
    .slice(from, to)
    .map((lod, index) => {
      lod.level = index;
      return lod;
    })
  }

  return {
    _host: _host = hasHost || "https://arcgis.aguasdoporto.pt:6443",
    _proxy: _proxy = hasProxy || "https://developers.arcgis.com/proxy/",
    _geometryService: hasGeometryService || "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
    _mapConfig: {
      _basemap: {
        _url: `${_host}${hasBasemapUrl}`,
        _title: hasBasemapTitle,
        _thumbnail: `${_host}${hasBasemapUrl}/info/thumbnail`
      },
      _serviceLayers: hasServiceLayers && hasServiceLayers.map(sl => ({ _url: `${_host}${sl.url}`, _index: sl.index })),
      _featureLayers: hasFeatureLayers && hasFeatureLayers.map(fl => ({ _url: `${_host}${fl.url}`, _index: fl.index })),
      _spatialReference: {
        _wkid: hasSpatialReference && hasSpatialReference.wkid || "102100"
      }
    },
    _print: {
       _task: {
        _url: `${_host}${hasPrintTask}`
      }
    },
    _zoom: {
      _minLevel: _minLevel,
      _maxLevel: _maxLevel,
      _initialScale: _initialScale,
      _initialResolution: _initialResolution,
      _initialLevel: _initialLevel,
      _lods: _createLods(_maxLevel, _initialResolution, _initialScale, _minLevel, _maxLevel)
    }
  }
});
