/** @jsx builder */

import builder from 'canner-script';

export default (
  <root>
    <array keyName="selfRelation" title="Self Relation"
      uiParams={{
        textCol: 'name',
        relationField: 'toOneSelfRelation'
      }}
      ui="tree"
    >
      <string keyName="name" title="Name" />
      <relation ui="singleSelectTree" keyName="toOneSelfRelation" title="selfRelation" relation={{type: 'toOne', to: 'selfRelation'}}
        uiParams={{
          textCol: 'name',
          columns: [{
            title: 'Name',
            dataIndex: 'name'
          }]
        }}
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
    </array>
  </root>
);
