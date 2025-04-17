import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import { NgForOf, NgIf } from '@angular/common';
import { GetMapService } from '../../services/get-map/get-map.service';
import { FormsModule } from '@angular/forms';
import {MapRequestResponse, NodesToTraverse} from '../../services/interfaces/network-interfaces';
import {NodesToTraverseService} from '../../services/nodes-to-traverse/nodes-to-traverse.service';
import {GeolocatorService} from '../../services/geolocator/geolocator.service';

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  imports: [NgForOf, NgIf, FormsModule],
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {
  //Inject services

  geoService = inject(GeolocatorService);
  getMapService = inject(GetMapService);
  requestNodesToTraverseService = inject(NodesToTraverseService)

  nodeDictionary: MapRequestResponse = {};

  //all of these defenitions below are fairly self explanitory
  nodeKeys: number[] = [];
  bufferX = -130;
  bufferY = 1;
  paths: { d: string }[] = [];
  groupOptions: string[] = [];
  groupedNames: { [key: string]: string[] } = {};
  selectedGroup1: string = '';
  selectedGroup2: string = '';
  selectedName1: string = '';
  selectedName2: string = '';
  tagFilter = '';
  filteredTagGroups: string[] = [];
  expandedGroups: { [key: string]: boolean } = {};
  currentLong = 0;
  currentLat = 0;
  watchId: number | null = null;
  @ViewChild('map', {static: false}) svgElement!: ElementRef;
  panZoomInstance: any;


  //NG on INT
  ngOnInit() {

    // Make request upon open for nodes from back n cache
    this.getMapService.requestMapNodes();
    this.nodeDictionary = this.getMapService.fetchMapFromStorage();
    this.startWatchingGPS();

    this.getNodeFirstFromGeoLocation();
    //For populating all of the groupnames in the first drop down box
    const groups = new Set<string>();

    //pulls all nodes from the node dictionary that arent in path group
    for (const node of Object.values(this.nodeDictionary)) {
      if (node.group !== 'Path') {
        groups.add(node.group);
      }
    }

    this.groupOptions = Array.from(groups);

    this.groupedNames = {};

    for (const node of Object.values(this.nodeDictionary)) {
      if (node.group !== 'Path') {
        if (!this.groupedNames[node.group]) {
          this.groupedNames[node.group] = [];
        }

        this.groupedNames[node.group].push(node.name);
      }
    }
    /////


    //populate the nodeKeys array from the dictionary (ensure keys are numbers)
    this.nodeKeys = Object.keys(this.nodeDictionary).map(key => parseInt(key, 10));

  }

  ngAfterViewInit() {
    //zomom and pan functionality
    const svg = document.getElementById('map') as unknown as SVGSVGElement;
    if (svg) {
      this.panZoomInstance = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 1,
        maxZoom: 3,
        zoomScaleSensitivity: 0.2
      });

      //get image size
      const boundingBox = svg.getBoundingClientRect();
      const imageWidth = boundingBox.width;
      const imageHeight = boundingBox.height;

      const beforePan = (oldPan: any, newPan: { x: number; y: number; }) => {
        const zoom = this.panZoomInstance.getZoom();

        const leftLimit = -imageWidth * (zoom - 1);
        const rightLimit = imageWidth * (zoom - 1);
        const topLimit = -imageHeight * (zoom - 1);
        const bottomLimit = imageHeight * (zoom - 1);

        return {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
        };
      };

      //set defualt pan zoom
      this.panZoomInstance.setBeforePan(beforePan);

      //this so it quieres every tag to start
      this.filterByTag();
    }
  }

  //lukas is me and me is have to fix and explain i little zawhg
  generatePaths() {
    this.paths = [];

    const startNodeKey = this.findNodeKeyByName(this.selectedName1);
    let endNodeKey;

    if (this.selectedName2 === "") {
      endNodeKey = this.selectedGroup2;
    } else {
      endNodeKey = this.findNodeKeyByName(this.selectedName2);
    }

    this.requestNodesToTraverseService.requestTraversalGraph(
      Number(startNodeKey),
      String(endNodeKey),
      this.selectedName2 === "",
      '/traverse',
      () => {

        const data = this.requestNodesToTraverseService.fetchNodesToTraverse() as NodesToTraverse;

        if (data) {
          for (let i = 0; i < data.ids.length - 1; i++) {
            const currentNodeId = data.ids[i];
            const nextNodeId = data.ids[i + 1];

            const start = this.nodeDictionary[Number(currentNodeId)];
            const end = this.nodeDictionary[Number(nextNodeId)];

            if (start && end) {
              this.paths.push({
                d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}`
              });
            }
          }
        } else {
          console.log("No Traversable Nodes Found")
        }

      }
    );

    if (this.panZoomInstance) {
      setTimeout(() => {
        this.panZoomInstance.updateBBox();
        this.panZoomInstance.fit();
        this.panZoomInstance.center();
      }, 100);
    }
  }

  //it does what the name says, gives the id number fir the naem
  findNodeKeyByName(name: string): string | null {
    for (const [key, node] of Object.entries(this.nodeDictionary)) {
      if (node.name === name) {
        return key;
      }
    }
    return null;
  }

  //also does what it says, but this is for the filter boxes, tag being like mac book and stufd
  filterByTag() {
    const tag = this.tagFilter?.toLowerCase() || '';
    const allTags = new Set<string>();

    for (const node of Object.values(this.nodeDictionary)) {
      if (node && node.tags) {
        node.tags.forEach((t: string) => {
          if (t) allTags.add(t);
        });
      }
    }

    const allTagArray = Array.from(allTags);
    this.filteredTagGroups = tag
      ? allTagArray.filter(t => t && t.toLowerCase().includes(tag))
      : allTagArray;
  }

//for expanding/collapsing groups
  toggleGroup(tag: string) {
    this.expandedGroups[tag] = !this.expandedGroups[tag];
  }

//returns node names under a tag group
  getNodesByTag(tag: string): string[] {
    return Object.values(this.nodeDictionary)
      .filter(node => node.tags?.includes(tag))
      .map(node => node.name);
  }

//returns distinct kinds for a node name
  getNodeKinds(name: string): number[] {
    const kinds = new Set<number>();
    for (const node of Object.values(this.nodeDictionary)) {
      if (node.name === name) {
        kinds.add(node.kind);
      }
    }
    return Array.from(kinds);
  }

//returns the id of node of a given name
  getNodeTags(name: string): string[] {
    const node = Object.values(this.nodeDictionary).find(n => n.name === name);
    return node?.tags ?? [];
  }

  getGroupByNode(name: string): string[] {
    const node = Object.values(this.nodeDictionary).find(n => n.name === name);
    return node?.group ?? [];
  }

  //this will assign boxes to be the chosen node, it just looks it up based on the name
  selectNodeByName(name: string) {
    const matchedNode = Object.values(this.nodeDictionary).find(node => node.name === name);
    if (matchedNode) {
      this.selectedGroup2 = matchedNode.group;
      this.selectedName2 = "";
      //uncomment if you want it to select the name too
      //this.selectedName2 = matchedNode.name;
    }
  }

  clear() {
    this.selectedName1 = "";
    this.selectedName2 = "";
    this.selectedGroup1 = "";
    this.selectedGroup2 = "";
    this.paths = [];
  }

  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }


  getNodeFirstFromGeoLocation() {
    this.geoService.fetchGPSLocation()
      .then((location) => {
        //console.log("GPS Location:", location);

        //starting with infinity because we want every distance to be smaller initally
        let closestDistance = Infinity;
        let nodeClosest = this.nodeDictionary[0];

        for(let i = 0; i < this.nodeKeys.length; i++) {
          const nodeNew = this.nodeDictionary[(this.nodeKeys)[i]];

          if (!nodeNew.is_path) {
            //euclidan disatnce formula or whatever its called
            const distance = Math.sqrt(
              Math.pow(location.latitude - nodeNew.x, 2) +
              Math.pow(location.longitude - nodeNew.y, 2)
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              nodeClosest = nodeNew;
            }
          }
        }

        this.selectedName1 = nodeClosest.name;
        this.selectedGroup1 = nodeClosest.group;
        //console.log(nodeClosest);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }
  //me be watchibg the gps
  startWatchingGPS() {
    this.watchId = this.geoService.watchPosition(
      (location) => {
        console.log(location);
        this.currentLat = location.latitude;
        this.currentLong = location.longitude;
      },
      (error) => {
        console.error("GPS Error:", error);
      }
    );
  }

}

