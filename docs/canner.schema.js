/** @jsx builder */

import 'babel-register';
import builder, {Block, Layout} from '@canner/canner-script';
import Strings from './schema/string.schema';
import Numbers from './schema/number.schema';
import Booleans from './schema/boolean.schema';
import Objects from './schema/object.schema';
import Arrays from './schema/array.schema';

const Tabs = ({attributes, children}) => <Layout name="Tabs" {...attributes}>{children}</Layout>
export default <root>
    <object keyName="overview" title="Components Overview">
    <Block title="All Types">
      <Tabs>
        <Strings keyName="string" title="String Type" />
        <Booleans keyName="boolean" title="Boolean Type"/>
        <Numbers keyName="number" title="Number Types" />
        {/* <Arrays keyName="array" title="Array Type" /> */}
        <Objects keyName="object" title="Object type" />
      </Tabs>
    </Block>
  </object>
</root>
