import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import { NgForOf, NgIf } from '@angular/common';
import { GetMapService } from '../../services/get-map/get-map.service';
import { FormsModule } from '@angular/forms';
import { MapRequestResponse } from '../../services/interfaces/network-interfaces';
import {NodesToTraverseService} from '../../services/nodes-to-traverse/nodes-to-traverse.service';

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  imports: [NgForOf, NgIf, FormsModule],
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {
  //Inject services
  getMapService = inject(GetMapService);
  requestNodesToTraverseService = inject(NodesToTraverseService)

  nodeDictionary: MapRequestResponse = this.getMapService.fetchMapFromStorage();


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

  @ViewChild('map', { static: false }) svgElement!: ElementRef;
  panZoomInstance: any;



  //NG on INT
  ngOnInit() {
    // Make request upon open for nodes from back n cache
    this.getMapService.requestMapNodes();

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

  findDirectRoute() {
    //clear any existing paths
    this.paths = [];

    //check if start and end are valid impossible not to be but just a check
    if (!this.selectedName1 || !this.selectedName2) {
      console.error('Please select both start and end locations');
      return;
    }


    //this finds the id number
    const startNodeKey = this.findNodeKeyByName(this.selectedName1);
    const endNodeKey = this.findNodeKeyByName(this.selectedName2);

    //this line can be replaced to call my other funciton that makes more than one path
    const startNode = this.nodeDictionary[Number(startNodeKey)];
    const endNode = this.nodeDictionary[Number(endNodeKey)];

    //create a path between start and end
    this.paths = [{
      d: `M${startNode.x + this.bufferX},${startNode.y + this.bufferY} L${endNode.x + this.bufferX},${endNode.y + this.bufferY}`
      }];
    ///


    //console.log('Path created:', this.paths);

    //reset pan and zoom
    if (this.panZoomInstance) {
      setTimeout(() => {
        this.panZoomInstance.updateBBox();
        this.panZoomInstance.fit();
        this.panZoomInstance.center();
      }, 100);
    }
  }

  //making paths function for the future, need to replace dictionary call with backend node call
  generatePaths() {
    this.paths = [];

    const nodeKeys = [...this.nodeKeys].sort((a, b) => a - b); // Sort numerically

    for (let i = 0; i < nodeKeys.length - 1; i++) {
      const start = this.nodeDictionary[Number(nodeKeys[i])];
      const end = this.nodeDictionary[Number(nodeKeys[i + 1])];

      this.paths.push({
        d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}`
      });
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
    const tag = this.tagFilter.toLowerCase();
    const allTags = new Set<string>();

    for (const node of Object.values(this.nodeDictionary)) {
      node.tags?.forEach((t: string) => allTags.add(t));
    }

    const allTagArray = Array.from(allTags);
    this.filteredTagGroups = tag
      ? allTagArray.filter(t => t.toLowerCase().includes(tag))
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
      //uncomment if you want it to select the name too
      //this.selectedName2 = matchedNode.name;
    }
  }
  clear(){
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
  }

  // Implement langs function call here
  requestNodesToTraverse() {
    this.requestNodesToTraverseService.requestTraversalGraph(1, '5', false, '/traverse', () => {
      const data = this.requestNodesToTraverseService.fetchNodesToTraverse();
      console.log("RAH");
    });
  }
}

