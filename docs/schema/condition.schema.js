/** @jsx builder */

import builder, {Condition} from 'canner-script';

const a = () => (
  <array keyName="condition" title="Condition">
    <string keyName="field1" ui="select"
      uiParams={{
        options: [{
          text: 'hidden',
          value: 'hidden'
        }, {
          text: 'normal',
          value: 'normal'
        }]
      }}
    />
    <Condition match={data => data.field1 === 'normal'}>
      <number keyName="field2" />
    </Condition>
    <string keyName="field3" ui="select"
      uiParams={{
        options: [{
          text: 'disabled',
          value: 'disabled'
        }, {
          text: 'normal',
          value: 'normal'
        }]
      }}
    />
    <Condition match={data => data.field3 === 'normal'} defaultMode="disabled">
      <number keyName="field4" />
    </Condition>
    <array keyName="field5" >
      <string keyName="field6" ui="select"
        uiParams={{
          options: [{
            text: 'hidden',
            value: 'hidden'
          }, {
            text: 'normal',
            value: 'normal'
          }]
        }}
      />
      <Condition match={data => data.field6 === 'normal'}>
        <number keyName="field7" />
      </Condition>
    </array>
    <Condition match={(data, operator) => operator === 'create'}>
      <string keyName="showOnCreate" title="show on create"/>
    </Condition>
    <Condition match={(data, operator) => operator === 'update'}>
      <string keyName="showOnUpdate" title="show on update"/>
    </Condition>
  </array>
)
export default a;