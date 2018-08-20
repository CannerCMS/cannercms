/** @jsx builder */

import builder, {Condition} from 'canner-script';

export default (
  <root>
    <array keyName="condition" title="Condition" ui="tableRoute">
      <string keyName="controlField" ui="select"
        uiParams={{
          options: [{
            text: 'unmatch',
            value: 'unmatch'
          }, {
            text: 'match',
            value: 'match'
          }]
        }}
      />
      <Condition match={data => data.controlField === 'match'}>
        <number keyName="hiddenField" title="Hidden Field"/>
      </Condition>
      <Condition match={data => data.controlField === 'match'} defaultMode="disabled">
        <number keyName="disabledField" title="Disabled Field "/>
      </Condition>

      <array keyName="nested" >
        <string keyName="controlField" ui="select"
          uiParams={{
            options: [{
              text: 'unmatch',
              value: 'unmatch'
            }, {
              text: 'match',
              value: 'match'
            }]
          }}
        />
        <Condition match={data => data.controlField === 'match'}>
          <number keyName="hiddenField" />
        </Condition>
      </array>


      <Condition match={(data, operator) => operator === 'create'}>
        <string keyName="showOnCreate" title="Show on create"/>
      </Condition>
      <Condition match={(data, operator) => operator === 'update'}>
        <string keyName="showOnUpdate" title="Show on update"/>
      </Condition>
    </array>
  </root>
);