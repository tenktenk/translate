import { Component, OnInit } from '@angular/core';
import { Router, RouterState } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { CommitNbService } from '../commitnb.service'

// insertion point for per struct import code
import { CountrySpecService } from '../countryspec.service'
import { getCountrySpecUniqueID } from '../front-repo.service'
import { CountryWithBodiesService } from '../countrywithbodies.service'
import { getCountryWithBodiesUniqueID } from '../front-repo.service'
import { TranslationService } from '../translation.service'
import { getTranslationUniqueID } from '../front-repo.service'

/**
 * Types of a GongNode / GongFlatNode
 */
export enum GongNodeType {
  STRUCT = "STRUCT",
  INSTANCE = "INSTANCE",
  ONE__ZERO_ONE_ASSOCIATION = 'ONE__ZERO_ONE_ASSOCIATION',
  ONE__ZERO_MANY_ASSOCIATION = 'ONE__ZERO_MANY_ASSOCIATION',
}

/**
 * GongNode is the "data" node
 */
interface GongNode {
  name: string; // if STRUCT, the name of the struct, if INSTANCE the name of the instance
  children: GongNode[];
  type: GongNodeType;
  structName: string;
  associationField: string;
  associatedStructName: string;
  id: number;
  uniqueIdPerStack: number;
}


/** 
 * GongFlatNode is the dynamic visual node with expandable and level information
 * */
interface GongFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: GongNodeType;
  structName: string;
  associationField: string;
  associatedStructName: string;
  id: number;
  uniqueIdPerStack: number;
}


@Component({
  selector: 'app-translate-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  /**
  * _transformer generated a displayed node from a data node
  *
  * @param node input data noe
  * @param level input level
  *
  * @returns an ExampleFlatNode
  */
  private _transformer = (node: GongNode, level: number) => {
    return {

      /**
      * in javascript, The !! ensures the resulting type is a boolean (true or false).
      *
      * !!node.children will evaluate to true is the variable is defined
      */
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      structName: node.structName,
      associationField: node.associationField,
      associatedStructName: node.associatedStructName,
      id: node.id,
      uniqueIdPerStack: node.uniqueIdPerStack,
    }
  }

  /**
   * treeControl is passed as the paramter treeControl in the "mat-tree" selector
   *
   * Flat tree control. Able to expand/collapse a subtree recursively for flattened tree.
   *
   * Construct with flat tree data node functions getLevel and isExpandable.
  constructor(
    getLevel: (dataNode: T) => number,
    isExpandable: (dataNode: T) => boolean, 
    options?: FlatTreeControlOptions<T, K> | undefined);
   */
  treeControl = new FlatTreeControl<GongFlatNode>(
    node => node.level,
    node => node.expandable
  );

  /**
   * from mat-tree documentation
   *
   * Tree flattener to convert a normal type of node to node with children & level information.
   */
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  /**
   * data is the other paramter to the "mat-tree" selector
   * 
   * strangely, the dataSource declaration has to follow the treeFlattener declaration
   */
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * hasChild is used by the selector for expandable nodes
   * 
   *  <mat-tree-node *matTreeNodeDef="let node;when: hasChild" matTreeNodePadding>
   * 
   * @param _ 
   * @param node 
   */
  hasChild = (_: number, node: GongFlatNode) => node.expandable;

  // front repo
  frontRepo: FrontRepo = new (FrontRepo)
  commitNb: number = 0

  // "data" tree that is constructed during NgInit and is passed to the mat-tree component
  gongNodeTree = new Array<GongNode>();

  constructor(
    private router: Router,
    private frontRepoService: FrontRepoService,
    private commitNbService: CommitNbService,

    // insertion point for per struct service declaration
    private countryspecService: CountrySpecService,
    private countrywithbodiesService: CountryWithBodiesService,
    private translationService: TranslationService,
  ) { }

  ngOnInit(): void {
    this.refresh()

    // insertion point for per struct observable for refresh trigger
    // observable for changes in structs
    this.countryspecService.CountrySpecServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.countrywithbodiesService.CountryWithBodiesServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.translationService.TranslationServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
  }

  refresh(): void {
    this.frontRepoService.pull().subscribe(frontRepo => {
      this.frontRepo = frontRepo

      // use of a Gödel number to uniquely identfy nodes : 2 * node.id + 3 * node.level
      let memoryOfExpandedNodes = new Map<number, boolean>()
      let nonInstanceNodeId = 1

      this.treeControl.dataNodes?.forEach(
        node => {
          if (this.treeControl.isExpanded(node)) {
            memoryOfExpandedNodes.set(node.uniqueIdPerStack, true)
          } else {
            memoryOfExpandedNodes.set(node.uniqueIdPerStack, false)
          }
        }
      )

      // reset the gong node tree
      this.gongNodeTree = new Array<GongNode>();
      
      // insertion point for per struct tree construction
      /**
      * fill up the CountrySpec part of the mat tree
      */
      let countryspecGongNodeStruct: GongNode = {
        name: "CountrySpec",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "CountrySpec",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(countryspecGongNodeStruct)

      this.frontRepo.CountrySpecs_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.CountrySpecs_array.forEach(
        countryspecDB => {
          let countryspecGongNodeInstance: GongNode = {
            name: countryspecDB.Name,
            type: GongNodeType.INSTANCE,
            id: countryspecDB.ID,
            uniqueIdPerStack: getCountrySpecUniqueID(countryspecDB.ID),
            structName: "CountrySpec",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          countryspecGongNodeStruct.children!.push(countryspecGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the CountryWithBodies part of the mat tree
      */
      let countrywithbodiesGongNodeStruct: GongNode = {
        name: "CountryWithBodies",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "CountryWithBodies",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(countrywithbodiesGongNodeStruct)

      this.frontRepo.CountryWithBodiess_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.CountryWithBodiess_array.forEach(
        countrywithbodiesDB => {
          let countrywithbodiesGongNodeInstance: GongNode = {
            name: countrywithbodiesDB.Name,
            type: GongNodeType.INSTANCE,
            id: countrywithbodiesDB.ID,
            uniqueIdPerStack: getCountryWithBodiesUniqueID(countrywithbodiesDB.ID),
            structName: "CountryWithBodies",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          countrywithbodiesGongNodeStruct.children!.push(countrywithbodiesGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the Translation part of the mat tree
      */
      let translationGongNodeStruct: GongNode = {
        name: "Translation",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Translation",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(translationGongNodeStruct)

      this.frontRepo.Translations_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Translations_array.forEach(
        translationDB => {
          let translationGongNodeInstance: GongNode = {
            name: translationDB.Name,
            type: GongNodeType.INSTANCE,
            id: translationDB.ID,
            uniqueIdPerStack: getTranslationUniqueID(translationDB.ID),
            structName: "Translation",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          translationGongNodeStruct.children!.push(translationGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association SourceCountryWithBodies
          */
          let SourceCountryWithBodiesGongNodeAssociation: GongNode = {
            name: "(CountryWithBodies) SourceCountryWithBodies",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: translationDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "Translation",
            associationField: "SourceCountryWithBodies",
            associatedStructName: "CountryWithBodies",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          translationGongNodeInstance.children!.push(SourceCountryWithBodiesGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation SourceCountryWithBodies
            */
          if (translationDB.SourceCountryWithBodies != undefined) {
            let translationGongNodeInstance_SourceCountryWithBodies: GongNode = {
              name: translationDB.SourceCountryWithBodies.Name,
              type: GongNodeType.INSTANCE,
              id: translationDB.SourceCountryWithBodies.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getTranslationUniqueID(translationDB.ID)
                + 5 * getCountryWithBodiesUniqueID(translationDB.SourceCountryWithBodies.ID),
              structName: "CountryWithBodies",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            SourceCountryWithBodiesGongNodeAssociation.children.push(translationGongNodeInstance_SourceCountryWithBodies)
          }

          /**
          * let append a node for the association TargetCountryWithBodies
          */
          let TargetCountryWithBodiesGongNodeAssociation: GongNode = {
            name: "(CountryWithBodies) TargetCountryWithBodies",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: translationDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "Translation",
            associationField: "TargetCountryWithBodies",
            associatedStructName: "CountryWithBodies",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          translationGongNodeInstance.children!.push(TargetCountryWithBodiesGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation TargetCountryWithBodies
            */
          if (translationDB.TargetCountryWithBodies != undefined) {
            let translationGongNodeInstance_TargetCountryWithBodies: GongNode = {
              name: translationDB.TargetCountryWithBodies.Name,
              type: GongNodeType.INSTANCE,
              id: translationDB.TargetCountryWithBodies.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getTranslationUniqueID(translationDB.ID)
                + 5 * getCountryWithBodiesUniqueID(translationDB.TargetCountryWithBodies.ID),
              structName: "CountryWithBodies",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            TargetCountryWithBodiesGongNodeAssociation.children.push(translationGongNodeInstance_TargetCountryWithBodies)
          }

        }
      )


      this.dataSource.data = this.gongNodeTree

      // expand nodes that were exapanded before
      this.treeControl.dataNodes?.forEach(
        node => {
          if (memoryOfExpandedNodes.get(node.uniqueIdPerStack)) {
            this.treeControl.expand(node)
          }
        }
      )
    });

    // fetch the number of commits
    this.commitNbService.getCommitNb().subscribe(
      commitNb => {
        this.commitNb = commitNb
      }
    )
  }

  /**
   * 
   * @param path for the outlet selection
   */
  setTableRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_tenktenk_translate_go_table: ["github_com_tenktenk_translate_go-" + path]
      }
    }]);
  }

  /**
   * 
   * @param path for the outlet selection
   */
  setTableRouterOutletFromTree(path: string, type: GongNodeType, structName: string, id: number) {

    if (type == GongNodeType.STRUCT) {
      this.router.navigate([{
        outlets: {
          github_com_tenktenk_translate_go_table: ["github_com_tenktenk_translate_go-" + path.toLowerCase()]
        }
      }]);
    }

    if (type == GongNodeType.INSTANCE) {
      this.router.navigate([{
        outlets: {
          github_com_tenktenk_translate_go_presentation: ["github_com_tenktenk_translate_go-" + structName.toLowerCase() + "-presentation", id]
        }
      }]);
    }
  }

  setEditorRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_tenktenk_translate_go_editor: ["github_com_tenktenk_translate_go-" + path.toLowerCase()]
      }
    }]);
  }

  setEditorSpecialRouterOutlet(node: GongFlatNode) {
    this.router.navigate([{
      outlets: {
        github_com_tenktenk_translate_go_editor: ["github_com_tenktenk_translate_go-" + node.associatedStructName.toLowerCase() + "-adder", node.id, node.structName, node.associationField]
      }
    }]);
  }
}
