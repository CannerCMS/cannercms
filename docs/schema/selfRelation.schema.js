/** @jsx builder */

import builder from 'canner-script';
const SelfRelation = () => <array keyName="selfRelation" title="Self Relation"
    uiParams={{
      columns: [{
        title: 'name',
        dataIndex: 'name'
      }]
    }}
  >
  <string keyName="name" title="Name" />
  <relation keyName="toOneSelfRelation" title="selfRelation" relation={{type: 'toOne', to: 'selfRelation'}}
    uiParams={{
      textCol: 'name',
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }]
    }}
    ui="singleSelect"
  />
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
