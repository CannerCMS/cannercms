/** @jsx builder */

import builder from 'canner-script';
const SelfRelation = () => <array keyName="selfRelation" title="Self Relation"
    uiParams={{
      textCol: 'name',
      relationField: 'toOneSelfRelation'
    }}
    ui="tableRoute"
  >
  <toolbar async>
    <pagination />
  </toolbar>
  <string keyName="name" title="Name" />
  <relation ui="singleSelect" keyName="toOneSelfRelation" title="selfRelation" relation={{type: 'toOne', to: 'selfRelation'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
  >
    <toolbar async>
      <pagination />
    </toolbar>
  </relation>
  <relation ui="multipleSelect" keyName="toManySelfRelation" title="toManySelfRelation" relation={{type: 'toMany', to: 'selfRelation'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
  />
</array>;

export default SelfRelation;
